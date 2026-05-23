# CreativEdge — Developer Setup

> **Phase 10-D expanded 2026-05-22.** This is the canonical
> developer onboarding and maintenance reference for CreativEdge
> after Phase 9 closure (Deployment & operations, ✅ Windows
> validated). If anything here disagrees with what the app
> actually does, the canonical phase state in
> [`../todo.md`](../todo.md) wins and this guide needs an update.

This guide is for developers cloning the repo for the first time,
maintainers building / debugging / packaging the app, technical
operators validating Windows packaged builds, and AI coding agents
continuing future work safely.

For the user-facing app guide see
[`user-guide.md`](user-guide.md). For the full Electron
operational reference see
[`electron-release-runbook.md`](electron-release-runbook.md). For
the design intent see [`../architecture.md`](../architecture.md).
For the documentation map see [`README.md`](README.md). For the
top-level project entry-point see the
[top-level `README.md`](../README.md).

---

## 1. Prerequisites

- **Windows 10 / 11 x64** is the validated host through Phase 9.
  Browser-dev and backend-only workflows mostly work on macOS /
  Linux for development purposes, but the packaged Electron build
  target is **Windows-only today**. macOS / Linux packaged
  binaries are an explicit non-goal and are NOT validated.
- **Node.js ≥ 20.11.0** (enforced via root `package.json:engines.node`).
  [nodejs.org](https://nodejs.org/) ships current LTS lines.
- **npm ≥ 10** (enforced via root `package.json:engines.npm`).
  Ships with recent Node.
- **Git** on `PATH`. The backup subsystem and the install flow
  both shell out to `git`.
- **PowerShell** for Windows operational tasks (the runbook +
  troubleshooting recipes assume PowerShell unless CMD is
  called out explicitly).
- **(Optional but recommended) Claude Code CLI** — the default
  LLM runtime when present and authenticated. The app falls
  back to a built-in mock provider when the CLI is missing.
  CreativEdge does NOT bundle or configure the Claude Code
  CLI; install per Anthropic's instructions.
- **(Optional, for packaging) Windows Developer Mode** or an
  **Administrator PowerShell**. `electron-builder` unpacks the
  `winCodeSign` tooling with symlinks; non-admin Windows
  accounts without Developer Mode enabled may fail the build
  with an `EPERM` / symlink error. See
  [`troubleshooting.md` §4](troubleshooting.md#4-wincodesign-symbolic-link-permission-error).

**No `.env` is required.** CreativEdge does NOT read or
write a `.env` file. No Anthropic API key needs to be
configured anywhere in the repo — the Claude Code CLI manages
its own authentication independently of CreativEdge, and the
mock provider does not require any credentials at all.

---

## 2. Repository layout

```
CreativEdge/
├── README.md                       ← top-level entry + Quick Start
├── INSTRUCTIONS.md                 ← agent-roleplay spec (LLM-facing)
├── architecture.md                 ← design intent (turn shape, MBTI, memory model)
├── todo.md                         ← canonical phase roadmap (read this first)
├── docs/                           ← documentation tree (this file lives here)
│   ├── README.md                   ← docs map + start-here paths
│   ├── user-guide.md               ← user-facing app guide (Phase 10-C)
│   ├── developer-setup.md          ← this file (Phase 10-D)
│   ├── add-an-agent.md             ← adding a new specialist (Phase 10-E)
│   ├── customize-an-agent.md       ← modifying an existing agent (Phase 10-E)
│   ├── troubleshooting.md          ← named recovery recipes (Phase 10-F)
│   └── electron-release-runbook.md ← full Electron operational reference
├── package.json                    ← root orchestration scripts
├── scripts/                        ← root-level helper scripts
│   ├── dev-help.mjs                ← two-terminal dev printout
│   └── setup-postinstall.mjs       ← post-install next-steps + Node check
├── backend-api/                    ← local Fastify backend (TypeScript)
│   ├── package.json                ← backend scripts + deps
│   ├── src/
│   │   ├── index.ts                ← entry point (PORT/HOST env-driven)
│   │   ├── server.ts               ← Fastify wiring (CORS, runtime, db, providers)
│   │   ├── bootstrap/              ← Phase 2.1 ensureRuntimeDir
│   │   ├── providers/              ← provider abstraction
│   │   │   ├── Provider.ts             ← interface
│   │   │   ├── ClaudeProvider.ts       ← Claude Code CLI provider
│   │   │   ├── MockProvider.ts         ← mock fallback
│   │   │   ├── claudeCli.ts            ← CLI spawn helper
│   │   │   ├── localClaudeRuntime.ts   ← readiness probing
│   │   │   └── providerRegistry.ts     ← selection logic
│   │   ├── storage/                ← Phase 5.5-A sqlite + FTS5
│   │   ├── dao/                    ← session + message DAOs
│   │   ├── routing/                ← Phase 3.1 routing pipeline
│   │   ├── convening/              ← Phase 3.2 multi-specialist
│   │   ├── handoff/                ← Phase 3.3 hand-off semantics
│   │   ├── agents/                 ← per-agent memory helpers
│   │   ├── backup/                 ← Phase 5.6-A backup foundation
│   │   ├── config/                 ← backend config helpers
│   │   ├── logging/                ← pino logger setup
│   │   ├── utils/                  ← request id, etc
│   │   └── routes/                 ← Fastify route handlers
│   │       ├── health.ts           ← /healthz (provider readiness)
│   │       ├── agents.ts           ← Phase 7-A/B agent registry + overrides
│   │       ├── sessions.ts         ← Phase 2.2-A + 5.5-A sessions + search
│   │       ├── chat.ts             ← Phase 2.2-C SSE chat
│   │       ├── backup.ts           ← Phase 5.6-A backup endpoints
│   │       └── ops.ts              ← Phase 9-D-A/C1/C2 ops endpoints
│   └── scripts/                    ← 10 test/smoke runners (see §7)
├── frontend/                       ← Vite + React 18 + TypeScript
│   ├── package.json                ← frontend scripts + deps
│   ├── vite.config.ts              ← dev proxy → 127.0.0.1:3001 (browser-dev only)
│   └── src/
│       ├── App.tsx                 ← main shell (chrome buttons, routing, recovery)
│       ├── api/
│       │   ├── client.ts           ← Phase 9-D-C3 layered API-base resolver
│       │   └── chatStream.ts       ← SSE parser
│       ├── types.ts                ← shared TS types
│       ├── slash/slashCommands.ts  ← Phase 6-C/6-E slash command parser
│       ├── agents/agentCatalog.ts  ← 14-agent slug+alias catalogue
│       ├── config/release.ts       ← Phase 9-D-B1/B4 release coords + allow-list
│       └── components/
│           ├── ChatLayout.tsx
│           ├── Composer.tsx
│           ├── MessageThread.tsx
│           ├── MarkdownMessage.tsx + CodeBlock.tsx
│           ├── CopyButton.tsx
│           ├── SessionSidebar.tsx + SearchPanel.tsx
│           ├── HandoffCard.tsx + MemoryCandidateCard.tsx
│           ├── MemoryToolsPanel.tsx + AgentCard.tsx
│           ├── SlashCommandMenu.tsx + SlashConfirmModal.tsx
│           ├── Drawer.tsx + StatusBadge.tsx + ActionResult.tsx + SafeSnippet.tsx
│           ├── BackupPanel.tsx + BackupPushConfirmModal.tsx
│           ├── CommandResultCard.tsx
│           ├── admin/                  ← Phase 7-A/B/C admin console
│           ├── setup/FirstRunWizard.tsx ← Phase 9-C
│           └── ops/OpsConsole.tsx       ← Phase 9-D-A/C1/C2 (seven cards)
├── electron/                       ← Phase 9-B isolated Electron wrapper
│   ├── package.json                ← electron@^30, electron-builder, @electron/rebuild
│   ├── main.mjs                    ← Phase 9-D-C3 dynamic ports + lifecycle
│   ├── preload.cjs                 ← Phase 9-D-B4 + 9-D-C3 ceBridge surface
│   ├── NOTES.md                    ← Electron architecture reference
│   └── scripts/
│       ├── build-deps.mjs          ← pre-flight backend + frontend build
│       ├── build-win.mjs           ← Phase 9-D-B2 two-step Windows packaging orchestrator
│       └── after-pack.mjs          ← Phase 9-D-B2 better-sqlite3 packaged-copy rebuild
├── orchestrator/                   ← 🌐 Nexus (orchestrator) agent folder
│   ├── identity.md + soul.md + personality.md + system_prompt.md + config.json
│   ├── registry.json               ← machine-readable list of all 14 agents
│   ├── routing_rules.md            ← human-readable routing logic
│   ├── creativedge_context.md      ← project-context block prepended to Nexus
│   └── memory/{core,episodic}_memory.md
└── agents/                         ← 13 specialist agent folders
    ├── graphics-design/   (🎨 Lumi)
    ├── programming-tech/  (💻 Bit)
    ├── digital-marketing/ (📈 Buzz)
    ├── video-animation/   (🎬 Reel)
    ├── writing-translation/ (✍️ Lex)
    ├── music-audio/       (🎵 Echo)
    ├── business/          (💼 Vera)
    ├── finance/           (💰 Cash)
    ├── ai-services/       (🤖 Sage)
    ├── personal-growth/   (🌱 Bloom)
    ├── consulting/        (🧭 Atlas)
    ├── data/              (📊 Quant)
    └── photography/       (📸 Iris)
```

### 2.1 What you usually edit where, and what NOT to commit

| Directory | Usually edit | Do NOT commit |
|---|---|---|
| Root | `package.json` orchestration scripts, `scripts/dev-help.mjs`, `scripts/setup-postinstall.mjs` | Lockfiles for nothing-changed installs |
| `backend-api/src/` | Routes, providers, memory, backup, routing, sqlite migrations | `backend-api/dist/`, `backend-api/node_modules/` |
| `backend-api/scripts/` | Test runners | Test fixtures with real user PII |
| `frontend/src/` | Components, API client, types, slash commands, agent catalogue | `frontend/dist/`, `frontend/node_modules/` |
| `electron/` | `main.mjs`, `preload.cjs`, scripts | `electron/dist-electron/`, `electron/node_modules/` |
| `agents/<slug>/` | `identity.md`, `soul.md`, `personality.md`, `system_prompt.md`, `config.json` | `agents/<slug>/memory/*` (user data — never commit memory files) |
| `orchestrator/` | `registry.json`, `routing_rules.md`, `system_prompt.md`, `creativedge_context.md` | `orchestrator/memory/*` (user data) |
| `docs/` | All docs files | n/a |
| `~/.creativedge/` | n/a — this lives OUTSIDE the repo on every machine | **Never commit any of this** (it's the user's runtime data and is not even inside the repo) |

`electron/` is an **isolated package** (its own
`package.json`, its own `node_modules`, its own lockfile). The
repo is NOT converted to npm workspaces — adding Electron does
not change the existing `backend-api/` or `frontend/` package
shapes.

---

## 3. Install / setup workflow

From a clean clone:

```powershell
git clone https://github.com/michelbr84/CreativEdge.git
cd CreativEdge

# Install backend + frontend deps + print post-install next-steps.
npm run setup

# Install Electron devDeps into the isolated electron/node_modules/.
npm run setup:electron
```

### 3.1 What `npm run setup` does

1. `npm --prefix backend-api install` (Fastify + better-sqlite3 + pino).
2. `npm --prefix frontend install` (Vite + React + react-markdown).
3. `node scripts/setup-postinstall.mjs` (Node-version sanity check + canonical next-steps print).

### 3.2 What setup does NOT do

- Does NOT write anything under `~/.creativedge/` — the backend's first run creates that tree on demand via the Phase 2.1 `ensureRuntimeDir` bootstrap.
- Does NOT write a `.env` file. There is no `.env` to write.
- Does NOT install Electron — that's `npm run setup:electron` separately.
- Does NOT rebuild `better-sqlite3` against Electron's ABI — that happens only during packaged build via the Phase 9-D-B2 `afterPack` hook.
- Does NOT prompt for any credential, token, or remote URL.

### 3.3 Workspace model

The root `package.json` is **not** an npm workspaces root. It orchestrates three separately-installable subpackages (`backend-api/`, `frontend/`, `electron/`) via `npm --prefix` calls. Each subpackage has its own `package.json`, its own `node_modules/`, and its own lockfile.

---

## 4. Run modes

There are three primary run modes; pick the one that matches what you're testing.

### 4.1 Browser dev mode (backend + frontend in two terminals)

Use for fast UI iteration with the browser DevTools and live Vite HMR.

```powershell
# Terminal A — backend on http://127.0.0.1:3001
npm run dev:backend

# Terminal B — frontend on http://127.0.0.1:5173
npm run dev:frontend
```

Open `http://127.0.0.1:5173` in a browser. Vite proxies `/chat`, `/agents`, `/sessions`, `/backup`, `/healthz` to the backend on `127.0.0.1:3001`.

- Backend default port: **3001** (env-overridable via `CREATIVEDGE_PORT`).
- Frontend default port: **5173** (Vite default).
- This is the only mode where the legacy fixed ports 3001 / 5174-style behaviour applies — and it applies only because there's no Electron preload bridge in a browser.

### 4.2 Electron dev mode (full desktop shell)

Use for desktop integration testing (preload bridge, dynamic ports, runtime config, packaged-style chat flow).

```powershell
npm run dev:electron
```

What this does:

1. `node electron/scripts/build-deps.mjs` — pre-flight builds backend dist + frontend dist (with `VITE_API_URL=http://127.0.0.1:3001` baked into the frontend bundle as a build-time belt-and-suspenders fallback only — the runtime path inside Electron always wins via the preload bridge).
2. `electron .` — launches Electron main (`electron/main.mjs`).
3. Electron main allocates a free loopback TCP port for the backend via `net.createServer.listen(0)` (Phase 9-D-C3).
4. Spawns the backend child with `CREATIVEDGE_PORT=<dynamicPort>` + `CREATIVEDGE_HOST=127.0.0.1`.
5. Starts a tiny Node-stdlib static HTTP server on a separate dynamic loopback port serving `frontend/dist/`.
6. Waits for backend `/healthz` to return OK at the dynamic backend URL (max 30s, polling every 500ms).
7. Opens a hardened `BrowserWindow` (`contextIsolation: true` + `nodeIntegration: false` + `sandbox: true` + `webSecurity: true` + Phase 9-D-B4 preload) loading the dynamic static-server URL.
8. `webPreferences.additionalArguments` injects the dynamic backend + frontend base URLs into the preload, which exposes them sync via `window.ceBridge.getRuntimeConfig()`.
9. Backend stdout/stderr go to `~/.creativedge/logs/electron-backend-<ts>.log` (NOT to the parent process — see §9.3).

Look for these stdout lines on a healthy boot:

```
[electron-main] static server listening on http://127.0.0.1:<dynamicFE>
[electron-main] port allocation attempt 1: assigned 127.0.0.1:<dynamicBE>
[electron-main] backend /healthz OK at http://127.0.0.1:<dynamicBE>/healthz after <ms>ms
[electron-main] boot ready: backend=http://127.0.0.1:<dynamicBE> static=http://127.0.0.1:<dynamicFE>
```

### 4.3 Packaged app mode (Windows .exe)

Use for end-to-end packaging validation, signing-readiness audits, and release rehearsals.

```powershell
npm run build:electron
```

Outputs:
- `electron/dist-electron/CreativEdge-Setup-0.1.0.exe` (unsigned NSIS installer).
- `electron/dist-electron/win-unpacked/CreativEdge.exe` (unpacked binary; usable for testing without running the installer).

Run the unpacked binary directly:

```powershell
& ".\electron\dist-electron\win-unpacked\CreativEdge.exe"
```

Or run the installer end-to-end:

```powershell
& ".\electron\dist-electron\CreativEdge-Setup-0.1.0.exe"
```

Windows SmartScreen will warn *"Windows protected your PC"* because the installer is unsigned. This is expected (see §11.4). For the full packaged-build operational reference see [`electron-release-runbook.md`](electron-release-runbook.md).

---

## 5. Root scripts table

All scripts verified against the actual `package.json` files at repo HEAD `7144064`.

### 5.1 Root (`package.json`)

| Script | Verbatim command | What it does |
|---|---|---|
| `npm run setup` | `npm run setup:backend && npm run setup:frontend && node scripts/setup-postinstall.mjs` | Install backend + frontend + print next-steps |
| `npm run setup:backend` | `npm --prefix backend-api install` | Backend deps only |
| `npm run setup:frontend` | `npm --prefix frontend install` | Frontend deps only |
| `npm run setup:electron` | `npm --prefix electron install` | Electron devDeps only |
| `npm run build` | `npm run build:backend && npm run build:frontend` | Backend tsc + frontend Vite build |
| `npm run build:backend` | `npm --prefix backend-api run build` | Backend tsc → `backend-api/dist/` |
| `npm run build:frontend` | `npm --prefix frontend run build` | Frontend `tsc -b && vite build` → `frontend/dist/` |
| `npm run build:electron` | `npm --prefix electron run build` | Full Windows packaging orchestrator |
| `npm run typecheck` | `npm run typecheck:backend && npm run typecheck:frontend` | Both subpackages |
| `npm run typecheck:backend` | `npm --prefix backend-api run typecheck` | Backend `tsc --noEmit` |
| `npm run typecheck:frontend` | `npm --prefix frontend run typecheck` | Frontend `tsc --noEmit` |
| `npm run dev` | `node scripts/dev-help.mjs` | Print two-terminal dev help (no process spawn) |
| `npm run dev:backend` | `npm --prefix backend-api run dev` | Backend `tsx watch` on 127.0.0.1:3001 |
| `npm run dev:frontend` | `npm --prefix frontend run dev` | Frontend Vite on 127.0.0.1:5173 |
| `npm run dev:electron` | `npm --prefix electron run dev` | Pre-flight build + launch desktop dev app |
| `npm run rebuild:electron` | `npm --prefix electron run rebuild:sqlite` | Manual `electron-rebuild` of `better-sqlite3` (recovery only) |

### 5.2 Backend (`backend-api/package.json`)

| Script | Verbatim command | What it does |
|---|---|---|
| `npm run dev` | `tsx watch src/index.ts` | Live-reload dev backend |
| `npm run build` | `tsc` | Compile to `dist/` |
| `npm run typecheck` | `tsc --noEmit` | Type-check only |
| `npm start` | `node dist/index.js` | Run the compiled backend |
| `npm run clean` | `rimraf dist` | Remove `dist/` |
| `npm run test:routing` | `node scripts/run-routing-fixtures.mjs` | Phase 3.1 routing fixtures (38 cases) |
| `npm run test:agents` | `node scripts/run-agent-behavior-smoke.mjs` | Phase 4.3-A per-agent in-domain smoke (5 × 14 = 70 fixtures) |
| `npm run test:voice` | `node scripts/run-agent-voice-hold.mjs` | Per-agent voice-hold smoke |
| `npm run test:memory` | `node scripts/run-agent-core-memory-smoke.mjs` | Phase 4.5-A core-memory smoke |
| `npm run test:in-character` | `node scripts/run-agent-in-character-tests.mjs` | Phase 8.2 cross-character contamination check |
| `npm run test:memory-candidate` | `node scripts/run-memory-candidate-tests.mjs` | Phase 4 memory-candidate detector unit tests |
| `npm run test:memory-files` | `node scripts/run-memory-files-tests.mjs` | Phase 5.2-B/C/D memory-files helper unit tests |
| `npm run test:memory-integration` | `node scripts/run-memory-integration-tests.mjs` | Phase 8.3 memory routes integration |
| `npm run test:sqlite` | `node scripts/run-sqlite-tests.mjs` | Phase 5.5-A sqlite + FTS5 unit tests |
| `npm run test:backup` | `node scripts/run-backup-tests.mjs` | Phase 5.6-A backup unit tests (42 cases) |

### 5.3 Frontend (`frontend/package.json`)

| Script | Verbatim command | What it does |
|---|---|---|
| `npm run dev` | `vite` | Vite dev server on 127.0.0.1:5173 |
| `npm run build` | `tsc -b && vite build` | Type-check + Vite build → `dist/` |
| `npm run preview` | `vite preview` | Local preview of `dist/` |
| `npm run typecheck` | `tsc --noEmit` | Type-check only |

### 5.4 Electron (`electron/package.json`)

| Script | Verbatim command | What it does |
|---|---|---|
| `npm run dev` | `node scripts/build-deps.mjs && electron .` | The dev launcher (used by root `npm run dev:electron`) |
| `npm run build` | `node scripts/build-win.mjs` | Phase 9-D-B2 two-step Windows packaging orchestrator |
| `npm run rebuild:sqlite` | `electron-rebuild --module-dir ../backend-api -w better-sqlite3 -f` | Manual recovery (rarely needed under the afterPack flow) |

If a script you think should exist is missing from these tables, it does NOT exist in the repo today. Don't paste hypothetical scripts into PRs.

---

## 7. Backend development

The backend (`backend-api/`) is a TypeScript Fastify service. Key facts:

- **Entry point**: `backend-api/src/index.ts` reads `CREATIVEDGE_PORT` (default 3001) and `CREATIVEDGE_HOST` (default `127.0.0.1`). The default bind is loopback-only.
- **Server wiring**: `backend-api/src/server.ts` — bootstrap runtime dir, init SQLite, init provider registry, register CORS (loopback-only origin allowlist), register routes (`health`, `agents`, `sessions`, `backup`, `ops`, `chat` in that order).
- **Routes**: 6 files under `backend-api/src/routes/`:
  - `health.ts` — `/healthz` (provider readiness + runtime state).
  - `agents.ts` — Phase 7-A/B agent registry + safe runtime overrides.
  - `sessions.ts` — Phase 2.2-A + 5.5-A sessions list + detail + FTS5 search.
  - `chat.ts` — Phase 2.2-C SSE chat with `reply.hijack()`.
  - `backup.ts` — Phase 5.6-A backup status / config / dry-run / run.
  - `ops.ts` — Phase 9-D-A/C1/C2 diagnostics / usage summary / usage timeseries / crash reports list / crash report prepare.
- **Providers**: `backend-api/src/providers/`:
  - `Provider.ts` interface, `ClaudeProvider.ts` (CLI provider), `MockProvider.ts` (mock fallback), `providerRegistry.ts` (selection), `localClaudeRuntime.ts` (readiness probe), `claudeCli.ts` (subprocess helper).
- **Storage**: `backend-api/src/storage/` — Phase 5.5-A SQLite migrations runner + FTS5.
- **Memory + agents**: `backend-api/src/agents/` — per-agent memory file helpers (`safeAppendUnique`, `findEpisodicMatch`, `safeReplaceOnce`, compaction helpers).
- **Backup**: `backend-api/src/backup/` — Phase 5.6-A `backupConfig.ts` (load/save/default + path safety) + `backupGit.ts` (git helpers + copy + gitignore + `redactRemote()`).
- **Routing**: `backend-api/src/routing/` — Phase 3.1 routing pipeline + override rules + LLM tie-breaker.
- **Convening**: `backend-api/src/convening/` — Phase 3.2 multi-specialist convening + synthesis.
- **Hand-off**: `backend-api/src/handoff/` — Phase 3.3 hand-off detector + runner.

### 7.1 Run / build

```powershell
cd backend-api
npm run dev         # tsx watch
npm run build       # tsc → dist/
npm run typecheck   # tsc --noEmit
npm start           # node dist/index.js (post-build run)
npm run clean       # rimraf dist
```

### 7.2 Test runners (all verified — see §5.2)

```powershell
cd backend-api
npm run test:routing            # 38 routing fixtures
npm run test:agents             # 70 in-domain fixtures (5 per agent × 14)
npm run test:voice              # per-agent voice-hold smoke
npm run test:memory             # core-memory smoke
npm run test:in-character       # cross-character contamination check
npm run test:memory-candidate   # detector unit tests
npm run test:memory-files       # memory-files helper unit tests
npm run test:memory-integration # /promote /forget /core PATCH integration
npm run test:sqlite             # sqlite + FTS5 unit tests
npm run test:backup             # backup unit tests
```

For Phase-specific fixture file structures and what a passing run looks like, see the per-phase closure footers in [`../todo.md`](../todo.md).

### 7.3 Health endpoint

```
GET http://127.0.0.1:3001/healthz
```

Returns provider readiness, runtime directory, storage / database readiness, seeded agent slugs, primary provider name, Claude readiness, mock readiness. Phase 9-C wizard + Phase 9-D-A diagnostics card consume this endpoint.

---

## 8. Frontend development

The frontend (`frontend/`) is a Vite + React 18 + TypeScript app. Key facts:

- **Entry point**: `frontend/src/App.tsx`. Top-level chrome buttons: 🧭 Setup / 📊 Ops / ⚙ Admin.
- **API client**: `frontend/src/api/client.ts` exposes the layered `resolveApiBase()` (Phase 9-D-C3 contract):
  1. `window.ceBridge.getRuntimeConfig().backendBaseUrl` (Electron preload bridge — canonical inside the desktop shell).
  2. `import.meta.env.VITE_API_URL` (build-time pin — kept as belt-and-suspenders fallback for legacy bundles; `electron/scripts/build-deps.mjs` pins it to `http://127.0.0.1:3001`).
  3. Empty string → same-origin via the Vite dev proxy (browser `npm run dev` path).
- **SSE parser**: `frontend/src/api/chatStream.ts`.
- **Types**: `frontend/src/types.ts` — shared shapes for chat events, sessions, agents, ops responses, etc.
- **Setup wizard**: `frontend/src/components/setup/FirstRunWizard.tsx` — Phase 9-C four-step modal.
- **Ops console**: `frontend/src/components/ops/OpsConsole.tsx` — Phase 9-D-A/C1/C2 seven-card modal (DiagnosticsCard, UsageCard, BudgetTrendsCard, LogsCard, CrashReportsCard, BackupCard, UpdateInfoCard).
- **Backup**: `frontend/src/components/BackupPanel.tsx` + `BackupPushConfirmModal.tsx` — Phase 9-D-B3 explicit opt-in push UX.
- **Slash commands**: `frontend/src/slash/slashCommands.ts` — parser for `/agent`, `/remember [@alias]`, `/forget core|episodic`, `/compact status|preview`, `/backup status`.
- **Agent catalogue**: `frontend/src/agents/agentCatalog.ts` — the 14 slug↔alias mappings.
- **Release config**: `frontend/src/config/release.ts` — Phase 9-D-B1/B4 release URL constants + the renderer-side mirror of `EXTERNAL_URL_ALLOWLIST` + the `openExternalUrl()` helper that prefers the preload bridge.

### 8.1 Run / build / typecheck

```powershell
cd frontend
npm run dev         # Vite dev server on 127.0.0.1:5173
npm run typecheck   # tsc --noEmit
npm run build       # tsc -b && vite build → dist/
npm run preview     # local preview of dist/
```

### 8.2 Vite dev proxy

`frontend/vite.config.ts` proxies `/chat`, `/agents`, `/sessions`, `/backup`, `/healthz` to `http://127.0.0.1:3001` for the browser-dev path. This is **dev-only**; the Electron path uses the preload bridge instead.

### 8.3 `VITE_API_URL` semantics

- **Browser dev (`npm run dev:frontend`)**: `VITE_API_URL` is empty → API client uses same-origin → Vite proxy handles it.
- **Browser build (`npm run build:frontend`)** for non-Electron deployment: whatever `VITE_API_URL` you set at build time is baked into the bundle.
- **Electron dev / packaged (`npm run dev:electron` / `npm run build:electron`)**: `electron/scripts/build-deps.mjs` pins `VITE_API_URL=http://127.0.0.1:3001` into the bundle as a **build-time belt-and-suspenders fallback only**. The runtime path inside Electron ALWAYS wins via `window.ceBridge.getRuntimeConfig().backendBaseUrl`. The pinned `VITE_API_URL` exists so a partial rollback of Phase 9-D-C3 still gives a working bundle.

**Do not** assume `VITE_API_URL=http://127.0.0.1:3001` is the canonical Electron runtime path. The preload bridge wins.

---

## 9. Electron development

The Electron wrapper (`electron/`) is an isolated package that owns the desktop-app lifecycle.

### 9.1 Main process (`electron/main.mjs`)

Responsibilities:
- Allocate free loopback TCP ports (one for the backend, one for the static server) via `net.createServer.listen(0)`. EADDRINUSE retry once (`SPAWN_RETRY_LIMIT = 1`) before surfacing a `spawnExhausted` diagnostic page.
- Spawn the backend child with `CREATIVEDGE_PORT=<dynamicPort>` + `CREATIVEDGE_HOST=127.0.0.1`. In dev mode the child binary is system `node`; in the packaged binary it's `process.execPath` with `ELECTRON_RUN_AS_NODE=1`.
- Start a Node-stdlib static HTTP server on `listen(0, "127.0.0.1")` serving `frontend/dist/`.
- Wait for backend `/healthz` to return OK (max 30s) with a defence-in-depth `service === "creativedge-backend"` check.
- Open a hardened `BrowserWindow` (sandbox + contextIsolation + no node integration + webSecurity) with Phase 9-D-B4 preload at `electron/preload.cjs`.
- On unexpected backend child exit: write a structured crash record to `~/.creativedge/logs/crash-<ts>.log` with a strict 17-field allow-list (Phase 9-D-A); load a diagnostic page instead of immediately quitting.
- On `before-quit` / window-all-closed: terminate the backend child and close the static server cleanly.

### 9.2 Preload bridge (`electron/preload.cjs`)

Exposes exactly two surfaces on `window.ceBridge`:
- **`openExternal(url)`** — Phase 9-D-B4 safe HTTPS allow-listed external-link opener (today's allow-list: `github.com` host + `/michelbr84/CreativEdge/releases` path-prefix). HTTPS-only. Double-validated (renderer + main process).
- **`getRuntimeConfig()`** — Phase 9-D-C3 sync runtime config read from `webPreferences.additionalArguments`. Shape: `{ backendBaseUrl: string|null, frontendBaseUrl: string|null, packaged: boolean }`.

No node integration leaks to the renderer; only `contextBridge` + `ipcRenderer.invoke`.

### 9.3 Backend log redirection

The backend child's stdout/stderr is piped to `~/.creativedge/logs/electron-backend-<ts>.log` rather than to Electron main's `process.stdout`. **This is the Phase 9-B EPIPE fix** — on Windows GUI mode, Electron main's `process.stdout` is effectively a closed pipe; pino's SonicBoom writes throw `EPIPE` and call `process.exit(1)`, killing the backend a few seconds after boot. Writing to a real file decouples the lifecycles.

If you're debugging a backend issue, that's the file to tail.

### 9.4 Packaging orchestrator (`electron/scripts/build-win.mjs`)

Two-step Phase 9-D-B2 contract:

1. **`node scripts/build-deps.mjs`** — backend tsc + frontend Vite build. Pins `VITE_API_URL=http://127.0.0.1:3001` as belt-and-suspenders fallback.
2. **`npx electron-builder --win`** — packages win32 x64 NSIS installer.

The orchestrator prints `[build-win] packaging plan (Phase 9-D-B2 afterPack flow)` with `source tree mutation: NONE` as the build banner. The source `backend-api/node_modules/` is never mutated by the packaging flow.

### 9.5 `afterPack` hook (`electron/scripts/after-pack.mjs`)

Called by electron-builder after extraResources copy. Calls `@electron/rebuild` against the **packaged copy** at `<appOutDir>/resources/backend-api/` only, with `onlyModules: ["better-sqlite3"]` and `force: true`. Loads `@electron/rebuild` via `createRequire(join(ELECTRON_DIR, "package.json"))` to keep the file in pure ESM while pulling the CommonJS module from the local install.

Verifies the packaged backend dir + node_modules + `better-sqlite3` package.json all exist before any rebuild work; throws on any failure so electron-builder aborts the build with a non-zero exit.

### 9.6 `better-sqlite3` ABI rebuild — the contract

| Mode | Runtime loading `better-sqlite3` | ABI |
|---|---|---|
| Dev (`npm run dev:backend` / `npm run dev:electron`) | system `node` | system Node ABI |
| Packaged (`npm run build:electron` → `.exe`) | Electron's bundled Node via `ELECTRON_RUN_AS_NODE=1` | Electron Node ABI |

The afterPack hook handles the Electron-ABI rebuild **inside the packaged copy only**. After a successful packaged build, `cd backend-api && npm run build` should still exit 0 — this proves the source `better-sqlite3` is still at system-Node ABI. If it fails with `NODE_MODULE_VERSION` after a packaged build, something accidentally mutated the source tree (rare; recovery in [troubleshooting §5](troubleshooting.md#5-better-sqlite3-node_module_version-crash)).

### 9.7 winCodeSign symlink caveat

On standard Windows accounts without Developer Mode enabled, `electron-builder` may fail to unpack `winCodeSign` tooling because symlink creation requires elevation. The three known recoveries (Admin PowerShell / enable Developer Mode / clear the cache) are detailed in [`troubleshooting.md` §4](troubleshooting.md#4-wincodesign-symbolic-link-permission-error).

### 9.8 Do not edit / commit

- `electron/dist-electron/` — generated build output; excluded by `electron/.gitignore`.
- `electron/node_modules/` — same.
- Any binary file inside `electron/`.

---

## 10. Runtime data directory

All persistent runtime data lives under `~/.creativedge/`
(Windows: `C:\Users\<you>\.creativedge\`).

| Path | What |
|---|---|
| `~/.creativedge/sessions.db` | SQLite + FTS5 (chat sessions, messages, full-text search) |
| `~/.creativedge/agents/<slug>/memory/core_memory.md` | Per-agent durable memory |
| `~/.creativedge/agents/<slug>/memory/episodic_memory.md` | Per-agent per-session notes |
| `~/.creativedge/overrides/<slug>.json` | Phase 7-B admin runtime overrides (tagline / voice / etc) |
| `~/.creativedge/backup.json` | Backup config (no secrets) |
| `~/.creativedge/providers.json` | Provider config (no secrets) |
| `~/.creativedge/backups/agents-git/` | Local git mirror when opt-in backup is enabled |
| `~/.creativedge/logs/electron-backend-<ts>.log` | Backend stdout/stderr (pino-redacted at source) |
| `~/.creativedge/logs/crash-<ts>.log` | Structured crash records (allow-listed fields only; never chat content or secrets) |

The backend's Phase 2.1 `ensureRuntimeDir` is the sole scaffolder for this tree. `npm run setup` only installs dependencies — it never writes anything under `~/.creativedge/`.

### 10.1 What's safe to delete during local testing

- `sessions.db` — wipes all chat sessions. Useful for testing FTS5 indexing or a clean-slate UX.
- `logs/*` — safe; new logs are generated on demand.
- `backups/agents-git/` — wipes the local git mirror only. Configure → dry-run will rebuild it.
- `overrides/*.json` — restores agents to their source defaults.

### 10.2 What requires caution

- `agents/<slug>/memory/*` — your durable per-agent memory. Deleting this loses real content. Use `/forget` flows in the UI instead when possible.
- `providers.json` — usually doesn't need deletion; the backend regenerates defaults if missing.
- `backup.json` — deleting forces re-config via the wizard.

### 10.3 Never commit any of this

The runtime data tree lives **outside** the repo. Don't move it into the repo, don't paste content from it into PRs, don't ship snapshots of it. The `.gitignore` files in `agents/<slug>/` already exclude `memory/` to prevent accidental commits — but the canonical path is the OS user-home tree.

---

## 11. Provider / runtime configuration

### 11.1 Default provider stack

- **Primary**: Claude Code CLI (the local CLI binary at `claude` on `PATH`). When installed and authenticated, the backend prefers Claude for all turns.
- **Fallback**: built-in mock provider. When Claude is missing, not authenticated, or fails on a given turn, the mock provider returns placeholder responses so the UI remains usable.

### 11.2 No Anthropic API key required by default

CreativEdge does NOT read or store any Anthropic API key. The Claude Code CLI manages its own auth independently — usually via the CLI's own login flow. CreativEdge interacts with the CLI as a subprocess and never sees credentials.

If you have an Anthropic API key configured for some other tool, that's outside CreativEdge's surface. Treat it as not-our-business.

### 11.3 `providers.json`

If present at `~/.creativedge/providers.json`, the backend reads provider preferences from it. Default content is created automatically on first run. Never put secrets here — the file is plain text and read by the backend at startup.

### 11.4 Healthz surfaces provider readiness

```
GET /healthz
```

Returns provider readiness in this shape (some fields optional depending on backend phase):

```json
{
  "service": "creativedge-backend",
  "providers": {
    "primary": "claude",
    "claude": { "installed": true, "authStatus": "unknown" },
    "mock":   { "installed": true }
  }
}
```

The Setup wizard's **Claude Code** step + the Ops console's **Diagnostics** card both surface this.

### 11.5 What to check when Claude is missing / auth unknown

- `claude` on `PATH`? Run `claude --version` in a terminal.
- The CLI authenticated? Run the CLI's status / login command per Anthropic's docs.
- The backend logs (`~/.creativedge/logs/electron-backend-<ts>.log`) may have a more specific error.
- Worst case, the mock provider keeps the app usable. Chat continues; replies are mock-generated.

Full troubleshooting walk-through:
[`troubleshooting.md` §9](troubleshooting.md#9-claude-code-cli-missing-or-auth-unknown).

---

## 12. Development safety and privacy rules

These are **non-negotiable invariants** inherited from the Phase 9 closure and the standing security contracts. Every slice (yours, mine, future agents') must honour them.

### 12.1 No logging of sensitive content
- Do NOT log prompts.
- Do NOT log chat content.
- Do NOT log memory content.
- Do NOT log env vars.
- Do NOT log API keys, auth tokens, cookies, SSH keys, Git credentials.

### 12.2 No commit of runtime / generated data
- Do NOT commit anything under `~/.creativedge/`.
- Do NOT commit `backend-api/node_modules/`, `frontend/node_modules/`, `electron/node_modules/`.
- Do NOT commit `backend-api/dist/`, `frontend/dist/`, `electron/dist-electron/`.
- Do NOT commit `.env` files (none should exist anyway).
- Do NOT commit any agent's `memory/*.md` files (gitignored).

### 12.3 No widening of bind addresses
- Backend MUST bind to `127.0.0.1` only — never `0.0.0.0`, never a LAN-routable interface.
- Electron static server MUST bind to `127.0.0.1` only.
- The default `CREATIVEDGE_HOST` env value is `127.0.0.1`. Don't change it casually.

### 12.4 No new telemetry / auto-update / signing without a phase
- Do NOT add `electron-updater` without a fresh signing-certificate decision and an explicit phase opening.
- Do NOT add code-signing without the same.
- Do NOT add GitHub Actions release automation without the same.
- Do NOT add any background polling.
- Do NOT add any auto-install / auto-download path.

### 12.5 No automatic crash-report send
- Crash reports remain local-only with explicit Prepare / Copy / Download UX (Phase 9-D-C2).
- The `backendLogTail` free-text field stays dropped from the prepared report until a tested redaction sanitizer lands.
- No Send / Upload / Email / GitHub-issue button anywhere.

### 12.6 No bypass of confirmation modals
- Memory promote / forget / replace requires explicit confirmation (Phase 5.2/5.4 + Phase 7-C).
- Backup push requires the second-confirmation modal with the explicit checkbox (Phase 9-D-B3).
- Agent overrides require the diff-preview modal with the "I've reviewed these changes" checkbox (Phase 7-B).
- Slash-command destructive ops are gated behind `SlashConfirmModal`.

### 12.7 No `git add .`
- Stage files explicitly: `git add <file1> <file2> ...`.
- Always run `git status -s` before and after staging.
- Pre-existing local-only modifications to `Logo-Design.md`, `chat.md`, `README.md`, and others may exist on the working tree; do NOT bulk-stage them.

### 12.8 `todo.md` is the canonical roadmap
- Read it before claiming work is done or pending.
- Update it as part of any phase-tracking slice (impl-pending-validation footers, closure flips).
- If a closure footer's claim and the current code disagree, the code wins and the footer needs an update.

---

## 13. Validation checklist for normal slices

### 13.1 Docs-only slice
- `git status -s` before + after.
- Verify no code / package / generated files modified.
- Grep new docs for stale or unsafe phrases (see §13.5).
- Sanity-run code unchanged-ness:
  - `cd backend-api && npm run build` (exit 0).
  - `cd frontend && npm run typecheck` (exit 0).
- No `npm run dev:electron` required for docs slices.

### 13.2 Backend slice
- Everything in §13.1, plus:
- `cd backend-api && npm run build` (exit 0).
- `cd backend-api && npm run typecheck` (exit 0).
- Relevant test runner(s):
  - Touched routing → `npm run test:routing`.
  - Touched memory helpers → `npm run test:memory-files` + `npm run test:memory-integration`.
  - Touched backup → `npm run test:backup`.
  - Touched SQLite → `npm run test:sqlite`.

### 13.3 Frontend slice
- Everything in §13.1, plus:
- `cd frontend && npm run typecheck` (exit 0).
- `cd frontend && npm run build` (exit 0 — Windows only; Linux sandbox blocks on `@rollup/rollup-linux-x64-gnu`).

### 13.4 Electron-lifecycle slice
- Everything in §13.1, plus all five `node --check`s:
  - `node --check electron/main.mjs`
  - `node --check electron/preload.cjs`
  - `node --check electron/scripts/build-deps.mjs`
  - `node --check electron/scripts/build-win.mjs`
  - `node --check electron/scripts/after-pack.mjs`
- `npm run dev:electron` smoke walkthrough on Windows:
  - App opens.
  - Backend `/healthz` OK on the dynamic backend URL.
  - Chat works.
  - Setup / Ops / Backup / Crash reports / Update info / Releases external link all work.
  - Close app cleanly.
  - Post-close: read dynamic ports from the Electron stdout log and verify both are free:
    ```powershell
    Get-NetTCPConnection -LocalPort <dynamicBE> -State Listen -ErrorAction SilentlyContinue
    Get-NetTCPConnection -LocalPort <dynamicFE> -State Listen -ErrorAction SilentlyContinue
    ```

### 13.5 Stale / unsafe phrase grep

Run on any new docs to verify nothing slips:
- `"Phase 9 open"`
- `"9-D-C4 pending"`
- `"must use port 3001"` / `"must use port 5174"`
- `"electron-updater implemented"`
- `"automatic update is enabled"`
- `"telemetry enabled"`
- `"crash reports are sent"`
- `"uploads crash reports"`
- `"0.0.0.0"`
- `"C:\Users\<username>"` (any concrete user-home path leaks the maintainer's account name)

Zero hits expected.

---

## 14. Packaging checklist (concise)

Full version: [`electron-release-runbook.md`](electron-release-runbook.md) + [`troubleshooting.md`](troubleshooting.md) §4–§5.

```powershell
# 0. Cleanup
Get-Process node, electron, bun -ErrorAction SilentlyContinue | Stop-Process -Force

# 1. Build
cd C:\path\to\CreativEdge
npm run build:electron
# Expect: [build-win] packaging plan (Phase 9-D-B2 afterPack flow)
# Expect: source tree mutation: NONE
# Expect: [after-pack] rebuild complete for better-sqlite3 in …\resources\backend-api\node_modules
# Expect: [build-win] DONE. Artifacts in electron/dist-electron/

# 2. Launch packaged binary
& ".\electron\dist-electron\win-unpacked\CreativEdge.exe"
# Expect: dynamic ports logged
# Expect: /healthz OK on the dynamic backend URL
# Expect: chat / Setup / Ops / Backup / Crash reports / Releases link all work
# Expect: no NODE_MODULE_VERSION crash

# 3. Close app cleanly
# Expect: backend child exited code=null signal=SIGTERM expected=true
# Substitute the actual ports from the Electron stdout log:
Get-NetTCPConnection -LocalPort <dynamicBE> -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort <dynamicFE> -State Listen -ErrorAction SilentlyContinue
# Both should return no output.

# 4. Post-package dev-ABI sanity
cd backend-api
npm run build
# Expect: exit 0 (proves source better-sqlite3 still at system-Node ABI)
```

The Phase 9-D-C4 closure used a 28-step packaged-validation checklist; see the §9-D-C4 closure footer in [`../todo.md`](../todo.md) for the full version.

---

## 15. Git workflow

### 15.1 Before any change
- `git status -s` to see the working tree.
- Read [`../todo.md`](../todo.md) for the current active phase.

### 15.2 Staging
- Stage files explicitly: `git add path/to/file1 path/to/file2 ...`.
- **NEVER `git add .`** — there are usually pre-existing local-only modifications (e.g. `Logo-Design.md`, `chat.md`, `README.md`) on the working tree that should NOT be staged unless your slice explicitly touches them.
- Run `git diff --cached --stat` to confirm what's staged.

### 15.3 Commit message conventions
Conventional Commits style, e.g.:
- `feat(electron): add Phase 9-D-C3 dynamic free-port allocation`
- `feat(ops): add Phase 9-D-C2 crash-report prepare export UX`
- `docs(user-guide): expand Phase 10-C user guide`
- `docs(todo): flip Phase 9-D-C3 to Windows validated`
- `refactor(electron): move better-sqlite3 ABI rebuild into afterPack`

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`. Common scopes: `electron`, `ops`, `backup`, `chat`, `memory`, `routing`, `todo`, `user-guide`, `developer`.

### 15.4 Push
- Default to **NOT pushing** until the user explicitly says it's okay (especially for AI agents).
- Never push directly to `main` unless the standing project rule explicitly allows it for the current operator.

### 15.5 Generated artifacts
- Never stage `backend-api/dist/`, `frontend/dist/`, `electron/dist-electron/`, any `node_modules/`, any `.cache/`, or any temp files.
- All of these should be gitignored already; verify before staging anyway.

### 15.6 Pre-existing local-only modifications
Some files may show as modified on the working tree across many turns because the user has local-only edits to them. The known list at the time of this guide:
- `Logo-Design.md`
- `chat.md`
- `README.md` (sometimes; check the diff first)
- `docs/electron-release-runbook.md` (sometimes; check the diff first)
- `electron/NOTES.md` (sometimes; check the diff first)

**Do NOT stage these unless your slice explicitly modifies them.** Treat them as out-of-scope ambient modifications.

---

## 16. Working with AI coding agents

If you're delegating a slice to a coding agent (Claude Code, another IDE agent, a teammate's offline run), put these rules in the brief:

### 16.1 Start state
Give the agent:
- Current `git log --oneline -10` HEAD.
- Current Phase and sub-slice from `todo.md`.
- The specific files in scope.
- The specific files OUT of scope.

### 16.2 Plan-first
Require the agent to produce a concise, multi-point plan **before** editing anything. The plan should answer:
- What's the current state?
- What changes? Why?
- What files are touched?
- What validation runs?
- What's rolled back if things break?

Reject a plan that's hand-wavy or claims unverified features as implemented.

### 16.3 Strict scope
Require the agent to honour:
- "Do NOT modify code unless explicitly required."
- "Do NOT modify package files unless explicitly required."
- "Do NOT commit. Do NOT push. Wait for review."
- "Do NOT touch `Logo-Design.md`, `chat.md`, or other pre-existing local-only modifications."
- "Do NOT widen bind address; no `0.0.0.0`; no LAN exposure."
- "Do NOT add telemetry; do NOT add auto-update; do NOT add signing wiring; do NOT add GitHub Actions release workflow."
- "Do NOT make crash reports send automatically."

### 16.4 Validation evidence
Require the agent to run + report:
- `git status -s` before and after.
- All applicable validation commands from §13.
- Stale / unsafe phrase grep on new docs.
- Verification that every documented script exists in the actual `package.json`.

### 16.5 Update `todo.md` for phase tracking
The agent must update `todo.md`:
- Top-of-file Phase rollup → reflect the slice's state.
- Append an implementation closure footer at EOF describing what landed, what's deferred, validation results, files changed.
- Never flip a slice to ✅ Complete without explicit user-evidenced Windows validation.

### 16.6 Don't fabricate features
- Verify every claim against actual source code before writing it into docs.
- If a feature is documented anywhere as "implemented" but the source disagrees, the source wins; flag the discrepancy in the report.

### 16.7 Don't touch private / runtime / generated files
- `~/.creativedge/` is the user's runtime tree; never write there from a docs slice.
- `node_modules/`, `dist/`, `dist-electron/` are generated; never edit by hand; never stage.

### 16.8 Read first
Point the agent at:
- [`README.md`](README.md) (docs index).
- [`../README.md`](../README.md) (project entry-point).
- [`../todo.md`](../todo.md) (canonical phase state).
- [`../INSTRUCTIONS.md`](../INSTRUCTIONS.md) (only relevant when the agent is itself playing one of the 14 roles inside chat turns; irrelevant for development work).

---

## 17. Common developer tasks

### 17.1 Start backend + frontend (browser dev)

```powershell
# Terminal A
npm run dev:backend
# Terminal B
npm run dev:frontend
# Open http://127.0.0.1:5173 in a browser
```

### 17.2 Start Electron dev mode

```powershell
npm run dev:electron
# Watch the stdout for the boot-ready line; dynamic ports differ each run.
```

### 17.3 Build packaged Windows app

```powershell
npm run build:electron
# Validate per §14
```

### 17.4 Check backend health

```powershell
# Dev:
curl http://127.0.0.1:3001/healthz
# Electron: substitute the dynamic backend port from the Electron stdout log
```

### 17.5 Open the logs directory

```powershell
explorer "$env:USERPROFILE\.creativedge\logs"
```

### 17.6 Verify dynamic ports while Electron is running

Read the boot-ready line from the Electron stdout log:
```
[electron-main] boot ready: backend=http://127.0.0.1:<X> static=http://127.0.0.1:<Y>
```
Then:
```powershell
Get-NetTCPConnection -LocalPort <X> -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort <Y> -State Listen -ErrorAction SilentlyContinue
# Both should return entries WHILE the app is running.
# Both should return NO output after the app closes cleanly.
```

### 17.7 Run backup tests

```powershell
cd backend-api
npm run test:backup
# Expect: total: 42   PASS 42   SKIP 0   FAIL 0
```

### 17.8 Run memory tests

```powershell
cd backend-api
npm run test:memory-files
# Expect: PASS lines for safeAppendUnique / findEpisodicMatch / safeReplaceOnce / forget / parseEpisodicEntries / buildEpisodicCompactionPreview / buildCompactionBlock / getEpisodicCompactionStatus

npm run test:memory-integration
# Expect: total: 4   PASS 4   FAIL 0 (write-read / concurrent-write-lock / forget-core / sensitive-refusal)
```

### 17.9 Run routing tests

```powershell
cd backend-api
npm run test:routing
# Expect: 38/38 PASS
```

### 17.10 Recover from stale node / electron / bun processes

```powershell
Get-Process node, electron, bun -ErrorAction SilentlyContinue
Get-Process node, electron, bun -ErrorAction SilentlyContinue | Stop-Process -Force
```

(Only kill the ones you recognise as CreativEdge-related; don't blindly stop every node.exe on the machine.)

### 17.11 Clear the electron-builder winCodeSign cache

```powershell
Remove-Item "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign" -Recurse -Force
npm run build:electron
# electron-builder re-downloads + re-unpacks on next run
```

### 17.12 Rebuild backend after a packaged build (recovery only)

This should rarely be needed because the Phase 9-D-B2 afterPack flow keeps the source tree un-mutated. Use only when `cd backend-api && npm run build` fails with `NODE_MODULE_VERSION` after a packaged build:

```powershell
cd backend-api
npm rebuild better-sqlite3
```

---

## 18. Where to go next

- **User-facing app behaviour**:
  [`user-guide.md`](user-guide.md).
- **Things going wrong**:
  [`troubleshooting.md`](troubleshooting.md).
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
