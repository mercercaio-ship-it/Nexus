/**
 * Phase 5.6-A - opt-in backup config helpers.
 *
 * Owns the read/write/default of `~/.creativedge/backup.json`. Conservative
 * by default:
 *   - `enabled` starts false; backups never run unless the user explicitly
 *     opts in via `POST /backup/config`.
 *   - `remote` starts null; no GitHub API call, no token storage. The user
 *     is expected to configure the remote themselves (e.g. `git remote add`)
 *     once they've created a private repo manually.
 *   - `includeSessionsDb` starts false. The user can flip it on later
 *     consciously; the default `.gitignore` still excludes `*.db` so the
 *     user has to remove it from `.gitignore` manually too.
 *
 * Path-safety: every config write validates that `repoDir` and `sourceDir`
 * resolve inside the runtime root (`~/.creativedge`). This prevents a
 * misconfigured remote-controlled value from pointing the backup helper at
 * an arbitrary disk location.
 *
 * File format: JSON, indent=2, UTF-8, no BOM, atomic-ish write (`.tmp` +
 * `rename`) to avoid half-written `backup.json` on crash.
 */

import { mkdir, readFile, rename, writeFile, unlink } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";

export interface BackupConfig {
  /** Master switch. When false, every /backup/* mutation route is a no-op
   *  except /backup/config itself and /backup/status. */
  enabled: boolean;
  /** Where the local backup git repo lives. Default is under the runtime
   *  root so the path-safety check passes without any extra config. */
  repoDir: string;
  /** Where the source agent memory lives. Default is `<runtimeRoot>/agents`. */
  sourceDir: string;
  /** Optional remote URL (https://github.com/... or git@github.com:...).
   *  Never echoed back unredacted to the HTTP layer. Null until configured. */
  remote: string | null;
  /** Whether to include `sessions.db` in the backup. Default false. The
   *  `.gitignore` written by `backupGit.ts` excludes `*.db` regardless, so
   *  the user has to ALSO edit `.gitignore` to actually back up the DB. */
  includeSessionsDb: boolean;
  /** ISO timestamps for audit. Set on first save; preserved across patches
   *  except `updatedAt` which is refreshed on every save. */
  createdAt: string;
  updatedAt: string;
}

export type BackupConfigPatch = Partial<Pick<BackupConfig,
  "enabled" | "remote" | "includeSessionsDb" | "repoDir" | "sourceDir"
>>;

export class BackupConfigError extends Error {
  readonly code:
    | "invalid_path"
    | "path_escapes_runtime"
    | "invalid_remote"
    | "io_error";
  constructor(code: BackupConfigError["code"], message: string) {
    super(message);
    this.name = "BackupConfigError";
    this.code = code;
  }
}

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

/** Where the config file lives. */
export function backupConfigPath(runtimeRootDir: string): string {
  return join(runtimeRootDir, "backup.json");
}

/** Default repoDir under the runtime root. Kept stable so config + helpers
 *  agree without having to thread the path everywhere. */
export function defaultRepoDir(runtimeRootDir: string): string {
  return join(runtimeRootDir, "backups", "agents-git");
}

/** Default sourceDir = the agents subtree the user already curates. */
export function defaultSourceDir(runtimeRootDir: string): string {
  return join(runtimeRootDir, "agents");
}

/**
 * Defense-in-depth: every path the config records must resolve INSIDE the
 * runtime root. Otherwise a future copy/commit step could be tricked into
 * writing outside `~/.creativedge`. Returns the resolved absolute path on
 * success; throws `BackupConfigError("path_escapes_runtime")` otherwise.
 */
export function assertPathUnderRuntime(
  candidate: string,
  runtimeRootDir: string,
  label: string
): string {
  if (typeof candidate !== "string" || candidate.length === 0) {
    throw new BackupConfigError("invalid_path", `${label} must be a non-empty string`);
  }
  const resolvedRoot = resolve(runtimeRootDir);
  const resolved = resolve(candidate);
  const prefix = resolvedRoot.endsWith(sep) ? resolvedRoot : resolvedRoot + sep;
  if (resolved !== resolvedRoot && !resolved.startsWith(prefix)) {
    throw new BackupConfigError(
      "path_escapes_runtime",
      `${label} (${resolved}) escapes the runtime root (${resolvedRoot})`
    );
  }
  return resolved;
}

/**
 * Validate a user-supplied remote URL. Accepts the two GitHub schemes:
 *   - https://github.com/<owner>/<repo>(.git)?
 *   - git@github.com:<owner>/<repo>(.git)?
 *
 * Refuses anything else. This is intentionally narrow - the slice doesn't
 * use the GitHub API or store tokens, so the user is expected to have
 * created a private repo manually and to use one of these two forms.
 */
export function validateRemote(remote: string | null | undefined): string | null {
  if (remote === null || remote === undefined || remote === "") return null;
  if (typeof remote !== "string") {
    throw new BackupConfigError("invalid_remote", "remote must be a string or null");
  }
  const trimmed = remote.trim();
  if (trimmed.length > 400) {
    throw new BackupConfigError("invalid_remote", "remote URL too long (max 400 chars)");
  }
  const httpsRe = /^https:\/\/github\.com\/[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+(?:\.git)?$/;
  const sshRe = /^git@github\.com:[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+(?:\.git)?$/;
  if (!httpsRe.test(trimmed) && !sshRe.test(trimmed)) {
    throw new BackupConfigError(
      "invalid_remote",
      "remote must be https://github.com/<owner>/<repo>(.git)? or git@github.com:<owner>/<repo>(.git)?"
    );
  }
  return trimmed;
}

// ---------------------------------------------------------------------------
// Config I/O
// ---------------------------------------------------------------------------

export function getDefaultBackupConfig(runtimeRootDir: string): BackupConfig {
  const now = new Date().toISOString();
  return {
    enabled: false,
    repoDir: defaultRepoDir(runtimeRootDir),
    sourceDir: defaultSourceDir(runtimeRootDir),
    remote: null,
    includeSessionsDb: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Read `~/.creativedge/backup.json`. Missing file returns null. Malformed
 * JSON throws `BackupConfigError("io_error")` so the caller can decide
 * whether to overwrite (typical: `/backup/config` rewrites; `/backup/status`
 * surfaces the error).
 */
export async function loadBackupConfig(
  runtimeRootDir: string
): Promise<BackupConfig | null> {
  const path = backupConfigPath(runtimeRootDir);
  let raw: string;
  try {
    raw = await readFile(path, "utf-8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return null;
    throw new BackupConfigError(
      "io_error",
      "failed to read backup.json: " + (err as Error)?.message
    );
  }
  // Strip optional UTF-8 BOM defensively (we never write one; some editors
  // do).
  const cleaned = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  try {
    const parsed = JSON.parse(cleaned) as Partial<BackupConfig>;
    return normalizeConfig(parsed, runtimeRootDir);
  } catch (err) {
    throw new BackupConfigError(
      "io_error",
      "backup.json is not valid JSON: " + (err as Error)?.message
    );
  }
}

function normalizeConfig(
  raw: Partial<BackupConfig>,
  runtimeRootDir: string
): BackupConfig {
  const def = getDefaultBackupConfig(runtimeRootDir);
  const repoDir = typeof raw.repoDir === "string" && raw.repoDir.length > 0
    ? raw.repoDir
    : def.repoDir;
  const sourceDir = typeof raw.sourceDir === "string" && raw.sourceDir.length > 0
    ? raw.sourceDir
    : def.sourceDir;
  // Path-safety: refuse to load a config whose paths escape the runtime.
  assertPathUnderRuntime(repoDir, runtimeRootDir, "repoDir");
  assertPathUnderRuntime(sourceDir, runtimeRootDir, "sourceDir");
  return {
    enabled: raw.enabled === true,
    repoDir,
    sourceDir,
    remote: validateRemote(raw.remote ?? null),
    includeSessionsDb: raw.includeSessionsDb === true,
    createdAt:
      typeof raw.createdAt === "string" && raw.createdAt.length > 0
        ? raw.createdAt
        : def.createdAt,
    updatedAt:
      typeof raw.updatedAt === "string" && raw.updatedAt.length > 0
        ? raw.updatedAt
        : def.updatedAt,
  };
}

/**
 * Merge a patch into the existing config (or create from defaults), write
 * back atomically. Returns the merged config.
 *
 * Patch semantics:
 *   - `enabled`, `includeSessionsDb` are booleans; any non-boolean is rejected.
 *   - `remote` accepts a github.com URL, an empty string (treated as null),
 *     or explicit null. Any other value throws `invalid_remote`.
 *   - `repoDir`, `sourceDir` accept any string but must resolve under the
 *     runtime root. Most callers should NOT set these in this slice -
 *     defaults are correct.
 */
export async function saveBackupConfig(
  runtimeRootDir: string,
  patch: BackupConfigPatch
): Promise<BackupConfig> {
  const existing = (await loadBackupConfig(runtimeRootDir)) ??
    getDefaultBackupConfig(runtimeRootDir);

  const merged: BackupConfig = { ...existing };
  if (patch.enabled !== undefined) {
    if (typeof patch.enabled !== "boolean") {
      throw new BackupConfigError("invalid_path", "enabled must be a boolean");
    }
    merged.enabled = patch.enabled;
  }
  if (patch.includeSessionsDb !== undefined) {
    if (typeof patch.includeSessionsDb !== "boolean") {
      throw new BackupConfigError("invalid_path", "includeSessionsDb must be a boolean");
    }
    merged.includeSessionsDb = patch.includeSessionsDb;
  }
  if (patch.remote !== undefined) {
    merged.remote = validateRemote(patch.remote);
  }
  if (patch.repoDir !== undefined) {
    merged.repoDir = assertPathUnderRuntime(patch.repoDir, runtimeRootDir, "repoDir");
  }
  if (patch.sourceDir !== undefined) {
    merged.sourceDir = assertPathUnderRuntime(patch.sourceDir, runtimeRootDir, "sourceDir");
  }
  merged.updatedAt = new Date().toISOString();

  const path = backupConfigPath(runtimeRootDir);
  const tmpPath = path + ".tmp";
  const json = JSON.stringify(merged, null, 2) + "\n";
  try {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(tmpPath, json, { encoding: "utf-8" });
    await rename(tmpPath, path);
  } catch (err) {
    try { await unlink(tmpPath); } catch { /* ignore */ }
    throw new BackupConfigError(
      "io_error",
      "failed to write backup.json: " + (err as Error)?.message
    );
  }
  return merged;
}
