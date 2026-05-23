# CreativEdge backend — Phase 2 complete

A local Node + TypeScript + Fastify service that hosts the CreativEdge multi-agent runtime. Phase 2 (2.1 → 2.6) is complete and ready to hand off into Phase 3.

**Phase 2.1 (skeleton).** Bootstrap, provider abstraction, SQLite placeholder, `/healthz`. Complete.

**Phase 2.2.**
- Cleanup: Unicode em dashes in log/status strings replaced with ASCII hyphens.
- 2.2-A: agent + session routes (`GET /agents`, `GET /agents/:slug`, `PUT /agents/:slug`, memory endpoints, sessions endpoints).
- 2.2-B: local Claude runtime readiness detection (`claude --version` probe, no Anthropic API, no `.env`, no API key).
- 2.2-C: minimal `POST /chat` SSE route, deterministic keyword router, SQLite-backed session/message persistence, MockProvider clearly marked as degraded when used.

**Phase 2.3.** `ClaudeProvider.call()` wired to the local Claude Code CLI in non-interactive print mode. Real Claude tokens stream through the existing SSE contract; on auth failure / spawn error, `/chat` falls back to MockProvider transparently and the reason surfaces in the `meta` event as `claudeError`.

**Phase 2.4.** Minimal validated CLI invocation (`--bare` removed — it was forcing API-key auth and breaking OAuth login); keyword router uses word boundaries (`paragraph` ≠ `RAG`); first-chunk timeout 60 s, hard-turn timeout 120 s, both configurable through `~/.creativedge/providers.json`.

**Phase 2.5.** Five runtime-isolation CLI flags (`--no-session-persistence --disable-slash-commands --tools "" --setting-sources "" --strict-mcp-config`) keep Claude Code's own skills / hooks / plugins / MCP / CLAUDE.md from leaking into specialist replies. New `orchestrator/creativedge_context.md` preamble (≈700 tokens, factual project context + correct roster) is injected on every turn. Nexus path bug fixed (`readAgentSnapshot` now honors the registry `path` field); Nexus's own runtime memory is now seeded too.

**Phase 2.6.** Conservative retry/backoff for transient CLI failures (at most one retry, 600 ms backoff, auth/timeouts never retried). Character-based context budgeting per session (protects project context + system prompt + core memory; trims oldest transcript turns first). Idempotent SQLite migration adds `agent_events.usage_json` and the CLI parser emits a `usage` chunk carrying `total_cost_usd`, `usage.{input,output}_tokens`, `duration_*ms`, `modelUsage`, etc. — chat.ts persists it.

**Phase 3.1.** Real routing pipeline replaces the single-shot keyword router. Layered, deterministic order: keyword shortlist → out-of-domain check → override rules (the five Lumi↔Iris / Vera↔Atlas / Sage↔Bit / Buzz↔Lex / Echo↔Reel overlap rules from `orchestrator/routing_rules.md`) → optional LLM tie-breaker (local Claude CLI only — no Anthropic API) → clarification → `specialist` / `clarify` / `out_of_domain` / `nexus_fallback`. Every `/chat` turn writes one `routing_events` row. Clarify and out-of-domain decisions skip the provider entirely; Nexus answers deterministically and the SSE shape stays identical. Tie-breaker calls are isolated: separate `requestId`, no `messages` row, no SSE chunks emitted to the user.

**Phase 3.2 (this slice).** Multi-specialist convening. The pipeline now has a `convene` decision type. Detection is deterministic: explicit phrases ("compare", "from both angles", "X and Y feedback", "bring in the team", etc.) OR a known cross-domain deliverable ("brand launch", "AI product pitch", "logo + video", "pitch deck", "website + campaign", "code + security"). Selection picks 2–3 specialists (hard cap of 3, Nexus never included, deduplicated). Fan-out runs in parallel through the existing provider via `Promise.allSettled`; each draft uses the same per-specialist system prompt + project context as a normal turn but with an extra "you are one of several" instruction. Drafts are internal — **no SSE chunks emitted to the user, no `messages` row written**. Synthesis is one Nexus call that gets the original message + labeled drafts and streams its reply through the existing SSE writer. `routing_events.convened_slugs_json` (idempotent migration) records the slugs convened. The chat layer still persists exactly **one** user message + **one** Nexus synthesis message per turn.

**Phase 3.3 (this slice).** Controlled specialist-to-specialist hand-off via Nexus. When the routing decision is `type:"specialist"` we append a `HANDOFF_INSTRUCTION` block to the specialist's system prompt that documents an opt-in protocol: at most one `<CREATIVEDGE_HANDOFF>{"handoff":"<slug>","reason":"..."}</CREATIVEDGE_HANDOFF>` block per turn. The chat route buffers the first specialist's full response, runs `detectHandoff` (`src/handoff/handoffDetector.ts`) against the registry, and branches:
- **Valid handoff** — `runHandoffTurn` (`src/handoff/runHandoff.ts`) streams a short Nexus transition line + the target specialist's reply. The originating specialist's draft is **never persisted**. Exactly two messages exist after the turn: the user's input and the target's visible reply.
- **No block** — the originating specialist's reply is flushed in one chunk and persisted normally.
- **Ignored block** (malformed JSON, missing reason, self-target, unknown slug, Nexus target) — the block is silently stripped from the visible text and the originating reply is shown. The ignore reason is audited.

Hard cap of one handoff per turn is enforced architecturally: the target specialist does NOT receive the `HANDOFF_INSTRUCTION`, and `stripAnyHandoffBlock` removes any block the target tries to emit anyway. Every detection result — completed, ignored, or failed — produces one `handoff_events` row (new table, idempotent migration). The SSE contract is preserved; the `done` event gains an additive optional `handoff: {fromSlug, toSlug, rawSlug, status, reason}` field. `nexus_fallback`, `convene`, `clarify`, and `out_of_domain` routings do NOT inject the protocol and never go through handoff detection.

**Phase 3.3 alias-normalization patch.** Specialists in the wild use persona names (`echo`, `Echo`) or domain words (`audio`, `Music & Audio`) rather than canonical registry slugs (`music-audio`). `handoffDetector` now normalizes the candidate target (lowercase, collapse non-alphanumerics into a single dash) and looks it up in an alias table covering all 14 entities; unknown candidates fall through to a direct registry lookup so newly-added specialists work via their canonical slug without an alias-table edit. The canonical slug is what gets stored in `handoff_events.to_slug`; if the raw target differed, the pino log line carries `rawSlug` and `aliasNormalized:true` for debug visibility. The `HANDOFF_INSTRUCTION` was updated to teach specialists the canonical slugs directly so the alias path is a safety net, not a primary contract.

**Intentional non-goals.** No Anthropic API. No `ANTHROPIC_API_KEY`. No `.env`. No API key file. No external Claude API call. No OpenAI / Ollama wiring. No Electron yet.

## Requirements

- **Node.js ≥ 20.11** (tested on 22.x)
- npm

## Install

```powershell
cd backend-api
npm install
```

On Windows, `better-sqlite3` ships prebuilt binaries — no compiler needed.

## Run

```powershell
npm run dev          # auto-restart on save (tsx watch)
# or
npm run build
npm start
```

Default port: `http://127.0.0.1:3001`. Override with `CREATIVEDGE_PORT`.

## First-run scaffolding

Idempotent — existing files are never overwritten.

```
~/.creativedge/                         (Windows: C:\Users\<you>\.creativedge\)
├── profile.json                       { schemaVersion, createdAt, singleUser: true }
├── providers.json                     primary + per-provider config
├── sessions.db                        SQLite: sessions / messages / agent_events
├── logs/
│   └── creativedge-YYYY-MM-DD.log     daily JSONL log
└── agents/
    └── <slug>/
        ├── memory/
        │   ├── core_memory.md         seeded from project template
        │   └── episodic_memory.md
        └── overrides.json             created on first PUT /agents/:slug
```

Project templates (`CreativEdge/agents/` and `CreativEdge/orchestrator/`) stay read-only. User-specific state lives only in `~/.creativedge/`. Phase 2.5 added `~/.creativedge/agents/nexus/memory/` to the seed set; specialists and the orchestrator now share identical runtime memory layout.

### System prompt assembly (Phase 2.5)

Every chat turn assembles the system prompt the local CLI receives as three concatenated blocks:

```
[orchestrator/creativedge_context.md]        <-- shared project facts + roster
----- you are -----
[<entry.path>/system_prompt.md]               <-- per-agent personality
----- core memory -----
[~/.creativedge/agents/<slug>/memory/core_memory.md]
```

The first block keeps the model grounded in the actual roster (Iris = Photography, Echo = Music & Audio, etc.) and explicitly forbids referencing Claude Code internals. It is identical for every specialist and for Nexus. If the file is missing, the block is silently dropped — backward-compatible with pre-2.5 trees.

The second block uses the registry entry's `path` field, so Nexus loads `orchestrator/system_prompt.md` instead of the (non-existent) `agents/nexus/system_prompt.md` it would have resolved to before Phase 2.5.

## Endpoints

### `GET /healthz`

Reports service + DB readiness + local Claude runtime probe.

```json
{
  "ok": true,
  "degraded": true,
  "setupRequired": true,
  "setupHint": "Claude local runtime is not ready. Open Claude Code and log in first.",
  "version": "0.2.0",
  "service": "creativedge-backend",
  "runtimeDir": "C:\\Users\\<you>\\.creativedge",
  "storageReady": true,
  "dbReady": true,
  "providers": {
    "primary": "claude",
    "claude": {
      "ready": false,
      "reason": "Claude binary detected, but authenticated runtime cannot be verified non-interactively.",
      "installed": true,
      "authStatus": "unknown",
      "mode": "local-claude-code-runtime",
      "version": "2.1.138 (Claude Code)",
      "setupRequired": true,
      "setupHint": "Claude local runtime is not ready. Open Claude Code and log in first."
    },
    "mock": { "ready": true }
  },
  "seededAgentSlugs": ["graphics-design", "..."]
}
```

The server **never** claims `ready: true` for Claude in Phase 2.2 — authentication can only be confirmed by an interactive login or a model call, both of which are intentionally out of scope.

### `GET /agents`

Returns the registry summary (Nexus + 13 specialists, with routing keywords).

### `GET /agents/:slug`

Full snapshot — `config`, `identity`, `soul`, `personality`, `systemPrompt`, `memory`, `overrides`, `paths`.

### `PUT /agents/:slug`

Writes a runtime override to `~/.creativedge/agents/<slug>/overrides.json`. Project templates are never touched.

**Accepted fields (Phase 2.2):** `tagline`, `voice`, `color` (`#RRGGBB`), `values`, `strengths`, `watch_outs`.

Anything else is rejected with a per-field reason. Partial apply: if a body mixes valid and invalid fields, the valid ones are saved and the response is HTTP 207 with a `rejected[]` list.

### `GET /agents/:slug/memory`

Returns `{ core, episodic, paths }` read from the runtime directory (not the project template).

### `POST /agents/:slug/memory/episodic`

Body: `{ "entry": "string" }` (1 – 4000 chars). Appends a dated block; never overwrites.

### `POST /agents/:slug/memory/promote`

Body: `{ "entry": "string", "confirmed": true }`. `confirmed !== true` is rejected with 400. Duplicate entries are detected and short-circuited with `{ duplicate: true }`.

### `GET /sessions`  ·  `GET /sessions/:id`

Reads from `~/.creativedge/sessions.db`. List ordered by `updated_at DESC`. 404 if the session doesn't exist.

### `POST /chat`  (SSE)

Body: `{ "message": "string", "sessionId": "uuid?" }`.

Behavior:

1. Validates body.
2. Creates a session if `sessionId` is absent; 404s on bad `sessionId`.
3. Routes through the deterministic keyword scorer (registry-driven). Falls back to Nexus when no keyword matches.
4. Loads `system_prompt.md` + `core_memory.md` for the chosen specialist; pulls last 20 messages from the session for context.
5. Calls the provider (Mock in Phase 2.2 since Claude is not yet wired) and streams chunks.
6. Persists user + assistant messages and an `agent_events` row to SQLite.

SSE events:

```
event: meta
data: { sessionId, agentSlug, agentName, agentEmoji, routeConfident, routeScore, routeHits, provider, degraded, requestId, newSession }

event: chunk
data: { text }

event: done
data: { ok, sessionId, provider, degraded, latencyMs }
```

`event: error` is emitted on provider failure. `degraded: true` is set whenever MockProvider was used — and that flag is also recorded in `agent_events.fallback_used`.

## Local Claude runtime detection + streaming

### Readiness probe (`checkReady`)

`ClaudeProvider.checkReady()` spawns `claude --version` with a 2.5 s hard timeout.

| Outcome | `installed` | `authStatus` | `ready` |
|---|---|---|---|
| Binary found, `--version` exits 0 | `true` | `unknown` | `false` |
| Binary not on PATH (`ENOENT`) | `false` | `unknown` | `false` |
| Timeout / non-zero exit | `false` | `unknown` | `false` |

The probe **never** makes a model call, reads an API key, opens an interactive prompt, or talks to `api.anthropic.com`. `authStatus` stays `"unknown"` until the call itself succeeds.

### Streaming (`call`)

`ClaudeProvider.call()` spawns the Phase 2.5 invocation:

```
claude -p \
  --output-format stream-json \
  --verbose \
  --no-session-persistence \
  --disable-slash-commands \
  --tools "" \
  --setting-sources "" \
  --strict-mcp-config \
  [--system-prompt "<project context + you-are + core memory>"] \
  [--model "<alias>"] \
  "<current user message>"
```

The five isolation flags between `--verbose` and `--system-prompt` were added in Phase 2.5 to keep Claude Code's own runtime (skills, hooks, plugins, MCP, slash commands, CLAUDE.md auto-discovery) from leaking into specialist replies. Each one was probed individually in isolation against the real CLI; all five are accepted by the parser, none of them re-introduces the `--bare` API-key trap, and `--tools ""` + `--disable-slash-commands` were observed to collapse `"tools":[]` and `"slash_commands":[]` in the init event.

stdin is piped to `/dev/null`. The CLI is **always invoked with an args array** — no shell interpolation — so user messages can't smuggle CLI flags.

**Why these flags and not the others.** Phase 2.3 originally added `--bare`, `--no-session-persistence`, `--tools ""`, `--dangerously-skip-permissions`, and `--include-partial-messages`. The first one was a silent killer: Claude Code's own help text says `--bare` forces auth to come from `ANTHROPIC_API_KEY` / `apiKeyHelper` and explicitly skips OAuth and keychain reads. Since CreativEdge never carries an API key, every `--bare` invocation produced `"Not logged in · Please run /login"`. Removing it lets the CLI fall back to the user's local OAuth credentials — which is the entire point of this design. The other four flags were removed alongside it for parity with the validated minimal shape; later slices can add them back one at a time once each is confirmed compatible with local OAuth.

**Output parsing.** Newline-delimited JSON from stdout is mapped to ProviderChunks:

- `stream_event` → `content_block_delta` → `text_delta.text` → `{type:"text", text}` (only fires if a future slice re-enables `--include-partial-messages`)
- `assistant.message.content[].text` (primary path under the minimal invocation) → emitted directly as one text chunk per content block; **skipped if `parsed.error` is set** so auth-failure assistant events don't leak through as fake text
- `result.is_error: true` → `{type:"error", text: result.result}` then `{type:"done"}`
- `result.is_error: false` and no assistant text was emitted → emit `result.result` as a text chunk, then `{type:"done"}`
- `result.is_error: false` and assistant text was already emitted → `{type:"done"}` only
- `system` (init/status), `hook_started`, `hook_response`, `rate_limit_event`, `tool_use` and other transport events are silently ignored

## Routing pipeline (Phase 3.1)

Every `/chat` turn runs through `src/routing/routingPipeline.ts` and produces a `RouteDecision` with this shape:

```ts
type RouteDecisionType = "specialist" | "clarify" | "out_of_domain" | "nexus_fallback";
type RouteSource = "keyword" | "override_rule" | "llm_tiebreaker" | "clarification" | "out_of_domain" | "fallback";

interface RouteDecision {
  type: RouteDecisionType;
  selectedSlug: string;
  selectedName?: string;
  score: number;
  confidence: "high" | "medium" | "low";
  routeHits: string[];
  shortlist: Array<{ slug; score; hits; rationale? }>;
  rationale: string;
  source: RouteSource;
  clarificationQuestion?: string;
  appliedRules: string[];
}
```

### Layers (in order)

1. **Keyword shortlist** (`scoreSpecialists`) — same word-boundary regex as Phase 2.4 (+3/keyword, +2/soft name|domain hit). Returns every specialist with `score > 0`, sorted descending.
2. **No matches** → `nexus_fallback` (Nexus runs the real provider with the `creativedge_context.md` preamble).
3. **Out-of-domain** — top score below `outOfDomainMinScore` (default 3, i.e. only soft hits) → deterministic Nexus reply with the closest adjacent specialist as a hint; provider not called.
4. **Clear winner** — `top.score ≥ highConfidenceMinScore` (default 5) AND `top.score - second.score ≥ clearWinnerMargin` (default 3) → `specialist` / source `keyword` / confidence `high`.
5. **Ambiguous** — `top.score - second.score ≤ ambiguousMargin` (default 2):
   1. **Override rules** — `src/routing/overrideRules.ts` encodes the five overlap rules. If a rule's pair is in the shortlist AND its signal tokens fire for exactly one side, that side wins (source `override_rule`).
   2. **LLM tie-breaker** — `src/routing/tieBreaker.ts` calls the local Claude CLI through `ClaudeProvider.call()` with a tight system prompt asking for strict JSON `{slug, confidence, rationale}`. Skipped when `claude.installed !== true`. On parse failure / invalid slug / auth error / timeout, returns `null` and the pipeline falls through.
   3. **Clarification** — deterministic Nexus question naming the top two candidates; provider not called.
6. **Moderate single winner** (no second candidate or large margin) → `specialist` / source `keyword`, confidence `medium` or `high` based on score.

### Override rules (deterministic, no LLM)

| Rule id | Pair | Tokens favoring left side | Tokens favoring right side |
|---|---|---|---|
| `lumi-vs-iris` | graphics-design ↔ photography | logo, brand, layout, UI, illustration, color palette, typography, icon, poster, ui mock | lens, camera, exposure, raw, shoot, portrait shoot, photo shoot, lighting |
| `vera-vs-atlas` | business ↔ consulting | business model, pricing, OKR, GTM, fundraising | framework, problem framing, stakeholder, workshop, decision memo, executive deck, MECE |
| `sage-vs-bit` | ai-services ↔ programming-tech | LLM, RAG, agent, prompt engineering, fine-tune, embedding, vector DB | code, bug, stack, framework, API, refactor, deploy, DevOps, library |
| `buzz-vs-lex` | digital-marketing ↔ writing-translation | ads, SEO, funnel, campaign, conversion, growth, audience, positioning | article, translation, localization, prose, tone, blog post, ghostwrite |
| `echo-vs-reel` | music-audio ↔ video-animation | voice-over, podcast audio, mix, master, sound design, score, ambient, song | video, animation, storyboard, motion graphics, reel, after effects, premiere, edit |

### LLM tie-breaker isolation (must-not-pollute)

- Separate `requestId` of the form `tiebreak-<uuid>`; no `messages` row written; no SSE chunk emitted to the user.
- System prompt has **only** the shortlist + the relevant overlap rules + strict-JSON instruction — no `creativedge_context.md`, no specialist personality.
- Tighter `timeoutMs: 30_000` override on the hard turn timeout.
- Failure modes (auth error, timeout, malformed JSON, slug not in shortlist) all return `null` so the pipeline falls back to clarification.

### Convening (Phase 3.2)

**Detection** is purely deterministic. Two trigger paths in `src/routing/convening.ts`:

- **`explicit_multi`** — phrase regex on the user message. Triggers: `compare this/these`, `from both angles`, `both angles`, `multiple perspectives`, `several specialists`, `two specialists`, `three specialists`, `bring in the team`, `convene`, `pros and cons`, `from <X> and <Y> angles`, `<X> and <Y> feedback`, plus a fallback "two-or-more-domains-named-by-alias" detector. When the user explicitly names domains (e.g. "design and marketing"), those domains win; otherwise the top of the keyword shortlist fills in.
- **`cross_domain`** — first-match-wins regex table over the lowercased message:

| Pattern | Convened slugs |
|---|---|
| `brand launch` | graphics-design · digital-marketing · business |
| `product launch` / `app launch` | graphics-design · digital-marketing · business |
| `AI product pitch` / `pitch an AI product` | ai-services · business · writing-translation |
| `pitch deck` / `investor (deck\|pitch)` | business · writing-translation · graphics-design |
| `landing page` ∧ `campaign` / `website` ∧ `campaign` / `go-to-market website` | programming-tech · graphics-design · digital-marketing |
| `logo` ∧ `(video\|animation\|animated)` | graphics-design · video-animation |
| `code` ∧ `security` | programming-tech · consulting |
| `business and technical` / `technical and business` | business · programming-tech |

**Hard cap of 3**, deduplicates, never includes Nexus. Simple single-domain asks ("I need a logo", "fix this API bug", "RAG vs fine-tuning") do **not** convene — they continue down the normal pipeline.

**Fan-out** lives in `src/convening/runConvening.ts`. Each specialist call uses `Promise.allSettled` so one failure doesn't kill the convening; each call uses its own `requestId` (`convene-<turn>-<slug>`), gets the same per-specialist system prompt as normal `/chat` (project context preamble + agent system prompt + core memory), and is amended with: *"You are one of several CreativEdge specialists Nexus has convened on this turn. Answer ONLY from your specialist perspective. Be concise (about 300 words max). Do not include your name/emoji header — Nexus will label your draft when synthesizing."* Drafts are capped at 4 000 characters before going into the synthesis prompt.

**Synthesis** is one Nexus call with a system prompt that says: open with a one-line cross-domain acknowledgement, add one labeled section per non-empty draft (using emoji + name + domain as the header), close with a concise recommendation, note unavailable perspectives only if useful, never mention Claude Code internals. The synthesis call streams tokens through the existing SSE writer. The user sees one synthesized Nexus answer — no raw drafts.

**Failure handling.** If all drafts fail, the chat layer emits a deterministic Nexus apology. If some drafts fail and some succeed, synthesis goes through with just the successful ones. If the synthesis call itself fails, a deterministic stitch (one labeled `##` section per successful draft) is emitted so the user always gets the substance. None of these paths break the SSE contract.

**Phase 3.2 reliability patch.** Drafts are now compacted to **1500 chars** before being fed into synthesis (down from 4000), keeping the synthesis input small and the synthesis call short. The synthesis hard timeout is configurable via `providers.claude.conveningSynthesisTimeoutMs` in `~/.creativedge/providers.json` (**default 150 000 ms**), seeded into fresh bootstraps and backward-compatible with older config files. When the synthesis falls back, the reason is surfaced safely in **three** places: the SSE `done` event gets a `synthesisError` field (`synthesis timeout` / `no assistant text` / `auth error` / `all drafts failed` / `synthesis provider error` / `synthesis unavailable`); `agent_events.usage_json` gets `synthesis_ok`, `synthesis_error`, `synthesis_timeout_ms`; and a pino warn line `phase:"convening-synthesis"` is written. Raw provider errors / stack traces never reach the user.

**Persistence.**
- `routing_events` gets `decision_type="convene"`, `selected_slug="nexus"`, `source ∈ {"explicit_multi","cross_domain"}`, `convened_slugs_json=[…]`. The Phase 2.6/3.1 migrations are unchanged; Phase 3.2 just adds the column.
- `messages` table gets **exactly two rows** per convening turn (user + final synthesized Nexus assistant). Internal drafts never become rows.
- `agent_events` gets one row per turn with `agent_slug="nexus"`, `provider` = whichever the synthesis used, `usage_json` summarising drafts + synthesis usage in compact form (no draft text, just per-specialist `slug` / `success` / `duration_ms` / `bytes` / `usage`).

### Persistence: `routing_events` table

Created by idempotent migration alongside the Phase 2.6 `usage_json` ALTER. Schema:

```sql
CREATE TABLE IF NOT EXISTS routing_events (
  id                    TEXT PRIMARY KEY,
  session_id            TEXT,
  request_id            TEXT NOT NULL,
  message_id            TEXT,
  selected_slug         TEXT NOT NULL,
  decision_type         TEXT NOT NULL,
  source                TEXT NOT NULL,
  confidence            TEXT NOT NULL,
  score                 INTEGER,
  route_hits_json       TEXT,
  shortlist_json        TEXT,
  applied_rules_json    TEXT,
  rationale             TEXT,
  clarification_question TEXT,
  created_at            TEXT NOT NULL
);
```

Exactly one row per `/chat` request. Tie-breaker invocations do **not** create extra rows (they're internal to a single turn). Indexes on `session_id` and `request_id`.

### SSE `meta` event (backward-compatible additions)

The `meta` event keeps every Phase 2.x field and adds a `routeDecision` block:

```json
{
  "agentSlug": "...", "routeConfident": ..., "routeScore": ..., "routeHits": [...],
  "provider": "claude" | "mock" | "nexus", "degraded": ..., "candidate": "...",
  "budget": { "messages_kept": ..., "messages_trimmed": ..., "protected_chars": ... },
  "routeDecision": {
    "type":   "specialist" | "clarify" | "out_of_domain" | "nexus_fallback",
    "source": "keyword" | "override_rule" | "llm_tiebreaker" | "clarification" | "out_of_domain" | "fallback",
    "confidence": "high" | "medium" | "low",
    "rationale": "...",
    "appliedRules": [...],
    "shortlist": [{ "slug", "score", "hits" }, ...]
  }
}
```

Existing UI consumers ignore unknown fields; nothing in the prior `meta` shape was removed or renamed.

## Retry policy (Phase 2.6)

`ClaudeProvider.call()` is wrapped in a one-shot retry: if the underlying CLI call yielded **no** text and produced a transient-looking error, we wait 600 ms and run it once more. Auth failures (`Not logged in`, `authentication_failed`), missing binary (`ENOENT`), our own timeouts (`hard turn timeout`, `no assistant text within`), and validation errors are **never** retried. Transient signals that *are* retried include `EPIPE`, `ECONNRESET`, `ETIMEDOUT`, `killed`, signal terminations, `rate_limit_event`/"rate limit", "overloaded", `503`, and generic non-zero CLI exits without an auth/timeout marker. Retries are logged through Fastify's pino logger (`phase: "claude-cli-retry"`); no conversation content is ever logged.

### Context budgeting (Phase 2.6)

Before assembling the prompt, `chat.ts` budgets the session transcript:

- **Never trimmed:** `orchestrator/creativedge_context.md`, routed agent (or Nexus) `system_prompt.md`, runtime `core_memory.md`, the current user message.
- **Trimmed first:** the oldest end of the session transcript.
- Defaults: `maxContextChars=120000`, `reservedResponseChars=12000`, `recentMessageLimit=20`. Override per provider in `~/.creativedge/providers.json` under `providers.claude.*`. Fresh `~/.creativedge` is seeded with all three values so they're discoverable. Existing files without these fields use the code defaults.
- Trim activity is logged (`phase: "chat-budget"`) and surfaced in the SSE `meta` event under `budget: { messages_kept, messages_trimmed, protected_chars }`. Character counts are an approximation — token-exact counting is a later refinement.

### Usage / cost metadata (Phase 2.6)

`agent_events.usage_json` carries a compact JSON snapshot of every turn's cost / token telemetry. The column is added on boot via an idempotent migration (`PRAGMA table_info` first, then `ALTER TABLE ADD COLUMN` only if missing). The CLI parser pulls fields from the `result` event:

```json
{
  "provider": "claude",
  "is_error": false,
  "duration_ms": 14694,
  "duration_api_ms": 8127,
  "num_turns": 1,
  "total_cost_usd": 0.0042,
  "session_id": "...",
  "stop_reason": "end_turn",
  "service_tier": "standard",
  "input_tokens": 1820,
  "output_tokens": 312,
  "cache_creation_input_tokens": 0,
  "cache_read_input_tokens": 0,
  "modelUsage": { "claude-sonnet-4-6": { ... } }
}
```

MockProvider rows get `{"provider":"mock"}` so the column is never silently null for normal turns. Full prompts and conversation content are NOT stored in `usage_json`.

### Timeouts

Two timers govern each `/chat` turn:

| Knob | Default | What it does |
|---|---|---|
| `firstChunkTimeoutMs` | **60 s** | Time the CLI has to produce its first assistant-text chunk. Includes process startup, model TTFT, and Claude Code internal hooks. |
| `turnTimeoutMs` | **120 s** | Hard cap on the whole turn. If exceeded, the child is killed and an error chunk is emitted. |

Both are configurable in `~/.creativedge/providers.json` (no `.env`, no flags):

```json
{
  "providers": {
    "claude": {
      "enabled": true,
      "authMode": "claude-code-runtime",
      "firstChunkTimeoutMs": 60000,
      "turnTimeoutMs": 120000
    }
  }
}
```

When the first-text timer fires, the chat layer transparently falls back to MockProvider and `meta` carries `claudeError: "claude CLI produced no assistant text within 60000ms (the model may need more time; raise providers.claude.firstChunkTimeoutMs in ~/.creativedge/providers.json)"`. The hard-turn timer emits a similar error pointing at `turnTimeoutMs`.

Stderr tail (last 1 KB) is included in error text on non-zero exit. The values you set in `providers.json` are read once at boot.

### Fallback in `/chat`

`chat.ts` selects a candidate provider (`claude` if `installed === true`, else `mock`) and **buffers the first ProviderChunk before emitting any SSE**. If the first chunk is an `error` (auth failure, spawn ENOENT, first-chunk timeout, non-zero exit), the chat layer transparently swaps in MockProvider for the rest of the turn and marks `degraded: true` + `claudeError: "<message>"` in the `meta` event. Otherwise, real Claude tokens stream through.

This means consumers see one of three outcomes:

| meta `provider` | meta `degraded` | meta `claudeError` | What happened |
|---|---|---|---|
| `claude` | `false` | absent | Real Claude streaming worked |
| `mock` | `true` | present | Claude was tried but errored; mock served the response |
| `mock` | `true` | absent | Claude binary not installed; mock served directly |

The SSE event shape (`meta` → `chunk*` → `done`) is unchanged from Phase 2.2.

### Test hooks (off by default)

| Env | Behavior |
|---|---|
| `CREATIVEDGE_FORCE_CLAUDE_RUNTIME=absent` | Skip the spawn; report `installed: false` |
| `CREATIVEDGE_FORCE_CLAUDE_RUNTIME=present` | Skip the spawn; report `installed: true, authStatus: unknown` |

## Validate

```powershell
cd backend-api
npm install
npm run build
npm run dev
```

Then from another terminal:

```powershell
curl.exe http://127.0.0.1:3001/healthz
curl.exe http://127.0.0.1:3001/agents
curl.exe http://127.0.0.1:3001/agents/programming-tech
curl.exe http://127.0.0.1:3001/agents/programming-tech/memory

curl.exe -X POST http://127.0.0.1:3001/agents/programming-tech/memory/episodic `
  -H "Content-Type: application/json" `
  -d "{\"entry\":\"Phase 2.2 validation append test\"}"

curl.exe -X POST http://127.0.0.1:3001/agents/programming-tech/memory/promote `
  -H "Content-Type: application/json" `
  -d "{\"entry\":\"Phase 2.2 validation promotion test\",\"confirmed\":true}"

curl.exe http://127.0.0.1:3001/sessions

# SSE chat — pass -N to disable curl buffering
curl.exe -N -X POST http://127.0.0.1:3001/chat `
  -H "Content-Type: application/json" `
  -d "{\"message\":\"I need help designing a logo for a calm finance app\"}"
```

Tail today's log:

```powershell
Get-Content C:\Users\<you>\.creativedge\logs\creativedge-2026-05-15.log -Tail 50
```

## CORS

Locked to localhost (`localhost`, `127.0.0.1`, `[::1]`) and no-Origin requests (curl, server-to-server). Wildcard `*` is never returned. Verified: a foreign `Origin` header gets no `Access-Control-Allow-Origin` and the request is rejected before reaching handlers.

## Logging

Structured JSONL to `~/.creativedge/logs/creativedge-YYYY-MM-DD.log`.

Every line carries `time`, `level`, `service`, `reqId`, request/response metadata, and `responseTime`. For `/chat` we also log `agentSlug`, `provider`, `fallback_used`, `latencyMs`, `status` (these are recorded in the `agent_events` table; the request log line itself avoids full conversation content).

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Run `src/index.ts` with tsx in watch mode |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm start` | Run compiled `dist/index.js` |
| `npm run clean` | Remove `dist/` |

## Environment variables (all optional)

| Var | Default | Purpose |
|---|---|---|
| `CREATIVEDGE_PORT` | `3001` | HTTP port |
| `CREATIVEDGE_HOST` | `127.0.0.1` | Bind address |
| `CREATIVEDGE_RUNTIME_DIR` | `~/.creativedge` | Override runtime dir (testing) |
| `CREATIVEDGE_PROJECT_ROOT` | auto-detected | Override project tree location |
| `CREATIVEDGE_FORCE_CLAUDE_RUNTIME` | unset | `absent` or `present` to stub the local runtime probe |
| `LOG_LEVEL` | `info` | pino level |

## Not in this slice

- LLM-based Nexus routing (Phase 3)
- OpenAI / Ollama providers
- Electron wrapper
- Multi-user auth
- Cloud hosting

See `../todo.md` for the full phase plan.
