# CreativEdge Phase 9-B — Electron wrapper foundation

This directory holds the Electron desktop wrapper introduced in Phase 9-B.
It is an **isolated package** (its own `package.json`, its own
`node_modules`, its own lockfile) so adding Electron does not change the
existing `backend-api/` or `frontend/` package shapes.

The wrapper is the smallest functional foundation: it boots the existing
compiled backend as a child process, serves the existing Vite-built
frontend bundle over a tiny localhost HTTP server, and opens a hardened
`BrowserWindow` pointing at it. It does **not** introduce a first-run
wizard, crash logs, auto-update, signing, notarization, or cost
dashboard — those are Phase 9-C and Phase 9-D scope.

## Architecture

```
                    ┌──────────────────────────────────────┐
                    │ Electron main (electron/main.mjs)    │
                    │                                      │
                    │  ┌──────────────────────┐            │
                    │  │ spawn backend child  │  Node      │
                    │  │ CREATIVEDGE_PORT=    │  child_    │
                    │  │   3001               │  process   │
                    │  └──────────┬───────────┘            │
                    │             ▼                        │
                    │  ┌──────────────────────┐            │
                    │  │ wait for /healthz    │  fetch     │
                    │  │ (30s timeout)        │            │
                    │  └──────────────────────┘            │
                    │                                      │
                    │  ┌──────────────────────┐            │
                    │  │ start static HTTP    │  http      │
                    │  │ server on            │  stdlib    │
                    │  │ 127.0.0.1:5174       │            │
                    │  │ serves               │            │
                    │  │ frontend/dist/       │            │
                    │  └──────────────────────┘            │
                    │                                      │
                    │  ┌──────────────────────┐            │
                    │  │ BrowserWindow        │  hardened  │
                    │  │ loadURL              │  ctx-iso   │
                    │  │ http://127.0.0.1:5174│  no node   │
                    │  └──────────────────────┘  sandbox   │
                    └──────────────────────────────────────┘
```

## Why a static HTTP server instead of `file://`?

The backend's Phase 2.1 CORS policy allows origins from `localhost`,
`127.0.0.1`, or `[::1]`, plus requests with no `Origin` header. A
renderer loaded via `file://` would send `Origin: null`, which fails
the policy. Serving the bundle over `http://127.0.0.1:5174` makes the
renderer's origin a localhost URL, so CORS passes without any backend
change. The static server is a 50-line Node stdlib implementation with
path-traversal guarding and a simple SPA fallback to `index.html`.

## Why fixed port 3001 for the backend?

Phase 9-B is the foundation; the frontend bundle has the backend URL
baked in at build time via `VITE_API_URL=http://127.0.0.1:3001`. A
dynamic free-port allocation is the Phase 9-C/D refinement (it requires
either a preload script exposing the runtime port to the renderer or a
small generated config file the renderer reads at boot). The fixed
port keeps the foundation slice small and reviewable; if port 3001 is
in use, the spawned backend child will fail fast and Electron will
quit with a clear log line.

## Security hardening baseline

The `BrowserWindow` is created with:

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- `webSecurity: true`
- no preload script (renderer needs only standard browser `fetch`)
- `setWindowOpenHandler` → deny (no popups)
- `will-navigate` restricted to the static server's origin; external
  `http://` / `https://` links open in the OS browser via `shell.openExternal`
- backend bound to `127.0.0.1` only (no LAN exposure)
- never writes `.env`, never prompts for / stores any API key,
  never calls any provider or external endpoint from the main process

## Dev flow

```bash
# First time only
cd electron
npm install

# Each time
cd electron
npm run dev
```

`npm run dev` chains:

1. `node scripts/build-deps.mjs` — builds `backend-api/dist/` and
   `frontend/dist/` (with `VITE_API_URL=http://127.0.0.1:3001`)
2. `electron .` — launches the Electron main process

The backend child is spawned with the **system `node` binary** in dev
mode, so the existing `better-sqlite3` build (which targets system Node
ABI) loads cleanly. Backend stdout/stderr are forwarded to Electron's
own stdout/stderr.

## Build flow (Windows `.exe`)

```bash
cd electron
npm run rebuild:sqlite   # one-time, before first build
npm run build
```

Produces `electron/dist-electron/CreativEdge-Setup-0.1.0.exe`
(unsigned). The `npm run rebuild:sqlite` step runs
`@electron/rebuild --module-dir ../backend-api -w better-sqlite3 -f`
so the bundled `better-sqlite3.node` matches Electron's Node ABI
(see "Native module" below).

The `electron-builder` config in `package.json` includes:

- the Electron main + `package.json` inside the asar
- `backend-api/dist/` + `backend-api/node_modules/` + `backend-api/package.json` as `extraResources`
- `frontend/dist/` as `extraResources`
- `agents/` + `orchestrator/` as `extraResources` (the registry and
  per-agent template files the backend reads at runtime)

At runtime inside the packaged binary, `main.mjs` sets
`CREATIVEDGE_PROJECT_ROOT = process.resourcesPath` so the backend's
`projectRoot` resolver finds `orchestrator/registry.json` inside the
bundle rather than walking up the unrelated filesystem tree the .exe
was launched from.

## Native module — `better-sqlite3`

`better-sqlite3@^11.7.0` is a native module loaded by the backend's
SQLite layer (Phase 5.5-A migrations + FTS5). It must match the Node
ABI of whichever runtime loads it.

| Mode | Runtime loading `better-sqlite3` | ABI |
|---|---|---|
| Dev (`npm run dev` in `electron/`) | system `node` (spawned by `main.mjs`) | system Node ABI |
| Packaged (`.exe`) | Electron's bundled Node (via `ELECTRON_RUN_AS_NODE=1`) | Electron Node ABI |

The dev mode "just works" because backend-api/node_modules was already
built against system Node when you ran `npm run setup` (Phase 9-A).

The packaged mode **requires** `@electron/rebuild` to recompile
`better-sqlite3` against Electron's embedded Node ABI before
electron-builder packages it. Run `npm run rebuild:sqlite` once before
your first `npm run build`.

**Phase 9-D-B2 (2026-05-21) refactor — afterPack rebuild.** Building
with `npm run build:electron` no longer mutates the source
`backend-api/node_modules/`. Instead, the Phase 9-B/patch-4
orchestrator (`electron/scripts/build-win.mjs`) is slimmed to two
steps — `scripts/build-deps.mjs` then `npx electron-builder --win` —
and `electron-builder`'s `afterPack` hook
(`electron/scripts/after-pack.mjs`) calls `@electron/rebuild` against
the packaged copy of the backend at
`<appOutDir>/resources/backend-api/`. The Node-ABI binary that ships
out of `backend-api/node_modules` is replaced ONLY inside the
packaged tree; the source tree is read-only throughout the build.

The legacy `npm run rebuild:sqlite` script and the manual recovery
`cd backend-api && npm rebuild better-sqlite3` step are now strictly
recovery aids — they are not part of the normal build flow. The
flow contract is:

```
npm run build:electron
  └── build-deps                                  (backend tsc + Vite)
  └── electron-builder --win
        ├── extraResources copy (Node-ABI source tree → packaged tree)
        ├── afterPack hook → @electron/rebuild on PACKAGED copy only
        └── NSIS installer + win-unpacked output
```

After the build, `cd backend-api && npm run build` continues to work
with no restore step (the source `better_sqlite3.node` is still the
Node-ABI binary). The Phase 9-B `finally`-block restore is gone.

If something fails mid-build, the source tree is still intact; the
worst-case outcome is an incomplete `win-unpacked/` directory and a
missing installer — recovery is just re-running `npm run
build:electron`. The legacy manual restore command remains documented
in `docs/electron-release-runbook.md` §9.1 as a belt-and-suspenders
recovery if any other tool ever leaves the source tree at the wrong
ABI.

## Windows validation target

```powershell
cd <path-to-your-clone-of-CreativEdge>
npm run setup:electron

# Dev mode
npm run dev:electron
#   Expected: desktop window opens; chat UI loads; /healthz responds;
#   no console errors.

# Packaged build
npm --prefix electron run rebuild:sqlite
npm run build:electron
#   Expected: electron/dist-electron/CreativEdge-Setup-0.1.0.exe
#   produced. Running the .exe opens the desktop app to the chat UI.

# After building, restore backend-api's better-sqlite3 to system ABI
# if you want to keep using `cd backend-api && npm run dev`:
cd backend-api
npm rebuild better-sqlite3
```

## Manual update flow (Phase 9-D-B1)

CreativEdge currently ships **unsigned manual NSIS installers**. There
is **no auto-updater**, **no background update check**, and **no
telemetry** of any kind. The local app version is never compared to a
remote feed unless the user explicitly clicks the **Check latest
release** button in the Ops console.

```
Ops console → Update info card
  ├── App version            (from the running app)
  ├── Backend version        (from /ops/diagnostics; only shown when it differs)
  ├── Auto-update            (always "deferred" in this build)
  ├── Releases page          (https://github.com/michelbr84/CreativEdge/releases)
  ├── [Check latest release] (one-shot GitHub public REST API call)
  └── [Open releases page ↗] (window.open → shell.openExternal)
```

**To update CreativEdge manually:**

1. Open the Ops console (📊 Ops in the chat chrome).
2. Click **Check latest release**. The UI shows a small badge:
   `Up to date`, `Release available`, or `Unable to compare`.
3. Click **Open releases page ↗** to open
   https://github.com/michelbr84/CreativEdge/releases in your default
   browser.
4. Download the `CreativEdge-Setup-<version>.exe` asset.
5. Run the installer. Windows SmartScreen will warn that the publisher
   is unknown — this is expected for unsigned builds. Click **More
   info → Run anyway** if you trust the source.
6. Existing data in `~/.creativedge/` is preserved across installs
   (sessions DB, memory artifacts, backup repo, logs).

**What the Check latest release button does and does not do:**

| Behaviour | Status |
|---|---|
| Calls GitHub public REST API on click | yes |
| Runs in the background or on a timer | **no** |
| Sends an auth token / installation ID | **no** |
| Downloads the new installer | **no** |
| Runs the new installer | **no** |
| Writes anything to `~/.creativedge/` | **no** |

**Why auto-update is deferred:** auto-update on Windows is only safe
when the installer is **code-signed**, otherwise an attacker who
controls the release feed (or a MITM on the download) could deliver
arbitrary code that the updater would run with the user's privileges.
Wiring `electron-updater` without a signing certificate would be a
security regression. The auto-update path is gated on:

1. A signing-certificate decision (OV vs EV; cert ownership; CI vs
   local release builds).
2. A stable release-feed policy (latest.yml, channels, rollback).

Both are tracked under **Phase 9-D-B / 9-D-C** in the project `todo.md`.

The shared constants the Ops console uses (`owner`, `repo`,
`releasesUrl`, `latestReleaseApiUrl`) live in
`frontend/src/config/release.ts` — change the repo coordinates there
if the project moves.

## External URL opening + manual release runbook (Phase 9-D-B4)

External links (today: the GitHub Releases page in the Ops
console) are routed through a small preload bridge:

```
Renderer
  └── window.ceBridge.openExternal(url)        (electron/preload.cjs)
        └── ipcRenderer.invoke("ce:openExternal", url)
              └── main: classifyExternalUrl(url) against
                  EXTERNAL_URL_ALLOWLIST                 (electron/main.mjs)
                    └── shell.openExternal(url)         (OS default browser)
```

The renderer never calls unrestricted `window.open`; the
`setWindowOpenHandler` in main is allow-list-aware as a
defence-in-depth fallback, and `will-navigate` forwards
allow-listed HTTPS URLs the same way. In Vite dev mode (a
regular browser tab) the helper in
`frontend/src/config/release.ts` falls back to
`window.open(url, "_blank", "noopener,noreferrer")`.

The allow-list is intentionally tiny (HTTPS-only; host +
path-prefix). Today it covers exactly one entry: the GitHub
Releases page for `michelbr84/CreativEdge`. Adding a new
external destination requires editing **both**
`electron/main.mjs:EXTERNAL_URL_ALLOWLIST` and
`frontend/src/config/release.ts:EXTERNAL_URL_ALLOWLIST` — the
renderer copy is for UI hints; the main-process copy is the
authoritative gate.

Full operational details — local dev, packaged Windows build,
manual GitHub release procedure, `better-sqlite3` ABI rebuild,
port-cleanup validation, and what is intentionally NOT
implemented (no auto-update, no signing, no background polling,
no scheduled checks, no silent install, no background updater
service) — are in **[`docs/electron-release-runbook.md`](../docs/electron-release-runbook.md)**.
This file (`electron/NOTES.md`) keeps the architecture notes;
the runbook is the operational reference.

## Backup push (Phase 9-D-B3)

Backups are local-only by default. The Phase 9-D-B3 slice adds an
**explicit opt-in push** affordance in two places — the chat-side
Backup card and the Ops console Backup card — both gated behind a
second-confirmation modal (`BackupPushConfirmModal`) with a required
"I understand this will push to my configured remote" checkbox. The
modal defaults focus to Cancel, accepts Esc to dismiss, and does NOT
auto-confirm on Enter. The push button is disabled with a friendly
explainer whenever any of the following is false: `gitReady`,
`enabled`, `repoReady`, `remoteConfigured` (the four readiness
fields already returned by `GET /backup/status`).

Push uses the user's local Git setup — HTTPS credential helper or
SSH agent — and **CreativEdge never asks for, collects, or stores
any credential or token** (no `localStorage`, no `sessionStorage`,
no cookies, no provider/env writes). The remote URL is shown only
as the server-side redacted string already returned by
`/backup/status.remote`. If push fails (auth missing, remote
unreachable), the commit still lands locally and the friendly
`pushReason` from `/backup/run` is rendered verbatim — already free
of secrets per the Phase 5.6-A `redactRemote()` contract. No
scheduling, no auto-push, no destructive restore, no background job
of any kind is wired by this slice.

## Dynamic free-port allocation (Phase 9-D-C3, 2026-05-22)

Phase 9-B's fixed `BACKEND_PORT=3001` + `FRONTEND_PORT=5174` model
is replaced with runtime free-port allocation. The Electron wrapper
no longer requires either port to be available; instead it asks the
OS kernel for a free ephemeral loopback port for each side.

**Backend port** — allocated by `allocateFreePort("127.0.0.1")` in
`electron/main.mjs`: bind a temporary `net.createServer` to
`127.0.0.1:0`, read `address().port`, close the probe. Spawn the
backend child with `CREATIVEDGE_PORT=<assignedPort>` and
`CREATIVEDGE_HOST=127.0.0.1` (the backend's Phase 2.1 entry point
already honours both env vars). If `EADDRINUSE` trips between probe
close and child bind, the wrapper retries the alloc+spawn cycle once
(`SPAWN_RETRY_LIMIT = 1`) before surfacing a friendly diagnostic
page. The Phase 9-B fixed-port preflight (`probeBackendPortState`
on 3001) is removed — dynamic allocation makes port-busy diagnostics
moot.

**Static-server port** — `startStaticServer` calls
`listen(0, "127.0.0.1")` and reads `server.address().port`
synchronously in the listen callback. No race window because the
server is ours; whatever port the kernel hands us is the port we
serve from.

**Runtime API-base discovery** — the dynamic backend + static URLs
are pushed into the renderer via
`webPreferences.additionalArguments`:

```
--creativedge-backend-base=http://127.0.0.1:<dynamicBackendPort>
--creativedge-frontend-base=http://127.0.0.1:<dynamicFrontendPort>
--creativedge-packaged                  (only when app.isPackaged)
```

The preload script (`electron/preload.cjs`) parses these from
`process.argv` at preload time and exposes them on the existing
`window.ceBridge` surface as a synchronous
`getRuntimeConfig()` method. `frontend/src/api/client.ts` reads
this at module init and uses the resolved backend base URL for
every fetch / SSE request. Resolution order:

1. `window.ceBridge.getRuntimeConfig().backendBaseUrl` (Electron
   preload bridge — canonical inside the desktop shell).
2. `import.meta.env.VITE_API_URL` (build-time pin — kept as a
   belt-and-suspenders fallback so a partial rollback of this
   slice degrades to the Phase 9-B fixed-port behaviour).
3. Empty string -> same-origin via the Vite dev proxy (for
   normal `npm run dev` browser usage).

`electron/scripts/build-deps.mjs` continues to pin
`VITE_API_URL=http://127.0.0.1:3001` for the build, but inside
Electron that value is never consulted because the preload
bridge always wins.

**Validation knobs** — Electron's stdout log now prints two clear
lines on every boot:

```
[electron-main] static server listening on http://127.0.0.1:<port>
[electron-main] port allocation attempt 1: assigned 127.0.0.1:<port>
[electron-main] backend /healthz OK at http://127.0.0.1:<port>/healthz after <ms>ms
[electron-main] boot ready: backend=http://127.0.0.1:<port> static=http://127.0.0.1:<port>
```

To validate that the wrapper is using dynamic ports (and not still
secretly assuming 3001/5174), occupy both ports with dummy listeners
before running `npm run dev:electron` — the wrapper should still
open, pick different ports, and leave the dummy listeners alone.
The post-close cleanup check should show the *dynamic* ports free
(the dummy listeners remain on 3001/5174).

**What is NOT changed** —
- Backend code is unchanged (`CREATIVEDGE_PORT` was already supported).
- `frontend/vite.config.ts` dev proxy still targets `127.0.0.1:3001`
  for `npm run dev` browser usage (unrelated to Electron).
- `electron/scripts/build-deps.mjs` still pins the
  `VITE_API_URL=http://127.0.0.1:3001` env for the bundle build
  (belt-and-suspenders fallback only; the preload bridge always
  supersedes inside Electron).
- No new dependencies. No telemetry. No LAN binding. No 0.0.0.0.
- No changes to chat / backup / crash-report / releases / budget
  surfaces — they continue to work end-to-end because every API
  call resolves through `API_BASE` and that resolution is now
  dynamic.

## Out of scope for Phase 9-B (deferred to 9-C / 9-D)

- First-run wizard UI (Phase 9-C — wraps Phase 2.2-B `/healthz`
  readiness signals + Phase 5.6-A `/backup/*`).
- Crash-log surfacing UI ("report this" button writing to
  `~/.creativedge/logs/crash-<ts>.log`) — Phase 9-D.
- Auto-update (`electron-updater` or manual update-check link) — Phase 9-D.
- Cost dashboard (reading `agent_events.usage_json` from Phase 2.6) — Phase 9-D.
- Code signing / notarization — Phase 9-D.
- Dynamic free-port allocation (preload-injected backend URL) — Phase 9-C/D.
- macOS / Linux build targets — deferred until after Windows ships.
- Installer branding / icons / NSIS customization beyond defaults — Phase 9-D polish.
