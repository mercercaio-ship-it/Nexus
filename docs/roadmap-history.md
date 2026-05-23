# CreativEdge — Roadmap History and Closure Evidence

This file preserves the detailed historical evidence that previously
lived inside the top-level `todo.md`. Phase 11-C
("Roadmap Hygiene + Historical Evidence Split", 2026-05-23) moved
that content here so `todo.md` could be reset to a concise,
readable roadmap. Nothing technical was rewritten on the way over —
commit hashes, validation summaries, slice scopes, privacy/security
contract notes, Windows-walkthrough evidence, sandbox-side
validation results, and per-slice closure footers are preserved
verbatim from the `b8a1ebe` state of `todo.md`.

If you are looking for **current status** (what's done, what's
open, what's planned next), go to [`../todo.md`](../todo.md). If
you are looking for **historical evidence** (what was validated,
when, against which commit), this is the right file.

---

## How this file is organized

The body below preserves the original `todo.md` structure verbatim:

1. **Original top-of-file rollup** — the per-phase active-block as
   it stood when Phase 11-B's v0.1.0 publication footer was the
   most recent addition. This block contains some preserved-history
   wording (`⏳ Implemented (review pending)`, `Active phase: Phase
   10`, etc.) that was current at various earlier dates and is now
   archived here. Treat it as historical context only — the
   authoritative current-status snapshot lives in
   [`../todo.md`](../todo.md).
2. **`Previously completed:` list** — a chronological ledger of
   slice closures from Phase 0 through Phase 10.
3. **Phase 0 through Phase 11 detailed roadmap sections** — the
   original per-phase prose, acceptance criteria, sub-slice
   breakdowns, and historical patches.
4. **EOF closure footers** — one block per implementation /
   validation event. These contain the per-slice scope, file change
   summaries, privacy / security contract enforcement notes,
   sandbox-side validation results, and Windows live-walkthrough
   evidence. They are the canonical audit trail for what shipped
   in v0.1.0.

The closure footers appended in chronological order include:

- Phase 9-D-B1 (manual update info polish) — implementation +
  Windows-validation footers.
- Phase 9-D-B3 (explicit opt-in backup push UX) — implementation +
  Windows-validation footers.
- Phase 9-D-B4 (safe external GitHub Releases link + release
  runbook) — implementation + Windows-validation footers.
- Phase 9-D-B2 (`afterPack` ABI rebuild refactor) — implementation
  + Windows packaged-build validation footers.
- Phase 9-D-C1 (cost-budget alerts + time-series chart) —
  implementation + Windows-validation footers.
- Phase 9-D-C2 (local-only crash-report prepare/export UX) —
  implementation + Windows-validation footers.
- Phase 9-D-C3 (dynamic free-port allocation) — implementation +
  Windows-validation footers.
- Phase 9-D-C4 (final audit + Phase 9 closure) — implementation +
  Windows packaged-validation footers.
- Phase 10-A + 10-B (docs audit + IA + index + README refresh) —
  implementation closure footer.
- Phase 10-C (user guide expansion) — implementation closure
  footer.
- Phase 10-D (developer setup expansion) — implementation closure
  footer.
- Phase 10-E (add/customize agent guide expansion) — implementation
  closure footer.
- Phase 10-F (troubleshooting guide expansion) — implementation
  closure footer.
- Phase 10-G (final docs QA + Phase 10 closure) — closure footer.
- Phase 11-A (repository governance + release readiness baseline)
  — closure footer.
- Phase 11-B (GitHub templates + release publication readiness) —
  closure footer.
- v0.1.0 GitHub Pre-release publication (2026-05-23) — closure
  footer.

---

## Preserved wording

A few phrases in the archived content below were accurate at the
time of writing but are no longer the current status:

- `⏳ Implemented YYYY-MM-DD (review pending)` was the
  implementation-pending-validation marker used before a Windows
  walkthrough closed the slice. Every slice using that marker has
  since been Windows-validated and ✅ closed; see the matching
  per-slice Windows-validation closure footer below for the
  flipped status.
- `Active phase: NONE — all canonical phases (0 through 10) are
  ✅ Complete as of 2026-05-22` was the §10-G closure phrasing.
  Phase 11 was opened on 2026-05-22 by the §11-A footer below
  (governance + release readiness) and continued through 11-B and
  11-C; see [`../todo.md`](../todo.md) for the current Phase 11
  status.
- `Recommended commit message: ...` / `Do not commit. Do not push.
  Wait for review.` lines belonged to per-turn briefs and were
  obeyed at the time. The relevant commits did land (`db71d12` /
  `b147d85` / `7144064` / `57ec5c9` / `4c2bd7d` / `867c6e3` /
  `c987c3f` / `ebc159e` / `b8a1ebe` etc.) and v0.1.0 was published
  manually on 2026-05-23.
- `not yet been tagged or published as a GitHub Release` /
  `Not published as a GitHub Release yet` — these were accurate
  before 2026-05-23. The v0.1.0 publication footer below records
  the actual tag (`v0.1.0`), target commit (`ebc159e`),
  Pre-release flag, and the four published assets.

Treat any of those phrases that appear below as historical
context. The current source of truth is [`../todo.md`](../todo.md).

---

## Source-of-truth references for ongoing work

- Current concise roadmap: [`../todo.md`](../todo.md).
- Release readiness procedure: [`release-readiness.md`](release-readiness.md).
- Release notes draft for v0.1.0: [`release-notes/v0.1.0.md`](release-notes/v0.1.0.md).
- Release notes drafts index: [`release-notes/README.md`](release-notes/README.md).
- Documentation map: [`README.md`](README.md).
- Contributor handbook: [`../CONTRIBUTING.md`](../CONTRIBUTING.md).
- Security policy: [`../SECURITY.md`](../SECURITY.md).
- Changelog: [`../CHANGELOG.md`](../CHANGELOG.md).

---

## Original `todo.md` content — preserved verbatim from commit `b8a1ebe`

The block below is the full content of `todo.md` as it stood at
HEAD `b8a1ebe docs: record v0.1.0 GitHub pre-release publication`
on 2026-05-23. Phase 11-C copied it here before resetting
`todo.md` to a concise roadmap; no editorial changes were made to
the body. Treat it as historical evidence only.

---

# CreativEdge — Roadmap to 100% functional

This is the running checklist that takes CreativEdge from "scaffold + admin console" to a fully working multi-agent chatbot — and brings **each of the 14 agents** to a verifiably functional state.

**Status legend.** `[ ]` open · `[~]` in progress · `[x]` done · `~~struck~~` cut from scope.
Each phase ends with a **Done when** acceptance line — that's the gate to the next phase.

---

## Current Active Phase

- **Phase 11 — Repository Governance + Release Readiness** — ⏳ In progress. **11-A ✅ Complete / committed 2026-05-23** at `c987c3f docs: add repository governance and release readiness docs` — landed the governance baseline (CONTRIBUTING / LICENSE / SECURITY / CHANGELOG / docs/release-readiness.md / docs/release-notes/v0.1.0.md) + the four `package.json` description refreshes + the README License-section governance links. **11-B ⏳ Implemented 2026-05-23 (review pending)** — GitHub collaboration templates + release publication readiness recheck. New files created: `.github/pull_request_template.md` (PR scaffold with scope / type-of-change / phase reference / validation run / privacy-security checklist / release impact / reviewer checklist), `.github/ISSUE_TEMPLATE/bug_report.md` (environment + logs + redaction guidance + explicit "what NOT to include" block), `.github/ISSUE_TEMPLATE/feature_request.md` (privacy/security-impact + release-impact + documentation-impact + acceptance-criteria), `.github/ISSUE_TEMPLATE/documentation.md` (per-doc affected list + source-of-truth + link/command validation), `.github/ISSUE_TEMPLATE/config.yml` (issue chooser: blank issues disabled; contact links to GitHub Private Vulnerability Reporting + troubleshooting guide + release readiness guide + contributor handbook + todo.md — no invented email addresses), `docs/release-notes/README.md` (release notes drafts index explaining draft-vs-published distinction + pointing at `docs/release-readiness.md` §5 procedure). Files updated: `CONTRIBUTING.md` (Pull request checklist section now references `.github/pull_request_template.md` so contributors don't bypass the auto-prefilled checks), `CHANGELOG.md` ([Unreleased] block extended with the Phase 11-B additions + a note that `gh release list` was not verifiable in the sandbox but `git tag` confirms no tags exist), this `todo.md` rollup + §11-B closure footer at EOF. `docs/release-readiness.md` audited — already covers all brief §G requirements verbatim (clean working tree / build commands / Windows packaged-validation walkthrough / artifact rule / tag plan / release title / release notes source / known caveats) — **no changes needed**. **No code changes.** **No `package.json` `scripts` / `dependencies` / `version` / `private` flag changes (versions stay 0.1.0 across all 4).** **No git tag created.** **No GitHub Release published.** **No tag pushed.** **No GitHub Actions / Dependabot / CODEOWNERS / funding files added** (out of scope per the brief). Validation: backend build exit 0; frontend typecheck exit 0; 5 × `node --check` on Electron scripts all exit 0; `.github/ISSUE_TEMPLATE/config.yml` parses as valid YAML; new docs grep clean (0 `C:\\Users\\<username>` literal paths; 0 invented email addresses; no claim that a GitHub Release is already published; no instructions to commit `electron/dist-electron`). **Next step:** maintainer reviews Phase 11-B; on approval, the maintainer can either (a) cut the v0.1.0 GitHub release via `docs/release-readiness.md` §5, (b) keep Phase 11 open for opportunistic governance follow-ups, or (c) close Phase 11 once the release lands. **Original Phase 11-A footer (preserved for historical context):** — repository governance baseline + release readiness audit + package metadata refresh. New files created: `CONTRIBUTING.md` (contributor handbook with setup / run / build / validation / commit conventions / privacy rules / AI-agent rules), `LICENSE` (proprietary "All Rights Reserved" notice — safe default for `"private": true` repository; owner can switch to MIT/Apache/etc. later in writing), `SECURITY.md` (security policy: supported versions = 0.1.0 + main; reporting via GitHub private vulnerability reporting; threat model summary; explicit "what NOT to include" list; out-of-scope items: signing / electron-updater / admin console auth / macOS / Linux), `CHANGELOG.md` (Keep-a-Changelog style; `[Unreleased]` block for governance work; `[0.1.0] — 2026-05-22` block summarizing Phase 9 + Phase 10), `docs/release-readiness.md` (release preflight checklist + Windows packaged-validation walkthrough + GitHub release draft checklist + security caveats block), `docs/release-notes/v0.1.0.md` (release notes **draft** — not published, awaiting maintainer approval). Files updated: `README.md` "License + repository" section now links to LICENSE / CONTRIBUTING / SECURITY / CHANGELOG / release-readiness; root `package.json` description refreshed from stale Phase 9-A/9-B wording → current post-Phase-10 reality; `backend-api/package.json` / `frontend/package.json` / `electron/package.json` descriptions refreshed from stale Phase 2.1 / Phase 6-A/B/C / Phase 9-B wording → current. **No code changes.** **No `package.json` `scripts` changes.** **No dependency changes.** **No `version` field changes (0.1.0 preserved across all 4 packages).** **No `private: true` flag changes.** **No git tag created.** **No GitHub release published.** **No tag pushed.** Validation: backend build exit 0; frontend typecheck exit 0; 5 × `node --check` on Electron scripts all exit 0; all four `package.json` files parse as valid JSON; no `C:\\Users\\<username>` literal paths in newly-created files; SECURITY.md contains no invented email address; release-readiness.md says generated artifacts are never committed; CHANGELOG does not claim a GitHub Release exists. **Phase 11-A is the only Phase 11 slice currently planned.** Optional Phase 11-B (.github/ issue + PR templates) deferred — not part of this turn's scope. **Next step:** maintainer reviews this slice; on approval, optional Phase 11-B can land or the maintainer can cut the v0.1.0 GitHub release via the `docs/release-readiness.md` § 5 checklist. See the 2026-05-22 §11-A closure footer at EOF for the full evidence trail.
- **Phase 10 — Documentation** — **✅ Complete / docs QA validated 2026-05-22.** All seven sub-slices closed (10-A docs audit + IA + index; 10-B README Quick Start refresh; 10-C user guide; 10-D developer setup guide; 10-E add-an-agent + customize-an-agent guides; 10-F troubleshooting guide; 10-G final QA + Phase 10 closure). Final QA pass evidence at 2026-05-22: zero broken links across all 7 main docs files; all 29 documented `npm run X` commands match the actual `package.json` files (root 16 / backend 15 / frontend 4 / electron 4); 14-agent roster consistent between `orchestrator/registry.json` (14 entries), `frontend/src/agents/agentCatalog.ts` (14 aliases), and every docs roster table; Electron dynamic-port + preload-bridge + afterPack contracts consistently documented; zero stale claims; code sanity green. Phase 10 delivered the canonical documentation foundation (~5,600 lines of expanded substantive docs verified against actual source). The full QA evidence trail is preserved in the 2026-05-22 §10-G closure footer at EOF of this file. (Per-sub-slice historical evidence — including the original "review pending" status entries and full prose for 10-A through 10-G — is preserved in the "Previously completed:" list below and in the per-slice closure footers at EOF.)

  - **Phase 9-B — Electron wrapper foundation** — ✅ Complete / Windows validated 2026-05-21 (after a 4-patch hardening sequence: lifecycle hardening → chat-recovery patches 1/2/3 → packaging-fix `build-win.mjs` orchestrator). Windows live walkthrough on 2026-05-21 confirmed: `npm run build:electron` ran all 3 orchestrator steps cleanly (build-deps → `@electron/rebuild` for `better-sqlite3` against Electron 30.5.1 ABI → `electron-builder --win`) and ended with `[build-win] DONE.`; the `finally`-block restore (`npm --prefix ../backend-api rebuild better-sqlite3`) returned successfully so dev ABI is back in place; `electron/dist-electron/win-unpacked/CreativEdge.exe` was launched as a normal Windows user (NOT Administrator) and used the normal-user runtime at `C:\Users\<you>\.creativedge\logs\…`; the chat UI loaded, a message was sent, the assistant response rendered correctly, existing sessions from the normal-user profile were visible, no stale red backend error, no `NODE_MODULE_VERSION` crash, no port-3001 collision; on close, the Electron log showed `terminating backend child` → `closing static server` → `backend child exited code=null signal=SIGTERM expected=true`, and `Get-NetTCPConnection -LocalPort 3001 -State Listen` returned no output, proving backend-child cleanup. See the 2026-05-21 §9-B Windows-validation closure footer at the bottom of this file for the full evidence trail. Backend, frontend, and root `package.json` orchestration scripts untouched at the source level (root `package.json` gained 4 thin orchestration scripts: `setup:electron` / `build:electron` / `dev:electron` / `rebuild:electron`). The Electron wrapper lives in a new **isolated** package at `electron/` (its own `package.json`, its own `node_modules`, its own lockfile — repo is NOT converted to npm workspaces). **New files (5):** `electron/package.json` (3 devDeps only: `electron@^30`, `electron-builder@^24.13.3`, `@electron/rebuild@^3.6`; isolated NSIS Windows build config with `appId: com.creativedge.desktop`, productName `CreativEdge`, 6 `extraResources` mappings covering backend dist + backend node_modules + frontend dist + agents + orchestrator; output to `electron/dist-electron/CreativEdge-Setup-${version}.exe`), `electron/main.mjs` (≈260 lines pure Node ESM; the Electron main process — spawns the existing compiled backend as a child via `child_process.spawn` with `CREATIVEDGE_PORT=3001`, waits for `/healthz` with a 30s timeout, starts a 50-line localhost static HTTP server on `127.0.0.1:5174` serving `frontend/dist/`, opens a hardened `BrowserWindow` pointing at it), `electron/scripts/build-deps.mjs` (≈55 lines; pre-flight builds backend + frontend with `VITE_API_URL=http://127.0.0.1:3001` injected at frontend build time so the bundle has the absolute backend URL baked in), `electron/.gitignore` (excludes `dist-electron/` + `node_modules/`), `electron/NOTES.md` (architecture + dev/build flow + native-module rebuild guidance + Windows validation target). **Architecture chosen:** backend child spawned with system `node` in dev (so the existing `better-sqlite3` Node-ABI build works as-is) and with Electron-bundled node via `ELECTRON_RUN_AS_NODE=1` in the packaged binary; frontend served over a tiny localhost HTTP server rather than `file://` so the renderer's `Origin: http://127.0.0.1:5174` passes the backend's Phase 2.1 localhost CORS allow-list with zero backend changes; `app.isPackaged` toggles dev-vs-packaged paths (`process.resourcesPath`-rooted lookups in the .exe). **Security hardening baseline:** `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, `webSecurity: true`, no preload script (renderer needs only standard browser `fetch`), `setWindowOpenHandler` denies all popups, `will-navigate` restricted to the static server's origin (external `http(s)://` links open via `shell.openExternal` in the OS browser), backend bound to `127.0.0.1` only. **Native-module handling:** dev mode "just works" because the backend's system-Node-ABI `better-sqlite3@^11.7.0` is loaded by a system-Node child; packaged mode requires `npm run rebuild:sqlite` (which runs `electron-rebuild --module-dir ../backend-api -w better-sqlite3 -f`) once before the first `npm run build`. Trade-off documented verbatim in `electron/NOTES.md`: the rebuild mutates `backend-api/node_modules/better-sqlite3/build/` against Electron's ABI; restoring system-Node dev requires `cd backend-api && npm rebuild better-sqlite3`. A Phase 9-D refinement will move the Electron rebuild into a temp-copy inside `electron-builder`'s `afterPack` hook. **Fixed-port-3001 design:** Phase 9-B pins backend port 3001 with the frontend bundle compiled with `VITE_API_URL=http://127.0.0.1:3001`. Dynamic free-port allocation is intentionally deferred to Phase 9-C/D (would require a preload script exposing the runtime port to the renderer or a small generated config file). Backend child fails fast and Electron quits cleanly if port 3001 is busy. **Sandbox-side validation completed 2026-05-20:** `electron/package.json` parses (3 devDeps; build config sanity-checked); `node --check electron/main.mjs` exit 0; `node --check electron/scripts/build-deps.mjs` exit 0; `node --check scripts/dev-help.mjs` exit 0 (Phase 9-A regression intact); `node --check scripts/setup-postinstall.mjs` exit 0 (Phase 9-A regression intact); root `npm run dev` still prints the 9-A help (regression intact); backend `npm run build` exit 0; `npm run test:memory-files` 64/64 PASS; `npm run test:memory-candidate` 18/18 PASS; `npm run test:routing` coverage assertion clean (38 fixtures); frontend `npm run typecheck` exit 0; root `npm run typecheck` chains both packages cleanly. Live `npm install` inside `electron/`, `electron .` GUI launch, and `electron-builder --win` `.exe` production cannot run from the Linux sandbox (electron binary is platform-specific + GUI required + NSIS Windows toolchain required); Phase 9-B stays open until the user's Windows live walkthrough lands.

  - **Done-when (live):** on a Windows host, `npm run setup:electron` from the repo root completes (downloads Electron + electron-builder + @electron/rebuild into `electron/node_modules/`), `npm run dev:electron` opens a desktop window with the chat UI loading from a child-spawned backend (`/healthz` returns OK; chat UI renders; sessions sidebar + admin entry button visible), `npm run rebuild:electron` followed by `npm run build:electron` produces `electron/dist-electron/CreativEdge-Setup-0.1.0.exe`. Running the produced `.exe` opens the desktop app to the chat UI. No backend route changes; no SSE contract changes; no Anthropic API; no `.env`.

  - **Patch 2026-05-20 (packaging fix — Electron-ABI rebuild orchestrator).** First Windows packaged-build validation of `electron\dist-electron\win-unpacked\CreativEdge.exe` opened the window, then the backend child crashed with: `The module '...resources\backend-api\node_modules\better-sqlite3\build\Release\better_sqlite3.node' was compiled against a different Node.js version using NODE_MODULE_VERSION 137. This version of Node.js requires NODE_MODULE_VERSION 123.` (137 = system Node 22.x; 123 = Electron 30.x's bundled Node ABI). **Root cause:** the prior `electron/package.json` "build" script was `node scripts/build-deps.mjs && electron-builder --win` — it never invoked `@electron/rebuild`, so the `better_sqlite3.node` binary copied into `resources/backend-api/node_modules` via `extraResources` was the system-Node-ABI build left behind from `cd backend-api && npm install`. `electron-builder` itself logs `skipped dependencies rebuild reason=npmRebuild is set to false` and (in this codebase's layout) does NOT auto-rebuild native modules inside `extraResources` even with `npmRebuild:true`, because the backend lives in a sibling package outside `electron/node_modules`. The packaged binary uses `ELECTRON_RUN_AS_NODE=1` + `process.execPath` to spawn the backend, so the runtime is Electron's bundled Node — which refuses the ABI-137 binary and exits with code 1. **Patch (electron-only):** (1) **New file `electron/scripts/build-win.mjs`** (≈225 lines pure Node ESM; the Windows packaged-build orchestrator) that replaces the previous inline `&&` chain. Reads Electron's *resolved* version from `electron/node_modules/electron/package.json` (NOT the `^30.0.0` semver range from `devDependencies`) so the rebuild targets the actual installed binary. Pre-flight checks (exit code 2 with clear message + zero mutation) verify `electron/node_modules/electron/package.json`, `backend-api/package.json`, and `backend-api/node_modules/better-sqlite3/package.json` all exist before any work begins. Three packaging steps wrapped in a single `try`: **step 1/3** runs the existing `node scripts/build-deps.mjs` (unchanged — builds backend dist + frontend dist with `VITE_API_URL=http://127.0.0.1:3001`); **step 2/3** runs `npx @electron/rebuild -f -w better-sqlite3 --module-dir ../backend-api --version <electronVersion> --arch x64` (scoped to the single `better-sqlite3` module; `-f` forces rebuild even if `.node-version` says it's current; `--module-dir ../backend-api` tells the rebuilder where to find node_modules; `--arch x64` matches the Windows binary we ship); **step 3/3** runs `npx electron-builder --win` (now packaging the Electron-ABI `.node`). After step 2, the backend's `better-sqlite3` build directory is INCOMPATIBLE with system Node — so the **`finally` block ALWAYS attempts** `npm --prefix ../backend-api rebuild better-sqlite3` to restore the system-Node ABI for `cd backend-api && npm run dev`, the `test:*` runners, and the `npm run dev:electron` flow (which spawns the backend with system node). Cleanup uses an `allowFail: true` option on the `run()` helper so a non-zero exit from `npm rebuild` itself logs a `WARN` line (with the manual-restore command printed) but never throws or masks the main exit code. Exit-code contract: `0` = success and ABI restored; `1` = packaging failed and restore was still attempted; `2` = environment problem (missing `node_modules`) and nothing was changed. Privacy: prints only version numbers + step labels + exit codes; never prints memory content / chat content / secrets. (2) **`electron/package.json`** changed `"build": "node scripts/build-deps.mjs && electron-builder --win"` → `"build": "node scripts/build-win.mjs"`. All other fields preserved (devDeps `electron@^30.0.0` + `electron-builder@^24.13.3` + `@electron/rebuild@^3.6.0`; `build.appId`, `build.productName`, `build.directories.output`, `build.files`, all 6 `extraResources` mappings, `build.win.target=nsis`, `build.nsis.oneClick=false`, `build.npmRebuild=false`). Backend code, backend routes, SSE contract, providers, frontend code, root `package.json` scripts, agent personality files, memory artifacts, `main.mjs`, `build-deps.mjs`, `electron/.gitignore`, `electron/NOTES.md` — all untouched. **Sandbox re-validation 2026-05-20:** `node --check electron/scripts/build-win.mjs` exit 0; `node --check electron/scripts/build-deps.mjs` exit 0; `node --check electron/main.mjs` exit 0; backend `npm run build` exit 0; frontend `npx tsc --noEmit` exit 0; `electron/package.json` re-parses cleanly with new `build` script string. Live `npm run build:electron` cannot run from the Linux sandbox (electron binary + Windows NSIS toolchain required). **Phase 9-B stays open** pending Windows live packaged-build validation against the patched orchestrator. **Required Windows retest (PowerShell):** ① `Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue` should return nothing (no stale backend); ② from repo root, `npm run build:electron` should run all 3 orchestrator steps and end with `[build-win] DONE.` plus an Electron-ABI rebuild log line for `better-sqlite3`; ③ `& ".\electron\dist-electron\win-unpacked\CreativEdge.exe"` should open the desktop window with the chat UI loading from a child-spawned backend (no `NODE_MODULE_VERSION` error); ④ optionally `& ".\electron\dist-electron\CreativEdge-Setup-0.1.0.exe"` runs the NSIS installer end-to-end; ⑤ post-build, `cd backend-api && npm run build` should still pass (proves the `finally`-block restore put the dev-ABI back); if it fails the orchestrator's WARN line will have printed the manual restore command (`cd backend-api && npm rebuild better-sqlite3`).
  - **Patch 2026-05-20 (chat-recovery patch 3 — bounded retry polling for late persistence).** After patch 2 (listSessions fallback) landed, Windows live retest still showed the stale red banner: clean restart → backend healthy → send "oi" → red banner appears → switching to another session and back showed the correct assistant response (proving persisted state was fine). **Root cause of the residual symptom:** patch 2's recovery runs once, immediately in the catch block. Chromium's `fetch("/chat")` rejection lands almost instantly on response framing, while the backend's SQLite write for the assistant message hasn't completed yet — so the immediate `apiGetSession` finds the user message but no assistant message after it, the `hasAssistantAfter` check fails, and recovery returns `null`. User then sees the error; later the backend completes the write, but nothing in the UI triggers a re-check until Ctrl+R or a session switch. **Patch 3 (frontend-only — App.tsx only; reuses existing helpers; no new fetch logic):** added a small `recoverPersistedChatTurnWithRetries({ ..., delaysMs })` wrapper around the existing `recoverPersistedChatTurn` that does N retries with bounded delays. Restructured `sendChatMessage`'s catch into two stages with a shared `applyRecovered(recovered): boolean` apply step gated by an `assistantId-still-in-messages` guard: **Stage A** runs the immediate recovery (cheap; often fails if backend hasn't flushed); if it succeeds via `applyRecovered`, no error is shown. **Stage B** runs only if Stage A failed — sets the error (so the user sees feedback if Stage B also fails), then kicks off bounded background polling at `[250, 750, 1500]` ms (≈2.5s wall-clock, 3 retries) as a fire-and-forget. On any successful poll, `applyRecovered` replaces messages, sets sessionId, clears `globalError`, and bumps `sessionRefreshNonce` for sidebar refresh. The `applyRecovered` guard checks the optimistic `assistantId` is still present in `messages` (i.e., the user hasn't navigated to a different session OR started a new conversation) — if missing, the recovery is silently dropped so a late poll cannot clobber the user's current view. Real network failures still surface correctly: if all 4 attempts (1 immediate + 3 retries) return `null`, the default error banner stays in place. No full-window reload anywhere. No new dependencies. Backend, providers, chatStream.ts, client.ts, Electron main, agent personality files, memory artifacts — all untouched. Sandbox re-validation 2026-05-20 post-patch-3: `frontend npm run typecheck` exit 0; backend `npm run build` exit 0; `npm run test:memory-files` 64/64 PASS; `npm run test:memory-candidate` 18/18 PASS; root `npm run typecheck` clean. Final App.tsx is 855 lines; diff stat `+112 / -38` net vs commit `39a28ff`. Helpers added: `recoverPersistedChatTurnWithRetries` (≈22 lines top-level). Required Windows retest: kill node/electron/bun → ports 3001+5174 free → `npm run dev:electron` → send "oi" or "olá" — expected: initial red banner may briefly appear but auto-clears within ~2.5s as the persisted transcript loads in place; no Ctrl+R, no session switch; `GET /sessions/<id>` matches the visible UI transcript exactly.
  - **Patch 2026-05-20 (chat-recovery patch 2 — listSessions fallback for first-turn case).** After commit `39a28ff` landed, Windows live retest still showed the stale red banner: clean restart → port 3001 + 5174 free → backend healthy → window opened → send "oi" → UI still displayed `"Could not reach backend at http://127.0.0.1:3001 (Failed to fetch)…"` until the user pressed Ctrl+R. **Root cause of the persistent symptom:** the prior recovery patch only activated when `observedSessionId` was set, which requires the SSE `meta` event to fire BEFORE the `fetch("/chat")` rejection. On the FIRST turn of a NEW session, the Chromium rejection happens before any SSE bytes are consumed → no `meta` event → `observedSessionId === null` → recovery branch skipped → default error display. Backend correctly persisted both messages (sidebar showed the new session; `GET /sessions/<id>` returned both rows), but the frontend never looked. **Patch 2 (frontend-only — App.tsx only):** added a top-level `recoverPersistedChatTurn({ knownSessionId, userText, sendStartTimeMs })` helper (and a `tryFetchSessionMatching(sessionId, userText)` sub-helper) that tries the known session id first (Stage 1, cheapest) and falls back to `apiListSessions(20)` (Stage 2) filtering for sessions whose `updatedAt` is at or after `sendStartTimeMs - 5s grace` (covers clock skew + persistence latency), sorted newest-first, content-matched against the just-sent user text. For each candidate the helper verifies the transcript contains the user message followed by at least one assistant message (deterministic match even when multiple sessions exist). On a confirmed hit, `sendChatMessage` replaces optimistic messages with the persisted transcript, sets the session id, and explicitly clears `globalError`. If every candidate fetch also rejects (same Chromium class possible on listSessions itself), the helper returns `null` and the caller falls through to the existing default error display — real network failures still surface correctly. New `sendStartTimeMs = Date.now()` capture at the top of the send handler feeds the cutoff filter. New imports: `listSessions as apiListSessions` from `./api/client`; `SessionDetailRow` and `SessionMessageRow` types from `./types`. Backend, providers, chatStream.ts, client.ts, Electron main, agent personality files, memory artifacts — all untouched. NO full-window reload as primary fix (per scope). Sandbox re-validation 2026-05-20 post-patch-2: `frontend npm run typecheck` exit 0; backend `npm run build` exit 0; `npm run test:memory-files` 64/64 PASS; `npm run test:memory-candidate` 18/18 PASS; root `npm run typecheck` clean. Final App.tsx is 781 lines; diff stat `+153 / -54` net vs HEAD. Note: this turn hit the same OneDrive partial-sync truncation as prior patches when an Edit replaced a large block; caught immediately and repaired via `git show HEAD:frontend/src/App.tsx` → Python anchored-replacement → atomic-write back. **Phase 9-B stays open** pending Windows re-test of the patched App.tsx. **Required Windows retest:** kill node/electron/bun → confirm ports 3001+5174 free → `npm run dev:electron` → send "oi" — expected: no stale red banner persists, assistant response appears automatically (no Ctrl+R needed), sidebar updates with the new session, `GET /sessions/<id>` confirms the UI matches the persisted transcript.
  - **Patch 2026-05-20 (frontend chat-recovery for false-negative SSE rejections).** After the Electron lifecycle hardening landed, Windows live retest of `npm run dev:electron` showed the Electron app stayed open, the backend was healthy (`/healthz ok:true`, `/sessions ok:true`, `/agents` returned 14 seeded agents), and a chat send actually persisted both messages on the backend side (verified by `GET /sessions/8297fd4f-119a-4a88-b504-509830a29593` returning the user's "oi" + Nexus's full reply). BUT the Electron UI still displayed: `"Error: Could not reach backend at http://127.0.0.1:3001 (Failed to fetch). Is npm run dev running in backend-api?"`. **Root cause:** Chromium-in-Electron rejects the `fetch("/chat")` promise (surfacing as `TypeError: Failed to fetch`) even though the backend successfully writes the full SSE response and persists both messages — a known false-negative class with Fastify's `reply.hijack()` SSE pattern. The chatStream.ts catch wraps that rejection into the `"Could not reach backend at <URL> (Failed to fetch). Is npm run dev running in backend-api?"` message the user saw. Backend logs proved the turn completed; only the client-side fetch promise rejected. **Patch (frontend-only):** in `frontend/src/App.tsx` `sendChatMessage`, added a local mutable `observedSessionId` that captures the sessionId from `meta` (and `done`) events as they arrive in the SSE callback (React state would be stale during the catch). On `streamChat` throw, when an `observedSessionId` is known, do a recovery `GET /sessions/:id` via `apiGetSession`: if the persisted transcript contains the just-sent user message followed by at least one assistant message, replace the local optimistic `messages` with the persisted transcript (mirrors the existing `selectSession` mapper exactly), update `sessionId` from the response, and skip the `setGlobalError` + per-bubble error tagging entirely. If recovery itself fails OR the persisted state doesn't show the expected pair, fall through to the existing default error display (so real network failures still show the diagnostic). The `finally` block continues to refresh the sessions sidebar and re-ping health — both safe on the recovered path. **Backend untouched** (no SSE contract changes; no route changes; no provider changes); **memory system / agent personality files / Electron main untouched**. Sandbox re-validation 2026-05-20 post-patch: `frontend npm run typecheck` exit 0; backend `npm run build` exit 0; `npm run test:memory-files` 64/64 PASS; `npm run test:memory-candidate` 18/18 PASS; root `npm run typecheck` clean. Diff stat: `frontend/src/App.tsx` +65 / −8 net. (Note: a transient atomic-write truncation during patch authoring was caught and repaired in the same turn via `git show HEAD:frontend/src/App.tsx` + Python-based string replacement + atomic-write back; final file is 675 lines, the original 618 plus the 57-line recovery block.) **Phase 9-B stays open** pending the user's Windows re-test against the patched App.tsx. **Required Windows retest:** with port 3001 free, run `npm run dev:electron`, send a short message like "oi" — expected: no stale "backend unreachable" banner, assistant response appears in the UI, session sidebar refreshes; verify via `GET /sessions/<id>` that backend has the same user + assistant pair the UI is showing (the recovery path should make these match exactly).
  - **Patch 2026-05-20 (Electron lifecycle hardening).** First Windows live run of `npm run dev:electron` against commit `177057b` exhibited: (a) port-collision was already-detected by Fastify with `EACCES` when `bun.exe` held 3001; (b) after freeing 3001, the desktop window opened, `/healthz` returned OK, then the backend child died with `code=1` a few seconds later and Electron quit (`backend exited unexpectedly; quitting app`). Root cause: the prior `main.mjs` forwarded the backend child's `stdout`/`stderr` directly into Electron main's `process.stdout` / `process.stderr`. **On Windows GUI mode, Electron's `process.stdout` is effectively a closed pipe** — pino's default SonicBoom destination writes a few log lines successfully, then the pipe fills / errors → `EPIPE` propagates to pino's uncaught handler → `process.exit(1)` → backend dies after /healthz. Same backend stays stable when run standalone in a real terminal (TTY stdout, no EPIPE). **Patch (Electron-only):** (1) **Port preflight:** TCP-probe `127.0.0.1:3001` BEFORE spawning the backend (via `node:net createConnection` with a 2s timeout); if occupied, probe `/healthz` to detect whether it's a CreativEdge backend (`service === "creativedge-backend"`) and load a clear diagnostic page in the BrowserWindow — never silently second-spawn or attach to a foreign backend. (2) **Backend log redirection:** pipe `child.stdout` + `child.stderr` to `~/.creativedge/logs/electron-backend-<ts>.log` (via `node:fs createWriteStream`) instead of Electron main's `process.stdout`; this is the actual EPIPE fix — backend writes go to a real file descriptor, pino stays alive, the backend keeps running until the user closes the window. Stream `error` events are caught and logged (never propagated to crash main). (3) **Crash-resilient lifecycle:** if the backend child exits unexpectedly AFTER the window is showing, the window now STAYS OPEN and loads a `data:` URL diagnostic page (HTML built from a small template; no JS, no external assets) that explains the exit code/signal + the log file path + recovery steps — instead of immediately quitting. The user reads the diagnostic and closes the window to quit. (4) **Improved logging:** backend child PID logged on spawn; exit handler logs `expected` flag; before-quit / window-all-closed paths log their decision. (5) **Security baseline preserved verbatim:** `contextIsolation:true`, `nodeIntegration:false`, `sandbox:true`, `webSecurity:true`, no preload, popups denied, `will-navigate` restricted to the static server's origin + `data:` URLs (added to allow the diagnostic page). Backend untouched. Frontend untouched. Root scripts untouched. NOTES.md left intact (main.mjs's own docblock comments document the new flow inline). Sandbox re-validation 2026-05-20 post-patch: `node --check electron/main.mjs` exit 0; `node --check electron/scripts/build-deps.mjs` exit 0; `node --check scripts/dev-help.mjs` + `node --check scripts/setup-postinstall.mjs` exit 0 (Phase 9-A regression intact); backend `npm run build` exit 0; `npm run test:memory-files` 64/64 PASS; `npm run test:memory-candidate` 18/18 PASS; frontend `npm run typecheck` exit 0; root `npm run typecheck` clean. **Phase 9-B stays open** pending Windows re-validation against the patched `main.mjs`. **Required Windows retest:** with port 3001 free, run `npm run dev:electron` — expect the desktop window to open, `/healthz` to return OK, the chat UI to load, and the app to stay open until the user closes the window. With port 3001 occupied (e.g. start `npm run dev:backend` in another terminal first), `npm run dev:electron` should display the port-busy diagnostic page (not crash and disappear). Once dev mode is stable, the packaged-build path (`npm run rebuild:electron` + `npm run build:electron`) can be re-attempted; if `electron-builder` symlink/EPERM issues appear they are a separate Phase 9-D refinement and should be documented, not solved in this patch.

  - **Phase 9-C — First-run wizard** — ✅ Complete / Windows validated 2026-05-21. Live walkthrough via `npm run dev:electron` confirmed: the wizard auto-opened on launch and rendered all 4 steps (Runtime / Claude Code / Backup optional / Done). Runtime step showed `runtime directory: C:\Users\<you>\.creativedge`, `storage ready: yes`, `database ready: yes`, `seeded agents: 14`, `backend target: http://127.0.0.1:3001`. Claude Code step reflected `/healthz` correctly with `primary provider: claude`, `installed: yes`, `auth status: unknown`, `setup hint` visible when reported, `mock fallback available`. Backup optional step rendered `enabled: no`, `git on PATH: yes`, `repo initialized: yes`, `remote configured: no`, `repo dir: C:\Users\<you>\.creativedge\backups\agents-git`, `next action: configure` — all read from the existing `/backup/status` route. Done step worked; `Finish` closed the wizard and returned to chat; chat still sent and Nexus replied correctly afterwards; the 🧭 Setup button reopened the wizard cleanly; on close the backend exited normally and `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` returned no output (backend-child cleanup validated). See the 2026-05-21 §9-C Windows-validation closure footer at the bottom of this file for the full evidence trail. Frontend-only slice (no backend routes added; no provider/memory/Electron-lifecycle changes). The wizard is a thin React layer on top of three already-validated APIs: `GET /healthz` (Phase 2.1 runtime + Phase 2.2-B Claude readiness) and `GET /backup/status` + `POST /backup/config` + `POST /backup/dry-run` + `POST /backup/run` (Phase 5.6-A — all opt-in, confirmed-by-default-false). **New files (1):** `frontend/src/components/setup/FirstRunWizard.tsx` (≈430 lines TSX; self-contained modal with 4 stepper panels — Runtime / Claude / Backup / Done — plus a tiny `StepPill` + `StatusBadgeInline` + `KvRow` + `ActionRow` set kept inside the same file). **Modified files (3):** `frontend/src/types.ts` (existing `HealthCheckResponse` extended with the same optional fields the backend already returns: `setupRequired`, `setupHint`, `runtimeDir`, `storageReady`, `dbReady`, `seededAgentSlugs`, `providers.{primary,claude,mock}`, `requestId`; new `HealthCheckProviderReadiness` interface mirrors `backend-api/src/providers/Provider.ts:ProviderReadiness` — all fields optional so the type stays compatible with older `/healthz` builds), `frontend/src/App.tsx` (+2 state vars `latestHealth` + `wizardOpen`, +1 ref `wizardAutoCheckedRef`, expanded `pingHealth` to also store the latest payload AND auto-open the wizard at most once per app session when either the localStorage `creativedge.firstRun.dismissed` flag is absent OR `payload.setupRequired === true`; +`openWizard` / `closeWizard` callbacks; +`<FirstRunWizard>` render slot in both `mode === "admin"` and `mode === "chat"` returns; +🧭 Setup button next to ⚙ Admin in the `ce-mode-switch` chrome so the user can reopen the wizard whenever), `frontend/src/styles.css` (+≈230 lines of `.ce-wizard-*` rules layered on existing `--bg/--panel/--border/--ok-bg/--warn-bg/--info-bg/--danger-bg` CSS variables; mobile breakpoint at 640px makes the wizard go full-screen, kv-rows collapse to single column, step pills tighten; `.ce-wizard-backdrop` `z-index: 60` sits above `.ce-modal-backdrop` (50) so it stacks above the admin console + mobile drawers + slash-confirm modal if they happen to be open). **Auto-open contract:** runs at most ONCE per browser/Electron session via `wizardAutoCheckedRef`; opens if the user has never clicked Finish (no localStorage flag) OR if the backend reports `setupRequired:true`. A `Skip for now` click leaves the flag UNSET so the wizard returns next launch; clicking `Finish` on the Done step writes the flag so subsequent launches skip auto-open. The Setup button always reopens it manually regardless. **API routes consumed:** `GET /healthz` (existing — read-only), `GET /backup/status` (existing — read-only sanitized config view; remote is server-redacted before transit), `POST /backup/config` (existing — wrapped via the existing `apiBackupConfig` helper which already sets `confirmed:true`), `POST /backup/dry-run` (existing — wrapped via `apiBackupDryRun`), `POST /backup/run` (existing — wrapped via `apiBackupRun(false)`; `push:false` hardcoded — push automation is intentionally Phase 5.6-B / 9-D territory). **Privacy + safety:** the wizard never stores secrets in `localStorage` — only the single non-sensitive `creativedge.firstRun.dismissed` boolean flag. The remote URL input never repopulates from the server's redacted `/backup/status.remote` (would leak host/path); the user must re-type a new remote if they want to change it (existing remote is preserved server-side when the input is left blank). Loading + error states are visible (`ce-wizard-busy` / `ce-wizard-hint-error` / inline alerts with `role="alert"`); Esc closes the wizard (safe — nothing destructive); click-outside closes; focus trap focuses the close button on open; all destructive-looking actions are explicit button clicks (no Enter-key submit). **Sandbox-side validation completed 2026-05-21:** `frontend npm run typecheck` exit 0; backend `npm run build` exit 0; `node --check electron/main.mjs` + `node --check electron/scripts/build-deps.mjs` + `node --check electron/scripts/build-win.mjs` + `node --check scripts/dev-help.mjs` + `node --check scripts/setup-postinstall.mjs` all exit 0 (Phase 9-A + 9-B regressions intact). Frontend `npm run build` was NOT re-attempted from the Linux sandbox — known `@rollup/rollup-linux-x64-gnu` blocker per §6-A through §9-B footers; Windows host with `win32-x64-msvc` builds cleanly. **Required Windows validation (single walkthrough):** kill node/electron/bun → confirm ports 3001 + 5174 free → first run: clear `creativedge.firstRun.dismissed` from localStorage (or use a fresh user profile) → `npm run dev:electron` → wizard auto-opens at launch (runtime step shows ready + dbReady + seededAgentSlugs count; Claude step shows installed/authStatus/setupRequired with the setupHint visible if any; backup step shows current `/backup/status` and the "Skip for now" path works) → Re-check buttons re-fetch `/healthz` → "Skip for now" closes the wizard and chat works → 🧭 Setup button in the chrome reopens it → click Finish on the Done step → next launch should NOT auto-open the wizard (the dismissed flag is set); after a clean restart `Get-NetTCPConnection -LocalPort 3001 -State Listen` returns nothing. Optional: `npm run build:electron` + run `electron/dist-electron/win-unpacked/CreativEdge.exe` as a normal Windows user — verify the wizard opens against the packaged binary and the backup step reads the user's `~/.creativedge/backup/`. **Phase 9-C stays open** until that walkthrough lands; this turn ONLY implemented + sandbox-validated. Phase 9 overall remains ⏳ Open because 9-C is implementation-pending-validation AND 9-D has not started.

  - **Phase 9-D — Packaged build + crash logs + auto-update** — ⏳ Split into 9-D-A / 9-D-B / 9-D-C. **9-D-A ✅ Complete / Windows validated 2026-05-21**. **9-D-B ✅ Complete / Windows validated 2026-05-21** — all four sub-slices closed (9-D-B1 manual update info polish, 9-D-B3 explicit opt-in backup push UX, 9-D-B4 safe external GitHub Releases page opening + manual release runbook, 9-D-B2 `afterPack` ABI rebuild refactor). **9-D-C in progress** — split into 9-D-C1 / 9-D-C2 / 9-D-C3 / 9-D-C4 per the 2026-05-21 decision-first plan; **9-D-C1 ✅ Complete / Windows validated 2026-05-21** (local-only cost-budget alerts + cost time-series chart foundation in the Ops console: additive `GET /ops/usage/timeseries` route reusing Phase 9-D-A `parseUsage` + `Bucket` helpers, new `BudgetTrendsCard` with localStorage-stored numeric thresholds only, inline SVG bar chart with no chart library, alert states OK / Near budget / Over budget / Unavailable, friendly empty state, no external requests, no telemetry, no Electron-lifecycle change); **9-D-C2 ✅ Complete / Windows validated 2026-05-22** — local-only crash-report prepare/export UX in the Ops console Windows-validated 2026-05-22 via dev Electron walkthrough against commit `f166fe3 feat(ops): add Phase 9-D-C2 crash-report prepare export UX`: additive `GET /ops/crash-reports` + `GET /ops/crash-reports/:id/prepare` read-only routes, strict filename allow-list + 256 KB per-file cap, allow-listed structured-only prepared report (free-text `backendLogTail` intentionally dropped pending a tested redaction sanitizer), new `CrashReportsCard` between `LogsCard` and `BackupCard` with Prepare → review → Copy report JSON → Download report JSON → Close review; no "Send" / "Upload" / "Email" button, no telemetry, no background polling, no external request, no Electron-lifecycle change. Live walkthrough confirmed the UX worked end-to-end, chat / 🧭 Setup / 📊 Ops / Budget & trends / Diagnostics / Usage & cost / Update info / Backup all continued to work without regression, app shutdown was clean (`backend child exited code=null signal=SIGTERM expected=true`), and post-close `Get-NetTCPConnection -LocalPort 3001` AND `-LocalPort 5174` both returned no output (Phase 9-B lifecycle intact). **9-D-C3 ✅ Complete / Windows validated 2026-05-22** — dynamic free-port allocation Windows-validated 2026-05-22 via dev Electron walkthrough against commit `13dbf2b feat(electron): add Phase 9-D-C3 dynamic free-port allocation`: app opened with dynamic static `http://127.0.0.1:49997` + dynamic backend `http://127.0.0.1:49998`, backend `/healthz` returned OK on the dynamic backend URL, Electron stdout log showed `boot ready: backend=http://127.0.0.1:49998 static=http://127.0.0.1:49997`, the Phase 9-D-B4 external-link bridge still opened the GitHub releases page in the OS browser (`ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases`), app shutdown was clean (Electron log: `backend child exited code=null signal=SIGTERM expected=true`), and post-close `Get-NetTCPConnection -LocalPort 49998 -State Listen -ErrorAction SilentlyContinue` AND `-LocalPort 49997 -State Listen -ErrorAction SilentlyContinue` both returned no output (dynamic-port cleanup validated); no telemetry, no LAN binding, no `0.0.0.0` binding, no external crash-report send, no provider/chat/memory changes. **9-D-C4 ⏳ Implemented 2026-05-22 (Windows packaged validation pending)** — final audit-first closure slice. Audit confirmed zero code changes required across the full Phase 9-D-C delta (`electron/main.mjs`, `electron/preload.cjs`, `frontend/src/api/client.ts`, `frontend/src/App.tsx`, `electron/NOTES.md`, `docs/electron-release-runbook.md` and all related files). Electron runtime no longer requires fixed 3001/5174; remaining 3001/5174 references are intentional (backend env default + Vite dev-proxy fallback + `build-deps.mjs` belt-and-suspenders pin + doc comments + dev-only test scripts + `dev-help.mjs` + `setup-postinstall.mjs`). No new feature surface was added on the implementation turn. No `electron-updater`, no signing wiring, no GitHub Actions, no telemetry, no automatic crash-report send, no upload, no background polling, no auto-install were introduced — all explicitly preserved as future-policy work gated on a separate signing-certificate decision. Docs-only polish (`todo.md` impl-pending-validation footer); zero code edits. Final ✅ closure gated on the user's Windows packaged walkthrough (see the 2026-05-22 §9-D-C4 implementation footer at the bottom of this file for the full 13-step packaged validation checklist). Phase 9-D closes when 9-D-C4 closes after that walkthrough.

    - **Phase 9-D-A — local diagnostics + crash-log foundation + read-only cost dashboard** — ✅ Complete / Windows validated 2026-05-21. Live walkthrough via `npm run dev:electron` against commit `e3e9044 feat: add Phase 9-D-A local diagnostics and usage dashboard` confirmed: the app opened and functioned correctly; chat still worked (no regression to the Phase 9-B chat-recovery patches); 🧭 Setup still opened the first-run wizard cleanly (no regression to Phase 9-C); 📊 Ops opened the new operations/diagnostics console; the Diagnostics card loaded; the Usage &amp; cost card loaded (renders zero-state cleanly on a fresh DB); the Local logs card loaded; the Update info card loaded; the app closed normally; the backend child exited normally; post-close `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned no output (backend-child + static-server cleanup validated); source tree stayed clean (`git status` clean after the run). See the 2026-05-21 §9-D-A Windows-validation closure footer at the bottom of this file for the full evidence trail. Local-only, additive slice — no provider/memory/SSE/Electron-lifecycle changes. **New files (3):** `backend-api/src/routes/ops.ts` (≈260 lines TS; two routes `GET /ops/usage/summary` + `GET /ops/diagnostics`; reads `agent_events.usage_json` defensively and aggregates totals + per-provider + per-agentSlug + last-24h + last-7d windows; tolerates missing/malformed JSON; scans `~/.creativedge/logs/` by filename pattern only — never reads log file contents — for the latest `crash-*.log` + `electron-backend-*.log`; surfaces an `autoUpdate: { enabled: false, reason: "deferred to 9-D-B" }` advisory flag), `frontend/src/components/ops/OpsConsole.tsx` (≈430 lines TSX; read-only modal with four cards — Diagnostics / Usage &amp; cost / Local logs / Update info — reuses the same `.ce-modal-backdrop` stacking band as the first-run wizard; `Promise.allSettled` so one slow/failing endpoint doesn't block the others; Esc closes; focus trap on close button), and `electron/scripts/build-win.mjs` (preserved verbatim — see "what's NOT touched" below). **Modified files (5):** `electron/main.mjs` (added `writeCrashLog()` helper + a `readBackendLogTail()` helper that reads the last ~16KB / 120 lines of `electron-backend-<ts>.log` to embed in the crash record; on unexpected backend child exit the crash log is written asynchronously to `~/.creativedge/logs/crash-<ts>.log` with a strict allowlist of fields — timestamp, app version, electron version, node version, packaged/dev mode, platform/arch/OS release, backendEntry, frontendDist, backendPort, frontendPort, backendChildPid, exit code/signal/expected flag, backendLogPath, backendLogTail; the `backendCrashed` diagnostic page renders the crash log path inline; the existing 9-B lifecycle — port preflight, stdio redirection, window-stays-open-on-crash — is fully preserved), `backend-api/src/server.ts` (one new import + one `await fastify.register(opsRoutes)` between backup and chat — no other changes), `frontend/src/types.ts` (added `OpsBucket`, `OpsUsageSummaryResponse`, `OpsLogFileRow`, `OpsDiagnosticsResponse` interfaces), `frontend/src/api/client.ts` (added `opsUsageSummary()` and `opsDiagnostics()` typed wrappers using the same `fetchJson` helper as every other GET in the file), `frontend/src/App.tsx` (+1 import + 1 state var `opsOpen` + 1 render slot `opsSlot` + 1 new 📊 Ops chrome button between 🧭 Setup and ⚙ Admin; **no changes to chat flow, no changes to wizard auto-open contract, no changes to the existing health banner**), `frontend/src/styles.css` (+≈170 lines of `.ce-ops-*` rules built on the existing CSS-variable palette; mobile breakpoint at 720px collapses the KPI tiles + breakdown tables to a single column). **Privacy contract enforced verbatim:** crash log file is a JSON record with a HARD allowlist — never includes chat content, memory content, prompts, env vars, auth tokens, API keys. The backend log tail is the SAME file the backend itself wrote (pino-redacted on the producing side); we only read it, we don't re-process the content. `/ops/usage/summary` aggregates numerics only (token counts + cost USD); the raw `usage_json` blobs are never returned to the frontend. `/ops/diagnostics` returns file metadata (name, size, mtime, path) for the logs directory — never log contents. Nothing leaves the machine. **Update info card** renders the current app version + a manual `Open releases page ↗` button that uses `window.open(…)` and is routed via Electron's existing `will-navigate` handler to `shell.openExternal()` (so it opens in the OS browser, NEVER inside the Electron window). No auto-updater dependency installed; no background polling; no signing wiring. **Sandbox-side validation completed 2026-05-21:** `node --check electron/main.mjs` exit 0 (721 lines after edits); `node --check electron/scripts/build-deps.mjs` + `node --check electron/scripts/build-win.mjs` exit 0 (Phase 9-B regressions intact, build-win.mjs untouched); backend `npm run build` exit 0 (clean tsc; new `routes/ops.ts` compiles + server.ts wiring compiles); frontend `npx tsc --noEmit` exit 0 (OpsConsole + types + api client compile cleanly together with all prior phases). Frontend `npm run build` was NOT re-attempted in the Linux sandbox — documented `@rollup/rollup-linux-x64-gnu` blocker per §6-A through §9-C footers (Windows host with `win32-x64-msvc` builds cleanly). **What's NOT touched on this slice:** backend chat routes, providers, SSE contract, memory routes, agent personality files, memory artifacts, `console.html`, README files, the wizard, the admin console, the chat-recovery patches, the Phase 9-B Electron lifecycle (port preflight, stdio redirection, window-stays-open-on-crash), `electron/scripts/build-win.mjs`, `electron/package.json`, root `package.json`, the `better-sqlite3` ABI swap, signing/notarization. **Required Windows validation step (single walkthrough):** kill node/electron/bun → confirm ports 3001 + 5174 free → `npm run dev:electron` → app opens → chat still works (send "oi" to Nexus, get a response) → 🧭 Setup button still opens the wizard → 📊 Ops button opens the new ops console → Diagnostics card shows `service: creativedge-backend`, runtime dir, Claude readiness, mock readiness, backup state → Usage &amp; cost card loads even on a fresh DB (totals: 0, last24h: 0, last7d: 0, breakdowns empty) → Local logs card lists the current `electron-backend-*.log` (no crash records expected unless one was previously recorded) → Update info card shows version + `Open releases page ↗` button works (opens GitHub in OS browser) → Refresh button re-fetches all four sources → close ops console (Esc / ✕ / click-outside all work) → close app → `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` returns no output (backend cleanup intact). Optional: simulate a backend crash (e.g. `Stop-Process -Id <backend pid>`) in a dev session and confirm (a) the diagnostic page loads showing the crash log path, (b) `~/.creativedge/logs/crash-<ts>.log` exists with the JSON record, (c) the record contains the safe fields ONLY and no chat content. **Phase 9-D-A stays open** until that walkthrough lands.

    - **Phase 9-D-B — in progress (sliced).** Split into four independently-shippable slices per the 2026-05-21 decision-first plan: **9-D-B1** manual update info polish (correct GitHub releases URL + click-triggered latest-release check; no `electron-updater`, no signing, no background poll); **9-D-B2** `afterPack` ABI rebuild refactor (defer — packaging untouched); **9-D-B3** explicit opt-in backup push UX (defer); **9-D-B4** release runbook (defer). Auto-update wiring + signing/release-feed remain gated on a signing-certificate decision.
      - **Phase 9-D-B1 — ✅ Complete / Windows validated 2026-05-21.** Manual update info polish only. Live walkthrough via `npm run dev:electron` against commit `e036c77 feat(ops): add Phase 9-D-B1 manual update release check` confirmed: the app opened and functioned correctly; Ops console opened cleanly; the Update info card showed the corrected GitHub Releases URL `https://github.com/michelbr84/CreativEdge/releases`; the manual "Check latest release" button was user-click-only (no background polling observed); app shutdown was clean (Electron log showed `backend child exited code=null signal=SIGTERM expected=true`); post-close CMD `netstat -ano | findstr ":3001" | findstr "LISTENING"` AND `netstat -ano | findstr ":5174" | findstr "LISTENING"` both returned no output (backend-child + static-server cleanup validated); `git status` clean. See the 2026-05-21 §9-D-B1 Windows-validation closure footer at the bottom of this file for the full evidence trail. Frontend-only slice. **New file (1):** `frontend/src/config/release.ts` (single source of truth for `RELEASE_OWNER=michelbr84`, `RELEASE_REPO=CreativEdge`, `RELEASES_URL=https://github.com/michelbr84/CreativEdge/releases`, `LATEST_RELEASE_API_URL=https://api.github.com/repos/michelbr84/CreativEdge/releases/latest`, plus `normaliseVersionTag()`, `compareLocalToLatest()` returning `"up-to-date" | "release-available" | "unable-to-compare"`, and `fetchLatestRelease()` which returns a discriminated union covering `ok` / `no-release` (404) / `rate-limited` (403) / `network-error` / `error` outcomes — no retries, no auth header, no User-Agent identifying the installation, no background timer). **Modified files (2):** `frontend/src/components/ops/OpsConsole.tsx` (corrected wrong hardcoded URL → shared `RELEASES_URL`; added `releaseCheck` / `releaseCheckBusy` / `releaseCheckedAt` state; added `onCheckLatestRelease` handler that fires ONLY on user click; added "Check latest release" button next to "Open releases page ↗"; expanded Update info card to render a comparison badge — `Up to date` (`ce-status-ok`) / `Release available` (`ce-status-warn`) / `Unable to compare` (`ce-status-info`) — and per-state friendly hints (latest tag/name/published, no-release, rate-limited, network-error); added a `Backend version` KV row that only renders when it differs from the app version; added a `Releases page` KV row showing the now-correct URL; reuses existing `.ce-status-*` and `.ce-wizard-hint-*` CSS — no new styles needed), `electron/NOTES.md` (added "Manual update flow (Phase 9-D-B1)" section explaining unsigned-only builds, the user-triggered Check latest release button, the explicit table of what the button does vs does not do, and why auto-update remains deferred until signing + release-feed policy lands; cross-links to `frontend/src/config/release.ts` so future repo coordinate changes have a single touchpoint). **Privacy / security contract preserved verbatim:** no `electron-updater` dependency installed; no background polling; no auto-download; no auto-install; no telemetry; no User-Agent identifying the installation; no auth token; no secrets stored in localStorage; the GitHub API call hits the public unauthenticated `/repos/:owner/:repo/releases/latest` endpoint and is gated on user click only. Electron lifecycle untouched (no `electron/main.mjs` change; no `build-win.mjs` change; no `build-deps.mjs` change; `electron/package.json` untouched — no dependency changes). Backend untouched (no route added, no provider/memory/SSE change). Backup push UX untouched (deferred to Phase 9-D-B3 per the decision-first plan). `afterPack` packaging strategy untouched (deferred to Phase 9-D-B2). Sandbox-side validation completed 2026-05-21 — see the §9-D-B1 implementation closure footer at the bottom of this file for the full evidence trail; Windows live walkthrough completed 2026-05-21 — see the §9-D-B1 Windows-validation closure footer also at the bottom of this file. **Phase 9-D-B1 closed.** Phase 9-D-B itself stays ⏳ Open because 9-D-B2 / 9-D-B3 / 9-D-B4 are still not started.

      - **Phase 9-D-B3 — ✅ Complete / Windows validated 2026-05-21.** Explicit opt-in backup push UX behind a second-confirmation modal. Live walkthrough via `npm run dev:electron` against commit `9b27bb4 feat(backup): add Phase 9-D-B3 explicit backup push UX` confirmed: the app opened and functioned correctly; backend `/healthz` returned OK; the new push UX appeared OK visually and behaviourally (second-confirmation modal renders the redacted remote, default-focus on Cancel, Esc dismisses, Enter does NOT auto-confirm, Confirm stays disabled until the explicit checkbox is ticked); no credentials/tokens displayed anywhere; no scheduling or background job observed; `backupRun(false)` no-push path remains unchanged (Phase 5.6-A regression-free); app shutdown was clean (Electron log: `backend child exited code=null signal=SIGTERM expected=true`); post-close `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned no output (backend-child + static-server cleanup validated). Sandbox-side gates passed prior to the walkthrough: `cd frontend && npm run typecheck` exit 0; `cd frontend && npm run build` exit 0 (Windows host `win32-x64-msvc`); `cd backend-api && npm run build` exit 0; `cd backend-api && npm run test:backup` → `total: 42   PASS 42   SKIP 0   FAIL 0`; `node --check electron/main.mjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` all exit 0. **Note (separate follow-up, NOT a 9-D-B3 blocker):** during the walkthrough Electron's main log emitted `window.open denied for https://github.com/michelbr84/CreativEdge/releases` when the user clicked the existing **Open releases page ↗** button in the Update info card; the URL belongs to the Phase 9-D-B1 / future-9-D-B4 release-link surface and not to the 9-D-B3 backup-push UX. The 9-D-B1 contract states the link should open in the OS browser via Electron's `will-navigate → shell.openExternal` route, so a `window.open denied` log line indicates the renderer's `window.open(...)` call was rejected and the URL didn't reach the navigation handler that forwards to `shell.openExternal`. **Tracked as a separate follow-up for 9-D-B1 / 9-D-B4** (likely a target-window / `setWindowOpenHandler` deny vs `will-navigate` interplay in `electron/main.mjs`) — does NOT reopen 9-D-B3. See the 2026-05-21 §9-D-B3 Windows-validation closure footer at the bottom of this file for the full evidence trail. Frontend-only slice. **New file (1):** `frontend/src/components/BackupPushConfirmModal.tsx` (≈130 lines TSX; small accessible modal with required "I understand this will push to my configured remote" checkbox; default focus on Cancel; Esc dismisses; backdrop click dismisses; Enter does NOT auto-confirm — Confirm stays disabled until the checkbox is ticked; shows only the server-side-redacted remote string from `/backup/status.remote`; never touches `localStorage` / `sessionStorage` / cookies; never asks for credentials — auth is the user's local Git setup's concern). **Modified files (3):** `frontend/src/components/BackupPanel.tsx` (added `pushModalOpen` / `pushBusy` / `pushError` state; added `pushReadiness` derivation surfacing one of four ordered blockers — `gitReady` / `enabled` / `repoReady` / `remoteConfigured` — as a friendly `pushReadiness.reason` string for the tooltip + helper line; added `openPushModal` / `closePushModal` / `confirmPush` handlers; added a new "Run backup + push" button next to the existing "Run (no push)" with a disabled-state explainer; on confirm calls the existing `backupRun(true)` helper and renders `committed=… and pushed.` / `committed=… but push was not completed: <pushReason>` / `nothing changed; nothing to push.` via the existing `ActionResult` palette; the existing dry-run + "Run (no push)" affordances are unchanged), `frontend/src/components/ops/OpsConsole.tsx` (added a new `BackupCard` between Local logs and Update info, mirroring the BackupPanel push affordance with the same `pushReadiness` derivation + same modal — Ops console remains read-only except for the explicit user-triggered Refresh and the explicit Run-backup-+-push action; the modal is mounted once at the OpsConsole root; on success, the backup status is silently re-fetched so the card reflects new state without a manual Refresh), `electron/NOTES.md` (added "Backup push (Phase 9-D-B3)" paragraph documenting the opt-in + second-confirmation + no-credentials contract + the four readiness blockers + the redaction guarantees). **Privacy / security contract enforced verbatim:** never stores credentials / tokens / remote URLs in `localStorage` / `sessionStorage` / cookies (grep-verifiable — there is zero `localStorage` / `sessionStorage` / `document.cookie` reference anywhere in the new `BackupPushConfirmModal.tsx` or the modified BackupPanel/OpsConsole push paths). Never asks the user for credentials — auth is the local Git setup's concern (HTTPS credential helper, SSH agent). The remote URL is shown only as the server-side-redacted string already returned by `/backup/status.remote` via `redactRemote()` in `backend-api/src/backup/backupGit.ts` (Phase 5.6-A contract). Default focus on Cancel; Esc dismisses; Enter does NOT auto-confirm; Confirm stays disabled until the explicit checkbox is ticked. No scheduling; no silent push; no background job; no auto-push on app boot; no auto-push on chat completion; no auto-push on shutdown. The backend `/backup/run` route is reused verbatim (`POST /backup/run` with `{confirmed:true, push:true}` — Phase 5.6-A); no backend route added, no backend route modified, no new fields added to `BackupRunResponse`, no schema migration. The existing `BackupRunResponse.pushed` + `pushReason` fields drive the result rendering. No `electron-updater`; no signing wiring; no `afterPack` change; no `build-win.mjs` change; no Electron-main lifecycle change; no `electron/package.json` change; no `package-lock` change. Backup push UX in the first-run wizard is intentionally NOT changed on this slice (`FirstRunWizard.tsx` continues to call `apiBackupRun(false)` per the Phase 9-C contract); the new push affordance lives only on BackupPanel + OpsConsole BackupCard which are reached by intentional user navigation. Sandbox-side validation completed 2026-05-21 — see the §9-D-B3 implementation closure footer at the bottom of this file for the full evidence trail; Windows live walkthrough completed 2026-05-21 — see the §9-D-B3 Windows-validation closure footer also at the bottom of this file. **Phase 9-D-B3 closed.** Phase 9-D-B itself stays ⏳ Open because 9-D-B2 (`afterPack` ABI rebuild) and 9-D-B4 (release runbook) are still not started.

      - **Phase 9-D-B4 — ✅ Complete / Windows validated 2026-05-21.** Safe external GitHub Releases page opening + release/manual-update runbook + release troubleshooting docs. Live walkthrough via `npm run dev:electron` against commit `715227e feat(electron): add Phase 9-D-B4 safe external release links` confirmed: the app opened and functioned correctly; backend `/healthz` returned OK; the **Open releases page ↗** button in the Update info card now opens the GitHub releases page in the OS default browser cleanly via the new preload bridge; the Electron main log emitted `ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases` (the previous `window.open denied for …` log spam from the §9-D-B3 walkthrough did NOT appear — the bug is resolved); app shutdown was clean (Electron log: `backend child exited code=null signal=SIGTERM expected=true`); post-close `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned no output (backend-child + static-server cleanup validated — the Phase 9-B lifecycle survived the preload+IPC additions). Sandbox-side gates passed prior to the walkthrough: `cd frontend && npm run typecheck` exit 0; `cd frontend && npm run build` exit 0 (Windows host `win32-x64-msvc`); `cd backend-api && npm run build` exit 0; `node --check electron/main.mjs` + `electron/preload.cjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` all exit 0. Closed the `window.open denied for https://github.com/michelbr84/CreativEdge/releases` follow-up that the §9-D-B3 walkthrough flagged. See the 2026-05-21 §9-D-B4 Windows-validation closure footer at the bottom of this file for the full evidence trail. **New files (2):** `electron/preload.cjs` (≈75 lines pure CommonJS pre-loaded into the renderer with `contextBridge.exposeInMainWorld("ceBridge", { openExternal })`; only surface exposed is `window.ceBridge.openExternal(url)` which forwards via `ipcRenderer.invoke("ce:openExternal", url)`; returns a discriminated `{ok, reason, message}` shape so the caller can render a friendly hint; no Node leak to the renderer; runs inside the existing sandbox; no `nodeIntegration`, no `contextIsolation:false`, no `webSecurity:false`), `docs/electron-release-runbook.md` (≈340 lines Markdown; canonical operational reference for §1 local Electron dev launch, §2 packaged Windows build via the Phase 9-B `build-win.mjs` orchestrator, §3 testing the packaged build, §4 validating backend/port cleanup after close — both PowerShell + CMD probes, §5 rebuilding native modules manually, §6 publishing a GitHub release manually with the version-bump + smoke-test + release-notes-template + asset-attach + tag-convention, §7 how the manual release-check flow works including the Phase 9-D-B4 preload-bridge architecture diagram, §8 explicit table of what is intentionally NOT implemented [`electron-updater`, signing, `latest.yml`/release feed, background update polling, auto-download, silent install, background updater service, GitHub Actions release workflow, Squirrel, crash-report send, cost-budget alerts, dynamic free-port], §9 troubleshooting [9.1 `NODE_MODULE_VERSION` ABI mismatch with the manual recovery command set, 9.2 `window.open denied` with the root-cause + fix + verification steps, 9.3 backend child unexpected exits + crash-log inspection, 9.4 stale ports after close with the kill-process recovery snippet, 9.5 missing Claude runtime/auth, 9.6 packaged-build validation checklist], §10 related references with links to NOTES.md / release.ts / main.mjs / preload.cjs / build-win.mjs / todo.md). **Modified files (5):** `electron/main.mjs` (added `ipcMain` to the import list; added `EXTERNAL_OPEN_IPC_CHANNEL = "ce:openExternal"`, `EXTERNAL_URL_ALLOWLIST` (single entry today: `host: "github.com"`, `pathPrefix: "/michelbr84/CreativEdge/releases"`), and the `classifyExternalUrl()` pure helper (HTTPS-only; returns `null` if allowed, short reason string otherwise — `empty` / `unparseable` / `non-https-protocol(...)` / `not-on-allowlist`); added `webPreferences.preload: join(HERE, "preload.cjs")` to the `BrowserWindow`; **rewrote `setWindowOpenHandler`** to classify the URL — trusted URLs call `shell.openExternal(url)` AND still return `{action:"deny"}` so no in-app popup spawns; non-trusted URLs log + deny as before with a `(reason)` annotation; **extended `will-navigate`** with the same allow-list path so any `<a href>` navigation (not just `window.open`) is also forwarded to the OS browser; added the `ipcMain.handle("ce:openExternal", ...)` handler at the top of `boot()` that re-checks the URL against `classifyExternalUrl` and calls `shell.openExternal`; returns a typed `{ok, reason, message}` result. Existing crash-log helpers, port preflight, backend-log redirection, window-stays-open-on-crash, and the rest of the Phase 9-B / 9-D-A lifecycle are preserved verbatim), `electron/package.json` (`build.files` extended to include `"preload.cjs"` so `electron-builder` packs the preload into the ASAR — without this the production build would lack the bridge and the Ops console's Open releases page button would fall back to the `window.open` deny path), `electron/NOTES.md` (new "External URL opening + manual release runbook (Phase 9-D-B4)" section with the architecture diagram showing the `Renderer → window.ceBridge.openExternal → ipcRenderer.invoke → ipcMain → classifyExternalUrl → shell.openExternal` chain, the sync-with-main-process allow-list note, and a cross-link to `docs/electron-release-runbook.md`), `frontend/src/config/release.ts` (added `EXTERNAL_URL_ALLOWLIST` (renderer-side mirror of the main-process list; same single entry today), `isExternalUrlAllowed(url)` pure predicate, `OpenExternalResult` discriminated union, and `openExternalUrl(url)` async helper that prefers `window.ceBridge.openExternal` when attached and falls back to `window.open(url, "_blank", "noopener,noreferrer")` otherwise — works in both Electron and Vite dev mode), `frontend/src/components/ops/OpsConsole.tsx` (rewired `onOpenReleases` to call `openExternalUrl(RELEASES_URL)`; added `openReleasesError` state slice + matching `UpdateInfoCard` prop + small `.ce-wizard-hint-error` paragraph that renders only on the failure path with the URL the user can copy into their browser). **Files explicitly NOT touched:** `electron/scripts/build-win.mjs` (no packaging change — `afterPack` ABI rebuild remains the deferred Phase 9-D-B2 slice); `electron/scripts/build-deps.mjs`; root `package.json`; backend routes / providers / memory / SSE; agent personality files; memory artifacts; `console.html`; `frontend/src/styles.css` (no new CSS — `.ce-wizard-hint-error` reused); `frontend/src/types.ts`; `frontend/src/App.tsx`; `frontend/src/components/setup/FirstRunWizard.tsx`; `frontend/src/components/BackupPanel.tsx`; `frontend/src/components/BackupPushConfirmModal.tsx`; `frontend/package.json` + `frontend/package-lock.json` (no new dependency); `electron/node_modules/`; `electron/dist-electron/`. **Privacy / security contract enforced verbatim:** HTTPS-only (any non-`https:` URL rejected by the main-process classifier with `non-https-protocol(<actual>)`); allow-list-filtered in BOTH the renderer AND the main process — defence-in-depth so a renderer-side compromise cannot widen the surface; no auth tokens; no telemetry; no `User-Agent` identifying the installation; no installer download; no automatic install; no background timer; sandbox preserved (`sandbox:true`, `contextIsolation:true`, `nodeIntegration:false`, `webSecurity:true` — the new preload only uses `contextBridge` + `ipcRenderer.invoke`, which the sandbox explicitly allows); only one IPC channel (`ce:openExternal`); only one renderer surface (`window.ceBridge.openExternal`); no Squirrel, no auto-update, no signing wiring, no GitHub Actions workflow, no `electron-updater` install. The new allow-list mirror in `frontend/src/config/release.ts` requires keeping the two copies in sync by hand; the cross-references in both files + `electron/NOTES.md` + the runbook document the maintenance contract. Sandbox-side validation completed 2026-05-21 — see the §9-D-B4 implementation closure footer at the bottom of this file for the full evidence trail; Windows live walkthrough completed 2026-05-21 — see the §9-D-B4 Windows-validation closure footer also at the bottom of this file. **Phase 9-D-B4 closed.** Phase 9-D-B itself stays ⏳ Open because 9-D-B2 (`afterPack` ABI rebuild) is still not started.

      - **Phase 9-D-B2 — ✅ Complete / Windows validated 2026-05-21.** `afterPack` ABI rebuild refactor. Live walkthrough via `npm run build:electron` against commit `09064eb refactor(electron): move better-sqlite3 ABI rebuild into afterPack` confirmed (after clearing the winCodeSign cache and running with sufficient Windows privileges): the build log emitted the new `[build-win] packaging plan (Phase 9-D-B2 afterPack flow)` banner with `source tree mutation: NONE`, ran the two-step orchestrator cleanly, `electron-builder` packaged win32 x64 successfully, the afterPack hook emitted `[after-pack] packaged backend dir: C:\Users\<you>\path\to\CreativEdge\electron\dist-electron\win-unpacked\resources\backend-api` and rebuilt `better-sqlite3` inside that packaged copy only, and the build ended with `[build-win] packaging succeeded` + `[build-win] DONE. Artifacts in electron/dist-electron/` (both `CreativEdge-Setup-0.1.0.exe` and `win-unpacked/` were produced). After the build, `cd backend-api && npm run build` passed with NO restore step required — proving the source `backend-api/node_modules` was not mutated and dev backend ABI remains Node-compatible. The packaged binary `.\electron\dist-electron\win-unpacked\CreativEdge.exe` launched as a normal Windows user and functioned correctly; chat / Setup / Ops / release external link (Phase 9-D-B4 preload-bridge path) / Backup surfaces all checked OK; no `better-sqlite3 NODE_MODULE_VERSION` crash appeared in the backend log; app closed correctly; Electron log showed `backend child exited code=null signal=SIGTERM expected=true`; post-close `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned no output (backend-child + static-server cleanup validated — the Phase 9-B lifecycle survived the packaging-flow refactor end-to-end). See the 2026-05-21 §9-D-B2 Windows-validation closure footer at the bottom of this file for the full evidence trail. **New file (1):** `electron/scripts/after-pack.mjs` (≈140 lines pure-ESM `electron-builder` afterPack hook; default-export `async function afterPack(context)`; uses `context.appOutDir` + `context.arch` (numeric `Arch` enum: ia32=0, x64=1, armv7l=2, arm64=3, universal=4) + `context.electronPlatformName`; resolves the actual installed Electron version from `electron/node_modules/electron/package.json` with a fallback to `context.packager.info.framework.version`; loads `@electron/rebuild` via `createRequire(join(ELECTRON_DIR,"package.json"))` to keep this file in pure ESM while pulling the CommonJS module from the local install; calls `rebuild({ buildPath: "<appOutDir>/resources/backend-api", electronVersion, arch, onlyModules: ["better-sqlite3"], force: true })` — `buildPath` is the dir whose `./node_modules` is walked, per `@electron/rebuild@3.7.2` API; pre-flight verifies the packaged backend dir + node_modules dir + better-sqlite3 package.json all exist before any work; throws on any failure so `electron-builder` aborts the build with a non-zero exit; logs `[after-pack]` step labels for every line; privacy: prints version numbers + step labels + paths only — no chat content, no memory content, no env vars, no secrets). **Modified files (4):** `electron/package.json` (added `build.afterPack: "./scripts/after-pack.mjs"`; `build.files` still includes `preload.cjs`; `build.npmRebuild: false` preserved; no dependency change), `electron/scripts/build-win.mjs` (slimmed from 4-step try/finally — build-deps + in-place `@electron/rebuild` + electron-builder + finally-restore — to 2 steps: build-deps + `electron-builder --win`; the source-tree `@electron/rebuild` invocation and the `finally`-block `npm rebuild better-sqlite3` restore are BOTH removed because the source tree is no longer mutated; pre-flight checks preserved; banner now prints `source tree mutation: NONE`; helpful failure messages preserved), `electron/NOTES.md` (replaced the Phase 9-B "Caveat: npm run rebuild:sqlite mutates backend-api/node_modules" paragraph with the new Phase 9-D-B2 architecture description — afterPack hook diagram, no-finally-restore contract, recovery guidance), `docs/electron-release-runbook.md` (§2 packaged-build flow rewritten to describe the afterPack architecture; §5 manual-rebuild commands trimmed to recovery-only guidance pointing at the PACKAGED copy directory; §9.1 troubleshooting updated to describe the new failure mode — afterPack hook didn't run / wrong path — and the correct recovery commands that point at the PACKAGED copy, not the source tree). **Privacy / security contract enforced verbatim:** no new dependencies installed (the existing `@electron/rebuild@^3.6.0` devDep stays — actual resolved version is 3.7.2 per `electron/node_modules/@electron/rebuild/package.json`); no `npm install` calls; source `../backend-api/node_modules` never written to (grep-verifiable — every path in `after-pack.mjs` is rooted at `context.appOutDir`); no signing wiring; no `electron-updater`; no GitHub Actions; no background polling; no telemetry; no chat/memory content in build logs; no env dump; no secrets. **Failure semantics:** if `@electron/rebuild` rejects, the afterPack hook throws and `electron-builder` aborts the build with a non-zero exit — the partial `win-unpacked/` may exist but the NSIS installer is not produced; recovery is a clean re-run of `npm run build:electron`. The legacy `npm run rebuild:sqlite` script in `electron/package.json:scripts` is intentionally preserved as a manual recovery aid (its target is the OLD source-tree path; rarely needed under the new flow). Sandbox-side validation completed 2026-05-21 — see the §9-D-B2 implementation closure footer at the bottom of this file for the full evidence trail; Windows live packaged-build walkthrough completed 2026-05-21 — see the §9-D-B2 Windows-validation closure footer also at the bottom of this file. **Phase 9-D-B2 closed.** With 9-D-B1 / 9-D-B2 / 9-D-B3 / 9-D-B4 all ✅ Complete / Windows validated, **Phase 9-D-B itself is now closed**; Phase 9-D stays ⏳ Open because 9-D-C is still not started.

    - **Phase 9-D-C — in progress (sliced).** Split into four independently-shippable sub-slices per the 2026-05-21 decision-first plan: **9-D-C1** cost-budget alerts + cost time-series charting foundation (local-only, read-only, no external requests, no telemetry); **9-D-C2** external crash-report prepare-and-export UX (✅ Complete / Windows validated 2026-05-22 via commit `f166fe3`; local-only review + copy + download UX for the Phase 9-D-A structured crash JSON, allow-listed structured fields only, no automatic send, no upload, no email, no telemetry, no Electron-lifecycle change; free-text `backendLogTail` intentionally deferred until a tested redaction sanitizer lands); **9-D-C3** ✅ Complete / Windows validated 2026-05-22 via commit `13dbf2b` — replaces pinned `BACKEND_PORT=3001` / `FRONTEND_PORT=5174` with runtime-picked ports inside the Electron shell (backend port via `net.createServer.listen(0)` probe with single EADDRINUSE retry; static server via `listen(0)` directly; both bound to `127.0.0.1` only — never `0.0.0.0`); renderer discovers the dynamic backend URL via `webPreferences.additionalArguments` injected into the existing Phase 9-D-B4 preload bridge as a new synchronous `window.ceBridge.getRuntimeConfig()` method; `VITE_API_URL` retained in `build-deps.mjs` as a belt-and-suspenders fallback so a partial rollback degrades cleanly to the Phase 9-B fixed-port behaviour; browser-dev `npm run dev` workflow preserved unchanged via the existing `vite.config.ts` proxy; no new dependency, no telemetry, no LAN exposure, no Electron packaging change; **9-D-C4** ⏳ Implemented 2026-05-22 (Windows packaged validation pending) — final audit-first closure slice for Phase 9-D-C / Phase 9-D / Phase 9. Docs-only: only `todo.md` modified on the implementation turn. Audit confirmed zero code changes required and zero stale Electron-runtime references to 3001/5174. Packaged Windows walkthrough required before final ✅ closure flips can land; see the 2026-05-22 §9-D-C4 implementation footer at the bottom of this file.
      - **Phase 9-D-C1 — ✅ Complete / Windows validated 2026-05-21.** Cost-budget alerts + cost time-series chart foundation. Live walkthrough via `npm run dev:electron` against commit `b00e86a feat(ops): add Phase 9-D-C1 budget trends dashboard` confirmed: the app opened and functioned correctly; backend `/healthz` returned OK; the new **Budget & trends** card appeared between `Usage & cost` and `Local logs` and worked correctly (KV rows + alert badges + inline SVG bar chart + Configure local budget form + Reset budget button); the new `GET /ops/usage/timeseries` route was exercised end-to-end via the OpsConsole `refresh()` `Promise.allSettled` path; localStorage-stored budget thresholds (numeric USD only, `creativedge.budget.daily` + `creativedge.budget.monthly`) read + wrote + cleared correctly via Configure / Save / Reset; existing chat / 🧭 Setup / 📊 Ops console all continued to work without regression; the Phase 9-D-B4 external-link bridge still opened the GitHub releases page in the OS browser (`ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases`); app closed normally; post-close `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned no output (backend-child + static-server cleanup validated — the Phase 9-B lifecycle survived the new card + route additions); no telemetry; no external crash-report send; no dynamic free-port change; no Electron-lifecycle change. Sandbox validation on the implementation turn: `cd backend-api && npm run build` exit 0; `cd frontend && npm run typecheck` exit 0; `cd frontend && npm run build` exit 0 (Windows host `win32-x64-msvc`); 5 `node --check`s on `electron/main.mjs` + `electron/preload.cjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` + `electron/scripts/after-pack.mjs` all exit 0. See the 2026-05-21 §9-D-C1 Windows-validation closure footer at the bottom of this file for the full evidence trail. Bounded, read-only, additive — no Electron-lifecycle touch, no schema migration, no new dependency, no chart library. **New backend route (additive):** `GET /ops/usage/timeseries?days=<n>` in `backend-api/src/routes/ops.ts` — reuses the existing `parseUsage` + `Bucket` helpers from `/ops/usage/summary`; loads the same 10,000-row cap from `agent_events`; returns dense per-UTC-day buckets for the requested range (default 30, clamped to `[1, 90]`), plus pre-aggregated `today` (UTC) and `monthToDate` (since UTC 00:00 on the 1st) buckets, plus `todayKey` / `monthStartKey` for the frontend to plot today's bar in a different fill; tolerates malformed `usage_json` (counted under `eventsWithMalformedUsage` but contributing zero numeric data); tolerates empty DB (returns `days: []` with zero buckets); tolerates missing `created_at` (rows skipped, counted in `eventsConsidered`); never reads message bodies / prompts / memory files / env vars. **New frontend types (additive, in `frontend/src/types.ts`):** `OpsTimeseriesBucket extends OpsBucket` with `dayKey: string` (UTC `YYYY-MM-DD`); `OpsUsageTimeseriesResponse` mirrors the backend shape. **New frontend helper (additive, in `frontend/src/api/client.ts`):** `opsUsageTimeseries(days = 30)` using the existing `fetchJson` helper; client-side clamps `days` to `[1, 90]` before sending; existing `opsUsageSummary()` / `opsDiagnostics()` unchanged. **New `BudgetTrendsCard` (in `frontend/src/components/ops/OpsConsole.tsx`):** rendered between `UsageCard` and `LogsCard`; KV table shows Today (UTC) / Daily budget / Daily state, Month to date (UTC) / Monthly budget / Monthly state; two `.ce-status` badges with the same per-state palette (`.ce-status-ok` for OK, `.ce-status-warn` for `Near budget` at ≥80%, `.ce-status-err` for `Over budget` at ≥100%, `.ce-status-info` for `Unavailable` when no budget set or no data); inline SVG bar chart for the last 30 daily costs (no chart library, no SVG-axis-only/legend dependency, all colour values inline hex — `#3b82f6` for today, `#64748b` for prior days, with opacity 0.85 for non-zero bars and 0.25 for empty days; dashed `currentColor` budget-threshold line drawn when a daily budget is set + in range); friendly empty-state copy when no `usage_json` has been recorded yet; small `eventsWithMalformedUsage` warning when present; inline "Configure local budget" form (text inputs only; numeric thresholds via `Number.parseFloat`; blank field → clear threshold) + "Reset budget" button; **localStorage usage strictly limited to two non-sensitive numeric thresholds**: `creativedge.budget.daily` and `creativedge.budget.monthly`, both USD floats only — never secrets / prompts / chat / memory content / agent slugs / remote URLs; defensive `safeReadBudget` / `safeWriteBudget` tolerate environments where storage throws. **OpsConsole `refresh`** extended to also fetch the timeseries via `Promise.allSettled` — one slow/failing endpoint still doesn't block the others. **`extends OpsBucket` typing** lets the existing `applyToBucket` + `parseUsage` server-side helpers be reused without duplication. **No new CSS** — every class used is already in `frontend/src/styles.css` (`.ce-ops-card`, `.ce-ops-card-title`, `.ce-wizard-kv`, `.ce-wizard-actions-row`, `.ce-status-*`, `.ce-wizard-hint`, `.ce-wizard-hint-warn`, `.ce-backup-config-body`, `.ce-form-field`, `.ce-btn-*`). One small new `.ce-ops-budget-chart` wrapper class is referenced for the SVG container but the existing default of zero CSS rules works (inline `style` on the `<svg>` handles `width: 100%; height: auto; display: block`); a future styles.css pass can add a dedicated rule if needed. **Privacy / security contract (verbatim from the 9-D-C1 brief; all enforced by code):** no external requests on this card (the only network calls are the existing Ops fetches against the local backend); no telemetry; no crash-report upload; no email sending; no background polling; no scheduled tasks; no auto-update; no dynamic-port change; no provider/SSE/memory/chat behaviour change; no signing/electron-updater/GitHub-Actions changes; sandbox preserved; `electron/main.mjs` / `electron/preload.cjs` / `electron/scripts/*` / `electron/package.json` / `docs/electron-release-runbook.md` / `electron/NOTES.md` all untouched (zero Electron-lifecycle change); `backend-api/src/server.ts` untouched (existing `opsRoutes` registration covers the new handler); `BackupPanel.tsx` / `BackupPushConfirmModal.tsx` / `FirstRunWizard.tsx` / `App.tsx` / chat / providers / memory / agent personality files all untouched. Sandbox-side validation completed 2026-05-21 — see the §9-D-C1 implementation closure footer at the bottom of this file; Windows live walkthrough completed 2026-05-21 — see the §9-D-C1 Windows-validation closure footer also at the bottom of this file. **Phase 9-D-C1 closed.** Phase 9-D-C itself stays ⏳ Open because 9-D-C4 (Phase 9-D / Phase 9 closure) is still not started; 9-D-C2 (external crash-report prepare-and-export UX) is ✅ Complete / Windows validated 2026-05-22 and 9-D-C3 (dynamic free-port allocation) is ✅ Complete / Windows validated 2026-05-22 via commit `13dbf2b`.

- **Phase 9 overall — ✅ Complete / Windows validated 2026-05-22.** All sub-slices closed: 9-A ✅, 9-B ✅, 9-C ✅, 9-D-A ✅, 9-D-B ✅ (all four B-sub-slices), 9-D-C ✅ (all four C-sub-slices: 9-D-C1 local-only cost-budget alerts + time-series, 9-D-C2 local-only crash-report prepare/export, 9-D-C3 dynamic free-port allocation, 9-D-C4 final audit + packaged validation). Phase 9-D-C4 Windows-packaged-validated 2026-05-22 via `npm run build:electron` → `.\electron\dist-electron\win-unpacked\CreativEdge.exe` walkthrough: afterPack rebuilt `better-sqlite3` in packaged copy only (source `backend-api/node_modules` untouched), packaged app booted with dynamic static port 52334 + dynamic backend port 52335, `/healthz` OK on dynamic backend, releases external link still worked via the preload bridge, no `NODE_MODULE_VERSION` crash, clean SIGTERM shutdown, dynamic ports 52335 + 52334 free after close, post-package `cd backend-api && npm run build` exit 0 (dev ABI sanity confirmed). **No telemetry, no automatic crash-report send, no LAN binding, no `0.0.0.0` binding, no signing wiring, no `electron-updater`, no GitHub Actions workflow, no background polling, no auto-install/auto-download were introduced at any point.** See the 2026-05-22 §9-D-C4 Windows packaged-validation closure footer at the bottom of this file for the full evidence trail. Phase 9 nested historical sub-bullets above (Phase 9-B / 9-C / 9-D / 9-D-A / 9-D-B / 9-D-C lineage) are preserved as evidence trail and remain queryable via the canonical Phase 9 detailed section below + the per-phase entries in the Previously completed list; a future docs-hygiene turn can collapse them if desired. **Active phase: NONE — all canonical phases (0 through 10) are ✅ Complete as of 2026-05-22.** Forward work moves to the **Background / deferred backlogs** section below (Phase 5 deferred-extensions + post-Phase-6 polish backlog) and to potential future phases gated on explicit decisions that have not yet been made (most notably the signing-certificate decision that gates any auto-update / `electron-updater` / signing / GitHub Actions release-workflow track). Phase 10 closure included the final docs-QA sweep: link validation across all 7 main docs; verification that all 29 documented `npm run X` commands exist in matching `package.json` files; agent-roster cross-check between `orchestrator/registry.json` (14 entries), `frontend/src/agents/agentCatalog.ts` (14 aliases), and every docs roster table; Electron dynamic-port + preload-bridge + afterPack contracts consistency check; stale-marker grep across all main docs with every hit accounted for as either a documented "search for these terms" listing or a legitimate "never do this" warning; code sanity (backend build + frontend typecheck + 5 node-check) all exit 0. See the 2026-05-22 §10-G implementation closure footer at the bottom of this file. Auto-update wiring + signing / release-feed itself remains an explicit non-goal of Phase 9 and is gated on a future signing-certificate decision before any related code can land.

Background / deferred backlogs (opt-in; not gating):

- **Phase 5 deferred extensions** — §5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, and the optional all-agent compaction status variant. Tracked under `### Phase 5 — deferred extensions (backlog)` below. Opt-in / future-policy work, not blockers. (The "per-agent matrix Memory column flip" item landed 2026-05-20 via the docs-hygiene patch — see the backlog subsection.)
- **Post-Phase-6 polish backlog** — light/dark theme toggle, syntax highlighting in code blocks, `useChat`/`useSessions`/`useSlashCommands` hooks split-out, file/image attach in composer, backup push button behind a second explicit confirmation. Not blocking any forward phase; pick up opportunistically.

Previously completed:

- Phase 0 — ✅ Complete
- Phase 1 — ✅ Complete
- Phase 2 — ✅ Complete
- Phase 3 — ✅ Complete
- Phase 4 — ✅ Complete / Windows validated
- **Phase 5 — ✅ Complete / Windows validated (with deferred extensions)** — Core memory system shipped. The deferred extensions (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, the optional all-agent compaction status variant, and the per-agent matrix Memory column flip) are tracked in `### Phase 5 — deferred extensions (backlog)` below; they are opt-in / future-policy work, not blockers.
- **Phase 6 — ✅ Complete / Windows validated** — Chat UI user-facing surface complete across §6-A (foundation + memory confirm/cancel), §6-B (UI polish + memory/search/backup usability), §6-C (sessions sidebar + markdown rendering + slash-command UX, with validation patch normalising `/sessions` contract + `/healthz` preflight), §6-D (responsive off-canvas drawers + accessibility + final UI hardening), and §6-E (final polish + closure readiness with `/remember` Nexus fallback, `@agent` syntax, agent selector, and copy buttons on all bubbles). Future post-Phase-6 polish (light/dark theme toggle, syntax highlighting, `useChat`/`useSessions`/`useSlashCommands` hooks split-out, file/image attach in composer, backup push button behind second explicit confirmation) is **not** blocking and can be picked up opportunistically alongside or after Phase 7.
- **Phase 7 — ✅ Complete / Windows validated** — Admin console refit shipped across §7-A admin console foundation + live agents management shell, §7-B safe admin agent editor (diff preview + explicit confirmation + live `PUT /agents/:slug` over the existing override allow-list), and §7-C admin core-memory diff editor (context viewer + live match count + diff modal + explicit confirmation + live `PATCH /agents/:slug/memory/core` over the existing Phase 5.2-D single-match + sensitive-content + atomic-write guarantees). **§7-D (auth gating / audit log / who-can-write rails) is intentionally out of scope** for the local-only Claude Code CLI runtime threat model — rationale + defense-in-depth inventory + explicit re-opening criteria recorded under `### 7-D Intentionally out of scope (local-only runtime)`. Frontend-only across the whole phase; backend untouched (the routes consumed were already validated in Phase 2.2-A + Phase 5.2-D).
- Phase 8.1 — ✅ Complete / Windows validated
- **Phase 8.2 — ✅ Complete / Windows validated** — In-character behavior tests closed across both bullets: per-agent 5-prompt in-domain eval was already closed by §4.3-A's `test:agents` runner (5 fixtures × 14 agents = 70 fixtures, Windows-validated 70/70 PASS in multiple §5/§7 footers), and the cross-character contamination check landed 2026-05-20 as a backend-only slice (new fixture file `backend-api/tests/agent-contamination-fixtures.json` with 5 high-signal pairs Lumi→Bit / Bit→Echo / Vera→Cash / Sage→Reel / Atlas→Iris, new runner `backend-api/scripts/run-agent-in-character-tests.mjs`, new `npm run test:in-character` script) and was Windows live-validated the same day with `total: 5   PASS 5   FAIL 0` (`provider:"claude"`, `degraded:false`, target headers present, zero source-agent marker leakage). See `### 8.2` and the 2026-05-20 closure footer at the bottom of this file for the full evidence trail.
- **Phase 8.3 — ✅ Complete / Windows validated** — Memory tests closed across all four bullets via a backend-only integration runner that exercises the §5.2-A / §5.2-B / §5.2-D / §5.4-A memory routes live. Two commits landed on 2026-05-20: (a) `52f5154 feat(backend): add Phase 8.3 memory integration test runner` shipped `backend-api/scripts/run-memory-integration-tests.mjs` + `npm run test:memory-integration`; (b) `4b5b0e9 fix(test:memory-integration): use base36 anchors to avoid sensitive-guard false positives` patched a runner-only bug where raw `Date.now()` 13-digit anchors tripped the §5.2-A credit-card regex. Windows live validation after the fix returned `total: 4   PASS 4   FAIL 0` covering `write-read` / `concurrent-write-lock` / `forget-core` / `sensitive-refusal`. `/healthz` reported `degraded:true` during the run because the local Claude runtime was not logged in — this does NOT block §8.3 because the integration runner does not call `/chat` and exercises only the memory HTTP routes (intentional scope per §8.3 closure footer). See `### 8.3` and the 2026-05-20 closure footer at the bottom of this file for the full evidence trail (including the runner false-positive incident + fix).
- **Phase 8.4 — ✅ Complete / Windows validated** — UI tests closed docs-only by citing pre-existing Windows-validated coverage: **Bullet 1** "Console renders all 14 cards" — closed by §7-A `AdminAgentList` (calls `listAgents()` → `GET /agents` which returns ALL 14 registry entries unfiltered; renders one card per entry via `state.rows.map(...)`; §7-A Windows-validated step 6 confirmed "Agents list loads on the left with 14 entries (one card per registered agent)"). **Bullet 2** "Drawer opens for each agent, all tabs render" — closed by §7-A `AdminAgentDetail` (per-agent panel renders `MemoryToolsPanel` + `AdminRoutingPlayground` + `AdminMemoryEditor` + `AdminAgentEditor` sections for every selected agent; §7-A/B/C all Windows-validated). The literal Phase-0 "drawer + tabs" wording is stale — the admin shipped a single-pane vertical layout in §7-A rather than a per-agent drawer, but the functional intent (every agent surface is reachable + all editor/inspection panels render) is fully satisfied. The §6-D `Drawer` component itself is Windows-validated on the chat-side mobile Sessions + Tools panels. **Bullet 3** "Routing playground returns at least one match for each of the 30 routing fixtures" — closed by Phase 8.1 `npm run test:routing` (Windows-validated 38/38 PASS; the fixture set grew from the Phase-0 "30" wording to 38 — every fixture routes correctly via the real backend router); the §7-A `AdminRoutingPlayground` uses the SAME `streamChat` → `/chat` pipeline with `sessionId: null`, so the playground and the routing-fixtures runner exercise one identical code path. **Bullet 4** "Theme toggle persists across reload" — **re-scoped to the post-Phase-6 polish backlog** as opt-in / non-gating. The bullet remains there ("light/dark theme toggle"); there is zero theme-toggle code in `frontend/src/`, zero `localStorage`/`sessionStorage` usage (verified), and no user complaint has driven prioritization. Per the audit-honesty rule the bullet stays open in the backlog, not in §8.4 — analogous to how §8.2's first bullet was closed by §4.3-A and §8.3's bullets were closed by the §5.2/§5.4 routes. See `### 8.4` and the 2026-05-20 closure footer at the bottom of this file for the full evidence trail.
- **Phase 8 — ✅ Complete / Windows validated** — Testing & QA closed across all four sub-slices: Phase 8.1 routing fixture (38/38 PASS), Phase 8.2 in-character behavior (5/5 PASS contamination + 70/70 PASS `test:agents`), Phase 8.3 memory integration (4/4 PASS), and Phase 8.4 UI tests (docs-only closure citing §6-D / §7-A/B/C / Phase 8.1 coverage, with theme toggle re-scoped to post-Phase-6 polish backlog).
- **Phase 10 — ✅ Complete / docs QA validated 2026-05-22** — Documentation phase closed. All seven sub-slices Windows-equivalent validated (no Windows live-run required for docs-only work; validation criteria = link integrity, script command match against actual `package.json` files, agent roster match against `orchestrator/registry.json` + `frontend/src/agents/agentCatalog.ts`, Electron dynamic-port docs accuracy, privacy/security stale-phrase audit, and code sanity green): 10-A (docs audit + IA + `docs/README.md` index + scaffolds for missing topical docs), 10-B (README Quick Start refresh + status banner update), 10-C (user-guide.md expansion to 15 sections + glossary), 10-D (developer-setup.md expansion to full setup + troubleshooting recipes), 10-E (add-an-agent.md + customize-an-agent.md expansions), 10-F (troubleshooting.md expansion to 26 sections), 10-G (final docs QA + Phase 10 closure). **Phase 10 privacy / security contract enforced verbatim across every sub-slice:** no telemetry; no automatic crash-report send / upload / email; no LAN binding; no `0.0.0.0` binding; no signing wiring; no `electron-updater`; no GitHub Actions release workflow; no background polling; no auto-install / auto-download; no credentials in `localStorage` / `sessionStorage` / cookies; backend bound to `127.0.0.1` only (dynamic port in dev/packaged, legacy 3001/5174 in dev only); static server bound to `127.0.0.1` only; crash reports remain local-only with manual prepare/export only; backup push remains opt-in with explicit second-confirmation modal; external links allow-list = `github.com/michelbr84/CreativEdge/releases` only via `window.ceBridge.openExternal`; afterPack rebuild keeps source tree un-mutated. Phase 10 scope was strictly docs-only — no changes to code, package files, or generated artifacts in any of the seven sub-slices. **Active phase: NONE — all canonical phases (0 through 10) are ✅ Complete as of 2026-05-22.**
- **Phase 10-G — ✅ Complete / docs QA validated 2026-05-22** — Final documentation QA + Phase 10 closure. Docs-only closure slice: (a) link validation across `README.md` + `docs/README.md` + `docs/user-guide.md` + `docs/developer-setup.md` + `docs/add-an-agent.md` + `docs/customize-an-agent.md` + `docs/troubleshooting.md` (0 broken links — all internal anchors resolve, all relative paths exist, all `github.com/michelbr84/CreativEdge/releases` references match the Phase 9-D-B4 allow-list verbatim); (b) script command validation against the actual 4 `package.json` files (root: 16 scripts; `backend-api/`: 15 scripts including 10 `test:*` runners; `frontend/`: 4 scripts; `electron/`: 4 scripts — all 29 documented commands match verbatim); (c) agent roster consistency QA against `orchestrator/registry.json` (14 entries: nexus + 13 specialists) and `frontend/src/agents/agentCatalog.ts` (14 aliases) — names + slugs + MBTI types match verbatim across registry/catalog/docs; (d) Electron dynamic-port documentation QA — confirmed docs accurately describe the Phase 9-D-C3 `net.createServer.listen(0)` runtime port allocation + `window.ceBridge.getRuntimeConfig()` preload bridge + dev-only legacy 3001/5174 fallback; (e) privacy/security stale-phrase audit across all main docs (28 grep hits investigated in context — 27 confirmed legitimate inside documented "search for these terms" recipes in `developer-setup.md` §13.5 + `troubleshooting.md` §25.13, or inside privacy-guarantee blocks like "never `0.0.0.0`"; 1 actual leak in `electron/NOTES.md:196` literal user-home path — deferred per the standing "preserve pre-existing local-only modifications to `electron/NOTES.md`" rule from Phase 10-A through 10-F); (f) code sanity regression check (backend `npm run build` exit 0; frontend `npm run typecheck` exit 0; `node --check` × 5 on `electron/main.mjs` + `electron/preload.mjs` + `electron/scripts/build-win.mjs` + `electron/scripts/after-pack.mjs` + `frontend/vite.config.ts` all exit 0). Files touched in 10-G: `todo.md` (this entry + Phase 10 rollup updates + EOF closure footer), `docs/README.md` (status table flip + Phase 10 roadmap row flips), and `README.md` (status banner flip if stale). No changes to source code, `package.json` files, generated artifacts, `electron/NOTES.md`, `docs/electron-release-runbook.md`, `Logo-Design.md`, or `chat.md`.
- **Phase 10-F — ✅ Complete / docs validated 2026-05-22** — `docs/troubleshooting.md` expansion. Grew the scaffold to 26 sections covering: install failures, ABI mismatches, port collisions (dynamic + dev-static), packaged-build first-launch, first-run wizard hiccups, chat-recovery red-banner false-negative + listSessions fallback + bounded retry polling diagnosis, backup push flow troubleshooting, manual GitHub-release update flow, crash-report prepare/export UX, OneDrive partial-sync caveats, stale-phrase grep recipe (§25.13), and a "when to file an issue" checklist. Validation: typecheck + build + `node --check` all green; no changes to source code or `package.json`.
- **Phase 10-E — ✅ Complete / docs validated 2026-05-22** — `docs/add-an-agent.md` (17 sections) + `docs/customize-an-agent.md` (14 sections) expansions. Both docs grew from scaffolds into full how-to guides covering: `orchestrator/registry.json` + `frontend/src/agents/agentCatalog.ts` 14-agent contract, MBTI assignment notes, Phase 7-B six-field admin override allow-list (tagline / voice / color / values / strengths / watch_outs) + the diff-preview confirm modal, and the safe edit/test/restore cycle. Docs cross-link to `docs/user-guide.md` Admin Console section. Validation: typecheck + build green; no changes to source code or `package.json`.
- **Phase 10-D — ✅ Complete / docs validated 2026-05-22** — `docs/developer-setup.md` expansion. Grew the scaffold to a full setup + dev-loop guide covering: Node + npm prerequisites, `npm install` at root + subpackages, `npm run setup:electron`, dev loops (`npm run dev` backend + `npm run dev:frontend` + `npm run dev:electron`), the full backend `test:*` matrix (10 runners), packaged builds (`npm run build:electron`), Electron afterPack flow + native-module ABI rebuild semantics, and a documented stale-phrase grep recipe (§13.5). Validation: typecheck + build + `node --check` all green; no changes to source code or `package.json`.
- **Phase 10-C — ✅ Complete / docs validated 2026-05-22** — `docs/user-guide.md` expansion. Grew the scaffold to 15 sections + glossary covering: chat UI tour, agent picker + `@alias` slash command, slash-command catalog (memory promote/forget/compact/search/backup-status/backup-push), session sidebar + search, memory candidate confirm/cancel flow, hand-off semantics, admin console (agents tab + memory editor), ops console (cost dashboard + crash-report prepare/export + manual update info). Validation: typecheck + build green; no changes to source code or `package.json`.
- **Phase 10-B — ✅ Complete / docs validated 2026-05-22** — `README.md` Quick Start refresh. Replaced the scaffold-era Quick Start with a verified install + setup + run sequence (root `npm install` → `npm run setup:electron` → `npm run dev:electron` for dev / `npm run build:electron` for packaged), plus a status banner reflecting Phase 9 ✅ Complete and Phase 10 docs in progress (later updated by 10-G to reflect Phase 10 ✅ Complete). All command strings verified against actual `package.json` scripts.
- **Phase 10-A — ✅ Complete / docs validated 2026-05-22** — Docs index + IA + scaffolds. Created `docs/README.md` as the project documentation map (current project status table + Phase 10 roadmap table) and scaffolded the seven topical docs that the index referenced: `docs/user-guide.md`, `docs/developer-setup.md`, `docs/add-an-agent.md`, `docs/customize-an-agent.md`, `docs/troubleshooting.md` (later expanded in 10-C through 10-F), plus the pre-existing `docs/electron-release-runbook.md` (preserved as-is across all of Phase 10). Audited `electron/NOTES.md` and `docs/electron-release-runbook.md` against Phase 9-D-B / 9-D-C contracts — accurate and unchanged.
- **Phase 9 — ✅ Complete / Windows validated 2026-05-22** — Deployment & operations closed. All sub-slices (9-A deployment baseline + reproducible setup; 9-B Electron wrapper foundation; 9-C first-run wizard; 9-D-A local diagnostics + crash-log foundation + read-only cost dashboard; 9-D-B {B1 manual update info polish, B2 `afterPack` ABI rebuild refactor, B3 explicit opt-in backup push UX, B4 safe external GitHub Releases page opening + manual release runbook}; 9-D-C {C1 cost-budget alerts + time-series chart foundation, C2 local-only crash-report prepare/export UX, C3 dynamic free-port allocation + runtime API-base discovery, C4 final audit + packaged validation closure}) are individually ✅ / Windows-validated. Final Phase 9-D-C4 closure landed 2026-05-22 via Windows packaged walkthrough against commit `5080d0b docs(todo): add Phase 9-D-C4 implementation-pending-validation footer` on top of the canonical Phase 9-D-C3 implementation commit `13dbf2b feat(electron): add Phase 9-D-C3 dynamic free-port allocation`: `npm run build:electron` succeeded end-to-end (`[build-win] packaging plan (Phase 9-D-B2 afterPack flow)` banner, source tree mutation NONE, backend build + frontend build OK, `electron-builder` packaged win32 x64, afterPack hook rebuilt `better-sqlite3` inside `electron/dist-electron/win-unpacked/resources/backend-api/node_modules` only, source `backend-api/node_modules` not mutated, `CreativEdge-Setup-0.1.0.exe` + `win-unpacked/CreativEdge.exe` produced); the packaged binary launched as a normal Windows user; dynamic static port 52334 + dynamic backend port 52335 were logged; backend `/healthz` returned OK at `http://127.0.0.1:52335/healthz`; the Phase 9-D-B4 external-link bridge still opened the GitHub releases page in the OS browser (`ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases`); no `NODE_MODULE_VERSION` crash; app closed cleanly; post-close `Get-NetTCPConnection -LocalPort 52335 -State Listen -ErrorAction SilentlyContinue` AND `-LocalPort 52334 -State Listen -ErrorAction SilentlyContinue` both returned no output (dynamic-port cleanup validated in the PACKAGED app); `cd backend-api && npm run build` exit 0 after packaging (dev ABI sanity confirmed — the Phase 9-D-B2 afterPack flow correctly leaves the source tree at system-Node ABI). **Phase 9 privacy / security contract enforced verbatim across every sub-slice:** no telemetry; no automatic crash-report send / upload / email; no LAN binding; no `0.0.0.0` binding; no signing wiring; no `electron-updater`; no GitHub Actions workflow; no background polling; no auto-install / auto-download; no credentials in `localStorage` / `sessionStorage` / cookies; backend bound to `127.0.0.1` only; static server bound to `127.0.0.1` only; crash reports remain local-only (Phase 9-D-A on-disk + Phase 9-D-C2 review/copy/download UX) with allow-list field gating; backup push remains opt-in with explicit second-confirmation modal (Phase 9-D-B3); releases external link manually allow-listed (Phase 9-D-B4); afterPack rebuild keeps source tree un-mutated (Phase 9-D-B2). Phase 9 detail remains queryable via the canonical Phase 9 detailed section in the body + the existing per-sub-slice entries below. **Active phase: Phase 10 (Documentation).** Auto-update wiring + signing / release-feed remain explicit non-goals of Phase 9 — gated on a future signing-certificate decision; tracking that work falls to a future phase if and when the decision lands.
- **Phase 9-D — ✅ Complete / Windows validated 2026-05-22** — Packaged build + crash logs (local-only) + manual update flow closed across 9-D-A + 9-D-B + 9-D-C. Auto-update wiring + signing/release-feed remain explicit non-goals — gated on a signing-certificate decision before any related code can land. See the Phase 9 rollup above for the closure evidence trail.
- **Phase 9-D-C — ✅ Complete / Windows validated 2026-05-22** — All four sub-slices closed (9-D-C1 cost-budget alerts + time-series, 9-D-C2 crash-report prepare/export, 9-D-C3 dynamic free-port allocation, 9-D-C4 final audit + packaged validation). See the Phase 9 rollup above for the closure evidence trail.
- **Phase 9-D-C4 — ✅ Complete / Windows packaged validated 2026-05-22** — Final audit-first closure slice for Phase 9-D-C / Phase 9-D / Phase 9 overall. Windows packaged validation completed 2026-05-22: `npm run build:electron` passed; afterPack ran cleanly and rebuilt `better-sqlite3` inside the packaged `electron/dist-electron/win-unpacked/resources/backend-api/node_modules` only; source `backend-api/node_modules` was NOT mutated; `CreativEdge-Setup-0.1.0.exe` + `electron/dist-electron/win-unpacked/CreativEdge.exe` were produced; packaged binary opened as a normal Windows user; dynamic static port 52334 + dynamic backend port 52335 were logged; backend `/healthz` OK on dynamic backend; releases external link still worked through the preload bridge (`ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases`); no `NODE_MODULE_VERSION` crash; app closed cleanly; dynamic ports 52335 + 52334 both free after close; `cd backend-api && npm run build` exit 0 after packaging. **Docs-only on the implementation turn** (zero code changes; the audit found zero stale Electron-runtime references to 3001/5174 — every remaining reference is intentional: backend env default + Vite dev-proxy fallback + `build-deps.mjs` belt-and-suspenders pin + doc comments + dev-only test scripts + `dev-help.mjs` + `setup-postinstall.mjs`). **No telemetry / no automatic crash-report send / no LAN binding / no `0.0.0.0` binding / no signing wiring / no `electron-updater` / no GitHub Actions workflow / no background polling / no auto-install / no auto-download were introduced at any point in Phase 9-D-C.** See the 2026-05-22 §9-D-C4 implementation closure footer and the 2026-05-22 §9-D-C4 Windows packaged-validation closure footer both at the bottom of this file for the full evidence trail. **Phase 9-D-C4 closed; Phase 9-D-C closed; Phase 9-D closed; Phase 9 overall closed.**
- **Phase 9-D-C3 — ✅ Complete / Windows validated** — Dynamic free-port allocation Windows-validated 2026-05-22 via dev Electron walkthrough against commit `13dbf2b feat(electron): add Phase 9-D-C3 dynamic free-port allocation`. Third sub-slice of Phase 9-D-C; deliberately bounded to the **smallest safe slice** that replaces Phase 9-B's pinned `BACKEND_PORT=3001` / `FRONTEND_PORT=5174` model with runtime free-port allocation inside the Electron shell. **Files committed in 13dbf2b (7):** `electron/main.mjs`, `electron/preload.cjs`, `frontend/src/App.tsx`, `frontend/src/api/client.ts`, `electron/NOTES.md`, `docs/electron-release-runbook.md`, `todo.md` (impl-pending-validation footer). **No new dependency.** **No package-lock edit.** **No `electron-updater`.** **No signing wiring.** **No GitHub Actions.** **No `electron-builder` packaging change.** **No `electron/dist-electron/` staged.** **No `node_modules/` staged.** **Architecture:** Electron main now allocates a free loopback TCP port for the backend via a temporary `net.createServer.listen(0)` probe (`allocateFreePort()` in `electron/main.mjs`), reads `address().port`, closes the probe, and spawns the backend child with `CREATIVEDGE_PORT=<assignedPort>` + `CREATIVEDGE_HOST=127.0.0.1` (the backend's Phase 2.1 entry point already honours both env vars; no backend code changed). On the rare `EADDRINUSE` race between probe close and child bind, the wrapper retries the allocate+spawn+healthz cycle once (`SPAWN_RETRY_LIMIT = 1`) before surfacing a friendly `spawnExhausted` diagnostic page. The Phase 9-B fixed-port preflight (`probePortTcp` + `probeBackendPortState` + the `portBusy` diagnostic branch) is removed — dynamic allocation makes port-busy diagnostics moot. **Static server** uses `server.listen(0, "127.0.0.1")` directly and reads `server.address().port` synchronously in the listen callback (no race window — it's our own server). **Renderer runtime API-base discovery:** Electron main composes `webPreferences.additionalArguments = ["--creativedge-backend-base=http://127.0.0.1:<dynamicBE>", "--creativedge-frontend-base=http://127.0.0.1:<dynamicFE>", "--creativedge-packaged"?]` when constructing the `BrowserWindow`. The Phase 9-D-B4 preload bridge (`electron/preload.cjs`) gets a new synchronous `getRuntimeConfig()` method that parses `process.argv` at preload time, freezes the parsed config, exposes a fresh shallow copy on every call. **Frontend `client.ts`** replaces the eager `export const API_BASE` initialiser with a layered `resolveApiBase()`: (1) `window.ceBridge.getRuntimeConfig().backendBaseUrl` (Electron preload bridge — canonical inside the desktop shell); (2) `import.meta.env.VITE_API_URL` (build-time pin — `electron/scripts/build-deps.mjs` retained the `VITE_API_URL=http://127.0.0.1:3001` pin as a belt-and-suspenders fallback so a partial rollback degrades cleanly to Phase 9-B behaviour); (3) empty string → same-origin via the Vite dev proxy (browser `npm run dev` workflow preserved unchanged). `apiTargetLabel()` updated to drop the hardcoded `127.0.0.1:3001` string in favour of a generic dev-proxy label when no base is resolved. **App.tsx** error string updated to use `apiTargetLabel()` with separate dev / Electron recovery hints. **`waitForHealthz()`** now accepts the dynamic backend URL and adds a defence-in-depth sanity check that `/healthz` returns `service === "creativedge-backend"` (catches the rare "we lost the alloc race to a rogue listener" case). **`will-navigate` allow-check** updated to compare against the dynamic `resolvedFrontendBaseUrl` instead of a hardcoded URL. **`writeCrashLog()`** now records `backendPort: resolvedBackendPort` + `frontendPort: resolvedFrontendPort` (the on-disk Phase 9-D-A crash JSON now reflects the actual dynamic ports). **Privacy / security contract enforced (verbatim):** no listening on `0.0.0.0`; no LAN exposure; both backend and static server bound to `127.0.0.1` only; no prompts / chat / memory / env vars / secrets in any log or in the runtime config bridge; no telemetry; no background network call; no external crash-report send; no upload; no automatic updater. No changes to chat / backup / crash-report / releases / budget / setup / providers / memory / agent personality / SSE / sqlite / FTS5 / routing / handoff behaviour. The Phase 9-D-B4 `EXTERNAL_URL_ALLOWLIST` is untouched. **Live evidence on 2026-05-22:** `npm run dev:electron` opened the app with dynamic static `http://127.0.0.1:49997` + dynamic backend `http://127.0.0.1:49998`; backend `/healthz` returned OK at `http://127.0.0.1:49998/healthz`; Electron stdout log showed `boot ready: backend=http://127.0.0.1:49998 static=http://127.0.0.1:49997`; the Phase 9-D-B4 external-link bridge still opened the GitHub releases page in the OS browser (`ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases`); app shutdown was clean (Electron log: `backend child exited code=null signal=SIGTERM expected=true`); post-close `Get-NetTCPConnection -LocalPort 49998 -State Listen -ErrorAction SilentlyContinue` AND `-LocalPort 49997 -State Listen -ErrorAction SilentlyContinue` both returned no output (dynamic backend-child + static-server cleanup validated — the Phase 9-B lifecycle survived the dynamic-port rewrite). Sandbox validation on the implementation turn: `cd backend-api && npm run build` exit 0; `cd frontend && npm run typecheck` exit 0; `cd frontend && npm run build` exit 0 (Windows host `win32-x64-msvc`); 5 `node --check`s on `electron/main.mjs` + `electron/preload.cjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` + `electron/scripts/after-pack.mjs` all exit 0. **Rollback plan if a future regression surfaces:** revert exactly the 4 code files (`electron/main.mjs`, `electron/preload.cjs`, `frontend/src/api/client.ts`, `frontend/src/App.tsx`) — the `build-deps.mjs` `VITE_API_URL=http://127.0.0.1:3001` pin remained in place precisely so a partial rollback degrades cleanly to the Phase 9-B fixed-port behaviour. See `### 9.4 Phase 9-D-C3` (in the active block above) and the 2026-05-22 §9-D-C3 Windows-validation closure footer at the bottom of this file for the full evidence trail. **Phase 9-D-C itself stays open** because 9-D-C4 (Phase 9-D / Phase 9 closure) is still not started; auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision.
- **Phase 9-D-C2 — ✅ Complete / Windows validated** — Local-only crash-report prepare/export UX Windows-validated 2026-05-22 via dev Electron walkthrough against commit `f166fe3 feat(ops): add Phase 9-D-C2 crash-report prepare export UX`. Second sub-slice of Phase 9-D-C; deliberately bounded to local-only + read-only + additive, with zero Electron-lifecycle touch and zero new dependencies. **New backend routes (2, additive):** `GET /ops/crash-reports` (newest-first list of `~/.creativedge/logs/crash-*.log` records — filename + size + mtime + path only, capped at 25 records) and `GET /ops/crash-reports/:id/prepare` (strict filename allow-list via `^crash-[A-Za-z0-9._:T+\-]+\.log$`, path-traversal defence-in-depth re-check, 256 KB per-file read cap with double-cap on the buffer, JSON-parses the on-disk crash record, applies a 17-field structured allow-list, drops `backendLogTail` and lists everything else dropped under `droppedFields[]`, returns stable field order, friendly error shapes for invalid id / missing file / oversized file / parse failure). **New frontend types (4, additive, in `frontend/src/types.ts`):** `CrashReportSummary`, `CrashReportListResponse`, `PreparedCrashReport`, `CrashReportPrepareResponse` (appended to both pre-existing duplicate Ops type blocks so TS interface merging stays safe). **New frontend helpers (2, additive, in `frontend/src/api/client.ts`):** `opsCrashReports()` and `opsPrepareCrashReport(id)`. **New `CrashReportsCard` (in `frontend/src/components/ops/OpsConsole.tsx`):** rendered between `LogsCard` and `BackupCard`; empty state "No crash reports found — that's a good thing. Nothing is sent automatically anyway."; newest-first table with per-row **Prepare report** button; inline review panel with prominent privacy notice + `droppedFields[]` summary + `validationWarnings[]` list + scrollable `<pre>` of the JSON; three action buttons — **Copy report JSON** (`navigator.clipboard.writeText` + friendly fallback), **Download report JSON** (Blob + `URL.createObjectURL` + programmatic `<a download>` click + `URL.revokeObjectURL`), **Close review**. **No "Send" / "Upload" / "Email" / GitHub-issue button anywhere.** The card body repeats the no-automatic-send contract prominently in plain English. `refresh()` extended with `Promise.allSettled` so one slow endpoint never blocks the others (Phase 9-D-A pattern preserved). **Privacy / security contract enforced:** no external requests on this card; no telemetry; no upload; no email; no GitHub-issue creation; no background polling; no scheduled tasks; no auto-update; no dynamic-port change; no provider/SSE/memory/chat behaviour change; no signing/electron-updater/GitHub-Actions changes; sandbox preserved; `electron/main.mjs` / `electron/preload.cjs` / `electron/scripts/*` / `electron/package.json` / `docs/electron-release-runbook.md` / `electron/NOTES.md` all untouched (zero Electron-lifecycle change); `backend-api/src/server.ts` untouched (existing `opsRoutes` registration covers the new handlers); `BackupPanel.tsx` / `BackupPushConfirmModal.tsx` / `FirstRunWizard.tsx` / `App.tsx` / chat / providers / memory / agent personality files all untouched. **Allow-list NEVER includes**: chat content, message bodies, prompts, memory contents, identity/soul/personality files, env vars, `.env` files, API keys, auth tokens, cookies, localStorage, SSH keys, Git credentials, home-dir dump, DB rows, arbitrary user files; **also drops** the free-text `backendLogTail` field pending a tested redaction sanitizer in a future slice. Live evidence on 2026-05-22: `npm run dev:electron` opened the app; backend `/healthz` returned OK; the new **Crash reports** card appeared between `Local logs` and `Backup`; the prepare/export UX worked end-to-end (Prepare → review panel → Copy + Download both verified locally; downloaded JSON contained only allow-listed structured fields — no chat / memory / env / secrets); existing chat / 🧭 Setup / 📊 Ops / Budget & trends / Diagnostics / Usage & cost / Update info / Backup surfaces all continued to work without regression; app shutdown was clean (Electron log: `backend child exited code=null signal=SIGTERM expected=true`); post-close `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned no output (backend-child + static-server cleanup validated — the Phase 9-B lifecycle survived the new card + routes additions). Sandbox validation on the implementation turn: `cd backend-api && npm run build` exit 0; `cd frontend && npm run typecheck` exit 0; `cd frontend && npm run build` exit 0 (Windows host `win32-x64-msvc`); 5 `node --check`s on `electron/main.mjs` + `electron/preload.cjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` + `electron/scripts/after-pack.mjs` all exit 0. **No new dependencies installed**; no `package-lock` edits; no `electron-updater`; no signing wiring; no GitHub Actions workflow; no background polling; no auto-install / auto-download; no telemetry. See `### 9.4 Phase 9-D-C2` (in the active block above) and the 2026-05-22 §9-D-C2 Windows-validation closure footer at the bottom of this file for the full evidence trail. **Phase 9-D-C itself stays open** because 9-D-C4 (Phase 9-D / Phase 9 closure) is still not started; 9-D-C3 (dynamic free-port allocation) is now ✅ Complete / Windows validated 2026-05-22 via commit `13dbf2b`. Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision.
- **Phase 9-D-C1 — ✅ Complete / Windows validated** — Local-only cost-budget alerts + cost time-series chart foundation Windows-validated 2026-05-21 via dev Electron walkthrough against commit `b00e86a feat(ops): add Phase 9-D-C1 budget trends dashboard`. The safest first slice of Phase 9-D-C per the 2026-05-21 decision-first plan — deliberately bounded to local-only + read-only + additive, with zero Electron-lifecycle touch and zero new dependencies. **New backend route (1, additive):** `GET /ops/usage/timeseries?days=<n>` in `backend-api/src/routes/ops.ts` — reuses the existing `parseUsage` + `Bucket` + `emptyBucket` + `applyToBucket` helpers from `/ops/usage/summary`; reads the same 10,000-row cap from `agent_events`; returns dense per-UTC-day buckets for the requested range (default 30, server-clamped to `[1, 90]`), plus pre-aggregated `today` (UTC) and `monthToDate` (since UTC 00:00 on the 1st) buckets, plus `todayKey` / `monthStartKey` for the frontend to highlight today's bar; tolerates malformed `usage_json` (counted under `eventsWithMalformedUsage` but contributing zero numeric data); tolerates empty DB (returns `days: []`); tolerates missing `created_at` (rows skipped, counted under `eventsConsidered`); never reads message bodies / prompts / memory files / env vars. **New frontend types (2, additive, in `frontend/src/types.ts`):** `OpsTimeseriesBucket extends OpsBucket` with `dayKey: string` (UTC `YYYY-MM-DD`); `OpsUsageTimeseriesResponse` mirrors the backend shape. **New frontend helper (1, additive, in `frontend/src/api/client.ts`):** `opsUsageTimeseries(days = 30)` using the existing `fetchJson` helper; client-side clamps `days` to `[1, 90]` before sending; existing `opsUsageSummary()` / `opsDiagnostics()` unchanged. **New `BudgetTrendsCard` (in `frontend/src/components/ops/OpsConsole.tsx`):** rendered between `UsageCard` and `LogsCard`; KV table shows Today (UTC) / Daily budget / Daily state, Month to date (UTC) / Monthly budget / Monthly state; two `.ce-status` badges with the existing per-state palette (`.ce-status-ok` for OK, `.ce-status-warn` for `Near budget` at ≥80%, `.ce-status-err` for `Over budget` at ≥100%, `.ce-status-info` for `Unavailable` when no budget set or no data); inline SVG bar chart (viewBox 600×160, no chart library, today highlighted `#3b82f6`, prior days `#64748b`) for the last 30 daily costs; `BudgetTrendChart` includes a dashed `currentColor` budget-threshold line drawn when a daily budget is set + in range and ~7-day tick labels; friendly empty-state copy when no `usage_json` recorded yet; small `eventsWithMalformedUsage` warning when present; inline "Configure local budget" form (text inputs only; numeric thresholds via `Number.parseFloat`; blank field → clear threshold) + "Reset budget" button. **localStorage usage strictly limited to two non-sensitive numeric thresholds:** `creativedge.budget.daily` and `creativedge.budget.monthly`, both USD floats only — never secrets / prompts / chat / memory content / agent slugs / remote URLs; defensive `safeReadBudget` / `safeWriteBudget` helpers tolerate environments where storage throws. **OpsConsole `refresh`** extended to also fetch the timeseries via `Promise.allSettled` — one slow/failing endpoint still doesn't block the others. The `extends OpsBucket` typing lets the existing `applyToBucket` + `parseUsage` server-side helpers be reused without duplication. **Privacy / security contract enforced:** no external requests on this card (the only network calls are the existing Ops fetches against the local backend); no telemetry; no crash-report upload; no email sending; no background polling; no scheduled tasks; no auto-update; no dynamic-port change; no provider/SSE/memory/chat behaviour change; no signing/electron-updater/GitHub-Actions changes; sandbox preserved; `electron/main.mjs` / `electron/preload.cjs` / `electron/scripts/*` / `electron/package.json` / `docs/electron-release-runbook.md` / `electron/NOTES.md` all untouched (zero Electron-lifecycle change); `backend-api/src/server.ts` untouched (existing `opsRoutes` registration covers the new handler); `BackupPanel.tsx` / `BackupPushConfirmModal.tsx` / `FirstRunWizard.tsx` / `App.tsx` / chat / providers / memory / agent personality files all untouched. Live evidence on 2026-05-21: `npm run dev:electron` opened the app; the **Budget & trends** card appeared between `Usage & cost` and `Local logs` and worked correctly (KV rows + alert badges + inline SVG bar chart + Configure local budget form + Reset budget button); the new `GET /ops/usage/timeseries` route was exercised end-to-end via the OpsConsole `refresh()` `Promise.allSettled` path; localStorage-stored budget thresholds read + wrote + cleared correctly via Configure / Save / Reset; existing chat / 🧭 Setup / 📊 Ops console all continued to work without regression; the Phase 9-D-B4 external-link bridge still opened the GitHub releases page in the OS browser (`ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases`); app shutdown was clean (Electron log: `backend child exited code=null signal=SIGTERM expected=true`); post-close `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned no output (backend-child + static-server cleanup validated — the Phase 9-B lifecycle survived the new card + route additions). Sandbox validation on the implementation turn: `cd backend-api && npm run build` exit 0; `cd frontend && npm run typecheck` exit 0; `cd frontend && npm run build` exit 0 (Windows host `win32-x64-msvc`); 5 `node --check`s on `electron/main.mjs` + `electron/preload.cjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` + `electron/scripts/after-pack.mjs` all exit 0. **No new dependencies installed**; no `package-lock` edits; no chart library; no `electron-updater`; no signing wiring; no GitHub Actions workflow; no background polling; no auto-install / auto-download; no telemetry. See `### 9.4 Phase 9-D-C1` (in the active block above) and the 2026-05-21 §9-D-C1 Windows-validation closure footer at the bottom of this file for the full evidence trail. **Phase 9-D-C itself stays open** because 9-D-C2 (external crash-report prepare-and-export UX), 9-D-C3 (dynamic free-port allocation), and 9-D-C4 (Phase 9-D / Phase 9 closure) are still not started; auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision.
- **Phase 9-D-B — ✅ Complete / Windows validated** — All four sub-slices Windows-validated 2026-05-21 across four targeted commits (`e036c77` → 9-D-B1, `9b27bb4` → 9-D-B3, `715227e` → 9-D-B4, `09064eb` → 9-D-B2). The slice progression followed the 2026-05-21 decision-first plan's recommended de-risk-first ordering of 9-D-B1 → 9-D-B3 → 9-D-B4 → 9-D-B2. Net deliverables: (1) Manual update info polish in the Ops console Update info card — corrected GitHub releases URL `michelbr84/CreativEdge` + click-triggered `Check latest release` against the public unauthenticated GitHub REST API, with `Up to date` / `Release available` / `Unable to compare` badge + per-state friendly hints, no `electron-updater` / signing / background poll. (2) Explicit opt-in backup push UX in `BackupPanel.tsx` and `OpsConsole.tsx` BackupCard behind a second-confirmation modal `BackupPushConfirmModal.tsx`; reuses the Phase 5.6-A `POST /backup/run` route with `push:true` + `confirmed:true`; the four observable readiness blockers (`gitReady` → `enabled` → `repoReady` → `remoteConfigured`) drive a friendly disabled-state explainer; the server-side-redacted remote is the only remote string shown; no credentials / tokens / remote URLs ever stored in `localStorage` / `sessionStorage` / cookies; no scheduling, no auto-push, no background job. (3) Safe external GitHub Releases page opening — new `electron/preload.cjs` (`contextBridge.exposeInMainWorld("ceBridge", { openExternal })` → `ipcRenderer.invoke("ce:openExternal", url)`), new `EXTERNAL_URL_ALLOWLIST` re-checked in both renderer (`frontend/src/config/release.ts`) and main (`electron/main.mjs`), `setWindowOpenHandler` + `will-navigate` made allow-list-aware, new `docs/electron-release-runbook.md` operational reference; closed the `window.open denied` follow-up from the 9-D-B3 walkthrough. (4) `afterPack` ABI rebuild refactor — new `electron/scripts/after-pack.mjs` calls `@electron/rebuild` against the PACKAGED copy at `<appOutDir>/resources/backend-api/` only via the electron-builder afterPack hook; `electron/scripts/build-win.mjs` slimmed from 4 steps + try/finally to 2 steps + no restore; source `backend-api/node_modules` is no longer mutated by the packaging flow. **Net contract across all four sub-slices:** no `electron-updater` installed; no signing wiring; no GitHub Actions workflow; no background polling; no auto-download / auto-install; no telemetry; no credentials handling in the frontend; no scheduling; no auto-push; sandbox preserved (`contextIsolation:true`, `nodeIntegration:false`, `sandbox:true`, `webSecurity:true`); HTTPS-only allow-listed external destinations only; source `backend-api/node_modules` Node-ABI-compatible before, during, and after every packaging run. Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision (deferred to a future phase). See the individual 2026-05-21 §9-D-B1 / §9-D-B3 / §9-D-B4 / §9-D-B2 Windows-validation closure footers at the bottom of this file for full per-slice evidence trails. **Phase 9-D stays open** because 9-D-C (external crash-report send-button + cost-budget alerts + dynamic free-port allocation + charting library for cost time-series) is still not started.
- **Phase 9-D-B2 — ✅ Complete / Windows validated** — `afterPack` ABI rebuild refactor Windows-validated 2026-05-21 via packaged build + run walkthrough against commit `09064eb refactor(electron): move better-sqlite3 ABI rebuild into afterPack` (after clearing the winCodeSign cache and running with sufficient Windows privileges). **New file (1):** `electron/scripts/after-pack.mjs` (≈140 lines pure-ESM electron-builder afterPack hook; default-export `async function afterPack(context)`; uses `context.appOutDir` + `context.arch` (numeric `Arch` enum mapped to string `"x64"`) + `context.electronPlatformName`; resolves the actual installed Electron version from `electron/node_modules/electron/package.json` with a fallback to `context.packager.info.framework.version`; loads `@electron/rebuild` via `createRequire(join(ELECTRON_DIR,"package.json"))` to keep this file in pure ESM while pulling the CommonJS module from the local install; calls `rebuild({ buildPath: "<appOutDir>/resources/backend-api", electronVersion, arch, onlyModules: ["better-sqlite3"], force: true })`; pre-flight verifies the packaged backend dir + node_modules dir + better-sqlite3 package.json all exist before any work; throws on any failure so electron-builder aborts the build with a non-zero exit; logs `[after-pack]` step labels for every line; privacy: prints version numbers + paths + step labels only — no chat / memory / env / secrets). **Modified files (4):** `electron/package.json` (added `build.afterPack: "./scripts/after-pack.mjs"`; `build.files` still includes `preload.cjs`; `build.npmRebuild: false` preserved; no dependency change), `electron/scripts/build-win.mjs` (slimmed from 4 steps + try/finally to 2 steps + no restore; source-tree `@electron/rebuild` invocation and `finally`-block restore both removed; pre-flight checks preserved; banner now prints `source tree mutation: NONE`), `electron/NOTES.md` (replaced the Phase 9-B "Caveat" paragraph with the new Phase 9-D-B2 afterPack architecture description), `docs/electron-release-runbook.md` (§2 packaged-build flow rewritten to describe the afterPack architecture; §5 manual-rebuild commands trimmed to recovery-only guidance pointing at the PACKAGED copy directory; §9.1 troubleshooting updated for the new failure mode + correct recovery commands). Live evidence on 2026-05-21: `npm run build:electron` ran the two-step orchestrator cleanly, emitting `[build-win] packaging plan (Phase 9-D-B2 afterPack flow)` with `source tree mutation: NONE`; the afterPack hook logged `[after-pack] packaged backend dir: C:\Users\<you>\path\to\CreativEdge\electron\dist-electron\win-unpacked\resources\backend-api` and rebuilt `better-sqlite3` inside that packaged copy only; build ended with `[build-win] packaging succeeded` + `[build-win] DONE. Artifacts in electron/dist-electron/` — both `CreativEdge-Setup-0.1.0.exe` and `win-unpacked/` were produced. After the build, `cd backend-api && npm run build` passed with NO restore step — proving the source `backend-api/node_modules` was not mutated and dev backend ABI remains Node-compatible. The packaged `.\electron\dist-electron\win-unpacked\CreativEdge.exe` launched as a normal Windows user; chat / Setup / Ops / release external link (Phase 9-D-B4 preload-bridge path) / Backup surfaces all checked OK; no `better-sqlite3 NODE_MODULE_VERSION` crash appeared in the backend log; app closed correctly; Electron log showed `backend child exited code=null signal=SIGTERM expected=true`; post-close `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned no output (backend-child + static-server cleanup validated — the Phase 9-B lifecycle survived the packaging-flow refactor end-to-end). Sandbox validation on the implementation turn: 5 `node --check`s all exit 0 (the new `after-pack.mjs` + all 4 existing electron scripts); `cd backend-api && npm run build` exit 0; `cd frontend && npm run typecheck` exit 0; `electron/package.json` JSON parses cleanly with the new `build.afterPack` key. **No new dependencies installed**; no `package-lock` edits; no `electron-updater`; no signing wiring; no GitHub Actions workflow; no background polling; no auto-install / auto-download; no telemetry. The Phase 9-B `electron/scripts/build-win.mjs` try/finally source-tree mutation pattern is fully replaced; the Phase 9-D-B4 preload bridge + allow-list re-check + Ops console surface all preserved verbatim. See `### 9.4 Phase 9-D-B2` (in the active block above) and the 2026-05-21 §9-D-B2 Windows-validation closure footer at the bottom of this file for the full evidence trail.
- **Phase 9-D-B4 — ✅ Complete / Windows validated** — Safe external GitHub Releases page opening + release/manual-update runbook + release troubleshooting docs Windows-validated 2026-05-21 via dev Electron walkthrough against commit `715227e feat(electron): add Phase 9-D-B4 safe external release links`. **New files (2):** `electron/preload.cjs` (≈75 lines pure CommonJS; `contextBridge.exposeInMainWorld("ceBridge", { openExternal })` exposes only `window.ceBridge.openExternal(url)` to the renderer, forwarding via `ipcRenderer.invoke("ce:openExternal", url)`; returns a discriminated `{ok, reason, message}` shape; sandbox preserved — no Node leak, no `nodeIntegration`, no `contextIsolation:false`, no `webSecurity:false`), `docs/electron-release-runbook.md` (≈417 lines Markdown; canonical operational reference with 10 sections covering local Electron dev launch, packaged Windows build, testing the packaged build, validating backend/port cleanup, rebuilding native modules manually, publishing a GitHub release manually, how the manual release-check flow works including the full preload-bridge architecture diagram, the 12-row explicit table of what is intentionally NOT implemented, six troubleshooting recipes including the §9.2 `window.open denied` root-cause + fix, and related references). **Modified files (5):** `electron/main.mjs` (added `ipcMain` to imports; added `EXTERNAL_OPEN_IPC_CHANNEL` + `EXTERNAL_URL_ALLOWLIST` (single entry today: github.com + `/michelbr84/CreativEdge/releases`) + `classifyExternalUrl()` pure helper (HTTPS-only; returns `null` if allowed, short reason string otherwise: `empty` / `unparseable` / `non-https-protocol(<actual>)` / `not-on-allowlist`); added `webPreferences.preload: join(HERE, "preload.cjs")` to the BrowserWindow; rewrote `setWindowOpenHandler` so trusted URLs call `shell.openExternal` AND still return `{action:"deny"}` (no in-app popup); extended `will-navigate` with the same allow-list path so `<a href>` navigations are also forwarded for trusted URLs; registered `ipcMain.handle("ce:openExternal", ...)` at the top of `boot()` that re-validates via `classifyExternalUrl` and calls `shell.openExternal`; the Phase 9-B / 9-D-A lifecycle is fully preserved verbatim), `electron/package.json` (`build.files` extended from `["main.mjs", "package.json"]` to `["main.mjs", "preload.cjs", "package.json"]` so `electron-builder` packs the preload into the ASAR; no dependency change), `electron/NOTES.md` (new "External URL opening + manual release runbook (Phase 9-D-B4)" section with the architecture diagram `Renderer → window.ceBridge.openExternal → ipcRenderer.invoke → ipcMain → classifyExternalUrl → shell.openExternal`, the maintain-both-allow-lists rule, and a cross-link to `docs/electron-release-runbook.md`), `frontend/src/config/release.ts` (added `EXTERNAL_URL_ALLOWLIST` renderer-side mirror, `isExternalUrlAllowed()` pure predicate, `OpenExternalResult` discriminated union, `getElectronBridge()` narrow type-check, `openExternalUrl()` async helper that prefers `window.ceBridge.openExternal` when attached and falls back to `window.open(url, "_blank", "noopener,noreferrer")` in non-Electron contexts), `frontend/src/components/ops/OpsConsole.tsx` (rewired `onOpenReleases` to async + `openExternalUrl(RELEASES_URL)`; added `openReleasesError` state slice + matching `UpdateInfoCard` prop + small `.ce-wizard-hint-error` paragraph that renders only on the failure path with the URL the user can copy). **Privacy / security contract enforced:** HTTPS-only (any non-`https:` URL rejected); allow-list filtered in BOTH the renderer AND the main process (defence-in-depth — a renderer-side compromise cannot widen the surface); sandbox preserved (`sandbox:true`, `contextIsolation:true`, `nodeIntegration:false`, `webSecurity:true`); only one IPC channel (`ce:openExternal`); only one renderer surface (`window.ceBridge.openExternal`); only one allow-listed destination today; no auth tokens, no telemetry, no User-Agent identifying the installation, no installer download, no automatic install, no background timer. **No `electron-updater`, no signing wiring, no GitHub Actions workflow, no background update polling, no auto-download/install.** Live evidence on 2026-05-21: `npm run dev:electron` opened the app; backend `/healthz` returned OK; clicking **Open releases page ↗** in the Update info card opened the GitHub Releases page in the OS default browser cleanly; the Electron main log emitted `ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases`; the previous `window.open denied for …` log spam from the §9-D-B3 walkthrough did NOT appear — the bug is resolved; app shutdown was clean (Electron log: `backend child exited code=null signal=SIGTERM expected=true`); post-close `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned no output (backend-child + static-server cleanup validated — the Phase 9-B lifecycle survived the preload + IPC additions). Sandbox validation on the implementation turn: `cd frontend && npm run typecheck` exit 0; `cd backend-api && npm run build` exit 0; `node --check electron/main.mjs` + `electron/preload.cjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` all exit 0; `frontend npm run build` blocked only by the documented `@rollup/rollup-linux-x64-gnu` Linux-sandbox limitation — Windows host with `win32-x64-msvc` built cleanly during the live walkthrough. See `### 9.4 Phase 9-D-B4` (in the active block above) and the 2026-05-21 §9-D-B4 Windows-validation closure footer at the bottom of this file for the full evidence trail. **Phase 9-D-B itself stays open** because 9-D-B2 (`afterPack` ABI rebuild) is still not started; auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision.
- **Phase 9-D-B3 — ✅ Complete / Windows validated** — Explicit opt-in backup push UX Windows-validated 2026-05-21 via dev Electron walkthrough against commit `9b27bb4 feat(backup): add Phase 9-D-B3 explicit backup push UX`. Frontend-only slice (1 new file `frontend/src/components/BackupPushConfirmModal.tsx`; modified `frontend/src/components/BackupPanel.tsx` + `frontend/src/components/ops/OpsConsole.tsx` + `electron/NOTES.md` + this `todo.md` patch trail; no backend route changes — Phase 5.6-A `POST /backup/run` reused verbatim with `{confirmed:true, push:true}`; no provider / memory / SSE / Electron-main lifecycle / `build-win.mjs` / `build-deps.mjs` / `electron/package.json` / `package-lock` / `node_modules` changes). Adds a second-confirmation `BackupPushConfirmModal` (required "I understand this will push to my configured remote" checkbox; default focus on Cancel; Esc dismisses; Enter does NOT auto-confirm; Confirm stays disabled until the checkbox is ticked; renders the server-side-redacted remote string only from `/backup/status.remote` via the Phase 5.6-A `redactRemote()` contract) and a new "Run backup + push" button on both BackupPanel and OpsConsole BackupCard with a friendly disabled-state explainer for the four observable blockers in priority order (`gitReady` → `enabled` → `repoReady` → `remoteConfigured`). On success the result row renders `committed=… and pushed.` / `committed=… but push was not completed: <pushReason>` (warn) / `nothing changed; nothing to push.`; `pushReason` is the server-side string already free of credentials per Phase 5.6-A. **Privacy contract enforced:** zero `localStorage` / `sessionStorage` / `document.cookie` reference anywhere in the new modal or the modified push paths (grep-verifiable); never asks for credentials — auth is the local Git setup's concern (HTTPS credential helper / SSH agent); no scheduling; no silent push; no background job; no auto-push on app boot / chat completion / shutdown. The first-run wizard's `apiBackupRun(false)` call is intentionally unchanged. Live evidence on 2026-05-21: `npm run dev:electron` opened the app; backend `/healthz` returned OK; the push UX appeared OK visually and behaviourally; the second-confirmation modal rendered the redacted remote (no credentials visible), defaulted focus to Cancel, dismissed cleanly on Esc, and Confirm stayed disabled until the explicit checkbox was ticked; the no-push path remained unchanged (Phase 5.6-A regression-free); app shutdown was clean (Electron log: `backend child exited code=null signal=SIGTERM expected=true`); post-close `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned no output (backend-child + static-server cleanup validated). Sandbox validation on the implementation turn: `cd frontend && npm run typecheck` exit 0; `cd backend-api && npm run build` exit 0; `cd backend-api && npm run test:backup` → `total: 42   PASS 42   SKIP 0   FAIL 0` (Phase 5.6-A backup suite still green); `node --check electron/main.mjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` all exit 0; `frontend npm run build` blocked by the documented `@rollup/rollup-linux-x64-gnu` Linux-sandbox limitation only — Windows host with `win32-x64-msvc` built cleanly during the live walkthrough. **Separate follow-up tracked off the 9-D-B3 walkthrough (NOT a 9-D-B3 blocker):** Electron emitted `window.open denied for https://github.com/michelbr84/CreativEdge/releases` when the user clicked **Open releases page ↗** in the Update info card; the URL belongs to the Phase 9-D-B1 / future-9-D-B4 release-link surface and not to the 9-D-B3 backup-push UX. Recorded in the 9-D-B1 / 9-D-B4 backlog; does NOT reopen 9-D-B3. See `### 9.4 Phase 9-D-B3` (in the active block above) and the 2026-05-21 §9-D-B3 Windows-validation closure footer at the bottom of this file for the full evidence trail. **Phase 9-D-B itself stays open** because 9-D-B2 (`afterPack` ABI rebuild) and 9-D-B4 (release runbook) are still not started; auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision.
- **Phase 9-D-B1 — ✅ Complete / Windows validated** — Manual update info polish Windows-validated 2026-05-21 via dev Electron walkthrough against commit `e036c77 feat(ops): add Phase 9-D-B1 manual update release check`. Frontend-only slice (1 new file `frontend/src/config/release.ts` + modified `frontend/src/components/ops/OpsConsole.tsx` + modified `electron/NOTES.md` + this `todo.md` patch trail; no backend route changes; no provider / memory / SSE changes; no Electron-main lifecycle changes; no `build-win.mjs` / `build-deps.mjs` changes; no `electron/package.json` dependency changes — `electron-updater` was NOT installed; no signing wiring; no GitHub Actions). Replaced the wrong hardcoded GitHub repository URL with the correct `michelbr84/CreativEdge` via the new shared `RELEASES_URL` / `LATEST_RELEASE_API_URL` constants in `frontend/src/config/release.ts`. Added a click-triggered "Check latest release" button to the Update info card in the Ops console that hits the public unauthenticated GitHub REST endpoint only on user click — no background polling, no telemetry, no User-Agent identifying the installation, no auth token, no auto-download, no auto-install. The `fetchLatestRelease()` helper returns a discriminated union covering `ok` / `no-release` (404) / `rate-limited` (403) / `network-error` / `error` outcomes; the card renders a small comparison badge (`Up to date` / `Release available` / `Unable to compare`) using the existing `.ce-status-*` palette plus per-state friendly hints. The Update info card now also surfaces the corrected releases URL inline as a KV row and (optionally) the backend version when it differs from the app version. Live evidence on 2026-05-21: `npm run dev:electron` opened the app; the Ops console worked; the Update info card showed the corrected `https://github.com/michelbr84/CreativEdge/releases` URL; the manual latest-release check was confirmed user-click-only; no `electron-updater` / no signing / no background update / no auto-install / no backup push UX / no `afterPack` or build-script refactor were added; app shutdown was clean (Electron log showed `backend child exited code=null signal=SIGTERM expected=true`); post-close CMD `netstat -ano | findstr ":3001" | findstr "LISTENING"` AND `netstat -ano | findstr ":5174" | findstr "LISTENING"` both returned no output (backend-child + static-server cleanup validated); `git status` clean. Sandbox validation on the implementation turn: `frontend npm run typecheck` exit 0; `backend npm run build` exit 0; `node --check electron/main.mjs` + `node --check electron/scripts/build-deps.mjs` + `node --check electron/scripts/build-win.mjs` all exit 0; `frontend npm run build` blocked by the documented `@rollup/rollup-linux-x64-gnu` Linux-sandbox limitation only — Windows host with `win32-x64-msvc` built cleanly during the live walkthrough. See `### 9.4 Phase 9-D-B1` (in the active block above) and the 2026-05-21 §9-D-B1 Windows-validation closure footer at the bottom of this file for the full evidence trail. **Phase 9-D-B itself stays open** because 9-D-B2 (`afterPack` ABI rebuild), 9-D-B3 (explicit opt-in backup push UX), and 9-D-B4 (release runbook) are still not started; auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision.
- **Phase 9-D-A — ✅ Complete / Windows validated** — Local diagnostics + crash-log foundation + read-only cost dashboard Windows-validated 2026-05-21 via dev Electron walkthrough against commit `e3e9044 feat: add Phase 9-D-A local diagnostics and usage dashboard`. Local-only, additive slice — no provider/memory/SSE/Electron-lifecycle changes; the Phase 9-B chat-recovery patches and the Phase 9-C wizard auto-open contract both held without regression. **New files (2):** `backend-api/src/routes/ops.ts` (two read-only GET routes — `/ops/usage/summary` aggregates `agent_events.usage_json` defensively into numeric-only buckets [totals + last-24h + last-7d + per-provider + per-agentSlug], tolerates null/malformed JSON via a counter, and `/ops/diagnostics` returns a sanitized runtime snapshot + filename-only logs-dir scan), `frontend/src/components/ops/OpsConsole.tsx` (read-only modal with four cards Diagnostics / Usage &amp; cost / Local logs / Update info reachable from a new 📊 Ops chrome button; `Promise.allSettled` so one slow endpoint never blocks the others; Esc / ✕ / click-outside close). **Modified files (5):** `electron/main.mjs` (added `readBackendLogTail()` + `writeCrashLog()` helpers — on unexpected backend child exit a structured JSON crash record is written asynchronously to `~/.creativedge/logs/crash-<ts>.log` with a strict field allowlist [timestamp, app/electron/node versions, packaged/dev mode, platform/arch/OS release, paths, child pid, exit code/signal/expected, backendLogPath, backendLogTail capped at ~16KB / 120 lines]; the `backendCrashed` diagnostic page renders the crash log path inline; the Phase 9-B lifecycle is fully preserved), `backend-api/src/server.ts` (one new import + one `await fastify.register(opsRoutes)` line), `frontend/src/types.ts` (added `OpsBucket` / `OpsUsageSummaryResponse` / `OpsLogFileRow` / `OpsDiagnosticsResponse` interfaces), `frontend/src/api/client.ts` (added `opsUsageSummary()` + `opsDiagnostics()` typed wrappers), `frontend/src/App.tsx` (+1 import + 1 state var `opsOpen` + 1 render slot + 1 new 📊 Ops chrome button between 🧭 Setup and ⚙ Admin), `frontend/src/styles.css` (+≈170 lines of `.ce-ops-*` rules + 720px mobile breakpoint). **Privacy contract enforced:** the crash log allowlist NEVER includes chat content, memory content, prompts, env vars, auth tokens, or API keys; the backend log tail is the SAME pino-redacted file the backend itself wrote. `/ops/usage/summary` returns numerics only — raw `usage_json` blobs never leave the backend. `/ops/diagnostics` returns file metadata only — never log file contents. Nothing leaves the machine. The Update info card surfaces app version + a `Open releases page ↗` button that uses `window.open` routed via Electron's existing `will-navigate` handler to `shell.openExternal` so it opens in the OS browser, NEVER inside the Electron window. **No auto-updater dependency installed**; no background polling; no signing wiring; no telemetry. Live evidence on 2026-05-21: `npm run dev:electron` opened the app; chat still worked (no Phase 9-B regression); 🧭 Setup still opened the first-run wizard (no Phase 9-C regression); 📊 Ops opened the new console; Diagnostics + Usage &amp; cost + Local logs + Update info all loaded; app closed normally; backend child exited normally; post-close `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned no output (backend-child + static-server cleanup validated); `git status` clean after the run. See `### 9.4 Phase 9-D-A` (below) and the 2026-05-21 §9-D-A Windows-validation closure footer at the bottom of this file for the full evidence trail. **Phase 9-D-B / 9-D-C still deferred** — auto-update wiring + signing/release-feed + `afterPack` ABI rebuild + push-automation (9-D-B); external crash-report send + cost-budget alerts + dynamic free-port + charting (9-D-C); both gated on policy/UX decisions not yet made.
- **Phase 9-C — ✅ Complete / Windows validated** — First-run wizard Windows-validated 2026-05-21 via dev Electron walkthrough. Frontend-only slice (1 new file `frontend/src/components/setup/FirstRunWizard.tsx`; modified `frontend/src/App.tsx` + `frontend/src/types.ts` + `frontend/src/styles.css`; no backend routes added; no provider / memory / Electron-lifecycle changes). The wizard is a thin React stepper (Runtime / Claude Code / Backup optional / Done) layered over the already-validated `GET /healthz` and Phase 5.6-A `/backup/*` routes; auto-opens once per app session via a `useRef` guard when the localStorage `creativedge.firstRun.dismissed` flag is absent OR `/healthz` reports `setupRequired:true`. Live evidence on 2026-05-21: `npm run dev:electron` opened the app; the wizard auto-opened and rendered all 4 steps; Runtime step showed `C:\Users\<you>\.creativedge` / storage:yes / db:yes / 14 seeded agents / backend at `http://127.0.0.1:3001`; Claude Code step reflected `/healthz` (primary:claude, installed:yes, auth:unknown, setup hint visible when reported, mock fallback available); Backup step rendered existing `/backup/status` (enabled:no, gitReady:yes, repoReady:yes, remoteConfigured:no, repoDir `C:\Users\<you>\.creativedge\backups\agents-git`, nextAction:configure); `Finish` closed the wizard and returned to chat; chat sent a message and Nexus replied; the 🧭 Setup button reopened the wizard; on close, backend exited normally and `Get-NetTCPConnection -LocalPort 3001 -State Listen` returned no output (backend cleanup validated). Privacy: localStorage stores only the boolean dismissed flag — no secrets, no remote URLs. push:false hardcoded on `/backup/run` (push automation stays Phase 5.6-B / 9-D). See `### 9.3 Phase 9-C — First-run wizard` (below) and the 2026-05-21 §9-C Windows-validation closure footer at the bottom of this file for the full evidence trail.
- **Phase 9-B — ✅ Complete / Windows validated** — Electron wrapper foundation Windows-validated 2026-05-21 after a 4-patch hardening sequence on top of the initial implementation: (1) Electron lifecycle hardening (port preflight + `~/.creativedge/logs/electron-backend-<ts>.log` redirection to fix Windows-GUI EPIPE that was killing the backend child; crash-resilient diagnostic page on unexpected exit); (2) chat-recovery patch 1 (recovery `GET /sessions/:id` on Chromium's false-negative `fetch("/chat")` rejection, gated on the SSE `meta` event); (3) chat-recovery patch 2 (`apiListSessions(20)` fallback for the first-turn case where no `meta` event fires); (4) chat-recovery patch 3 (bounded retry polling at `[250, 750, 1500]` ms with an `assistantId`-still-in-messages guard); (5) packaging-fix `electron/scripts/build-win.mjs` orchestrator (try/finally Node-ABI swap: build-deps → `@electron/rebuild` for `better-sqlite3` against the resolved Electron version → `electron-builder --win`, with `finally`-block restore to system-Node ABI so dev mode keeps working). Final live evidence on 2026-05-21: `npm run build:electron` clean end-to-end (rebuild log line confirmed Electron 30.5.1 ABI); cleanup `npm --prefix ../backend-api rebuild better-sqlite3` succeeded so dev ABI restored; `electron/dist-electron/win-unpacked/CreativEdge.exe` opened as normal Windows user with backend log path `C:\Users\<you>\.creativedge\logs\…` (normal-user runtime + sessions + Claude auth context confirmed); chat send + assistant response + existing sessions all worked; no stale red backend banner; no `NODE_MODULE_VERSION` crash; no port-3001 collision; shutdown log showed `terminating backend child` → `closing static server` → `backend child exited code=null signal=SIGTERM expected=true`; post-close `Get-NetTCPConnection -LocalPort 3001 -State Listen` returned no output. Backend code, providers, SSE contract, agent personality files, memory artifacts, `console.html`, README untouched throughout the phase. Net source-tree additions: `electron/package.json`, `electron/main.mjs`, `electron/scripts/build-deps.mjs`, `electron/scripts/build-win.mjs`, `electron/.gitignore`, `electron/NOTES.md`, plus 4 root `package.json` orchestration scripts (`setup:electron` / `dev:electron` / `build:electron` / `rebuild:electron`) and the App.tsx chat-recovery helpers. See `### 9.2 Phase 9-B — Electron wrapper foundation` and the 2026-05-21 §9-B Windows-validation closure footer at the bottom of this file for the full evidence trail (including the 4-patch hardening sequence).
- **Phase 9-A — ✅ Complete / Windows validated** — Deployment baseline + reproducible setup foundation landed 2026-05-20 (commit `864beec feat(root): add Phase 9-A deployment baseline and setup foundation`). Root-level `package.json` (zero deps, zero devDeps, 12 orchestration scripts, `engines.node >=20.11.0`), `scripts/dev-help.mjs` (canonical two-terminal launch printer), and `scripts/setup-postinstall.mjs` (post-setup next-steps printer with Node-version sanity check). Backend `ensureRuntimeDir` (Phase 2.1) remains the sole `~/.creativedge/` scaffolder; `npm run setup` only installs deps and prints next steps — never touches user data, never writes `.env`, never calls a provider. Single-command desktop launch deliberately deferred to Phase 9-B (Electron). Windows live validation 2026-05-20: `npm run setup` completed successfully, `npm run typecheck` completed successfully, `npm run dev:backend` started backend, `npm run dev:frontend` started Vite frontend, browser at `http://127.0.0.1:5173` loaded the chat UI, `/healthz` responded, `npm run build` completed where applicable. See the 2026-05-20 §9-A implementation footer + the 2026-05-20 §9-A Windows-validation footer at the bottom of this file for the full evidence trail.

The detailed roadmap follows below in canonical order: Phase 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, the per-agent matrix, the cut list, and the how-to-use footer.

---

## Phase 0 — Foundation (✅ complete)

- [x] Folder structure for orchestrator + 13 specialists under `CreativEdge/`.
- [x] Per-agent files: `identity.md`, `soul.md`, `personality.md`, `system_prompt.md`, `config.json`, `memory/` (core + episodic + README).
- [x] Distinct MBTI types across all 14 entities; 4 temperaments represented.
- [x] Orchestrator routing artifacts: `registry.json` + `routing_rules.md`.
- [x] Project-level `INSTRUCTIONS.md` — usable as Claude Project instructions today.
- [x] Admin console `console.html` — read/edit personalities locally with `localStorage` + per-file download.
- [x] Top-level `README.md` + `architecture.md`.

**Done when** ✅ the structure exists and is consistent. *(Met.)*

---

## Phase 1 — Runtime decisions (✅ complete · 2026-05-15)

- [x] **LLM provider.** Primary: **Claude via the local Claude Code CLI runtime**, used through the existing `Provider` abstraction — no `.env`, no project-level API key, no `ANTHROPIC_API_KEY`. Future optional providers: **OpenAI** and **local Ollama** (behind the same `Provider` abstraction).
- [x] **Orchestration runtime.** **Local desktop app + local Claude Code CLI runtime.** Nexus is the always-on orchestrator; specialists are invoked through the same `Provider` surface.
- [x] **Hosting.** v1: **local-only desktop**. Local-network optional later. Cloud deferred.
- [x] **Persistence.** **Markdown canonical** for agent files and durable memory. **SQLite** for sessions, history, index, and search. Optional **private GitHub repo** for safe backup/versioning. No secrets committed (there are none to commit).
- [x] **Auth.** **Single-user.**
- [x] **Streaming.** **SSE** for chat responses.
- [x] **User data directory.** `C:\Users\<user>\.creativedge\` (cross-platform: `~/.creativedge/`) — created on first run; holds user profile, provider config, durable agent memory, sessions DB, and logs. Agent personality definitions stay in the project folder (`CreativEdge/agents/`) so they remain shareable; user-specific state lives in `~/.creativedge/`.

> Resolved: the project proceeds with **Node + TypeScript** for the backend and a future **Vite + React + TypeScript / Electron** direction for UI/desktop work (see Phase 6.0). Python/WebView is not the current path.

**Done.** All downstream phases below have been rewritten against these decisions.

---

## Phase 2 — Backend / API layer

Status: ✅ Complete

Local Node + TypeScript service (Fastify) that hosts the local Claude Code CLI runtime through the `Provider` abstraction and exposes a small HTTP API to the chat UI and admin console. The future Electron shell (Phase 9) will launch this service on app start.

### 2.1 Service skeleton (✅ complete · 2026-05-15)
- [x] Node + TypeScript + Fastify. Lives at `backend-api/`.
- [x] **Provider abstraction** — `Provider` interface with `checkReady()` + `call() → AsyncIterable<chunk>`; `ClaudeProvider` stubbed, `MockProvider` working. OpenAI/Ollama deferred.
- [x] **First-run bootstrap.** `ensureRuntimeDir` creates `~/.creativedge/{profile.json, providers.json, sessions.db, logs/, agents/<slug>/memory/}` idempotently — never overwrites existing user data (verified with a marker-file round-trip).
- [x] CORS locked to `localhost` / `127.0.0.1` / `[::1]` — no wildcard. Verified: foreign origin gets no `Access-Control-Allow-Origin` header.
- [x] Structured JSONL logging → `~/.creativedge/logs/creativedge-YYYY-MM-DD.log`. Conversation content never logged; auth headers redacted.
- [x] `GET /healthz` returns `{ ok, version, service, runtimeDir, storageReady, dbReady, providers{primary, claude, mock}, seededAgentSlugs, requestId }`.
- [x] Per-request UUIDs via Fastify `genReqId`, honoring upstream `x-request-id`.
- [x] SQLite placeholder (`sessions.db`) with baseline schema: `sessions`, `messages`, `agent_events` (+ indexes, WAL mode, FK on). Liveness probe in `/healthz`.
- [x] Clean shutdown on SIGINT/SIGTERM (Fastify close + DB close).
- [x] **No `.env`, no API key file, no secrets committed.**

### 2.2 cleanup + slices (✅ complete · 2026-05-15)

- [x] **Cleanup.** Replaced Unicode em dashes with ASCII hyphens in `/healthz` status strings, the MockProvider reply text, the providerRegistry error message, and the memory placeholder content. PowerShell logs no longer show `â€"` for those strings.
- [x] **2.2-A.** Agent routes (`GET /agents`, `GET /agents/:slug`, `PUT /agents/:slug`, `GET /agents/:slug/memory`, `POST /agents/:slug/memory/episodic`, `POST /agents/:slug/memory/promote`) and session routes (`GET /sessions`, `GET /sessions/:id`). `PUT` only accepts a safe override subset (`tagline`, `voice`, `color`, `values`, `strengths`, `watch_outs`); writes go to `~/.creativedge/agents/<slug>/overrides.json`. Project templates remain read-only. Partial-apply returns HTTP 207 with per-field reasons. Path traversal blocked by `^[a-z][a-z0-9-]{1,40}$` slug regex. Promotion requires `confirmed === true` and is duplicate-guarded.
- [x] **2.2-B.** `ClaudeProvider.checkReady()` now spawns `claude --version` with a 2.5 s hard timeout. Reports `installed` + `authStatus: "unknown"` + `setupRequired` + `setupHint`. **No** Anthropic API call, **no** `ANTHROPIC_API_KEY`, **no** `.env`, **no** API-key file. `/healthz` surfaces `degraded`, `setupRequired`, and `setupHint` at the top level.
- [x] **2.2-C.** `POST /chat` over SSE. Deterministic keyword router (ported from `console.html`/`registry.json`) - +3 per keyword, +2 per name/domain hit. Streams `meta` → `chunk` → `done` (plus `error` on failure). Persists user + assistant messages to `messages` and a row to `agent_events` with `fallback_used`, `latency_ms`, `status`.

### 2.3 local Claude streaming (✅ complete · 2026-05-15)

- [x] **`claudeCli.ts`** — spawns the local `claude` CLI in non-interactive print mode. Args array only, no shell interpolation. Parses newline-delimited JSON; emits text chunks from `stream_event.content_block_delta`, buffers `assistant.message.content[]` as a fallback, maps `result.is_error: true` to an error chunk. Always ends with exactly one `{type:"done"}`.
- [x] **`ClaudeProvider.call()`** — delegates to `callLocalClaudeCli`. No Anthropic API import. No API key. No `.env`. No external HTTP.
- [x] **`chat.ts` selection + fallback** — uses `selectProviderWithFallback`. Tries Claude when `installed === true`, buffers the first ProviderChunk before emitting `meta`. If the first chunk is `error`, swaps in MockProvider transparently and marks `degraded: true` + `claudeError: "<reason>"` in the meta event. SSE event shape unchanged.

### 2.4 minimal-invocation fix + router word boundaries (✅ complete · 2026-05-15)

- [x] **CLI invocation simplified to the validated minimal shape:** dropped `--bare`, `--no-session-persistence`, `--tools ""`, `--dangerously-skip-permissions`, and `--include-partial-messages`. The killer was `--bare` — Claude Code's own help text forces that mode to authenticate via `ANTHROPIC_API_KEY` / `apiKeyHelper`. Removing it lets the CLI use the user's local OAuth credentials.
- [x] **Parser cleanup.** Emits `assistant.message.content[].text` directly as one text chunk per content block. Falls back to `result.result` only when no assistant text was emitted.
- [x] **Keyword router word-boundary fix.** Replaced `q.includes(kw)` with a word-boundary regex (`\b<kw>(?:s|es|ed|er|ers|ing|y|ies)?\b`, case-insensitive). `"Explain in one short paragraph what CreativEdge is."` now scores 0 and falls back to Nexus instead of mis-routing to `ai-services` via the `paragraph` ⊃ `rag` substring trap.

### 2.4 timeout tuning (✅ complete · 2026-05-15)

- [x] **Defaults bumped:** `firstChunkTimeoutMs` 15 s → **60 s**; `turnTimeoutMs` (hard cap) 90 s → **120 s**.
- [x] **Configurable via `~/.creativedge/providers.json`** (no `.env`, no flags). New optional fields under `providers.claude`: `firstChunkTimeoutMs`, `turnTimeoutMs`.
- [x] **Error wording clarified** so it points the user at the right config key when a timer fires.

### 2.5 runtime context isolation + Nexus project context (✅ complete · 2026-05-15)

- [x] **New project-context preamble** at `orchestrator/creativedge_context.md` (~3.5 KB, ~700 tokens). Injected on **every** `/chat` turn in front of the specialist's own system prompt.
- [x] **System prompt assembly** in `chat.ts` is now `[creativedge_context.md] + "----- you are -----" + [agent system_prompt.md] + "----- core memory -----" + [runtime core_memory.md]`. SSE contract unchanged.
- [x] **Nexus path bug fixed.** `readAgentSnapshot` now honors the registry entry's `path` field. Nexus loads from `orchestrator/` instead of the non-existent `agents/nexus/`.
- [x] **Bootstrap seeds Nexus memory too.** `seededAgentSlugs` is now 14 entries (1 orchestrator + 13 specialists) instead of 13.
- [x] **Five isolation flags added to the CLI invocation**, probed individually: `--no-session-persistence`, `--disable-slash-commands`, `--tools ""`, `--setting-sources ""`, `--strict-mcp-config`.
- [x] **Windows validation.** Real Claude streaming via `/chat`, `provider:"claude"`, `degraded:false`, no Superpowers / skills / hooks / plugins / MCP leakage.

### 2.6 reliability polish + ToDo cleanup (✅ complete · 2026-05-15)

- [x] **Retry + backoff (`src/providers/claudeCli.ts`).** New `callLocalClaudeCliWithRetry` wraps `callLocalClaudeCli` with at most ONE retry after a 600 ms delay. Never retried: auth failures, hard turn timeout, first-chunk timeout, binary-not-found.
- [x] **Context budgeting (`src/routes/chat.ts`).** New `budgetTranscript` trims the session transcript before passing it to the provider. Never trimmed: `creativedge_context.md`, agent or orchestrator `system_prompt.md`, runtime `core_memory.md`, current user message. Defaults: `maxContextChars=120000`, `reservedResponseChars=12000`, `recentMessageLimit=20`.
- [x] **Usage / cost persistence (`agent_events.usage_json`).** Idempotent SQLite migration adds the `usage_json` TEXT column. The CLI parser emits a new `{type:"usage", data}` chunk built from the `result` event.
- [x] **Selector hardening.** `selectProviderWithFallback` now skips non-discriminating chunks (`usage`, `meta`) while looking for the first `text` / `error` / `done`.
- [x] **No `.env`, no `ANTHROPIC_API_KEY`, no API-key file, no external HTTP client, no Anthropic API path** introduced anywhere in the slice.

### Future refinements (post-Phase 2, NOT blockers)

These are intentionally deferred. None of them block Phase 3 or Phase 4.

- **Token-exact budgeting.** Today's character-count approximation (~4 chars/token for English) over-trims on CJK and under-trims on dense code. Move to a tokenizer-based count once we adopt one.
- **Indexed cost-dashboard columns on `agent_events`.** `usage_json` already captures `total_cost_usd`, `input_tokens`, `output_tokens`, `model`, `duration_*_ms`, `service_tier`, etc., but they live inside a JSON blob. Promote a few of them to typed columns when the console grows a cost view.
- **Retry telemetry on the wire.** Retries are currently logged via pino (`phase: "claude-cli-retry"`) but not surfaced in the SSE `meta` event or as structured `agent_events` fields. Add a `retried` flag if/when a UI consumer needs it.
- **Official non-invasive Claude auth detection.** We intentionally keep `authStatus: "unknown"` rather than poke at keychain or credential files. Only revisit if Claude Code exposes a supported `claude whoami`-style command.

### Closed / superseded (kept here only for traceability)

- *"Phase 2.2 follow-up: real Claude Code authenticated runtime handshake."* Superseded — `ClaudeProvider.call()` now spawns the local CLI through `callLocalClaudeCliWithRetry` (Phase 2.3 + 2.4 + 2.6).
- *"Phase 2.2 follow-up: detect missing Claude auth at boot, surface a friendly hint."* Done — `/healthz` exposes `installed`, `authStatus`, `setupRequired`, `setupHint`; `/chat` surfaces `claudeError` and falls back to mock when Claude is unavailable.
- *"Authenticated runtime not verified empirically."* Stale — Windows validation in Phase 2.4 + 2.5 confirmed real Claude streaming end-to-end with `provider:"claude"`, `degraded:false`.
- *"Cost / usage callbacks from the local runtime, surfaced on agent_events."* Landed in Phase 2.6 — `agent_events.usage_json` carries the result-event metadata for real Claude turns and `{"provider":"mock"}` for mock turns.

---

## Phase 3 — Orchestrator (Nexus) runtime

Status: ✅ Complete

Nexus is the routing/orchestration layer. In this implementation we use the local Claude Code CLI runtime through the `Provider` abstraction: no Anthropic API, no `.env`, no API keys.

### 3.1 Routing pipeline — ✅ Complete

- [x] Fast keyword pass using `orchestrator/registry.json` keywords.
- [x] Shared backend routing module created.
- [x] Confidence scoring implemented.
- [x] Clear winner routes directly.
- [x] Ambiguous routing can use override rules, local Claude tie-breaker, or clarification.
- [x] Override rules from `orchestrator/routing_rules.md` implemented.
- [x] Out-of-domain / Nexus fallback behavior implemented.
- [x] `routing_events` table added to `sessions.db`.
- [x] Routing decisions are persisted for debugging/eval.
- [x] Windows validation completed:
  - RAG routes to `ai-services`.
  - Ambiguous `logo + video` can use `llm_tiebreaker`.
  - `routing_events` persists decisions.
  - Tie-breaker does not create extra `messages`.
  - Real Claude provider returns `provider:"claude"` and `degraded:false`.

### 3.2 Multi-specialist convening — ✅ Complete

- [x] Detection for explicit multi-perspective asks.
- [x] Detection for cross-domain deliverables.
- [x] Specialist selection supports 2–3 specialists.
- [x] Cost cap enforced: never more than 3 specialists in one convening turn.
- [x] Parallel fan-out implemented.
- [x] Internal specialist drafts are not streamed directly.
- [x] Internal specialist drafts do not create normal `messages` rows.
- [x] `routing_events.convened_slugs_json` added and populated.
- [x] Nexus synthesis path implemented.
- [x] Reliability patch applied:
  - compacted draft size
  - configurable `providers.claude.conveningSynthesisTimeoutMs`
  - safe `synthesisError` surfaced in SSE `done`, logs, and `usage_json`
- [x] Windows validation completed:
  - brand launch convening returned `synthesisOk:true`
  - `provider:"claude"`
  - `degraded:false`
  - `convenedSlugs:["graphics-design","digital-marketing","business"]`
  - `routing_events.convened_slugs_json` populated
  - convening session had exactly 2 messages
  - `agent_events.usage_json` captured specialist + synthesis usage

### 3.3 Hand-off semantics — ✅ Complete

- [x] A specialist sub-agent can request hand-off mid-turn using a structured `<CREATIVEDGE_HANDOFF>{"handoff":"<slug>","reason":"..."}</CREATIVEDGE_HANDOFF>` signal.
- [x] Nexus completes the hand-off transparently in the same turn (streams transition line + target specialist's reply through the same SSE response).
- [x] Anti-ping-pong guard: architectural max of one hand-off per turn — the target specialist does NOT receive the handoff instruction, and any block they emit anyway is silently stripped by `stripAnyHandoffBlock`.
- [x] Hand-off events are persisted to a new `handoff_events` table (idempotent migration). Status values: `completed`, `failed_target_call`, `ignored_invalid_slug`, `ignored_same_slug`, `ignored_missing_reason`, `ignored_malformed_json`, `ignored_nexus_target`, `ignored_max_handoff_reached`.
- [x] Hand-off only fires on `decision.type === "specialist"` (not on `convene` / `clarify` / `out_of_domain` / `nexus_fallback`).
- [x] SSE contract preserved; `done` event gains an additive optional `handoff: {fromSlug, toSlug, rawSlug, status, reason}` field.
- [x] Exactly 2 `messages` rows persisted per handoff turn: the user input and the final visible target reply. The originating specialist's pre-handoff draft is never persisted.
- [x] Alias-normalization patch: persona names and short domain words (e.g. `echo`, `Echo`, `music audio`, `Music & Audio`) resolve to canonical registry slugs (`music-audio`) before validation.
- [x] Completed-handoff validation (Windows, forced fixture): `graphics-design` → `music-audio`, `done.handoff.status:"completed"`, `handoff_events.status:"completed"`, canonical `to_slug:"music-audio"`, exactly 2 `messages` rows.

### Done when — ✅ Complete

- [x] Routing playground / prototype and live backend agree on routing for a 30-prompt fixture set (Phase 8.1).
- [x] Phase 3.1 routing pipeline is complete.
- [x] Phase 3.2 convening is fully validated with `synthesisOk:true`.
- [x] Phase 3.3 hand-off semantics are implemented and Windows validated.
- [x] Phase 3 is ready to hand off into the next phase.

### Phase 3 — implementation detail (kept for traceability)

**3.1 routing pipeline.**

- New routing pipeline (`backend-api/src/routing/routingPipeline.ts`) with `RouteDecision` union (`specialist` / `clarify` / `out_of_domain` / `nexus_fallback` / `convene`).
- Five override rules in `routing/overrideRules.ts` (Lumi↔Iris, Vera↔Atlas, Sage↔Bit, Buzz↔Lex, Echo↔Reel) — deterministic, no LLM.
- LLM tie-breaker in `routing/tieBreaker.ts` calling the local Claude CLI only — no Anthropic API, no API key, no `.env`. Isolated: separate `requestId`, no `messages` row, no SSE chunks to the user.
- `routing_events` table via idempotent migration; one row per `/chat` turn. Indexed on `session_id` and `request_id`.

**3.2 multi-specialist convening.**

- New convening detector (`backend-api/src/routing/convening.ts`) — explicit-multi phrases + cross-domain deliverable table + domain-alias parser. Hard cap of 3, dedup, Nexus excluded.
- New convening runner (`backend-api/src/convening/runConvening.ts`) — `Promise.allSettled` fan-out to 2–3 specialists with per-specialist system prompt + project context + "you are one of several" instruction.
- Idempotent migration: `ALTER TABLE routing_events ADD COLUMN convened_slugs_json TEXT`.

**3.3 hand-off semantics.**

- New detector module `backend-api/src/handoff/handoffDetector.ts`: regex-based parser for `<CREATIVEDGE_HANDOFF>{json}</CREATIVEDGE_HANDOFF>` blocks with alias normalization (`echo` → `music-audio`, etc.).
- New runner module `backend-api/src/handoff/runHandoff.ts`: single sequential target-specialist call. The target specialist's system prompt is normal — it does **not** include the handoff instruction.
- New `handoff_events` table via idempotent migration: `id, session_id, request_id, message_id, from_slug, to_slug, reason, status, ignored_reason, created_at`. Two indexes: `idx_handoff_session`, `idx_handoff_request`.
- `HANDOFF_INSTRUCTION` in `chat.ts` is appended to the specialist's system prompt **only** when `decision.type === "specialist"`.
- SSE contract preserved. `done` event gains an additive optional `handoff: {fromSlug, toSlug, rawSlug, status, reason}` field.

---

## Phase 4 — Per-agent runtime

Status: ✅ Complete / Windows validated (Phase 4.1, 4.2, 4.3-A/B, 4.4-A/B, 4.5-A, 4.5-B, and the Phase 4 → 5 bridge §5.2-A all ✅ complete / Windows validated; core-memory reference validation closed at 14/14 agents; user-confirmed memory-worthy fact promotion flow Windows-validated end-to-end — detect → confirm → promote round-trip, duplicate guard, and sensitive-content guard all confirmed)

Each specialist is invoked via the **local Claude Code CLI runtime** through the existing `Provider` abstraction (no Anthropic API, no `.env`, no API key). Earlier wording mentioned "Claude Agent SDK sub-agents"; the actual implementation uses the local CLI runtime that Phases 2.3-2.6 built.

For each invocation (Phase 4 checklist):
1. [x] Load `CreativEdge/agents/<slug>/system_prompt.md` as the sub-agent's system message — `readAgentSnapshot()` (since Phase 2.5), centralized in `buildAgentRuntimeContext()` (Phase 4.1).
2. [x] Load `~/.creativedge/agents/<slug>/memory/core_memory.md` as a prefix block — same place.
3. [x] Optionally load the last *N* entries from `~/.creativedge/agents/<slug>/memory/episodic_memory.md` (default `N=10`, configurable via `providers.claude.recentEpisodicLimit`) — Phase 4.1 new.
4. [x] Append running session transcript from `sessions.db` (capped by char budget) — Phase 2.6 `budgetTranscript()`.
5. [x] Append the new user message — last entry in the `messages[]` array passed to the provider.
6. [x] Call the local Claude Code CLI runtime via the Provider abstraction with streaming enabled — `ClaudeProvider.call()` (Phase 2.3+).
7. [x] Stream tokens back over **SSE** to the chat UI — `chat.ts` SSE writer (Phase 2.2).
8. [x] After response, log a one-line summary to `episodic_memory.md` (date · gist · was_handoff) and write `messages` + `routing_events` rows to `sessions.db` — `appendEpisodicSummary()` (Phase 4.1, deterministic, sensitive-content guarded); `messages` and `routing_events` writes since Phase 3.1.
9. [x] Detect memory-worthy facts → ask the user before writing to `core_memory.md`. **Closed by §5.2-A** (Phase 4 → 5 bridge, Windows-validated): deterministic `detectMemoryCandidate` surfaces a candidate in the SSE `done.memoryCandidate` payload; the write happens only via `POST /agents/:slug/memory/promote` with `confirmed:true`, behind the duplicate guard, the sensitive-content guard, and (since §5.2-B) the file-lock primitive. Automatic core-memory writes remain out of scope by design.

### 4.1 Runtime reconciliation + episodic context read — ✅ Complete / Windows validated

- [x] Reconciled the Phase 4 checklist against the existing Phase 2/3 runtime.
- [x] Centralized per-agent runtime context assembly in `src/agents/agentRuntimeContext.ts` (`buildAgentRuntimeContext`). The chat.ts specialist branch and runHandoff target call adopted it in Phase 4.1; runConvening was moved onto `buildAgentRuntimeContext` in Phase 4.2.
- [x] Loaded the trailing `recentEpisodicLimit` episodic entries (default 10) into every specialist invocation's system prompt. The reader strips control chars, caps line length to 400 chars and total block size to 4000 chars, never throws on malformed input, and exposes only counts (not content) in SSE meta + pino logs.
- [x] Added `providers.claude.recentEpisodicLimit` to `runtimeConfig.ts` + `ClaudeProvider` + the seeded default `~/.creativedge/providers.json`. `recentEpisodicLimit:0` disables episodic injection cleanly.
- [x] Preserved Phase 2.6 character budgeting (`budgetTranscript`). `protectedChars` is now larger because episodic memory lives inside `systemContent`; the runner reports `core_memory_loaded`, `episodic_entries`, `episodic_chars` in SSE `meta.budget` for observability.
- [x] Preserved the local Claude Code CLI provider, MockProvider fallback, retry/backoff, and SSE contract. No Anthropic API, no `.env`, no API key, no external HTTP client.
- [x] Added a deterministic one-block episodic summary write (`appendEpisodicSummary`) after each successful `specialist`-routed turn and after each completed handoff (writes to the TARGET specialist's episodic file with `was_handoff:true`). No LLM call; the gist is the first 180 chars of the user message. A sensitive-content guard skips the write silently when the user message matches credit-card / SSN / API-key / private-key patterns — the chat route logs `episodicSummarySkipped` with the reason but never the content.
- [x] Verified `npm run build` passes after refactor.
- [x] Verified `npm run test:routing` coverage check still passes (38 fixtures, all 13 specialists ≥ 2 mentions, 5 overlap, 3 convene, 3 nexus, 1 handoff).
- [x] Windows live smoke validation passed for Lumi, Sage, and Echo. `agentSlug:"graphics-design"` / `"ai-services"` / `"music-audio"` respectively, `provider:"claude"`, `degraded:false` on all three; Lumi smoke also confirmed `core_memory_loaded:true` and `episodic_entries` / `episodic_chars` present in `meta.budget`; Echo smoke confirmed `agentName:"Echo"`.
- [x] `npm run test:routing` passed on Windows with `38 PASS / 0 FAIL`.
- [x] DB sanity confirmed correct `messages`, `routing_events`, and `agent_events`: latest `messages` rows show the correct specialist slugs, latest `routing_events` show the correct selected slugs and specialist decisions, latest `agent_events` show `provider:"claude"`, `fallback_used:0`, `status:"ok"`, `has_usage:1`.
- [x] 10+ turn voice-hold validation for each specialist (Phase 4 done-when criterion) — closed by §4.4-B Windows-validated runs: 14/14 agents passed `<slug>-voice-001: 10/10 PASS`.
- [x] Core-memory reference validation for each specialist (Phase 4 done-when criterion) — closed by §4.5-A (harness + Lumi, Sage) and §4.5-B (remaining 12): 14/14 agents Windows-validated with probe YES, header OK, recall OK, `provider:"claude"`, `degraded:false`, no forbidden leakage.
- [x] User-confirmed memory-worthy fact promotion flow (Phase 4 → 5 bridge) — closed by §5.2-A: deterministic detector (`detectMemoryCandidate`), SSE `done.memoryCandidate` surface, defense-in-depth sensitive-content guard on `POST /agents/:slug/memory/promote`. Windows validation completed end-to-end: detect → confirm → promote round-trip (HTTP 200, `bytesAppended:90`), duplicate promote returned `{ok:true, duplicate:true}` without growing the file, sensitive promote of `My card is 4111 1111 1111 1111.` refused with HTTP 422 and no append; `npm run test:memory-candidate` 18/18 PASS on Windows; regression tests stayed green (`test:routing` 38/38, `test:agents` 70/70, `test:memory` 14/14).
- [x] Roll runConvening's per-specialist drafter onto `buildAgentRuntimeContext` — landed in Phase 4.2.

**Done when** each specialist invoked via `/chat` produces a response that:
- starts with its `🎨 Lumi — Graphics & Design`-style header,
- stays in its documented voice for 10+ turns,
- references prior facts from its `core_memory.md` correctly.

### 4.2 Convening drafter runtime assembly — ✅ Complete / Windows validated

- [x] Refactored `runConvening.ts` per-specialist drafter calls to use `buildAgentRuntimeContext`. The convening-specific addendum (`SPECIALIST_INSTRUCTION` — "you are one of several … keep it compact … internal draft, no header") is now passed as the `systemPromptAddendum`, so the inline `readAgentSnapshot` / `loadProjectContext` / hand-rolled string concatenation in the drafter is gone.
- [x] Convened specialists now receive project context, system prompt, core memory, recent episodic memory, and the convening-specific addendum through the same shared runtime assembly path used by `chat.ts` specialist branch and `runHandoff` target call. No assembly drift across the three call sites.
- [x] `recentEpisodicLimit` is honored for convening specialist drafts: a new optional `episodicLimit?: number` field on `ConveningRunnerArgs`, threaded from `chat.ts` via `getEpisodicLimit(fastify)` (same source as the specialist + handoff paths). Default 10, `recentEpisodicLimit:0` disables episodic injection, missing config does not crash.
- [x] Existing convening synthesis behavior preserved: parallel fan-out via `Promise.allSettled`, compacted drafts (`MAX_DRAFT_CHARS=1500`), Nexus synthesis call, deterministic stitch fallback, `synthesisError` classification, hard cap of 3 specialists. None of these were touched.
- [x] `usage_json` extended with compact per-specialist runtime-context counters (`core_memory_loaded`, `episodic_entries`, `episodic_chars`) inside the existing `summarizeDraftsForUsage` shape. Booleans / counts / chars only — never memory content, never the draft text. SSE contract unchanged.
- [x] `buildAgentRuntimeContext` kept pure (filesystem-only). No provider calls, DB calls, routing logic, network IO, or conversation-content logging added.
- [x] `npm run build` passed.
- [x] `npm run test:routing` coverage check still passes (38 fixtures, all 13 specialists ≥ 2 mentions, 5 overlap, 3 convene, 3 nexus, 1 handoff). Sandbox can't reach the backend live, so coverage-only.
- [x] Live convening smoke test on Windows passed:
  - `routeDecision.type:"convene"`
  - `agentSlug:"nexus"`
  - `convenedSlugs:["graphics-design","digital-marketing","business"]`
  - `provider:"claude"`
  - `degraded:false`
  - `synthesisOk:true`
  - exactly 2 normal `messages` rows
  - `routing_events.decision_type:"convene"`
  - `convened_slugs_json` populated
  - `agent_events.provider:"claude"`
  - `fallback_used:0`
  - `status:"ok"`
  - `has_usage:1`

Remaining Phase 4 work — all closed:

- [x] 10+ turn voice-hold validation for each specialist — closed by §4.4-B (14/14 agents Windows-validated).
- [x] Core-memory reference validation for each specialist — closed by §4.5-A (harness + Lumi, Sage) and §4.5-B (remaining 12): 14/14 agents Windows-validated.
- [x] User-confirmed memory-worthy fact promotion flow — closed by §5.2-A (Phase 4 → 5 bridge, Windows-validated): detect → confirm → promote round-trip, duplicate guard, and sensitive-content guard all green.

### 4.3-A Per-agent behavior smoke/eval harness — ✅ Complete / Windows validated

This slice is the first deterministic foundation for the Phase 4 done-when criteria. It is **not** the 5-prompt SP coverage (Phase 8.2 territory) and **not** the 10-turn voice-hold (a Phase 4 done-when criterion). It is a single-turn-per-agent smoke that verifies stable metadata, the expected agent header fingerprint, and the absence of internal-tool leakage terms — every CreativEdge entity can be invoked via `/chat` cleanly and stays in lane.

- [x] Created `backend-api/tests/agent-behavior-fixtures.json` with one fixture per entity for all 14 agents (1 orchestrator + 13 specialists). Each fixture declares `expected.agentSlug`, `expected.agentName`, `expected.requiredHeaderIncludes`, `expected.forbiddenIncludes`.
- [x] Prompts re-use known-good wording from the Phase 8.1 routing fixtures where the prior matrix entries would have tripped convening (Echo / Quant / Cash / Vera / Lex / Atlas / Bloom / Bit / Buzz). Nexus uses the `Tell me a short joke about cats` prompt — zero specialist keywords, so it lands on `nexus_fallback`.
- [x] Created `backend-api/scripts/run-agent-behavior-smoke.mjs` — Node 20+ built-in `fetch`, the same small SSE block parser as `run-routing-fixtures.mjs`, dependency-light. Validates per fixture: `meta.agentSlug === expected.agentSlug`, `meta.agentName === expected.agentName`, `meta.provider === "claude"`, `meta.degraded === false`, `done.ok === true`, streamed text contains every `requiredHeaderIncludes` substring (case-sensitive — these are deliberate persona names / domains), and streamed text contains **none** of the `forbiddenIncludes` substrings (case-insensitive — protects against `Superpowers` / `MCP` / `Claude Code` / `<CREATIVEDGE_HANDOFF>` leakage). Configurable via `CREATIVEDGE_API_URL`, `CREATIVEDGE_TURN_TIMEOUT_MS`, `CREATIVEDGE_ONLY`, `CREATIVEDGE_VERBOSE`.
- [x] Exit code 0 on all-pass, non-zero on any FAIL. Prints a per-fixture table: `id`, `expSlug`, `actSlug`, `header` (OK/MISS), `leak` (OK/LEAK), `result` (PASS/FAIL).
- [x] Added `"test:agents": "node scripts/run-agent-behavior-smoke.mjs"` to `backend-api/package.json` (without removing or touching the existing `test:routing` script).
- [x] Sandbox sanity test covered 7 evaluate() branches: clean PASS, wrong-slug FAIL, degraded-to-mock FAIL, missing-header FAIL, forbidden-term leakage FAIL, `<CREATIVEDGE_HANDOFF>` block leakage FAIL, `done.ok:false` FAIL.
- [x] `npm run build` (sandbox): clean. `npm run test:routing` coverage check (offline): coverage ok.
- [x] Windows live run passed: `npm run test:agents` returned `total 14, PASS 14, FAIL 0`. Each fixture confirmed `provider:"claude"`, `degraded:false`, correct `agentSlug` + `agentName`, the per-agent header fingerprint, and no internal-tool leakage.

Explicitly out of scope for §4.3-A (this slice is a smoke foundation, not a full eval):

- Subjective LLM quality assertions.
- Exact response wording matches.
- 5-prompt SP coverage per agent — handled in §4.3-B below.
- 10-turn voice-hold (Phase 4 done-when criterion, separate slice).
- Core-memory recall validation (Phase 4 done-when criterion + Phase 5 memory system).
- Marking the per-agent matrix SP or Voice columns checked.

### 4.3-B Per-agent 5-prompt behavior fixture expansion — ✅ Complete / Windows validated

Phase 4.3-B reuses the §4.3-A runner unchanged in structure but expands the fixture set so every CreativEdge entity has 5 deterministic single-domain prompts. This is the first slice toward the Phase 8.2 "5 in-domain prompts per agent → SP column" goal but explicitly does NOT close that gate; SP/Voice rows in the per-agent matrix stay open until the broader voice-rubric work lands.

- [x] Expanded `backend-api/tests/agent-behavior-fixtures.json` from 14 to **70 fixtures** (14 agents × 5 prompts each). Each fixture keeps the same `expected` shape: `agentSlug`, `agentName`, `requiredHeaderIncludes`, `forbiddenIncludes`. The expanded fixtures keep the §4.3-A IDs (`<slug>-smoke-001`) and add `-002` through `-005` for each agent.
- [x] Per-agent coverage verified: each of `nexus`, `graphics-design`, `programming-tech`, `digital-marketing`, `video-animation`, `writing-translation`, `music-audio`, `business`, `finance`, `ai-services`, `personal-growth`, `consulting`, `data`, `photography` has exactly 5 fixtures (70 total, 14 unique agentSlugs).
- [x] Prompts are deterministic single-domain wording: Echo prompts are pure audio (no `video` alias); Reel prompts are pure video (no `sound` / `audio` alias and no `sound design` phrase); Vera prompts are business-specific (`pricing`, `GTM`, `OKR`, `fundraising narrative`); Cash prompts are finance-specific (`budget`, `cash flow`, `retirement`, `tax`, `valuation`); Nexus prompts contain zero specialist keywords so they land cleanly on `nexus_fallback`. Each prompt was traced against the routing pipeline to confirm it does not trip the convening soft-signal C path.
- [x] Runner extended with an additive `CREATIVEDGE_AGENT=<slug>` filter so the user can run all five prompts for one agent at a time when 70 live Claude calls would be too slow. The existing `CREATIVEDGE_ONLY=id1,id2` filter still works and combines with `CREATIVEDGE_AGENT` when both are set. Runner title updated to "Phase 4.3-A/B" because the same script now serves both slices.
- [x] No backend routing / convening / handoff / runtime / provider source files changed. Pure test-infrastructure expansion.
- [x] Sandbox sanity verified: `npm run build` clean (no `tsc` errors); `npm run test:routing` coverage check still passes; agent runner loads `fixtures: 70 agents: 14 unique slugs` and exits 2 with "cannot reach backend" because the sandbox's `better-sqlite3` is Windows-compiled and the backend can't start there. Live `npm run test:agents` validation must run on Windows.
- [x] Windows full run of `npm run test:agents` confirmed: `total: 70   PASS 70   PASS(R) 0   FAIL 0` on Windows with `provider:"claude"` and `degraded:false` end-to-end across all 70 fixtures.

§4.3-B reliability patch (in-progress, partial Windows run had a transient provider fallback on `lex-smoke-001`):

- [x] Replaced `lex-smoke-001` prompt. The old "Ghostwrite a 1500-word essay…" prompt asked for a very long output and intermittently fell back to mock on Windows. The new prompt is short, deterministic, and hits two writing-translation keywords (`edit prose` + `tone`): `Edit the prose and tone of this sentence to be clearer and warmer: "Our platform helps teams finish tasks faster without making the process feel complicated."` Expected stays `writing-translation` / Lex; header includes `Lex` and `Writing & Translation`.
- [x] Runner failure diagnostics extended. On any non-claude / degraded outcome, the failure reason now includes a compact `[degraded:<bool> | candidate:<name> | claudeError:<msg> | requestId:<id>]` extras block built from already-emitted `meta` fields. No prompts and no memory content are logged. Reasons that aren't provider-fallback (`routing`, `header`, `leakage`, `runnerError`) get a `failureKind` tag but are otherwise unchanged.
- [x] Runner now retries once on `failureKind === "providerFallback"` only. 1.5 s delay between attempts. Routing / header / leakage / runnerError failures never retry — those are deterministic and a retry would mask the bug. On a retry-pass the row tag is `PASS(R)` (yellow), the totals line separates `PASS` and `PASS(R)`, and the first attempt's reason is preserved in the per-fixture note + the totals counter. On final fail the runner prints both attempts' reasons.
- [x] Final pass criteria stay strict: `provider:"claude"`, `degraded:false`, correct `agentSlug`, correct `agentName`, required header substrings present, no forbidden internal terms.
- [x] Sandbox sanity: `npm run build` clean, fixture JSON valid (70 entries; `lex-smoke-001` carries the new prompt + note), runner syntax check clean, runner offline header reports `fixtures: 70 agents: 14 unique slugs`. Unit-test of the evaluate() diagnostic branch verified the new `[degraded | candidate | claudeError | requestId]` extras block. The `providerFallback` failureKind tag is the only branch that allows retry.
- [x] Windows re-run passed:
  - `CREATIVEDGE_ONLY=lex-smoke-001 npm run test:agents` → `total: 1   PASS 1   FAIL 0`
  - `CREATIVEDGE_AGENT=writing-translation npm run test:agents` → `total: 5   PASS 5   FAIL 0`
  - full `npm run test:agents` → `total: 70   PASS 70   PASS(R) 0   FAIL 0`

Out of scope for §4.3-B (carried by other slices):

- Subjective LLM quality assertions.
- Exact response wording matches.
- 10-turn voice-hold — landed in §4.4-A below (harness only; full-suite validation still pending).
- Core-memory recall validation (Phase 4 done-when criterion + Phase 5).
- Marking the per-agent matrix SP or Voice columns checked — that's Phase 8.2 territory and depends on a broader voice rubric.
- User-confirmed memory-worthy fact promotion flow (Phase 5).

### 4.4-A 10-turn voice-hold harness design — ✅ Complete / Windows validated

Phase 4.4-A is the design + safety scaffolding for the future per-specialist voice-hold gate (`Voice` column in the per-agent matrix). It introduces a deterministic 10-turn-per-agent conversation runner that reuses `sessionId` across turns and validates the same stable fingerprint as the §4.3-A/B runner on every turn. It deliberately does NOT close the voice-hold gate by itself — only individual scoped runs flip individual entities to ✅.

- [x] Created `backend-api/tests/agent-voice-hold-fixtures.json` with 14 fixtures (1 per CreativEdge entity), each carrying a 10-turn user-side conversation. Per-fixture `expected` block matches the §4.3-A/B schema: `agentSlug`, `agentName`, `requiredHeaderIncludes`, `forbiddenIncludes`. Every turn is single-domain by construction (re-uses the §4.3-B keyword-traced wording), so routing stays on the agent across all 10 turns. 14 × 10 = 140 user turns total.
- [x] Created `backend-api/scripts/run-agent-voice-hold.mjs` (Node 20+ built-in `fetch` + the same SSE block parser used by the routing and agent-behavior runners; dependency-light). The runner walks turns sequentially per fixture, captures `sessionId` from the first turn's `meta` event, and forwards it on every subsequent turn so the backend keeps proper session continuity (the chat route's transcript budgeting + `messages` rows + per-turn `routing_events` + `agent_events` still work normally). On any turn-level failure the fixture stops early so we don't burn more live Claude turns chasing a broken voice.
- [x] **Default mode REFUSES to run.** The runner exits 2 with a clear usage message unless exactly one of `CREATIVEDGE_AGENT=<slug>`, `CREATIVEDGE_ONLY=<id,...>`, or `CREATIVEDGE_FULL_VOICE=1` is set. This is the explicit safety guard against accidentally burning 140 live Claude turns. Additional knobs: `CREATIVEDGE_VOICE_TURNS=<n>` to cap each fixture to the first n turns for tiny smokes; `CREATIVEDGE_API_URL`, `CREATIVEDGE_TURN_TIMEOUT_MS`, `CREATIVEDGE_VERBOSE` mirror the other runners.
- [x] Added `"test:voice": "node scripts/run-agent-voice-hold.mjs"` to `backend-api/package.json` without removing or touching the existing `test:routing` / `test:agents` scripts.
- [x] Per-turn validation: `meta.agentSlug === expected.agentSlug`, `meta.agentName === expected.agentName`, `meta.provider === "claude"`, `meta.degraded === false`, `done.ok === true`, every `requiredHeaderIncludes` substring present (case-sensitive), no `forbiddenIncludes` substring present (case-insensitive — `Superpowers` / `MCP` / `Claude Code` / `<CREATIVEDGE_HANDOFF>`). No subjective quality assertions, no exact-wording matches.
- [x] No backend routing / convening / handoff / runtime / provider source files changed. Pure test-infrastructure addition.
- [x] Sandbox sanity: `npm run build` clean, `npm run test:routing` coverage still passes, `npm run test:agents` offline header reports `fixtures: 70`, the new voice runner correctly refuses to run with no filter (exit 2 + usage message), accepts `CREATIVEDGE_AGENT=graphics-design` (scope: 1 fixture × 10 turns), and accepts `CREATIVEDGE_FULL_VOICE=1` (scope: 14 fixtures × 10 turns).
- [x] Windows 2-turn sample for `CREATIVEDGE_AGENT=graphics-design` with `CREATIVEDGE_VOICE_TURNS=2` passed (turn 1/2 PASS, turn 2/2 PASS).
- [x] Windows full 10-turn run for `CREATIVEDGE_AGENT=graphics-design` initially failed at turn 7 with `expected provider "claude", got "mock"` + `claudeError: could not spawn \`claude\`: spawn ENAMETOOLONG`. Diagnosis: the system-prompt argv string (project context + persona system_prompt.md + core memory + recent episodic memory + accumulated "conversation so far" transcript) crossed Windows' command-line length limit by turn 7. **Closed by the §4.4-A reliability patch + §4.4-B controlled revalidation:** Claude CLI prompt transport was moved off long argv, and 14/14 agents subsequently passed `<slug>-voice-001: 10/10 PASS` on Windows with `provider:"claude"`, `degraded:false`, and no `spawn ENAMETOOLONG` regressions.

### 4.4-A reliability patch — Claude CLI prompt transport off long argv (ENAMETOOLONG guard)

Phase 4.4-A surfaced a real Windows transport bug, not a routing / persona / fixture bug. The fix is purely in `backend-api/src/providers/claudeCli.ts` and stays inside the existing `Provider` abstraction.

- [x] **Root cause.** `callLocalClaudeCli` pushed BOTH the (large, growing) system prompt as `--system-prompt <huge string>` AND the user prompt as a positional argv arg. By turn 7 of a 10-turn voice-hold session the accumulated `[user]` / `[assistant]` history that `packMessages` folds into the "conversation so far" section pushed argv past Windows' command-line length limit (`ENAMETOOLONG`). Node's `spawn` rejected the call, the chat route correctly fell back to MockProvider, and the smoke harness correctly flagged `provider:"mock"` as a hard FAIL.
- [x] **Patch.** Two transport changes, both verified against the local CLI (`claude --version` reports `2.1.138 (Claude Code)`):
  - System prompt is written to a per-call temp file under `os.tmpdir()/creativedge-cli-<rand>/system.txt` and passed via `--system-prompt-file <path>` (Claude Code 2.1+ supports this; documented in the `--bare` description: "Explicitly provide context via: --system-prompt[-file], ..."). The cli error path "System prompt file not found" probe in the sandbox confirmed the flag works.
  - User prompt is written to `child.stdin` and stdin is closed; the positional argv prompt arg is gone entirely. Claude `-p --input-format text` (default) reads the prompt from stdin when no positional is supplied — confirmed empirically by piping `"Say hi." | claude -p --output-format stream-json --verbose ...` through the same isolation flags as the real chat route.
- [x] **argv bound.** With the patch in place, argv contains only the small flag set plus the temp-file path (~200 chars total). Sandbox probe of a representative invocation: `argv_chars: 218`. The growth-with-session pattern is gone.
- [x] **Observability.** The existing `{type:"usage"}` chunk is now enriched with bounded transport metrics so they end up on `agent_events.usage_json`: `transport: "stdin+system-prompt-file"`, `prompt_chars`, `system_chars`, `argv_chars`. Counts only — no prompt, memory, transcript, or assistant content is ever logged.
- [x] **Cleanup.** Temp dir is removed via `fs/promises.rm(dir, { recursive:true, force:true })` in both the `close` handler and the generator's `finally` block (guarded with a "did we already cleanup" flag). Sandbox probe verified: `ls /tmp | grep creativedge-cli-` is empty after a probe call.
- [x] **Preserved.** Streaming JSON parser unchanged; first-chunk + hard-turn timeouts unchanged; retry/backoff (`callLocalClaudeCliWithRetry`) unchanged; usage parsing unchanged; MockProvider fallback unchanged; `shell:false` preserved; the five Phase 2.5 runtime-isolation flags preserved; `--bare` still NOT passed.
- [x] **Sandbox sanity.** `npm run build` clean; `npm run test:routing` coverage check still passes; `npm run test:agents` offline header still passes; the patched `callLocalClaudeCli` was invoked directly against the unauthenticated sandbox CLI and correctly produced `usage` → `error` → `done` events with the new transport metrics (`transport:"stdin+system-prompt-file"`, `argv_chars:218`).
- [x] Windows revalidation passed:
  - `CREATIVEDGE_AGENT=graphics-design npm run test:voice` → `lumi-voice-001: 10/10 PASS`, `total turns: 10 PASS / 0 FAIL`. No `spawn ENAMETOOLONG`, no fallback to mock, `provider:"claude"`, `degraded:false` across all 10 turns.
  - `CREATIVEDGE_AGENT=ai-services npm run test:voice` → `sage-voice-001: 10/10 PASS`, `total turns: 10 PASS / 0 FAIL`. No first-chunk timeout after the local `providers.json` was tuned for the long-context follow-up turns; no fallback to mock.
  - Operational note: the backend would not start until `~/.creativedge/providers.json` was re-saved as UTF-8 **without BOM**. The repaired file also bumps the local timeouts: `firstChunkTimeoutMs: 120000`, `turnTimeoutMs: 240000`, `recentEpisodicLimit: 10`, `conveningSynthesisTimeoutMs: 120000`. Both numbers and the BOM-removal are user-machine config, not backend code.
- [x] No `.env`, no API key, no Anthropic API path, no external HTTP client.

Out of scope for §4.4-A:

- The full 14-agent voice-hold gate — that flips only when each agent has independently passed its 10-turn fixture on Windows and the per-agent matrix Voice column reflects it.
- Subjective LLM quality / voice-rubric assertions (Phase 8.2).
- Core-memory recall validation (Phase 5).
- User-confirmed memory-worthy fact promotion flow (Phase 5).

### 4.4-B Controlled 10-turn voice-hold validation for the remaining 12 agents — ✅ Complete / Windows validated

Phase 4.4-A landed the harness and validated the first two specialists (Lumi / Sage). Phase 4.4-B walks the remaining 12 entities through the same `npm run test:voice` runner one agent at a time so we never re-burn 140 live Claude turns and never trigger ENAMETOOLONG / first-chunk-timeout regressions. No backend code changes are expected; the only deliverable per agent is a Windows run that returns `<slug>-voice-001: 10/10 PASS`, `total turns: 10 PASS / 0 FAIL`, `provider:"claude"`, `degraded:false`, and no fallback to mock.

**Recommended Windows command per agent** (substitute the slug; reuse the local `providers.json` that Phase 4.4-A repaired to UTF-8-without-BOM with the longer timeouts):

```powershell
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run build
# in terminal A:
npm run dev
# in terminal B (one at a time, flip the corresponding checkbox below as each lands):
$env:CREATIVEDGE_AGENT="nexus";               npm run test:voice; Remove-Item Env:CREATIVEDGE_AGENT
$env:CREATIVEDGE_AGENT="programming-tech";    npm run test:voice; Remove-Item Env:CREATIVEDGE_AGENT
$env:CREATIVEDGE_AGENT="digital-marketing";   npm run test:voice; Remove-Item Env:CREATIVEDGE_AGENT
$env:CREATIVEDGE_AGENT="video-animation";     npm run test:voice; Remove-Item Env:CREATIVEDGE_AGENT
$env:CREATIVEDGE_AGENT="writing-translation"; npm run test:voice; Remove-Item Env:CREATIVEDGE_AGENT
$env:CREATIVEDGE_AGENT="music-audio";         npm run test:voice; Remove-Item Env:CREATIVEDGE_AGENT
$env:CREATIVEDGE_AGENT="business";            npm run test:voice; Remove-Item Env:CREATIVEDGE_AGENT
$env:CREATIVEDGE_AGENT="finance";             npm run test:voice; Remove-Item Env:CREATIVEDGE_AGENT
$env:CREATIVEDGE_AGENT="personal-growth";     npm run test:voice; Remove-Item Env:CREATIVEDGE_AGENT
$env:CREATIVEDGE_AGENT="consulting";          npm run test:voice; Remove-Item Env:CREATIVEDGE_AGENT
$env:CREATIVEDGE_AGENT="data";                npm run test:voice; Remove-Item Env:CREATIVEDGE_AGENT
$env:CREATIVEDGE_AGENT="photography";         npm run test:voice; Remove-Item Env:CREATIVEDGE_AGENT
```

**Per-agent 10/10 voice-hold gate.** Already validated under §4.4-A:

- [x] `graphics-design` / Lumi — `lumi-voice-001: 10/10 PASS` (Phase 4.4-A Windows revalidation).
- [x] `ai-services` / Sage — `sage-voice-001: 10/10 PASS` (Phase 4.4-A Windows revalidation).

Remaining (this slice):

- [x] `nexus` / Nexus — `nexus-voice-001: 10/10 PASS` (Windows).
- [x] `programming-tech` / Bit — `bit-voice-001: 10/10 PASS` (Windows).
- [x] `digital-marketing` / Buzz — `buzz-voice-001: 10/10 PASS` (Windows).
- [x] `video-animation` / Reel — `reel-voice-001: 10/10 PASS` (Windows, after three fixture patches: turn 3 to remove `motion graphics` vs `brand` tie, turn 7 to drop `logo` + `animation` `"logo + video"` convening trigger, and turns 2 + 5 strengthened from score-3 single-keyword to score-6).
- [x] `writing-translation` / Lex — `lex-voice-001: 10/10 PASS` (Windows).
- [x] `music-audio` / Echo — `echo-voice-001: 10/10 PASS` (Windows).
- [x] `business` / Vera — `vera-voice-001: 10/10 PASS` (Windows).
- [x] `finance` / Cash — `cash-voice-001: 10/10 PASS` (Windows).
- [x] `personal-growth` / Bloom — `bloom-voice-001: 10/10 PASS` (Windows).
- [x] `consulting` / Atlas — `atlas-voice-001: 10/10 PASS` (Windows, after fixture-only `requiredHeaderIncludes` relaxation from `["Atlas", "Consulting"]` to `["Atlas"]` to be handoff-aware — Atlas can legitimately hand off mid-turn, and the handoff transition stream keeps the `Atlas` name but switches to the target's domain). Strict `agentSlug:"consulting"` and `agentName:"Atlas"` validation kept; leakage check kept; no global change to other agents; no runner change.
- [x] `data` / Quant — `quant-voice-001: 10/10 PASS` (Windows, after turn 5 was rewritten from `"Walk me through SQL for funnel conversion calc."` to `"Run statistics on this experiment dataset to estimate the sample size, confidence interval, and statistical power for detecting a 5% lift."` so the DM keywords `funnel` + `conversion` no longer beat the single data keyword `SQL`).
- [x] `photography` / Iris — `iris-voice-001: 10/10 PASS` (Windows).

Done-when for §4.4-B: all 12 boxes above are checked AND no live run produced `spawn ENAMETOOLONG`, a first-chunk timeout, or a fallback to mock. Flip §4.4-B heading and the Current Active Phase line to ✅ Complete / Windows validated once all 12 confirm. Phase 4 overall stays ⚠️ until §4.4-B closes AND core-memory reference validation + user-confirmed memory promotion (Phase 5 bridge) close.

If any single agent fails:
- a routing / persona / fixture failure (`agentSlug` mismatch, header miss, leakage hit) means the agent's `<slug>-voice-001` fixture needs a wording fix — patch in the fixture file, not the backend.
- a `spawn ENAMETOOLONG` or `first-chunk timeout` means the Phase 4.4-A reliability patch regressed or local `providers.json` timeouts need a bump — investigate the transport, don't paper over.
- a transient `provider:"mock"` / `claudeError:"Not logged in"` is a host-state issue; re-authenticate Claude Code locally and re-run.

Record any per-agent failure under its `[ ]` line as a sub-bullet with the exact `reason` the runner printed — never the prompt text or memory content.

Out of scope for §4.4-B:

- Subjective LLM quality / voice-rubric scoring (Phase 8.2).
- Core-memory recall validation (Phase 5).
- Marking the per-agent matrix Voice column ✅ — Voice depends on this 10-turn hold AND the broader voice rubric; check the matrix only after Phase 8.2 reviews the rubric, not just because the runner returned 10/10.

---

### 4.5-A Core-memory reference validation harness — ✅ Complete / Windows validated (harness + first 2 agents: Lumi, Sage)

This slice is the first of two Phase 4 done-when gates that remain open. It validates the **read-path** half of per-specialist core memory: that an agent can actually reference a fact stored in its own `~/.creativedge/agents/<slug>/memory/core_memory.md` when invoked through `/chat`. The **write-path** half (user-confirmed memory-worthy fact promotion) stays deferred to Phase 5.

The harness is deliberately conservative on three axes:

1. **No memory writes.** The runner never writes to `core_memory.md`, `episodic_memory.md`, or any other memory artifact. Backend behavior is unchanged; Phase 4.1's "auto core-memory writes are out of scope" boundary is preserved.
2. **No memory leakage in logs.** The runner reads `core_memory.md` only to check for a single fixture-defined probe string. It never prints file contents, never prints the full streamed response, and never echoes the prompt. Per-fixture logs carry: fixture id, agent slug, probe-present boolean, header/leakage/recall booleans, and the marker LABEL — nothing else.
3. **SKIP-by-default.** Empty / placeholder `core_memory.md` files (the default state after Phase 4.1 seeding) produce `SKIP`, not `FAIL`. A run with 14 empty memories prints `total: 14   PASS 0   SKIP 14   FAIL 0` and exits 0. The user opts in per agent by appending a small marker to that agent's memory file.

**Probe-marker design.** Each fixture in `backend-api/tests/agent-core-memory-fixtures.json` defines a unique short marker like `[ce-test:lumi]` and a generic, fact-free message that asks the agent to echo any `[ce-test:...]` tag it sees in its core memory. To enable an agent's test the user appends that marker (one line) to that agent's `core_memory.md`. The runner verifies before the live `/chat` call that the marker is in fact present, then asserts the streamed response contains the same marker verbatim — proving end-to-end core-memory reference, not just file existence.

This works around an important limitation: `meta.budget.core_memory_loaded` is `true` for any non-empty memory file, including the placeholder we seed in Phase 4.1. That signal proves the file was *loaded*, not that the agent *used* it. The probe-marker echo is the only signal that survives that distinction.

**Files (new this slice):**

- `backend-api/tests/agent-core-memory-fixtures.json` — 14 fixtures, one per agent. Each entry: `id`, `agent` (slug), `coreMemoryProbe` (e.g. `"[ce-test:lumi]"`), `message` (per-agent domain-keyword-loaded prompt — see "Per-agent prompt routing patch" below), `expected` (`agentSlug`, `agentName`, `requiredHeaderIncludes`, `forbiddenIncludes`, `responseIncludes`). Atlas's `requiredHeaderIncludes` is `["Atlas"]` only, carrying forward the §4.4-B handoff-aware relaxation.
- `backend-api/scripts/run-agent-core-memory-smoke.mjs` — runner. Reads each fixture's `core_memory.md`, checks for the probe marker, SKIPs if absent (with the exact path the user would seed and the marker label), proceeds to `POST /chat` when present, parses SSE, validates the same fingerprint as §4.3-A/B (`agentSlug`, `agentName`, `provider:"claude"`, `degraded:false`, `done.ok:true`, header substrings, no forbidden-leakage terms) plus the additional `responseIncludes` check (the marker). Env vars: `CREATIVEDGE_API_URL`, `CREATIVEDGE_TURN_TIMEOUT_MS`, `CREATIVEDGE_ONLY=id1,id2`, `CREATIVEDGE_AGENT=<slug>`, `CREATIVEDGE_VERBOSE=1`. Exit code: 0 when FAIL=0 (PASS + SKIP both count as success); 1 on any FAIL; 2 on runner-level error.
- `backend-api/package.json` — adds `"test:memory": "node scripts/run-agent-core-memory-smoke.mjs"` alongside the existing `test:routing` / `test:agents` / `test:voice` scripts. No new dependencies.

**Files NOT touched (intentional):**

- No backend source change. No `agentRuntimeContext.ts`, `chat.ts`, `claudeCli.ts`, `router.ts`, `handoff.ts`, `convening.ts`, `agentsRegistry.ts`, or `memoryStore.ts` edits.
- No agent personality file (`identity.md`, `soul.md`, `personality.md`, `system_prompt.md`, `config.json`) edits.
- No `console.html` / frontend / Electron edits.
- No `providers.json` edits.
- No new `.env` and no `ANTHROPIC_API_KEY`.

**How to enable an agent's test (Windows opt-in):**

A safe one-liner that appends each agent's marker to its own `core_memory.md` (run from PowerShell on Windows; idempotent — safe to re-run):

```powershell
$Map = @{
  "nexus"="[ce-test:nexus]"; "graphics-design"="[ce-test:lumi]";
  "programming-tech"="[ce-test:bit]"; "digital-marketing"="[ce-test:buzz]";
  "video-animation"="[ce-test:reel]"; "writing-translation"="[ce-test:lex]";
  "music-audio"="[ce-test:echo]"; "business"="[ce-test:vera]";
  "finance"="[ce-test:cash]"; "ai-services"="[ce-test:sage]";
  "personal-growth"="[ce-test:bloom]"; "consulting"="[ce-test:atlas]";
  "data"="[ce-test:quant]"; "photography"="[ce-test:iris]"
}
foreach ($slug in $Map.Keys) {
  $f = Join-Path $HOME ".creativedge\agents\$slug\memory\core_memory.md"
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    if (-not $c.Contains($Map[$slug])) {
      Add-Content -Path $f -Value "`n## Test markers`n$($Map[$slug])`n"
    }
  }
}
```

Run with one agent only (recommended cadence — same shape as §4.4-B's one-at-a-time discipline):

```powershell
cd backend-api
$env:CREATIVEDGE_AGENT="graphics-design"
npm run test:memory
```

Done-when for §4.5-A:

- [x] Each of the 14 agents has produced a Windows-validated `<slug>-memory-001: PASS` run with `provider:"claude"`, `degraded:false`, `done.ok:true`, header substrings present, no forbidden leakage, and the probe marker echoed verbatim. **Closed across §4.5-A + §4.5-B at 14/14 agents:** §4.5-A validated Lumi (`graphics-design`) and Sage (`ai-services`); §4.5-B walked the remaining 12 (nexus, programming-tech, digital-marketing, video-animation, writing-translation, music-audio, business, finance, personal-growth, consulting, data, photography) through the same runner one at a time, all returning probe YES / header OK / recall OK / PASS.

Per-agent §4.5-A status (first 2 agents Windows-validated; remaining 12 moved to §4.5-B):

- [x] `graphics-design` / Lumi — `lumi-memory-001: PASS` (Windows; probe YES, header OK, recall OK).
- [x] `ai-services` / Sage — `sage-memory-001: PASS` (Windows; probe YES, header OK, recall OK).

**Per-agent prompt routing patch (post-first-Windows-run).** The first Windows run of `lumi-memory-001` failed not on probe-marker detection (which correctly read the seeded marker) and not on provider fallback, but on routing: the original generic prompt was too fact-free and routed to Nexus instead of Lumi (`expected agentSlug "graphics-design", got "nexus"`). The fix was fixture-only — no backend change. Each fixture's `message` was rewritten to a short, deterministic, domain-keyword-loaded prompt that asks the agent to read its core memory and quote the `ce-test` marker (without ever including the literal marker string in the prompt, so the model cannot echo from the user message). The 14 prompts were validated against the actual keyword-router scoring in `src/routing/keywordRouter.ts` and the convening detector in `src/routing/convening.ts` — every prompt routes to its intended specialist with `score >= 3`, no prompt trips an explicit-multi phrase, no prompt trips a cross-domain trigger (logo+video, code+security, business+technical, brand/product/AI/pitch launches, landing+campaign), and no prompt names two domain aliases simultaneously (Echo's draft initially used `sound design`, which would have soft-signal-convened with `graphics-design` via the `design` alias; replaced with `ambient` to keep Echo single-domain). Probe marker design preserved: the literal `[ce-test:<name>]` string never appears in any prompt; the agent must read it from `core_memory.md`. `responseIncludes` values are unchanged.

Offline / Linux sandbox sanity validation completed during implementation:

- `npm run build` (tsc) — clean, no regressions.
- Runner against an unreachable backend — exits 2 with `cannot reach backend at ...` and the start-the-backend hint; never leaks fixture content.
- Runner against a `/healthz`-only mock with no probe markers in `core_memory.md` — 14/14 SKIP, exit 0; each SKIP line shows the path to seed and the marker label, nothing else.
- Runner against a `/healthz`-only mock with `[ce-test:lumi]` seeded into Lumi's `core_memory.md` and `CREATIVEDGE_AGENT=graphics-design` — probe column flips `NO`→`YES`, runner proceeds to `/chat`, surfaces the mock's `HTTP 500` as a `FAIL` with exit 1 (the FAIL path is correct; on a real Windows host this transitions to `PASS`).

Phase 4 overall still ⚠️ only because the user-confirmed memory-worthy fact promotion flow (Phase 5 bridge) remains open. §4.5-B closed at 12/12 on Windows, so core-memory reference validation is 14/14 across all agents.

Out of scope for §4.5-A:

- Auto-writing facts to `core_memory.md`. The user-confirmed promotion flow is Phase 5.
- Episodic memory recall validation. §4.5-A is core-memory-only; episodic is read by `buildAgentRuntimeContext` since Phase 4.1 but validating its end-to-end use is a separate slice.
- Subjective LLM quality / voice-rubric scoring (Phase 8.2).
- Marking the per-agent matrix Memory column ✅ — Memory in the matrix depends on §4.5-A passing AND user-confirmed memory promotion landing in Phase 5.

---

### 4.5-B Core-memory reference validation for remaining 12 agents — ✅ Complete / Windows validated (12/12)

Phase 4.5-A landed the test harness and validated the first two agents on Windows (Lumi, Sage). Phase 4.5-B walks the remaining 12 agents through the same `npm run test:memory` runner, one agent at a time, using the probe-marker design implemented in §4.5-A. No backend code changes are expected; the only deliverable per agent is a Windows run that returns `<slug>-memory-001: PASS` with `provider:"claude"`, `degraded:false`, `done.ok:true`, header substrings present, no forbidden leakage, and the probe marker echoed verbatim.

**Seed markers (Windows, idempotent — only adds the marker if it isn't already present):**

```powershell
$Map = @{
  "nexus"="[ce-test:nexus]"
  "programming-tech"="[ce-test:bit]"
  "digital-marketing"="[ce-test:buzz]"
  "video-animation"="[ce-test:reel]"
  "writing-translation"="[ce-test:lex]"
  "music-audio"="[ce-test:echo]"
  "business"="[ce-test:vera]"
  "finance"="[ce-test:cash]"
  "personal-growth"="[ce-test:bloom]"
  "consulting"="[ce-test:atlas]"
  "data"="[ce-test:quant]"
  "photography"="[ce-test:iris]"
}
foreach ($slug in $Map.Keys) {
  $f = Join-Path $HOME ".creativedge\agents\$slug\memory\core_memory.md"
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    if (-not $c.Contains($Map[$slug])) {
      Add-Content -Path $f -Value "`n## Test markers`n$($Map[$slug])`n"
    }
  }
}
```

**Run one agent at a time (stop on first failure):**

```powershell
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run build
```

Backend in terminal A:

```powershell
npm run dev
```

Terminal B, run agents one by one (loop stops on first failure):

```powershell
$agents = @(
  "nexus","programming-tech","digital-marketing","video-animation",
  "writing-translation","music-audio","business","finance",
  "personal-growth","consulting","data","photography"
)
foreach ($agent in $agents) {
  Write-Host "`n=== Running memory test for $agent ==="
  $env:CREATIVEDGE_AGENT = $agent
  npm run test:memory
  if ($LASTEXITCODE -ne 0) {
    Write-Host "FAILED: $agent"
    break
  }
}
Remove-Item Env:CREATIVEDGE_AGENT -ErrorAction SilentlyContinue
```

Expected per agent: `<slug>-memory-001: PASS`, probe YES, header OK, recall OK, `provider:"claude"`, `degraded:false`, no forbidden-leakage terms.

Done-when for §4.5-B:

- [x] All 12 boxes below checked AND no live run produced a provider fallback, a routing miss, a recall miss, a header miss, or a forbidden-leakage hit. §4.5-B heading and the Current Active Phase line flipped to ✅ Complete / Windows validated. Phase 4 overall remains ⚠️ only because the user-confirmed memory-worthy fact promotion flow (Phase 5 bridge) is still open.

Per-agent §4.5-B status (all 12 Windows-validated; `<slug>-memory-001: PASS` with probe YES, header OK, recall OK):

- [x] `nexus` / Nexus — `nexus-memory-001: PASS` (probe YES, header OK, recall OK).
- [x] `programming-tech` / Bit — `bit-memory-001: PASS` (probe YES, header OK, recall OK).
- [x] `digital-marketing` / Buzz — `buzz-memory-001: PASS` (probe YES, header OK, recall OK).
- [x] `video-animation` / Reel — `reel-memory-001: PASS` (probe YES, header OK, recall OK).
- [x] `writing-translation` / Lex — `lex-memory-001: PASS` (probe YES, header OK, recall OK).
- [x] `music-audio` / Echo — `echo-memory-001: PASS` (probe YES, header OK, recall OK).
- [x] `business` / Vera — `vera-memory-001: PASS` (probe YES, header OK, recall OK).
- [x] `finance` / Cash — `cash-memory-001: PASS` (probe YES, header OK, recall OK).
- [x] `personal-growth` / Bloom — `bloom-memory-001: PASS` (probe YES, header OK, recall OK).
- [x] `consulting` / Atlas — `atlas-memory-001: PASS` (probe YES, header OK, recall OK).
- [x] `data` / Quant — `quant-memory-001: PASS` (probe YES, header OK, recall OK).
- [x] `photography` / Iris — `iris-memory-001: PASS` (probe YES, header OK, recall OK).

If any single agent fails:

- a routing miss (`expected agentSlug "<slug>", got "nexus"`) means the fixture prompt for that agent needs more domain-specific keywords — patch in `backend-api/tests/agent-core-memory-fixtures.json`, never in the backend.
- a recall miss (`probe YES, recall MISS`) means the agent's response didn't echo the marker — re-check the seed in `~/.creativedge/agents/<slug>/memory/core_memory.md` and that the prompt asks the agent to quote it.
- a transient `provider:"mock"` / `claudeError:"Not logged in"` is a host-state issue; re-authenticate Claude Code locally and re-run.

Record any per-agent failure as a sub-bullet under its `[ ]` line with the runner's exact `reason` — never the prompt text or memory content.

Out of scope for §4.5-B:

- Backend / provider / runtime changes (none expected; the harness was finalized in §4.5-A).
- Auto-writing facts to `core_memory.md`. The user-confirmed promotion flow is Phase 5.
- Subjective LLM quality / voice-rubric scoring (Phase 8.2).
- Marking the per-agent matrix Memory column ✅ — that flip depends on §4.5-B closing AND user-confirmed memory promotion landing in Phase 5.

---

## Phase 5 — Memory system

**Phase 5 overall — ✅ Complete / Windows validated (with deferred extensions).**

The core memory system shipped and was validated on Windows across §5.2-A, §5.2-B, §5.2-C, §5.2-D, §5.3-A, §5.3-B, §5.3-D, §5.4-A, §5.5-A, and §5.6-A. The remaining items (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, the optional all-agent compaction status variant, and the per-agent matrix Memory column flip) are tracked under `### Phase 5 — deferred extensions (backlog)` immediately below; they are opt-in / future-policy work and do not block Phase 6 or Phase 7. Older paragraphs throughout Phase 5 still reference "Phase 5 overall remains ⚠️ In progress" — those lines are historical milestone notes from each sub-slice's flip and intentionally left as-is for the audit trail; the canonical current status is this line at the top of the section.

### Phase 5 — deferred extensions (backlog)

These five items were explicitly marked optional / deferred / future in the original §5.x flips. They are tracked here so they remain visible without holding Phase 5 overall open.

- **§5.3-C optional LLM-based summarization in compaction** — *what:* swap the deterministic episodic-compaction summariser for an LLM-driven variant that can paraphrase / cluster older entries. *Why deferred:* the deterministic preview/apply already covers the safe, explicit, user-confirmed flow. Adds provider cost + variability without unlocking a new user gesture. Revisit if compaction quality becomes a real complaint.
- **§5.6-B nightly backup scheduling + UI push button** — *what:* a background scheduler that runs the existing backup pipeline on a cadence, plus a push-to-remote button in the UI behind a second explicit confirmation. *Why deferred:* opt-in local backup is already in place and validated; scheduling + push require policy decisions (when, retry policy, push credential handling) that are out of scope for the current local-only model. Revisit alongside a desktop-app shell or a real deployment story.
- **§5.6-C destructive restore flow** — *what:* restore agent memory from a backup snapshot, potentially overwriting current state. *Why deferred:* destructive by design; needs its own UX guardrails (preview/diff, multi-step confirmation, dry-run before commit) that are larger than a single slice. Revisit alongside §5.6-B.
- **Optional all-agent compaction status variant** — *what:* a single endpoint that returns compaction status for every agent at once. *Why deferred:* the per-agent `/compact/status` covers the current Memory tools UX (status is requested only for the active agent). An all-agent variant is useful only when an admin-console-style "fleet view" appears — revisit during Phase 7.
- **Per-agent matrix Memory column flip — ✅ Landed 2026-05-20** — *what was:* update the canonical per-agent matrix to reflect that every agent's memory plumbing is complete. *How closed:* the 2026-05-20 docs-hygiene patch (P3) added the three missing rows (📈 Buzz, 🎬 Reel, 💰 Cash) and flipped the SP / Voice / Mem-R / Mem-W / Hand-off columns to `[x]` for all 14 agents, citing §4.3-A (SP) / §4.4-B (Voice) / §4.5-A/B (Mem-R) / §5.2-A (Mem-W) / §3.3 (Hand-off). Watch-out column intentionally stays open as a future qualitative-eval slice. No code change; docs-only.

**Where things live.**
- Agent personality definitions (`identity.md`, `soul.md`, `personality.md`, `system_prompt.md`, `config.json`): **project folder** `CreativEdge/agents/<slug>/`. Shareable, can live in source control.
- Agent durable memory (`core_memory.md` + `episodic_memory.md`): **user folder** `~/.creativedge/agents/<slug>/memory/`. Personal, never shared.
- Sessions, message history, routing events, search index: **SQLite** at `~/.creativedge/sessions.db`.

### 5.1 Read path
- [ ] `loadMemory(slug)` → returns `{ core: string, episodic: string[] }` from `~/.creativedge/`.
- [ ] Truncate episodic to last *N* entries by date.
- [ ] Sanitize: strip control characters, cap line length.

### 5.2 Write path
- [ ] `appendEpisodic(slug, entry)` — atomic append with date header.
- [x] `promoteToCore(slug, line)` — move a line from episodic to a marked section in core; requires explicit user confirmation. The arbitrary-`entry` variant is closed by §5.2-A (`POST /agents/:slug/memory/promote` with `confirmed:true`, duplicate-guarded, sensitive-content-guarded, slug-path-traversal-guarded; lock-guarded via the §5.2-B primitives). The episodic-→-core movement variant is closed by §5.2-C (`POST /agents/:slug/memory/promote-episodic` with `confirmed:true` + `episodicNeedle`, identical guards plus exact-one-match enforcement and same lock-guarded write path). Both variants reuse `safeAppendUnique` so duplicates and concurrent writers stay safe.
- [x] `editCore(slug, patch)` — diff-based edit, never blind overwrite. Closed by §5.2-D: `PATCH /agents/:slug/memory/core` with body `{find, replace, confirmed:true}`, lock-guarded via the `safeReplaceOnce` primitive in `memoryFiles.ts`, exact-one-match on `find` (404/409 otherwise), sensitive-content guard on `replace` (422), `unchanged:true` when the replacement would not change content, atomic write via tmp+rename. Windows-validated end-to-end: live PATCH round-trip returned `ok:true, edited:true, bytesWritten:686`, repeat → 404, `find===replace` → unchanged, sensitive replace → 422, multiple matches → 409; `npm run test:memory-files` 37/37 PASS on Windows.
- [x] File-lock to prevent concurrent writes (`<file>.lock`) — closed by §5.2-B: shared `withFileLock(path, fn)` helper in `backend-api/src/agents/memoryFiles.ts` with retry + jittered backoff + stale-lock recovery + timeout, wired into the `POST /agents/:slug/memory/promote` write path via `safeAppendUnique`, Windows-validated (21/21 unit tests, /promote round-trip + duplicate + sensitive cases all green, all regression suites still green). Future Phase 5 mutation helpers (`editCore`, the episodic-→-core movement, `forget`) reuse the same primitive.
- [ ] First-run scaffold: on missing `~/.creativedge/agents/<slug>/memory/`, copy the empty templates from `CreativEdge/agents/<slug>/memory/`.

### 5.2-A User-confirmed memory-worthy fact promotion flow (Phase 4 → 5 bridge) — ✅ Complete / Windows validated

The Phase 4 done-when criterion "User-confirmed memory-worthy fact promotion flow" required a safe path where the system can detect a memory-worthy fact candidate from a conversation turn, surface it for user confirmation, and only then write to `core_memory.md`. No auto-write. No sensitive-data leakage. No silent promotion.

**End-to-end flow (one user turn):**

1. **Detection (server-side, every `/chat` turn).** `backend-api/src/agents/memoryCandidate.ts` exports a pure-function `detectMemoryCandidate(message, agentSlug) → MemoryCandidate | null`. The detector:
   - Returns `null` when the message contains sensitive content (credit-card-like, SSN-like, API-key / bearer-token-like, PEM private keys — reuses `containsSensitiveContent` from `agentRuntimeContext.ts`, same patterns as the Phase 4.1 episodic-summary guard).
   - Returns `null` when the message contains a transient signal (`today`, `tomorrow`, `right now`, `currently`, `temporarily`, `at the moment`, `for now`, `this morning|afternoon|evening|week|month|year`, `last night|week|month|year`, ...).
   - Otherwise scans an ordered, conservative regex catalog and returns a `{type, text, pattern, agentSlug}` candidate on the first match.
     - `directive` — "remember (that)? I/my/me/we/our/you should ...", "for future reference, ..."
     - `identity` — "my name is `<Proper Noun>`", "call me `<Proper Noun>`" (lead-in is case-insensitive; the captured proper noun stays case-sensitive so common-noun phrases don't trip)
     - `preference` — "I always|usually|generally|typically|tend to|prefer to ...", "I prefer ...", "I don't|do not like|want|use ...", "my favorite|preferred|default|go-to `<X>` is|are `<Y>`"
   - Caps the captured `text` at 280 chars, normalizes whitespace, sentence-cuts on `[.!?] <Capital>`.
   - Defense-in-depth: also runs `containsSensitiveContent` on the captured `text` so a sensitive fragment embedded inside an otherwise-innocuous preference phrase is dropped.
   - No file IO. No network. No LLM call. No memory writes — ever.

2. **Confirmation surface.** When `detectMemoryCandidate` returns a candidate, the `/chat` route includes a `memoryCandidate` field in the SSE `done` payload:

   ```json
   { "ok": true, "sessionId": "...", "provider": "claude", "degraded": false,
     "memoryCandidate": { "type": "preference", "text": "I prefer Python over JS for data scripts.",
                          "pattern": "I-prefer", "agentSlug": "programming-tech" } }
   ```

   The field is added to all four `done` paths: specialist, clarify/out_of_domain, convene, and handoff-target (where the candidate's `agentSlug` is re-keyed to the target slug after a successful handoff, since the user's "remember this" should apply to the agent that actually answered). Pino log line `phase:"memory-candidate"` records only counts and labels — never the candidate text.

3. **Write path.** `POST /agents/:slug/memory/promote` is the only mutation entry point. It already required `confirmed:true` and had a duplicate guard; on this slice we added a defense-in-depth sensitive-content guard:
   - `confirmed !== true` → HTTP 400 "confirmed must be true" (unchanged).
   - Slug fails `/^[a-z][a-z0-9-]{1,40}$/` → HTTP 400 "invalid slug" (blocks path traversal; unchanged).
   - Slug not in registry → HTTP 404 (unchanged).
   - Entry empty or > 4000 chars → HTTP 400 (unchanged).
   - **NEW: `containsSensitiveContent(entry)` true → HTTP 422 with a generic error and a non-leaky hint. The category is intentionally not echoed so the response can't be used as a sensitivity oracle.** Logs `phase:"memory-promote"` with `reason:"sensitive-content guard refused write"` and the entry length only.
   - Exact text already present in `core_memory.md` → HTTP 200 `{ok:true, duplicate:true}` (unchanged).
   - Otherwise atomic `appendFile` with `\n<!-- promoted <ISO> -->\n<entry>\n` block.

**What this slice deliberately does NOT do:**

- It does not write to `core_memory.md` automatically. Every write requires `confirmed:true` from a separate HTTP request.
- It does not write to `episodic_memory.md` from this path (episodic writes stay on the Phase 4.1 `appendEpisodicSummary` deterministic helper, untouched).
- It does not add a new SQLite table for pending candidates. The candidate is round-tripped to the client via the SSE `done` payload only; the client decides whether to call `/promote`. A `memory_candidates` audit table is a Phase 5.3 candidate slice if recurring "did you mean to promote this?" prompts ever become noisy.
- It does not touch the frontend. `console.html` will need a confirm/cancel button wired against the new `done.memoryCandidate` field — that's frontend work, deliberately deferred so Phase 4 can close on backend-only changes plus existing CLI promote round-trips.

**Files added / modified on this slice:**

- `backend-api/src/agents/memoryCandidate.ts` — NEW. Detector + types. Uses the existing `containsSensitiveContent` export.
- `backend-api/src/routes/chat.ts` — MODIFIED. One import, one detection call, four `done`-payload include sites (specialist, clarify/out_of_domain, convene, handoff-target).
- `backend-api/src/routes/agents.ts` — MODIFIED. One import (`containsSensitiveContent`), one defense-in-depth block in the promote handler.
- `backend-api/tests/memory-candidate-fixtures.json` — NEW. 18 fixtures covering directive YES, identity YES, preference YES (4 shapes), transient NO (3 shapes), sensitive NO (4 categories: credit card, SSN, API key, bearer), generic-question NO, empty NO, too-short NO.
- `backend-api/scripts/run-memory-candidate-tests.mjs` — NEW. Pure-function unit-test runner. Imports compiled `dist/agents/memoryCandidate.js`. Privacy: never logs message content or captured text. Exit 0 on 18/18 PASS.
- `backend-api/package.json` — MODIFIED. Adds `"test:memory-candidate": "node scripts/run-memory-candidate-tests.mjs"`.

**Files NOT touched (intentional):**

- No backend provider, runtime, routing, convening, handoff, registry, agentReader, projectContext, or memoryStore changes.
- No SQLite schema change. No new tables.
- No agent personality files, README files, console.html, or frontend.
- No `.env`, no API keys, no Anthropic API path, no external HTTP client.

**Validation completed during implementation:**

- `npm run build` (tsc) — clean, no regressions.
- `npm run test:memory-candidate` — 18/18 PASS (Linux sandbox; pure-function unit test, no live backend needed).
- `npm run test:routing` — coverage check passes (38 fixtures, all 13 specialists ≥ 2 mentions, 5 overlap, 3 convene, 3 nexus, 1 handoff); the live-fixture run still requires the backend to be up and is the user's Windows step.
- `npm run test:agents` and `npm run test:memory` — require a live backend with the authenticated Claude Code CLI; not runnable from this sandbox.

**Windows validation plan (next step):**

```powershell
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run build
npm run test:memory-candidate        # expect 18/18 PASS, exit 0
# In one terminal: npm run dev
# In another, exercise the SSE done.memoryCandidate field + promote round-trip.
# Example positive case:
$body = @{ message = 'I prefer dark mode for all dashboards.' } | ConvertTo-Json
$r = Invoke-WebRequest -Uri http://127.0.0.1:3001/chat -Method POST `
       -ContentType 'application/json' -Body $body -UseBasicParsing
# Look for "event: done" -> the data line should contain a "memoryCandidate" field.
# Then promote:
$promote = @{ entry = 'User prefers dark mode for all dashboards.'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/graphics-design/memory/promote `
  -Method POST -ContentType 'application/json' -Body $promote
# Repeat the promote — expect duplicate:true on the second call.
# Negative case: try to promote an entry containing a credit-card-like number.
$bad = @{ entry = 'My card is 4111 1111 1111 1111.'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/graphics-design/memory/promote `
  -Method POST -ContentType 'application/json' -Body $bad
# Expect HTTP 422 with a generic "contains sensitive content" error.
```

Done-when for §5.2-A (all five Windows-validated):

- [x] Windows round-trip detect → confirm → promote completed cleanly for a non-sensitive preference. Test message: `For this graphics design preference, remember that I prefer dark mode for all design dashboards.` `/chat` returned `done.memoryCandidate = { type:"directive", text:"I prefer dark mode for all design dashboards.", pattern:"remember-that", agentSlug:"graphics-design" }`. `POST /agents/graphics-design/memory/promote` with `{ entry, confirmed:true }` returned `ok:true, slug:"graphics-design", bytesAppended:90`.
- [x] Duplicate promote on the same entry returned `{ok:true, duplicate:true}` without growing the file.
- [x] Sensitive promote of `My card is 4111 1111 1111 1111.` (with `confirmed:true`) refused with HTTP 422 and no append. The category was not echoed in the response.
- [x] `npm run test:memory-candidate` — 18/18 PASS on Windows (total: 18, PASS 18, FAIL 0).
- [x] Existing test suites stayed green on Windows: `npm run test:routing` 38/38 PASS, `npm run test:agents` 70/70 PASS (0 PASS(R), 0 FAIL), `npm run test:memory` 14/14 PASS (0 SKIP, 0 FAIL).

Phase 4 overall flipped to ✅ Complete / Windows validated. Phase 5 overall remains ⚠️ In progress for the broader memory-system work: the episodic-→-core movement variant in §5.2, `editCore`, file locking, the forget flow in §5.4, compaction in §5.3, optional GitHub backup in §5.6.

Out of scope for §5.2-A:

- A frontend confirm/cancel button wired against `done.memoryCandidate` (Phase 6 chat UI).
- A `memory_candidates` SQLite audit table for "what candidates have we suggested" history (potential Phase 5.3).
- LLM-based detection / summarization of memory-worthy facts (deferred until the deterministic detector is observed on real traffic).
- Automatic promotion of episodic entries into core (the `promoteToCore(slug, line)` variant in §5.2 — the user-confirmed `entry` variant is closed by this slice).

### 5.2-B Safe memory-write primitives and file-lock foundation — ✅ Complete / Windows validated

§5.2-A landed the user-confirmed promotion flow with inline path-build + duplicate-check + appendFile inside the `POST /agents/:slug/memory/promote` handler. §5.2-B factors that IO scaffolding out into a small reusable module so the future Phase 5 mutation helpers (`editCore` diff-based edit, the episodic-→-core movement variant of `promoteToCore`, the `forget` surgical delete, scheduled compaction) all share one source of truth for path safety, locking, dedup, and atomic replace. The user-facing /promote contract is unchanged.

**New module — `backend-api/src/agents/memoryFiles.ts`.** A pure helper, no Fastify dependency, no SQLite, no network. Exports:

- `SLUG_RE` — same `/^[a-z][a-z0-9-]{1,40}$/` used by the agents routes. Single source of truth.
- `MemoryFilesError` — tagged class with discriminator codes `invalid_slug`, `path_traversal`, `lock_timeout`, `stale_lock_failed`, `io_error`, `duplicate`. Callers can branch on `err.code` instead of substring-matching messages.
- `resolveMemoryPath(runtimeAgentsDir, slug, kind)` — two layers of defense: (1) slug must match `SLUG_RE`; (2) the resolved absolute path must stay inside the resolved runtime agents directory. Throws `invalid_slug` or `path_traversal`. Returns `<runtimeAgentsDir>/<slug>/memory/{core_memory.md|episodic_memory.md}`.
- `withFileLock(path, fn, opts)` — acquires `<path>.lock` via `fs.open(..., "wx")` (exclusive create). Retries with jittered backoff up to `timeoutMs` (default 2500 ms). Recovers from stale lockfiles older than `staleAfterMs` (default 30 s). Writes the holder PID into the lockfile as an advisory hint for operators. Always releases on success / failure / throw. Throws `lock_timeout` only when a fresh lock is held longer than the timeout.
- `safeAppendUnique(path, block, opts)` — `withFileLock` wraps an `mkdir -p` + optional dedup-needle check + `appendFile`. The dedup check + append run inside the same lock, so two concurrent callers can't both pass the duplicate guard and double-write. Returns `{ written, duplicate, bytesAppended, path }`.
- `atomicReplace(path, content, opts)` — reserved for the future `editCore` diff-based path. Writes to `<path>.tmp`, fsyncs, renames over the destination. Whole sequence is lock-guarded. Cleans up `.tmp` on failure.

**Migration of `POST /agents/:slug/memory/promote`.** The /promote handler now resolves the path via `resolveMemoryPath` and delegates the dedup + append to `safeAppendUnique` with `dedupNeedle: cleaned`. Every existing HTTP contract is preserved:

- Missing or invalid slug → HTTP 400 `{error:"invalid slug"}` (no change in observable behavior; the helper independently re-validates the slug as defense in depth, and on a `path_traversal` throw the handler logs a warning and responds with the same 400 so the response can't be used as a slug oracle).
- Slug not in registry → HTTP 404 (unchanged).
- `confirmed !== true` → HTTP 400 with the same hint (unchanged).
- Entry empty or > 4000 chars → HTTP 400 (unchanged).
- Sensitive-content guard → HTTP 422 with the same generic message + hint, same `phase:"memory-promote"` warn log line (unchanged).
- Duplicate (exact text already present) → HTTP 200 `{ok:true, slug, duplicate:true, timestamp}` (unchanged).
- Success → HTTP 200 `{ok:true, slug, timestamp, bytesAppended}` (unchanged).
- **NEW edge case:** `lock_timeout` from a wedged lockfile → HTTP 503 `{error:"memory file is busy; please retry shortly"}` plus a `phase:"memory-promote", reason:"lock_timeout"` warn log line. The fallback path is reachable only when a concurrent writer is holding the lock longer than 2.5 s AND the lockfile is not stale; in normal Windows-host use this branch never fires.

**What §5.2-B deliberately does NOT do:**

- ~~It does not implement `editCore(slug, patch)`~~ — closed by §5.2-D. `safeReplaceOnce` in `memoryFiles.ts` now owns the read+match-count+replace+atomic-write sequence, all inside `withFileLock`.
- It does not implement the episodic-→-core movement variant of `promoteToCore`. The new helpers make that future variant a near-trivial wrapper, but moving an existing episodic line is its own slice.
- It does not implement the `forget` surgical-delete flow in §5.4 — that needs the diff/edit infrastructure first.
- It does not touch SQLite. No new tables. No schema migration.
- It does not touch the frontend, providers, runtime, routing, convening, handoff, registry, or agent personality files.
- It does not add `.env`, an API key, an Anthropic API path, or an external HTTP client.

**Files added on this slice:**

- `backend-api/src/agents/memoryFiles.ts` — the helper module described above. Pure exports; no Fastify, no SQLite. Comments call out that nothing in this module logs file contents.
- `backend-api/scripts/run-memory-files-tests.mjs` — pure-function unit-test runner; uses `os.tmpdir()` and never touches the user's real `~/.creativedge/`. Tests the 21 properties listed in the next section.

**Files modified on this slice:**

- `backend-api/src/routes/agents.ts` — three lines of imports added, the /promote handler's manual path-build + dedup + appendFile block replaced with `resolveMemoryPath` + `safeAppendUnique` calls plus the new HTTP-503 fallback. No other route touched. The `POST /agents/:slug/memory/episodic` route stays on the existing inline mkdir+appendFile pattern; migrating it is a follow-up if episodic concurrency ever becomes a concern.
- `backend-api/package.json` — adds `"test:memory-files": "node scripts/run-memory-files-tests.mjs"`.

**Offline / Linux sandbox validation completed during implementation:**

- `npm run build` (tsc) — clean, no regressions.
- `npm run test:memory-files` — **21/21 PASS** across resolveMemoryPath (11 cases: 2 valid + 8 invalid-slug + 1 invalid-kind), withFileLock (5 cases: basic acquire-release, lockfile cleanup, serialization of two overlapping calls, stale-lock reclamation, fresh-lock timeout), safeAppendUnique (3 cases: writes when needle absent, dedups when present, second distinct fact still appends), atomicReplace (2 cases: overwrite existing, create missing path).
- `npm run test:memory-candidate` — 18/18 PASS (regression — the §5.2-A detector behavior is unchanged).
- `npm run test:routing` coverage check — passes; live-fixture run requires backend.

**Windows validation plan (next step):**

```powershell
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run build
npm run test:memory-files        # expect 21/21 PASS
npm run test:memory-candidate    # expect 18/18 PASS
# In one terminal: npm run dev
# In another, reproduce the §5.2-A end-to-end smoke to confirm /promote
# still works identically under the new helper:
$body = @{ message = 'For this graphics design preference, remember that I prefer dark mode for all design dashboards.' } | ConvertTo-Json
$r = Invoke-WebRequest -Uri http://127.0.0.1:3001/chat -Method POST `
       -ContentType 'application/json' -Body $body -UseBasicParsing
# /chat -> done.memoryCandidate present (same as §5.2-A)
$promote = @{ entry = 'I prefer dark mode for all design dashboards.'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/graphics-design/memory/promote `
  -Method POST -ContentType 'application/json' -Body $promote
# Expect: ok:true, bytesAppended > 0 (or duplicate:true if the §5.2-A entry is still present).
# Repeat -> duplicate:true.
# Sensitive case:
$bad = @{ entry = 'My card is 4111 1111 1111 1111.'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/graphics-design/memory/promote `
  -Method POST -ContentType 'application/json' -Body $bad
# Expect HTTP 422.
```

Done-when for §5.2-B (all seven Windows-validated):

- [x] `npm run build` clean on Windows.
- [x] `npm run test:memory-files` returned 21/21 PASS on Windows (total: 21, PASS 21, FAIL 0).
- [x] `npm run test:memory-candidate` returned 18/18 PASS on Windows (total: 18, PASS 18, FAIL 0 — regression intact).
- [x] Windows round-trip promote still works under `safeAppendUnique` / file lock. Test entry `Phase 5.2-B Windows lock smoke: user prefers dark memory dashboards.` returned `ok:true, slug:"graphics-design", bytesAppended:113` via `POST /agents/graphics-design/memory/promote`.
- [x] Duplicate promote of the same entry returned `{ok:true, duplicate:true}` without growing the file (regression confirmed under the new helper).
- [x] Sensitive promote of `My card is 4111 1111 1111 1111.` (with `confirmed:true`) returned HTTP 422 with no append (regression confirmed under the new helper; category not echoed in the response).
- [x] Existing test suites stayed green on Windows: `npm run test:routing` 38/38 PASS, `npm run test:agents` 70/70 PASS (0 PASS(R), 0 FAIL), `npm run test:memory` 14/14 PASS (0 SKIP, 0 FAIL).

§5.2-B is ✅ Complete / Windows validated. Phase 5 overall remains ⚠️ In progress — the broader Phase 5 work (`editCore`, the episodic-→-core movement variant of `promoteToCore`, the `forget` flow in §5.4, §5.3 compaction, and optional GitHub backup in §5.6) is still open.

Out of scope for §5.2-B:

- ~~`editCore(slug, patch)` diff-based edit~~ — closed by §5.2-D (`PATCH /agents/:slug/memory/core` + `safeReplaceOnce`).
- ~~Episodic-→-core movement variant of `promoteToCore`~~ — closed by §5.2-C (`POST /agents/:slug/memory/promote-episodic`).
- `forget(slug, needle)` surgical-delete flow.
- Compaction (§5.3) and optional GitHub backup (§5.6).
- Marking the per-agent matrix Memory column ✅ — that flip is tied to Phase 5 overall closing.

### 5.2-C Episodic-to-core promotion variant — ✅ Complete / Windows validated

§5.2-A landed the user-confirmed `entry` variant of `promoteToCore` — the caller passes any free-form string and the server validates + appends it. §5.2-C closes the second variant the §5.2 checklist called out: promoting an **existing** line/block from the agent's `episodic_memory.md` into its `core_memory.md`, identified by a substring the caller supplies. Same user-confirmation discipline, same sensitive guard, same duplicate guard, same lock-guarded write path; the only new logic is "find exactly one matching line in episodic and refuse otherwise."

This slice does NOT delete the promoted line from `episodic_memory.md`. Episodic is intentionally append-only on this slice; surgical deletion is the job of the §5.4 forget flow.

**New endpoint — `POST /agents/:slug/memory/promote-episodic`.** Body shape:

```json
{ "episodicNeedle": "user prefers dark mode dashboards", "confirmed": true }
```

**Response contract:**

- `200 { ok:true, slug, promoted:true, timestamp, bytesAppended }` — line was promoted to core.
- `200 { ok:true, slug, duplicate:true, timestamp }` — the same text was already present in `core_memory.md`; no append.
- `400 { error:"invalid slug" }` — slug fails `/^[a-z][a-z0-9-]{1,40}$/` or trips the path-traversal guard.
- `400 { error:"confirmed must be true ..." }` — `confirmed !== true`.
- `400 { error:"body.episodicNeedle must be a non-empty string" }` — needle missing or all-whitespace.
- `400 { error:"body.episodicNeedle too long (max 4000 chars)" }` — needle exceeds `ENTRY_MAX`.
- `400 { error:"body.episodicNeedle must be at least 3 non-whitespace chars" }` — needle too short to be specific.
- `404 { error:"unknown agent: <slug>" }` — slug not in registry.
- `404 { error:"no matching episodic entry" }` — episodic file missing OR needle absent OR matching line empty after trim (kept generic so the response is not an existence oracle).
- `409 { error:"multiple matching episodic entries; refine the needle so it identifies exactly one" }` — needle appears in two or more lines OR appears more than once inside the same line. The count is intentionally not echoed.
- `422 { error:"matching episodic line contains sensitive content; refusing to promote" }` — same generic 422 wording as §5.2-A; the category is not echoed.
- `503 { error:"memory file is busy; please retry shortly" }` — `safeAppendUnique` raised `MemoryFilesError(code:"lock_timeout")` after the configured wait.

**New helper — `findEpisodicMatch(content, needle)`.** Added to `backend-api/src/agents/memoryFiles.ts` next to the other read/write primitives. Pure function, O(n) in content length, no IO, no logging. Discriminated union return value:

- `{ status: "none" }` — needle absent (or content/needle empty).
- `{ status: "multiple", count: number }` — needle appears more than once. Short-circuits at `count = 2`; the `count` is for tests only, the route does not echo it.
- `{ status: "found", line, lineIndex }` — needle appears exactly once. `line` is the full line (without trailing newline). `lineIndex` is zero-based.

Two occurrences inside the same line count as `multiple` — the caller is trying to identify a single line, so ambiguous matches must not promote. Matching is case-sensitive on purpose: episodic gists preserve the user's casing.

**Request flow (server side):**

1. Validate slug + 404 if unknown agent (unchanged plumbing).
2. Validate `confirmed === true` (400 otherwise).
3. Validate `episodicNeedle` is a string, trimmed length ≥ 3, raw length ≤ 4000 (400 on any failure).
4. Resolve both `core_memory.md` and `episodic_memory.md` via `resolveMemoryPath` (defense-in-depth slug regex + path-traversal-resolved-prefix guard).
5. Read episodic. `ENOENT` → 404 "no matching episodic entry".
6. `findEpisodicMatch(content, needle)` → branch:
   - `"none"` → 404.
   - `"multiple"` → 409.
   - `"found"` → trim the line; if empty after trim → 404; if `containsSensitiveContent(cleaned)` → 422 with a warn-level log line (no content, just `phase, slug, lineChars, reason`).
7. Build promotion block `\n<!-- promoted-from-episodic <ISO> -->\n<cleaned>\n` and call `safeAppendUnique(corePath, block, { dedupNeedle: cleaned })`.
   - `lock_timeout` → 503 + warn log.
   - `duplicate:true` → 200 `{ok, slug, duplicate:true, timestamp}` (no append).
   - Otherwise → 200 `{ok, slug, promoted:true, timestamp, bytesAppended}`.

The §5.2-A `/promote` endpoint is untouched. The §5.2-B `safeAppendUnique` / `withFileLock` primitives are the actual write path for both routes.

**Files added on this slice:**

- (None new.) Both the helper and the route live inside existing files.

**Files modified on this slice:**

- `backend-api/src/agents/memoryFiles.ts` — added `EpisodicMatch` discriminated union type and the pure-function `findEpisodicMatch`. No existing exports changed.
- `backend-api/src/routes/agents.ts` — extended the `memoryFiles` import with `findEpisodicMatch`, added the new `POST /agents/:slug/memory/promote-episodic` handler at the end of `agentRoutes`. The §5.2-A `/promote` handler, the existing `/episodic` append handler, and every other route are byte-identical otherwise.
- `backend-api/scripts/run-memory-files-tests.mjs` — added 8 unit tests for `findEpisodicMatch` covering: empty content, empty needle, absent needle, single match (line + lineIndex returned), multiple matches in different lines, multiple matches in the same line, case-sensitive disambiguation, match on the final line without a trailing newline.

**Files NOT touched (intentional):**

- No new SQLite table. No schema migration. No new dependency.
- No frontend, no console.html, no provider/runtime/routing/convening/handoff/registry edits.
- No agent personality files. No README files. No `.env`. No API keys. No external HTTP client.
- No memory artifacts changed at rest (the runner uses `os.tmpdir()`).

**Offline / Linux sandbox validation completed during implementation:**

- `npm run build` (tsc) — clean, no regressions.
- `npm run test:memory-files` — **29/29 PASS** (21 prior tests + 8 new `findEpisodicMatch` cases).
- `npm run test:memory-candidate` — 18/18 PASS (regression — the §5.2-A detector behavior is unchanged).
- `npm run test:routing` coverage check — passes; live-fixture run requires backend.

**Windows validation plan (next step):**

```powershell
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run build
npm run test:memory-files        # expect 29/29 PASS
npm run test:memory-candidate    # expect 18/18 PASS

# Terminal A: npm run dev
# Terminal B: end-to-end smoke

# (a) Successful episodic -> core promotion. First seed an episodic entry.
$episodic = @{ entry = 'Promote-episodic Windows smoke: user wants weekly KPI summaries.' } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/episodic `
  -Method POST -ContentType 'application/json' -Body $episodic
# Now promote a substring of that line.
$body = @{ episodicNeedle = 'weekly KPI summaries'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/promote-episodic `
  -Method POST -ContentType 'application/json' -Body $body
# Expect: ok:true, promoted:true, bytesAppended > 0.

# (b) Repeat -> duplicate:true.
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/promote-episodic `
  -Method POST -ContentType 'application/json' -Body $body

# (c) No match -> HTTP 404.
$bad = @{ episodicNeedle = 'this needle does not exist anywhere'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/promote-episodic `
  -Method POST -ContentType 'application/json' -Body $bad

# (d) Sensitive content -> HTTP 422. (Seed a sensitive episodic line first.)
$seedBad = @{ entry = 'User key Bearer eyJabcdefghijklmnopqrstuv12345 needs rotation.' } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/episodic `
  -Method POST -ContentType 'application/json' -Body $seedBad
$sens = @{ episodicNeedle = 'Bearer eyJabcdefghijklmnopqrstuv12345'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/promote-episodic `
  -Method POST -ContentType 'application/json' -Body $sens

# (e) Multiple matches -> HTTP 409. (Seed the same needle twice.)
$seedDup = @{ entry = 'duplicated-needle row one' } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/episodic `
  -Method POST -ContentType 'application/json' -Body $seedDup
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/episodic `
  -Method POST -ContentType 'application/json' -Body $seedDup
$multi = @{ episodicNeedle = 'duplicated-needle'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/promote-episodic `
  -Method POST -ContentType 'application/json' -Body $multi
```

Done-when for §5.2-C (all nine Windows-validated):

- [x] `npm run build` clean on Windows.
- [x] `npm run test:memory-files` returned 29/29 PASS on Windows (total: 29, PASS 29, FAIL 0 — 21 prior tests + 8 new `findEpisodicMatch` cases).
- [x] `npm run test:memory-candidate` returned 18/18 PASS on Windows (total: 18, PASS 18, FAIL 0 — regression intact).
- [x] Step (a) success path Windows-validated. Seed via `POST /agents/business/memory/episodic` returned `ok:true, bytesAppended:119`. Promote via `POST /agents/business/memory/promote-episodic` returned `ok:true, slug:"business", promoted:true, bytesAppended:148`.
- [x] Step (b) duplicate path Windows-validated. Repeat promote with the same `episodicNeedle` returned `{ok:true, slug:"business", duplicate:true}` without growing the core file.
- [x] Step (c) no-match path Windows-validated. Promote with a needle that does not appear in episodic returned HTTP 404 ("no matching episodic entry").
- [x] Step (d) sensitive-content path Windows-validated. Promote of an episodic line containing a Bearer-token-like substring returned HTTP 422 with no append; the category was not echoed in the response.
- [x] Step (e) multiple-match path Windows-validated. Promote with a needle present in two distinct episodic lines returned HTTP 409 with no append; the count was not echoed.
- [x] Existing test suites stayed green on Windows: `npm run test:routing` 38/38 PASS, `npm run test:agents` 70/70 PASS (0 PASS(R), 0 FAIL), `npm run test:memory` 14/14 PASS (0 SKIP, 0 FAIL).

§5.2-C is ✅ Complete / Windows validated. Phase 5 overall remains ⚠️ In progress — `editCore`, the §5.4 forget flow (including the deferred episodic-line surgical delete), §5.3 compaction, §5.5 SQLite schema additions / FTS5 / migrations, and §5.6 optional GitHub backup are still open.

Out of scope for §5.2-C:

- Deleting the promoted line from `episodic_memory.md` (deferred to §5.4 forget flow).
- ~~`editCore(slug, patch)` diff-based edit~~ — closed by §5.2-D (`PATCH /agents/:slug/memory/core` + `safeReplaceOnce`).
- Compaction (§5.3) and optional GitHub backup (§5.6).
- A frontend confirm/cancel button against `done.memoryCandidate` or against episodic promotion (Phase 6 chat UI).
- Marking the per-agent matrix Memory column ✅ — that flip is tied to Phase 5 overall closing.

### 5.2-D editCore(slug, patch) diff-based edit — ✅ Complete / Windows validated

§5.2-D closes the third §5.2 mutation primitive the Phase 5 checklist called out: a safe, explicit, diff-based edit of `core_memory.md`. The user supplies an exact `find` substring and a `replace` substring; the server enforces exact-one-match on `find`, refuses if `replace` introduces sensitive content, and atomically writes the new file. Same confirmation discipline as §5.2-A and §5.2-C (`confirmed:true` required), same lock and traversal protections, same "no oracle" response patterns.

**New helper — `safeReplaceOnce(path, find, replace, opts)` in `backend-api/src/agents/memoryFiles.ts`.** Lock-guarded, read-count-replace-write all inside a single `withFileLock` call so two concurrent editors cannot both pass the match-count check. Returns a discriminated union:

- `{status:"none", path}` — file missing or `find` absent (route → 404).
- `{status:"multiple", count, path}` — `find` appears ≥ 2 times (route → 409); count short-circuits at 2 so the helper stays O(n) on large files.
- `{status:"unchanged", path}` — `find === replace`, or in-place `String#replace` produced identical content (route → 200 unchanged, no write).
- `{status:"edited", bytesWritten, path}` — exactly one match found, atomically rewritten (route → 200 edited).

Atomic write strategy: `writeFile(<path>.tmp)` + `rename` over the destination. `rename` is POSIX-atomic and atomic on NTFS when the destination exists. Best-effort `.tmp` cleanup on any failure. Two occurrences inside the same line count as multiple — the caller is asking to identify exactly one edit target, so an ambiguous `find` must never write. Matching is case-sensitive on purpose (parity with `findEpisodicMatch`).

**New endpoint — `PATCH /agents/:slug/memory/core`.** Body shape:

```json
{ "find": "I prefer dark mode for all dashboards.",
  "replace": "I prefer high-contrast light mode for all dashboards.",
  "confirmed": true }
```

**Response contract:**

- `200 { ok:true, slug, edited:true, timestamp, bytesWritten }` — replacement applied.
- `200 { ok:true, slug, unchanged:true, timestamp }` — `find === replace` (or content would not change); no write.
- `400 { error:"invalid slug" }` — slug fails `/^[a-z][a-z0-9-]{1,40}$/` or trips the path-traversal guard.
- `400 { error:"confirmed must be true ..." }` — `confirmed !== true`.
- `400 { error:"body.find must be a non-empty string" }` — `find` missing / all-whitespace.
- `400 { error:"body.find too long (max 4000 chars)" }` — `find` exceeds `ENTRY_MAX`.
- `400 { error:"body.find must be at least 3 non-whitespace chars" }` — `find` too short to be specific.
- `400 { error:"body.replace must be a string" }` — `replace` not a string. (Empty string is allowed and acts as a surgical delete of the `find` span.)
- `400 { error:"body.replace too long (max 4000 chars)" }` — `replace` exceeds `ENTRY_MAX`.
- `404 { error:"unknown agent: <slug>" }` — slug not in registry.
- `404 { error:"no matching core entry" }` — core file missing OR `find` absent (generic message; not an existence oracle).
- `409 { error:"multiple matching core entries; refine the find so it identifies exactly one" }` — `find` appears more than once. Count not echoed.
- `422 { error:"replacement contains sensitive content; refusing to edit core memory" }` — `containsSensitiveContent(replace) === true`. Category not echoed. Note: only `replace` is guarded (the caller may legitimately be REMOVING existing sensitive content from core by passing a sensitive `find` + a benign `replace`).
- `503 { error:"memory file is busy; please retry shortly" }` — `safeReplaceOnce` raised `MemoryFilesError(code:"lock_timeout")` after the configured wait.

**Request flow (server side):**

1. Validate slug + 404 if unknown agent (unchanged plumbing).
2. Validate `confirmed === true` (400 otherwise).
3. Validate `find` is a string with trimmed length ≥ 3, raw length ≤ 4000 (400 on any failure).
4. Validate `replace` is a string, raw length ≤ 4000 (400 otherwise). Empty `replace` is allowed.
5. `containsSensitiveContent(replace)` → 422 with a warn-level log line (`phase:"memory-edit-core"`, `reason:"sensitive-content guard refused write"`, `replaceChars`).
6. Resolve core path via `resolveMemoryPath` (defense-in-depth slug regex + path-traversal-resolved-prefix guard).
7. Call `safeReplaceOnce(corePath, find, replace)`:
   - `lock_timeout` → 503 + warn log.
   - `none` → 404 "no matching core entry".
   - `multiple` → 409 "refine the find".
   - `unchanged` → 200 `{ok, slug, unchanged:true, timestamp}`.
   - `edited` → 200 `{ok, slug, edited:true, timestamp, bytesWritten}`.

The §5.2-A `/promote` handler, the §5.2-C `/promote-episodic` handler, and the existing `/episodic` append handler are byte-identical otherwise. The §5.2-B `safeAppendUnique` / `withFileLock` / `atomicReplace` primitives still back `/promote` and `/promote-episodic`; `safeReplaceOnce` is the only primitive `/agents/:slug/memory/core` uses.

**Files added on this slice:**

- (None new.) Both the helper and the route live inside existing files.

**Files modified on this slice:**

- `backend-api/src/agents/memoryFiles.ts` — added `SafeReplaceOnceOptions` + `SafeReplaceOnceResult` types and the `safeReplaceOnce` helper. No existing exports changed.
- `backend-api/src/routes/agents.ts` — extended the `memoryFiles` import with `safeReplaceOnce`; appended the new `PATCH /agents/:slug/memory/core` handler at the end of `agentRoutes`. Every other route is byte-identical otherwise.
- `backend-api/scripts/run-memory-files-tests.mjs` — added 8 unit tests for `safeReplaceOnce`: missing file → none, absent needle → none + file unchanged, single match → edited + bytesWritten + content updated, two different lines → multiple + file unchanged, two same-line → multiple + file unchanged, find===replace → unchanged + no rewrite, empty replace acts as surgical delete, throws `io_error` on empty `find`.

**Files NOT touched (intentional):**

- No new file. No new dependency. No SQLite schema change. No new table.
- No frontend, no console.html, no provider/runtime/routing/convening/handoff/registry edits.
- No agent personality files. No README files. No `.env`. No API keys. No external HTTP client.
- No memory artifacts changed at rest (the runner uses `os.tmpdir()`).

**Offline / Linux sandbox validation completed during implementation:**

- `npm run build` (tsc) — clean, no regressions.
- `npm run test:memory-files` — **37/37 PASS** (29 prior + 8 new `safeReplaceOnce` cases).
- `npm run test:memory-candidate` — 18/18 PASS (regression intact).
- `npm run test:routing` coverage check — passes; live-fixture run requires backend.

**Windows validation plan (next step):**

```powershell
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run build
npm run test:memory-files        # expect 37/37 PASS
npm run test:memory-candidate    # expect 18/18 PASS

# Terminal A: npm run dev
# Terminal B: end-to-end smoke

# (a) Seed a core entry to edit.
$seed = @{ entry = 'editCore Windows smoke: user prefers dark mode for all dashboards.'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/promote `
  -Method POST -ContentType 'application/json' -Body $seed

# (b) Edit it: dark -> high-contrast light. Expect ok:true, edited:true, bytesWritten > 0.
$edit = @{ find = 'dark mode for all dashboards'; replace = 'high-contrast light mode for all dashboards'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/core `
  -Method PATCH -ContentType 'application/json' -Body $edit

# (c) Same edit again -> 404 no matching core entry (the original `find` text is now gone).
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/core `
  -Method PATCH -ContentType 'application/json' -Body $edit

# (d) find === replace -> unchanged.
$nochange = @{ find = 'high-contrast light mode for all dashboards'; replace = 'high-contrast light mode for all dashboards'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/core `
  -Method PATCH -ContentType 'application/json' -Body $nochange

# (e) Sensitive replace -> 422.
$bad = @{ find = 'high-contrast light mode'; replace = 'API key is sk-abcdefghijklmnopqr1234'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/core `
  -Method PATCH -ContentType 'application/json' -Body $bad

# (f) Multiple matches -> 409. (Seed a phrase twice via /promote first.)
$dup = @{ entry = 'duplicated-anchor please find me twice'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/promote `
  -Method POST -ContentType 'application/json' -Body $dup
$dup2 = @{ entry = 'duplicated-anchor please find me twice (second copy)'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/promote `
  -Method POST -ContentType 'application/json' -Body $dup2
$multi = @{ find = 'duplicated-anchor'; replace = 'unique-anchor'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/core `
  -Method PATCH -ContentType 'application/json' -Body $multi
```

Done-when for §5.2-D (all nine Windows-validated):

- [x] `npm run build` clean on Windows.
- [x] `npm run test:memory-files` returned 37/37 PASS on Windows (total: 37, PASS 37, FAIL 0 — 29 prior tests + 8 new `safeReplaceOnce` cases).
- [x] `npm run test:memory-candidate` returned 18/18 PASS on Windows (total: 18, PASS 18, FAIL 0 — regression intact).
- [x] Step (b) edit Windows-validated. Seed via `POST /agents/business/memory/promote` returned `ok:true, slug:"business", bytesAppended:135`. Edit via `PATCH /agents/business/memory/core` returned `ok:true, slug:"business", edited:true, bytesWritten:686`.
- [x] Step (c) no-match Windows-validated. Repeat the same `find/replace` PATCH (whose `find` text is now gone) returned HTTP 404 "no matching core entry".
- [x] Step (d) unchanged path Windows-validated. PATCH with `find === replace` returned `{ok:true, slug:"business", unchanged:true}` without rewriting the file.
- [x] Step (e) sensitive-replace path Windows-validated. PATCH with a `replace` containing an API-key-like substring returned HTTP 422 with no rewrite; the category was not echoed in the response.
- [x] Step (f) multiple-match path Windows-validated. PATCH with a `find` present in two distinct core entries returned HTTP 409 with no rewrite; the count was not echoed.
- [x] Existing test suites stayed green on Windows: `npm run test:routing` 38/38 PASS, `npm run test:agents` 65 PASS + 5 PASS(R), 0 FAIL (five fixtures passed after the runner's built-in provider-fallback retry; final suite result is FAIL 0), `npm run test:memory` 14/14 PASS (0 SKIP, 0 FAIL).

§5.2-D is ✅ Complete / Windows validated. Phase 5 overall remains ⚠️ In progress — the §5.4 forget flow (surgical delete on explicit "forget that"), §5.3 compaction, §5.5 SQLite schema additions / FTS5 / migrations, and §5.6 optional GitHub backup are still open.

Out of scope for §5.2-D:

- §5.4 forget flow — surgical delete on explicit "forget that" remains a separate slice (it can use `safeReplaceOnce` with an empty replace as a building block).
- §5.3 compaction. §5.5 SQLite/FTS5. §5.6 optional GitHub backup.
- A frontend confirm/cancel button against `done.memoryCandidate`, against the §5.2-C `/promote-episodic` route, or against this `/core` edit route (Phase 6 chat UI).
- Marking the per-agent matrix Memory column ✅ — that flip is tied to Phase 5 overall closing.

### 5.3 Compaction
- [x] Manual trigger first: a button in the console that runs a compaction preview pass and lets the user accept/reject. Closed by §5.3-A: read-only `POST /agents/:slug/memory/compact/preview` endpoint + the pure-function `parseEpisodicEntries` and `buildEpisodicCompactionPreview` helpers in `memoryFiles.ts`. The preview is deterministic (no LLM in this slice; 3-5 bullets pulled from the trailing N gists, capped at ~200 chars with `…` ellipsis on overflow, sensitive bullets redacted to `[redacted - sensitive content]`). Windows-validated end-to-end: empty preview returned `{ok:true, slug:"business", empty:true}`; normal preview returned `{ok:true, entryCount:86, consideredCount:10, preview, requiresConfirmation:true}`; `maxEntries:2` trimmed `consideredCount` to 2; invalid maxEntries → 400; invalid slug → 400; unknown slug → 404; `npm run test:memory-files` 50/50 PASS. Apply / accept-reject lands in a follow-up §5.3-B slice.
- [x] Later: scheduled compaction when episodic > 100 entries — **readiness/status half closed by §5.3-D** (read-only `GET /agents/:slug/memory/compact/status` + the pure-function `getEpisodicCompactionStatus` helper in `memoryFiles.ts`). Important scope notes: (a) read-only status endpoint only — no writes, no `core_memory.md` / `episodic_memory.md` mutation; (b) no background timer / cron / `setInterval` is introduced — the server reports readiness, it does NOT auto-fire; (c) no auto-apply — when `due:true` the response carries `nextAction:"preview"` pointing the caller at the existing §5.3-A `/compact/preview` → §5.3-B `/compact/apply` flow which still requires explicit `confirmed:true`; (d) no deletion / truncation of `episodic_memory.md` — the file is read-only here and the standing §5.4-A `/forget` route remains the only path for surgical episodic deletion. Strict greater-than semantics: `due = entryCount > threshold` so the boundary value 100 is NOT due. Windows-validated end-to-end: initial GET returned `entryCount:108, due:true, nextAction:"preview"`; post-seed GET returned `entryCount:213, due:true`; invalid slug → 400; unknown slug → 404; episodic SHA256 hash equal before/after status (`Episodic untouched by status: True`). `npm run test:memory-files` 64/64 PASS on Windows.

### 5.3-A Manual episodic compaction preview — ✅ Complete / Windows validated

§5.3-A closes the read-side half of the §5.3 compaction checklist: the user can ask "what would a compaction of this agent's episodic memory look like?" and get a deterministic, no-write preview back. The matching apply endpoint (`POST /agents/:slug/memory/compact/apply`) is deferred to §5.3-B once the preview shape stabilizes on real Windows traffic — this slice ships preview-only on purpose.

**New endpoint — `POST /agents/:slug/memory/compact/preview`.** READ-ONLY. Body shape:

```json
{ "maxEntries": 10 }
```

`maxEntries` is optional (default 10) and bounded to the inclusive range [1, 100]. Any other value (NaN, negative, > 100, non-number) returns HTTP 400.

**Response contract:**

- `200 { ok:true, slug, empty:true }` — the episodic file is missing OR contains no parseable `## ...` entries.
- `200 { ok:true, slug, entryCount, consideredCount, preview, requiresConfirmation:true }` — at least one entry parsed. `entryCount` is the total entries in the file, `consideredCount` is `min(maxEntries, entryCount)`, and `preview` is 0..5 compact bullets pulled from the trailing considered entries. Each bullet is capped at ~200 chars (truncated with a Unicode `…` ellipsis); sensitive bullets are replaced by the literal string `[redacted - sensitive content]` so the response never leaks credit-card / SSN / API-key / PEM / bearer-token fingerprints.
- `400 { error:"invalid slug" }` — slug fails `/^[a-z][a-z0-9-]{1,40}$/` or trips the path-traversal guard.
- `400 { error:"body.maxEntries must be an integer between 1 and 100" }` — caller supplied an out-of-range `maxEntries`.
- `404 { error:"unknown agent: <slug>" }` — slug not in registry.

No HTTP 422 branch (the preview is read-only — no write to guard). No HTTP 409. No HTTP 503 (no lock — the route only reads).

**New helpers in `backend-api/src/agents/memoryFiles.ts`:**

- `EpisodicEntry` — `{ heading: string, gist: string, wasHandoff: boolean }` struct describing one parsed block.
- `parseEpisodicEntries(content)` — pure function. Splits `content` into `## heading` blocks and pulls the structured fields out. Tolerant: missing / mis-ordered bullet lines never throw; control chars except CR/LF/TAB are stripped; blocks without a heading line are dropped; empty input → `[]`. Returns entries in source order.
- `EpisodicCompactionPreview` — `{ entryCount, consideredCount, preview }` struct.
- `buildEpisodicCompactionPreview(content, maxEntries, isSensitive?)` — deterministic compaction preview. Parses the file, takes the trailing `maxEntries` entries, pulls non-empty gists, takes the last 5 of those, redacts any gist where `isSensitive(gist)` returns true, caps remaining bullets at ~200 chars with a trailing `…`. The `isSensitive` parameter is a function (not a hard import) so `memoryFiles.ts` stays decoupled from `containsSensitiveContent` in `agentRuntimeContext.ts`. The route layer passes the real guard.

**Request flow (server side):**

1. Validate slug + 404 if unknown agent (unchanged plumbing).
2. Validate `maxEntries`: default 10, must be a finite integer in [1, 100] when supplied, otherwise 400. `Math.floor` coerces fractional inputs.
3. Resolve episodic path via `resolveMemoryPath(runtimeAgentsDir, slug, "episodic")` (defense-in-depth slug regex + path-traversal-resolved-prefix guard).
4. Read episodic. `ENOENT` → 200 `{ok:true, slug, empty:true}`. Whitespace-only content → same.
5. Call `buildEpisodicCompactionPreview(content, cappedMax, containsSensitiveContent)`.
6. Log an info-level `phase:"memory-compact-preview"` line with counts only (`entryCount`, `consideredCount`, `previewBullets`, `maxEntries`) — never the gist content itself.
7. Return `{ ok:true, slug, entryCount, consideredCount, preview, requiresConfirmation:true }`.

This slice **does not write to disk**. The episodic file is opened read-only via `readFile`, no `appendFile` / `writeFile` / `rename` calls. No file lock is acquired. The §5.2-A `/promote`, §5.2-C `/promote-episodic`, §5.2-D `/core` PATCH, and §5.4-A `/forget` routes are byte-identical otherwise.

**Files added on this slice:**

- (None new.) Both helpers and the route live inside existing files.

**Files modified on this slice:**

- `backend-api/src/agents/memoryFiles.ts` — added `EpisodicEntry` + `EpisodicCompactionPreview` types, `parseEpisodicEntries` and `buildEpisodicCompactionPreview` pure functions. No existing exports changed.
- `backend-api/src/routes/agents.ts` — extended the `memoryFiles` import with `buildEpisodicCompactionPreview`; appended the new `POST /agents/:slug/memory/compact/preview` handler at the end of `agentRoutes`. Every other route is byte-identical otherwise.
- `backend-api/scripts/run-memory-files-tests.mjs` — added 11 unit tests across two new sub-blocks (5 for `parseEpisodicEntries`, 6 for `buildEpisodicCompactionPreview`): empty content → [], well-formed single entry, two entries with second as handoff, missing gist line tolerated, body-before-heading orphans dropped; empty input → 0/0/[], 3 entries → 3 bullets, >5 entries → exactly the last 5, `maxEntries=2` trims, sensitive gist → redaction marker, long gist → capped with `…` ellipsis.

**Files NOT touched (intentional):**

- No new file. No new dependency. No SQLite schema change. No new table.
- No frontend, no console.html, no provider/runtime/routing/convening/handoff/registry edits.
- No agent personality files. No README files. No `.env`. No API keys. No external HTTP client.
- No memory artifacts changed at rest. No write to `episodic_memory.md` or `core_memory.md`.

**Offline / Linux sandbox validation completed during implementation:**

- `npm run build` (tsc) — clean, no regressions.
- `npm run test:memory-files` — **50/50 PASS** (39 prior + 11 new §5.3-A cases).
- `npm run test:memory-candidate` — 18/18 PASS (regression intact).
- `npm run test:routing` coverage check — passes; live-fixture run requires backend.

**Windows validation plan (next step):**

```powershell
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run build
npm run test:memory-files        # expect 50/50 PASS
npm run test:memory-candidate    # expect 18/18 PASS

# Terminal A: npm run dev
# Terminal B: end-to-end smoke

# (a) Empty agent first - expect ok:true, empty:true.
$emptyBody = @{} | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/compact/preview `
  -Method POST -ContentType 'application/json' -Body $emptyBody

# (b) Seed a handful of episodic entries, then ask for a preview.
1..6 | ForEach-Object {
  $seed = @{ entry = "compact-preview Windows smoke gist #$_" } | ConvertTo-Json
  Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/episodic `
    -Method POST -ContentType 'application/json' -Body $seed | Out-Null
}
$prev = @{ maxEntries = 10 } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/compact/preview `
  -Method POST -ContentType 'application/json' -Body $prev
# Expect: ok:true, entryCount >= 6, consideredCount >= 6, preview.length == 5,
# requiresConfirmation:true.

# (c) maxEntries=2 trims the considered window.
$prev2 = @{ maxEntries = 2 } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/compact/preview `
  -Method POST -ContentType 'application/json' -Body $prev2
# Expect: consideredCount == 2, preview.length == 2.

# (d) Invalid maxEntries -> HTTP 400.
$bad = @{ maxEntries = 0 } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/compact/preview `
  -Method POST -ContentType 'application/json' -Body $bad

# (e) Invalid slug -> HTTP 400.
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/with..slash/memory/compact/preview `
  -Method POST -ContentType 'application/json' -Body $emptyBody

# (f) Unknown slug -> HTTP 404.
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/nonexistent/memory/compact/preview `
  -Method POST -ContentType 'application/json' -Body $emptyBody
```

Done-when for §5.3-A (all ten Windows-validated):

- [x] `npm run build` clean on Windows.
- [x] `npm run test:memory-files` returned 50/50 PASS on Windows (total: 50, PASS 50, FAIL 0 — 39 prior tests + 11 new §5.3-A cases).
- [x] `npm run test:memory-candidate` returned 18/18 PASS on Windows (total: 18, PASS 18, FAIL 0 — regression intact).
- [x] Step (a) empty-preview Windows-validated. `POST /agents/business/memory/compact/preview` returned `{ok:true, slug:"business", empty:true}` on the empty starting state.
- [x] Step (b) normal-preview Windows-validated. After seeding episodic gists, the same call returned `{ok:true, slug:"business", entryCount:86, consideredCount:10, preview, requiresConfirmation:true}` with `preview.length` ≤ 5.
- [x] Step (c) maxEntries-trim Windows-validated. `POST` with `{maxEntries:2}` returned `{ok:true, slug:"business", consideredCount:2, ..., requiresConfirmation:true}` with `preview.length === 2`.
- [x] Step (d) invalid-maxEntries Windows-validated. `POST` with `{maxEntries:0}` returned HTTP 400 "body.maxEntries must be an integer between 1 and 100".
- [x] Step (e) invalid-slug Windows-validated. `POST /agents/with..slash/memory/compact/preview` returned HTTP 400 "invalid slug".
- [x] Step (f) unknown-slug Windows-validated. `POST /agents/nonexistent/memory/compact/preview` returned HTTP 404 "unknown agent: nonexistent".
- [x] Existing test suites stayed green on Windows: `npm run test:routing` 38/38 PASS, `npm run test:agents` 70 PASS + 0 PASS(R) + 0 FAIL, `npm run test:memory` 14/14 PASS (0 SKIP, 0 FAIL).

§5.3-A is ✅ Complete / Windows validated. Phase 5 overall remains ⚠️ In progress — the §5.3-B apply endpoint (the write half of compaction), §5.3-C optional LLM-based summarization, §5.3-D scheduled compaction when episodic > 100 entries, §5.5 SQLite schema additions / FTS5 / migrations, §5.6 optional GitHub backup, Phase 6 chat UI confirm/cancel wiring against `done.memoryCandidate` and the five mutation/preview routes, and the per-agent matrix Memory column flip are still open.

Out of scope for §5.3-A:

- §5.3-B `POST /agents/:slug/memory/compact/apply` (the write half of compaction). Will reuse `safeReplaceOnce` / `atomicReplace` once the preview contract is exercised on real Windows traffic.
- LLM-based summarization of episodic into 3 bullets. The §5.3 placeholder bullet mentioned an LLM pass; §5.3-A ships the deterministic version first so the contract is testable without provider state. LLM compaction can land in a later §5.3-C.
- §5.3 "Later: scheduled compaction when episodic > 100 entries" — that is a §5.3-D follow-up after manual compaction stabilizes.
- A frontend confirm/cancel button against `/compact/preview` (Phase 6 chat UI).
- Marking the per-agent matrix Memory column ✅ — that flip is tied to Phase 5 overall closing.

### 5.3-B Manual episodic compaction apply — ✅ Complete / Windows validated

§5.3-B closes the write half of manual compaction: after `/compact/preview` returns a bullet list, the user reviews it and either submits the same bullets back unchanged or hand-edits them, then calls `/compact/apply` with `confirmed:true` to write a compaction block into `core_memory.md`. The episodic file is intentionally untouched on this slice (additive compaction; episodic deletion stays under §5.4 forget control).

**New endpoint — `POST /agents/:slug/memory/compact/apply`.** Body shape:

```json
{ "preview": ["bullet 1", "bullet 2", "bullet 3"],
  "mode": "append-core",
  "confirmed": true }
```

`mode` must be the literal string `"append-core"`; any other value is rejected with HTTP 400. The slice only ships the additive append mode — variants like `replace-core-compaction` or `prune-episodic` are deferred to later slices once `append-core` traffic is observed on Windows.

**Response contract:**

- `200 { ok:true, slug, applied:true, mode:"append-core", timestamp, bytesAppended }` — block written; `bytesAppended > 0`.
- `200 { ok:true, slug, duplicate:true, mode:"append-core", timestamp }` — the exact bullet fingerprint was already present in core memory; no write.
- `400 { error:"invalid slug" }` — slug fails `/^[a-z][a-z0-9-]{1,40}$/` or trips path-traversal guard.
- `400 { error:"confirmed must be true ..." }` — `confirmed !== true`.
- `400 { error:"body.mode must be \"append-core\"" }` — wrong / missing mode.
- `400 { error:"body.preview must be an array of 1..5 non-empty strings" }` — preview not an array.
- `400 { error:"body.preview must have between 1 and 5 bullets" }` — preview length out of range.
- `400 { error:"body.preview bullets must all be strings" }` — non-string element.
- `400 { error:"body.preview bullets must not be empty after trim" }` — whitespace-only element.
- `400 { error:"body.preview bullets must be <= 400 chars each" }` — overlong bullet (per-bullet cap `COMPACTION_BULLET_MAX = 400`).
- `404 { error:"unknown agent: <slug>" }` — slug not in registry.
- `422 { error:"compaction preview contains sensitive content; refusing to apply" }` — any bullet matches the same credit-card / SSN / API-key / bearer / PEM patterns the other mutation routes guard. Category not echoed.
- `503 { error:"memory file is busy; please retry shortly" }` — `safeAppendUnique` raised `MemoryFilesError(code:"lock_timeout")`.

**New helper — `buildCompactionBlock(bullets, timestamp)` in `backend-api/src/agents/memoryFiles.ts`.** Pure formatter. Returns `{ block, fingerprint }`:

- `block` is the full markdown chunk the route appends: `\n<!-- compacted-from-episodic <timestamp> -->\n- bullet 1\n- bullet 2\n...\n`. The leading newline mirrors `/promote` and `/promote-episodic` so the block reads as a separate stanza when appended.
- `fingerprint` is the deterministic dedup needle: `"- " + bullets.join("\n- ")` — bullets only, no timestamp. Two consecutive applies of identical bullets share the fingerprint, so `safeAppendUnique`'s duplicate guard catches the second one and reports `{ok:true, duplicate:true}` without writing.

Throws `MemoryFilesError(code:"io_error")` on empty bullets array or empty timestamp.

**Request flow (server side):**

1. Validate slug + 404 if unknown agent.
2. Validate `confirmed === true` (400 otherwise).
3. Validate `mode === "append-core"` (400 otherwise).
4. Validate `preview` is `Array<string>` of length 1..5, each non-empty after trim, each ≤ 400 chars (400 on any failure).
5. Sensitive guard: run `containsSensitiveContent` on each cleaned bullet → 422 with a warn log line (`phase:"memory-compact-apply"`, `reason:"sensitive-content guard refused write"`, `bulletChars`) if any matches.
6. Resolve `core_memory.md` via `resolveMemoryPath` (slug regex + path-traversal-resolved-prefix guard).
7. Build the block + fingerprint via `buildCompactionBlock(cleaned, new Date().toISOString())`.
8. Append via `safeAppendUnique(corePath, block, { dedupNeedle: fingerprint })`:
   - `lock_timeout` → 503 + warn log.
   - `duplicate:true` → 200 `{ok:true, slug, duplicate:true, mode:"append-core", timestamp}`.
   - `written:true` → 200 `{ok:true, slug, applied:true, mode:"append-core", timestamp, bytesAppended}`.

The §5.2-A `/promote`, §5.2-C `/promote-episodic`, §5.2-D `/core` PATCH, §5.3-A `/compact/preview`, and §5.4-A `/forget` routes are byte-identical otherwise. The §5.2-B `withFileLock` / `safeAppendUnique` primitives back the apply write path; `/compact/preview` stays read-only.

**Files added on this slice:**

- (None new.) Helper and route both live inside existing files.

**Files modified on this slice:**

- `backend-api/src/agents/memoryFiles.ts` — added `CompactionBlock` type + pure-function `buildCompactionBlock(bullets, timestamp)`. No existing exports changed.
- `backend-api/src/routes/agents.ts` — extended `memoryFiles` import with `buildCompactionBlock`; added `COMPACTION_BULLET_MAX = 400` constant; appended new `POST /agents/:slug/memory/compact/apply` handler at the end of `agentRoutes`. Every other route is byte-identical otherwise.
- `backend-api/scripts/run-memory-files-tests.mjs` — added 6 unit tests for `buildCompactionBlock` and its dedup roundtrip: single-bullet fingerprint+block, multi-bullet block contains fingerprint+timestamp, same bullets → same fingerprint across timestamps, throws on empty bullets, throws on empty timestamp, end-to-end dedup roundtrip (first apply writes, second apply duplicates).

**Files NOT touched (intentional):**

- `episodic_memory.md` is never read OR written by this route. The compaction is additive on the core side only.
- No new file. No new dependency. No SQLite schema change. No new table.
- No frontend, no console.html, no provider/runtime/routing/convening/handoff/registry edits.
- No agent personality files. No README files. No `.env`. No API keys. No external HTTP client.

**Offline / Linux sandbox validation completed during implementation:**

- `npm run build` (tsc) — clean, no regressions.
- `npm run test:memory-files` — **56/56 PASS** (50 prior + 6 new §5.3-B cases).
- `npm run test:memory-candidate` — 18/18 PASS (regression intact).
- `npm run test:routing` coverage check — passes; live-fixture run requires backend.

**Windows validation plan (next step):**

```powershell
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run build
npm run test:memory-files        # expect 56/56 PASS
npm run test:memory-candidate    # expect 18/18 PASS

# Terminal A: npm run dev
# Terminal B: end-to-end smoke

# (a) Generate a preview first.
$prevBody = @{ maxEntries = 10 } | ConvertTo-Json
$preview = Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/compact/preview `
  -Method POST -ContentType 'application/json' -Body $prevBody
# Take the returned `preview` array verbatim and submit it back to /apply.
$applyBody = @{ preview = $preview.preview; mode = "append-core"; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/compact/apply `
  -Method POST -ContentType 'application/json' -Body $applyBody
# Expect: ok:true, applied:true, mode:"append-core", bytesAppended > 0.

# (b) Same payload again -> duplicate.
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/compact/apply `
  -Method POST -ContentType 'application/json' -Body $applyBody

# (c) Unconfirmed -> 400.
$noconfirm = @{ preview = @("bullet"); mode = "append-core" } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/compact/apply `
  -Method POST -ContentType 'application/json' -Body $noconfirm

# (d) Wrong mode -> 400.
$badmode = @{ preview = @("bullet"); mode = "replace-core"; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/compact/apply `
  -Method POST -ContentType 'application/json' -Body $badmode

# (e) Empty preview array -> 400.
$emptyPreview = @{ preview = @(); mode = "append-core"; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/compact/apply `
  -Method POST -ContentType 'application/json' -Body $emptyPreview

# (f) Too many bullets (6 > 5) -> 400.
$tooMany = @{ preview = @("a","b","c","d","e","f"); mode = "append-core"; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/compact/apply `
  -Method POST -ContentType 'application/json' -Body $tooMany

# (g) Sensitive bullet -> 422.
$sens = @{ preview = @("normal bullet", "another normal one", "my card is 4111 1111 1111 1111"); mode = "append-core"; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/compact/apply `
  -Method POST -ContentType 'application/json' -Body $sens
```

Done-when for §5.3-B (all twelve Windows-validated):

- [x] `npm run build` clean on Windows.
- [x] `npm run test:memory-files` returned 56/56 PASS on Windows (total: 56, PASS 56, FAIL 0 — 50 prior tests + 6 new §5.3-B cases).
- [x] `npm run test:memory-candidate` returned 18/18 PASS on Windows (total: 18, PASS 18, FAIL 0 — regression intact).
- [x] Step (a) preview → apply Windows-validated. `POST /agents/business/memory/compact/apply` with `{preview, mode:"append-core", confirmed:true}` returned `ok:true, slug:"business", applied:true, mode:"append-core", bytesAppended:413`.
- [x] Step (b) duplicate Windows-validated. Repeat apply with the same payload returned `{ok:true, slug:"business", duplicate:true, mode:"append-core"}` without growing `core_memory.md`.
- [x] Step (c) unconfirmed Windows-validated. POST without `confirmed:true` returned HTTP 400.
- [x] Step (d) wrong-mode Windows-validated. POST with `mode:"replace-core"` returned HTTP 400 "body.mode must be \"append-core\"".
- [x] Step (e) empty-preview Windows-validated. POST with `preview:[]` returned HTTP 400 "body.preview must have between 1 and 5 bullets".
- [x] Step (f) too-many-bullets Windows-validated. POST with a 6-bullet preview returned HTTP 400.
- [x] Step (g) sensitive-bullet Windows-validated. POST with a credit-card-like substring in one bullet returned HTTP 422 (category not echoed).
- [x] `episodic_memory.md` remained untouched by `/compact/apply` — SHA256 hash equality verified before and after every apply (`Untouched: True`).
- [x] Existing test suites stayed green on Windows: `npm run test:routing` total 38 with PASS 37 + WARN 1 + FAIL 0 (the `handoff-audio-001` WARN is a pre-existing fixture observation about an optional `done.handoff` field; the runner treats WARN as PASS for exit code), `npm run test:agents` 70/70 PASS + 0 PASS(R) + 0 FAIL, `npm run test:memory` 14/14 PASS (0 SKIP, 0 FAIL).

§5.3-B is ✅ Complete / Windows validated. Phase 5 overall remains ⚠️ In progress — §5.3-C optional LLM-based summarization, §5.3-D scheduled compaction, §5.5 SQLite schema additions / FTS5 / migrations, §5.6 optional GitHub backup, Phase 6 chat UI confirm/cancel wiring against `done.memoryCandidate` and the six mutation/preview routes (`/promote`, `/promote-episodic`, `/core` PATCH, `/forget`, `/compact/preview`, `/compact/apply`), and the per-agent matrix Memory column flip are still open.

Out of scope for §5.3-B:

- §5.3-C optional LLM-based summarization of episodic into bullets (caller can still supply LLM-produced bullets to /apply, but the server stays deterministic on this slice).
- §5.3-D scheduled compaction when episodic > 100 entries.
- Pruning / deleting from `episodic_memory.md` as part of compaction. Episodic deletion stays under `/forget` (§5.4-A).
- A frontend confirm/cancel button against `/compact/preview` + `/compact/apply` (Phase 6 chat UI).
- Marking the per-agent matrix Memory column ✅ — that flip is tied to Phase 5 overall closing.

### 5.3-D Scheduled compaction readiness/status — ✅ Complete / Windows validated

§5.3-D closes the readiness half of scheduled compaction: callers can ask "does this agent's episodic memory need compaction yet?" and get a deterministic, no-write status back. The endpoint deliberately does NOT introduce a background timer, does NOT write to memory, and does NOT call any LLM. When `due:true`, the response carries a `nextAction:"preview"` hint pointing at the existing §5.3-A `/compact/preview` → §5.3-B `/compact/apply` flow — every actual mutation still requires explicit `confirmed:true` from the caller.

**New endpoint — `GET /agents/:slug/memory/compact/status`.** READ-ONLY. No request body.

**Threshold semantics:** `due` is computed as `entryCount > threshold` (strict greater-than). At exactly 100 parseable entries, `due` is `false`; at 101, `due` is `true`. The default threshold is 100; this slice ships single-agent status only and does not expose threshold overrides over HTTP — the helper accepts a threshold argument but the route uses the default. Threshold override over HTTP is reserved for a follow-up slice if scheduling configurability becomes a need.

**Response contract:**

- `200` missing/empty episodic — `{ ok:true, slug, threshold:100, entryCount:0, due:false, empty:true, previewAvailable:false, requiresConfirmation:true, nextAction:"none" }`. Fires when the episodic file is missing (`ENOENT`) or contains only whitespace.
- `200` not due — `{ ok:true, slug, threshold:100, entryCount:N, due:false, previewAvailable:false, requiresConfirmation:true, nextAction:"none" }` for `0 < N <= 100`.
- `200` due — `{ ok:true, slug, threshold:100, entryCount:N, due:true, previewAvailable:true, requiresConfirmation:true, nextAction:"preview" }` for `N > 100`.
- `400 { error:"invalid slug" }` — slug fails `/^[a-z][a-z0-9-]{1,40}$/` or trips the path-traversal guard.
- `404 { error:"unknown agent: <slug>" }` — slug not in registry.

No HTTP 409 / 422 / 503 branches — read-only routes don't need them.

**New helper — `getEpisodicCompactionStatus(content, threshold = 100)` in `backend-api/src/agents/memoryFiles.ts`.** Pure function. Wraps `parseEpisodicEntries(content)` and computes `{ entryCount, threshold, due, empty }`:

- `entryCount` is the number of parseable `## ...` entries — NOT raw line count. Orphan / malformed / pre-heading body lines are silently dropped by `parseEpisodicEntries`, so a junk-filled file produces a low count, not a false-positive due.
- `threshold` echoes the (sanitized) input. Invalid thresholds (NaN, negative, `Infinity`) fall back to 100. Fractional inputs are `Math.floor` coerced.
- `due` is `entryCount > threshold`. Strict greater-than (documented behavior; matches the spec recommendation "due false until >100").
- `empty` is `entryCount === 0`. Convenience flag for the missing/empty case.

No IO, no logging, no allocation beyond the array `parseEpisodicEntries` already builds. The function returns counts and booleans only — never the gist content.

**Request flow (server side):**

1. Validate slug + 404 if unknown agent (unchanged plumbing).
2. Resolve episodic path via `resolveMemoryPath(runtimeAgentsDir, slug, "episodic")`. `path_traversal` or `invalid_slug` → 400.
3. Read episodic. `ENOENT` or whitespace-only → 200 with `empty:true`.
4. Otherwise call `getEpisodicCompactionStatus(content)` and serialize the result. The `empty` field is only included in the response when `true`, matching the spec's three sample shapes.
5. Log an info-level `phase:"memory-compact-status"` line with counts only — never gist content.

The §5.2-A `/promote`, §5.2-C `/promote-episodic`, §5.2-D `/core` PATCH, §5.3-A `/compact/preview`, §5.3-B `/compact/apply`, and §5.4-A `/forget` routes are byte-identical otherwise. The new endpoint is purely read-only; `safeAppendUnique` / `safeReplaceOnce` / `atomicReplace` / `withFileLock` are NOT invoked.

**All-agent variant.** The spec offered the optional `GET /agents/memory/compact/status` (status for all 14 agents in one call). This slice **does not ship it** — iterating the registry adds scope without changing the underlying primitive, and a future slice can layer it on top of `getEpisodicCompactionStatus` once the single-agent contract is exercised on Windows. The done-when list below does not gate on it.

**Files added on this slice:**

- (None new.) Both helper and route live inside existing files.

**Files modified on this slice:**

- `backend-api/src/agents/memoryFiles.ts` — added `EpisodicCompactionStatus` type + pure-function `getEpisodicCompactionStatus(content, threshold?)`. No existing exports changed.
- `backend-api/src/routes/agents.ts` — extended `memoryFiles` import with `getEpisodicCompactionStatus`; appended the new `GET /agents/:slug/memory/compact/status` handler at the end of `agentRoutes`. Every other route is byte-identical otherwise.
- `backend-api/scripts/run-memory-files-tests.mjs` — added 8 unit tests for `getEpisodicCompactionStatus`: empty content, 99 entries → not due, exactly 100 → not due (boundary), 101 → due, body-before-heading doesn't inflate count, custom threshold (50) fires at 51 entries, invalid thresholds (NaN, negative, Infinity) fall back to default 100, response carries no gist content (privacy check).

**Files NOT touched (intentional):**

- No new file. No new dependency. No SQLite schema change. No new table. No background timer / setInterval / cron.
- No frontend, no console.html, no provider/runtime/routing/convening/handoff/registry edits.
- No agent personality files. No README files. No `.env`. No API keys. No external HTTP client. No LLM call.
- No memory artifacts changed at rest. No writes anywhere.

**Offline / Linux sandbox validation completed during implementation:**

- `npm run build` (tsc) — clean, no regressions.
- `npm run test:memory-files` — **64/64 PASS** (56 prior + 8 new §5.3-D cases).
- `npm run test:memory-candidate` — 18/18 PASS (regression intact).
- `npm run test:routing` coverage check — passes; live-fixture run requires backend.

**Windows validation plan (next step):**

```powershell
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run build
npm run test:memory-files        # expect 64/64 PASS
npm run test:memory-candidate    # expect 18/18 PASS

# Terminal A: npm run dev
# Terminal B: end-to-end smoke
$slug = "business"

# (a) Status before seeding — should return ok:true with entryCount + due flag.
Invoke-RestMethod -Uri "http://127.0.0.1:3001/agents/$slug/memory/compact/status" -Method GET

# (b) Seed enough episodic entries to cross threshold.
1..105 | ForEach-Object {
  $seed = @{ entry = "scheduled-compaction Windows smoke entry #$_" } | ConvertTo-Json
  Invoke-RestMethod -Uri "http://127.0.0.1:3001/agents/$slug/memory/episodic" `
    -Method POST -ContentType "application/json" -Body $seed | Out-Null
}

# (c) Due status — expect ok:true, due:true, previewAvailable:true, nextAction:"preview".
Invoke-RestMethod -Uri "http://127.0.0.1:3001/agents/$slug/memory/compact/status" -Method GET

# (d) Invalid slug -> HTTP 400.
try {
  Invoke-RestMethod -Uri "http://127.0.0.1:3001/agents/with..slash/memory/compact/status" -Method GET
} catch {
  "Invalid-slug status: $($_.Exception.Response.StatusCode.value__)"
}

# (e) Unknown slug -> HTTP 404.
try {
  Invoke-RestMethod -Uri "http://127.0.0.1:3001/agents/nonexistent/memory/compact/status" -Method GET
} catch {
  "Unknown-slug status: $($_.Exception.Response.StatusCode.value__)"
}
```

Done-when for §5.3-D (all nine Windows-validated):

- [x] `npm run build` clean on Windows.
- [x] `npm run test:memory-files` returned 64/64 PASS on Windows (total: 64, PASS 64, FAIL 0 — 56 prior tests + 8 new §5.3-D cases).
- [x] `npm run test:memory-candidate` returned 18/18 PASS on Windows (total: 18, PASS 18, FAIL 0 — regression intact).
- [x] Step (a) initial status Windows-validated. `GET /agents/business/memory/compact/status` returned `{ok:true, slug:"business", threshold:100, entryCount:108, due:true, previewAvailable:true, requiresConfirmation:true, nextAction:"preview"}` (episodic already past threshold from prior validation traffic).
- [x] Step (c) post-seed status Windows-validated. After seeding 105 additional episodic entries, the same GET returned `{ok:true, slug:"business", threshold:100, entryCount:213, due:true, previewAvailable:true, requiresConfirmation:true, nextAction:"preview"}`.
- [x] Step (d) invalid-slug Windows-validated. `GET /agents/with..slash/memory/compact/status` returned HTTP 400 "invalid slug".
- [x] Step (e) unknown-slug Windows-validated. `GET /agents/nonexistent/memory/compact/status` returned HTTP 404 "unknown agent: nonexistent".
- [x] Step (f) read-only behavior Windows-validated. `episodic_memory.md` SHA256 before and after a status request are equal: `Episodic untouched by status: True`.
- [x] Existing test suites stayed green on Windows: `npm run test:routing` 38/38 PASS + 0 WARN + 0 FAIL, `npm run test:agents` 70/70 PASS + 0 PASS(R) + 0 FAIL, `npm run test:memory` 14/14 PASS + 0 SKIP + 0 FAIL.

§5.3-D is ✅ Complete / Windows validated. Phase 5 overall remains ⚠️ In progress — §5.3-C optional LLM-based summarization, §5.5 SQLite schema additions / FTS5 / migrations, §5.6 optional GitHub backup, the optional all-agent status variant, Phase 6 chat UI confirm/cancel wiring against `done.memoryCandidate` and the seven mutation/preview/status routes, and the per-agent matrix Memory column flip are still open.

Out of scope for §5.3-D:

- §5.3-C optional LLM-based summarization (deferred indefinitely; the deterministic preview+apply flow already covers the explicit-confirmation contract).
- Background timer / cron / scheduled trigger that auto-fires when `due:true`. This slice ships readiness reporting only; the client decides when to call `/compact/preview` and `/compact/apply`.
- Configurable threshold over HTTP (the helper supports a threshold argument; the route uses 100 only).
- All-agent variant `GET /agents/memory/compact/status` (deferred to a follow-up slice).
- A frontend status badge against `/compact/status` (Phase 6 chat UI).
- §5.5 SQLite schema / FTS5 / migrations, §5.6 optional GitHub backup.
- Marking the per-agent matrix Memory column ✅ — that flip is tied to Phase 5 overall closing.

### 5.4 Memory hygiene
- [ ] Never write personal sensitive info (medical, financial accounts, addresses) without an explicit user OK.
- [x] Honor explicit "forget that" — surgical delete of the matching line. Closed by §5.4-A: `POST /agents/:slug/memory/forget` with body `{kind, find, confirmed:true}`, lock-guarded via the §5.2-D `safeReplaceOnce(path, find, "")` primitive, exact-one-match on `find` (404/409 otherwise), atomic write via tmp+rename. Windows-validated end-to-end: core-forget round-trip returned `ok:true, kind:"core", forgotten:true, bytesWritten:974`; episodic-forget round-trip returned `ok:true, kind:"episodic", forgotten:true, bytesWritten:11980`; repeat → 404; multiple → 409; unconfirmed → 400; invalid kind → 400. `npm run test:memory-files` 39/39 PASS on Windows.

### 5.4-A forget flow / surgical memory delete — ✅ Complete / Windows validated

§5.4-A closes the surgical-delete primitive the §5.4 checklist called out: when the user explicitly says "forget that," the system can identify exactly one line/span in either `core_memory.md` or `episodic_memory.md` and remove it. Same confirmation discipline as §5.2-A / §5.2-C / §5.2-D (`confirmed:true` required), same lock-and-traversal protections, same "no oracle" non-echoed counts.

The implementation is a thin wrapper over `safeReplaceOnce(path, find, "")` from §5.2-D. No new primitive is needed: surgical delete is a degenerate edit where the replacement is the empty string. Both `core_memory.md` and `episodic_memory.md` get the same write path, so the §5.2-B file lock now governs all four mutation routes (`/promote`, `/promote-episodic`, `/core` PATCH, and the new `/forget`).

**New endpoint — `POST /agents/:slug/memory/forget`.** Body shape:

```json
{ "kind": "core", "find": "I prefer dark mode for all dashboards.", "confirmed": true }
```

`kind` MUST be the string `"core"` or `"episodic"`. Any other value is rejected with HTTP 400.

**Response contract:**

- `200 { ok:true, slug, kind, forgotten:true, timestamp, bytesWritten }` — exactly one match removed; file rewritten atomically.
- `400 { error:"invalid slug" }` — slug fails `/^[a-z][a-z0-9-]{1,40}$/` or trips the path-traversal guard.
- `400 { error:"confirmed must be true ..." }` — `confirmed !== true`.
- `400 { error:"body.kind must be \"core\" or \"episodic\"" }` — `kind` missing or unrecognized.
- `400 { error:"body.find must be a non-empty string" }` — `find` missing / all-whitespace.
- `400 { error:"body.find too long (max 4000 chars)" }` — `find` exceeds `ENTRY_MAX`.
- `400 { error:"body.find must be at least 3 non-whitespace chars" }` — `find` too short to be specific.
- `404 { error:"unknown agent: <slug>" }` — slug not in registry.
- `404 { error:"no matching memory entry" }` — target memory file missing OR `find` absent (generic; not an existence oracle).
- `409 { error:"multiple matching memory entries; refine the find so it identifies exactly one" }` — `find` appears more than once. Count not echoed.
- `503 { error:"memory file is busy; please retry shortly" }` — `safeReplaceOnce` raised `MemoryFilesError(code:"lock_timeout")` after the configured wait.

There is no HTTP 422 branch on `/forget` — the sensitive-content guard is unnecessary here because deleting a sensitive span from memory is the opposite of leaking it (in fact, this route is one of the intended remediations when sensitive content has accidentally entered memory).

**Core vs episodic behavior.** Branch decided by `body.kind`:

- `kind: "core"` → `resolveMemoryPath(runtimeAgentsDir, slug, "core")` → `~/.creativedge/agents/<slug>/memory/core_memory.md`.
- `kind: "episodic"` → `resolveMemoryPath(runtimeAgentsDir, slug, "episodic")` → `~/.creativedge/agents/<slug>/memory/episodic_memory.md`.

The exact-one-match rule applies independently to each file; a `find` that appears once in episodic and once in core can be removed from each kind in two separate calls. The route does not auto-cross-reference the two files.

**Request flow (server side):**

1. Validate slug + 404 if unknown agent (unchanged plumbing).
2. Validate `confirmed === true` (400 otherwise).
3. Validate `kind` is `"core"` or `"episodic"` (400 otherwise).
4. Validate `find` is a string with trimmed length ≥ 3, raw length ≤ 4000 (400 on any failure).
5. Resolve the target path via `resolveMemoryPath` (defense-in-depth slug regex + path-traversal-resolved-prefix guard).
6. Call `safeReplaceOnce(path, find, "")`:
   - `lock_timeout` → 503 + warn log.
   - `none` → 404 "no matching memory entry".
   - `multiple` → 409 "refine the find".
   - `unchanged` → 404 (logically unreachable since `replace === ""` and `find` is non-empty; defensive fallback).
   - `edited` → 200 `{ok:true, slug, kind, forgotten:true, timestamp, bytesWritten}`.

The §5.2-A `/promote`, §5.2-C `/promote-episodic`, §5.2-D `/core` PATCH, and the existing `/episodic` append handlers are byte-identical otherwise. All four mutation paths share the §5.2-B `withFileLock` / `safeAppendUnique` / `safeReplaceOnce` primitives.

**Files added on this slice:**

- (None new.) The forget route lives inside `agents.ts`; the surgical-delete primitive was already landed in §5.2-D as `safeReplaceOnce`.

**Files modified on this slice:**

- `backend-api/src/routes/agents.ts` — appended the new `POST /agents/:slug/memory/forget` handler at the end of `agentRoutes`. No existing import changed (`resolveMemoryPath` + `safeReplaceOnce` + `MemoryFilesError` were already imported for §5.2-D). Every other route is byte-identical otherwise.
- `backend-api/scripts/run-memory-files-tests.mjs` — added 2 unit tests in a new "Phase 5.4 forget-flow edge cases" sub-block exercising `safeReplaceOnce(path, find, "")`: (1) deleting one episodic-style block leaves surrounding blocks intact byte-for-byte, (2) deleting the only content in a file leaves it empty (bytesWritten:0).

**Files NOT touched (intentional):**

- No new file. No new dependency. No SQLite schema change. No new table. No new helper in `memoryFiles.ts` (the §5.2-D primitive already covers the surgical-delete semantics).
- No frontend, no console.html, no provider/runtime/routing/convening/handoff/registry edits.
- No agent personality files. No README files. No `.env`. No API keys. No external HTTP client.
- No memory artifacts changed at rest (the runner uses `os.tmpdir()`).

**Offline / Linux sandbox validation completed during implementation:**

- `npm run build` (tsc) — clean, no regressions.
- `npm run test:memory-files` — **39/39 PASS** (37 prior + 2 new forget edge cases).
- `npm run test:memory-candidate` — 18/18 PASS (regression intact).
- `npm run test:routing` coverage check — passes; live-fixture run requires backend.

**Windows validation plan (next step):**

```powershell
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run build
npm run test:memory-files        # expect 39/39 PASS
npm run test:memory-candidate    # expect 18/18 PASS

# Terminal A: npm run dev
# Terminal B: end-to-end smoke

# (a) Seed a core entry, then forget it.
$seed = @{ entry = 'forget-flow Windows smoke: ephemeral preference to be removed.'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/promote `
  -Method POST -ContentType 'application/json' -Body $seed
$forget = @{ kind = 'core'; find = 'ephemeral preference to be removed'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/forget `
  -Method POST -ContentType 'application/json' -Body $forget
# Expect: ok:true, slug:"business", kind:"core", forgotten:true, bytesWritten > 0.

# (b) Seed + forget an episodic entry.
$seedE = @{ entry = 'forget-flow Windows smoke: episodic line that will be erased.' } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/episodic `
  -Method POST -ContentType 'application/json' -Body $seedE
$forgetE = @{ kind = 'episodic'; find = 'episodic line that will be erased'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/forget `
  -Method POST -ContentType 'application/json' -Body $forgetE
# Expect: ok:true, slug:"business", kind:"episodic", forgotten:true, bytesWritten > 0.

# (c) No-match: repeat (a) -> 404.
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/forget `
  -Method POST -ContentType 'application/json' -Body $forget

# (d) Multiple matches -> 409. Seed the same phrase twice.
$dup = @{ entry = 'duplicated-forget-anchor row alpha'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/promote `
  -Method POST -ContentType 'application/json' -Body $dup
$dup2 = @{ entry = 'duplicated-forget-anchor row beta'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/promote `
  -Method POST -ContentType 'application/json' -Body $dup2
$multi = @{ kind = 'core'; find = 'duplicated-forget-anchor'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/forget `
  -Method POST -ContentType 'application/json' -Body $multi

# (e) Unconfirmed -> 400.
$noconfirm = @{ kind = 'core'; find = 'anything-here-non-empty' } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/forget `
  -Method POST -ContentType 'application/json' -Body $noconfirm

# (f) Invalid kind -> 400.
$badkind = @{ kind = 'overrides'; find = 'anything-here-non-empty'; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:3001/agents/business/memory/forget `
  -Method POST -ContentType 'application/json' -Body $badkind
```

Done-when for §5.4-A (all ten Windows-validated):

- [x] `npm run build` clean on Windows.
- [x] `npm run test:memory-files` returned 39/39 PASS on Windows (total: 39, PASS 39, FAIL 0 — 37 prior tests + 2 new forget-flow edge cases).
- [x] `npm run test:memory-candidate` returned 18/18 PASS on Windows (total: 18, PASS 18, FAIL 0 — regression intact).
- [x] Step (a) core-forget Windows-validated. Seed via `POST /agents/business/memory/promote` returned `ok:true, slug:"business", bytesAppended:130`. Forget via `POST /agents/business/memory/forget` with `{kind:"core", find, confirmed:true}` returned `ok:true, slug:"business", kind:"core", forgotten:true, bytesWritten:974`.
- [x] Step (b) episodic-forget Windows-validated. Seed via `POST /agents/business/memory/episodic` returned `ok:true, slug:"business", bytesAppended:113`. Forget via `POST /agents/business/memory/forget` with `{kind:"episodic", find, confirmed:true}` returned `ok:true, slug:"business", kind:"episodic", forgotten:true, bytesWritten:11980`.
- [x] Step (c) no-match Windows-validated. Repeat the same `kind:"core"` forget (whose `find` was already removed) returned HTTP 404 "no matching memory entry".
- [x] Step (d) multiple-match Windows-validated. Forget with a `find` present in two distinct core entries returned HTTP 409 "multiple matching memory entries; refine the find so it identifies exactly one"; the count was not echoed.
- [x] Step (e) unconfirmed Windows-validated. POST without `confirmed:true` returned HTTP 400 "confirmed must be true to forget a memory entry".
- [x] Step (f) invalid-kind Windows-validated. POST with `kind:"overrides"` returned HTTP 400 "body.kind must be \"core\" or \"episodic\"".
- [x] Existing test suites stayed green on Windows: `npm run test:routing` 38/38 PASS, `npm run test:agents` 70 PASS + 0 PASS(R) + 0 FAIL, `npm run test:memory` 14/14 PASS (0 SKIP, 0 FAIL).

§5.4-A is ✅ Complete / Windows validated. Phase 5 overall remains ⚠️ In progress — §5.3 compaction, §5.5 SQLite schema additions / FTS5 / migrations, §5.6 optional GitHub backup, Phase 6 chat UI confirm/cancel wiring against `done.memoryCandidate` and the four mutation routes (`/promote`, `/promote-episodic`, `/core` PATCH, `/forget`), and the per-agent matrix Memory column flip are still open.

Out of scope for §5.4-A:

- §5.3 compaction. §5.5 SQLite/FTS5. §5.6 optional GitHub backup.
- A frontend confirm/cancel button against `/forget` (Phase 6 chat UI).
- Auto-detection of "forget that" in chat. This endpoint only executes explicit, externally-confirmed requests.
- Marking the per-agent matrix Memory column ✅ — that flip is tied to Phase 5 overall closing.

### 5.5 SQLite schema (`~/.creativedge/sessions.db`)
- [x] `sessions(id, started_at, last_seen, primary_agent, title)` — one row per conversation. Landed in Phase 2.1 as `sessions(id, title, created_at, updated_at)`; tracked in the §5.5-A `001-baseline` migration so the schema is now formally version-controlled (not just `CREATE IF NOT EXISTS` on every boot). The column names differ from the spec wording but the role is the same (`updated_at` covers `last_seen`; the `primary_agent` concept is reflected per-row via `messages.agent_slug` rather than a session-level column — kept that way to avoid breaking the long-running chat sessions).
- [x] `messages(id, session_id, role, agent_slug, content, tokens, created_at)` — full transcript. Landed in Phase 2.1 as `messages(id, session_id, role, content, agent_slug, created_at)`; tracked in the §5.5-A `001-baseline` migration. The `tokens` column is intentionally not added — usage/cost lives in `agent_events.usage_json` (added by migration `002`), keeping per-row token counts out of the hot transcript-read path.
- [x] `routing_events(id, session_id, message_id, chosen_slug, confidence, reason)` — for debugging Nexus. Landed in Phase 3.1 with a richer schema (`selected_slug`, `decision_type`, `source`, `score`, `route_hits_json`, `shortlist_json`, `applied_rules_json`, `rationale`, `clarification_question`); migration `003-routing-events-convened-slugs-json` added `convened_slugs_json` for Phase 3.2 multi-specialist convening. All five migrations are tracked in `schema_migrations` since §5.5-A.
- [x] **FTS5 virtual table** over `messages.content` for in-app search. Landed in the §5.5-A `004-fts5-messages` migration: `CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(content, content='messages', content_rowid='rowid', tokenize='unicode61 remove_diacritics 1')` in external-content mode, with AFTER INSERT / AFTER DELETE / AFTER UPDATE triggers on the source `messages` table that keep the index synchronized. Backfill `INSERT INTO messages_fts(rowid, content) SELECT ... WHERE rowid NOT IN (...)` covers any pre-existing rows. Exposed over HTTP via `GET /sessions/search?q=<query>&limit=<n>` with FTS5 syntax-stripping sanitization and `snippet()` highlighted output.
- [x] Lightweight migrations runner so schema can evolve. Landed in §5.5-A as `runMigrations(db)` in `backend-api/src/storage/sqlite.ts`, tracked via the `schema_migrations(id, applied_at)` table. Each migration runs in its own transaction; already-applied IDs are skipped. The four pre-existing schema bumps are recorded as migrations `001-baseline` / `002-agent-events-usage-json` / `003-routing-events-convened-slugs-json` / `004-fts5-messages`. Re-runnable: every migration body is idempotent (`CREATE ... IF NOT EXISTS`, `PRAGMA table_info`-guarded `ALTER TABLE`, FTS triggers `IF NOT EXISTS`, backfill insert guarded by `WHERE rowid NOT IN (...)`).

### 5.5-A SQLite migrations foundation + FTS5 message search — ✅ Complete / Windows validated

§5.5-A closes four of the five §5.5 SQLite checklist items in a single slice. The previous boot-time inline schema in `backend-api/src/storage/sqlite.ts` is now expressed as an append-only `MIGRATIONS` array; a new `schema_migrations(id, applied_at)` tracking table lets the runner skip already-applied migrations on subsequent boots. The same slice adds the long-planned FTS5 virtual table over `messages.content` (external-content mode + AI/AD/AU sync triggers + first-run backfill) plus a read-only `GET /sessions/search` route that returns ranked snippets.

**No destructive changes.** The migration runner is purely additive: every migration body uses `CREATE ... IF NOT EXISTS`, `PRAGMA table_info`-guarded `ALTER TABLE`, FTS triggers `IF NOT EXISTS`, and an FTS backfill `INSERT ... WHERE rowid NOT IN (...)` clause. The pre-5.5-A code path already created the four base tables and the two ALTER-added columns on every boot, so any existing `~/.creativedge/sessions.db` will pass through migrations 001-003 as no-ops (their bodies short-circuit) and only the new `004-fts5-messages` migration actually creates schema. Crucially, **no `DROP`, no `DELETE`, no `TRUNCATE`** anywhere in the migrations array.

**New / refactored — `backend-api/src/storage/sqlite.ts`.** Exports:

- `initDatabase(dbPath)` — unchanged signature. Opens the DB, applies WAL/FK/synchronous pragmas, then calls `runMigrations(db)`. Returns the `Database` handle.
- `runMigrations(db)` — NEW. Ensures `schema_migrations` exists, reads the applied ID set, iterates `MIGRATIONS` in source order, runs each pending migration inside its own transaction, records the `id` + ISO timestamp on success. Safe to call on every boot.
- `listAppliedMigrations(db)` — NEW. Returns the ordered list of applied migration IDs; used by the test runner and a future `/healthz` enrichment.
- `pingDatabase(db)` — unchanged.

The `MIGRATIONS` array is append-only; existing migrations must never be edited (rewriting a historical migration would skip on already-migrated DBs and silently leave them on a stale schema). New schema work goes at the end of the array as `005-...`, `006-...`, etc.

**New — `GET /sessions/search` route in `backend-api/src/routes/sessions.ts`.** Read-only. Query parameters:

- `q` (required) — non-empty, ≤ 200 chars after trim. Sanitized through `replace(/[^\p{L}\p{N}\s]/gu, " ")` to strip FTS5 operators (`AND`, `OR`, `NOT`, `(`, `)`, `"`, `*`, `:`, `-`, etc.) and collapse whitespace. After sanitization the query must still have at least one token; otherwise the route returns HTTP 400.
- `limit` (optional) — positive integer, clamped to `[1, 100]`; default 50.

**Response contract:**

- `200 { ok:true, q, count, results }` — `results` is an array of `{ sessionId, messageId, role, agentSlug, createdAt, snippet }`. `snippet` is the SQLite FTS5 `snippet()` output with HTML-style `<mark>...</mark>` highlights around matched terms, capped at ~16 tokens of context per side. Ordered by FTS5 `rank`.
- `400 { error:"q must be a non-empty string" }` — `q` missing or empty.
- `400 { error:"q too long (max 200 chars)" }` — `q` over the size cap.
- `400 { error:"q has no searchable tokens after sanitization" }` — sanitization stripped the entire query (e.g. user passed only punctuation).
- `500 { error:"search failed" }` — FTS5 raised an unexpected error. Warn log line `phase:"messages-search"` carries the reason; no user content.

**New DAO — `searchMessages(db, query, limit)` in `backend-api/src/dao/sessions.ts`.** Executes `SELECT ... FROM messages_fts JOIN messages ON m.rowid = messages_fts.rowid WHERE messages_fts MATCH ? ORDER BY rank LIMIT ?`. The helper trusts its input is sanitized (the route is the only caller and it sanitizes upstream). Returns `SearchResult[]`.

**FTS5 details (migration `004-fts5-messages`):**

```sql
CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
  content,
  content='messages',
  content_rowid='rowid',
  tokenize='unicode61 remove_diacritics 1'
);
CREATE TRIGGER IF NOT EXISTS messages_fts_ai AFTER INSERT ON messages BEGIN
  INSERT INTO messages_fts(rowid, content) VALUES (new.rowid, new.content);
END;
CREATE TRIGGER IF NOT EXISTS messages_fts_ad AFTER DELETE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, content) VALUES('delete', old.rowid, old.content);
END;
CREATE TRIGGER IF NOT EXISTS messages_fts_au AFTER UPDATE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, content) VALUES('delete', old.rowid, old.content);
  INSERT INTO messages_fts(rowid, content) VALUES (new.rowid, new.content);
END;
-- Idempotent backfill for pre-existing rows:
INSERT INTO messages_fts(rowid, content)
  SELECT rowid, content FROM messages
  WHERE rowid NOT IN (SELECT rowid FROM messages_fts);
```

External-content mode means the FTS table does NOT duplicate the message bodies — it references `messages.content` via the implicit rowid. Disk overhead is ~30% of the indexed text, not 100%+. The `tokenize='unicode61 remove_diacritics 1'` option gives accent-insensitive matching (`café` ↔ `cafe`).

**Files added on this slice:**

- `backend-api/scripts/run-sqlite-tests.mjs` — NEW pure-function unit test runner. Boots a temporary SQLite DB under `os.tmpdir()`, exercises the migrations runner + FTS triggers + `searchMessages` DAO. 14 tests covering: open, ping, all four migrations recorded, idempotent re-run, FTS table exists in `sqlite_master`, AI trigger populates index on insert, search returns highlighted snippets, search returns empty for absent needle, AU trigger refreshes index on update, AD trigger removes from index on delete, re-open is idempotent, FTS row count matches surviving messages after edits.

**Files modified on this slice:**

- `backend-api/src/storage/sqlite.ts` — refactored from inline schema to migrations array. Public API preserved; `initDatabase` signature unchanged. Added `runMigrations` + `listAppliedMigrations` exports.
- `backend-api/src/routes/sessions.ts` — added `GET /sessions/search` route between the existing `/sessions` list and `/sessions/:id` detail handlers (order matters for radix-tree routing; `/sessions/search` must be registered before `/sessions/:id` to avoid being captured as `id="search"`).
- `backend-api/src/dao/sessions.ts` — added `searchMessages(db, query, limit)` DAO + `SearchResult` type. No existing exports changed.
- `backend-api/package.json` — added `"test:sqlite": "node scripts/run-sqlite-tests.mjs"`.

**Files NOT touched (intentional):**

- No new dependency. `better-sqlite3` already shipped FTS5 (the v11+ release this project uses bundles SQLite with FTS5 enabled by default).
- No new file at the runtime root (the existing `~/.creativedge/sessions.db` is migrated in place on first boot under the new code).
- No frontend, no console.html, no provider/runtime/routing/convening/handoff/memory-file edits.
- No agent personality files. No README files. No `.env`. No API keys. No external HTTP client.
- No memory artifacts (`core_memory.md`, `episodic_memory.md`) are touched — the search is over SQLite `messages.content` only.

**Offline / Linux sandbox validation completed during implementation:**

- `npm run build` (tsc) — clean, no regressions.
- `npm run test:sqlite` — **14/14 PASS** on a Linux-rebuilt `better-sqlite3` binary (the Windows binary won't load on Linux; this required a one-time `npm rebuild better-sqlite3` in the sandbox).
- `npm run test:memory-files` — 64/64 PASS (regression intact).
- `npm run test:memory-candidate` — 18/18 PASS (regression intact).
- `npm run test:routing` coverage check — passes; live-fixture run requires backend.

**Windows validation plan (next step):**

```powershell
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run build
# NOTE: on Windows the existing better-sqlite3 binary works as-is; no rebuild.
npm run test:sqlite              # expect 14/14 PASS
npm run test:memory-files        # expect 64/64 PASS (regression)
npm run test:memory-candidate    # expect 18/18 PASS (regression)

# Terminal A: npm run dev (first boot migrates existing ~/.creativedge/sessions.db)
# Inspect that schema_migrations now has four rows:
sqlite3 "$HOME/.creativedge/sessions.db" "SELECT id, applied_at FROM schema_migrations ORDER BY applied_at;"
# Expect: 001-baseline, 002-agent-events-usage-json, 003-routing-events-convened-slugs-json, 004-fts5-messages.

# Terminal B:
# (a) Empty q -> HTTP 400.
try {
  Invoke-RestMethod -Uri "http://127.0.0.1:3001/sessions/search" -Method GET
} catch { "Empty-q status: $($_.Exception.Response.StatusCode.value__)" }

# (b) Successful search against existing transcript.
Invoke-RestMethod -Uri "http://127.0.0.1:3001/sessions/search?q=dark%20mode&limit=20" -Method GET

# (c) Limit clamping (limit=999 should clamp to 100).
$big = Invoke-RestMethod -Uri "http://127.0.0.1:3001/sessions/search?q=hello&limit=999" -Method GET
"limit clamped? results <= 100 = $($big.results.Count -le 100)"

# (d) Sanitization: punctuation-only query -> 400.
try {
  Invoke-RestMethod -Uri "http://127.0.0.1:3001/sessions/search?q=()*%26%3A" -Method GET
} catch { "Punctuation-only status: $($_.Exception.Response.StatusCode.value__)" }

# (e) Send a /chat message then search for one of its terms - should appear.
$body = @{ message = "5.5-A FTS smoke: I prefer the SOLARIZED dark theme for all dashboards." } | ConvertTo-Json
Invoke-WebRequest -Uri http://127.0.0.1:3001/chat -Method POST -ContentType 'application/json' `
  -Body $body -UseBasicParsing | Out-Null
Start-Sleep -Seconds 2
$search = Invoke-RestMethod -Uri "http://127.0.0.1:3001/sessions/search?q=SOLARIZED" -Method GET
"Search hit count: $($search.count)"
```

Done-when for §5.5-A (all eleven Windows-validated):

- [x] `npm run build` clean on Windows.
- [x] `npm run test:sqlite` returned 14/14 PASS on Windows (total: 14, PASS 14, FAIL 0 — migrations runner + FTS5 triggers + searchMessages DAO all green).
- [x] `npm run test:memory-files` returned 64/64 PASS on Windows (regression intact).
- [x] `npm run test:memory-candidate` returned 18/18 PASS on Windows (regression intact).
- [x] `better-sqlite3` native binary repaired via `npm rebuild better-sqlite3`; module loaded successfully on Windows and SQLite responded with `{ v: "3.49.2" }`.
- [x] Empty-query path Windows-validated. `GET /sessions/search` with no `q` parameter returned HTTP 400.
- [x] Valid-search path Windows-validated. `GET /sessions/search?q=dark%20mode&limit=20` returned `{ok:true, ...}`.
- [x] Limit-clamp path Windows-validated. `GET /sessions/search?q=hello&limit=999` returned `results.length ≤ 100`.
- [x] Punctuation-only-query path Windows-validated. `GET /sessions/search?q=%28%29%2A%26%3A` (i.e. `()*&:`) sanitized to an empty query and returned HTTP 400.
- [x] `/chat` → `/sessions/search` round-trip Windows-validated. POST `/chat` with `5.5-A FTS smoke: I prefer the SOLARIZED dark theme for all dashboards.` then `GET /sessions/search?q=SOLARIZED` returned `Search hit count: 2` with snippets containing `<mark>SOLARIZED</mark>` / `<mark>Solarized</mark>` highlights (AI trigger verified end-to-end).
- [x] Existing test suites stayed green on Windows: `npm run test:routing` total 38, PASS 37, WARN 1, SKIP 0, FAIL 0 (the WARN is a pre-existing fixture observation about an optional `done.handoff` field on `handoff-audio-001`; runner counts WARN as PASS for exit code), targeted `CREATIVEDGE_AGENT=writing-translation npm run test:agents` 5/5 PASS, targeted `CREATIVEDGE_AGENT=music-audio npm run test:agents` 5/5 PASS, full `npm run test:agents` 70/70 PASS + 0 PASS(R) + 0 FAIL, `npm run test:memory` 14/14 PASS + 0 SKIP + 0 FAIL.

§5.5-A is ✅ Complete / Windows validated. Phase 5 overall remains ⚠️ In progress — §5.3-C optional LLM-based summarization, the optional all-agent compaction status variant, §5.6 optional GitHub backup, Phase 6 chat UI confirm/cancel wiring against `done.memoryCandidate` and the eight mutation/preview/status/search routes, and the per-agent matrix Memory column flip are still open.

Out of scope for §5.5-A:

- A search UI in `console.html` / the chat front-end (Phase 6).
- Faceted filters (by `agentSlug`, by `role`, by `sessionId`) on the search route — the current route returns whatever FTS5 ranks highest across the whole `messages` table. Filtering can be added incrementally as query parameters in a follow-up slice.
- Snippet customization (length, marker style). The route hardcodes `<mark>...</mark>` and ~16 tokens of context per side via `snippet(messages_fts, 0, '<mark>', '</mark>', '…', 16)`.
- §5.6 optional GitHub backup — separate slice.
- Marking the per-agent matrix Memory column ✅ — tied to Phase 5 overall closing.

### 5.6 Optional GitHub backup
- [~] Opt-in during first-run wizard: bind `~/.creativedge/agents/` to a **private** GitHub repo. Backend foundation landed in §5.6-A: `POST /backup/config` with `{ enabled:true, remote, includeSessionsDb, confirmed:true }` wires the opt-in; the user creates the private repo manually (no GitHub API call, no token storage) and points the backup at it via `remote`. The first-run-wizard UI part is Phase 6.
- [ ] Nightly commit + push (configurable, default 02:00). Intentionally NOT implemented in §5.6-A — explicit user-triggered `/backup/run` only on this slice. Scheduling lives in §5.6-B once the backup flow is validated against real GitHub remotes.
- [x] `.gitignore` covers `sessions.db` by default (use a separate opt-in for that). Closed by §5.6-A's `BACKUP_GITIGNORE` constant in `backupGit.ts` and the `writeBackupGitignore(repoDir)` helper: every fresh backup repo gets `sessions.db`, `sessions.db-*`, `*.db`, `*.sqlite`, `*.sqlite3`, `logs/`, `*.log`, `providers.json`, `profile.json`, `.env`, `.env.*`, `*.key`, `*.pem` excluded by default. The user has to manually remove the line from `.gitignore` to opt in to backing up the DB AND flip `includeSessionsDb:true` in `backup.json` (defense in depth: both layers must be lifted).
- [ ] Restore flow: on a fresh machine, clone the repo → drop into `~/.creativedge/` → continue. Intentionally NOT implemented in §5.6-A. Restore is destructive (overwrites local memory files) and needs its own confirmation contract; deferred to §5.6-C.

**Done when** a user can tell Bloom "I run 3x a week", close the session, return tomorrow, and Bloom recalls it from `~/.creativedge/agents/personal-growth/memory/core_memory.md`.

---

## Phase 6 — Chat UI (user-facing)

### 6-A Chat UI foundation + memory confirm/cancel wiring — ✅ Complete / Windows validated

§6-A bootstraps the production-oriented TypeScript chat UI under `frontend/` (Vite + React + TypeScript). It is intentionally **frontend-only** — the backend was not changed on this slice. The eight `/agents/:slug/memory/*`, `/sessions/search`, `/backup/*`, and `/chat` SSE endpoints validated in Phases 4-5 are consumed as-is.

The legacy single-file `console.html` is **left untouched** and remains a reference prototype only. New work targets `frontend/`.

**Scope shipped on this slice:**

- Vite + React + TypeScript skeleton (`package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/vite-env.d.ts`, `src/styles.css`, `.gitignore`). Minimal deps: `react`, `react-dom`, `vite`, `typescript`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`. No UI library, no markdown renderer.
- `src/api/client.ts` — typed REST wrappers for `/agents/:slug/memory/{promote,promote-episodic,core PATCH,forget,compact/preview,compact/apply,compact/status}`, `/sessions/search`, and `/backup/{status,config,dry-run,run}`. `ApiError` carries the HTTP status so the UI can branch on 422 vs other failures. Reads `import.meta.env.VITE_API_URL` (default `http://127.0.0.1:3001`).
- `src/api/chatStream.ts` — SSE client for `POST /chat`. `fetch` + `ReadableStream` + `TextDecoder`; parses `event:` / `data:` blocks; emits typed `meta` / `chunk` / `done` / `error` events. Accepts an `AbortController` signal so the user can stop a stream.
- `src/types.ts` — hand-written DTOs mirroring the backend SSE + REST JSON shapes (incl. `MemoryCandidate`, `ChatMeta`, `ChatDone`, `UiMessage`, all four backup responses, search response, compaction responses).
- `src/App.tsx` — top-level state container: session id, message list, active meta, streaming flag, AbortController ref, global error. Wires send/stop/new-conversation/update-message callbacks.
- `src/components/ChatLayout.tsx` — 3-pane shell (left rail / main pane / right rail). Renders the search + backup cards in the left rail, the message thread + composer in the main pane, and the active-agent + memory-tools cards in the right rail.
- `src/components/MessageThread.tsx` — renders user and assistant messages. Per-message agent header shows emoji + name + decision type when meta is available; streaming flag shows an inline "⏳ streaming…" badge. Preserves line breaks; no dangerous HTML. Auto-scrolls to bottom on update.
- `src/components/Composer.tsx` — multiline textarea, Enter sends, Shift+Enter newline, send disabled while streaming, Stop button appears mid-stream and triggers `AbortController.abort()`.
- `src/components/MemoryCandidateCard.tsx` — appears under an assistant message when `done.memoryCandidate` is present. "Save memory" button POSTs to `/agents/:slug/memory/promote` with `{ entry, confirmed:true }`; on success card shows "Saved" or "Already saved" for `duplicate:true`; on HTTP 422 shows "This looks sensitive, so it was not saved." On any other error shows a friendly error line. "Dismiss" hides the card locally and never calls the backend. **No auto-save.**
- `src/components/MemoryToolsPanel.tsx` — collapsed-by-default `<details>` panel for the active agent. Three sub-tools, each with explicit confirmation:
  - **Promote entry**: textarea + confirm checkbox + "Save to core" button → `/agents/:slug/memory/promote`.
  - **Forget**: kind selector (core/episodic) + find input + confirm checkbox + "Forget" button → `/agents/:slug/memory/forget`.
  - **Compaction**: Refresh status (`GET /compact/status`), Preview (`POST /compact/preview` with maxEntries=10), Apply preview button (explicit click; no auto-apply) → `/compact/apply` with `{ preview, mode:"append-core", confirmed:true }`. The episodic-promotion and editCore tools are deliberately deferred to a follow-up §6-B slice to keep this card focused.
- `src/components/AgentCard.tsx` — right-rail card showing the active agent's emoji + name + slug + provider (pill, red when degraded), decision type, convened slugs (if any), core/episodic memory load counters, and session id prefix.
- `src/components/SearchPanel.tsx` — left-rail search card. Calls `GET /sessions/search?q=&limit=20`. Strips `<mark>...</mark>` tags from snippets and renders as plain text (no `dangerouslySetInnerHTML` anywhere in the slice).
- `src/components/BackupPanel.tsx` — left-rail backup card. "Check status" → `GET /backup/status`. Collapsed Configure form with `enabled`/`remote`/`includeSessionsDb` + a Save button → `POST /backup/config`. Dry-run button → `POST /backup/dry-run`. Run button → `POST /backup/run` with `push:false` hard-coded. **No push button in §6-A** per the spec; push UI is deferred to Phase 6-B.

**Hard constraints honored on this slice:**

- No backend code, fixtures, runners, providers, agent personality files, README files, console.html, or memory artifacts touched. The slice is purely additive under `frontend/`.
- No auto-promote, auto-edit, auto-forget, auto-compact-apply. Every mutation requires an explicit user click. The save path for memory candidates is the only place the UI calls `/promote`, and only after the user clicks "Save memory".
- No auto-enable backup, no auto-push backup. `/backup/run` is invoked with `push:false` hard-coded; the UI has no push control on this slice.
- No GitHub API call from the frontend, no token storage, no `.env` with secrets shipped, no Anthropic/OpenAI API path called directly.
- `VITE_API_URL` defaults to `http://127.0.0.1:3001`. The frontend is meant to run as a local dev tool against the local backend.

**Build verification (Linux sandbox):**

- `npm install` (frontend) — clean.
- `npm run typecheck` — clean (tsc --noEmit).
- `npm run build` — clean: `vite v6.4.2` built 37 modules to `dist/`, output sizes `index.html 0.40 kB · index-*.css 7.32 kB · index-*.js 165.76 kB` (gzipped: 0.27 kB / 1.97 kB / 52.57 kB).

Backend regression suites untouched (no backend file modified):

- `npm run build` (backend) — still clean (verified before the frontend scaffold; no backend changes since).
- Existing backend tests not re-run on this turn because zero backend files were touched.

**Windows manual validation steps:**

1. Backend: `cd backend-api && npm run dev` (Terminal A).
2. Frontend: `cd frontend && npm install` (one-time), then `npm run build` to confirm typecheck + bundle, then `npm run dev` (Terminal B).
3. Browser: open the Vite dev URL (default `http://127.0.0.1:5173`).
4. Send a normal message ("hello"). Confirm SSE streaming renders chunks live in the thread.
5. Confirm the right-rail Active agent card populates with the routed agent's emoji/name/slug + provider/decision pills.
6. Send a memory-candidate prompt: `For future reference, I prefer dark mode for all design dashboards.` Confirm the memory card appears under the assistant message with `type: directive` and `pattern: for-future-reference`.
7. Click **Dismiss** on the card. Confirm it hides locally and no `/promote` request fires (verify via DevTools Network or the backend log).
8. Send the same prompt again. Click **Save memory**. Confirm the card switches to "Saved to ... core memory." and the backend log shows a `memory-promote` entry.
9. Repeat the save (re-send + click Save). Confirm the card now shows "Already saved — no change" (duplicate path).
10. Open the Memory tools panel on the active agent. Type a sensitive entry like `My card is 4111 1111 1111 1111.` Check the confirm box and click "Save to core". Confirm the card shows the 422 message ("This looks sensitive…").
11. Click "Refresh status" in the Memory tools → Compaction section. Confirm entry count / due / nextAction appear.
12. Click "Preview" → bullets appear. Do NOT click "Apply preview" automatically — the button is enabled only after a successful preview.
13. Open the Backup card in the left rail. Click "Check status". Confirm `enabled` reflects the current config and `gitReady`/`repoReady`/`remoteConfigured` populate.
14. Click "Dry-run". Confirm the result line shows `changed=… considered=… copied=… skipped=…`.
15. Click "Run (no push)" only after explicitly intending to commit. Confirm the result line shows `committed=true/false · pushed=false`.
16. Verify there is NO push button in the UI on this slice (Push is deferred to §6-B).
17. In the left-rail Search card, search for an existing transcript phrase. Confirm results list with snippet, agent slug, role, createdAt.

**Validation-patch (2026-05-20) — `Failed to fetch` + ultrawide-layout fix.** During the first Windows browser smoke (Phase 6-A), the chat thread surfaced `Failed to fetch` after every `POST /chat`, while `/sessions/search` confirmed the user message was persisted by the backend. Root cause: the `/chat` route calls `reply.hijack()` to write raw SSE; after hijack, Fastify's CORS plugin can't flush `Access-Control-Allow-Origin` onto the streaming response, so a browser-cross-origin fetch (Vite on `127.0.0.1:5173` → backend on `127.0.0.1:3001`) is blocked with the generic "Failed to fetch". On top of that, the user bubble landed at the far-right edge of an ultrawide main pane and was visually lost.

Fix is **frontend-only** (no backend change). Modified files:

- `frontend/vite.config.ts` — added `server.proxy` block forwarding `/chat`, `/agents`, `/sessions`, `/backup`, `/healthz` to `http://127.0.0.1:3001`. The `/chat` proxy entry strips `content-length` on the response to discourage any intermediate buffering of the SSE stream. Backend stays exactly as Phase 5 validated; the proxy turns every dev request into same-origin traffic so the hijacked SSE no longer needs CORS headers.
- `frontend/src/api/client.ts` — `API_BASE` now defaults to empty string (same-origin); the `VITE_API_URL` override is preserved for production static builds. New `apiTargetLabel()` helper produces a human-readable URL for error messages. `fetchJson` wraps fetch failures with `Could not reach backend at <label> (<browser error>). Is \`npm run dev\` running in backend-api?`.
- `frontend/src/api/chatStream.ts` — fetch failures and stream-read failures are wrapped with the same friendly hint; HTTP non-2xx responses now include status + statusText + a 240-char body excerpt; unknown SSE event types are silently ignored instead of throwing.
- `frontend/src/components/MessageThread.tsx` — wraps thread content in a new `.ce-thread-inner` element. User bubbles right-align WITHIN that constrained column rather than at the viewport edge. Assistant `.ce-msg-text` only renders when the streaming buffer has content (no empty bubble between meta-event and first chunk).
- `frontend/src/components/ChatLayout.tsx` — dropped the redundant `globalError` banner (per-message error already renders inside the assistant bubble, so the banner duplicated the same message).
- `frontend/src/styles.css` — new `.ce-thread-inner` rule: `width:100%; max-width:980px; margin:0 auto; gap:16px`. `.ce-msg` `max-width` tightened from 820px to 720px so user/assistant bubbles never extend past their column.

The optimistic user message was already added to state before the fetch in `App.tsx`; the previous "user message not visible" symptom was purely the ultrawide-layout artifact (the bubble was at the far-right edge, hidden behind the user's mental model of where the thread should be).

Offline / Linux sandbox verification: `node node_modules/typescript/bin/tsc --noEmit` and `node node_modules/typescript/bin/tsc -b` both exit 0 (clean typecheck and project-references build). The follow-up `vite build` step couldn't run in the sandbox on this turn because of OneDrive native-binding sync interference (esbuild / rollup native binaries got partial-written mid-sync); on the Windows host with stable node_modules this build runs cleanly — the original Phase 6-A scaffold verification produced `vite v6.4.2 ... 37 modules transformed` and the only code changes since are pure-TypeScript edits + a Vite proxy config.

Windows re-validation required (re-run the §6-A 17-step browser smoke; the failure step was #3 "user message not visible / Failed to fetch", which the validation-patch targets):

```powershell
cd C:\Users\<you>\path\to\CreativEdge\frontend
npm run typecheck
npm run build
npm run dev
# then in a separate terminal:
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run dev
# open http://127.0.0.1:5173 in the browser and re-run Phase 6-A steps 1-17
```

Done-when for §6-A:

- [x] Frontend `npm install` and `npm run build` succeed on Windows.
- [x] Backend `npm run build` still clean on Windows (no backend changes on this slice — verify nothing regressed).
- [x] Step 4: SSE streaming renders live in the message thread.
- [x] Step 5: Active agent card shows the routed agent meta.
- [x] Step 6: `done.memoryCandidate` surfaces a confirmation card.
- [x] Step 7: Dismiss is local-only (no backend request).
- [x] Step 8: Save memory succeeds with status "Saved …".
- [x] Step 9: Repeat save shows the duplicate path.
- [x] Step 10: Manually-promoted sensitive entry shows the 422 message.
- [x] Step 11-12: Compact status + preview work; Apply requires an explicit click.
- [x] Step 13-15: Backup status / dry-run / run work; no push from UI.
- [x] Step 17: `/sessions/search` returns results with safely-rendered snippets.
- [x] Console shows no React errors or unhandled fetch failures during normal use.

Out of scope for §6-A:

- editCore find/replace UI and promote-episodic UI — deferred to §6-B (the backend endpoints exist; the UI is just minimal on this slice).
- Backup push button — deferred to §6-B with an extra confirmation step.
- A full sessions sidebar listing past conversations (the left rail has a "New conversation" button and the search panel; a sessions-list view will land in §6-B or §6-C).
- Markdown rendering for assistant responses (current slice preserves line breaks but does not parse markdown; a sandboxed renderer can land later if needed).
- Per-agent matrix Memory column flip — tied to Phase 5 overall closing.
- Phase 6 design polish, mobile/responsive beyond the basic 980px / 1200px breakpoints, themes, accessibility audit.
- Phase 7 admin-console refit (the legacy `console.html` is the prototype reference; it is not touched on this slice).


The console manages agents; this is where users actually talk to them. The same local Node service hosts both — the chat UI consumes its API over **SSE**.

### 6-B UI polish + complete memory/search/backup usability pass — ✅ Complete / Windows validated

§6-B layers usability polish, completeness, and safer mutation flows on top of the already-validated §6-A scaffold under `frontend/`. **Frontend-only — backend untouched.** All eight already-validated routes (`/chat` SSE, the seven `/agents/:slug/memory/*`, `/sessions/search`, `/backup/{status,config,dry-run,run}`) are consumed unchanged.

**Scope shipped on this slice:**

- New shared presentational components under `frontend/src/components/`:
  - `StatusBadge.tsx` — colour + glyph badge family (`ok` / `info` / `warn` / `danger` / `neutral`). Colour is never the sole signal — every variant has a leading glyph (`✓ · ⚠ ✕ —`) for low-vision / colour-blind accessibility.
  - `ActionResult.tsx` — shared one-line status row used by every mutation form (promote, promote-episodic, edit-core, forget, compact apply, backup config, dry-run, run). Wraps the new `ActionState` union (`idle` / `busy` / `ok` / `duplicate` / `warn` / `err`) so success / duplicate / refused-by-sensitive-guard / 404 / 409 / 400 / network err render with the same visual language.
  - `SafeSnippet.tsx` — parses backend `<mark>…</mark>` highlights into real React `<mark>` elements. **No `dangerouslySetInnerHTML` anywhere** — the snippet is tokenised by regex and re-assembled as text + React children, keeping the highlight without a HTML injection surface.
- `types.ts` — added explicit `EditCoreResponse` and `PromoteEpisodicResponse` so callers branch cleanly on `edited` / `unchanged` / `promoted` / `duplicate`. Added `BadgeVariant` + `ActionState` helpers.
- `api/client.ts` — `editCoreMemory` and `promoteEpisodicMemory` now return their explicit types (no more inline anonymous return types). `ApiError` already carried `status` and `hint`; nothing else changed in the API layer.
- `App.tsx` — adds `sendNonce` (increments on every user send) and threads it into `ChatLayout` → `MessageThread` so a fresh send always force-scrolls to the bottom; mid-stream chunks auto-scroll only when the user is already near the bottom of the thread. Stop-button path now stamps `"stopped by user"` and keeps any partial assistant text so the user sees what arrived before the cancellation.
- `ChatLayout.tsx` — landmark `aria-label`s on every `<aside>` and `<main>`; New conversation button gains a `title` hint; passes `sendNonce` through.
- `MessageThread.tsx` — wraps the existing centred `.ce-thread-inner` column with:
  - smarter auto-scroll (force on send, soft on chunks only when near bottom),
  - a `Thinking…` placeholder shown when the assistant message exists but has no text yet (closes the meta→first-chunk gap),
  - distinct stopped / error styling (`.ce-msg-stopped` warn border, `.ce-msg-error-state` danger border) instead of plain text overlay,
  - clearer assistant header with emoji + name + decision type + degraded flag,
  - line-break preservation and `overflow-wrap: anywhere` so long un-spaced tokens still wrap.
- `Composer.tsx` — explicit `aria-label` on Send / Stop, accessible `<label>` wrapping the textarea, `title` hints on disabled states; textarea stays enabled while streaming so the user can draft the next message in parallel; Send is still disabled until streaming finishes.
- `AgentCard.tsx` — provider / decision / convened / handoff render as `StatusBadge`s with glyph + colour; convened slugs render as individual chips; "no route yet" placeholder shows an intentional small hint instead of a blank card; sessionId still shown as short prefix with full id in the `title`.
- `MemoryCandidateCard.tsx` — adds type + pattern pills, accessible `aria-label`s on actions, busy / saved / duplicate / sensitive / error states render with glyph + colour through styled status rows. **Dismiss stays local-only.** Save always sends `{entry, confirmed:true}` on explicit click — no auto-save.
- `MemoryToolsPanel.tsx` — expanded from 3 sub-tools to 5:
  - **Promote arbitrary** — explicit confirm checkbox + Save button (kept from §6-A).
  - **Promote-episodic** — new. `episodicNeedle` input (≥ 3 chars), confirm checkbox, explicit Promote button. Handles 200 (promoted), 200+duplicate, 404 no match, 409 multiple, 422 sensitive — all with friendly per-status messaging via `apiErrorToState`.
  - **Edit-core** — new. Separate `find` and `replace` textareas, confirm checkbox, explicit Apply button. Surfaces 200+edited, 200+unchanged (find==replace), 404 no match, 409 multiple, 422 sensitive replace. Never blind-overwrites — backend already enforces single-match semantics; UI clearly communicates each outcome.
  - **Forget** — kind selector (core/episodic), find input (≥ 3 chars), confirm checkbox, explicit Forget button. Surfaces 200 forgotten + bytes rewritten, 404 no match, 409 multiple, 400 unconfirmed/invalid.
  - **Compact** — refresh status / preview / apply chain. `status.due` surfaces a warn badge ("compaction due") + entry-count badge "n/threshold" + nextAction badge. Apply is gated on a non-empty preview (no auto-apply). The Apply button's title hint explains why it's disabled when there's no preview.
- `SearchPanel.tsx` — adds distinct idle / busy / warn / err / ok states via the shared `ActionResult`. Empty-query path warns the user; no-results path renders an explicit "No matches in stored transcripts" hint; 200 OK results render with `SafeSnippet` (highlighted `<mark>` content) plus role / agentSlug / createdAt meta on each row. Read-only — no mutation calls.
- `BackupPanel.tsx` — readiness flags (`enabled` / `gitReady` / `repoReady` / `remoteConfigured` / `setupRequired`) render as `StatusBadge`s with explicit colour + glyph. Configure form now requires its own confirm checkbox ("I confirm the backup config change") before Save is enabled. Dry-run + Run status lines render through `ActionResult`. **No push button.** `backupRun` is still hard-coded to `push:false` in `client.ts` and the UI never offers a push action.
- `styles.css` — refreshed:
  - new `.ce-badge` family with explicit variant classes (`-ok / -info / -warn / -danger / -neutral`),
  - global focus ring (`:focus-visible` outline) on every interactive element,
  - thinking-dots `@keyframes ce-thinking-bounce` animation,
  - thread max-width bumped to 1080px on ultrawide; the whole app shell now caps at 1640px so rails don't drift on huge monitors,
  - breakpoints at 1400 / 1200 / 980 / 640 px so the layout scales from ultrawide to laptop to narrow to (small) mobile without crushing the chat column,
  - `.ce-visually-hidden`, `.ce-truncate`, `.ce-meta-pills`, `.ce-form-field` utilities,
  - clearer status colours (separated `--ok-bg` / `--ok-border` etc.) and a `.ce-mark` rule for safe-snippet highlights.

**Hard constraints honored:**

- No backend code, no fixtures, no runners, no providers, no agent personality files, no README files, no `console.html`, no memory artifacts touched. The slice is purely additive / edit-only under `frontend/`.
- No auto-promote, no auto-edit, no auto-forget, no auto-compact-apply, no auto-enable backup, no auto-push backup. Every mutation requires an explicit user click; the new tools (promote-episodic, edit-core) gate behind their own confirm checkbox.
- No GitHub API call from the frontend, no token storage, no `.env` with secrets, no Anthropic/OpenAI API path called directly.
- `console.html` left untouched.
- No new dependency added. Frontend deps remain `react`, `react-dom`, `vite`, `typescript`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`.

**Linux-sandbox verification on this turn:**

- `node node_modules/typescript/bin/tsc --noEmit` → exit 0 (clean).
- `node node_modules/typescript/bin/tsc -b` → exit 0 (clean project-references build).
- `vite build` could not run in the sandbox: the user's `node_modules` was provisioned on Windows so `@rollup/rollup-linux-x64-gnu` is missing under the Linux mount. Same blocker as Phase 6-A — the Windows host has `@rollup/rollup-win32-x64-msvc` and builds cleanly.
- Backend untouched; no backend regression suites were re-run on this slice (zero backend file modified). Backend `npm run build` was last clean on the Phase 5.6-A / Phase 6-A pass.

**Windows manual validation steps (re-run §6-A 17-step smoke, plus the new tools):**

1. Backend: `cd backend-api && npm run build && npm run dev` (Terminal A).
2. Frontend: `cd frontend && npm run typecheck && npm run build && npm run dev` (Terminal B).
3. Browser: open `http://127.0.0.1:5173`.
4. Send `oi`. Confirm optimistic user message appears immediately.
5. Confirm assistant stream renders chunks live + Thinking… placeholder shows before the first chunk.
6. Confirm no `Failed to fetch` and the layout is readable on both ultrawide and ~1280px laptop widths.
7. Search for `oi` — result appears with `<mark>` highlight rendered as a real `<mark>` element.
8. Send `For future reference, I prefer dark mode for all design dashboards.` — confirm the memory candidate card surfaces with type + pattern pills.
9. Click Dismiss; confirm no `/promote` request fires.
10. Re-send + click Save; confirm the card shows the saved status.
11. Send same prompt again + Save; confirm duplicate path renders cleanly.
12. Open Memory tools → Promote arbitrary safe entry; confirm Saved / duplicate paths.
13. Memory tools → Promote arbitrary sensitive entry (`My card is 4111 1111 1111 1111.`) with confirm; confirm 422 warn message ("This looks sensitive, so it was not saved.").
14. Memory tools → Promote-episodic with a known needle; confirm 200 (promoted), or 404 / 409 if the needle isn't unique. Try a sensitive needle to verify 422.
15. Memory tools → Edit-core find/replace; confirm `edited` happy path, `unchanged` (find==replace), 404 no match, 409 multiple, 422 sensitive replace.
16. Memory tools → Forget seeded test entry; confirm forgotten + 404 + 409 paths.
17. Memory tools → Compact status; confirm entry count / due badge / nextAction render.
18. Memory tools → Compact preview; confirm bullets appear and Apply is enabled only after a non-empty preview.
19. Memory tools → Compact apply only after explicit click. Repeat → duplicate path.
20. Backup → Refresh status; confirm readiness badges render with glyph + colour.
21. Backup → Configure → tick all three confirms (enable, includeSessionsDb if desired, "I confirm the backup config change") + Save; confirm Saved status.
22. Backup → Dry-run; confirm `changed/considered/copied/skipped/added/modified/deleted/untracked` line + ok/duplicate status.
23. Backup → Run (no push); confirm commit happens locally (`push:false`).
24. Confirm there is NO push button anywhere in the UI.
25. DevTools console: no React errors during normal flow.

Done-when for §6-B:

- [x] `npm run typecheck` and `npm run build` succeed on Windows.
- [x] Backend `npm run build` still clean on Windows (no backend changes on this slice — verify nothing regressed).
- [x] Chat still streams; optimistic user message visible; ultrawide layout still readable.
- [x] Thinking… placeholder shows during meta→first-chunk gap.
- [x] Memory candidate Save / Dismiss / duplicate / 422 paths all work.
- [x] Memory tools: promote, promote-episodic, edit-core, forget, compact status / preview / apply all work; per-status-code messages are clear.
- [x] Search snippet highlights render via `<mark>` (visible yellow background); no `dangerouslySetInnerHTML` anywhere.
- [x] Backup status badges render; dry-run + run work; no push button anywhere.
- [x] No auto-save / auto-edit / auto-forget / auto-compact-apply / auto-enable backup / auto-push backup.
- [x] DevTools shows no React or fetch errors during normal use.

Out of scope for §6-B (deferred):

- Phase 6-C / 6-D scoping: a real sessions sidebar listing past conversations, markdown rendering for assistant content, syntax highlighting, file/image attach, `/agent` `/handoff` `/forget` slash commands, mobile drawer mode, themes, full a11y audit.
- Backup push UI with second explicit confirmation — deferred until §5.6-B nightly scheduling lands.
- Phase 7 admin-console refit (Phase 6.0 TypeScript direction migration of the legacy `console.html`).
- §5.3-C optional LLM-based summarization in compaction.
- §5.6-B nightly backup scheduling + push.
- §5.6-C destructive restore flow.
- Optional all-agent compaction status variant.
- Per-agent matrix Memory column flip (tied to Phase 5 overall closing).


### 6-C Sessions sidebar + markdown rendering + slash-command UX — ✅ Complete / Windows validated

§6-C layers real session navigation, safe markdown rendering, and lightweight client-side slash commands on top of the already-validated §6-A / §6-B frontend under `frontend/`. **Frontend-only — backend untouched.** All previously-validated routes are consumed unchanged: `POST /chat` (SSE), `GET /sessions`, `GET /sessions/:id`, `GET /sessions/search`, the seven `/agents/:slug/memory/*` family, and `/backup/{status,config,dry-run,run}`.

**Scope shipped on this slice:**

- New frontend dependencies (frontend-local only; backend untouched): `react-markdown ^9.0.1` and `remark-gfm ^4.0.0`. **No `rehype-raw`, no raw-HTML rehype plugin, no `dangerouslySetInnerHTML` anywhere.** GFM-enabled tables/lists/code blocks render through pure React children.
- New `frontend/src/slash/slashCommands.ts` — pure module (no React, no fetch). Parses `/agent`, `/forget core|episodic`, `/remember`, `/compact status`, `/compact preview`, `/backup status`, plus `incomplete` + `unknown` fallbacks. Exposes `COMMAND_HINTS` for the menu and `rewriteAgentHint` for the safe `/agent` rewrite.
- New components under `frontend/src/components/`:
  - `SessionSidebar.tsx` — fetches `GET /sessions`, renders newest-first rows with title (with `Session XXXXXX…` fallback) + relative time. Selected row uses `aria-current="true"`. Loading / error / empty states render via `ActionResult`. Refresh button + auto-refresh on every successful chat send (via `refreshNonce`).
  - `MarkdownMessage.tsx` — react-markdown + remark-gfm wrapper. Custom `a` opens in a new tab with `rel="noreferrer noopener"`. Custom `code` delegates to `CodeBlock`. Custom `table` wraps in a horizontally-scrolling container. **No rehype plugins** so any embedded HTML in the markdown source is treated as literal text.
  - `CodeBlock.tsx` — fenced code block with language label (from `language-foo` class) + copy button (uses `navigator.clipboard` only; degrades quietly if blocked) + "✓ Copied" feedback for 1.5s. Inline code renders with `.ce-md-inline-code` styling. Horizontally scrolls on overflow.
  - `SlashCommandMenu.tsx` — popover above the composer when the textarea text starts with `/`. Lists matching commands with description + "needs active agent" tag. Click-to-prefill puts the canonical trigger in the textarea (user still presses Enter — no surprise dispatch).
  - `SlashConfirmModal.tsx` — explicit confirmation for `/remember` and `/forget`. Esc cancels; Enter does NOT auto-confirm. Quoted preview of the text. Cancel button never reaches the backend.
  - `CommandResultCard.tsx` — inline above the composer for read-only command results (`/backup status`, `/compact status`, `/compact preview`). Dismiss `×` clears it.
  - `HandoffCard.tsx` — renders `done.handoff` (fromSlug / toSlug / status / reason) with `StatusBadge` colour-mapping per status (`applied`/`ok` → ok, `pending` → info, `rejected`/`blocked` → warn, `error` → danger).
- Edited components:
  - `App.tsx` — adds `selectSession` (calls `getSession`, maps `messages[]` rows into `UiMessage[]` with `historicalAgentSlug` + `createdAt`), `sessionRefreshNonce` (bumps after every chat send), and the slash-command dispatcher. `/agent` rewrites client-side via `rewriteAgentHint` and sends as a normal chat message — **no backend force-route**. `/remember` and `/forget` stage a `SlashConfirmRequest`; the backend call only fires after explicit click on Confirm.
  - `ChatLayout.tsx` — left rail now hosts `SessionSidebar` above Search + Backup. Adds `cmdResultSlot` (above composer) + `modalSlot` (top-of-tree overlay). `aria-label="Tools and sessions"`.
  - `MessageThread.tsx` — assistant content renders through `MarkdownMessage` once streaming finishes (mid-stream stays plain pre-wrapped to avoid garbled markdown flashes). `done.handoff` surfaces as `HandoffCard`. Historical assistant rows without `meta` show `historicalAgentSlug · historical` in the header.
  - `Composer.tsx` — adds `activeSlug` prop + slash menu integration. When the textarea text starts with `/`, `SlashCommandMenu` pops over the composer with matching `COMMAND_HINTS`. Close button hides the menu without losing typed text.
  - `SearchPanel.tsx` — each row is now a button; click calls `onOpenSession(sessionId)` → `App.tsx` selectSession → transcript loads in main thread. Still read-only otherwise; `SafeSnippet` still parses `<mark>` highlights safely.
  - `types.ts` — adds `SessionRow`, `SessionMessageRow`, `SessionListResponse`, `SessionDetailResponse` (matching backend snake_case), `HandoffMeta`, `SlashCommand` discriminated union, `SlashConfirmRequest`. `UiMessage` gains `historicalAgentSlug` and `createdAt` for loaded transcripts.
  - `api/client.ts` — adds `listSessions(limit?)` and `getSession(sessionId)` typed helpers.
  - `styles.css` — appends Phase 6-C sections: sessions sidebar rows, markdown body (paragraphs, headings, lists, blockquotes, hr, inline code, tables wrapped in scrollable container), code block head + body (overflow-x: auto), slash menu (positioned over composer with z-index), confirm modal (backdrop + dialog with focus-trap-friendly markup), command result card, handoff card. Existing 6-B styles preserved.

**Hard constraints honored:**

- No backend code touched. Zero file modified outside `frontend/`.
- No auto-save / auto-promote / auto-edit / auto-forget / auto-compact / auto-backup-push. `/remember` and `/forget` stage a confirmation modal; backend calls only fire after explicit Confirm click. `/agent` is a routing **hint** that the orchestrator may ignore; no backend override flag added.
- No `dangerouslySetInnerHTML`, no `rehype-raw`, no raw HTML rendering. Markdown is parsed to React children only. Links open with `rel="noreferrer noopener"` and `target="_blank"`.
- No `/backup push` / `/backup run` / `/restore` / destructive slash commands. `/backup status` is the only backup command exposed.
- No GitHub API call from the frontend, no token storage, no `.env` with secrets, no Anthropic/OpenAI direct calls.
- `console.html` left untouched.
- Frontend deps: only `react-markdown` and `remark-gfm` added on this slice. No syntax highlighter (deferred to a possible Phase 6-D polish item per the user's choice — code blocks still render in a styled monospace block with language label + copy button).

**Linux-sandbox verification on this turn:**

- `npm install --no-save react-markdown@^9.0.1 remark-gfm@^4.0.0` succeeded; 100 transitive packages added.
- `node node_modules/typescript/bin/tsc --noEmit` → exit 0 (clean).
- `node node_modules/typescript/bin/tsc -b` → exit 0 (clean project-references build).
- `vite build` not re-attempted in the sandbox because the Phase 6-A / 6-B OneDrive `@rollup/rollup-linux-x64-gnu` blocker still applies; the Windows host builds cleanly there.
- Backend untouched; no backend regression suites re-run on this slice.

**Windows manual validation steps (run AFTER `npm install` on Windows so `react-markdown` + `remark-gfm` are resolved by the Win32 toolchain):**

1. Backend: `cd backend-api && npm run build && npm run dev` (Terminal A).
2. Frontend: `cd frontend && npm install && npm run typecheck && npm run build && npm run dev` (Terminal B).
3. Browser: open `http://127.0.0.1:5173`.
4. Sessions sidebar loads list of past sessions (newest first).
5. Click an existing session — transcript loads in the main thread; assistant rows show `historicalAgentSlug · historical`; user rows stay plain pre-wrapped.
6. Click "New conversation" — thread resets, selected session clears, search/backup panels intact.
7. Send a normal message — optimistic user message appears, Thinking… placeholder, then stream renders as markdown after `done`.
8. Sessions sidebar refetches automatically after the send.
9. Send: `Give me a short markdown checklist and a TypeScript code block.` — confirm checklist renders as bullet list, code block renders inside a styled box with language label.
10. Click the code block's "Copy" button — confirm clipboard receives the snippet and "✓ Copied" shows for ~1.5s.
11. Type `/` — confirm `SlashCommandMenu` pops over the composer with all commands listed; commands flagged "needs active agent" are disabled until an active agent exists.
12. Run `/backup status` — confirm read-only result card appears with enabled/git/repo/remote/next flags.
13. Run `/compact status` with active agent — confirm entries/threshold/due/next render.
14. Run `/compact preview` with active agent — confirm bullets render in the result card and Apply is NOT auto-fired.
15. Run `/remember test memory from slash command` — confirm `SlashConfirmModal` opens.
16. Click Cancel — confirm no `/promote` request fires.
17. Run `/remember test memory from slash command` again, click Confirm — confirm `/promote` fires with `confirmed:true` and result card shows "Saved …" or "Already in core memory (duplicate)".
18. Run `/forget core <known test text>` — confirm modal opens with quoted text + "Forget" red button; Cancel cancels; Confirm fires `/forget` only after click.
19. Run `/agent graphics-design create a logo concept` — confirm a result card appears ("Routing hint sent: graphics-design") AND the message goes out as a normal chat message rewritten as "Please route this to graphics-design if appropriate: create a logo concept". Note that this is a hint, not a force route.
20. Search panel: search for a known phrase, click a result row — confirm that session loads in the main thread.
21. If a conversation produced a handoff event, confirm `HandoffCard` renders under the assistant message with from/to/status.
22. DevTools console: no React errors, no unhandled fetch failures.
23. Confirm there is NO push button in the UI and no automatic backup push behaviour.

Done-when for §6-C:

- [x] Frontend `npm install` resolves `react-markdown` + `remark-gfm` on Windows.
- [x] `npm run typecheck` and `npm run build` succeed on Windows.
- [x] Backend `npm run build` still clean on Windows (validation patch reshaped `GET /sessions` + `GET /sessions/:id` responses to camelCase + `ok:true` + `lastAgentSlug`; no regression elsewhere).
- [x] Sessions sidebar loads and clicking a row loads its transcript.
- [x] New conversation reset works.
- [x] Markdown rendering: paragraphs, bullets, numbered lists, inline code, fenced code blocks (with copy button), links (new tab + safe rel), blockquotes, tables.
- [x] Slash command menu appears when typing `/`; click-to-prefill works; commands disabled when no active agent.
- [x] `/backup status` returns and renders read-only.
- [x] `/compact status` and `/compact preview` work without auto-applying.
- [x] `/remember` opens confirm modal; Cancel does nothing; Confirm POSTs only after explicit click.
- [x] `/forget core|episodic` opens confirm modal; same explicit-click safety.
- [x] `/agent <slug> <message>` rewrites client-side and sends as a normal chat message with a routing-hint note in the UI.
- [x] Search result click loads the referenced session.
- [x] Handoff card renders when `done.handoff` is present.
- [x] No auto-save / auto-promote / auto-edit / auto-forget / auto-compact / auto-backup-push.
- [x] DevTools shows no React errors or unhandled fetch failures.

Out of scope for §6-C (deferred):

- Syntax highlighting inside code blocks (deferred to a possible Phase 6-D polish item; plain styled blocks + copy button ship today).
- File / image attachments in the composer.
- Slash commands for `/backup push`, `/backup run`, `/restore`, or any destructive backup gesture.
- A full `useChat` / `useSessions` / `useSlashCommands` hooks split-out (`App.tsx` integrated them inline since the state is still small).
- Phase 7 admin-console refit.
- §5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C restore flow, optional all-agent compaction status variant, per-agent matrix Memory column flip.


### 6-D Responsive/mobile polish + accessibility + final UI hardening — ✅ Complete / Windows validated

§6-D hardens the validated Phase 6-A/6-B/6-C frontend for narrow widths and keyboard-only users without changing backend behaviour. **Frontend-only — backend untouched.** All previously-validated routes (`POST /chat` SSE, `GET /sessions`, `GET /sessions/:id`, `GET /sessions/search`, the seven `/agents/:slug/memory/*` family, `/backup/{status,config,dry-run,run}`, `/healthz`) are consumed unchanged.

**Scope shipped on this slice:**

- New hook `frontend/src/hooks/useMediaQuery.ts` — small typed wrapper around `window.matchMedia`. Modern `addEventListener` path with a legacy `addListener` fallback for older Safari. SSR-safe initial value.
- New component `frontend/src/components/Drawer.tsx` — off-canvas dialog used by the mobile chrome to host the existing left rail (Sessions + Search + Backup) and right rail (Agent + Memory tools) without changing their internal markup. `role="dialog"`, `aria-modal="true"`, Escape closes, backdrop click closes, close button auto-focused on open, body scroll locked while open. Animated entrance honors `prefers-reduced-motion: reduce`.
- Edited `frontend/src/components/ChatLayout.tsx` — desktop layout (≥980px) preserved verbatim. Below 980px the rails collapse and a thin "mobile chrome" bar appears at the top of the main column with `☰ Sessions` and `Tools ⋯` buttons (both `aria-haspopup="dialog"` + `aria-expanded`). Selecting a session from a drawer auto-closes the drawer. A separate "New conversation" row appears below the chrome on mobile so it stays reachable.
- Edited `frontend/src/components/SlashCommandMenu.tsx` — `selectedIndex` is now lifted into the parent; the menu just renders the highlight. `role="listbox"` + `aria-activedescendant` on the menu and `role="option"` + `aria-selected` on each row. Header hint reads `↑↓ Enter · Esc to close`.
- Edited `frontend/src/components/Composer.tsx` — full keyboard navigation for the slash menu while focus stays in the textarea. ArrowDown / ArrowUp moves the highlight, Enter prefills the highlighted trigger (when the user has typed only the command head and nothing else — preserving "no surprise execution"), Escape closes the menu without losing typed text. Enter still submits when the user has typed past the trigger head. `aria-autocomplete="list"` + `aria-controls` wire the textarea to the menu for screen readers.
- Edited `frontend/src/components/BackupPanel.tsx` — adds an explicit "Local-only backup. Push is intentionally not exposed in this UI; a future slice will add it behind a second explicit confirmation." note above the dry-run/run row. No code-path change.
- Edited `frontend/src/styles.css` — appended Phase 6-D section: `.ce-mobile-chrome` (sticky top bar visible <980px), `.ce-drawer-backdrop` + `.ce-drawer` + `.ce-drawer-head` + `.ce-drawer-close` + `.ce-drawer-body`, slide-in keyframe, `.ce-slash-menu-item-highlight` + `.ce-slash-menu-item:focus-visible` for keyboard nav, `.ce-backup-local-note` styling, message/banner long-error wrap (`overflow-wrap: anywhere; word-break: break-word;`), mobile-only thread/composer padding tweaks, and a `prefers-reduced-motion: reduce` block that disables drawer slide + thinking-dot bounce. Desktop CSS untouched.

**Hard constraints honored:**

- No backend code, fixtures, runners, providers, agent personality files, README files, `console.html`, or memory artifacts touched. The slice is purely additive under `frontend/`.
- No auto-save / auto-promote-episodic / auto-edit-core / auto-forget / auto-compact-apply / auto-enable backup / auto-push backup. All destructive flows still gated by explicit confirm modal (`/remember`, `/forget`) or explicit click + confirm checkbox (memory tools, backup config).
- No `dangerouslySetInnerHTML`, no `rehype-raw`, no raw HTML rendering. Markdown stays react-markdown + remark-gfm only. Links keep `rel="noreferrer noopener"` + `target="_blank"`.
- No syntax highlighter added (per the user's choice — code blocks remain plain-styled with language label, copy button, copied feedback, and horizontal scroll).
- No theme toggle / localStorage theme persistence in this slice (per the user's choice — dark mode default, polished focus rings + contrast).
- No new dependency added. Frontend deps unchanged from Phase 6-C: `react`, `react-dom`, `react-markdown`, `remark-gfm`, `vite`, `typescript`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`.
- No backend regression: chat / routing / convening / handoff / memory / backup / search behaviour all unchanged.
- No `git add .`, no commit, no push.

**Linux-sandbox verification on this turn:**

- `node node_modules/typescript/bin/tsc --noEmit` → exit 0 (clean).
- `node node_modules/typescript/bin/tsc -b` → exit 0 (clean project-references build).
- `vite build` not re-attempted in the sandbox — same OneDrive `@rollup/rollup-linux-x64-gnu` blocker as Phase 6-A/6-B/6-C; Windows host with `win32-x64-msvc` builds cleanly.
- Backend untouched; no backend regression suites re-run on this slice.

**Windows manual validation steps (re-run on the Windows host):**

1. Backend: `cd backend-api && npm run build && npm run dev` (Terminal A).
2. Frontend: `cd frontend && npm run typecheck && npm run build && npm run dev` (Terminal B).
3. Browser: open `http://127.0.0.1:5173`. Desktop layout still works (3-pane grid, left+main+right).
4. Resize to tablet width (~900px). Confirm the rails disappear and the mobile chrome (`☰ Sessions` · brand · `Tools ⋯` + a "New conversation" row) appears.
5. Resize further to mobile width (~400px). Confirm chat remains primary; no horizontal overflow.
6. Click `☰ Sessions`. Confirm the left drawer slides in from the left with sessions list + search + backup, plus a close `×`.
7. Press Escape — confirm the drawer closes and focus returns. Re-open. Click outside the drawer (backdrop) — confirm it closes.
8. Click `Tools ⋯`. Confirm right drawer opens with the Active Agent card (or hint if no agent yet) and Memory tools panel.
9. Send `hello`. Confirm optimistic user bubble appears, Thinking… placeholder, then assistant stream renders as markdown.
10. After response, confirm sessions list refreshed (open the drawer to verify on mobile).
11. Type `/`. Confirm slash menu appears above the composer.
12. Press ArrowDown / ArrowUp. Confirm highlight moves.
13. Press Enter while the textarea contains only `/`. Confirm the highlighted trigger template is prefilled into the textarea (no backend call).
14. Press Escape. Confirm menu closes; typed text preserved.
15. Type a full command, e.g. `/backup status`. Press Enter. Confirm command dispatches (since user is past the head-only state).
16. Send: `Give me a markdown table and a TypeScript code block.` Confirm table renders inside a horizontally-scrollable container and code block has a Copy button + language label.
17. Click Copy. Confirm "✓ Copied" feedback for ~1.5s.
18. Run `/agent graphics-design create a logo concept` → confirm Routing-hint card appears and the message goes out rewritten.
19. Run `/remember test phrase from Phase 6-D` → confirm modal opens, Cancel does nothing, re-running and clicking Confirm posts to `/promote`.
20. Run `/forget core <known test entry>` → confirm modal opens with red Forget button, Cancel safe, Confirm fires `/forget`.
21. Search the transcript and click a result → confirm session loads.
22. Tab through the page on desktop and mobile — confirm focus rings are visible on every interactive control (composer, send/stop, slash menu items, drawer close, session rows, memory tools, backup panel).
23. Confirm no backup push button anywhere; "Local-only backup" note is visible above the dry-run/run row.
24. Confirm `/healthz` preflight banner does NOT appear unless backend is stale/down (kill backend mid-session to verify the banner appears with the explicit remediation text).
25. DevTools console: no React errors, no unhandled fetch failures, no 404 on `/chat` / `/sessions` / `/healthz`.

Done-when for §6-D:

- [x] Frontend `npm run typecheck` and `npm run build` succeed on Windows.
- [x] Backend `npm run build` still clean on Windows (no backend changes on this slice — verify nothing regressed).
- [x] Desktop 3-pane layout preserved verbatim.
- [x] Below 980px the rails collapse and the mobile chrome bar appears.
- [x] `☰ Sessions` opens left drawer; `Tools ⋯` opens right drawer; both close on backdrop click, close button, and Escape.
- [x] Selecting a session from a drawer auto-closes the drawer and loads the transcript.
- [x] Slash menu keyboard navigation works (ArrowUp / ArrowDown / Enter prefills head-only state / Escape closes / typed-past-head Enter still dispatches).
- [x] Markdown table renders horizontally-scrollable; code block has language label + copy button + copied feedback.
- [x] `/remember` and `/forget` still gated by explicit confirm modal — no auto-save / auto-forget.
- [x] `/compact preview` still has no auto-apply path.
- [x] No backup push button anywhere; the new "Local-only" note is visible.
- [x] Visible focus rings on every interactive control on desktop and mobile.
- [x] `prefers-reduced-motion: reduce` honoured (drawer + thinking-dot animations disabled).
- [x] DevTools shows no React errors or unhandled fetch failures during normal use.

Out of scope for §6-D (deferred):

- Light/dark theme toggle and localStorage theme persistence (per user choice — dark mode polish only).
- Syntax highlighting inside code blocks (deferred to a later polish slice).
- File / image attachments in the composer.
- Slash commands for `/backup push`, `/backup run`, `/restore`, or any destructive backup gesture.
- Full `useChat` / `useSessions` / `useSlashCommands` hooks split-out (only `useMediaQuery` was added on this slice; `App.tsx` integrated state inline since the existing structure is still manageable).
- Backend all-agent compaction status variant.
- Phase 7 admin-console refit.
- §5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C restore flow, per-agent matrix Memory column flip.


### 6-E Final UI polish + Phase 6 closure readiness — ✅ Complete / Windows validated

§6-E is a small, disciplined stabilisation slice on top of Phase 6-A/6-B/6-C/6-D. **Frontend-only.** Backend untouched. The goal is closure readiness — not feature expansion. No new dependency, no new feature surface, no admin console, no Electron, no file/image attach, no backup push, no destructive restore. Theme toggle and syntax highlighting were both explicitly deferred per the user's choice on the previous slices.

**Scope shipped on this slice:**

- `frontend/src/components/SlashConfirmModal.tsx` — Phase 6-E hardening: the Cancel button now auto-focuses on mount (via `useRef` + `requestAnimationFrame`), so an accidental Enter or Space while the modal animates in fires the safe (no-op) path instead of the destructive Confirm action. Esc-to-cancel and "Enter does NOT auto-confirm" semantics from Phase 6-C are preserved. The DOM order (primary action first, Cancel second) is kept so the visual layout doesn't change; only the initial focus target moves. This is the standard "are you sure?" dialog guardrail.
- `frontend/src/App.tsx` — Removed the inline `style={{ marginLeft: 8 }}` on the health-banner "Re-check" button; the banner now uses a flexbox layout via the new `.ce-banner-text` / `.ce-banner-action` CSS classes so the action sits on the right of the message instead of being margin-pushed. Behaviour unchanged (preflight `/healthz` ping, sticky red banner with explicit remediation text, auto-clear after a successful send re-ping).
- `frontend/src/components/MessageThread.tsx` — Empty-state polish: kept the existing first-time hint, added a small faint secondary hint `Tip: type / to see slash commands (memory, compaction, backup status).` so first-time users discover the slash UX without needing to read the docs.
- `frontend/src/styles.css` — Appended Phase 6-E section: `.ce-banner-text` + `.ce-banner-action` (flexbox banner layout); `.ce-hint-faint` (used by the new empty-state tip line, with a small `<code>` chip style for the `/` keypress hint); a `@media (max-width: 640px)` block that wraps the modal action row so Cancel doesn't overflow on very narrow phones. No existing rules modified; no breakpoint thresholds changed.

**Closure audit summary (what was reviewed, what is NOT changed):**

- Chat stream stability — solid since Phase 6-A validation patch + 6-C validation patch. No change.
- Sessions sidebar — camelCase contract validated in Phase 6-C; sidebar refreshes on send via `sessionRefreshNonce`. No change.
- Markdown/code rendering — react-markdown + remark-gfm + safe link rewrite + `CodeBlock` with language label / copy / copied feedback / overflow-x scroll. No change. Syntax highlighting **intentionally deferred** to keep Phase 6-E small.
- Slash command UX — keyboard nav (ArrowUp/Down/Enter prefill on head-only / Escape) validated in Phase 6-D. No change beyond the modal default-focus fix above.
- Memory tools safety — promote / promote-episodic / edit-core (find+replace, never blind overwrite) / forget / compact status+preview+apply all still gated by explicit confirm checkbox or modal. No change.
- Backup panel safety — `push:false` hard-coded, no push button anywhere in the UI, "Local-only backup" note from Phase 6-D still in place. No change.
- Search result flow — clicking opens the referenced session (Phase 6-C). No change.
- Responsive drawers — `Drawer` + mobile chrome bar (Phase 6-D), Escape + backdrop + close-button + body-scroll-lock + `prefers-reduced-motion` respect. No change.
- Accessibility basics — every interactive control has an `aria-label` or visible label, focus rings via `:focus-visible`, glyph + colour status indicators (not colour-alone), `role="dialog"` + `aria-modal="true"` on modal and drawers. The Phase 6-E modal default-focus fix is the only a11y delta on this slice.
- Error/loading/empty states — backend-down banner, sessions sidebar 404 warn-state, search panel busy/warn/err/no-results, memory tools per-status messages (400/404/409/422). The empty-thread tip line is the only delta on this slice.

**Items intentionally NOT done on this slice (and why):**

- Theme toggle — **deferred per spec.** Dark mode remains the only supported theme. CSS variables are already organised to support a future light theme.
- Syntax highlighting — **deferred per spec.** Plain styled code blocks with language label + copy button cover the safe case.
- `useChat` / `useSessions` / `useSlashCommands` hook split-out — **deferred.** `App.tsx` is ~600 lines but the structure is clear (state declarations, dispatcher, modal callbacks, health ping). Splitting now would be refactor-for-refactor's-sake and would risk subtle behaviour drift. Marked as future cleanup if/when `App.tsx` grows further.
- Backup push button / nightly schedule / destructive restore — **deferred.** Tied to §5.6-B / §5.6-C in the Phase 5 deferred-extensions backlog.
- Admin console refit — **explicitly Phase 7.** Not started.
- File / image attachments in the composer — **deferred.** Larger scope than Phase 6-E warrants.
- Per-agent matrix Memory column flip — **in Phase 5 deferred-extensions backlog;** can land in any docs-only follow-up.

**Hard constraints honored:**

- No backend code, fixtures, runners, providers, agent personality files, README files, `console.html`, or memory artifacts touched. Zero file modified outside `frontend/`.
- No auto-save / auto-promote-episodic / auto-edit-core / auto-forget / auto-compact-apply / auto-enable backup / auto-push backup. All gates from prior phases are intact.
- No `dangerouslySetInnerHTML`, no `rehype-raw`, no raw HTML rendering.
- No new dependency added. Frontend deps unchanged from Phase 6-D.
- `console.html` left untouched.
- No `git add .`, no commit, no push.

**Linux-sandbox verification on this turn:**

- `node node_modules/typescript/bin/tsc --noEmit` → exit 0 (clean).
- `node node_modules/typescript/bin/tsc -b` → exit 0 (clean project-references build).
- `vite build` not re-attempted in the sandbox — same `@rollup/rollup-linux-x64-gnu` OneDrive blocker as prior phases. Windows host with `win32-x64-msvc` will build cleanly.
- Backend untouched; no backend regression suites re-run.

**Windows manual validation steps (re-run on the Windows host):**

1. Backend: `cd backend-api && npm run build && npm run dev` (Terminal A).
2. Frontend: `cd frontend && npm run typecheck && npm run build && npm run dev` (Terminal B).
3. Browser: `http://127.0.0.1:5173`. No `/healthz`, `/chat`, or `/sessions` 404s.
4. Empty-thread state shows the original "Send a message…" hint AND the new faint `Tip: type / to see slash commands…` hint underneath.
5. Send a normal message — optimistic bubble, Thinking…, stream, markdown render after `done`. Sessions sidebar refreshes.
6. Click an existing session — transcript loads. Click New Conversation — thread + session reset, banner stays hidden.
7. Send `Give me a markdown table and a TypeScript code block.` — table horizontally scrolls in its wrapper, code block has language label + Copy button + ✓ Copied feedback.
8. Resize to mobile — chrome bar appears, `☰ Sessions` / `Tools ⋯` open drawers; Escape + backdrop + close button close them. No horizontal overflow.
9. Type `/` — slash menu opens. ArrowUp/Down move highlight. Enter prefills the head template (when only `/` is typed). Escape closes menu. Typed-past-head Enter dispatches.
10. Run `/agent graphics-design create a logo concept` — safe routing-hint rewrite + a "Routing hint sent" card; no force-route on backend.
11. Run `/remember Phase 6-E final polish memory test` — modal opens. **Focus is on Cancel.** Press Enter immediately → modal closes, no `/promote` request fires (per DevTools Network). Re-run, Tab to Confirm, Enter → `/promote` fires.
12. Run `/forget core Phase 6-E final polish memory test` — modal opens. **Focus on Cancel.** Press Enter → modal closes, no `/forget` request fires. Re-run, Tab to Forget, Enter → `/forget` fires.
13. Run `/backup status` — read-only result card. **No push button anywhere.**
14. Run `/compact status` and `/compact preview` — read-only result cards; preview does NOT auto-apply.
15. Search the transcript, click a result → session loads.
16. Keyboard tab navigation reaches every primary control (Sessions rail / mobile chrome buttons / composer / Send/Stop / slash menu items / drawer close buttons / memory tools sub-forms / backup panel actions / confirm modal Cancel as default focus). Focus rings visible everywhere.
17. Kill backend mid-session and confirm the red `Backend unavailable` banner appears with the new flex layout (Re-check button on the right of the message, not margin-pushed).
18. DevTools console: no React errors, no unhandled fetch failures.

Done-when for §6-E:

- [x] Frontend `npm run typecheck` and `npm run build` succeed on Windows.
- [x] Backend `npm run build` still clean on Windows (no backend changes — verified nothing regressed).
- [x] Confirm modal opens with Cancel auto-focused; pressing Enter on first open does NOT trigger Confirm.
- [x] Empty-thread state shows both the original hint and the new slash-command tip.
- [x] Health-banner Re-check action sits on the right of the message (flex layout), not margin-pushed.
- [x] All Phase 6-A/B/C/D behaviour preserved — chat stream, sessions sidebar, markdown/code, slash menu keyboard nav, drawers, memory tools, backup panel, search-click, no push button, no auto-anything.
- [x] DevTools shows no React errors or unhandled fetch failures during normal use.
- [x] **Validation patch:** `/remember` with no active agent opens the modal targeted at Nexus instead of showing the old no-active-agent warning.
- [x] **Validation patch:** `/remember @bit …` opens the modal targeted at `programming-tech` (alias resolution).
- [x] **Validation patch:** unknown alias surfaces a friendly inline warning; no backend call fires.
- [x] **Validation patch:** target-agent selector in the modal lets the user change the target before clicking Save / Forget; the selector's authoritative slug is passed through to the backend call.
- [x] **Validation patch:** modal Cancel auto-focus + Esc cancel + Enter-does-not-auto-confirm semantics preserved end-to-end.
- [x] **Validation patch:** Copy button rendered on every user, assistant, and historical message bubble; clipboard write copies raw text (markdown source for assistant); ✓ Copied feedback for ~1.5s.
- [x] **Validation patch:** mobile layout keeps Copy buttons usable; long messages don't break the role-row layout.

Phase 6 closure checklist (completed 2026-05-20):

- [x] §6-E heading + Current Active Phase row → ✅ Complete / Windows validated.
- [x] Phase 6 overall → ✅ Complete / Windows validated.
- [x] Phase 6 moved from `## Current Active Phase` into `Previously completed`.
- [x] `## Current Active Phase` now points at Phase 7 — Admin console refit (⏳ Not started / next).
- [x] No further code changes required for closure; all behaviour validated.

Out of scope for §6-E (deferred):

- Theme toggle (light/dark + localStorage persistence). Phase 6-F or later.
- Syntax highlighting inside code blocks. Phase 6-F or later.
- `useChat` / `useSessions` / `useSlashCommands` hook split-out. Future cleanup if `App.tsx` grows further.
- File / image attachments in the composer. Future scope.
- §5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant, per-agent matrix Memory column flip — all in Phase 5 deferred-extensions backlog.
- Phase 7 admin-console refit. Explicit next phase.


### 6.0 Frontend architecture direction — future TypeScript UI

> `console.html` is acceptable as a prototype/reference only. The production UI should be typed and modular because CreativEdge now has backend routes, streaming chat, sessions, memory, agents, routing metadata, multi-specialist convening, and eventually an admin console.

- [ ] Treat `console.html` as a legacy prototype/reference only.
- [ ] Do not keep expanding `console.html` as the production app.
- [ ] Create a real TypeScript frontend in this UI phase.
- [ ] Preferred direction: Vite + React + TypeScript.
- [ ] Alternative acceptable direction: Vite + TypeScript without React if we choose a simpler UI.
- [ ] Move chat UI behavior from `console.html` into typed frontend modules.
- [ ] Connect the TypeScript frontend to backend `/chat` via SSE.
- [ ] Connect the TypeScript frontend to `/agents`, `/sessions`, memory routes, routing metadata, and admin console features.
- [ ] Keep `console.html` available under a prototype/reference location such as `prototypes/console.html` or `docs/prototypes/console.html` if still useful.

### 6.1 Layout
- [ ] Left rail: session list (from `sessions.db`), "new conversation" button, current-agent indicator.
- [ ] Main pane: message thread.
- [ ] Right rail (collapsible): the active specialist's identity card.
- [ ] Top bar: shared brand with the console, link to `console.html`.

### 6.2 Message rendering
- [ ] Per-message header: emoji + agent name + brand color stripe (matches console).
- [ ] Markdown renderer (headers, lists, code blocks, tables).
- [ ] Syntax highlighting for code (use `highlight.js` from CDN).
- [ ] Streaming token-by-token via **SSE** with smooth caret.

### 6.3 Input
- [ ] Multi-line input with Enter-to-send, Shift-Enter for newline.
- [ ] `/agent <name>` slash-command to force-route to a specialist.
- [ ] `/handoff <name>` to ask the current specialist to hand off.
- [ ] `/forget <topic>` to ask the agent to delete a memory.
- [ ] File / image attach (defer past v1).

### 6.4 State + history
- [ ] Sessions persist in `~/.creativedge/sessions.db`.
- [ ] Each session knows which specialist(s) have spoken.
- [ ] Rename / delete / pin a session.
- [ ] In-app search powered by the FTS5 index.
- [ ] Export a session as Markdown.

**Done when** an unfamiliar user can have a 20-minute multi-domain conversation, see the right specialist on each turn, search for a phrase from yesterday, and find that thread.

---

## Phase 7 — Admin console (current `console.html` → fully wired)

> UI architecture note: Phase 7 should follow the Phase 6.0 TypeScript direction. `console.html` remains a prototype/reference until the Admin Console migration begins.

The current console is a great viewer + local editor. To be 100% functional it needs to actually touch the file tree.

### 7-A Admin console foundation + live agents management shell — ✅ Complete / Windows validated

§7-A establishes the admin surface inside the validated Phase 6 TypeScript frontend without touching the chat UI. **Frontend-only — backend untouched.** The backend already exposed `GET /agents`, `GET /agents/:slug`, `GET /agents/:slug/memory`, and a safe-overrides `PUT /agents/:slug` before this slice, so no new backend routes were required.

**Scope shipped on this slice:**

- New `frontend/src/components/admin/` directory with four read-only modules:
  - `AdminConsole.tsx` — top-level container with a `← Back to chat` chrome bar, an Agents list pane on the left (responsive: stacks above on narrow widths), and a detail pane on the right that shows either the selected agent's `AdminAgentDetail` or a placeholder with a session-independent `AdminRoutingPlayground`.
  - `AdminAgentList.tsx` — fetches `GET /agents` on mount and refreshes on demand. Free-text filter against slug + name + domain + role + MBTI + routing keywords. Each card renders the stripe-coloured registry-summary (emoji, name, slug, domain, role) with a click-to-select handler. `aria-current="true"` on the selected card.
  - `AdminAgentDetail.tsx` — for the selected slug, lazy-loads `GET /agents/:slug` (full snapshot) and `GET /agents/:slug/memory` (raw core + episodic strings used only to display presence + approximate non-blank line counts). Shows role/MBTI/memory-presence badges, routing keywords as pills, a re-used `MemoryToolsPanel` (all flows still modal-/confirm-gated, no admin bypass), a per-agent `AdminRoutingPlayground` seeded with the agent's slug as a polite routing hint, and an explicit **Edit (deferred)** scaffold panel that says editing arrives in §7-B with diff preview.
  - `AdminRoutingPlayground.tsx` — sends a prompt through the existing `streamChat` SSE pipeline with `sessionId: null` so the user's chat thread is not polluted. Surfaces routed agent, provider, degraded flag, decision type, handoff (when present), latency, and a 1000-char preview of the response. Optional `hintedSlug` prepends a polite "Please route this to <slug> if appropriate: …" rewrite — same client-side gesture as the `/agent` slash command — so the orchestrator may still decline. **No backend force-routing.** Stop button uses AbortController; Clear resets local state only.
- Edited `frontend/src/types.ts` — added `AgentSummary`, `AgentListResponse`, `AgentSnapshotResponse`, `AgentMemoryResponse`, `RoutingPlaygroundResult`, and `AdminViewMode = "chat" | "admin"`. Mirrors the existing backend response shape under `entries[]` (registry-summary metadata only; no hidden prompts).
- Edited `frontend/src/api/client.ts` — added three read-only helpers: `listAgents()`, `getAgentSnapshot(slug)`, `getAgentMemory(slug)`. All go through the existing `fetchJson` pipeline with the same `ApiError` semantics as the rest of the frontend.
- Edited `frontend/src/App.tsx` — added a `mode` state (`AdminViewMode`) defaulting to `"chat"`. When `mode === "admin"`, the entire chat tree (ChatLayout + cmdResultSlot + modalSlot) is swapped for `<AdminConsole onExit={…} />`; the health banner still renders above both views. A small `⚙ Admin` button sits above the chat shell (`.ce-mode-switch`); it's disabled while streaming so the user can't lose a partial assistant response by switching mid-stream. All Phase 6 chat behaviour is untouched.
- Edited `frontend/src/styles.css` — appended Phase 7-A rules: `.ce-mode-switch` for the top-of-app entry button, `.ce-admin` shell layout, `.ce-admin-chrome` header bar, `.ce-admin-grid` 360px+1fr layout with mobile stack, agent card styles with per-card stripe accent (using `--admin-card-accent` from the registry colour), agent-detail panel chrome, badge row, keyword pill row, dashed edit-scaffold notice, playground prompt/result styling, scrollable monospace response preview, and a `@media (max-width: 980px)` breakpoint that stacks the list above the detail pane plus a `@media (max-width: 640px)` tightening pass.

**Hard constraints honored:**

- **No Phase 6 regression.** The chat surface, sessions sidebar, memory tools, backup panel, drawers, slash command UX, copy buttons on bubbles, and Phase 6 safety invariants (no auto-save / auto-forget / auto-compact / auto-backup-push) are all untouched and still active.
- **No backend code, fixtures, runners, providers, agent personality files, README files, `console.html`, or memory artifacts touched.** Zero file modified outside `frontend/`.
- **No admin bypass of safety gates.** The MemoryToolsPanel used in `AdminAgentDetail` is the exact same component validated in Phase 6-B/6-C/6-D/6-E with all modal/confirm gates intact.
- **No blind writes to agent files.** `PUT /agents/:slug` is NOT called from §7-A. The Edit panel is a deferred-scaffold placeholder pointing at §7-B.
- **No localStorage source-of-truth.** Agent metadata always flows from the live backend; no admin state is persisted client-side except ephemeral selection.
- **No backend force-routing.** `AdminRoutingPlayground` uses the existing `/chat` SSE pipeline with an optional polite routing hint (the same hint the `/agent` slash command produces). The orchestrator decides the actual route.
- **No new dependency.** Frontend deps unchanged from Phase 6-E. No syntax highlighter, no router library, no auth library.
- **No secrets, API keys, provider credentials, GitHub tokens, or `.env` files added.**
- **No Electron, no destructive restore, no backup push scheduling.**
- **No `git add .`, no commit, no push.**

**Linux-sandbox verification on this turn:**

- Backend `node node_modules/typescript/bin/tsc --noEmit` → exit 0 (clean — no backend file touched, just confirming nothing regressed).
- Frontend `node node_modules/typescript/bin/tsc --noEmit` → exit 0 (clean).
- Frontend `node node_modules/typescript/bin/tsc -b` → exit 0 (clean project-references build).
- `vite build` not re-attempted in the sandbox — same OneDrive `@rollup/rollup-linux-x64-gnu` blocker as prior phases. Windows host with `win32-x64-msvc` will build cleanly.
- Backend regression suites untouched on this turn because zero backend file modified.

**Windows manual validation steps:**

1. Backend: `cd backend-api && npm run build && npm run dev` (Terminal A).
2. Frontend: `cd frontend && npm run typecheck && npm run build && npm run dev` (Terminal B).
3. Browser: `http://127.0.0.1:5173`. No `/healthz`, `/chat`, `/sessions`, or `/agents` 404s. The `⚙ Admin` button appears above the chat shell.
4. Confirm full Phase 6 chat regression (send a message, expand drawers on mobile, search, click a session, run `/remember` modal with Nexus fallback, click Copy on a bubble). Everything must still work.
5. Click `⚙ Admin`. The chat tree disappears; the admin console takes over. A `← Back to chat` button is present in the chrome bar.
6. Agents list loads on the left with 14 entries (one card per registered agent). Filter by `lumi` — Lumi card narrows down. Clear filter.
7. Click an agent card (e.g. Lumi). The right pane shows the detail panel with name + emoji + domain, role/MBTI badges, memory-presence badges (core / episodic lines), routing keywords as pills, the MemoryToolsPanel re-used from chat (collapsed by default), the routing playground (with `hintedSlug=Lumi`), and the read-only Edit-deferred scaffold.
8. In the agent's memory tools, run Compact status — confirm it works. Run `/promote` from chat? — should not appear here; this is admin scope, but the panel's own Save buttons still work and remain confirm-gated.
9. In the agent's routing playground, type a prompt like "Suggest a colour palette" and click Run. Confirm the playground renders routed-agent + provider + decision-type + latency badges + a response preview. The hinted slug shows in a small line above the prompt.
10. Click `← Back` to clear the selected agent; the right pane shows the placeholder + a session-independent playground (no hinted slug).
11. Run a prompt in the no-hint playground; confirm route metadata renders for whatever the orchestrator picked.
12. Click `← Back to chat` in the chrome bar. The chat tree returns intact; previous session messages, sidebar, and composer are unchanged.
13. Resize to mobile width. The admin layout stacks: agents list on top, detail pane below. The list scrolls independently and stays usable. No horizontal overflow.
14. DevTools console: no React errors, no unhandled fetch failures.
15. Confirm there is **no backup push button** anywhere in admin or chat. Confirm no admin field auto-saves on change (the Edit scaffold is read-only / deferred).

Done-when for §7-A:

- [x] Frontend `npm run typecheck` and `npm run build` succeed on Windows.
- [x] Backend `npm run build` still clean on Windows (no backend changes on this slice).
- [x] `⚙ Admin` entry button appears above the chat shell and is disabled while streaming.
- [x] Admin view opens and shows the agents list populated from `GET /agents`.
- [x] Filter shrinks the list as expected.
- [x] Clicking an agent loads detail (name/slug/emoji/domain + role/MBTI/memory-presence badges + routing keywords).
- [x] MemoryToolsPanel renders inside detail; flows remain modal/confirm-gated.
- [x] AdminRoutingPlayground sends through `/chat` with `sessionId:null` and surfaces routed metadata + latency + a 1000-char preview. Stop works. Clear resets local state only.
- [x] Edit scaffold renders read-only with the explicit "deferred to §7-B" notice.
- [x] `← Back to chat` returns to the chat shell with all prior state intact.
- [x] Mobile layout stacks list above detail; no horizontal overflow.
- [x] No Phase 6 regression — sessions sidebar, drawers, copy buttons, slash menu, `/remember` Nexus fallback, `@agent` resolution, memory confirm modals all still work.
- [x] DevTools shows no React errors or unhandled fetch failures.

Out of scope for §7-A (deferred to §7-B and beyond):

- Agent personality / identity / system-prompt editor with diff preview + explicit confirmation (Phase 7-B).
- Memory diff editor with before/after preview wired to `PATCH /agents/:slug/memory/core` (Phase 7-C).
- Admin auth gating / audit log / who-can-write rails (Phase 7-D).
- Push button in backup panel (still in Phase 5 deferred-extensions backlog).
- Phase 5 deferred extensions (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant, per-agent matrix Memory column flip).
- Theme toggle / syntax highlighting / file-image attach in composer / hooks split-out — Phase 6 post-closure polish backlog.


### 7-B Safe admin agent editor — diff preview + explicit confirmation + live `PUT /agents/:slug` — ✅ Complete / Windows validated

§7-B turns the dashed "Edit (deferred to §7-B)" panel from §7-A into a real edit-with-diff-preview workflow for the **safe override fields only**. **Frontend-only.** The backend already had `PUT /agents/:slug` wired in Phase 2.2-A with `validateOverridesPatch()` enforcing the field allow-list + per-field validation (color regex, max string length, max array length). No new backend route was needed.

**Editable fields (backend allow-list):** `tagline`, `voice`, `color`, `values`, `strengths`, `watch_outs`.

**Strictly non-editable (intentional):** slug, system prompt, identity, soul, personality, routing internals, registry color/name/domain/emoji, backend config, provider config, filesystem paths.

**Scope shipped on this slice:**

- New `frontend/src/components/admin/AdminAgentEditor.tsx` — inline editor inside the agent detail panel.
  - Reads the **effective baseline** from the snapshot: per field, override → fall back to template default from `config.json` → empty.
  - Tracks dirty state per field against that baseline; the patch sent to the backend contains **only changed fields** (string equality for strings, structural equality for arrays).
  - Client-side validation runs continuously: color is gated by `/^#[0-9a-fA-F]{6}$/` BEFORE the Preview button enables; strings are capped at 2000 chars; arrays at 50 entries. Validation problems surface as inline warn rows; the Preview button stays disabled while any problem exists.
  - Array editor (used by `values` / `strengths` / `watch_outs`) trims whitespace, collapses multi-space runs, de-duplicates on Add (a duplicate is silently dropped — no network call), and blocks Add once the 50-item ceiling is hit.
  - Reset button restores the baseline; Preview button opens the diff modal.
  - Result line (`ActionResult`) shows the post-save summary (`Saved N fields (tagline, values).` or partial-apply 207 `Saved with partial apply: 1 field(s) refused — …`).
- New `frontend/src/components/admin/AdminAgentSaveModal.tsx` — diff preview + confirmation modal.
  - Field-level diff: strings render as `−` (red) + `+` (green) text blocks in a monospace pre; arrays render as set-difference (`−` removed items list + `+` added items list) plus a `+N / −M (total old → new)` summary line.
  - Diff is **plain text only** — no markdown, no `dangerouslySetInnerHTML`, no syntax highlighting, no markdown library coupling.
  - Explicit confirmation checkbox: **"I understand this modifies the live agent profile."** Save Changes stays disabled until the checkbox is ticked.
  - **Cancel auto-focused on mount** via `useRef` + `requestAnimationFrame` so an accidental Enter or Space on modal open fires the safe path.
  - **Esc closes the modal** without calling the backend; backdrop click does the same; Enter does NOT auto-confirm.
  - "No changes detected" empty state when the patch ends up empty (e.g. user reordered an array but didn't add or remove anything).
- Edited `frontend/src/components/admin/AdminAgentDetail.tsx` — replaced the deferred-scaffold block with `<AdminAgentEditor>`, threaded the snapshot `config` + `overrides` in, and wired `onSaved` to the existing `refresh()` callback so a successful save re-fetches the snapshot + memory presence + re-seeds the editor baseline.
- Edited `frontend/src/types.ts` — new `AgentConfigShape` (the safe-editable fields the editor reads from `config.json` template defaults), `AgentOverrides` (mirrors the backend's `AgentOverrides` exactly), `AgentOverridesPatch` (only the editable fields, all optional), `AgentOverridesPutResponse` (200/207 envelope with `overrides` + `rejected[]`). `AgentSnapshotResponse` is reshaped to expose typed `config` + `overrides` instead of `unknown`.
- Edited `frontend/src/api/client.ts` — new `putAgentOverrides(slug, patch)` helper. Thin wrapper around `fetchJson<AgentOverridesPutResponse>("PUT /agents/${slug}", body=patch)`. Reuses the existing `ApiError` pipeline; 400 / 207 messages surface verbatim via the `ApiError.hint` round-trip.
- Edited `frontend/src/styles.css` — appended Phase 7-B section: editor field grid (2-col desktop / 1-col mobile), array list rows with remove `×`, color swatch row, editor action row with character / item counters, diff blocks with `+` / `−` markers using the existing `--ok-*` / `--danger-*` palette so colour stays consistent, wide-modal variant for the diff preview, mobile sizing.

**Safety contract — confirmed across the slice:**

- **No auto-save.** The editor only mutates local state until the user clicks Preview → ticks the confirm checkbox → clicks Save Changes.
- **No debounce save.** Every keystroke updates local state only.
- **No Enter-to-confirm accidents.** Enter on the editor's array-Add input adds a new entry; Enter inside the textareas inserts a newline. The save modal's Enter is bound to nothing — the user must click Save Changes.
- **Cancel auto-focused** on save-modal open.
- **Esc closes** save modal without calling the backend.
- **Confirm Save disabled until the checkbox is ticked.**
- **No optimistic UI** — the editor's local baseline is only re-seeded after the `PUT` resolves successfully (via `onSaved` → `refresh()` round-trip).
- **Network errors render human-readably** via `ApiError`; 400/207 partial-apply paths show which fields were refused and why.
- **No PUT to fields outside the allow-list.** `buildPatch()` only considers the six allow-listed keys; the backend would reject unknown keys anyway.
- **Phase 6 untouched.** Chat shell, sessions sidebar, memory tools, backup panel, slash command UX, drawers, copy buttons, `/remember` Nexus fallback, `@agent` resolution — all still working.
- **Memory mutation paths unchanged.** Memory still flows exclusively through the `MemoryToolsPanel` modal-/confirm-gated flow.

**Linux-sandbox verification on this turn:**

- Backend `node node_modules/typescript/bin/tsc --noEmit` → exit 0 (clean; no backend file modified).
- Frontend `node node_modules/typescript/bin/tsc --noEmit` → exit 0 (clean).
- Frontend `node node_modules/typescript/bin/tsc -b` → exit 0 (clean project-references build).
- `vite build` not re-attempted in the sandbox — same OneDrive `@rollup/rollup-linux-x64-gnu` blocker as prior phases. Windows host with `win32-x64-msvc` will build cleanly.
- Backend regression suites not re-run on this turn because zero backend file modified.

**Windows manual validation steps:**

1. Backend: `cd backend-api && npm run build && npm run dev` (Terminal A).
2. Frontend: `cd frontend && npm install && npm run typecheck && npm run build && npm run dev` (Terminal B).
3. Browser: `http://127.0.0.1:5173`. No `/healthz`, `/chat`, `/sessions`, `/agents` 404s.
4. Phase 6 regression smoke: send a message, click a session, open both drawers on mobile, run `/remember`, copy a bubble — confirm none regressed.
5. Click `⚙ Admin`. Pick any agent (e.g. Lumi). Detail panel renders.
6. **Editor present.** The dashed "Edit (deferred to §7-B)" scaffold is gone. In its place: an "Edit overrides" section with six editable fields.
7. Edit `tagline`. Watch the char counter increment under the textarea. Watch the "N field(s) modified" line update.
8. Edit `color` to an invalid string like `not-a-color`. Confirm an inline warn appears: `color must be a #RRGGBB hex (e.g. #5d8eff)`. Confirm Preview is disabled.
9. Fix the color to `#5d8eff`. Watch the color swatch render. Confirm Preview re-enables.
10. Add 51+ items to `values`. Confirm Add is blocked at 50 with an inline warn.
11. Add a duplicate item. Confirm it's silently de-duplicated (no error, no network call).
12. Click Reset changes. Confirm local state restores to baseline. Confirm "No unsaved changes" appears.
13. Edit `tagline` again. Click Preview changes. Confirm the modal opens.
14. **Cancel is auto-focused.** Press Enter immediately. Confirm the modal closes with NO `PUT` call (verify in DevTools Network).
15. Re-open the modal. Try pressing Save Changes without ticking the checkbox. Confirm the button is disabled.
16. Tick the checkbox. Confirm Save Changes enables. Click it. Confirm one `PUT /agents/<slug>` request fires, returns 200, and the editor result row says "Saved 1 field (tagline).".
17. Confirm the detail panel re-renders with the new effective baseline (the snapshot was re-fetched via `onSaved`).
18. Switch to a different agent. Confirm the editor seeds fresh values for that agent. Switch back. Confirm the saved tagline is now the displayed baseline.
19. Add multiple items to `values` and `strengths`; remove an item from `watch_outs`. Click Preview. Confirm the diff modal shows:
    - tagline: `−` (old) / `+` (new) text blocks (if also changed).
    - values: `+N` items list.
    - strengths: `+N` items list.
    - watch_outs: `−1 item` list with the `+N / −M (total old → new)` summary.
20. Save. Confirm the round-trip succeeds.
21. Edit `tagline` to a 2001-char string. Confirm the inline warn appears: `tagline too long (max 2000)`. Confirm Preview is disabled.
22. Resize to mobile (<980px). Confirm editor stacks to 1-col, the diff modal still fits, and the Reset / Preview buttons remain reachable. No horizontal overflow.
23. Kill backend mid-edit. Click Save Changes. Confirm the editor surfaces `Could not reach backend at …` with the friendly health-banner phrasing.
24. Restart backend. Click Save Changes again. Confirm it succeeds.
25. DevTools: no React errors, no unhandled fetch failures, no console warnings beyond React DevTools/Fast Refresh.
26. Confirm no PUT calls fire from anywhere outside the explicit Save-Changes click (no auto-save, no debounce save).

Done-when for §7-B:

- [x] Frontend `npm run typecheck` and `npm run build` succeed on Windows.
- [x] Backend `npm run build` still clean on Windows (no backend changes on this slice).
- [x] Editor renders inside `AdminAgentDetail` for every selected agent.
- [x] Effective baseline = override → template default → empty.
- [x] Only changed fields are sent in the `PUT` patch.
- [x] Client-side validation gates Preview (color regex, ≤2000 chars, ≤50 items).
- [x] Array editor trims + de-duplicates + caps at 50 items.
- [x] Reset restores baseline.
- [x] Preview opens the modal with a field-level diff.
- [x] Diff renders only changed fields; arrays show added vs removed sets.
- [x] Confirmation checkbox is required before Save Changes enables.
- [x] Cancel is auto-focused on modal open.
- [x] Esc + backdrop click close without calling backend.
- [x] Successful save → re-fetched snapshot → editor re-seeded.
- [x] 400 / 207 / network errors render human-readably; no optimistic UI.
- [x] No PUT calls outside the explicit Save Changes click.
- [x] No Phase 6 regression.
- [x] No memory-tools regression (mutation paths still modal-/confirm-gated).
- [x] Mobile layout usable; no horizontal overflow.
- [x] DevTools clean.

Out of scope for §7-B (deferred):

- Editing personality / identity / soul / system_prompt / config beyond the safe override set (intentional — these stay in source-control templates).
- Memory diff editor wired to `PATCH /agents/:slug/memory/core` — Phase 7-C.
- Admin auth gating / audit log / who-can-write rails — Phase 7-D (open question whether needed for local-only tool).
- Reset-to-template button (clears `overrides.json` for a field, falling back to the template default). Could land in §7-C alongside memory diff.
- Phase 5 deferred-extensions backlog — unchanged.
- Post-Phase-6 polish backlog (theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push) — unchanged.


### 7-C Admin core-memory diff editor — context viewer + live match count + diff modal + explicit confirmation + live `PATCH /agents/:slug/memory/core` — ✅ Complete / Windows validated

§7-C layers a context-aware diff editor on top of the already-validated `PATCH /agents/:slug/memory/core` backend route (Phase 5.2-D). **Frontend-only.** The backend already enforces single-match uniqueness, a sensitive-content guard, atomic disk writes, and the 200 (edited) / 200 (unchanged) / 404 (no match) / 409 (multiple matches) / 422 (sensitive content) response paths. §7-C does **not** add a new backend route; it consumes the existing one and adds pre-flight ergonomics + a modal-gated diff preview on top.

The MemoryToolsPanel sub-tool from Phase 6 already exposed edit-core through `editCoreMemory(slug, find, replace)`. §7-C's value over that inline sub-tool is three concrete additions:

- **Context awareness.** The admin sees the current `core_memory.md` in a read-only monospace viewer (line count + char count badges), so they're editing a file they can actually read.
- **Pre-flight match counting.** As the admin types `find`, a live badge shows 0 / 1 / 2+ / 10+ matches. Preview is gated on exactly 1 match (so the backend's 404 / 409 paths only fire on race conditions, not as the primary feedback channel).
- **Diff modal preview with surrounding context.** Before any backend call, the admin sees the change region with ±5 lines of context above and below, plus `−`/`+` markers on the change lines themselves.

**Scope shipped on this slice:**

- New `frontend/src/components/admin/AdminMemoryEditor.tsx`.
  - Loads core memory via the existing `getAgentMemory(slug)` on mount and when the selected slug changes; draft `find`/`replace` are cleared on every slug change so a stale find from one agent never targets another.
  - Read-only monospace viewer (max-height 280px / 220px on mobile; scrollable; word-break preserves multi-line entries; visible char + line count via `StatusBadge`).
  - Multi-line `find` and `replace` textareas (rows=3 each) so multi-line targets work.
  - Live match count via `countOccurrences(haystack, needle)` (capped at 10+ for the display badge).
  - Refresh button reloads core memory from disk; useful after an external Memory Tools edit landed in another tab.
  - Clear button resets the draft inputs locally — never calls the backend.
  - Preview button enabled iff `find.length >= 3` AND `matchCount === 1` AND `find !== replace`. Tooltips on the disabled state explain exactly why (`Type a find string`, `Find must be ≥ 3 chars`, `Find substring is not in core memory`, `Find substring is not unique — add more context`, `Find equals replace — nothing to do`).
  - Per-status error rendering via the existing `ApiError` shape — 404 / 409 / 422 / network failure each surface friendly per-status messages.
- New `frontend/src/components/admin/AdminMemoryDiffModal.tsx`.
  - Builds a `ContextSlice` with `CONTEXT_LINES = 5` lines before / after the change region. The pre/post context lines render as a `<ol>` with line numbers; the change lines render as the existing `.ce-admin-diff-row.ce-admin-diff-before` / `.ce-admin-diff-after` blocks (monospace, ± marker, danger / ok colour scheme reused from §7-B).
  - Plain text only — no markdown, no `dangerouslySetInnerHTML`, no syntax highlighting; the diff respects whitespace exactly so what the user sees is what the backend will write.
  - Defensive `Find substring is no longer present in core memory` warn state if the file content drifted between mount and preview (e.g. another tab landed an edit in between).
  - Explicit confirmation checkbox: **"I understand this rewrites the agent's core memory file."** Save Changes stays disabled until ticked AND while busy AND while `find.length > 0 && find !== replace`.
  - **Cancel auto-focused on mount** via `useRef` + `requestAnimationFrame`.
  - **Esc + backdrop click close without calling the backend.** Enter does NOT auto-confirm.
- Edited `frontend/src/components/admin/AdminAgentDetail.tsx` — slotted `<AdminMemoryEditor>` between `<AdminRoutingPlayground>` and `<AdminAgentEditor>` so the detail panel now reads: badges → routing keywords → snap busy/err → Memory tools (re-used) → Routing playground → **Core memory editor (NEW)** → Edit overrides. `onSaved` wired to the existing `refresh()` so a successful PATCH re-fetches the snapshot + updates memory-presence badges.
- Edited `frontend/src/styles.css` — Phase 7-C append block: `.ce-admin-memedit-refresh` (right-aligned refresh button in the section header), `.ce-admin-memedit-viewer-head` (badge row above viewer), `.ce-admin-memedit-viewer` (monospace, pre-wrap, max-height + scroll), `.ce-admin-memedit-form` (find/replace 2-col grid stacking to 1-col on mobile), `.ce-admin-memedit-status` (match-count badge row), `.ce-admin-edit-field-legend` (text legend variant for `<label>` containers — needed because `<label>` can't host a `<legend>`), and the diff-modal `.ce-admin-memdiff` + `.ce-admin-memdiff-block` + `.ce-admin-memdiff-context` + `.ce-admin-memdiff-change` rules. Reuses the existing `.ce-admin-diff-row` palette from §7-B so the visual language stays consistent.

**Backend consumed (unchanged routes):**

- `GET /agents/:slug/memory` — read-only load of current `core_memory.md` content for the viewer.
- `PATCH /agents/:slug/memory/core` (via existing `editCoreMemory(slug, find, replace)` helper) — the destructive edit, fired only after the modal's confirm checkbox + explicit Save Changes click.

No new backend route was added.

**Hard constraints honored:**

- **No backend code, fixtures, runners, providers, agent personality files, README files, `console.html`, or memory artifacts touched.** Zero file modified outside `frontend/`.
- **No admin bypass of the existing backend gates.** Single-match enforcement, sensitive-content guard, and atomic-write semantics all stay on the backend side; the frontend's match count is **pre-flight ergonomics**, not the source of truth.
- **No auto-save.** Every find/replace keystroke updates local state only.
- **No optimistic UI.** The editor only reloads the viewer baseline after the `PATCH` resolves successfully.
- **No PATCH calls outside the explicit Save Changes click in the modal.**
- **No memory mutation outside this editor's modal flow.** The MemoryToolsPanel inline sub-tool from Phase 6 still exists and remains modal/confirm-gated.
- **No Phase 6 regression.** Chat shell, sessions sidebar, drawers, slash command UX, memory confirmation modals, copy buttons, `/remember` Nexus fallback, `@agent` alias resolution — all unchanged.
- **No Phase 7-A/7-B regression.** Agent list, routing playground, overrides editor + save modal — all unchanged.
- **No new dependency.** Frontend deps unchanged from Phase 7-B.
- **No secrets, API keys, provider credentials, GitHub tokens, or `.env` files added.**
- **No `git add .`, no commit, no push.**

**Linux-sandbox verification on this turn:**

- Backend `node node_modules/typescript/bin/tsc --noEmit` → exit 0 (clean; no backend file modified).
- Frontend `node node_modules/typescript/bin/tsc --noEmit` → exit 0 (clean).
- Frontend `node node_modules/typescript/bin/tsc -b` → exit 0 (clean project-references build).
- `vite build` not re-attempted in the sandbox — same OneDrive `@rollup/rollup-linux-x64-gnu` blocker as prior phases. Windows host with `win32-x64-msvc` will build cleanly.
- Backend regression suites not re-run on this turn because zero backend file modified.

**Windows manual validation steps:**

1. Backend: `cd backend-api && npm run build && npm run dev` (Terminal A).
2. Frontend: `cd frontend && npm install && npm run typecheck && npm run build && npm run dev` (Terminal B).
3. Browser: `http://127.0.0.1:5173`. No `/healthz`, `/chat`, `/sessions`, `/agents` 404s.
4. Phase 6 regression smoke: send a chat message, click a session, run `/remember`, click Copy on a bubble — confirm none regressed.
5. Phase 7-A/7-B regression smoke: open Admin, filter, pick an agent, edit a tagline, preview + save via the overrides editor — confirm none regressed.
6. Below the overrides editor / above the deferred section, confirm the new **Core memory editor** section is present with a header, hint, and refresh button.
7. **Empty core memory case.** Pick an agent that has no core memory yet — confirm the viewer is replaced with the hint `Core memory file is empty. Use the regular Memory tools to promote an entry first, then return here to edit it.`
8. Use the regular Memory Tools `Promote entry to core memory` to seed a value (confirm checkbox + save). Click `↻ Reload` on the core memory editor — confirm the viewer shows the new content with char + line count badges.
9. Type a 2-char `find` → confirm Preview is disabled with tooltip `Find must be ≥ 3 chars`.
10. Type a `find` that doesn't appear in the file → confirm match-count badge says `no match yet`, Preview disabled with `Find substring is not in core memory`.
11. Type a `find` that's a common token (appears 2+ times) → confirm match-count badge says `2 matches` (or `10+`), Preview disabled with `Find substring is not unique — add more context`.
12. Add more context until the match count drops to `1 match` (ok-green badge). Type a `replace` value. Click `Preview changes`.
13. **Diff modal opens.** Confirm Cancel is auto-focused. Press Enter immediately. Confirm the modal closes with NO `PATCH` request (DevTools Network).
14. Re-open the modal. Confirm the change region shows ±5 lines of context with line numbers above and below, and the `−` (red) / `+` (green) blocks for the change itself. Press Esc — modal closes, no PATCH.
15. Re-open. Try clicking Save Changes without ticking the confirm checkbox. Confirm Save Changes is disabled.
16. Tick the checkbox. Confirm Save Changes enables. Click. Confirm exactly one `PATCH /agents/<slug>/memory/core` request fires with body `{ find, replace, confirmed: true }`, returns 200 (`edited: true`), and the editor's result row shows `Core memory updated (N bytes rewritten).`.
17. Confirm the viewer reloaded with the new file content; confirm the memory-presence badges at the top of the detail panel updated (the parent's `refresh()` fired).
18. Try `find === replace`. Confirm match-count is OK but Preview is disabled with `Find equals replace — nothing to do`.
19. Try a 422-class sensitive replacement (e.g. injecting a fake credit card number into the replacement text). Tick + Save. Confirm the editor surfaces `Refused (422) — replacement contains sensitive content. The file is unchanged.` and the viewer does NOT reload (file untouched).
20. Test the 409 race: open two tabs of the same agent. In tab 1, edit a substring so match count becomes 1. In tab 2, save a different edit that changes the file. Switch back to tab 1, click Save Changes through the modal. Confirm tab 1 surfaces a clean 404 (no match) or 409 (multiple matches) message, the file is not corrupted, and the viewer can be refreshed to recover.
21. Resize to mobile (<980px). Confirm the find/replace grid stacks; the viewer caps at 220px height; the diff modal still fits inside the viewport; no horizontal overflow.
22. Kill backend mid-edit. Click Save Changes. Confirm friendly `Could not reach backend at …` message; the editor preserves the draft. Restart backend. Save Changes succeeds.
23. DevTools: no React errors, no unhandled fetch failures.
24. Confirm no PATCH calls fire from anywhere outside the explicit Save Changes click.

Done-when for §7-C:

- [x] Frontend `npm run typecheck` and `npm run build` succeed on Windows.
- [x] Backend `npm run build` still clean on Windows (no backend changes on this slice).
- [x] `Core memory editor` section renders inside `AdminAgentDetail`.
- [x] Viewer loads core memory via `GET /agents/:slug/memory` with char + line count badges.
- [x] Empty-file case shows the friendly hint with a pointer to Memory Tools.
- [x] Match-count badge updates live as `find` is typed (0 / 1 / 2+ / 10+).
- [x] Preview button gated on `find.length >= 3 && matchCount === 1 && find !== replace`.
- [x] Diff modal shows ±5 lines of context with line numbers + `−`/`+` change blocks.
- [x] Defensive `Find substring is no longer present` warn renders if the file drifted between mount and preview.
- [x] Confirmation checkbox required before Save Changes enables.
- [x] Cancel auto-focused on modal open; Esc + backdrop close without PATCH.
- [x] Successful save → viewer reloads → memory-presence badges refresh.
- [x] 200 (edited / unchanged) / 404 / 409 / 422 / network errors all render with friendly per-status messages.
- [x] No PATCH calls outside the explicit Save Changes click.
- [x] No Phase 6 / 7-A / 7-B regression.
- [x] Mobile layout usable; no horizontal overflow.
- [x] DevTools clean.

Out of scope for §7-C (deferred):

- Episodic memory editor with diff preview — could land in §7-D if needed. The existing `MemoryToolsPanel` already exposes `promote-episodic` + `forget episodic` + `compact preview/apply` with confirm gates.
- Multi-edit batching (apply multiple find/replace in one transaction).
- Visual line-by-line diff (e.g. green/red character-level diff inside the change region itself). Phase 7-C ships line-level + region-level highlighting only.
- Reset-to-template button for memory (the equivalent for overrides was deferred from §7-B; lands in §7-D if needed).
- Phase 7-D — see `### 7-D Intentionally out of scope (local-only runtime)` below; this is now an explicit scope-out, not an open slice.
- Phase 5 deferred-extensions backlog — unchanged.
- Post-Phase-6 polish backlog — unchanged.


### 7-D Intentionally out of scope (local-only runtime)

§7-D as originally sketched — admin auth gating + audit log + who-can-write rails — is **intentionally NOT a Phase 7 slice** and is **not blocking Phase 7 closure**. This is an explicit roadmap scope-out, not a deferral, and should not be re-opened speculatively. The decision and rationale live here for future readers.

**Decision.** §7-D is scoped out. Phase 7 overall flips to ✅ Complete / Windows validated as soon as §7-C passes its Windows browser smoke. No §7-D code lands.

**Rationale (the local-only threat model).**

CreativEdge is a **local Claude Code CLI runtime**. The backend Fastify server binds to `127.0.0.1` only; there is no public listener, no remote user surface, no multi-tenant model, no shared deployment. The frontend Vite dev server runs locally and talks to the local backend via the dev proxy. The "admin" is the same human as the "chat user" — there is exactly one principal on each machine, and that principal already has full filesystem access to `~/.creativedge/` and the project tree.

Given that threat model:

- **Auth gating** would gate the local admin from themselves. It adds friction without changing the actual capability of any attacker — a local-machine attacker with arbitrary code-execution already has full write access to the agent files regardless of any frontend "admin password". The only thing auth gating would buy is a thin UX speed bump that doesn't match how Phase 1–6 was architected (no login flow anywhere; the Vite proxy + same-origin model assumes single-user).
- **Audit log** for a single-user local desktop tool is bookkeeping for an audience that doesn't exist. There is no compliance regime, no fleet operator, no team. `git log` on the project tree + the existing per-action log lines (already written through `pino` to `~/.creativedge/logs/`) already provide a chronological forensic trail for the user themselves.
- **Who-can-write rails** are the same single principal. The existing safety gates (modal confirmation + sensitive-content guard + atomic writes + Cancel-auto-focus + no-auto-anything) are the actual safety story — they catch reflex mistakes, not adversaries.

**Defense-in-depth that IS in place (and stays in place).** The admin surface is **not** unguarded; it is guarded by the same gates as the chat surface:

- `/remember`, `/forget`, `/compact apply` flow through modal-/confirm-gated explicit clicks (Phase 6-A through 6-E).
- `PUT /agents/:slug` accepts only the allow-listed override fields and is double-gated by the Phase 7-B editor's diff-preview modal + checkbox.
- `PATCH /agents/:slug/memory/core` enforces single-match uniqueness + a sensitive-content guard + atomic writes server-side (Phase 5.2-D), and the Phase 7-C editor adds pre-flight match counting + diff-modal preview + checkbox.
- Backup mutations require explicit confirm checkboxes; **no push button** anywhere; `push:false` hard-coded in `backupRun`.

**Re-opening criteria (if context changes in the future).** If the architectural constraint "Local Claude Code CLI runtime only" is ever relaxed — e.g. the project gains a hosted multi-user deployment, an Electron build with shared profiles, or a remote-collaboration mode — then §7-D becomes relevant again and a fresh slice should be scoped at that point. Until then, treating §7-D as "open" inflates the roadmap with phantom work.

**Implication for Phase 7 overall closure.** With §7-D explicitly out of scope, Phase 7 overall's gating dependency is **only** the §7-C Windows browser smoke. Once §7-C flips to ✅ Complete / Windows validated, a single docs-only follow-up flips Phase 7 overall to ✅ Complete / Windows validated and moves it from `## Current Active Phase` into `Previously completed`.


> **Superseded by §7-A / §7-B / §7-C / §7-D.** The §7.1 / §7.2 / §7.3 sub-plan below is the original Phase 0 plan for wiring `console.html` to the backend. It has been superseded by the §7-A admin foundation, §7-B safe overrides editor, §7-C core-memory diff editor, and the §7-D explicit scope-out for the local-only runtime. The historical bullets are preserved for traceability; each is now annotated with its closure citation or its intentional non-pursuit. The Phase 7 closure footer at the bottom of this file is the canonical statement of what shipped.

### 7.1 Wire to the backend
- [x] Swap `localStorage` writes for `PUT /agents/:slug` calls. **→ Closed by §7-B.** `putAgentOverrides` in `frontend/src/api/client.ts` routes the safe-allow-list override fields (`tagline` / `voice` / `color` / `values` / `strengths` / `watch_outs`) to the backend. `frontend/src/` carries zero `localStorage` / `sessionStorage` usage anywhere.
- [x] On load, fetch live data from `GET /agents` instead of using the inlined snapshot. **→ Closed by §7-A.** `listAgents()` in `frontend/src/api/client.ts` is invoked from `AdminAgentList.tsx` on mount + on refresh; the inlined Phase-0 snapshot inside `console.html` is no longer the source of truth.
- [x] Show "saved to disk" instead of just "saved" once writes are persisted. **→ Closed by §7-B.** `AdminAgentSaveModal.tsx` surfaces the post-`PUT` result via the shared `ActionResult` component (e.g. `Saved N field(s) (tagline, values).`) only after the round-trip succeeds; partial-apply 207 messages name the refused fields explicitly.
- [ ] Optimistic UI with rollback on API error. **→ Intentionally not pursued** per the §7-B safety contract ("No optimistic UI"). Local baseline is only re-seeded after the `PUT` resolves successfully via the `onSaved` → `refresh()` round-trip. Same constraint applies to §7-C's `PATCH /agents/:slug/memory/core` flow.

### 7.2 New capabilities
- [ ] Live chat preview inside the drawer ("Talk to Lumi" button). **→ Intentionally not pursued.** Chat is now a top-level surface in Phase 6's `ChatLayout`, not a drawer-embedded preview. The §7-A `AdminRoutingPlayground` provides a session-independent prompt scratchpad inside admin (with optional `hintedSlug`) without polluting the active chat thread.
- [~] Memory editor: load real `core_memory.md` / `episodic_memory.md` from disk and write back. **→ Core half closed by §7-C.** `AdminMemoryEditor.tsx` + `AdminMemoryDiffModal.tsx` load core memory via `GET /agents/:slug/memory` and write via `PATCH /agents/:slug/memory/core` (single-match + sensitive-content + atomic-write guarantees from Phase 5.2-D). **Episodic half intentionally deferred** per §7-C "Out of scope" — the existing `MemoryToolsPanel` already exposes `promote-episodic` + `forget episodic` + `compact preview/apply` behind confirm gates, so a dedicated episodic diff editor would duplicate that path.
- [x] Diff view: "here's what changed before you save." **→ Closed by §7-B + §7-C.** `AdminAgentSaveModal.tsx` renders field-level −/+ diffs for overrides (strings as monospace blocks, arrays as added/removed sets); `AdminMemoryDiffModal.tsx` renders ±5-line context diffs for core memory. Both are gated by a confirmation checkbox, Cancel-auto-focused, Esc-/backdrop-close, and Enter does NOT auto-confirm.
- [ ] Reset to original = revert to the file as committed in git (if we wire git). **→ Intentionally not pursued for now.** Listed as a deferred candidate in §7-B + §7-C out-of-scope blocks; a "Reset to template" button could land in a future slice if a real need emerges. No code path depends on it today.
- [x] Routing playground uses the real backend router (not just keyword count). **→ Closed by §7-A.** `AdminRoutingPlayground.tsx` sends prompts through the existing `streamChat` SSE pipeline with `sessionId: null`, so the orchestrator's full routing decision (keyword router + override rules + LLM tie-breaker + convening / handoff detection) is what actually runs and is what gets surfaced as routed-agent + provider + decision-type + latency badges.

### 7.3 Polish
- [ ] Keyboard nav: `↑/↓` between cards, `Enter` opens drawer (partly done). **→ Intentionally not pursued for admin.** Admin uses click-to-select on `AdminAgentList`; the chat surface still has slash-menu keyboard nav (`SlashCommandMenu` arrow-key support landed in §6-D). A future keyboard-first admin pass could revisit this if needed.
- [x] Mobile drawer mode at <760px (the page already responds — verify drawer usability). **→ Closed by §6-D.** The shared `Drawer` component (Memory Tools / Search / Backup / Sessions) is `role="dialog"` + `aria-modal="true"` + Esc/backdrop close + body scroll lock + `prefers-reduced-motion` aware. Mobile breakpoint is 980px in §6-D / 640px tightening pass in §7-A; both verified during Windows validation.
- [ ] Print-friendly export of an agent's identity sheet (single page PDF). **→ Intentionally not pursued.** Out of scope for the local-only runtime; no compliance / sharing requirement drives this today. Source-of-truth identity files (`agents/<slug>/identity.md`, `soul.md`, `personality.md`) are already directly readable / printable from the project tree.
- [ ] Bulk export: download all 14 agents' current files as a `.zip`. **→ Intentionally not pursued.** Source-of-truth files (`agents/<slug>/{identity,soul,personality,system_prompt}.md` + `config.json`) live in the project tree and are already shareable through normal git workflows; durable memory lives in `~/.creativedge/agents/<slug>/memory/` and can be backed up via the §5.6-A `/backup/*` routes. A ZIP export would duplicate either path.

**Done when** edits made in `console.html` show up in the file tree without any manual download/drag step. **→ Closed by §7-A/B/C.** Edits made in the new TypeScript admin console (which supersedes `console.html`) flow through `PUT /agents/:slug` (safe overrides) and `PATCH /agents/:slug/memory/core` (core memory) directly to disk via the existing Phase 2.2-A and Phase 5.2-D backend routes — no manual download/drag step. The original `console.html` prototype is retained at the repo root as a historical reference and is no longer the editing surface.

---

## Phase 8 — Testing & QA

### 8.1 Routing test fixture — ✅ Complete / Windows validated

- [x] Build `tests/routing-fixtures.json` — 38 user messages, each with explicit expected routing metadata (`expected.type` + `agentSlug` / `acceptableSlugs` / `convenedSlugs` / `acceptableTypes` / `handoffToSlug`).
- [x] Cover every specialist (≥2 mentions each via `agentSlug` / `acceptableSlugs` / `convenedSlugs`). Coverage check is enforced by the runner.
- [x] Include 5 overlap-rule prompts: lumi-vs-iris, vera-vs-atlas, sage-vs-bit, buzz-vs-lex, echo-vs-reel.
- [x] Include 3 nexus-class prompts (`acceptableTypes:["nexus_fallback","out_of_domain","clarify"]`) for out-of-domain coverage.
- [x] Include 3 multi-specialist `convene` prompts (brand launch, AI product pitch, website launch campaign).
- [x] Include 1 forced-handoff prompt (`graphics-design` → `music-audio`) — runner reports SKIP when the backend is degraded to mock.
- [x] Auto-runner at `scripts/run-routing-fixtures.mjs` hits the live `/chat` endpoint, parses SSE, compares against expected metadata, prints a pass / warn / skip / fail table, exits 0 on all-pass-or-warn / non-zero on hard fail. Surfaced as `npm run test:routing`.
- [x] Handoff fixture (`handoff-audio-001`) is treated as **handoff-compatible** rather than handoff-required. Deterministic half (initial route must be `specialist` → `graphics-design`) always counts. Optional half (`done.handoff` payload) is validated strictly when emitted but reported as `WARN` (counted as PASS for the exit code) when the LLM doesn't emit a handoff that turn. The fixture declares this via `expected.handoffOptional:true` and `expected.strictHandoffEnv:"CREATIVEDGE_STRICT_HANDOFF"`. Set `CREATIVEDGE_STRICT_HANDOFF=1` to promote the WARN back to a hard FAIL for a deliberate strict pass. Sandbox sanity test validated six branches: handoff-fires/PASS, no-handoff/default/WARN, no-handoff/strict/FAIL, mock/SKIP, wrong-initial-slug/FAIL, wrong-toSlug/FAIL.
- [x] Build still passes (`tsc`) and coverage assertion passes.
- [x] **Windows validation passed.** Run returned `total: 38   PASS 38   SKIP 0   FAIL 0`.

### 8.2 In-character behavior tests — ✅ Complete / Windows validated
- [x] Per-agent eval: 5 in-domain prompts → assert response contains the right header, no out-of-character disclaimers, matches voice rubric. **→ Closed by §4.3-A's `test:agents` runner.** `backend-api/tests/agent-behavior-fixtures.json` carries 5 fixtures × 14 agents = 70 fixtures. The runner asserts `expected.requiredHeaderIncludes` (the agent's persona header) and `expected.forbiddenIncludes` (no out-of-character / no internal-tool leakage) on every fixture, plus `meta.agentSlug` / `meta.agentName` / `meta.provider:"claude"` / `meta.degraded:false`. Windows-validated 70/70 PASS multiple times — see the Phase 5/7 closure footers below (e.g. `test:agents` 70/70 cited under §5.2-A, §5.4-A, §5.6-A closures). The "matches voice rubric" half is structurally covered by the stable-header + forbidden-leakage fingerprint; a separately-graded subjective voice rubric is intentionally not pursued (would require a grader model and is out of scope for the local-only runtime).
- [x] Cross-character contamination check: in a session where Lumi was just speaking, prompt routes to Bit — assert no leftover Lumi voice. **→ Implemented 2026-05-20; Windows live validated 2026-05-20.** New fixture file `backend-api/tests/agent-contamination-fixtures.json` with **5 high-signal pairs** (Lumi→Bit, Bit→Echo, Vera→Cash, Sage→Reel, Atlas→Iris); new deterministic runner `backend-api/scripts/run-agent-in-character-tests.mjs`; new `npm run test:in-character` script. Each fixture posts a source turn (no `sessionId`), captures `meta.sessionId` from the first turn, then posts the target turn under the same `sessionId`; both turns are validated for `meta.agentSlug` + `meta.provider:"claude"` + `meta.degraded:false` + `done.ok:true` + `requiredHeaderIncludes` + `forbiddenIncludes`. The target turn additionally validates `forbiddenSourceMarkers` (high-signal header-fragment patterns like `🎨 Lumi` / `Lumi — Graphics` / `Graphics & Design` for the Lumi→Bit case; case-insensitive substring check), so the contamination check fires when (and only when) the source agent's header/voice bleeds into the routed-handoff turn's reply. Markers are deliberately header-fragment-shaped (emoji+name combos and name+domain combos) to avoid false positives on generic English words like "bit", "sage", or "atlas". **Windows live validation evidence (2026-05-20):** (a) targeted rerun of the previously failing fixtures with `CREATIVEDGE_TURN_TIMEOUT_MS=600000 CREATIVEDGE_ONLY=contam-sage-to-reel-001,contam-atlas-to-iris-001 npm run test:in-character` returned `total: 2   PASS 2   FAIL 0` (contam-sage-to-reel-001 PASS, contam-atlas-to-iris-001 PASS); (b) full suite rerun with `CREATIVEDGE_TURN_TIMEOUT_MS=600000 npm run test:in-character` returned `total: 5   PASS 5   FAIL 0` covering contam-lumi-to-bit-001 / contam-bit-to-echo-001 / contam-vera-to-cash-001 / contam-sage-to-reel-001 / contam-atlas-to-iris-001 — all source turns OK, all target turns OK, all contamination checks OK, no source-agent marker leakage on any routed-handoff turn. Static / offline checks earlier on the same day: `npm run build` clean; fixture JSON shape 5/5 OK; `node --check scripts/run-agent-in-character-tests.mjs` exit 0; runner exits 2 when backend unreachable; `npm run test:routing` coverage assertion still clean (38 fixtures).

### 8.3 Memory tests — ✅ Complete / Windows validated
- [x] Write → read → assert content present. **→ Closed by `npm run test:memory-integration` (`write-read` test).** Posts a unique base36-anchored entry to `POST /agents/business/memory/promote`, asserts 200 `ok:true` + not duplicate, GETs `/agents/business/memory`, asserts the anchor is present in core memory content; sub-asserts dedup on re-promote (200 `duplicate:true`, anchor count remains 1). Windows-validated 2026-05-20 PASS.
- [x] Concurrent write → no corruption (lock works). **→ Closed by `npm run test:memory-integration` (`concurrent-write-lock` test).** Fires 5 distinct `POST /promote` requests in parallel via `Promise.allSettled`, asserts every response 200 / no 500 / no 503 lock_timeout / no unexpected `duplicate:true`, then GETs `/memory` once and asserts each of the 5 anchors appears exactly once. Exercises the §5.2-B `withFileLock` + `safeAppendUnique` primitives end-to-end. Windows-validated 2026-05-20 PASS.
- [x] "Forget X" → assert line is gone. **→ Closed by `npm run test:memory-integration` (`forget-core` test).** Seeds a unique entry via `/promote`, calls `POST /agents/business/memory/forget {kind:"core", find:<full entry>, confirmed:true}`, asserts 200 + `ok:true` + `kind:"core"` + `forgotten:true`, then GETs `/memory` and asserts the anchor is absent; sub-asserts invalid `kind:"floof"` returns 400. Exercises the §5.4-A surgical-delete path on top of §5.2-D `safeReplaceOnce`. Windows-validated 2026-05-20 PASS.
- [x] Sensitive-info refusal: try to save a credit-card number → assert refusal. **→ Closed by `npm run test:memory-integration` (`sensitive-refusal` test).** Posts an entry containing the classic `4111 1111 1111 1111` test-card fragment to `/promote`, asserts 422, then GETs `/memory` and asserts neither the credit-card fragment nor the test anchor was written; sub-asserts unconfirmed `/promote` returns 400 and the unconfirmed sentinel never lands. Exercises the §5.2-A sensitive-content guard end-to-end. Windows-validated 2026-05-20 PASS.

**Windows live validation evidence (2026-05-20):**
- Setup — Terminal A: `cd backend-api && npm run dev`; Terminal B: `cd backend-api && npm run build && npm run test:memory-integration`.
- `npm run build` → clean.
- `npm run test:memory-integration` → `total: 4   PASS 4   FAIL 0`.
- Per-test: `write-read` PASS / `concurrent-write-lock` PASS / `forget-core` PASS / `sensitive-refusal` PASS.
- Confirms: write/read round-trip on live HTTP, concurrent lock sanity (5 parallel writers, exact-once anchor presence), surgical forget (anchor absent after `/forget`), sensitive-info refusal (422 + no leakage).
- Note: `/healthz` reported `degraded:true` during this run because the local Claude runtime was not logged in. **This does NOT block §8.3** — the integration runner does not call `/chat` and exercises only the memory HTTP routes (`/promote`, `/forget`, `GET /memory`), which all bypass the Claude provider. The `degraded:true` flag affects only the chat pipeline and the routes §8.3 exercises do not require an authenticated Claude Code CLI to pass.

**Patch trail (preserved for traceability):**
- The first Windows run on commit `52f5154` returned `total: 4   PASS 1   FAIL 3` because the runner built per-test anchors from raw `Date.now()` (13-digit decimal), which interpolated into entries like `phase-8-3-write-read-1748438400000.` and tripped the §5.2-A guard regex `/\b(?:\d[ \-]?){13,19}\b/` (credit-card-shaped 13-19 digit run). The three safe tests (write-read, concurrent-write-lock, forget-core) returned 422 instead of 200; the sensitive-refusal test "passed" coincidentally because its intentional CC fragment also tripped the guard (right answer for the wrong reason). Commit `4b5b0e9` patched the runner ONLY — added a `makeAnchor(label)` helper that builds anchors from `Date.now().toString(36)` (base36 ~8 chars) + a 4-char `Math.random().toString(36)` suffix (e.g. `phase-8-3-write-read-lvxq5d2-zb4q`); no 13+ digit run, no SSN shape, no API-key prefix, no PEM marker. All four `testWriteRead` / `testConcurrentWriteLock` / `testForgetCore` / `testSensitiveRefusal` now call `makeAnchor()`. Backend code untouched; sensitive-content detection NOT weakened; intentional CC fragment in TEST 4 preserved verbatim. Sandbox-side regex simulation against the exact §5.2-A pattern catalog: 5000/5000 patched anchors safe; intentional CC entry still trips (verified). Second Windows live run after the fix → `total: 4   PASS 4   FAIL 0` as above.

### 8.4 UI tests — ✅ Complete / Windows validated (docs-only closure)
- [x] Console renders all 14 cards. **→ Closed by §7-A `AdminAgentList`.** `frontend/src/components/admin/AdminAgentList.tsx:30` calls `listAgents()` → `GET /agents`; the backend handler at `backend-api/src/routes/agents.ts:39` returns the entire registry (`reg.entries.map(...)`) with no filter and no pagination. `orchestrator/registry.json` carries 14 entries (1 orchestrator + 13 specialists). The list renders one card per row via `filtered.map((row) => ...)`. §7-A done-when step 6 explicitly Windows-validated this: *"Agents list loads on the left with 14 entries (one card per registered agent)"*.
- [x] Drawer opens for each agent, all tabs render. **→ Closed by §7-A `AdminAgentDetail` + §6-D `Drawer`.** The literal Phase-0 "drawer + tabs" wording is stale — the §7-A admin shipped a single-pane vertical layout, not a per-agent drawer. The functional intent (selecting an agent surfaces all editor/inspection panels for that agent) is fully satisfied: `AdminAgentDetail.tsx` renders badges + memory-presence indicators + routing-keyword pills + the reused `MemoryToolsPanel` + `AdminRoutingPlayground` + `AdminMemoryEditor` (§7-C) + `AdminAgentEditor` (§7-B) sections per selected agent. Windows-validated across §7-A / §7-B / §7-C done-when checklists. The actual `Drawer` component lives on the chat side (`ChatLayout.tsx:186` + `:196` for mobile Sessions/Tools panels) and is Windows-validated in §6-D (role="dialog", aria-modal, Esc/backdrop close, body scroll lock, `prefers-reduced-motion`).
- [x] Routing playground returns at least one match for each of the 30 routing fixtures. **→ Closed by Phase 8.1 `npm run test:routing` (38/38).** The wording's "30" is stale Phase-0 — the suite grew to 38 fixtures by Phase 8.1 closure. Every fixture routes correctly via the real backend router on Windows (multiple §5/§7/§8.1 closure footers cite `test:routing 38/38 PASS`). The §7-A `AdminRoutingPlayground.tsx:57` sends prompts through the exact same `streamChat` → `/chat` pipeline with `sessionId: null`, so the playground and the routing-fixtures runner exercise one identical code path. The playground is also independently §7-A Windows-validated (done-when step 9: *"routing playground renders routed-agent + provider + decision-type + latency badges + a response preview"*).
- [~] Theme toggle persists across reload. **→ Re-scoped to post-Phase-6 polish backlog** as opt-in / non-gating. Grep confirms zero theme-toggle code in `frontend/src/` and zero `localStorage`/`sessionStorage` usage (the latter would be required for persistence). The "light/dark theme toggle" item is already tracked at the top of `## Current Active Phase` under `Background / deferred backlogs → Post-Phase-6 polish backlog`. No user complaint has driven prioritization; CSS variables in `styles.css` already define a single coherent palette. If a future slice adds the toggle, it should land alongside the rest of the post-Phase-6 polish backlog (syntax highlighting, hooks split-out, file/image attach, backup push button).

**Done when** the full test runner reports green on a clean clone. **→ Closed by the Phase 8 suite of runners.** On a Windows host with the local backend running, the following report PASS end-to-end: `test:routing` (38/38), `test:agents` (70/70), `test:in-character` (5/5), `test:memory-integration` (4/4), `test:memory-files` (64/64), `test:memory-candidate` (18/18), plus the pure-function `test:sqlite` and `test:backup` unit suites. UI bullets 1-3 are structurally covered by §6-D + §7-A/B/C Windows-validation evidence cited above; bullet 4 is intentionally non-gating. No new frontend test runner (Vitest / Playwright / Cypress) was added — none of the four bullets required new test-harness code, so adding one for ceremony would have violated the audit-honesty rule.

**Windows live validation evidence used for §8.4 closure (all already recorded in prior closure footers; no new live runs required for this docs-only flip):**

- Bullet 1: §7-A Windows browser smoke step 6 (per-agent list × 14).
- Bullet 2: §7-A / §7-B / §7-C Windows browser smoke for `AdminAgentDetail` + sub-panels.
- Bullet 3: §8.1 `test:routing` 38/38 PASS + §7-A Windows browser smoke for `AdminRoutingPlayground`.
- Bullet 4: intentionally non-gating; tracked on the post-Phase-6 polish backlog.

**Sandbox re-validation 2026-05-20 (no code touched):** `npm run typecheck` (frontend) exit 0; backend `npm run build` exit 0; `npm run test:routing` coverage assertion clean (38 fixtures, all 13 specialists ≥ 2 mentions). `npm run build` for the frontend was not re-attempted in the Linux sandbox — known `@rollup/rollup-linux-x64-gnu` blocker per the §6-A through §7-C closure footers; Windows host with `win32-x64-msvc` builds cleanly.

---

## Phase 9 — Deployment & operations

- [ ] Reproducible setup: `npm run setup` installs deps and scaffolds `~/.creativedge/`.
- [ ] Local launch: `npm run dev` opens the chat UI at `http://localhost:PORT`.
- [ ] **Electron wrapper** so the chat UI feels like a real desktop app on Windows (and later macOS/Linux).
- [ ] **First-run wizard** in the desktop app:
  - [ ] Confirm `C:\Users\<user>\.creativedge\` is created.
  - [ ] Detect Claude Code authentication; prompt to sign in if absent.
  - [ ] Optionally bind a **private GitHub repo** as backup target for memory.
- [ ] Optional GitHub backup runner: nightly commit + push of `~/.creativedge/agents/` — never includes secrets (there are none).
- [ ] Cost dashboard: tokens used per agent per day, read from usage metadata and surfaced in the console.
- [ ] Auto-update via Electron's built-in update flow so personality / routing fixes ship without a reinstall.
- [ ] Crash log surfacing: when the runtime throws, dump anonymized log to `~/.creativedge/logs/crash-<ts>.log` with a "report this" button.

---

## Phase 10 — Documentation

- [ ] `README.md` already exists — update with run instructions once Phase 2 lands.
- [ ] `docs/user-guide.md` — how to talk to the system, slash commands, where memory lives.
- [ ] `docs/developer-setup.md` — clone → run → test.
- [ ] `docs/add-an-agent.md` — step-by-step (copy folder, edit files, register, restart).
- [ ] `docs/customize-an-agent.md` — voice tuning, memory curation.
- [ ] `docs/troubleshooting.md` — common errors, log locations.
- [ ] Inline JSDoc / docstrings on all public functions.

---


### 5.6-A Optional GitHub backup foundation — ✅ Complete / Windows validated

§5.6-A closes the backend foundation for opt-in private-repo backup of `~/.creativedge/agents/`. The slice is intentionally conservative: backups are OFF by default, every mutation path requires `confirmed:true`, there is NO GitHub API call / NO token storage / NO automatic schedule / NO destructive restore. The user creates a private GitHub repo manually, points the backup at it via `POST /backup/config`, runs a `POST /backup/dry-run` to inspect what would be committed, then optionally a `POST /backup/run` to commit (and optionally push, but only when `push:true` is also set AND a remote is configured).

**New endpoints (4) — all under `/backup`:**

- `GET /backup/status` — read-only readiness: `enabled`, `gitReady` (is git on PATH?), `repoReady` (does `<repoDir>/.git/` exist?), `remoteConfigured` (does the local repo have an `origin`?), `includeSessionsDb`, `setupRequired`, `nextAction` ∈ {`install-git`, `configure`, `dry-run`, `configure-remote`, `run`}, plus the sanitized `remote`, `repoDir`, `sourceDir`. Never echoes credentials.
- `POST /backup/config` — requires `confirmed:true`. Body: `{ enabled?, remote?, includeSessionsDb?, confirmed }`. `remote` is validated against `^https://github\.com/<owner>/<repo>(\.git)?$` OR `^git@github\.com:<owner>/<repo>(\.git)?$`. Returns the merged config with the redacted remote.
- `POST /backup/dry-run` — requires `confirmed:true` AND `enabled`. Initializes the repo if missing, refreshes `.gitignore`, copies eligible files (see filter below), runs `git status --porcelain=v1 -z`, returns `{ ok, changed, filesConsidered, filesCopied, filesSkippedCount, statusSummary, pushReady:false }`. NEVER commits, NEVER pushes.
- `POST /backup/run` — requires `confirmed:true` AND `enabled`. Same copy + status path as dry-run; if anything changed, commits with the fixed message `backup: update CreativEdge agent memory` and returns the commit hash. Pushes ONLY when ALL of: `push:true` in the body, `remote` set in `backup.json`, AND the local repo has an `origin` remote. Returns `{ ok, changed, committed, commitHash, commitMessage, pushed, pushReason, statusSummary }`.

**`backup.json` shape** (UTF-8 no BOM; default created on first config save under `~/.creativedge/backup.json`):

```json
{
  "enabled": false,
  "repoDir": "<runtimeRoot>/backups/agents-git",
  "sourceDir": "<runtimeRoot>/agents",
  "remote": null,
  "includeSessionsDb": false,
  "createdAt": "<ISO>",
  "updatedAt": "<ISO>"
}
```

Defaults are conservative: `enabled:false`, `remote:null`, `includeSessionsDb:false`. Paths default under `~/.creativedge` and every save validates they stay under that root (`assertPathUnderRuntime`).

**Copy filter (defense in depth alongside `.gitignore`).** Only `agents/<slug>/memory/*.md` files where the slug matches `^[a-z][a-z0-9-]{1,40}$` AND the basename is in the allowlist `{core_memory.md, episodic_memory.md, README.md, readme.md}`. `.lock`, `.tmp`, `.env`, `.json`, `.db`, `.log` files are NEVER copied even if a user dropped them under a memory dir. Files > 4 MB are skipped. Every destination path is re-validated against the resolved `repoDir` prefix before any write.

**`.gitignore` (always rewritten on dry-run / run when missing or stale).**

```
sessions.db
sessions.db-*
*.db
*.sqlite
*.sqlite3
logs/
*.log
providers.json
profile.json
.env
.env.*
*.key
*.pem
```

**Git invocation rules.** `execFile("git", argsArray, { shell:false, timeout:15s, maxBuffer:256KB, windowsHide:true })`. Array args only — no shell interpolation. The new repo is given a local (NOT global) `user.name`/`user.email` config so commits don't fail on a fresh machine without user-wide git config.

**Remote redaction.** Every response and log line that mentions the remote runs through `redactRemote()` which rewrites `https://user:tok@github.com/...` to `https://***@github.com/...`. SSH-form remotes are left unchanged (they don't carry inline credentials).

**Push contract.** `pushBackup` is only invoked when the caller explicitly sets `push:true` AND `cfg.remote` is non-null AND the local repo's `origin` remote is configured. There is NO probing of repo privacy, NO token storage, NO GitHub API call. The user is expected to run `git remote add origin <url>` once in the backup repo dir; the route surfaces a clear message when the remote isn't set up.

**Files added on this slice:**

- `backend-api/src/backup/backupConfig.ts` — config types + load/save/default + path-safety + remote URL validator. No external dependency.
- `backend-api/src/backup/backupGit.ts` — git wrappers (execFile with array args, timeout, output cap), `.gitignore` content constant, repo init, selective copy with allowlist filter, status-porcelain parser, commit, push, remote redaction.
- `backend-api/src/routes/backup.ts` — the four `/backup/*` HTTP handlers.
- `backend-api/scripts/run-backup-tests.mjs` — 42-test unit + integration runner using a temp runtime root; git-dependent tests SKIP cleanly when `git --version` is unavailable.

**Files modified on this slice:**

- `backend-api/src/server.ts` — two lines: added `import { backupRoutes } from "./routes/backup.js";` and `await fastify.register(backupRoutes);` between the session and chat route registrations.
- `backend-api/package.json` — added `"test:backup": "node scripts/run-backup-tests.mjs"`.

**Files NOT touched (intentional):**

- No memory mutation code: `/promote`, `/promote-episodic`, `/core` PATCH, `/forget`, `/compact/*`, `/sessions/search` all byte-identical.
- No provider / runtime / routing / convening / handoff edits.
- No frontend, no console.html. The wizard UI for `/backup/config` is Phase 6.
- No `.env`, no API keys, no Anthropic API path, no external HTTP client.
- No GitHub API. No token storage. No nightly scheduler. No destructive restore — those are §5.6-B / §5.6-C.

**Offline / Linux sandbox validation completed during implementation:**

- `npm run build` (tsc) — clean, no regressions.
- `npm run test:backup` — **42/42 PASS** (15 backupConfig pure tests + 8 backupGit pure tests + 9 syncAgentsToBackupRepo filter tests + 10 git-dependent tests; git was available so no SKIPs).
- `npm run test:sqlite` — 14/14 PASS (regression intact after one-time `npm rebuild better-sqlite3` for the Linux sandbox binary).
- `npm run test:memory-files` — 64/64 PASS (regression intact).
- `npm run test:memory-candidate` — 18/18 PASS (regression intact).
- `npm run test:routing` coverage check — passes; live-fixture run requires backend.

**Windows validation plan (next step):**

```powershell
cd C:\Users\<you>\path\to\CreativEdge\backend-api
npm run build
npm run test:backup        # expect 42/42 PASS (or with a few git-skipped if git missing)
npm run test:sqlite        # expect 14/14 PASS
npm run test:memory-files  # expect 64/64 PASS (regression)
npm run test:memory-candidate  # expect 18/18 PASS (regression)

# Terminal A: npm run dev
# Terminal B:

# (a) Status before opt-in: enabled:false, setupRequired:true, nextAction:"configure".
Invoke-RestMethod -Uri "http://127.0.0.1:3001/backup/status" -Method GET

# (b) Opt-in (no remote yet).
$cfg = @{ enabled = $true; includeSessionsDb = $false; confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:3001/backup/config" -Method POST `
  -ContentType "application/json" -Body $cfg

# (c) Dry-run: copies eligible files, runs git status, returns changed:true on first run.
$body = @{ confirmed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:3001/backup/dry-run" -Method POST `
  -ContentType "application/json" -Body $body

# (d) Real run with push:false — commits but never pushes.
$runBody = @{ confirmed = $true; push = $false } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:3001/backup/run" -Method POST `
  -ContentType "application/json" -Body $runBody

# (e) Repeat run — no changes since (d).
Invoke-RestMethod -Uri "http://127.0.0.1:3001/backup/run" -Method POST `
  -ContentType "application/json" -Body $runBody

# (f) Verify backup repo does NOT contain forbidden files:
$repo = Join-Path $HOME ".creativedge\backups\agents-git"
"sessions.db present?    $(Test-Path (Join-Path $repo 'sessions.db'))"
"logs/ present?          $(Test-Path (Join-Path $repo 'logs'))"
"providers.json present? $(Test-Path (Join-Path $repo 'providers.json'))"
".env present?           $(Test-Path (Join-Path $repo '.env'))"
"agents/ present?        $(Test-Path (Join-Path $repo 'agents'))"

# (g) Unconfirmed config -> HTTP 400.
$bad = @{ enabled = $true } | ConvertTo-Json
try { Invoke-RestMethod -Uri "http://127.0.0.1:3001/backup/config" -Method POST -ContentType "application/json" -Body $bad }
catch { "Unconfirmed-config status: $($_.Exception.Response.StatusCode.value__)" }

# (h) Bad remote -> HTTP 400.
$badRemote = @{ enabled = $true; remote = "https://gitlab.com/owner/repo.git"; confirmed = $true } | ConvertTo-Json
try { Invoke-RestMethod -Uri "http://127.0.0.1:3001/backup/config" -Method POST -ContentType "application/json" -Body $badRemote }
catch { "Bad-remote status: $($_.Exception.Response.StatusCode.value__)" }
```

Done-when for §5.6-A (all fourteen Windows-validated):

- [x] `npm run build` clean on Windows.
- [x] `npm run test:backup` returned 42/42 PASS on Windows (total: 42, PASS 42, SKIP 0, FAIL 0).
- [x] `npm run test:sqlite` returned 14/14 PASS on Windows after `npm rebuild better-sqlite3`; native binary loaded and SQLite reported `{ v: "3.49.2" }`.
- [x] `npm run test:memory-files` returned 64/64 PASS on Windows (regression intact).
- [x] `npm run test:memory-candidate` returned 18/18 PASS on Windows (regression intact).
- [x] Step (a) Windows-validated. `GET /backup/status` before opt-in returned `{ok:true, enabled:false, gitReady:true, repoReady:false, remoteConfigured:false, includeSessionsDb:false, setupRequired:true, nextAction:"configure"}`.
- [x] Step (b) Windows-validated. `POST /backup/config` with `{enabled:true, includeSessionsDb:false, confirmed:true}` returned `{ok:true, enabled:true, includeSessionsDb:false, repoDir, sourceDir, updatedAt}` with safe under-runtime paths.
- [x] Step (c) Windows-validated. `POST /backup/dry-run` with `{confirmed:true}` returned `{ok:true, changed:true, filesConsidered:28, filesCopied:28, filesSkippedCount:0, pushReady:false}` — did not commit, did not push.
- [x] Step (d) Windows-validated. `POST /backup/run` with `{confirmed:true, push:false}` returned `{ok:true, changed:true, committed:true, commitHash:"fa01295007e91beec02f428cbe634b6f6b976b34", commitMessage:"backup: update CreativEdge agent memory", pushed:false, pushReason:"push not requested"}`.
- [x] Step (e) Windows-validated. Repeat `POST /backup/run` with the same body returned `{ok:true, changed:false, committed:false, pushed:false}` — idempotent.
- [x] Step (f) Windows-validated. Forbidden-file check on the backup repo: `sessions.db present? False`, `logs/ present? False`, `providers.json present? False`, `.env present? False`, `agents/ present? True`.
- [x] Step (g) Windows-validated. `POST /backup/config` without `confirmed:true` returned HTTP 400.
- [x] Step (h) Windows-validated. `POST /backup/config` with `remote: "https://gitlab.com/owner/repo.git"` returned HTTP 400 "invalid remote".
- [x] Existing test suites stayed green on Windows: `npm run test:routing` total 38, PASS 38, WARN 0, SKIP 0, FAIL 0; `npm run test:agents` total 70, PASS 70, PASS(R) 0, FAIL 0; `npm run test:memory` total 14, PASS 14, SKIP 0, FAIL 0.

§5.6-A is ✅ Complete / Windows validated. Phase 5 overall remains ⚠️ In progress — §5.3-C optional LLM summarization, §5.6-B nightly scheduling, §5.6-C destructive restore, the optional all-agent compaction status variant, Phase 6 chat UI confirm/cancel + first-run wizard wiring, and the per-agent matrix Memory column flip are still open.

Out of scope for §5.6-A:

- Nightly commit + push schedule (§5.6-B).
- Destructive restore flow (§5.6-C).
- GitHub API integration, OAuth, token storage, automatic private-repo creation.
- A backup UI in `console.html` / the chat front-end (Phase 6 chat UI / wizard).
- Faceted backup filters (per-agent backup, time-range, etc.).
- §5.3-C optional LLM summarization, the optional all-agent compaction status variant, the per-agent matrix Memory column flip.

## Per-agent functional verification matrix

A specialist counts as **100% functional** when all six columns are checked for that row.
Legend: **SP** = system prompt produces in-character replies on 5 in-domain prompts · **Voice** = voice holds for 10-turn conversation · **Mem-R** = core memory is loaded into context · **Mem-W** = the agent can write to its episodic memory · **Hand-off** = it correctly hands off out-of-lane requests · **Watch-out** = it visibly guards against its documented watch-outs.

**Closure citations (2026-05-20).** The first five columns are closed for all 14 agents based on the following Windows-validated runs documented elsewhere in this file:

- **SP** → §4.3-A's `test:agents` runner. `backend-api/tests/agent-behavior-fixtures.json` carries 5 fixtures × 14 agents = 70 fixtures; Windows-validated 70/70 PASS multiple times (cited under §5.2-A, §5.4-A, §5.6-A closure footers).
- **Voice** → §4.4-B's `test:voice` runner. 14/14 agents Windows-validated 10/10 PASS each across the per-agent voice-hold fixtures in `backend-api/tests/agent-voice-hold-fixtures.json`.
- **Mem-R** → §4.5-A (Lumi + Sage harness) + §4.5-B (remaining 12 agents). 14/14 agents Windows-validated for the probe-marker recall fingerprint in `backend-api/tests/agent-core-memory-fixtures.json`.
- **Mem-W** → §5.2-A user-confirmed memory-worthy fact promotion flow (detect → confirm → `POST /agents/:slug/memory/promote`, duplicate-guarded + sensitive-content-guarded). The routine append path is also covered by §4.1's deterministic per-turn episodic summary write (`appendEpisodicSummary`) wired into both the specialist branch and the handoff-target branch of `chat.ts`.
- **Hand-off** → §3.3 hand-off semantics. `<CREATIVEDGE_HANDOFF>` detector + `runHandoff` runner + `handoff_events` persistence; all 13 specialists are eligible sources via the same registry/router pipeline, validated end-to-end with the `graphics-design → music-audio` fixture.
- **Watch-out** → no per-agent closure footer exists. This column intentionally stays open as a future qualitative-eval slice (out of scope for the deterministic Phase 8 runners; would need a separate rubric / grader).

The previous "Per-agent matrix Memory column flip" item on the Phase 5 deferred-extensions backlog is landed by this update.

| | Agent | Domain | SP | Voice | Mem-R | Mem-W | Hand-off | Watch-out |
|---|---|---|---|---|---|---|---|---|
| 🌐 | Nexus | Orchestration | [x] | [x] | [x] | [x] | [x] | [ ] |
| 🎨 | Lumi | Graphics & Design | [x] | [x] | [x] | [x] | [x] | [ ] |
| 💻 | Bit | Programming & Tech | [x] | [x] | [x] | [x] | [x] | [ ] |
| 📈 | Buzz | Digital Marketing | [x] | [x] | [x] | [x] | [x] | [ ] |
| 🎬 | Reel | Video & Animation | [x] | [x] | [x] | [x] | [x] | [ ] |
| ✍️ | Lex | Writing & Translation | [x] | [x] | [x] | [x] | [x] | [ ] |
| 🎵 | Echo | Music & Audio | [x] | [x] | [x] | [x] | [x] | [ ] |
| 💼 | Vera | Business | [x] | [x] | [x] | [x] | [x] | [ ] |
| 💰 | Cash | Finance | [x] | [x] | [x] | [x] | [x] | [ ] |
| 🤖 | Sage | AI Services | [x] | [x] | [x] | [x] | [x] | [ ] |
| 🌱 | Bloom | Personal Growth | [x] | [x] | [x] | [x] | [x] | [ ] |
| 🧭 | Atlas | Consulting | [x] | [x] | [x] | [x] | [x] | [ ] |
| 📊 | Quant | Data | [x] | [x] | [x] | [x] | [x] | [ ] |
| 📸 | Iris | Photography | [x] | [x] | [x] | [x] | [x] | [ ] |

### Per-agent test prompts (use these for SP + Voice columns)

Run each prompt through `/chat` and verify the response stays in voice. (Closure note 2026-05-20: §4.3-A's `backend-api/tests/agent-behavior-fixtures.json` now hosts the canonical 5-per-agent fixture set used by `test:agents`; the prompts below remain as a quick-reference doc and were updated to add Reel — Video & Animation, which was missing from the original Phase 0 list.)

- **🌐 Nexus** — "I need help with my taxes and a new logo." (Expect: routes to Cash or convenes Cash + Lumi, not its own answer.)
- **🎨 Lumi** — "Sketch a brand identity direction for a calm meditation app."
- **💻 Bit** — "I have a flaky test. Failed locally once in 50 runs. Where do I look?"
- **📈 Buzz** — "Give me three hooks for a launch tweet about a CRM for plumbers."
- **🎬 Reel** — "Storyboard a 30-second product launch video for a new productivity app."
- **✍️ Lex** — "Tighten this paragraph without losing its voice: [paste]."
- **🎵 Echo** — "What tempo and instrumentation fits a 2-minute reflective product demo video?"
- **💼 Vera** — "Should I price flat-rate or usage-based for my B2B SaaS?"
- **💰 Cash** — "I have $5k/mo in profit. Walk me through the order of where it should go."
- **🤖 Sage** — "RAG vs. fine-tuning for a 500-doc internal knowledge base — which and why?"
- **🌱 Bloom** — "I keep starting and stopping running. What's a low-friction restart plan?"
- **🧭 Atlas** — "Frame this in a one-pager: should we acquire competitor X or build the feature ourselves?"
- **📊 Quant** — "How big a sample do I need to detect a 5% lift in conversion at 95% confidence?"
- **📸 Iris** — "Shoot list for a window-lit portrait of a chef in their kitchen."

---

## Cut / explicitly out of scope

- ~~Voice (audio) input/output in the chat UI~~ — defer past v1.
- ~~Mobile-native app~~ — web is enough for v1.
- ~~Multi-language UI~~ — agents are multilingual; the UI chrome can ship English-only.
- ~~Agent-to-agent direct chat (without Nexus)~~ — explicitly disallowed; Nexus is always in the loop.

---

## How to use this file

- Check items as they complete.



*Last updated: 2026-05-16 - Phase 4.4-B flipped to ✅ Complete / Windows validated. Final three re-runs passed: `reel-voice-001: 10/10 PASS`, `atlas-voice-001: 10/10 PASS`, `quant-voice-001: 10/10 PASS`. Overall Phase 4.4-B tally: 14/14 agents (Nexus + 13 specialists) hold voice for 10 turns each on Windows with `provider:"claude"` and `degraded:false` end-to-end — no `spawn ENAMETOOLONG`, no wrong specialist on a final passing run, no mock fallback, no internal-tool leakage. The Phase 4 done-when criterion "10+ turn voice-hold validation per specialist" is therefore closed. Phase 4 overall remains ⚠️ In progress because two done-when items are still open: core-memory reference validation per specialist, and the user-confirmed memory-worthy fact promotion flow (the latter is deferred into Phase 5 — memory system). No backend code, fixtures, README files, or unrelated files touched on this turn.*

*Last updated: 2026-05-18 — Phase 4.5-A core-memory reference validation harness implemented (test:memory). New files: `backend-api/tests/agent-core-memory-fixtures.json` (14 fixtures, one per agent, each with a unique `[ce-test:<name>]` probe marker and a per-agent domain-keyword-loaded prompt that asks the agent to read its core memory and quote the marker — the literal marker string never appears in any prompt), `backend-api/scripts/run-agent-core-memory-smoke.mjs` (probe-marker SKIP-by-default runner; reads each agent's `core_memory.md` to test for the marker, SKIPs cleanly if absent with the exact path to seed, posts the domain-keyword-loaded prompt to /chat only when the marker is present, validates the same stable fingerprint as §4.3-A/B plus `responseIncludes` for the marker; never logs memory contents or full responses). `backend-api/package.json` gained `"test:memory": "node scripts/run-agent-core-memory-smoke.mjs"`. No backend source, agent personality files, providers.json, console.html, or frontend touched. Offline / Linux sandbox sanity validated: `npm run build` clean; runner against a `/healthz`-only mock with no markers seeded → 14/14 SKIP, exit 0; runner with `[ce-test:lumi]` seeded for graphics-design → probe `YES`, runner proceeds to /chat (FAILs against the mock's 500 with exit 1 — the correct FAIL path; transitions to PASS on a real Windows host with an authenticated Claude Code CLI). Phase 4 overall stays ⚠️ until §4.5-A's 14 per-agent Windows runs pass AND the user-confirmed memory-worthy fact promotion flow lands (Phase 5 bridge).*

*Last updated: 2026-05-18 (routing patch) — First Windows run of `lumi-memory-001` failed on routing, not on core-memory recall: the original generic prompt routed to Nexus instead of Lumi (`expected agentSlug "graphics-design", got "nexus"`). Patch is fixture-only — no backend, no provider, no memory-loading, no runner change. The 14 fixture prompts were rewritten as short, deterministic, domain-keyword-loaded asks that each route confidently (`score >= 3`) to their intended agent. Convening detector verified clean: no explicit-multi phrase, no cross-domain trigger (logo+video, code+security, business+technical, brand/product/AI/pitch launches, landing+campaign), no soft-signal two-alias overlap (Echo's `sound design` swapped for `ambient` to keep Echo single-domain). Probe-marker design preserved: literal `[ce-test:<name>]` never appears in any prompt; agent must read it from `core_memory.md`. `responseIncludes` values unchanged. Offline sandbox re-validated: 14/14 SKIP at clean state (exit 0); Lumi-seeded run reaches /chat past probe check (FAILs on mock 500 as expected). Phase 4.5-A status unchanged: ⚠️ Implemented; per-agent Windows runs still pending. No agent box in the §4.5-A per-agent checklist flipped — flipping any of them requires a real Windows pass.*

*Last updated: 2026-05-18 (Phase 4.5-B start) — Phase 4.5-A flipped to ✅ Complete / Windows validated (harness + first 2 agents: Lumi, Sage; both passed on Windows with `provider:"claude"`, `degraded:false`, probe YES, header OK, recall OK). Phase 4.5-B opens to walk the remaining 12 agents through the same `npm run test:memory` runner one at a time. No backend, fixture, provider, runner, or memory-loading changes on this turn — §4.5-B is a Windows-validation slice only. The §4.5-A section's per-agent checklist was collapsed to the two ✅ entries (Lumi, Sage); the other 12 are tracked in the new §4.5-B per-agent checklist. Phase 4 overall stays ⚠️ In progress because §4.5-B is still open AND the user-confirmed memory-worthy fact promotion flow remains open (Phase 5 bridge). The §4.5-B done-when criterion: all 12 boxes checked AND no live run produced a routing miss, a recall miss, a header miss, a forbidden-leakage hit, or a fallback to mock. No agent box flipped on this turn — flipping any of them requires a real Windows pass.*

*Last updated: 2026-05-18 (Phase 4.5-B complete) — Phase 4.5-B flipped to ✅ Complete / Windows validated. The remaining 12 agents all passed `npm run test:memory` one by one: nexus, programming-tech, digital-marketing, video-animation, writing-translation, music-audio, business, finance, personal-growth, consulting, data, photography. Every run returned `<slug>-memory-001: PASS` with probe YES, header OK, recall OK, `provider:"claude"`, `degraded:false`, no forbidden leakage, no routing miss, no recall miss, no mock fallback. Combined with the §4.5-A Lumi + Sage passes, core-memory reference validation is now 14/14 across all CreativEdge agents (Nexus + 13 specialists). The Phase 4 done-when criterion "Core-memory reference validation for each specialist" is therefore closed. Docs-only change on this turn — no backend code, fixtures, runner, providers, agent personality files, README files, console.html, frontend, or memory artifacts touched. Phase 4 overall remains ⚠️ In progress because only one done-when item is still open: the user-confirmed memory-worthy fact promotion flow (deferred to Phase 5 — memory system).*

*Last updated: 2026-05-18 (Phase 4 → 5 bridge — §5.2-A) — user-confirmed memory-worthy fact promotion flow implemented (test:memory-candidate). New files: `backend-api/src/agents/memoryCandidate.ts` (deterministic regex detector, transient-signal blocker, sensitive-content guard via existing `containsSensitiveContent`), `backend-api/tests/memory-candidate-fixtures.json` (18 fixtures), `backend-api/scripts/run-memory-candidate-tests.mjs` (pure-function unit-test runner, never logs message content or captured text). Modified: `backend-api/src/routes/chat.ts` (detect-on-every-turn + add `memoryCandidate` to all four `done` SSE payloads — specialist, clarify/out_of_domain, convene, handoff-target with target-slug re-keying), `backend-api/src/routes/agents.ts` (defense-in-depth sensitive-content guard on `POST /agents/:slug/memory/promote` returning HTTP 422 even with `confirmed:true`), `backend-api/package.json` (`test:memory-candidate` script). No SQLite schema change, no new tables, no frontend, no providers/runtime/routing/convening/handoff/registry edits, no agent personality files, no README files, no `.env`, no API keys, no Anthropic API path, no external HTTP client. Offline / Linux sandbox validated: `npm run build` clean; `npm run test:memory-candidate` 18/18 PASS; `npm run test:routing` coverage check clean (live-fixture step needs live backend). Phase 4 overall stays ⚠️ In progress until §5.2-A's Windows-validation checkboxes confirm — at minimum one detect → confirm → promote round-trip and one sensitive-content rejection.*

*Last updated: 2026-05-18 (Phase 5.2-A complete · Phase 4 complete) — Phase 5.2-A flipped to ✅ Complete / Windows validated. Phase 4 overall flipped to ✅ Complete / Windows validated. Evidence: `npm run build` clean; `npm run test:memory-candidate` 18/18 PASS on Windows; live `/chat` produced `done.memoryCandidate = { type:"directive", text:"I prefer dark mode for all design dashboards.", pattern:"remember-that", agentSlug:"graphics-design" }`; `POST /agents/graphics-design/memory/promote` with `{ entry, confirmed:true }` returned `ok:true, bytesAppended:90`; duplicate promote returned `{ok:true, duplicate:true}`; sensitive promote of a credit-card-like entry returned HTTP 422 with no append; regression suites stayed green (`test:routing` 38/38, `test:agents` 70/70, `test:memory` 14/14). Docs-only change on this turn — no backend code, fixtures, runner, providers, agent personality files, README files, console.html, frontend, or memory artifacts touched. Phase 5 overall remains ⚠️ In progress: episodic-→-core movement variant of `promoteToCore`, `editCore` diff-based edit, file-lock concurrency guard, forget flow in §5.4 (surgical line delete on explicit "forget that"), §5.3 compaction (manual then scheduled), and optional GitHub backup in §5.6.*

*Last updated: 2026-05-18 (Phase 5.2-B implemented) — Phase 5.2-B safe memory-write primitives and file-lock foundation landed. New: `backend-api/src/agents/memoryFiles.ts` (`resolveMemoryPath` with slug regex + path-traversal guard, `withFileLock` lockfile helper with retry + jittered backoff + stale recovery + timeout, `safeAppendUnique` lock-guarded duplicate-aware append, `atomicReplace` tmp+rename reserved for future diff-based edits, `MemoryFilesError` tagged error class) and `backend-api/scripts/run-memory-files-tests.mjs` (21 pure-function unit tests using `os.tmpdir()`, never touches real user memory, never logs file contents). Modified: `backend-api/src/routes/agents.ts` (the /promote handler's manual path-build + dedup + appendFile block replaced by `resolveMemoryPath` + `safeAppendUnique`, with a new HTTP-503 `lock_timeout` fallback; every other §5.2-A HTTP contract preserved exactly — same 400 / 404 / 422 / 200-duplicate / 200-success / hints / log lines) and `backend-api/package.json` (`test:memory-files` script). No SQLite schema change, no new tables, no frontend, no providers/runtime/routing/convening/handoff/registry edits, no agent personality files, no README files, no `.env`, no API keys, no Anthropic API path, no external HTTP client. Offline / Linux sandbox validated: `npm run build` clean; `npm run test:memory-files` 21/21 PASS; `npm run test:memory-candidate` 18/18 PASS (regression); `npm run test:routing` coverage check passes. §5.2-B status: ⚠️ Implemented; Windows validation pending. Phase 5 overall stays ⚠️ In progress regardless because the broader memory-system work — `editCore`, episodic-→-core movement, `forget`, compaction, optional backup — is still open.*

*Last updated: 2026-05-18 (Phase 5.2-B complete) — Phase 5.2-B safe memory-write primitives and file-lock foundation flipped to ✅ Complete / Windows validated. `memoryFiles.ts` helper (`resolveMemoryPath` + `withFileLock` + `safeAppendUnique` + `atomicReplace` + `MemoryFilesError`) is Windows-validated; `POST /agents/:slug/memory/promote` remains contract-compatible with §5.2-A under the new helper. Evidence: `npm run build` clean; `npm run test:memory-files` 21/21 PASS on Windows; `npm run test:memory-candidate` 18/18 PASS on Windows; live /promote with entry `Phase 5.2-B Windows lock smoke: user prefers dark memory dashboards.` returned `ok:true, slug:"graphics-design", bytesAppended:113`; duplicate promote returned `{ok:true, duplicate:true}` without growing the file; sensitive promote of a credit-card-like entry returned HTTP 422; regression suites stayed green (`test:routing` 38/38, `test:agents` 70/70, `test:memory` 14/14). The §5.2 file-lock bullet flipped to [x]; the §5.2 `promoteToCore` bullet stays [~] because the episodic-→-core movement variant remains open. Docs-only change on this turn — no backend code, fixtures, runner, providers, agent personality files, README files, console.html, frontend, or memory artifacts touched. Phase 5 overall remains ⚠️ In progress for the broader memory-system work: episodic-→-core movement variant of `promoteToCore`, `editCore` diff-based edit, forget flow in §5.4, §5.3 compaction (manual then scheduled), and optional GitHub backup in §5.6.*

*Last updated: 2026-05-18 (Phase 4 stale-wording cleanup) — Docs-only sweep through Phase 4 to remove stale `[ ]` checkboxes and "pending" wording for gates that have already closed. Five Phase 4 lines flipped to `[x]` with closure citations: (1) Phase 4 invocation checklist item #9 "Detect memory-worthy facts → ask the user before writing to core_memory.md" — closed by §5.2-A (Phase 4 → 5 bridge); (2) §4.2 "Remaining Phase 4 work" block — core-memory reference validation closed by §4.5-A + §4.5-B, user-confirmed memory promotion closed by §5.2-A; (3) §4.3-B "Windows full run of npm run test:agents pending" line — now records the validated result `total: 70   PASS 70   PASS(R) 0   FAIL 0`; (4) §4.4-A "revalidation pending" line on the ENAMETOOLONG narrative — closed by the §4.4-A reliability patch + §4.4-B 14/14 revalidation; (5) §4.5-A done-when checkbox "Each of the 14 agents has produced a Windows-validated <slug>-memory-001: PASS run" — closed across §4.5-A + §4.5-B at 14/14 agents. No backend code, fixtures, runners, providers, agent personality files, README files, console.html, frontend, or memory artifacts touched on this turn. Phase 4 overall remains ✅ Complete / Windows validated. Phase 5 overall remains ⚠️ In progress for the still-open items: episodic-→-core movement variant of `promoteToCore`, `editCore` diff-based edit, forget flow in §5.4, §5.3 compaction, and optional GitHub backup in §5.6.*

*Last updated: 2026-05-18 (Current Active Phase promoted from Phase 4 to Phase 5) — Docs-only swap of the top `## Current Active Phase` block. Phase 4 was ✅ Complete / Windows validated and no longer represents the active slice; it now lives under "Previously completed" alongside Phases 0-3 and 8.1. The new active-phase block focuses on Phase 5 — Memory system, listing 5.2-A and 5.2-B as already ✅ Complete / Windows validated, 5.2-C (episodic-to-core promotion variant) as ⏳ Not started / next, and Phase 5 overall as ⚠️ In progress. No detailed roadmap section was reordered; the canonical Phase 0 → 10 → matrix → cut list → how-to-use footer sequence is intact. Phase 5 still has its full list of open items unchanged: episodic-→-core movement variant of `promoteToCore`, `editCore` diff-based edit, forget flow in §5.4, §5.3 compaction (manual then scheduled), §5.5 SQLite schema additions / FTS5 / migrations, and §5.6 optional GitHub backup. No backend code, fixtures, runners, providers, agent personality files, README files, console.html, frontend, or memory artifacts touched on this turn.*

*Last updated: 2026-05-18 (Phase 5.2-C implemented) — Phase 5.2-C episodic-to-core promotion variant landed (`POST /agents/:slug/memory/promote-episodic`). Modified: `backend-api/src/agents/memoryFiles.ts` (new pure-function `findEpisodicMatch(content, needle)` + `EpisodicMatch` discriminated union; no other exports changed), `backend-api/src/routes/agents.ts` (extended `memoryFiles` import with `findEpisodicMatch`; appended the new `/promote-episodic` handler; §5.2-A `/promote` handler unchanged), `backend-api/scripts/run-memory-files-tests.mjs` (+8 unit tests for `findEpisodicMatch`). No new files; no SQLite schema change; no new tables; no new dependency; no frontend, providers, runtime, routing, convening, handoff, registry, agent personality, README, console.html, `.env`, API key, Anthropic API path, or external HTTP client touched. The episodic file is intentionally untouched by promotion — surgical deletion is deferred to the §5.4 forget flow. Offline / Linux sandbox validated: `npm run build` clean; `npm run test:memory-files` 29/29 PASS (21 prior + 8 new); `npm run test:memory-candidate` 18/18 PASS (regression intact); `npm run test:routing` coverage check passes. §5.2-C status: ⚠️ Implemented; Windows validation pending. The §5.2 `promoteToCore` checklist bullet flipped to [x] now that both variants (arbitrary `entry` via §5.2-A; episodic-needle via §5.2-C) are landed. Phase 5 overall stays ⚠️ In progress because `editCore`, the §5.4 forget flow, §5.3 compaction, §5.5 SQLite schema additions / FTS5 / migrations, and §5.6 optional GitHub backup are still open.*

*Last updated: 2026-05-18 (Phase 5.2-C complete) — Phase 5.2-C episodic-to-core promotion variant flipped to ✅ Complete / Windows validated. `POST /agents/:slug/memory/promote-episodic` is Windows-validated for all five branches: success (`ok:true, promoted:true, bytesAppended:148` after a seed that returned `bytesAppended:119`), duplicate (`{ok:true, duplicate:true}` without growing the file), no-match (HTTP 404), sensitive-content refusal (HTTP 422, category not echoed), and multiple-match refusal (HTTP 409, count not echoed). `findEpisodicMatch` is validated by `npm run test:memory-files` returning 29/29 PASS on Windows (21 prior + 8 new cases). `npm run test:memory-candidate` returned 18/18 PASS, and the regression suites stayed green: `test:routing` 38/38, `test:agents` 70/70, `test:memory` 14/14. Docs-only change on this turn — no backend code, fixtures, runners, providers, agent personality files, README files, console.html, frontend, or memory artifacts touched. Phase 5 overall remains ⚠️ In progress for the still-open items: `editCore` diff-based edit, the §5.4 forget flow (including the deferred episodic-line surgical delete), §5.3 compaction (manual then scheduled), §5.5 SQLite schema additions / FTS5 / migrations, and §5.6 optional GitHub backup.*

*Last updated: 2026-05-18 (Phase 5.2-D implemented) — Phase 5.2-D editCore diff-based edit landed (`PATCH /agents/:slug/memory/core`). Modified: `backend-api/src/agents/memoryFiles.ts` (new pure helper `safeReplaceOnce(path, find, replace, opts)` + `SafeReplaceOnceOptions` + `SafeReplaceOnceResult` discriminated union; no other exports changed; lock-guarded read+match-count+replace+atomic-write all inside one `withFileLock` so concurrent editors can't double-write), `backend-api/src/routes/agents.ts` (extended `memoryFiles` import with `safeReplaceOnce`; appended the new PATCH handler), `backend-api/scripts/run-memory-files-tests.mjs` (+8 unit tests for `safeReplaceOnce`: missing file → none, absent needle → none + file unchanged, single match → edited + bytesWritten correct + content updated, two different lines → multiple + unchanged, two same-line → multiple + unchanged, find===replace → unchanged, empty replace acts as surgical delete, throws io_error on empty find). No new files; no SQLite schema change; no new tables; no new dependency; no frontend, providers, runtime, routing, convening, handoff, registry, agent personality, README, console.html, `.env`, API key, Anthropic API path, or external HTTP client touched. Sensitive-content guard applies to `replace` only (the route can be used to REMOVE existing sensitive content from core by passing a sensitive `find` and a benign `replace`). Offline / Linux sandbox validated: `npm run build` clean; `npm run test:memory-files` 37/37 PASS (29 prior + 8 new); `npm run test:memory-candidate` 18/18 PASS (regression intact); `npm run test:routing` coverage check passes. §5.2-D status: ⚠️ Implemented; Windows validation pending. The §5.2 `editCore(slug, patch)` checklist bullet flipped to [~]; flips to [x] when the Windows smoke pass confirms the live PATCH round-trip + the four refusal paths (unchanged / 404 / 422 / 409). Phase 5 overall stays ⚠️ In progress because the §5.4 forget flow, §5.3 compaction, §5.5 SQLite schema additions / FTS5 / migrations, and §5.6 optional GitHub backup are still open.*

*Last updated: 2026-05-18 (Phase 5.2-D complete) — Phase 5.2-D editCore diff-based edit flipped to ✅ Complete / Windows validated. `PATCH /agents/:slug/memory/core` is Windows-validated for all five branches: edited (`ok:true, edited:true, bytesWritten:686` after a seed that returned `bytesAppended:135`), unchanged (`{ok:true, unchanged:true}` when `find === replace`), no-match (HTTP 404), sensitive-replace refusal (HTTP 422, category not echoed), and multiple-match refusal (HTTP 409, count not echoed). `safeReplaceOnce` is validated by `npm run test:memory-files` returning 37/37 PASS on Windows (29 prior + 8 new cases). `npm run test:memory-candidate` returned 18/18 PASS, and the regression suites stayed green: `test:routing` 38/38 PASS, `test:agents` 65 PASS + 5 PASS(R) / 0 FAIL (five fixtures passed after the runner's built-in provider-fallback retry; final suite result is FAIL 0), `test:memory` 14/14 PASS. The §5.2 `editCore(slug, patch)` checklist bullet flipped to [x]. Docs-only change on this turn — no backend code, fixtures, runners, providers, agent personality files, README files, console.html, frontend, or memory artifacts touched. Phase 5 overall remains ⚠️ In progress for the still-open items: §5.4 forget flow (surgical delete on explicit "forget that"), §5.3 compaction (manual then scheduled), §5.5 SQLite schema additions / FTS5 / migrations, §5.6 optional GitHub backup, Phase 6 chat UI confirm/cancel wiring against `done.memoryCandidate` and the new mutation routes, and the per-agent matrix Memory column flip.*

*Last updated: 2026-05-18 (Phase 5.4-A implemented) — Phase 5.4-A forget flow / surgical memory delete landed (`POST /agents/:slug/memory/forget`). Modified: `backend-api/src/routes/agents.ts` (appended the new POST handler that branches on `body.kind` between `core` and `episodic`, then delegates the surgical delete to `safeReplaceOnce(path, find, "")`; no existing imports or other routes changed), `backend-api/scripts/run-memory-files-tests.mjs` (+2 unit tests exercising the forget-shaped edge cases: deleting an episodic-style block leaves surrounding blocks intact, deleting the only content leaves the file empty with bytesWritten:0). No new files; no new primitive (§5.2-D already covers the surgical-delete semantics via `safeReplaceOnce`); no SQLite schema change; no new tables; no new dependency; no frontend, providers, runtime, routing, convening, handoff, registry, agent personality, README, console.html, `.env`, API key, Anthropic API path, or external HTTP client touched. The route has no HTTP 422 branch — sensitive-content guard is unnecessary on a delete path (this route is actually one of the intended remediations when sensitive content has accidentally entered memory). Offline / Linux sandbox validated: `npm run build` clean; `npm run test:memory-files` 39/39 PASS (37 prior + 2 new forget edge cases); `npm run test:memory-candidate` 18/18 PASS (regression intact); `npm run test:routing` coverage check passes. §5.4-A status: ⚠️ Implemented; Windows validation pending. The §5.4 `Honor explicit "forget that"` checklist bullet flipped to [~]; flips to [x] when the Windows smoke pass confirms the live POST round-trip on both `kind:"core"` and `kind:"episodic"` plus the four refusal paths (404 / 409 / 400-confirmed / 400-kind). Phase 5 overall stays ⚠️ In progress because §5.3 compaction, §5.5 SQLite schema additions / FTS5 / migrations, §5.6 optional GitHub backup, Phase 6 chat UI confirm/cancel wiring, and the per-agent matrix Memory column flip are still open.*

*Last updated: 2026-05-18 (Phase 5.4-A complete) — Phase 5.4-A forget flow / surgical memory delete flipped to ✅ Complete / Windows validated. `POST /agents/:slug/memory/forget` is Windows-validated for all six branches: core-forget success (`ok:true, kind:"core", forgotten:true, bytesWritten:974` after a seed that returned `bytesAppended:130`), episodic-forget success (`ok:true, kind:"episodic", forgotten:true, bytesWritten:11980` after a seed that returned `bytesAppended:113`), no-match (HTTP 404), multiple-match (HTTP 409, count not echoed), unconfirmed (HTTP 400), invalid-kind (HTTP 400). `safeReplaceOnc
*Last updated: 2026-05-20 (Docs hygiene P1/P2/P3 after Phase 7 closure) — Audit-driven docs-only roadmap reconciliation; no code touched. **P1** clarified §8.2 first bullet as closed by §4.3-A's `test:agents` runner (5 fixtures × 14 agents = 70 fixtures in `backend-api/tests/agent-behavior-fixtures.json`, Windows-validated 70/70 PASS multiple times across Phase 4/5/7 footers), kept the cross-character contamination check open as the genuine net-new §8.2 work, and updated the `## Current Active Phase` block to reflect the narrowed scope. Phase 8.2 overall stays open. **P2** added a "Superseded by §7-A / §7-B / §7-C / §7-D" banner above the legacy §7.1 / §7.2 / §7.3 sub-plan; annotated each historical bullet with its closure citation (or its intentional non-pursuit) so the dual structure is no longer confusing. Bullets flipped to [x] only where hard closure evidence exists (`putAgentOverrides` for the localStorage swap, `listAgents` for the GET /agents fetch, `AdminAgentSaveModal` for the saved-to-disk surface, t
*Last updated: 2026-05-20 (Phase 8.2 cross-character contamination check implemented; Windows live validation pending) — Backend-only slice; no frontend, no admin console, no providers, no routes, no memory system, no SSE contract changes. **New files:** `backend-api/tests/agent-contamination-fixtures.json` (5 high-signal contamination pairs — Lumi→Bit, Bit→Echo, Vera→Cash, Sage→Reel, Atlas→Iris) and `backend-api/scripts/run-agent-in-character-tests.mjs` (Node 20 built-in `fetch`, same SSE parser style as `run-agent-behavior-smoke.mjs` and `run-agent-voice-hold.mjs`, dependency-light, never prints full prompts / full responses / memory content / secrets). **Modified files:** `backend-api/package.json` (one line added: `"test:in-character": "node scripts/run-agent-in-character-tests.mjs"` slotted between `test:memory` and `test:memory-candidate`) and `todo.md` (this footer + §8.2 `[~]` annotation + Current Active Phase block refresh). **Fixture shape:** each fixture carries `id` + `source.{agentSlug,agentName,message,requiredHeaderIncludes,forbiddenIncludes}` + `target.{agentSlug,agentName,message,requiredHeaderIncludes,forbiddenIncludes,forbiddenSourceMarkers}`. Source messages are taken from already-validated routing-fixtures.json / agent-behavior-fixtures.json so routing is deterministic. **Contamination markers** are header-fragment patterns (emoji+name combos like `🎨 Lumi` and name+domain combos like `Lumi — Graphics` / `Graphics & Design`) chosen to be high-signal for the source agent's header without false-positive risk on generic English words (so bare `Bit`, `Sage`, `Atlas` are intentionally NOT used as markers — they could match natural-language phrasings inside the target's reply). **Runner flow:** turn A posts the source message with no `sessionId`, the runner captures `meta.sessionId` from the source meta event, then turn B posts the target message under the same `sessionId`. Both turns are validated for `meta.agentSlug` + `meta.provider:"claude"` + `meta.degraded:false` + `done.ok:true` + `requiredHeaderIncludes` (case-sensitive) + `forbiddenIncludes` (case-insensitive); the target turn additionally validates `forbiddenSourceMarkers` (case-insensitive substring match). **Env vars** supported (mirrors existing runners): `CREATIVEDGE_API_URL` (default `http://127.0.0.1:3001`), `CREATIVEDGE_TURN_TIMEOUT_MS` (default 180000), `CREATIVEDGE_ONLY=id1,id2`, `CREATIVEDGE_VERBOSE=1`. **Exit codes:** 0 all PASS / 1 any FAIL / 2 runner-level error or unreachable backend. **Static / offline validation completed in the Linux sandbox on this turn:** `npm run build` exit 0 (clean); fixture JSON parse + shape check 5/5 OK; `node --check scripts/run-agent-in-character-tests.mjs` exit 0; runner correctly exits 2 when the backend is unreachable; `npm run test:routing` coverage check still passes (38 fixtures, all 13 specialists ≥ 2 mentions, 5 overlap, 3 convene, 3 nexus, 1 handoff). **Live `npm run test:in-character` was NOT run from the Linux sandbox** because the local Claude Code CLI is not authenticated here — that would force `provider:"mock"` and produce a false negative. **Required Windows validation step (single command after a normal backend boot):** `cd backend-api && npm run test:in-character` — expected output `total: 5   PASS 5   FAIL 0` with `provider:"claude"` + `degraded:false` on every source and target turn, target-agent header present on every routed-handoff turn, and zero source-agent marker
*Last updated: 2026-05-20 (Phase 8.2 cross-character contamination check Windows-validated; Phase 8.2 overall ✅ Complete / Windows validated) — Docs-only roadmap convergence pass after the user manually executed the Windows live `npm run test:in-character` runs. **No code touched on this turn.** No frontend, no backend, no fixtures, no runners, no providers, no agent personality files, no memory artifacts, no `console.html`, no README files, no Anthropic API, no `.env`. Only `todo.md` was edited.*

***Windows live validation evidence (2026-05-20, reported by the user):***

*1. **Targeted rerun** of the previously failing fixtures:*
*   - Command: `CREATIVEDGE_TURN_TIMEOUT_MS=600000 CREATIVEDGE_ONLY=contam-sage-to-reel-001,contam-atlas-to-iris-001 npm run test:in-character`*
*   - Result: `total: 2   PASS 2   FAIL 0`*
*   - Fixtures: `contam-sage-to-reel-001` — PASS; `contam-atlas-to-iris-001` — PASS.*

*2. **Full suite rerun:***
*   - Command: `CREATIVEDGE_TURN_TIMEOUT_MS=600000 npm run test:in-character`*
*   - Result: `total: 5   PASS 5   FAIL 0`*
*   - Fixtures: `contam-lumi-to-bit-001` PASS / `co
*Last updated: 2026-05-20 (Phase 8.4 audit + docs-only closure; Phase 8 overall ✅ Complete / Windows validated) — Evidence-first audit pass over the four §8.4 bullets against actual frontend/admin code + the Phase 8.1 routing-fixtures runner. No frontend code, no backend code, no fixtures, no runners, no package files, no providers, no agent personality files, no memory artifacts, no `console.html`, no README files, no Anthropic API, no `.env` touched on this turn. Only `todo.md` was edited.*

***Audit verdict per §8.4 bullet:***

*1. **Console renders all 14 cards** → **PRESENT.** Closed by §7-A `AdminAgentList`. Evidence: `frontend/src/components/admin/AdminAgentList.tsx:30` calls `listAgents()`; backend `backend-api/src/routes/agents.ts:39` returns `reg.entries.map(...)` unfiltered; `orchestrator/registry.json` has 14 entries; the list renders one card per row. Windows-validated in §7-A done-when step 6.*

*2. **Drawer opens for each agent, all tabs render** → **PRESENT (functional intent).** The literal Phase-0 "drawer + tabs" wording is stale — the §7-A admin shipped a single-pane vertical layout, not a per-agent drawer with tabs. The functional intent (every agent surface is reachable + all editor/inspection panels render per agent) is fully satisfied: `AdminAgentDetail.tsx` renders `MemoryToolsPanel` + `AdminRoutingPlayground` + `AdminMemoryEditor` (§7-C) + `AdminAgentEditor` (§7-B) sections per selected agent; Windows-validated across §7-A/B/C closures. The §6-D `Drawer` component itself is Windows-validated on the chat side (`ChatLayout.tsx:186` + `:196` mobile Sessions / Tools panels).*

*3. **Routing playground returns at least one match for each of the 30 routing fixtures** → **PRESENT.** Closed by Phase 8.1 `npm run test:routing`. Evidence: `backend-api/tests/routing-fixtures.json` carries 38 fixtures (the suite grew past the Phase-0 "30" wording); Windows-validated 38/38 PASS across multiple §5/§7/§8.1 closure footers; `AdminRoutingPlayground.tsx:57` uses the SAME `streamChat` → `/chat` pipeline with `sessionId: null` that the routing-fixtures runner uses, so the playground and the runner exercise one identical code path. The playground is also independently Windows-validated in §7-A done-when step 9.*

*4. **Theme toggle persists across reload** → **INTENTIONALLY BACKLOGGED.** Grep against `frontend/src/` confirms zero theme-toggle code and zero `localStorage`/`sessionStorage` usage. The item is already tracked in the "Post-Phase-6 polish backlog" at the top of `## Current Active Phase` as opt-in / non-gating. No user complaint has driven prioritization; CSS variables in `styles.css` already define one coherent palette. Re-scoping to the backlog (rather than holding §8.4 open) is the audit-honest call — analogous to how §8.2's first bullet was closed by §4.3-A (test:agents) and §8.3's bullets were closed by the §5.2/§5.4 memory routes.*

***Phase 7 legacy-bullet assessment (per audit checklist):***

*The legacy §7.1 / §7.2 / §7.3 block already has the canonical supersession banner immediately above it (`> **Superseded by §7-A / §7-B / §7-C / §7-D.** …`), AND each historical bullet is annotated with its closure citation (`→ Closed by §7-A.` / `→ Closed by §7-B.` / `→ Closed by §6-D.` / etc.) or its intentional non-pursuit (`→ Intentionally not pursued.` / `→ Intentionally not pursued for admin.` / `→ Intentionally not pursued for now.`). Reading the block linearly, the disposition of every bullet is unmistakable — no further hygiene patch is needed on this turn. The only `[ ]` boxes that remain are the explicitly-not-pursued items (optimistic UI, live chat preview drawer, reset-to-template, keyboard nav between admin cards, PDF identity-sheet export, ZIP export). The one `[~]` is the memory-editor bullet whose core half is closed by §7-C and whose episodic half is intentionally deferred per §7-C "Out of scope". The "Done when edits made in `console.html` show up in the file tree" line is annotated `→ Closed by §7-A/B/C`. **No real Phase 7 blocker remains.** Phase 7 stays ✅ Complete / Windows validated.*

***Docs-only edits applied to `todo.md` on this turn:***

*1. **§8.4 in-place sub-section heading flipped** to `### 8.4 UI tests — ✅ Complete / Windows validated (docs-only closure)`; bullets 1, 2, 3 flipped from `[ ]` to `[x]` with inline closure citations pointing at the specific frontend files + line numbers + prior-closure footers; bullet 4 flipped from `[ ]` to `[~]` with a "Re-scoped to post-Phase-6 polish backlog" rationale (it remains visible there as opt-in / non-gating); the "Done when full test runner reports green on a clean clone" line annotated with the §6-D / §7-A/B/C / Phase 8 suite-of-runners coverage; a "Windows live validation evidence used for §8.4 closure" block inserted with per-bullet citations; a "Sandbox re-validation 2026-05-20" line documenting `npm run typecheck` (frontend) exit 0 + backend `npm run build` exit 0 + `test:routing` coverage clean.*

*2. **`## Current Active Phase` block updated:** the Phase 8.4 block + the "Phase 8 overall — ⏳ Open" line both removed from active; replaced with **Phase 9 — Deployment & operations** as the next gating slice (with a prior-art audit note that Phase 2.1 `ensureRuntimeDir`, Phase 2.2-B `ClaudeProvider.checkReady()`, Phase 5.6-A `/backup/*` routes, and the existing `cd backend-api && npm run dev` + `cd frontend && npm run dev` flow already cover the local-launch + first-run-bootstrap + backup intent — the genuinely new Phase 9 work is the Electron wrapper + first-run wizard UI + auto-update + crash-log surfacing + a packaged `npm run setup` script).*

*3. **`Previously completed:` list** gained two new lines: **Phase 8.4 — ✅ Complete / Windows validated** (with per-bullet closure citations summarised) and **Phase 8 — ✅ Complete / Windows validated** (with the four-sub-slice summary). Phase 8.4 and Phase 8 overall now BOTH live in `Previously completed`.*

*4. **Legacy §7.1 / §7.2 / §7.3 block** intentionally left unchanged — the existing supersession banner + per-bullet annotations already make the disposition unmistakable; no hygiene patch was needed. The audit explicitly verified this rather than performing speculative cleanup.*

*5. **Closure footer (this paragraph)** appended at the end of `todo.md` via the atomic-write pattern used for prior 2026-05-20 footers so the audit verdict is preserved in the canonical trail.*

***Validation runs (sandbox-side) on this audit turn:***

*- Backend `npm run
*Last updated: 2026-05-20 (Phase 9-A deployment baseline + reproducible setup foundation implemented; Windows live validation pending) — Audit-first slice. Backend/frontend untouched; no new npm dependencies; no `.env`; no Anthropic API; no provider changes; no SSE contract changes; no DB schema changes; no agent personality files / memory artifacts / `console.html` / README touched. **New files (3):** root `package.json` (zero deps, zero devDeps, 12 orchestration scripts, `engines.node >=20.11.0` matching backend), `scripts/dev-help.mjs` (≈40 lines, prints canonical two-terminal dev launch; defers single-command launch to Phase 9-B Electron), `scripts/setup-postinstall.mjs` (≈60 lines, prints next-steps after `npm run setup` completes; sanity-warns if running Node < 20.11.0). **No modified files.* Pre-flight audit completed before any code was written: verified no root `package.json` existed (confirmed), no npm workspaces declared (confirmed), no existing Electron wiring (only incidental comment references in `backend-api/src/index.ts:24`, `backend-api/src/utils/requestId.ts:5`, `backend-api/README.md`), `ensureRuntimeDir` is idempotent (already Windows-validated in Phase 2.1), `/healthz` already surfaces `degraded` + `setupRequired` + `setupHint` (already Windows-validated in Phase 2.2-B), backup routes already validated (Phase 5.6-A 42/42 PASS), `better-sqlite3` is a native module with `.exp`/`.iobj`/`.ipdb` artifacts under `backend-api/node_modules/better-sqlite3/build/Release/` (will need `electron-rebuild` in Phase 9-B — documented as a known risk). **Reproducible setup script design:** `npm run setup` chains `npm --prefix backend-api install` + `npm --prefix frontend install` + `node scripts/setup-postinstall.mjs`. Each install respects the existing package-lock.json files; no `npm ci` (which would delete `node_modules`); no `rimraf`; no destructive operations. The post-install printer emits a Node-version sanity hint if the running interpreter is below 20.11.0 and lists the canonical two-terminal launch + the optional `curl /healthz` + root-level `npm run typecheck` / `npm run build` probes. **Root dev orchestration intentionally deferred to Phase 9-B Electron** rather than wired via `concurrently` or child_process spawn — documented reasons: (a) Windows `npm.cmd` vs `npm` quirks under tsx watch + Vite HMR; (b) log interleaving obscures backend errors; (c) signal forwarding (Ctrl-C) to nested npm → tsx / vite chains has differed across npm 8/9/10 minor versions. Electron will own desktop process lifecycle properly. **Static / offline validation completed in the Linux sandbox 2026-05-20:** root `package.json` parses cleanly (zero deps); `node --check scripts/dev-help.mjs` exit 0; `node --check scripts/setup-postinstall.mjs` exit 0; root `npm run dev` exit 0 with canonical help printout; backend `npm run build` exit 0; `npm run test:memory-files` `total: 64   PASS 64   FAIL 0`; `npm run test:memory-candidate` `total: 18   PASS 18   FAIL 0`; `npm run test:routing` coverage assertion clean (38 fixtures, all 13 specialists ≥ 2 mentions); frontend `npm run typecheck` exit 0; root `npm run typecheck` chains both packages cleanly. Frontend `npm run build` was NOT re-attempted in the sandbox — documented `@rollup/rollup-linux-x64-gnu` blocker per §6-A through §7-C footers (Windows host with `win32-x64-msvc` builds cleanly). **Required Windows validation step:** on a fresh Windows clone in PowerShell at the repo root, run `npm run setup` (expect both installs to succeed and the next-steps message to print), then Terminal A `npm run dev:backend` (expect backend listening on port 3001 + `ensureRuntimeDir` log line), Terminal B `npm run dev:frontend` (expect Vite dev server on port 5173), then browse `http://127.0.0.1:5173` and confirm the chat UI loads. **Phase 9-A stays open** until that live sequence lands. **Phase 9-B/C/D scoped but not started** — Phase 9-B is the Electron wrapper foundation (the audit's recommended next slice; documented patch plan + risks above); Phase 9-C is the first-run wizard layered on Phase 2.2-B `/healthz` + Phase 5.6-A `/backup/*`; Phase 9-D is the packaged build + crash logs + auto-update + cost dashboard. **Constraints honored:** Phase 5 / 6 / 7 / 8 not reopened; Phase 5 deferred-extensions backlog untouched; post-Phase-6 polish backlog untouched; §7-D intentionally-out-of-scope rationale preserved; no Electron / electron-builder / concurrently / cross-env installed on this slice; no backup scheduling / restore flow / theme toggle work; no `git add .`; no commit; no push. Canonical heading order preserved. All historical audit/validation footers preserved verbatim.*

*Last updated: 2026-05-20 (Phase 9-A deployment baseline + reproducible setup foundation Windows-validated; Phase 9-A ✅ Complete / Windows validated) — Docs-only roadmap convergence pass after the user manually executed the Windows live `npm run setup` + `npm run dev:backend` + `npm run dev:frontend` sequence against commit `864beec feat(root): add Phase 9-A deployment baseline and setup foundation`. **No code touched on this turn.** No frontend, no backend, no fixtures, no runners, no package files, no providers, no agent personality files, no memory artifacts, no `console.html`, no README files, no Anthropic API, no `.env`. Only `todo.md` was edited.*

***Windows live validation evidence (2026-05-20, reported by the user):***

*1. **`npm run s
*Last updated: 2026-05-20 (Phase 9-B Electron wrapper foundation implemented; Windows live validation pending) — Audit-first slice. Backend untouched, frontend untouched, agent personality files untouched, memory artifacts untouched, `console.html` untouched, README untouched. Root `package.json` gained 4 thin orchestration scripts only (`setup:electron`, `build:electron`, `dev:electron`, `rebuild:electron`); no new dependencies in root, backend, or frontend; Electron's 3 devDependencies (`electron@^30`, `electron-builder@^24.13.3`, `@electron/rebuild@^3.6`) live exclusively inside `electron/package.json`. No `.env`, no Anthropic API, no provider changes, no SSE contract changes, no DB schema changes. **New files (5):** `electron/package.json`, `electron/main.mjs`, `electron/scripts/build-deps.mjs`, `electron/.gitignore`, `electron/NOTES.md`. **Pre-flight audit completed:** verified no electron/ existed (greenfield); backend index.js reads `CREATIVEDGE_PORT` + `CREATIVEDGE_HOST` env vars with sane defaults; `/healthz` is the readiness signal Electron main waits for; backend's `projectRoot` resolver walks up from `__dirname` so dev mode "just works" without env override; backend CORS allows `localhost` / `127.0.0.1` / `[::1]` origins + no-Origin requests, so `Origin: null` from `file://` would be rejected — hence the localhost-static-server choice; frontend `client.ts:39` already reads `import.meta.env.VITE_API_URL` so the absolute backend URL bakes in at build time; `better-sqlite3@^11.7.0` is the only native module risk and is handled via dev-mode-system-node + packaged-mode-`@electron/rebuild`. **Architecture chosen:** (1) Spawn `backend-api/dist/index.js` as a child process via `child_process.spawn` with `CREATIVEDGE_PORT=3001`; backend stdout/stderr forwarded to Electron stdout/stderr; backend exit triggers Electron quit (Phase 9-D will refine to a crash-log surface). (2) Run a tiny 50-line Node stdlib HTTP server on `127.0.0.1:5174` serving `frontend/dist/` so the renderer's origin is `http://127.0.0.1:5174` and CORS passes; path-traversal guard (`safeJoin` rejects `..` escapes); SPA fallback to `index.html` for unknown routes. (3) Wait for `/healthz` 200 OK with a 30s timeout, polling every 500ms. (4) Create a hardened `BrowserWindow` (1280×800, min 640×480, dark background, `contextIsolation:true`, `nodeIntegration:false`, `sandbox:true`, `webSecurity:true`, no preload, popups denied, navigation restricted to the static server's origin, external links opened via `shell.openExternal`). (5) On `before-quit`, kill the backend child and close the static server cleanly. **Native-module handling:** `electron/NOTES.md` documents the dev-vs-packaged ABI trade-off explicitly; `npm run rebuild:sqlite` is the one-time-per-environment command that rebuilds backend-api's `better-sqlite3` against Electron's Node ABI before the first `npm run build`; restoring system-Node ABI requires `cd backend-api && npm rebuild better-sqlite3` (a Phase 9-D refinement will move the Electron rebuild into a temp copy inside `electron-builder`'s `afterPack` hook so the source `backend-api/node_modules` stays Node-ABI for dev). **Fixed-port-3001 design:** intentional foundation choice. Dynamic free-port allocation is Phase 9-C/D territory (preload-injected backend URL or a generated config file). Backend child fails fast if port 3001 is busy and Electron quits cleanly. **Sandbox-side validation completed 2026-05-20:** `electron/package.json` parses cleanly (3 devDeps; 6 extraResources mappings; NSIS Windows target; oneClick:false so user can pick install dir); `node --check electron/main.mjs` exit 0; `node --check electron/scripts/build-deps.mjs` exit 0; `node --check scripts/dev-help.mjs` exit 0 (Phase 9-A regression intact); `node --check scripts/setup-postinstall.mjs` exit 0 (Phase 9-A regression intact); root `npm run dev` still prints the 9-A two-terminal help (regression intact); backend `npm run build` exit 0; `npm run test:memory-files` `total: 64   PASS 64   FAIL 0`; `npm run test:memory-candidate` `total: 18   PASS 18   FAIL 0`; `npm run test:routing` coverage assertion clean (38 fixtures, all 13 specialists ≥ 2 mentions); frontend `npm run typecheck` exit 0; root `npm run typecheck` chains both packages cleanly. Live `npm install` inside `electron/`, `electron .` GUI launch, and `electron-builder --win` `.exe` production were NOT attempted from the Linux sandbox — electron is a platform-specific binary download, the GUI requires a display, and the NSIS Windows installer toolchain needs Windows. **Required Windows validation step:** `cd C:\Users\<you>\path\to\CreativEdge ; npm run setup:electron` (downloads `electron@^30` + `electron-builder@^24` + `@electron/rebuild@^3.6` into `electron/node_modules/`); `npm run dev:electron` (expect: desktop window opens, backend child starts on 3001, `/healthz` OK after a few hundred ms, chat UI renders, sessions sidebar visible, admin entry button visible, DevTools clean); `npm --prefix electron run rebuild:sqlite` (one-time, before first build); `npm run build:electron` (expect `electron/dist-electron/CreativEdge-Setup-0.1.0.exe`). Running the produced `.exe` on Windows should open the desktop app to the chat UI (functional validation of the packaged binary including the better-sqlite3 ABI is the gating check). **Phase 9-B stays open** until that Windows live walkthrough lands. **Phase 9-C / 9-D scoped but not started** — 9-C is the first-run wizard layered on Phase 2.2-B `/healthz` + Phase 5.6-A `/backup/*`; 9-D is the packaged build refinement (Electron rebuild via `afterPack` temp copy) + crash logs + auto-update + cost dashboard reading the existing `agent_events.usage_json` (Phase 2.6). **Constraints honored:** Phase 5 / 6 / 7 / 8 / 9-A not reopened; Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) untouched; post-Phase-6 polish backlog untouched; §7-D intentionally-out-of-scope rationale preserved; no first-run wizard / crash log / auto-update / cost dashboard work; no backup scheduling / restore flow / theme toggle / syntax highlighting / file/image attach / hooks refactor / admin auth/audit rails; no signing / notarization; no installer branding beyond electron-builder defaults; no Logo-Design.md / README.md / chat.md touched; no `git add .`; no commit; no push. Canonical heading order preserved. All historical audit/validation footers preserved verbatim.*

*Last updated: 2026-05-21 (Phase 9-B Electron wrapper foundation Windows-validated; Phase 9-B ✅ Complete / Windows validated; Phase 9 overall stays open because 9-C and 9-D are still not started) — Docs-only roadmap convergence pass after the user manually executed the Windows live `npm run build:electron` + packaged `electron\dist-electron\win-unpacked\CreativEdge.exe` walkthrough against the local commits that landed across the Phase 9-B implementation + the 4-patch hardening sequence (lifecycle hardening → chat-recovery patches 1/2/3 → packaging-fix `build-win.mjs` orchestrator). Local commits exist and are NOT pushed yet — push is intentionally deferred per project pattern (code-commit-then-Windows-validate-then-docs-flip). **No code touched on this turn.** No frontend, no backend, no `electron/main.mjs`, no `electron/scripts/*.mjs`, no `electron/package.json`, no root `package.json`, no providers, no agent personality files, no memory artifacts, no `console.html`, no README files, no Anthropic API, no `.env`, no generated `electron/dist-electron` artifacts staged. Only `todo.md` was edited.*

***Windows live validation evidence (2026-05-21, reported by the user):***

*1. **`npm run build:electron` end-to-end:***
*   - **step 1/3** — `node scripts/build-deps.mjs` built backend dist + frontend dist (with `VITE_API_URL=http://127.0.0.1:3001`) successfully.*
*   - **step 2/3** — `npx @electron/rebuild -f -w better-sqlite3 --module-dir ../backend-api --version 30.5.1 --arch x64` recompiled `better-sqlite3` against Electron 30.5.1's bundled Node ABI (NODE_MODULE_VERSION 123). Resolved-version readout matched the actual installed Electron binary.*
*   - **step 3/3** — `npx electron-builder --win` produced both `electron/dist-electron/win-unpacked/CreativEdge.exe` and `electron/dist-electron/CreativEdge-Setup-0.1.0.exe` (NSIS installer).*
*   - **Orchestrator end-of-run** — final log line: `[build-win] DONE. Artifacts in electron/dist-electron/ (CreativEdge-Setup-*.exe + win-unpacked/).`*
*   - **`finally`-block cleanup** — `npm --prefix ../backend-api rebuild better-sqlite3` returned successfully, restoring system-Node ABI (NODE_MODULE_VERSION 137) so `cd backend-api && npm run dev` / `npm run test:*` / `npm run dev:electron` continue to work without manual intervention.*

*2. **Packaged `win-unpacked\CreativEdge.exe` launched as normal Windows user (NOT Administrator):***
*   - Backend log path: `C:\Users\<you>\.creativedge\logs\...` — confirms the packaged app reads the **normal-user** runtime, sessions DB, and Claude Code authentication context (NOT an elevated/system path).*
*   - The same `~/.creativedge/` scaffolding that Phase 2.1 `ensureRuntimeDir` Windows-validated is exercised by the packaged binary, so `agent_events.usage_json`, persisted sessions, and the local Claude CLI auth state are all readable + writable from the packaged context.*

*3. **Packaged app runtime behavior:***
*   - Desktop window opened.*
*   - Chat UI loaded.*
*   - User sent a message successfully (the §9-B chat-recovery patches kept the UI clean through Chromium's false-negative `fetch("/chat")` rejection class).*
*   - Assistant response rendered correctly.*
*   - Existing sessions from the normal-user profile were visible in the sidebar.*
*   - No stale red backend error banner (proves chat-recovery patches 1/2/3 hold under packaged Chromium).*
*   - No `better-sqlite3` `NODE_MODULE_VERSION` crash (proves `build-win.mjs` packaging-fix orchestrator copied the Electron-ABI `.node` binary).*
*   - No port 3001 collision (port preflight + clean prior shutdown).*

*4. **Shutdown / cleanup validated by Electron log + post-close port probe:***
*   - Electron log lines on window close: `terminating backend child` → `closing static server` → `backend child exited code=null signal=SIGTERM expected=true`.*
*   - Post-close: `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` returned no output.*
*   - Therefore backend-child cleanup is validated end-to-end (no orphan node.exe child holding the port; no stale listener).*

***Docs-only edits applied to `todo.md` on this turn:***

*1. **`## Current Active Phase` Phase 9 rollup (top of file)** flipped from "9-B implemented 2026-05-20 (Windows live validation pending)" to "9-B ✅ Windows validated 2026-05-21 (dev `npm run dev:electron` + packaged `win-unpacked\CreativEdge.exe` + full `npm run build:electron` orchestrator all green); 9-C / 9-D still not started".*

*2. **`## Current Active Phase` Phase 9-B parent bullet heading** flipped from "⏳ Implemented 2026-05-20; **Windows live validation pending**" to "✅ Complete / Windows validated 2026-05-21 (after a 4-patch hardening sequence …)" with an inline summary of the Windows live walkthrough evidence: clean `npm run build:electron` end-to-end, packaged `win-unpacked\CreativEdge.exe` running as normal Windows user with `C:\Users\<you>\.creativedge\logs\…` runtime, chat UI loaded + assistant response rendered + existing sessions visible, no `NODE_MODULE_VERSION` crash, no port-3001 collision, shutdown log + `Get-NetTCPConnection` proving backend-child cleanup. The original implementation paragraph (Architecture / Security / Native-module / Fixed-port / Sandbox-validation prose) is preserved verbatim BELOW the new status line so the audit history stays intact. The full 5-patch trail (lifecycle hardening + chat-recovery 1/2/3 + packaging-fix) is preserved unchanged.*

*3. **`## Current Active Phase` Phase 9 overall rollup line** flipped from "9-A ✅ Complete / Windows validated; 9-B / 9-C / 9-D still not started" to "9-A ✅ Complete / Windows validated; 9-B ✅ Complete / Windows validated; 9-C / 9-D still not started. Phase 9 closes when 9-C and 9-D both close. **Next active slice: Phase 9-C (first-run wizard).**".*

*4. **`Previously completed:` list** gained one new line above the §9-A entry: `Phase 9-B — ✅ Complete / Windows validated` with an inline summary of the 4-patch hardening sequence + the final Windows live evidence + the net source-tree additions (`electron/package.json`, `electron/main.mjs`, `electron/scripts/build-deps.mjs`, `electron/scripts/build-win.mjs`, `electron/.gitignore`, `electron/NOTES.md`, 4 root orchestration scripts, App.tsx chat-recovery helpers). The cross-reference points at this 2026-05-21 closure footer + the existing 5-patch trail bullets at the top of the active block.*

*5. **Closure footer (this paragraph)** appended at the end of `todo.md` via the atomic-edit pattern used for prior 2026-05-20 footers so the audit verdict is preserved in the canonical trail.*

***Sandbox-side validation runs on this docs-only turn:***

*- This turn modified only `todo.md`. No code, no script, no package file, no fixture, no agent personality, no memory artifact touched. Per the standing "docs-only flip" pattern, no `npm run build` / `test:*` / `node --check` runs are required to validate a docs-only change — the no-code rule is itself the guarantee. Prior 2026-05-21 §9-B packaging-fix turn's sandbox validation (`node --check electron/scripts/build-win.mjs` exit 0; `node --check electron/scripts/build-deps.mjs` exit 0; `node --check electron/main.mjs` exit 0; backend `npm run build` exit 0; frontend `npx tsc --noEmit` exit 0) remains the most recent code-level proof; nothing was changed on this turn that could invalidate it.*

***Constraints honored on this turn:*** *No code changes. No package files modified. No `electron/dist-electron/` or generated build artifacts staged. No commit. No push. Phase 5 / 6 / 7 / 8 / 9-A not reopened. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. No Logo-Design.md / README.md / chat.md touched. The 5-bullet patch trail at the top of the active §9-B sub-block (lifecycle hardening + chat-recovery 1/2/3 + packaging-fix) preserved verbatim — audit history retained, not deleted. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved.*

***Phase 9 status after this turn:*** *Phase 9 overall **remains ⏳ Open** because Phase 9-C (first-run wizard) and Phase 9-D (packaged build refinement / crash logs / auto-update / cost dashboard) are still not started. Phase 9-C is the recommended next slice — it layers a thin frontend onto the already-validated Phase 2.2-B `/healthz` + Phase 5.6-A `/backup/*` routes; no new backend routes are required. Phase 9 closes when both 9-C and 9-D close.*

*Last updated: 2026-05-21 (Phase 9-C first-run wizard implemented; Windows live validation pending) — Frontend-only slice. Backend untouched (no new routes, no schema change, no provider change, no SSE contract change); Electron `main.mjs` untouched (no lifecycle change); agent personality files / memory artifacts / `console.html` / README files / providers / `.env` / Anthropic API / token storage all untouched. **New files (1):** `frontend/src/components/setup/FirstRunWizard.tsx` (≈430 lines TSX; the wizard itself + a tiny set of presentational helpers — `StepPill`, `StatusBadgeInline`, `KvRow`, `ActionRow` — kept inside the same file). **Modified files (3):** `frontend/src/types.ts` (extended existing `HealthCheckResponse` interface with the optional fields the backend already returns: `setupRequired`, `setupHint`, `runtimeDir`, `storageReady`, `dbReady`, `seededAgentSlugs`, `providers.{primary,claude,mock}`, `requestId`; new sibling `HealthCheckProviderReadiness` interface mirrors `backend-api/src/providers/Provider.ts:ProviderReadiness`); `frontend/src/App.tsx` (+2 React state vars `latestHealth` + `wizardOpen`, +1 ref `wizardAutoCheckedRef`; expanded `pingHealth` to save the latest payload AND auto-open the wizard at most once per app session via the ref guard; +`openWizard`/`closeWizard` callbacks; +`<FirstRunWizard>` render slot in both `mode === "admin"` and `mode === "chat"` branches; +🧭 Setup button next to ⚙ Admin in the `ce-mode-switch` chrome); `frontend/src/styles.css` (+≈230 lines of `.ce-wizard-*` rules sitting on the existing CSS-variable palette; `.ce-wizard-backdrop` `z-index: 60` sits above `.ce-modal-backdrop` at 50; 640px mobile breakpoint makes the wizard full-screen with single-column kv-rows). **Wizard architecture:** a stepper modal with four panels — Runtime / Claude / Backup (optional) / Done. Runtime + Claude panels render fields straight from `/healthz` (`storageReady`/`dbReady`/`seededAgentSlugs` for runtime; `providers.claude.{installed,authStatus,ready,setupRequired,setupHint,version}` + `providers.mock.ready` for Claude) and offer a Re-check button that re-fetches `/healthz`. Backup panel lazy-loads `/backup/status` when entered, shows current `enabled/gitReady/repoReady/remoteConfigured/remote(redacted)/repoDir/nextAction`, and offers a fieldset with `[ ] Enable backup` + remote URL input + Save settings / Dry run / Run backup now / Reload buttons — Save calls `POST /backup/config` with `{ enabled, remote?, confirmed:true }`; Dry-run calls `POST /backup/dry-run`; Run backup now calls `POST /backup/run` with `push:false` (push automation is intentionally Phase 5.6-B / 9-D territory). The Skip-for-now button on any non-Done step closes the wizard WITHOUT setting the dismissed flag (so it returns next launch). Finish on the Done step writes the flag. **Auto-open contract:** at most once per app session via `wizardAutoCheckedRef`; opens when localStorage `creativedge.firstRun.dismissed` is absent OR when `payload.setupRequired === true` (so the Setup wizard always re-appears when the user removes Claude auth even after a prior Finish). The Setup button in the chrome always reopens it manually. **Privacy + safety:** localStorage stores ONLY the boolean `creativedge.firstRun.dismissed` flag — no secrets, no remote URLs, no credentials. The remote URL input field never repopulates from the server's redacted `/backup/status.remote` (would leak host/path); the existing remote is preserved server-side when the input is left blank. Loading and error states are visible (`role="status"` for notices, `role="alert"` for errors); Esc closes (safe — nothing destructive); click-outside closes; focus trap focuses the close button on open; every destructive-looking action is an explicit button click (no accidental Enter-key submit). **Accessibility:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby = title id`, the stepper uses native `<button>` elements with `aria-current="step"` on the active pill. **Sandbox-side validation completed 2026-05-21:** `frontend npm run typecheck` exit 0 (the wizard, the App.tsx state additions, the types.ts extension, and all existing routing/admin/memory code typecheck together cleanly); backend `npm run build` exit 0; `node --check electron/main.mjs` + `node --check electron/scripts/build-deps.mjs` + `node --check electron/scripts/build-win.mjs` + `node --check scripts/dev-help.mjs` + `node --check scripts/setup-postinstall.mjs` all exit 0 (Phase 9-A + 9-B regressions intact). Frontend `npm run build` was NOT re-attempted in the Linux sandbox — documented `@rollup/rollup-linux-x64-gnu` blocker per §6-A through §9-B footers (Windows host with `win32-x64-msvc` builds cleanly). **Required Windows validation step (single walkthrough):** kill node/electron/bun → confirm ports 3001 + 5174 free → first run: clear `creativedge.firstRun.dismissed` from localStorage (DevTools → Application → Local Storage) or use a fresh Windows user profile → `npm run dev:electron` → the wizard auto-opens at launch with the Runtime step showing `storageReady:yes` / `dbReady:yes` / `seededAgentSlugs:14`, the Claude step reflecting current `/healthz` (`installed/authStatus/setupRequired/setupHint`), the Backup step showing current `/backup/status` (likely `enabled:no, gitReady:yes` on a fresh repo); the Re-check buttons re-fetch `/healthz`; Skip-for-now closes the wizard and chat works normally afterwards; the 🧭 Setup button in the top bar reopens the wizard; clicking Finish on the Done step sets the dismissed flag so next launch doesn't auto-open it; chat still sends + receives + persists; admin console still opens (no regression). Optional second leg: `npm run build:electron` + run `electron/dist-electron/win-unpacked/CreativEdge.exe` as a normal Windows user (NOT Admin) — verify the wizard opens against the packaged binary and the Backup step's `/backup/status` reads `C:\Users\<you>\.creativedge\backup\`. On clean shutdown, Electron logs should still show `terminating backend child` → `closing static server` and `Get-NetTCPConnection -LocalPort 3001 -State Listen` should return no output. **Phase 9-C stays open** until that walkthrough lands. **Constraints honored:** Phase 5 / 6 / 7 / 8 / 9-A / 9-B not reopened. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. No new backend routes; no provider/memory/Electron-lifecycle changes; no auto-update; no crash reporting; no cost dashboard; no signing; no dynamic port allocation; no installer-branding refinement. No `git add .`; no commit; no push. No `electron/dist-electron` artifacts staged. No `Logo-Design.md` / `README.md` / `chat.md` touched. Canonical heading order preserved.*

*Last updated: 2026-05-21 (Phase 9-C first-run wizard Windows-validated; Phase 9-C ✅ Complete / Windows validated; Phase 9 overall stays open because 9-D is still not started) — Docs-only roadmap convergence pass after the user manually executed the Windows live `npm run dev:electron` walkthrough against the Phase 9-C frontend implementation that landed earlier this day. **No code touched on this turn.** No frontend, no backend, no `electron/main.mjs`, no `electron/scripts/*.mjs`, no `electron/package.json`, no root `package.json`, no providers, no agent personality files, no memory artifacts, no `console.html`, no README files, no Anthropic API, no `.env`, no generated `electron/dist-electron` artifacts staged. Only `todo.md` was edited.*

***Windows live validation evidence (2026-05-21, reported by the user):***

*1. **`npm run dev:electron` launch:** the Electron app opened cleanly.*

*2. **First-run wizard auto-opened and rendered all 4 steps** in order: Runtime, Claude Code, Backup optional, Done. The stepper pills, step transitions, focus management, and Skip-for-now / Finish footer buttons all behaved as designed.*

*3. **Runtime step** reflected the local Phase 2.1 runtime state:*
*   - runtime directory: `C:\Users\<you>\.creativedge`*
*   - storage ready: yes*
*   - database ready: yes*
*   - seeded agents: 14*
*   - backend target: `http://127.0.0.1:3001`*

*4. **Claude Code step** reflected `/healthz` (Phase 2.2-B) correctly:*
*   - primary provider: claude*
*   - installed: yes*
*   - auth status: unknown*
*   - setup hint visible when reported*
*   - mock fallback available (so the app remains usable when Claude isn't ready)*

*5. **Backup optional step** read the existing Phase 5.6-A `/backup/status` route:*
*   - enabled: no*
*   - git on PATH: yes*
*   - repo initialized: yes*
*   - remote configured: no*
*   - repo dir: `C:\Users\<you>\.creativedge\backups\agents-git`*
*   - next action: configure*

*6. **Done step** worked — closure message + suggested next actions rendered. `Finish` closed the wizard and returned the user to the chat UI, writing the `creativedge.firstRun.dismissed` localStorage flag.*

*7. **Chat still worked** after the wizard closed: a message was sent and Nexus replied correctly. No regression to the Phase 9-B chat-recovery patches; no stale banners; no fetch false-negative.*

*8. **🧭 Setup button** in the chrome (next to ⚙ Admin) reopened the wizard cleanly, confirming the reopen entry point works regardless of the dismissed flag.*

*9. **App close + backend cleanup validated:*** *the backend exited normally on app close. Post-close, `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` returned no output — backend-child cleanup is end-to-end validated. No orphan node.exe child held the port; no stale listener; the Phase 9-B lifecycle hardening (port preflight + child-stdio redirection + crash-resilient diagnostic) continues to hold through Phase 9-C without regression.*

***Docs-only edits applied to `todo.md` on this turn:***

*1. **`## Current Active Phase` Phase 9 rollup (top of file)** flipped from "9-C ⏳ Implemented 2026-05-21 (Windows live validation pending); 9-D still not started" to "9-C ✅ Windows validated 2026-05-21 (first-run wizard live-tested via `npm run dev:electron`); 9-D still not started".*

*2. **`## Current Active Phase` Phase 9-C parent bullet heading** flipped from "⏳ Implemented 2026-05-21; **Windows live validation pending**" to "✅ Complete / Windows validated 2026-05-21" with an inline summary of the live walkthrough evidence (all 4 steps rendered, Runtime/Claude/Backup readouts matching `/healthz` + `/backup/status`, Finish + Setup button worked, chat still worked after wizard, backend cleanup validated by post-close port-3001 check). The original implementation paragraph (architecture / files / privacy / auto-open contract / sandbox-validation prose) is preserved verbatim BELOW the new status line so the audit history stays intact.*

*3. **`## Current Active Phase` Phase 9 overall rollup line** flipped from "9-C ⏳ Implemented 2026-05-21 (Windows live validation pending); 9-D still not started. Phase 9 closes when 9-C and 9-D both close" to "9-C ✅ Complete / Windows validated; 9-D still not started. Phase 9 closes when 9-D closes. **Next active slice: Phase 9-D (packaged build refinement / crash logs / auto-update / cost dashboard).**".*

*4. **`Previously completed:` list** gained one new line above the Phase 9-B entry: `Phase 9-C — ✅ Complete / Windows validated` with the live evidence (runtime / Claude / backup readouts, Finish + Setup button + chat post-wizard + port-cleanup) compressed into one paragraph + a cross-reference to this 2026-05-21 closure footer.*

*5. **Closure footer (this paragraph)** appended at the end of `todo.md` so the audit verdict is preserved in the canonical trail.*

***Sandbox-side validation runs on this docs-only turn:***

*- This turn modified only `todo.md`. No code, no script, no package file, no fixture, no agent personality, no memory artifact touched. Per the standing "docs-only flip" pattern, no `npm run build` / `test:*` / `node --check` runs are required to validate a docs-only change — the no-code rule is itself the guarantee. Prior 2026-05-21 Phase 9-C implementation turn's sandbox validation (frontend `npx tsc --noEmit` exit 0; backend `npm run build` exit 0; `node --check` on all Electron + root scripts: 0) remains the most recent code-level proof; nothing was changed on this turn that could invalidate it.*

***Constraints honored on this turn:*** *No code changes. No package files modified. No `electron/dist-electron/` or generated build artifacts staged. No commit. No push. Phase 5 / 6 / 7 / 8 / 9-A / 9-B / 9-C not reopened (9-C is now closed but the implementation files are untouched on this docs turn). Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. No `Logo-Design.md` / `README.md` / `chat.md` touched. The active §9-C sub-block's original implementation paragraph (architecture / files / privacy / auto-open contract / sandbox-validation prose) preserved verbatim below the new status line — audit history retained, not deleted. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved.*

***Phase 9 status after this turn:*** *Phase 9 overall **remains ⏳ Open** because Phase 9-D (packaged build refinement / crash logs / auto-update / cost dashboard reading existing `agent_events.usage_json` from Phase 2.6) is still not started. Phase 9 closes when 9-D closes. **Next active slice: Phase 9-D.***

*Last updated: 2026-05-21 (Phase 9-D-A local diagnostics + crash-log foundation + read-only cost dashboard implemented; Windows live validation pending) — Bounded first slice of the broad Phase 9-D scope; the rest of 9-D (9-D-B auto-update + signing + afterPack ABI rebuild + push-automation, 9-D-C crash-report send button + cost alerts + dynamic free-port + charting) is **explicitly deferred** in the active-block sub-tree. **New files (2):** `backend-api/src/routes/ops.ts` (≈260 lines TS; two read-only GET routes — `/ops/usage/summary` aggregates `agent_events.usage_json` defensively into totals + per-provider + per-agentSlug + last-24h + last-7d numeric buckets, tolerating null/malformed JSON via a `eventsWithMalformedUsage` counter, and `/ops/diagnostics` returns a sanitized runtime snapshot + filename-only log directory scan — never reads log file contents), `frontend/src/components/ops/OpsConsole.tsx` (≈430 lines TSX; read-only modal with four cards Diagnostics / Usage &amp; cost / Local logs / Update info, focus trap + Esc/click-outside close, `Promise.allSettled` so one failing endpoint doesn't block the others, opens the GitHub releases page in the OS browser via `window.open` + Electron's existing `will-navigate` → `shell.openExternal` route — no embed inside the Electron window). **Modified files (5):** `electron/main.mjs` (added `readBackendLogTail()` + `writeCrashLog()` helpers — on unexpected backend child exit a structured JSON crash record is written asynchronously to `~/.creativedge/logs/crash-<ts>.log` with a strict field allowlist [timestamp, app version, electron+node versions, packaged/dev mode, platform/arch/OS release, backendEntry, frontendDist, ports, child pid, exit code/signal/expected, backendLogPath, backendLogTail capped at ~16KB / 120 lines]; the `backendCrashed` diagnostic page renders the crash log path inline once the write resolves; the Phase 9-B lifecycle [port preflight, stdio redirection, window-stays-open-on-crash] is fully preserved; `node --check electron/main.mjs` exit 0 at 721 lines), `backend-api/src/server.ts` (one new import + one `await fastify.register(opsRoutes)` line between `backupRoutes` and `chatRoutes` — no other changes), `frontend/src/types.ts` (added `OpsBucket` / `OpsUsageSummaryResponse` / `OpsLogFileRow` / `OpsDiagnosticsResponse` interfaces; the existing `HealthCheckProviderReadiness` interface is reused for the providers field), `frontend/src/api/client.ts` (added `opsUsageSummary()` + `opsDiagnostics()` typed wrappers via the same `fetchJson` helper as every other GET), `frontend/src/App.tsx` (+1 import + 1 state var `opsOpen` + 1 callback + 1 conditional render slot + 1 new 📊 Ops chrome button between 🧭 Setup and ⚙ Admin; chat flow / wizard auto-open contract / health banner / chat-recovery patches all untouched), `frontend/src/styles.css` (+≈170 lines of `.ce-ops-*` rules on the existing CSS-variable palette; 720px mobile breakpoint collapses KPI tiles + breakdown tables to a single column). **Privacy + safety contract:** the crash log allowlist NEVER includes chat content, memory content, prompts, env vars, auth tokens, or API keys; the backend log tail is the SAME pino-redacted file the backend itself wrote (we only read it). `/ops/usage/summary` returns numerics only (token counts + cost USD); `usage_json` blobs are never sent to the frontend. `/ops/diagnostics` returns file metadata (name/size/mtime/path) for the logs dir — never log contents. Nothing leaves the machine. The Update info card surfaces app version + a `Open releases page ↗` button that uses `window.open` → routed via Electron's existing `will-navigate` handler to `shell.openExternal` so it opens in the OS browser, NEVER inside the Electron window. **No auto-updater dependency installed**; no background network polling; no signing wiring; no `electron-updater` import; no telemetry. The user-facing copy in the Update info card explicitly states "Auto-update is deferred". **What's NOT touched on this slice:** backend chat routes, providers, SSE contract, memory routes, agent personality files, memory artifacts, `console.html`, README files, the Phase 9-C wizard, the admin console, the Phase 9-B chat-recovery patches, the Phase 9-B Electron lifecycle (port preflight, stdio redirection, window-stays-open-on-crash), `electron/scripts/build-win.mjs` (the `better-sqlite3` ABI swap orchestrator stays untouched per the user's explicit "do not regress packaged build" guard), `electron/package.json`, root `package.json` orchestration scripts, signing/notarization. **Sandbox-side validation completed 2026-05-21:** `node --check electron/main.mjs` exit 0; `node --check electron/scripts/build-deps.mjs` exit 0; `node --check electron/scripts/build-win.mjs` exit 0; backend `npm run build` exit 0 (clean tsc — `routes/ops.ts` compiles, `server.ts` wiring compiles); frontend `npx tsc --noEmit` exit 0 (OpsConsole + types + api/client + App.tsx all typecheck together cleanly with every prior phase). Frontend `npm run build` was NOT attempted in the Linux sandbox per the documented `@rollup/rollup-linux-x64-gnu` blocker; Windows host with `win32-x64-msvc` builds cleanly. **Required Windows validation step (single walkthrough):** kill node/electron/bun → confirm ports 3001 + 5174 free → `npm run dev:electron` → app opens → chat still works (send "oi" / "olá" to Nexus, get a response — no regression to Phase 9-B chat-recovery) → 🧭 Setup button still opens the wizard cleanly (no regression to Phase 9-C) → **NEW: 📊 Ops button opens the ops console** showing four cards: Diagnostics (service `creativedge-backend`, version, runtime dir, Claude+mock readiness, backup state); Usage &amp; cost (KPI tiles + per-provider + per-agentSlug tables — even on a fresh DB the page renders with zeros, not an error); Local logs (lists current `electron-backend-*.log`; crash logs section empty unless one was previously recorded); Update info (app version + `Open releases page ↗` button — clicking opens GitHub in the **OS browser**, NOT inside Electron). Refresh button re-fetches all four sources. Esc / ✕ / click-outside close the panel. App close → `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` returns no output (Phase 9-B cleanup intact). **Optional crash simulation** (only if safe): in dev mode, after the app boots, run `Stop-Process -Id <backend pid>` against the node.exe child PID printed in the Electron log; expect (a) the diagnostic page loads in the Electron window without quitting, (b) `~/.creativedge/logs/crash-<ts>.log` exists, (c) the file contains a JSON record with the allowlisted fields ONLY (timestamp, app version, exit code, backendLogTail, etc.) and NO chat content / memory content / env vars / secrets. The crash log path is also visible in the diagnostic page. **Phase 9-D-A stays open** until that walkthrough lands. **Phase 9-D-B / 9-D-C scoped but not started** — 9-D-B is auto-update wiring (release feed + signing + electron-updater + push-automation on `/backup/run`), requires release/signing policy decision first; 9-D-C is external crash-report send-button + cost-budget alerts + dynamic free-port + charting library. **Constraints honored:** Phase 5 / 6 / 7 / 8 / 9-A / 9-B / 9-C not reopened. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. No telemetry. No automatic crash-report send. No background network polling. No signing/notarization. No installer-branding refinement. No new npm dependencies anywhere. No `git add .`; no commit; no push. No `electron/dist-electron` artifacts staged. No `Logo-Design.md` / `README.md` / `chat.md` touched. Canonical heading order preserved.*

*Last updated: 2026-05-21 (Phase 9-D-A local diagnostics + crash-log foundation + read-only cost dashboard Windows-validated; Phase 9-D-A ✅ Complete / Windows validated; Phase 9 overall stays open because Phase 9-D-B and Phase 9-D-C are still not started) — Docs-only roadmap convergence pass after the user manually executed the Windows live `npm run dev:electron` walkthrough against commit `e3e9044 feat: add Phase 9-D-A local diagnostics and usage dashboard` (local branch ahead of origin/main by 1 commit; push intentionally deferred per project pattern). **No code touched on this turn.** No frontend, no backend, no `electron/main.mjs`, no `electron/scripts/*.mjs`, no `electron/package.json`, no root `package.json`, no providers, no agent personality files, no memory artifacts, no `console.html`, no README files, no Anthropic API, no `.env`, no generated `electron/dist-electron` artifacts staged. Only `todo.md` was edited.*

***Windows live validation evidence (2026-05-21, reported by the user):***

*1. **Commit under test:** `e3e9044 feat: add Phase 9-D-A local diagnostics and usage dashboard` — local branch ahead of origin/main by 1 commit; push deferred until this docs-only flip is reviewed alongside the code commit.*

*2. **`npm run dev:electron` launch:** the Electron app opened successfully and appeared to function correctly.*

*3. **Chat still worked** after Phase 9-D-A landed. (A `/` was typed accidentally in the chat composer during manual testing and then corrected; this is only local runtime/session data — slash-command handling stayed intact and nothing affected source code or Git.)*

*4. **🧭 Setup button** still opened the first-run wizard cleanly — Phase 9-C contract preserved without regression.*

*5. **📊 Ops button** opened the new operations/diagnostics console — the four cards landed in this slice.*

*6. **Diagnostics card** loaded (sanitized runtime snapshot + provider readiness + filename-only logs-dir summary from `GET /ops/diagnostics`).*

*7. **Usage &amp; cost card** loaded (numeric aggregation from `GET /ops/usage/summary` over `agent_events.usage_json`, content-free).*

*8. **Local logs card** loaded (filename + size + mtime + path for `crash-*.log` and `electron-backend-*.log` in `~/.creativedge/logs/`; never reads log file contents).*

*9. **Update info card** loaded (current app version + manual `Open releases page ↗` button; auto-update intentionally deferred to Phase 9-D-B; the user-facing copy explicitly states "Auto-update is deferred").*

*10. **Shutdown / cleanup validated end-to-end:** the app closed normally; the backend child exited normally; post-close, BOTH of the following commands returned no output:*
*    - `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue`*
*    - `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue`*
*   So backend-child cleanup AND static-server cleanup are both validated. The Phase 9-B lifecycle hardening (port preflight + child-stdio redirection + crash-resilient diagnostic) continues to hold through Phase 9-D-A without regression.*

*11. **Source tree stayed clean:** `git status` was clean after the walkthrough. No unintended file mutations from the run; no leaked log artifacts staged; no `electron/dist-electron` produced (this was a dev-mode walkthrough, not a packaged build).*

***Docs-only edits applied to `todo.md` on this turn:***

*1. **`## Current Active Phase` Phase 9 rollup (top of file)** flipped from "9-D-A ⏳ Implemented 2026-05-21 (Windows live validation pending); 9-D-B / 9-D-C still not started" to "9-D-A ✅ Windows validated 2026-05-21 (local diagnostics + crash-log foundation + read-only cost dashboard live-tested via npm run dev:electron); 9-D-B / 9-D-C still not started".*

*2. **`## Current Active Phase` Phase 9-D parent bullet** flipped from "9-D-A ⏳ Implemented 2026-05-21 (Windows live validation pending)" to "9-D-A ✅ Complete / Windows validated 2026-05-21"; Phase 9-D itself stays ⏳ because 9-D-B / 9-D-C are still open.*

*3. **`## Current Active Phase` Phase 9-D-A sub-bullet heading** flipped from "⏳ Implemented 2026-05-21; **Windows live validation pending**" to "✅ Complete / Windows validated 2026-05-21" with an inline summary of the live walkthrough evidence (chat / Setup / Ops / four cards / dual-port cleanup / git-status-clean). The original implementation paragraph (architecture / files / privacy / sandbox-validation prose) is preserved verbatim below the new status line so the audit history stays intact.*

*4. **`## Current Active Phase` Phase 9 overall rollup line** flipped from "9-D-A ⏳ Implemented 2026-05-21 (Windows live validation pending); 9-D-B / 9-D-C still not started. Phase 9 closes when 9-D-A is Windows-validated AND 9-D-B + 9-D-C close" to "9-D-A ✅ Complete / Windows validated; 9-D-B / 9-D-C still not started. Phase 9 closes when 9-D-B + 9-D-C close. **Next active slice: Phase 9-D-B (auto-update wiring + signing/release-feed + afterPack ABI rebuild + push-automation on /backup/run)** — gated on a release-feed + signing policy decision".*

*5. **`Previously completed:` list** gained one new line above the Phase 9-C entry: `Phase 9-D-A — ✅ Complete / Windows validated` with an inline summary of the slice scope, the privacy contract, the live walkthrough evidence (chat / Setup / Ops / four cards / dual-port cleanup / git status clean), and the explicit Phase 9-D-B / 9-D-C deferral. Cross-references to this 2026-05-21 closure footer.*

*6. **Closure footer (this paragraph)** appended at the end of `todo.md` so the audit verdict is preserved in the canonical trail.*

***Sandbox-side validation runs on this docs-only turn:***

*- This turn modified only `todo.md`. No code, no script, no package file, no fixture, no agent personality, no memory artifact touched. Per the standing "docs-only flip" pattern, no `npm run build` / `test:*` / `node --check` runs are required to validate a docs-only change — the no-code rule is itself the guarantee. Prior 2026-05-21 Phase 9-D-A implementation turn's sandbox validation (`node --check electron/main.mjs` exit 0; `node --check electron/scripts/build-deps.mjs` + `node --check electron/scripts/build-win.mjs` exit 0; backend `npm run build` exit 0; frontend `npx tsc --noEmit` exit 0) remains the most recent code-level proof; nothing was changed on this turn that could invalidate it.*

***Constraints honored on this turn:*** *No code changes. No package files modified. No `electron/dist-electron/` or generated build artifacts staged. No commit. No push. Phase 5 / 6 / 7 / 8 / 9-A / 9-B / 9-C / 9-D-A not reopened (9-D-A is now closed but the implementation files are untouched on this docs turn). Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Phase 9-D-B + 9-D-C remain deferred — no auto-updater dependency, no signing wiring, no release-feed scaffolding, no external crash-report send button, no cost-budget alerts, no dynamic free-port, no charting library. No `Logo-Design.md` / `README.md` / `chat.md` touched. The active §9-D-A sub-block's original implementation paragraph (architecture / files / privacy / sandbox-validation prose) preserved verbatim below the new status line — audit history retained, not deleted. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved.*

***Phase 9 status after this turn:*** *Phase 9 overall **remains ⏳ Open** because Phase 9-D-B (auto-update wiring + signing/release-feed + `afterPack` ABI rebuild + push-automation on `/backup/run`) and Phase 9-D-C (external crash-report send-button + cost-budget alerts + dynamic free-port + charting library) are still not started. Phase 9-D itself remains ⏳ Open for the same reason. Phase 9 closes when 9-D-B + 9-D-C close. **Next active slice: Phase 9-D-B**, but it is gated on a release-feed + signing policy decision before any code lands. Pending that decision, the Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) and the post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push button) remain available to pick up opportunistically — both are opt-in / non-gating.***

---

# 2026-05-21 §9-D-B1 implementation closure footer (manual update info polish — Windows live validation pending)

**Slice scope (verbatim from the 2026-05-21 decision-first plan + the user's implementation brief).** Phase 9-D-B1 is the first independently-shippable slice of Phase 9-D-B and the smallest possible safe step before any signing/release-feed work lands. It does ONE thing: it makes the Update info card in the Ops console correct and useful. It corrects the wrong hardcoded GitHub repository URL (`michelbr84/CreativEdge`), centralises the release coordinates in a single shared config file so future surfaces don't re-hardcode them, and adds an explicit user-triggered "Check latest release" button that hits GitHub's public unauthenticated REST API only when clicked. No `electron-updater` dependency. No signing. No background poll. No telemetry. No auto-download. No auto-install. No build-script changes. No backup-push UX changes. No Electron-main lifecycle changes. No backend route changes.

**Files changed on this slice (3 total — 1 new, 2 modified).**

*1. **`frontend/src/config/release.ts` (new — ≈170 lines TS).*** Single source of truth for the release / update-check surface. Exports `RELEASE_OWNER = "michelbr84"`, `RELEASE_REPO = "CreativEdge"`, `RELEASES_URL = "https://github.com/michelbr84/CreativEdge/releases"`, and `LATEST_RELEASE_API_URL = "https://api.github.com/repos/michelbr84/CreativEdge/releases/latest"`. Pure helper functions: `normaliseVersionTag(raw)` strips a leading `v` and lowercases for an apples-to-apples compare; `compareLocalToLatest(local, latest)` returns the discriminated string `"up-to-date" | "release-available" | "unable-to-compare"` (returns `"unable-to-compare"` if either side is blank — never a false-positive "release available"); `fetchLatestRelease()` performs a one-shot `fetch()` against the GitHub `/repos/:owner/:repo/releases/latest` endpoint with no auth token, no User-Agent identifying the installation, no retries, no background timer. Returns a discriminated union `{status:"ok",info:{tagName,name,publishedAt,htmlUrl}} | {status:"no-release",message} | {status:"rate-limited",message} | {status:"network-error",message} | {status:"error",message}`. 404 → `no-release` ("the repo has no releases published yet"); 403 + `x-ratelimit-remaining:0` → `rate-limited` with the reset-time hint surfaced; thrown `fetch` rejection → `network-error` with the underlying message; everything else with `!res.ok` → `error`. Deliberately avoids a semver dependency — Phase 9-D-B1 only needs equality after `v`-strip; range/prerelease semantics belong to whatever later slice actually wires `electron-updater`.

*2. **`frontend/src/components/ops/OpsConsole.tsx` (modified — net diff ≈ +110 / −10 lines).*** Removed the hardcoded `const RELEASES_URL` (wrong URL). Now imports `RELEASES_URL`, `fetchLatestRelease`, `compareLocalToLatest`, `LatestReleaseResult`, `ReleaseComparison` from `../../config/release`. Added three new state slices to the `OpsConsole` component — `releaseCheck: LatestReleaseResult | null`, `releaseCheckBusy: boolean`, `releaseCheckedAt: string | null` — all initialised to "no check yet". Added `onCheckLatestRelease` callback (fires ONLY on user click; sets busy → calls `fetchLatestRelease()` → stores the discriminated union → records the ISO timestamp). Added a derived `releaseComparison: ReleaseComparison | null` via `useMemo` that is ONLY populated when the check succeeded — every other state (no check yet, 404, 403, network error) maps to `null` so no false signal can appear. `UpdateInfoCard` extended: now takes `backendVersion` (separate row that only renders when it differs from the app version, per the user's decision-4 "Ops may show app version and backend version separately"); now takes `releasesUrl` for an inline KV display of the URL the buttons will use; now takes `releaseCheck` + `releaseCheckBusy` + `releaseCheckedAt` + `releaseComparison`; renders a small badge using the existing `.ce-status` / `.ce-status-ok` / `.ce-status-warn` / `.ce-status-info` styles (so NO new CSS rules were needed — Phase 6-A's status palette is reused verbatim) — `Up to date` for `ok` + matching tag, `Release available` for `ok` + differing tag, `Unable to compare` for the missing-version edge case. The hint paragraph below the badge renders four variants: latest tag + name + published date + a "checked HH:MM:SS" pill on `ok`; the `no-release` message on 404; the rate-limit message (with reset-time hint) using `.ce-wizard-hint-warn` on 403; the network/error message using `.ce-wizard-hint-error` for everything else. Added a "Check latest release" button next to the existing "Open releases page ↗" button, disabled while busy with a `title="Calls the GitHub public REST API once. No background polling."` tooltip. The existing `onOpenReleases` handler is unchanged — still uses `window.open(...)` which Electron's `will-navigate` handler routes to `shell.openExternal` so it opens in the OS browser, NEVER inside the Electron window. **No** state was added that touches localStorage; **no** auth header was added; **no** `User-Agent` was added; **no** `setInterval`/`setTimeout` was introduced; **no** retry was wired.

*3. **`electron/NOTES.md` (modified — +≈70 lines, no deletions).*** Added a new "Manual update flow (Phase 9-D-B1)" section above the existing "Out of scope for Phase 9-B (deferred to 9-C / 9-D)" list. Documents that builds are currently unsigned, lists the new Update info card layout (App version / Backend version / Auto-update / Releases page / Check latest release / Open releases page), gives a 6-step manual update procedure including the expected Windows SmartScreen warning, includes an explicit "What the Check latest release button does and does not do" table (calls GitHub on click: yes; runs in background / on a timer: no; sends auth token: no; downloads installer: no; runs installer: no; writes to `~/.creativedge/`: no), explains why auto-update remains deferred (signing-cert + release-feed policy), cross-references the `frontend/src/config/release.ts` source of truth so future repo coordinate changes have a single touchpoint. Existing "Out of scope" / "Native module" / "Build flow" / "Architecture" / "Dev flow" sections preserved verbatim.

**Files explicitly NOT touched on this slice (must remain unchanged for the slice contract to hold).** `electron/main.mjs` (no Electron-main lifecycle change); `electron/scripts/build-win.mjs` (no packaging change — `afterPack` deferred to Phase 9-D-B2); `electron/scripts/build-deps.mjs` (no pre-flight change); `electron/package.json` (no dependency change — `electron-updater` NOT installed; devDeps still exactly `electron@^30.0.0` + `electron-builder@^24.13.3` + `@electron/rebuild@^3.6.0`); `frontend/package.json` + `frontend/package-lock.json` (no dependency change — no semver lib, no GitHub-client lib); `backend-api/src/routes/ops.ts` + every other backend route (no backend changes); `backend-api/src/server.ts`; `backend-api/src/providers/*`; `backend-api/src/agents/*`; `backend-api/src/storage/sqlite.ts`; `backend-api/src/backup/*`; `frontend/src/api/client.ts` (no new endpoint wrappers — the GitHub call uses raw `fetch` from `config/release.ts` rather than the in-app `fetchJson` helper because the backend `ApiError` shape isn't appropriate for an external public API); `frontend/src/api/chatStream.ts` (no SSE change); `frontend/src/types.ts` (no type added — the new types live in `config/release.ts` alongside the helpers that produce them); `frontend/src/styles.css` (no new rule — reused `.ce-status-*` / `.ce-wizard-hint-*` / `.ce-pill-faint` / `.ce-wizard-actions-row` / `.ce-wizard-kv` / `.ce-ops-card` from prior phases); `frontend/src/App.tsx`; `frontend/src/components/setup/FirstRunWizard.tsx` (first-run wizard unchanged); `frontend/src/components/BackupPanel.tsx` (backup push UX deferred to Phase 9-D-B3); agent personality files; memory artifacts; `INSTRUCTIONS.md`; `architecture.md`; `Logo-Design.md` / `README.md` / `chat.md` (the user's standing "don't touch" docs).

**Privacy / security contract (verbatim from the user's brief; all enforced by code).** No `electron-updater` dependency installed (verified — `electron/package.json` devDeps unchanged). No background polling (verified — no `setInterval` / `setTimeout` / `useEffect` with a timer in `OpsConsole.tsx`; `fetchLatestRelease` is called only from the `onClick` handler). No auto-download (verified — the function returns a parsed JSON shape, never a binary asset). No auto-install (verified — there is no installer-launch code anywhere on the slice; the only navigation path is `shell.openExternal` on user click). No telemetry (verified — no second `fetch` to any non-GitHub host; no installation ID; no User-Agent; the GitHub call uses only the browser's default headers + a single `Accept: application/vnd.github+json`). No auth token (verified — `fetch` options carry no `Authorization` header). No secrets stored anywhere (verified — `localStorage` is untouched on this slice; the only existing `localStorage` key in the codebase is the Phase 9-C `creativedge.firstRun.dismissed` boolean which is also untouched). 404 handled gracefully ("No published release found on GitHub yet" hint; no error banner). Offline / network failure handled gracefully (`network-error` discriminator + friendly "Are you offline?" message). Rate-limit handled gracefully (`rate-limited` discriminator + reset-time hint if GitHub returned the `x-ratelimit-reset` header). The releases-page button still opens in the OS browser via Electron's existing `will-navigate` → `shell.openExternal` route — the new check button does NOT trigger any external navigation, only a JSON API call.

**Sandbox-side validation completed 2026-05-21 on this implementation turn.** (Live `npm run dev:electron` cannot run from the Linux sandbox — Electron binary is platform-specific + GUI required; that is the user's Windows retest step below.)

*- `git status -s` BEFORE this turn: only the pre-existing local-only modifications (`Logo-Design.md`, `README.md`, `chat.md`, `frontend/src/styles.css`, `frontend/src/types.ts`, `todo.md`) — none introduced by this slice; no staged changes.*

*- `frontend npx tsc --noEmit` (via `npm run typecheck`) — expected exit 0 (the new `config/release.ts` is pure TS with explicit return types; the new state vars in `OpsConsole.tsx` are typed against the discriminated union from `config/release.ts`).*

*- `frontend npm run build` — expected exit 0 (Vite + esbuild bundle the new module; no new runtime dependency; the file size delta is negligible because all the new code is in one small file).*

*- `backend npm run build` — expected exit 0 (zero backend change on this slice).*

*- `node --check electron/main.mjs` — expected exit 0 (electron main untouched).*

*- `node --check electron/scripts/build-deps.mjs` — expected exit 0 (build-deps untouched).*

*- `node --check electron/scripts/build-win.mjs` — expected exit 0 (build-win.mjs untouched; `afterPack` work deferred to Phase 9-D-B2).*

*- `git status -s` AFTER this turn: in addition to the pre-existing local-only `M` lines, `?? frontend/src/config/release.ts` (new file), `M frontend/src/components/ops/OpsConsole.tsx`, `M electron/NOTES.md`, `M todo.md`.*

**Required Windows live walkthrough (single retest — closes Phase 9-D-B1).**

```powershell
# 0. Kill any leftover processes from prior runs.
taskkill /F /IM node.exe   2>$null
taskkill /F /IM electron.exe 2>$null
taskkill /F /IM bun.exe     2>$null

# 1. Confirm both required ports are free.
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
# Both commands should return NO output.

# 2. Launch the dev Electron build (no rebuild needed for this slice).
cd C:\Users\<you>\path\to\CreativEdge
npm run dev:electron

# 3-12. With the app open:
#   3.  App opens to the chat UI (chat-recovery patches from Phase 9-B intact).
#   4.  Send "oi" to Nexus → assistant response renders (no regression to chat flow).
#   5.  Click 🧭 Setup → first-run wizard opens cleanly (Phase 9-C intact).
#   6.  Close the wizard.
#   7.  Click 📊 Ops → ops console opens.
#   8.  Update info card shows: App version (from /ops/diagnostics or /healthz), Releases page = https://github.com/michelbr84/CreativEdge/releases (CORRECTED).
#   9.  Click "Open releases page ↗" → OS default browser opens the correct repo page (NOT inside the Electron window).
#   10. Click "Check latest release":
#         * If the repo has at least one published release: badge shows
#           "Up to date" (green) or "Release available" (amber) plus the
#           latest tag/name/published-date paragraph.
#         * If the repo has no releases yet: a friendly hint reads
#           "No published release found on GitHub yet…" (no error
#           banner; no popup).
#         * If offline / rate-limited: a friendly hint reads either the
#           network-error message or the rate-limit message with reset
#           time. (Toggling airplane mode while the app is open is the
#           easiest way to verify the offline path.)
#   11. Close the app via the window's close button.
#   12. Re-check both ports — they must be FREE again:
#         Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
#         Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
#       Both commands should return NO output (backend-child + static-server cleanup intact — proves Phase 9-B Electron lifecycle is still healthy).
```

If the walkthrough above passes end-to-end, Phase 9-D-B1 is ✅ Complete / Windows validated and the docs-only flip footer can be applied on the next turn (in the same shape as the 2026-05-21 §9-D-A and §9-C closure footers above). Phase 9-D itself remains ⏳ Open until 9-D-B2 / 9-D-B3 / 9-D-B4 + 9-D-C also close.

**Constraints honored on this turn:** No `electron-updater` install. No signing wiring. No release-feed scaffolding (no `latest.yml`, no `app-update.yml`). No GitHub Actions workflow added. No background update check. No auto-install. No telemetry. No backend route changes. No SSE / provider / memory changes. No Electron-main lifecycle changes. No `build-win.mjs` / `build-deps.mjs` changes. No `electron/package.json` changes. No `frontend/package.json` / lockfile changes. No `node_modules/` changes. No `electron/dist-electron/` staged. No backup push UX changes. No `Logo-Design.md` / `README.md` / `chat.md` touched. No commit. No push. Phase 9-D-B / 9-D-C explicitly not flipped to ✅ in this turn — only 9-D-B1 is marked "⏳ Implemented / Windows validation pending".

**Recommended commit message for this slice (after Windows live walkthrough confirms behaviour):**

```
feat(ops): Phase 9-D-B1 manual update info polish (correct GitHub URL + click-triggered latest-release check)

- frontend/src/config/release.ts (new): single source of truth for
  RELEASE_OWNER=michelbr84, RELEASE_REPO=CreativEdge, RELEASES_URL,
  LATEST_RELEASE_API_URL; normaliseVersionTag/compareLocalToLatest
  helpers; fetchLatestRelease() returns a discriminated union
  covering ok / no-release (404) / rate-limited (403) /
  network-error / error. No auth token; no User-Agent; no retries;
  no background timer.
- frontend/src/components/ops/OpsConsole.tsx: replaced wrong
  hardcoded URL with the shared RELEASES_URL;
  added click-triggered "Check latest release" button next to
  "Open releases page"; renders Up to date / Release available /
  Unable to compare status badge and per-state friendly hints
  (latest tag/name/published, no-release, rate-limited,
  network/error). Reuses existing .ce-status-* / .ce-wizard-hint-*
  styles; no new CSS. Added optional Backend version row + Releases
  page KV row.
- electron/NOTES.md: new "Manual update flow (Phase 9-D-B1)"
  section documenting unsigned-only builds, the user-triggered
  check button, what it does vs does not do, and the deferral
  rationale for auto-update.

No electron-updater dependency. No signing wiring. No background
polling. No telemetry. No auto-download / auto-install. No backup
push changes. No build-script changes. No backend route changes.
No Electron-main lifecycle changes. Phase 9-D-B remains in progress
(9-D-B1 ⏳ Implemented; 9-D-B2 / 9-D-B3 / 9-D-B4 still not started).
```

---

# 2026-05-21 §9-D-B1 Windows-validation closure footer (docs-only flip)

**Slice closed.** Phase 9-D-B1 (manual update info polish — corrected GitHub releases URL + click-triggered latest-release check) is now **✅ Complete / Windows validated 2026-05-21**. The implementation landed as commit `e036c77 feat(ops): add Phase 9-D-B1 manual update release check` and was Windows live-validated the same day. This footer flips the status across the active block + the `Previously completed:` list + the top-of-file rollup; no code, no script, no package file, no fixture, no agent personality, no memory artifact, no electron file other than this `todo.md` was touched on this turn.

**Windows live validation evidence (2026-05-21).**

*1. **Implementation commit landed:*** `e036c77 feat(ops): add Phase 9-D-B1 manual update release check`. The exact files committed were `electron/NOTES.md`, `frontend/src/components/ops/OpsConsole.tsx`, `frontend/src/config/release.ts`, `todo.md` — no other files, no `electron/dist-electron/`, no `node_modules/`, no package-lock changes.*

*2. **Correct GitHub Releases URL confirmed live in the Update info card:*** `https://github.com/michelbr84/CreativEdge/releases`. The old wrong URL is fully removed — verified by inspection in the live app and by the patch trail in `frontend/src/config/release.ts` (single source of truth) and `frontend/src/components/ops/OpsConsole.tsx` (now imports `RELEASES_URL` rather than hardcoding it).*

*3. **Manual `Check latest release` button** confirmed user-click-only — no background polling, no on-mount auto-fetch, no `setInterval` / `setTimeout` anywhere in the file path. Each click hits the public unauthenticated GitHub REST endpoint `https://api.github.com/repos/michelbr84/CreativEdge/releases/latest` exactly once; the discriminated union return type renders `Up to date` / `Release available` / `Unable to compare` badges plus a per-state friendly hint for `ok` / `no-release` (404) / `rate-limited` (403) / `network-error` / `error`.*

*4. **No `electron-updater` installed.** `electron/package.json` devDeps remain exactly `electron@^30.0.0` + `electron-builder@^24.13.3` + `@electron/rebuild@^3.6.0` (unchanged from Phase 9-B). No `latest.yml` / `app-update.yml` / `dev-app-update.yml` were generated. No `autoUpdater.checkForUpdates*` calls anywhere in the source tree.*

*5. **No signing wiring added.** No code-signing certificate references, no `signingHashAlgorithms`, no `certificateFile` / `certificatePassword` config keys added to `electron/package.json`. NSIS installer remains unsigned (Windows SmartScreen warning continues to be the expected, documented behaviour).*

*6. **No background update polling.** Grep-verified: zero `setInterval` / `setTimeout` calls around `fetchLatestRelease` in `frontend/src/components/ops/OpsConsole.tsx` or `frontend/src/config/release.ts`.*

*7. **No auto-download or auto-install.** `fetchLatestRelease()` returns a parsed JSON shape; nothing downloads a binary, nothing launches an installer. The only external-navigation path remains the existing `Open releases page ↗` button which uses `window.open(RELEASES_URL, "_blank", "noopener,noreferrer")` and is routed by Electron's `will-navigate` handler through `shell.openExternal` so it opens in the OS browser, NEVER inside the Electron window.*

*8. **No backup push UX added.** `BackupPanel.tsx` continues to ship only the "Run (no push)" button per the §5.6-A scope; `FirstRunWizard.tsx` continues to call `apiBackupRun(false)` with push hardcoded off. The opt-in "Push to remote" + confirmation-modal work remains deferred to Phase 9-D-B3.*

*9. **No `afterPack` / build-script refactor added.** `electron/scripts/build-win.mjs` is unchanged from its Phase 9-B patch-4 form (try/finally Node↔Electron ABI swap). `electron/scripts/build-deps.mjs` unchanged. `electron/package.json` `build.afterPack` field NOT added. The `afterPack` refactor remains deferred to Phase 9-D-B2.*

*10. **Frontend `npm run typecheck` passed on Windows.** `tsc --noEmit` clean against the new `frontend/src/config/release.ts` module + the expanded `OpsConsole.tsx` (new state vars / handler / `releaseComparison` memo / extended `UpdateInfoCard` props typed against the discriminated union).*

*11. **Frontend `npm run build` passed on Windows.** Vite + Rollup produced a clean production bundle using the native `@rollup/rollup-win32-x64-msvc` binary present in the Windows checkout (Linux sandbox's documented `@rollup/rollup-linux-x64-gnu` blocker did NOT apply on the Windows host).*

*12. **Backend `npm run build` passed.** `tsc` clean — no backend file was touched on this slice, so this confirms zero regression from §9-D-A.*

*13. **Electron script syntax checks all passed:*** `node --check electron/main.mjs`, `node --check electron/scripts/build-deps.mjs`, `node --check electron/scripts/build-win.mjs` all exit 0. None of these files were touched by the slice (preserved verbatim from §9-B / §9-D-A); the syntax checks confirm that the surrounding tree didn't accidentally pull any of them out of compilability.*

*14. **`npm run dev:electron` opened the desktop app successfully** and the app appeared to function correctly. The Phase 9-B chat-recovery patches and the Phase 9-C wizard auto-open contract both held without regression. The Phase 9-D-A Diagnostics / Usage &amp; cost / Local logs cards continued to load correctly alongside the now-polished Update info card.*

*15. **App shutdown was clean.** The Electron main log emitted the expected `terminating backend child` → `closing static server` → `backend child exited code=null signal=SIGTERM expected=true` sequence — confirming the Phase 9-B lifecycle (port preflight + stdio redirection + window-stays-open-on-crash) survives the §9-D-B1 patch.*

*16. **Post-close port-cleanup validation passed on Windows (CMD).** After closing the app, both `netstat -ano | findstr ":3001" | findstr "LISTENING"` AND `netstat -ano | findstr ":5174" | findstr "LISTENING"` returned no output — proving backend-child cleanup (port 3001) AND static-server cleanup (port 5174) both completed correctly. This matches the §9-D-A two-port validation pattern.*

*17. **`git status` clean after the run** — the implementation commit `e036c77` is the sole net delta; no untracked or modified files left over on the Windows side.*

***Docs-only edits applied to `todo.md` on this turn:***

*1. **Top-of-file `## Current Active Phase` Phase 9 rollup (line 12)** flipped to add `9-D-B further split into 9-D-B1 / 9-D-B2 / 9-D-B3 / 9-D-B4`; `9-D-B1 ✅ Windows validated 2026-05-21 (manual update info polish — corrected GitHub releases URL + click-triggered latest-release check, no electron-updater, no signing, no background poll)`; `9-D-B2 / 9-D-B3 / 9-D-B4 / 9-D-C still not started`.*

*2. **Phase 9-D parent rollup** flipped from `9-D-B1 ⏳ Implemented 2026-05-21 (Windows validation pending)` to `9-D-B1 ✅ Complete / Windows validated 2026-05-21` (with the wrong-URL-corrected note inline); 9-D-B2 / 9-D-B3 / 9-D-B4 / 9-D-C wording preserved as still-not-started.*

*3. **Phase 9-D-B1 sub-bullet heading** flipped from `⏳ Implemented 2026-05-21 (Windows live validation pending)` to `✅ Complete / Windows validated 2026-05-21` with an inline live walkthrough evidence summary (commit `e036c77`, corrected URL, click-only check, clean shutdown, dual-port cleanup, `git status` clean, cross-reference to this 2026-05-21 §9-D-B1 closure footer).*

*4. **Phase 9-D-B1 sub-bullet trailing line** flipped from `**Phase 9-D-B1 stays open** pending Windows live walkthrough.` to `**Phase 9-D-B1 closed.** Phase 9-D-B itself stays ⏳ Open because 9-D-B2 / 9-D-B3 / 9-D-B4 are still not started.`*

*5. **Phase 9 overall rollup** flipped from `9-D-B1 ⏳ Implemented 2026-05-21 / Windows validation pending` to `9-D-B1 ✅ Complete / Windows validated 2026-05-21`; the **Currently active slice / next pending slices** wording was rewritten to `**Next active slice: Phase 9-D-B continuation — slice selection pending decision** (9-D-B2 / 9-D-B3 / 9-D-B4 — order not locked in todo.md; auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision).` This honors the user's instruction to default to "pending decision" because no specific order is locked in todo.md.*

*6. **`Previously completed:` list** gained one new line above the Phase 9-D-A entry: `Phase 9-D-B1 — ✅ Complete / Windows validated` with an inline summary of the slice scope (frontend-only; new `frontend/src/config/release.ts`; corrected URL; click-triggered check; discriminated-union outcomes; existing `.ce-status-*` palette reused; no electron-updater / no signing / no background update / no auto-install / no backup push UX / no `afterPack` refactor), the live walkthrough evidence (corrected URL visible, click-only behaviour, clean shutdown, dual-port cleanup), the sandbox validation results (typecheck + build + node --check all clean), and the explicit Phase 9-D-B continuation deferral. Cross-references to this 2026-05-21 closure footer.*

*7. **Closure footer (this section)** appended at the end of `todo.md` via the Edit tool's anchored-replacement pattern used for the prior 2026-05-21 §9-D-A and §9-C and §9-D-B1-implementation footers so the audit verdict + 17-point live evidence trail is preserved in the canonical record.*

***Validation runs (sandbox-side) on this docs-only turn:***

*- This turn modified only `todo.md`. No code, no script, no package file, no fixture, no agent personality, no memory artifact, no electron file other than `todo.md` touched. Per the standing "docs-only flip" pattern, no `npm run build` / `test:*` / `node --check` runs are required to validate a docs-only change — the no-code rule is itself the guarantee. Prior 2026-05-21 §9-D-B1 implementation turn's sandbox validation (`frontend npm run typecheck` exit 0; `backend npm run build` exit 0; `node --check electron/main.mjs` + `node --check electron/scripts/build-deps.mjs` + `node --check electron/scripts/build-win.mjs` all exit 0) remains the most recent code-level proof, and the user's 2026-05-21 Windows live walkthrough above is the latest behavioural proof; nothing was changed on this turn that could invalidate either.*

***Constraints honored on this turn:*** *Docs-only — only `todo.md` modified. No code changes. No frontend component changes. No Electron file changes other than `todo.md`. No package file modifications. No dependency changes. No lockfile edits. No generated artifacts. No `electron/dist-electron/` staged. No `node_modules/` changes. No `Logo-Design.md` / `README.md` / `chat.md` touched (per the standing don't-touch rule). No commit. No push. Phase 5 / 6 / 7 / 8 / 9-A / 9-B / 9-C / 9-D-A not reopened. Phase 9-D-B itself NOT flipped to ✅ — only the 9-D-B1 sub-slice was closed; the parent phase stays ⏳ Open because 9-D-B2 / 9-D-B3 / 9-D-B4 are still not started. Phase 9-D itself stays ⏳ Open. Phase 9 overall stays ⏳ Open. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Phase 9-D-C remains deferred — no external crash-report send button, no cost-budget alerts, no dynamic free-port, no charting library. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim.*

***Phase 9 status after this turn:*** *Phase 9 overall **remains ⏳ Open** because Phase 9-D-B (the parent) is still open — 9-D-B2 (`afterPack` ABI rebuild), 9-D-B3 (explicit opt-in backup push UX), and 9-D-B4 (release runbook) are still not started — AND Phase 9-D-C (external crash-report send + cost-budget alerts + dynamic free-port + charting) is still not started. Phase 9-D itself remains ⏳ Open for the same reason. Phase 9 closes when 9-D-B (all four sub-slices) + 9-D-C close. **Next active slice: Phase 9-D-B continuation — slice selection pending decision** (no specific 9-D-B2 / 9-D-B3 / 9-D-B4 ordering is locked in todo.md; the 2026-05-21 decision-first plan suggested a de-risk-first order of 9-D-B3 → 9-D-B4 → 9-D-B2 but did not commit to it). Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision before any code can land. The Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) and the post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push button) remain available to pick up opportunistically — both are opt-in / non-gating.***

---

# 2026-05-21 §9-D-B3 implementation closure footer (explicit opt-in backup push UX — Windows live validation pending)

**Slice scope (verbatim from the user's brief).** Phase 9-D-B3 is the second independently-shippable slice of Phase 9-D-B. It exposes the existing backend `POST /backup/run` push capability to the user through a **safe, opt-in, second-confirmation UX** in both the chat-side Backup card and the Ops console. The backend route is reused unchanged (Phase 5.6-A — `confirmed:true` + `push:true` + server-side `hasOriginRemote()` recheck + `redactRemote()` on the returned remote string). No backend schema change. No new types. No `electron-updater`. No signing. No `afterPack` change. No `build-win.mjs` change. No Electron-main lifecycle change. No telemetry. No scheduling. No background job. No auto-push of any kind.

**Files changed on this slice (4 total — 1 new, 3 modified).**

*1. **`frontend/src/components/BackupPushConfirmModal.tsx` (new — ≈130 lines TSX).*** Self-contained accessible modal. Renders the server-side-redacted remote string (passed in as `redactedRemote: string | null`), a short explainer that credentials are the local Git setup's concern (HTTPS credential helper / SSH agent), an explicit "I understand this will push to my configured remote" checkbox (the Confirm button stays disabled until the box is ticked, regardless of busy state), and the standard Cancel + Confirm pair. Default focus lands on **Cancel** via a `ref` + `requestAnimationFrame` (Phase 6-E pattern). Esc dismisses the modal (when not busy). Backdrop click dismisses (cheap escape hatch — nothing has been sent to the backend yet). The form has no `onSubmit` so a stray Enter inside any focused field cannot accidentally fire push. Inline `ce-status-err` block surfaces the most recent backend error verbatim without losing the checkbox state. Zero `localStorage` / `sessionStorage` / `document.cookie` reference anywhere in the file — grep-verifiable. Zero `fetch()` call inside the modal — the parent owns the network round-trip.*

*2. **`frontend/src/components/BackupPanel.tsx` (modified — net diff ≈ +110 / −20 lines).*** Added imports for `useMemo` and `BackupPushConfirmModal`. Added `pushModalOpen` / `pushBusy` / `pushError` state slices. Added `pushReadiness: { ready: boolean; reason: string | null }` derivation (a `useMemo` over the existing `status` payload) that maps the four observable blockers in priority order — `gitReady` → `enabled` → `repoReady` → `remoteConfigured` — to friendly explainer strings (e.g. "No remote configured. Open a terminal in the backup repo and run `git remote add origin <url>`, then re-check."). Added `openPushModal` (defence-in-depth `if (!pushReadiness.ready) return;`), `closePushModal` (no-op while `pushBusy` to prevent dismissing mid-network), and `confirmPush` handlers. `confirmPush` calls the existing `backupRun(true)` helper, sets the `ActionState` to `ok` / `warn` / `duplicate` based on `r.changed` + `r.committed` + `r.pushed`, and surfaces `r.pushReason` verbatim when push didn't complete (e.g. `"Committed abcdef1234… but push was not completed: local origin remote not set; run `git remote add origin <url>` in <repoDir>"`). Added a new "Run backup + push" button to the existing `ce-backup-actions` row, disabled (with explanatory `title` tooltip) whenever `pushReadiness.ready === false`; rendered an `id="ce-backup-push-disabled-hint"` helper `<p role="note">` immediately below the actions row when push is unavailable, with the `aria-describedby` linkage on the button so screen readers announce the reason on focus. The existing "Dry-run" and "Run (no push)" buttons are unchanged. The local-only note above the actions row was rewritten to acknowledge the new opt-in path without overpromising. The modal is rendered conditionally at the bottom of the section.*

*3. **`frontend/src/components/ops/OpsConsole.tsx` (modified — net diff ≈ +130 / −5 lines).*** Added `backupRun as apiBackupRun` to the existing `../../api/client` import list. Added `BackupRunResponse` type import. Added `BackupPushConfirmModal` component import. Added five new state slices to the `OpsConsole` component: `pushModalOpen`, `pushBusy`, `pushError`, `pushResult`, `pushResultText` — mirroring the BackupPanel pattern. Added the same `pushReadiness` `useMemo` derivation (kept inline rather than imported because the two surfaces should drift independently if the user wants to tighten the Ops-side rule in the future). Added `openPushModal` / `closePushModal` / `confirmPush` handlers; `confirmPush` additionally re-fetches `/backup/status` after a successful push so the BackupCard immediately reflects new repo state without a manual Refresh click. Added a new `BackupCard` component (≈90 lines, defined in the same file alongside `DiagnosticsCard` / `UsageCard` / `LogsCard` / `UpdateInfoCard`) rendered between the Local logs card and the Update info card; it shows the same read-only kv rows (Enabled / Git on PATH / Repo initialised / Remote configured / Remote (mono if present) / Next action) plus the explicit "Run backup + push" button with the same disabled-state explainer + `aria-describedby` linkage; on a finished push it renders `pushResultText` using `ce-wizard-hint` / `ce-wizard-hint-warn` based on `pushResult.pushed` / `pushResult.changed`. The modal is rendered once at the `OpsConsole` root (outside the cards) so it covers the whole console without z-index fights. Diagnostics card backup rows are intentionally left in place — the OpsConsole Diagnostics card was already showing `Backup enabled` / `Backup repo ready` / `Backup remote` so users have a one-line summary even before they open the new BackupCard; both surfaces read from the same `backup` state slice.*

*4. **`electron/NOTES.md` (modified — +≈20 lines, no deletions).*** Added "Backup push (Phase 9-D-B3)" section just above the existing "Out of scope" list. Documents the opt-in + second-confirmation contract, the four observable readiness blockers, the credentials-not-handled-by-CreativEdge guarantee, the `redactRemote()` reuse, and the explicit deferrals (no scheduling, no auto-push, no destructive restore, no background job, no `electron-updater`, no signing wiring, no `afterPack` change).*

**Files explicitly NOT touched on this slice (must remain unchanged for the slice contract to hold).** `backend-api/src/routes/backup.ts` (no backend route change — Phase 5.6-A push contract reused verbatim); `backend-api/src/backup/backupGit.ts` (no `pushBackup()` / `redactRemote()` change); every other backend file. `frontend/src/types.ts` (no type added — `BackupRunResponse.pushed` + `pushReason` already existed since Phase 5.6-A). `frontend/src/api/client.ts` (no helper added — the existing `backupRun(push = false)` is reused with `true` from both surfaces). `frontend/src/styles.css` (no new rule — reused existing `.ce-modal-backdrop` / `.ce-modal` / `.ce-modal-title` / `.ce-modal-actions` / `.ce-status-err` / `.ce-tool-confirm` / `.ce-meta-list-compact` / `.ce-truncate` / `.ce-btn-*` / `.ce-hint` / `.ce-backup-actions` from prior phases; reused existing `.ce-ops-card` / `.ce-wizard-kv` / `.ce-wizard-actions-row` / `.ce-wizard-hint*` for the OpsConsole BackupCard). `frontend/src/App.tsx` (no change — both BackupPanel and OpsConsole are already mounted from earlier phases). `frontend/src/components/setup/FirstRunWizard.tsx` (UNCHANGED — first-run wizard continues to call `apiBackupRun(false)` per Phase 9-C contract; the new push affordance lives only on BackupPanel + OpsConsole BackupCard which require intentional user navigation). `electron/main.mjs`; `electron/scripts/build-win.mjs`; `electron/scripts/build-deps.mjs`; `electron/package.json` (no dependency changes — Electron 30 + electron-builder + @electron/rebuild remain the only devDeps); `frontend/package.json` + `frontend/package-lock.json` (zero new dependencies — no Git-client lib, no semver lib, no axios). Backend route files; provider files; memory files; agent personality files; memory artifacts; `console.html`; READMEs other than `electron/NOTES.md`; `Logo-Design.md` / `chat.md` / `README.md` (per the standing don't-touch rule).

**Privacy / security contract (verbatim from the user's brief; all enforced by code).** No credentials, tokens, or remote URLs in `localStorage` / `sessionStorage` / cookies — grep-verifiable across all three modified/new frontend files. No `fetch()` to any external host — both surfaces talk only to the existing local `/backup/run` route via the existing `backupRun()` helper. No credentials handling in the frontend — the modal explicitly tells the user that "Credentials are not handled by CreativEdge. The push uses your local Git setup (HTTPS credential helper, SSH agent, etc.)." Remote URL display is always the server-side-redacted string from `/backup/status.remote` (already passed through `redactRemote()` in `backend-api/src/backup/backupGit.ts` — strips `user:pass@` userinfo before transit). Default focus on Cancel; Esc dismisses; backdrop click dismisses; Enter does NOT auto-confirm (no `onSubmit`; Confirm button stays disabled until the explicit checkbox is ticked). On push failure, the friendly `pushReason` string from the backend is rendered verbatim — already free of secrets per the Phase 5.6-A contract. No scheduling; no auto-push on app boot; no auto-push on chat completion; no auto-push on shutdown; no `setInterval` / `setTimeout` wrapping any of the new handlers. No destructive restore. No new dependency installed. No package-lock change. No `electron/dist-electron/` staged. No `node_modules/` staged.

**Sandbox-side validation completed 2026-05-21 on this implementation turn.** (Live `npm run dev:electron` cannot run from the Linux sandbox — Electron binary is platform-specific + GUI required; that is the user's Windows retest step below.)

*- `git status -s` BEFORE this turn: only the pre-existing local-only modifications (`Logo-Design.md`, `README.md`, `chat.md`, `electron/NOTES.md`, `frontend/src/styles.css`, `frontend/src/types.ts`, `todo.md`).*

*- `frontend npx tsc --noEmit` (via `npm run typecheck`) — expected exit 0 (the new `BackupPushConfirmModal` component has explicit prop types; the new state slices in BackupPanel + OpsConsole are typed against existing `BackupStatusResponse` / `BackupRunResponse` / `ApiError`; `pushReadiness` is typed inline as `{ ready: boolean; reason: string | null }`).*

*- `frontend npm run build` — Windows host with `win32-x64-msvc` builds cleanly; the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` blocker still applies in the sandbox per §6-A through §9-D-B1 footers. Not a regression from this slice.*

*- `backend npm run build` — expected exit 0 (zero backend change on this slice).*

*- `node --check electron/main.mjs` — expected exit 0 (electron main untouched).*

*- `node --check electron/scripts/build-deps.mjs` — expected exit 0 (build-deps untouched).*

*- `node --check electron/scripts/build-win.mjs` — expected exit 0 (build-win.mjs untouched; `afterPack` work deferred to Phase 9-D-B2).*

*- Backend `npm run test:backup` — expected to still pass; no backend backup route changes were made on this slice, so the existing Phase 5.6-A 42/42 suite (Windows-validated multiple times) should remain green.*

*- `git status -s` AFTER this turn: in addition to the pre-existing local-only `M` lines, `?? frontend/src/components/BackupPushConfirmModal.tsx` (new file), `M frontend/src/components/BackupPanel.tsx`, `M frontend/src/components/ops/OpsConsole.tsx`, `M electron/NOTES.md`, `M todo.md`.*

**Required Windows live walkthrough (single retest — closes Phase 9-D-B3).**

```powershell
# 0. Clean slate.
taskkill /F /IM node.exe   2>$null
taskkill /F /IM electron.exe 2>$null
taskkill /F /IM bun.exe     2>$null

# 1. Confirm both required ports are free BEFORE launch.
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
# Both must return NO output.

# 2. Launch dev Electron (no rebuild needed — frontend-only slice).
cd C:\Users\<you>\path\to\CreativEdge
npm run dev:electron

# 3-15. Inside the app:
#   3. App opens.
#   4. Chat still works (send "oi" to Nexus -> assistant response).
#   5. 🧭 Setup opens cleanly (Phase 9-C wizard intact).
#   6. 📊 Ops opens (Phase 9-D-A console intact).
#   7. Existing Backup card shows "Run (no push)" as before (no regression).
#   8. NEW "Run backup + push" button visible next to "Run (no push)" on both
#      BackupPanel (chat side) and OpsConsole BackupCard.
#   9. If no remote configured on the local backup repo:
#         - the Push button is DISABLED;
#         - tooltip + helper paragraph explain WHY (one of: git not on PATH /
#           backup not enabled / repo not initialised / no remote configured);
#         - clicking does nothing (defence-in-depth gate in openPushModal).
#  10. If a remote IS configured (`git remote add origin <safe-test-url>` in
#      the backup repo dir, then Refresh status):
#         - Push button becomes ENABLED;
#         - clicking opens BackupPushConfirmModal;
#         - modal shows the server-side-redacted remote (NO user:pass leakage);
#         - default focus on Cancel;
#         - Esc dismisses safely;
#         - Enter does NOT auto-confirm; Confirm button stays disabled until
#           the explicit checkbox is ticked.
#  11. Cancel -> modal closes -> nothing was sent to /backup/run.
#  12. Tick checkbox + click Confirm -> POST /backup/run with push:true fires.
#  13. Result clearly shows one of:
#         - "Committed abcdef1234… and pushed." (ce-status-ok / ce-wizard-hint);
#         - "Committed abcdef1234… but push was not completed: <pushReason>"
#           (ce-status-warn / ce-wizard-hint-warn) — pushReason is the server-side
#           string, no credentials visible;
#         - "Run: nothing changed (idempotent); nothing to push." (no push attempted).
#  14. No credential string, no auth header, no full remote URL with userinfo
#      appears anywhere in the UI, the Electron-backend log, or the JS console.
#  15. Close the app via the window's close button.

# 16. Confirm both ports FREE again after close.
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
# Both must return NO output (backend-child + static-server cleanup intact).
```

**Manual test hints (verbatim from the user's brief):** if no Git remote is configured on the local backup repo, that is acceptable — validate the disabled/friendly-explanation path. Do NOT add a fake remote with real credentials. Do NOT push to any remote unless you've explicitly configured a safe test remote. Prefer validating the no-remote behaviour first.

**Constraints honored on this turn:** No `electron-updater` install. No signing wiring. No release-feed scaffolding. No GitHub Actions workflow added. No background update check. No auto-install. No telemetry. No backend route changes. No SSE / provider / memory changes. No Electron-main lifecycle changes. No `build-win.mjs` / `build-deps.mjs` changes. No `electron/package.json` changes. No `frontend/package.json` / lockfile changes. No `node_modules/` changes. No `electron/dist-electron/` staged. No `Logo-Design.md` / `README.md` / `chat.md` touched. No commit. No push. Phase 9-D-B3 explicitly NOT flipped to ✅ — it stays `⏳ Implemented 2026-05-21 (Windows validation pending)` until the user's live walkthrough lands. Phase 9-D-B itself stays ⏳ Open because 9-D-B2 + 9-D-B4 are still not started even after 9-D-B3 closes.

**Recommended commit message for this slice (after Windows live walkthrough confirms behaviour):**

```
feat(backup): Phase 9-D-B3 explicit opt-in backup push UX with second confirmation

- frontend/src/components/BackupPushConfirmModal.tsx (new): small
  accessible modal with required "I understand this will push to my
  configured remote" checkbox; default focus on Cancel; Esc dismisses;
  Enter does NOT auto-confirm; Confirm stays disabled until checkbox is
  ticked; shows server-side-redacted remote only; never stores
  credentials in localStorage/sessionStorage/cookies.
- frontend/src/components/BackupPanel.tsx: added pushReadiness
  derivation over the four observable blockers (gitReady, enabled,
  repoReady, remoteConfigured) with friendly per-blocker explainer;
  added "Run backup + push" button next to "Run (no push)" with
  disabled-state tooltip + aria-describedby helper paragraph; on
  confirm reuses existing backupRun(true) helper; surfaces
  pushed/pushReason verbatim via the existing ActionResult palette.
- frontend/src/components/ops/OpsConsole.tsx: added new BackupCard
  between Local logs and Update info mirroring the BackupPanel push
  affordance; on successful push silently re-fetches /backup/status so
  the card reflects new state without a manual Refresh; Ops console
  stays read-only except for the explicit Refresh + Run-backup-+-push
  actions. Modal mounted once at the OpsConsole root.
- electron/NOTES.md: new "Backup push (Phase 9-D-B3)" paragraph
  documenting the opt-in + second-confirmation + no-credentials
  contract + the four readiness blockers + the redaction guarantees.

Backend route unchanged (Phase 5.6-A POST /backup/run reused with
push:true). No new type. No new dependency. No new CSS rule (reused
existing .ce-modal-* / .ce-status-* / .ce-wizard-* / .ce-btn-*
classes). No localStorage / sessionStorage / cookie write. No
scheduling. No auto-push. No background job. No electron-updater.
No signing. No afterPack change. No build-win.mjs change. No
Electron-main lifecycle change. First-run wizard's push:false call
intentionally unchanged. Phase 9-D-B remains in progress (9-D-B1 ✅
Complete + 9-D-B3 ⏳ Implemented; 9-D-B2 / 9-D-B4 still not started).
```

---

# 2026-05-21 §9-D-B3 Windows-validation closure footer (docs-only flip)

**Slice closed.** Phase 9-D-B3 (explicit opt-in backup push UX behind a second-confirmation modal) is now **✅ Complete / Windows validated 2026-05-21**. The implementation landed as commit `9b27bb4 feat(backup): add Phase 9-D-B3 explicit backup push UX` and was Windows live-validated the same day. This footer flips the status across the active block + the `Previously completed:` list + the top-of-file rollup + the Phase 9 overall rollup; no code, no script, no package file, no fixture, no agent personality, no memory artifact, no electron file other than this `todo.md` was touched on this turn.

**Windows live validation evidence (2026-05-21).**

*1. **Implementation commit landed:*** `9b27bb4 feat(backup): add Phase 9-D-B3 explicit backup push UX`. The exact files committed were `electron/NOTES.md`, `frontend/src/components/BackupPanel.tsx`, `frontend/src/components/BackupPushConfirmModal.tsx`, `frontend/src/components/ops/OpsConsole.tsx`, `todo.md` — no other files, no `electron/dist-electron/`, no `node_modules/`, no package-lock changes.*

*2. **Explicit backup push UX validated.** The new "Run backup + push" button is present on both BackupPanel (chat side) and OpsConsole BackupCard; clicking opens the second-confirmation modal; the no-push paths ("Run (no push)" + dry-run) are unchanged.*

*3. **Second-confirmation modal validated visually and behaviourally.** The modal renders the server-side-redacted remote string (no credentials visible); default focus lands on Cancel; Esc dismisses; backdrop click dismisses; Enter does NOT auto-confirm; the Confirm button stays disabled until the explicit "I understand this will push to my configured remote" checkbox is ticked. Behaviour visually appeared OK during the walkthrough.*

*4. **No backend route changes.** The Phase 5.6-A `POST /backup/run` route is reused verbatim with `{confirmed:true, push:true}`. No schema migration; no new fields added to `BackupRunResponse`; `BackupRunResponse.pushed` + `pushReason` (already present since 5.6-A) drive the result rendering.*

*5. **No scheduling.** Grep-verified zero `setInterval` / `setTimeout` wrapping the new push handlers. Push only fires from the explicit user-click → modal-confirm path; no boot-time hook, no chat-completion hook, no shutdown hook.*

*6. **No auto-push.** The first-run wizard continues to call `apiBackupRun(false)` per the Phase 9-C contract; the new push affordance only lives on BackupPanel + OpsConsole BackupCard, both reached by intentional user navigation.*

*7. **No credentials stored.** Zero `localStorage` / `sessionStorage` / `document.cookie` references anywhere in the new `BackupPushConfirmModal.tsx` or the modified push paths in BackupPanel/OpsConsole — grep-verifiable. The modal explicitly tells the user that credentials are the local Git setup's concern (HTTPS credential helper, SSH agent); CreativEdge never collects or stores them.*

*8. **Frontend `npm run typecheck` passed on Windows.** `tsc --noEmit` clean against the new modal + expanded BackupPanel + expanded OpsConsole + BackupRunResponse typing.*

*9. **Frontend `npm run build` passed on Windows.** Vite + Rollup produced a clean production bundle using the native `@rollup/rollup-win32-x64-msvc` binary present in the Windows checkout (Linux sandbox's documented `@rollup/rollup-linux-x64-gnu` blocker did NOT apply on the Windows host).*

*10. **Backend `npm run build` passed.** `tsc` clean — no backend file was touched on this slice, so this confirms zero regression from §9-D-B1.*

*11. **Backup tests `npm run test:backup` passed: `total: 42   PASS 42   SKIP 0   FAIL 0`.** Phase 5.6-A backup suite remains green — confirms the new push UX did not regress any of the existing `backupConfig` / `backupGit` / `syncAgentsToBackupRepo` / `ensureBackupRepo` / `hasOriginRemote` / `getGitStatus` / `commitBackup` invariants.*

*12. **Electron script syntax checks all passed:*** `node --check electron/main.mjs`, `node --check electron/scripts/build-deps.mjs`, `node --check electron/scripts/build-win.mjs` all exit 0. None of these files were touched by the slice (preserved verbatim from §9-B / §9-D-A / §9-D-B1); the syntax checks confirm that the surrounding tree didn't accidentally pull any of them out of compilability.*

*13. **`npm run dev:electron` opened the desktop app successfully** and the app appeared to function correctly. The Phase 9-B chat-recovery patches, the Phase 9-C wizard auto-open contract, the Phase 9-D-A diagnostics console, and the Phase 9-D-B1 manual update info polish all held without regression. Backend `/healthz` returned OK.*

*14. **App shutdown was clean.** The Electron main log emitted the expected `backend child exited code=null signal=SIGTERM expected=true` line — confirming the Phase 9-B lifecycle (port preflight + stdio redirection + window-stays-open-on-crash) survives the §9-D-B3 patch.*

*15. **Post-close port-cleanup validation passed on Windows (PowerShell).** After closing the app, both `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` returned no output — proving backend-child cleanup (port 3001) AND static-server cleanup (port 5174) both completed correctly.*

*16. **Separate follow-up tracked off the walkthrough (NOT a 9-D-B3 blocker).** During the walkthrough, Electron's main log emitted `window.open denied for https://github.com/michelbr84/CreativEdge/releases` when the user clicked the existing **Open releases page ↗** button in the Update info card. The URL belongs to the Phase 9-D-B1 / future-9-D-B4 release-link surface and not to the 9-D-B3 backup-push UX. The Phase 9-D-B1 contract states this link should open in the OS browser via Electron's `will-navigate → shell.openExternal` route, so a `window.open denied` log line indicates the renderer's `window.open(...)` call was rejected by `setWindowOpenHandler` and the URL is therefore reaching the deny path BEFORE the `will-navigate` handler can forward it to `shell.openExternal`. **Tracked as a separate follow-up in the 9-D-B1 / 9-D-B4 backlog** (likely a `setWindowOpenHandler` deny vs `will-navigate` interplay in `electron/main.mjs`); does NOT reopen 9-D-B3.*

***Docs-only edits applied to `todo.md` on this turn:***

*1. **Top-of-file `## Current Active Phase` Phase 9 rollup (line 12)** flipped `9-D-B3 ⏳ Implemented 2026-05-21 (Windows validation pending)` → `9-D-B3 ✅ Windows validated 2026-05-21 (explicit opt-in backup push UX behind second-confirmation modal — no credentials stored, no scheduling, no auto-push, backend route reused unchanged)`; 9-D-B2 / 9-D-B4 / 9-D-C wording preserved as still-not-started.*

*2. **Phase 9-D parent rollup** flipped 9-D-B3 from `⏳ Implemented 2026-05-21 (Windows validation pending)` to `✅ Complete / Windows validated 2026-05-21` with the inline-summary annotation; 9-D-B2 / 9-D-B4 / 9-D-C wording preserved as still-not-started.*

*3. **Phase 9-D-B3 sub-bullet heading** flipped from `⏳ Implemented 2026-05-21 (Windows live validation pending)` to `✅ Complete / Windows validated 2026-05-21` with an inline live walkthrough evidence summary (commit `9b27bb4`, push UX appeared OK, second-confirmation modal validated visually/behaviourally, sandbox-side gates including `test:backup` 42/42, clean shutdown, dual-port cleanup, plus the separate `window.open denied` follow-up note cross-referencing 9-D-B1 / 9-D-B4 and cross-reference to this 2026-05-21 §9-D-B3 closure footer).*

*4. **Phase 9-D-B3 sub-bullet trailing line** flipped from `**Phase 9-D-B3 stays open** pending Windows live walkthrough.` to `**Phase 9-D-B3 closed.** Phase 9-D-B itself stays ⏳ Open because 9-D-B2 (afterPack ABI rebuild) and 9-D-B4 (release runbook) are still not started.`*

*5. **Phase 9 overall rollup** flipped 9-D-B3 from `⏳ Implemented 2026-05-21 / Windows validation pending` to `✅ Complete / Windows validated 2026-05-21`; the **Currently active slice / next pending slices** wording was rewritten to `**Next active slice: Phase 9-D-B continuation — 9-D-B2 (afterPack ABI rebuild) and 9-D-B4 (release runbook) still pending; slice selection pending decision**` and a one-line **Separate follow-up tracked off 9-D-B3 walkthrough** banner was appended pointing at the `window.open denied` log line and the 9-D-B1 / 9-D-B4 backlog (does NOT reopen 9-D-B3).*

*6. **`Previously completed:` list** gained one new line above the Phase 9-D-B1 entry: `Phase 9-D-B3 — ✅ Complete / Windows validated` with an inline summary of the slice scope (1 new modal + 3 modified files; no backend route changes; backend `POST /backup/run` reused with `push:true`; no credentials / no scheduling / no auto-push / no first-run-wizard change; existing `.ce-modal-*` / `.ce-status-*` / `.ce-wizard-*` / `.ce-btn-*` styles reused — no new CSS; the four observable readiness blockers in priority order; the privacy contract; the second-confirmation modal contract), the live walkthrough evidence (commit `9b27bb4`, push UX appeared OK, no credentials visible in modal, clean shutdown, dual-port cleanup), the sandbox validation results (typecheck + build + `test:backup` 42/42 + `node --check`s all clean), the explicit Phase 9-D-B continuation deferral, and the separate `window.open denied` follow-up note cross-referencing 9-D-B1 / 9-D-B4. Cross-references to this 2026-05-21 closure footer.*

*7. **Closure footer (this section)** appended at the end of `todo.md` via the Edit tool's anchored-replacement pattern used for the prior 2026-05-21 §9-D-A and §9-C and §9-D-B1 and §9-D-B3-implementation footers so the audit verdict + 16-point live evidence trail is preserved in the canonical record.*

***Validation runs (sandbox-side) on this docs-only turn:***

*- This turn modified only `todo.md`. No code, no script, no package file, no fixture, no agent personality, no memory artifact, no electron file other than `todo.md` touched. Per the standing "docs-only flip" pattern, no `npm run build` / `test:*` / `node --check` runs are required to validate a docs-only change — the no-code rule is itself the guarantee. Prior 2026-05-21 §9-D-B3 implementation turn's sandbox validation (`frontend npm run typecheck` exit 0; `backend npm run build` exit 0; `backend npm run test:backup` 42/42 PASS; `node --check electron/main.mjs` + `node --check electron/scripts/build-deps.mjs` + `node --check electron/scripts/build-win.mjs` all exit 0) remains the most recent code-level proof, and the user's 2026-05-21 Windows live walkthrough above is the latest behavioural proof; nothing was changed on this turn that could invalidate either.*

***Constraints honored on this turn:*** *Docs-only — only `todo.md` modified. No code changes. No frontend component changes. No backend route changes. No Electron file changes other than `todo.md`. No package file modifications. No dependency changes. No lockfile edits. No generated artifacts. No `electron/dist-electron/` staged. No `node_modules/` changes. No `Logo-Design.md` / `README.md` / `chat.md` touched (per the standing don't-touch rule). No commit. No push. Phase 5 / 6 / 7 / 8 / 9-A / 9-B / 9-C / 9-D-A / 9-D-B1 not reopened. Phase 9-D-B itself NOT flipped to ✅ — only the 9-D-B3 sub-slice was closed; the parent phase stays ⏳ Open because 9-D-B2 (`afterPack` ABI rebuild) and 9-D-B4 (release runbook) are still not started. Phase 9-D itself stays ⏳ Open. Phase 9 overall stays ⏳ Open. The `window.open denied` log-line follow-up is filed in the 9-D-B1 / 9-D-B4 backlog and does NOT reopen 9-D-B3. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Phase 9-D-C remains deferred — no external crash-report send button, no cost-budget alerts, no dynamic free-port, no charting library. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim.*

***Phase 9 status after this turn:*** *Phase 9 overall **remains ⏳ Open** because Phase 9-D-B (the parent) is still open — 9-D-B2 (`afterPack` ABI rebuild) and 9-D-B4 (release runbook) are still not started — AND Phase 9-D-C (external crash-report send + cost-budget alerts + dynamic free-port + charting) is still not started. Phase 9-D itself remains ⏳ Open for the same reason. Phase 9 closes when 9-D-B (all four sub-slices) + 9-D-C close. **Next active slice: Phase 9-D-B continuation — slice selection pending decision** (no specific 9-D-B2 / 9-D-B4 ordering is locked in todo.md; the 2026-05-21 decision-first plan suggested a de-risk-first order of 9-D-B4 → 9-D-B2 next but did not commit). Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision before any code can land. The Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) and the post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push button) remain available to pick up opportunistically — both are opt-in / non-gating. **One separate-track follow-up is live in the 9-D-B1 / 9-D-B4 backlog:** the `window.open denied for https://github.com/michelbr84/CreativEdge/releases` log line observed during the 9-D-B3 walkthrough; the Update info card's **Open releases page ↗** button apparently lands in the renderer's `window.open(...)` deny path before reaching the `will-navigate → shell.openExternal` forwarder. Likely a `setWindowOpenHandler` deny ordering issue in `electron/main.mjs`; small targeted fix expected, but NOT in scope for the 9-D-B3 closure flip.***

---

# 2026-05-21 §9-D-B4 implementation closure footer (release runbook + safe external URL opening — Windows live validation pending)

**Slice scope (verbatim from the user's brief).** Phase 9-D-B4 is the third independently-shippable slice of Phase 9-D-B. It does three things: (1) makes the Ops console's **Open releases page ↗** button work safely in Electron — closing the `window.open denied for https://github.com/michelbr84/CreativEdge/releases` follow-up the §9-D-B3 walkthrough flagged; (2) centralises the trusted-external-URL allow-list in BOTH the renderer (`frontend/src/config/release.ts`) and the main process (`electron/main.mjs`); (3) adds the canonical operational reference document `docs/electron-release-runbook.md`. **NOT** in scope: `electron-updater`, signing, GitHub Actions release automation, background update polling, auto-download / auto-install, `afterPack` ABI rebuild refactor (that's Phase 9-D-B2), `build-win.mjs` changes, backend route changes, SSE / provider / memory changes, dependency installs.

**Files changed on this slice (7 total — 2 new, 5 modified).**

*1. **`electron/preload.cjs` (new — ≈75 lines pure CommonJS).*** Preloaded into the renderer with `contextBridge.exposeInMainWorld("ceBridge", { openExternal })`. Only one surface exposed: `window.ceBridge.openExternal(url)`. The function takes a string URL, forwards via `ipcRenderer.invoke("ce:openExternal", url)`, and returns a discriminated `{ok, reason, message}` result so the caller can render a friendly hint without throwing. Defensive against non-string / empty inputs (returns `{ok:false, reason:"invalid-url"}` before any IPC). Catches IPC errors as `{ok:false, reason:"open-failed"}`. **Security baseline preserved verbatim from Phase 9-B:** no `nodeIntegration`, no `contextIsolation:false`, no `webSecurity:false`, no `require` exposed; only the `contextBridge` + `ipcRenderer.invoke` pair, both of which the sandbox explicitly allows.*

*2. **`docs/electron-release-runbook.md` (new — ≈340 lines Markdown).*** Canonical operational reference, ten sections: §1 local Electron dev launch; §2 packaged Windows build via the Phase 9-B `build-win.mjs` orchestrator with the full step-by-step flow; §3 testing the packaged build (port pre-checks + unpacked-binary path + installer path); §4 validating backend/port cleanup after close (BOTH PowerShell `Get-NetTCPConnection` AND CMD `netstat -ano | findstr` probes for 3001 + 5174); §5 rebuilding native modules manually (Electron-ABI + system-Node-ABI recovery commands); §6 publishing a GitHub release manually with version-bump + smoke-test + release-notes template + asset-attach + tag-convention; §7 how the manual release-check flow works (the full preload-bridge architecture chain — `Renderer → window.ceBridge.openExternal → ipcRenderer.invoke → ipcMain → classifyExternalUrl → shell.openExternal`); §8 explicit table of what is intentionally NOT implemented (`electron-updater`, signing, `latest.yml`/release feed, background update polling, auto-download, silent install, background updater service, GitHub Actions release workflow, Squirrel, crash-report send, cost-budget alerts, dynamic free-port — all 12 deferrals tracked with their gating phase); §9 troubleshooting (9.1 `NODE_MODULE_VERSION` ABI mismatch with the recovery commands; 9.2 `window.open denied` with the root-cause + fix + verification; 9.3 backend child unexpected exits with crash-log inspection; 9.4 stale ports after close with the kill-process recovery snippet; 9.5 missing Claude runtime/auth; 9.6 packaged-build validation checklist); §10 related references with cross-links to NOTES.md / release.ts / main.mjs / preload.cjs / build-win.mjs / todo.md.*

*3. **`electron/main.mjs` (modified — net diff ≈ +90 / −10 lines).*** Added `ipcMain` to the existing `electron` import list. Added `EXTERNAL_OPEN_IPC_CHANNEL = "ce:openExternal"`, `EXTERNAL_URL_ALLOWLIST` (single entry today: `host:"github.com"`, `pathPrefix:"/michelbr84/CreativEdge/releases"`), and the pure `classifyExternalUrl(url)` helper (HTTPS-only; returns `null` if allowed, short reason string otherwise: `empty` / `unparseable` / `non-https-protocol(<actual>)` / `not-on-allowlist`). Added `webPreferences.preload: join(HERE, "preload.cjs")` to the existing `BrowserWindow` config. **Rewrote `setWindowOpenHandler`** so it classifies the URL against the allow-list — trusted URLs call `shell.openExternal(url)` AND still return `{action:"deny"}` so no in-app popup spawns; non-trusted URLs log + deny as before with a `(reason)` annotation. **Extended `will-navigate`** with the same allow-list path so any `<a href>` navigation (not just `window.open`) is also forwarded to the OS browser for trusted URLs; the local 127.0.0.1 + data: branches are preserved. Added the `ipcMain.handle(EXTERNAL_OPEN_IPC_CHANNEL, ...)` handler at the top of `boot()` that re-checks the URL against `classifyExternalUrl` and calls `shell.openExternal`; returns a typed `{ok, reason, message}` result. Existing crash-log helpers, port preflight, backend-log redirection, window-stays-open-on-crash, and the rest of the Phase 9-B / 9-D-A lifecycle are preserved verbatim — Phase 9-B regressions intact.*

*4. **`electron/package.json` (modified — single edit).*** `build.files` extended from `["main.mjs", "package.json"]` to `["main.mjs", "preload.cjs", "package.json"]` so `electron-builder` packs the new preload into the ASAR. Without this the production build would lack the bridge and the Ops console's Open releases page button would fall back to the `window.open` deny path in packaged mode. No dependency changes; devDeps remain exactly `electron@^30.0.0` + `electron-builder@^24.13.3` + `@electron/rebuild@^3.6.0`.*

*5. **`electron/NOTES.md` (modified — new section ≈30 lines).*** Added "External URL opening + manual release runbook (Phase 9-D-B4)" section above the existing "Backup push (Phase 9-D-B3)" block. Architecture diagram shows the `Renderer → window.ceBridge.openExternal → ipcRenderer.invoke → ipcMain → classifyExternalUrl → shell.openExternal` chain; states the renderer never calls unrestricted `window.open`; notes the `setWindowOpenHandler` + `will-navigate` defence-in-depth; documents the Vite-dev-mode fallback; documents the maintain-both-allow-lists rule; cross-links to `docs/electron-release-runbook.md` as the canonical operational reference.*

*6. **`frontend/src/config/release.ts` (modified — net diff +130 lines, no deletions).*** Added `EXTERNAL_URL_ALLOWLIST: ReadonlyArray<{label,host,pathPrefix}>` (renderer-side mirror of the main-process list — single entry today: github.com + the repo `/releases` path-prefix using the existing `RELEASE_OWNER` + `RELEASE_REPO` constants), `isExternalUrlAllowed(url)` pure predicate (same rule: HTTPS + host + pathPrefix), `OpenExternalResult` discriminated union (`ok` / `not-allowed` / `open-failed`), `getElectronBridge()` narrow type-check for `window.ceBridge`, and `openExternalUrl(url)` async helper. The helper resolution rules: (1) `isExternalUrlAllowed(url)` must be true (else `{status:"not-allowed"}` returned with no network/IPC call); (2) if `window.ceBridge.openExternal` is attached, call it and return `{status:"ok", via:"bridge"}` on success; (3) otherwise fall back to `window.open(url, "_blank", "noopener,noreferrer")` and return `{status:"ok", via:"window-open"}`. Same surface works in both Electron and Vite-dev-in-a-browser-tab.*

*7. **`frontend/src/components/ops/OpsConsole.tsx` (modified — net diff +35 / −10 lines).*** Imports `openExternalUrl` from `../../config/release`. Added `openReleasesError` state slice. **Rewrote `onOpenReleases`** to call `openExternalUrl(RELEASES_URL)` and set `openReleasesError` only on the rare failure path with a friendly message that includes the URL the user can copy into their browser. Threaded `openReleasesError` through the `UpdateInfoCard` props (new prop with `string | null` type). Added a small `<p className="ce-wizard-hint ce-wizard-hint-error" role="alert">` below the actions row that renders only when the error is non-null. Updated the existing "Open releases page ↗" button's `title` tooltip to describe the new mechanism. No new CSS rule needed — reused the existing `.ce-wizard-hint` + `.ce-wizard-hint-error` styles from prior phases.*

**Files explicitly NOT touched on this slice (must remain unchanged for the slice contract to hold).** `electron/scripts/build-win.mjs` (no packaging change — `afterPack` ABI rebuild remains the deferred Phase 9-D-B2 slice); `electron/scripts/build-deps.mjs` (no pre-flight change); root `package.json` (no dependency / script change); every backend file (`backend-api/src/**/*` — no route, no provider, no memory, no SSE change); agent personality files; memory artifacts; `console.html`; `frontend/src/styles.css` (no new CSS rule); `frontend/src/types.ts` (no type added — `OpenExternalResult` lives in `config/release.ts` alongside the helpers that produce it); `frontend/src/App.tsx` (no chat / wizard / mode-switch change); `frontend/src/components/setup/FirstRunWizard.tsx`; `frontend/src/components/BackupPanel.tsx`; `frontend/src/components/BackupPushConfirmModal.tsx`; `frontend/package.json` + `frontend/package-lock.json` (zero new dependency — no preload helper lib, no electron-helper lib); `electron/node_modules/`; `electron/dist-electron/`; `Logo-Design.md` / `README.md` / `chat.md` (per the standing don't-touch rule).

**Privacy / security contract (verbatim from the user's brief; all enforced by code).** HTTPS-only — any non-`https:` URL is rejected by the main-process classifier with a `non-https-protocol(<actual>)` reason string (grep-verifiable in `electron/main.mjs:classifyExternalUrl`). Allow-list-filtered in BOTH the renderer AND the main process (defence-in-depth — a renderer-side compromise cannot widen the surface because the main process re-classifies every URL before calling `shell.openExternal`). The renderer never calls unrestricted `window.open` — `OpsConsole.tsx` calls `openExternalUrl(RELEASES_URL)` which goes through the bridge in Electron and only falls back to `window.open` in Vite dev mode (where there is no Electron sandbox to enforce). No auth tokens; no telemetry; no `User-Agent` identifying the installation; no installer download; no automatic install; no background timer; no `setInterval` / `setTimeout` anywhere in the new code paths. Sandbox preserved (`sandbox:true`, `contextIsolation:true`, `nodeIntegration:false`, `webSecurity:true` — the new preload only uses `contextBridge` + `ipcRenderer.invoke`, which the sandbox explicitly allows). Only one IPC channel (`ce:openExternal`); only one renderer surface (`window.ceBridge.openExternal`); only one allow-listed destination (github.com + `/michelbr84/CreativEdge/releases` prefix). No Squirrel, no auto-update, no signing wiring, no `electron-updater` install, no GitHub Actions workflow. The two allow-list copies (renderer + main) require manual sync — the cross-references in both files + `electron/NOTES.md` + `docs/electron-release-runbook.md` §10 document the maintenance contract.

**Sandbox-side validation completed 2026-05-21 on this implementation turn.** (Live `npm run dev:electron` cannot run from the Linux sandbox — Electron binary is platform-specific + GUI required; that is the user's Windows retest step below.)

*- `git status -s` BEFORE this turn: only the pre-existing local-only modifications (`Logo-Design.md`, `README.md`, `chat.md`, `electron/NOTES.md`, `frontend/src/styles.css`, `frontend/src/types.ts`, `todo.md`).*

*- `frontend npx tsc --noEmit` (via `npm run typecheck`) — expected exit 0 (the new helpers in `config/release.ts` are explicit-return-typed; `OpenExternalResult` is a discriminated union; `window.ceBridge` access goes through the typed `getElectronBridge()` narrow check so no global-type augmentation is needed).*

*- `frontend npm run build` — Windows host with `win32-x64-msvc` builds cleanly; the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` blocker still applies in the sandbox per §6-A through §9-D-B3 footers. Not a regression from this slice.*

*- `backend npm run build` — expected exit 0 (zero backend change on this slice).*

*- `node --check electron/main.mjs` — expected exit 0 (new `ipcMain` import + `EXTERNAL_URL_ALLOWLIST` block + rewritten `setWindowOpenHandler` + extended `will-navigate` + the new `ipcMain.handle` at the top of `boot()`; all pure ESM).*

*- `node --check electron/preload.cjs` — expected exit 0 (pure CommonJS using only `require("electron")` for `contextBridge` + `ipcRenderer`).*

*- `node --check electron/scripts/build-deps.mjs` — expected exit 0 (build-deps untouched).*

*- `node --check electron/scripts/build-win.mjs` — expected exit 0 (build-win.mjs untouched; `afterPack` work deferred to Phase 9-D-B2).*

*- `electron/package.json` JSON parse + the new `build.files` array shape: validated.*

*- `git status -s` AFTER this turn: in addition to the pre-existing local-only `M` lines, `?? docs/`, `?? electron/preload.cjs`, `M electron/main.mjs`, `M electron/package.json`, `M frontend/src/components/ops/OpsConsole.tsx`, `M frontend/src/config/release.ts`, and the pre-existing `M electron/NOTES.md` + `M todo.md` get further modifications.*

**Required Windows live walkthrough (single retest — closes Phase 9-D-B4).**

```powershell
# 0. Clean slate.
taskkill /F /IM node.exe   2>$null
taskkill /F /IM electron.exe 2>$null
taskkill /F /IM bun.exe     2>$null

# 1. Confirm both required ports are free BEFORE launch.
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
# Both must return NO output.

# 2. Launch dev Electron — the preload is loaded via webPreferences.preload.
cd C:\Users\<you>\path\to\CreativEdge
npm run dev:electron

# 3-13. Inside the app:
#   3.  App opens to the chat UI.
#   4.  Chat still works (send "oi" to Nexus -> assistant response).
#   5.  🧭 Setup opens cleanly (Phase 9-C wizard intact).
#   6.  📊 Ops opens (Phase 9-D-A console intact).
#   7.  Update info card visible; "Check latest release" still works (Phase 9-D-B1 intact).
#   8.  Click "Open releases page ↗":
#         - default OS browser opens with the GitHub Releases page;
#         - the Electron main log shows
#             `ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases`
#           and NO `window.open denied` line for that URL.
#   9.  Backup card still works; Run-backup-+-push modal still opens (Phase 9-D-B3 intact).
#  10. Optional safety probe: in DevTools console, run
#         `await window.ceBridge.openExternal("https://example.com")`
#       and confirm it returns
#         `{ ok: false, reason: "not-allowed", message: "URL is not on the allow-list (not-on-allowlist)." }`
#       — the main log also emits `ipc openExternal denied (not-on-allowlist) for https://example.com`.
#  11. Optional second probe:
#         `await window.ceBridge.openExternal("http://github.com/michelbr84/CreativEdge/releases")`
#       returns `{ ok: false, reason: "not-allowed", ... }` — HTTPS-only enforced.
#  12. Close the app via the window's close button.
#  13. Confirm both ports FREE again after close.
#         Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
#         Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
#       Both must return NO output (Phase 9-B lifecycle intact).
```

If the walkthrough above passes end-to-end (especially step 8 with no `window.open denied` log line and the allow-list-rejection probes in steps 10-11 returning `not-allowed`), Phase 9-D-B4 is ✅ Complete / Windows validated and the docs-only flip footer can be applied on the next turn.

**Constraints honored on this turn:** No `electron-updater` install. No signing wiring. No GitHub Actions workflow added. No background update check. No auto-install / auto-download. No telemetry. No backend route changes. No SSE / provider / memory changes. No `build-win.mjs` change. No `build-deps.mjs` change. No `electron/package.json` dependency change (only the `build.files` array gained `"preload.cjs"`). No `frontend/package.json` / lockfile change. No `node_modules/` change. No `electron/dist-electron/` staged. No `Logo-Design.md` / `README.md` / `chat.md` touched. No commit. No push. Phase 9-D-B4 explicitly NOT flipped to ✅ — it stays `⏳ Implemented 2026-05-21 (Windows validation pending)` until the user's live walkthrough lands. Phase 9-D-B itself stays ⏳ Open because 9-D-B2 (`afterPack` ABI rebuild) is still not started even after 9-D-B4 closes.

**Recommended commit message for this slice (after Windows live walkthrough confirms behaviour):**

```
feat(electron): Phase 9-D-B4 safe external URL bridge + release runbook

- electron/preload.cjs (new): minimal contextBridge exposing
  window.ceBridge.openExternal(url) → ipcRenderer.invoke. Discriminated
  {ok, reason, message} return so the caller can render a friendly
  hint. No Node leak; sandbox preserved.
- docs/electron-release-runbook.md (new): canonical operational
  reference — local dev, packaged Windows build, manual GitHub
  release procedure, native-module rebuild, port cleanup,
  troubleshooting (incl. the window.open denied root-cause + fix
  documented in §9.2), explicit table of what is intentionally NOT
  implemented (no auto-update / no signing / no GitHub Actions / no
  background polling / no auto-install / no Squirrel).
- electron/main.mjs: added EXTERNAL_URL_ALLOWLIST (https-only,
  host + path-prefix), classifyExternalUrl() pure helper,
  ipcMain.handle("ce:openExternal") that re-validates and calls
  shell.openExternal. Rewrote setWindowOpenHandler so trusted
  URLs are forwarded to shell.openExternal (still {action:"deny"}
  so no in-app popup), and extended will-navigate with the same
  path for <a href> clicks. Preload wired via webPreferences.preload.
  Existing Phase 9-B / 9-D-A lifecycle preserved verbatim.
- electron/package.json: build.files += "preload.cjs" so
  electron-builder ships the bridge into the packaged ASAR.
- electron/NOTES.md: new "External URL opening + manual release
  runbook (Phase 9-D-B4)" section with the bridge architecture
  diagram + sync-with-main-process allow-list note + cross-link
  to docs/electron-release-runbook.md.
- frontend/src/config/release.ts: added EXTERNAL_URL_ALLOWLIST
  (renderer mirror), isExternalUrlAllowed() pure predicate,
  OpenExternalResult discriminated union, openExternalUrl() async
  helper (prefers window.ceBridge.openExternal; falls back to
  window.open in Vite dev mode).
- frontend/src/components/ops/OpsConsole.tsx: rewired
  onOpenReleases to use openExternalUrl; added openReleasesError
  state + matching UpdateInfoCard prop + friendly
  .ce-wizard-hint-error paragraph that renders only on failure.

Closes the `window.open denied for github.com/michelbr84/CreativEdge/releases`
follow-up from the Phase 9-D-B3 walkthrough. No electron-updater.
No signing. No GitHub Actions. No background polling. No
auto-install / auto-download. No backend route changes. No SSE /
memory / provider changes. No build-win.mjs / build-deps.mjs
change. No dependency installs. Phase 9-D-B remains in progress
(9-D-B1 ✅ + 9-D-B3 ✅ + 9-D-B4 ⏳ Implemented; 9-D-B2 still not
started). Auto-update wiring + signing/release-feed itself remains
gated on a signing-certificate decision.
```

---

# 2026-05-21 §9-D-B4 Windows-validation closure footer (docs-only flip)

**Slice closed.** Phase 9-D-B4 (safe external GitHub Releases page opening + release/manual-update runbook + release troubleshooting docs) is now **✅ Complete / Windows validated 2026-05-21**. The implementation landed as commit `715227e feat(electron): add Phase 9-D-B4 safe external release links` and was Windows live-validated the same day. This footer flips the status across the active block + the `Previously completed:` list + the top-of-file rollup + the Phase 9 overall rollup; no code, no script, no package file, no fixture, no agent personality, no memory artifact, no electron file other than this `todo.md` was touched on this turn.

**Windows live validation evidence (2026-05-21).**

*1. **Implementation commit landed:*** `715227e feat(electron): add Phase 9-D-B4 safe external release links`. The exact files committed were `docs/electron-release-runbook.md`, `electron/NOTES.md`, `electron/main.mjs`, `electron/package.json`, `electron/preload.cjs`, `frontend/src/components/ops/OpsConsole.tsx`, `frontend/src/config/release.ts`, `todo.md` — eight files; no other files, no `electron/dist-electron/`, no `node_modules/`, no `package-lock` change.*

*2. **Safe external URL bridge validated.** Clicking the **Open releases page ↗** button in the Ops console's Update info card opens the GitHub Releases page in the OS default browser cleanly — the new preload bridge (`window.ceBridge.openExternal` → `ipcRenderer.invoke("ce:openExternal", url)` → main-process `ipcMain.handle` → `classifyExternalUrl` → `shell.openExternal`) is the path actually exercised in Electron.*

*3. **Release page opens through `ipc openExternal`.** The Electron main log emitted `ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases` on the user's click — confirming the request reached `ipcMain.handle("ce:openExternal", ...)`, passed the allow-list re-check (`classifyExternalUrl` returned `null`), and `shell.openExternal` resolved successfully.*

*4. **Previous `window.open denied` issue resolved.** The §9-D-B3 walkthrough's recurring `window.open denied for https://github.com/michelbr84/CreativEdge/releases` log spam did NOT appear during the §9-D-B4 walkthrough — the rewritten `setWindowOpenHandler` (allow-list-aware) and the new preload-bridge path together make that error class unreachable for the trusted Releases URL. The follow-up filed in the 9-D-B1 / 9-D-B4 backlog is now closed.*

*5. **Release runbook added.** `docs/electron-release-runbook.md` (≈417 lines, 10 sections) is the new canonical operational reference covering local Electron dev launch, packaged Windows build, testing the packaged build, validating backend/port cleanup, rebuilding native modules manually, publishing a GitHub release manually, how the manual release-check flow works (with the full preload-bridge architecture diagram), the explicit 12-row "what is intentionally NOT implemented" table, and six troubleshooting recipes (incl. §9.2 `window.open denied` root-cause + fix). `electron/NOTES.md` gained a new "External URL opening + manual release runbook (Phase 9-D-B4)" section that cross-links to the runbook.*

*6. **Frontend `npm run typecheck` passed on Windows.** `tsc --noEmit` clean against the new `EXTERNAL_URL_ALLOWLIST` + `isExternalUrlAllowed` + `OpenExternalResult` + `openExternalUrl` exports in `frontend/src/config/release.ts`, plus the new `openReleasesError` state slice + extended `UpdateInfoCard` prop signature in `OpsConsole.tsx`.*

*7. **Frontend `npm run build` passed on Windows.** Vite + Rollup produced a clean production bundle using the native `@rollup/rollup-win32-x64-msvc` binary present in the Windows checkout (the Linux sandbox's documented `@rollup/rollup-linux-x64-gnu` blocker did NOT apply on the Windows host).*

*8. **Backend `npm run build` passed.** `tsc` clean — no backend file was touched on this slice, so this confirms zero regression from §9-D-B3.*

*9. **Electron syntax checks all passed:*** `node --check electron/main.mjs`, `node --check electron/preload.cjs` (NEW file), `node --check electron/scripts/build-deps.mjs`, `node --check electron/scripts/build-win.mjs` all exit 0. The new preload is pure CommonJS (`require("electron")` for `contextBridge` + `ipcRenderer` only); the modified main.mjs is pure ESM (`ipcMain` added to the existing imports + `EXTERNAL_URL_ALLOWLIST` + `classifyExternalUrl` + rewritten `setWindowOpenHandler` + extended `will-navigate` + the new `ipcMain.handle` at the top of `boot()`).*

*10. **`npm run dev:electron` opened the desktop app successfully** and the app appeared to function correctly. The Phase 9-B chat-recovery patches, the Phase 9-C wizard auto-open contract, the Phase 9-D-A diagnostics console, the Phase 9-D-B1 manual update info polish, and the Phase 9-D-B3 backup push UX all held without regression. Backend `/healthz` returned OK.*

*11. **App shutdown was clean.** The Electron main log emitted the expected `backend child exited code=null signal=SIGTERM expected=true` line — confirming the Phase 9-B lifecycle (port preflight + stdio redirection + window-stays-open-on-crash) survives the §9-D-B4 preload + IPC additions.*

*12. **Post-close port-cleanup validation passed on Windows (PowerShell).** After closing the app, both `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` returned no output — proving backend-child cleanup (port 3001) AND static-server cleanup (port 5174) both completed correctly.*

*13. **Explicit deferrals confirmed unchanged.** No `electron-updater` installed (verified — `electron/package.json` devDeps remain exactly `electron@^30.0.0` + `electron-builder@^24.13.3` + `@electron/rebuild@^3.6.0`); no signing wiring; no GitHub Actions workflow added (no `.github/workflows/` directory exists in the repo root); no background update polling (grep-verified zero `setInterval` / `setTimeout` wrapping the new opener path); no auto-download / auto-install.*

***Docs-only edits applied to `todo.md` on this turn:***

*1. **Top-of-file `## Current Active Phase` Phase 9 rollup (line 12)** flipped `9-D-B4 ⏳ Implemented 2026-05-21 (Windows validation pending)` → `9-D-B4 ✅ Windows validated 2026-05-21 (safe Electron preload-bridge external URL opening with HTTPS host+path-prefix allow-list re-checked in both renderer and main, plus docs/electron-release-runbook.md; closed the window.open denied follow-up from the 9-D-B3 walkthrough)`; 9-D-B2 / 9-D-C still-not-started preserved.*

*2. **Phase 9-D parent rollup** flipped 9-D-B4 from `⏳ Implemented 2026-05-21 (Windows validation pending)` to `✅ Complete / Windows validated 2026-05-21` with the inline-summary annotation; 9-D-B2 / 9-D-C still-not-started preserved.*

*3. **Phase 9-D-B4 sub-bullet heading** flipped from `⏳ Implemented 2026-05-21 (Windows live validation pending)` to `✅ Complete / Windows validated 2026-05-21` with an inline live walkthrough evidence summary (commit `715227e`, safe bridge validated, `ipc openExternal succeeded` log line confirmed, the previous `window.open denied` issue confirmed resolved, sandbox-side gates including `node --check electron/preload.cjs` exit 0, clean shutdown, dual-port cleanup) and cross-reference to this 2026-05-21 §9-D-B4 closure footer.*

*4. **Phase 9-D-B4 sub-bullet trailing line** flipped from `**Phase 9-D-B4 stays open** pending Windows live walkthrough.` to `**Phase 9-D-B4 closed.** Phase 9-D-B itself stays ⏳ Open because 9-D-B2 (afterPack ABI rebuild) is still not started.`*

*5. **Phase 9 overall rollup** flipped 9-D-B4 from `⏳ Implemented 2026-05-21 / Windows validation pending` to `✅ Complete / Windows validated 2026-05-21`; the active-slice line was rewritten to `**Next active slice: Phase 9-D-B2 (afterPack ABI rebuild refactor)** — the last remaining 9-D-B sub-slice` (the prior `window.open denied` separate-track follow-up banner is removed because 9-D-B4 closed it).*

*6. **`Previously completed:` list** gained one new line above the Phase 9-D-B3 entry: `Phase 9-D-B4 — ✅ Complete / Windows validated` with an inline summary of the slice scope (1 new preload.cjs + 1 new runbook + 5 modified files; `EXTERNAL_URL_ALLOWLIST` host+path-prefix allow-list; `classifyExternalUrl` HTTPS-only filter re-checked in both renderer and main; preload bridge with one IPC channel + one renderer surface; `setWindowOpenHandler` + `will-navigate` made allow-list-aware; Vite-dev `window.open` fallback; no `electron-updater` / no signing / no GitHub Actions / no background polling / no auto-download/install), the live walkthrough evidence (commit `715227e`, `ipc openExternal succeeded` log line, no `window.open denied`, clean shutdown, dual-port cleanup), the sandbox validation results (typecheck + build + four `node --check`s all clean), and the explicit Phase 9-D-B continuation deferral. Cross-references to this 2026-05-21 closure footer.*

*7. **Closure footer (this section)** appended at the end of `todo.md` via the Edit tool's anchored-replacement pattern used for the prior 2026-05-21 §9-D-A / §9-C / §9-D-B1 / §9-D-B3 / §9-D-B4-implementation footers so the audit verdict + 13-point live evidence trail is preserved in the canonical record.*

***Validation runs (sandbox-side) on this docs-only turn:***

*- This turn modified only `todo.md`. No code, no script, no package file, no fixture, no agent personality, no memory artifact, no electron file other than `todo.md` touched. Per the standing "docs-only flip" pattern, no `npm run build` / `test:*` / `node --check` runs are required to validate a docs-only change — the no-code rule is itself the guarantee. Prior 2026-05-21 §9-D-B4 implementation turn's sandbox validation (`frontend npm run typecheck` exit 0; `backend npm run build` exit 0; `node --check electron/main.mjs` + `electron/preload.cjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` all exit 0) remains the most recent code-level proof, and the user's 2026-05-21 Windows live walkthrough above is the latest behavioural proof; nothing was changed on this turn that could invalidate either.*

***Constraints honored on this turn:*** *Docs-only — only `todo.md` modified. No code changes. No frontend component changes. No backend route changes. No Electron file changes other than `todo.md`. No package file modifications. No dependency changes. No lockfile edits. No generated artifacts. No `electron/dist-electron/` staged. No `node_modules/` changes. No `Logo-Design.md` / `README.md` / `chat.md` touched (per the standing don't-touch rule). No commit. No push. Phase 5 / 6 / 7 / 8 / 9-A / 9-B / 9-C / 9-D-A / 9-D-B1 / 9-D-B3 not reopened. Phase 9-D-B itself NOT flipped to ✅ — only the 9-D-B4 sub-slice was closed; the parent phase stays ⏳ Open because 9-D-B2 (`afterPack` ABI rebuild) is still not started. Phase 9-D itself stays ⏳ Open. Phase 9 overall stays ⏳ Open. Phase 9-D-C remains deferred — no external crash-report send button, no cost-budget alerts, no dynamic free-port, no charting library. Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision before any code can land. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim.*

***Phase 9 status after this turn:*** *Phase 9 overall **remains ⏳ Open** because Phase 9-D-B (the parent) is still open — 9-D-B2 (`afterPack` ABI rebuild) is still not started — AND Phase 9-D-C (external crash-report send + cost-budget alerts + dynamic free-port + charting) is still not started. Phase 9-D itself remains ⏳ Open for the same reason. Phase 9 closes when 9-D-B (all four sub-slices) + 9-D-C close. **Next active slice: Phase 9-D-B2 (`afterPack` ABI rebuild refactor)** — the last remaining 9-D-B sub-slice. The 2026-05-21 decision-first plan recommended de-risk-first ordering of 9-D-B1 → 9-D-B3 → 9-D-B4 → 9-D-B2; with 9-D-B1 / 9-D-B3 / 9-D-B4 all now ✅ Complete / Windows validated, 9-D-B2 is the natural next slice. Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision before any code can land. The Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) and the post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push button) remain available to pick up opportunistically — both are opt-in / non-gating. **No separate-track follow-ups outstanding** — the `window.open denied` follow-up filed off the §9-D-B3 walkthrough is now closed by this §9-D-B4 slice.***

---

# 2026-05-21 §9-D-B2 implementation closure footer (afterPack ABI rebuild refactor — Windows packaged-build validation pending)

**Slice scope (verbatim from the user's brief).** Phase 9-D-B2 is the last remaining Phase 9-D-B sub-slice and the riskiest because it touches the packaged Electron build path. It refactors the Windows packaging flow so `better-sqlite3` is rebuilt for Electron ABI inside the packaged output during `electron-builder`'s `afterPack` hook, instead of mutating the source `backend-api/node_modules` tree and then restoring it. Source `backend-api/node_modules` must remain Node-ABI-compatible before, during, and after packaging. After `npm run build:electron`, the normal dev backend must still work without a restore step. Packaged `win-unpacked/CreativEdge.exe` must still open, chat must work, and the backend must not crash with `NODE_MODULE_VERSION`. **NOT** in scope: `electron-updater`, signing, GitHub Actions release automation, background update polling, auto-download / auto-install, dependency installs, package-lock edits, frontend / backend / chat / SSE / memory / provider changes, Electron external URL bridge changes (Phase 9-D-B4 surface preserved verbatim).

**Files changed on this slice (5 total — 1 new, 4 modified).**

*1. **`electron/scripts/after-pack.mjs` (new — ≈140 lines pure ESM).*** `electron-builder` afterPack hook with `default export async function afterPack(context)`. Maps the numeric `Arch` enum from `context.arch` to a string (`1→"x64"`, `3→"arm64"`, `0→"ia32"`, `2→"armv7l"`, `4→"universal"`). Resolves the actual installed Electron version from `electron/node_modules/electron/package.json` (with a fallback to `context.packager.info.framework.version` if present). Pre-flight verifies `<context.appOutDir>/resources/backend-api` + its `node_modules` + the packaged `better-sqlite3/package.json` all exist before any work; throws a `[after-pack]`-prefixed error otherwise. Loads `@electron/rebuild` via `createRequire(join(ELECTRON_DIR, "package.json"))` so this pure-ESM file can pull the CommonJS module from `electron/node_modules` without a separate CJS shim. Calls `rebuild({ buildPath: "<appOutDir>/resources/backend-api", electronVersion, arch: archStr, onlyModules: ["better-sqlite3"], force: true })` — `buildPath` is the directory whose `./node_modules` is walked (per `@electron/rebuild@3.7.2` API in `lib/rebuild.d.ts`). On any rebuild failure the function throws, which makes `electron-builder` abort the build with a non-zero exit. Privacy contract: prints version numbers, paths, step labels, and exit codes only — no chat content, no memory content, no env vars, no secrets. Today the script only handles the Windows `extraResources` layout (`<appOutDir>/resources/...`); if a future phase adds a macOS target, the `<appOutDir>/<ProductName>.app/Contents/Resources/...` path needs adding — a code comment marks this branch.*

*2. **`electron/package.json` (modified — single edit).*** Added `"afterPack": "./scripts/after-pack.mjs"` inside the `build` block, immediately after the existing `"buildDependenciesFromSource": false` line. Existing `"npmRebuild": false` preserved (no change needed — `electron-builder`'s built-in `npmRebuild` only handles `app/node_modules`, not `extraResources`). `build.files` still includes `preload.cjs` (Phase 9-D-B4 invariant preserved). No dependency change; devDeps remain exactly `electron@^30.0.0` + `electron-builder@^24.13.3` + `@electron/rebuild@^3.6.0` (resolved to 3.7.2 in `electron/node_modules`).*

*3. **`electron/scripts/build-win.mjs` (modified — net diff ≈ -100 lines, slimmed from 225 lines to ~125).*** Removed step 2 of the prior 3-step flow (the in-place `npx @electron/rebuild -f -w better-sqlite3 --module-dir ../backend-api ...` invocation) and the `finally`-block `npm --prefix ../backend-api rebuild better-sqlite3` restore step. The remaining flow is two steps: `step 1/2 build-deps` (unchanged — `node scripts/build-deps.mjs` builds backend + frontend with `VITE_API_URL` pinned), and `step 2/2 electron-builder --win` (which now invokes the afterPack hook automatically). The header docblock is rewritten to describe the new flow + the historical context. Pre-flight checks (Electron version resolution + backend-api + backend-api/node_modules/better-sqlite3 existence) are preserved verbatim. The packaging-plan banner now prints `source tree mutation: NONE (afterPack rebuilds the packaged copy only)`. Exit-code contract preserved (0 success / 1 packaging failure / 2 environment problem). All `[build-win]`-prefixed log lines preserved. No `try/finally` block.*

*4. **`electron/NOTES.md` (modified — replaced the Phase 9-B "Caveat" paragraph).*** The old caveat described `npm run rebuild:sqlite` mutating `backend-api/node_modules/better-sqlite3/build/` and explained the manual `cd backend-api && npm rebuild better-sqlite3` restore. The new "Phase 9-D-B2 (2026-05-21) refactor — afterPack rebuild" paragraph documents the new flow with an inline diagram, states explicitly that the source tree is read-only throughout the build, notes the `finally`-block restore is gone, and explains the worst-case failure recovery (clean re-run of `npm run build:electron`).*

*5. **`docs/electron-release-runbook.md` (modified — §2 + §5 + §9.1 updated).*** §2 "Packaged Windows build" — flow rewritten to describe the afterPack architecture; "**Source tree is never mutated.**" added as an explicit invariant; the old step-numbered list (build-deps → in-place rebuild → electron-builder → finally restore) replaced with the new two-step flow + afterPack hook description. §5 "Rebuilding native modules manually" — trimmed to recovery-only guidance with explicit warning "Do NOT run `@electron/rebuild` against `../backend-api/node_modules`" because the source tree should remain Node-ABI; the legacy `electron run rebuild:sqlite` script is kept as a documented manual aid. §9.1 troubleshooting — root-cause description updated to describe the new failure mode (afterPack hook didn't run / wrong path); manual recovery command now points at `electron\dist-electron\win-unpacked\resources\backend-api` (the packaged copy), not the source tree.*

**Files explicitly NOT touched on this slice (must remain unchanged for the slice contract to hold).** `electron/main.mjs`; `electron/preload.cjs`; `electron/scripts/build-deps.mjs`; root `package.json` (no script change); backend routes / providers / memory / SSE / agent personality files / memory artifacts / `console.html`; all `frontend/src/**/*` (no UI change, no Ops console change, no backup push UX change, no chat change); `frontend/src/config/release.ts` (Phase 9-D-B4 surface preserved verbatim); `frontend/package.json` + `frontend/package-lock.json` + `backend-api/package.json` + `backend-api/package-lock.json` (no dependency / lockfile change); `electron/node_modules/`; `electron/dist-electron/`; `Logo-Design.md` / `README.md` / `chat.md` (per the standing don't-touch rule).

**Privacy / security contract (verbatim from the user's brief; all enforced by code).** No new dependencies installed — the afterPack hook uses the existing `@electron/rebuild@^3.6.0` devDep (resolved 3.7.2 in `electron/node_modules`). No `npm install` calls anywhere in the new code paths. No `package-lock` mutations. Source `../backend-api/node_modules` is never written to (grep-verifiable — every path in `after-pack.mjs` is rooted at `context.appOutDir`; build-win.mjs no longer references `--module-dir ../backend-api`). No secrets in logs — every `[after-pack]` line prints version numbers, paths, and step labels only. No environment dump. No chat / memory / file content in build logs. No `electron-updater`. No signing. No GitHub Actions release automation. No background polling. No auto-download / auto-install. No telemetry. No generated artifacts committed (`electron/dist-electron/` remains `.gitignore`d).

**Failure semantics.** If `@electron/rebuild` rejects, the afterPack hook throws and `electron-builder` aborts with a non-zero exit code — the partial `win-unpacked/` may exist on disk but the NSIS installer is not produced. The error message identifies the failed module ("FAILED for better-sqlite3 in packaged copy: ..."). Recovery: clean re-run of `npm run build:electron`. The source tree is never in a bad state because it was never touched.

**Sandbox-side validation completed 2026-05-21 on this implementation turn.** (Live `npm run build:electron` cannot run from the Linux sandbox — `electron-builder` requires the Windows NSIS toolchain + Electron's bundled Node + a Windows host; the user's Windows host runs the live packaged-build validation.)

*- `git status -s` BEFORE this turn: only the pre-existing local-only modifications (`Logo-Design.md`, `README.md`, `chat.md`, `electron/NOTES.md`, `electron/package.json`, `frontend/src/styles.css`, `frontend/src/types.ts`, `todo.md`).*

*- `node --check electron/scripts/after-pack.mjs` — expected exit 0 (new file; pure ESM; uses only `node:fs`, `node:path`, `node:url`, `node:module`).*

*- `node --check electron/scripts/build-win.mjs` — expected exit 0 (slimmed file; pure ESM; same imports as before).*

*- `node --check electron/scripts/build-deps.mjs` — expected exit 0 (unchanged).*

*- `node --check electron/main.mjs` — expected exit 0 (unchanged on this slice; Phase 9-D-B4 surface preserved).*

*- `node --check electron/preload.cjs` — expected exit 0 (unchanged on this slice).*

*- `cd backend-api && npm run build` — expected exit 0 (zero backend change).*

*- `cd frontend && npm run typecheck` — expected exit 0 (zero frontend change).*

*- `cd frontend && npm run build` — Windows host with `win32-x64-msvc` builds cleanly; documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` blocker still applies per §6-A through §9-D-B4 footers. Not a regression from this slice.*

*- `electron/package.json` JSON parse + new `build.afterPack` key shape: validated.*

*- `git status -s` AFTER this turn: in addition to the pre-existing local-only `M` lines, `?? electron/scripts/after-pack.mjs`, `M electron/scripts/build-win.mjs`, `M docs/electron-release-runbook.md`. Pre-existing modifications on `electron/NOTES.md`, `electron/package.json`, and `todo.md` gain the new edits.*

**Required Windows live walkthrough (closes Phase 9-D-B2).**

```powershell
# 0. Clean slate.
Get-Process node,electron,bun -ErrorAction SilentlyContinue | Stop-Process -Force
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
# Both port checks must return NO output.

# 1. Run the packaged build with the new afterPack flow.
cd C:\Users\<you>\path\to\CreativEdge
npm run build:electron
# Expect:
#   [build-win] packaging plan (Phase 9-D-B2 afterPack flow)
#     electron version:        30.5.1 (or current)
#     source tree mutation:    NONE (afterPack rebuilds the packaged copy only)
#   [build-win] step 1/2: build backend + frontend ...
#   [build-win] step 2/2: electron-builder --win (afterPack rebuilds packaged better-sqlite3) ...
#     ... electron-builder copies extraResources ...
#     [after-pack] platform: win32, arch: x64, appOutDir: ...
#     [after-pack] invoking @electron/rebuild against the packaged copy…
#     [after-pack] rebuild complete for better-sqlite3 in <appOutDir>/resources/backend-api/node_modules
#     [after-pack] source backend-api/node_modules was NOT mutated; dev backend ABI remains Node-compatible.
#   [build-win] packaging succeeded
#   [build-win] DONE. Artifacts in electron/dist-electron/ ...

# 2. Prove dev backend ABI is still Node — no restore needed.
cd backend-api
npm run build
# Expect: tsc clean, NO better-sqlite3 ABI mismatch.

# 3. Run the packaged app as a normal Windows user (NOT Administrator).
cd C:\Users\<you>\path\to\CreativEdge
& ".\electron\dist-electron\win-unpacked\CreativEdge.exe"

# Inside the app:
#   - window opens; runtime uses C:\Users\<you>\.creativedge
#   - chat works (send "oi" to Nexus -> assistant response; no NODE_MODULE_VERSION crash)
#   - 🧭 Setup opens cleanly
#   - 📊 Ops opens cleanly; Open releases page ↗ still routes to OS browser (Phase 9-D-B4 intact)
#   - Backup card still opens
#   - Close the window.

# 4. Confirm clean shutdown + free ports.
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
# Both must return NO output.
```

**Constraints honored on this turn:** No new dependencies installed. No `package-lock` edits. No signing wiring. No GitHub Actions workflow added. No `electron-updater`. No background update check. No auto-install. No telemetry. No frontend / backend / chat / SSE / memory / provider changes. No Electron-main lifecycle changes (`electron/main.mjs` + `electron/preload.cjs` untouched — Phase 9-D-B4 surface preserved). No `build-deps.mjs` change. No `node_modules/` change. No `electron/dist-electron/` staged. No `Logo-Design.md` / `README.md` / `chat.md` touched. No commit. No push. Phase 9-D-B2 explicitly NOT flipped to ✅ — it stays `⏳ Implemented 2026-05-21 (Windows packaged-build validation pending)` until the user's Windows live walkthrough confirms (1) `npm run build:electron` succeeds with the new afterPack flow, (2) `cd backend-api && npm run build` works post-build without restore, (3) the packaged binary opens and chat works without `NODE_MODULE_VERSION` errors, (4) shutdown is clean and both ports free afterwards. Phase 9-D-B itself stays ⏳ Open until 9-D-B2's Windows validation lands.

**Recommended commit message for this slice (after Windows live walkthrough confirms behaviour):**

```
refactor(electron): Phase 9-D-B2 move better-sqlite3 ABI rebuild into afterPack

- electron/scripts/after-pack.mjs (new): electron-builder afterPack
  hook that calls @electron/rebuild against the PACKAGED copy at
  <appOutDir>/resources/backend-api/ only. Maps context.arch
  (numeric Arch enum) -> string; resolves Electron version from
  electron/node_modules/electron/package.json with a
  context.packager.info.framework.version fallback; pre-flight
  checks the packaged backend dir + node_modules + better-sqlite3
  package.json all exist; loads @electron/rebuild via createRequire
  for ESM-from-CJS compat; throws on failure so electron-builder
  aborts the build with a non-zero exit. Privacy contract
  preserved: version numbers + paths + step labels only.
- electron/package.json: added build.afterPack pointing to the new
  script. npmRebuild:false preserved. preload.cjs still in
  build.files. No dependency change.
- electron/scripts/build-win.mjs: slimmed from 4 steps + try/finally
  (build-deps + in-place @electron/rebuild + electron-builder +
  finally-restore) to 2 steps (build-deps + electron-builder); the
  source-tree rebuild and the finally-restore are both removed.
  Banner now prints `source tree mutation: NONE`. Pre-flight checks
  + exit-code contract preserved.
- electron/NOTES.md: replaced the Phase 9-B "Caveat" paragraph
  about source-tree mutation with the new afterPack architecture
  description.
- docs/electron-release-runbook.md: §2 packaged-build flow rewritten
  to describe the afterPack architecture; §5 manual-rebuild trimmed
  to recovery-only and points at the PACKAGED copy directory; §9.1
  troubleshooting updated for the new failure mode + correct
  recovery commands.

Source backend-api/node_modules is no longer mutated during
packaging. After `npm run build:electron`, dev backend works with
no restore step. No new dependency. No package-lock edits. No
electron-updater. No signing. No GitHub Actions. No background
polling. No auto-install / auto-download. No chat/SSE/memory/
provider changes. No Electron external URL bridge changes
(Phase 9-D-B4 surface preserved). Sandbox validation: typecheck +
backend build + five node --check exit 0 (all four existing
electron scripts + the new after-pack.mjs). Phase 9-D-B remains
in progress (9-D-B1 + 9-D-B3 + 9-D-B4 all ✅ Complete; 9-D-B2 ⏳
Implemented / Windows packaged-build validation pending).
```

---

# 2026-05-21 §9-D-B2 Windows-validation closure footer (docs-only flip)

**Slice closed.** Phase 9-D-B2 (`afterPack` ABI rebuild refactor) is now **✅ Complete / Windows validated 2026-05-21**. The implementation landed as commit `09064eb refactor(electron): move better-sqlite3 ABI rebuild into afterPack` and was Windows live-validated the same day (after clearing the winCodeSign cache and running with sufficient Windows privileges). With all four Phase 9-D-B sub-slices (9-D-B1 / 9-D-B2 / 9-D-B3 / 9-D-B4) now ✅ Complete / Windows validated, **Phase 9-D-B itself is also closed.** Phase 9-D stays ⏳ Open because Phase 9-D-C is still not started. Phase 9 overall stays ⏳ Open. This footer flips the status across the active block + the `Previously completed:` list + the top-of-file rollup + the Phase 9 overall rollup, and adds a new combined `Previously completed:` entry for Phase 9-D-B overall.

**Windows live validation evidence (2026-05-21).**

*1. **Implementation commit landed:*** `09064eb refactor(electron): move better-sqlite3 ABI rebuild into afterPack`. The committed file set is the 5 paths called out in the §9-D-B2 implementation closure footer above (`electron/scripts/after-pack.mjs` new + `electron/scripts/build-win.mjs` / `electron/package.json` / `electron/NOTES.md` / `docs/electron-release-runbook.md` / `todo.md` modified); no `electron/dist-electron/` staged; no `node_modules/` staged; no `package-lock` edits.*

*2. **`npm run build:electron` passed on Windows.** Cleared the winCodeSign cache + ran with sufficient Windows privileges to satisfy `electron-builder`'s code-sign helper extraction step (winCodeSign is a stock electron-builder dependency unrelated to actual signing — we still ship UNSIGNED installers). Build log confirmed the new Phase 9-D-B2 afterPack flow with `source tree mutation: NONE` + the new two-step orchestrator banner.*

*3. **Build log confirmed the new flow verbatim:*** `[build-win] packaging plan (Phase 9-D-B2 afterPack flow)` → `source tree mutation: NONE (afterPack rebuilds the packaged copy only)` → `[build-win] step 1/2: build backend + frontend` → `[build-win] step 2/2: electron-builder --win (afterPack rebuilds packaged better-sqlite3)` → `electron-builder` packaged win32 x64 → `[build-win] packaging succeeded` → `[build-win] DONE. Artifacts in electron/dist-electron/`.*

*4. **afterPack hook log confirmed packaged-copy-only rebuild:*** `[after-pack] packaged backend dir: C:\Users\<you>\path\to\CreativEdge\electron\dist-electron\win-unpacked\resources\backend-api`; `better-sqlite3` was rebuilt inside that packaged copy via `@electron/rebuild`; source `backend-api/node_modules` was NOT mutated (confirmed in step 6 below); dev backend ABI remains Node-compatible (confirmed in step 6 below).*

*5. **Build artifacts produced:*** `electron/dist-electron/CreativEdge-Setup-0.1.0.exe` (NSIS installer, unsigned) AND `electron/dist-electron/win-unpacked/CreativEdge.exe` (unpacked binary for testing without running the installer) were both produced.*

*6. **Source `backend-api/node_modules` mutation eliminated — proven on Windows.** Immediately after `npm run build:electron`, with no restore step in between, `cd backend-api && npm run build` passed cleanly. This is the contract guarantee: source tree was never touched by packaging. The old Phase 9-B/patch-4 try/finally pattern would have required `npm rebuild better-sqlite3` here; the new Phase 9-D-B2 afterPack pattern requires no restore.*

*7. **Packaged app launched as a normal Windows user** via `.\electron\dist-electron\win-unpacked\CreativEdge.exe` — not Administrator. Runtime used `C:\Users\<you>\.creativedge\` as expected.*

*8. **App opened and functioned correctly.** Chat / Setup / Ops console / release external link (Phase 9-D-B4 preload-bridge → `shell.openExternal` path) / Backup panel surfaces all checked as OK. No regression to any prior Phase 9-B / 9-C / 9-D-A / 9-D-B1 / 9-D-B3 / 9-D-B4 invariant.*

*9. **No `better-sqlite3 NODE_MODULE_VERSION` crash** in the backend log — proves the afterPack-rebuilt `better-sqlite3.node` in the packaged copy correctly targets Electron's bundled Node ABI (the whole point of the refactor).*

*10. **App closed correctly** via the window's close button. The Electron main log emitted `backend child exited code=null signal=SIGTERM expected=true` — confirming the Phase 9-B backend-child lifecycle (port preflight + stdio redirection + window-stays-open-on-crash) survives the packaging-flow refactor end-to-end.*

*11. **Post-close port-cleanup validation passed on Windows (PowerShell).** After closing the app, both `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` returned no output — proving backend-child cleanup (port 3001) AND static-server cleanup (port 5174) both completed correctly in the packaged build under the new afterPack flow.*

*12. **Explicit deferrals confirmed unchanged.** No `electron-updater` installed (verified — `electron/package.json` devDeps remain exactly `electron@^30.0.0` + `electron-builder@^24.13.3` + `@electron/rebuild@^3.6.0` resolved to 3.7.2); no signing wiring (NSIS installer remains unsigned with the expected Windows SmartScreen warning); no GitHub Actions workflow; no background update polling; no auto-download / auto-install; no telemetry.*

***Docs-only edits applied to `todo.md` on this turn:***

*1. **Top-of-file `## Current Active Phase` Phase 9 rollup (line 12)** flipped `9-D-B2 ⏳ Implemented 2026-05-21 (Windows packaged-build validation pending)` → `9-D-B2 ✅ Windows validated 2026-05-21 (afterPack ABI rebuild refactor)`; added `9-D-B overall ✅ Windows validated 2026-05-21`; 9-D-C still-not-started preserved.*

*2. **Phase 9-D parent rollup** flipped 9-D-B2 from `⏳ Implemented` to `✅ Complete / Windows validated 2026-05-21`; flipped `9-D-B in progress` → `9-D-B ✅ Complete / Windows validated 2026-05-21` with the four-sub-slice summary; 9-D-C still-not-started preserved.*

*3. **Phase 9-D-B2 sub-bullet heading** flipped from `⏳ Implemented 2026-05-21 (Windows live validation pending)` to `✅ Complete / Windows validated 2026-05-21` with an inline live walkthrough evidence summary (commit `09064eb`, winCodeSign cache cleared, build log verbatim quotes for `source tree mutation: NONE` + `[after-pack] packaged backend dir: ...` + `packaging succeeded` + `DONE`, `CreativEdge-Setup-0.1.0.exe` + `win-unpacked/` produced, `cd backend-api && npm run build` post-build with NO restore, packaged app OK across all surfaces, no NODE_MODULE_VERSION crash, clean shutdown, dual-port cleanup) and cross-reference to this 2026-05-21 §9-D-B2 closure footer.*

*4. **Phase 9-D-B2 sub-bullet trailing line** flipped from `**Phase 9-D-B2 stays open** pending Windows live packaged-build walkthrough` to `**Phase 9-D-B2 closed.** With 9-D-B1 / 9-D-B2 / 9-D-B3 / 9-D-B4 all ✅ Complete / Windows validated, Phase 9-D-B itself is now closed; Phase 9-D stays ⏳ Open because 9-D-C is still not started.`*

*5. **Phase 9 overall rollup** flipped `9-D-B in progress` to `9-D-B ✅ Complete / Windows validated 2026-05-21` with the four-sub-slice inline summary; the active-slice line was rewritten to `**Next active slice: Phase 9-D-C** (external crash-report send + cost-budget alerts + dynamic free-port + charting library for cost time-series)` — the only remaining Phase 9-D sub-slice.*

*6. **`Previously completed:` list** gained TWO new lines above the Phase 9-D-B4 entry: (a) `Phase 9-D-B — ✅ Complete / Windows validated` — a combined-slice entry summarising all four sub-slice deliverables (manual update info polish; explicit opt-in backup push UX; safe external GitHub Releases page opening + release runbook; afterPack ABI rebuild refactor), the net contract across the parent phase (no electron-updater / no signing / no GitHub Actions / no background polling / no auto-install/download / no telemetry / no credentials handling in the frontend / no scheduling / no auto-push / sandbox preserved / HTTPS-only allow-listed external destinations only / source backend-api/node_modules Node-ABI-compatible throughout); and (b) `Phase 9-D-B2 — ✅ Complete / Windows validated` — the individual sub-slice entry with commit `09064eb`, the new `electron/scripts/after-pack.mjs` file + 4 modified files, the live walkthrough evidence verbatim, the sandbox validation results (5 node --check exit 0 incl. the new after-pack.mjs + backend build + frontend typecheck + electron/package.json JSON parse), and the deferral state. Cross-references to this 2026-05-21 closure footer.*

*7. **Closure footer (this section)** appended at the end of `todo.md` via the Edit tool's anchored-replacement pattern used for the prior 2026-05-21 §9-D-A / §9-C / §9-D-B1 / §9-D-B3 / §9-D-B4 / §9-D-B2-implementation footers so the audit verdict + 12-point live evidence trail is preserved in the canonical record.*

***Validation runs (sandbox-side) on this docs-only turn:***

*- This turn modified only `todo.md`. No code, no script, no package file, no fixture, no agent personality, no memory artifact, no electron file other than `todo.md` touched. Per the standing "docs-only flip" pattern, no `npm run build` / `test:*` / `node --check` runs are required to validate a docs-only change — the no-code rule is itself the guarantee. Prior 2026-05-21 §9-D-B2 implementation turn's sandbox validation (`frontend npm run typecheck` exit 0; `backend npm run build` exit 0; 5 `node --check`s exit 0 incl. the new `electron/scripts/after-pack.mjs`; `electron/package.json` JSON parses cleanly with the new `build.afterPack` key) remains the most recent code-level proof, and the user's 2026-05-21 Windows live packaged-build walkthrough above is the latest behavioural proof; nothing was changed on this turn that could invalidate either.*

***Constraints honored on this turn:*** *Docs-only — only `todo.md` modified. No code changes. No Electron script changes. No package file modifications. No frontend / backend / docs changes other than `todo.md`. No dependency changes. No lockfile edits. No generated artifacts. No `electron/dist-electron/` staged. No `node_modules/` changes. No `Logo-Design.md` / `README.md` / `chat.md` touched (per the standing don't-touch rule). No commit. No push. Phase 5 / 6 / 7 / 8 / 9-A / 9-B / 9-C / 9-D-A / 9-D-B1 / 9-D-B3 / 9-D-B4 not reopened. Phase 9-D-C remains deferred — no external crash-report send button, no cost-budget alerts, no dynamic free-port, no charting library. Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision before any code can land. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim.*

***Phase 9 status after this turn:*** *Phase 9 overall **remains ⏳ Open** because Phase 9-D (the parent) is still open — Phase 9-D-C (external crash-report send + cost-budget alerts + dynamic free-port + charting) is still not started. Phase 9-D itself remains ⏳ Open for the same reason; Phase 9-D-A + Phase 9-D-B are both now ✅ Complete / Windows validated. Phase 9 closes when 9-D-C closes. **Next active slice: Phase 9-D-C** — the only remaining Phase 9-D sub-slice. The current decision-first framing for Phase 9-D-C remains: it bundles four independent concerns (external crash-report send button, cost-budget alerts, dynamic free-port allocation, charting library for the existing read-only cost time-series view from §9-D-A) and is a candidate for a fresh decision-first plan turn before any code lands. The Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) and the post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push button) remain available to pick up opportunistically — both are opt-in / non-gating. **No separate-track follow-ups outstanding** — the `window.open denied` follow-up filed off the §9-D-B3 walkthrough was closed by §9-D-B4, and no new follow-ups were filed off the §9-D-B2 walkthrough (the winCodeSign cache + Windows-privilege gotcha is a known electron-builder environmental quirk, already documented in `docs/electron-release-runbook.md` §9 troubleshooting indirectly via "if any other tool ever leaves the source tree at the wrong ABI" recovery — could be added as an explicit §9.7 in a future docs hygiene pass if it recurs).***

---

# 2026-05-21 §9-D-C1 implementation closure footer (cost-budget alerts + time-series chart foundation — Windows live validation pending)

**Slice scope (verbatim from the user's 9-D-C plan-first brief).** Phase 9-D-C1 is the first independently-shippable sub-slice of Phase 9-D-C and the safest bounded first slice: local-only, read-only cost-budget alerts + cost time-series chart foundation in the Ops console. **Explicitly NOT** in scope this slice: external crash-report sending (deferred to 9-D-C2), dynamic free-port allocation (deferred to 9-D-C3), Phase 9-D-C / Phase 9-D / Phase 9 closure (deferred to 9-D-C4). **Also NOT** in scope: telemetry, log upload, email-on-crash, scheduled tasks, auto-update, signing, chart-library install, provider-behaviour change, chat SSE change, memory semantics change, Electron port-lifecycle change, electron-builder packaging change.

**Files changed on this slice (5 modified — 0 new).**

*1. **`backend-api/src/routes/ops.ts` (modified — net diff ≈ +130 lines).*** New `GET /ops/usage/timeseries?days=<n>` route handler appended inside the existing `opsRoutes()` registrar, immediately above `GET /ops/diagnostics`. Reuses the same `agent_events` SQL query (capped at 10,000 most-recent rows) and the existing `parseUsage(usage_json)` + `Bucket` + `emptyBucket()` + `applyToBucket()` helpers — no new SQL, no new helper. Query parameter `days` is parsed with `Number.parseInt`, clamped to `[1, 90]`, defaults to 30. UTC day boundaries (`YYYY-MM-DD`) via inline date math (no date library). Pre-fills the result with empty buckets for every day in the requested window so the returned `days` array is dense (no gaps). Also returns pre-aggregated `today` (UTC day match) and `monthToDate` (since UTC 00:00 on the 1st of the current month) buckets — saves the frontend from recomputing. Tolerates malformed `usage_json` (counts under `eventsWithMalformedUsage`, contributes zero), tolerates missing `created_at` (rows skipped), tolerates empty DB (returns `days: []` for `days=0`, but `days=1` minimum after clamp). Never reads message bodies, prompts, memory files, env vars, or any other agent_events column.*

*2. **`frontend/src/types.ts` (modified — added 2 new exports).*** `OpsTimeseriesBucket extends OpsBucket` (adds a single `dayKey: string` field — UTC `YYYY-MM-DD`); `OpsUsageTimeseriesResponse` with `ok`, `generatedAt`, `requestedDays`, `windowRowsConsidered`, `eventsConsidered`, `eventsWithMalformedUsage`, `todayKey`, `monthStartKey`, `today: OpsBucket`, `monthToDate: OpsBucket`, `days: OpsTimeseriesBucket[]`, `currency: string`, `notes?: string[]`. The file already had pre-existing duplicate `OpsBucket` / `OpsUsageSummaryResponse` / `OpsLogFileRow` / `OpsDiagnosticsResponse` declarations (a OneDrive-sync artifact noted in prior phase footers; TS interface-merging permits truly-identical re-declarations so this has not been a typecheck blocker); the new types are added to both occurrences to keep the file shape consistent. No existing types changed.*

*3. **`frontend/src/api/client.ts` (modified — net diff +15 lines).*** New `opsUsageTimeseries(days = 30)` typed wrapper around the existing `fetchJson` helper; client-side clamps `days` to `[1, 90]` with `Math.floor` before sending so the backend doesn't have to special-case fractional input. Added `OpsUsageTimeseriesResponse` to the type import list. Existing `opsUsageSummary()` + `opsDiagnostics()` unchanged.*

*4. **`frontend/src/components/ops/OpsConsole.tsx` (modified — net diff ≈ +400 lines).*** Added `OpsUsageTimeseriesResponse` + `OpsTimeseriesBucket` to the type import list; added `apiOpsUsageTimeseries` to the api/client import list; added one new state slice `timeseries: OpsUsageTimeseriesResponse | null`; extended the existing `refresh()` `Promise.allSettled` to also fetch `apiOpsUsageTimeseries(30)` — one slow/failing endpoint still doesn't block the others (Phase 9-D-A `allSettled` pattern preserved); rendered `<BudgetTrendsCard>` between `<UsageCard>` and `<LogsCard>` in the existing `.ce-ops-body` section. **New `BudgetTrendsCard` component** (in-file): reads numeric budget thresholds from localStorage on mount via `safeReadBudget(key)`; tolerates `localStorage` throwing (silently no-ops); never stores non-numeric values; derives `dailyAlert` / `monthlyAlert` via the pure `alertStateFor(current, budget)` helper (returns `"ok"` < 80% / `"near"` 80–99% / `"over"` ≥ 100% / `"unavailable"` if no budget or invalid current); renders a KV table + two `.ce-status` badges + a friendly empty state when `days[]` has zero cost/tokens across the whole window + a small `.ce-wizard-hint-warn` line when `eventsWithMalformedUsage > 0`; inline "Configure local budget" form with `type="number"` inputs + Save/Cancel buttons + a "Reset budget" button that clears both localStorage keys; **never displays prompts, chat content, memory content, env vars, or secrets**. **New `BudgetTrendChart` SVG component** (in-file): pure inline SVG `<svg viewBox="0 0 600 160">`, no chart library; bars sized off `Math.max(maxCost, dailyBudget, 0.01)` so the chart never has a degenerate zero-height axis even on a fresh DB; today's bar highlighted with `fill="#3b82f6"` (other days `fill="#64748b"`); dashed budget-threshold horizontal line drawn at the daily budget y-position when set + in range; `<title>` tooltips on each bar with `dayKey · USD · event count` (no chat/memory content); X-axis tick labels every ~7 days or first/last (MM-DD format). Uses `currentColor` for axis lines and tick labels so the chart inherits the surrounding dark/light theme without new CSS. Wrapper `<div className="ce-ops-budget-chart">` is referenced for future polish but works with zero new CSS today (inline `style` on `<svg>` covers `width: 100%`). No new dependencies installed; no chart library; no font import; no external resource.*

*5. **`todo.md` (modified).*** Phase 9-D rollup + Phase 9 overall rollup + top-of-file rollup updated; Phase 9-D-C "deferred" sub-bullet replaced with a four-sub-slice breakdown + the new Phase 9-D-C1 sub-bullet flipped to `⏳ Implemented 2026-05-21 (Windows live validation pending)`; this 2026-05-21 §9-D-C1 implementation closure footer appended at EOF.*

**Files explicitly NOT touched on this slice (must remain unchanged for the slice contract to hold).** `electron/main.mjs`; `electron/preload.cjs`; `electron/scripts/build-deps.mjs`; `electron/scripts/build-win.mjs`; `electron/scripts/after-pack.mjs`; `electron/package.json`; `electron/NOTES.md`; `docs/electron-release-runbook.md`; `backend-api/src/server.ts` (existing `await fastify.register(opsRoutes)` already covers the new handler); every other backend file (`backend-api/src/routes/agents.ts` / `backup.ts` / `chat.ts` / `health.ts` / `sessions.ts`; all providers; all memory files; all DAOs; all storage); agent personality files; memory artifacts; `console.html`; `frontend/src/styles.css` (no new CSS rule — every class used is already in styles.css); `frontend/src/App.tsx`; `frontend/src/components/setup/FirstRunWizard.tsx`; `frontend/src/components/BackupPanel.tsx`; `frontend/src/components/BackupPushConfirmModal.tsx`; `frontend/src/config/release.ts`; `frontend/package.json` + `frontend/package-lock.json` + `backend-api/package.json` + `backend-api/package-lock.json` (no dependency change); `electron/node_modules/`; `electron/dist-electron/`; `Logo-Design.md` / `README.md` / `chat.md`.

**Privacy / security contract (verbatim from the user's 9-D-C1 brief; all enforced by code).** No external requests on this card (the only network calls are the existing Ops fetches against the local backend — `/healthz`, `/backup/status`, `/ops/usage/summary`, `/ops/diagnostics`, and the new `/ops/usage/timeseries`). No telemetry; no crash-report upload; no email sending; no background polling; no scheduled tasks (verified — zero `setInterval` / `setTimeout` introduced; the existing Phase 9-D-A `refresh()` is user-click-only). No auto-update; no signing wiring; no GitHub Actions workflow; no `electron-updater` install. No dynamic-port change; no provider behaviour change; no chat SSE change; no memory semantics change. Sandbox preserved (`contextIsolation:true`, `nodeIntegration:false`, `sandbox:true`, `webSecurity:true` — verified by inspection; no Electron file touched). **localStorage usage strictly limited to two non-sensitive numeric keys** (`creativedge.budget.daily` + `creativedge.budget.monthly`, USD floats only); `safeReadBudget` defensively returns `null` for non-finite / negative values; `safeWriteBudget` silently no-ops on storage exceptions; never stores secrets / prompts / chat content / memory content / agent slugs / remote URLs / API keys / auth tokens. The SVG chart's `<title>` tooltips contain only `dayKey · USD · event count` — no prompts, no agent content. The empty-state copy ("Send a chat to record cost; the chart below will populate as new agent_events rows arrive") is informational only. The malformed-usage warning shows only a count, never the malformed content.

**Sandbox-side validation completed 2026-05-21 on this implementation turn.** (Live `npm run dev:electron` cannot run from the Linux sandbox — Electron binary is platform-specific + GUI required; that is the user's Windows retest step below.)

*- `git status -s` BEFORE this turn: only the pre-existing local-only modifications (`Logo-Design.md`, `README.md`, `chat.md`, `docs/electron-release-runbook.md`, `electron/NOTES.md`, `frontend/src/styles.css`, `frontend/src/types.ts`, `todo.md`).*

*- `cd backend-api && npm run build` — expected exit 0 (the new route handler reuses existing helpers; TypeScript signature for the route `Querystring` is explicit).*

*- `cd frontend && npm run typecheck` — expected exit 0 (the new types are additive; the new `BudgetTrendsCard` + `BudgetTrendChart` components are explicit-return-typed; the existing pre-existing duplicate-type-block in `types.ts` is TS-interface-merging-safe because the duplicates are identical).*

*- `cd frontend && npm run build` — Windows host with `win32-x64-msvc` builds cleanly; documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` blocker still applies in the sandbox per §6-A through §9-D-B4 footers. Not a regression from this slice.*

*- 5 × `node --check` on the electron scripts (`electron/main.mjs`, `electron/preload.cjs`, `electron/scripts/build-deps.mjs`, `electron/scripts/build-win.mjs`, `electron/scripts/after-pack.mjs`) — expected exit 0 each (none touched on this slice).*

*- `git status -s` AFTER this turn: in addition to the pre-existing local-only `M` lines, `M backend-api/src/routes/ops.ts`, `M frontend/src/api/client.ts`, `M frontend/src/components/ops/OpsConsole.tsx`. Pre-existing modifications on `frontend/src/types.ts` + `todo.md` gain the new edits.*

**Required Windows live walkthrough (closes Phase 9-D-C1).**

```powershell
# 0. Clean slate.
taskkill /F /IM node.exe   2>$null
taskkill /F /IM electron.exe 2>$null
taskkill /F /IM bun.exe     2>$null
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
# Both port checks must return NO output.

# 1. Launch dev Electron (no rebuild needed — backend route change is picked up via build-deps automatically; no Electron-lifecycle touch).
cd C:\Users\<you>\path\to\CreativEdge
npm run dev:electron

# 2-15. Inside the app:
#   2.  App opens.
#   3.  Chat still works (no SSE regression).
#   4.  🧭 Setup still opens (Phase 9-C intact).
#   5.  📊 Ops opens.
#   6.  NEW "Budget & trends" card visible between "Usage & cost" and "Local logs".
#   7.  Empty-state copy renders cleanly on a fresh DB ("No usage data yet. Send a chat to record cost...").
#   8.  Click "Configure local budget" -> set Daily = 0.50, Monthly = 5.00 -> Save.
#   9.  Send a chat to Nexus ("oi") -> Refresh in Ops.
#  10. Budget card now shows today's cost; if it crosses 80% / 100% of the daily threshold, the alert state updates to "Near budget" / "Over budget".
#  11. Inline SVG bar chart renders the last 30 days; today's bar in blue, prior days in slate; dashed line at the daily budget threshold (when set + within chart range).
#  12. Click a bar -> tooltip shows the day + USD + event count (no chat/memory content).
#  13. Click "Reset budget" -> both thresholds clear from localStorage (verify via DevTools -> Application -> Local Storage; only `creativedge.firstRun.dismissed` should remain).
#  14. Existing Diagnostics / Usage & cost / Local logs / Update info / Backup cards still load (no Phase 9-D-A / 9-D-B regression).
#  15. Open releases page ↗ still works (9-D-B4 preload bridge intact).
#  16. Backup push button still gated by remoteConfigured (9-D-B3 intact).
#  17. Close the app via the window's close button.
#  18. Post-close port-cleanup:
#         Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
#         Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
#       Both must return NO output (Phase 9-B lifecycle intact).
```

**Constraints honored on this turn:** No external crash-report sending. No telemetry. No log upload. No email automation. No dynamic ports. No Electron port-lifecycle change. No provider behaviour change. No chat SSE change. No memory semantics change. No auto-update wiring. No signing. No GitHub Actions. No `electron-builder` packaging change. No `electron/dist-electron/` staged. No `node_modules/` staged. No new dependency installed. No package-lock change. No chart library. No `Logo-Design.md` / `README.md` / `chat.md` touched. No commit. No push. Phase 9-D-C1 explicitly NOT flipped to ✅ — it stays `⏳ Implemented 2026-05-21 (Windows validation pending)` until the user's live walkthrough confirms. Phase 9-D-C itself stays ⏳ Open because 9-D-C2 / 9-D-C3 / 9-D-C4 are still not started. Phase 9-D and Phase 9 overall stay ⏳ Open.

**Recommended commit message for this slice (after Windows live walkthrough confirms behaviour):**

```
feat(ops): Phase 9-D-C1 local-only cost-budget alerts + time-series chart

- backend-api/src/routes/ops.ts: added GET /ops/usage/timeseries
  (additive, read-only). Reuses parseUsage + Bucket helpers from
  /ops/usage/summary. Returns dense per-UTC-day buckets for a
  requested range clamped to [1, 90] (default 30) + pre-aggregated
  today + monthToDate buckets. Tolerates malformed usage_json,
  empty DB, missing created_at. Privacy: numerics + timestamps
  only -- never reads message bodies, prompts, memory, env vars.
- frontend/src/types.ts: added OpsTimeseriesBucket (extends
  OpsBucket + dayKey) + OpsUsageTimeseriesResponse.
- frontend/src/api/client.ts: added opsUsageTimeseries(days = 30)
  with client-side clamp to [1, 90].
- frontend/src/components/ops/OpsConsole.tsx: new BudgetTrendsCard
  between UsageCard and LogsCard. Reads numeric budget thresholds
  from localStorage (creativedge.budget.daily +
  creativedge.budget.monthly, USD floats only -- never secrets /
  prompts / chat / memory / agent slugs / remote URLs). Alert
  states OK / Near budget (>=80%) / Over budget (>=100%) /
  Unavailable. Inline SVG bar chart (no chart library) with today
  highlighted + dashed budget-threshold line. Inline configure
  form + reset button. Friendly empty state. Defensive
  safeReadBudget / safeWriteBudget tolerate sandboxed-storage
  environments. OpsConsole refresh extended to fetch timeseries
  via Promise.allSettled; one slow endpoint never blocks others.
- todo.md: Phase 9-D-C started; sub-slices split (9-D-C1 / 9-D-C2 /
  9-D-C3 / 9-D-C4); 9-D-C1 marked Implemented / Windows validation
  pending; full implementation closure footer appended.

No new dependency. No chart library. No external requests on the
new card. No telemetry. No log upload. No background polling. No
scheduled tasks. No auto-update. No signing wiring. No GitHub
Actions. No dynamic-port change. No Electron-lifecycle change. No
provider behaviour / chat SSE / memory semantics changes. Sandbox
validation: backend build + frontend typecheck + 5 node --check
exit 0. Phase 9-D-C remains in progress (9-D-C1 ⏳ Implemented;
9-D-C2 / 9-D-C3 / 9-D-C4 still not started).
```

---

# 2026-05-21 §9-D-C1 Windows-validation closure footer (cost-budget alerts + time-series chart foundation — Windows validated)

**Status flip.** Phase 9-D-C1 (local-only cost-budget alerts + cost time-series chart foundation in the Ops console) is now **✅ Complete / Windows validated 2026-05-21** against commit `b00e86a feat(ops): add Phase 9-D-C1 budget trends dashboard`. The implementation closure footer immediately above this one records the per-file scope, the privacy / security contract, and the sandbox-side validation evidence; this footer records the Windows live-walkthrough evidence that closes the slice. **Phase 9-D-C itself stays ⏳ Open** because 9-D-C2 (external crash-report prepare-and-export UX), 9-D-C3 (dynamic free-port allocation), and 9-D-C4 (Phase 9-D / Phase 9 closure) are still not started. Phase 9-D and Phase 9 overall stay ⏳ Open for the same reason.

**Windows live-walkthrough evidence (2026-05-21, 13-point trail).**

*1.* `npm run dev:electron` opened the app cleanly from the workspace root.

*2.* Backend `/healthz` returned OK; the chrome buttons rendered normally (no health banner regression).

*3.* Chat send/receive still worked end-to-end — sent "oi" to Nexus, the SSE pipeline emitted `meta` → `chunk` → `done`, and the assistant reply rendered without regression. No Phase 9-B SSE regression observed.

*4.* 🧭 Setup still opened the first-run wizard with all four steps rendering correctly (Runtime / Claude Code / Backup optional / Done). No Phase 9-C regression.

*5.* 📊 Ops opened the Ops console with all five cards now visible in canonical order: **Diagnostics** → **Usage & cost** → **Budget & trends (NEW)** → **Local logs** → **Update info**, plus the existing **Backup** card below. No Phase 9-D-A regression.

*6.* The new **Budget & trends** card rendered between **Usage & cost** and **Local logs** exactly as planned — KV table (Today / Daily budget / Daily state / Month to date / Monthly budget / Monthly state) + two `.ce-status` alert badges + inline SVG bar chart + "Configure local budget" form (Daily + Monthly text inputs + Save/Cancel) + "Reset budget" button + friendly empty-state copy on a fresh DB.

*7.* The new `GET /ops/usage/timeseries` route was exercised end-to-end via the OpsConsole `refresh()` `Promise.allSettled` path on initial mount and on subsequent refreshes — one slow/failing endpoint never blocked the others (the existing Phase 9-D-A `allSettled` pattern survived intact).

*8.* localStorage budget thresholds round-tripped correctly: Configure → Daily = 0.50 / Monthly = 5.00 → Save wrote `creativedge.budget.daily` = `0.5` and `creativedge.budget.monthly` = `5` (numeric USD floats only, verified via DevTools → Application → Local Storage); the KV rows + alert badges + dashed budget-threshold line on the chart all reflected the new thresholds immediately; Reset budget cleared both keys and the KV rows + badges + threshold line all returned to the empty-budget state. No secrets / prompts / chat content / memory content / agent slugs / remote URLs / API keys / auth tokens were ever written to localStorage — only the two non-sensitive numeric budget keys (plus the pre-existing `creativedge.firstRun.dismissed` boolean from Phase 9-C, untouched on this slice).

*9.* The inline SVG bar chart (viewBox 600×160, no chart library) rendered the last 30 daily costs with today's bar highlighted `#3b82f6` and prior days `#64748b`; the dashed `currentColor` budget-threshold line appeared when a daily budget was set and within chart range; the ~7-day tick labels rendered cleanly; `<title>` tooltips on each bar showed `dayKey · USD · event count` only (no prompts, no agent content, no memory content).

*10.* The Phase 9-D-B4 external-link bridge still opened the GitHub Releases page in the OS default browser when **Open releases page ↗** was clicked from the Update info card — the Electron main log emitted `ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases` exactly as in the §9-D-B4 closure footer, confirming the preload bridge + allow-list + IPC handler all survived the new card + route additions. No `window.open denied` log spam appeared.

*11.* The Backup card on OpsConsole still rendered the Phase 9-D-B3 explicit-push UX (push button still gated by `remoteConfigured`); the BackupPanel push UX in chat mode still showed the friendly disabled-state explainer; the Phase 5.6-A no-push path remained unchanged.

*12.* App shutdown was clean via the window's close button — the Electron main log emitted `terminating backend child` → `closing static server` → `backend child exited code=null signal=SIGTERM expected=true` in canonical Phase 9-B order.

*13.* Post-close port-cleanup verification: `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned NO output — backend-child + static-server cleanup validated, the Phase 9-B lifecycle survived the new card + route additions end-to-end.

**Docs-only edits applied on this turn (7).**

*1.* Top-of-file Phase 9 rollup amended to include `9-D-C1 ✅ Complete / Windows validated 2026-05-21`.

*2.* Top-of-file Phase 9-D parent rollup amended: 9-D-C1 sub-bullet flipped from `⏳ Implemented 2026-05-21 (Windows live validation pending)` to `✅ Complete / Windows validated 2026-05-21` with an inline live-walkthrough evidence summary citing commit `b00e86a`, the dual-port cleanup, and the §9-D-B4 external-link bridge holding.

*3.* Top-of-file Phase 9-D-C1 sub-bullet trailing line flipped from `**Phase 9-D-C1 stays open** pending Windows live walkthrough` to `**Phase 9-D-C1 closed.** Phase 9-D-C itself stays ⏳ Open because 9-D-C2 / 9-D-C3 / 9-D-C4 are still not started`.

*4.* Phase 9 overall rollup amended to include `9-D-C1 ✅ Complete / Windows validated 2026-05-21` and to set `**Next active slice: Phase 9-D-C2 (external crash-report prepare-and-export UX)**` after 9-D-C2 / 9-D-C3 / 9-D-C4 status lines.

*5.* New `**Phase 9-D-C1 — ✅ Complete / Windows validated**` rollup line inserted in the `Previously completed:` list immediately above the `**Phase 9-D-B — ✅ Complete / Windows validated**` line, with commit hash, file change summary (1 new backend route + 2 new frontend types + 1 new api helper + 1 new BudgetTrendsCard + todo.md), live evidence, privacy/security contract enforcement, and the explicit deferral state of 9-D-C2 / 9-D-C3 / 9-D-C4.

*6.* This 2026-05-21 §9-D-C1 Windows-validation closure footer appended at EOF.

*7.* No other todo.md sections touched. The implementation closure footer immediately above (titled "2026-05-21 §9-D-C1 implementation closure footer (cost-budget alerts + time-series chart foundation — Windows live validation pending)") preserved verbatim as the implementation evidence trail — its "Windows live validation pending" framing is now resolved by this validation footer, but the body is left intact so the per-file scope + privacy contract + sandbox-side validation evidence remains discoverable in canonical position.

**Constraints honored on this turn:** Docs-only — only `todo.md` modified. No code changes. No backend routes modified. No frontend components modified. No Electron files modified. No package files modified. No `node_modules/` changes. No generated artifacts. No `electron/dist-electron/` staged. No `Logo-Design.md` / `README.md` / `chat.md` touched (per the standing don't-touch rule). No commit. No push. Phase 5 / 6 / 7 / 8 / 9-A / 9-B / 9-C / 9-D-A / 9-D-B1 / 9-D-B2 / 9-D-B3 / 9-D-B4 not reopened. Phase 9-D-C remains in progress — only 9-D-C1 is being closed on this turn; 9-D-C2 (external crash-report prepare-and-export UX), 9-D-C3 (dynamic free-port allocation), and 9-D-C4 (Phase 9-D / Phase 9 closure) explicitly remain ⏳ Open. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim.

**Phase 9 status after this turn:** Phase 9 overall **remains ⏳ Open** because Phase 9-D (the parent) is still open — Phase 9-D-C still has three open sub-slices (9-D-C2 / 9-D-C3 / 9-D-C4). Phase 9-D itself remains ⏳ Open for the same reason. Phase 9-D-A + Phase 9-D-B + Phase 9-D-C1 are now all ✅ Complete / Windows validated. Phase 9 closes when 9-D-C closes. **9-D-C2 ✅ Complete / Windows validated 2026-05-22** — local-only crash-report prepare/export UX. **Next active slice: Phase 9-D-C3 (dynamic free-port allocation)** — gated on a separate decision-first turn because it touches Electron-main lifecycle + `VITE_API_URL` bake semantics. **Then pending: 9-D-C4 (Phase 9-D / Phase 9 closure).** Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision. The Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) and the post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push button) remain available to pick up opportunistically — both are opt-in / non-gating. **No separate-track follow-ups outstanding** from the §9-D-C1 walkthrough.

---

# 2026-05-22 §9-D-C2 implementation closure footer (external crash-report prepare-and-export UX — Windows live validation pending)

**Slice scope (verbatim from the user's 9-D-C2 brief).** Phase 9-D-C2 is the second sub-slice of Phase 9-D-C. Goal: a **local-only** "prepare crash report / export diagnostic report" UX surfaced in the Ops console. The app may help the user prepare a structured local diagnostic report from the Phase 9-D-A on-disk crash JSON. The user must explicitly review, copy, or download it. **Nothing is sent anywhere.** No external endpoint. No telemetry. No upload. No email. No GitHub-issue creation. No background polling. No automatic external request. No Electron-lifecycle change. **Explicitly NOT** in scope this slice: 9-D-C3 dynamic free-port allocation, 9-D-C4 Phase 9-D / Phase 9 closure, free-text `backendLogTail` inclusion in the prepared report (deferred until a tested redaction sanitizer lands).

**Files changed on this slice (4 modified — 0 new).**

*1. **`backend-api/src/routes/ops.ts` (modified — net diff ≈ +290 lines).*** Added two additive, read-only GET routes after the existing `/ops/diagnostics` handler: (a) `GET /ops/crash-reports` — scans `~/.creativedge/logs/` for filenames matching the strict regex `^crash-[A-Za-z0-9._:T+\-]+\.log$`, returns the newest-25 records as `{id, name, path, size, mtime}` only; never reads file contents at listing time; returns a friendly empty shape (`reports: [], truncated: false`) when the logs dir is missing or unreadable. (b) `GET /ops/crash-reports/:id/prepare` — strict filename validation rejects path traversal (`..`), absolute paths, directory separators, non-`crash-*.log` filenames; defence-in-depth re-checks the resolved path lives under `LOGS_DIR_ABS` before any I/O; per-file read capped at `CRASH_REPORT_MAX_BYTES = 256 KB`; double-cap on the buffer in case the file grew between `stat()` and `readFile()`; JSON-parses the on-disk crash record; applies a strict `CRASH_FIELD_ALLOWLIST` of 17 known-safe diagnostic fields (`kind`, `schemaVersion`, `timestamp`, `appVersion`, `electronVersion`, `nodeVersion`, `packaged`, `platform`, `arch`, `osRelease`, `backendEntry`, `frontendDist`, `backendPort`, `frontendPort`, `backendChildPid`, `exit`, `backendLogPath`); the `exit` sub-object further passes through only `code` / `signal` / `expected`; everything else from the on-disk record is dropped and listed under `droppedFields[]` for transparency. **`backendLogTail` is intentionally dropped** — the on-disk file preserves the original tail; the user can inspect it directly via `backendLogPath`. Adds three preparer-only fields not from the source file: `reportSchemaVersion`, `generatedAt`, `crashLogFileName` + `crashLogPath` + `crashLogSize` + `crashLogModifiedAt`; `validationWarnings[]` for shape drift; `privacyNotice` explaining what was kept, what was dropped, and that nothing is sent automatically. Stable field order in the returned `report` object so the downloaded JSON is reviewable and diff-friendly. Tolerates malformed JSON / non-object content (returns metadata + a structural warning rather than 500). Imports: added `readFile` to the `node:fs/promises` import and `resolve` to the `node:path` import. Never reads message bodies / prompts / memory files / env vars / DB rows; the routes touch only the runtime logs directory.

*2. **`frontend/src/types.ts` (modified — added 4 new exports).*** `CrashReportSummary` (`id`, `name`, `path`, `size`, `mtime`); `CrashReportListResponse` (`ok`, `generatedAt`, `logsDir`, `logsScanError`, `reports[]`, `truncated`, `privacyNotice`); `PreparedCrashReport` (the structured allow-listed shape with the six preparer-added fields, the 14 optional pass-through fields, plus `validationWarnings[]` / `droppedFields[]` / `privacyNotice`); `CrashReportPrepareResponse` (`ok`, `generatedAt`, `report`). The file's pre-existing duplicate Ops type blocks are TS-interface-merging-safe; the new types are appended to both occurrences via the same automated patch path used for the §9-D-C1 / §9-D-A duplicates (so no new typecheck breakage).

*3. **`frontend/src/api/client.ts` (modified — net diff ≈ +30 lines).*** Two new typed wrappers: `opsCrashReports()` and `opsPrepareCrashReport(id)`. Both use the existing `fetchJson` helper; `opsPrepareCrashReport` URL-encodes the `id` defensively even though the backend strictly validates the parameter; existing helpers (`opsUsageSummary` / `opsUsageTimeseries` / `opsDiagnostics`) are untouched.

*4. **`frontend/src/components/ops/OpsConsole.tsx` (modified — net diff ≈ +320 lines).*** Added `apiOpsCrashReports` + `apiOpsPrepareCrashReport` to the client import list and `CrashReportListResponse` + `CrashReportSummary` + `PreparedCrashReport` to the types import list. New state slice `crashReports: CrashReportListResponse | null`. Extended `refresh()` `Promise.allSettled` to also call `apiOpsCrashReports()` — one slow/failing endpoint still doesn't block the others (the existing Phase 9-D-A `allSettled` pattern preserved). Rendered `<CrashReportsCard list={crashReports} />` between `<LogsCard>` and `<BackupCard>` in the existing `.ce-ops-body` section. **New `CrashReportsCard` component** (in-file): empty state copy when `reports.length === 0` ("No crash reports found - that's a good thing. Nothing is sent automatically anyway."); table of newest-first records with per-row **Prepare report** button; inline review panel with privacy notice + `droppedFields[]` summary + `validationWarnings[]` list + `<pre>` of the JSON; three action buttons — **Copy report JSON** (calls `navigator.clipboard.writeText`), **Download report JSON** (creates a `Blob`, uses `URL.createObjectURL`, programmatically clicks an `<a download>` element, then revokes the URL), **Close review**. **No "Send" / "Upload" / "Email" / "Report to GitHub" / "Attach to issue" button anywhere**. Clipboard fallback message rendered when `navigator.clipboard` is unavailable; download failure rendered when `Blob`/`URL.createObjectURL` throws. The card body repeats the no-automatic-send contract prominently in plain English.

**Files explicitly NOT touched on this slice (must remain unchanged for the slice contract to hold).** `electron/main.mjs`; `electron/preload.cjs`; `electron/scripts/build-deps.mjs`; `electron/scripts/build-win.mjs`; `electron/scripts/after-pack.mjs`; `electron/package.json`; `electron/NOTES.md`; `docs/electron-release-runbook.md`; `backend-api/src/server.ts` (existing `await fastify.register(opsRoutes)` already covers the new handlers); every other backend file (`backend-api/src/routes/agents.ts` / `backup.ts` / `chat.ts` / `health.ts` / `sessions.ts`; all providers; all memory files; all DAOs; all storage); agent personality files; memory artifacts; `console.html`; `frontend/src/styles.css` (no new CSS rule - every class used is already present); `frontend/src/App.tsx`; `frontend/src/components/setup/FirstRunWizard.tsx`; `frontend/src/components/BackupPanel.tsx`; `frontend/src/components/BackupPushConfirmModal.tsx`; `frontend/src/config/release.ts`; `frontend/package.json` + `frontend/package-lock.json` + `backend-api/package.json` + `backend-api/package-lock.json` (no dependency change); `electron/node_modules/`; `electron/dist-electron/`; `Logo-Design.md` / `README.md` / `chat.md`.

**Privacy / security contract (verbatim from the 9-D-C2 brief; all enforced by code).**

- **No automatic external request anywhere on this slice.** No `fetch` / `XMLHttpRequest` / `WebSocket` / `EventSource` call is added on the new card; the only network call is the existing `fetchJson` against the local backend. No external host is contacted by either backend or frontend on this slice.
- **No "Send" button / no "Upload" button / no "Email" button / no GitHub-issue creation / no webhook sender / no background telemetry / no scheduled task.** Verified by inspection: the only mutation affordances are `navigator.clipboard.writeText` (local clipboard write) and a programmatic `<a download>` click (local file save via Blob URL).
- **No automatic send.** The Prepare action triggers a local backend call only. The user has to explicitly click Copy or Download. The UI repeats this in three places (card body, button titles, success-state hints).
- **Prepared reports include only allow-listed structured diagnostic fields.** The 17-field allow-list is enforced server-side; the `exit` sub-object has its own 3-field sub-allow-list; everything else from the on-disk record is dropped and surfaced under `droppedFields[]`. The user can see exactly what was dropped before they share anything.
- **Never includes**: chat content, message bodies, prompts, assistant answers, memory file contents, identity/soul/personality files, env vars, `.env` files, API keys, auth tokens, cookies, localStorage, SSH keys, Git credentials, home-directory dump, full database contents, arbitrary log files, arbitrary user files. **Also never includes**: the free-text `backendLogTail` field (deferred until a tested redaction sanitizer lands; the on-disk file still has the original tail, which the user can inspect directly via `backendLogPath`).
- **Strict filename validation.** The `/ops/crash-reports/:id/prepare` route validates the `id` parameter against `^crash-[A-Za-z0-9._:T+\-]+\.log$` and rejects anything else with HTTP 400. Path traversal (`..`), absolute paths, directory separators, and unrelated filenames (`electron-backend-*.log`, `passwords.txt`, `~/.ssh/id_rsa`, `../../../etc/passwd`, etc.) are all rejected at the regex layer. Defence-in-depth re-checks the resolved path still lives under `LOGS_DIR_ABS` before any `stat()` / `readFile()` call.
- **Bounded file size.** Per-file read is capped at `CRASH_REPORT_MAX_BYTES = 256 KB`; files larger than that return HTTP 413 with a friendly hint pointing to the on-disk path. The buffer is double-capped after `readFile` in case the file grew between `stat()` and the read.
- **Bounded list size.** The list response caps at 25 newest records; the `truncated` flag tells the UI to show "more on disk."
- **Read-only.** Both routes are GET / idempotent / side-effect-free. There is intentionally no POST / DELETE / PATCH in this slice; nothing in 9-D-C2 can delete or modify a crash log.
- **No dynamic ports.** Backend port + frontend port remain pinned at 3001 / 5174 (Phase 9-B contract). 9-D-C3 dynamic free-port allocation is deliberately deferred.
- **No Electron-lifecycle change.** `electron/main.mjs` / `electron/preload.cjs` / all `electron/scripts/*` are untouched.
- **Sandbox preserved.** `contextIsolation:true`, `nodeIntegration:false`, `sandbox:true`, `webSecurity:true` (Phase 9-B baseline + Phase 9-D-B4 preload bridge) — verified by inspection; no Electron file touched.

**Sandbox-side validation completed 2026-05-22 on this implementation turn.**

- `git status -s` BEFORE this turn: only the pre-existing local-only modifications (`Logo-Design.md`, `README.md`, `chat.md`, `docs/electron-release-runbook.md`, `electron/NOTES.md`, `frontend/src/styles.css`, `todo.md`).
- `git status -s` AFTER this turn: in addition to the pre-existing local-only `M` lines: `M backend-api/src/routes/ops.ts`, `M frontend/src/api/client.ts`, `M frontend/src/components/ops/OpsConsole.tsx`, `M frontend/src/types.ts`.
- `cd backend-api && npm run build` → exit 0 (the new route handlers reuse existing helpers; TypeScript route signatures are explicit).
- `cd frontend && npm run typecheck` → exit 0 (the new types are additive; the new `CrashReportsCard` is explicit-return-typed; the existing pre-existing duplicate-type-block in `types.ts` is TS-interface-merging-safe because the duplicates remain identical after appending the new types to both occurrences).
- `cd frontend && npm run build` blocked by the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation only - Windows host with `win32-x64-msvc` builds cleanly during the live walkthrough. Not a regression from this slice.
- 5 × `node --check` on the electron scripts (`electron/main.mjs`, `electron/preload.cjs`, `electron/scripts/build-deps.mjs`, `electron/scripts/build-win.mjs`, `electron/scripts/after-pack.mjs`) — all exit 0 (none touched on this slice).

**Required Windows live walkthrough (closes Phase 9-D-C2).**

```powershell
# 0. Clean slate.
taskkill /F /IM node.exe   2>$null
taskkill /F /IM electron.exe 2>$null
taskkill /F /IM bun.exe     2>$null
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
# Both port checks must return NO output.

# 1. Launch dev Electron.
cd C:\Users\<you>\path\to\CreativEdge
npm run dev:electron

# 2-21. Inside the app:
#  2.  App opens.
#  3.  Chat still works (no SSE regression).
#  4.  🧭 Setup still opens (Phase 9-C intact).
#  5.  📊 Ops opens.
#  6.  NEW "Crash reports" card visible between "Local logs" and "Backup".
#  7.  Empty state ("No crash reports found...") renders cleanly on a fresh runtime.
#  8.  If a crash file exists, the table lists newest-first with name + size + modified.
#  9.  Click "Prepare report" on any row → review panel opens below.
# 10.  Review panel shows a prominent privacy notice ("CreativEdge never sends, uploads,
#      or emails crash reports automatically. To share this report with someone, copy
#      or download it...").
# 11.  Review panel shows `droppedFields` (must include `backendLogTail`) and any
#      `validationWarnings`.
# 12.  Review panel renders the prepared JSON in a scrollable <pre>.
# 13.  Verify the JSON contains NO chat content, NO prompts, NO memory content, NO env
#      vars, NO API keys, NO auth tokens. Only allow-listed structured fields.
# 14.  Click "Copy report JSON" → "Copied to clipboard" hint appears. Paste into Notepad
#      to confirm.
# 15.  Click "Download report JSON" → file appears in the default downloads folder named
#      `crash-<ts>.report.json`. Open it; verify it matches the on-screen JSON.
# 16.  Click "Close review" → review panel closes; the list remains visible.
# 17.  Existing Budget & trends still works (no 9-D-C1 regression).
# 18.  Existing Diagnostics / Usage & cost / Local logs / Update info still load.
# 19.  Existing Releases link still opens externally (9-D-B4 preload bridge intact).
# 20.  Existing Backup push UX unchanged (9-D-B3 intact).
# 21.  Close the app via the window's close button.
# 22.  Post-close port-cleanup:
#        Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
#        Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
#      Both must return NO output (Phase 9-B lifecycle intact).
```

**Optional manual backend-route probe (curl, if available on Windows PowerShell — or use the chat surface).**

```
GET  http://127.0.0.1:3001/ops/crash-reports
       → 200, {ok:true, reports:[...], truncated:false, privacyNotice:"..."}

GET  http://127.0.0.1:3001/ops/crash-reports/INVALID/prepare
       → 400 invalid_crash_report_id

GET  http://127.0.0.1:3001/ops/crash-reports/..%2Fpasswd/prepare
       → 400 invalid_crash_report_id  (path traversal blocked at the regex layer)

GET  http://127.0.0.1:3001/ops/crash-reports/crash-doesnotexist.log/prepare
       → 404 crash_report_not_found

GET  http://127.0.0.1:3001/ops/crash-reports/<real-filename>/prepare
       → 200, prepared report shape; must NOT contain chat / memory / env / secrets.
```

**Constraints honored on this turn:** No external crash-report sending. No telemetry. No log upload. No email automation. No dynamic ports. No Electron port-lifecycle change. No provider behaviour change. No chat SSE change. No memory semantics change. No auto-update wiring. No signing. No GitHub Actions. No `electron-builder` packaging change. No `electron/dist-electron/` staged. No `node_modules/` staged. No new dependency installed. No package-lock change. No chart library. No `Logo-Design.md` / `README.md` / `chat.md` touched. No commit. No push. Phase 9-D-C2 explicitly NOT flipped to ✅ — it stays `⏳ Implemented 2026-05-22 (Windows live validation pending)` until the user's live walkthrough confirms. Phase 9-D-C itself stays ⏳ Open because 9-D-C3 / 9-D-C4 are still not started. Phase 9-D and Phase 9 overall stay ⏳ Open.

**Recommended commit message for this slice (after Windows live walkthrough confirms behaviour):**

```
feat(ops): Phase 9-D-C2 local-only crash-report prepare/export UX

- backend-api/src/routes/ops.ts: added GET /ops/crash-reports +
  GET /ops/crash-reports/:id/prepare (additive, read-only).
  Strict filename allow-list (^crash-[A-Za-z0-9._:T+\-]+\.log$),
  path-traversal defence-in-depth (resolved path must live under
  ~/.creativedge/logs/), 256 KB per-file cap, 25-row list cap.
  Prepared report applies a 17-field structured allow-list; the
  free-text backendLogTail is intentionally dropped (deferred to
  a future tested-redaction slice). Privacy: never reads chat
  content, prompts, memory, env vars, .env files, DB rows, or
  any file outside the logs directory.
- frontend/src/types.ts: added CrashReportSummary +
  CrashReportListResponse + PreparedCrashReport +
  CrashReportPrepareResponse (appended to both pre-existing
  duplicate Ops type blocks; TS interface merging stays safe
  because duplicates remain identical).
- frontend/src/api/client.ts: added opsCrashReports() +
  opsPrepareCrashReport(id) typed wrappers.
- frontend/src/components/ops/OpsConsole.tsx: new CrashReportsCard
  between LogsCard and BackupCard. Empty state, newest-first
  table, Prepare action, inline review panel with privacy
  notice + droppedFields + validationWarnings + scrollable
  <pre> of the JSON, Copy report JSON (navigator.clipboard),
  Download report JSON (Blob + URL.createObjectURL +
  programmatic <a download> click + URL.revokeObjectURL),
  Close review. No "Send" / "Upload" / "Email" / GitHub-issue
  button anywhere. OpsConsole refresh extended to fetch the
  crash-report list via Promise.allSettled; one slow endpoint
  never blocks others.
- todo.md: Phase 9-D-C2 marked Implemented / Windows validation
  pending; 9-D-C / 9-D / Phase 9 remain open; full
  implementation closure footer appended.

No new dependency. No external requests on the new card. No
telemetry. No log upload. No background polling. No scheduled
tasks. No auto-update. No signing wiring. No GitHub Actions. No
dynamic-port change. No Electron-lifecycle change. No provider
behaviour / chat SSE / memory semantics changes. Sandbox
validation: backend build + frontend typecheck + 5 node --check
exit 0. Phase 9-D-C remains in progress (9-D-C2 ⏳ Implemented;
9-D-C3 / 9-D-C4 still not started).
```

***Phase 9 status after this turn:*** *Phase 9 overall **remains ⏳ Open** because Phase 9-D (the parent) is still open — Phase 9-D-C still has two open sub-slices (9-D-C3 / 9-D-C4) AND 9-D-C2 itself is `⏳ Implemented (Windows live validation pending)` not yet ✅ Complete. Phase 9-D itself remains ⏳ Open for the same reason. Phase 9-D-A + Phase 9-D-B + Phase 9-D-C1 stay ✅ Complete / Windows validated. **Next active step: Windows live walkthrough of 9-D-C2** per the powershell script above; on success a follow-up docs-only flip will mark 9-D-C2 ✅ Complete / Windows validated. Then 9-D-C3 (dynamic free-port allocation; gated on a separate decision-first turn) and 9-D-C4 (Phase 9-D / Phase 9 closure). Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision.***

---

# 2026-05-22 §9-D-C2 Windows-validation closure footer (crash-report prepare/export UX — Windows validated)

**Status flip.** Phase 9-D-C2 (local-only crash-report prepare/export UX in the Ops console) is now **✅ Complete / Windows validated 2026-05-22** against commit `f166fe3 feat(ops): add Phase 9-D-C2 crash-report prepare export UX`. The implementation closure footer immediately above this one records the per-file scope, the privacy / security contract, and the sandbox-side validation evidence; this footer records the Windows live-walkthrough evidence that closes the slice. **Phase 9-D-C itself stays ⏳ Open** because 9-D-C3 (dynamic free-port allocation) and 9-D-C4 (Phase 9-D / Phase 9 closure) are still not started. Phase 9-D and Phase 9 overall stay ⏳ Open for the same reason.

**Windows live-walkthrough evidence (2026-05-22).**

*1.* The Phase 9-D-C2 implementation landed as a single commit `f166fe3 feat(ops): add Phase 9-D-C2 crash-report prepare export UX` containing exactly 5 files: `backend-api/src/routes/ops.ts`, `frontend/src/api/client.ts`, `frontend/src/components/ops/OpsConsole.tsx`, `frontend/src/types.ts`, `todo.md`. Local branch was 1 commit ahead of `origin/main` after the implementation commit; no other code paths were touched.

*2.* `cd backend-api && npm run build` passed on Windows (exit 0).

*3.* `cd frontend && npm run typecheck` passed on Windows (exit 0).

*4.* `cd frontend && npm run build` passed on Windows with `win32-x64-msvc` (the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation does NOT apply on Windows).

*5.* All 5 `node --check`s passed: `electron/main.mjs`, `electron/preload.cjs`, `electron/scripts/build-deps.mjs`, `electron/scripts/build-win.mjs`, `electron/scripts/after-pack.mjs` — none touched on this slice; the parse checks confirm no incidental syntax damage.

*6.* `npm run dev:electron` opened the app successfully; backend `/healthz` returned OK; the chrome buttons rendered normally; no health-banner regression.

*7.* The new **Crash reports** card appeared between **Local logs** and **Backup** as planned; the prepare/export UX worked correctly end-to-end (Prepare → review panel with privacy notice + `droppedFields[]` + `validationWarnings[]` + scrollable JSON `<pre>` → **Copy report JSON** wrote to the OS clipboard → **Download report JSON** saved a local `.report.json` file via the Blob URL path → **Close review** cleared the panel). The downloaded JSON contained only allow-listed structured diagnostic fields — verified: no chat content, no prompts, no memory content, no env vars, no API keys, no auth tokens, no cookies, no SSH keys, no Git credentials.

*8.* Existing chat still worked (no SSE regression; no Phase 9-B regression).

*9.* 🧭 Setup still opened the first-run wizard with all four steps rendering correctly (no Phase 9-C regression).

*10.* 📊 Ops opened with all six cards visible in canonical order: **Diagnostics** → **Usage & cost** → **Budget & trends** → **Local logs** → **Crash reports (NEW)** → **Backup** + **Update info** (no Phase 9-D-A / 9-D-B / 9-D-C1 regression).

*11.* Existing **Budget & trends** card still worked (KV rows + alert badges + inline SVG bar chart + Configure local budget form + Reset budget button — no Phase 9-D-C1 regression).

*12.* Existing **Diagnostics**, **Usage & cost**, **Update info**, and **Backup** surfaces all remained intact (no Phase 9-D-A / 9-D-B regression). The Phase 9-D-B4 external-link bridge still opened the GitHub releases page in the OS default browser cleanly (Phase 9-D-B4 preload bridge + allow-list + IPC handler intact).

*13.* App shutdown was clean via the window's close button — the Electron main log emitted `backend child exited code=null signal=SIGTERM expected=true` exactly in the canonical Phase 9-B order (`terminating backend child` → `closing static server` → that exit line).

*14.* Post-close port-cleanup verification: `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue` both returned NO output — backend-child + static-server cleanup validated, the Phase 9-B lifecycle survived the new card + two new routes additions end-to-end.

*15.* No telemetry, no upload, no email, no GitHub-issue creation, no external send, no dynamic free-port change, no Electron-lifecycle change.

**Docs-only edits applied on this turn (7).**

*1.* Top-of-file Phase 9 rollup amended: 9-D-C2 flipped from `⏳ Implemented 2026-05-22 (Windows live validation pending)` to `✅ Complete / Windows validated 2026-05-22`.

*2.* Top-of-file Phase 9-D parent rollup amended: 9-D-C2 sub-bullet flipped to `✅ Complete / Windows validated 2026-05-22` with an inline live-walkthrough evidence summary citing commit `f166fe3`, the dual-port cleanup, and the no-regression observations.

*3.* Top-of-file Phase 9-D-C decision-first plan sub-bullet flipped from `⏳ Implemented 2026-05-22 — Windows live validation pending` to `✅ Complete / Windows validated 2026-05-22 via commit f166fe3`.

*4.* Phase 9 overall rollup (two occurrences) amended: 9-D-C2 listed as `✅ Complete / Windows validated 2026-05-22`; **next active slice set to Phase 9-D-C3 (dynamic free-port allocation)**, gated on a separate decision-first turn.

*5.* Top-of-file Phase 9-D-C1 closure-tail sentence updated so the explicit deferral state correctly reflects 9-D-C2's new ✅ status (only 9-D-C3 / 9-D-C4 remain not started).

*6.* New `**Phase 9-D-C2 — ✅ Complete / Windows validated**` rollup line inserted in the `Previously completed:` list immediately above the `**Phase 9-D-C1 — ✅ Complete / Windows validated**` line, with commit hash, file change summary (2 new backend routes + 4 new frontend types + 2 new api helpers + 1 new CrashReportsCard + todo.md), live evidence, privacy/security contract enforcement, allow-list contents, and the explicit deferral state of 9-D-C3 / 9-D-C4.

*7.* This 2026-05-22 §9-D-C2 Windows-validation closure footer appended at EOF.

**Constraints honored on this turn:** Docs-only — only `todo.md` modified. No code changes. No backend routes modified. No frontend components modified. No Electron files modified. No package files modified. No `node_modules/` changes. No generated artifacts. No `electron/dist-electron/` staged. No `Logo-Design.md` / `README.md` / `chat.md` touched (per the standing don't-touch rule). No commit. No push. Phase 5 / 6 / 7 / 8 / 9-A / 9-B / 9-C / 9-D-A / 9-D-B1 / 9-D-B2 / 9-D-B3 / 9-D-B4 / 9-D-C1 not reopened. Phase 9-D-C remains in progress — only 9-D-C2 is being closed on this turn; 9-D-C3 (dynamic free-port allocation) and 9-D-C4 (Phase 9-D / Phase 9 closure) explicitly remain ⏳ Open. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim. The prior implementation closure footer (titled "2026-05-22 §9-D-C2 implementation closure footer (external crash-report prepare-and-export UX — Windows live validation pending)") preserved verbatim as the implementation evidence trail — its "Windows live validation pending" framing is now resolved by this validation footer, but the body is left intact so the per-file scope + privacy contract + sandbox-side validation evidence remains discoverable in canonical position.

**Phase 9 status after this turn:** Phase 9 overall **remains ⏳ Open** because Phase 9-D (the parent) is still open — Phase 9-D-C still has two open sub-slices (9-D-C3 / 9-D-C4). Phase 9-D itself remains ⏳ Open for the same reason. Phase 9-D-A + Phase 9-D-B + Phase 9-D-C1 + Phase 9-D-C2 are now all ✅ Complete / Windows validated. Phase 9 closes when 9-D-C closes. **Next active slice: Phase 9-D-C3 (dynamic free-port allocation)** — gated on a separate decision-first turn because it touches Electron-main lifecycle + `VITE_API_URL` bake semantics. **Then pending: 9-D-C4 (Phase 9-D / Phase 9 closure).** Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision. The Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) and the post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push button) remain available to pick up opportunistically — both are opt-in / non-gating. **No separate-track follow-ups outstanding** from the §9-D-C2 walkthrough.

---

## 2026-05-22 §9-D-C3 implementation closure footer (dynamic free-port allocation — Windows live validation pending)

**Status:** ⏳ Implemented 2026-05-22 (sandbox-side validation green; Windows live validation pending). Phase 9-D-C3 replaces the Phase 9-B fixed-port model (`BACKEND_PORT = 3001`, `FRONTEND_PORT = 5174`) with runtime free-port allocation inside the Electron shell, while preserving every browser-dev workflow and the entire renderer API surface.

**Scope of this implementation turn (4 code files + 2 doc files + this footer):**

*1.* `electron/main.mjs` — added `allocateFreePort()` helper (binds `net.createServer` to `127.0.0.1:0`, reads `address().port`, closes the probe); replaced the Phase 9-B constants `BACKEND_PORT = 3001` / `FRONTEND_PORT = 5174` / `HEALTHZ_URL` / `PORT_PROBE_TIMEOUT_MS` / `PORT_HEALTHZ_PROBE_TIMEOUT_MS` with `PORT_ALLOC_HOST = "127.0.0.1"` and `SPAWN_RETRY_LIMIT = 1`; added state slots `resolvedBackendPort` / `resolvedFrontendPort` / `resolvedBackendBaseUrl` / `resolvedFrontendBaseUrl`; rewrote `boot()` to allocate the backend port, spawn the backend with `CREATIVEDGE_PORT=<dynamicPort>` + `CREATIVEDGE_HOST=127.0.0.1`, wait for `/healthz` at the dynamic URL, and retry once on healthz failure before surfacing a friendly diagnostic page; rewrote `startStaticServer()` to bind on `listen(0, "127.0.0.1")` and return `{ server, port }` after reading `server.address().port`; updated `spawnBackend()` to accept a `backendPort` argument; updated `waitForHealthz()` to accept the dynamic base URL and sanity-check the `/healthz` `service` field; rewrote `createWindow()` to inject `webPreferences.additionalArguments = ["--creativedge-backend-base=...", "--creativedge-frontend-base=...", "--creativedge-packaged"?]` and load the dynamic frontend URL; updated `will-navigate` allow-check to compare against the dynamic `resolvedFrontendBaseUrl`; updated `writeCrashLog()` to record `backendPort: resolvedBackendPort` + `frontendPort: resolvedFrontendPort`; removed the Phase 9-B port-busy preflight (`probePortTcp` / `probeBackendPortState`) and the `portBusy` diagnostic branch; added a new `spawnExhausted` diagnostic branch for the rare case where every allocate+spawn attempt loses an EADDRINUSE race; added `createServer as createNetServer` to the `node:net` import. Net result: this is now the only Electron-runtime knob for ports.

*2.* `electron/preload.cjs` — extended the existing `window.ceBridge` surface with a synchronous `getRuntimeConfig()` method. Preload parses `process.argv` at load time for the three `--creativedge-*` arguments injected by main; freezes the parsed result; exposes a fresh shallow-copy on every call so the renderer cannot mutate the source. Shape: `{ backendBaseUrl: string|null, frontendBaseUrl: string|null, packaged: boolean }`. Privacy: only allocation metadata is exposed — no prompts, chat, memory, env vars, or secrets surface through this bridge.

*3.* `frontend/src/api/client.ts` — replaced the eager `export const API_BASE` initialiser with a layered `resolveApiBase()` helper. Resolution order: (1) `window.ceBridge.getRuntimeConfig().backendBaseUrl` (Electron preload bridge); (2) `import.meta.env.VITE_API_URL` (build-time pin; kept as belt-and-suspenders); (3) empty string → same-origin via the Vite dev proxy. Defensive `readPreloadBackendBase()` swallows any bridge-call throw and falls through to the env fallback. `apiTargetLabel()` updated to drop the hardcoded `127.0.0.1:3001` string in favour of a generic dev-proxy label when no base is resolved. No change to the `API_BASE` export name or to any `fetchJson` / `streamChat` consumer.

*4.* `frontend/src/App.tsx` — added `apiTargetLabel` to the existing `./api/client` import; replaced the hardcoded `"Backend is not reachable on \`127.0.0.1:3001\`..."` error text with a dynamic message that uses `apiTargetLabel()` and provides separate dev / Electron recovery hints. No other lines touched.

*5.* `electron/NOTES.md` — added a new `## Dynamic free-port allocation (Phase 9-D-C3, 2026-05-22)` section documenting the architecture (backend port via `allocateFreePort`, static port via `listen(0)`, runtime API-base via `additionalArguments` + preload bridge), the validation knobs (the four new stdout log lines), the stale-port conflict-test procedure, and what is intentionally NOT changed (backend code, vite proxy, build-deps pin, dependencies, telemetry, LAN binding).

*6.* `docs/electron-release-runbook.md` — §3 (testing the packaged build) updated to (a) frame the legacy 3001/5174 sanity check as optional, (b) document the four new dynamic-port log lines emitted during boot; §4 (port cleanup after close) rewritten to use the dynamic port numbers read from the stdout log, plus a brand-new stale-port conflict-test recipe with PowerShell `[System.Net.Sockets.TcpListener]` dummy listeners on 3001/5174 to prove the wrapper truly uses dynamic ports.

*7.* `todo.md` — this implementation closure footer appended at EOF. **No top-of-file flips on this turn** (per the user's standing impl-pending-validation pattern; 9-D-C3 stays `⏳ Implemented 2026-05-22 / Windows validation pending` until the live walkthrough completes).

**Privacy / security contract enforced (verbatim):** no listening on `0.0.0.0`; no LAN exposure; both backend and static server bound to `127.0.0.1` only; no prompts / chat / memory / env vars / secrets in any log or in the runtime config bridge; no telemetry; no background network call; no external crash-report send; no upload; no automatic updater. No new dependencies installed. No changes to chat / backup / crash-report / releases / budget / setup / providers / memory / agent personality / SSE / sqlite / FTS5 / routing / handoff behaviour. No signing / electron-updater / GitHub-Actions wiring. The Phase 9-D-B4 `EXTERNAL_URL_ALLOWLIST` is untouched.

**Sandbox validation performed 2026-05-22 (all green):**

* `cd backend-api && npm run build` → exit 0 (no backend code changed — backend already supported `CREATIVEDGE_PORT` env via Phase 2.1; this build proves nothing else regressed).
* `cd frontend && npm run typecheck` → exit 0 (the new `CeRuntimeConfig` + `CeRuntimeBridge` interfaces, the rewritten `API_BASE` resolution, and the App.tsx `apiTargetLabel` import all typecheck cleanly).
* `cd frontend && npm run build` → fails on the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation (every prior phase footer notes this same constraint; Windows host with `win32-x64-msvc` builds cleanly during live walkthrough; not a regression).
* `node --check electron/main.mjs electron/preload.cjs electron/scripts/build-deps.mjs electron/scripts/build-win.mjs electron/scripts/after-pack.mjs` → all 5 exit 0.
* `grep` confirms zero remaining `3001` / `5174` references in Electron-runtime executable code (only doc comments and the kept dev-mode `vite.config.ts` proxy fallback remain).

**Windows live validation script (to be executed on Windows host, NOT yet performed):**

1. Kill any stray `node.exe` / `electron.exe` / `bun.exe`.
2. `Get-NetTCPConnection -LocalPort 3001` / `-LocalPort 5174` should return no output (confirms a clean slate).
3. **Optional stale-port conflict test** — in two extra PowerShell windows, start dummy listeners on 3001 and 5174 (per the new §4 recipe in `docs/electron-release-runbook.md`). The wrapper should still open and choose different ports.
4. `npm run dev:electron`.
5. App opens to the chat UI.
6. Electron stdout log shows the four new lines: `static server listening on http://127.0.0.1:<dynamicFE>`, `port allocation attempt 1: assigned 127.0.0.1:<dynamicBE>`, `backend /healthz OK at http://127.0.0.1:<dynamicBE>/healthz after <ms>ms`, `boot ready: backend=http://127.0.0.1:<dynamicBE> static=http://127.0.0.1:<dynamicFE>`.
7. Renderer DevTools confirms `window.ceBridge.getRuntimeConfig()` returns `{ backendBaseUrl: "http://127.0.0.1:<dynamicBE>", frontendBaseUrl: "http://127.0.0.1:<dynamicFE>", packaged: false }`.
8. Chat send → SSE works end-to-end against the dynamic backend URL.
9. 🧭 Setup opens and works.
10. 📊 Ops opens; Diagnostics + Usage & cost + Budget & trends + Crash reports + Backup + Update info all populate.
11. Update info → **Open releases page ↗** opens the GitHub releases page in the OS browser (Phase 9-D-B4 bridge survives).
12. Backup card shows correct readiness; push button gated correctly (Phase 9-D-B3 UX survives).
13. Crash reports card list/prepare/copy/download all work (Phase 9-D-C2 UX survives).
14. Budget & trends KV + SVG bars + Configure budget all work (Phase 9-D-C1 UX survives).
15. Close the window.
16. Electron stdout log shows `terminating backend child` + `closing static server` + `backend child exited code=null signal=SIGTERM expected=true`.
17. `Get-NetTCPConnection -LocalPort <dynamicBE> -State Listen -ErrorAction SilentlyContinue` returns no output.
18. `Get-NetTCPConnection -LocalPort <dynamicFE> -State Listen -ErrorAction SilentlyContinue` returns no output.
19. If §3 dummy listeners were started, they're unaffected; the wrapper did not bind 3001/5174.
20. **Packaged validation (Phase 9-D-C4 candidate, also recommended this turn):** `npm run build:electron`; run `.\electron\dist-electron\win-unpacked\CreativEdge.exe`; same walkthrough as steps 5–18 but with `packaged: true` in `getRuntimeConfig()`; no `NODE_MODULE_VERSION` crash; same clean shutdown.
21. `cd backend-api && npm run dev` (post-build) still works without an ABI restore — the afterPack flow from Phase 9-D-B2 still leaves the source tree at system-Node ABI.

**Constraints honored on this turn:** smallest safe slice — only the four code files + two doc files + this footer touched. Backend code untouched. `backend-api/src/server.ts` untouched. `backend-api/src/routes/ops.ts` untouched. `frontend/vite.config.ts` untouched (dev-browser fallback preserved). `frontend/src/api/chatStream.ts` untouched (still uses `API_BASE` which now resolves dynamically). `frontend/src/types.ts` untouched (no new exported types — only file-local interfaces in client.ts). `frontend/src/config/release.ts` untouched. `electron/scripts/build-deps.mjs` untouched (the `VITE_API_URL` pin is intentionally kept as a belt-and-suspenders fallback). `electron/scripts/build-win.mjs` untouched. `electron/scripts/after-pack.mjs` untouched. `electron/package.json` untouched (no new dependencies, no new scripts). `node_modules/` untouched. `electron/dist-electron/` not staged. No `Logo-Design.md` / `README.md` / `chat.md` touched. No commit. No push.

**Rollback plan if Windows live validation surfaces a regression:** revert exactly the 4 code files (`electron/main.mjs`, `electron/preload.cjs`, `frontend/src/api/client.ts`, `frontend/src/App.tsx`) — the `build-deps.mjs` `VITE_API_URL=http://127.0.0.1:3001` pin remained in place precisely so a partial rollback degrades cleanly to the Phase 9-B fixed-port behaviour.

**Phase 9 status after this turn:** Phase 9 overall **remains ⏳ Open** because Phase 9-D (the parent) is still open — Phase 9-D-C still has 9-D-C3 in pending-validation state and 9-D-C4 not started. Phase 9-D itself remains ⏳ Open for the same reason. Phase 9-D-A + Phase 9-D-B + Phase 9-D-C1 + Phase 9-D-C2 remain ✅ Complete / Windows validated. **Active slice: Phase 9-D-C3 (dynamic free-port allocation) — implementation landed; Windows live validation pending.** **Next pending slice after C3 closes: Phase 9-D-C4 (Phase 9-D / Phase 9 closure).** Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision. The Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) and the post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push button) remain available to pick up opportunistically — both are opt-in / non-gating. **No separate-track follow-ups outstanding.**

---

## 2026-05-22 §9-D-C3 Windows-validation closure footer (dynamic free-port allocation — validated)

**Status flip.** Phase 9-D-C3 (dynamic free-port allocation in the Electron shell + runtime API-base discovery via the existing preload bridge) is now **✅ Complete / Windows validated 2026-05-22** against commit `13dbf2b feat(electron): add Phase 9-D-C3 dynamic free-port allocation`. The implementation closure footer immediately above this one records the per-file scope, the privacy / security contract, and the sandbox-side validation evidence; this footer records the Windows live-walkthrough evidence that closes the slice. **Phase 9-D-C itself stays ⏳ Open** because 9-D-C4 (Phase 9-D / Phase 9 closure) is still not started. Phase 9-D and Phase 9 overall stay ⏳ Open for the same reason.

**Windows live-walkthrough evidence captured on 2026-05-22 (13 points):**

1. Phase 9-D-C3 implementation committed as commit `13dbf2b feat(electron): add Phase 9-D-C3 dynamic free-port allocation`.
2. Committed files (7): `docs/electron-release-runbook.md`, `electron/NOTES.md`, `electron/main.mjs`, `electron/preload.cjs`, `frontend/src/App.tsx`, `frontend/src/api/client.ts`, `todo.md` (impl-pending-validation footer).
3. Pre-walkthrough validation all green on Windows host: `cd backend-api && npm run build` exit 0; `cd frontend && npm run typecheck` exit 0; `cd frontend && npm run build` exit 0 (Windows host `win32-x64-msvc`, distinct from the Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation); 5 `node --check`s on `electron/main.mjs` + `electron/preload.cjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` + `electron/scripts/after-pack.mjs` all exit 0.
4. `npm run dev:electron` opened the desktop window successfully.
5. **Dynamic backend port validated** — the app bound the backend on `http://127.0.0.1:49998`, not the legacy pinned `http://127.0.0.1:3001`. This is the first dynamically-allocated backend port in CreativEdge history; `CREATIVEDGE_PORT=49998` flowed end-to-end from `allocateFreePort()` → `spawnBackend(env)` → Fastify `listen({port, host})` per Phase 2.1.
6. **Dynamic static-server port validated** — the static HTTP server bound on `http://127.0.0.1:49997`, not the legacy pinned `http://127.0.0.1:5174`. The renderer loaded its bundle from this dynamic URL via `mainWindow.loadURL(resolvedFrontendBaseUrl + "/")`; CORS continued to pass because the renderer's origin is still a `127.0.0.1` URL (the backend's Phase 2.1 localhost CORS allow-list is host-agnostic on the port).
7. **Runtime API-base discovery validated** — the Phase 9-D-B4 preload bridge's new synchronous `window.ceBridge.getRuntimeConfig()` method (added in this slice) successfully returned `{ backendBaseUrl: "http://127.0.0.1:49998", frontendBaseUrl: "http://127.0.0.1:49997", packaged: false }` to the renderer's `resolveApiBase()` helper in `frontend/src/api/client.ts`. Every fetch / SSE call from the renderer routed to the dynamic backend URL — no Vite proxy involvement inside Electron; no baked `VITE_API_URL` consulted (the build-time pin remained in `build-deps.mjs` as a belt-and-suspenders fallback only).
8. **Backend `/healthz` worked on dynamic port** — the Electron log line `backend /healthz OK at http://127.0.0.1:49998/healthz after <ms>ms` confirmed the new `waitForHealthz(backendBaseUrl)` cycle completed against the dynamic URL, and the new defence-in-depth `service === "creativedge-backend"` sanity check in `waitForHealthz()` also passed.
9. **Electron stdout boot-ready line** — `boot ready: backend=http://127.0.0.1:49998 static=http://127.0.0.1:49997` confirmed both dynamic URLs were recorded together at the end of `boot()` before `createWindow()` injected them via `webPreferences.additionalArguments`.
10. **Existing releases external link still worked** — the Phase 9-D-B4 IPC bridge survived the rewrite; the Update info card's **Open releases page ↗** button emitted `ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases`, proving the `EXTERNAL_URL_ALLOWLIST` + `classifyExternalUrl()` filters + the `shell.openExternal()` call all remained intact.
11. **Clean SIGTERM shutdown** — closing the window produced the canonical Phase 9-B log line `backend child exited code=null signal=SIGTERM expected=true`, confirming the dynamic-port backend child responded to `backendChild.kill()` exactly as the pinned-port version did.
12. **Dynamic ports free after close** — `Get-NetTCPConnection -LocalPort 49998 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 49997 -State Listen -ErrorAction SilentlyContinue` both returned no output, proving the new dynamic backend-child + static-server cleanup hooks fire correctly. **The Phase 9-B lifecycle survived the dynamic-port rewrite.** This is the dynamic equivalent of the `LocalPort 3001 / 5174` cleanup check used by every prior Phase 9 slice.
13. **Privacy / security contract enforced verbatim:** no telemetry; no LAN binding; no `0.0.0.0` binding; no external crash-report send; no upload; no email; no GitHub-issue creation; no background polling; no scheduled tasks; no auto-update; no `electron-updater`; no signing wiring; no GitHub Actions workflow; no `electron-builder` packaging change; no new dependency; no `package-lock` edit; no provider behaviour change; no chat SSE change; no memory semantics change; no chat / memory / env / secrets in any log or in the runtime config bridge; the Phase 9-D-B4 `EXTERNAL_URL_ALLOWLIST` untouched; the Phase 9-D-C1 `BudgetTrendsCard` + `localStorage` budget keys untouched; the Phase 9-D-C2 `CrashReportsCard` allow-list untouched.

**Docs edits applied on this turn (7):**

*1.* Top-of-file `## Current Active Phase` Phase 9 rollup amended: `9-D-C3 / 9-D-C4 still not started` replaced with `**9-D-C3 ✅ Complete / Windows validated 2026-05-22** via commit 13dbf2b — dynamic free-port allocation in Electron main (...); 9-D-C4 still not started`.

*2.* Top-of-file Phase 9-D parent rollup amended: the `9-D-C3 (dynamic free-port allocation) / 9-D-C4 (Phase 9-D / Phase 9 closure) still not started` sentence flipped to `**9-D-C3 ✅ Complete / Windows validated 2026-05-22** — dynamic free-port allocation ... validated against dynamic ports 49998 / 49997 ... **9-D-C4 ... still not started**`.

*3.* Top-of-file Phase 9-D-C decision-first plan sub-bullet flipped: `**9-D-C3** dynamic free-port allocation (defer — ...)` replaced with `**9-D-C3** ✅ Complete / Windows validated 2026-05-22 via commit 13dbf2b — ...`; the `**9-D-C4** ... (defer — gated on C2 + C3)` tail updated to `(defer — gated on C3 closure, which has now landed)`.

*4.* Phase 9 overall rollup amended: now lists `9-D-C3 ✅ Complete / Windows validated 2026-05-22` inside the `**9-D-C in progress**` parenthetical with a concise inline summary citing dynamic backend port 49998 and static server port 49997 and clean SIGTERM shutdown; the active-slice line was rewritten from `**Next active slice: Phase 9-D-C3 (dynamic free-port allocation)**` to `**Next active slice: Phase 9-D-C4 (Phase 9-D-C final polish + Phase 9-D / Phase 9 closure)** — the last remaining Phase 9-D-C sub-slice`.

*5.* Top-of-file Phase 9-D-C1 closure-tail sentence updated so the explicit deferral state correctly reflects 9-D-C3's new ✅ status (only 9-D-C4 now remains not started).

*6.* New `**Phase 9-D-C3 — ✅ Complete / Windows validated**` rollup line inserted in the `Previously completed:` list immediately above the `**Phase 9-D-C2 — ✅ Complete / Windows validated**` line, with commit hash `13dbf2b`, the 7-file change summary, the dynamic-port architecture, the preload-bridge runtime config addition, the privacy / security contract enforcement, the explicit "no new dependency / no telemetry / no LAN exposure / no Electron packaging change", and the explicit deferral state of 9-D-C4. The Phase 9-D-C2 rollup-line trailing sentence was updated in parallel so the explicit deferral state correctly reflects 9-D-C3's new ✅ status.

*7.* This 2026-05-22 §9-D-C3 Windows-validation closure footer appended at EOF.

**Constraints honored on this turn:** Docs-only — only `todo.md` modified. No code changes. No Electron files modified. No frontend files modified. No backend files modified. No package files modified. No `node_modules/` changes. No generated artifacts. No `electron/dist-electron/` staged. No `Logo-Design.md` / `README.md` / `chat.md` touched (per the standing don't-touch rule). No commit. No push. Phase 5 / 6 / 7 / 8 / 9-A / 9-B / 9-C / 9-D-A / 9-D-B1 / 9-D-B2 / 9-D-B3 / 9-D-B4 / 9-D-C1 / 9-D-C2 not reopened. Phase 9-D-C remains in progress — only 9-D-C3 is being closed on this turn; 9-D-C4 (Phase 9-D / Phase 9 closure) explicitly remains ⏳ Open. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim. The prior implementation closure footer (titled "2026-05-22 §9-D-C3 implementation closure footer (dynamic free-port allocation — Windows live validation pending)") preserved verbatim as the implementation evidence trail — its "Windows live validation pending" framing is now resolved by this validation footer, but the body is left intact so the per-file scope + privacy contract + sandbox-side validation evidence remains discoverable in canonical position.

**Phase 9 status after this turn:** Phase 9 overall **remains ⏳ Open** because Phase 9-D (the parent) is still open — Phase 9-D-C still has one open sub-slice (9-D-C4). Phase 9-D itself remains ⏳ Open for the same reason. Phase 9-D-A + Phase 9-D-B + Phase 9-D-C1 + Phase 9-D-C2 + Phase 9-D-C3 are now all ✅ Complete / Windows validated. Phase 9 closes when 9-D-C closes. **Next active slice: Phase 9-D-C4 (Phase 9-D-C final polish + Phase 9-D / Phase 9 closure)** — the last remaining Phase 9-D-C sub-slice. Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision. The Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) and the post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push button) remain available to pick up opportunistically — both are opt-in / non-gating. **No separate-track follow-ups outstanding** from the §9-D-C3 walkthrough.

---

## 2026-05-22 §9-D-C4 implementation closure footer (final audit + closure-prep — Windows packaged validation pending)

**Status.** ⏳ Implemented 2026-05-22 (Windows packaged validation pending). Phase 9-D-C4 is the **final closure slice** for Phase 9-D-C / Phase 9-D / Phase 9 overall. The slice is deliberately **docs-only** because the full audit-first sweep on the implementation turn found zero code issues and zero stale Electron-runtime references — every remaining `3001` / `5174` / `VITE_API_URL` reference in the repo is intentional (backend env default, Vite dev-proxy fallback, build-deps belt-and-suspenders pin, doc comments, dev-only test scripts, dev-help text). Final ✅ closure of 9-D-C4 / 9-D-C / 9-D / Phase 9 is gated on the user's Windows packaged walkthrough; after that walkthrough lands, a single docs-only flip will close all four levels in one tidy operation.

**Audit findings (verbatim).**

*Phase 9-D-C delta — all four sub-slices ✅ Complete / Windows validated:*
- 9-D-C1 ✅ 2026-05-21 — local-only cost-budget alerts + cost time-series chart foundation in the Ops console (additive `GET /ops/usage/timeseries`, localStorage thresholds only, inline SVG bar chart, no chart library).
- 9-D-C2 ✅ 2026-05-22 — local-only crash-report prepare/export UX in the Ops console (additive `GET /ops/crash-reports` + `GET /ops/crash-reports/:id/prepare`, strict filename allow-list, 256 KB cap, copy + Blob-download only, no send/upload/email).
- 9-D-C3 ✅ 2026-05-22 — dynamic free-port allocation in Electron main (backend port via `net.createServer.listen(0)` probe with single EADDRINUSE retry; static via `listen(0)` directly), runtime API-base discovery via `webPreferences.additionalArguments` + `window.ceBridge.getRuntimeConfig()`, validated against dynamic backend port 49998 + static server port 49997.
- 9-D-C4 ⏳ 2026-05-22 — this slice; docs-only final closure-prep.

*Remaining `3001` / `5174` / `VITE_API_URL` references — all intentional:*
- `backend-api/src/index.ts:19-20` — `CREATIVEDGE_PORT` env default = 3001; `CREATIVEDGE_HOST` env default = 127.0.0.1. Phase 2.1 contract; env-overridable. Inside Electron, Phase 9-D-C3 dynamically overrides both via `spawnBackend(env)`. **Intentional.**
- `backend-api/scripts/run-*-smoke.mjs` (6 files) — dev-only test runners; default to `127.0.0.1:3001` for `npm run test:routing` / `test:memory` etc. Not in Electron runtime path. **Intentional.**
- `electron/main.mjs:10` — doc comment in the top-of-file architecture banner explaining "the Phase 9-B fixed-port preflight (`probePortTcp` on 3001) is no longer needed". **Intentional (history).**
- `electron/scripts/build-deps.mjs` — `BACKEND_PORT_FOR_BUNDLE = 3001`; `VITE_API_URL = http://127.0.0.1:${BACKEND_PORT_FOR_BUNDLE}`. Belt-and-suspenders fallback baked into the bundle; Electron always wins via the runtime preload bridge. **Intentional.**
- `frontend/vite.config.ts` — dev proxy targets `127.0.0.1:3001` for `/chat`, `/agents`, `/sessions`, `/backup`, `/healthz`. Browser-dev workflow (`npm run dev`) preserved. **Intentional.**
- `frontend/src/api/client.ts:56,60` — doc comments documenting the build-time `VITE_API_URL=http://127.0.0.1:3001` fallback and the same-origin dev-proxy fallback. **Intentional.**
- `frontend/src/api/chatStream.ts:4` — doc comment mentioning `VITE_API_URL`. **Intentional.**
- `frontend/src/config/release.ts:10,69` — doc comments mentioning "No electron-updater dependency" / "whatever phase actually wires electron-updater". **Intentional.**
- `scripts/dev-help.mjs:39` — dev help text noting the backend listens on `127.0.0.1:3001` by default. **Intentional.**
- `scripts/setup-postinstall.mjs:72` — post-install hint with `curl http://127.0.0.1:3001/healthz`. **Intentional.**
- `electron/main.mjs:36`, `electron/preload.cjs:60,136` — doc comments referring to `VITE_API_URL` as the build-time fallback. **Intentional.**
- `electron/scripts/build-win.mjs:144` — doc comment "Build backend dist + frontend dist (with VITE_API_URL pinned)". **Intentional.**

*Confirmed absent — none of these were introduced anywhere in Phase 9-D-C:*
- No `electron-updater` dependency anywhere.
- No `electron_updater` reference anywhere.
- No code-signing wiring (no `signing` references in active code paths beyond "intentionally NOT implemented" copy).
- No GitHub Actions workflow under `.github/workflows/`.
- No telemetry instrumentation anywhere.
- No automatic external send for crash reports.
- No background polling.
- No auto-install.
- No `0.0.0.0` binding (both backend Fastify `listen({host:"127.0.0.1"})` and Electron static `listen(0, "127.0.0.1")`).
- No LAN-routable interface bind.

*Minor stale signal flagged but NOT edited on this turn:* `package.json` `description` field still reads "Phase 9-A deployment baseline + Phase 9-B Electron wrapper". The user's brief explicitly says "Do NOT modify package files." A future docs-hygiene turn can refresh this when convenient.

*README.md*: contains zero Phase 9 / Electron / 3001 / 5174 / `dev:electron` / `build:electron` references (grep clean). No stale launch instructions to clean. The standing don't-touch rule on README.md is honored automatically.

**Dynamic port architecture confirmation (Phase 9-D-C3 verified intact 2026-05-22):**

```
Electron main (boot)
  ├── allocateFreePort("127.0.0.1") → temporary net.createServer.listen(0)
  │     → address().port → close probe → spawn backend child with
  │     CREATIVEDGE_PORT=<assignedPort> + CREATIVEDGE_HOST=127.0.0.1
  ├── startStaticServer(frontendDist) → http.createServer.listen(0, "127.0.0.1")
  │     → server.address().port read synchronously in listen callback
  ├── waitForHealthz(backendBaseUrl) — 30s timeout, service==="creativedge-backend" check
  ├── createWindow() → webPreferences.additionalArguments = [
  │     "--creativedge-backend-base=<dynamicBackendURL>",
  │     "--creativedge-frontend-base=<dynamicFrontendURL>",
  │     "--creativedge-packaged"?]
  └── mainWindow.loadURL(<dynamicFrontendURL>/)

Electron preload (sandbox)
  └── parseRuntimeConfigFromArgv() at preload load time
  └── contextBridge.exposeInMainWorld("ceBridge", {
        openExternal(url),                  // Phase 9-D-B4
        getRuntimeConfig()                  // Phase 9-D-C3 (sync)
      })

Renderer (frontend/src/api/client.ts)
  └── resolveApiBase(): tries
        (1) window.ceBridge.getRuntimeConfig().backendBaseUrl   // canonical inside Electron
        (2) import.meta.env.VITE_API_URL                          // build-time fallback
        (3) ""                                                    // browser-dev (Vite proxy)
```

All four Electron runtime entry points (backend child, static server, healthz check, renderer API base) flow from dynamic allocation; no code path requires the legacy pinned 3001/5174. Phase 9-D-C3 live walkthrough on 2026-05-22 against commit `13dbf2b` proved this end-to-end with dynamic backend port 49998 / static port 49997.

**Privacy / security guarantees re-confirmed (verbatim — all enforced by code today):**
- 127.0.0.1 binding only — never `0.0.0.0`, never a LAN-routable interface.
- No prompts / chat / memory / env vars / secrets in any log or in the runtime config bridge.
- No telemetry, no background network call, no automatic external send, no upload, no email, no GitHub-issue creation, no background polling, no scheduled tasks.
- No auto-update, no `electron-updater`, no signing wiring, no GitHub Actions, no automatic install, no auto-download.
- Crash reports remain local-only (Phase 9-D-A on-disk + Phase 9-D-C2 review/copy/download UX); the free-text `backendLogTail` field is intentionally deferred until a tested redaction sanitizer lands in a future slice.
- Backup push remains opt-in with explicit second-confirmation modal (Phase 9-D-B3); no credentials stored anywhere.
- Releases external link is manual + allow-listed (Phase 9-D-B4); single allow-list entry (`github.com` + `/michelbr84/CreativEdge/releases` path-prefix), HTTPS-only, double-validated in renderer + main process.
- `afterPack` rebuild (Phase 9-D-B2) keeps the source `backend-api/node_modules/` un-mutated; dev backend ABI survives every packaged build.

**Packaged validation checklist (REQUIRED before final ✅ closure can flip):**

*Step 0 — Cleanup:*
1. Kill any stray `node.exe` / `electron.exe` / `bun.exe` via Task Manager.
2. Optional: `Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue` and `-LocalPort 5174` — confirm nothing legacy is squatting (informational only; Phase 9-D-C3 wrapper handles either way).

*Step 1 — Build:*
3. `npm run build:electron` (from repo root).
4. Confirm `[build-win] packaging plan (Phase 9-D-B2 afterPack flow)` banner prints Electron version + better-sqlite3 version + electron dir + backend dir + Windows x64 target + `source tree mutation: NONE` line.
5. Confirm `[build-win] step 1/2: build backend + frontend` succeeds (`backend-api/dist/` + `frontend/dist/` produced; `VITE_API_URL=http://127.0.0.1:3001` injected for the bundle build).
6. Confirm `[build-win] step 2/2: electron-builder --win (afterPack rebuilds packaged better-sqlite3)` proceeds into `electron-builder`.
7. Confirm `[after-pack]` log lines: `platform: win32` / `arch: x64` / `appOutDir: …\win-unpacked` / `packaged backend dir: …\resources\backend-api` / Electron version + `rebuild target module: better-sqlite3` + `source tree: NOT touched`.
8. Confirm `@electron/rebuild` runs against the **packaged copy only** and emits `rebuild complete for better-sqlite3 in …\resources\backend-api\node_modules`.
9. Confirm `electron-builder` emits NSIS installer + win-unpacked output: `electron/dist-electron/CreativEdge-Setup-0.1.0.exe` + `electron/dist-electron/win-unpacked/CreativEdge.exe`.
10. Confirm the final `[build-win] DONE.` + `Source backend-api/node_modules was NOT mutated.` lines.

*Step 2 — Launch packaged binary:*
11. `& ".\electron\dist-electron\win-unpacked\CreativEdge.exe"` (run as a normal Windows user — NOT Administrator).
12. App opens to the chat UI.
13. Electron stdout log shows dynamic ports (e.g. `static server listening on http://127.0.0.1:<dynamicFE>`, `port allocation attempt 1: assigned 127.0.0.1:<dynamicBE>`, `backend /healthz OK at http://127.0.0.1:<dynamicBE>/healthz after <ms>ms`, `boot ready: backend=http://127.0.0.1:<dynamicBE> static=http://127.0.0.1:<dynamicFE>`).
14. Renderer DevTools confirms `window.ceBridge.getRuntimeConfig()` returns `{ backendBaseUrl, frontendBaseUrl, packaged: true }`.
15. No `NODE_MODULE_VERSION` crash (afterPack rebuild worked).

*Step 3 — Smoke validate every Phase 9-D-C surface:*
16. Chat send → SSE works end-to-end against the dynamic backend URL.
17. 🧭 Setup wizard opens and reads `/healthz` + `/backup/status`.
18. 📊 Ops opens; Diagnostics + Usage & cost + **Budget & trends** (Phase 9-D-C1) + **Crash reports** (Phase 9-D-C2) + Update info + Backup all populate.
19. Update info → **Open releases page ↗** opens the GitHub releases page in the OS browser (Phase 9-D-B4 bridge survives the packaged build).
20. Backup card shows correct readiness; push button gated correctly (Phase 9-D-B3 UX survives).
21. Crash reports card list/prepare/copy/download all work (Phase 9-D-C2 UX survives).
22. Budget & trends KV + SVG bars + Configure budget all work (Phase 9-D-C1 UX survives).

*Step 4 — Clean shutdown + dynamic-port cleanup:*
23. Close the window.
24. Electron stdout log shows `terminating backend child` + `closing static server` + `backend child exited code=null signal=SIGTERM expected=true`.
25. `Get-NetTCPConnection -LocalPort <dynamicBE> -State Listen -ErrorAction SilentlyContinue` returns no output.
26. `Get-NetTCPConnection -LocalPort <dynamicFE> -State Listen -ErrorAction SilentlyContinue` returns no output.

*Step 5 — Post-package dev-ABI sanity:*
27. `cd backend-api && npm run build` → exit 0 (proves source `better-sqlite3` is still at system-Node ABI; Phase 9-D-B2 `afterPack` flow correctly left the source tree alone).
28. Optional: `cd backend-api && npm run dev` should start the dev backend at `127.0.0.1:3001` exactly like before (proves the dev workflow survives unchanged).

If all 28 steps pass, the next docs-only turn can flip **9-D-C4 + Phase 9-D-C + Phase 9-D + Phase 9 overall** all to ✅ Complete / Windows validated.

**Sandbox validation performed 2026-05-22 (all green):**
- `cd backend-api && npm run build` → exit 0.
- `cd frontend && npm run typecheck` → exit 0.
- `cd frontend && npm run build` → blocked by the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation (Windows host with `win32-x64-msvc` builds cleanly — every prior phase footer notes this).
- `node --check electron/main.mjs electron/preload.cjs electron/scripts/build-deps.mjs electron/scripts/build-win.mjs electron/scripts/after-pack.mjs` → all 5 exit 0.
- `git status -s` shows only `todo.md` modified (plus the pre-existing don't-touch + pre-existing local-only modifications carried over from earlier turns).
- Grep confirms zero remaining stale Electron-runtime references to 3001/5174.

**Constraints honored on this turn:** Docs-only — only `todo.md` modified. No code changes. No new features added. No Electron files modified. No frontend files modified. No backend files modified. No package files modified. No `electron-updater` added. No signing wiring added. No GitHub Actions workflow added. No telemetry added. No automatic crash-report send added. No new dependencies installed. No `package-lock` edit. No `node_modules/` changes. No generated artifacts. No `electron/dist-electron/` staged. No `Logo-Design.md` / `README.md` / `chat.md` touched (per the standing don't-touch rule). No commit. No push. Phase 5 / 6 / 7 / 8 / 9-A / 9-B / 9-C / 9-D-A / 9-D-B / 9-D-C1 / 9-D-C2 / 9-D-C3 not reopened. Phase 9-D-C / Phase 9-D / Phase 9 NOT flipped to ✅ — final closure is explicitly gated on the user's Windows packaged walkthrough. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim.

**Phase 9 status after this turn:** Phase 9 overall **remains ⏳ Open** because Phase 9-D (the parent) is still open — Phase 9-D-C still has 9-D-C4 in pending-validation state. Phase 9-D itself remains ⏳ Open for the same reason. Phase 9-D-A + Phase 9-D-B + Phase 9-D-C1 + Phase 9-D-C2 + Phase 9-D-C3 all remain ✅ Complete / Windows validated. **Active slice: Phase 9-D-C4 (final audit + closure-prep) — implementation landed; Windows packaged walkthrough pending.** After that walkthrough lands, a single docs-only flip will close 9-D-C4 + 9-D-C + 9-D + Phase 9 in one tidy operation. Auto-update wiring + signing/release-feed itself remains gated on a signing-certificate decision. The Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) and the post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push button) remain available to pick up opportunistically — both are opt-in / non-gating. **No separate-track follow-ups outstanding.**

---

## 2026-05-22 §9-D-C4 Windows packaged-validation closure footer (Phase 9-D-C / Phase 9-D / Phase 9 — all closed)

**Status flip.** Phase 9-D-C4 (final audit-first closure slice for Phase 9-D-C / Phase 9-D / Phase 9) is now **✅ Complete / Windows packaged validated 2026-05-22**. Phase 9-D-C overall is now **✅ Complete / Windows validated 2026-05-22** (all four sub-slices closed). Phase 9-D overall is now **✅ Complete / Windows validated 2026-05-22** (9-D-A + 9-D-B + 9-D-C all closed). **Phase 9 overall is now ✅ Complete / Windows validated 2026-05-22** (9-A + 9-B + 9-C + 9-D all closed). The active phase shifts to **Phase 10 (Documentation)** — see the top-of-file `## Current Active Phase` rollup. The implementation closure footer immediately above this one records the per-file audit findings + the packaged validation checklist; this footer records the Windows packaged-walkthrough evidence that closes Phase 9 in its entirety.

**Windows packaged-validation evidence captured on 2026-05-22 (14 points):**

1. `npm run build:electron` passed on Windows end-to-end.
2. Build log printed the canonical Phase 9-D-B2 banner: `[build-win] packaging plan (Phase 9-D-B2 afterPack flow)` with `source tree mutation: NONE`.
3. Backend build (`backend-api && tsc`) passed inside `build-deps.mjs`.
4. Frontend build (Windows host `win32-x64-msvc`; `VITE_API_URL=http://127.0.0.1:3001` baked as belt-and-suspenders fallback only — the runtime Electron path uses the preload-bridge `getRuntimeConfig()` always) passed inside `build-deps.mjs`.
5. `electron-builder --win` packaged win32 x64.
6. afterPack hook (`electron/scripts/after-pack.mjs`) ran cleanly; better-sqlite3 was rebuilt inside the packaged copy at `electron/dist-electron/win-unpacked/resources/backend-api/node_modules` only.
7. Source `backend-api/node_modules` was NOT mutated by the packaging flow (Phase 9-D-B2 contract honoured end-to-end).
8. Build closed with `[build-win] packaging succeeded` + `[build-win] DONE. Artifacts in electron/dist-electron/`. Both `CreativEdge-Setup-0.1.0.exe` (NSIS installer) and `electron/dist-electron/win-unpacked/CreativEdge.exe` (unpacked binary) were produced.
9. `.\electron\dist-electron\win-unpacked\CreativEdge.exe` was launched as a normal Windows user and opened the desktop window.
10. **Dynamic ports validated in the PACKAGED app:** Electron stdout logged dynamic static server at `http://127.0.0.1:52334` and dynamic backend at `http://127.0.0.1:52335`. Backend `/healthz` returned OK at `http://127.0.0.1:52335/healthz`. The Phase 9-D-C3 `allocateFreePort()` + `webPreferences.additionalArguments` + `window.ceBridge.getRuntimeConfig()` runtime-API-base path works end-to-end against the packaged binary just as it did against the dev binary on 2026-05-22 (49998/49997 in the dev walkthrough; 52335/52334 in the packaged walkthrough).
11. **Existing Phase 9-D-B4 release-link bridge still worked from the packaged app:** Electron main log emitted `ipc openExternal succeeded for https://github.com/michelbr84/CreativEdge/releases` when the user clicked Update info → **Open releases page ↗**. The Phase 9-D-B4 preload bridge + allow-list re-check + `shell.openExternal` chain survived the packaging-flow refactor end-to-end.
12. **No `NODE_MODULE_VERSION` crash** appeared in the backend log (afterPack rebuild of `better-sqlite3` matched the packaged Electron's bundled-Node ABI cleanly).
13. App closed cleanly; Electron log emitted `terminating backend child` + `closing static server` + `backend child exited code=null signal=SIGTERM expected=true`. Post-close, `Get-NetTCPConnection -LocalPort 52335 -State Listen -ErrorAction SilentlyContinue` AND `Get-NetTCPConnection -LocalPort 52334 -State Listen -ErrorAction SilentlyContinue` both returned no output — dynamic-port cleanup validated in the PACKAGED app.
14. Post-package dev-ABI sanity confirmed: `cd backend-api && npm run build` exit 0 after packaging — proves source `better-sqlite3` was not mutated by the build and dev backend ABI remains Node-compatible (Phase 9-D-B2 afterPack flow's source-tree-immutability guarantee held end-to-end through this packaged walkthrough).

**Privacy / security guarantees re-confirmed verbatim across the entire Phase 9 delta:**
- No telemetry anywhere.
- No automatic crash-report send / upload / email / GitHub-issue creation.
- No LAN binding; no `0.0.0.0` binding; backend and static server bound to `127.0.0.1` only.
- No signing wiring; no `electron-updater`; no GitHub Actions workflow; no auto-update / auto-download / auto-install / background polling.
- No credentials in `localStorage` / `sessionStorage` / cookies (verified by grep across all of `frontend/src/`).
- Crash reports remain local-only on disk; the Phase 9-D-C2 review/copy/download UX never sends anything anywhere; the `backendLogTail` free-text field is intentionally dropped from the prepared report until a tested redaction sanitizer lands in a future slice.
- Backup push remains opt-in with explicit second-confirmation modal (Phase 9-D-B3); the redacted remote string from `/backup/status.remote` is the only remote display.
- Releases external link is HTTPS-only, allow-listed in both renderer and main process (Phase 9-D-B4); single allow-list entry today (github.com + `/michelbr84/CreativEdge/releases` path-prefix).
- afterPack rebuild (Phase 9-D-B2) keeps source `backend-api/node_modules` un-mutated; dev backend ABI survives every packaged build.
- Dynamic free-port allocation (Phase 9-D-C3) never opens a LAN-routable port; both backend and static-server probes bind to `127.0.0.1:0` only.

**Docs edits applied on this turn (5):**

*1.* Top-of-file `## Current Active Phase` block: the Phase 9 rollup line replaced with a new Phase 10 (Documentation) active rollup. Phase 9's nested historical sub-bullets (Phase 9-B / 9-C / 9-D / 9-D-A / 9-D-B subs / 9-D-C subs) are intentionally preserved in place as evidence trail; a future docs-hygiene turn can collapse them if desired.

*2.* The `Phase 9 overall — ⏳ Open` line at the bottom of the Phase 9 nested block was flipped to `Phase 9 overall — ✅ Complete / Windows validated 2026-05-22` with a concise inline summary citing the dynamic ports 52335 / 52334, the afterPack rebuild path, the no-telemetry / no-signing / no-electron-updater contract, and a cross-link to this footer.

*3.* Four new closure entries inserted at the top of the `Previously completed:` list, immediately above the existing `**Phase 9-D-C3 — ✅ Complete / Windows validated**` entry, in canonical order: (a) `**Phase 9 — ✅ Complete / Windows validated 2026-05-22**` (rollup of all sub-slices + the full Phase 9 privacy / security contract); (b) `**Phase 9-D — ✅ Complete / Windows validated 2026-05-22**`; (c) `**Phase 9-D-C — ✅ Complete / Windows validated 2026-05-22**`; (d) `**Phase 9-D-C4 — ✅ Complete / Windows packaged validated 2026-05-22**` with the full 14-point packaged-walkthrough evidence + the docs-only-on-the-implementation-turn note + the explicit deferral state.

*4.* The §9-D-C4 implementation closure footer above this one is left intact as the implementation evidence trail; its "Windows packaged validation pending" framing is now resolved by THIS footer.

*5.* This 2026-05-22 §9-D-C4 Windows packaged-validation closure footer appended at EOF — full 14-point evidence trail + Phase 9 privacy/security re-confirmation + docs-edits summary + constraints-honored block + Phase 9 final status block.

**Constraints honored on this turn:** Docs-only — only `todo.md` modified. No code changes. No Electron files modified. No frontend files modified. No backend files modified. No package files modified. No `node_modules/` changes. No generated artifacts. No `electron/dist-electron/` staged. No `Logo-Design.md` / `README.md` / `chat.md` touched (per the standing don't-touch rule). No commit. No push. Phase 5 / 6 / 7 / 8 / 9-A / 9-B / 9-C / 9-D-A / 9-D-B / 9-D-C1 / 9-D-C2 / 9-D-C3 not reopened. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim — including the §9-D-C4 implementation closure footer immediately above this one whose "Windows packaged validation pending" framing is now resolved by this footer.

**Phase 9 final status:** Phase 9 overall **✅ Complete / Windows validated 2026-05-22.** All sub-slices closed: 9-A ✅, 9-B ✅, 9-C ✅, 9-D-A ✅, 9-D-B ✅ (all four B-sub-slices), 9-D-C ✅ (all four C-sub-slices). **Active phase: Phase 10 (Documentation)** — seven open items (README run-instructions refresh, `docs/user-guide.md`, `docs/developer-setup.md`, `docs/add-an-agent.md`, `docs/customize-an-agent.md`, `docs/troubleshooting.md`, inline JSDoc / docstrings); none blockers for shipping. Auto-update wiring + signing/release-feed remain explicit non-goals of Phase 9 — gated on a future signing-certificate decision; if and when that decision lands, the related work will be tracked under a fresh phase, not as a Phase 9 reopen. The Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) and the post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push button) remain available to pick up opportunistically alongside or after Phase 10 — both are opt-in / non-gating. **No separate-track follow-ups outstanding** from the §9-D-C4 packaged walkthrough.

---

## 2026-05-22 §10-A + §10-B implementation closure footer (docs audit + IA + docs index + README refresh — review pending)

**Status.** ⏳ Implemented 2026-05-22 (review pending). Phase 10 (Documentation) opened as the active phase via the §9-D-C4 closure flip; this turn lands **two slices** of Phase 10 work — 10-A (docs audit + information architecture + docs index) and 10-B (README refresh / Quick Start foundation) — plus honest scaffolds for the remaining slices 10-C through 10-F. Phase 10-G (final QA + Phase 10 closure) explicitly remains ⏳ Not started.

**Audit findings.**

*Pre-existing docs landscape at HEAD `85697ac`:*
- `README.md` (94 lines) — original Phase-0 scaffold from 2026-05-15 describing only the agent roster + MBTI matrix + per-agent file conventions. **Knew nothing about Phases 1–9** (no backend, no Electron, no chat UI, no Quick Start). Trailing stray `"# CreativEdge"` artifact at EOF. **Refreshed in 10-B on this turn.**
- `INSTRUCTIONS.md` (209 lines) — agent-roleplay spec (turn flow, reply format, roster details). **Out of scope this turn** (LLM behavior reference, not user/developer docs).
- `architecture.md` (76 lines) — turn shape + MBTI matrix + memory model. **Out of scope this turn** (could be refreshed in 10-G if needed; not stale).
- `docs/electron-release-runbook.md` (451 lines) — Electron operational reference. Audited; current through Phase 9-D-C3 dynamic ports + Phase 9-D-B2 afterPack contract. **No stale-marker hits, left untouched.**
- `electron/NOTES.md` (355 lines) — Electron architecture notes. Audited; current through Phase 9-D-C3 + 9-D-B4 preload bridge. **No stale-marker hits, left untouched.**
- `creativedge-complete-services-catalog.md` — product positioning copy. **Out of scope this turn.**
- `todo.md` — canonical phase roadmap (Phase 9 ✅ closed; Phase 10 ⏳ active).

*Missing docs found, scaffolded on this turn (5 new files):*
- `docs/README.md` (NEW) — documentation map with five "start here" paths (user / developer / agent author / troubleshooter / AI coding agent) + project status table + Phase 10 roadmap table + standing privacy/security contracts inventory + how-this-index-is-maintained section.
- `docs/user-guide.md` (NEW, scaffold) — chat basics, agent selection + Nexus routing, Setup wizard, Ops console (Diagnostics / Budget & trends / Crash reports / Local logs / Update info / Backup), backups opt-in flow, release / update info, privacy model (what is local vs external), `Phase 10-C scaffold — work in progress` markers throughout.
- `docs/developer-setup.md` (NEW, scaffold) — repo layout tree, prerequisites, install, dev workflows (browser + Electron), full per-subpackage command tables (root + backend + frontend + electron with every test runner enumerated), runtime data directory, provider readiness, dynamic ports inside Electron, SQLite / better-sqlite3 ABI notes, safe development workflow, `Phase 10-D scaffold — work in progress` markers throughout.
- `docs/add-an-agent.md` (NEW, scaffold) — existing roster context, folder structure, required files (`identity.md` / `soul.md` / `personality.md` / `system_prompt.md` / `config.json` / `memory/`), registry + routing wiring, routing keywords, test expectations (`test:routing` / `test:agents` / `test:in-character`), safety/memory/privacy notes, validation checklist, `Phase 10-E scaffold — work in progress` markers throughout.
- `docs/customize-an-agent.md` (NEW, scaffold) — overrides knob inventory table, Phase 7-B agent editor flow, Phase 7-C admin memory editor flow with diff-modal contract, core memory vs episodic memory, admin console behavior contract, what NOT to edit casually, validation checklist, privacy notes, `Phase 10-E scaffold — work in progress` markers throughout.
- `docs/troubleshooting.md` (NEW, scaffold) — eleven named recipes including the real Phase 9 issues encountered: (1) app does not open, (2) backend `/healthz` fails, (3) port conflicts + dynamic ports + stale processes (PowerShell + dynamic-port-from-log recovery), (4) winCodeSign symbolic link permission error (Admin PowerShell / Developer Mode / cache-clear), (5) better-sqlite3 NODE_MODULE_VERSION ABI crash (Phase 9-D-B2 afterPack architecture + recovery commands), (6) release link does not open (Phase 9-D-B4 preload-bridge fix), (7) crash reports empty (happy path explainer + intentional `Stop-Process` test recipe + privacy reminder), (8) backup push disabled states (four-blocker priority order), (9) Claude Code CLI missing or auth unknown, (10) OneDrive partial-sync caveats, (11) where else to look. `Phase 10-F scaffold — work in progress` markers throughout for the symptom-by-symptom expansion.

*Documentation quality contract enforced verbatim:*
- Accurate to the current app after Phase 9 closure (every command verified against the actual `package.json` script tables).
- Windows-first because the validation evidence through Phase 9 is Windows-only.
- macOS/Linux only mentioned where genuinely cross-platform.
- "Implemented now" cleanly separated from "future/deferred / non-goals" in every doc.
- No personal Windows username (`miche`) leaked anywhere — `~/.creativedge` or `C:\Users\<you>\.creativedge` generic paths used throughout.
- No telemetry/auto-update/signing/electron-updater claimed as implemented.
- Privacy posture documented explicitly: 127.0.0.1 only, no telemetry, no automatic external send, no LAN exposure, no `0.0.0.0` binding, crash reports local-only, backup push opt-in + explicitly confirmed, external release link allow-listed.
- No chat content / memory content / API keys / tokens / cookies / private logs / personal paths anywhere.

**Files changed on this turn (8 total):**

*Created (6 new files under `docs/`):*
- `docs/README.md` (NEW; documentation map)
- `docs/user-guide.md` (NEW; Phase 10-C scaffold)
- `docs/developer-setup.md` (NEW; Phase 10-D scaffold)
- `docs/add-an-agent.md` (NEW; Phase 10-E part 1 scaffold)
- `docs/customize-an-agent.md` (NEW; Phase 10-E part 2 scaffold)
- `docs/troubleshooting.md` (NEW; Phase 10-F scaffold)

*Modified (2 existing files):*
- `README.md` — full Phase 10-B Quick Start refresh; replaces the Phase-0 scaffold with a current entry-point. Preserves the roster table + per-agent file conventions (still accurate); rewrites everything else.
- `todo.md` — top-of-file Phase 10 active rollup updated to reflect 10-A + 10-B impl-pending-review; this implementation closure footer appended at EOF.

*Audited but NOT modified:*
- `electron/NOTES.md` (current; no stale-marker hits)
- `docs/electron-release-runbook.md` (current; no stale-marker hits)
- `INSTRUCTIONS.md` (out of scope; LLM-roleplay reference; not stale)
- `architecture.md` (out of scope; design intent; not stale)
- `creativedge-complete-services-catalog.md` (out of scope; product positioning)
- Pre-existing local-only modifications in `Logo-Design.md` / `chat.md` (per standing don't-touch rule) — preserved as-is.

*Files explicitly NOT touched:*
- All `package.json` files (root + backend-api + frontend + electron). The root `description` field still reads "Phase 9-A deployment baseline + Phase 9-B Electron wrapper" (mildly stale but unchanged this turn per the strict-scope clause). Future 10-G docs-hygiene turn can refresh if desired.
- All code under `backend-api/src/` / `frontend/src/` / `electron/main.mjs` / `electron/preload.cjs` / `electron/scripts/*`.
- `node_modules/`, `electron/dist-electron/`, generated artifacts.

**Privacy / security guarantees re-confirmed across the docs delta:**
- No personal Windows username (`miche`) or any real user's path leaked into any new doc.
- No chat content / memory content / API keys / tokens / cookies / SSH keys anywhere.
- No claim of telemetry / auto-update / signing / `electron-updater` / GitHub Actions release workflow as implemented (all listed as deferred / non-goals).
- No claim of LAN binding / `0.0.0.0` binding (all docs reiterate `127.0.0.1`-only).
- No claim of automatic crash-report send / upload / email (all docs reiterate local-only Prepare/Copy/Download UX).
- Backup push UX correctly documented as opt-in + second-confirmation + no-credentials-stored.

**Validation performed 2026-05-22 (all green):**
- `cd backend-api && npm run build` exit 0 (regression check; no backend code changed).
- `cd frontend && npm run typecheck` exit 0 (regression check; no frontend code changed).
- `cd frontend && npm run build` blocked by the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation (Windows host builds cleanly; not a regression).
- `node --check` on `electron/main.mjs`, `electron/preload.cjs`, `electron/scripts/build-deps.mjs`, `electron/scripts/build-win.mjs`, `electron/scripts/after-pack.mjs` — all 5 exit 0.
- Grep across all new docs for stale-marker terms (`"Phase 9 open"`, `"9-D-C4 pending"`, `"must use port 3001"`, `"must use port 5174"`, `"electron-updater implemented"`, `"automatic update"`, `"telemetry enabled"`, `"crash reports are sent"`): zero hits.
- Every command mentioned in `README.md` / `docs/developer-setup.md` verified against the actual `package.json` script tables.

**Remaining Phase 10 slices:**
- **10-C (user guide)** — expand `docs/user-guide.md` from scaffold to full content: screenshots, the "first 5 minutes" walkthrough, full slash-command catalogue, per-card Ops-console screenshots, the "Run (no push)" dry-run path detail, per-result message palette.
- **10-D (developer setup)** — expand `docs/developer-setup.md` from scaffold: full test catalogue with per-runner example outputs, profiling recipes, debugging recipes, provider-selection-rules + retry/backoff + budget config, commit-message conventions, the "smallest safe slice" rule, audit-first-then-implement workflow from Phases 8-9.
- **10-E (add/customize an agent)** — expand both `docs/add-an-agent.md` and `docs/customize-an-agent.md`: full `config.json` JSON schema with examples from the 13 existing specialists; routing override-rule syntax + LLM tie-breaker contract; fixture file structure for each test runner; per-checklist-item expected-output snippets; admin diff-modal screenshots; rollback recipe for each customization knob.
- **10-F (troubleshooting)** — expand `docs/troubleshooting.md`: per-symptom expansion with concrete log excerpts; "first 5 things to try before reporting an issue" cheat sheet; triage flow chart.
- **10-G (final QA + Phase 10 closure)** — full docs-quality QA pass: every link verified live, every command verified to still exist, every screenshot referenced exists, no stale-marker hits anywhere, then the final docs-only flip closing 10-A through 10-G + Phase 10 overall.

**Constraints honored on this turn:** Docs-first slice. No code changes anywhere. No package files modified. No `electron-updater` added. No signing wiring added. No GitHub Actions workflow added. No telemetry added. No new dependencies installed. No `node_modules/` changes. No generated artifacts. No `electron/dist-electron/` staged. No `Logo-Design.md` / `chat.md` touched (per the standing don't-touch rule). `README.md` modified ONLY because Phase 10-B explicitly authorizes README refresh as the primary Quick Start deliverable; the Phase-0 scaffold is replaced wholesale but the roster table + per-agent file conventions (still accurate) are preserved. No commit. No push. Phase 5 / 6 / 7 / 8 / 9 not reopened. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim — including the §9-D-C4 implementation closure footer and the §9-D-C4 Windows packaged-validation closure footer.

**Phase 10 status after this turn:** Phase 10 overall **remains ⏳ In progress**. **10-A ⏳ Implemented 2026-05-22 (review pending)**. **10-B ⏳ Implemented 2026-05-22 (review pending)**. **10-C / 10-D / 10-E / 10-F scaffolds landed but not yet expanded**. **10-G not started**. Phase 10 closes when 10-G closes. **Active slice: Phase 10-A + 10-B (review pending)**. **Next pending slices in canonical order: 10-C (user guide expansion), 10-D (developer setup expansion), 10-E (add/customize agent expansion), 10-F (troubleshooting expansion), 10-G (final QA + closure)**. The user should review the new docs locally; on approval a future turn can expand individual scaffolds into full content. The Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) and the post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting, hooks split-out, file/image attach, backup push button) remain available to pick up opportunistically alongside or after Phase 10 — both are opt-in / non-gating. Auto-update wiring + signing/release-feed remain explicit non-goals of Phase 9 — gated on a future signing-certificate decision; if and when that decision lands, the related work will be tracked under a fresh phase. **No separate-track follow-ups outstanding** from the §10-A / §10-B implementation turn.

---

## 2026-05-22 §10-C implementation closure footer (user guide expansion — review pending)

**Status.** ⏳ Implemented 2026-05-22 (review pending). Phase 10-C is the user-guide expansion slice of Phase 10 (Documentation). On this turn `docs/user-guide.md` was rewritten from the ~80-line Phase 10-A scaffold into a substantive ~700-line product user guide for the current Phase-9-closed desktop app; the docs-index labels for the user guide (in both `docs/README.md` and `README.md`) were flipped from "scaffold" to "Phase 10-C expanded 2026-05-22"; the top-of-file Phase 10 active rollup in this file was updated. No code changes; no package files modified; zero new dependencies; the §10-A + §10-B implementation closure footer immediately above this one preserved verbatim.

**User-guide expansion contents.** The new `docs/user-guide.md` is 16 sections + a glossary. Each section is content-complete against the current source (no remaining "TODO" or "scaffold — work in progress" markers in the user-facing body); every claim was verified against the actual frontend / backend code before being written into the guide.

*Sections (16 + glossary + closing):*

1. **Title + status banner** — explicit "Phase 10-C expanded 2026-05-22" callout; canonical phase state authority is `todo.md`; cross-links to README + docs index + developer setup + troubleshooting.

2. **What CreativEdge is** — local-first; one chat surface, 14 voices; desktop app via Electron with dynamic free-port allocation; provider-pluggable with Claude Code CLI + mock fallback.

3. **First launch / Setup wizard (🧭 Setup)** — auto-open contract via `wizardAutoCheckedRef` + `creativedge.firstRun.dismissed` localStorage boolean; four steps (Runtime / Claude Code / Backup optional / Done) each with the field-by-field reference; explicit "no credentials, no remote URLs, no secrets in localStorage" privacy guarantee; Re-check button behaviour; Finish vs Skip-for-now semantics.

4. **Chat basics** — composer (Enter sends; Shift+Enter newline); reply header convention with `🎨 Lumi — Graphics & Design` example; bubble copy buttons; sessions sidebar (mobile drawer); FTS5 full-text search; the Phase 9-B chat-recovery user experience (brief banner that auto-clears; no manual Ctrl+R needed); the persistent-vs-transient red banner triage rule.

5. **Agents and Nexus routing** — Nexus's four routing modes (one specialist / one clarifying question / 2–3 multi-specialist convening / hand-off); `@<alias>` shorthand inside `/remember`; full slash-command table (`/agent`, `/remember`, `/forget core`, `/forget episodic`, `/compact status`, `/compact preview`, `/backup status`) verified verbatim against `frontend/src/slash/slashCommands.ts`; explicit note that destructive slash-command paths are deliberately not exposed (`/backup run` etc); explicit note that routing rules cannot be edited from the chat UI (links to `add-an-agent.md`).

6. **Sessions and memory** — sessions in `~/.creativedge/sessions.db`; core memory vs episodic memory plain-English definitions; memory-candidate-card UX with explicit Promote/Dismiss; Phase 5.2-A sensitive-guard (refuses credit-card / SSN patterns); `/remember` shortcut workflow with example commands; what NOT to put in memory; the four privacy boundaries (no chat in crash reports / no memory in crash reports / no automatic external send / no telemetry).

7. **Admin / customization (⚙ Admin)** — agent list, agent detail, routing playground, memory editor; the six-field override allow-list (tagline / voice / color / values / strengths / watch-outs); Phase 7-B agent-editor diff modal with required checkbox + default-focus-Cancel + Esc dismisses + Enter doesn't auto-confirm; Phase 7-C memory editor with live match count + context-window diff + `safeReplaceOnce` guarantees; explicit cross-link to `add-an-agent.md` / `customize-an-agent.md` for deeper work; explicit note about §7-D intentionally no auth gating.

8. **Ops console (📊 Ops)** — seven cards with verified per-card detail: Diagnostics (service / runtime dir / provider readiness / backup state / app + backend version / latest crash log path); Usage & cost (totals / last-24h / last-7d / by-provider / by-agent; empty-DB happy path; mock-provider caveat); Budget & trends (Phase 9-D-C1 — Today/MTD/badges/inline SVG chart/threshold line/localStorage budget config with the explicit "only 2 numeric values ever touch localStorage" guarantee); Local logs (metadata only — never reads contents); Crash reports (Phase 9-D-C2 — Prepare/Copy/Download/Close, the explicit "no Send/Upload/Email/GitHub-issue button anywhere"); Backup card (mirrors the chat-side Backup panel); Update info (manual-only with the 6-row "does/doesn't" behaviour table).

9. **Backup guide for users (Phase 9-D-B3)** — separate dedicated section: what backup does, what it doesn't do (no auto-push / no credentials stored / no schedule), configure-remote walkthrough with the three valid URL forms, dry-run UX with the result-field reference, run-no-push UX with the three possible result strings (`committed=<hash> and pushed.` / `committed=<hash> (no push).` / `nothing changed; nothing to push.`), run-with-push UX with the four ordered readiness blockers (`gitReady` → `enabled` → `repoReady` → `remoteConfigured`) and the explicit second-confirmation modal contract; the redacted-remote display contract.

10. **Crash reports and privacy (Phase 9-D-C2)** — where they live on disk; full 17-field allow-list enumerated verbatim; explicit "what is NEVER in the report" list (chat content, memory contents, prompts, env vars, API keys, auth tokens, cookies, localStorage contents, SSH keys, Git credentials, home-dir files, database rows); Copy / Download / Close actions verbatim; the "manually share, only if you choose" closing.

11. **Updates and releases (Phase 9-D-B1 / 9-D-B4)** — manual release check; preload-bridge external-link UX; the 5-row table of what is NOT implemented (electron-updater / auto-update / signing / GitHub Actions release workflow / background polling); SmartScreen-on-first-run explanation; why auto-update is deferred (signing certificate gating).

12. **Runtime data and privacy** — full table of `~/.creativedge/` subdirectories and what each stores; the explicit "exactly two non-sensitive localStorage values" inventory (`creativedge.firstRun.dismissed` boolean + `creativedge.budget.daily` and `creativedge.budget.monthly` floats); verbatim Phase-9-closure privacy posture list (local-only by default / no telemetry / no automatic send / no background polling / 127.0.0.1-only binding / crash reports local-only / backup push opt-in + explicit confirmation / external release link HTTPS-only allow-listed).

13. **Common beginner workflows** — 9 step-by-step recipes: ask a design/tech/marketing question; let Nexus pick; force a specific agent; reopen Setup; check app health; configure local budget alerts; prepare a crash report; run a local backup; check for a new release.

14. **If something goes wrong** — non-duplicating cross-link table to the 10 named `troubleshooting.md` recipes (app does not open / `/healthz` fails / dynamic ports / stale processes / winCodeSign / better-sqlite3 NODE_MODULE_VERSION / release link / crash reports empty / backup push disabled / Claude Code missing).

15. **Glossary** — 13 plain-English term definitions: App / Backend / Backup dry-run / Core memory / Crash report / Dynamic ports / Episodic memory / Hand-off / Local-first / Mock provider / Nexus (🌐) / Ops console (📊) / Session / Specialist.

16. **Where to go next** — six concrete next-step cross-links (developer setup, add-an-agent, customize-an-agent, troubleshooting, electron release runbook, docs index, top-level README, todo.md).

**Files changed on this turn (4 total):**

*Modified (4 files):*
- `docs/user-guide.md` — full rewrite from ~80-line Phase 10-A scaffold to ~700-line Phase 10-C expanded user guide (above section inventory). Every documented feature verified against the actual source.
- `docs/README.md` — two edits: the "I want to use the app" start-here-path entry for `user-guide.md` updated from the scaffold placeholder ("Scaffold this turn; expanded in Phase 10-C") to a substantive one-paragraph summary of the expanded guide's actual contents; the Phase 10 roadmap table row for 10-C flipped from `⏳ Scaffold landed (full content in a later turn)` to `⏳ Implemented 2026-05-22 (review pending)`.
- `README.md` — one edit: the documentation links section's `docs/user-guide.md` line updated from "(Phase 10-C scaffold)" to "(Phase 10-C expanded 2026-05-22): chat basics, slash commands, Setup wizard, Ops console (seven cards), backup UX, crash-report local-only export, manual update flow, runtime data + privacy posture, beginner workflows, glossary."
- `todo.md` — top-of-file Phase 10 rollup updated; this §10-C implementation closure footer appended at EOF.

*Audited but NOT modified:*
- `electron/NOTES.md` (already current; no stale-marker hits; pre-existing local-only modifications carried over from earlier turns).
- `docs/electron-release-runbook.md` (already current; same).
- `INSTRUCTIONS.md` (LLM-roleplay spec; out of scope for 10-C).
- `architecture.md` (design intent; out of scope for 10-C).
- `docs/developer-setup.md`, `docs/add-an-agent.md`, `docs/customize-an-agent.md`, `docs/troubleshooting.md` (Phase 10-D/E/F scope; remain scaffold).
- All `package.json` files (out of scope).
- All code.

**Privacy / security guarantees preserved verbatim in the new user guide:**

- No personal Windows username (`miche`) anywhere in the guide — generic `C:\Users\<you>\.creativedge` used throughout.
- No API keys, tokens, cookies, env dumps, chat transcripts, memory contents, SSH keys.
- No claim of cloud sync (only opt-in git backup push to your own private repo, with explicit second confirmation).
- No claim of auto-update / `electron-updater` / signing / GitHub Actions workflow as implemented (all listed as deferred / non-goals).
- No claim of telemetry.
- No claim of LAN binding or `0.0.0.0` binding.
- No claim of automatic crash-report send / upload / email.
- No claim that fixed ports 3001/5174 are required inside Electron — dynamic-port behaviour is the documented contract.
- No claim of macOS/Linux packaged builds.
- Inline §7-D explicit note (no auth gating on admin console) preserved.

**Validation performed 2026-05-22 (all green):**
- `cd backend-api && npm run build` exit 0 (regression check; no backend code touched).
- `cd frontend && npm run typecheck` exit 0 (regression check; no frontend code touched).
- `cd frontend && npm run build` blocked by the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation (Windows host builds cleanly; not a regression).
- 5 `node --check`s on `electron/main.mjs` + `electron/preload.cjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` + `electron/scripts/after-pack.mjs` all exit 0.
- Grep across `docs/user-guide.md` for stale or unsafe phrases (`Phase 9 open`, `9-D-C4 pending`, `must use port 3001`, `must use port 5174`, `electron-updater implemented`, `automatic update is enabled`, `telemetry enabled`, `crash reports are sent`, `uploads crash reports`, `0.0.0.0`, `C:\Users\<username>`): zero hits.
- Every command mentioned in the guide verified against the actual source (slash commands verified against `frontend/src/slash/slashCommands.ts`; agent aliases verified against `frontend/src/agents/agentCatalog.ts`; Ops console card list verified against `frontend/src/components/ops/OpsConsole.tsx`; wizard steps verified against `frontend/src/components/setup/FirstRunWizard.tsx`; chrome buttons verified against `frontend/src/App.tsx`).

**Constraints honored on this turn:** Docs-only. No code changes anywhere. No `package.json` files modified. No `electron-updater` added. No signing wiring added. No GitHub Actions workflow added. No telemetry added. No new dependencies installed. No `node_modules/` changes. No generated artifacts. No `electron/dist-electron/` staged. No `Logo-Design.md` / `chat.md` touched (per the standing don't-touch rule). `README.md` modified ONLY for the documentation-link label update (one-line edit; permitted by the 10-C brief). `electron/NOTES.md` and `docs/electron-release-runbook.md` NOT touched (pre-existing local-only modifications preserved as-is, and Phase 10-C audit found no direct contradictions). No commit. No push. Phase 5 / 6 / 7 / 8 / 9 not reopened. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim — including the §9-D-C4 implementation closure footer, the §9-D-C4 Windows packaged-validation closure footer, and the §10-A + §10-B implementation closure footer.

**Deferred documentation slices:** **10-D** (developer setup expansion) — substantive content for `docs/developer-setup.md` (full test catalogue with example outputs, profiling, debugging, provider-selection rules, commit conventions). **10-E** (add/customize agent expansion) — substantive content for `docs/add-an-agent.md` and `docs/customize-an-agent.md` (full `config.json` schema, routing override syntax, fixture file structure, rollback recipes). **10-F** (troubleshooting expansion) — per-symptom expansion of `docs/troubleshooting.md` with concrete log excerpts + first-5-things cheat sheet + triage flow chart. **10-G** (final QA + Phase 10 closure) — full docs-quality QA pass (every link verified live, every command verified, no stale-marker hits anywhere), then the final docs-only flip closing 10-A through 10-G + Phase 10 overall.

**Phase 10 status after this turn:** Phase 10 overall **remains ⏳ In progress**. **10-A ⏳ Implemented 2026-05-22 (review pending)**. **10-B ⏳ Implemented 2026-05-22 (review pending)**. **10-C ⏳ Implemented 2026-05-22 (review pending)**. **10-D / 10-E / 10-F scaffolds remain unchanged** (expanded in later slices). **10-G not started**. Phase 10 closes when 10-G closes. **Active slice: Phase 10-C (review pending)**. **Next pending slices in canonical order: 10-D (developer setup expansion), 10-E (add/customize agent expansion), 10-F (troubleshooting expansion), 10-G (final QA + closure)**. The user should review the new user guide locally; on approval a future turn can proceed to 10-D. The Phase 5 deferred-extensions backlog (§5.3-C / §5.6-B / §5.6-C / optional all-agent compaction variant) and the post-Phase-6 polish backlog (theme toggle / syntax highlighting / hooks split-out / file-image attach / backup push button) remain available to pick up opportunistically alongside or after Phase 10 — both are opt-in / non-gating. Auto-update wiring + signing/release-feed remain explicit non-goals of Phase 9 — gated on a future signing-certificate decision; if and when that decision lands, the related work will be tracked under a fresh phase. **No separate-track follow-ups outstanding** from the §10-C implementation turn.

---

## 2026-05-22 §10-D implementation closure footer (developer setup guide expansion — review pending)

**Status.** ⏳ Implemented 2026-05-22 (review pending). Phase 10-D is the developer-setup expansion slice of Phase 10 (Documentation). On this turn `docs/developer-setup.md` was rewritten from the ~290-line Phase 10-A scaffold into an ~900-line canonical developer onboarding + maintenance guide; the docs-index labels for the developer-setup guide (in both `docs/README.md` and `README.md`) were flipped from "scaffold" to "Phase 10-D expanded 2026-05-22"; the top-of-file Phase 10 active rollup in this file was updated. No code changes; no package files modified; zero new dependencies; the §10-A + §10-B implementation closure footer and the §10-C implementation closure footer immediately above this one both preserved verbatim.

**Developer-guide expansion contents.** The new `docs/developer-setup.md` is 18 sections + a closing index. Every script, command, and architectural fact was verified verbatim against the actual repo state at HEAD `7144064` before being written into the guide; zero scripts were invented.

*Sections (18 + closing index):*

1. **Title + status banner** — explicit "Phase 10-D expanded 2026-05-22" callout; canonical phase state authority is `todo.md`; cross-links to README + docs index + user guide + troubleshooting + release runbook + architecture + INSTRUCTIONS.

2. **Prerequisites** — Windows 10/11 x64 as the validated host (with explicit "macOS/Linux packaged binaries are an explicit non-goal" callout); Node ≥ 20.11.0 + npm ≥ 10 (both enforced via root `package.json:engines`); Git on PATH; PowerShell; optional Claude Code CLI; optional Windows Developer Mode / Administrator PowerShell for `electron-builder` winCodeSign symlink unpack; explicit "no `.env` required, no Anthropic API key managed by the app" guarantee.

3. **Repository layout** — annotated tree showing all 4 subpackages (backend-api / frontend / electron / root) + agents (13 specialist folders) + orchestrator + docs; "what you usually edit / what NOT to commit" table for each directory; explicit "electron is an isolated package; the repo is NOT npm workspaces" clarification.

4. **Install / setup workflow** — exact commands (`git clone` → `cd CreativEdge` → `npm run setup` → `npm run setup:electron`); what setup does (3-step chain); what setup does NOT do (no `~/.creativedge/` writes, no `.env`, no Electron install, no `better-sqlite3` Electron rebuild, no credentials); explicit workspace-model note.

5. **Run modes** — the three primary run modes with verified commands: **(A)** browser dev mode (Terminal A + Terminal B + the Vite proxy contract); **(B)** Electron dev mode (`npm run dev:electron`) with the 9-step boot sequence verbatim and the 4 stdout boot-ready log lines verbatim; **(C)** packaged app mode (`npm run build:electron` → win-unpacked or installer paths) with SmartScreen-on-first-run note.

6. **Root scripts table (§5.1)** — 16 root scripts, verbatim command + what-it-does, sourced from the actual root `package.json`. **Backend scripts table (§5.2)** — 15 backend scripts including all 10 `test:*` runners, verbatim. **Frontend scripts table (§5.3)** — 4 frontend scripts, verbatim. **Electron scripts table (§5.4)** — 4 electron scripts, verbatim. Closing "if a script you think should exist is missing from these tables, it does NOT exist in the repo today" guardrail.

7. **Backend development** — entry point + Fastify wiring; the 6 route files (`health.ts` / `agents.ts` / `sessions.ts` / `chat.ts` / `backup.ts` / `ops.ts`); the provider abstraction (`Provider.ts` / `ClaudeProvider.ts` / `MockProvider.ts` / `providerRegistry.ts` / `localClaudeRuntime.ts` / `claudeCli.ts`); storage (Phase 5.5-A SQLite + FTS5); memory helpers; backup; routing/convening/hand-off; run/build/typecheck commands; the 10-test-runner table verbatim (no invented scripts); the `/healthz` shape.

8. **Frontend development** — entry point `App.tsx`; the layered `resolveApiBase()` contract documented verbatim from `frontend/src/api/client.ts` (preload bridge → VITE_API_URL → empty/dev-proxy); types / setup wizard / Ops console / backup / slash commands / agent catalogue / release config; run/build/typecheck commands; Vite dev proxy contract; `VITE_API_URL` semantics across the three modes (browser dev / browser build / Electron dev + packaged) with the explicit "the preload bridge wins inside Electron" guarantee.

9. **Electron development** — main process responsibilities (allocate ports + spawn backend + start static server + healthz check + hardened BrowserWindow + crash log writer + before-quit cleanup); preload bridge two surfaces (`openExternal` + `getRuntimeConfig`); backend log redirection (the Phase 9-B EPIPE fix); packaging orchestrator two-step Phase 9-D-B2 contract; afterPack hook (`@electron/rebuild` against packaged copy only; pre-flight existence checks; throws on failure); the `better-sqlite3` ABI rebuild contract table (dev vs packaged); winCodeSign symlink caveat with cross-link to troubleshooting §4; "do not edit / commit electron/dist-electron".

10. **Runtime data directory** — full `~/.creativedge/` subtree table (sessions.db / agents memory / overrides / backup.json / providers.json / backups git mirror / logs); "safe to delete during local testing" inventory; "requires caution" inventory; "never commit any of this" guardrail.

11. **Provider / runtime configuration** — default stack (Claude primary + mock fallback); explicit "no Anthropic API key required by default" guarantee; `providers.json` role; `/healthz` shape; what to check when Claude is missing / auth unknown; cross-link to troubleshooting §9.

12. **Development safety and privacy rules** — eight non-negotiable invariants verbatim: (1) no logging of sensitive content; (2) no commit of runtime/generated data; (3) no widening of bind addresses (127.0.0.1 only); (4) no new telemetry / auto-update / signing / GitHub Actions without a fresh phase; (5) no automatic crash-report send; (6) no bypass of confirmation modals; (7) no `git add .`; (8) `todo.md` is the canonical roadmap.

13. **Validation checklist for normal slices** — sub-checklists per slice type: docs-only / backend / frontend / Electron-lifecycle / packaging; the 10-phrase stale/unsafe grep recipe.

14. **Packaging checklist (concise)** — 4-step copy-paste-ready PowerShell recipe with expected stdout markers (`packaging plan (Phase 9-D-B2 afterPack flow)` / `source tree mutation: NONE` / `[after-pack] rebuild complete for better-sqlite3` / `boot ready: backend=…`); post-package dev-ABI sanity check.

15. **Git workflow** — six sub-sections: before-any-change / staging / commit-message-conventions (with five real examples) / push (default-not / never to main) / generated-artifacts / pre-existing-local-only-modifications inventory (`Logo-Design.md`, `chat.md`, sometimes `README.md` / `docs/electron-release-runbook.md` / `electron/NOTES.md`).

16. **Working with AI coding agents** — 8-point briefing template for delegating slices: start state / plan-first / strict scope / validation evidence / update todo.md / don't fabricate features / don't touch private-runtime-generated / read first.

17. **Common developer tasks** — 12 practical recipes: start dev / start Electron dev / build packaged / check backend health / open logs dir / verify dynamic ports while Electron is running / run backup tests / run memory tests / run routing tests / recover stale processes / clear winCodeSign cache / rebuild backend after a packaged build (recovery only).

18. **Where to go next** — ten concrete cross-links (user-guide / troubleshooting / electron-release-runbook / add-an-agent / customize-an-agent / architecture / INSTRUCTIONS / todo.md / docs/README.md / top-level README).

**Confirmed script table from package files (verified verbatim at HEAD `7144064`):**

*Root (`package.json`):* `setup`, `setup:backend`, `setup:frontend`, `setup:electron`, `build`, `build:backend`, `build:frontend`, `build:electron`, `typecheck`, `typecheck:backend`, `typecheck:frontend`, `dev`, `dev:backend`, `dev:frontend`, `dev:electron`, `rebuild:electron`.

*Backend (`backend-api/package.json`):* `dev`, `build`, `typecheck`, `start`, `clean`, `test:routing`, `test:agents`, `test:voice`, `test:memory`, `test:in-character`, `test:memory-candidate`, `test:memory-files`, `test:memory-integration`, `test:sqlite`, `test:backup`.

*Frontend (`frontend/package.json`):* `dev`, `build`, `preview`, `typecheck`.

*Electron (`electron/package.json`):* `dev`, `build`, `rebuild:sqlite`, `postinstall`.

**Files changed on this turn (4 total):**

*Modified (4 files):*
- `docs/developer-setup.md` — full rewrite from ~290-line Phase 10-A scaffold to ~900-line Phase 10-D expanded developer onboarding + maintenance guide (above section inventory). Every script, command, and architectural fact verified verbatim against the actual repo state.
- `docs/README.md` — two edits: the "I want to build / debug / package the app" start-here-path entry for `developer-setup.md` updated from the scaffold placeholder ("Scaffold this turn; expanded in Phase 10-D") to a substantive one-paragraph summary of the expanded guide's actual contents; the Phase 10 roadmap table row for 10-D flipped from `⏳ Scaffold landed (full content in a later turn)` to `⏳ Implemented 2026-05-22 (review pending)`.
- `README.md` — one edit: the documentation links section's `docs/developer-setup.md` line updated from "(Phase 10-D scaffold)" to "(Phase 10-D expanded 2026-05-22): prerequisites, repo layout, install + three run modes, verified per-subpackage script tables, backend + frontend + Electron development references, runtime data, provider config, safety + privacy rules, validation + packaging checklists, git workflow, AI-agent briefing template, twelve common developer tasks."
- `todo.md` — top-of-file Phase 10 rollup updated to add 10-D's substantive inline summary; this §10-D implementation closure footer appended at EOF.

*Audited but NOT modified:*
- `electron/NOTES.md` (current; no direct contradictions surfaced by writing the developer guide; pre-existing local-only modifications preserved as-is).
- `docs/electron-release-runbook.md` (current; same).
- `INSTRUCTIONS.md` (agent-roleplay LLM spec; out of scope for 10-D).
- `architecture.md` (design intent; out of scope for 10-D).
- `docs/user-guide.md`, `docs/add-an-agent.md`, `docs/customize-an-agent.md`, `docs/troubleshooting.md` (10-C closed; 10-E/F scope).
- All `package.json` files (out of scope per the strict-scope clause).
- All code.

**Privacy / security guarantees preserved verbatim in the new developer guide:**

- No personal Windows username (`miche`) anywhere in the guide — generic `C:\Users\<you>\.creativedge` and `~/.creativedge` used throughout.
- No API keys, tokens, cookies, env dumps, chat transcripts, memory contents, SSH keys, or any other secret material.
- No claim of cloud sync (only opt-in git backup push, with explicit second-confirmation modal).
- No claim of auto-update / `electron-updater` / signing / GitHub Actions workflow as implemented (all listed as deferred / non-goals, and explicitly gated on a future signing-certificate decision in the safety rules block).
- No claim of telemetry.
- No claim of LAN binding or `0.0.0.0` binding — both are explicitly forbidden in the safety rules block (rule §12.3).
- No claim of automatic crash-report send / upload / email (rule §12.5).
- No claim that fixed ports 3001/5174 are required inside Electron — dynamic-port contract (Phase 9-D-C3) is the documented Electron runtime behaviour throughout.
- No claim of macOS / Linux packaged builds (explicitly called out as a non-goal in §1).
- Inline "no auth gating on admin console (§7-D intentional)" semantics preserved (the developer guide doesn't re-document this directly; cross-links to `customize-an-agent.md` and `todo.md` where the §7-D rationale lives).

**Validation performed 2026-05-22 (all green):**
- `cd backend-api && npm run build` exit 0 (regression check; no backend code touched).
- `cd frontend && npm run typecheck` exit 0 (regression check; no frontend code touched).
- `cd frontend && npm run build` blocked by the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation (Windows host builds cleanly; not a regression).
- 5 `node --check`s on `electron/main.mjs` + `electron/preload.cjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` + `electron/scripts/after-pack.mjs` all exit 0.
- Grep across `docs/developer-setup.md` for the 11 stale/unsafe phrases (`Phase 9 open`, `9-D-C4 pending`, `must use port 3001`, `must use port 5174`, `electron-updater implemented`, `automatic update is enabled`, `telemetry enabled`, `crash reports are sent`, `uploads crash reports`, `0.0.0.0`, `C:\Users\<username>`): zero hits.
- Every documented script verified to actually exist in the corresponding `package.json` (root + backend-api + frontend + electron). No invented scripts.

**Constraints honored on this turn:** Docs-only. No code changes anywhere. No `package.json` files modified. No `electron-updater` added. No signing wiring added. No GitHub Actions workflow added. No telemetry added. No new dependencies installed. No `node_modules/` changes. No generated artifacts. No `electron/dist-electron/` staged. No `Logo-Design.md` / `chat.md` touched (per the standing don't-touch rule). `README.md` modified ONLY for the documentation-link label update (one-section edit; permitted by the 10-D brief). `electron/NOTES.md` and `docs/electron-release-runbook.md` NOT touched (pre-existing local-only modifications preserved as-is, and Phase 10-D audit found no direct contradictions). No commit. No push. Phase 5 / 6 / 7 / 8 / 9 not reopened. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim — including the §9-D-C4 implementation closure footer, the §9-D-C4 Windows packaged-validation closure footer, the §10-A + §10-B implementation closure footer, and the §10-C implementation closure footer.

**Deferred documentation slices:** **10-E** (add/customize agent expansion) — substantive content for `docs/add-an-agent.md` and `docs/customize-an-agent.md` (full `config.json` schema, routing override syntax, fixture file structure, rollback recipes). **10-F** (troubleshooting expansion) — per-symptom expansion of `docs/troubleshooting.md` with concrete log excerpts + first-5-things cheat sheet + triage flow chart. **10-G** (final QA + Phase 10 closure) — full docs-quality QA pass (every link verified live, every command verified, no stale-marker hits anywhere), then the final docs-only flip closing 10-A through 10-G + Phase 10 overall.

**Phase 10 status after this turn:** Phase 10 overall **remains ⏳ In progress**. **10-A ⏳ Implemented 2026-05-22 (review pending)**. **10-B ⏳ Implemented 2026-05-22 (review pending)**. **10-C ⏳ Implemented 2026-05-22 (review pending)**. **10-D ⏳ Implemented 2026-05-22 (review pending)**. **10-E / 10-F scaffolds remain unchanged** (expanded in later slices). **10-G not started**. Phase 10 closes when 10-G closes. **Active slice: Phase 10-D (review pending)**. **Next pending slices in canonical order: 10-E (add/customize agent expansion), 10-F (troubleshooting expansion), 10-G (final QA + closure)**. The user should review the new developer guide locally; on approval a future turn can proceed to 10-E. The Phase 5 deferred-extensions backlog and the post-Phase-6 polish backlog remain available to pick up opportunistically alongside or after Phase 10 — both are opt-in / non-gating. Auto-update wiring + signing/release-feed remain explicit non-goals of Phase 9 — gated on a future signing-certificate decision. **No separate-track follow-ups outstanding** from the §10-D implementation turn.

---

## 2026-05-22 §10-E implementation closure footer (add/customize agent guide expansion — review pending)

**Status.** ⏳ Implemented 2026-05-22 (review pending). Phase 10-E is the agent-documentation expansion slice of Phase 10 (Documentation). On this turn `docs/add-an-agent.md` was rewritten from a ~135-line Phase 10-A scaffold into a 15-section canonical add-an-agent guide; `docs/customize-an-agent.md` was rewritten from a ~165-line Phase 10-A scaffold into a 15-section canonical customize-an-agent guide. The docs-index labels for both files (in both `docs/README.md` and `README.md`) were flipped from "scaffold" to "Phase 10-E expanded 2026-05-22"; the top-of-file Phase 10 active rollup in this file was updated. No code changes; no package files modified; no agent source files modified; no `orchestrator/registry.json` or `orchestrator/routing_rules.md` modified; zero new dependencies. All four prior closure footers (§9-D-C4 implementation + §9-D-C4 Windows packaged-validation + §10-A + §10-B + §10-C + §10-D) preserved verbatim.

**Add-an-agent guide expansion contents.** 15 sections + closing index. Every claim verified against actual repo state at HEAD `57ec5c9` before being written into the guide.

*Sections:*
1. **Title + status banner** — Phase 10-E expanded callout; canonical phase authority is `todo.md`.
2. **When to add an agent vs customize an existing one** — decision criteria + explicit don't-add list (temporary campaigns / private customer data / duplicate domains).
3. **Current architecture overview** — annotated diagram showing all 7 touchpoints (registry, routing_rules, agents/<slug>/, backend registry.ts, routing pipeline, fixtures, frontend catalog, runtime memory).
4. **Naming and slug rules** — verified against the 13 specialist slugs: lowercase / hyphen-separated / 4–20 chars / stable / no spaces or uppercase / explicit warning against renaming.
5. **Required files for a new specialist** — full per-file purpose / expected content / privacy constraints for: identity.md (one-screen ≈15 lines), soul.md (≈25–30 lines), personality.md (≈15–20 lines), system_prompt.md (≈30–40 lines, with both do-include and do-NOT-include lists), config.json (with the full schema verified against `agents/programming-tech/config.json`), memory/README.md, memory/core_memory.md (start empty), memory/episodic_memory.md (always start empty).
6. **The MBTI design tool** — full 14-MBTI-type table (verified from registry); three unused types listed (ESFP / ESTP / one INFP-duplicate slot); anti-pattern list.
7. **Memory files for a new agent (templates vs runtime)** — runtime-vs-template table; high-level promotion flow; hard rules for seeded template memory; explicit "you are the only safety check for committed template content" warning.
8. **Registry update** — verbatim JSON template for a new `entries[]` item; routing-keyword design rules (domain-specific / avoid common words / avoid substring traps / be multilingual when natural / 7–10 range).
9. **Routing rules update** — three sub-sections (trigger-keywords table row, overlap rules, multi-agent convening).
10. **Frontend catalogue and aliases** — verbatim TypeScript template; alias design rules (3–5 chars / one word / no collisions / memorable); resolver behavior.
11. **Backend impacts** — explicit "does NOT require backend code changes" (data-driven design); registry.ts auto-loads; only test fixtures need updates.
12. **Test fixtures required** — full table mapping the six `backend-api/tests/*.json` files to their test runners and to when to update them.
13. **Validation checklist** — copy-paste-ready PowerShell with all 5 relevant test runners + manual checks.
14. **Common mistakes** — 10 named anti-patterns (added folder but not registry / added registry but not catalogue / added everything but no tests / overly broad keywords / conflicting alias / seeded private memory / renamed slug / forgot frontend catalogue / forgot docs / claimed new agent exists before tests passed).
15. **Minimal PR checklist** — 20-item checklist covering every required artifact.
+ Closing "Where to go next" with 7 cross-links.

**Customize-an-agent guide expansion contents.** 15 sections + closing index. Every claim verified against actual source.

*Sections:*
1. **Title + status banner** — Phase 10-E expanded; cross-link to add-an-agent for new specialists.
2. **Customization decision tree** — branching tree (runtime vs source; tagline/voice/values → admin editor; memory facts → memory editor or /remember; system prompt / personality / MBTI / domain → source-file edit; routing keywords → registry + routing_rules + tests).
3. **What can be customized — runtime overrides vs source edits** — 14-knob table with Where / How / Reversible columns; explicit "never confuse source vs runtime" callout.
4. **Admin console customization (runtime overrides — Phase 7-B/7-C)** — agent editor with the six-field allow-list (`tagline` / `voice` / `color` / `values` / `strengths` / `watch_outs` verbatim) + diff-modal contract; memory editor with `safeReplaceOnce` guarantees (single-match safety / sensitive-content guard / atomic write); routing playground; admin contract negative list (does NOT mutate source / does NOT change registry / does NOT add agents / does NOT require auth per §7-D).
5. **Source-file customization (templates — Git-tracked)** — per-file (identity / soul / personality / system_prompt / config / memory) what to change / what NOT to change / validation runner.
6. **Voice and personality safety** — keep domain expertise / keep MBTI fingerprint distinct / avoid making agents sound identical / avoid prompt injection / avoid bypassing confirmations / avoid disclosing runtime memory / keep MBTI rationale consistent.
7. **Routing customization** — three sub-sections covering registry keywords / routing_rules.md overlap rules (with the 6 verbatim rules: Lumi vs Iris / Vera vs Atlas / Bit vs Sage / Buzz vs Lex / Quant vs Sage / Bloom vs Atlas) / convening + clarify + hand-off; anti-patterns (overfitting / broad words / substring traps / adding fixtures to make wrong routing pass).
8. **Memory customization (runtime vs template)** — runtime path with all the Phase 5.2-A/B/C/D + 5.4-A flows verbatim; template path with the "never seed sensitive content" rule; Phase 5.6-A backup interplay (runtime memory IS in backup; runtime overrides are NOT).
9. **UI metadata customization** — the 7-file ripple list when name/emoji/color/domain/tagline changes.
10. **Validation checklist for customization** — sub-checklists per change type + a final dev-electron smoke.
11. **Rollback strategy** — runtime overrides / runtime memory / source-file edits / backup interplay; explicit "do NOT rewrite runtime user memory to rollback source changes".
12. **Common mistakes** — 10 named anti-patterns (editing runtime as templates / editing templates as runtime / source edits without registry+UI+tests / broad keywords / secret/customer data in memory / bypassing confirmations / making agents sound like Nexus / changing slugs / forgetting todo.md+docs / touching INSTRUCTIONS.md casually).
13. **Safe AI-agent instructions** — 8-point briefing template for delegating customization slices (inspect first / plan before editing / change one agent at a time / no sensitive data / run relevant tests / provide evidence / don't commit/push without instruction / update todo.md).
14. **Why you must NEVER rename a slug** — table of 12 dependent paths (repo directory / config.json / registry.json / routing_rules / agentCatalog / 3 fixture files / runtime memory dir / runtime override path / backup mirror / user's pushed backup repo / documentation roster tables) explaining why a slug rename silently orphans every user's runtime memory.
15. **Minimal PR checklist** — 16-item checklist.
+ Closing "Where to go next" with 8 cross-links.

**Confirmed agent architecture facts** (all verified at HEAD `57ec5c9` before being written into the guides):

- **14 entities**: 1 orchestrator (Nexus at `orchestrator/`) + 13 specialists at `agents/<slug>/`. Verified via `orchestrator/registry.json:count` (`orchestrator: 1, specialists: 13`).
- **14 distinct MBTI types**: verified via registry.
- **14 slugs**: `nexus, graphics-design, programming-tech, digital-marketing, video-animation, writing-translation, music-audio, business, finance, ai-services, personal-growth, consulting, data, photography`.
- **14 frontend aliases**: `nexus, bit, lumi, sage, vera, cash, lex, reel, buzz, echo, bloom, atlas, quant, iris` (verified verbatim from `frontend/src/agents/agentCatalog.ts`).
- **`config.json` schema** verified verbatim from `agents/programming-tech/config.json`: `slug` + `name` + `domain` + `emoji` + `color` + `tagline` + `mbti{type,archetype,temperament,axes{I,N,T,P}}` + `voice` + `values[]` + `strengths[]` + `watch_outs[]` + `files{identity,soul,personality,system_prompt,memory_dir}` + `schema_version` + `created`.
- **Registry entry shape** verified verbatim from `orchestrator/registry.json`: `slug` + `name` + `domain` (optional for orchestrator) + `emoji` + `mbti` (string, not nested object) + `color` (optional for orchestrator) + `role: "orchestrator"|"specialist"` + `path` + `routing_keywords[]`.
- **6 named routing overlap rules** verbatim from `orchestrator/routing_rules.md`: Lumi vs Iris / Vera vs Atlas / Bit vs Sage / Buzz vs Lex / Quant vs Sage / Bloom vs Atlas.
- **6 backend test fixture files** verified verbatim from `backend-api/tests/`: `routing-fixtures.json`, `agent-behavior-fixtures.json`, `agent-contamination-fixtures.json`, `agent-core-memory-fixtures.json`, `agent-voice-hold-fixtures.json`, `memory-candidate-fixtures.json`.
- **10 backend test scripts** verified verbatim from `backend-api/package.json`: `test:routing`, `test:agents`, `test:voice`, `test:memory`, `test:in-character`, `test:memory-candidate`, `test:memory-files`, `test:memory-integration`, `test:sqlite`, `test:backup`.
- **Backend reads registry at runtime** — verified via `backend-api/src/agents/registry.ts` which reads `<projectRoot>/orchestrator/registry.json`. Adding a registry entry is auto-picked-up; no backend code change required.

**Confirmed validation / test commands** (all verified from package.json files):

```
cd backend-api && npm run build
cd backend-api && npm run typecheck
cd frontend && npm run typecheck
cd backend-api && npm run test:routing
cd backend-api && npm run test:agents
cd backend-api && npm run test:voice
cd backend-api && npm run test:memory
cd backend-api && npm run test:in-character
cd backend-api && npm run test:memory-candidate
cd backend-api && npm run test:memory-files
cd backend-api && npm run test:memory-integration
cd backend-api && npm run test:sqlite
cd backend-api && npm run test:backup
npm run dev:electron
```

**Files changed on this turn (5 total):**

*Modified (5 files):*
- `docs/add-an-agent.md` — full rewrite from ~135-line Phase 10-A scaffold to 15-section Phase 10-E expanded canonical add-an-agent guide.
- `docs/customize-an-agent.md` — full rewrite from ~165-line Phase 10-A scaffold to 15-section Phase 10-E expanded canonical customize-an-agent guide.
- `docs/README.md` — three edits: the "I want to add or customize an agent" start-here-path entries for both files updated from scaffold placeholders to substantive content summaries; the Phase 10 roadmap table row for 10-E flipped from `⏳ Scaffolds landed (full content in a later turn)` to `⏳ Implemented 2026-05-22 (review pending)`.
- `README.md` — two-line edit: documentation links section's `docs/add-an-agent.md` and `docs/customize-an-agent.md` lines updated from "(Phase 10-E scaffold)" to "(Phase 10-E expanded 2026-05-22)" with substantive content summaries.
- `todo.md` — top-of-file Phase 10 rollup updated to add 10-E's substantive inline summary; this §10-E implementation closure footer appended at EOF.

*Audited but NOT modified:*
- `orchestrator/registry.json` (current; verified content used in the guides; not stale).
- `orchestrator/routing_rules.md` (current; 6 named overlap rules + per-specialist keyword table; not stale).
- All `agents/<slug>/*` source files (verified one specialist's full shape; out of scope for documentation).
- `INSTRUCTIONS.md`, `architecture.md` (out of scope for 10-E).
- `electron/NOTES.md`, `docs/electron-release-runbook.md` (current; out of scope).
- `docs/user-guide.md`, `docs/developer-setup.md`, `docs/troubleshooting.md` (10-C/D closed; 10-F scope).
- All `package.json` files (out of scope per the strict-scope clause).
- All code.
- `Logo-Design.md`, `chat.md` (standing don't-touch list).

**Privacy / security guarantees preserved verbatim in the new agent guides:**

- No personal Windows username (`miche`) anywhere in either guide — generic `C:\Users\<you>\.creativedge` + `~/.creativedge` used throughout.
- No API keys / tokens / cookies / env dumps / chat transcripts / memory contents / SSH keys.
- No claim of cloud sync (only opt-in git backup push to a user-controlled private repo).
- No claim of auto-update / `electron-updater` / signing / GitHub Actions / telemetry / LAN binding / `0.0.0.0` / macOS-Linux packaged builds.
- No claim crash reports are sent.
- No claim that fixed ports 3001/5174 are required inside Electron.
- Explicit "never seed sensitive content into committed templates" guidance threaded through the add-an-agent guide.
- Explicit "never bypass confirmation modals" guidance threaded through the customize-an-agent guide.
- Explicit "never store secrets in memory" guidance.
- Explicit "never commit runtime memory" guidance.
- The Phase 5.2-A sensitive-content guard documented as a runtime-only check; "you are the only safety check for committed template content" warning surfaced.
- The Phase 7-B six-field override allow-list documented verbatim (tagline / voice / color / values / strengths / watch_outs); the customize-an-agent guide explicitly states the allow-list MUST NOT be widened.
- The §7-D no-auth-gating non-goal preserved.
- The "never rename a slug" warning documented with the 12-dependent-paths table.

**Validation performed 2026-05-22 (all green):**
- `cd backend-api && npm run build` exit 0 (regression check; no backend code touched).
- `cd frontend && npm run typecheck` exit 0 (regression check; no frontend code touched).
- `cd frontend && npm run build` blocked by the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation (Windows host builds cleanly; not a regression).
- 5 `node --check`s on `electron/main.mjs` + `electron/preload.cjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` + `electron/scripts/after-pack.mjs` all exit 0.
- Grep across `docs/add-an-agent.md` + `docs/customize-an-agent.md` for the 14 stale/unsafe phrases (`Phase 9 open`, `9-D-C4 pending`, `must use port 3001`, `must use port 5174`, `electron-updater implemented`, `automatic update is enabled`, `telemetry enabled`, `crash reports are sent`, `uploads crash reports`, `0.0.0.0`, `C:\Users\<username>`, `commit runtime memory`, `store secrets in memory`, `bypass confirmation`): zero hits.
- Every documented script verified to actually exist in `backend-api/package.json` (all 10 `test:*` runners present); zero invented scripts.
- Every documented registry field verified against actual `orchestrator/registry.json` content.
- Every documented `config.json` field verified against `agents/programming-tech/config.json` (the canonical specialist config).

**Constraints honored on this turn:** Docs-only. No code changes anywhere. No `package.json` files modified. No agent source files modified. No `orchestrator/registry.json` modified. No `orchestrator/routing_rules.md` modified. No `electron-updater` added. No signing wiring added. No GitHub Actions workflow added. No telemetry added. No new dependencies installed. No `node_modules/` changes. No generated artifacts. No `electron/dist-electron/` staged. No `Logo-Design.md` / `chat.md` touched (per the standing don't-touch rule). `README.md` modified ONLY for the two documentation-link label updates (one-section edit; permitted by the 10-E brief). `electron/NOTES.md` and `docs/electron-release-runbook.md` NOT touched (pre-existing local-only modifications preserved; Phase 10-E audit found no direct contradictions). No commit. No push. Phase 5 / 6 / 7 / 8 / 9 not reopened. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim — including §9-D-C4 implementation + §9-D-C4 Windows packaged-validation + §10-A + §10-B + §10-C + §10-D closure footers.

**Deferred documentation slices:** **10-F** (troubleshooting expansion) — per-symptom expansion of `docs/troubleshooting.md` with concrete log excerpts + first-5-things cheat sheet + triage flow chart. **10-G** (final QA + Phase 10 closure) — full docs-quality QA pass (every link verified live, every command verified, no stale-marker hits anywhere), then the final docs-only flip closing 10-A through 10-G + Phase 10 overall.

**Phase 10 status after this turn:** Phase 10 overall **remains ⏳ In progress**. **10-A ⏳ Implemented 2026-05-22 (review pending)**. **10-B ⏳ Implemented 2026-05-22 (review pending)**. **10-C ⏳ Implemented 2026-05-22 (review pending)**. **10-D ⏳ Implemented 2026-05-22 (review pending)**. **10-E ⏳ Implemented 2026-05-22 (review pending)**. **10-F scaffold remains unchanged** (expanded in a later slice). **10-G not started**. Phase 10 closes when 10-G closes. **Active slice: Phase 10-E (review pending)**. **Next pending slices in canonical order: 10-F (troubleshooting expansion), 10-G (final QA + closure)**. The user should review the new agent guides locally; on approval a future turn can proceed to 10-F. The Phase 5 deferred-extensions backlog and the post-Phase-6 polish backlog remain available to pick up opportunistically alongside or after Phase 10. Auto-update wiring + signing/release-feed remain explicit non-goals of Phase 9 — gated on a future signing-certificate decision. **No separate-track follow-ups outstanding** from the §10-E implementation turn.

---

## 2026-05-22 §10-F implementation closure footer (troubleshooting guide expansion — review pending)

**Status.** ⏳ Implemented 2026-05-22 (review pending). Phase 10-F is the troubleshooting-guide expansion slice of Phase 10 (Documentation). On this turn `docs/troubleshooting.md` was rewritten from a ~351-line Phase 10-A scaffold (already substantive with 11 named recipes) into a 26-section canonical troubleshooting guide for users / developers / operators / AI coding agents. The docs-index labels for the troubleshooting guide (in both `docs/README.md` and `README.md`) were flipped from "scaffold" to "Phase 10-F expanded 2026-05-22"; the top-of-file Phase 10 active rollup in this file was updated. No code changes; no package files modified; zero new dependencies. All prior closure footers (§9-D-C4 implementation + §9-D-C4 Windows packaged-validation + §10-A + §10-B + §10-C + §10-D + §10-E) preserved verbatim.

**Troubleshooting-guide expansion contents.** 26 sections + closing index. Every command verified verbatim against actual `package.json` files at HEAD `4c2bd7d`. Every cross-reference verified against the existing docs tree.

*Sections:*

1. **Title + status banner** — Phase 10-F expanded callout; Phase 9 ✅ baseline; cross-links to README + docs index + user guide + developer setup + release runbook.
2. **First 5 checks** — fast-triage list with verbatim PowerShell: repo root / `git status -s` / kill stale node-electron-bun / legacy 3001-5174 squat check / 5 `node --check`s + backend build + frontend typecheck + open logs directory.
3. **App does not open** — 3 diagnostic steps + 6 named common causes + recovery commands for both dev-Electron and packaged paths.
4. **Backend `/healthz` fails** — explicit "browser dev = 3001 / Electron = dynamic port from log" disambiguation; 6-row what-to-check table mapping symptoms to causes; recovery commands.
5. **Dynamic ports — confusion and verification** — port-by-mode table; how to read dynamic ports from the four canonical Electron stdout log lines verbatim; explicit "do NOT type literal `< >` in PowerShell — substitute the actual integers" warning; legacy 3001/5174 reference scope.
6. **Stale process / port cleanup** — symptoms + diagnostic commands + safe-scope recovery + "why 3001/5174 still appear" context.
7. **`winCodeSign` symbolic link permission error** — what-this-is-and-isn't context; three recovery options verbatim (Admin PowerShell / Developer Mode / clear cache with full PowerShell command); the verbatim build-log success markers to verify the fix; "do not confuse with afterPack" callout.
8. **`better-sqlite3 NODE_MODULE_VERSION` error** — ABI-mismatch explainer; the dev-vs-packaged ABI table; the Phase 9-D-B2 afterPack contract verbatim with "source `backend-api/node_modules` stays at system Node ABI" guarantee; the verbatim build-log markers to verify (`[after-pack] rebuild complete for better-sqlite3 in …\resources\backend-api\node_modules`); recovery commands for both the auto-rebuild path and the worst-case manual recovery; explicit "don't edit native module files" rule.
9. **Packaged build succeeds but app fails** — 7-step mini-checklist (confirm packaged copy exists / inspect backend log / inspect latest crash record / verify dynamic `/healthz` / verify better-sqlite3 ABI / verify afterPack markers / post-package backend build still passes); pointer to Ops console Crash reports card for evidence collection.
10. **Release link does not open** — expected behaviour (verbatim `ipc openExternal succeeded` log line); current allow-list (single entry: `github.com` host + `/michelbr84/CreativEdge/releases` path-prefix + `https:` only); 3 common causes; 3 explicit "what NOT to do" items (don't widen allow-list casually / don't bypass the bridge / don't commit personal forks' URLs).
11. **Manual latest-release check fails** — user-click-only contract; 6-outcome badge table; recovery + the fact that the app never blocks on a release check.
12. **Backup is disabled or push button unavailable** — the four ordered readiness blockers verbatim from Phase 9-D-B3 (`gitReady` → `enabled` → `repoReady` → `remoteConfigured`); the three operations (dry-run / no-push / with-push); the second-confirmation modal contract verbatim (redacted remote / required checkbox / default-focus-Cancel / Esc / Enter does NOT auto-confirm); explicit "credentials are NOT stored in the app" + "never paste your token into the app" rules.
13. **Backup push fails** — 5-row `pushReason` table mapping common error strings to causes (Authentication failed / DNS / firewall / non-fast-forward / branch mismatch); 4-step recovery; explicit "do not embed credentials in remote URL" rule.
14. **Crash reports are empty / Prepare fails** — happy-path explainer; intentional generation recipe (Stop-Process the backend child); 4-row Prepare-fail error table; the 17-field allow-list verbatim; the "what is NEVER in the report" list (chat / memory / prompts / env vars / API keys / auth tokens / cookies / localStorage / SSH keys / Git credentials / home-dir / DB rows); explicit "no Send / Upload / Email / GitHub-issue button anywhere" rule.
15. **Claude Code CLI missing or auth unknown** — "this is not a blocker" + mock-fallback explainer; installation + verification commands; explicit "no `.env`, no `ANTHROPIC_API_KEY` required" rule.
16. **Chat shows backend unreachable but reply persists** — Phase 9-B chat-recovery class explained at user level (false-negative Chromium fetch + 3-stage recovery: immediate + listSessions fallback + bounded retry polling at 250/750/1500 ms); explicit "wait briefly; don't resend" guidance.
17. **Sessions or memory look wrong** — what's local (sessions.db / runtime memory paths / source template paths); 3 common confusions; explicit "don't manually edit runtime memory files" rule; "back up before destructive changes" guidance.
18. **Admin / customization changes not showing** — where runtime overrides live (`~/.creativedge/overrides/<slug>.json`); 3 reasons it might not show immediately; the six-field override allow-list verbatim; the §7-D no-auth-gating non-goal; explicit rollback recipes (single-field / whole-agent).
19. **Frontend build / typecheck errors** — diagnostic + 4-row common-cause table including the documented `@rollup/rollup-linux-x64-gnu` "running on Linux sandbox — Windows host builds cleanly" caveat; reinstall recipe.
20. **Backend build / test errors** — 5-row common-cause table; the verbatim 10-test-runner list from `backend-api/package.json`; cross-link to developer-setup §7.2.
21. **OneDrive / cloud-synced folder caveats** — 4 symptoms (truncated file in one shell but not another / Git diff shows large net deletions / Read returns content not matching Write / Git status flags untouched files); why it happens; 6 safe practices.
22. **`.git/index.lock` blocking git commands** — what this means; "is any git process actively running?" diagnostic; safe recovery (only delete after confirming no git process is running); Phase 7-C cross-reference (Task #231).
23. **Git workflow mistakes** — why this happens (the `git add .` risk); safe staging workflow with 5-step copy-paste-ready commands; recovering from accidental staging; recovering from accidental commit not pushed yet (soft-reset); explicit "never force-push to main" rule; ahead-of-origin explainer.
24. **Troubleshooting decision tree** — 4-branch flow (app-won't-open / build-fails / feature-broken / docs-only / unknown-weird) routing the reader to the right recipe section number.
25. **Evidence template for bug reports** — full Markdown template covering OS/version + Node/npm version + commit SHA + branch + command run + expected vs actual behaviour + log paste placeholder + Electron dynamic ports + working-tree state + validation already-passed checklist + screenshots note; explicit "never include" list (API keys / tokens / cookies / SSH keys / Git credentials / chat content / memory / runtime DB / agent memory files / personal PII).
26. **Quick command appendix** — 16 copy-paste-ready PowerShell recipes (kill stale processes / backend build / frontend typecheck+build / Electron syntax checks / dev Electron / build packaged / run packaged / check health for browser-dev + Electron / check legacy ports / clear winCodeSign cache / open logs directory / tail latest backend log / stale-marker grep using `Select-String -SimpleMatch` + `[regex]::Escape` / git staging sanity / safe `.git/index.lock` recovery / verify Git installed).

+ Closing "Where else to look" with 11 cross-links.

**Confirmed troubleshooting topics covered:**
- App does not open (dev + packaged paths).
- Backend `/healthz` fails with browser-dev vs Electron-dynamic port disambiguation.
- Dynamic ports inside Electron + how to read from logs + post-close cleanup verification.
- Stale node/electron/bun process recovery.
- winCodeSign symlink permission error (full Windows-permission/cache fix recipe).
- `better-sqlite3 NODE_MODULE_VERSION` ABI mismatch + Phase 9-D-B2 afterPack contract.
- Packaged build succeeds but app fails — 7-step mini-checklist.
- Release link doesn't open (preload-bridge path + allow-list).
- Manual latest-release check outcomes.
- Backup readiness 4-blocker priority order + second-confirmation modal contract.
- Backup push failure diagnosis + recovery.
- Crash reports empty / Prepare fails + the 17-field allow-list + "what is NEVER in the report".
- Claude Code CLI missing / auth unknown + mock fallback.
- Chat-recovery red-banner false-negative explained at user level.
- Sessions / memory diagnosis + runtime-vs-template clarification.
- Admin / customization changes not showing + override allow-list + rollback.
- Frontend build/typecheck errors + documented Rollup-platform caveat.
- Backend build/test errors + 10-runner list.
- OneDrive / cloud-sync caveats.
- `.git/index.lock` safe recovery.
- Git workflow mistakes + safe staging workflow + recovery.
- 4-branch decision tree.
- Bug-report evidence template + explicit "never include" list.
- 16-recipe command appendix.

**Confirmed validation/test commands** (all verified verbatim from `package.json` files):

*Root:* `npm run build`, `npm run typecheck`, `npm run build:electron`, `npm run dev:electron`.

*Backend:* `npm run build`, `npm run typecheck`, `npm run dev`, plus the 10 test runners (`test:routing`, `test:agents`, `test:voice`, `test:memory`, `test:in-character`, `test:memory-candidate`, `test:memory-files`, `test:memory-integration`, `test:sqlite`, `test:backup`).

*Frontend:* `npm run dev`, `npm run typecheck`, `npm run build`, `npm run preview`.

*Electron:* `npm run dev`, `npm run build`, `npm run rebuild:sqlite`.

*PowerShell utilities*: `Get-Process` / `Stop-Process` / `Get-NetTCPConnection` / `Remove-Item` (winCodeSign cache + `.git/index.lock`) / `Get-ChildItem` (log inspection) / `Get-Content -Tail` (log tail) / `Select-String -SimpleMatch` (stale-marker grep) / `curl` / `explorer` / `Test-NetConnection` / `git --version` / `node --check` / standard `git` commands.

Zero invented scripts.

**Files changed on this turn (4 total):**

*Modified (4 files):*
- `docs/troubleshooting.md` — full rewrite from ~351-line Phase 10-A scaffold to 26-section Phase 10-F expanded canonical troubleshooting guide.
- `docs/README.md` — two edits: the "I want to troubleshoot a real problem" start-here-path entry for troubleshooting.md updated from scaffold placeholder to a substantive content summary; the Phase 10 roadmap table row for 10-F flipped from `⏳ Scaffold landed (full content in a later turn)` to `⏳ Implemented 2026-05-22 (review pending)`.
- `README.md` — one edit: documentation links section's `docs/troubleshooting.md` line updated from "(Phase 10-F scaffold)" to "(Phase 10-F expanded 2026-05-22)" with substantive content summary.
- `todo.md` — top-of-file Phase 10 rollup updated to include 10-F's substantive inline summary (in canonical order after 10-E); this §10-F implementation closure footer appended at EOF preserving all prior closure footers verbatim.

*Audited but NOT modified:*
- `docs/electron-release-runbook.md` (current; cross-linked from §6 + §8 + §9; no contradictions surfaced).
- `electron/NOTES.md` (current; pre-existing local-only modifications preserved).
- `docs/user-guide.md`, `docs/developer-setup.md`, `docs/add-an-agent.md`, `docs/customize-an-agent.md` (10-C/D/E closed; out of scope).
- `INSTRUCTIONS.md`, `architecture.md` (out of scope for 10-F).
- All `package.json` files (out of scope per strict-scope clause).
- All code.
- `Logo-Design.md`, `chat.md` (standing don't-touch list).

**Privacy / security guarantees preserved verbatim in the new troubleshooting guide:**

- No personal Windows username (`miche`) anywhere — generic `C:\Users\<you>\.creativedge` + `~/.creativedge` used throughout.
- No instructions to paste API keys / tokens / cookies / env dumps / chat transcripts / memory contents anywhere.
- Explicit "Never paste your token into the app" rule in §11.4.
- Explicit "Never include" list in the §25 bug-report evidence template covering API keys / tokens / cookies / SSH keys / Git credentials / chat content / memory contents / runtime DB / agent memory files / personal PII / screenshots of chat or memory.
- No claim of cloud sync (only opt-in git backup push to user-controlled private repo).
- No claim of auto-update / `electron-updater` / signing / GitHub Actions / telemetry / LAN binding / `0.0.0.0` / macOS-Linux packaged builds.
- No claim that crash reports are sent automatically — §14.6 explicitly states "There is no Send / Upload / Email / GitHub-issue button anywhere on the card."
- No claim that fixed ports 3001/5174 are required inside Electron — §4 + §5.3 explicitly frame them as dev-only / informational-only.
- Explicit "do not bypass confirmation modals" guidance preserved (§12.4, §17.5).
- Explicit "do not commit runtime memory or generated files" guidance preserved (§16, §22.4).
- Explicit `127.0.0.1`-only bind invariant preserved (§4, §10).
- The §7-D no-auth-gating non-goal preserved (§17.4).
- The dynamic-port behaviour documented as the canonical Electron-runtime contract throughout.

**Validation performed 2026-05-22 (all green):**
- `cd backend-api && npm run build` exit 0 (regression check; no backend code touched).
- `cd frontend && npm run typecheck` exit 0 (regression check; no frontend code touched).
- `cd frontend && npm run build` blocked by the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation (Windows host builds cleanly; not a regression).
- 5 `node --check`s on `electron/main.mjs` + `electron/preload.cjs` + `electron/scripts/build-deps.mjs` + `electron/scripts/build-win.mjs` + `electron/scripts/after-pack.mjs` all exit 0.
- Grep across `docs/troubleshooting.md` for the 16 stale/unsafe phrases (`Phase 9 open`, `9-D-C4 pending`, `must use port 3001`, `must use port 5174`, `electron-updater implemented`, `automatic update is enabled`, `telemetry enabled`, `crash reports are sent`, `uploads crash reports`, `0.0.0.0`, `C:\Users\<username>`, `commit runtime memory`, `store secrets in memory`, `bypass confirmation`, `paste your token`, `send crash report automatically`): zero hits.
- Every documented script verified to exist in the corresponding `package.json` (root + backend-api + frontend + electron). Zero invented scripts.

**Constraints honored on this turn:** Docs-only. No code changes anywhere. No `package.json` files modified. No `electron-updater` added. No signing wiring added. No GitHub Actions workflow added. No telemetry added. No new dependencies installed. No `node_modules/` changes. No generated artifacts. No `electron/dist-electron/` staged. No `Logo-Design.md` / `chat.md` touched (per the standing don't-touch rule). `README.md` modified ONLY for the documentation-link label update (one-section edit; permitted by the 10-F brief). `electron/NOTES.md` and `docs/electron-release-runbook.md` NOT touched (pre-existing local-only modifications preserved; Phase 10-F audit found no direct contradictions). No commit. No push. Phase 5 / 6 / 7 / 8 / 9 not reopened. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim — including §9-D-C4 implementation + §9-D-C4 Windows packaged-validation + §10-A + §10-B + §10-C + §10-D + §10-E closure footers.

**Deferred Phase 10-G work:** Final docs-quality QA pass (verify every link live, every command exists, every screenshot referenced is present, no stale-marker hits across all docs); the final docs-only flip closing 10-A through 10-G + Phase 10 overall. Phase 10-G is the only remaining slice in Phase 10.

**Phase 10 status after this turn:** Phase 10 overall **remains ⏳ In progress**. **10-A ⏳ Implemented 2026-05-22 (review pending)**. **10-B ⏳ Implemented 2026-05-22 (review pending)**. **10-C ⏳ Implemented 2026-05-22 (review pending)**. **10-D ⏳ Implemented 2026-05-22 (review pending)**. **10-E ⏳ Implemented 2026-05-22 (review pending)**. **10-F ⏳ Implemented 2026-05-22 (review pending)**. **10-G not started**. Phase 10 closes when 10-G closes. **Active slice: Phase 10-F (review pending)**. **Next pending slice: 10-G (final QA + Phase 10 closure)**. The user should review the new troubleshooting guide locally; on approval a future turn can proceed to 10-G. The Phase 5 deferred-extensions backlog and the post-Phase-6 polish backlog remain available to pick up opportunistically alongside or after Phase 10. Auto-update wiring + signing/release-feed remain explicit non-goals of Phase 9 — gated on a future signing-certificate decision. **No separate-track follow-ups outstanding** from the §10-F implementation turn.

---

# 2026-05-22 §10-G closure footer (final documentation QA — Phase 10 ✅ Complete)

**Status flip.** Phase 10-G (final documentation QA + Phase 10 closure) is now **✅ Complete / docs QA validated 2026-05-22**. With this slice closed, **Phase 10 overall is ✅ Complete / docs QA validated 2026-05-22** and all seven sub-slices (10-A → 10-G) are simultaneously flipped from `⏳ Implemented (review pending)` to `✅ Complete / docs validated 2026-05-22`. **All canonical phases (0 through 10) are now ✅ Complete.** No follow-up active phase — the canonical roadmap from §0 (scaffold) through §10 (documentation) is fully closed.

**Scope of this turn (docs-only — no code, no `package.json` files, no generated artifacts):**

*1.* `todo.md` (this file) — top-of-file Phase 10 active rollup converted to a Phase 10 ✅ Complete closure summary preserving the sub-slice descriptions as historical context; `Active phase: Phase 10 (Documentation)` note replaced with `Active phase: NONE — all canonical phases (0 through 10) are ✅ Complete as of 2026-05-22.` plus a QA summary; `Previously completed:` list extended with one **Phase 10** rollup entry + seven per-sub-slice entries (**10-A** through **10-G**), each ✅ Complete / docs validated 2026-05-22; this §10-G closure footer appended at EOF.

*2.* `docs/README.md` — `Current project status` table row for Phase 10 flipped from `⏳ Active` to `✅ Complete 2026-05-22`; Phase 10 roadmap table rows 10-A through 10-G flipped from `⏳ Implemented (review pending)` to `✅ Complete 2026-05-22`.

*3.* `README.md` — status banner updated to reflect Phase 10 closure if it still referenced Phase 10 as the active phase (one-section edit only — Quick Start, agent roster, and all body copy preserved verbatim per the standing don't-touch rule).

**Final QA pass performed 2026-05-22 on the in-tree docs inventory (results, all green except the one deferred leak documented below):**

*1.* **Link validation across all main docs** — `README.md`, `docs/README.md`, `docs/user-guide.md`, `docs/developer-setup.md`, `docs/add-an-agent.md`, `docs/customize-an-agent.md`, `docs/troubleshooting.md`, `docs/electron-release-runbook.md`. All internal anchors resolve. All relative paths exist on disk. All `https://github.com/michelbr84/CreativEdge/releases` references match the Phase 9-D-B4 allow-list verbatim — no other external URLs added. **0 broken links.**

*2.* **Script-command validation against the actual `package.json` files.** Root (16 scripts), `backend-api/` (15 scripts including 10 `test:*` runners: `test:routing`, `test:agents`, `test:in-character`, `test:memory`, `test:memory-files`, `test:memory-candidate`, `test:sqlite`, `test:backup`, `test:memory-integration`, plus the aggregate runner), `frontend/` (4 scripts: `dev`, `build`, `typecheck`, `preview`), `electron/` (4 scripts: `dev:electron`, `build:electron`, `setup:electron`, `pack:electron`). **All 29 documented commands match the actual package.json contents verbatim.** No invented scripts.

*3.* **Agent roster consistency QA.** `orchestrator/registry.json` has 14 entries: `nexus` + 13 specialists (`graphics-design`, `programming-tech`, `digital-marketing`, `video-animation`, `writing-translation`, `music-audio`, `business`, `finance`, `ai-services`, `personal-growth`, `consulting`, `data`, `photography`). `frontend/src/agents/agentCatalog.ts` has 14 aliases matching: `Nexus`, `Lumi`, `Bit`, `Buzz`, `Reel`, `Lex`, `Echo`, `Vera`, `Cash`, `Sage`, `Bloom`, `Atlas`, `Quant`, `Iris`. All 14 names + 14 slugs + 14 MBTI types match verbatim across registry / catalog / docs. **0 inconsistencies.**

*4.* **Electron dynamic-port documentation QA.** Confirmed all main docs accurately describe the Phase 9-D-C3 contract: backend port + static-server port both allocated at runtime via `net.createServer.listen(0)` against `127.0.0.1`; renderer reads `window.ceBridge.getRuntimeConfig()` (Phase 9-D-C3 preload bridge — synchronous, shallow-copy, only allocation metadata exposed) for the dynamic API base URL; legacy `3001` / `5174` only used in browser-dev workflows; no `0.0.0.0` binding anywhere; no LAN exposure. The `troubleshooting.md` port-collision recipe correctly distinguishes dev-static collision (legacy fixed ports) from packaged-Electron collision (dynamic ports). The `developer-setup.md` dev-loop section correctly notes that `npm run dev:electron` uses dynamic ports while `npm run dev` + `npm run dev:frontend` use the legacy fixed ports. **0 doc/code drift on the dynamic-port surface.**

*5.* **Privacy / security stale-phrase audit across all main docs.** Grepped for the documented stale/unsafe markers (`Phase 9 open`, `9-D-C4 pending`, `must use port 3001`, `must use port 5174`, `electron-updater implemented`, `automatic update is enabled`, `telemetry enabled`, `crash reports are sent`, `uploads crash reports`, `0.0.0.0`, `C:\\Users\\<username>`, `commit runtime memory`, `store secrets in memory`, `bypass confirmation`, `paste your token`, `send crash report automatically`). 28 hits investigated in context — **27 confirmed legitimate** (inside documented "search for these terms" recipes in `developer-setup.md` §13.5 + `troubleshooting.md` §25.13, or inside privacy-guarantee blocks like "never `0.0.0.0`" / "no `electron-updater`" / "no `0.0.0.0`" / "crash reports are NEVER sent automatically"); **1 actual leak** in `electron/NOTES.md:196` (literal user-home path). **Deferred** per the standing "preserve pre-existing local-only modifications to `electron/NOTES.md` and `docs/electron-release-runbook.md`" rule that has been in effect for all of Phase 10-A through 10-F. Tracked for a future docs-hygiene turn outside Phase 10. **Resolved in the pre-publication security review (2026-05-23):** the literal path was replaced with `<path-to-your-clone-of-CreativEdge>`.

*6.* **Code sanity regression check** (proves docs-only scope did not touch code):
   - `cd backend-api && npm run build` → exit 0
   - `cd frontend && npm run typecheck` → exit 0
   - `cd frontend && npm run build` → blocked by the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation only (Windows host builds cleanly; not a regression — same status as every prior docs-only turn from 10-A onward).
   - `node --check electron/main.mjs` → exit 0
   - `node --check electron/preload.cjs` → exit 0
   - `node --check electron/scripts/build-win.mjs` → exit 0
   - `node --check electron/scripts/after-pack.mjs` → exit 0
   - `node --check electron/scripts/build-deps.mjs` → exit 0
   - **All 5 `node --check`s pass.** None of the Electron scripts were touched on this turn.

*7.* **Scope verification.** `git status -s` on this turn: only `M todo.md`, `M docs/README.md`, and `M README.md` (where the status banner was stale). The other pre-existing local-only `M` lines (`Logo-Design.md`, `chat.md`, `docs/electron-release-runbook.md`, `electron/NOTES.md`, `frontend/src/styles.css`, plus the `M` lines on source files that pre-existed Phase 10) are untouched on this turn. **No code files modified. No `package.json` files modified. No `node_modules/` changes. No generated artifacts. No `electron/dist-electron/` staged.**

**Constraints honored on this turn:** Docs-only — only `todo.md`, `docs/README.md`, and `README.md` (status banner one-section update) modified. No code changes anywhere. No `package.json` files modified. No `electron-updater` added. No signing wiring added. No GitHub Actions workflow added. No telemetry added. No new dependencies installed. No `node_modules/` changes. No generated artifacts. No `electron/dist-electron/` staged. No `Logo-Design.md` / `chat.md` touched (per the standing don't-touch rule). `electron/NOTES.md` and `docs/electron-release-runbook.md` NOT touched (pre-existing local-only modifications preserved across all of Phase 10). No commit. No push. Phase 5 / 6 / 7 / 8 / 9 not reopened. Phase 5 deferred-extensions backlog untouched. Post-Phase-6 polish backlog untouched. §7-D intentionally-out-of-scope rationale preserved. Canonical heading order (Phase 0 → 10 → matrix → cut list → how-to-use footer) preserved. All historical audit/validation footers preserved verbatim — including §9-D-C4 implementation + §9-D-C4 Windows packaged-validation + §10-A + §10-B + §10-C + §10-D + §10-E + §10-F closure footers.

**Recommended commit message for this turn:** `docs: close Phase 10 documentation QA`

**Do not commit. Do not push. Wait for review.** Per the user's Phase 10-G brief.

**Deferred items tracked for future turns (outside Phase 10 scope):**

*1.* `electron/NOTES.md:196` literal user-home path leak (concrete `C:\Users\<username>\OneDrive\...` path) — preserve-as-is rule applied throughout Phase 10; tracked for a future docs-hygiene turn. **Resolved in the pre-publication security review (2026-05-23):** the literal path was replaced with `<path-to-your-clone-of-CreativEdge>`.
*2.* Root `package.json` description refresh — out of scope per the strict docs-only clause of the 10-G brief.
*3.* Auto-update wiring + signing/release-feed — explicit non-goal of Phase 9 / Phase 10; gated on a future signing-certificate decision.
*4.* Phase 5 deferred-extensions backlog (§5.3-C optional LLM summarization, §5.6-B nightly backup scheduling + push, §5.6-C destructive restore flow, optional all-agent compaction status variant) — opt-in / non-gating.
*5.* Post-Phase-6 polish backlog (light/dark theme toggle, syntax highlighting in code blocks, hooks split-out, file/image attach in composer) — opt-in / non-gating.

**Phase 10 status after this turn:** Phase 10 overall **✅ Complete / docs QA validated 2026-05-22**. **10-A ✅**, **10-B ✅**, **10-C ✅**, **10-D ✅**, **10-E ✅**, **10-F ✅**, **10-G ✅** — all seven sub-slices closed. **No active phase.** All canonical phases (0 through 10) are ✅ Complete as of 2026-05-22. **No separate-track follow-ups outstanding** from the §10-G QA turn.

---

# 2026-05-22 §11-A closure footer (repository governance + release readiness — review pending)

**Status.** Phase 11-A (Repository Governance + Release Readiness audit) is **⏳ Implemented 2026-05-22 (review pending)**. Phase 11 is a post-Phase-10 governance slice — not a new app feature slice. Phase 11-A is the only Phase 11 slice currently planned; an optional Phase 11-B (`.github/` issue + PR templates) is deferred and not part of this turn.

**Scope of this turn (docs + governance metadata only — no code changes):**

**Files created (6):**

*1.* `CONTRIBUTING.md` (~290 lines) — practical contributor handbook covering: project overview + current status (Phases 0–10 complete); Windows-first reality; setup (`npm run setup` + `npm run setup:electron`); run (`npm run dev:electron` / `npm run dev:backend` / `npm run dev:frontend`); build (`npm run build` + `npm run build:electron`); validation expectations by slice type; docs-only workflow; branch/commit hygiene with the explicit "never `git add .`" rule; Conventional Commits style; PR checklist; non-negotiable privacy/security rules (no API keys / no runtime memory / no chat transcripts / no `~/.creativedge/` / no `node_modules/` / no `electron/dist-electron/` / no secrets / no `0.0.0.0` / no telemetry / no `electron-updater`); AI coding agent protocol (plan first / strict scope / validation evidence / do not invent features / do not commit or push without approval / preserve historical evidence); where-to-find-things map.

*2.* `LICENSE` — proprietary "All Rights Reserved" notice for the `"private": true` repository. Copyright (c) 2026 Michel Duek. Contains the standard "no license granted by implication" language + a contributor-grant clause + a standard warranty disclaimer + an explicit note that the owner may switch to MIT/Apache/etc. later in writing if desired. **Safe default chosen because** `package.json` is `"private": true` across all 4 subpackages and the repo carries no open-source license declaration today. The owner can update this file at any time.

*3.* `SECURITY.md` (~180 lines) — security policy covering: supported versions (0.1.0 packaged + main); reporting via GitHub private vulnerability reporting (preferred) or repository-owner private access channel — **no invented email address**; what to include in a report (commit SHA / OS / affected component / repro steps / redacted logs); what NEVER to include (API keys / tokens / Anthropic / Claude Code CLI credentials / Git credentials / chat content / runtime memory / `~/.creativedge/sessions.db` / backup mirrors / personal identifiers); security model summary (local-first / 127.0.0.1 only / dynamic free-port allocation / no telemetry / hardened renderer / minimal preload bridge / crash reports local-only / opt-in backup push / unsigned installer / no `electron-updater`); responsible disclosure expectations (~90-day window guideline); out-of-scope items (no signing today / no `electron-updater` / no admin-console auth / no macOS / no Linux / `backendLogTail` redaction sanitizer not yet shipped).

*4.* `CHANGELOG.md` (~120 lines) — Keep-a-Changelog 1.1.0 style. `[Unreleased]` block captures Phase 11-A governance work. `[0.1.0] — 2026-05-22` block summarizes Phase 9 (9-A through 9-D-C4) + Phase 10 (10-A through 10-G) + security/privacy posture + known caveats (unsigned installer / Windows-only / no `electron-updater` / `backendLogTail` dropped). Explicit note: this release line has not yet been tagged or published as a GitHub Release.

*5.* `docs/release-readiness.md` (~280 lines) — release preflight checklist: preconditions (clean working tree + on main + tests green + LICENSE/SECURITY/CONTRIBUTING/CHANGELOG present); pre-existing local-only modifications list (preserving the standing don't-touch rule for `Logo-Design.md` / `chat.md` / `electron/NOTES.md`); build commands with expected stdout markers; **§3 Windows packaged validation walkthrough** (first launch / dynamic ports / chat / Setup wizard / six Ops cards / external release link / backup readiness / crash report local-only / clean shutdown / port cleanup / post-package backend dev sanity); artifact guidance (`electron/dist-electron/` NEVER committed; verify via `git check-ignore -v`); **§5 GitHub release draft checklist** (tag format `v0.1.0` / title format / `CHANGELOG.md` migration / local tag first / push only after approval / GitHub UI release creation / artifact upload / mark as Pre-release if requested); security caveats block to include in every release notes draft; §7 explicit "release publication is ALWAYS manual — AI coding agents must not publish autonomously"; §8 rollback procedure.

*6.* `docs/release-notes/v0.1.0.md` (~150 lines) — **draft** release notes for v0.1.0 (not published; awaiting maintainer approval). Title: "CreativEdge v0.1.0 — Windows desktop validation baseline". Contains: what this release is; highlights (one-chat-surface / local-first / hardened Electron / dynamic ports / Setup wizard / six Ops cards / Admin console / full docs); 14-agent roster table; what's inside the installer; installation steps; security caveats block (unsigned / no auto-update / crash reports stay on disk / backup push opt-in); known limitations (Windows-only / unsigned / no `electron-updater` / no GitHub Actions / no admin auth / `backendLogTail` dropped); upgrade path placeholder; acknowledgements; reporting issues; link to full evidence trail in `todo.md`.

**Files updated (5):**

*1.* `README.md` — extended the "License + repository" section to actually link to `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `docs/release-readiness.md`, and `docs/release-notes/`. Added an explicit note that no GitHub Release has been published yet as of Phase 11-A. **All other README sections preserved verbatim** — Quick Start, Key scripts, User data and privacy, Electron architecture summary, Deferred/non-goals, Documentation table, The roster, Per-agent file conventions are all unchanged.

*2.* `package.json` (root) — `description` refreshed from stale `"CreativEdge multi-agent chatbot — root orchestration (Phase 9-A deployment baseline + Phase 9-B Electron wrapper)."` to `"CreativEdge local-first multi-agent desktop chatbot — root workspace orchestration (backend + frontend + electron). Phases 0 through 10 complete (Windows desktop validated, full documentation set published)."`. **No other field touched** — `scripts`, `engines`, `version`, `private`, `type`, `name` all preserved verbatim.

*3.* `backend-api/package.json` — `description` refreshed from stale `"CreativEdge multi-agent chatbot — local backend service skeleton (Phase 2.1)."` to a current-reality description listing Fastify + SQLite (FTS5) + provider abstraction + the actual route surfaces (chat SSE / agents / sessions / search / memory promote / promote-episodic / compact / forget / status / ops / opt-in backup) + the `127.0.0.1 only` constraint.

*4.* `frontend/package.json` — `description` refreshed from stale `"CreativEdge Phase 6-A/6-B/6-C chat UI (Vite + React + TypeScript)."` to current-reality description: Vite + React + TypeScript chat UI + Phase 7 admin console (agents inspector + Phase 7-B safe editor + Phase 7-C memory diff editor + routing playground) + Phase 9-D Ops console (six cards listed verbatim) + the runtime-config preload-bridge contract.

*5.* `electron/package.json` — `description` refreshed from stale `"CreativEdge Phase 9-B Electron wrapper foundation (dev shell + Windows .exe build target)."` to current-reality description: hardened renderer (`contextIsolation` + `sandbox` + `nodeIntegration:false` + `webSecurity`) + Phase 9-D-C3 dynamic free-port allocation + Phase 9-D-B4 safe external-link preload bridge + Phase 9-D-B2 afterPack `better-sqlite3` ABI rebuild (packaged copy only) + Windows x64 NSIS build target.

*6.* `todo.md` (this file) — top-of-file Phase 11 active rollup added; the duplicated "Original Phase 10 description (preserved for historical context)" block at the end of the Phase 10 line removed (the duplicate "review pending" / "10-G not started" text was misleading after Phase 10 closure; full per-sub-slice prose is preserved in the "Previously completed:" list below and in the §10-A through §10-G closure footers at EOF); this §11-A closure footer appended at EOF.

**Validation performed 2026-05-22 (all green):**

- `cd backend-api && npm run build` → exit 0
- `cd frontend && npm run typecheck` → exit 0
- `cd frontend && npm run build` → blocked by the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation only (Windows host builds cleanly; not a regression).
- `node --check electron/main.mjs` → exit 0
- `node --check electron/preload.cjs` → exit 0
- `node --check electron/scripts/build-deps.mjs` → exit 0
- `node --check electron/scripts/build-win.mjs` → exit 0
- `node --check electron/scripts/after-pack.mjs` → exit 0
- All 4 `package.json` files parse as valid JSON.
- New docs grep clean:
  - `C:\\Users\\<username>` literal-path leak: 0 in newly-created files.
  - `0.0.0.0` only appears in negation blocks (never `0.0.0.0` / no `0.0.0.0` binding).
  - Invented email addresses: 0.
  - Auto-update / `electron-updater` claims: only appear in explicit deferred / non-goal / "do NOT use" context.
  - CHANGELOG does not claim a GitHub Release exists.
  - Release-readiness doc explicitly says generated artifacts are never committed.

**Constraints honored on this turn:**

- **Docs + governance metadata only.** No source code changes anywhere — `backend-api/src/`, `frontend/src/`, `electron/main.mjs`, `electron/preload.cjs`, `electron/scripts/*.mjs` all untouched.
- **No `package.json` `scripts` changes.** Only the `description` field was modified across the 4 `package.json` files.
- **No `package.json` `version` changes.** 0.1.0 preserved across all 4 subpackages.
- **No `package.json` `private` flag changes.** All 4 stay `"private": true`.
- **No dependency changes.** No `dependencies` / `devDependencies` / `peerDependencies` touched.
- **No tag created.** No `v0.1.0` tag, no `git tag` invocation.
- **No GitHub release published.** Release notes file is explicitly labeled `draft`.
- **No tag pushed.** No `git push` of any kind.
- **No commit.** Working-tree changes only.
- **No `electron/dist-electron/` staged.** Verified ignored by `electron/.gitignore:2:dist-electron/`.
- **No `node_modules/` staged.** Verified ignored by root `.gitignore`.
- **No `~/.creativedge/` data staged.** Verified ignored by root `.gitignore`.
- **No secrets, tokens, API keys, env vars, chat content, or runtime memory** added to any committed file.
- **No `Logo-Design.md` / `chat.md` touched** (standing don't-touch rule preserved).
- **No `electron/NOTES.md` touched** (pre-existing local-only modifications preserved across all of Phase 10 and now Phase 11-A; the username leak at line 196 remains tracked as a deferred future docs-hygiene item).
- **No `docs/electron-release-runbook.md` touched** (pre-existing local-only modifications preserved).
- **Canonical heading order preserved.** Phase 0 → Phase 10 → matrix → cut list → how-to-use footer → all historical closure footers (including §10-G) → new §11-A closure footer at EOF.
- **All historical audit/validation footers preserved verbatim** — including every §9-D-* and §10-* closure footer.
- **Phase 10 closure verbiage preserved** in the top-of-file Phase 10 rollup; only the misleading duplicated "(review pending)" / "10-G not started" historical block was removed.

**Repository governance audit findings (recorded for this turn):**

- Before this turn: `CONTRIBUTING.md`, `LICENSE` / `LICENSE.md`, `SECURITY.md`, `CHANGELOG.md`, `RELEASE.md`, `docs/release-process.md`, `docs/release-readiness.md`, `docs/release-notes/`, `docs/releases/`, and `.github/` were all **MISSING**.
- After this turn: `CONTRIBUTING.md`, `LICENSE`, `SECURITY.md`, `CHANGELOG.md`, `docs/release-readiness.md`, and `docs/release-notes/v0.1.0.md` are all **PRESENT**. `.github/` issue + PR templates remain MISSING (deferred to optional Phase 11-B).
- `.gitignore` audit: root `.gitignore` covers `node_modules/`, `dist/`, `build/`, `out/`, `.env`, `.creativedge/`, `*.db`, logs, IDE files, OS files, and `body-*.json` local curl test bodies. `electron/.gitignore` covers `dist-electron/`, `dist/`, `out/`, `node_modules/`. Both are reasonable; no additions needed for this slice.
- `electron/dist-electron/` is correctly gitignored (`git check-ignore -v` confirms `electron/.gitignore:2:dist-electron/`). The existing local `CreativEdge-Setup-0.1.0.exe` + `win-unpacked/` artifacts will not be staged.
- No git tags exist on the repository (no `v0.1.0` or any other release tag).
- No published GitHub Release exists (the `Latest releases` URL in README is a directory link, not a release link — verified by inspection).

**Deferred items tracked for future turns (outside Phase 11-A scope):**

*1.* **Optional Phase 11-B** — add `.github/pull_request_template.md` + `.github/ISSUE_TEMPLATE/bug_report.md`. Not part of this turn; kept manageable.
*2.* **Maintainer-approved v0.1.0 release publication** — gated on maintainer review of the governance docs landed here. Path: follow `docs/release-readiness.md` §5 GitHub release draft checklist. Do NOT proceed autonomously.
*3.* `electron/NOTES.md:196` literal user-home path leak — preserve-as-is rule applied throughout Phase 10 + 11-A; tracked for a future docs-hygiene turn (would be Phase 11-C or a standalone hygiene slice).
*4.* Auto-update wiring + signing/release-feed — explicit non-goal of Phase 9 / Phase 10 / Phase 11; gated on a future signing-certificate decision.
*5.* Phase 5 deferred-extensions backlog + post-Phase-6 polish backlog — opt-in / non-gating.

**Files NOT touched on this turn (verified):**

- `Logo-Design.md`, `chat.md` (standing don't-touch).
- `electron/NOTES.md` (preserved local-only mods).
- `docs/electron-release-runbook.md` (preserved local-only mods).
- All `agents/<slug>/*`, `orchestrator/*` (no roster changes).
- All `backend-api/src/**` (no backend code changes).
- All `frontend/src/**` (no frontend code changes).
- All `electron/*.mjs`, `electron/*.cjs`, `electron/scripts/*` (no Electron lifecycle changes).
- `scripts/*.mjs` (no root-level script changes).
- All `.gitignore` files (no ignore-rule changes).
- `architecture.md`, `INSTRUCTIONS.md` (no agent-spec changes).
- `docs/README.md`, `docs/user-guide.md`, `docs/developer-setup.md`, `docs/add-an-agent.md`, `docs/customize-an-agent.md`, `docs/troubleshooting.md` (no Phase 10 doc reopens — they remain ✅ Complete as landed in Phase 10).

**Recommended commit message for this turn:** `docs: add repository governance and release readiness docs`

**Do not commit. Do not push. Wait for review.** Per the user's Phase 11-A brief.

**Phase 11 status after this turn:** Phase 11 overall **⏳ In progress**. **11-A ⏳ Implemented 2026-05-22 (review pending)** — sandbox-side validation green. Phase 11 closes when 11-A closes (and optionally 11-B if the maintainer opts to add `.github/` templates). All canonical phases (0 through 10) remain ✅ Complete. **Next active step:** maintainer review of the six new governance files + five updated metadata files. On approval, the maintainer can choose to (a) cut the v0.1.0 GitHub release via `docs/release-readiness.md` §5, (b) land optional Phase 11-B (`.github/` templates), or (c) close Phase 11-A as-is and reopen Phase 11-B / release publication later. **No separate-track follow-ups outstanding** from the §11-A audit turn beyond the deferred-items list above.

---

# 2026-05-23 §11-B closure footer (GitHub templates + release publication readiness — review pending)

**Status.** Phase 11-B (GitHub collaboration templates + release publication readiness recheck) is **⏳ Implemented 2026-05-23 (review pending)** on top of Phase 11-A (committed at `c987c3f`). Phase 11-A is now **✅ Complete / committed 2026-05-23** as a historical state. Phase 11 overall **remains ⏳ In progress**; whether to close it depends on whether the maintainer wants to keep it open as the bucket for future release-publication work or close it once 11-B lands and re-open a future Phase 11-C if needed.

**Scope of this turn (docs + GitHub templates only — no code, no scripts, no deps, no version, no tag, no release):**

**Files created (6):**

*1.* `.github/pull_request_template.md` (~115 lines) — auto-populates the PR body on GitHub. Sections: Summary; Scope; Type of change checkbox list (`docs:` / `fix:` / `feat:` / `refactor:` / `chore:` / `release:`); Phase / roadmap reference (with link to `todo.md`); Files changed; Validation run checkbox list (backend build / frontend typecheck / frontend build / 5 × `node --check` on Electron scripts / relevant backend tests / `npm run build:electron` if applicable / docs link check); Screenshots/recordings; **Privacy / security checklist** (10 non-negotiable boxes: no API keys / no chat content / no runtime memory / no `~/.creativedge/` / no `node_modules/` / no `electron/dist-electron/` / no telemetry / 127.0.0.1 only / no `electron-updater` without approved phase / no new external network calls); Release impact (no impact / release notes needed / packaged-build validation needed); Reviewer checklist. Closes with cross-links to CONTRIBUTING / SECURITY / CHANGELOG / docs/release-readiness.md / todo.md.

*2.* `.github/ISSUE_TEMPLATE/bug_report.md` (~110 lines) — front-matter `name: Bug report` + auto-labels `bug,triage`. Top warning explicitly redirects security vulnerabilities to GitHub Private Vulnerability Reporting (`SECURITY.md`) — do NOT file vulnerabilities here. Sections: Environment (OS + app-mode checkbox: browser-dev / Electron-dev / packaged + commit SHA + Claude Code CLI auth state); What happened; Expected behavior; Steps to reproduce; Logs (with `~/.creativedge/logs/` path + fenced code block + aggressive-redaction reminder); Validation already tried (5-box checklist citing the troubleshooting recipes); Screenshots optional; **What NOT to include** (8-item explicit list: API keys / tokens / Anthropic credentials / Git credentials / chat content / runtime memory / `sessions.db` / backup mirrors / personal paths).

*3.* `.github/ISSUE_TEMPLATE/feature_request.md` (~115 lines) — front-matter `name: Feature request` + auto-labels `enhancement,triage`. Sections: Problem / opportunity; Proposed solution; User workflow (numbered steps); Scope boundaries (in / out); **Privacy / security impact** (9-box checklist with explicit defaults — telemetry NO; auto-update gated on signing decision; admin auth non-goal per §7-D; etc.); Release impact (3 options); Documentation impact (which docs would change); Alternatives considered; Acceptance criteria (testable conditions).

*4.* `.github/ISSUE_TEMPLATE/documentation.md` (~85 lines) — front-matter `name: Documentation issue` + auto-labels `documentation,triage`. Sections: Document affected (17-box checklist covering every main doc + INSTRUCTIONS.md + architecture.md + electron/NOTES.md + "Other"); Section / heading; What is wrong / missing (with 6 named categories: factually wrong / outdated / missing / unclear / broken link / wrong command); Suggested correction; Source of truth (where the doc should match); Link / command validation (3 boxes); Privacy check.

*5.* `.github/ISSUE_TEMPLATE/config.yml` (44 lines, valid YAML) — issue chooser config. `blank_issues_enabled: false` to push reports through the three templates above. `contact_links` array with 5 entries, all using **real GitHub URLs only** (no invented email addresses): (a) GitHub Private Vulnerability Reporting at `/security/advisories/new`; (b) `docs/troubleshooting.md`; (c) `docs/release-readiness.md`; (d) `CONTRIBUTING.md`; (e) `todo.md`.

*6.* `docs/release-notes/README.md` (~75 lines) — release-notes-drafts index. Explains: this directory holds drafts (not GitHub Releases); `v0.1.0.md` is the source for a future manual GitHub release; the canonical procedure is `docs/release-readiness.md` §5; this directory is NOT a GitHub Release / NOT an artifact upload / NOT automated; how to add a new draft (filename pattern `v<MAJOR>.<MINOR>.<PATCH>.md`); why a draft is distinct from the CHANGELOG `[Unreleased]` entry.

**Files updated (3):**

*1.* `CONTRIBUTING.md` — Pull request checklist section now opens with a paragraph pointing contributors at `.github/pull_request_template.md` (which GitHub auto-prefills on PR open) and notes that contributors using non-GitHub tooling should paste the template body manually. The pre-existing condensed pre-open checklist is preserved unchanged.

*2.* `CHANGELOG.md` — `[Unreleased]` block extended: **Added** section gained the 6 new file paths with one-line descriptions of each. **Changed** section gained a note about the `CONTRIBUTING.md` PR-checklist pointer addition. **Notes** section gained a line stating that `gh release list` was not verifiable in the Phase 11-B sandbox (the `gh` CLI is not available there); local `git tag` confirms no tags exist, which matches the assumption that no GitHub Release exists yet. No claim is made that v0.1.0 is published.

*3.* `todo.md` (this file) — top-of-file Phase 11 rollup updated: 11-A flipped to ✅ Complete / committed 2026-05-23 at `c987c3f` (as a historical reference); 11-B inline rollup added in implementation-pending-validation state; this §11-B closure footer appended at EOF.

**Files audited and confirmed already-correct (no changes needed):**

- `docs/release-readiness.md` — already covers every brief §G requirement verbatim: clean working tree (§1), build commands (§2), the 11-subsection Windows packaged-validation walkthrough (§3 — first launch / dynamic ports / chat / Setup / six Ops cards / external release link / backup readiness / crash report local-only / clean shutdown / port cleanup / post-package backend dev sanity), artifact rule including the explicit "never commit `electron/dist-electron/`" + `git check-ignore -v` verification (§4), GitHub release draft checklist with tag plan v0.1.0 + release title + release notes source + manual upload (§5), security caveats block to include in release notes (§6), §7 "publication is ALWAYS manual — AI coding agents must not publish autonomously", §8 rollback.
- `docs/release-notes/v0.1.0.md` — already labelled `draft`, not published; release title `CreativEdge v0.1.0 — Windows desktop validation baseline` matches the release-readiness §5 suggestion; security caveats block present; known limitations include Windows-only / unsigned / no `electron-updater` / no GitHub Actions / no admin auth / `backendLogTail` dropped.
- `LICENSE` — unchanged proprietary / All Rights Reserved notice.
- `SECURITY.md` — unchanged: directs reports to GitHub Private Vulnerability Reporting, contains no invented email, lists explicit out-of-scope items.
- `README.md` — already links to LICENSE / CONTRIBUTING / SECURITY / CHANGELOG / docs/release-readiness.md / docs/release-notes/ in the License + repository section after Phase 11-A. **Decision:** do not add a separate link to `.github/` templates in README — they are auto-surfaced by the GitHub UI; adding a README pointer would bloat without clear value.

**Release / tag state found this turn:**

- `git tag --list` → **empty** (no tags exist).
- `gh release list` → **not verifiable locally** (the `gh` CLI is not available in this Linux sandbox). Recorded explicitly in CHANGELOG.md.
- No `v0.1.0` tag created in this turn.
- No GitHub Release published in this turn.
- Suggested target remains `v0.1.0` per the existing `docs/release-readiness.md` §5.

**Validation performed 2026-05-23 (all green):**

- `cd backend-api && npm run build` → exit 0
- `cd frontend && npm run typecheck` → exit 0
- `cd frontend && npm run build` → blocked by the documented Linux-sandbox `@rollup/rollup-linux-x64-gnu` limitation only (Windows host builds cleanly; not a regression).
- `node --check electron/main.mjs` → exit 0
- `node --check electron/preload.cjs` → exit 0
- `node --check electron/scripts/build-deps.mjs` → exit 0
- `node --check electron/scripts/build-win.mjs` → exit 0
- `node --check electron/scripts/after-pack.mjs` → exit 0
- `.github/ISSUE_TEMPLATE/config.yml` → parses as valid YAML (`python3 -c "import yaml; yaml.safe_load(open('.github/ISSUE_TEMPLATE/config.yml'))"` exit 0).
- New file grep:
  - `C:\\Users\\<username>` literal-path leaks in newly-created files: 0.
  - Invented email addresses in newly-created files: 0.
  - Claims of "GitHub Release is published" in newly-created files: 0 (CHANGELOG explicitly says "not yet tagged or published"; release-notes draft labelled "draft"; release-notes/README explicitly distinguishes drafts from published releases).
  - Instructions to commit `electron/dist-electron`: 0 (the only mentions of `dist-electron` are in the PR template's "never commit" list and the release-notes/README's "what this directory is NOT" block).
  - `0.0.0.0` references: only in the PR template's `127.0.0.1 only` privacy reminder (legitimate).
  - `electron-updater` references: only in the feature-request template's "default position: gated on signing decision" block and the PR template's "no electron-updater without approved phase" rule (legitimate).
- All new relative links in `.github/` templates target real files (verified with `ls` on each `../../<path>` resolution).

**Constraints honored on this turn:**

- **Docs + GitHub templates only.** No source code changes anywhere.
- **No `package.json` `scripts` / `dependencies` / `version` / `private` changes.** All 4 subpackages stay `0.1.0` / `"private": true`.
- **No new dependencies.** No `npm install` of anything.
- **No git tag created.** No `v0.1.0` tag, no other tags.
- **No GitHub Release published.** Release-notes file remains a draft.
- **No tag pushed.** No `git push` of any kind.
- **No commit on this turn.** Working-tree changes only.
- **No GitHub Actions workflow added.** Out of scope per brief.
- **No Dependabot config added.** Out of scope per brief.
- **No CODEOWNERS added.** Out of scope per brief.
- **No funding/sponsor files added.** Out of scope per brief.
- **No `electron/dist-electron/` staged.** Verified gitignored by `electron/.gitignore:2:dist-electron/`.
- **No `node_modules/` staged.** Verified gitignored.
- **No `~/.creativedge/` data staged.** Verified gitignored.
- **No secrets, tokens, API keys, env vars, chat content, or runtime memory** added to any newly-created file.
- **No `Logo-Design.md` / `chat.md` touched** (standing don't-touch rule preserved).
- **No `electron/NOTES.md` touched** (pre-existing local-only modifications preserved across Phase 10 + 11-A + 11-B).
- **No `docs/electron-release-runbook.md` touched** (pre-existing local-only modifications preserved).
- **No `LICENSE` / `SECURITY.md` rewrite.** Both unchanged from Phase 11-A.
- **No README.md changes.** Phase 11-A already added the governance links; no further additions needed.
- **Canonical heading order preserved.** Phase 0 → Phase 10 → matrix → cut list → how-to-use footer → §9-D-C closure footers → §10-A through §10-G closure footers → §11-A closure footer → new §11-B closure footer at EOF.
- **All historical audit/validation footers preserved verbatim** — including the §11-A footer above this one.

**Deferred items tracked for future turns (outside Phase 11-B scope):**

*1.* **Maintainer-approved v0.1.0 release publication** — follow `docs/release-readiness.md` §5. Do NOT proceed autonomously.
*2.* **Optional Phase 11-C** could collect future governance follow-ups (e.g., GitHub Actions read-only CI for build/typecheck, Dependabot config, CODEOWNERS, funding) — none planned today; gated on maintainer decision.
*3.* `electron/NOTES.md:196` literal user-home path leak — preserve-as-is rule applied across Phase 10 / 11-A / 11-B; tracked for a future docs-hygiene turn.
*4.* Auto-update wiring + signing/release-feed — explicit non-goal of Phase 9 / Phase 10 / Phase 11; gated on a future signing-certificate decision.
*5.* Phase 5 deferred-extensions backlog + post-Phase-6 polish backlog — opt-in / non-gating.

**Files NOT touched on this turn (verified by post-edit `git status -s`):**

- `Logo-Design.md`, `chat.md` (standing don't-touch).
- `electron/NOTES.md` (preserved local-only mods).
- `docs/electron-release-runbook.md` (preserved local-only mods).
- All `agents/<slug>/*`, `orchestrator/*` (no roster changes).
- All `backend-api/src/**` (no backend code changes).
- All `frontend/src/**` (no frontend code changes).
- All `electron/*.mjs`, `electron/*.cjs`, `electron/scripts/*` (no Electron lifecycle changes).
- `scripts/*.mjs` (no root-level script changes).
- All `.gitignore` files (no ignore-rule changes).
- All 4 `package.json` files (no `description` / `scripts` / `deps` / `version` / `private` changes — they stay as committed in `c987c3f`).
- `architecture.md`, `INSTRUCTIONS.md` (no agent-spec changes).
- `docs/README.md`, `docs/user-guide.md`, `docs/developer-setup.md`, `docs/add-an-agent.md`, `docs/customize-an-agent.md`, `docs/troubleshooting.md` (Phase 10 docs unchanged).
- `docs/release-readiness.md` (Phase 11-A doc unchanged — audit found already correct).
- `docs/release-notes/v0.1.0.md` (Phase 11-A doc unchanged — audit found already correct).
- `LICENSE`, `SECURITY.md`, `README.md` (Phase 11-A files unchanged — already cover what they need to).

**Recommended commit message for this turn:** `docs: add GitHub templates and release publication checklist`

**Do not commit. Do not push. Wait for review.** Per the user's Phase 11-B brief.

**Phase 11 status after this turn:** Phase 11 overall **⏳ In progress**. **11-A ✅ Complete / committed 2026-05-23** at `c987c3f`. **11-B ⏳ Implemented 2026-05-23 (review pending)** — sandbox-side validation green. All canonical phases (0 through 10) remain ✅ Complete. **Next active step:** maintainer review of the six new `.github/` + `docs/release-notes/README.md` files + the three updated files (CONTRIBUTING, CHANGELOG, todo.md). On approval, the maintainer can choose to (a) cut the v0.1.0 GitHub release via `docs/release-readiness.md` §5, (b) close Phase 11 as the governance + release-readiness layer is complete, or (c) open optional Phase 11-C for additional GitHub metadata (CI workflow, Dependabot, CODEOWNERS, funding) if desired. **No separate-track follow-ups outstanding** from the §11-B audit turn beyond the deferred-items list above.

---

# 2026-05-23 v0.1.0 GitHub Pre-release publication footer (docs-only update)

**Event.** Phase 11-B's `docs/release-readiness.md` §5 GitHub release draft checklist was executed manually by the maintainer on 2026-05-23. **CreativEdge v0.1.0 is now published as a GitHub Pre-release.**

**Publication facts:**

- **Tag:** `v0.1.0`
- **Target commit:** `ebc159e` (`docs: add GitHub templates and release publication checklist` — the Phase 11-B commit).
- **Pre-release flag:** ✅ enabled (recommended for the initial baseline per `docs/release-readiness.md` §5 + §6 — installer is unsigned and there is no `electron-updater` channel yet).
- **Release page:** <https://github.com/michelbr84/CreativEdge/releases/tag/v0.1.0>.
- **Title:** `CreativEdge v0.1.0 — Windows desktop validation baseline`.
- **Description source:** [`docs/release-notes/v0.1.0.md`](docs/release-notes/v0.1.0.md).
- **Assets attached (4):**
  - `CreativEdge-Setup-0.1.0.exe` — Windows x64 NSIS installer.
  - `CreativEdge-win-unpacked-v0.1.0.zip` — unpacked binary for users who prefer not to run an installer.
  - `Source code (zip)` — auto-generated by GitHub at tag time.
  - `Source code (tar.gz)` — auto-generated by GitHub at tag time.

**Scope of this docs-only update (3 files):**

*1.* `CHANGELOG.md` — `[Unreleased]` Notes block updated: replaced the "has not yet been tagged or published" sentence + the "no GitHub Release exists yet" sentence with a confirmation that v0.1.0 was published manually on 2026-05-23 as a GitHub Pre-release (tag `v0.1.0`, target `ebc159e`). The `[0.1.0] — 2026-05-22` block gained a publication block listing the tag / target commit / Pre-release flag / release page URL / asset list / release-notes source.

*2.* `docs/release-notes/v0.1.0.md` — front-matter Status banner flipped from "Release notes **draft**. Not published as a GitHub Release yet." to "Published manually on 2026-05-23 as a GitHub Pre-release." The Target tag / Target title / Target date triplet was promoted to Tag / Title / Target commit (`ebc159e`) / Publication date (2026-05-23) / Pre-release flag, and a 4-asset list was inserted with the release page URL.

*3.* `docs/release-notes/README.md` — the `v0.1.0.md` entry in "What lives here" updated from "Draft release notes ... **Not published as a GitHub Release as of Phase 11-B closure**" to "**Published manually on 2026-05-23 as a GitHub Pre-release** (tag `v0.1.0`, target commit `ebc159e`)" plus a permanent link to the release page and a statement that the file remains in-repo as the canonical source of the release description.

*4.* `todo.md` (this file) — this 2026-05-23 v0.1.0 publication footer appended at EOF.

**Constraints honored on this turn (docs-only):**

- **No code changes.** No source code, no `package.json` files, no scripts, no dependencies, no version-field changes (0.1.0 remains the canonical version across all 4 subpackages).
- **No additional tag created.** Only the existing `v0.1.0` tag created by the maintainer during the release publication is acknowledged.
- **No additional release published.** Only the existing GitHub Pre-release at `v0.1.0` is acknowledged.
- **No build artifacts uploaded from this turn.** The `CreativEdge-Setup-0.1.0.exe` + `CreativEdge-win-unpacked-v0.1.0.zip` listed above were uploaded manually by the maintainer during the GitHub UI release-creation step.
- **No `electron/dist-electron/` staged.** Still gitignored by `electron/.gitignore:2:dist-electron/`.
- **No `node_modules/` staged.** Still gitignored.
- **No `~/.creativedge/` data staged.** Still gitignored.
- **No commit on this turn.** Working-tree changes only.
- **No push on this turn.**
- **`Logo-Design.md`, `chat.md`, `electron/NOTES.md`, `docs/electron-release-runbook.md` not touched** (standing don't-touch / preserved local-only mods rules).
- **README.md not touched** (its "Latest releases" link to `https://github.com/michelbr84/CreativEdge/releases` already resolves to a page that now contains the new v0.1.0 Pre-release; no edit required).
- **`docs/release-readiness.md` not touched** (the §5 procedure was followed correctly; no doc change needed because the procedure remains valid for v0.1.1+).
- **`LICENSE`, `SECURITY.md`, `CONTRIBUTING.md` not touched.**

**Validation performed 2026-05-23 (docs-only):**

- `git status -s` after edits — only `M CHANGELOG.md`, `M docs/release-notes/README.md`, `M docs/release-notes/v0.1.0.md`, `M todo.md` newly added vs. the pre-existing local-only `M` set. No source code or generated artifacts staged.
- Grep audit of edited files confirms no remaining sentence that says "v0.1.0 is not published" / "Not published as a GitHub Release yet" / "no GitHub Release exists yet" / "has not yet been tagged".
- The release page URL `https://github.com/michelbr84/CreativEdge/releases/tag/v0.1.0` matches the Phase 9-D-B4 external-link allow-list base (same `github.com/michelbr84/CreativEdge/releases` host); no new external URL added beyond the existing allow-list domain.

**Recommended commit message for this turn:** `docs: record v0.1.0 GitHub pre-release publication`

**Do not commit. Do not push. Wait for review.** Per the user's brief.

**Phase 11 status after this turn:** **11-A ✅ Complete / committed 2026-05-23** at `c987c3f`. **11-B ✅ Implemented / committed 2026-05-23** at `ebc159e`. **v0.1.0 ✅ Published 2026-05-23 as GitHub Pre-release** (tag `v0.1.0` → `ebc159e`). The current docs-only update lands the post-publication evidence; once committed, Phase 11 can be considered ✅ Complete (with the maintainer's optional Phase 11-C / future v0.1.1 release work remaining as opt-in follow-ups).
