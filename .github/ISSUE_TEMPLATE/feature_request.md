---
name: Feature request
about: Propose a new capability for CreativEdge.
title: "[feat] <short summary>"
labels: ["enhancement", "triage"]
assignees: []
---

<!--
Thanks for proposing a feature.

Before opening: skim todo.md to confirm this isn't already
tracked under a phase or deferred backlog (Phase 5 deferred
extensions, post-Phase-6 polish, signing/auto-update,
macOS/Linux packaging, etc.).

The default assumption is that CreativEdge stays local-first,
loopback-only, telemetry-free. Features that change those
assumptions need explicit phase-level approval — see "Privacy /
security impact" below.
-->

## Problem / opportunity

<!--
What user problem are you trying to solve? What does the current
behavior look like? Why is the existing workaround not enough?
-->

## Proposed solution

<!-- One paragraph: what would you add or change? -->

## User workflow

<!--
Walk through the user-visible flow step by step. Where does it
start? What does the user click / type? What do they see when
it works?
-->

1.
2.
3.

## Scope boundaries

<!--
What is explicitly IN scope for this proposal, and what is OUT?
This helps reviewers avoid feature creep.
-->

- In scope:
- Out of scope:

## Privacy / security impact

Tick everything that applies. If anything but the first option is
ticked, the request requires explicit phase-level approval before
implementation can be considered.

- [ ] No privacy/security impact — the feature stays inside the
      current local-first / 127.0.0.1-only / no-telemetry model.
- [ ] Changes the network surface (new port, new external host,
      LAN binding, cloud sync). _Requires explicit approval._
- [ ] Introduces telemetry or analytics. _Default position: NO;
      requires explicit approval._
- [ ] Sends crash reports / logs / diagnostics automatically.
      _Default position: NO; crash reports remain local-only._
- [ ] Adds `electron-updater` / auto-update / silent install /
      auto-download. _Gated on a future signing-certificate
      decision._
- [ ] Adds a GitHub Actions release workflow / automated
      publishing. _Gated on a future signing-certificate
      decision._
- [ ] Adds code-signing / SmartScreen reputation work. _Gated on
      a future signing-certificate decision._
- [ ] Stores credentials in `localStorage` / `sessionStorage` /
      cookies. _Default position: NO; backup push uses the OS
      Git credential helper._
- [ ] Touches the admin-console authentication surface.
      _Intentional non-goal per §7-D in `todo.md`; requires
      reopening that decision._

## Release impact

- [ ] No release impact (purely internal / preparatory).
- [ ] User-visible — needs a `CHANGELOG.md` entry.
- [ ] Packaged-build-validation needed (touches Electron, the
      `afterPack` flow, dynamic ports, or the preload bridge).

## Documentation impact

Which docs would the feature require?

- [ ] [`docs/user-guide.md`](../../docs/user-guide.md)
- [ ] [`docs/developer-setup.md`](../../docs/developer-setup.md)
- [ ] [`docs/troubleshooting.md`](../../docs/troubleshooting.md)
- [ ] [`docs/add-an-agent.md`](../../docs/add-an-agent.md) /
      [`docs/customize-an-agent.md`](../../docs/customize-an-agent.md)
- [ ] [`docs/electron-release-runbook.md`](../../docs/electron-release-runbook.md)
- [ ] [`README.md`](../../README.md) (summary only)
- [ ] [`todo.md`](../../todo.md) (new phase / sub-slice entry)

## Alternatives considered

<!-- What other options did you weigh? Why did you discard them? -->

## Acceptance criteria

<!--
Concrete, testable conditions for "this is done." The more
specific the better — vague criteria stall reviews.

  - User can click X and see Y within 200ms on a Windows 11
    test host.
  - Backend exposes `GET /foo/bar` returning shape `{…}` with no
    new dependencies.
  - All existing tests still pass with no new failures.
  - The packaged-build walkthrough in
    `docs/release-readiness.md` §3 still passes.
-->

- [ ]
- [ ]
- [ ]

---

<sub>Links: [`todo.md`](../../todo.md) ·
[`CONTRIBUTING.md`](../../CONTRIBUTING.md) ·
[`docs/release-readiness.md`](../../docs/release-readiness.md) ·
[`SECURITY.md`](../../SECURITY.md) (for vulnerabilities — do NOT
file here).</sub>
