# CreativEdge — User Guide

> **Phase 10-C expanded 2026-05-22.** This guide documents the
> current desktop app as it exists after Phase 9 closure
> (Deployment & operations, ✅ Windows validated 2026-05-22). If
> you find anything in here that disagrees with what the app
> actually does, the canonical phase state in
> [`../todo.md`](../todo.md) wins and this guide needs an update.

CreativEdge is a **local-first multi-agent chatbot** that runs as
a desktop app on Windows. One chat surface, 14 voices. An
orchestrator (**🌐 Nexus**) reads each of your messages, picks
the right specialist (or, for cross-domain requests, convenes
2–3 specialists and synthesises a single reply), and answers in
that specialist's voice.

This guide is for **users** of the desktop app — both new users
who want to open it and chat, and power users who want to
understand the Setup wizard, Ops console, backup UX, crash
reports, budget trends, and the manual update flow.

If you want to build the app yourself, see
[`developer-setup.md`](developer-setup.md). If something breaks,
see [`troubleshooting.md`](troubleshooting.md). For the
documentation map see [`README.md`](README.md). For the project
entry-point see the [top-level `README.md`](../README.md).

---

## 1. What CreativEdge is

- **Local-first.** All persistent data lives under
  `~/.creativedge/` on your machine (Windows:
  `C:\Users\<you>\.creativedge\`). The app does not send your
  chat, memory, or session history to any external service.
- **One chat surface, 14 voices.** Type one message. Nexus
  routes it. The reply comes back labelled with the speaking
  specialist's emoji + name. For multi-domain questions, Nexus
  convenes 2–3 specialists and synthesises a single reply with
  attribution.
- **Desktop app via Electron.** Hardened renderer
  (sandboxed; no node integration in the renderer; only safe
  IPC for runtime config and allow-listed external links).
  Dynamic free-port allocation — the app picks loopback ports
  at startup; no fixed-port collision risk inside Electron.
- **Provider-pluggable.** The default LLM runtime is the local
  Claude Code CLI when it's installed and authenticated, with a
  built-in **mock provider** as fallback. The mock keeps the
  app usable for trying the UI even when Claude isn't
  available.

For the design intent (turn shape, MBTI assignments, memory
model, hand-off semantics) see
[`../architecture.md`](../architecture.md). For the
agent-roleplay spec (when an LLM plays the 14 roles inside
chat) see [`../INSTRUCTIONS.md`](../INSTRUCTIONS.md).

---

## 2. First launch and the Setup wizard (🧭 Setup)

The first time you open CreativEdge, the **Setup wizard**
auto-opens. Auto-open also triggers any time the backend
reports `setupRequired: true` (e.g. on a fresh user profile).
After you click **Finish**, a single non-sensitive boolean
flag is stored in the renderer's `localStorage`
(`creativedge.firstRun.dismissed`) so subsequent launches skip
the auto-open. **No credentials, no remote URLs, no secrets
ever touch `localStorage`** — only that one boolean flag.

You can re-open the wizard at any time by clicking **🧭 Setup**
in the top chrome of the chat UI.

The wizard has four steps:

### 2.1 Runtime
- **Runtime directory** — where your data lives
  (`C:\Users\<you>\.creativedge`).
- **Storage ready** — `yes` once the directory tree exists.
- **Database ready** — `yes` once the SQLite + FTS5 store is
  initialised.
- **Seeded agents** — should read **14** (1 orchestrator + 13
  specialists).
- **Backend target** — the address the renderer is talking to.
  In dev that's `http://127.0.0.1:3001`; inside the Electron
  app it's the dynamic backend URL allocated at startup.

### 2.2 Claude Code
- **Installed** — `yes` if the Claude Code CLI is on your
  `PATH`.
- **Auth status** — usually `unknown` (the app deliberately
  doesn't probe the CLI's authentication; that's the CLI's
  concern, not the app's).
- **Setup hint** — friendly instructions to install or
  authenticate the CLI when it's missing.
- **Mock fallback available** — `yes`. Chat remains functional
  even without Claude; the mock provider produces placeholder
  responses so you can still drive the UI end-to-end.

The wizard's **Re-check** button refreshes this card against
`GET /healthz`.

### 2.3 Backup (optional)
The opt-in backup of your `~/.creativedge/agents/` directory
into a local git mirror, with an optional remote push.
- **Enabled** — `no` by default. Backup is OFF until you
  explicitly turn it on.
- **Git on PATH** — `yes` if `git` is installed.
- **Repo initialised** — whether the local git mirror exists
  yet. It's created lazily on first dry-run.
- **Remote configured** — `no` unless you set one.
- **Repo dir** —
  `C:\Users\<you>\.creativedge\backups\agents-git`.
- **Next action** — friendly hint (`install-git` / `configure`
  / `dry-run` / `configure-remote` / `run`).

The wizard never asks for credentials. If you configure a
remote, the actual auth uses your local Git setup (HTTPS
credential helper or SSH agent). The full backup user flow is
in [§9](#9-backup-guide-for-users) below.

### 2.4 Done
A short confirmation page. **Finish** closes the wizard and
sets the dismissed flag. **Skip for now** closes the wizard
without setting the flag, so it'll auto-open again on next
launch.

---

## 3. Chat basics

### 3.1 Sending a message
- Type into the composer at the bottom of the window.
- Press **Enter** to send.
- **Shift + Enter** inserts a newline without sending — useful
  for multi-paragraph prompts.

### 3.2 What a reply looks like
Every reply begins with a one-line header identifying the
speaking specialist:

```
🎨 Lumi — Graphics & Design

…the reply text in Lumi's voice…
```

For multi-specialist convening, the synthesised reply names
the contributors at the top and attributes paragraphs back to
each specialist where it matters.

### 3.3 Message bubbles
- User messages and assistant messages each render as
  bubbles in the chat thread.
- **Copy buttons** appear on every bubble — click to copy the
  bubble's text to your clipboard.
- Markdown rendering: code blocks get syntax highlighting and
  their own per-block copy button (via `MarkdownMessage` +
  `CodeBlock`); tables, lists, blockquotes, and inline code
  render natively.

### 3.4 Session sidebar
A list of your recent sessions sits in the left rail (mobile:
a slide-in drawer). Click a session to load its transcript
back into the chat area. Sessions are listed
most-recently-updated-first.

### 3.5 Full-text search
The Search panel runs an FTS5-backed full-text search across
all your local sessions. Click any result to jump to that
session. The search runs entirely locally; no query leaves
your machine.

### 3.6 Chat recovery (what you might notice)
Occasionally a backend reply will successfully reach the
database but the renderer's fetch promise rejects before the
response framing completes — a known Chromium-on-Electron
edge case with hijacked SSE streams. When this happens, the
UI auto-recovers without you doing anything:

- A brief "Could not reach backend at …" banner may appear.
- Within ~2.5 seconds, the UI silently fetches the persisted
  transcript and replaces the optimistic state. The banner
  clears.
- You do **not** need to press Ctrl+R, switch sessions, or
  resend.

A persistent red banner that does NOT clear after a few
seconds means the backend genuinely is unreachable —
[`troubleshooting.md §2`](troubleshooting.md#2-backend-healthz-fails)
covers that case.

### 3.7 The error banner — plain English
- **"Backend is not reachable at …"** — the backend isn't
  running, or the renderer is pointing at the wrong URL. In
  the desktop app this should heal itself; if it doesn't, see
  troubleshooting.
- **"Backend is responding but doesn't have /healthz"** — you
  have a stale backend process from an earlier project
  version. Stop it and restart.

---

## 4. Agents and Nexus routing

CreativEdge ships with **14 agents**: one orchestrator (🌐
Nexus) and 13 specialists. The full roster is in the
[top-level README](../README.md). For the design intent see
[`../architecture.md`](../architecture.md).

### 4.1 How Nexus routes
You don't see Nexus's routing decision directly. Nexus reads
each turn's intent and either:

1. **Routes to ONE specialist** when the answer fits one
   domain.
2. **Asks ONE clarifying question** when two specialists are
   equally plausible AND the answer would meaningfully differ
   between them.
3. **Convenes 2–3 specialists** for genuinely cross-domain
   questions and synthesises a single labelled reply.
4. **Hands off** when one specialist hits the edge of its
   lane. The reply ends with a one-line "→ want me to bring
   in 🧭 Atlas for the consulting side?" offer; click the
   inline hand-off card to accept.

### 4.2 Forcing a specific specialist
Two ways:

- **`@<alias>` shorthand inside `/remember`**: e.g.
  `/remember @bit always prefer Go over Python in my repo`.
- **`/agent <slug> <message>`**: e.g.
  `/agent programming-tech help me with TypeScript generics`.
  This is a routing hint, not a forced route — Nexus may
  still convene a co-specialist if the message clearly
  spans domains.

### 4.3 Agent aliases
The `@` shorthand resolves these 14 aliases (case-insensitive):

```
@nexus  @bit    @lumi   @sage   @vera   @cash   @lex
@reel   @buzz   @echo   @bloom  @atlas  @quant  @iris
```

You can also use the full slug (`@programming-tech`,
`@graphics-design`, etc) if you prefer the verbose form.

### 4.4 Slash commands
All slash commands are gated behind an explicit
**confirmation modal** for anything destructive. The modal
shows what will happen, defaults focus to **Cancel**,
dismisses on **Esc**, and never auto-confirms on **Enter**.

| Command | What it does |
|---|---|
| `/agent <slug> <message>` | Routing hint — addresses a specific specialist |
| `/remember <text>` | Promote a fact into the active agent's core memory (modal-confirmed) |
| `/remember @<alias> <text>` | Same, but targets the named agent |
| `/forget core <text>` | Surgically delete a fact from core memory (modal-confirmed) |
| `/forget episodic <text>` | Surgically delete a per-session note (modal-confirmed) |
| `/compact status` | Show episodic-compaction status for the active agent |
| `/compact preview` | Preview what compaction would summarise (read-only) |
| `/backup status` | Show backup readiness (read-only) |

Slash-command push / write operations (e.g. `/backup run`,
`/backup push`) are **deliberately not exposed** — they live
behind the explicit-confirmation Backup panel and modal in
the chat UI and Ops console, not behind one-line slash
commands.

### 4.5 What you cannot edit from the chat UI
You **cannot** edit Nexus's routing rules from the chat UI
directly. Routing rules live in
`orchestrator/routing_rules.md` and are repo-level
configuration. To change them, see
[`add-an-agent.md`](add-an-agent.md) §5 (routing keywords)
and the developer setup guide.

---

## 5. Sessions and memory

### 5.1 Sessions
- Every conversation is a **session**, identified internally
  by a UUID.
- All sessions and their messages live in
  `~/.creativedge/sessions.db` (SQLite + FTS5).
- Nothing about your sessions leaves your machine
  automatically. Ever.

### 5.2 Core memory vs episodic memory
Each agent has two memory files under
`~/.creativedge/agents/<slug>/memory/`:

- **`core_memory.md`** — durable facts. Always prepended to
  the agent's context on invoke. This is where
  "I prefer X over Y" or "my repo is in Go" lives.
- **`episodic_memory.md`** — append-only per-session notes.
  Older entries are summarised into the durable core memory
  on demand via the compaction flow.

### 5.3 Memory-worthy facts require confirmation
After a turn finishes, the app may detect that you said
something memory-worthy ("I'm building a Phase 10 docs
slice"). When it does, a **memory candidate card** appears
inline at the bottom of the assistant reply. Nothing is
written to disk until you click **Promote** on that card.
You can also click **Dismiss** to ignore it.

The Phase 5.2-A sensitive-guard refuses to promote candidate
facts that match credit-card or SSN-style patterns — they
never reach the on-disk core memory file even if you click
Promote.

### 5.4 The `/remember` shortcut
If you want to promote a fact directly without waiting for
the inline card, use `/remember`:

```
/remember always prefer TypeScript strict mode in this repo
/remember @atlas the client deadline is end of quarter
```

A confirmation modal opens; the target agent is editable
(defaults to the active agent or Nexus). Clicking **Confirm**
writes the fact to that agent's `core_memory.md`.

### 5.5 What NOT to put in memory
- API keys, tokens, passwords, secrets of any kind.
- Real user PII you would not want surfaced in a future
  prompt extraction.
- Long pasted documents — `core_memory.md` is read on every
  invoke; bloating it slows every turn.

The Phase 5.4-A `/forget` flow lets you surgically delete
specific facts later if you change your mind.

### 5.6 Privacy boundaries on memory
- **No chat content** is ever included in a crash report.
  See [§10](#10-crash-reports-and-privacy).
- **No memory content** is ever included in a crash report.
- **No automatic external sending** — nothing your agents
  remember leaves the machine unless you explicitly opt in
  to the git backup push.
- **No telemetry** of memory contents or usage exists.

---

## 6. Admin / customization surface (⚙ Admin)

Click **⚙ Admin** in the top chrome to open the admin
console. The admin console is for **inspecting and tuning
the 14 agents**. It is read-only by default; mutations
require an explicit confirmation flow.

### 6.1 What you can see
- **Agent list** — all 14 agents as cards, with the current
  effective configuration.
- **Agent detail** — selected agent's full snapshot
  (identity, soul, personality, system prompt, config,
  current overrides if any).
- **Routing playground** — paste a test prompt and see how
  Nexus would route it (uses the same `/chat` pipeline as
  real chat with `sessionId: null`).
- **Memory editor** — view + safely edit the agent's
  `core_memory.md` with a live match count + context-window
  diff + explicit confirmation.

### 6.2 What you can change safely
Through the **Agent editor** (Phase 7-B):

- Tagline, voice fingerprint, color, values, strengths,
  watch-outs.

These six fields are an explicit allow-list — the backend
refuses any other field. The editor opens a diff-preview
modal before saving; the modal has a required "I've reviewed
these changes" checkbox, defaults focus to **Cancel**,
dismisses on **Esc**, and never auto-confirms on **Enter**.
Overrides are written to
`~/.creativedge/overrides/<slug>.json` — the source agent
files under `agents/<slug>/` are **never** mutated.

To roll back an override: re-open the editor, blank the
field, save. Or delete the override JSON file.

### 6.3 Memory editor (Phase 7-C)
Click an agent → **Memory** → view the agent's
`core_memory.md`. The find/replace pane shows a **live match
count** before any write. **Replace** opens a context-window
diff modal that:

- Shows the matched context before / after.
- Requires explicit confirmation.
- Defaults focus to Cancel; Esc dismisses; Enter doesn't
  auto-confirm.

On confirm, the change is written via the Phase 5.2-D
`safeReplaceOnce` helper:
- Single-match safety (refuses ambiguous replacements).
- Sensitive-content guard.
- Atomic write (no partial mutations on disk).

### 6.4 What's deferred to the developer docs
- Adding a brand-new specialist (folder + registry + routing
  wiring + tests) — see [`add-an-agent.md`](add-an-agent.md).
- Repo-level customization (editing `system_prompt.md`
  directly, changing the MBTI assignment) — see
  [`customize-an-agent.md`](customize-an-agent.md).
- Per-§7-D in the canonical roadmap, the admin console has
  **no auth gating** today. This is an intentional non-goal
  for the local-only threat model.

---

## 7. The Ops console (📊 Ops)

Click **📊 Ops** in the top chrome to open the operations
console. Seven cards in the modal:

### 7.1 Diagnostics
- **Service** — `creativedge-backend`.
- **Runtime directory** — `C:\Users\<you>\.creativedge`.
- **Provider readiness** — primary provider, Claude installed
  + auth status, mock availability.
- **Backup state** — readiness summary (the same fields the
  wizard's backup step shows).
- **App version** and (when it differs) **backend version**.
- **Latest crash log path** if any crash has been recorded.

Click **Refresh** in the top-right to re-fetch.

### 7.2 Usage & cost
Aggregates from the local SQLite `agent_events.usage_json`
column:

- **Totals** — tokens + cost USD across all sessions.
- **Last 24h** and **Last 7d** breakdowns.
- **By provider** and **by agent slug** breakdowns.

The numbers are estimates derived from whatever usage
metadata the underlying provider returns. If a provider
doesn't return usage_json (the mock provider doesn't), the
numbers will be lower than your actual usage. Empty database
shows zeros cleanly — no error.

### 7.3 Budget & trends (Phase 9-D-C1)
Local-only cost budgeting:

- **Today (UTC)** and **Month-to-date (UTC)** totals.
- **Daily budget** and **Monthly budget** — your locally
  configured USD thresholds.
- **Daily state** and **Monthly state** badges:
  - `OK` — under 80% of budget.
  - `Near budget` — ≥80% and <100%.
  - `Over budget` — ≥100%.
  - `Unavailable` — no budget configured or no data yet.
- **Inline SVG bar chart** of the last 30 daily costs.
  Today's bar is highlighted blue (`#3b82f6`); prior days
  are grey (`#64748b`); a dashed budget-threshold line is
  drawn when a daily budget is set.

Click **Configure local budget** to set or change thresholds.
**Reset budget** clears them. Thresholds are stored as two
plain USD floats in `localStorage` (`creativedge.budget.daily`
and `creativedge.budget.monthly`) — **the only two writes
this card makes to browser storage**. No secrets, no chat
content, no telemetry. No external cost-data fetch.

### 7.4 Local logs
File metadata only — name, size, mtime, path. The card
never reads log file contents into the UI. The Electron
backend log is the file pino writes to during a session
(`electron-backend-<ts>.log`); the crash record is the
structured JSON file (`crash-<ts>.log`).

### 7.5 Crash reports (Phase 9-D-C2)
Local-only crash record management:

- **Newest-first list** of `~/.creativedge/logs/crash-*.log`
  records. Filename + size + mtime + path metadata only.
- **Empty state**: *"No crash reports found — that's a good
  thing. Nothing is sent automatically anyway."*

Click **Prepare report** on a row to open the inline review
panel. The panel:

- Shows a prominent **privacy notice**.
- Lists dropped fields under `droppedFields[]` (the free-text
  `backendLogTail` field is dropped from every prepared
  report pending a future tested-redaction sanitizer).
- Lists `validationWarnings[]` if any.
- Renders the allow-listed structured-only JSON in a
  scrollable `<pre>` block.

Three actions on the review panel:

- **Copy report JSON** — copies to clipboard via
  `navigator.clipboard.writeText`.
- **Download report JSON** — saves the JSON as a file using
  Blob + `URL.createObjectURL`.
- **Close review** — closes the panel.

**There is no Send / Upload / Email / GitHub-issue button
anywhere on this card.** Sharing a crash report — if you
ever choose to — is something you do yourself, by copying or
downloading the JSON and posting it manually to wherever you
want to share it.

### 7.6 Backup (Phase 9-D-B3 mirror)
The same opt-in backup UX as the chat-side Backup panel
(§9), mounted inside the Ops console so operators have a
single pane. Same explicit second-confirmation modal; same
four readiness blockers; same redacted-remote display.

### 7.7 Update info
- **App version** — the version of the running app.
- **Backend version** — shown only when it differs from the
  app version (usually they match).
- **Releases page** —
  `https://github.com/CreativEdgeSolutions/Nexus/releases`.
- **Auto-update** — always `deferred` in this build (see
  [§11](#11-updates-and-releases) for why).
- **Check latest release** — a click-triggered one-shot
  unauthenticated call to the GitHub public REST API. Shows
  a small badge: `Up to date`, `Release available`, or
  `Unable to compare`. Per-state friendly hints render below
  the badge.
- **Open releases page ↗** — opens the GitHub Releases page
  in your OS default browser via the safe preload bridge.
  Allow-list-filtered in both the renderer and the main
  process.

What the **Check latest release** button does and does NOT do:

| Behaviour | Status |
|---|---|
| Calls GitHub public REST API on click | yes |
| Runs in the background or on a timer | **no** |
| Sends an auth token / installation ID | **no** |
| Downloads the new installer | **no** |
| Runs the new installer | **no** |
| Writes anything to `~/.creativedge/` | **no** |

---

## 8. Backup guide for users

CreativEdge can back up your `~/.creativedge/agents/`
directory to a private git mirror with an optional push to a
private GitHub repository you own.

### 8.1 What backup does
- Creates a local git repository at
  `C:\Users\<you>\.creativedge\backups\agents-git\`.
- Copies eligible files from `~/.creativedge/agents/`
  (per-agent memory + identity / soul / personality /
  system_prompt / config) into the mirror.
- Commits with a fixed message: `backup: update CreativEdge
  agent memory`.
- (Only if you explicitly opt in to push) pushes to your
  configured remote.

### 8.2 What backup does NOT do
- **Does not push anything by default.** Push requires
  explicit opt-in plus an explicit second-confirmation
  click.
- **Does not store credentials** — auth uses your local Git
  setup (HTTPS credential helper or SSH agent). CreativEdge
  never asks for, transmits, or stores your password,
  token, or SSH key.
- **Does not run on a schedule.** No background backup. No
  auto-push at app boot, chat completion, or shutdown.
- **Does not include `sessions.db`** by default (toggle in
  the config form).

### 8.3 Configure a remote (optional)
1. Open the **Backup panel** in the chat UI (or the
   **Backup card** in the Ops console).
2. Enter your private repo's HTTPS or SSH URL:
   - `https://github.com/<you>/<your-private-repo>` or
   - `https://github.com/<you>/<your-private-repo>.git` or
   - `git@github.com:<you>/<your-private-repo>.git`
3. Click **Save**. The URL is validated server-side and
   stored in `~/.creativedge/backup.json`.
4. Once saved, the URL is displayed as a **redacted**
   string everywhere it appears in the UI — credentials
   embedded in HTTPS URLs are server-side-redacted before
   any UI surface sees them.

### 8.4 Dry-run
Click **Run dry-run** to see what would be committed without
actually committing anything. The card shows:

- `filesConsidered` — total files in scope.
- `filesCopied` — files that would be copied.
- `filesSkippedCount` — files filtered out.
- `statusSummary` — a git-status-like summary.
- `changed` — `yes` / `no`.

Dry-runs are completely safe; nothing is written to git, no
push happens.

### 8.5 Run backup (no push)
Click **Run (no push)** to actually commit to the local
git mirror. Result:

- `committed=<hash> and pushed.` — when the explicit push
  path was used (see §8.6).
- `committed=<hash> (no push).` — when you chose not to push
  or no remote is configured.
- `nothing changed; nothing to push.` — when the mirror is
  already up to date.

This path **never pushes to your remote** even if a remote
is configured. It's the right choice when you want a local
snapshot in version control without involving GitHub.

### 8.6 Run backup + push (explicit second confirmation)
Click **Run backup + push** to commit + push to your
configured remote. The four ordered readiness blockers must
all be green or the button is disabled with a friendly
explainer:

1. **`gitReady`** — is `git` on `PATH`?
2. **`enabled`** — have you turned backup on?
3. **`repoReady`** — does the local `.git/` exist? (Created
   lazily on first dry-run.)
4. **`remoteConfigured`** — does the local repo have an
   `origin` remote?

When all four are green, clicking the button opens the
**second-confirmation modal**. The modal:

- Shows the redacted remote URL.
- Has a required checkbox: *"I understand this will push to
  my configured remote."*
- Defaults focus to **Cancel**.
- Dismisses on **Esc**.
- Does NOT auto-confirm on **Enter**.
- Keeps **Confirm** disabled until the checkbox is ticked.

On confirm, the commit + push happens. Push failures
(missing credentials, remote unreachable, etc.) show a
friendly `pushReason` string — already free of secrets per
the server-side `redactRemote()` contract.

### 8.7 What the redacted remote looks like
The URL you saved is server-redacted before reaching the UI.
You'll see things like:

```
https://github.com/<you>/<repo>.git
```

with no embedded credentials. If you put credentials in the
URL when you saved it, the server strips them on every read
— but please don't put credentials in the URL. Use your
local Git credential helper or SSH agent instead.

---

## 9. Backup quick reference

| I want to … | Do this |
|---|---|
| Configure backup | Setup wizard → Backup step, or chat → Backup panel |
| See what would be committed | Click **Run dry-run** |
| Commit locally (no push) | Click **Run (no push)** |
| Commit + push to my private remote | Click **Run backup + push** → tick checkbox → Confirm |
| See current backup status | `/backup status` slash command, or the Backup panel |
| Roll back a remote URL | Re-open the Backup config form and re-save with a new URL |
| Stop using backup entirely | Re-open the config form and uncheck **Enabled** |

Same controls are mirrored in the Ops console's Backup card
for operator convenience.

---

## 10. Crash reports and privacy

CreativEdge keeps **local-only structured crash records** for
the rare case when the backend child process exits
unexpectedly. The intent is to give you and any helper you
choose to consult enough context to debug — without ever
sending anything anywhere automatically.

### 10.1 Where they live
- Disk path:
  `C:\Users\<you>\.creativedge\logs\crash-<timestamp>.log`.
- Inspectable via: the **Ops console → Crash reports** card
  (newest-first list).

### 10.2 Prepare a crash report
On any row, click **Prepare report**. The inline review
panel shows the **allow-listed structured fields only** — a
strict 17-field set covering:

- `kind`, `schemaVersion`, `timestamp`.
- `appVersion`, `electronVersion`, `nodeVersion`.
- `packaged`, `platform`, `arch`, `osRelease`.
- `backendEntry`, `frontendDist`, `backendLogPath`.
- `backendPort`, `frontendPort`, `backendChildPid`.
- `exit` (code, signal, expected).

What is **explicitly dropped** from the prepared report:

- The free-text `backendLogTail` field. The on-disk file
  keeps it for your inspection; the prepared report drops
  it because it's free text and free text needs a tested
  redaction sanitizer (not yet implemented). The
  `droppedFields[]` array tells you exactly what was
  dropped.

What is **NEVER** in the report under any circumstances:

- Chat content / message bodies.
- Memory contents.
- Prompts.
- Environment variables.
- API keys, auth tokens, cookies.
- `localStorage` contents.
- SSH keys, Git credentials.
- Random files from your home directory.
- Database rows.

### 10.3 Copy or download
- **Copy report JSON** — `navigator.clipboard.writeText`.
- **Download report JSON** — saves as a file using
  Blob + `URL.createObjectURL`.
- **Close review** — closes the panel; nothing happens
  silently in the background.

### 10.4 Manually share, only if you choose
If you want to share a crash report (with a maintainer, with
a friend who's helping you debug, anywhere), you copy or
download the JSON yourself and decide where it goes.
**CreativEdge does not have a Send button.** There is no
auto-upload. No email. No GitHub-issue creation. No
telemetry. No background polling.

This is the same posture the runbook and the Ops console
card describe verbatim — they all agree by design.

---

## 11. Updates and releases

The app currently ships **unsigned manual NSIS installers**.
There is **no auto-updater**, **no background update
check**, and **no telemetry** of any kind.

### 11.1 Manual release check
Ops console → **Update info** card → **Check latest
release**. The button calls GitHub's public REST API once,
on click. The card shows `Up to date`, `Release available`,
or `Unable to compare`.

### 11.2 Open the releases page
**Open releases page ↗** in the same card opens
`https://github.com/CreativEdgeSolutions/Nexus/releases` in your
OS default browser via the safe preload bridge. The URL is
allow-listed in both the renderer and the main process;
any other URL would be rejected.

### 11.3 What is NOT implemented
| Behaviour | Status |
|---|---|
| `electron-updater` dependency | **not installed** |
| Automatic update / auto-download / silent install | **not implemented** |
| Code-signing of the Windows installer | **not implemented** |
| GitHub Actions release workflow | **not implemented** |
| Background polling for new releases | **not implemented** |

### 11.4 SmartScreen on the first run
Because the installer is unsigned, Windows SmartScreen will
warn *"Windows protected your PC"* the first time you run
it. This is expected. Click **More info → Run anyway** if
you trust the source. Your existing data in
`~/.creativedge/` is preserved across installs (sessions,
memory, backup repo, logs).

### 11.5 Why auto-update is deferred
Auto-update on Windows is only safe when the installer is
**code-signed**. Without signing, an attacker who controls
the release feed (or a MITM on the download) could deliver
arbitrary code that the updater would run with your
privileges. Wiring `electron-updater` without a signing
certificate would be a security regression. Auto-update is
gated on a future signing-certificate decision.

For release operations (how to publish a new release, how
to test packaged builds, the full Electron operational
reference) see
[`electron-release-runbook.md`](electron-release-runbook.md).

---

## 12. Runtime data and privacy

All persistent CreativEdge data lives under `~/.creativedge/`
on Windows that's `C:\Users\<you>\.creativedge\`.

### 12.1 What's stored conceptually
| Path | What |
|---|---|
| `~/.creativedge/sessions.db` | Chat sessions + messages + FTS5 |
| `~/.creativedge/agents/<slug>/memory/` | Per-agent core + episodic memory |
| `~/.creativedge/overrides/<slug>.json` | Admin-console runtime overrides |
| `~/.creativedge/backup.json` | Backup configuration (no secrets) |
| `~/.creativedge/providers.json` | Provider configuration (no secrets) |
| `~/.creativedge/backups/agents-git/` | Local git mirror (if backup is enabled) |
| `~/.creativedge/logs/electron-backend-<ts>.log` | Backend stdout/stderr |
| `~/.creativedge/logs/crash-<ts>.log` | Structured crash records (allow-listed fields only) |

The renderer additionally writes **two** non-sensitive
values to browser `localStorage`:

- `creativedge.firstRun.dismissed` — boolean; whether you've
  clicked Finish on the Setup wizard.
- `creativedge.budget.daily` and
  `creativedge.budget.monthly` — USD numeric thresholds for
  the Budget & trends card.

**That is the complete list of `localStorage` writes.** No
chat content, no memory content, no remote URLs, no
credentials, no API keys, no cookies, no session tokens.

### 12.2 Privacy posture (verbatim from the Phase 9 closure)
- ✅ Local-only by default.
- ✅ No telemetry.
- ✅ No automatic external send / upload / email / GitHub-issue
  creation.
- ✅ No background polling.
- ✅ All servers (backend + Electron static server) bound to
  `127.0.0.1` only — never a LAN-routable interface.
- ✅ Crash reports remain local-only with explicit
  Prepare / Copy / Download UX.
- ✅ Backup push is opt-in with explicit second-confirmation
  modal. Uses your local Git credential setup; no
  CreativEdge-managed credentials.
- ✅ External release link is HTTPS-only and allow-listed in
  both renderer and main process (today: GitHub releases
  page only).

The complete docs-index inventory of these guarantees lives
in [`docs/README.md`](README.md) → "I am an AI / coding
agent continuing this project" → "Standing privacy/security
contracts."

---

## 13. Common beginner workflows

### 13.1 "I want to ask a design / tech / marketing question."
Just type the question and press Enter. Nexus reads the
intent and routes — you don't need to pick a specialist
upfront. Examples:

- *"Help me pick a colour palette for a finance app."* → Lumi (🎨)
- *"How do I structure a React component for a chat
  composer?"* → Bit (💻)
- *"What's a good cold-email subject line for B2B
  outreach?"* → Buzz (📈)

### 13.2 "I want Nexus to pick the right specialist."
That's the default. Don't use any prefix. Type the question
in plain English (or Portuguese, Spanish, etc — every
specialist is multilingual).

### 13.3 "I want to force a specific agent."
Use `/agent <slug> <message>` or the `@<alias>` shorthand
inside `/remember`:

```
/agent programming-tech help me debug a TS generic
/remember @atlas the client deadline is end of quarter
```

### 13.4 "I want to reopen the Setup wizard."
Click **🧭 Setup** in the top chrome of the chat UI.

### 13.5 "I want to check app health."
Click **📊 Ops** → **Diagnostics** card. Look at:
- `service` — should be `creativedge-backend`.
- Provider readiness — primary provider + Claude + mock.
- Backup state — readiness summary.

If anything looks wrong, see
[`troubleshooting.md`](troubleshooting.md).

### 13.6 "I want to configure local budget alerts."
1. **📊 Ops** → scroll to **Budget & trends** card.
2. Click **Configure local budget**.
3. Enter a daily USD threshold and / or a monthly USD
   threshold.
4. Click **Save**. The badges and chart re-render
   immediately.

To clear thresholds, click **Reset budget**.

### 13.7 "I want to prepare a crash report."
1. **📊 Ops** → **Crash reports** card.
2. On the row you care about, click **Prepare report**.
3. Read the review panel (privacy notice + dropped fields +
   the JSON).
4. Click **Copy report JSON** or **Download report JSON**.
5. **Click Close review when you're done.** Nothing happens
   silently in the background.

### 13.8 "I want to run a local backup."
1. **🧭 Setup** → **Backup** step (first time only) →
   **Save** to turn on.
2. **📊 Ops** → **Backup** card, or chat → **Backup** panel.
3. Click **Run dry-run** to preview.
4. Click **Run (no push)** to commit locally without pushing.
5. To push: click **Run backup + push** → tick the explicit
   checkbox → Confirm.

### 13.9 "I want to check for a new release."
1. **📊 Ops** → **Update info** card.
2. Click **Check latest release**. See the badge and the
   per-state friendly hint.
3. (Optional) Click **Open releases page ↗** to open
   GitHub Releases in your OS browser.
4. Download the new installer manually; run it; SmartScreen
   will warn (unsigned). Your data is preserved across
   installs.

---

## 14. If something goes wrong

This guide doesn't duplicate the troubleshooting recipes.
Open [`troubleshooting.md`](troubleshooting.md) and look up
the matching symptom:

| Symptom | Recipe |
|---|---|
| App does not open | [§1](troubleshooting.md#1-app-does-not-open) |
| Backend `/healthz` fails | [§2](troubleshooting.md#2-backend-healthz-fails) |
| Dynamic ports and how to read them from logs | [§3](troubleshooting.md#3-port-conflicts-and-stale-processes) |
| Stale node / electron / bun processes | [§3](troubleshooting.md#3-port-conflicts-and-stale-processes) |
| **winCodeSign** symbolic link permission error (packaging only) | [§4](troubleshooting.md#4-wincodesign-symbolic-link-permission-error) |
| **better-sqlite3** `NODE_MODULE_VERSION` ABI crash (packaged only) | [§5](troubleshooting.md#5-better-sqlite3-node_module_version-crash) |
| Releases external link doesn't open | [§6](troubleshooting.md#6-release-link-does-not-open) |
| Crash reports empty | [§7](troubleshooting.md#7-crash-reports-are-empty) |
| Backup push button disabled / explainer | [§8](troubleshooting.md#8-backup-push-disabled-states) |
| Claude Code CLI missing or auth unknown | [§9](troubleshooting.md#9-claude-code-cli-missing-or-auth-unknown) |
| OneDrive / cloud-sync interference | [§10](troubleshooting.md#10-onedrive--cloud-sync-caveats) |

The Electron operational runbook
[`electron-release-runbook.md`](electron-release-runbook.md)
has the full §9 troubleshooting catalogue for advanced
users + maintainers.

---

## 15. Glossary

**App** — the CreativEdge desktop application (Electron),
which spawns the backend as a child process and serves the
frontend bundle from a local HTTP server.

**Backend** — the Fastify HTTP service that runs as a child
process of the Electron app (or as a standalone dev server
during `npm run dev:backend`). Owns the SQLite database, the
agent files, and the memory subsystem.

**Backup dry-run** — a preview of what a backup commit would
include, without actually committing or pushing. Always
safe.

**Core memory** — the durable per-agent memory file
(`core_memory.md`). Always prepended to an agent's context
when it's invoked. Edit via the admin memory editor or
`/remember`.

**Crash report** — a structured JSON record written to
`~/.creativedge/logs/crash-<ts>.log` when the backend exits
unexpectedly. Allow-listed fields only; never chat content
or secrets. Prepare / copy / download from the Ops console;
**never sent automatically**.

**Dynamic ports** — Electron picks free loopback TCP ports
at startup (one for the backend, one for the static server)
rather than relying on fixed ports. You can read the actual
chosen ports from the Electron stdout log on every boot.

**Episodic memory** — append-only per-session notes for an
agent (`episodic_memory.md`). Older entries can be
compacted into the durable core memory via the compaction
flow.

**Hand-off** — when one specialist defers to another at the
edge of its lane and ends its reply with a short "→ want me
to bring in 🧭 Atlas?" offer.

**Local-first** — the app runs entirely on your machine.
No cloud service is required to use it. The only network
calls are user-triggered: opt-in backup push to YOUR private
GitHub repo, and the click-triggered **Check latest
release** call to GitHub's public REST API.

**Mock provider** — built-in fallback LLM provider that
returns placeholder responses when the real Claude Code CLI
isn't installed or authenticated. Keeps the UI usable
end-to-end without a real LLM.

**Nexus (🌐)** — the orchestrator. Routes each turn to the
right specialist, asks clarifying questions, convenes
multi-specialist replies, and handles hand-offs.

**Ops console (📊)** — the read-only-by-default operations
modal: Diagnostics, Usage & cost, Budget & trends, Local
logs, Crash reports, Backup, Update info.

**Session** — a single conversation thread. Has a UUID,
lives in `~/.creativedge/sessions.db`, appears in the
sessions sidebar.

**Specialist** — one of the 13 non-Nexus agents (Lumi, Bit,
Buzz, Reel, Lex, Echo, Vera, Cash, Sage, Bloom, Atlas,
Quant, Iris). Each has a distinct voice, MBTI type, and
domain.

---

## 16. Where to go next

- Build the app yourself:
  [`developer-setup.md`](developer-setup.md).
- Customise or add an agent:
  [`add-an-agent.md`](add-an-agent.md) +
  [`customize-an-agent.md`](customize-an-agent.md).
- Troubleshoot a real problem:
  [`troubleshooting.md`](troubleshooting.md).
- Full Electron operational reference:
  [`electron-release-runbook.md`](electron-release-runbook.md).
- Documentation index:
  [`README.md`](README.md).
- Top-level project entry-point:
  [top-level `README.md`](../README.md).
- Canonical phase roadmap:
  [`../todo.md`](../todo.md).
