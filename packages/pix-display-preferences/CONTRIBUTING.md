# Contributing

Thanks for contributing to @pix-galaxy/pix-display-preferences.

## Local Setup

This repository is built and tested with modern Node.js. The committed .nvmrc points to the expected runtime line.

```bash
nvm use
pnpm install
```

## Development Commands

```bash
pnpm test
pnpm build
pnpm dev
```

Docs source markdown lives in src/docs/content/. Site source lives in src/docs/. The component source itself lives in src/components/DisplayPreferencesPopover/.

## Contribution Expectations

- Keep changes focused and avoid unrelated refactors.
- Preserve public API names unless a breaking change is intentional and documented.
- Add or update tests for behavior changes.
- Update README or other project docs when user-facing behavior changes.
- Do not commit build output from dist or artifact unless a maintainer explicitly asks for it.

## Pull Requests

Before opening a pull request:

1. Rebase or merge the latest default branch.
2. Run pnpm test.
3. Run pnpm build.
4. Confirm the README, changelog and any governance docs still reflect the current behavior.

## Release Maintainers Flow

```bash
pnpm rel:patch
git push origin main --follow-tags
```

Release workflow uses pnpm for install, validation and build steps. npm is reserved for the final publish step inside GitHub Actions.

PRs should explain:

- What changed.
- Why the change is needed.
- How it was tested.
- Whether the change is breaking.

## Issues First

For large changes, open or link an issue before starting implementation. This keeps design work visible and reduces duplicated effort.

## Commit Style

Conventional Commits are preferred but not mandatory. Clarity matters more than format.

## Review Criteria

Maintainers review for correctness, API stability, test coverage, documentation quality, bundle impact and long-term maintainability.
