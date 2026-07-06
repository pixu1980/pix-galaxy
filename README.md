# pix-galaxy

Zero-runtime-dependency vanilla JavaScript Web Components, packaged as a pnpm workspace monorepo.

[![CI](https://github.com/pixu1980/pix-galaxy/actions/workflows/ci.yml/badge.svg)](https://github.com/pixu1980/pix-galaxy/actions/workflows/ci.yml)

## Packages

| Package | Description |
|---------|-------------|
| [@pix-galaxy/pix-accent-color-selector](./packages/pix-accent-color-selector) | Accent color selector Web Component |
| [@pix-galaxy/pix-color-scheme-selector](./packages/pix-color-scheme-selector) | Color-scheme selector Web Component |
| [@pix-galaxy/pix-display-preferences](./packages/pix-display-preferences) | Display preferences popover Web Component |
| [@pix-galaxy/pix-highlighter](./packages/pix-highlighter) | Syntax-highlighting Web Component |
| [@pix-galaxy/pix-component-template](./packages/pix-component-template) | Scaffold template for new components |

## Dependency graph

```
pix-display-preferences
  ├── pix-accent-color-selector
  │     └── pix-highlighter
  ├── pix-color-scheme-selector
  │     └── pix-highlighter
  └── pix-highlighter
```

All internal deps use `workspace:*` protocol — pnpm resolves them automatically.

## Principles

- **Zero runtime dependencies** — browser-native Custom Elements v1.
- **Self-registering** — `customElements.define()` in `static { }` block.
- **Scoped CSS** — `adoptedStyleSheets` with `CSSStyleSheet`.
- **No CSS classes** — `[data-*]` attribute selectors only.
- **No inline styles** — all via CSS custom properties and external stylesheets.
- **`@layer` architecture** — `@layer pix-galaxy { @layer component { ... } }`.
- **JSDoc types** — TypeScript declarations generated from `src/index.types.js`.
- **Dual format** — ESM + CJS via esbuild.
- **Independent versioning** — each package released separately.

## Getting Started

### Prerequisites

- Node.js >= 20.11
- pnpm >= 10

### Install

```sh
pnpm install
```

### Repository commands

```sh
pnpm test          # Run all package tests
pnpm build:lib     # Build all package libraries (ESM + CJS + types)
pnpm build:site    # Build all package docs sites
pnpm build         # Build everything
pnpm dev           # Start dev servers
pnpm lint          # Lint all packages
pnpm format        # Format code with Prettier
pnpm clean         # Clean all build artifacts
```

### Per-package commands

```sh
pnpm --filter @pix-galaxy/pix-highlighter run build
pnpm --filter @pix-galaxy/pix-highlighter run test
pnpm --filter @pix-galaxy/pix-highlighter run dev
pnpm --filter @pix-galaxy/pix-highlighter run release
```

## Release Flow

This monorepo uses a **centralised release orchestrator** that detects changed packages, runs in topological order, and handles version bumps, changelog generation, and tagging automatically.

```sh
# Preview which packages will be released
node scripts/release.mjs --dry-run

# Run the release
node scripts/release.mjs

# Push tags to trigger CI publishing
git push origin main --follow-tags
```

See [RELEASE.md](./RELEASE.md) for the complete release process, orchestration details, versioning strategy, and CI/CD pipeline documentation.

Each package can also be released independently:

```sh
cd packages/pix-highlighter
pnpm release
```

## Creating a new component

Use the template package:

```sh
cp -r packages/pix-component-template packages/pix-my-component
```

Then replace all `{%...%}` placeholders (see `README.md` in the template).

## Repository Structure

```text
pix-galaxy/
├── packages/
│   ├── pix-accent-color-selector/
│   ├── pix-color-scheme-selector/
│   ├── pix-component-template/
│   ├── pix-display-preferences/
│   └── pix-highlighter/
├── eslint.config.js
├── prettierrc
├── pnpm-workspace.yaml
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
└── ...
```

## Community

- Contribution guide: see CONTRIBUTING.md
- Code of conduct: see CODE_OF_CONDUCT.md
- Governance: see GOVERNANCE.md
- Security policy: see SECURITY.md
- Support policy: see SUPPORT.md

## License

MIT, see LICENSE.
