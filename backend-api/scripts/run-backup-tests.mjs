#!/usr/bin/env node
/**
 * Phase 5.6-A - opt-in backup unit/integration tests.
 *
 * Pure tests + opportunistic git tests. The harness creates a temporary
 * runtime root under `os.tmpdir()`, exercises the compiled
 * `dist/backup/backupConfig.js` + `dist/backup/backupGit.js` modules, and
 * never touches the user's real `~/.creativedge` directory.
 *
 * Git-dependent tests SKIP (and do NOT count as failures) when
 * `git --version` is unavailable in the sandbox. The pure tests
 * (path safety, config I/O, `.gitignore` content, copy filter,
 * remote redaction, status parser) always run.
 *
 * Usage:
 *   npm run build
 *   node scripts/run-backup-tests.mjs
 */

import { mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(HERE, "..", "dist", "backup", "backupConfig.js");
const GIT_PATH = join(HERE, "..", "dist", "backup", "backupGit.js");

const COLOR = process.stdout.isTTY
  ? { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", reset: "\x1b[0m", dim: "\x1b[2m" }
  : { red: "", green: "", yellow: "", reset: "", dim: "" };
function colorize(s, c) { return (COLOR[c] || "") + s + (COLOR.reset || ""); }

let total = 0, pass = 0, fail = 0, skip = 0;
const failures = [];
function record(id, ok, reason) {
  total++;
  const tag = ok ? colorize("PASS", "green") : colorize("FAIL", "red");
  console.log(`${id.padEnd(70)} ${tag}`);
  if (ok) {
    pass++;
  } else {
    fail++;
    failures.push({ id, reason });
    console.log(colorize(`    reason: ${reason}`, "red"));
  }
}
function recordSkip(id, reason) {
  total++;
  skip++;
  console.log(`${id.padEnd(70)} ${colorize("SKIP", "yellow")}  ${colorize(reason, "dim")}`);
}
async function assertThrowsCode(id, fn, codeWanted) {
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
  let cfgMod, gitMod;
  try {
    cfgMod = await import(pathToFileURL(CONFIG_PATH).href);
    gitMod = await import(pathToFileURL(GIT_PATH).href);
  } catch (err) {
    console.error("failed to load compiled modules:", err?.message || err);
    console.error("hint: run `npm run build` first.");
    process.exit(2);
  }

  const {
    BackupConfigError,
    getDefaultBackupConfig,
    loadBackupConfig,
    saveBackupConfig,
    validateRemote,
    assertPathUnderRuntime,
  } = cfgMod;
  const {
    BackupGitError,
    BACKUP_GITIGNORE,
    buildBackupGitignore,
    redactRemote,
    parseStatusPorcelain,
    gitAvailable,
    ensureBackupRepo,
    writeBackupGitignore,
    syncAgentsToBackupRepo,
    getGitStatus,
    commitBackup,
    isBackupRepoInitialized,
    hasOriginRemote,
  } = gitMod;

  console.log("=".repeat(78));
  console.log("CreativEdge backup unit/integration tests (Phase 5.6-A)");
  console.log("=".repeat(78));

  const runtimeRoot = await mkdtemp(join(tmpdir(), "ce-backup-"));

  // ----- backupConfig pure tests -------------------------------------
  console.log("");
  console.log(colorize("--- backupConfig (pure) ---", "dim"));

  // getDefaultBackupConfig: enabled=false, paths under runtime root.
  {
    const def = getDefaultBackupConfig(runtimeRoot);
    const ok =
      def.enabled === false &&
      def.includeSessionsDb === false &&
      def.remote === null &&
      def.repoDir.startsWith(runtimeRoot) &&
      def.sourceDir.startsWith(runtimeRoot);
    record("getDefaultBackupConfig: opt-in, safe paths", ok, JSON.stringify(def));
  }

  // assertPathUnderRuntime: passes for sub-path, throws for escape.
  {
    const inside = assertPathUnderRuntime(
      join(runtimeRoot, "backups", "agents-git"),
      runtimeRoot,
      "repoDir"
    );
    record("assertPathUnderRuntime: under-runtime path accepted", typeof inside === "string");
  }
  await assertThrowsCode(
    "assertPathUnderRuntime: parent-escape blocked",
    async () => assertPathUnderRuntime(join(runtimeRoot, "..", "escape"), runtimeRoot, "repoDir"),
    "path_escapes_runtime"
  );
  await assertThrowsCode(
    "assertPathUnderRuntime: empty path rejected",
    async () => assertPathUnderRuntime("", runtimeRoot, "repoDir"),
    "invalid_path"
  );

  // validateRemote: accepts github URLs, rejects others.
  record("validateRemote: null -> null", validateRemote(null) === null);
  record("validateRemote: empty -> null", validateRemote("") === null);
  record(
    "validateRemote: https github URL accepted",
    validateRemote("https://github.com/owner/repo.git") === "https://github.com/owner/repo.git"
  );
  record(
    "validateRemote: ssh github URL accepted",
    validateRemote("git@github.com:owner/repo.git") === "git@github.com:owner/repo.git"
  );
  await assertThrowsCode(
    "validateRemote: gitlab URL rejected",
    async () => validateRemote("https://gitlab.com/owner/repo.git"),
    "invalid_remote"
  );
  await assertThrowsCode(
    "validateRemote: arbitrary URL rejected",
    async () => validateRemote("ftp://example.com/repo"),
    "invalid_remote"
  );

  // saveBackupConfig + loadBackupConfig: round-trip, UTF-8 no BOM.
  {
    const saved = await saveBackupConfig(runtimeRoot, { enabled: true });
    record("saveBackupConfig: enabled patch applied", saved.enabled === true);
    const reread = await loadBackupConfig(runtimeRoot);
    record(
      "loadBackupConfig: round-trip preserves enabled=true",
      reread !== null && reread.enabled === true,
      JSON.stringify(reread)
    );
    const raw = await readFile(join(runtimeRoot, "backup.json"));
    record(
      "saveBackupConfig: writes UTF-8 with no BOM",
      raw[0] !== 0xef || raw[1] !== 0xbb || raw[2] !== 0xbf,
      `first 3 bytes: ${raw.slice(0, 3).toString("hex")}`
    );
  }

  // saveBackupConfig: remote validation flows through.
  await assertThrowsCode(
    "saveBackupConfig: gitlab remote rejected",
    async () =>
      saveBackupConfig(runtimeRoot, { remote: "https://gitlab.com/owner/repo.git" }),
    "invalid_remote"
  );

  // saveBackupConfig: repoDir escape blocked.
  await assertThrowsCode(
    "saveBackupConfig: repoDir escape blocked",
    async () =>
      saveBackupConfig(runtimeRoot, { repoDir: join(runtimeRoot, "..", "escape") }),
    "path_escapes_runtime"
  );

  // ----- backupGit pure tests ----------------------------------------
  console.log("");
  console.log(colorize("--- backupGit (pure) ---", "dim"));

  // redactRemote: strips creds, keeps non-cred URLs intact.
  record(
    "redactRemote: https with creds -> ***",
    redactRemote("https://user:tok@github.com/owner/repo.git") ===
      "https://***@github.com/owner/repo.git"
  );
  record(
    "redactRemote: https without creds unchanged",
    redactRemote("https://github.com/owner/repo.git") ===
      "https://github.com/owner/repo.git"
  );
  record(
    "redactRemote: ssh remote unchanged",
    redactRemote("git@github.com:owner/repo.git") === "git@github.com:owner/repo.git"
  );
  record("redactRemote: null -> null", redactRemote(null) === null);

  // buildBackupGitignore: includes all sensitive exclusions.
  {
    const gi = buildBackupGitignore();
    const required = [
      "sessions.db",
      "*.db",
      "*.sqlite",
      "logs/",
      "*.log",
      "providers.json",
      ".env",
      ".env.*",
      "*.key",
      "*.pem",
    ];
    const missing = required.filter((s) => !gi.includes(s));
    record(
      "buildBackupGitignore: includes all required exclusions",
      missing.length === 0,
      missing.length === 0 ? "" : `missing: ${JSON.stringify(missing)}`
    );
    record("buildBackupGitignore === BACKUP_GITIGNORE constant", gi === BACKUP_GITIGNORE);
  }

  // parseStatusPorcelain: handles empty, added, modified, deleted, untracked.
  {
    record(
      "parseStatusPorcelain: empty -> all zero, changed false",
      JSON.stringify(parseStatusPorcelain("")) ===
        JSON.stringify({ added: 0, modified: 0, deleted: 0, untracked: 0, changed: false })
    );
    // Build a NUL-separated `-z` style fixture.
    const fixture =
      "A  agents/lumi/memory/core_memory.md\0" +
      "M  agents/lumi/memory/episodic_memory.md\0" +
      " M agents/atlas/memory/core_memory.md\0" +
      " D agents/echo/memory/episodic_memory.md\0" +
      "?? agents/quant/memory/core_memory.md\0";
    const s = parseStatusPorcelain(fixture);
    const ok =
      s.added === 1 &&
      s.modified === 2 &&
      s.deleted === 1 &&
      s.untracked === 1 &&
      s.changed === true;
    record(
      "parseStatusPorcelain: mixed fixture counts correctly",
      ok,
      JSON.stringify(s)
    );
  }

  // ----- syncAgentsToBackupRepo: filter behavior ----------------------
  console.log("");
  console.log(colorize("--- syncAgentsToBackupRepo (pure filter) ---", "dim"));

  {
    const src = join(runtimeRoot, "agents");
    const repo = join(runtimeRoot, "backups", "agents-git");

    // Build a fake agents dir with a mix of allowed and forbidden files.
    const lumiMem = join(src, "lumi", "memory");
    await mkdir(lumiMem, { recursive: true });
    await writeFile(join(lumiMem, "core_memory.md"), "# Lumi core\n[ce-test:lumi]\n", "utf-8");
    await writeFile(join(lumiMem, "episodic_memory.md"), "## ts\n- gist: x\n", "utf-8");
    await writeFile(join(lumiMem, "secret.env"), "TOKEN=should-not-leak\n", "utf-8");
    await writeFile(join(lumiMem, "providers.json"), "{}", "utf-8");
    await writeFile(join(lumiMem, "tmp.lock"), "PID:1\n", "utf-8");
    await writeFile(join(lumiMem, "core_memory.md.tmp"), "transient\n", "utf-8");

    // Invalid slug name (uppercase) - should be skipped.
    const badMem = join(src, "INVALID", "memory");
    await mkdir(badMem, { recursive: true });
    await writeFile(join(badMem, "core_memory.md"), "leaked\n", "utf-8");

    const result = await syncAgentsToBackupRepo(src, repo);
    const lumiCore = join(repo, "agents", "lumi", "memory", "core_memory.md");
    const lumiEp = join(repo, "agents", "lumi", "memory", "episodic_memory.md");
    const leakedSecret = join(repo, "agents", "lumi", "memory", "secret.env");
    const leakedProviders = join(repo, "agents", "lumi", "memory", "providers.json");
    const leakedTmp = join(repo, "agents", "lumi", "memory", "core_memory.md.tmp");
    const leakedLock = join(repo, "agents", "lumi", "memory", "tmp.lock");
    const leakedInvalid = join(repo, "agents", "INVALID", "memory", "core_memory.md");

    const lumiCoreOK = await fileExists(lumiCore);
    const lumiEpOK = await fileExists(lumiEp);
    const secretOK = !(await fileExists(leakedSecret));
    const provOK = !(await fileExists(leakedProviders));
    const tmpOK = !(await fileExists(leakedTmp));
    const lockOK = !(await fileExists(leakedLock));
    const invalidOK = !(await fileExists(leakedInvalid));

    record(
      "syncAgentsToBackupRepo: copies core_memory.md",
      lumiCoreOK,
      "missing destination"
    );
    record(
      "syncAgentsToBackupRepo: copies episodic_memory.md",
      lumiEpOK,
      "missing destination"
    );
    record("syncAgentsToBackupRepo: does NOT copy .env", secretOK);
    record("syncAgentsToBackupRepo: does NOT copy providers.json", provOK);
    record("syncAgentsToBackupRepo: does NOT copy *.tmp", tmpOK);
    record("syncAgentsToBackupRepo: does NOT copy *.lock", lockOK);
    record("syncAgentsToBackupRepo: skips uppercase slug dir", invalidOK);
    record(
      "syncAgentsToBackupRepo: filesCopied count matches",
      result.filesCopied === 2,
      JSON.stringify(result)
    );
    record(
      "syncAgentsToBackupRepo: filesSkipped list is non-empty",
      Array.isArray(result.filesSkipped) && result.filesSkipped.length > 0,
      JSON.stringify(result.filesSkipped)
    );
  }

  // ----- git-dependent tests ------------------------------------------
  console.log("");
  console.log(colorize("--- backupGit (git-dependent) ---", "dim"));

  const haveGit = await gitAvailable();
  if (!haveGit) {
    recordSkip("ensureBackupRepo / writeBackupGitignore / status / commit",
               "git not on PATH; safe-skip");
  } else {
    const gitRoot = await mkdtemp(join(tmpdir(), "ce-backup-git-"));
    const repoDir = join(gitRoot, "agents-git");

    // Pre-flight: repo not yet initialized.
    record("isBackupRepoInitialized: false before init",
           (await isBackupRepoInitialized(repoDir)) === false);

    const init = await ensureBackupRepo(repoDir);
    record("ensureBackupRepo: created a new repo", init.created === true);
    record("isBackupRepoInitialized: true after init",
           (await isBackupRepoInitialized(repoDir)) === true);

    // Idempotent: second call should report created:false.
    const init2 = await ensureBackupRepo(repoDir);
    record("ensureBackupRepo: idempotent on existing repo", init2.created === false);

    // .gitignore.
    const gi1 = await writeBackupGitignore(repoDir);
    record(".gitignore written on first call", gi1.wrote === true);
    const gi2 = await writeBackupGitignore(repoDir);
    record(".gitignore idempotent on second call (no rewrite)", gi2.wrote === false);

    // No origin yet.
    record("hasOriginRemote: false on fresh repo",
           (await hasOriginRemote(repoDir)) === false);

    // Empty status: changed === false except for the new .gitignore (untracked).
    const status0 = await getGitStatus(repoDir);
    record("getGitStatus: returns SummaryShape",
           typeof status0.added === "number" &&
           typeof status0.changed === "boolean");

    // Stage + commit the .gitignore so we have a clean baseline.
    const c1 = await commitBackup(repoDir, "test: seed .gitignore");
    record(
      "commitBackup: writes commit when there is staged content",
      c1.committed === true && typeof c1.hash === "string" && c1.hash.length >= 7,
      JSON.stringify(c1)
    );

    // Re-run commit with nothing changed - should be a no-op.
    const c2 = await commitBackup(repoDir, "test: no-op");
    record(
      "commitBackup: no-op when nothing to commit",
      c2.committed === false && c2.hash === null
    );
  }

  // ----- summary -----------------------------------------------------
  console.log("");
  console.log(
    `total: ${total}   ${colorize("PASS " + pass, "green")}   ` +
      `${colorize("SKIP " + skip, skip > 0 ? "yellow" : "dim")}   ` +
      `${colorize("FAIL " + fail, fail > 0 ? "red" : "dim")}`
  );
  if (failures.length > 0) {
    console.log(colorize("\nfailing tests:", "red"));
    for (const f of failures) console.log(colorize(`  - ${f.id}  (${f.reason})`, "red"));
  }
  process.exit(fail === 0 ? 0 : 1);
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

main().catch((err) => {
  console.error("runner crashed:", err?.stack || err);
  process.exit(2);
});
