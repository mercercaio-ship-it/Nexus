# CreativEdge — Electron release runbook

This runbook covers the local Electron build flow, manual Windows
release procedure, and the most common troubleshooting paths.
It is the canonical operational reference for Phase 9-B / 9-C /
9-D-A / 9-D-B1 / 9-D-B3 / 9-D-B4 (the desktop slices).

CreativEdge currently ships **unsigned manual NSIS installers**
only. Auto-update, signing, scheduled update checks, silent
install, and any kind of background updater service are all
**intentionally deferred** — see [What is intentionally NOT
implemented](#what-is-intentionally-not-implemented) below.

> Treat this file as the up-to-date reference. The shorter
> `electron/NOTES.md` cross-links here for the operational
> details and only keeps the dev-side architecture notes inline.

---

## 1. Local Electron dev launch

The shortest path to a running desktop app from a clean checkout
on Windows (PowerShell):

```powershell
cd C:\Users\<you>\path\to\CreativEdge
npm run setup                    # one-time
npm --prefix electron install    # one-time, isolated Electron deps
npm run dev:electron             # each time
```

What `npm run dev:electron` does, in order:

1. Runs `electron/scripts/build-deps.mjs`:
   - `npm --prefix backend-api run build` → `backend-api/dist/`
   - `npm --prefix frontend run build` with
     `VITE_API_URL=http://127.0.0.1:3001` injected so the bundle
     emits absolute backend URLs.
2. Launches `electron .` from the `electron/` directory.
3. Electron main (`electron/main.mjs`):
   1. TCP-probes `127.0.0.1:3001` — bails out with a diagnostic
      page if the port is busy (does NOT silently second-spawn).
   2. Opens `~/.creativedge/logs/electron-backend-<ts>.log` and
      pipes the backend child's stdout/stderr there (the EPIPE
      workaround documented in `electron/NOTES.md`).
   3. Spawns the compiled Fastify backend as a child process bound
      to `127.0.0.1:3001`.
   4. Waits for `/healthz` to return 200 (30 s timeout).
   5. Starts a tiny localhost static HTTP server on
      `127.0.0.1:5174` serving `frontend/dist/`.
   6. Opens a hardened `BrowserWindow` pointed at
      `http://127.0.0.1:5174/` with the Phase 9-D-B4 preload
      script loaded (`electron/preload.cjs`, exposes
      `window.ceBridge.openExternal`).

Quit by closing the window. The `before-quit` hook terminates the
backend child with `SIGTERM` and closes the static server cleanly.

## 2. Packaged Windows build

```powershell
cd C:\Users\<you>\path\to\CreativEdge
npm run build:electron
```

This runs `electron/scripts/build-win.mjs` (the Phase 9-D-B2
`afterPack` flow — supersedes the Phase 9-B/patch-4 try/finally
orchestrator). The full flow:

1. **Pre-flight** — resolves the installed Electron version from
   `electron/node_modules/electron/package.json`, verifies the
   source `backend-api/node_modules/better-sqlite3` is present,
   prints a packaging-plan banner including
   `source tree mutation: NONE`.
2. **step 1/2: build-deps** — same as dev (backend + frontend
   bundles).
3. **step 2/2: `electron-builder --win`** — packages the binary
   using the config in `electron/package.json`:
   - `extraResources` copies the source
     `backend-api/node_modules` (still Node ABI) into
     `<appOutDir>/resources/backend-api/node_modules`.
   - `electron-builder` then invokes the `afterPack` hook declared
     in `electron/package.json:build.afterPack`, which points at
     `electron/scripts/after-pack.mjs`. The hook calls
     `@electron/rebuild` against the **packaged copy only**
     (`<appOutDir>/resources/backend-api/`), rebuilding
     `better-sqlite3` against Electron's bundled Node ABI for
     the resolved version + the architecture from
     `context.arch`.
   - `electron-builder` finishes packaging and produces the NSIS
     installer + `win-unpacked/` from the now-Electron-ABI
     packaged tree.
   - `files`: `main.mjs`, `preload.cjs`, `package.json`.
   - NSIS target with `oneClick:false`, `perMachine:false`,
     `allowToChangeInstallationDirectory:true`.

**Source tree is never mutated.** Unlike the prior flow, there is
no in-place `@electron/rebuild` against `backend-api/node_modules`
and no `finally`-block restore. After `npm run build:electron`,
`cd backend-api && npm run build` continues to work with no
recovery step required — the source `better_sqlite3.node` is still
the Node-ABI binary.

**Outputs:**

- `electron/dist-electron/CreativEdge-Setup-<version>.exe` — the
  NSIS installer (unsigned; Windows SmartScreen will warn).
- `electron/dist-electron/win-unpacked/CreativEdge.exe` — the
  unpacked binary; usable for testing without running the
  installer.

Neither of these is committed; `electron/.gitignore` excludes
`dist-electron/` + `node_modules/`.

## 3. Testing the packaged build

```powershell
# Phase 9-D-C3 - dynamic port allocation makes this sanity step
# OPTIONAL; the Electron wrapper now picks any free loopback port at
# startup. The check below is still useful to confirm nothing else
# is squatting on the legacy 3001/5174 ports (e.g. a stale
# `npm run dev` from backend-api or a leftover Vite dev server)
# before validating the dynamic allocation logs:
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue

# Launch the unpacked binary directly (skips the installer step).
& ".\electron\dist-electron\win-unpacked\CreativEdge.exe"
```

The Electron stdout log will now print the **dynamic** ports it
chose, e.g.:

```
[electron-main] static server listening on http://127.0.0.1:54321
[electron-main] port allocation attempt 1: assigned 127.0.0.1:54322
[electron-main] backend /healthz OK at http://127.0.0.1:54322/healthz after <ms>ms
[electron-main] boot ready: backend=http://127.0.0.1:54322 static=http://127.0.0.1:54321
```

Numbers will differ per launch; that is the expected behaviour.

Expected smoke test:

1. Window opens to the chat UI.
2. `~/.creativedge/logs/electron-backend-<ts>.log` is created.
3. Chat send works (Nexus replies if Claude CLI is authed; mock
   reply otherwise).
4. 🧭 Setup, 📊 Ops, Backup Push UX all reachable per their
   respective phase contracts.
5. Closing the window emits `backend child exited code=null
   signal=SIGTERM expected=true` in the Electron stdout log.

Optionally run the installer end-to-end:

```powershell
& ".\electron\dist-electron\CreativEdge-Setup-0.1.0.exe"
```

SmartScreen will show *"Windows protected your PC"* — this is
expected for unsigned installers; click **More info → Run anyway**
if you trust the source. Existing data in `~/.creativedge/` is
preserved across installs.

## 4. Validating backend / port cleanup after close

After closing the window, the **dynamic ports** printed in the
Electron stdout log (e.g. the `boot ready: backend=... static=...`
line — see §3) must be free again. Read the actual port numbers
from the log, then check them:

```powershell
# Substitute the actual port numbers from the
# "boot ready: backend=http://127.0.0.1:<X> static=http://127.0.0.1:<Y>"
# line in the Electron stdout log.
Get-NetTCPConnection -LocalPort <X> -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort <Y> -State Listen -ErrorAction SilentlyContinue
```

Both commands should return **no output**. If either returns a
listening entry, the cleanup hook in `electron/main.mjs` failed.
The Electron stdout log will show whether `terminating backend
child` / `closing static server` fired.

(CMD equivalent for the same check, with concrete numbers:
`netstat -ano | findstr ":<X>" | findstr "LISTENING"`.)

**Stale-port conflict test** — to confirm the wrapper actually
uses dynamic ports (and is not secretly still bound to 3001/5174),
occupy the legacy ports before launch and re-run:

```powershell
# In two extra PowerShell windows, start dummy listeners:
$L1 = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse("127.0.0.1"), 3001); $L1.Start()
$L2 = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse("127.0.0.1"), 5174); $L2.Start()

# Then launch CreativEdge from a third window.
# Expected: the Electron stdout log shows backend and static URLs
# on DIFFERENT ports (not 3001/5174), the app opens normally, and
# the two dummy listeners are unaffected after closing the app.

# Cleanup: in each dummy-listener window, $L1.Stop() / $L2.Stop().
```

## 5. Rebuilding native modules manually

Under the Phase 9-D-B2 `afterPack` flow you should not normally
need to touch `better-sqlite3` by hand — `npm run build:electron`
rebuilds the **packaged copy** automatically via
`electron/scripts/after-pack.mjs` and never touches the source
tree. Use the commands below only as recovery if some other tool
(or a stale checkout from a prior Phase 9-B/patch-4 build) has
left the source tree at the wrong ABI:

```powershell
# Restore dev (system Node ABI) -- this is what backend-api/node_modules
# should always be in. Use after a stale checkout from the legacy flow.
npm --prefix backend-api rebuild better-sqlite3

# Manually rebuild the packaged copy (almost never needed -- this is
# what the afterPack hook already does inside npm run build:electron):
npx --prefix electron @electron/rebuild `
  --module-dir "electron\dist-electron\win-unpacked\resources\backend-api" `
  -w better-sqlite3 -f --arch x64 --version <ELECTRON_VERSION>
```

(`<ELECTRON_VERSION>` = the value from
`electron/node_modules/electron/package.json:version`.)

## 6. Publishing a GitHub release (manual)

Auto-update is **not** implemented; releases are published
manually. Procedure:

1. **Bump the installer version** — edit
   `electron/package.json:version`. This is the source of truth
   for the installer artifact name (the resulting installer is
   named `CreativEdge-Setup-<version>.exe`).

2. **Build the installer**:
   ```powershell
   npm run build:electron
   ```

3. **Smoke-test the built `.exe`** per §3 above.

4. **Create the GitHub release**:
   - Go to https://github.com/michelbr84/CreativEdge/releases →
     *Draft a new release*.
   - Tag: `v<version>` (e.g. `v0.1.1`) — leading `v` is required;
     the manual update-check helper in
     `frontend/src/config/release.ts` strips the leading `v`
     before comparison.
   - Title: `CreativEdge v<version>`.
   - Notes template — short, user-facing:
     ```markdown
     ## Highlights
     - …

     ## Changes
     - …

     ## Install
     Download `CreativEdge-Setup-<version>.exe` below and run it.
     Windows SmartScreen will warn that the publisher is unknown
     — this is expected for unsigned builds.
     ```
   - Attach the `CreativEdge-Setup-<version>.exe` from
     `electron/dist-electron/`.
   - Mark **Pre-release** if this is a beta build; otherwise
     leave it as the latest release.
   - Publish.

5. Verify from inside CreativEdge: 📊 Ops → Update info →
   **Check latest release**. The badge should turn from `Up to
   date` to `Release available` if the user's installed version
   is older than the new tag.

## 7. How the manual release-check flow works

The Ops console's Update info card has two affordances:

- **Check latest release** — calls
  `GET https://api.github.com/repos/michelbr84/CreativEdge/releases/latest`
  on user click only. No auth header, no User-Agent identifying
  the install, no background poll. Returns one of `ok` /
  `no-release` (404) / `rate-limited` (403) / `network-error` /
  `error`. Shows a small badge (`Up to date` / `Release
  available` / `Unable to compare`) plus a friendly hint.

- **Open releases page ↗** — opens
  `https://github.com/michelbr84/CreativEdge/releases` in the
  user's OS default browser. Implementation path (Phase 9-D-B4):

  1. `frontend/src/config/release.ts:openExternalUrl()` is called.
  2. The URL is matched against `EXTERNAL_URL_ALLOWLIST` in
     `release.ts` (HTTPS only; host + path-prefix check).
  3. In Electron, the helper calls
     `window.ceBridge.openExternal(url)` exposed by
     `electron/preload.cjs`.
  4. The preload forwards via `ipcRenderer.invoke("ce:openExternal",
     url)` to the main process.
  5. The main process re-validates against its own copy of the
     allow-list (`classifyExternalUrl()` in `electron/main.mjs`)
     and calls `shell.openExternal(url)` — the only sandbox-safe
     way to open a URL in the user's default browser.
  6. In a regular browser tab (Vite dev mode), the helper falls
     back to `window.open(url, "_blank", "noopener,noreferrer")`.

  If any step fails — preload missing, popup blocker, allow-list
  rejection, `shell.openExternal` error — the Ops console shows
  a friendly error paragraph below the action row with the URL
  the user can copy into their browser.

  Prior to Phase 9-D-B4 the renderer's `window.open(...)` was
  rejected by `setWindowOpenHandler`'s blanket deny and never
  reached the `will-navigate → shell.openExternal` forwarder.
  That bug surfaced as `window.open denied for …` in the
  Electron stdout log; it is fixed by the preload bridge path
  above plus an allow-list-aware `setWindowOpenHandler`.

## 8. What is intentionally NOT implemented

| Concern | Status | Tracked under |
|---|---|---|
| `electron-updater` / auto-update | **NOT** implemented | Gated on signing-certificate decision |
| Signing (OV/EV cert + signtool) | **NOT** implemented | Gated on signing-certificate decision |
| `latest.yml` / release feed | **NOT** implemented | Gated on signing + auto-update |
| Background update polling | **NOT** implemented | Phase 9-D-B contract |
| Auto-download of installers | **NOT** implemented | Phase 9-D-B contract |
| Silent install | **NOT** implemented | Phase 9-D-B contract |
| Background updater service | **NOT** implemented | Phase 9-D-B contract |
| GitHub Actions release workflow | **NOT** implemented | Phase 9-D-B4 docs-only by design |
| Squirrel / `electron-squirrel-startup` | **NOT** implemented | NSIS is the only target |
| Crash report send-to-Anthropic | **NOT** implemented | Phase 9-D-C |
| Cost-budget alerts | **NOT** implemented | Phase 9-D-C |
| Dynamic free-port allocation | **NOT** implemented | Phase 9-D-C |

If any of these change in the future, this table moves and a
new phase opens in `todo.md`.

## 9. Troubleshooting

### 9.1. `NODE_MODULE_VERSION` mismatch on `better-sqlite3`

Symptom (packaged binary opens, then crashes with):

```
The module '…/backend-api/node_modules/better-sqlite3/build/Release/better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 137. This version of Node.js requires
NODE_MODULE_VERSION 123.
```

Cause: under the Phase 9-D-B2 `afterPack` flow this only happens
if the afterPack hook (`electron/scripts/after-pack.mjs`) failed
silently, was skipped, or `electron/package.json:build.afterPack`
points at the wrong path. The packaged copy at
`electron/dist-electron/win-unpacked/resources/backend-api/node_modules/better-sqlite3/build/Release/better_sqlite3.node`
is still the unmodified Node-ABI binary that `extraResources`
copied.

Fix: re-run `npm run build:electron` end-to-end and check the log
for `[after-pack] rebuild complete for better-sqlite3` near the
end. If the hook log is missing, verify
`electron/package.json:build.afterPack === "./scripts/after-pack.mjs"`
and that `electron/scripts/after-pack.mjs` is committed.

Manual recovery against an existing `win-unpacked/` tree (rare —
normally a clean re-build is faster):

```powershell
npx --prefix electron @electron/rebuild -f -w better-sqlite3 `
  --module-dir "electron\dist-electron\win-unpacked\resources\backend-api" `
  --version <ELECTRON_VERSION> --arch x64
```

`<ELECTRON_VERSION>` = the value from
`electron/node_modules/electron/package.json:version`. **Do NOT**
run `@electron/rebuild` against `../backend-api/node_modules` —
under the Phase 9-D-B2 flow the source tree is supposed to remain
Node-ABI. If it isn't, restore it with:

```powershell
npm --prefix backend-api rebuild better-sqlite3
```

### 9.2. `window.open denied for …`

Symptom: clicking **Open releases page ↗** in Ops does nothing;
the Electron stdout log shows `window.open denied for
https://github.com/michelbr84/CreativEdge/releases`.

Cause: prior to Phase 9-D-B4, `setWindowOpenHandler` returned
`{action:"deny"}` for every URL and `will-navigate` never fired.
The fix (Phase 9-D-B4): the handler now classifies URLs against
`EXTERNAL_URL_ALLOWLIST` and calls `shell.openExternal(url)` for
trusted ones; the preload bridge offers a cleaner IPC path that
bypasses `window.open` entirely.

If you still see this log in a current build:
- Make sure `electron/preload.cjs` is being shipped (check
  `electron/package.json:build.files`).
- Make sure the URL host + path-prefix appear in
  `EXTERNAL_URL_ALLOWLIST` (both in `electron/main.mjs` and
  `frontend/src/config/release.ts` — kept in sync by hand).
- If you intentionally added a new external URL, add it to both
  allow-lists.

### 9.3. Backend child exits unexpectedly

Symptom: the window stays open but the chat UI shows the
diagnostic page about a backend crash.

The crash log is at `~/.creativedge/logs/crash-<ts>.log`. Open
it (it's a small JSON record with the safe-allowlist fields —
no chat content, no memory content, no secrets). It includes
the tail of the backend log so you can see what the child wrote
just before exiting.

Common causes:
- Port 3001 was taken by a stale process between port preflight
  and spawn — kill the stale process and relaunch.
- The Claude CLI got stuck on a long stream — increase the
  per-call timeout in `backend-api/.../providers.json` or wait
  for the next request.
- A native module mismatch — see §9.1.

### 9.4. Stale ports after close

If `Get-NetTCPConnection -LocalPort 3001` or `5174` returns a
listening entry after the app closed, the cleanup hook failed.
Quick fix:

```powershell
Get-NetTCPConnection -LocalPort 3001 -State Listen `
  | Select-Object -ExpandProperty OwningProcess `
  | ForEach-Object { Stop-Process -Id $_ -Force }
```

(Same for port 5174.) Then check the Electron stdout log for
the missing `terminating backend child` / `closing static
server` lines and file a Phase 9-B lifecycle issue.

### 9.5. Missing Claude runtime / auth

Symptom: chat replies come from the `mock` provider (responses
look generic / canned); `/healthz` reports `degraded: true`.

The Claude CLI must be installed and authed on the host. Inside
CreativEdge: 📊 Ops → Diagnostics card → check `Claude installed`
+ `Claude auth`. If either is `no` / `unknown`, run
`claude` once in a terminal to complete the auth flow, then hit
the Ops console **Refresh** button.

### 9.6. Packaged-build validation checklist

Before publishing a release:

- [ ] `npm run build:electron` ends with `[build-win] DONE.`.
- [ ] `cd backend-api && npm run build` still succeeds (proves
      the `finally`-block restore put the system-Node ABI back).
- [ ] `electron/dist-electron/win-unpacked/CreativEdge.exe`
      opens as a normal user (NOT Administrator) and uses the
      normal-user runtime at `C:\Users\<you>\.creativedge\`.
- [ ] Chat / 🧭 Setup / 📊 Ops / Backup push UX all work.
- [ ] Open releases page ↗ opens the OS browser cleanly with
      no `window.open denied` log line.
- [ ] App close emits the expected SIGTERM sequence; ports 3001
      + 5174 are free afterwards.
- [ ] `electron/dist-electron/CreativEdge-Setup-<version>.exe`
      is present and installs end-to-end via the NSIS flow.

## 10. Related references

- `electron/NOTES.md` — architecture-focused dev notes
  (cross-links here for the operational steps).
- `frontend/src/config/release.ts` — the single source of truth
  for the GitHub repository coordinates AND the
  `EXTERNAL_URL_ALLOWLIST`. Change the URLs there, not in any
  component.
- `electron/main.mjs` — main process; lifecycle, port preflight,
  IPC bridge handler, allow-list-aware `setWindowOpenHandler` +
  `will-navigate`.
- `electron/preload.cjs` — preload bridge (Phase 9-D-B4); only
  surface exposed to the renderer is `window.ceBridge.openExternal`.
- `electron/scripts/build-win.mjs` — the Windows packaging
  orchestrator (Phase 9-B patch 4; unchanged by 9-D-B4).
- `todo.md` — phase log; full per-slice closure footers live at
  EOF.
