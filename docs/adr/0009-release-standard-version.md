# ADR-009: Release via standard-version

## Status

**Superseded by [ADR-018](0018-release-commit-and-tag-version.md)**

## Context

Manual versioning and changelog maintenance is error-prone.

## Decision

Use `standard-version` for semver bump, CHANGELOG generation, and git tag creation. Single orchestration script discovers all packages.

## Rationale

- Conventional commits → automatic version bump
- CHANGELOG auto-generated from commit messages
- Works with pnpm workspaces

## Consequences

- Requires conventional commit format for proper versioning
- `standard-version` is deprecated; superseded by `commit-and-tag-version` (its maintained fork) with a local release flow (see ADR-018)

## Tags

release, tooling
