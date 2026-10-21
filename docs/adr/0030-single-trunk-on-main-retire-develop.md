# ADR-030: Single trunk on main, retire develop

## Status

Accepted

## Context

ADR-022 made `develop` the trunk and `main` release-only. The project now wants a single long-lived branch: all work and releases live on `main`. At decision time, `develop` fast-forwarded 55 commits ahead of `main` with no unique `main` commits, so the histories merge without conflict. Two trunks added documentation drift, dual CI branch triggers, and `release.mjs` pushing tags to `develop` while `origin/HEAD` already pointed at `main`.

## Decision

- Retire `develop`. **`main` is the only long-lived branch and the trunk.**
- Feature/fix branches and pull requests target `main`.
- Local releases (`pnpm release`, ADR-018) push commits and tags to `origin main`.
- CI runs on `main` (and `pull_request`) only.
- Delete local and remote `develop` after fast-forwarding `main` to the former `develop` tip.
- **ADR-022 is superseded** by this decision.

## Consequences

Positive:

- One source of truth; CONTRIBUTING / RELEASE / AGENTS / CI align with `origin/HEAD`.

Negative:

- No separate release-only branch; a broken trunk is immediately the default branch. Mitigate with CI on `main` and `pnpm release:dry` before publish.

## Alternatives Considered

1. Keep ADR-022 (`develop` trunk / `main` release-only) — rejected: unwanted dual trunk.
2. Rename `develop` to `main` with force-push — unnecessary: a clean fast-forward exists.

## Tags

git, branch, release
