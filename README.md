# pix-galaxy

A monorepo of zero-runtime-dependency vanilla JavaScript Web Components.

[![CI](https://github.com/pixu1980/pix-galaxy/actions/workflows/ci.yml/badge.svg)](https://github.com/pixu1980/pix-galaxy/actions/workflows/ci.yml)

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@pix-galaxy/pix-button](./packages/pix-button) | 0.1.0 | Accessible button Web Component |
| [@pix-galaxy/pix-card](./packages/pix-card) | 0.1.0 | Accessible card Web Component |

## Philosophy

- **Zero runtime dependencies** — no frameworks, no libraries, pure vanilla JS
- **Web Standards first** — built on Custom Elements, Shadow DOM, and CSS Custom Properties
- **Accessible by default** — semantic HTML, keyboard support, forced colors, reduced motion
- **ESM only** — modern ES modules, tree-shakeable
- **JSDoc typed** — full type safety via `// @ts-check` and TypeScript declaration generation
- **Static docs** — documentation as plain HTML, no build step to view

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [pnpm](https://pnpm.io/) 9.15.4

### Install

```sh
pnpm install
```

### Build all packages

```sh
pnpm build
```

### Test all packages

```sh
pnpm test
```

### Typecheck all packages

```sh
pnpm typecheck

```

### Validate all packages

```sh
pnpm validate
```

### Build documentation site

```sh
pnpm docs:build
```

Output goes to `site/`.

### Clean build artifacts

```sh
pnpm clean
```

## Creating a new package

```sh
pnpm package:create pix-badge
```

This scaffolds a new package under `packages/pix-badge/` with all required files and scripts.

## List packages

```sh
pnpm package:list
```

## Working with a single package

```sh
# Build
pnpm --filter @pix-galaxy/pix-button build

# Test
pnpm --filter @pix-galaxy/pix-button test

# Typecheck
pnpm --filter @pix-galaxy/pix-button typecheck

# Validate structure
pnpm --filter @pix-galaxy/pix-button validate

# Build docs
pnpm --filter @pix-galaxy/pix-button docs:build
```

## Repository structure

```
pix-galaxy/
├── packages/
│   ├── pix-button/          # @pix-galaxy/pix-button
│   │   ├── src/             # Source files (JS + CSS)
│   │   ├── test/            # Tests (node:test)
│   │   ├── docs/            # Static HTML documentation
│   │   ├── dist/            # Build output (generated)
│   │   ├── package.json
│   │   ├── tsconfig.types.json
│   │   └── README.md
│   └── pix-card/            # @pix-galaxy/pix-card
│       └── ...
├── scripts/
│   ├── build-package.mjs    # esbuild bundler + tsc declarations
│   ├── build-docs.mjs       # Aggregate docs into site/
│   ├── clean.mjs            # Remove dist/ and site/
│   ├── create-package.mjs   # Scaffold a new package
│   ├── list-packages.mjs    # List all packages
│   └── validate-package.mjs # Validate package structure
├── site/                    # Generated documentation site
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       ├── ci.yml           # Test, typecheck, build on push/PR
│       ├── pages.yml        # Deploy docs to GitHub Pages
│       └── release.yml      # Publish to npm on tag
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.types.json      # Shared TS config for declaration generation
```

## Component conventions

Every component package:

- Lives in `packages/<name>/`
- Has `src/`, `test/`, `docs/`, `package.json`, `tsconfig.types.json`, `README.md`
- Exposes ESM only
- Has zero runtime `dependencies`
- Has scripts: `build`, `test`, `typecheck`, `validate`, `docs:build`
- Uses `// @ts-check` in every source file
- Uses JSDoc for all public APIs
- Uses Shadow DOM with `:host` scoping
- Supports `@media (forced-colors: active)` and `@media (prefers-reduced-motion: reduce)`

## CI/CD

- **CI** (`ci.yml`): Runs on every push to `main` and every pull request. Runs tests, typecheck, build, and docs build.
- **Pages** (`pages.yml`): Deploys the `site/` directory to GitHub Pages on push to `main`.
- **Release** (`release.yml`): Publishes packages to npm on push of a `v*` tag or manual trigger.

## License

MIT
