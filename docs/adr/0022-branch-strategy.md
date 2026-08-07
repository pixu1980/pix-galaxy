# ADR-022: Branch strategy - develop as trunk, main for releases

## Status

Accepted

## Context

The repo had `master`, `main`, and `develop` branches with no clear flow.

## Decision

- **`develop`** is the trunk: all work lands here
- **`main`** receives merges only for releases
- Per-package release tags are pushed to `main`

## Consequences

Positive:

- Single integration branch, simple flow
- Release branch stays stable

Negative:

- Two long-lived branches to keep in sync
- Releases require a merge `develop` → `main`

## Follow-up

Delete or ignore `master`; document the flow in `CONTRIBUTING.md`.

## Tags

git, branching, release
