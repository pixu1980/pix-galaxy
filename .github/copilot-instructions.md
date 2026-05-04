# Copilot Instructions for pix-galaxy

## Project overview

pix-galaxy is a zero-runtime-dependency vanilla JavaScript Web Components monorepo managed with pnpm workspaces.

## Core rules

- Use **pnpm** only. Do not use npm, yarn, bun, lerna, nx, turbo, or rush.
- Do **not** introduce runtime dependencies unless explicitly requested and well-documented.
- Do **not** introduce frameworks (React, Vue, Svelte, Lit, Stencil, Angular, etc.).
- Do **not** convert JavaScript source files to TypeScript.
- Keep source files **readable and unbundled** — source lives in `src/`, build output in `dist/`.
- Use `// @ts-check` at the top of every JavaScript source file.
- Use **JSDoc** for all public classes, methods, events, attributes, typedefs, and options.
- Use **TypeScript only** for type checking (`--noEmit`) and `.d.ts` declaration generation via `emitDeclarationOnly`.
- Use **`node:test`** for tests. Do not use Jest, Vitest, Mocha, Chai, or Testing Library.
- Use **esbuild** only through `scripts/_build-package.js`. Do not use Rollup, Vite, Webpack, Babel, or PostCSS.
- CSS must be **native CSS** only. Use `@layer`, custom properties, nesting where useful, and component-local selectors.
- Avoid unintended global CSS leakage. Use `document.adoptedStyleSheets`, component-scoped selectors, and light-DOM-safe selectors.
- Documentation is static HTML pages. Package docs live in `packages/<name>/docs/`.
- Docs are aggregated into `site/<package-folder-name>/` via `scripts/_build-docs.js`.

## File authoring conventions

Every JS source file must start with `// @ts-check`.

Runtime folder structure rules:
- In `src/`, `scripts/`, and `tests/`, keep `index.*` as the barrel or entrypoint.
- All non-index runtime files in `src/`, `scripts/`, and `tests/` must be underscore-prefixed, for example `_pix-button.js`, `_build-package.js`, or `_template.test.js`.
- Root script coverage lives in `scripts/tests/`, with one underscore-prefixed test file per script and `scripts/tests/index.js` as the test barrel.

Example JSDoc style:
```js
// @ts-check

/**
 * @typedef {"primary" | "secondary"} Variant
 */

/**
 * Normalize a variant value.
 * @param {string | null | undefined} value
 * @returns {Variant}
 */
export function normalizeVariant(value) { ... }
```

## Component structure

Each component package must:
- live in `packages/<component-name>/`
- have `src/`, `tests/`, `docs/`, `package.json`, `tsconfig.types.json`, `README.md`
- use `src/index.js` as the package barrel, plus `tests/index.js` as the package test barrel
- expose only ESM
- have zero runtime dependencies
- have scripts: `build`, `test`, `typecheck`, `validate`, `docs:build`, `docs:serve`
- document all attributes, events, CSS custom properties, parts, and slots

## Accessibility requirements

Every component must:
- use semantic HTML in light DOM
- preserve keyboard interactions
- use native `<button>` for buttons, native `<a>` for links
- not hide focus outlines without an accessible replacement
- support forced colors (`@media (forced-colors: active)`)
- support reduced motion (`@media (prefers-reduced-motion: reduce)`)

## Creating a new package

```sh
pnpm package:create pix-badge
```

## Building

```sh
pnpm build                              # build all packages
pnpm --filter @pix-galaxy/pix-button build  # build one package
```

## Testing

```sh
pnpm test                               # test all packages
pnpm --filter @pix-galaxy/pix-button test  # test one package
```
