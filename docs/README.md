# CreativEdge — Documentation Map

This is the index for everything written about CreativEdge — the
local-first multi-agent chatbot with a desktop Electron front-end, a
local Fastify backend, and 14 distinct AI agents (one orchestrator
**🌐 Nexus** + 13 specialists).

If you just want to run the app: jump to the **[top-level
`README.md`](../README.md)** Quick Start.

If you want everything else, this page is the map.

---

## Start here

Pick the path that matches what you're trying to do:

### I want to run the app on Windows.
1. Read the **[top-level `README.md`](../README.md)** — Quick Start +
   prerequisites + the canonical command list.
2. If something goes wrong: **[`docs/troubleshooting.md`](troubleshooting.md)**.

### I want to use the app (chat, agents, settings, backups, ops).
- **[`docs/user-guide.md`](user-guide.md)** — full Phase 10-C
  user guide (expanded 2026-05-22): chat basics, slash commands,
  `@<alias>` syntax, agent selection + Nexus routing, the Setup
  wizard's four steps, the Ops console's seven cards (Diagnostics
  / Usage & cost / Budget & trends / Local logs / Crash reports
  / Backup / Update info), the Backup panel's explicit push UX
  with the four readiness blockers and second-confirmation modal,
  crash-report local-only export, manual update flow, runtime
  data + privacy posture, nine beginner workflows, glossary.

### I want to build / debug / package the app.
- **[`docs/developer-setup.md`](developer-setup.md)** — full Phase
  10-D developer onboarding guide (expanded 2026-05-22): 18
  sections covering prerequisites, repo layout, install workflow,
  the three run modes (browser dev / Electron dev / packaged),
  verified per-subpackage script tables (root + backend + frontend
  + electron with every test runner enumerated verbatim from
  `package.json`), backend development reference (routes /
  providers / storage / memory / backup / routing), frontend
  development reference (App.tsx / API client / Vite proxy /
  `VITE_API_URL` semantics), Electron development reference (main
  / preload / build-deps / build-win / afterPack / `better-sqlite3`
  ABI rebuild contract / winCodeSign caveat), runtime data
  directory, provider / Claude Code CLI configuration, the
  non-negotiable development safety + privacy rules, validation
  checklists for docs-only / backend / frontend / Electron-lifecycle
  slices, the concise packaging checklist, the git workflow + the
  "working with AI coding agents" briefing template, twelve common
  developer tasks (start dev, build packaged, check health, read
  logs, verify dynamic ports, run tests, recover stale processes,
  clear winCodeSign cache, rebuild backend post-package).
- **[`docs/electron-release-runbook.md`](electron-release-runbook.md)**
  — full operational reference for the Electron desktop wrapper:
  local dev launch, packaged Windows build, testing the packaged
  build, validating backend / port cleanup, rebuilding native
  modules manually, publishing a GitHub release manually, manual
  release-check flow with the preload-bridge architecture diagram,
  the explicit table of what is **intentionally NOT** implemented
  (no `electron-updater`, no signing, no GitHub Actions release
  workflow, no background polling, no auto-install, no telemetry,
  no crash-report send), six troubleshooting recipes including the
  Phase 9-D-B4 `window.open denied` root-cause + fix.
- **[`electron/NOTES.md`](../electron/NOTES.md)** — Electron
  architecture notes: backend-child + static-server lifecycle,
  Phase 9-D-C3 dynamic free-port allocation, the preload bridge
  (`window.ceBridge.openExternal` + `window.ceBridge.getRuntimeConfig`),
  the `afterPack` ABI-rebuild contract, what is NOT implemented and why.

### I want to add or customize an agent.
- **[`docs/add-an-agent.md`](add-an-agent.md)** — full Phase 10-E
  add-an-agent guide (expanded 2026-05-22): 15-section canonical
  reference covering when to add an agent vs customize an existing
  one, the current 14-voice architecture, naming/slug rules, the
  six required files (`identity.md` / `soul.md` / `personality.md`
  / `system_prompt.md` / `config.json` / `memory/*`), config.json
  schema verified against the live source, system-prompt + MBTI +
  memory design guides, registry update procedure with
  routing-keyword design rules, routing-rules update procedure,
  frontend catalogue + alias rules, backend impacts, test-fixture
  update map, validation checklist, common mistakes, minimal PR
  checklist.
- **[`docs/customize-an-agent.md`](customize-an-agent.md)** —
  full Phase 10-E customize-an-agent guide (expanded 2026-05-22):
  15-section canonical reference covering the customization
  decision tree (override vs source), runtime overrides vs source
  edits, Phase 7-B agent editor + Phase 7-C memory editor +
  Phase 7-A routing playground contracts, source-file
  customization safety per file (identity / soul / personality /
  system_prompt / config / memory templates), voice + personality
  safety against contamination, routing customization with
  anti-patterns, memory customization (runtime vs template),
  UI-metadata customization, validation checklist, rollback
  strategy, common mistakes, safe AI-agent delegation
  instructions, why you must NEVER rename a slug, minimal PR
  checklist.
- **[`../INSTRUCTIONS.md`](../INSTRUCTIONS.md)** — the canonical
  agent-roleplay spec: how a turn works, reply format, the full
  roster + voice fingerprints, the Phase 3 routing/convening
  semantics, the Phase 3.3 hand-off pattern. Read this if you are
  an LLM playing the 14 roles.
- **[`../architecture.md`](../architecture.md)** — design intent:
  turn shape, MBTI assignment rationale, memory model, hand-off
  semantics, intentional temperament balance across the roster.

### I want to troubleshoot a real problem.
- **[`docs/troubleshooting.md`](troubleshooting.md)** — full
  Phase 10-F troubleshooting guide (expanded 2026-05-22):
  26-section canonical reference including the **first 5
  checks** fast-triage list, app-does-not-open diagnosis,
  backend `/healthz` failure + how to read dynamic ports from
  Electron logs, stale process / port cleanup, the winCodeSign
  symlink permission error (Admin / Developer Mode / cache-clear
  options), `better-sqlite3` `NODE_MODULE_VERSION` mismatch
  (with the Phase 9-D-B2 afterPack contract verbatim), packaged
  build succeeds but app fails diagnosis, release link doesn't
  open, manual latest-release-check outcomes table, backup
  disabled + the four readiness blockers, backup push failure
  diagnosis, crash reports empty/Prepare-fails diagnosis +
  the 17-field allow-list verbatim, Claude Code CLI
  missing/auth-unknown (mock-fallback explainer), chat-recovery
  red-banner false-negative explained (Phase 9-B chat-recovery
  patches), sessions + memory diagnosis, admin /
  customization-not-showing diagnosis, frontend + backend
  build-error diagnoses, OneDrive / cloud-sync caveats with
  the safe-practices list, `.git/index.lock` safe recovery,
  git workflow mistakes + recovery, troubleshooting decision
  tree, evidence template for bug reports, and a 16-recipe
  quick-command appendix.
- **[`docs/electron-release-runbook.md`](electron-release-runbook.md)**
  — full Electron operational troubleshooting (§9 of the runbook
  has six named recipes).

### I am an AI / coding agent continuing this project.
1. **[`../todo.md`](../todo.md)** is the concise current-state
   roadmap — current status, published releases, completed phases,
   open / deferred backlog, maintenance rules. Always read it
   before claiming work is done or pending.
2. **[`roadmap-history.md`](roadmap-history.md)** is the archival
   evidence trail — slice closure footers with commit hashes,
   Windows live walkthroughs, sandbox-side validation, and
   privacy/security contract enforcement notes for every phase.
   Read this when you need the *why* and *how-validated* behind
   a current-roadmap status.
3. **[`../INSTRUCTIONS.md`](../INSTRUCTIONS.md)** if you are playing
   the 14 agent roles inside chat turns.
4. **[`../architecture.md`](../architecture.md)** for design intent.
5. **[`docs/electron-release-runbook.md`](electron-release-runbook.md)**
   and **[`../electron/NOTES.md`](../electron/NOTES.md)** for any
   work that touches the Electron lifecycle, packaging, dynamic
   ports, or the preload bridge.
6. **Standing privacy/security contracts** (enforced by code today
   and inherited by every future slice unless explicitly relaxed
   by a separate decision):
   - 127.0.0.1 binding only — never `0.0.0.0`, never a
     LAN-routable interface.
   - No telemetry; no automatic external send; no upload; no
     background polling; no auto-update; no auto-install.
   - No signing wiring; no `electron-updater`; no GitHub Actions
     release workflow.
   - Crash reports remain local-only (Phase 9-D-A on-disk + Phase
     9-D-C2 review/copy/download UX); the free-text `backendLogTail`
     field is intentionally dropped from the prepared report until
     a tested redaction sanitizer lands.
   - Backup push is opt-in with explicit second-confirmation modal
     (Phase 9-D-B3); no credentials in `localStorage` /
     `sessionStorage` / cookies.
   - External release link is HTTPS-only, allow-listed in both
     renderer and main process (Phase 9-D-B4).
   - `afterPack` rebuild keeps source `backend-api/node_modules`
     un-mutated; dev backend ABI survives every packaged build
     (Phase 9-D-B2).
   - Dynamic free-port allocation (Phase 9-D-C3) — Electron picks
     free loopback ports at startup; `VITE_API_URL` is retained as
     a build-time belt-and-suspenders fallback only.

---

## Current project status

| Phase | Status | Closed |
|---|---|---|
| Phase 0 — Foundation | ✅ Complete | — |
| Phase 1 — Runtime decisions | ✅ Complete | 2026-05-15 |
| Phase 2 — Backend / API layer | ✅ Complete | — |
| Phase 3 — Orchestrator (Nexus) runtime | ✅ Complete | — |
| Phase 4 — Per-agent runtime | ✅ Complete / Windows validated | — |
| Phase 5 — Memory system | ✅ Complete / Windows validated | — |
| Phase 6 — Chat UI | ✅ Complete / Windows validated | — |
| Phase 7 — Admin console | ✅ Complete / Windows validated | — |
| Phase 8 — Testing & QA | ✅ Complete / Windows validated | — |
| Phase 9 — Deployment & operations | **✅ Complete / Windows validated** | **2026-05-22** |
| **Phase 10 — Documentation** | **✅ Complete / docs QA validated** | **2026-05-22** |

Phase 9 delivered the Electron desktop wrapper (9-B), the first-run
setup wizard (9-C), the Ops console + crash-log foundation +
read-only cost dashboard (9-D-A), the manual update + safe external
release-link bridge + opt-in backup push + `afterPack` ABI rebuild
(9-D-B), and the budget trends + local crash-report export +
dynamic free-port allocation + final audit-and-closure path (9-D-C).
See [`../todo.md`](../todo.md) for the full evidence trail and the
2026-05-22 §9-D-C4 Windows packaged-validation closure footer for
the final close-out evidence.

---

## Phase 10 — Documentation roadmap

Phase 10 is sliced into seven independently-shippable sub-slices.
Each is doc-only.

| Slice | Goal | Status |
|---|---|---|
| **10-A** | Documentation audit + information architecture + docs index | ✅ Complete 2026-05-22 |
| **10-B** | README refresh / Quick Start / run instructions | ✅ Complete 2026-05-22 |
| **10-C** | User guide for the desktop app | ✅ Complete 2026-05-22 |
| **10-D** | Developer setup guide | ✅ Complete 2026-05-22 |
| **10-E** | Add-an-agent + customize-an-agent guides | ✅ Complete 2026-05-22 |
| **10-F** | Troubleshooting guide | ✅ Complete 2026-05-22 |
| **10-G** | Final documentation QA + Phase 10 closure | ✅ Complete 2026-05-22 |

All seven sub-slices closed 2026-05-22 with the §10-G final QA pass:
docs link validation green, every documented script verified against
the actual `package.json` files, agent roster consistency verified
against `orchestrator/registry.json` + `frontend/src/agents/agentCatalog.ts`,
Electron dynamic-port docs validated against the Phase 9-D-C3
implementation, privacy/security stale-phrase audit clean across
all main docs, and code sanity regression check green (backend
build + frontend typecheck + 5 × `node --check` on Electron scripts
all exit 0). See the 2026-05-22 §10-G closure footer in
[`../todo.md`](../todo.md) for the full evidence trail.

---

## Top-level non-goals (current as of Phase 9 closure)

Items the user can expect NOT to find in the app today. These are
deliberate scope decisions; some are gated on a future
signing-certificate decision that has not been made.

- ❌ Automatic update / auto-download / silent install.
- ❌ `electron-updater` dependency.
- ❌ Code-signing of the Windows installer (the produced `.exe` is
  unsigned; Windows SmartScreen warns on first run).
- ❌ GitHub Actions release workflow.
- ❌ Background polling for new releases.
- ❌ Telemetry of any kind.
- ❌ Automatic crash-report send / upload / email / GitHub-issue
  creation.
- ❌ LAN-routable network exposure (`0.0.0.0` binding) — the app
  is loopback-only.
- ❌ Cloud hosting by default — the runtime data lives under
  `~/.creativedge` on the local machine.
- ❌ Authentication / authorization gating on the admin console
  (intentional non-goal per §7-D — recorded in `todo.md`; can be
  re-opened if the threat model changes).

If and when any of these become goals (most likely starting with a
signing-certificate decision), the work will be tracked under a
fresh phase in `todo.md`.

---

## How this index is maintained

This file is updated when:
- A new top-level doc is added under `docs/`.
- A docs-only Phase 10 sub-slice closes.
- A new top-level non-goal is decided.
- A standing privacy/security contract changes.

The canonical source of truth for phase state is **[`../todo.md`](../todo.md)**.
This index reflects what's already in `todo.md`; if the two ever
disagree, `todo.md` wins and this index needs an update.
