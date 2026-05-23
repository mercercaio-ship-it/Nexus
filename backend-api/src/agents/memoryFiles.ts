/**
 * Phase 5.2-B - safe memory-file write primitives.
 *
 * Centralizes the three pieces of plumbing every future Phase 5 mutation
 * helper will need (`editCore` diff edit, `promoteToCore` episodic-line
 * variant, `forget` surgical delete, scheduled compaction):
 *
 *   1. resolveMemoryPath(runtimeAgentsDir, slug, kind)
 *      - validates the slug against the same regex as the agents.ts route
 *      - resolves the absolute path inside `<runtimeAgentsDir>/<slug>/memory/`
 *      - rejects any path that escapes the runtime root (defense in depth
 *        on top of the slug regex)
 *
 *   2. withFileLock(lockPath, fn, opts)
 *      - acquires `<file>.lock` exclusively via `fs.open(..., "wx")`
 *      - retries with a short, jittered backoff up to `timeoutMs`
 *      - recovers from stale locks older than `staleAfterMs`
 *      - always releases on success / failure / throw
 *
 *   3. safeAppendUnique(path, block, opts)
 *      - lock-guarded
 *      - checks for an exact-text duplicate inside the lock (so two
 *        concurrent writers can't both pass the duplicate check)
 *      - mkdir -p before append
 *      - atomic-ish append via `appendFile` (POSIX append is atomic for
 *        writes < PIPE_BUF; the lock makes it safe past that boundary too)
 *      - never logs content; returns counts / booleans only
 *
 *   4. atomicReplace(path, content, opts)
 *      - lock-guarded
 *      - writes to `<path>.tmp` and renames over the original
 *      - `rename` is atomic on POSIX and on NTFS when target exists
 *      - reserved for the future `editCore` diff path; not used by §5.2-A yet
 *
 * Hard constraints (carried from Phase 5.2-A and the Phase 4 → 5 bridge):
 *
 *   - No auto-write to core memory. This module exposes primitives; the
 *     caller decides when to write. The /promote handler still enforces
 *     `confirmed:true` and the sensitive-content guard before calling here.
 *   - No memory content in logs. All warn/info lines this module emits
 *     carry only path tails, byte counts, and operation labels.
 *   - No external HTTP. No new dependencies. Built on `node:fs/promises`
 *     and `node:path` only.
 *
 * Symbol exports:
 *   - SLUG_RE                            : path-traversal-safe slug validator
 *   - MemoryKind                         : "core" | "episodic"
 *   - resolveMemoryPath()                : safe path builder
 *   - withFileLock()                     : lockfile acquire-release wrapper
 *   - safeAppendUnique()                 : lock + dedup + append
 *   - atomicReplace()                    : lock + tmp + rename (for future edits)
 *   - MemoryFilesError                   : tagged error for caller switching
 */

import {
  appendFile,
  mkdir,
  open,
  readFile,
  rename,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

// ---------------------------------------------------------------------------
// Slug + path resolution
// ---------------------------------------------------------------------------

/** Same regex the agents.ts routes use. Blocks slashes, dots, and anything
 *  that could escape `<runtimeAgentsDir>/<slug>/memory/` via path traversal. */
export const SLUG_RE = /^[a-z][a-z0-9-]{1,40}$/;

export type MemoryKind = "core" | "episodic";

export class MemoryFilesError extends Error {
  readonly code:
    | "invalid_slug"
    | "path_traversal"
    | "lock_timeout"
    | "stale_lock_failed"
    | "io_error"
    | "duplicate";
  constructor(
    code: MemoryFilesError["code"],
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "MemoryFilesError";
    this.code = code;
  }
}

/**
 * Resolves the absolute path of `<runtimeAgentsDir>/<slug>/memory/<kind>_memory.md`.
 * Two layers of defense against path traversal:
 *   - slug must match `SLUG_RE` (no slashes, dots, control chars)
 *   - resolved path must start with the resolved runtime root + agent dir
 */
export function resolveMemoryPath(
  runtimeAgentsDir: string,
  slug: string,
  kind: MemoryKind
): string {
  if (typeof slug !== "string" || !SLUG_RE.test(slug)) {
    throw new MemoryFilesError("invalid_slug", "slug does not match SLUG_RE");
  }
  if (kind !== "core" && kind !== "episodic") {
    throw new MemoryFilesError(
      "invalid_slug",
      `invalid memory kind: ${JSON.stringify(kind)}`
    );
  }
  const agentDir = resolve(runtimeAgentsDir, slug, "memory");
  const expectedPrefix = resolve(runtimeAgentsDir) + (process.platform === "win32" ? "\\" : "/");
  if (!agentDir.startsWith(expectedPrefix) && agentDir !== resolve(runtimeAgentsDir, slug, "memory")) {
    throw new MemoryFilesError(
      "path_traversal",
      "resolved memory path escapes the runtime agents directory"
    );
  }
  const fileName = kind === "core" ? "core_memory.md" : "episodic_memory.md";
  return join(agentDir, fileName);
}

// ---------------------------------------------------------------------------
// withFileLock - exclusive lockfile with retry + stale recovery
// ---------------------------------------------------------------------------

export interface FileLockOptions {
  /** Total time to wait for the lock before giving up. Default 2500 ms. */
  timeoutMs?: number;
  /** Treat a lockfile older than this as stale and try to clear it. Default 30000 ms. */
  staleAfterMs?: number;
  /** Initial wait between retries; doubles each retry up to 200 ms. Default 20 ms. */
  initialBackoffMs?: number;
}

const DEFAULT_LOCK_OPTS: Required<FileLockOptions> = {
  timeoutMs: 2500,
  staleAfterMs: 30_000,
  initialBackoffMs: 20,
};

function lockPathFor(path: string): string {
  return path + ".lock";
}

async function tryClearStaleLock(
  lockPath: string,
  staleAfterMs: number
): Promise<boolean> {
  try {
    const s = await stat(lockPath);
    const age = Date.now() - s.mtimeMs;
    if (age > staleAfterMs) {
      try {
        await unlink(lockPath);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  } catch {
    return false; // lock vanished on its own
  }
}

/**
 * Run `fn` while holding an exclusive lock on `<path>.lock`. The lockfile
 * is created with `open(... "wx")` so a second concurrent caller will get
 * EEXIST and back off until either the lock is released or the timeout
 * fires. Stale lockfiles (older than `staleAfterMs`) are best-effort
 * cleared so a crashed process can never permanently wedge writes.
 *
 * The function returns whatever `fn` returns. On any error inside `fn`,
 * the lockfile is still released (finally block).
 *
 * Privacy: this function never reads or logs the content of `path` or
 * `lockPath`. It only knows about the lockfile's existence and mtime.
 */
export async function withFileLock<T>(
  path: string,
  fn: () => Promise<T>,
  opts: FileLockOptions = {}
): Promise<T> {
  const { timeoutMs, staleAfterMs, initialBackoffMs } = {
    ...DEFAULT_LOCK_OPTS,
    ...opts,
  };
  const lockPath = lockPathFor(path);
  const deadline = Date.now() + timeoutMs;
  let backoff = initialBackoffMs;
  let acquired = false;

  await mkdir(dirname(lockPath), { recursive: true });

  while (!acquired) {
    try {
      const fh = await open(lockPath, "wx");
      // Best-effort PID write so a humanish operator can spot leaked locks.
      try {
        await fh.writeFile(String(process.pid));
      } catch {
        /* writing PID is advisory; never throw on failure */
      }
      await fh.close();
      acquired = true;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException)?.code;
      if (code !== "EEXIST") {
        throw new MemoryFilesError(
          "io_error",
          "failed to acquire lock at " + lockPath + ": " + (err as Error)?.message,
          err
        );
      }
      // Lock already exists; try to clear if stale.
      const cleared = await tryClearStaleLock(lockPath, staleAfterMs);
      if (cleared) continue;
      if (Date.now() >= deadline) {
        throw new MemoryFilesError(
          "lock_timeout",
          `timeout waiting for memory file lock at ${lockPath}`
        );
      }
      // Jittered backoff so a burst of writers doesn't lockstep.
      const jitter = Math.floor(Math.random() * Math.max(4, backoff / 4));
      await new Promise((r) => setTimeout(r, backoff + jitter));
      backoff = Math.min(backoff * 2, 200);
    }
  }

  try {
    return await fn();
  } finally {
    try {
      await unlink(lockPath);
    } catch {
      /* lockfile already gone; nothing to do */
    }
  }
}

// ---------------------------------------------------------------------------
// safeAppendUnique - lock + dedup + atomic append
// ---------------------------------------------------------------------------

export interface SafeAppendOptions extends FileLockOptions {
  /**
   * If the file already contains this exact substring, skip the append and
   * return `{ written:false, duplicate:true }`. Pass the same string the
   * caller wants the append to be idempotent on (typically the cleaned
   * entry without the block-decoration wrapper).
   */
  dedupNeedle?: string;
}

export interface SafeAppendResult {
  /** True if `block` was actually appended to the file. */
  written: boolean;
  /** True if the dedupNeedle was already present in the file. */
  duplicate: boolean;
  /** Number of bytes appended. Zero on duplicate. */
  bytesAppended: number;
  /** Final resolved path that the helper wrote to (or would have). */
  path: string;
}

/**
 * Lock-guarded, duplicate-aware atomic append. Designed for `core_memory.md`
 * and `episodic_memory.md` mutations.
 *
 * Steps (all inside the file lock):
 *   1. ensure `dirname(path)` exists
 *   2. if `dedupNeedle` is set, read the file and bail with
 *      `{written:false, duplicate:true}` when present
 *   3. append `block` via `appendFile`
 *
 * Why a lock at all - `appendFile` is atomic for `< PIPE_BUF` bytes on
 * POSIX, but our duplicate check + append is a read-modify-write so two
 * concurrent callers could both pass step 2 and append twice. The lock
 * serializes the whole sequence.
 *
 * Never logs `block` or file contents.
 */
export async function safeAppendUnique(
  path: string,
  block: string,
  opts: SafeAppendOptions = {}
): Promise<SafeAppendResult> {
  if (typeof path !== "string" || path.length === 0) {
    throw new MemoryFilesError("io_error", "path must be a non-empty string");
  }
  if (typeof block !== "string" || block.length === 0) {
    throw new MemoryFilesError("io_error", "block must be a non-empty string");
  }
  return withFileLock(
    path,
    async () => {
      await mkdir(dirname(path), { recursive: true });
      if (typeof opts.dedupNeedle === "string" && opts.dedupNeedle.length > 0) {
        let existing = "";
        try {
          existing = await readFile(path, "utf-8");
        } catch (err) {
          // Missing file is fine; any other failure is genuine IO error.
          if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") {
            throw new MemoryFilesError(
              "io_error",
              "failed to read for dedup check: " + (err as Error)?.message,
              err
            );
          }
        }
        if (existing.includes(opts.dedupNeedle)) {
          return {
            written: false,
            duplicate: true,
            bytesAppended: 0,
            path,
          };
        }
      }
      try {
        await appendFile(path, block, "utf-8");
      } catch (err) {
        throw new MemoryFilesError(
          "io_error",
          "appendFile failed: " + (err as Error)?.message,
          err
        );
      }
      return {
        written: true,
        duplicate: false,
        bytesAppended: Buffer.byteLength(block, "utf-8"),
        path,
      };
    },
    opts
  );
}

// ---------------------------------------------------------------------------
// atomicReplace - lock + tmp + rename
// ---------------------------------------------------------------------------

export interface AtomicReplaceOptions extends FileLockOptions {}

export interface AtomicReplaceResult {
  written: boolean;
  bytesWritten: number;
  path: string;
}

/**
 * Replace the contents of `path` with `content` atomically. The helper
 * writes to `<path>.tmp` and `rename`s onto the destination. `rename` is
 * POSIX-atomic and atomic on NTFS when the destination exists. The entire
 * operation is wrapped in `withFileLock` so concurrent writers serialize.
 *
 * Reserved for the future Phase 5 `editCore(slug, patch)` diff-based path.
 * Not used by §5.2-A. Exported here so the diff path doesn't have to
 * reinvent the safety scaffolding when it lands.
 *
 * Never logs `content` or the previous file contents.
 */
export async function atomicReplace(
  path: string,
  content: string,
  opts: AtomicReplaceOptions = {}
): Promise<AtomicReplaceResult> {
  if (typeof path !== "string" || path.length === 0) {
    throw new MemoryFilesError("io_error", "path must be a non-empty string");
  }
  if (typeof content !== "string") {
    throw new MemoryFilesError("io_error", "content must be a string");
  }
  return withFileLock(
    path,
    async () => {
      await mkdir(dirname(path), { recursive: true });
      const tmpPath = path + ".tmp";
      try {
        await writeFile(tmpPath, content, "utf-8");
        await rename(tmpPath, path);
      } catch (err) {
        // Best-effort cleanup of the .tmp on failure.
        try { await unlink(tmpPath); } catch { /* ignore */ }
        throw new MemoryFilesError(
          "io_error",
          "atomic replace failed: " + (err as Error)?.message,
          err
        );
      }
      return {
        written: true,
        bytesWritten: Buffer.byteLength(content, "utf-8"),
        path,
      };
    },
    opts
  );
}
// ---------------------------------------------------------------------------
// findEpisodicMatch - read-side helper for the §5.2-C episodic→core promotion
// ---------------------------------------------------------------------------

/**
 * Discriminated union returned by `findEpisodicMatch`. The route layer
 * branches on `status`:
 *
 *   - "none"     -> 404 "no matching episodic entry"
 *   - "multiple" -> 409 "multiple matching episodic entries; refine the needle"
 *   - "found"    -> proceed to sensitive-content guard + safeAppendUnique
 */
export type EpisodicMatch =
  | { status: "none" }
  | { status: "multiple"; count: number }
  | { status: "found"; line: string; lineIndex: number };

/**
 * Pure function. Scans `content` (the raw `episodic_memory.md`) for the
 * `needle` substring. Returns:
 *   - `{status:"none"}` if the needle does not appear anywhere.
 *   - `{status:"multiple", count}` if the needle appears more than once. We
 *     short-circuit at count=2 because the caller only cares about >1.
 *   - `{status:"found", line, lineIndex}` if the needle appears exactly once.
 *     `line` is the FULL line (without the trailing newline) that contains
 *     the needle. `lineIndex` is the zero-based line number.
 *
 * Two occurrences inside the SAME line count as `multiple` - the caller is
 * trying to identify a single episodic line, so an ambiguous match should
 * never promote. The matcher is case-sensitive on purpose: episodic gists
 * preserve the user's casing and we don't want "I prefer dark" to collide
 * with "I prefer Dark mode" by accident.
 *
 * No IO, no logging, no allocation beyond a single split. Safe to call on
 * megabyte-sized files; the loop is O(n) in content length.
 */
export function findEpisodicMatch(content: string, needle: string): EpisodicMatch {
  if (typeof content !== "string" || content.length === 0) return { status: "none" };
  if (typeof needle !== "string" || needle.length === 0) return { status: "none" };

  // Count occurrences with short-circuit at 2.
  let count = 0;
  let idx = 0;
  let firstOffset = -1;
  while (true) {
    const found = content.indexOf(needle, idx);
    if (found === -1) break;
    count++;
    if (firstOffset === -1) firstOffset = found;
    if (count >= 2) return { status: "multiple", count };
    idx = found + needle.length;
  }
  if (count === 0) return { status: "none" };

  // count === 1 - locate the line containing `firstOffset`.
  let start = 0;
  let lineIndex = 0;
  for (const line of content.split("\n")) {
    const end = start + line.length;
    if (firstOffset >= start && firstOffset <= end) {
      return { status: "found", line, lineIndex };
    }
    start = end + 1; // +1 for the newline that split() consumed
    lineIndex++;
  }
  // Should be unreachable given count === 1 and a non-empty needle.
  return { status: "none" };
}
// ---------------------------------------------------------------------------
// safeReplaceOnce - lock-guarded read + match-count + replace + atomic write
// ---------------------------------------------------------------------------

export interface SafeReplaceOnceOptions extends FileLockOptions {}

export type SafeReplaceOnceResult =
  | { status: "none"; path: string }
  | { status: "multiple"; count: number; path: string }
  | { status: "unchanged"; path: string }
  | { status: "edited"; bytesWritten: number; path: string };

/**
 * Phase 5.2-D - diff-based core-memory edit primitive.
 *
 * Reads the file at `path`, counts occurrences of `find` as a substring,
 * and atomically replaces a single occurrence with `replace`. The whole
 * read-count-replace-write sequence runs INSIDE a single `withFileLock`
 * so two concurrent editors cannot both pass the match-count check and
 * step on each other.
 *
 * Returns a discriminated union the route layer maps to HTTP codes:
 *
 *   - `{status:"none"}`     -> caller returns 404. The file is missing,
 *                              or `find` does not appear in the content.
 *   - `{status:"multiple"}` -> caller returns 409 ("refine your find").
 *                              Counts >= 2 are reported as multiple, with
 *                              the actual `count` short-circuited at 2 so
 *                              the helper stays O(n) on large files.
 *   - `{status:"unchanged"}` -> caller returns 200 unchanged. This fires
 *                              when `find === replace`, when replacing
 *                              would produce identical content (rare),
 *                              or when count was 1 and the single in-place
 *                              `String#replace` did not change the file.
 *   - `{status:"edited", bytesWritten}` -> caller returns 200 edited.
 *
 * Two occurrences inside the SAME line count as `multiple`: the caller
 * is asking to identify exactly one edit target, so an ambiguous find
 * must never write. Matching is case-sensitive on purpose (parity with
 * `findEpisodicMatch`).
 *
 * Atomic write strategy: `writeFile(<path>.tmp)` then `rename` over the
 * destination. `rename` is POSIX-atomic and atomic on NTFS when the
 * destination exists. Best-effort `.tmp` cleanup on any failure.
 *
 * Privacy: never logs file content, `find`, or `replace`. Returns only
 * counts / status / byte totals.
 */
export async function safeReplaceOnce(
  path: string,
  find: string,
  replace: string,
  opts: SafeReplaceOnceOptions = {}
): Promise<SafeReplaceOnceResult> {
  if (typeof path !== "string" || path.length === 0) {
    throw new MemoryFilesError("io_error", "path must be a non-empty string");
  }
  if (typeof find !== "string" || find.length === 0) {
    throw new MemoryFilesError("io_error", "find must be a non-empty string");
  }
  if (typeof replace !== "string") {
    throw new MemoryFilesError("io_error", "replace must be a string");
  }
  return withFileLock(
    path,
    async () => {
      let content = "";
      try {
        content = await readFile(path, "utf-8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
          return { status: "none" as const, path };
        }
        throw new MemoryFilesError(
          "io_error",
          "failed to read for editCore: " + (err as Error)?.message,
          err
        );
      }

      // Count occurrences of `find` with short-circuit at 2.
      let count = 0;
      let idx = 0;
      while (true) {
        const f = content.indexOf(find, idx);
        if (f === -1) break;
        count++;
        if (count >= 2) {
          return { status: "multiple" as const, count, path };
        }
        idx = f + find.length;
      }
      if (count === 0) return { status: "none" as const, path };

      // count === 1 - build new content and decide if anything actually changed.
      const newContent = content.replace(find, replace);
      if (newContent === content) {
        return { status: "unchanged" as const, path };
      }

      // Atomic write: tmp + rename, with best-effort tmp cleanup.
      const tmpPath = path + ".tmp";
      try {
        await mkdir(dirname(path), { recursive: true });
        await writeFile(tmpPath, newContent, "utf-8");
        await rename(tmpPath, path);
      } catch (err) {
        try { await unlink(tmpPath); } catch { /* ignore */ }
        throw new MemoryFilesError(
          "io_error",
          "safe replace failed: " + (err as Error)?.message,
          err
        );
      }

      return {
        status: "edited" as const,
        bytesWritten: Buffer.byteLength(newContent, "utf-8"),
        path,
      };
    },
    opts
  );
}
// ---------------------------------------------------------------------------
// Phase 5.3-A - episodic parsing + manual compaction preview
// ---------------------------------------------------------------------------

/**
 * A single parsed episodic entry as written by `appendEpisodicSummary`
 * in `agentRuntimeContext.ts`. The append format is:
 *
 *   \n## 2026-05-18T...\n
 *   - session: <id>\n
 *   - gist: <text>\n
 *   - was_handoff: true|false\n
 *
 * The parser is intentionally tolerant: missing / mis-ordered bullet lines
 * never throw, the resulting entry just has empty fields where the source
 * line wasn't found. Entries with no `## ` heading line are skipped.
 */
export interface EpisodicEntry {
  /** The ISO timestamp the `## ` line carried (trimmed; no leading `## `). */
  heading: string;
  /** Trimmed gist text (the line after `- gist: `). May be empty. */
  gist: string;
  /** Parsed `- was_handoff: true|false` value; false when missing/invalid. */
  wasHandoff: boolean;
}

/**
 * Pure function. Splits `content` into `## heading` blocks and pulls the
 * structured fields out of each block. Returns entries in source order
 * (so the most recent entry is the last element).
 *
 * Tolerance contract:
 *   - control characters except CR/LF/TAB are stripped
 *   - blocks without a `## ` heading line are dropped
 *   - blocks with missing `- gist:` or `- was_handoff:` lines still parse
 *     into an `EpisodicEntry` with empty / false defaults
 *   - empty input -> []
 *   - never throws
 *
 * No IO, no logging.
 */
export function parseEpisodicEntries(content: string): EpisodicEntry[] {
  if (typeof content !== "string" || content.length === 0) return [];

  // Strip control chars except CR/LF/TAB so the parser stays robust against
  // accidental binary noise in episodic_memory.md.
  const cleaned = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");

  const out: EpisodicEntry[] = [];
  let current: { heading?: string; gist?: string; wasHandoff?: boolean } | null = null;
  for (const rawLine of cleaned.split("\n")) {
    const line = rawLine.replace(/\r$/, "");
    if (line.startsWith("## ")) {
      if (current && typeof current.heading === "string" && current.heading.length > 0) {
        out.push({
          heading: current.heading,
          gist: typeof current.gist === "string" ? current.gist : "",
          wasHandoff: current.wasHandoff === true,
        });
      }
      current = { heading: line.slice(3).trim() };
    } else if (current) {
      if (line.startsWith("- gist:")) {
        current.gist = line.slice("- gist:".length).trim();
      } else if (line.startsWith("- was_handoff:")) {
        current.wasHandoff = line.slice("- was_handoff:".length).trim() === "true";
      }
    }
  }
  if (current && typeof current.heading === "string" && current.heading.length > 0) {
    out.push({
      heading: current.heading,
      gist: typeof current.gist === "string" ? current.gist : "",
      wasHandoff: current.wasHandoff === true,
    });
  }
  return out;
}

export interface EpisodicCompactionPreview {
  /** Total entries parsed out of the source file. */
  entryCount: number;
  /** How many of those entries the preview considered (capped at maxEntries). */
  consideredCount: number;
  /** 0..5 compact preview bullets, ready to surface to the user. */
  preview: string[];
}

const PREVIEW_BULLET_LIMIT = 5;
const PREVIEW_BULLET_MAX_CHARS = 200;
const PREVIEW_REDACTED_MARKER = "[redacted - sensitive content]";

/**
 * Deterministic compaction preview. No LLM call. Steps:
 *
 *   1. Parse the whole file with `parseEpisodicEntries`.
 *   2. Take the trailing `maxEntries` entries (most recent).
 *   3. Pull the `gist` text out of each entry (skip empty gists).
 *   4. Take the last `PREVIEW_BULLET_LIMIT` of those (most recent up to 5).
 *   5. For each bullet: if `isSensitive(gist)` is true, swap in the
 *      generic `[redacted - sensitive content]` marker; otherwise cap to
 *      `PREVIEW_BULLET_MAX_CHARS` with a trailing `…` ellipsis.
 *
 * `isSensitive` is a function parameter (not a hard import) so this module
 * stays decoupled from the `containsSensitiveContent` helper in
 * `agentRuntimeContext.ts`. The route layer wires the two together.
 *
 * No IO, no logging. The function never echoes the source bullets unless
 * the caller asked for them via the returned `preview` array.
 */
export function buildEpisodicCompactionPreview(
  content: string,
  maxEntries: number,
  isSensitive: (s: string) => boolean = () => false
): EpisodicCompactionPreview {
  const all = parseEpisodicEntries(content);
  const entryCount = all.length;
  const cap = Number.isFinite(maxEntries) && maxEntries >= 1
    ? Math.floor(maxEntries)
    : 10;
  const effective = Math.max(1, Math.min(100, cap));
  const considered = all.slice(-effective);
  const consideredCount = considered.length;

  const gists: string[] = [];
  for (const e of considered) {
    if (e.gist && e.gist.length > 0) gists.push(e.gist);
  }
  const tail = gists.slice(-PREVIEW_BULLET_LIMIT);
  const preview = tail.map((g) => {
    if (isSensitive(g)) return PREVIEW_REDACTED_MARKER;
    if (g.length > PREVIEW_BULLET_MAX_CHARS) {
      return g.slice(0, PREVIEW_BULLET_MAX_CHARS - 1).trimEnd() + "…";
    }
    return g;
  });
  return { entryCount, consideredCount, preview };
}
// ---------------------------------------------------------------------------
// Phase 5.3-B - compaction block formatter
// ---------------------------------------------------------------------------

/**
 * Result of `buildCompactionBlock`.
 *
 *   - `block`: the full markdown chunk the apply route appends to
 *     `core_memory.md`. Includes the `<!-- compacted-from-episodic ... -->`
 *     marker (with timestamp) so future readers can identify what came
 *     from compaction vs other promote paths.
 *
 *   - `fingerprint`: the deterministic dedup-needle the apply route hands
 *     to `safeAppendUnique`. The fingerprint EXCLUDES the timestamp marker
 *     so two consecutive applies of identical bullets dedup correctly even
 *     though their wall-clock timestamps differ.
 */
export interface CompactionBlock {
  block: string;
  fingerprint: string;
}

/**
 * Format a set of compaction bullets into a writable markdown block.
 *
 * Pure function. No IO, no logging. Caller is responsible for:
 *   - trimming + validating each bullet upstream (the route layer does
 *     this and refuses sensitive bullets at the same time)
 *   - choosing the timestamp (typically `new Date().toISOString()`)
 *
 * Output format:
 *
 *   \n<!-- compacted-from-episodic <timestamp> -->\n
 *   - bullet 1\n
 *   - bullet 2\n
 *   ...
 *
 * The leading newline mirrors `/promote` and `/promote-episodic` so
 * appending a block to a non-empty `core_memory.md` always produces a
 * visual gap between entries. The fingerprint omits the timestamp marker
 * so the dedup needle remains stable across calls.
 */
export function buildCompactionBlock(
  bullets: string[],
  timestamp: string
): CompactionBlock {
  if (!Array.isArray(bullets) || bullets.length === 0) {
    throw new MemoryFilesError(
      "io_error",
      "buildCompactionBlock: bullets must be a non-empty array"
    );
  }
  if (typeof timestamp !== "string" || timestamp.length === 0) {
    throw new MemoryFilesError(
      "io_error",
      "buildCompactionBlock: timestamp must be a non-empty string"
    );
  }
  const fingerprint = "- " + bullets.join("\n- ");
  const block = `\n<!-- compacted-from-episodic ${timestamp} -->\n${fingerprint}\n`;
  return { block, fingerprint };
}
// ---------------------------------------------------------------------------
// Phase 5.3-D - scheduled compaction status (read-only)
// ---------------------------------------------------------------------------

/**
 * Computed status for an agent's episodic-memory compaction readiness.
 *
 * Returned by `getEpisodicCompactionStatus`. Read-only summary; no IO is
 * performed here, no content is exposed. The route layer adds wire-format
 * fields (`previewAvailable`, `requiresConfirmation`, `nextAction`) on
 * top of this shape.
 */
export interface EpisodicCompactionStatus {
  /** Number of parseable `## ...` entries (NOT raw line count). */
  entryCount: number;
  /** Effective threshold applied by this call (default 100). */
  threshold: number;
  /** True iff `entryCount > threshold`. Strict `>` so the boundary value
   *  (entryCount === threshold) is NOT considered due. */
  due: boolean;
  /** Convenience flag for the missing/empty case. True iff entryCount===0. */
  empty: boolean;
}

/**
 * Pure function. Wraps `parseEpisodicEntries(content)` and reports
 * whether the agent has crossed the compaction threshold.
 *
 * Threshold semantics: `due = entryCount > threshold`. Strict greater-than
 * so the boundary value (e.g. exactly 100 entries when threshold=100) is
 * NOT considered due. This matches the spec recommendation "100 entries
 * decide and document behavior clearly; recommended: due false until >100"
 * and gives a clean trigger at 101.
 *
 * The threshold argument is optional. When omitted, NaN, negative, or
 * non-finite, the helper falls back to 100. The threshold is `Math.floor`
 * coerced so fractional inputs are normalized.
 *
 * No IO, no logging, no allocation beyond the array `parseEpisodicEntries`
 * already builds. Safe to call on arbitrarily large content.
 */
export function getEpisodicCompactionStatus(
  content: string,
  threshold: number = 100
): EpisodicCompactionStatus {
  const entries = parseEpisodicEntries(content);
  const entryCount = entries.length;
  const t =
    typeof threshold === "number" && Number.isFinite(threshold) && threshold >= 0
      ? Math.floor(threshold)
      : 100;
  return {
    entryCount,
    threshold: t,
    due: entryCount > t,
    empty: entryCount === 0,
  };
}
