#!/usr/bin/env node
/**
 * CreativEdge — Windows packaged-build orchestrator.
 *
 * History
 * -------
 * Phase 9-B patch 4 introduced a try/finally orchestrator that:
 *   1. built backend + frontend (`scripts/build-deps.mjs`)
 *   2. rebuilt `better-sqlite3` IN PLACE in `../backend-api/node_modules`
 *      against Electron's bundled Node ABI
 *   3. ran `electron-builder --win` to package the now-Electron-ABI tree
 *   4. ALWAYS attempted to restore `better-sqlite3` to system-Node ABI
 *      in a `finally` block so dev backend would still work
 *
 * Phase 9-D-B2 (THIS REFACTOR) removes the source-tree mutation entirely.
 * The native rebuild now happens inside an `electron-builder` `afterPack`
 * hook (`electron/scripts/after-pack.mjs`), against the PACKAGED copy of
 * the backend at `<appOutDir>/resources/backend-api/`. The source tree
 * is never touched, so the `finally`-block restore is no longer needed.
 *
 * Current flow
 * ------------
 *   1. node scripts/build-deps.mjs                  (backend tsc + Vite)
 *   2. npx electron-builder --win
 *        ├── extraResources copies ../backend-api/node_modules (Node ABI)
 *        │   into <appOutDir>/resources/backend-api/node_modules
 *        ├── electron-builder invokes the afterPack hook
 *        │   (scripts/after-pack.mjs) which calls @electron/rebuild
 *        │   against the PACKAGED copy only
 *        └── electron-builder produces NSIS installer + win-unpacked
 *
 * The Electron version pre-flight (reading the resolved version from
 * `electron/node_modules/electron/package.json`) is preserved here as a
 * clear log line in the build banner, even though the afterPack hook
 * does its own version lookup. Keeping the banner is a debug aid for
 * the user.
 *
 * Privacy: prints version numbers + step labels + exit codes. Never
 * prints memory content, chat content, file content, or secrets.
 *
 * Exit codes:
 *   0   packaging succeeded; source backend-api/node_modules untouched
 *   1   build-deps or electron-builder failed
 *   2   environment problem (electron not installed; missing required
 *       file); nothing was changed in backend-api/node_modules
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ELECTRON_DIR = resolve(HERE, "..");
const REPO_ROOT = resolve(ELECTRON_DIR, "..");
const BACKEND_DIR = resolve(REPO_ROOT, "backend-api");

const ELECTRON_PKG = join(ELECTRON_DIR, "node_modules", "electron", "package.json");
const BACKEND_PKG = join(BACKEND_DIR, "package.json");
const BACKEND_SQLITE = join(
  BACKEND_DIR,
  "node_modules",
  "better-sqlite3",
  "package.json"
);

function logStep(label, ...rest) {
  console.log(`\n[build-win] ${label}`, ...rest);
}

function fatalEnv(msg) {
  console.error(`\n[build-win] ENV ERROR: ${msg}`);
  process.exit(2);
}

function run(label, bin, args, options = {}) {
  const cwd = options.cwd ?? ELECTRON_DIR;
  const spawnOpts = { cwd, stdio: "inherit", shell: true, ...options };
  logStep(`${label}: ${bin} ${args.join(" ")} (cwd=${cwd})`);
  const r = spawnSync(bin, args, spawnOpts);
  if (r.status !== 0) {
    const err = new Error(
      `${label} FAILED with exit ${r.status} (signal=${r.signal ?? "n/a"})`
    );
    err.code = r.status ?? 1;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Pre-flight checks
// ---------------------------------------------------------------------------

if (!existsSync(ELECTRON_PKG)) {
  fatalEnv(
    `electron/node_modules/electron/package.json not found. Run \`npm install\` from electron/ (or \`npm run setup:electron\` from repo root) first.`
  );
}
if (!existsSync(BACKEND_PKG)) {
  fatalEnv(`backend-api/package.json not found at ${BACKEND_PKG}.`);
}
if (!existsSync(BACKEND_SQLITE)) {
  fatalEnv(
    `backend-api/node_modules/better-sqlite3/package.json not found. Run \`npm install\` from backend-api/ (or \`npm run setup:backend\` from repo root) first.`
  );
}

let electronVersion;
try {
  const pkg = JSON.parse(readFileSync(ELECTRON_PKG, "utf-8"));
  electronVersion = pkg.version;
  if (typeof electronVersion !== "string" || electronVersion.length === 0) {
    fatalEnv("electron/node_modules/electron/package.json has no version field");
  }
} catch (e) {
  fatalEnv(`could not parse electron/node_modules/electron/package.json: ${e?.message || e}`);
}

let bsqliteVersion;
try {
  const pkg = JSON.parse(readFileSync(BACKEND_SQLITE, "utf-8"));
  bsqliteVersion = pkg.version;
} catch {
  bsqliteVersion = "(unknown)";
}

logStep(`packaging plan (Phase 9-D-B2 afterPack flow)`);
console.log(`  electron version:        ${electronVersion}`);
console.log(`  better-sqlite3 version:  ${bsqliteVersion}`);
console.log(`  electron dir:            ${ELECTRON_DIR}`);
console.log(`  backend dir:             ${BACKEND_DIR}`);
console.log(`  target:                  Windows x64 (NSIS via electron-builder)`);
console.log(
  `  source tree mutation:    NONE (afterPack rebuilds the packaged copy only)`
);

// ---------------------------------------------------------------------------
// Main flow — two steps. The native rebuild happens inside the
// electron-builder afterPack hook (electron/scripts/after-pack.mjs);
// source backend-api/node_modules is never touched.
// ---------------------------------------------------------------------------

try {
  // 1. Build backend dist + frontend dist (with VITE_API_URL pinned).
  run("step 1/2: build backend + frontend", "node", ["scripts/build-deps.mjs"]);

  // 2. Package the Windows binary. electron-builder copies the
  //    source backend-api/node_modules (still Node ABI) via
  //    extraResources, then invokes the afterPack hook (declared in
  //    electron/package.json:build.afterPack) which rebuilds
  //    `better-sqlite3` against Electron's bundled Node ABI inside
  //    the PACKAGED copy only.
  run("step 2/2: electron-builder --win (afterPack rebuilds packaged better-sqlite3)", "npx", [
    "electron-builder",
    "--win",
  ]);

  logStep("packaging succeeded");
} catch (err) {
  console.error(`\n[build-win] FAILED: ${err?.message || err}`);
  const code = typeof err?.code === "number" && err.code !== 0 ? err.code : 1;
  process.exit(code);
}

console.log(
  `\n[build-win] DONE. Artifacts in electron/dist-electron/ (CreativEdge-Setup-*.exe + win-unpacked/).`
);
console.log(
  `[build-win] Source backend-api/node_modules was NOT mutated. ` +
  `Dev backend (cd backend-api && npm run dev) should work without a restore step.`
);
