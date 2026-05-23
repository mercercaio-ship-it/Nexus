# Release notes drafts

This directory holds **drafts** of CreativEdge release notes — one
file per planned version. These are not GitHub Releases. They are
the source from which a future GitHub Release description is
copy-pasted, once the maintainer approves cutting a release.

## What lives here

- `v0.1.0.md` — Release notes for the first Windows desktop
  validation baseline (Phases 0 through 10 complete).
  **Published manually on 2026-05-23 as a GitHub Pre-release**
  (tag `v0.1.0`, target commit `ebc159e`). Release page:
  <https://github.com/CreativEdgeSolutions/Nexus/releases/tag/v0.1.0>.
  This file remains in the repository as the canonical source of
  the release description and the link target from
  [`../../CHANGELOG.md`](../../CHANGELOG.md).

Each draft includes:

- A target tag (e.g. `v0.1.0`).
- A target title (e.g. `CreativEdge v0.1.0 — Windows desktop
  validation baseline`).
- A target publication date (overridden by the actual publication
  date when the release ships).
- A status banner clearly marking the file as a **draft**.

## How a release ships

The canonical end-to-end procedure lives in
[`../release-readiness.md`](../release-readiness.md):

1. Run through the §1 release preconditions (working tree clean,
   tests green, LICENSE / SECURITY / CONTRIBUTING / CHANGELOG
   present, etc.).
2. Run through the §3 Windows packaged-validation walkthrough on a
   real Windows host (not a Linux sandbox).
3. Migrate the `[Unreleased]` entries in
   [`../../CHANGELOG.md`](../../CHANGELOG.md) into a dated
   `[<version>] — YYYY-MM-DD` block.
4. Follow the §5 GitHub release draft checklist: create the tag
   locally first; **do not push the tag** until the maintainer
   explicitly approves; then create the GitHub Release via the
   GitHub UI and paste this directory's matching draft into the
   release description.
5. After publication, link the GitHub Release URL from the
   `CHANGELOG.md` entry so future readers can jump straight to
   it.

## What this directory is NOT

- ❌ Not a GitHub Release. Files here have no effect on what
  appears at <https://github.com/CreativEdgeSolutions/Nexus/releases>
  until the maintainer manually creates the release.
- ❌ Not an artifact upload. Build outputs (the NSIS installer,
  the unpacked binary, debug YAMLs) live under
  `electron/dist-electron/` and are git-ignored. Artifact upload
  is a manual step in the GitHub UI during the §5 procedure.
- ❌ Not automated. There is no GitHub Actions release workflow,
  no `electron-updater` channel, no signing pipeline. Each
  release is cut manually by the maintainer.

## Adding a new draft

Filename pattern: `v<MAJOR>.<MINOR>.<PATCH>.md` (e.g. `v0.2.0.md`).
Use [`v0.1.0.md`](v0.1.0.md) as a template — copy it, replace the
version-specific fields, and update the "What's in this release"
section to reflect the actual phase / slice closures that landed
since the previous release. Keep the security caveats block
verbatim until those caveats actually go away.

## Why a draft instead of just an `[Unreleased]` CHANGELOG entry

- The CHANGELOG is concise and Keep-a-Changelog-style — perfect
  for a quick scroll.
- The release notes here are longer, user-facing, and include
  installation steps + security caveats + known limitations + a
  full roster table. They're what a first-time visitor reads on
  the GitHub release page.
- Keeping the two distinct lets the CHANGELOG stay a clean
  long-term ledger while the release notes evolve into a
  marketing-quality landing for that specific release.

---

For the canonical phase roadmap, see [`../../todo.md`](../../todo.md).
For the contributor handbook, see [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).
