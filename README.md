# pix-galaxy

Zero-runtime-dependency vanilla JavaScript Web Components, packaged as a pnpm workspace monorepo.

[![CI](https://github.com/pixu1980/pix-galaxy/actions/workflows/ci.yml/badge.svg)](https://github.com/pixu1980/pix-galaxy/actions/workflows/ci.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

## Packages

| Package                                                                       | Description                                              | Status  |
| ----------------------------------------------------------------------------- | -------------------------------------------------------- | ------- |
| [@pix-galaxy/pix-foundations](./packages/pix-foundations)                     | Design tokens: radii, spacing, colors, typography, focus | private |
| [@pix-galaxy/pix-color](./packages/pix-color)                                 | OKLCH color utilities and picker                         | wip     |
| [@pix-galaxy/pix-vanilla-reactive](./packages/pix-vanilla-reactive)           | Reactive framework: store, signals, template engine      | wip     |
| [@pix-galaxy/pix-color-scheme-selector](./packages/pix-color-scheme-selector) | Light/dark color-scheme switcher                         | ready   |
| [@pix-galaxy/pix-accent-color-selector](./packages/pix-accent-color-selector) | Accent color swatch selector                             | ready   |
| [@pix-galaxy/pix-toast](./packages/pix-toast)                                 | Accessible toast notification system                     | wip     |
| [@pix-galaxy/pix-sortable](./packages/pix-sortable)                           | Sortable list (drag, touch, keyboard)                    | wip     |
| [@pix-galaxy/pix-command](./packages/pix-command)                             | Command palette with fuzzy search                        | wip     |
| [@pix-galaxy/pix-splitter](./packages/pix-splitter)                           | Resizable panel splitter                                 | wip     |
| [@pix-galaxy/pix-highlighter](./packages/pix-highlighter)                     | Browser-native syntax highlighting                       | ready   |
| [@pix-galaxy/pix-recorder](./packages/pix-recorder)                           | Audio recorder with waveform                             | wip     |
| [@pix-galaxy/pix-a11y-panel](./packages/pix-a11y-panel)                       | Display preferences popover                              | ready   |

Status reflects `releaseStatus` in each `package.json` (single source of truth, ADR-026):
`ready` = quality gate passed, publishable; `wip` = in progress; `private` = never published.

## Principles

- **Zero runtime dependencies** — browser-native Custom Elements v1.
- **Self-registering** — `customElements.define()` in a `static { }` block.
- **Scoped CSS** — `adoptedStyleSheets` with `CSSStyleSheet`.
- **No CSS classes** — `[data-*]` attribute selectors only.
- **`@layer` architecture** — `@layer pix-galaxy { @layer component { ... } }`.
- **JSDoc types** — TypeScript declarations generated from `src/index.types.js`.
- **Dual format** — ESM + CJS via esbuild.
- **Independent versioning** — each package released separately (ADR-018).

## Getting started

### Prerequisites

- Node.js >= 20.11
- pnpm >= 10

### Install & run

```sh
pnpm install
pnpm dev:all          # portal + all package docs sites (ports 3000+)
```

### Repository commands

```sh
pnpm test              # all package tests (node:test)
pnpm test:e2e          # Playwright e2e
pnpm quality           # format:check + lint + typecheck
pnpm build:lib         # package libraries (ESM + CJS + types)
pnpm build:site        # portal + package docs sites
pnpm build             # everything
pnpm release:dry       # preview releases (no changes)
```

Per-package:

```sh
pnpm --filter @pix-galaxy/pix-color run test
pnpm --filter @pix-galaxy/pix-color run build:lib
pnpm --filter @pix-galaxy/pix-color run dev
```

## Release flow

Releases are **local** (ADR-018): each package gets its own semver, changelog,
and tag; the root orchestrator publishes with local npm auth.

```sh
pnpm release:dry       # preview which packages will be released
pnpm release           # bump + CHANGELOG + tag + npm publish (local)
```

- Working tree must be clean.
- npm authentication is verified first (`npm whoami` → `npm login`).
- The script pushes tags to `develop` (ADR-022); tags trigger a **quality
  gate** (`release.yml`) — no CI publish.
- Use `--verify` to wait for the npm malware scan, `--package <name>` to
  release only one package, `--force` to release without changes.

See [RELEASE.md](./RELEASE.md) for details.

## Creating a new component

```sh
pnpm scaffold PixName "Description"
```

or copy the template and replace the `{%...%}` placeholders:

```sh
cp -r packages/pix-component-template packages/pix-my-component
```

## Repository structure

```text
pix-galaxy/
├── packages/
│   ├── pix-a11y-panel/
│   ├── pix-accent-color-selector/
│   ├── pix-color-scheme-selector/
│   ├── pix-highlighter/
│   └── ... (see Packages table)
├── src/docs/            # component portal
├── docs/                # ADRs, roadmap, design reviews
├── .github/workflows/   # ci.yml, release.yml, pages.yml
└── ...
```

## Community

- Roadmap: [ROADMAP.md](./ROADMAP.md)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Governance: [GOVERNANCE.md](./GOVERNANCE.md)
- Security: [SECURITY.md](./SECURITY.md)
- Support: [SUPPORT.md](./SUPPORT.md)
- Funding: [.github/FUNDING.yml](./.github/FUNDING.yml)

## License

MIT, see [LICENSE](./LICENSE).
