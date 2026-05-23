# CreativEdge — Add a New Agent

> **Phase 10-E expanded 2026-05-22.** Canonical guide for adding
> a new specialist to the existing 14-voice roster (1
> orchestrator + 13 specialists). If this guide and the source
> ever disagree, the source wins and this guide needs an update;
> the canonical phase state authority is [`../todo.md`](../todo.md).

This guide is for adding a **new specialist** to the roster.
For modifying an existing specialist (voice / values / routing /
memory), use [`customize-an-agent.md`](customize-an-agent.md)
instead.

---

## 1. When to add an agent vs customize an existing one

**Add a new agent when:**
- The domain is genuinely new and not covered by any of the 13
  existing specialists.
- The new agent will have its own MBTI fingerprint distinct
  from all 14 existing entities.
- Adding it improves routing clarity (existing agents are
  miss-routed because of a real domain gap).
- You're prepared to also update the registry, routing rules,
  frontend catalogue, and test fixtures.

**Customize an existing agent when:**
- The domain already fits a specialist; just the voice /
  tagline / values / routing keywords / memory need refinement.
- See [`customize-an-agent.md`](customize-an-agent.md).

**Do NOT add an agent for:**
- A temporary campaign or a one-off user.
- Private customer data (memory should never contain that
  anyway — see §9 below).
- A domain that mostly duplicates an existing specialist with
  slightly different vocabulary. Prefer routing-keyword
  refinement.

---

## 2. Current architecture overview

CreativEdge currently has **14 entities**: 1 orchestrator
(🌐 Nexus at `orchestrator/`) + 13 specialists (under
`agents/<slug>/`). Adding a 14th specialist brings the roster to
**15 total**.

The pieces involved when an agent exists:

```
orchestrator/registry.json     ← machine-readable roster (the source of truth)
orchestrator/routing_rules.md  ← human-readable routing logic + overlap rules
agents/<slug>/                 ← the specialist's source files (templates)
backend-api/src/agents/registry.ts  ← loads registry.json at runtime
backend-api/src/routing/*.ts        ← routing pipeline reads keywords + rules
backend-api/tests/*.json            ← 6 fixture files exercise routing + behavior
frontend/src/agents/agentCatalog.ts ← 14-entry catalog the UI + slash commands use
frontend/src/slash/slashCommands.ts ← parses @<alias> against the catalog
~/.creativedge/agents/<slug>/memory/   ← runtime user memory (NOT committed)
```

For the design intent (turn shape, MBTI rationale, memory model,
hand-off semantics) see [`../architecture.md`](../architecture.md).
For the agent-roleplay spec see
[`../INSTRUCTIONS.md`](../INSTRUCTIONS.md).

---

## 3. Naming and slug rules

Verified against the 13 existing specialist slugs in
`orchestrator/registry.json` and `frontend/src/agents/agentCatalog.ts`:

- **lowercase only.** No uppercase letters anywhere.
- **hyphen-separated.** Use `-` not `_` not spaces.
- **short but descriptive.** Current slugs are 4–20 characters
  (`data`, `business`, `programming-tech`, `writing-translation`).
  Optimise for clarity.
- **stable.** The slug is referenced by the registry path
  (`agents/<slug>/`), the runtime memory path
  (`~/.creativedge/agents/<slug>/memory/`), the runtime
  override path (`~/.creativedge/overrides/<slug>.json`), the
  test fixtures, and the frontend catalogue. **Never rename
  an existing slug** unless you're willing to migrate all of
  those, including user runtime data.
- **no spaces, no uppercase, no special characters.**
- **no personal names** — the project's "voice names" (Lumi,
  Bit, Buzz, Reel, Lex, Echo, Vera, Cash, Sage, Bloom, Atlas,
  Quant, Iris) are the agent **`name`** field, not the slug.
  Slugs describe the domain, not the persona.

If your new agent is e.g. an architecture specialist, a good
slug is `architecture` (or `architecture-design` if you want
the domain split made explicit). A bad slug is `arch`, `Arch`,
`MyArchitect`, or `architect-bot`.

---

## 4. Required files for a new specialist

Every existing specialist folder has exactly these files:

```
agents/<slug>/
├── identity.md          ← one-screen "who am I" card
├── soul.md              ← purpose, voice, values, strengths, watch-outs
├── personality.md       ← MBTI breakdown + why this type fits
├── system_prompt.md     ← runtime system prompt for this agent
├── config.json          ← structured metadata (single source of truth)
└── memory/
    ├── README.md            ← convention reminder
    ├── core_memory.md       ← durable template memory (starts empty/generic)
    └── episodic_memory.md   ← append-only template (starts empty)
```

### `identity.md`
One-screen "who am I" card. Read by humans only; not parsed.

Typical structure (≈15 lines):
- Title line with emoji + agent name + domain.
- Tagline.
- MBTI line.
- Brand color.
- Slug.
- One-sentence pointer to the other files (`soul.md` / `personality.md` / `system_prompt.md`).

**Do not include:** secrets, customer names, chat transcripts,
runtime data, private paths.

### `soul.md`
Purpose, voice fingerprint, values, strengths, watch-outs. Read
by humans and by the LLM when role-playing (the system prompt
references this material). Be specific — generic copy here
produces generic replies. Typical length ≈25–30 lines.

**Do not include:** secrets, customer data, prompt-injection
strings, instructions that would conflict with the
project-level privacy / security contracts in
[`README.md`](README.md).

### `personality.md`
MBTI breakdown for the chosen type and **why this type fits
the role**. Read by humans only. Typical length ≈15–20 lines.

### `system_prompt.md`
The runtime system prompt prepended to every turn when this
agent is routed to. Read by the LLM on every invoke. Typical
length ≈30–40 lines.

**Do include** (mirroring the existing specialists):
- Title line ("System prompt — `<emoji> <name>`").
- Identity (MBTI, tagline, brand color).
- Voice (one or two sentences).
- Operating rules (stay in character; answer in your domain;
  name the right sibling agent for out-of-lane requests;
  reference `memory/core_memory.md` for stable facts; never
  pretend to be Nexus or another agent).
- Strengths to lean into.
- Watch-outs to guard against.
- Values.

**Do NOT include:**
- Secrets, API keys, tokens, customer data.
- Runtime user paths (`C:\Users\<actual-user>\...`).
- Instructions that bypass the project's confirmation modals
  (memory promote / forget / replace; backup push; external
  link allow-list).
- Instructions to disclose private runtime memory.
- Instructions that conflict with the project-level privacy
  posture (no telemetry, no automatic external send, no LAN
  binding).

### `config.json`
Structured metadata. The single source of truth for any
programmatic surface; mirrored in the registry entry. Required
fields (verified verbatim against `agents/programming-tech/config.json`):

```json
{
  "slug": "<slug>",
  "name": "<Display Name>",
  "domain": "<One-line domain description>",
  "emoji": "<single emoji>",
  "color": "<#hex>",
  "tagline": "<one-line tagline>",
  "mbti": {
    "type": "<4-letter MBTI type>",
    "archetype": "<e.g. The Logician>",
    "temperament": "<Analyst | Diplomat | Sentinel | Explorer>",
    "axes": {
      "I": "<I trait description for this agent>",
      "N": "<N trait description for this agent>",
      "T": "<T trait description for this agent>",
      "P": "<P trait description for this agent>"
    }
  },
  "voice": "<one-line voice fingerprint>",
  "values": ["...", "...", "..."],
  "strengths": ["...", "...", "..."],
  "watch_outs": ["...", "..."],
  "files": {
    "identity": "identity.md",
    "soul": "soul.md",
    "personality": "personality.md",
    "system_prompt": "system_prompt.md",
    "memory_dir": "memory/"
  },
  "schema_version": 1,
  "created": "<YYYY-MM-DD>"
}
```

Mirror exactly what an existing specialist's `config.json` does;
don't invent new top-level fields without a phase-level
decision.

**Do not include in config.json:** secrets, API keys, runtime
URLs, customer data, telemetry endpoints.

### `memory/README.md`
Short convention reminder (≈8 lines). Existing specialists ship
a near-identical version; mirror it.

### `memory/core_memory.md`
Durable template memory file. **Start with an empty file** (or
a single comment line). Real durable facts get added at runtime
via the Phase 5.2-A `/promote` flow (memory-candidate card) or
the Phase 5.2-D `/memory/core` PATCH flow (admin memory editor)
— both go to `~/.creativedge/agents/<slug>/memory/core_memory.md`
on the user's machine, not to the committed template.

### `memory/episodic_memory.md`
Append-only template. **Always start empty.** The chat runtime
appends entries here when the user confirms a memory promotion
via the `/promote-episodic` flow.

---

## 5. The MBTI design tool

MBTI is used as a **voice-consistency design tool**, not a
psychological claim. The project intentionally assigns
**distinct MBTI types** to all 14 entities so each agent has a
recognizable voice fingerprint. Adding a 15th agent that
duplicates an existing type is acceptable only if the duplication
covers a domain the original doesn't and the two voices
demonstrably hold their distinction in `test:in-character`.

Currently used types (verified via registry):

| MBTI | Agent | Temperament |
|---|---|---|
| ESFJ | 🌐 Nexus | Sentinel |
| ISFP | 🎨 Lumi | Explorer |
| INTP | 💻 Bit | Analyst |
| ENTP | 📈 Buzz | Analyst |
| ENFP | 🎬 Reel | Diplomat |
| INFJ | ✍️ Lex | Diplomat |
| INFP | 🎵 Echo | Diplomat |
| ENTJ | 💼 Vera | Analyst |
| ISTJ | 💰 Cash | Sentinel |
| INTJ | 🤖 Sage | Analyst |
| ENFJ | 🌱 Bloom | Diplomat |
| ESTJ | 🧭 Atlas | Sentinel |
| ISTP | 📊 Quant | Explorer |
| ISFJ | 📸 Iris | Sentinel |

Three of the 16 MBTI types (ESFP, ESTP, INFP-duplicate) are
currently unused; new agents are encouraged (not required) to
pick one of them.

For the temperament-balance rationale see
[`../architecture.md`](../architecture.md) §"MBTI assignments".

**Avoid:**
- Shallow stereotypes ("INTPs only talk about logic").
- Personality misaligned with domain ("an ISFP doing
  tax-compliance forecasts").
- Voice that becomes interchangeable with another agent — the
  contamination test (`test:in-character`) is built to catch
  this.

---

## 6. Memory files for a new agent (templates vs runtime)

Two kinds of memory exist; only one lives in the repo.

| What | Where it lives | Committed? |
|---|---|---|
| Template memory (the empty seed files) | `agents/<slug>/memory/core_memory.md` + `episodic_memory.md` in the repo | **Yes**, committed (but should be empty or contain only generic, non-sensitive content) |
| Runtime memory (real per-user facts) | `~/.creativedge/agents/<slug>/memory/*` on each user's machine | **Never** committed |
| Runtime overrides (Phase 7-B) | `~/.creativedge/overrides/<slug>.json` | **Never** committed |

**Memory promotion at a high level:**
- User chats with the agent → the chat runtime detects "memory
  candidates" (Phase 4 detector) → an inline confirmation card
  appears → user clicks Promote → backend writes to runtime
  `core_memory.md` via Phase 5.2-A `safeAppendUnique` →
  sensitive-content guard refuses credit-card / SSN-like
  patterns → atomic write to disk.
- All of this happens against the **runtime** path. The
  committed template is read once on first launch and never
  written by the running app.

**Hard rules for seeded template memory:**
- Start empty or with one or two generic, non-secret bullets.
- No API keys, no tokens, no customer data, no chat
  transcripts, no real-user PII.
- No instructions that bypass confirmation modals.
- No instructions to disclose runtime memory.
- The Phase 5.2-A sensitive-guard only protects **runtime
  writes** — committed templates are pre-flight content; you
  are the only safety check there.

---

## 7. Registry update (`orchestrator/registry.json`)

The registry is the **machine-readable source of truth**. The
backend's `backend-api/src/agents/registry.ts` reads
`orchestrator/registry.json` at `<projectRoot>/orchestrator/registry.json`
on startup, so adding a registry entry is auto-picked-up — no
backend code change required.

Add a new entry to the `entries[]` array. Mirror the existing
specialist entries verbatim. Required fields verified against
the live registry at HEAD `57ec5c9`:

```json
{
  "slug": "<your-slug>",
  "name": "<Display Name>",
  "domain": "<Domain Title>",
  "emoji": "<single emoji>",
  "mbti": "<4-letter MBTI>",
  "color": "<#hex>",
  "role": "specialist",
  "path": "agents/<your-slug>/",
  "routing_keywords": [
    "...",
    "...",
    "..."
  ]
}
```

Also update the `count.specialists` integer at the top of the
file (e.g. 13 → 14). Don't change `schema_version`; do bump the
`generated` date.

### 7.1 Routing-keyword design

Verified verbatim from the existing registry — every specialist
has 7–10 keywords. Keyword design rules:

- **Domain-specific.** "logo" → Lumi. "code" → Bit. Generic
  words like "thing", "stuff", "help" don't route anywhere
  useful.
- **Avoid common words.** "design" is on Lumi's list, but
  "good" or "best" would catch everything.
- **Avoid substring traps.** "art" would match "start",
  "smart", "article", etc — that's a routing disaster. Prefer
  unambiguous tokens like "illustration" or "color palette".
- **Be multilingual when natural.** Existing keywords are
  English-only today, but multi-token entries like
  `"copywriting (ads)"` show the convention is "use whatever
  string makes the intent unambiguous." Add language variants
  only when the language genuinely matters for the domain.
- **Keep counts in the 7–10 range.** Too few misses real
  intent; too many degrades to "everything routes here".

After editing the registry, **run `npm run test:routing` from
`backend-api/`** to verify no existing routing fixture is
broken by your new keywords. Update fixtures if intentional
re-routing is expected.

---

## 8. Routing rules update (`orchestrator/routing_rules.md`)

The routing-rules markdown is the **human-readable companion**
to the registry: trigger-keywords table + overlap rules +
convening guidance + escalation.

When you add a new agent, update **all three**:

1. **Trigger-keywords table** — add a row mirroring the
   existing rows: `| <emoji> **<name>** | <domain> | <comma-separated keywords> |`.
2. **Overlap rules** — if your new agent's domain overlaps any
   existing specialist, add a one-line rule following the
   convention: `if <test for new agent> → <new agent emoji>. If <test for other> → <other emoji>.`
3. **Multi-agent convening** — update only if your new agent
   commonly co-convenes with existing specialists (e.g. "a
   brand launch = Lumi + Buzz + Lex" — would your new agent
   join one of these workflows?).
4. **Escalation** — usually unchanged.

Run `npm run test:routing` after editing.

---

## 9. Frontend catalogue and aliases

`frontend/src/agents/agentCatalog.ts` is a **hardcoded
14-entry array** today. Adding a new agent requires adding an
entry:

```typescript
export const AGENT_CATALOG: readonly AgentEntry[] = [
  { slug: "nexus",            name: "Nexus",  alias: "nexus" },
  { slug: "programming-tech", name: "Bit",    alias: "bit" },
  // ... existing 12 specialists ...
  { slug: "<your-slug>",      name: "<Name>", alias: "<short-alias>" },
];
```

`slug` must match the registry entry. `name` is the display
name. `alias` is the short `@<alias>` users type in
`/remember @<alias> <text>` or `/agent <slug> <message>`.

### 9.1 Alias design rules

- **Short and unambiguous.** Existing aliases are 3–5 letters
  (`bit`, `lumi`, `sage`, `bloom`, `quant`, `iris`).
- **One word, lowercase, no spaces.** The parser lowercases
  input before comparison.
- **No conflict with existing aliases or slugs.** The
  resolver tries alias first, then falls back to exact slug
  match — collisions silently shadow each other.
- **Memorable.** "atlas" is a much better alias than `csl` for
  the consulting agent.

`frontend/src/slash/slashCommands.ts` reads the catalogue via
`resolveAliasToSlug()`; no parser change is required when
adding entries — the import sees the new entry automatically.

After editing, run `cd frontend && npm run typecheck` to
confirm.

---

## 10. Backend impacts

CreativEdge's backend was deliberately designed so that adding
an agent **does not require backend code changes**:

- `backend-api/src/agents/registry.ts` reads
  `orchestrator/registry.json` at startup.
- `backend-api/src/routing/*.ts` consumes the
  `routing_keywords` arrays via the registry.
- `backend-api/src/routes/agents.ts` exposes the full registry
  via `GET /agents` (used by the admin console).
- `backend-api/src/routes/chat.ts` consults the routing
  pipeline; no agent-specific branches.

**What you DO need to update**: test fixtures (§11).

If you find yourself wanting to edit backend code to "support"
the new agent, stop and ask why. The convention is data-driven;
breaking it should be a separate decision.

---

## 11. Test fixtures required

Verified fixture files under `backend-api/tests/`:

| Fixture file | Used by | When to update |
|---|---|---|
| `routing-fixtures.json` | `npm run test:routing` | Always update when adding an agent (add 1–3 prompts that should route to your new agent; verify no existing fixture re-routes accidentally) |
| `agent-behavior-fixtures.json` | `npm run test:agents` | Always update (the convention is 5 prompts per agent — see existing entries for the shape; one-line "Tell me about <topic>" style) |
| `agent-contamination-fixtures.json` | `npm run test:in-character` | Update if your new agent has voice-overlap risk with an existing one; add a contamination pair like Lumi→Bit / Vera→Cash to verify your new agent doesn't leak the other's voice |
| `agent-core-memory-fixtures.json` | `npm run test:memory` | Update if your new agent will store any test memory facts |
| `agent-voice-hold-fixtures.json` | `npm run test:voice` | Update if the new agent has a strong voice fingerprint and you want regression coverage |
| `memory-candidate-fixtures.json` | `npm run test:memory-candidate` | Usually no update needed (these test the detector, not specific agents) |

Mirror the shape of existing entries. Don't invent new fixture
JSON schemas.

---

## 12. Validation checklist for adding an agent

Copy-paste-ready Windows / PowerShell:

```powershell
# 0. Status before changes
git status -s

# 1. Code sanity — these must pass with the new agent in place
cd backend-api
npm run build
cd ../frontend
npm run typecheck
cd ..

# 2. Routing — must pass with the new agent + existing fixtures
cd backend-api
npm run test:routing
# Expect: every existing fixture still routes correctly, plus
# any new fixtures you added.

# 3. Agent behavior — exercises the new agent's voice/domain
npm run test:agents
# Expect: 5 × (13+1) = 70 → 75 fixtures (or whatever your new
# agent count brings the total to) PASS.

# 4. In-character / contamination — voice fingerprint check
npm run test:in-character
# Expect: any contamination pair you added PASSes (your new
# agent does NOT leak Lumi's / Bit's / etc voice when given a
# Lumi / Bit / etc prompt).

# 5. Optional — memory + voice regressions
npm run test:memory
npm run test:voice

# 6. Electron-dev smoke (Windows host only)
cd ..
npm run dev:electron
# Expect: app opens; chat works; ⚙ Admin shows the new agent
# (14 → 15 cards); routing picks your new agent for domain
# prompts; `/agent <slug>` and `/remember @<alias>` both work.
```

### Manual checks
- The new agent appears in `⚙ Admin → <agent>` list.
- The new agent's emoji + name appear in the reply header when
  routed.
- Routing picks the new agent for at least one of its keywords
  in plain English.
- `/agent <slug> <message>` directly addresses the new agent.
- `/remember @<alias> <fact>` opens the confirm modal with the
  new agent pre-selected.
- No existing agent's tests regressed.
- No "duplicate slug" or "duplicate alias" warning fires
  (frontend typecheck should catch shape violations; runtime
  checks alias collisions silently — read the catalog
  carefully).

---

## 13. Common mistakes

- **Added the folder but not the registry.** Backend startup
  succeeds, but the new agent never appears in `/agents` and
  never gets routed.
- **Added the registry but not the frontend catalogue.** UI
  doesn't know the new alias / display name; `/agent <slug>`
  works via slug-fallback but `@<alias>` doesn't resolve.
- **Added everything but no tests.** Routing breaks silently
  (no fixture asserts routing for the new domain).
- **Overly broad routing keywords.** "thing", "help", "good"
  catch everything; existing fixtures start failing.
- **Conflicting alias.** Frontend catalog allows shadowing
  silently; one of the two `@<alias>` shorthands stops
  working.
- **Seeded private memory.** Committed real user secrets,
  customer names, API keys into `memory/core_memory.md`. Now
  the secret is in git history; remediation is painful.
- **Renamed an existing slug.** Memory files at runtime, test
  fixtures, admin overrides, and committed test fixtures all
  break.
- **Forgot the frontend catalog `name` field.** UI shows the
  raw slug instead of the friendly persona name.
- **Forgot to update docs.** `README.md` roster table and
  `architecture.md` MBTI table become stale.
- **Claimed the new agent exists before tests passed.** Don't
  put the new agent in user-facing docs (or a release) until
  `npm run test:routing` + `npm run test:agents` + `npm run
  test:in-character` are all green with the new agent in
  place.

---

## 14. Minimal PR checklist

Before you open a PR adding a new agent:

| Check | Status |
|---|---|
| `agents/<slug>/` exists with all 6 required files (identity / soul / personality / system_prompt / config / memory/{README,core,episodic}) | ☐ |
| `config.json` mirrors an existing specialist's shape verbatim (no new top-level fields) | ☐ |
| `orchestrator/registry.json` has the new entry + bumped `count.specialists` | ☐ |
| `orchestrator/routing_rules.md` has the new row + overlap rules + convening guidance updated as needed | ☐ |
| `frontend/src/agents/agentCatalog.ts` has the new entry (slug + name + alias) | ☐ |
| New routing fixtures added to `backend-api/tests/routing-fixtures.json` | ☐ |
| New behavior fixtures added to `backend-api/tests/agent-behavior-fixtures.json` (5 prompts per the existing convention) | ☐ |
| New contamination fixtures added if voice-overlap risk exists | ☐ |
| `cd backend-api && npm run build` exits 0 | ☐ |
| `cd frontend && npm run typecheck` exits 0 | ☐ |
| `npm run test:routing` passes with the new agent in place | ☐ |
| `npm run test:agents` passes with the new agent in place | ☐ |
| `npm run test:in-character` passes with the new agent in place | ☐ |
| `npm run dev:electron` smoke OK on Windows: app opens / chat works / admin shows the new agent / routing picks the new agent | ☐ |
| `README.md` roster table updated | ☐ |
| `architecture.md` MBTI table updated (if MBTI changed) | ☐ |
| `docs/user-guide.md` agent roster table updated | ☐ |
| `todo.md` reflects the new-agent change as a documented step | ☐ |
| No runtime data committed (no `~/.creativedge/...` files) | ☐ |
| No secrets / customer data / chat transcripts in committed memory files | ☐ |
| `git add` was used with explicit file paths (never `git add .`) | ☐ |

---

## 15. Where to go next

- **Customise an existing agent (voice / values / memory / routing keywords)**:
  [`customize-an-agent.md`](customize-an-agent.md).
- **Run / debug / package the app**:
  [`developer-setup.md`](developer-setup.md).
- **Use the app**:
  [`user-guide.md`](user-guide.md).
- **Design intent + memory model**:
  [`../architecture.md`](../architecture.md).
- **Agent-roleplay spec** (LLM-facing only):
  [`../INSTRUCTIONS.md`](../INSTRUCTIONS.md).
- **Canonical phase roadmap**:
  [`../todo.md`](../todo.md).
- **Documentation map**:
  [`README.md`](README.md).
