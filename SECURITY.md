# Security Policy

CreativEdge is a **local-first** desktop application. Its threat
model is deliberately scoped to a single Windows user account: the
backend binds to `127.0.0.1` only, no telemetry is collected, no
automatic external network calls are made, and crash reports stay on
disk unless the user explicitly exports them. That design choice
narrows the attack surface significantly, but does not eliminate
risk — please follow this policy if you discover a vulnerability.

---

## Supported versions

| Version | Channel | Security fixes |
|---|---|---|
| `0.1.0` (Windows packaged build) | Initial baseline | ✅ Yes — current |
| `main` branch HEAD | Development | ✅ Yes — current |
| Older commits / earlier phase tags | Historical | ❌ No |

The current packaged-build version comes from
`electron/package.json` and `package.json`. There is only one
supported release line today (0.1.0); future versions will be
documented in [`CHANGELOG.md`](CHANGELOG.md).

---

## Reporting a vulnerability

Please do **not** open a public GitHub issue for security reports.
Use one of the following channels instead, in order of preference:

1. **GitHub Private Vulnerability Reporting** — if enabled on
   <https://github.com/CreativEdgeSolutions/Nexus>, use the "Report a
   vulnerability" button under the Security tab. This is the
   preferred path because it preserves an auditable conversation
   history.
2. **Direct maintainer contact via repository owner channel** — if
   private vulnerability reporting is not available, contact the
   repository owner through the private repository access channel
   you already have.

Do not invent or guess at maintainer email addresses; CreativEdge
does not publish a security inbox. If neither channel above is
available to you, open a minimal-detail GitHub issue requesting a
private channel, and the maintainer will reach out.

---

## What to include in your report

A useful security report includes (where applicable):

- **Affected version / commit SHA.** Run `git rev-parse HEAD` or
  read the Setup wizard's diagnostics panel.
- **Operating system + build mode** (browser dev, Electron dev, or
  packaged installer / win-unpacked).
- **Affected component.** Backend route, frontend surface, Electron
  main/preload, native module, build pipeline, or docs.
- **Reproduction steps.** Minimal commands to trigger the issue.
- **Observed vs. expected behavior.**
- **Logs with secrets removed.** `~/.creativedge/logs/` is the
  default log location; redact any tokens, paths containing
  usernames, or chat content before attaching.
- **Severity assessment** (your best guess; the maintainer will
  reassess).

---

## What NOT to include

Please **never** paste any of the following into a security report,
in screenshots, or in any attachment:

- API keys, OAuth tokens, refresh tokens, or session cookies.
- Anthropic / Claude Code CLI credentials.
- Git or GitHub credentials.
- Chat content or assistant responses from a real session.
- Runtime memory contents from `~/.creativedge/agents/<slug>/memory/`.
- The `~/.creativedge/sessions.db` SQLite file (it contains chat
  history).
- Backup mirrors under `~/.creativedge/backups/`.
- Personal identifiers beyond what's strictly necessary to
  reproduce the issue.

If a vulnerability requires inspecting a value of one of the above
to confirm it, redact aggressively before sharing — e.g., show the
first/last 4 characters of a token, not the full string. The
maintainer will request additional detail through a private channel
only when needed.

---

## Security model summary

CreativEdge's security posture (current as of Phase 10 closure):

- **Local-first.** All persistent data lives under
  `~/.creativedge/` on the user's machine. No data is uploaded to
  any third party automatically.
- **127.0.0.1 only.** The Fastify backend and the static-asset
  HTTP server both bind to the loopback interface exclusively —
  never `0.0.0.0`, never a LAN-routable address.
- **Dynamic free-port allocation.** Inside the packaged Electron
  shell, both servers pick a free loopback port at startup
  (Phase 9-D-C3). Browser-dev mode keeps the legacy fixed ports
  (3001 + 5174) for tooling compatibility.
- **No telemetry.** No usage analytics, no error pings, no
  background polling.
- **Hardened renderer.** `contextIsolation: true`,
  `nodeIntegration: false`, `sandbox: true`, `webSecurity: true`.
  No remote modules loaded.
- **Minimal preload bridge.** Only two surfaces exposed on
  `window.ceBridge`: `openExternal(url)` (Phase 9-D-B4, HTTPS-only,
  allow-listed to the single GitHub Releases URL) and
  `getRuntimeConfig()` (Phase 9-D-C3, returns port allocation
  metadata only — no prompts, chat, memory, env vars, or secrets).
- **Crash reports local-only.** Crash reports are written to
  `~/.creativedge/logs/crash-<ts>.log`. The Ops console's
  "Prepare report" UX (Phase 9-D-C2) generates a redacted JSON
  with a 17-field allow-list; the free-text `backendLogTail` field
  is dropped from prepared reports until a tested-redaction
  sanitizer lands. The user must explicitly Copy or Download — no
  automatic send / upload / email.
- **Opt-in backup push.** Pushing the local agent backup to a Git
  remote requires the user to confirm the remote URL and the
  default branch in a second-confirmation modal (Phase 9-D-B3).
  No credentials are stored in `localStorage`, `sessionStorage`,
  or cookies — the operation uses the OS's standard Git credential
  helper.
- **Unsigned installer.** The packaged installer is unsigned today.
  Windows SmartScreen will warn on first run. Code-signing is
  deferred pending a separate signing-certificate decision.
- **No `electron-updater`.** No automatic update, no
  auto-download, no silent install, no GitHub Actions release
  workflow. Manual update is documented in
  [`docs/electron-release-runbook.md`](docs/electron-release-runbook.md).

---

## Responsible disclosure expectations

- The maintainer will acknowledge a valid security report within a
  reasonable timeframe via the channel used to report it.
- Critical vulnerabilities (e.g., remote code execution, sandbox
  escape, credential leakage) are prioritized over lower-severity
  issues.
- Please give the maintainer a reasonable window to investigate
  and remediate before any public disclosure. As a guideline, plan
  for **90 days** from acknowledgement; complex issues may need
  longer.
- Coordinated disclosure (the reporter is credited in the
  CHANGELOG entry for the fix) is welcomed but not required.

---

## Out of scope

The following are explicit non-goals for the current CreativEdge
security model and are tracked as deferred items in
[`todo.md`](todo.md). Reports targeting these specifically can be
filed but should not be expected to receive a fix in the current
phase:

- Lack of code-signing on the Windows installer.
- Lack of `electron-updater` / automatic update channel.
- Lack of authentication / authorization on the admin console
  (intentional non-goal per §7-D — the admin surface assumes
  trusted local user only).
- Lack of macOS / Linux desktop binaries.
- Lack of a tested redaction sanitizer for the free-text
  `backendLogTail` field in prepared crash reports.

Findings in these areas are useful context but are gated on
separate phase decisions (most notably a signing-certificate
decision for the auto-update / signing surface).

---

Thank you for helping keep CreativEdge users safe.
