# CreativEdge

**CreativEdge** is a **local-first multi-agent chatbot** that runs as
a desktop app on Windows. You chat through a single surface; behind
the scenes, an orchestrator (**🌐 Nexus**) routes each turn to one
of **13 specialists** (one per creative/technical domain), each with
a distinct voice and MBTI-shaped personality. Every specialist has
its own folder, its own memory, and its own routing keywords.

> **Status:** Phase 10 (Documentation) is ✅ Complete / docs QA
> validated (2026-05-22). All canonical phases (0 through 10) are
> now ✅ Complete. The desktop app, local backend, Electron
> packaging, dynamic ports, setup wizard, Ops console, crash-report
> local export, opt-in backup push, budget trends, and safe external
> release-link UX are all shipped — and the full documentation set
> (user guide, developer setup, add/customize-an-agent guides,
> troubleshooting guide, release runbook) is published under
> [`docs/`](docs/). See [`todo.md`](todo.md) for the canonical phase
> roadmap.

---

## What you get

- **One chat surface, 14 voices.** Type once; Nexus picks the right
  specialist (or, for multi-domain requests, convenes 2–3 and
  synthesises a single reply).
- **Local-first.** All data lives under `~/.creativedge/` on your
  machine. No telemetry. No automatic external send.
- **Provider-pluggable.** Default LLM runtime is the local Claude
  Code CLI when present + authenticated, with a built-in mock
  fallback so the app remains usable when Claude isn't available.
- **Desktop app via Electron.** Dynamic free-port allocation;
  hardened renderer (`sandbox`, `contextIsolation`,
  `nodeIntegration:false`, `webSecurity:true`); safe preload
  bridge for runtime config + allow-listed external links.
- **Operational surface.** Setup wizard, Ops console with
  Diagnostics / Usage & cost / Budget & trends / Crash reports
  / Backup / Update info cards.

---

## Quick Start (Windows)

### Prerequisites

- **Node ≥ 20.11.0** ([nodejs.org](https://nodejs.org/)).
- **npm ≥ 10** (ships with recent Node).
- **Git** on `PATH`.
- **(Optional but recommended) Claude Code CLI** — the default
  provider. Install per Anthropic's instructions; the app falls
  back to a mock provider when it's missing.

### 1. Clone

```powershell
git clone https://github.com/michelbr84/CreativEdge.git
cd CreativEdge
```

### 2. Install

```powershell
npm run setup           # backend + frontend deps + post-install notes
npm run setup:electron  # Electron devDeps (only needed for the desktop app)
```

`npm run setup` does **not** write anything under `~/.creativedge/`;
the backend's first run creates that tree on demand.

### 3. Run

Three ways to run, in order of how a typical user wants them:

**Desktop app (recommended):**
```powershell
npm run dev:electron
```
Opens a hardened desktop window with the chat UI. The first launch
auto-opens the Setup wizard.

**Browser dev (two terminals):**
```powershell
# Terminal A
npm run dev:backend
# Terminal B
npm run dev:frontend
```
Open `http://127.0.0.1:5173` in a browser. Vite proxies API calls
to the backend on `127.0.0.1:3001`.

**Built desktop app:**
```powershell
npm run build:electron
# Then run the unpacked binary:
.\electron\dist-electron\win-unpacked\CreativEdge.exe
# Or run the NSIS installer:
.\electron\dist-electron\CreativEdge-Setup-0.1.0.exe
```
Windows SmartScreen will warn that the installer is unsigned — see
the "Deferred / non-goals" section below for why.

---

## Key scripts

| Command | What it does |
|---|---|
| `npm run setup` | Install backend + frontend; print next-steps |
| `npm run setup:electron` | Install Electron dev dependencies |
| `npm run dev` | Print the two-terminal dev help |
| `npm run dev:backend` | Backend (`tsx watch`) on 127.0.0.1:3001 |
| `npm run dev:frontend` | Frontend (Vite) on 127.0.0.1:5173 |
| `npm run dev:electron` | Pre-flight build + launch desktop dev app |
| `npm run build` | Backend tsc + frontend Vite build |
| `npm run build:electron` | Full Windows packaging orchestrator |
| `npm run typecheck` | Backend + frontend `tsc --noEmit` |
| `npm run rebuild:electron` | Manual `better-sqlite3` rebuild (recovery only) |

Per-subpackage test runners (run from `backend-api/`):
`npm run test:routing`, `npm run test:agents`,
`npm run test:in-character`, `npm run test:memory`,
`npm run test:memory-files`, `npm run test:memory-integration`,
`npm run test:memory-candidate`, `npm run test:sqlite`,
`npm run test:backup`, `npm run test:voice`. See
[`docs/developer-setup.md`](docs/developer-setup.md) §5 for the
full table.

---

## User data and privacy

All persistent data lives under `~/.creativedge/` (Windows:
`C:\Users\<you>\.creativedge\`):

- `sessions.db` — SQLite + FTS5 (chat sessions, messages,
  full-text search).
- `agents/<slug>/memory/` — per-agent core + episodic memory.
- `overrides/<slug>.json` — admin-console runtime overrides
  (tagline / voice / values / etc).
- `backup.json`, `providers.json` — local config.
- `backups/agents-git/` — local git mirror when opt-in backup
  is enabled.
- `logs/electron-backend-<ts>.log` — backend stdout/stderr
  (pino-redacted at source).
- `logs/crash-<ts>.log` — structured crash records (allow-listed
  fields only; never chat content or secrets).

**Privacy posture (current as of Phase 9 closure):**

- ✅ Local-only by default.
- ✅ No telemetry.
- ✅ No automatic external send / upload / email.
- ✅ No background polling.
- ✅ All servers bound to `127.0.0.1` only — never `0.0.0.0`,
  never a LAN-routable interface.
- ✅ Crash reports remain local-only with explicit
  Prepare / Copy / Download UX (Phase 9-D-C2). The free-text
  `backendLogTail` field is dropped from the prepared report
  until a future tested-redaction sanitizer lands.
- ✅ Backup push is opt-in with explicit second-confirmation
  modal (Phase 9-D-B3). Uses your local Git credential setup;
  no credentials in `localStorage` / `sessionStorage` /
  cookies.
- ✅ External release link is HTTPS-only, allow-listed in both
  renderer and main process (Phase 9-D-B4).

For the full privacy walkthrough see
[`docs/user-guide.md`](docs/user-guide.md) §8.

---

## Electron architecture (summary)

- Electron main spawns the existing compiled Fastify backend
  as a child process.
- Dynamic free-port allocation (Phase 9-D-C3): Electron main
  picks a free loopback port for the backend via
  `net.createServer.listen(0)` and a free port for the static
  HTTP server (which serves the built frontend bundle) via
  `listen(0, "127.0.0.1")`. The actual port numbers are logged
  in the Electron stdout on every boot.
- The renderer discovers its API base via the preload bridge:
  `window.ceBridge.getRuntimeConfig().backendBaseUrl`. The
  frontend's `resolveApiBase()` reads this at module init.
- `VITE_API_URL=http://127.0.0.1:3001` is baked into the
  frontend bundle as a build-time **belt-and-suspenders
  fallback** only — the runtime path inside Electron always
  wins via the preload bridge.
- The preload bridge (`electron/preload.cjs`) exposes only two
  surfaces on `window.ceBridge`:
  - `openExternal(url)` — Phase 9-D-B4 safe HTTPS allow-listed
    external-link opener (today: GitHub releases page only).
  - `getRuntimeConfig()` — Phase 9-D-C3 runtime port +
    packaged-flag discovery.
- `better-sqlite3` is rebuilt against Electron's bundled Node
  ABI by the `afterPack` hook (Phase 9-D-B2) inside the
  packaged copy at `<appOutDir>/resources/backend-api/` only;
  the source `backend-api/node_modules/` is never mutated.

For the full Electron operational reference see
[`docs/electron-release-runbook.md`](docs/electron-release-runbook.md)
and [`electron/NOTES.md`](electron/NOTES.md).

---

## Deferred / non-goals

Items the app deliberately does **NOT** implement today. Most are
gated on a future signing-certificate decision; some are
intentional non-goals for the local-only threat model.

- ❌ No `electron-updater` dependency.
- ❌ No automatic update / auto-download / silent install.
- ❌ No code-signing of the Windows installer.
- ❌ No GitHub Actions release workflow.
- ❌ No background polling for new releases.
- ❌ No telemetry.
- ❌ No automatic crash-report send / upload / email.
- ❌ No LAN-routable network exposure.
- ❌ No cloud hosting by default.
- ❌ No authentication / authorization gating on the admin
  console (intentional per §7-D in `todo.md`).
- ❌ No macOS / Linux desktop binaries (the packaged-build target
  is Windows x64 NSIS only today).

If/when any of these become goals, work will be tracked under a
fresh phase in `todo.md`. The signing-certificate decision is the
gating event for the entire auto-update + release-feed surface.

---

## Documentation

The full documentation tree lives under [`docs/`](docs/):

- **[`docs/README.md`](docs/README.md)** — documentation map +
  start-here paths (user / developer / agent author / AI
  coding agent).
- **[`docs/user-guide.md`](docs/user-guide.md)** — using the
  desktop app (Phase 10-C expanded 2026-05-22): chat basics,
  slash commands, Setup wizard, Ops console (seven cards),
  backup UX, crash-report local-only export, manual update
  flow, runtime data + privacy posture, beginner workflows,
  glossary.
- **[`docs/developer-setup.md`](docs/developer-setup.md)** —
  full Phase 10-D developer onboarding guide (expanded
  2026-05-22): prerequisites, repo layout, install + three run
  modes, verified per-subpackage script tables, backend +
  frontend + Electron development references, runtime data,
  provider config, safety + privacy rules, validation +
  packaging checklists, git workflow, AI-agent briefing
  template, twelve common developer tasks.
- **[`docs/add-an-agent.md`](docs/add-an-agent.md)** — full
  Phase 10-E add-an-agent guide (expanded 2026-05-22): 15-section
  canonical reference (when to add vs customize, the six required
  files, config.json schema, system prompt + MBTI + memory design,
  registry + routing rules + frontend catalogue update procedures,
  backend impacts, test-fixture map, validation checklist).
- **[`docs/customize-an-agent.md`](docs/customize-an-agent.md)**
  — full Phase 10-E customize-an-agent guide (expanded 2026-05-22):
  15-section canonical reference (override vs source decision
  tree, Phase 7-B/C admin console editors, source-file safety per
  file, voice + routing + memory customization, UI metadata, AI-
  agent delegation rules, why slugs must never be renamed).
- **[`docs/troubleshooting.md`](docs/troubleshooting.md)** —
  full Phase 10-F troubleshooting guide (expanded 2026-05-22):
  26-section reference covering first-5-checks fast triage,
  app does not open, backend `/healthz` failures, dynamic-port
  diagnosis, stale process cleanup, winCodeSign symlink
  permission error, `better-sqlite3` NODE_MODULE_VERSION
  mismatch, packaged-build-but-app-fails, release-link
  failures, manual-release-check outcomes, backup readiness
  blockers, backup push failures, crash-reports-empty (happy
  path), Claude Code CLI missing, chat-recovery red-banner
  false-negatives, sessions/memory diagnosis, admin-changes-
  not-showing, frontend + backend build errors, OneDrive
  caveats, `.git/index.lock` recovery, git workflow mistakes,
  decision tree, bug-report evidence template, 16-recipe
  command appendix.
- **[`docs/electron-release-runbook.md`](docs/electron-release-runbook.md)**
  — full Electron operational reference.
- **[`electron/NOTES.md`](electron/NOTES.md)** — Electron
  architecture notes (preload bridge, dynamic ports,
  `afterPack` ABI rebuild).

Other top-level docs:

- **[`INSTRUCTIONS.md`](INSTRUCTIONS.md)** — agent-roleplay spec
  (when the LLM plays the 14 agent roles).
- **[`architecture.md`](architecture.md)** — design intent: turn
  shape, MBTI assignments + temperament balance, memory model,
  hand-off semantics.
- **[`todo.md`](todo.md)** — concise current-state roadmap.
  Source of truth for "what's done" and "what's open."
- **[`docs/roadmap-history.md`](docs/roadmap-history.md)** — full
  per-slice closure-evidence trail (commit hashes, Windows live
  walkthroughs, sandbox validation, privacy/security contract
  enforcement notes).

---

## The roster

| Emoji | Name | Domain | MBTI |
|---|---|---|---|
| 🌐 | **Nexus** | Orchestrator | ESFJ — The Consul |
| 🎨 | **Lumi** | Graphics & Design | ISFP — The Artist |
| 💻 | **Bit** | Programming & Tech | INTP — The Logician |
| 📈 | **Buzz** | Digital Marketing | ENTP — The Debater |
| 🎬 | **Reel** | Video & Animation | ENFP — The Campaigner |
| ✍️ | **Lex** | Writing & Translation | INFJ — The Advocate |
| 🎵 | **Echo** | Music & Audio | INFP — The Mediator |
| 💼 | **Vera** | Business | ENTJ — The Commander |
| 💰 | **Cash** | Finance | ISTJ — The Logistician |
| 🤖 | **Sage** | AI Services | INTJ — The Architect |
| 🌱 | **Bloom** | Personal Growth & Hobbies | ENFJ — The Protagonist |
| 🧭 | **Atlas** | Consulting | ESTJ — The Executive |
| 📊 | **Quant** | Data | ISTP — The Virtuoso |
| 📸 | **Iris** | Photography | ISFJ — The Defender |

All 14 entities have distinct MBTI types; the assignment is a
**design tool** for consistent voice and behaviour, not a
psychological claim. See [`architecture.md`](architecture.md) for
the temperament-balance rationale.

---

## Per-agent file conventions

Every agent folder (`agents/<slug>/` or `orchestrator/`) contains:

- `identity.md` — one-screen "who am I" card.
- `soul.md` — purpose, voice, values, strengths, watch-outs.
- `personality.md` — MBTI breakdown and why this type fits.
- `system_prompt.md` — runtime system prompt for this agent.
- `config.json` — structured metadata.
- `memory/core_memory.md` + `memory/episodic_memory.md`.

The orchestrator folder additionally contains `registry.json`
(machine-readable roster) and `routing_rules.md` (human-readable
routing logic). See [`docs/add-an-agent.md`](docs/add-an-agent.md)
and [`docs/customize-an-agent.md`](docs/customize-an-agent.md) for
the full per-file conventions and the safe customization
workflow.

---

## License + repository

- Repository: <https://github.com/michelbr84/CreativEdge>
- License: [`LICENSE`](LICENSE) — proprietary / All Rights Reserved.
- Contributing: [`CONTRIBUTING.md`](CONTRIBUTING.md).
- Security policy: [`SECURITY.md`](SECURITY.md).
- Changelog: [`CHANGELOG.md`](CHANGELOG.md).
- Release readiness: [`docs/release-readiness.md`](docs/release-readiness.md)
  (preflight checklist + Windows packaged-validation walkthrough +
  GitHub release draft checklist).
- Release notes (drafts): [`docs/release-notes/`](docs/release-notes/).
- Latest releases on GitHub:
  <https://github.com/michelbr84/CreativEdge/releases>
  (v0.1.0 was published manually as a GitHub Pre-release on
  2026-05-23).

This README replaced the original Phase-0 scaffold on 2026-05-22
as part of Phase 10-B (Documentation). For the historical record
of what changed, see [`todo.md`](todo.md) and the §10-A / §10-B
closure footers at EOF.
