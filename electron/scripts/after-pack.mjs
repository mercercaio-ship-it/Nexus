#!/usr/bin/env node
/**
 * CreativEdge Phase 9-D-B2 — electron-builder afterPack hook.
 *
 * Refactor of the Phase 9-B/patch-4 packaging-rebuild strategy.
 *
 * Old flow (build-win.mjs patch 4):
 *   1. build-deps (backend tsc + frontend Vite)
 *   2. @electron/rebuild against ../backend-api/node_modules   <-- mutates source tree
 *   3. electron-builder --win
 *   4. finally: npm rebuild better-sqlite3 in ../backend-api    <-- restores source tree
 *
 * Old flow's failure mode: if step 4 ever failed (network down, npm
 * hiccup), the dev tree was stranded at Electron ABI and the next
 * `cd backend-api && npm run dev` crashed with NODE_MODULE_VERSION.
 *
 * New flow (Phase 9-D-B2):
 *   1. build-deps (unchanged)
 *   2. electron-builder --win
 *        ├── extraResources copies ../backend-api/node_modules (Node ABI)
 *        │   into <appOutDir>/resources/backend-api/node_modules
 *        ├── electron-builder invokes THIS afterPack hook
 *        │   └── @electron/rebuild rebuilds better-sqlite3 in the
 *        │       PACKAGED copy only, never the source tree
 *        └── electron-builder produces NSIS installer + win-unpacked
 *   (no finally; no restore; source backend-api/node_modules untouched)
 *
 * Privacy: prints version numbers + step labels + paths. Never prints
 * chat content, memory content, prompts, env vars, secrets.
 *
 * Failure semantics: throws to electron-builder. electron-builder aborts
 * with a non-zero exit code; the win-unpacked/ tree is left in place
 * but no installer is produced. The error message identifies the
 * module that failed to rebuild.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const ELECTRON_DIR = resolve(HERE, "..");
const ELECTRON_PKG_JSON = join(ELECTRON_DIR, "node_modules", "electron", "package.json");

function log(msg, ...rest) {
  console.log(`[after-pack] ${msg}`, ...rest);
}

function fail(msg) {
  // electron-builder will treat a thrown Error as a hard build failure.
  throw new Error(`[after-pack] ${msg}`);
}

/**
 * Map electron-builder's numeric `Arch` enum to the string identifier
 * that `@electron/rebuild` expects via its `arch` option.
 *
 * builder-util's `Arch` enum (verified via
 * electron/node_modules/builder-util/out/arch.d.ts):
 *   ia32 = 0
 *   x64  = 1
 *   armv7l = 2
 *   arm64 = 3
 *   universal = 4
 */
function archToString(numericArch) {
  switch (numericArch) {
    case 0: return "ia32";
    case 1: return "x64";
    case 2: return "armv7l";
    case 3: return "arm64";
    case 4: return "universal";
    default: return null;
  }
}

/**
 * Resolve Electron's installed binary version from the same file
 * build-win.mjs uses, so the rebuild target matches the actual binary
 * even if devDependencies pins a `^` range. `context.packager.info`
 * usually carries this too, but the on-disk lookup is the canonical
 * source we already trust elsewhere in the repo.
 */
function resolveElectronVersion(context) {
  // Prefer electron-builder's own framework metadata when present.
  try {
    const v = context?.packager?.info?.framework?.version;
    if (typeof v === "string" && v.length > 0) return v;
  } catch { /* fall through */ }
  if (!existsSync(ELECTRON_PKG_JSON)) {
    fail(
      `electron/node_modules/electron/package.json not found at ${ELECTRON_PKG_JSON}. ` +
      `Run \`npm install\` from electron/ (or \`npm run setup:electron\` from repo root) first.`
    );
  }
  try {
    const pkg = JSON.parse(readFileSync(ELECTRON_PKG_JSON, "utf-8"));
    if (typeof pkg.version !== "string" || pkg.version.length === 0) {
      fail(`electron/node_modules/electron/package.json has no version field`);
    }
    return pkg.version;
  } catch (e) {
    fail(`could not parse electron/node_modules/electron/package.json: ${e?.message || e}`);
  }
  return null; // unreachable; fail() throws
}

/**
 * Default export = the function electron-builder calls.
 *
 * `context: AfterPackContext`:
 *   - outDir: <repo>/electron/dist-electron
 *   - appOutDir: <repo>/electron/dist-electron/win-unpacked
 *   - packager: <PlatformPackager>
 *   - electronPlatformName: "win32" | "darwin" | "linux"
 *   - arch: numeric Arch enum (1 === x64)
 *   - targets: Array<Target>
 *
 * After extraResources copy, the packaged backend lives at:
 *   <appOutDir>/resources/backend-api/
 *     ├── dist/
 *     ├── node_modules/        <-- still Node ABI at this point
 *     │   └── better-sqlite3/  <-- target of the rebuild below
 *     └── package.json
 */
export default async function afterPack(context) {
  const electronPlatformName = context?.electronPlatformName ?? "unknown";
  const archStr = archToString(context?.arch);
  if (archStr === null) {
    fail(`unrecognised context.arch=${String(context?.arch)} (expected 0..4)`);
  }
  const appOutDir = context?.appOutDir;
  if (typeof appOutDir !== "string" || appOutDir.length === 0) {
    fail(`context.appOutDir is missing or empty`);
  }
  // electron-builder layouts on Windows + Linux place resources at
  // <appOutDir>/resources/; macOS places them at
  // <appOutDir>/<ProductName>.app/Contents/Resources/. We only ship
  // Windows today (per electron/package.json:build.win), so the
  // simple "resources" join is correct here. If the project ever
  // adds a darwin target, this branch needs updating.
  const packagedBackendDir = join(appOutDir, "resources", "backend-api");
  const packagedNodeModules = join(packagedBackendDir, "node_modules");
  const packagedSqlitePkg = join(packagedNodeModules, "better-sqlite3", "package.json");

  if (!existsSync(packagedBackendDir)) {
    fail(`packaged backend dir not found at ${packagedBackendDir}. extraResources copy may have changed.`);
  }
  if (!existsSync(packagedNodeModules)) {
    fail(`packaged backend node_modules not found at ${packagedNodeModules}. extraResources copy may have changed.`);
  }
  if (!existsSync(packagedSqlitePkg)) {
    fail(`packaged better-sqlite3 not found at ${packagedSqlitePkg}. backend-api may not have been npm-installed before packaging.`);
  }

  const electronVersion = resolveElectronVersion(context);

  log(`platform:                ${electronPlatformName}`);
  log(`arch:                    ${archStr}`);
  log(`appOutDir:               ${appOutDir}`);
  log(`packaged backend dir:    ${packagedBackendDir}`);
  log(`electron version:        ${electronVersion}`);
  log(`rebuild target module:   better-sqlite3`);
  log(`source tree:             NOT touched (source backend-api/node_modules stays at system-Node ABI)`);

  // Load @electron/rebuild via the local electron/ install. Using
  // createRequire with the absolute ELECTRON_DIR/package.json base
  // resolves from electron/node_modules even though this file uses
  // ESM (where bare `require` is not available).
  const requireFromElectronDir = createRequire(join(ELECTRON_DIR, "package.json"));
  let rebuildFn;
  try {
    const mod = requireFromElectronDir("@electron/rebuild");
    rebuildFn = mod.rebuild ?? mod.default;
  } catch (e) {
    fail(`could not load @electron/rebuild from electron/node_modules: ${e?.message || e}`);
  }
  if (typeof rebuildFn !== "function") {
    fail(`@electron/rebuild did not expose a callable rebuild(); package may be too old or corrupt.`);
  }

  log(`invoking @electron/rebuild against the packaged copy…`);
  try {
    // The @electron/rebuild API: `buildPath` is the directory whose
    // `./node_modules` is walked. `onlyModules` scopes the rebuild
    // to a single native module to keep the operation fast and
    // deterministic. `force: true` makes it rebuild even if the
    // .node-version marker says it's already current (because the
    // packaged copy was just freshly cp'd from the source tree).
    await rebuildFn({
      buildPath: packagedBackendDir,
      electronVersion,
      arch: archStr,
      onlyModules: ["better-sqlite3"],
      force: true,
    });
  } catch (e) {
    fail(`@electron/rebuild FAILED for better-sqlite3 in packaged copy: ${e?.message || e}`);
  }

  log(`rebuild complete for better-sqlite3 in ${packagedNodeModules}`);
  log(`source backend-api/node_modules was NOT mutated; dev backend ABI remains Node-compatible.`);
}
