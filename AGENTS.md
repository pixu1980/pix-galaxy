# pix-galaxy - Agent Instructions

pix-galaxy is a monorepo of **zero-runtime-dependency vanilla JavaScript Web Components** (Custom Elements v1, Light DOM, `adoptedStyleSheets`, `light-dark()`, `oklch()`), managed with pnpm workspaces.

## Core rules

- Use **pnpm** only. Never npm, yarn, bun, lerna, nx, turbo, or rush.
- **Zero runtime dependencies** and **no frameworks** (React, Vue, Svelte, Lit, Stencil, Angular, etc.) - this is the project's DNA.
- **No Shadow DOM**, no `<template>` elements. Light DOM + `document.adoptedStyleSheets` only.
- Keep source readable and unbundled: source in `src/`, build output in `artifact/`/`dist/`.
- Use `// @ts-check` and **JSDoc** for all public APIs; TypeScript only for type checking (`--noEmit`) and `.d.ts` generation.
- Use **`node:test`** for unit tests, **Playwright** for e2e. Never Jest, Vitest, Mocha.
- CSS must be **native CSS**: `@layer`, custom properties, `light-dark()` with fallback, design tokens from `@pix-galaxy/pix-foundations`.
- Every component: `static {}` block as the only registration site, private fields for internal state, event listeners bound to stable references and removed in `disconnectedCallback`.
- **WCAG 2.2 AA** is a non-negotiable requirement for every component.
- Target browsers: **modern-only** (Chrome 119+, Safari 17.5+, Firefox 120+).

## Architecture

- Monorepo packages in `packages/`, each a self-contained `@pix-galaxy/*` workspace package.
- Shared runtime and build scripts live in `packages/pix-core/` - never duplicate per-package.
- Design tokens, focus ring, typography, radii, spacings, and control styles live in `packages/pix-foundations/` - components must consume tokens, not redefine primitives.
- Docs template is shared via `packages/pix-core/docs/docs-site.js`.
- Portal (component browser) in `src/docs/`; content catalog in `src/docs/content/components.json`.

## Development workflow

```bash
pnpm dev          # portal only (port 3000)
pnpm dev:all      # all package docs sites (3000–3011)
pnpm test         # all package tests
pnpm quality      # format:check + lint
pnpm scaffold PixName "Description"   # new component
pnpm release      # local release (commit-and-tag-version)
```

## Branch strategy

- `develop` is the trunk - all work lands here.
- `main` receives merges only for releases.
- Releases are tagged per-package (`@pix-galaxy/<pkg>@<version>`) and published from local (`pnpm release`), no CI publish.

## Release readiness

- Every package carries `releaseStatus: "wip" | "ready"` in its `package.json` (single source of
  truth). Only `"ready"` packages are released (`pnpm release`) and shown on the production
  pix-galaxy site (`pages.yml` aggregation, `src/docs/index.js` ready filter). The **dev** portal
  shows the full catalog so every component can be navigated locally.
- New components scaffold with `"wip"` by default — flip to `"ready"` only when the component is
  publishable. Private packages (`pix-core`, `pix-foundations`) are never published, but can be
  shown on the site if marked `"ready"`.

## Docs & conventions

- Architecture decisions are recorded in `docs/adr/` (Nygard format).
- Handoff documents live in `docs/` (`HANDOFF.md`, `HANDOFF-LLM-*.md`).
- Execution plans in `docs/plans/`.
- Run `pnpm format` before committing; keep commits conventional (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`).
