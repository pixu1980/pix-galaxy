# Contributing

Thanks for contributing to pix-galaxy.

## Local Setup

This repository targets Node.js 24 and pnpm 11.

```bash
pnpm install
```

## Development Commands

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm validate
pnpm docs:build
```

Package-specific work stays under `packages/<name>/`. Shared runtime helpers live in `packages/shared/`.

## Contribution Expectations

- Keep changes focused and avoid unrelated refactors.
- Preserve public API names unless a breaking change is intentional and documented.
- Add or update tests for behavior changes.
- Update README or package docs when user-facing behavior changes.
- Do not edit `dist/` by hand. Release helpers regenerate tracked `packages/*/dist/` artifacts.
- Keep source in `src/`, build output in `dist/`, and tests in `tests/`.

## Pull Requests

Before opening a pull request:

1. Rebase or merge the latest default branch.
2. Run `pnpm test`.
3. Run `pnpm typecheck`.
4. Run `pnpm build` if your change affects published packages.
5. Confirm docs and governance files still reflect the current behavior.

PRs should explain:

- what changed
- why the change is needed
- how it was tested
- whether the change is breaking

## Release Maintainers Flow

```bash
pnpm rel:patch
git push origin main --follow-tags
```

Release helpers regenerate `CHANGELOG.md` from Conventional Commits, rebuild tracked `dist/` artifacts locally, create a release commit, and create a local tag. GitHub Actions publishes the committed artifacts without rebuilding packages.

## Issues First

For larger changes, open or link an issue before implementation. This keeps design work visible and reduces duplicated effort.

## Commit Style

Conventional Commits are strongly preferred because the release flow and changelog generator use commit subjects directly.

## Review Criteria

Maintainers review for correctness, API stability, test coverage, documentation quality, package integrity, and long-term maintainability.
