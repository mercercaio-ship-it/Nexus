# CreativEdge — Troubleshooting

> **Phase 10-F expanded 2026-05-22.** Canonical troubleshooting
> guide for the current CreativEdge desktop app, backend, Electron
> packaging flow, and docs work. Baseline: Phase 9 ✅ Complete /
> Windows validated 2026-05-22 — Windows is the validated desktop
> packaging platform. Phase 10 docs phase active. If a recipe
> here disagrees with the source, the source wins;
> [`../todo.md`](../todo.md) is the canonical phase-state oracle.

This guide is for **users**, **developers**, **operators**, and
**AI coding agents** triaging real issues. Find the closest
matching symptom, work the recipe, escalate up the decision
tree in §24 if stuck.

Cross-links:
- [`README.md`](README.md) — docs map.
- [`../README.md`](../README.md) — project entry-point + Quick Start.
- [`user-guide.md`](user-guide.md) — what the app does.
- [`developer-setup.md`](developer-setup.md) — repo layout / build / test / git workflow.
- [`electron-release-runbook.md`](electron-release-runbook.md) — full Electron operational reference.

---

## 1. First 5 checks (fast triage)

When something looks wrong, work these checks **in order**
before diving into a specific recipe. Most of the recipes
below assume you've already done this.

```powershell
# 1. Repo root
cd C:\path\to\CreativEdge

# 2. Working-tree state
git status -s

# 3. Stale processes (kill the CreativEdge ones; never blindly stop every node.exe)
Get-Process node, electron, bun -ErrorAction SilentlyContinue
Get-Process node, electron, bun -ErrorAction SilentlyContinue | Stop-Process -Force

# 4. Legacy fixed-port squat check (informational only after Phase 9-D-C3)
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue

# 5. Code sanity (these must pass for any docs / Electron work)
cd backend-api
npm run build
cd ../frontend
npm run typecheck
cd ..
node --check electron/main.mjs
node --check electron/preload.cjs
node --check electron/scripts/build-deps.mjs
node --check electron/scripts/build-win.mjs
node --check electron/scripts/after-pack.mjs

# Open the runtime logs directory (Electron backend + crash records)
explorer "$env:USERPROFILE\.creativedge\logs"
```

If all 5 pass and the issue persists, work the matching recipe
below.

---

## 2. App does not open

**Symptom:** `npm run dev:electron` exits immediately, or the
packaged `.exe` window appears for a second and disappears, or
no window appears at all.

### 2.1 Diagnostic steps

1. **Check the Electron stdout log** for the canonical
   boot-ready line:
   ```
   [electron-main] boot ready: backend=http://127.0.0.1:<port> static=http://127.0.0.1:<port>
   ```
   If this line is missing, boot failed upstream.

2. **Check the backend child log** at
   `C:\Users\<you>\.creativedge\logs\electron-backend-<latest>.log`
   for the last lines before exit. The backend uses pino, so
   each line is JSON.

3. **Check the crash record** (if it wrote) at
   `C:\Users\<you>\.creativedge\logs\crash-<latest>.log`. The
   structured record's `exit.code`, `exit.signal`, and the
   `backendLogTail` (in the file on disk; not in the prepared
   crash report) give the strongest signal.

4. **Stale processes** — see §6.

### 2.2 Common causes

- **Stale processes holding the runtime** — most common. Run §6.
- **Backend health check timed out** — see §4.
- **Missing build artifacts** (frontend `dist/` or backend
  `dist/` were never built). The Phase 9-D-C3
  `scripts/build-deps.mjs` pre-flight builds both, but a
  failed pre-flight can leave a corrupt state.
- **`better-sqlite3` NODE_MODULE_VERSION mismatch in the
  packaged binary** — see §8.
- **`winCodeSign` failure during an earlier `build:electron`**
  left a partial `electron/dist-electron/win-unpacked/` — see
  §7.
- **Windows SmartScreen blocking the installer first run**
  (unsigned NSIS) — see §10.

### 2.3 Recovery commands

```powershell
# Kill stale processes (see §6 for safe scope)
Get-Process node, electron, bun -ErrorAction SilentlyContinue | Stop-Process -Force

# Backend build
cd backend-api
npm run build
cd ..

# Frontend typecheck and build
cd frontend
npm run typecheck
npm run build
cd ..

# Electron script syntax (covers all 5 Electron scripts)
node --check electron/main.mjs
node --check electron/preload.cjs
node --check electron/scripts/build-deps.mjs
node --check electron/scripts/build-win.mjs
node --check electron/scripts/after-pack.mjs

# Try again
npm run dev:electron
```

If the packaged path is failing:

```powershell
# Rebuild the packaged binary
npm run build:electron
& ".\electron\dist-electron\win-unpacked\CreativEdge.exe"
```

If the diagnostic page loads (Electron window opens with an
error page), that's actually a healthy outcome — work from the
page's "How to recover" hints + the linked log path.

---

## 3. Backend `/healthz` fails

**Symptom:** The chat UI shows a red banner *"Backend is not
reachable at …"* and panels don't load.

### 3.1 What `/healthz` means

`GET /healthz` is the Phase 2.1 readiness endpoint. It returns
provider readiness (Claude installed / auth status / mock
availability), runtime directory readiness, SQLite + FTS5
readiness, seeded agent count, and the service identifier
`creativedge-backend`. If you can curl it and get a JSON
payload, the backend is alive.

### 3.2 Identifying the actual backend URL

This is the **single most common confusion**.

- **Browser dev mode** (`npm run dev:backend` in Terminal A):
  backend listens on **`http://127.0.0.1:3001/healthz`**. The
  Vite dev proxy in Terminal B forwards `/healthz` to it.

- **Electron dev or packaged mode**: the backend listens on a
  **dynamic port** (Phase 9-D-C3). Read the actual port from
  the Electron stdout log:
  ```
  [electron-main] backend /healthz OK at http://127.0.0.1:<dynamicBE>/healthz after <ms>ms
  [electron-main] boot ready: backend=http://127.0.0.1:<dynamicBE> static=http://127.0.0.1:<dynamicFE>
  ```
  Substitute the actual integer port (e.g. `52335`, `49998`)
  into the URL.

### 3.3 What to check

| Symptom | Likely cause |
|---|---|
| Curl times out at the address | Backend isn't running, OR you're hitting the wrong port |
| Curl returns `404` on `/healthz` | A stale backend process from an earlier project version is bound to 3001 — stop it and restart |
| Curl returns JSON but `setupRequired: true` | Backend is fine; Setup wizard should auto-open. See §15 |
| Curl returns JSON but `claude.installed: false` | Backend is fine; Claude Code CLI is missing. See §15. Chat still works via mock fallback |
| Curl returns JSON but `dbReady: false` | Runtime directory may be on a path where SQLite can't write. Check disk space, permissions on `C:\Users\<you>\.creativedge` |
| Curl can't even resolve | Wrong host (must be `127.0.0.1`, never `localhost` aliased to `::1` only) |

### 3.4 Recovery commands

```powershell
# Browser dev
cd backend-api
npm run build
npm run dev
# In another shell:
curl http://127.0.0.1:3001/healthz

# Electron dev — first read the dynamic port from the log
# (the "boot ready" line above), then:
curl http://127.0.0.1:<dynamicBE>/healthz
# Replace <dynamicBE> with the actual integer port from the log.
```

---

## 4. Dynamic ports — confusion and verification

Phase 9-D-C3 replaced the Phase 9-B fixed `BACKEND_PORT=3001`
+ `FRONTEND_PORT=5174` model with **runtime free-port
allocation**. **The Electron runtime no longer requires either
port to be available.**

### 4.1 Which ports are used where

| Mode | Backend | Static / Frontend |
|---|---|---|
| Browser dev (`npm run dev:backend` + `npm run dev:frontend`) | 3001 (fixed by `CREATIVEDGE_PORT` default) | 5173 (Vite default) — proxies to 3001 |
| Electron dev (`npm run dev:electron`) | **Dynamic** — printed in stdout | **Dynamic** — printed in stdout |
| Packaged (`npm run build:electron` → exe) | **Dynamic** — printed in stdout | **Dynamic** — printed in stdout |

### 4.2 Reading dynamic ports from the log

In Electron dev or packaged, look for these lines in the
Electron stdout:

```
[electron-main] static server listening on http://127.0.0.1:<dynamicFE>
[electron-main] port allocation attempt 1: assigned 127.0.0.1:<dynamicBE>
[electron-main] backend /healthz OK at http://127.0.0.1:<dynamicBE>/healthz after <ms>ms
[electron-main] boot ready: backend=http://127.0.0.1:<dynamicBE> static=http://127.0.0.1:<dynamicFE>
```

The `<dynamicBE>` and `<dynamicFE>` placeholders in this guide
are **placeholders**. **Do NOT type literal `<` and `>`** into
PowerShell — substitute the actual integer numbers from your
log.

### 4.3 Verifying cleanup after close

After closing the Electron app, both dynamic ports should be
free. Use the actual numbers from the log:

```powershell
# Wrong (DO NOT do this):
# Get-NetTCPConnection -LocalPort <dynamicBE> -State Listen -ErrorAction SilentlyContinue

# Right (substitute the real numbers — e.g. 52335 / 52334):
Get-NetTCPConnection -LocalPort 52335 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 52334 -State Listen -ErrorAction SilentlyContinue
```

Both should return no output once the app is closed cleanly.
If either returns a listening entry, the cleanup hook in
`electron/main.mjs` failed — see §6.

### 4.4 Sanity check that dynamic allocation actually happened

To confirm the wrapper isn't secretly still binding to 3001 /
5174:

1. Read the boot-ready line — the ports should be **different
   each run** (typically large numbers like 49997, 52334).
2. Optionally, start dummy listeners on 3001 / 5174 in two
   extra PowerShell windows, then run `npm run dev:electron`.
   The wrapper should still open and pick **different** ports;
   the dummy listeners should remain undisturbed.

For the dummy-listener recipe see
[`electron-release-runbook.md`](electron-release-runbook.md) §4.

---

## 5. Stale process / port cleanup

**Symptoms:**
- "Port busy" / `EADDRINUSE` errors during `npm run dev:backend` or `npm run dev:electron`.
- Backend child still showing in Task Manager after closing the desktop app.
- App opens but behaves erratically (wrong data, stale sessions).
- New logs aren't appearing under `~/.creativedge/logs/`.

### 5.1 Diagnostic commands

```powershell
# See which CreativEdge-related processes are alive
Get-Process node, electron, bun -ErrorAction SilentlyContinue

# Optionally, see what's holding the legacy dev ports
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
```

`Get-NetTCPConnection`'s `OwningProcess` field is the PID;
cross-reference with `Get-Process -Id <pid>` to identify it
before killing.

### 5.2 Recovery

```powershell
# Kill all node / electron / bun processes (only safe if you
# recognise them all as CreativEdge-related — don't blindly
# nuke every node.exe on the machine, especially on shared dev
# environments)
Get-Process node, electron, bun -ErrorAction SilentlyContinue | Stop-Process -Force

# Then verify ports are free (using the actual dynamic ports
# from the Electron log if applicable, or the legacy 3001 /
# 5174 for browser dev)
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
```

### 5.3 Why 3001 / 5174 still appear in this guide

Those numbers are the **legacy fixed dev defaults**, retained
for browser-dev mode (the Vite proxy still targets 3001).
Inside Electron, Phase 9-D-C3 dynamic allocation made them
**not required**. The recipes still mention 3001 / 5174 only
because:

1. Browser-dev mode still uses them.
2. Many legacy test runners default to `127.0.0.1:3001`.
3. Sanity-checking that nothing legacy is squatting is a
   harmless extra check before validating dynamic-allocation
   logs.

---

## 6. `winCodeSign` symbolic link permission error

**Symptom (packaging):** `npm run build:electron` fails during
the `electron-builder --win` step with:

```
Cannot create symbolic link : A required privilege is not held by the client
```

or a similar error mentioning `winCodeSign`, `symbolic link`,
or `EPERM` under `%LOCALAPPDATA%\electron-builder\Cache\winCodeSign\`.

### 6.1 What this is (and isn't)

This is **NOT** a CreativEdge app-logic issue. It's a Windows
+ electron-builder packaging interaction:

- `electron-builder` caches Windows code-signing tooling under
  `%LOCALAPPDATA%\electron-builder\Cache\winCodeSign\` and
  unpacks the archive with symlinks.
- Creating symlinks on Windows requires elevation **unless**
  Windows Developer Mode is enabled.
- The unpack fails, and the build aborts before `afterPack`
  ever runs. **Do not confuse this with a `better-sqlite3`
  ABI / `afterPack` failure (§8) — those happen later in the
  pipeline.**

### 6.2 Three recoveries (pick one)

**Option A — Run PowerShell as Administrator** (one-off, no
system change):

1. Right-click PowerShell → **Run as administrator**.
2. `cd C:\path\to\CreativEdge`.
3. `npm run build:electron`.

**Option B — Enable Windows Developer Mode** (recommended
permanent fix; permits non-admin symlink creation
system-wide):

1. **Settings → Privacy & security → For developers**.
2. Toggle **Developer Mode** on.
3. Re-run `npm run build:electron` in a normal (non-admin)
   PowerShell.

**Option C — Clear the cache** if it's already in a broken
half-extracted state:

```powershell
Remove-Item "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign" -Recurse -Force -ErrorAction SilentlyContinue
npm run build:electron
```

`electron-builder` re-downloads + re-unpacks the tooling on
the next run.

### 6.3 Verify the fix worked

After successful packaging you should see in the build output:

```
[build-win] packaging plan (Phase 9-D-B2 afterPack flow)
[build-win]   source tree mutation: NONE
[build-win] step 1/2: build backend + frontend
[build-win] step 2/2: electron-builder --win (afterPack rebuilds packaged better-sqlite3)
[after-pack] platform:                win32
[after-pack] arch:                    x64
[after-pack] appOutDir:               …\electron\dist-electron\win-unpacked
[after-pack] rebuild complete for better-sqlite3 in …\resources\backend-api\node_modules
[build-win] packaging succeeded
[build-win] DONE. Artifacts in electron/dist-electron/
```

Full operational reference:
[`electron-release-runbook.md`](electron-release-runbook.md) §9.

---

## 7. `better-sqlite3 NODE_MODULE_VERSION` error

**Symptom (packaged binary):** The packaged app opens, the
window appears, then the backend dies a few seconds later and
the diagnostic page loads. The backend log
(`~/.creativedge/logs/electron-backend-<ts>.log`) contains:

```
The module '…better-sqlite3\build\Release\better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION <X>. This version of Node.js requires
NODE_MODULE_VERSION <Y>.
```

### 7.1 What ABI mismatch means

Native Node modules are compiled against a specific Node.js
ABI version. CreativEdge uses **two different ABIs**
depending on who's running the backend:

| Mode | Runtime loading `better-sqlite3` | ABI |
|---|---|---|
| Dev (`npm run dev:backend` or `npm run dev:electron`) | system `node` | system Node ABI |
| Packaged (`.exe`) | Electron's bundled Node via `ELECTRON_RUN_AS_NODE=1` | Electron Node ABI |

### 7.2 The Phase 9-D-B2 afterPack contract

The Phase 9-D-B2 `afterPack` hook
(`electron/scripts/after-pack.mjs`) handles this automatically
during packaging:

- **Source `backend-api/node_modules/`** stays at system Node
  ABI. `npm run dev:backend` continues to work.
- **Packaged copy at
  `electron/dist-electron/win-unpacked/resources/backend-api/`**
  gets a fresh Electron-ABI rebuild via `@electron/rebuild`
  scoped to `onlyModules: ["better-sqlite3"]`.

This means: **after a successful `npm run build:electron`,
running `cd backend-api && npm run build` should still exit 0**
— the source tree is intact.

### 7.3 Verification + recovery

**Check the build log for the afterPack markers:**

```
[after-pack] platform:                win32
[after-pack] arch:                    x64
[after-pack] packaged backend dir:    …\dist-electron\win-unpacked\resources\backend-api
[after-pack] rebuild target module:   better-sqlite3
[after-pack] source tree:             NOT touched (source backend-api/node_modules stays at system-Node ABI)
[after-pack] rebuild complete for better-sqlite3 in …\resources\backend-api\node_modules
```

If those lines are **missing** from your build output, the
`afterPack` hook didn't run. Most likely cause: the
`build.afterPack` field in `electron/package.json` was lost.
Verify it points at `"./scripts/after-pack.mjs"`.

**Recovery — re-run the full build:**

```powershell
npm run build:electron
& ".\electron\dist-electron\win-unpacked\CreativEdge.exe"
```

**Post-package source-tree sanity check:**

```powershell
cd backend-api
npm run build
# Expect: exit 0. If it fails with NODE_MODULE_VERSION, the
# source tree was accidentally mutated by some other tool.
cd ..
```

**Worst-case manual recovery (source tree corrupted):**

```powershell
cd backend-api
npm rebuild better-sqlite3
cd ..
```

This rebuilds against system Node ABI. Don't edit native module
files by hand.

---

## 8. Packaged build succeeds but app fails

**Symptom:** `npm run build:electron` completes with
`[build-win] DONE. Artifacts in electron/dist-electron/`, but
launching the packaged binary shows the diagnostic page or
crashes immediately.

### 8.1 Mini-checklist

1. **Confirm the packaged copy exists:**
   ```powershell
   Test-Path .\electron\dist-electron\win-unpacked\resources\backend-api
   ```
   Must return `True`. If `False`, packaging didn't copy
   `extraResources`; rerun `npm run build:electron`.

2. **Inspect the backend log:**
   ```powershell
   Get-ChildItem "$env:USERPROFILE\.creativedge\logs\electron-backend-*.log" |
     Sort-Object LastWriteTime -Descending |
     Select-Object -First 1 |
     Get-Content -Tail 80
   ```
   The bottom of the log is usually the most informative
   line.

3. **Inspect the latest crash record (if one exists):**
   ```powershell
   Get-ChildItem "$env:USERPROFILE\.creativedge\logs\crash-*.log" |
     Sort-Object LastWriteTime -Descending |
     Select-Object -First 1 |
     Get-Content
   ```
   The JSON's `exit.code`, `exit.signal`, and `backendLogTail`
   fields are the strongest signals.

4. **Verify the dynamic backend `/healthz`** — read the port
   from the Electron stdout (see §4.2), then curl it.

5. **Verify `better-sqlite3` ABI** — see §7.

6. **Verify the build had afterPack markers** — see §7.3.

7. **Post-package backend build still passes** — see §7.3.

### 8.2 If all checks pass and the app still fails

Open the Ops console → Crash reports card (described in
[`user-guide.md`](user-guide.md) §7.5). The local-only
prepared report is the cleanest piece of evidence to attach
to a bug report (see §25 below for the template).

Full packaging reference:
[`electron-release-runbook.md`](electron-release-runbook.md).

---

## 9. Release link does not open

**Symptom:** Clicking **Open releases page ↗** in the Ops
console's Update info card does nothing, or the Electron log
shows `window.open denied for …`.

### 9.1 Expected behavior

A healthy click produces:

```
[electron-main] ipc openExternal succeeded for https://github.com/CreativEdgeSolutions/Nexus/releases
```

…and your OS default browser opens the GitHub releases page.

### 9.2 Current allow-list

Today the allow-list is a **single entry**:
- Host: `github.com`
- Path prefix: `/CreativEdgeSolutions/Nexus/releases`
- Protocol: `https:` only

Anything else is rejected on both renderer and main process.

### 9.3 Common causes

- **Preload bridge unavailable** — running in browser dev
  mode (not Electron). The fallback uses
  `window.open(url, "_blank", "noopener,noreferrer")`; your
  browser's popup blocker may block it. Allow popups for the
  dev origin (`http://127.0.0.1:5173`).
- **URL not on the allow-list** — only the canonical releases
  page is allowed today. If you're trying a different URL,
  see §9.4.
- **Stale Electron build** pre-Phase-9-D-B4. The Phase 9-D-B3
  walkthrough surfaced the `window.open denied` log spam;
  Phase 9-D-B4 fixed it. Rebuild + re-run if you're on an
  older binary.

### 9.4 What NOT to do

- **Do not widen the allow-list casually.** Adding hosts is
  a security decision that must be considered explicitly.
- **Do not bypass the bridge** to open arbitrary external
  URLs. The bridge is what keeps a renderer compromise from
  forwarding hostile URLs through `shell.openExternal`.
- **Do not commit a personal fork's URL** into the allow-list
  for a one-off test. Adding a new destination requires
  editing BOTH `electron/main.mjs:EXTERNAL_URL_ALLOWLIST` and
  `frontend/src/config/release.ts:EXTERNAL_URL_ALLOWLIST`
  (defence-in-depth; the renderer copy is for UI hints, the
  main-process copy is the authoritative gate). Both must
  stay in sync.

Full reference:
[`electron-release-runbook.md`](electron-release-runbook.md) §9.2.

---

## 10. Manual latest-release check fails

**Symptom:** Ops console → Update info card → **Check latest
release** shows an error badge / hint.

### 10.1 The button is user-click-only

The release check is **never** automatic, never background,
never on a timer. It only fires when you click. It calls the
GitHub public REST API once per click:
`https://api.github.com/repos/CreativEdgeSolutions/Nexus/releases/latest`.

No auth header is sent. No User-Agent identifying the
installation is sent. No installer is downloaded. No silent
install. No telemetry.

### 10.2 Possible outcomes

| Badge / hint | Meaning |
|---|---|
| `Up to date` | Your local version matches the latest GitHub tag |
| `Release available` | GitHub has a newer tag than your local app |
| `Unable to compare` | One side or the other is missing / unparseable |
| `No published release found on GitHub yet` | The repo has no releases yet (HTTP 404 from API) |
| `GitHub API rate limit reached` | HTTP 403; wait until reset (the message includes the reset time when available) |
| `Could not reach GitHub` | Network failure (offline / firewall / DNS) |

### 10.3 Recovery

- **No release found** — that's fine; nothing is broken.
- **Rate limit** — wait until reset. Or click **Open releases
  page ↗** instead, which opens GitHub Releases in the
  browser without any API call.
- **Network error** — check whether your machine can reach
  GitHub at all (`Test-NetConnection api.github.com -Port 443`
  in PowerShell).

The app **never blocks** on a release check. If the check
fails, chat / Setup / Ops / Backup all still work.

---

## 11. Backup is disabled or push button unavailable

**Symptom:** Backup panel (chat-side or Ops console) shows
the **Run backup + push** button disabled, often with a
friendly hint like *"Configure a remote first"* or
*"Backup is disabled."*

### 11.1 The four ordered readiness blockers (Phase 9-D-B3)

The button is disabled if **any** of these is false, in this
order:

1. **`gitReady`** — Is `git` on `PATH`? Verify:
   ```powershell
   git --version
   ```
   If missing, install Git for Windows from
   <https://git-scm.com/>.
2. **`enabled`** — Have you turned backup on via the Setup
   wizard's Backup step or the Backup panel's config form?
3. **`repoReady`** — Does
   `C:\Users\<you>\.creativedge\backups\agents-git\.git\` exist?
   It's created lazily on **first dry-run**. Click **Run
   dry-run** to create it.
4. **`remoteConfigured`** — Has the local `origin` remote been
   set? Configure it in the Backup config form.

### 11.2 Three operations

| Button | Effect | Safety |
|---|---|---|
| **Run dry-run** | Shows what would be committed; writes nothing | Always safe |
| **Run (no push)** | Commits to local git mirror; does NOT push to remote | Safe; no network |
| **Run backup + push** | Commits AND pushes; requires explicit second-confirmation modal | Network call to your configured remote |

### 11.3 The push second-confirmation modal

When all four readiness blockers are green and you click **Run
backup + push**:

- The modal shows the **redacted remote URL** (no credentials).
- A required checkbox: *"I understand this will push to my
  configured remote."*
- Default focus on **Cancel**.
- **Esc** dismisses.
- **Enter** does NOT auto-confirm.
- **Confirm** stays disabled until the checkbox is ticked.

### 11.4 Credentials are NOT stored in the app

Auth uses your **local Git setup** (HTTPS credential helper
or SSH agent). CreativEdge:
- Never asks for a password.
- Never stores a token.
- Never reads `~/.gitconfig` for credentials.
- Never writes anything to `localStorage` / `sessionStorage`
  / cookies about credentials.

**Never paste your token into the app.** Configure Git auth
the normal way (`git credential` helper, SSH agent, etc).

### 11.5 No background push

There is no scheduled backup, no auto-push on app boot, no
auto-push on chat completion, no auto-push on shutdown. Push
only happens when you click + confirm.

---

## 12. Backup push fails

**Symptom:** You clicked **Run backup + push** and confirmed,
but the result reads `committed=<hash> but push was not
completed: <reason>` — the commit landed locally, the push
didn't.

### 12.1 Common causes

| `pushReason` (or close to it) | Likely cause |
|---|---|
| `Authentication failed` / `403` / `401` | Your local Git credential helper isn't configured for the remote, OR the credential expired |
| `Could not resolve host` | DNS / network failure |
| `Connection refused` / timeout | Network or firewall |
| `rejected — non-fast-forward` | The remote moved ahead of you; pull / reset before pushing |
| `branch does not match upstream` | The local branch doesn't have a tracking branch on the remote |

The Phase 9-D-B3 contract surfaces `pushReason` verbatim from
the server — already server-side-redacted of secrets per
Phase 5.6-A `redactRemote()`.

### 12.2 Recovery

1. **Verify the remote works outside the app:**
   ```powershell
   cd C:\Users\<you>\.creativedge\backups\agents-git
   git remote -v
   git fetch origin
   ```
   If `fetch` fails the same way, the issue is with the
   remote / your auth — fix it outside the app first.

2. **Verify your credential helper:**
   - HTTPS: `git config --global credential.helper` — should
     return `manager` (Git Credential Manager on Windows).
   - SSH: `ssh -T git@github.com` — should greet you by
     username.

3. **Try a no-push backup first** (`Run (no push)`) to confirm
   the local commit path works. If that succeeds, the issue
   is push-only.

4. **Try a dry-run** (`Run dry-run`) to confirm the
   file-collection path works.

### 12.3 What NOT to do

- **Do not paste your token into the app.** The app has no
  field for it; never will. Configure Git auth via the OS's
  credential helper or SSH agent.
- **Do not edit `backup.json` to embed credentials** in the
  remote URL — the Phase 5.6-A `redactRemote()` server-side
  guard exists specifically to keep credentials out of UI
  surfaces, and the app's validation refuses embedded
  credentials in remote URLs anyway.

---

## 13. Crash reports are empty / Prepare fails

**Symptom:** Ops console → Crash reports card shows *"No
crash reports found — that's a good thing. Nothing is sent
automatically anyway."*

### 13.1 No crash reports is the happy path

The card is local-only and populates from
`C:\Users\<you>\.creativedge\logs\crash-*.log`. Empty list =
backend has never crashed unexpectedly. Nothing is wrong.

### 13.2 Generating a crash report intentionally (dev only)

To test the crash UX:

```powershell
# Start dev Electron
npm run dev:electron
# Read the backend child pid from the Electron stdout:
#   [electron-main] backend child pid=12345
# In another PowerShell shell:
Stop-Process -Id 12345 -Force
```

A new `crash-<ts>.log` should appear in
`~/.creativedge/logs/`, a diagnostic page should load in
Electron, and the Ops console Crash reports card should show
the new entry on next refresh.

### 13.3 Prepare report fails

If clicking **Prepare report** errors out:

| Error hint | Likely cause |
|---|---|
| `invalid id` / `400` | The filename doesn't match the strict allow-list regex `^crash-[A-Za-z0-9._:T+\-]+\.log$` (Phase 9-D-C2) |
| `missing file` | The file was deleted between list and prepare |
| `oversized file` | The file is over the 256 KB cap |
| `parse failure` | The on-disk JSON is malformed (rare) |

These are all defensive Phase 9-D-C2 server-side guards.

### 13.4 What the prepared report contains

A strict 17-field structured allow-list (verbatim):
`kind`, `schemaVersion`, `timestamp`, `appVersion`,
`electronVersion`, `nodeVersion`, `packaged`, `platform`,
`arch`, `osRelease`, `backendEntry`, `frontendDist`,
`backendLogPath`, `backendPort`, `frontendPort`,
`backendChildPid`, `exit{code,signal,expected}`.

### 13.5 What the prepared report NEVER contains

- Chat content / message bodies.
- Memory contents.
- Prompts.
- Environment variables.
- API keys, auth tokens, cookies.
- `localStorage` contents.
- SSH keys, Git credentials.
- The free-text `backendLogTail` (on-disk file keeps it; the
  prepared report drops it until a tested redaction sanitizer
  lands).

### 13.6 No automatic send

There is no Send / Upload / Email / GitHub-issue button
anywhere on the card. Copy / Download are the only outputs.
Sharing a crash report is a manual user action only.

---

## 14. Claude Code CLI missing or auth unknown

**Symptom:** Setup wizard's Claude Code step shows `installed:
no` or `authStatus: unknown`. `/healthz` confirms the same.

### 14.1 This is not a blocker

The mock provider keeps the app fully usable. Chat continues
to work; replies are generated by the mock provider rather
than real Claude. Routing, sessions, memory, all UI surfaces
function normally.

### 14.2 To install Claude Code CLI

CreativEdge does **not** bundle or configure the Claude Code
CLI. Install per Anthropic's instructions and authenticate
via the CLI's own login flow.

After installation:

```powershell
claude --version
```

Should print a version string. If it does, click **Re-check**
in the Setup wizard or refresh `/healthz` from the Ops
console's Diagnostics card — the primary provider should flip
to `claude` with `installed: true`.

### 14.3 What CreativEdge does NOT do

- Does NOT read `.env` for any provider config.
- Does NOT use `ANTHROPIC_API_KEY` (the CLI manages its own
  auth).
- Does NOT need any environment variable to use Claude.
- Does NOT prompt for any credential.

If you have an Anthropic API key for some other tool, that's
outside CreativEdge's surface.

Full developer-side reference:
[`developer-setup.md`](developer-setup.md) §11.

---

## 15. Chat shows "backend unreachable" but the reply persists

**Symptom (Electron):** You sent a message; a red banner
*"Backend is not reachable at …"* appears briefly; within ~2.5
seconds the banner clears and the assistant's reply shows up.
Or: the banner appears persistently, and switching sessions /
refreshing reveals the reply was actually saved.

### 15.1 The Phase 9-B chat-recovery class explained

Chromium-on-Electron occasionally reports a **false-negative
fetch failure** for `fetch("/chat")` even when the backend
successfully wrote both the user turn and the assistant reply
to SQLite. This is a known Chromium edge case with hijacked
SSE streams (Fastify's `reply.hijack()` pattern).

Phase 9-B added a three-stage recovery in the frontend that
catches this:

1. **Immediate recovery** — checks the session you're in for
   the just-sent turn.
2. **listSessions fallback** — for the first-turn case where
   the SSE `meta` event didn't fire before the rejection.
3. **Bounded retry polling** — re-checks at 250 / 750 / 1500
   ms (total ≈2.5s) in case the backend hadn't finished
   writing yet.

Net effect: the red banner usually auto-clears within ~2.5
seconds; no Ctrl+R needed; no session switch needed.

### 15.2 What you should do

- **Wait briefly.** ~2.5 seconds is enough for the recovery.
- **Don't resend** — the backend already persisted the turn.
  Resending creates duplicates.
- **If the banner persists** longer than ~5 seconds, it's
  probably a real backend issue — see §4 / §3.
- **Inspect sessions** via the sidebar; the persisted reply
  is there if recovery just hasn't surfaced it.

---

## 16. Sessions or memory look wrong

**Symptom:** Sessions sidebar shows stale entries; memory
seems to ignore something you remember saying; search returns
unexpected results.

### 16.1 What's local

- Sessions + messages: `~/.creativedge/sessions.db` (SQLite +
  FTS5).
- Per-agent runtime memory:
  `~/.creativedge/agents/<slug>/memory/{core,episodic}_memory.md`.
- Source agent templates (read-only at runtime):
  `agents/<slug>/memory/*.md` in the repo.

### 16.2 Common confusions

- **Memory not picked up** — the memory promotion flow is
  modal-gated (Phase 5.2-A). A memory-candidate card has to
  be **explicitly confirmed**. Dismissed candidates don't
  reach disk.
- **Old memory still showing** — runtime memory persists
  across sessions and app reinstalls (the `~/.creativedge/`
  tree survives uninstall). Use `/forget core <text>` or
  `/forget episodic <text>` with the confirm modal to delete
  surgically.
- **Search misses old content** — FTS5 indexes new content
  on insert; if you imported `sessions.db` from another
  machine, the index may need a rebuild. Restart the
  backend.

### 16.3 What NOT to do

- **Don't manually edit `~/.creativedge/agents/<slug>/memory/*.md`
  files** unless you understand the format. Use the admin
  memory editor or `/forget` slash command — both run the
  Phase 5.2-D `safeReplaceOnce` guard (single-match safety,
  sensitive-content guard, atomic write).
- **Back up before destructive changes.** Configure backup
  (`/backup status` to check) and `Run (no push)` once before
  surgical `/forget` operations.

### 16.4 Where to read more

- User-facing memory walkthrough:
  [`user-guide.md`](user-guide.md) §5.
- Safe customization:
  [`customize-an-agent.md`](customize-an-agent.md) §7.

---

## 17. Admin / customization changes not showing

**Symptom:** You edited an agent's tagline / voice / values
in **⚙ Admin → <agent>**, clicked Save, confirmed the diff
modal — but the chat still shows the old voice.

### 17.1 Where runtime overrides live

- File: `C:\Users\<you>\.creativedge\overrides\<slug>.json`.
- Created on first save via the Phase 7-B agent editor.
- The backend reads it on each turn's agent invocation.
- The **source** `agents/<slug>/config.json` is never mutated.

### 17.2 Why it might not show immediately

- **Active turn cached the old prompt.** Start a new turn (or
  a new session) — the next assistant invocation reads the
  fresh override.
- **You're chatting with a different agent.** The admin
  override applies only to the slug you edited.
- **You reverted it without realising.** Open the admin
  editor and check; if the field is back to source-default,
  the override key was deleted from the JSON.

### 17.3 What the override allow-list contains

Exactly six fields (Phase 7-B contract, backend-enforced):
- `tagline`
- `voice`
- `color`
- `values` (array)
- `strengths` (array)
- `watch_outs` (array)

The backend refuses any other field. Adding a custom field is
not supported.

### 17.4 No auth gating

Per §7-D in [`../todo.md`](../todo.md), the admin console has
**no auth gating** today. This is an intentional non-goal for
the local-only Claude Code CLI runtime threat model. If the
threat model changes, §7-D should be re-opened.

### 17.5 Rolling back

- **Single field:** re-open the editor, blank the field, save.
- **All overrides for an agent:** delete the overrides JSON:
  ```powershell
  Remove-Item "$env:USERPROFILE\.creativedge\overrides\<slug>.json" -Force -ErrorAction SilentlyContinue
  ```
  (Substitute the actual slug.)

Full reference:
[`customize-an-agent.md`](customize-an-agent.md) §3 + §10.

---

## 18. Frontend build / typecheck errors

**Symptom:** `cd frontend && npm run typecheck` or `npm run
build` fails.

### 18.1 Diagnostic + common causes

```powershell
cd frontend
npm run typecheck 2>&1 | Out-File ..\typecheck.log
```

| Symptom | Likely cause |
|---|---|
| `Cannot find module '@rollup/rollup-linux-x64-gnu'` | Running build on a Linux sandbox; the Windows host with `win32-x64-msvc` builds cleanly. Not a real bug. |
| `TS2307` / `TS2305` `Cannot find module` | Stale `frontend/node_modules/`; reinstall |
| `TS2322` / `TS2345` type mismatches | Recent type changes; re-pull main; re-run typecheck |
| `vite build` segfault / crash mid-build | OOM (rare on dev machines); close other apps and retry |

### 18.2 Recovery

```powershell
cd frontend
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm install
npm run typecheck
npm run build
```

Reinstalling regenerates platform-specific optional
dependencies (the Rollup native binary is selected per host
architecture; switching between Linux/Windows can confuse
it).

For per-subpackage commands see
[`developer-setup.md`](developer-setup.md) §5.

---

## 19. Backend build / test errors

**Symptom:** `cd backend-api && npm run build` or `npm run
test:*` fails.

### 19.1 Common causes

| Symptom | Likely cause |
|---|---|
| `NODE_MODULE_VERSION` mismatch | See §7 |
| `EBUSY` / `database is locked` | A backend dev process is still running and holding the SQLite file. Kill it (see §6) |
| Test runner times out waiting for `/chat` | The local Claude Code CLI is offline. Mock-only test runs work; live-Claude tests need the CLI authenticated |
| `Cannot find module 'better-sqlite3'` | Native binary missing; reinstall: `cd backend-api && npm install` |
| `EACCES` / file-permission errors on `~/.creativedge` | Disk full, or path is on a read-only volume |

### 19.2 The 10 backend test runners

Verbatim from `backend-api/package.json`:

```powershell
cd backend-api
npm run test:routing
npm run test:agents
npm run test:voice
npm run test:memory
npm run test:in-character
npm run test:memory-candidate
npm run test:memory-files
npm run test:memory-integration
npm run test:sqlite
npm run test:backup
```

For per-phase test fixture details see
[`developer-setup.md`](developer-setup.md) §7.2.

---

## 20. OneDrive / cloud-synced folder caveats

If your repo lives inside a OneDrive / iCloud / Dropbox
mirror folder (this is the validation environment used by
Phases 5 → 9 → 10 walkthroughs), you may hit sync-agent
quirks that look like CreativEdge bugs but aren't.

### 20.1 Symptoms

- A file appears truncated in one shell but not another (e.g.
  WSL `wc -l` shows one length; PowerShell `Get-Item .Length`
  shows another).
- `git diff` shows large net deletions you didn't make.
- A tool's `Read` of a file returns content that doesn't
  match what you just wrote with `Write` to the same path.
- `git status` flags files modified that you genuinely
  haven't touched.

### 20.2 Why this happens

- OneDrive's local sync agent may delay propagating changes
  between two mirrors of the same file (e.g. the Windows
  filesystem and a WSL bind mount).
- Bulk file rewrites may appear partial / truncated when
  read through a lagging mirror.
- The actual file on the cloud-mirrored filesystem is
  correct; the lag is in the mirror's view.

### 20.3 Safe practices

1. **Use Git as the source of truth.** `git status` + `git
   diff` against the actual repo path are the canonical view.
2. **Re-read after edits** from the same shell that wrote.
3. **Avoid concurrent edits** from multiple tools on the
   same large file.
4. **Wait for sync** before re-reading via a different shell
   or mount.
5. **Pause OneDrive** during `npm install` / `npm run setup`
   if installs break mid-run.
6. **Don't blame the runtime** until you've verified the
   issue isn't sync lag — most "weirdness" inside a
   OneDrive-mirrored repo is sync, not code.

These are sync-agent quirks, not CreativEdge bugs.

---

## 21. `.git/index.lock` blocking git commands

**Symptom:** `git add` / `git commit` / `git status -s`
fails with:

```
fatal: Unable to create '.git/index.lock': File exists
```

### 21.1 What this means

Git creates `.git/index.lock` to prevent concurrent
operations on the index. Normally it's removed when the
operation finishes. If a git process crashed (or you killed
one), the lock can be left behind.

### 21.2 Diagnostic

```powershell
# Is any git process still running?
Get-Process git -ErrorAction SilentlyContinue
```

If a git process is **actively running** (e.g. a long
`fetch`), wait for it to finish. **Do not delete the lock
while git is running.**

### 21.3 Safe recovery

```powershell
# Only AFTER confirming no git process is running:
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
git status -s
```

### 21.4 Cross-reference

This issue surfaced during Phase 7-C closure (recorded in
[`../todo.md`](../todo.md) as Task #231 *"Commit 1: Phase
7-C closure (BLOCKED by stale .git/index.lock)"*). The
recipe above is the workaround the project has used.

---

## 22. Git workflow mistakes

**Symptom:** You staged files you didn't mean to, or pushed
generated artifacts, or committed pre-existing local-only
modifications you weren't supposed to touch.

### 22.1 Why this happens

- `git add .` stages **everything** in the working tree,
  including:
  - Pre-existing local-only modifications to
    `Logo-Design.md`, `chat.md` (standing don't-touch list).
  - In-progress edits you weren't ready to ship.
  - Build artifacts that escaped `.gitignore`.

- For docs-only turns, accidentally staging unrelated docs
  changes pollutes the commit.

### 22.2 Safe staging workflow

```powershell
# 1. See exactly what's modified
git status -s

# 2. Stage explicit files only (NEVER `git add .`)
git add docs/troubleshooting.md docs/README.md README.md todo.md

# 3. Review what's staged
git diff --cached --name-only
git diff --cached --stat

# 4. (Optional) Review the actual diff
git diff --cached

# 5. Only then commit
git commit -m "docs(troubleshooting): expand Phase 10-F troubleshooting guide"
```

### 22.3 Recovering from accidental staging

```powershell
# Unstage one file
git reset HEAD path/to/file

# Unstage everything (working tree changes preserved)
git reset HEAD
```

### 22.4 Recovering from accidental commit (not pushed yet)

```powershell
# See last 10 commits
git log --oneline -10

# Soft-reset to drop the last commit but keep changes staged
git reset --soft HEAD~1
# Re-stage / re-commit correctly
```

**Never** force-push to `main` to "fix" history. If you've
already pushed, talk to the project owner.

### 22.5 Ahead of origin

```powershell
git status -s
# "Your branch is ahead of 'origin/main' by N commits"
```

That's fine if the commits are intentional and will be
pushed after review. Run `git log --oneline -10` to confirm
the N commits are yours.

Full git workflow reference:
[`developer-setup.md`](developer-setup.md) §15.

---

## 23. Troubleshooting decision tree

Use this when you don't know where to start:

```
Is something broken? → which surface?
│
├── App won't open
│   ├── Stale process? (§6) → kill + retry
│   ├── Build / typecheck broken? (§18 / §19) → fix code
│   ├── Electron logs missing boot-ready? → §2 + §4
│   ├── Backend `/healthz` fails? → §3
│   ├── `NODE_MODULE_VERSION` in backend log? → §7
│   └── Diagnostic page loads? → read its hints + the
│       linked log file path
│
├── Build fails
│   ├── `winCodeSign` symlink error? → §6
│   ├── `NODE_MODULE_VERSION` after packaging? → §7
│   ├── TypeScript errors? → §18 or §19 based on
│   │     which subpackage failed
│   └── Native module missing? → reinstall the
│       relevant subpackage
│
├── Feature broken
│   ├── Chat: red banner persistent? → §3 + §15
│   ├── Setup wizard: doesn't open? → §3 + clear
│   │     `creativedge.firstRun.dismissed` from
│   │     `localStorage`
│   ├── Ops: card shows error? → §3 (most cards
│   │     consume `/healthz` and related Ops routes)
│   ├── Backup: button disabled? → §11
│   ├── Backup: push fails? → §12
│   ├── Releases: link doesn't open? → §9
│   ├── Crash reports: empty? → §13 (happy path)
│   └── Admin: changes not showing? → §17
│
├── Docs-only work
│   ├── Still run: backend build + frontend
│   │     typecheck + 5 × `node --check`
│   ├── Stale-marker grep (see appendix)
│   └── Verify scripts you reference exist in
│       package.json files
│
└── Unknown / weird
    ├── OneDrive sync lag? → §20
    ├── Git index lock? → §21
    ├── Stale processes? → §6
    └── Collect evidence (§25) before editing code
```

---

## 24. Evidence template for bug reports

When asking for help — from a teammate, from an AI coding
agent, from a GitHub issue — paste this template, fill it
in, and **redact secrets manually**.

```
## CreativEdge bug report

### Environment
- OS: Windows 10 / 11 build <build>
- PowerShell version: <run `$PSVersionTable.PSVersion`>
- Node version: <run `node --version`>
- npm version: <run `npm --version`>
- Repo commit: <run `git log -1 --format='%h %s'`>
- Branch: <run `git branch --show-current`>

### What I tried to do
<one-paragraph description of the workflow>

### What command I ran
```
<exact command, e.g. `npm run build:electron`>
```

### What I expected
<one-paragraph expected behavior>

### What actually happened
<one-paragraph actual behavior, including error message text
verbatim if applicable>

### Relevant logs
Pasted from `C:\Users\<you>\.creativedge\logs\<file>`:

```
<paste log content, REDACT any token / API key / personal info>
```

### Electron dynamic ports (if applicable)
- Backend port: <e.g. 52335>
- Static port: <e.g. 52334>

### Current working-tree state
```
<paste output of `git status -s`>
```

### Validation that already passed
- [ ] cd backend-api && npm run build
- [ ] cd frontend && npm run typecheck
- [ ] node --check electron/main.mjs
- [ ] node --check electron/preload.cjs
- [ ] node --check electron/scripts/build-deps.mjs
- [ ] node --check electron/scripts/build-win.mjs
- [ ] node --check electron/scripts/after-pack.mjs

### Screenshots
<optional; never include screenshots of chat content, memory
content, or anything from `~/.creativedge/`>
```

**Never include:**
- API keys, auth tokens, cookies, SSH keys, Git credentials.
- Chat content or memory contents.
- Real user PII.
- The contents of `~/.creativedge/sessions.db` or
  `~/.creativedge/agents/<slug>/memory/*.md`.

---

## 25. Quick command appendix

A compact, copy-paste-ready set of the commands cited above.

### 25.1 Kill stale processes

```powershell
Get-Process node, electron, bun -ErrorAction SilentlyContinue
Get-Process node, electron, bun -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 25.2 Backend build

```powershell
cd backend-api
npm run build
cd ..
```

### 25.3 Frontend typecheck + build

```powershell
cd frontend
npm run typecheck
npm run build
cd ..
```

### 25.4 Electron script syntax checks (all 5)

```powershell
node --check electron/main.mjs
node --check electron/preload.cjs
node --check electron/scripts/build-deps.mjs
node --check electron/scripts/build-win.mjs
node --check electron/scripts/after-pack.mjs
```

### 25.5 Dev Electron

```powershell
npm run dev:electron
```

### 25.6 Build packaged Windows app

```powershell
npm run build:electron
```

### 25.7 Run packaged Windows app

```powershell
& ".\electron\dist-electron\win-unpacked\CreativEdge.exe"
```

### 25.8 Check backend health

```powershell
# Browser dev
curl http://127.0.0.1:3001/healthz

# Electron: substitute the actual dynamic port from the
# Electron stdout log's `boot ready` line.
curl http://127.0.0.1:52335/healthz
```

### 25.9 Check legacy fixed dev ports

```powershell
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
```

### 25.10 Clear electron-builder winCodeSign cache

```powershell
Remove-Item "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign" -Recurse -Force -ErrorAction SilentlyContinue
npm run build:electron
```

### 25.11 Inspect logs directory

```powershell
explorer "$env:USERPROFILE\.creativedge\logs"
Get-ChildItem "$env:USERPROFILE\.creativedge\logs" | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

### 25.12 Tail the latest backend log

```powershell
Get-ChildItem "$env:USERPROFILE\.creativedge\logs\electron-backend-*.log" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1 |
  Get-Content -Tail 80
```

### 25.13 Stale-marker grep on new docs

```powershell
$terms = @(
  "Phase 9 open",
  "9-D-C4 pending",
  "must use port 3001",
  "must use port 5174",
  "electron-updater implemented",
  "automatic update is enabled",
  "telemetry enabled",
  "crash reports are sent",
  "uploads crash reports",
  "0.0.0.0",
  "C:\Users\<username>",
  "commit runtime memory",
  "store secrets in memory",
  "bypass confirmation",
  "paste your token",
  "send crash report automatically"
)
foreach ($t in $terms) {
  Select-String -Path docs\troubleshooting.md -Pattern ([regex]::Escape($t)) -SimpleMatch
}
```

Zero output = clean.

### 25.14 Git staging sanity (before commit)

```powershell
git status -s
git diff --cached --name-only
git diff --cached --stat
git log --oneline -10
```

### 25.15 Safe `.git/index.lock` recovery

```powershell
# Only if no git process is actively running:
Get-Process git -ErrorAction SilentlyContinue
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
git status -s
```

### 25.16 Verify Git is installed

```powershell
git --version
```

---

## 26. Where else to look

- **User-facing app behavior**:
  [`user-guide.md`](user-guide.md).
- **Full developer setup, build, test, git workflow**:
  [`developer-setup.md`](developer-setup.md).
- **Full Electron operational reference (release runbook)**:
  [`electron-release-runbook.md`](electron-release-runbook.md).
- **Add a new agent**:
  [`add-an-agent.md`](add-an-agent.md).
- **Modify an existing agent safely**:
  [`customize-an-agent.md`](customize-an-agent.md).
- **Design intent + memory model**:
  [`../architecture.md`](../architecture.md).
- **Agent-roleplay spec (LLM-facing only)**:
  [`../INSTRUCTIONS.md`](../INSTRUCTIONS.md).
- **Canonical phase roadmap**:
  [`../todo.md`](../todo.md).
- **Documentation map**:
  [`README.md`](README.md).
- **Top-level project entry-point**:
  [top-level `README.md`](../README.md).
