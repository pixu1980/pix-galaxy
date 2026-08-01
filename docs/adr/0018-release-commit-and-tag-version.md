# ADR-018: Local release via `commit-and-tag-version`, no CI publish

## Status

Accepted

**Supersedes:** [ADR-009](0009-release-standard-version.md)

## Context

`standard-version` is deprecated. The sibling monorepo `pi-coding-agent-extensions` already uses `commit-and-tag-version` (its maintained fork) with a local release flow and no NPM_TOKEN-based CI publish.

## Decision

- Replace `standard-version` with **`commit-and-tag-version`**
- Adopt the release orchestration from `pi-coding-agent-extensions` (`scripts/release.mjs`): per-package semver bump, CHANGELOG, tag `<name>@<version>`, `--first-release` support
- Releases run **locally** (`pnpm release`), publishing with the developer's npm auth — no CI publish with `NPM_TOKEN`
- Remove/neutralize `.github/workflows/release.yml` NPM_TOKEN publish path

## Consequences

Positive:

- Maintained tool, aligned with the sibling monorepo
- No CI secrets needed; simpler ops
- Per-package independent versions

Negative:

- Releases require a local machine with npm auth
- No automated release pipeline

## Follow-up

Port `release.mjs` + `release-helpers.mjs` from `pi-coding-agent-extensions` (Phase 6).

## Tags

release, tooling, npm
