---
name: Documentation issue
about: Something in the docs is wrong, missing, outdated, or unclear.
title: "[docs] <short summary>"
labels: ["documentation", "triage"]
assignees: []
---

<!--
Thanks for flagging a documentation issue. CreativEdge keeps a
deliberately large and authoritative docs set under docs/ plus
governance docs at the repo root; small inaccuracies tend to
compound, so this kind of report is genuinely useful.

Before filing: confirm the doc still has the problem on `main`
(commit shown by `git rev-parse HEAD`). Phase 10-G's QA pass
covered link integrity + script-command verification + roster
consistency as of 2026-05-22 — if your finding contradicts
that, please include the commit you're reading.
-->

## Document affected

Tick all that apply:

- [ ] [`README.md`](../../README.md)
- [ ] [`docs/README.md`](../../docs/README.md)
- [ ] [`docs/user-guide.md`](../../docs/user-guide.md)
- [ ] [`docs/developer-setup.md`](../../docs/developer-setup.md)
- [ ] [`docs/add-an-agent.md`](../../docs/add-an-agent.md)
- [ ] [`docs/customize-an-agent.md`](../../docs/customize-an-agent.md)
- [ ] [`docs/troubleshooting.md`](../../docs/troubleshooting.md)
- [ ] [`docs/electron-release-runbook.md`](../../docs/electron-release-runbook.md)
- [ ] [`docs/release-readiness.md`](../../docs/release-readiness.md)
- [ ] [`docs/release-notes/v0.1.0.md`](../../docs/release-notes/v0.1.0.md)
- [ ] [`CONTRIBUTING.md`](../../CONTRIBUTING.md)
- [ ] [`SECURITY.md`](../../SECURITY.md)
- [ ] [`CHANGELOG.md`](../../CHANGELOG.md)
- [ ] [`todo.md`](../../todo.md)
- [ ] [`INSTRUCTIONS.md`](../../INSTRUCTIONS.md)
- [ ] [`architecture.md`](../../architecture.md)
- [ ] [`electron/NOTES.md`](../../electron/NOTES.md)
- [ ] Other: <!-- path -->

## Section / heading

<!-- e.g. "docs/troubleshooting.md §7 winCodeSign permission error" -->

## What is wrong / missing

<!--
Be specific. Quote the offending sentence or command if helpful.
Distinguish between:

  - Factually wrong (claim does not match code or current behavior)
  - Outdated (was true at some earlier phase; not true now)
  - Missing (a topic that should be covered isn't)
  - Unclear (the topic is covered but hard to follow)
  - Broken link
  - Wrong command (script name does not exist in package.json)
-->

## Suggested correction

<!-- What should it say or do instead? -->

## Source of truth

Which file or command should the doc match?

- [ ] `README.md`
- [ ] `docs/README.md`
- [ ] `todo.md`
- [ ] `package.json` `scripts` (root / backend / frontend / electron)
- [ ] `orchestrator/registry.json`
- [ ] `frontend/src/agents/agentCatalog.ts`
- [ ] An actual source file under `backend-api/src/` or
      `frontend/src/`
- [ ] Other: <!-- path -->

## Link / command validation

If your report is about a broken link or wrong command:

- [ ] I verified the link target does not exist on `main`.
- [ ] I verified the documented `npm run X` does not exist in the
      relevant `package.json`.
- [ ] I read `docs/troubleshooting.md` §26 quick-command appendix
      to confirm the recipe I used was correct.

## Privacy check

- [ ] My report contains no API keys, tokens, chat content,
      runtime memory, or personal paths.

---

<sub>The canonical phase roadmap is [`todo.md`](../../todo.md);
the documentation map is [`docs/README.md`](../../docs/README.md).
For security vulnerabilities, follow [`SECURITY.md`](../../SECURITY.md)
— do NOT file here.</sub>
