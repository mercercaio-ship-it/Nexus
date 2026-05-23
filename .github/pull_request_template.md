<!--
Thanks for sending a pull request to CreativEdge. Please fill in
the sections below so reviewers can land your work quickly and
safely. Sections you can answer with "n/a" should be marked
explicitly rather than deleted.

Before opening: read CONTRIBUTING.md if you haven't.
For security-sensitive work, follow SECURITY.md and use a private
channel — do NOT open a public PR or issue for a vulnerability.
-->

## Summary

<!-- One short paragraph: what does this PR change and why? -->

## Scope

<!--
Be explicit about what this PR touches and what it deliberately
leaves alone. List the directories or major files. If it's a
docs-only slice, say so.
-->

## Type of change

Tick one:

- [ ] `docs:` documentation, comments, governance, or release notes.
- [ ] `fix:` bug fix.
- [ ] `feat:` new feature.
- [ ] `refactor:` code restructuring without behavior change.
- [ ] `chore:` repo housekeeping (metadata, configuration, lockfiles).
- [ ] `release:` release-publication work (tag prep, release notes
      finalization).

## Phase / roadmap reference

<!--
CreativEdge's canonical roadmap is in todo.md. Cite the phase or
slice this PR closes (or the deferred backlog it draws from).

Examples:
  - Phase 11-B (GitHub templates + release publication readiness)
  - Post-Phase-6 polish backlog (light/dark theme toggle)
  - Phase 5 deferred extensions (§5.3-C optional LLM summarization)

Link to the relevant section in todo.md if helpful.
-->

- Roadmap entry:
- `todo.md` link / section:

## Files changed

<!--
Either paste `git diff --stat` here, or summarize the touched
files in 3-10 bullets. Reviewers want to scan the surface quickly.
-->

## Validation run

<!--
Check the boxes that apply to your slice type and paste a one-line
exit-code summary for each. See docs/developer-setup.md §10 and
docs/troubleshooting.md §26 for the per-slice-type checklists.
-->

- [ ] `cd backend-api && npm run build` — exit code:
- [ ] `cd frontend && npm run typecheck` — exit code:
- [ ] `cd frontend && npm run build` — exit code:
      _(Note the documented Linux-sandbox Rollup platform-binary
      caveat if applicable.)_
- [ ] `node --check electron/main.mjs` — exit code:
- [ ] `node --check electron/preload.cjs` — exit code:
- [ ] `node --check electron/scripts/build-deps.mjs` — exit code:
- [ ] `node --check electron/scripts/build-win.mjs` — exit code:
- [ ] `node --check electron/scripts/after-pack.mjs` — exit code:
- [ ] Relevant backend test runner(s) ran. Which:
- [ ] `npm run build:electron` ran (only for packaging-impacting
      changes). Result:
- [ ] Docs link check (for docs-only slices): all new relative
      links resolve.

## Screenshots / recordings

<!--
For UI changes, attach screenshots or a short clip. For
non-UI changes, write "n/a".
-->

## Privacy / security checklist

This block is non-negotiable. Tick every box.

- [ ] No API keys, tokens, OAuth credentials, or session cookies
      in any committed file.
- [ ] No chat content, prompts, or assistant responses from real
      sessions in fixtures, docs, or logs.
- [ ] No runtime memory content from
      `~/.creativedge/agents/<slug>/memory/`.
- [ ] No `~/.creativedge/` data of any kind committed.
- [ ] No `node_modules/` committed.
- [ ] No `electron/dist-electron/` or any other build output
      committed.
- [ ] No new telemetry, no automatic external send, no background
      polling.
- [ ] No `0.0.0.0` binding — the app remains 127.0.0.1 only.
- [ ] No `electron-updater` / auto-update / code-signing /
      GitHub Actions release workflow added unless this PR opens
      an explicitly approved phase for that work.
- [ ] No new external network calls without an explicit
      `docs/release-readiness.md`-style allow-list entry.

## Release impact

Tick one:

- [ ] **No release impact.** Pure docs / metadata / governance.
- [ ] **Release notes needed.** This PR is user-visible and should
      land an entry under `[Unreleased]` in `CHANGELOG.md`
      (and eventually in `docs/release-notes/<version>.md`).
- [ ] **Packaged-build validation needed.** This PR touches the
      Electron lifecycle, the `afterPack` flow, dynamic ports, the
      preload bridge, or anything else that warrants the full
      Windows packaged-build walkthrough in
      `docs/release-readiness.md` §3.

## Reviewer checklist

<!-- The reviewer should be able to tick these without going off-PR. -->

- [ ] Scope matches the original prompt / brief.
- [ ] Validation evidence is present and exit codes match the
      slice type.
- [ ] No generated files included (`dist*/`, `node_modules/`,
      `electron/dist-electron/`, `*.tsbuildinfo`, `*.log`,
      `~/.creativedge/` data).
- [ ] `docs/` and `todo.md` updated where relevant.
- [ ] `CHANGELOG.md` updated if release impact is non-zero.
- [ ] No secrets, tokens, chat content, runtime memory, or
      personal paths leaked.
- [ ] If the PR adds external links, they're HTTPS-only and
      reviewed for the allow-list contract.

---

<sub>For background: [`CONTRIBUTING.md`](../CONTRIBUTING.md) ·
[`SECURITY.md`](../SECURITY.md) · [`CHANGELOG.md`](../CHANGELOG.md) ·
[`docs/release-readiness.md`](../docs/release-readiness.md) ·
[`todo.md`](../todo.md).</sub>
