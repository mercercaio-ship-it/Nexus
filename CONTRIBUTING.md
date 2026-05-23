# Contributing to CreativEdge

Thanks for taking an interest in **CreativEdge** — a local-first
multi-agent desktop chatbot for Windows. This file is the practical
contributor handbook.

For high-level orientation, start with the
[`README.md`](README.md) and the
[documentation map](docs/README.md).

---

## Project overview

CreativEdge is a Windows desktop app built on Electron, with a local
Fastify backend, a Vite + React + TypeScript frontend, and an
orchestrator (**🌐 Nexus**) plus **13 specialist agents** — each
with a distinct voice, MBTI-shaped personality, routing keywords,
and per-agent memory.

All persistent data lives under `~/.creativedge/` on the local
machine. No telemetry. No automatic external send. The backend
binds to `127.0.0.1` only.

---

## Current status

- **Phase 9 — Deployment & operations** — ✅ Complete /
  Windows validated 2026-05-22.
- **Phase 10 — Documentation** — ✅ Complete / docs QA validated
  2026-05-22.
- All canonical phases (0 through 10) are ✅ Complete.

See [`todo.md`](todo.md) for the canonical phase roadmap and the
per-slice evidence trails.

---

## Windows-first reality

Live validation happens on a Windows host. The packaged-app target
is Windows x64 NSIS only today. macOS / Linux desktop binaries are
explicit non-goals (see `README.md` → Deferred / non-goals).

Most code and most unit tests run cross-platform, but the
canonical packaged-build acceptance evidence in
[`todo.md`](todo.md) is recorded against Windows live walkthroughs.

---

## Setup

```powershell
git clone https://github.com/CreativEdgeSolutions/Nexus.git
cd CreativEdge

npm run setup           # backend + frontend deps + post-install help
npm run setup:electron  # Electron dev dependencies (only for desktop)
```

`npm run setup` does **not** write anything under `~/.creativedge/`;
the backend's first launch creates that tree on demand.

Full prerequisite + setup walkthrough:
[`docs/developer-setup.md`](docs/developer-setup.md).

---

## Run

```powershell
# Desktop app (recommended; dynamic ports, hardened renderer)
npm run dev:electron

# Or browser dev (two terminals)
npm run dev:backend
npm run dev:frontend
```

---

## Build

```powershell
# Backend tsc + frontend Vite build
npm run build

# Full Windows packaged build (NSIS installer + win-unpacked)
npm run build:electron
```

The packaged installer lands at
`electron/dist-electron/CreativEdge-Setup-0.1.0.exe`.
The unpacked binary lands at
`electron/dist-electron/win-unpacked/CreativEdge.exe`.

Both are **build outputs** — never commit them.

---

## Validation expectations

Every code change is expected to ship with the validation evidence
appropriate to its scope:

- **Docs-only slice:** no code commands required; verify links and
  scripts still match `package.json`.
- **Backend change:** `cd backend-api && npm run build` + the
  relevant `test:*` runner (e.g., `test:routing`, `test:memory`,
  `test:sqlite`, `test:backup`).
- **Frontend change:** `cd frontend && npm run typecheck` (build
  optional on non-Windows sandboxes due to the documented Rollup
  platform-binary caveat).
- **Electron-lifecycle change:** `node --check` on each touched
  `.mjs` / `.cjs` script + the packaged-build sanity walk per
  [`docs/release-readiness.md`](docs/release-readiness.md).

Full validation checklists by slice type:
[`docs/developer-setup.md`](docs/developer-setup.md) §10 +
[`docs/troubleshooting.md`](docs/troubleshooting.md) §26.

---

## Docs-only workflow

CreativEdge ships a lot of docs work in dedicated slices (Phase 10
sub-slices A–G are the precedent). For docs-only slices:

- Edit only the target Markdown files.
- Do not touch source code, `package.json` files, or generated
  artifacts.
- Still run the code-sanity commands above as a regression check —
  exit 0 across the board proves the slice did not touch code.
- Run the documented stale-phrase grep recipe from
  [`docs/developer-setup.md`](docs/developer-setup.md) §13.5 +
  [`docs/troubleshooting.md`](docs/troubleshooting.md) §25.13 before
  closing.

---

## Branch / commit hygiene

1. **Check `git status` first.** Always know what's in your working
   tree before staging anything.
2. **Stage explicitly.** Use `git add <path>` per file or per
   directory you intend to commit. **Never `git add .`** — that
   stages every untracked / modified file and tends to capture
   unintended files (local notes, generated artifacts, OS files).
3. **Do not stage generated artifacts.** `electron/dist-electron/`,
   `*/dist/`, `*/node_modules/`, `*.log`, `*.tsbuildinfo`, and
   `~/.creativedge/` data are all `.gitignore`d — verify with
   `git check-ignore -v <path>` if uncertain.
4. **Do not stage runtime data.** `~/.creativedge/` (sessions DB,
   per-agent memory runtime, overrides, backup mirror, logs) is
   user-local — never check it in.
5. **Pre-existing local-only modifications** to `Logo-Design.md`,
   `chat.md`, `electron/NOTES.md`, and other local-only docs are
   intentionally preserved across slices. Leave them alone unless
   the slice brief explicitly authorizes touching them.
6. **Do not push without review** when working with a maintainer
   or AI coding agent. Land commits locally, get review, then push.

---

## Commit message style

Use [Conventional Commits](https://www.conventionalcommits.org/)
prefixes. CreativEdge's git log already follows these conventions —
match the existing style:

- `feat:` — new feature shipped in code.
- `fix:` — bug fix.
- `docs:` — documentation-only changes (no code touched).
- `chore:` — repo housekeeping (deps bumps, metadata, configuration
  that isn't a feature).
- `refactor:` — code restructuring with no behavior change.

Scope tags are optional but encouraged for multi-package work:

```
feat(electron): add Phase 9-D-C3 dynamic free-port allocation
docs(troubleshooting): expand Phase 10-F troubleshooting guide
chore: refresh package.json descriptions post-Phase-10
```

Subject lines are ~72 characters max. The body, if present, should
explain the **why** — what the commit makes possible, what it
guards against, what evidence backs it.

---

## Pull request checklist

Opening a PR on GitHub auto-populates the body from
[`.github/pull_request_template.md`](.github/pull_request_template.md).
That template asks for the validation evidence + privacy/security
checklist + release impact for you — fill it in rather than
deleting sections. If you're opening a PR with another tool (a
local-only branch push, for example), copy the template body in
manually so reviewers see the same checks.

The condensed pre-open list:

- [ ] `git status -s` shows only the intended files.
- [ ] No `electron/dist-electron/`, `dist/`, `node_modules/`, or
      `.creativedge/` paths in the diff.
- [ ] Validation evidence in the PR description (which commands ran,
      which exit 0, which test runners passed).
- [ ] [`todo.md`](todo.md) updated with the relevant phase / slice
      entry (or explicit note if the work is outside the phase
      roadmap).
- [ ] No personal paths (`C:\Users\<you>\…`) in committed files.
- [ ] No API keys, tokens, or secrets in committed files.
- [ ] No chat content, runtime memory, or `~/.creativedge/` data in
      committed files.
- [ ] No new `electron-updater` / GitHub Actions release workflow /
      signing wiring unless an approved phase opens that work.

---

## Privacy / security rules (non-negotiable)

CreativEdge is local-first by design. These rules are inherited by
every PR unless an explicit phase relaxes them:

- ❌ No API keys, tokens, secrets, `.env` files committed.
- ❌ No runtime memory content (`~/.creativedge/agents/<slug>/memory/`)
  committed.
- ❌ No chat transcripts, prompts, or assistant responses committed
  to docs, logs, fixtures, or evidence files.
- ❌ No `~/.creativedge/` data committed.
- ❌ No `node_modules/` committed.
- ❌ No `electron/dist-electron/` (or any build output) committed.
- ❌ No secrets in commit messages, PR descriptions, or
  documentation.
- ❌ No `0.0.0.0` binding — the app is 127.0.0.1 only.
- ❌ No telemetry, no automatic external send, no background
  polling, no auto-update, no signing wiring without an approved
  phase.

If a PR needs to demonstrate behavior that involves secrets (e.g.,
backup push with credentials), redact before sharing — including in
screenshots and log excerpts.

---

## AI coding agent instructions

CreativEdge has been built largely through AI-assisted slices. When
delegating work to an AI coding agent (Claude or otherwise), use
this protocol:

1. **Plan first.** Every non-trivial slice opens with an explicit
   plan: scope, files touched, files NOT touched, validation
   commands, and acceptance criteria. Approve the plan before any
   file is edited.
2. **Strict scope.** Tell the agent what it must NOT touch — usually
   "no app behavior changes," "no `package.json` scripts changes,"
   "no `electron-updater` wiring," "no commit, no push." Re-state
   the standing don't-touch list (`Logo-Design.md`, `chat.md`,
   `electron/NOTES.md`, `docs/electron-release-runbook.md` unless
   explicitly authorized).
3. **Validation evidence.** Require the agent to run the
   appropriate validation commands and include the exit codes in
   the closing report.
4. **Do not invent features.** The agent must not add scripts,
   dependencies, routes, or UI cards that weren't in the brief.
5. **Do not commit or push** unless explicitly approved after the
   maintainer reviews the diff.
6. **Preserve historical evidence.** [`todo.md`](todo.md)'s closure
   footers are part of the canonical audit trail — do not delete
   or rewrite them.
7. **Use the canonical doc-set.** Re-read
   [`docs/developer-setup.md`](docs/developer-setup.md),
   [`docs/troubleshooting.md`](docs/troubleshooting.md), and
   [`todo.md`](todo.md) before claiming work is done.

A condensed version of this protocol lives at
[`docs/developer-setup.md`](docs/developer-setup.md) §16 ("Working
with AI coding agents").

---

## Where to find things

| Need | Go to |
|---|---|
| Run the app | [`README.md`](README.md) → Quick Start |
| Use the app | [`docs/user-guide.md`](docs/user-guide.md) |
| Develop the app | [`docs/developer-setup.md`](docs/developer-setup.md) |
| Add a new agent | [`docs/add-an-agent.md`](docs/add-an-agent.md) |
| Customize an agent | [`docs/customize-an-agent.md`](docs/customize-an-agent.md) |
| Troubleshoot | [`docs/troubleshooting.md`](docs/troubleshooting.md) |
| Package & release | [`docs/release-readiness.md`](docs/release-readiness.md) + [`docs/electron-release-runbook.md`](docs/electron-release-runbook.md) |
| Phase roadmap | [`todo.md`](todo.md) |
| Architecture | [`architecture.md`](architecture.md) |
| Agent roleplay spec | [`INSTRUCTIONS.md`](INSTRUCTIONS.md) |

---

## License

See [`LICENSE`](LICENSE).

---

## Questions

For project-level questions, open a GitHub issue against
<https://github.com/CreativEdgeSolutions/Nexus>. For security
vulnerabilities, follow [`SECURITY.md`](SECURITY.md).
