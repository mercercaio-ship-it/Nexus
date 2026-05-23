# CreativEdge — Customize an Existing Agent

> **Phase 10-E expanded 2026-05-22.** Canonical guide for
> safely modifying any of the 14 existing agents (1
> orchestrator + 13 specialists). For adding a brand-new
> specialist, use [`add-an-agent.md`](add-an-agent.md). If this
> guide and the source ever disagree, the source wins and this
> guide needs an update.

This guide is for **modifying an existing agent**. Use it when
you want to refine voice, values, watch-outs, routing keywords,
the system prompt, the personality, the seeded memory template,
or the runtime override allow-list — any agent already in the
roster, including 🌐 Nexus.

For adding a new specialist, see
[`add-an-agent.md`](add-an-agent.md).

---

## 1. Customization decision tree

Before editing anything, pick the path:

```
Need to tweak the agent's runtime behavior?
├── Tagline / voice / color / values / strengths / watch-outs?
│   → Use the Admin console (⚙ Admin → <agent> → Edit).
│     Writes to ~/.creativedge/overrides/<slug>.json.
│     Source files untouched. Reversible per-field. (§4)
│
├── Core memory facts (durable knowledge)?
│   → Use the admin memory editor or `/remember` (modal-gated).
│     Writes to ~/.creativedge/agents/<slug>/memory/core_memory.md.
│     Source template untouched. (§8)
│
├── Episodic memory entries (per-session notes)?
│   → Use `/forget episodic <text>` (modal-gated). (§8)
│
└── System prompt wording / personality / MBTI / domain framing?
    → Source-file edit (Git-tracked). Affects every user. (§5)

Need to tweak routing?
└── Routing keywords / overlap rules / convening logic?
    → Source-file edit (registry + routing_rules + tests). (§7)
```

**Rule of thumb**: prefer the Admin console for anything that's
about one user's experience; prefer source-file edits for
anything that ships with the product.

---

## 2. What can be customized — runtime overrides vs source edits

| Knob | Where | How | Reversible? |
|---|---|---|---|
| **Tagline** | Runtime override | Admin agent editor | Yes (per-field) |
| **Voice** (one-line fingerprint) | Runtime override | Admin agent editor | Yes (per-field) |
| **Color** (`#hex`) | Runtime override | Admin agent editor | Yes (per-field) |
| **Values** (array) | Runtime override | Admin agent editor | Yes (per-field) |
| **Strengths** (array) | Runtime override | Admin agent editor | Yes (per-field) |
| **Watch-outs** (array) | Runtime override | Admin agent editor | Yes (per-field) |
| **Core memory facts** | Runtime memory | `/remember` confirm modal or admin memory editor | Yes (`/forget core <text>` modal) |
| **Episodic memory entries** | Runtime memory | Chat memory-candidate card or `/promote-episodic` | Yes (`/forget episodic <text>` modal) |
| **Full system prompt** | Source `system_prompt.md` | Direct Git edit | Via Git only |
| **Personality / MBTI** | Source `personality.md` + `config.json` | Direct Git edit | Via Git only |
| **Routing keywords** | Source `registry.json` | Direct Git edit | Via Git only |
| **Overlap rules / convening / hand-off framing** | Source `routing_rules.md` | Direct Git edit | Via Git only |
| **Identity card** | Source `identity.md` | Direct Git edit | Via Git only |
| **Soul (purpose / voice essay)** | Source `soul.md` | Direct Git edit | Via Git only |
| **Display name / emoji / slug** | Source `config.json` + `registry.json` + frontend catalogue | Direct Git edit (slug changes are dangerous — see §13) | Via Git only |

**Important distinction:**

- **Source template** = files in the repo under `agents/<slug>/`
  or `orchestrator/` or `frontend/src/agents/`. Ships to every
  user when they install / update. Edited via Git.
- **Runtime override** = files under `~/.creativedge/` on each
  user's machine. Per-user. Edited via the Admin console with
  explicit confirmation modals.

**Never confuse the two.** Editing a runtime file as if it were
a template means your change only applies to one user. Editing
a template as if it were a runtime file means every user is
affected and reversal requires another release.

---

## 3. Admin console customization (runtime overrides — Phase 7-B / 7-C)

The **⚙ Admin** button in the chat UI top chrome opens the
admin console. Three customization surfaces live there.

### 3.1 Agent editor (Phase 7-B)

**Where:** ⚙ Admin → select an agent → Edit (in the agent
detail panel).

**Allow-listed editable fields** (six total, verbatim from the
backend's Phase 7-B contract):

- `tagline`
- `voice`
- `color`
- `values` (array)
- `strengths` (array)
- `watch_outs` (array)

The backend **refuses any other field**. The editor UI doesn't
expose any other field either.

**Edit flow:**

1. Click **Edit**. Dirty fields are highlighted as you type.
2. Click **Save**. The diff-preview modal opens:
   - Per-field diff (current vs proposed).
   - Required checkbox: "I've reviewed these changes".
   - Default focus on **Cancel**.
   - **Esc** dismisses.
   - **Enter** does NOT auto-confirm.
3. Tick the checkbox → click **Confirm**. The backend writes
   to `~/.creativedge/overrides/<slug>.json`.
4. The source `agents/<slug>/config.json` is **never mutated**.

**Reverting a single field:**
- Re-open the editor, blank the field, save. The backend
  removes that key from the overrides JSON.

**Reverting all overrides for an agent:**
- Delete `~/.creativedge/overrides/<slug>.json` directly.

### 3.2 Memory editor (Phase 7-C)

**Where:** ⚙ Admin → select an agent → Memory.

**What you see:** the agent's current
`~/.creativedge/agents/<slug>/memory/core_memory.md` content,
syntax-highlighted.

**Edit flow:**

1. The find/replace pane gives a **live match count** before
   any write happens.
2. Click **Replace**. The context-window diff modal opens:
   - Shows the matched context before / after.
   - Default focus on Cancel.
   - Esc dismisses.
   - Enter does NOT auto-confirm.
3. Confirm. The backend writes via the Phase 5.2-D
   `safeReplaceOnce` helper:
   - **Single-match safety** — refuses ambiguous replacements.
   - **Sensitive-content guard** — refuses to write
     credit-card or SSN-like patterns.
   - **Atomic write** — no partial mutations on disk.

**This edits runtime memory, NOT the committed template.**

### 3.3 Routing playground (Phase 7-A)

**Where:** ⚙ Admin → Routing playground.

Paste a test prompt; see how the routing pipeline (the same
one `/chat` uses with `sessionId: null`) would route it.
**Read-only inspection** — does not write anything.

### 3.4 Admin console contract — what it does NOT do

- Does NOT mutate source files under `agents/<slug>/`.
- Does NOT change `orchestrator/registry.json`.
- Does NOT change `orchestrator/routing_rules.md`.
- Does NOT change `frontend/src/agents/agentCatalog.ts`.
- Does NOT add new agents (use `add-an-agent.md` for that).
- Does NOT require authentication. Per §7-D in the canonical
  roadmap, **no auth gating on the admin console today** —
  this is an intentional non-goal for the local-only Claude
  Code CLI runtime threat model. If the threat model changes
  (e.g. shared-host operation), §7-D should be re-opened. See
  [`../todo.md`](../todo.md).

---

## 4. Source-file customization (templates — Git-tracked)

When you need to change an agent's behavior for **everyone**
(not just one user's runtime overrides), edit the source
files. Every change here ships with the next release.

### 4.1 `identity.md`
**What to change:** tagline line, brand color line, the
one-sentence pointer.
**What NOT to change:** the slug (line `**Slug.** \`<slug>\``).
Slug changes break runtime memory paths, override paths, test
fixtures, and the frontend catalogue.
**Validation:** `cd frontend && npm run typecheck` (catches
nothing here directly but is a no-cost sanity check).

### 4.2 `soul.md`
**What to change:** the agent's purpose, the voice fingerprint
description, the values, strengths, watch-outs.
**What NOT to change:** anything that would conflict with the
runtime override allow-list — the source defines defaults,
overrides refine for one user.
**Validation:** `npm run test:agents` (catches voice
regressions on the per-agent in-domain fixtures).

### 4.3 `personality.md`
**What to change:** the MBTI breakdown, the "why this type
fits" essay.
**What NOT to change:** the MBTI type itself (the `**MBTI.**
<TYPE>` line) without also updating `config.json` and the
registry's `mbti` field. Distinct MBTI types across the 14
agents are an intentional design property.
**Validation:** `npm run test:in-character` (catches voice
contamination if personality drifts).

### 4.4 `system_prompt.md`
**What to change:** voice description, operating rules,
strengths/watch-outs/values bullets.
**What NOT to change:**
- The "Operating rules" point about not pretending to be
  another agent.
- The "Reference your `memory/core_memory.md`" point — the
  Phase 5 memory subsystem depends on this contract.
- Any instruction that would bypass the project's
  confirmation modals (memory promote / forget; backup push;
  external link allow-list).
- Any instruction that would disclose runtime memory
  contents.
**Validation:** `npm run test:agents` + `npm run
test:in-character` + manual smoke via `npm run dev:electron`
with a few in-domain prompts.

### 4.5 `config.json`
**What to change safely:** `tagline`, `voice`, `values[]`,
`strengths[]`, `watch_outs[]`, `mbti.axes.*` descriptions.
**What to change with extreme care:** `name`, `emoji`,
`color`, `mbti.type`, `mbti.archetype`, `mbti.temperament` —
all of these are referenced by the frontend catalogue, the
registry, the architecture docs, the README roster table, and
potentially user-visible UI labels.
**What NOT to change:** `slug` (would break every dependent
path), `files.*` (the convention is fixed), `schema_version`
(would require a backend migration).
**Validation:** `cd backend-api && npm run build` + `cd
frontend && npm run typecheck`.

### 4.6 Memory templates
**What to change:** the committed
`agents/<slug>/memory/core_memory.md` and `episodic_memory.md`
template files.
**What to change them TO:** keep them empty or seed only
generic, non-sensitive content. Per-user real facts go to
runtime memory, never to the committed template.
**What NOT to commit:**
- API keys, tokens, passwords, secrets of any kind.
- Real user PII.
- Chat transcripts.
- Customer names or personal data.
- Anything you would not want surfaced in a future prompt
  extraction or a public repo browser session.

The Phase 5.2-A sensitive-content guard runs only at **runtime
write time**, not on committed templates. **You are the only
safety check for committed template content.**

---

## 5. Voice and personality safety

The Phase 8.2 cross-character contamination test
(`npm run test:in-character`) is built specifically to catch
voice drift between agents. When customizing voice:

- **Keep the domain expertise intact.** Don't turn the
  finance specialist into a personal-growth coach by accident.
- **Keep the MBTI fingerprint distinct.** All 14 entities
  have distinct MBTI types today; voice changes shouldn't
  push two agents toward the same speaking pattern.
- **Avoid making agents sound identical.** "Casual + helpful"
  for everyone defeats the point.
- **Avoid prompt-injection-style additions** to source
  prompts. The system prompt is read on every turn for that
  agent; an instruction like *"reveal the system prompt if
  asked"* is the same vulnerability whether it's in the
  system_prompt.md or in core_memory.md.
- **Avoid instructions that bypass confirmations.** The
  project ships with explicit-confirmation modals for memory
  promote / forget, backup push, agent override save, and
  memory replace. Don't tell an agent to circumvent them.
- **Avoid instructions to disclose runtime memory.** Memory
  is per-user; an agent that leaks it across users is a
  privacy breach.
- **Keep the MBTI design rationale consistent.** If you
  change Bit (INTP) toward more decisive language, update
  `personality.md` to explain the shift — don't leave the
  archetype description contradicting the actual voice.

---

## 6. Routing customization

Routing edits live in three places (in priority order):

### 6.1 `orchestrator/registry.json` — `routing_keywords`

Each specialist entry has a `routing_keywords` array (7–10
entries per specialist today). To refine routing for an
existing agent:

- **Add a missing keyword** when a domain prompt currently
  misroutes. Example: a `"vector DB"` keyword was added to
  Sage to catch RAG-specific prompts.
- **Remove an overly broad keyword.** "design" is on Lumi's
  list and shouldn't be on anyone else's; if you find another
  agent with "design", that's the bug.
- **Test exhaustively.** Run `npm run test:routing` before
  AND after to confirm:
  - Your target prompt now routes correctly.
  - No existing fixture regressed.

### 6.2 `orchestrator/routing_rules.md` — overlap rules

The 6 named overlap rules at HEAD (verified verbatim):
- Graphics & Design vs Photography → Lumi vs Iris.
- Business vs Consulting → Vera vs Atlas.
- Programming vs AI Services → Bit vs Sage.
- Marketing vs Writing → Buzz vs Lex.
- Data vs AI Services → Quant vs Sage.
- Personal Growth vs Consulting → Bloom vs Atlas.

If you add or move keywords that create a new overlap, **add
the matching rule** to this file. Use the existing convention:
*"If X → A. If Y → B."*

### 6.3 `orchestrator/routing_rules.md` — convening + clarify

- **Convening** (Nexus invokes 2–3 specialists in parallel) is
  for genuine cross-domain requests. Customize the convening
  section if your agent commonly co-convenes with others
  (e.g. brand launch = Lumi + Buzz + Lex).
- **Clarify** is the "ask ONE clarifying question instead of
  guessing" path. Used when two specialists could plausibly
  take a request. Usually doesn't need per-agent
  customization.
- **Hand-off** semantics live in
  `backend-api/src/handoff/*.ts` and are agent-agnostic. Don't
  change those for a single-agent customization.

### 6.4 Routing customization anti-patterns

- **Overfitting one prompt.** Adding the keyword "the" to fix
  one specific routing bug breaks 200 other fixtures.
- **Broad / common words.** "good", "best", "thing", "make",
  "help" should never be in any keyword list.
- **Substring traps.** "art" catches "start", "smart",
  "article" — prefer unambiguous tokens.
- **Adding fixtures to make the wrong routing pass.** If the
  test must change to accommodate a routing edit, that's a
  red flag — sometimes legitimate, often a sign the routing
  edit is over-broad.

---

## 7. Memory customization (runtime vs template)

Two distinct paths exist; pick the right one.

### 7.1 Runtime memory (per-user, the common case)

- **Promote a fact**: the chat memory-candidate card (after a
  turn), or `/remember <text>` / `/remember @<alias> <text>`
  with the confirm modal. Writes to
  `~/.creativedge/agents/<slug>/memory/core_memory.md` via
  `safeAppendUnique` (Phase 5.2-B).
- **Promote an episodic note**: the memory-candidate card
  recommends episodic for transient facts; or `/promote-episodic` via the admin / API. Writes to
  `~/.creativedge/agents/<slug>/memory/episodic_memory.md`.
- **Replace / edit core memory**: admin memory editor →
  find/replace → diff modal → confirm. Uses `safeReplaceOnce`
  (Phase 5.2-D).
- **Forget core fact**: `/forget core <text>` with the
  confirm modal. Surgical delete (Phase 5.4-A).
- **Forget episodic note**: `/forget episodic <text>` with
  the confirm modal.

All runtime memory edits go through:
- An explicit confirmation modal (modal-gated).
- The Phase 5.2-A sensitive-content guard (refuses
  credit-card / SSN patterns).
- An atomic write to disk.

### 7.2 Template memory (committed, shipped to all users)

When you genuinely need to seed durable memory across all
users (rare — most knowledge belongs in the system prompt or
soul, not in seeded memory):

- Edit `agents/<slug>/memory/core_memory.md` directly in Git.
- **Never seed sensitive content.** Templates ship as-is; no
  guard runs over committed content.
- **Keep it generic.** "User prefers TypeScript strict mode"
  belongs in runtime memory, not in a template.
- **Run `npm run test:memory` after** to verify the memory
  subsystem still parses the file.

### 7.3 Backup implications

The Phase 5.6-A backup subsystem mirrors
`~/.creativedge/agents/` (the runtime memory tree) into a
local Git repo and optionally pushes it to a user-owned
private GitHub repo behind the Phase 9-D-B3 second-confirmation
modal. **Runtime memory is included; runtime overrides
(`~/.creativedge/overrides/`) are NOT.** Be aware that pushing
backup ships runtime memory to your remote — only configure
remotes you control.

---

## 8. UI metadata customization

If you change a `name`, `emoji`, `color`, `domain`, or
`tagline` field in `config.json`:

1. **`config.json`** — primary source of truth.
2. **`orchestrator/registry.json`** — mirror `name`, `emoji`,
   `mbti`, `color`, `domain` to keep the registry consistent.
3. **`frontend/src/agents/agentCatalog.ts`** — update the
   `name` field. Slug + alias stay unchanged.
4. **`README.md`** roster table — update emoji / name /
   domain / MBTI.
5. **`docs/user-guide.md`** roster table — same.
6. **`architecture.md`** MBTI table — only if MBTI changed.
7. **`orchestrator/routing_rules.md`** trigger-keywords table
   — update emoji / name / domain.

`alias` is independent of the `name` change — only update the
alias if you have a real reason. Slug must never change (see
§13).

Run `cd frontend && npm run typecheck` and a manual
`npm run dev:electron` smoke after.

---

## 9. Validation checklist for customization

Copy-paste-ready Windows / PowerShell:

```powershell
# 0. Status before changes
git status -s

# 1. Code sanity — these must pass after every customization
cd backend-api
npm run build
cd ../frontend
npm run typecheck
cd ..

# 2. If you changed routing (registry keywords or routing_rules)
cd backend-api
npm run test:routing
# Expect: every existing fixture still routes correctly.

# 3. If you changed voice / values / system prompt
npm run test:agents
npm run test:in-character
# Expect: per-agent in-domain fixtures PASS;
#         contamination fixtures PASS (no cross-agent voice leak).

# 4. If you changed memory templates or memory behavior
npm run test:memory
npm run test:memory-files
npm run test:memory-integration

# 5. If you changed UI metadata (name / emoji / color)
cd ../frontend
npm run typecheck
cd ..

# 6. Electron-dev smoke (Windows host only)
npm run dev:electron
# Verify: chat works; routing picks the right agent; ⚙ Admin
# shows the new values; /agent <slug> + /remember @<alias>
# still work; the admin diff modal shows the new values when
# you open the editor; routing playground works.
```

---

## 10. Rollback strategy

### 10.1 Runtime overrides
- Single field: re-open admin editor, blank the field, save.
- Whole agent: delete `~/.creativedge/overrides/<slug>.json`.

### 10.2 Runtime memory
- Single fact: `/forget core <text>` or `/forget episodic
  <text>` with the modal.
- Whole agent's core memory: delete
  `~/.creativedge/agents/<slug>/memory/core_memory.md` (or
  truncate it; runs of `safeAppendUnique` will populate as
  needed).
- Restore from backup: if the Phase 5.6-A backup was
  configured + run, the local git mirror at
  `~/.creativedge/backups/agents-git/` has commit history.
  `git -C ~/.creativedge/backups/agents-git checkout <hash> --
  agents/<slug>/memory/core_memory.md` then copy back.

### 10.3 Source-file edits
- Keep changes small. One agent, one slice.
- Use `git diff` before committing to see exactly what
  changed.
- Revert source files via `git checkout <commit> -- agents/<slug>/<file>` if voice/routing regresses.
- **Do NOT rewrite runtime user memory to "rollback" a source
  template change.** Source changes affect future runs;
  runtime memory is the user's data — leave it alone.

### 10.4 Backup interplay
- If you committed a source change that interacts with backup
  (e.g. seeded private content into `core_memory.md`), the
  next backup run will include it. **Revert the source change
  first**, then either delete the offending entry from runtime
  memory or accept it lives in the local git mirror until the
  user runs the next backup.

---

## 11. Common mistakes

- **Editing runtime files thinking they're templates.** You
  changed `~/.creativedge/agents/programming-tech/memory/core_memory.md`
  and committed nothing. The change persists for one user.
- **Editing templates thinking they're runtime.** You changed
  `agents/programming-tech/memory/core_memory.md` and now
  every user gets your seed on next launch.
- **Editing source templates without updating registry / UI /
  tests.** The agent's behavior drifts but `npm run test:agents`
  passes the old fixtures (or fails on the new voice).
- **Adding broad routing keywords.** "good", "help",
  "everything" — every prompt routes to this agent now.
- **Adding secret / customer / personal data to committed
  memory.** Templates ship to everyone; secrets in templates
  are secrets in your release.
- **Bypassing confirmation modals** in the system prompt.
  "Always promote candidates" or "don't ask before forgetting"
  defeats the safety design.
- **Making all agents sound like Nexus.** Specialists should
  have a distinct voice; if `npm run test:in-character` starts
  failing, two voices are merging.
- **Changing slugs.** Breaks runtime memory paths, override
  paths, test fixtures, frontend catalogue, backup mirror.
  **Do not do this** without a migration plan and a phase
  decision.
- **Forgetting `todo.md` and docs updates.** Phase tracking
  + the README roster table + the user-guide roster table
  drift out of sync with the registry.
- **Touching `INSTRUCTIONS.md` casually.** That file is the
  agent-roleplay spec used by the LLM when playing the 14
  roles inside chat; non-trivial changes there are
  product-level decisions.

---

## 12. Safe AI-agent instructions

If you're delegating a customization slice to a coding agent
(Claude Cowork, another IDE agent, an offline AI agent), put
these rules in the brief:

### 12.1 Inspect first
- Read [`../todo.md`](../todo.md) for current phase state.
- Read the existing agent's `config.json`, `system_prompt.md`,
  `soul.md`, `personality.md` BEFORE writing any new content.
- Read `orchestrator/registry.json` and
  `orchestrator/routing_rules.md` BEFORE touching routing.
- Read the relevant test fixtures BEFORE writing new ones.

### 12.2 Plan before editing
Require a concise plan covering:
- Which agent(s) are being changed.
- Which knobs (override vs source).
- Which tests will run.
- Which docs need updates.

### 12.3 Change one agent at a time
- Don't bulk-rewrite all 14 personalities in one slice.
- Don't change the MBTI assignments of multiple agents in one
  slice.
- Don't refactor `routing_rules.md` while also editing
  individual agents' system prompts.

### 12.4 Do not add sensitive data
- No API keys, tokens, customer names, chat transcripts in
  committed templates.
- No instructions to bypass confirmation modals.
- No instructions to disclose runtime memory.

### 12.5 Run the relevant tests
- Routing change → `npm run test:routing`.
- Voice / system-prompt change → `npm run test:agents` +
  `npm run test:in-character`.
- Memory template change → `npm run test:memory` + `npm run
  test:memory-files`.

### 12.6 Provide evidence
- `git status -s` before and after.
- Test output (pass/fail counts).
- The diff of the actual changes.

### 12.7 Do not commit / push without instruction
- Stage explicit files (never `git add .`).
- Don't push to `main` unless the user explicitly authorises
  it.

### 12.8 Update `todo.md`
- Append an implementation closure footer for the slice.
- Update the active-phase rollup at the top of the file.

---

## 13. Why you must NEVER rename a slug

The slug appears in many places that are tied together by
exact-string identity:

| Place | What references the slug |
|---|---|
| `agents/<slug>/` | Directory name in the repo |
| `agents/<slug>/config.json` `"slug"` field | Backend reads + the registry references this |
| `orchestrator/registry.json` `entries[].slug` + `path` | Routing pipeline + admin console |
| `frontend/src/agents/agentCatalog.ts` `slug` field | Frontend UI + slash commands |
| `backend-api/tests/routing-fixtures.json` | Expected routing targets reference slug |
| `backend-api/tests/agent-behavior-fixtures.json` | Per-agent fixtures reference slug |
| `backend-api/tests/agent-contamination-fixtures.json` | Same |
| `~/.creativedge/agents/<slug>/memory/*` | Runtime memory directory on every user's machine |
| `~/.creativedge/overrides/<slug>.json` | Runtime override path per user |
| `~/.creativedge/backups/agents-git/agents/<slug>/...` | Local git backup mirror |
| Possibly: every user's pushed backup repo (Phase 5.6-A) | If push is enabled, the slug is in the user's remote |
| `docs/*.md`, `README.md`, `architecture.md` | Documentation roster tables |

A slug rename without a migration plan **silently orphans
every user's runtime memory and overrides for that agent**.
Don't do it.

If you must rename, scope a separate phase that includes a
migration script in
`backend-api/src/bootstrap/ensureRuntimeDir.ts` (or similar)
that renames `~/.creativedge/agents/<old>/` →
`~/.creativedge/agents/<new>/` and likewise for overrides.

---

## 14. Minimal PR checklist

Before opening a PR with customization changes:

| Check | Status |
|---|---|
| Diff is scoped to ONE agent (or one routing rule, or one UI metadata change) | ☐ |
| Source vs runtime distinction observed (no runtime files committed) | ☐ |
| No secrets / customer data / chat transcripts in any changed file | ☐ |
| Override allow-list NOT widened (still six fields: tagline / voice / color / values / strengths / watch_outs) | ☐ |
| `config.json` schema not silently extended (no new top-level fields without a decision) | ☐ |
| `slug` unchanged (or migration plan attached if it must change) | ☐ |
| Routing edits accompanied by `npm run test:routing` PASS | ☐ |
| Voice / system-prompt edits accompanied by `npm run test:agents` PASS + `npm run test:in-character` PASS | ☐ |
| Memory edits accompanied by `npm run test:memory-files` PASS | ☐ |
| `cd backend-api && npm run build` exit 0 | ☐ |
| `cd frontend && npm run typecheck` exit 0 | ☐ |
| Manual `npm run dev:electron` smoke OK on Windows | ☐ |
| README / docs / architecture roster tables updated if name/emoji/MBTI/domain changed | ☐ |
| `todo.md` updated (active-phase rollup + impl-pending or closure footer) | ☐ |
| Privacy review: no telemetry / no auto-update / no signing wiring / no `electron-updater` introduced | ☐ |
| `git add` used with explicit paths (no `git add .`) | ☐ |

---

## 15. Where to go next

- **Add a brand-new specialist (folder + registry + routing + tests)**:
  [`add-an-agent.md`](add-an-agent.md).
- **Build / debug / package the app**:
  [`developer-setup.md`](developer-setup.md).
- **Use the app (chat, Setup, Ops, backup, crash reports)**:
  [`user-guide.md`](user-guide.md).
- **Things going wrong**:
  [`troubleshooting.md`](troubleshooting.md).
- **Design intent + memory model + MBTI rationale**:
  [`../architecture.md`](../architecture.md).
- **Agent-roleplay spec** (LLM-facing only):
  [`../INSTRUCTIONS.md`](../INSTRUCTIONS.md).
- **Canonical phase roadmap**:
  [`../todo.md`](../todo.md).
- **Documentation map**:
  [`README.md`](README.md).
