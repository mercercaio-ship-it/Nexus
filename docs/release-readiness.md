# Release Readiness — CreativEdge

This is the preflight checklist for cutting a CreativEdge release.
It documents what must be true **before** building, the canonical
build commands, the Windows packaged-validation walkthrough, and
the GitHub Release draft checklist.

For the day-to-day Electron operational reference, see
[`electron-release-runbook.md`](electron-release-runbook.md). For
how to develop the app, see
[`developer-setup.md`](developer-setup.md).

---

## 1. Release preconditions

Tick every box before producing release artifacts:

- [ ] **Working tree clean.** `git status -s` shows nothing except
      any pre-existing local-only `M` files (see §1.1).
- [ ] **`main` is the release branch.** `git rev-parse --abbrev-ref HEAD`
      returns `main`.
- [ ] **`main` is up-to-date with `origin/main`.** `git fetch && git status`
      reports no divergence.
- [ ] **Phase 9 + Phase 10 are ✅ Complete** in [`todo.md`](../todo.md).
- [ ] **Version confirmed.** `package.json`, `backend-api/package.json`,
      `frontend/package.json`, and `electron/package.json` all
      agree on the version string.
- [ ] **`LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md`**
      all present at the repo root.
- [ ] **`CHANGELOG.md` updated** with the version's entry (move from
      `[Unreleased]` into a dated `[X.Y.Z] — YYYY-MM-DD` block).
- [ ] **Release notes draft** present at
      `docs/release-notes/v<version>.md`.
- [ ] **Code sanity green** on the release host:
      - `cd backend-api && npm run build` exit 0
      - `cd frontend && npm run typecheck` exit 0
      - `cd frontend && npm run build` exit 0
      - `node --check electron/main.mjs` exit 0
      - `node --check electron/preload.cjs` exit 0
      - `node --check electron/scripts/build-deps.mjs` exit 0
      - `node --check electron/scripts/build-win.mjs` exit 0
      - `node --check electron/scripts/after-pack.mjs` exit 0
- [ ] **Backend tests green** on the release host (run from
      `backend-api/`):
      - `npm run test:routing`
      - `npm run test:agents`
      - `npm run test:in-character`
      - `npm run test:memory-files`
      - `npm run test:memory-candidate`
      - `npm run test:sqlite`
      - `npm run test:backup`
      Plus any others relevant to the release scope.

### 1.1 Pre-existing local-only modifications

CreativEdge intentionally treats a handful of files as
local-only (developer notes, draft brand assets). These show up in
`git status -s` as persistent `M` lines and should NOT be staged in
a release commit:

- `Logo-Design.md`
- `chat.md`
- `electron/NOTES.md`
- `docs/electron-release-runbook.md` (if it carries local edits)

Verify each `M` line in `git status -s` is either intentional release
work OR one of the standing local-only files above. If anything
else shows up, investigate before continuing.

---

## 2. Build commands

```powershell
# Codebase sanity (run from repo root)
npm run build           # backend tsc + frontend Vite build
npm run typecheck       # backend + frontend tsc --noEmit

# Full Windows packaged build
npm run build:electron
```

`npm run build:electron` executes the
`electron/scripts/build-win.mjs` orchestrator, which:

1. Pre-builds backend + frontend (`build-deps.mjs`).
2. Runs `electron-builder --win`, which copies backend + frontend
   + agents + orchestrator into `electron/dist-electron/win-unpacked/resources/`.
3. Runs the `afterPack` hook
   (`electron/scripts/after-pack.mjs`, Phase 9-D-B2), which
   rebuilds `better-sqlite3` against Electron's Node ABI **inside
   the packaged copy only** — `backend-api/node_modules/` is never
   mutated.

Expected stdout markers (good build):

- `[build-deps] backend build complete`
- `[build-deps] frontend build complete`
- `[build-win] packaging plan (Phase 9-D-B2 afterPack flow)`
- `[after-pack] rebuild complete for better-sqlite3 in …\resources\backend-api\node_modules`
- `[build-win] DONE.`

Artifacts produced:

- `electron/dist-electron/CreativEdge-Setup-<version>.exe` — NSIS
  installer.
- `electron/dist-electron/win-unpacked/CreativEdge.exe` — unpacked
  binary (run without installing).

Both are **build outputs** — they MUST NOT be committed to git.
`electron/.gitignore` already excludes `dist-electron/`; verify
with `git check-ignore -v electron/dist-electron` before staging
anything.

---

## 3. Windows packaged validation walkthrough

Run the packaged binary on a Windows host (not the build sandbox)
and verify each item below. This mirrors the canonical Phase 9-D-C4
acceptance walkthrough.

### 3.1 First launch

- [ ] Double-click `electron/dist-electron/win-unpacked/CreativEdge.exe`
      (or run the NSIS installer first, then launch from Start menu).
- [ ] App window opens within ~30 seconds.
- [ ] Setup wizard auto-opens on first launch and renders all four
      steps (Runtime / Backups / Providers / Done).
- [ ] No `NODE_MODULE_VERSION` mismatch error in the Electron log.

### 3.2 Dynamic ports

- [ ] Open the Ops console and read the **Diagnostics** card; both
      ports listed are dynamic loopback values (not the legacy
      browser-dev 3001 / 5174).
- [ ] Backend `/healthz` returns OK at the dynamic backend port
      shown in the diagnostics panel (and in the Electron stdout
      log if it was captured).

### 3.3 Chat sanity

- [ ] Send a chat message. The assistant response renders.
- [ ] Existing sessions in the sidebar load.
- [ ] No persistent red "backend unreachable" banner.

### 3.4 Setup

- [ ] Re-open the Setup wizard from the chrome (🧭 Setup button).
      All four steps render correctly.

### 3.5 Ops console (six cards in canonical order)

- [ ] **Diagnostics** — dynamic ports, `/healthz` status, log
      directory path.
- [ ] **Usage & cost** — populated table or empty-state message.
- [ ] **Budget & trends** — KV rows + alert badges + SVG bar chart
      + Configure local budget form + Reset budget button.
- [ ] **Local logs** — file listing.
- [ ] **Crash reports** — empty state OR newest-first table; the
      Prepare action works end-to-end (review panel with privacy
      notice + droppedFields + validationWarnings + JSON pre +
      Copy / Download / Close).
- [ ] **Backup** — readiness state + push button + four-blocker
      hint when not ready.
- [ ] **Update info** — points to the GitHub Releases page.

### 3.6 External release link

- [ ] Click **Open releases page** in Ops console → Update info.
      The default OS browser opens
      <https://github.com/michelbr84/CreativEdge/releases> via the
      Phase 9-D-B4 preload bridge.

### 3.7 Backup readiness (if configured)

- [ ] If push is configured, the Push button in the Backup card
      opens the second-confirmation modal (Phase 9-D-B3).
- [ ] Cancel returns to the panel; Confirm performs the push and
      reports the resulting `pushReason`.

### 3.8 Crash report local-only (smoke test)

- [ ] Trigger a benign error (or open the Prepare action on the
      newest existing crash log).
- [ ] Review panel shows the 17-field allow-list and the
      `backendLogTail` field marked as dropped.
- [ ] Copy report JSON populates the clipboard.
- [ ] Download report JSON writes a `.report.json` to disk.
- [ ] No automatic Send / Upload / Email button anywhere.

### 3.9 Clean shutdown

- [ ] Close the app via the window's close button.
- [ ] Electron log emits in order: `terminating backend child` →
      `closing static server` → `backend child exited code=null
      signal=SIGTERM expected=true`.

### 3.10 Port cleanup

- [ ] In PowerShell:
      `Get-NetTCPConnection -LocalPort <dynamicBackendPort> -State Listen -ErrorAction SilentlyContinue`
      returns **no output**.
- [ ] Same for the dynamic frontend static-server port.

### 3.11 Post-package backend dev sanity

- [ ] `cd backend-api && npm run build` still exits 0 after the
      packaging run — proves the Phase 9-D-B2 afterPack flow left
      the source tree at the system-Node ABI.

---

## 4. Artifact guidance

### What gets uploaded

For a Windows release, upload:

- `electron/dist-electron/CreativEdge-Setup-<version>.exe`
- (optional) A zipped `win-unpacked/` directory for users who
  prefer not to run an installer.

### What MUST NOT be uploaded or committed

- `electron/dist-electron/builder-debug.yml`
- `electron/dist-electron/builder-effective-config.yaml`
- Anything under `node_modules/`
- Anything under `~/.creativedge/` (runtime data + logs + sessions
  DB + memory + backup mirror — user-local, never publishable)
- Any log file containing chat content or memory dumps
- The source `backend-api/node_modules/` directory (regardless of
  ABI state)

### Git artifact hygiene

`electron/dist-electron/` is covered by `electron/.gitignore`.
Verify before staging:

```powershell
git check-ignore -v electron/dist-electron
# Expected: electron/.gitignore:2:dist-electron/	electron/dist-electron
```

If the path is NOT shown as ignored, **stop**: investigate why
before continuing.

---

## 5. GitHub release draft checklist

When the maintainer approves cutting a release, follow this order:

1. **Decide the tag.** Suggested format: `v0.1.0` (matches
   `package.json` `version`).
2. **Decide the title.** Suggested: `CreativEdge v0.1.0 — Windows
   desktop validation baseline` (substitute the actual version).
3. **Move `CHANGELOG.md` entries** from `[Unreleased]` into a
   dated `[<version>] — YYYY-MM-DD` block.
4. **Commit the changelog + release notes.** `docs:
   prepare v<version> release notes`.
5. **Create the git tag locally first:**

   ```powershell
   git tag -a v0.1.0 -m "CreativEdge v0.1.0 — Windows desktop validation baseline"
   ```

   Do NOT push the tag until the maintainer approves.
6. **Push the tag (only after approval):**

   ```powershell
   git push origin v0.1.0
   ```

7. **Create the GitHub Release** via the GitHub UI:
   - Tag: `v0.1.0`.
   - Title: as above.
   - Description: copy from `docs/release-notes/v<version>.md`
     (with the security caveat block included).
   - Upload artifacts:
     - `CreativEdge-Setup-<version>.exe`
     - (optional) `CreativEdge-<version>-win-unpacked.zip`
   - **Mark as Pre-release** if the maintainer requests it
     (advised for the initial baseline).
   - Publish.
8. **Add the release URL to the [`CHANGELOG.md`](../CHANGELOG.md)
   entry** so future readers can jump from the changelog straight
   to the GitHub release page.

---

## 6. Security caveats to include in the release notes

Every release notes draft MUST include this block verbatim (or an
equivalent paragraph that conveys all four caveats):

> **Security caveats.** This is an unsigned Windows installer —
> Windows SmartScreen will warn on first run. CreativEdge has no
> automatic update mechanism (no `electron-updater`, no auto-
> download, no auto-install); install new versions manually from
> this Releases page. Crash reports stay on disk — they are never
> sent automatically. The backup push feature uses your local Git
> credential helper and requires explicit second-confirmation.

---

## 7. What does NOT happen automatically

Release publication is **always manual**. The following are
explicit non-goals as of this writing:

- ❌ No `electron-updater` dependency.
- ❌ No GitHub Actions release workflow.
- ❌ No automated tag-push on commit.
- ❌ No automatic artifact upload.
- ❌ No code-signing pipeline.

The maintainer cuts the tag manually, uploads artifacts manually,
and writes the release notes manually. AI coding agents **must not**
publish a GitHub release autonomously, even if instructed to "do
the release."

---

## 8. Rollback

If a release turns out to be broken after publication:

1. **Do NOT delete the published tag** — it's part of the audit
   trail.
2. **Mark the release as "Pre-release"** in the GitHub UI, or
   delete the release while keeping the tag.
3. **Open a follow-up release** with a patch version (e.g.,
   `v0.1.1`) containing the fix.
4. **Document the rollback** in `CHANGELOG.md` under the affected
   version's entry.

---

## 9. Where things live

- Release runbook (operational, Electron-focused):
  [`electron-release-runbook.md`](electron-release-runbook.md).
- Electron architecture notes (pre-existing local-only file):
  [`../electron/NOTES.md`](../electron/NOTES.md).
- Phase 9-D-B4 preload bridge contract: [`../README.md`](../README.md)
  → Electron architecture.
- Phase 9-D-B2 `afterPack` rebuild contract:
  [`developer-setup.md`](developer-setup.md) →
  Electron development reference.
- Phase 9-D-C3 dynamic port semantics: same file.
- Per-slice evidence trails: [`../todo.md`](../todo.md) closure
  footers.
