#!/usr/bin/env node
/**
 * Phase 5.2-B - memoryFiles unit tests.
 *
 * Pure-function tests that exercise the new write primitives in
 * `backend-api/src/agents/memoryFiles.ts` (compiled to
 * `dist/agents/memoryFiles.js`). No live backend required; all IO happens
 * in a per-run tmpdir under `os.tmpdir()`.
 *
 * What this harness CHECKS:
 *   - resolveMemoryPath rejects invalid slugs (slash, dot, uppercase,
 *     empty, control chars) with MemoryFilesError code "invalid_slug".
 *   - resolveMemoryPath rejects an invalid memory kind.
 *   - resolveMemoryPath returns the expected absolute path for valid
 *     {slug, kind} pairs.
 *   - withFileLock serializes two overlapping calls (the second call
 *     waits until the first releases before its critical section runs).
 *   - withFileLock recovers from a stale lockfile older than `staleAfterMs`.
 *   - withFileLock fails with `lock_timeout` when the lock is held longer
 *     than `timeoutMs` and is not stale.
 *   - safeAppendUnique writes the block when the dedupNeedle is absent.
 *   - safeAppendUnique refuses to write when the dedupNeedle is already
 *     present and returns { duplicate: true, written: false }.
 *   - safeAppendUnique survives a missing parent directory (auto-mkdir).
 *   - atomicReplace overwrites the file content via tmp+rename.
 *
 * What this harness EXPLICITLY DOES NOT DO:
 *   - It does not test the /promote HTTP route (covered by the live
 *     Windows smoke step in §5.2-A and §5.2-B done-when).
 *   - It does not invoke any agent registry, provider, or memory
 *     candidate detector.
 *
 * Privacy:
 *   - The runner prints test ids and pass/fail tags only. Content payloads
 *     written into tmpdir test files are NOT printed.
 *
 * Usage:
 *   npm run build                          # ensures dist/ is fresh
 *   node scripts/run-memory-files-tests.mjs
 *
 * Exit codes:
 *   0  all tests pass
 *   1  one or more tests fail
 *   2  runner-level error (couldn't load dist, couldn't create tmpdir, etc.)
 */

import { mkdir, mkdtemp, readFile, stat, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const MOD_PATH = join(HERE, "..", "dist", "agents", "memoryFiles.js");

const COLOR = process.stdout.isTTY
  ? { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", reset: "\x1b[0m", dim: "\x1b[2m" }
  : { red: "", green: "", yellow: "", reset: "", dim: "" };
function colorize(s, c) { return (COLOR[c] || "") + s + (COLOR.reset || ""); }

let total = 0;
let pass = 0;
let fail = 0;
const failures = [];

function record(id, ok, reason) {
  total++;
  const tag = ok ? colorize("PASS", "green") : colorize("FAIL", "red");
  console.log(`${id.padEnd(56)} ${tag}`);
  if (ok) {
    pass++;
  } else {
    fail++;
    failures.push({ id, reason });
    console.log(colorize(`    reason: ${reason}`, "red"));
  }
}

async function assertThrows(id, fn, codeWanted) {
  try {
    await fn();
    record(id, false, `expected throw with code "${codeWanted}", no throw`);
  } catch (err) {
    const code = err?.code ?? err?.constructor?.name ?? "unknown";
    if (code === codeWanted) {
      record(id, true);
    } else {
      record(id, false, `expected code "${codeWanted}", got "${code}" (${err?.message ?? err})`);
    }
  }
}

async function main() {
  let mod;
  try {
    mod = await import(pathToFileURL(MOD_PATH).href);
  } catch (err) {
    console.error("failed to load module at", MOD_PATH);
    console.error("hint: run `npm run build` first.");
    console.error("cause:", err?.message || err);
    process.exit(2);
  }
  const {
    SLUG_RE,
    MemoryFilesError,
    resolveMemoryPath,
    withFileLock,
    safeAppendUnique,
    atomicReplace,
    findEpisodicMatch,
    safeReplaceOnce,
    parseEpisodicEntries,
    buildEpisodicCompactionPreview,
    buildCompactionBlock,
    getEpisodicCompactionStatus,
  } = mod;

  if (
    !SLUG_RE ||
    !MemoryFilesError ||
    typeof resolveMemoryPath !== "function" ||
    typeof withFileLock !== "function" ||
    typeof safeAppendUnique !== "function" ||
    typeof atomicReplace !== "function" ||
    typeof findEpisodicMatch !== "function" ||
    typeof safeReplaceOnce !== "function" ||
    typeof parseEpisodicEntries !== "function" ||
    typeof buildEpisodicCompactionPreview !== "function" ||
    typeof buildCompactionBlock !== "function" ||
    typeof getEpisodicCompactionStatus !== "function"
  ) {
    console.error("module is missing one or more expected exports");
    process.exit(2);
  }

  console.log("=".repeat(78));
  console.log("CreativEdge memoryFiles unit tests (Phase 5.2-B)");
  console.log("=".repeat(78));

  // ----- tmpdir scope --------------------------------------------------
  const root = await mkdtemp(join(tmpdir(), "ce-memfiles-"));
  const agentsDir = join(root, "agents");
  await mkdir(agentsDir, { recursive: true });

  console.log("");
  console.log(colorize("--- resolveMemoryPath ---", "dim"));

  // Valid path resolves cleanly.
  try {
    const p = resolveMemoryPath(agentsDir, "graphics-design", "core");
    const ok = p.endsWith(join("graphics-design", "memory", "core_memory.md"));
    record("resolveMemoryPath: valid core path", ok, ok ? "" : `unexpected path: ${p}`);
  } catch (err) {
    record("resolveMemoryPath: valid core path", false, err?.message || String(err));
  }
  try {
    const p = resolveMemoryPath(agentsDir, "ai-services", "episodic");
    const ok = p.endsWith(join("ai-services", "memory", "episodic_memory.md"));
    record("resolveMemoryPath: valid episodic path", ok, ok ? "" : `unexpected path: ${p}`);
  } catch (err) {
    record("resolveMemoryPath: valid episodic path", false, err?.message || String(err));
  }

  // Invalid slug shapes - all must throw invalid_slug.
  for (const bad of [
    "../escape",
    "..",
    "with/slash",
    "WithUppercase",
    "_leading_underscore",
    "",
    "  ",
    "a", // too short per SLUG_RE (min 2 chars after the leading lowercase letter)
  ]) {
    await assertThrows(
      `resolveMemoryPath: rejects invalid slug ${JSON.stringify(bad)}`,
      async () => resolveMemoryPath(agentsDir, bad, "core"),
      "invalid_slug"
    );
  }
  await assertThrows(
    "resolveMemoryPath: rejects invalid kind",
    async () => resolveMemoryPath(agentsDir, "graphics-design", "bogus"),
    "invalid_slug"
  );

  console.log("");
  console.log(colorize("--- withFileLock ---", "dim"));

  // Basic acquire-release on a fresh path.
  {
    const path = join(root, "lock-basic.md");
    const result = await withFileLock(path, async () => "ok");
    record("withFileLock: basic acquire-release returns fn result", result === "ok");
    // Lockfile is gone after release.
    try {
      await stat(path + ".lock");
      record("withFileLock: lockfile removed after release", false, "lockfile still exists");
    } catch (err) {
      record("withFileLock: lockfile removed after release", err?.code === "ENOENT", err?.code || String(err));
    }
  }

  // Two overlapping calls serialize.
  {
    const path = join(root, "lock-serial.md");
    let order = [];
    const a = withFileLock(path, async () => {
      order.push("A-start");
      await new Promise((r) => setTimeout(r, 80));
      order.push("A-end");
      return "A";
    });
    // Tiny delay so A surely takes the lock first.
    await new Promise((r) => setTimeout(r, 10));
    const b = withFileLock(path, async () => {
      order.push("B-start");
      await new Promise((r) => setTimeout(r, 10));
      order.push("B-end");
      return "B";
    });
    const results = await Promise.all([a, b]);
    const expected = ["A-start", "A-end", "B-start", "B-end"];
    const ok =
      results[0] === "A" &&
      results[1] === "B" &&
      JSON.stringify(order) === JSON.stringify(expected);
    record(
      "withFileLock: two overlapping calls serialize",
      ok,
      ok ? "" : `order=${JSON.stringify(order)}`
    );
  }

  // Stale lockfile is reclaimed.
  {
    const path = join(root, "lock-stale.md");
    const lockPath = path + ".lock";
    await mkdir(dirname(lockPath), { recursive: true });
    await writeFile(lockPath, "fake-pid", "utf-8");
    // Backdate mtime so the lock looks stale.
    const oldTime = new Date(Date.now() - 60_000);
    await utimes(lockPath, oldTime, oldTime);
    const result = await withFileLock(
      path,
      async () => "reclaimed",
      { staleAfterMs: 10_000, timeoutMs: 1500 }
    );
    record("withFileLock: reclaims stale lockfile", result === "reclaimed");
  }

  // Non-stale lock that never releases - timeout fires.
  {
    const path = join(root, "lock-timeout.md");
    const lockPath = path + ".lock";
    await mkdir(dirname(lockPath), { recursive: true });
    await writeFile(lockPath, "active", "utf-8");
    // Fresh mtime (i.e. not stale).
    await utimes(lockPath, new Date(), new Date());
    await assertThrows(
      "withFileLock: times out when lock is held and not stale",
      async () => withFileLock(path, async () => "should-not-run", { timeoutMs: 250, staleAfterMs: 60_000 }),
      "lock_timeout"
    );
    // Clean up so later tests can reuse path if needed.
    try { await import("node:fs/promises").then(m => m.unlink(lockPath)); } catch { /* ignore */ }
  }

  console.log("");
  console.log(colorize("--- safeAppendUnique ---", "dim"));

  // Append into a missing directory - helper should mkdir -p.
  {
    const path = join(root, "agents", "graphics-design", "memory", "core_memory.md");
    const block = "\n<!-- promoted X -->\nI prefer dark mode.\n";
    const r = await safeAppendUnique(path, block, { dedupNeedle: "I prefer dark mode." });
    const ok =
      r.written === true &&
      r.duplicate === false &&
      r.bytesAppended === Buffer.byteLength(block, "utf-8") &&
      r.path === path;
    record("safeAppendUnique: writes when dedupNeedle absent", ok, ok ? "" : JSON.stringify(r));
  }

  // Same dedupNeedle - bail with duplicate:true and no growth.
  {
    const path = join(root, "agents", "graphics-design", "memory", "core_memory.md");
    const before = await readFile(path, "utf-8");
    const r = await safeAppendUnique(
      path,
      "\n<!-- promoted Y -->\nI prefer dark mode.\n",
      { dedupNeedle: "I prefer dark mode." }
    );
    const after = await readFile(path, "utf-8");
    const ok =
      r.written === false &&
      r.duplicate === true &&
      r.bytesAppended === 0 &&
      before === after;
    record("safeAppendUnique: dedups by needle, file unchanged", ok, ok ? "" : `r=${JSON.stringify(r)}`);
  }

  // Different needle - second distinct write still appends.
  {
    const path = join(root, "agents", "graphics-design", "memory", "core_memory.md");
    const r = await safeAppendUnique(
      path,
      "\n<!-- promoted Z -->\nI prefer compact tooltips.\n",
      { dedupNeedle: "I prefer compact tooltips." }
    );
    const ok = r.written === true && r.duplicate === false;
    record("safeAppendUnique: appends a second distinct fact", ok, ok ? "" : JSON.stringify(r));
  }

  console.log("");
  console.log(colorize("--- atomicReplace ---", "dim"));

  // Replace a file completely.
  {
    const path = join(root, "agents", "atomic-target.md");
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, "before", "utf-8");
    const r = await atomicReplace(path, "after-state");
    const final = await readFile(path, "utf-8");
    const ok =
      r.written === true &&
      r.bytesWritten === Buffer.byteLength("after-state", "utf-8") &&
      final === "after-state";
    record("atomicReplace: overwrites previous content", ok, ok ? "" : JSON.stringify(r) + " final=" + final);
  }
  // Replace into a fresh path that doesn't exist yet.
  {
    const path = join(root, "agents", "atomic-new", "core_memory.md");
    const r = await atomicReplace(path, "freshly-written");
    const final = await readFile(path, "utf-8");
    const ok = r.written === true && final === "freshly-written";
    record("atomicReplace: creates path when missing", ok, ok ? "" : JSON.stringify(r));
  }

  console.log("");
  console.log(colorize("--- findEpisodicMatch ---", "dim"));

  // none: empty content / empty needle / unmatched needle
  {
    const r = findEpisodicMatch("", "anything");
    record(
      "findEpisodicMatch: empty content -> none",
      r.status === "none",
      JSON.stringify(r)
    );
  }
  {
    const r = findEpisodicMatch("some episodic memory content", "");
    record(
      "findEpisodicMatch: empty needle -> none",
      r.status === "none",
      JSON.stringify(r)
    );
  }
  {
    const r = findEpisodicMatch(
      "## 2026-05-01T00:00:00Z\n- session: abc\n- gist: hello\n",
      "missing-needle"
    );
    record(
      "findEpisodicMatch: needle absent -> none",
      r.status === "none",
      JSON.stringify(r)
    );
  }

  // found: exactly one occurrence across the file
  {
    const content =
      "## 2026-05-01T00:00:00Z\n" +
      "- session: abc\n" +
      "- gist: user prefers dark mode dashboards\n" +
      "- was_handoff: false\n";
    const r = findEpisodicMatch(content, "dark mode dashboards");
    const ok =
      r.status === "found" &&
      r.line.includes("dark mode dashboards") &&
      r.line.startsWith("- gist:") &&
      typeof r.lineIndex === "number" && r.lineIndex >= 0;
    record(
      "findEpisodicMatch: single match returns full line + lineIndex",
      ok,
      JSON.stringify(r)
    );
  }

  // multiple: same needle in two different lines
  {
    const content =
      "- gist: I prefer compact tooltips\n" +
      "- gist: I also prefer compact tooltips\n";
    const r = findEpisodicMatch(content, "compact tooltips");
    record(
      "findEpisodicMatch: needle in two different lines -> multiple",
      r.status === "multiple" && r.count === 2,
      JSON.stringify(r)
    );
  }

  // multiple: same needle twice inside the same line (still ambiguous)
  {
    const content = "- gist: dark mode dark mode again\n";
    const r = findEpisodicMatch(content, "dark mode");
    record(
      "findEpisodicMatch: needle twice in one line -> multiple",
      r.status === "multiple" && r.count === 2,
      JSON.stringify(r)
    );
  }

  // case-sensitive: 'Dark mode' and 'dark mode' are different matches
  {
    const content =
      "- gist: I like dark mode dashboards\n" +
      "- gist: I also like Dark mode banners\n";
    const r = findEpisodicMatch(content, "dark mode");
    const ok =
      r.status === "found" &&
      r.line === "- gist: I like dark mode dashboards";
    record(
      "findEpisodicMatch: case-sensitive match isolates lowercase line",
      ok,
      JSON.stringify(r)
    );
  }

  // Line covering offset at the very last line (no trailing newline)
  {
    const content =
      "first line\nsecond line with NEEDLE-A and nothing else";
    const r = findEpisodicMatch(content, "NEEDLE-A");
    const ok =
      r.status === "found" &&
      r.line === "second line with NEEDLE-A and nothing else" &&
      r.lineIndex === 1;
    record(
      "findEpisodicMatch: match on final line without trailing newline",
      ok,
      JSON.stringify(r)
    );
  }

  console.log("");
  console.log(colorize("--- safeReplaceOnce ---", "dim"));

  // Setup a clean target file under tmpdir for the §5.2-D tests.
  const editDir = join(root, "edit");
  await mkdir(editDir, { recursive: true });

  // (1) Missing file - status "none".
  {
    const path = join(editDir, "missing.md");
    const r = await safeReplaceOnce(path, "anything", "anything-else");
    record(
      "safeReplaceOnce: missing file -> status none",
      r.status === "none" && r.path === path,
      JSON.stringify(r)
    );
  }

  // (2) Needle absent in existing file - status "none".
  {
    const path = join(editDir, "absent.md");
    await writeFile(path, "Hello there.\nNothing matching here.\n", "utf-8");
    const r = await safeReplaceOnce(path, "I prefer dark mode", "I prefer light mode");
    const before = await readFile(path, "utf-8");
    const ok = r.status === "none" && before === "Hello there.\nNothing matching here.\n";
    record(
      "safeReplaceOnce: needle absent -> status none, file unchanged",
      ok,
      ok ? "" : JSON.stringify(r)
    );
  }

  // (3) Exactly one match - status "edited", bytesWritten correct, content updated.
  {
    const path = join(editDir, "single.md");
    const before = "## core\n- pref: I prefer dark mode\n- pref: I always commit semantic messages\n";
    await writeFile(path, before, "utf-8");
    const r = await safeReplaceOnce(path, "I prefer dark mode", "I prefer light mode");
    const after = await readFile(path, "utf-8");
    const expected = before.replace("I prefer dark mode", "I prefer light mode");
    const ok =
      r.status === "edited" &&
      r.bytesWritten === Buffer.byteLength(expected, "utf-8") &&
      after === expected;
    record(
      "safeReplaceOnce: exactly one match -> edited and file updated",
      ok,
      ok ? "" : JSON.stringify(r) + " | after-matches-expected=" + (after === expected)
    );
  }

  // (4) Multiple matches in different lines - status "multiple", file unchanged.
  {
    const path = join(editDir, "multi-lines.md");
    const before = "- pref: compact tooltips\n- pref: I want compact tooltips too\n";
    await writeFile(path, before, "utf-8");
    const r = await safeReplaceOnce(path, "compact tooltips", "expanded tooltips");
    const after = await readFile(path, "utf-8");
    const ok = r.status === "multiple" && r.count === 2 && after === before;
    record(
      "safeReplaceOnce: needle in two different lines -> multiple, file unchanged",
      ok,
      ok ? "" : JSON.stringify(r) + " | unchanged=" + (after === before)
    );
  }

  // (5) Multiple matches inside the same line - status "multiple", file unchanged.
  {
    const path = join(editDir, "multi-same-line.md");
    const before = "- pref: dark mode dark mode forever\n";
    await writeFile(path, before, "utf-8");
    const r = await safeReplaceOnce(path, "dark mode", "light mode");
    const after = await readFile(path, "utf-8");
    const ok = r.status === "multiple" && r.count === 2 && after === before;
    record(
      "safeReplaceOnce: needle twice in one line -> multiple, file unchanged",
      ok,
      ok ? "" : JSON.stringify(r) + " | unchanged=" + (after === before)
    );
  }

  // (6) find === replace - status "unchanged", no rewrite.
  {
    const path = join(editDir, "unchanged.md");
    const before = "- pref: keep this exactly the same\n";
    await writeFile(path, before, "utf-8");
    const r = await safeReplaceOnce(path, "keep this exactly the same", "keep this exactly the same");
    const after = await readFile(path, "utf-8");
    const ok = r.status === "unchanged" && after === before;
    record(
      "safeReplaceOnce: find === replace -> unchanged, file unchanged",
      ok,
      ok ? "" : JSON.stringify(r) + " | unchanged=" + (after === before)
    );
  }

  // (7) Empty replace - effectively a delete of `find`.
  {
    const path = join(editDir, "delete.md");
    const before = "- pref: please delete THIS-PHRASE from core\n- pref: keep this\n";
    await writeFile(path, before, "utf-8");
    const r = await safeReplaceOnce(path, " THIS-PHRASE", "");
    const after = await readFile(path, "utf-8");
    const expected = before.replace(" THIS-PHRASE", "");
    const ok =
      r.status === "edited" &&
      r.bytesWritten === Buffer.byteLength(expected, "utf-8") &&
      after === expected;
    record(
      "safeReplaceOnce: empty replace acts as surgical delete of the find span",
      ok,
      ok ? "" : JSON.stringify(r) + " | after-matches-expected=" + (after === expected)
    );
  }

  // (8) Throws on invalid arguments (empty find).
  await assertThrows(
    "safeReplaceOnce: rejects empty find",
    async () => safeReplaceOnce(join(editDir, "any.md"), "", "anything"),
    "io_error"
  );

  console.log("");
  console.log(colorize("--- safeReplaceOnce (Phase 5.4 forget-flow edge cases) ---", "dim"));

  // Surgical delete of an episodic-style block (## heading + bullets) preserves
  // every surrounding byte except the matched span.
  {
    const path = join(editDir, "forget-episodic.md");
    const before =
      "## 2026-05-01T00:00:00Z\n" +
      "- session: abc\n" +
      "- gist: please forget THIS-EXACT-FACT\n" +
      "- was_handoff: false\n" +
      "## 2026-05-02T00:00:00Z\n" +
      "- session: def\n" +
      "- gist: keep this entry\n" +
      "- was_handoff: false\n";
    await writeFile(path, before, "utf-8");
    const r = await safeReplaceOnce(path, "- gist: please forget THIS-EXACT-FACT\n", "");
    const after = await readFile(path, "utf-8");
    const expected = before.replace("- gist: please forget THIS-EXACT-FACT\n", "");
    const ok =
      r.status === "edited" &&
      r.bytesWritten === Buffer.byteLength(expected, "utf-8") &&
      after === expected &&
      after.includes("## 2026-05-02T00:00:00Z") &&
      after.includes("- gist: keep this entry") &&
      !after.includes("THIS-EXACT-FACT");
    record(
      "safeReplaceOnce (forget): deletes one episodic line, surrounding blocks intact",
      ok,
      ok ? "" : JSON.stringify(r) + " | after-matches-expected=" + (after === expected)
    );
  }

  // Surgical delete that consumes the entire file content (the find IS the file).
  {
    const path = join(editDir, "forget-whole-file.md");
    const before = "the only thing in this file is exactly this sentence";
    await writeFile(path, before, "utf-8");
    const r = await safeReplaceOnce(path, before, "");
    const after = await readFile(path, "utf-8");
    const ok =
      r.status === "edited" &&
      after === "" &&
      r.bytesWritten === 0;
    record(
      "safeReplaceOnce (forget): deleting the only span leaves the file empty",
      ok,
      ok ? "" : JSON.stringify(r) + " | after-length=" + after.length
    );
  }

  console.log("");
  console.log(colorize("--- parseEpisodicEntries (Phase 5.3-A) ---", "dim"));

  // Empty input -> [].
  {
    const r = parseEpisodicEntries("");
    record(
      "parseEpisodicEntries: empty content -> []",
      Array.isArray(r) && r.length === 0,
      JSON.stringify(r)
    );
  }

  // Single well-formed entry.
  {
    const content =
      "\n## 2026-05-01T00:00:00Z\n" +
      "- session: s-001\n" +
      "- gist: user wants weekly KPI summaries\n" +
      "- was_handoff: false\n";
    const r = parseEpisodicEntries(content);
    const ok =
      r.length === 1 &&
      r[0].heading === "2026-05-01T00:00:00Z" &&
      r[0].gist === "user wants weekly KPI summaries" &&
      r[0].wasHandoff === false;
    record(
      "parseEpisodicEntries: single well-formed entry",
      ok,
      ok ? "" : JSON.stringify(r)
    );
  }

  // Two entries, second has was_handoff:true.
  {
    const content =
      "\n## 2026-05-01T00:00:00Z\n- session: s-1\n- gist: alpha\n- was_handoff: false\n" +
      "## 2026-05-02T00:00:00Z\n- session: s-2\n- gist: beta line\n- was_handoff: true\n";
    const r = parseEpisodicEntries(content);
    const ok =
      r.length === 2 &&
      r[0].heading === "2026-05-01T00:00:00Z" && r[0].gist === "alpha" && r[0].wasHandoff === false &&
      r[1].heading === "2026-05-02T00:00:00Z" && r[1].gist === "beta line" && r[1].wasHandoff === true;
    record(
      "parseEpisodicEntries: two entries, second is handoff",
      ok,
      ok ? "" : JSON.stringify(r)
    );
  }

  // Missing gist line tolerated (entry still parsed; gist empty).
  {
    const content =
      "\n## 2026-05-03T00:00:00Z\n- session: s-3\n- was_handoff: false\n";
    const r = parseEpisodicEntries(content);
    const ok =
      r.length === 1 &&
      r[0].heading === "2026-05-03T00:00:00Z" &&
      r[0].gist === "" &&
      r[0].wasHandoff === false;
    record(
      "parseEpisodicEntries: missing gist line tolerated",
      ok,
      ok ? "" : JSON.stringify(r)
    );
  }

  // Body lines before any heading are ignored (no orphaned entry).
  {
    const content = "stray line without heading\n- gist: orphaned\n";
    const r = parseEpisodicEntries(content);
    record(
      "parseEpisodicEntries: body lines before any heading dropped",
      Array.isArray(r) && r.length === 0,
      JSON.stringify(r)
    );
  }

  console.log("");
  console.log(colorize("--- buildEpisodicCompactionPreview (Phase 5.3-A) ---", "dim"));

  // Empty input -> entryCount 0, preview [].
  {
    const r = buildEpisodicCompactionPreview("", 10);
    const ok =
      r.entryCount === 0 &&
      r.consideredCount === 0 &&
      Array.isArray(r.preview) && r.preview.length === 0;
    record(
      "buildEpisodicCompactionPreview: empty input -> 0/0/[]",
      ok,
      ok ? "" : JSON.stringify(r)
    );
  }

  // Fewer than 5 entries -> preview length === entryCount.
  {
    let content = "";
    for (let i = 0; i < 3; i++) {
      content +=
        `\n## 2026-05-0${i + 1}T00:00:00Z\n- session: s${i}\n- gist: gist-${i}\n- was_handoff: false\n`;
    }
    const r = buildEpisodicCompactionPreview(content, 10);
    const ok =
      r.entryCount === 3 &&
      r.consideredCount === 3 &&
      r.preview.length === 3 &&
      r.preview[0] === "gist-0" &&
      r.preview[2] === "gist-2";
    record(
      "buildEpisodicCompactionPreview: 3 entries -> 3 preview bullets",
      ok,
      ok ? "" : JSON.stringify(r)
    );
  }

  // More than 5 entries -> exactly 5 preview bullets (most recent).
  {
    let content = "";
    for (let i = 0; i < 8; i++) {
      content +=
        `\n## 2026-05-0${i + 1}T00:00:00Z\n- session: s${i}\n- gist: gist-${i}\n- was_handoff: false\n`;
    }
    const r = buildEpisodicCompactionPreview(content, 10);
    const ok =
      r.entryCount === 8 &&
      r.consideredCount === 8 &&
      r.preview.length === 5 &&
      r.preview[0] === "gist-3" &&
      r.preview[4] === "gist-7";
    record(
      "buildEpisodicCompactionPreview: >5 entries -> last 5 bullets",
      ok,
      ok ? "" : JSON.stringify(r)
    );
  }

  // maxEntries trims the considered window before bullet selection.
  {
    let content = "";
    for (let i = 0; i < 8; i++) {
      content +=
        `\n## 2026-05-0${i + 1}T00:00:00Z\n- session: s${i}\n- gist: gist-${i}\n- was_handoff: false\n`;
    }
    const r = buildEpisodicCompactionPreview(content, 2);
    const ok =
      r.entryCount === 8 &&
      r.consideredCount === 2 &&
      r.preview.length === 2 &&
      r.preview[0] === "gist-6" &&
      r.preview[1] === "gist-7";
    record(
      "buildEpisodicCompactionPreview: maxEntries=2 trims to last 2",
      ok,
      ok ? "" : JSON.stringify(r)
    );
  }

  // Sensitive gist redacted via the isSensitive callback.
  {
    const content =
      "\n## 2026-05-01T00:00:00Z\n- session: s-1\n- gist: benign preference\n- was_handoff: false\n" +
      "## 2026-05-02T00:00:00Z\n- session: s-2\n- gist: my card is 4111 1111 1111 1111\n- was_handoff: false\n";
    // Tiny stub redactor: returns true for our synthetic CC fingerprint.
    const isSens = (s) => /\b(?:\d[ \-]?){13,19}\b/.test(s);
    const r = buildEpisodicCompactionPreview(content, 10, isSens);
    const ok =
      r.entryCount === 2 &&
      r.preview.length === 2 &&
      r.preview[0] === "benign preference" &&
      r.preview[1] === "[redacted - sensitive content]";
    record(
      "buildEpisodicCompactionPreview: sensitive gist replaced by redaction marker",
      ok,
      ok ? "" : JSON.stringify(r)
    );
  }

  // Oversized gist truncated with trailing ellipsis.
  {
    const longGist = "x".repeat(400);
    const content =
      `\n## 2026-05-01T00:00:00Z\n- session: s\n- gist: ${longGist}\n- was_handoff: false\n`;
    const r = buildEpisodicCompactionPreview(content, 10);
    const bullet = r.preview[0];
    const ok =
      r.entryCount === 1 &&
      typeof bullet === "string" &&
      bullet.length <= 200 &&
      bullet.endsWith("\u2026"); // ellipsis char
    record(
      "buildEpisodicCompactionPreview: long gist capped at ~200 chars with ellipsis",
      ok,
      ok ? "" : JSON.stringify({ ...r, bulletLen: bullet?.length })
    );
  }

  console.log("");
  console.log(colorize("--- buildCompactionBlock (Phase 5.3-B) ---", "dim"));

  // Single-bullet block formatting.
  {
    const stamp = "2026-05-18T00:00:00Z";
    const { block, fingerprint } = buildCompactionBlock(["alpha preference"], stamp);
    const ok =
      typeof block === "string" &&
      typeof fingerprint === "string" &&
      fingerprint === "- alpha preference" &&
      block === "\n<!-- compacted-from-episodic 2026-05-18T00:00:00Z -->\n- alpha preference\n";
    record(
      "buildCompactionBlock: single bullet -> fingerprint + block",
      ok,
      ok ? "" : JSON.stringify({ block, fingerprint })
    );
  }

  // Multi-bullet block, fingerprint excludes timestamp marker.
  {
    const stamp = "2026-05-18T10:00:00Z";
    const { block, fingerprint } = buildCompactionBlock(
      ["bullet one", "bullet two", "bullet three"],
      stamp
    );
    const ok =
      fingerprint === "- bullet one\n- bullet two\n- bullet three" &&
      block.includes("<!-- compacted-from-episodic 2026-05-18T10:00:00Z -->") &&
      block.includes(fingerprint) &&
      block.startsWith("\n") &&
      block.endsWith("\n");
    record(
      "buildCompactionBlock: multi-bullet block contains fingerprint + timestamp marker",
      ok,
      ok ? "" : JSON.stringify({ block, fingerprint })
    );
  }

  // Same bullets, different timestamp -> same fingerprint.
  {
    const a = buildCompactionBlock(["x", "y"], "2026-05-18T01:00:00Z");
    const b = buildCompactionBlock(["x", "y"], "2026-05-18T02:00:00Z");
    const ok = a.fingerprint === b.fingerprint && a.block !== b.block;
    record(
      "buildCompactionBlock: same bullets share fingerprint across timestamps",
      ok,
      ok ? "" : JSON.stringify({ a, b })
    );
  }

  // Empty bullets array throws.
  await assertThrows(
    "buildCompactionBlock: rejects empty bullets array",
    async () => buildCompactionBlock([], "2026-05-18T00:00:00Z"),
    "io_error"
  );

  // Empty timestamp throws.
  await assertThrows(
    "buildCompactionBlock: rejects empty timestamp",
    async () => buildCompactionBlock(["x"], ""),
    "io_error"
  );

  // End-to-end dedup roundtrip: first apply writes, second apply with the same
  // bullets dedups via the fingerprint.
  {
    const path = join(root, "compact-dedup.md");
    const stamp1 = "2026-05-18T10:00:00Z";
    const stamp2 = "2026-05-18T11:00:00Z";
    const bullets = ["compaction line one", "compaction line two"];
    const first = buildCompactionBlock(bullets, stamp1);
    const r1 = await safeAppendUnique(path, first.block, { dedupNeedle: first.fingerprint });
    const second = buildCompactionBlock(bullets, stamp2);
    const r2 = await safeAppendUnique(path, second.block, { dedupNeedle: second.fingerprint });
    const final = await readFile(path, "utf-8");
    const ok =
      r1.status !== undefined ? false : // safeAppendUnique returns {written, duplicate, bytesAppended, path}
      r1.written === true &&
      r1.duplicate === false &&
      r2.written === false &&
      r2.duplicate === true &&
      final === first.block;
    // The above guard is a paranoid type check; correct the predicate.
    const okFix =
      r1.written === true &&
      r1.duplicate === false &&
      r2.written === false &&
      r2.duplicate === true &&
      final === first.block;
    record(
      "buildCompactionBlock: dedup roundtrip - second apply with same bullets is a duplicate",
      okFix,
      okFix ? "" : JSON.stringify({ r1, r2, final })
    );
  }

  console.log("");
  console.log(colorize("--- getEpisodicCompactionStatus (Phase 5.3-D) ---", "dim"));

  // Helper: build a synthetic episodic content string with N entries. The
  // gist text is intentionally a meaningless tag so the runner output (which
  // doesn't print content anyway) is unambiguous.
  function makeEpisodicContent(n, gistFn) {
    let out = "";
    for (let i = 0; i < n; i++) {
      const stamp = `2026-05-${String(1 + (i % 28)).padStart(2, "0")}T00:00:00Z`;
      const gist = gistFn ? gistFn(i) : `entry-${i}`;
      out +=
        `\n## ${stamp}\n- session: s${i}\n- gist: ${gist}\n- was_handoff: false\n`;
    }
    return out;
  }

  // Empty content -> entryCount 0, due false, empty true.
  {
    const r = getEpisodicCompactionStatus("");
    const ok =
      r.entryCount === 0 &&
      r.threshold === 100 &&
      r.due === false &&
      r.empty === true;
    record(
      "getEpisodicCompactionStatus: empty content -> 0/false/empty",
      ok,
      JSON.stringify(r)
    );
  }

  // 99 entries -> due false (below threshold).
  {
    const r = getEpisodicCompactionStatus(makeEpisodicContent(99));
    const ok =
      r.entryCount === 99 &&
      r.threshold === 100 &&
      r.due === false &&
      r.empty === false;
    record(
      "getEpisodicCompactionStatus: 99 entries -> not due",
      ok,
      JSON.stringify(r)
    );
  }

  // Exactly 100 entries -> NOT due (strict greater-than semantics).
  {
    const r = getEpisodicCompactionStatus(makeEpisodicContent(100));
    const ok =
      r.entryCount === 100 &&
      r.threshold === 100 &&
      r.due === false &&
      r.empty === false;
    record(
      "getEpisodicCompactionStatus: exactly 100 entries -> not due (boundary)",
      ok,
      JSON.stringify(r)
    );
  }

  // 101 entries -> due true.
  {
    const r = getEpisodicCompactionStatus(makeEpisodicContent(101));
    const ok =
      r.entryCount === 101 &&
      r.threshold === 100 &&
      r.due === true &&
      r.empty === false;
    record(
      "getEpisodicCompactionStatus: 101 entries -> due",
      ok,
      JSON.stringify(r)
    );
  }

  // Body lines before any heading do NOT inflate the count.
  {
    const garbage =
      "stray line one\n" +
      "- gist: orphaned bullet (no preceding heading)\n" +
      "more stray\n";
    const real = makeEpisodicContent(3);
    const r = getEpisodicCompactionStatus(garbage + real);
    const ok =
      r.entryCount === 3 &&
      r.due === false &&
      r.empty === false;
    record(
      "getEpisodicCompactionStatus: body-before-heading does not inflate count",
      ok,
      JSON.stringify(r)
    );
  }

  // Threshold override: 50 fires at 51 entries.
  {
    const r = getEpisodicCompactionStatus(makeEpisodicContent(51), 50);
    const ok =
      r.entryCount === 51 &&
      r.threshold === 50 &&
      r.due === true &&
      r.empty === false;
    record(
      "getEpisodicCompactionStatus: custom threshold 50, 51 entries -> due",
      ok,
      JSON.stringify(r)
    );
  }

  // Invalid threshold (NaN, negative, non-finite) -> falls back to 100.
  {
    const r1 = getEpisodicCompactionStatus(makeEpisodicContent(150), NaN);
    const r2 = getEpisodicCompactionStatus(makeEpisodicContent(150), -5);
    const r3 = getEpisodicCompactionStatus(makeEpisodicContent(150), Infinity);
    const ok =
      r1.threshold === 100 && r1.due === true &&
      r2.threshold === 100 && r2.due === true &&
      r3.threshold === 100 && r3.due === true;
    record(
      "getEpisodicCompactionStatus: invalid thresholds fall back to default 100",
      ok,
      JSON.stringify({ r1, r2, r3 })
    );
  }

  // Privacy: even when entries carry an explicit secret-looking gist, the
  // helper never echoes content. Only counts/booleans are reported.
  {
    const content = makeEpisodicContent(2, (i) => `SHOULD-NOT-LEAK-${i}`);
    const r = getEpisodicCompactionStatus(content);
    const serialized = JSON.stringify(r);
    const ok =
      r.entryCount === 2 &&
      !serialized.includes("SHOULD-NOT-LEAK");
    record(
      "getEpisodicCompactionStatus: response carries no gist content",
      ok,
      ok ? "" : "response leaked content: " + serialized
    );
  }

  // ----- summary -------------------------------------------------------
  console.log("");
  console.log(`total: ${total}   ${colorize("PASS " + pass, "green")}   ${colorize("FAIL " + fail, fail > 0 ? "red" : "dim")}`);
  if (failures.length > 0) {
    console.log(colorize("\nfailing tests:", "red"));
    for (const f of failures) console.log(colorize(`  - ${f.id}  (${f.reason})`, "red"));
  }

  process.exit(fail === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("runner crashed:", err?.stack || err);
  process.exit(2);
});
