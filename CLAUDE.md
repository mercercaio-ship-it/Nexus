# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**CreativEdge** is a local-first multi-agent desktop chatbot for Windows. One chat surface, 14 voices: an orchestrator (**🌐 Nexus**) routes each turn to one of 13 specialist agents — or convenes 2–3 of them in parallel and synthesizes a single reply. All persistent data lives under `~/.creativedge/` on the local machine. No telemetry, no automatic external send, all servers bound to `127.0.0.1` only.

All canonical phases 0–10 are ✅ Complete (as of 2026-05-22). The canonical phase roadmap and per-slice closure evidence trail live in [`todo.md`](todo.md) — that file is the source of truth for "what's done" and "what's open."

## Three-package layout (not a workspace)

The repo is **not** an npm workspace — `backend-api/`, `frontend/`, and `electron/` are three isolated packages, each with its own `package.json`, `node_modules`, and lockfile. The root `package.json` orchestrates them via `npm --prefix <dir> run <script>`.

- `backend-api/` — Fastify + TypeScript + SQLite (better-sqlite3, FTS5). Routes for chat (SSE), agents, sessions, search, memory, ops, backup. Provider abstraction with Claude Code CLI primary + mock fallback.
- `frontend/` — Vite + React 18 + TypeScript. Chat UI, admin console (Phase 7), Ops console (Phase 9-D), setup wizard.
- `electron/` — Windows-x64-NSIS desktop wrapper. Spawns the compiled backend as a child process, allocates dynamic free loopback ports, serves the built frontend bundle via a tiny localhost HTTP server, exposes runtime config to the renderer via a preload bridge.
- `agents/<slug>/` and `orchestrator/` — file-based agent definitions (`identity.md`, `soul.md`, `personality.md`, `system_prompt.md`, `config.json`, `memory/{core,episodic}_memory.md`). The orchestrator additionally holds `registry.json` (machine-readable roster), `routing_rules.md`, and `creativedge_context.md`.

## Common commands

All commands run from the repo root unless stated. Use PowerShell on Windows.

```powershell
# Install
npm run setup            # backend + frontend deps + post-install notes
npm run setup:electron   # Electron devDeps (separately, only for desktop)

# Run (pick one)
npm run dev:electron     # Desktop app (recommended) — dynamic ports, hardened renderer
npm run dev:backend      # Terminal A — Fastify on 127.0.0.1:3001 (tsx watch)
npm run dev:frontend     # Terminal B — Vite on 127.0.0.1:5173 (proxies to :3001)

# Build
npm run build            # backend tsc + frontend Vite build
npm run build:electron   # full Windows packaging orchestrator (NSIS + win-unpacked)

# Typecheck
npm run typecheck        # both packages, tsc --noEmit

# Recovery only
npm run rebuild:electron # manual better-sqlite3 ABI rebuild against Electron's Node
```

### Backend test runners

There is no Jest/Vitest harness — tests are bespoke `.mjs` runners under `backend-api/scripts/`. Run them from `backend-api/`:

```powershell
cd backend-api
npm run test:routing                 # routing-fixtures.json: keyword + override rules
npm run test:agents                  # agent behavior smoke
npm run test:in-character            # MBTI voice contamination fixtures
npm run test:voice                   # agent voice-hold across turns
npm run test:memory                  # core memory smoke
npm run test:memory-candidate        # memory-candidate detection
npm run test:memory-files            # memory file IO
npm run test:memory-integration      # end-to-end memory flow
npm run test:sqlite                  # sqlite migrations + queries
npm run test:backup                  # opt-in git-based backup
```

To run a single fixture file or a single case, edit the runner script — they read JSON fixtures from `backend-api/tests/` directly.

### Build outputs — never commit

`backend-api/dist/`, `frontend/dist/`, `electron/dist-electron/`, every `node_modules/`, every `*.tsbuildinfo`, every `*.log`, and `*.db*` are all `.gitignore`d. `~/.creativedge/` is **outside** the repo entirely — never check it in.

## Architecture: how a chat turn flows

The runtime path lives in `backend-api/src/routes/chat.ts` and the modules under `src/routing/`, `src/convening/`, `src/handoff/`. Understanding this pipeline requires reading several files together:

1. **Bootstrap** (`bootstrap/ensureRuntimeDir.ts`) — on first boot, idempotently scaffold `~/.creativedge/` (profile, providers config, sqlite db, per-agent memory dirs seeded from project templates). Project templates under `agents/` and `orchestrator/` stay read-only; user-specific state lives only in `~/.creativedge/`.

2. **System prompt assembly** — every turn concatenates three blocks:
   ```
   orchestrator/creativedge_context.md     ← shared project facts + roster
   <agent>/system_prompt.md                ← per-agent personality
   ~/.creativedge/agents/<slug>/memory/core_memory.md
   ```
   The first block is identical for every specialist + Nexus and keeps the model grounded in the real roster. The registry entry's `path` field is honored so Nexus loads `orchestrator/system_prompt.md`, not the (non-existent) `agents/nexus/system_prompt.md`.

3. **Routing pipeline** (`src/routing/routingPipeline.ts`) — deterministic, layered:
   - Keyword shortlist (`scoreSpecialists`) → score every specialist with a word-boundary regex; soft hits on name/domain count less than primary keywords.
   - No matches → `nexus_fallback` (Nexus answers via real provider).
   - Out-of-domain (top score below threshold) → deterministic Nexus reply suggesting closest specialist; provider **not** called.
   - Clear winner → `specialist` / source `keyword`.
   - Ambiguous (top - second ≤ `ambiguousMargin`) →
     1. **Override rules** (`overrideRules.ts`) — five hand-coded overlap pairs (Lumi↔Iris, Vera↔Atlas, Sage↔Bit, Buzz↔Lex, Echo↔Reel). If signal tokens fire for exactly one side, that side wins.
     2. **LLM tie-breaker** (`tieBreaker.ts`) — isolated Claude CLI call with separate `requestId`, no `messages` row, no SSE chunks emitted. Tight system prompt asking for strict JSON `{slug, confidence, rationale}`. Skipped when Claude not installed; any failure returns `null`.
     3. **Clarification** — deterministic Nexus one-question ask; provider not called.
   - Every decision writes exactly one `routing_events` row.

4. **Convening (Phase 3.2)** — `src/routing/convening.ts` deterministically detects multi-domain asks via explicit phrase regex (`compare`, `from both angles`, `bring in the team`, `<X> and <Y> feedback`) or a fixed cross-domain table (`brand launch`, `AI product pitch`, `pitch deck`, etc.). Picks 2–3 slugs (hard cap, Nexus excluded, deduped). `src/convening/runConvening.ts` fans out drafts in parallel via `Promise.allSettled`, then runs **one Nexus synthesis call** that streams via the existing SSE writer. **The user sees exactly one synthesized reply.** Internal drafts are never persisted; `messages` always gets exactly two rows per convening turn (user + Nexus synthesis). Failures degrade gracefully with deterministic stitching.

5. **Handoff (Phase 3.3)** — when routing is `type:"specialist"`, the chat layer appends a `HANDOFF_INSTRUCTION` block to the specialist's system prompt. The full response is buffered, then `handoffDetector.ts` looks for at most one `<CREATIVEDGE_HANDOFF>{"handoff":"<slug>","reason":"..."}</CREATIVEDGE_HANDOFF>` block. Valid handoff → `runHandoffTurn` streams a short Nexus transition line + the target's reply; the **originating specialist's draft is never persisted**. Slug normalization (lowercase + collapse non-alphanumerics) and a 14-entity alias table tolerate persona names ("echo") or domain words ("audio") as targets. The target specialist does NOT receive the `HANDOFF_INSTRUCTION` (hard cap of one handoff per turn). Every detection — completed, ignored, or failed — writes one `handoff_events` row. `nexus_fallback`, `convene`, `clarify`, and `out_of_domain` never inject the protocol.

6. **Provider abstraction** (`src/providers/`):
   - `ClaudeProvider` spawns the local Claude Code CLI via `claude -p --output-format stream-json --verbose --no-session-persistence --disable-slash-commands --tools "" --setting-sources "" --strict-mcp-config`. The five isolation flags between `--verbose` and `--system-prompt` keep Claude Code's own skills/hooks/plugins/MCP/CLAUDE.md from leaking into specialist replies.
   - **Do not re-add `--bare`** — it forces auth to `ANTHROPIC_API_KEY`/`apiKeyHelper`, breaks OAuth login, and produces silent "Not logged in" failures. This was removed in Phase 2.4 after the original Phase 2.3 broke and is documented in `backend-api/README.md`.
   - The CLI is always invoked with an args array — no shell interpolation — so user messages can't smuggle CLI flags. stdin is piped to `/dev/null`.
   - `chat.ts` buffers the first ProviderChunk before emitting any SSE. If the first chunk is an `error` (auth failure, ENOENT, first-chunk timeout), the chat layer transparently swaps in `MockProvider` and sets `degraded:true` + `claudeError:"<message>"` on the `meta` event.
   - Timeouts (configurable in `~/.creativedge/providers.json`, never via env): `firstChunkTimeoutMs` (default 60s), `turnTimeoutMs` (default 120s), `conveningSynthesisTimeoutMs` (default 150s).
   - Conservative retry: at most one retry, 600ms backoff, only for transient signals. Auth failures, ENOENT, timeouts, validation errors are **never** retried.

7. **Context budgeting** — `chat.ts` protects `creativedge_context.md` + system prompt + core memory + current user message from trim; trims oldest transcript messages first. Defaults: `maxContextChars=120000`, `reservedResponseChars=12000`, `recentMessageLimit=20`. SSE `meta` event carries `budget:{messages_kept, messages_trimmed, protected_chars}`.

8. **Persistence** — `sessions.db` (SQLite + FTS5) under `~/.creativedge/`. Tables: `sessions`, `messages` (FTS5 mirror), `agent_events` (with `usage_json` token/cost telemetry), `routing_events` (one per turn, with `convened_slugs_json` when applicable), `handoff_events`. All migrations are idempotent via `PRAGMA table_info` checks before `ALTER TABLE ADD COLUMN`.

## Electron architecture

`electron/main.mjs` orchestrates a careful lifecycle that future changes must preserve:

1. **Dynamic free-port allocation (Phase 9-D-C3)** — the backend port is picked via a temporary `net.createServer.listen(0)` probe before spawn; the static frontend server uses `listen(0, "127.0.0.1")` directly. There's a small probe-close-vs-child-spawn race; on `EADDRINUSE` the allocate+spawn cycle retries once.

2. **Backend as child process** — spawns `backend-api/dist/index.js` with `CREATIVEDGE_PORT=<dynamic>` and `CREATIVEDGE_HOST=127.0.0.1`. **Backend stdout/stderr go to `~/.creativedge/logs/electron-backend-<ts>.log`** — forwarding to Electron main's `process.stdout` crashes the backend with EPIPE on Windows GUI mode (pino's default destination calls `process.exit(1)` on write failure).

3. **Static frontend server** — tiny Node-stdlib HTTP server on `127.0.0.1:0` serves `frontend/dist/`. Loading via `http://` (not `file://`) avoids the `Origin: null` CORS rejection the backend's allow-list would otherwise emit.

4. **Healthz wait** — polls `GET /healthz` for up to 30s before opening the window.

5. **Hardened renderer** — `contextIsolation:true`, `nodeIntegration:false`, `sandbox:true`, `webSecurity:true`, no remote module, `will-navigate` restricted to `127.0.0.1`, `window.open` denied.

6. **Preload bridge** (`electron/preload.cjs`) — exposes exactly two surfaces on `window.ceBridge`:
   - `getRuntimeConfig()` → returns `{backendBaseUrl, packaged}` so the renderer can discover the dynamic backend port at runtime.
   - `openExternal(url)` → HTTPS-only allow-listed external-link opener (today: only the GitHub releases page).

7. **API base resolution** — `frontend/src/api/client.ts` reads `window.ceBridge.getRuntimeConfig().backendBaseUrl` first. `VITE_API_URL=http://127.0.0.1:3001` is baked into the frontend bundle as a belt-and-suspenders fallback only — inside Electron, the preload bridge always wins.

8. **`better-sqlite3` ABI rebuild (Phase 9-D-B2)** — the `afterPack` hook rebuilds against Electron's bundled Node ABI **only inside the packaged copy** at `<appOutDir>/resources/backend-api/`. The source `backend-api/node_modules/` is never mutated.

Full Electron operational reference: [`electron/NOTES.md`](electron/NOTES.md) and [`docs/electron-release-runbook.md`](docs/electron-release-runbook.md).

## Privacy / security contract (non-negotiable)

These rules are inherited by every change unless an explicit phase relaxes them:

- ❌ No Anthropic API. No `ANTHROPIC_API_KEY`. No `.env` files. No API key files. The Claude Code CLI manages its own auth independently of CreativEdge.
- ❌ No telemetry, no automatic external send, no background polling.
- ❌ No `0.0.0.0` binding — the app is `127.0.0.1` only.
- ❌ No `electron-updater`, no GitHub Actions release workflow, no code-signing wiring without an approved phase (the signing-certificate decision gates the entire auto-update surface).
- ❌ No runtime memory content, chat transcripts, or `~/.creativedge/` data committed to git (including docs, fixtures, logs).
- ❌ No personal paths (`C:\Users\<you>\…`) in committed files.
- ❌ No `electron/dist-electron/`, `dist/`, `node_modules/`, or `.creativedge/` paths in commits.

## Working in this repo

Drawn from [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`docs/developer-setup.md`](docs/developer-setup.md):

- **Stage explicitly.** Use `git add <path>` per file or directory. **Never `git add .`** — that captures local notes, generated artifacts, and OS files.
- **Pre-existing local-only modifications** to `Logo-Design.md`, `chat.md`, `electron/NOTES.md`, and other local-only docs are intentionally preserved across slices. Leave them alone unless the brief explicitly authorizes touching them.
- **Conventional Commits** prefixes (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`), optional scope tag for multi-package work (e.g., `feat(electron): …`).
- **Validation evidence in PRs.** Every code change ships with the validation appropriate to its scope: backend → `cd backend-api && npm run build` + relevant `test:*` runner; frontend → `cd frontend && npm run typecheck`; electron-lifecycle → `node --check` on each touched `.mjs`/`.cjs` + packaged-build sanity walk per [`docs/release-readiness.md`](docs/release-readiness.md).
- **Docs-only slices** still run the code-sanity commands as a regression check — exit 0 across the board proves the slice did not touch code.
- **Don't invent features.** Don't add scripts, dependencies, routes, or UI cards that weren't in the brief. If a slice mentions strict scope, re-state what it must NOT touch.
- **`todo.md` is canonical.** Closure footers there are part of the audit trail — do not delete or rewrite them.

## Key references

- [`README.md`](README.md) — top-level entry + Quick Start
- [`INSTRUCTIONS.md`](INSTRUCTIONS.md) — agent-roleplay spec (LLM-facing): 14 voices, MBTI assignments, routing rules, multi-specialist format
- [`architecture.md`](architecture.md) — turn shape, MBTI assignments, memory model, suggested wiring
- [`todo.md`](todo.md) — canonical phase roadmap + per-slice closure evidence
- [`backend-api/README.md`](backend-api/README.md) — full backend phase history and endpoint/SSE/routing/persistence details
- [`docs/developer-setup.md`](docs/developer-setup.md) — full developer onboarding (16 sections including AI-agent briefing template + 12 common tasks)
- [`docs/troubleshooting.md`](docs/troubleshooting.md) — 26-section named recovery recipes
- [`docs/release-readiness.md`](docs/release-readiness.md) + [`docs/electron-release-runbook.md`](docs/electron-release-runbook.md) — packaging + release
- [`docs/add-an-agent.md`](docs/add-an-agent.md) / [`docs/customize-an-agent.md`](docs/customize-an-agent.md) — agent authoring (the six required files, when to override vs edit source, why slugs must never be renamed)
- `~/.creativedge/logs/creativedge-YYYY-MM-DD.log` — daily JSONL backend log (pino-redacted at source)
- `~/.creativedge/logs/electron-backend-<ts>.log` — backend stdout/stderr when launched under Electron
