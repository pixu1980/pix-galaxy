# pix-galaxy

Zero-runtime-dependency vanilla JavaScript Web Components, packaged as a pnpm workspace monorepo.

[![CI](https://github.com/pixu1980/pix-galaxy/actions/workflows/ci.yml/badge.svg)](https://github.com/pixu1980/pix-galaxy/actions/workflows/ci.yml)

## Packages

| Package | Description |
|---------|-------------|
| [@pix-galaxy/pix-baseline](./packages/pix-baseline) | Baseline component scaffold for the shared runtime |
| [@pix-galaxy/pix-button](./packages/pix-button) | Accessible light-DOM button wrapper |
| [@pix-galaxy/pix-card](./packages/pix-card) | Accessible light-DOM card container |
| [@pix-galaxy/pix-color-scheme-switcher](./packages/pix-color-scheme-switcher) | Persisted light, dark, and system mode switcher custom element |
| [@pix-galaxy/pix-design-system](./packages/pix-design-system) | Shared design-system package |
| [@pix-galaxy/pix-highlighter](./packages/pix-highlighter) | Highlighter component scaffold for the shared runtime |

## Principles

- Zero runtime dependencies.
- Browser-native Custom Elements v1 in light DOM.
- CSS delivered through adoptedStyleSheets and package `dist/` output.
- JSDoc types plus TypeScript declaration generation.
- Static documentation per package under `packages/<name>/docs/`.
- pnpm-only developer workflow.

## Getting Started

### Prerequisites

- Node.js 24
- pnpm 11

### Install

```sh
pnpm install
```

### Repository commands

```sh
pnpm test
pnpm typecheck
pnpm build
pnpm validate
pnpm docs:build
pnpm docs:serve
pnpm clean
```

`pnpm test` also runs the root CLI test suite in `scripts/tests/index.js`.

### Per-package commands

```sh
pnpm --filter @pix-galaxy/pix-button build
pnpm --filter @pix-galaxy/pix-button test
pnpm --filter @pix-galaxy/pix-button typecheck
pnpm --filter @pix-galaxy/pix-button validate
pnpm --filter @pix-galaxy/pix-button docs:build
pnpm --filter @pix-galaxy/pix-button docs:serve
```

## Release Flow

Local release preparation is conventional-commit driven:

```sh
pnpm rel:patch
pnpm rel:minor
pnpm rel:major
```

Each helper:

1. runs tests and typecheck
2. regenerates `CHANGELOG.md` from Conventional Commits
3. bumps the root version plus every publishable package version
4. rebuilds tracked `packages/*/dist/` artifacts locally
5. creates a release commit and local tag

Push remains manual:

```sh
git push origin main --follow-tags
```

The release workflow verifies the committed `dist/` artifacts and publishes them without rebuilding packages in CI. That keeps the published npm payload aligned with the local release build.

## Repository Structure

```text
pix-galaxy/
├── packages/
│   ├── pix-button/
│   ├── pix-card/
│   ├── pix-baseline/
│   ├── pix-color-scheme-switcher/
│   ├── pix-design-system/
│   ├── pix-highlighter/
│   └── shared/
├── scripts/
├── site/
├── .ai/
├── .github/
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── GOVERNANCE.md
├── SECURITY.md
└── SUPPORT.md
```

## Community

- Contribution guide: see CONTRIBUTING.md
- Code of conduct: see CODE_OF_CONDUCT.md
- Governance: see GOVERNANCE.md
- Security policy: see SECURITY.md
- Support policy: see SUPPORT.md
- Release notes: see CHANGELOG.md

## License

MIT, see LICENSE.
