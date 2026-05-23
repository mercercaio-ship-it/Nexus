---
name: Bug report
about: Something in CreativEdge doesn't work as documented.
title: "[bug] <short summary>"
labels: ["bug", "triage"]
assignees: []
---

<!--
Thanks for taking the time to file a bug.

⚠️ SECURITY VULNERABILITIES — DO NOT FILE HERE.
If you found a security issue, follow SECURITY.md and use GitHub
Private Vulnerability Reporting (the "Report a vulnerability"
button under the Security tab). Do NOT paste credentials, API
keys, chat content, runtime memory, or sessions.db contents in a
public issue.

Before filing: skim docs/troubleshooting.md — it covers 26 of the
most common issues (port collisions, NODE_MODULE_VERSION mismatch,
release-link failures, backup readiness blockers, OneDrive
caveats, …).
-->

## Environment

- **OS + version:** <!-- e.g. Windows 11 Pro 23H2 -->
- **App mode (tick one):**
  - [ ] Browser dev (`npm run dev:backend` + `npm run dev:frontend`)
  - [ ] Electron dev (`npm run dev:electron`)
  - [ ] Packaged app (`CreativEdge.exe` or `CreativEdge-Setup-<version>.exe`)
- **Commit SHA or version:** <!-- `git rev-parse HEAD` or the version shown in the Setup wizard / Ops console Diagnostics card -->
- **Claude Code CLI installed + authenticated?** <!-- yes / no / not sure -->

## What happened

<!-- One paragraph: what did you do, and what went wrong? -->

## Expected behavior

<!-- What did you think would happen? -->

## Steps to reproduce

<!--
Minimal, reproducible sequence. Numbered list is great.

  1. Run `npm run dev:electron`.
  2. Click `📊 Ops`.
  3. Click "Prepare report" on the newest crash log.
  4. Observe: <…>.
-->

1.
2.
3.

## Logs

<!--
Local CreativEdge logs live under:
  C:\Users\<you>\.creativedge\logs\

Paste a relevant excerpt below. Use a fenced code block. Redact
aggressively — see "What NOT to include" below.
-->

```
<paste log excerpt here>
```

## Validation already tried

<!--
Which troubleshooting recipes did you try? Reference
docs/troubleshooting.md sections by name (e.g. "App does not
open", "backend /healthz failure", "dynamic-port verification").
-->

- [ ] Read [docs/troubleshooting.md](../../docs/troubleshooting.md).
- [ ] Re-ran `git status -s` to confirm working tree is clean.
- [ ] Re-ran the relevant code-sanity commands
      (`cd backend-api && npm run build`, `cd frontend && npm run typecheck`,
      `node --check` on Electron scripts).
- [ ] Verified the issue is reproducible on a clean restart of the app.
- [ ] (Packaged-build only) Tried `electron/dist-electron/win-unpacked/CreativEdge.exe`
      directly in addition to the NSIS installer.

## Screenshots (optional)

<!--
Drag & drop into the issue body. Redact anything personally
identifying or anything that could be a secret.
-->

## What NOT to include in this issue

Please do **not** paste any of the following into this public
issue (or screenshots of them):

- API keys, OAuth tokens, refresh tokens, session cookies.
- Anthropic / Claude Code CLI credentials.
- Git or GitHub credentials.
- Chat content or assistant responses from a real session.
- Runtime memory contents from
  `~/.creativedge/agents/<slug>/memory/`.
- The `~/.creativedge/sessions.db` file (it contains chat history).
- `~/.creativedge/backups/` contents.
- Anything matching a personal path (`C:\Users\<your_name>\…`).

If reproducing the bug genuinely requires one of these values,
redact aggressively (first/last 4 chars only) — the maintainer can
follow up via a private channel if needed.

---

<sub>Links: [`docs/troubleshooting.md`](../../docs/troubleshooting.md)
· [`SECURITY.md`](../../SECURITY.md) (for vulnerabilities) ·
[`CONTRIBUTING.md`](../../CONTRIBUTING.md) ·
[`todo.md`](../../todo.md) (phase roadmap).</sub>
