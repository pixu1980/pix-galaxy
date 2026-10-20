# ADR-028: Accept docs-only workspace cycles with `ignoreWorkspaceCycles`

## Status

Accepted

## Context

Every package's docs site is an aggregator: it imports the shared template from `@pix-galaxy/pix-core` (`docs/docs-site.js`), the `@pix-galaxy/pix-color-scheme-selector` control and `@pix-galaxy/pix-highlighter` for code examples. The shared template itself mounts `@pix-galaxy/pix-a11y` and `@pix-galaxy/pix-color-scheme-selector`. Those documentation-only edges close the package graph: `pix-core` ↔ `pix-a11y`, `pix-color-scheme-selector` ↔ `pix-foundations`, `pix-foundations` ↔ `pix-highlighter`.

pnpm refuses to run recursive workspace tasks when the graph has a cycle (`ERR_PNPM_TASK_CYCLE`), **regardless of which dependency field holds the edge**: a two-package reproduction with both edges declared in `devDependencies` fails the same way. Measured on `develop`, the four commands declared in `.github/workflows/ci.yml` — `pnpm -r --if-present run test`, `typecheck`, `lint`, `build:lib` — all aborted before running, so CI could not gate anything. Moving workspace links between `dependencies` and `devDependencies` does not fix it.

The edges are documentation-time only, so no runtime is affected: in `packages/*/src` (excluding `src/docs` and `src/tests`) a package imports a sibling only in `pix-a11y` (side-effect import of `pix-accent-color-selector`) and `pix-highlighter` (`pix-foundations` CSS via `?raw`). `packages/pix-core/scripts/build.mjs` bundles with esbuild and no external list, so published artifacts are self-contained.

## Decision

Keep the docs-only edges and set `ignoreWorkspaceCycles: true` in `pnpm-workspace.yaml`, so recursive tasks run in an arbitrary order instead of aborting.

Keep each link in `devDependencies` whenever the importing package does not use the sibling at runtime, so published dependency sets stay empty (ADR-020). No task order is required today: every package builds from its own sources plus `pix-core` scripts referenced by path.

## Consequences

Positive:

- CI gates (`test`, `typecheck`, `lint`, `build:lib`) run again
- No runtime, publishing or behavior change
- The accepted trade-off is documented instead of hidden in a config file

Negative:

- Recursive tasks lose topological ordering: a future package that needs a sibling `artifact/` at build time would fail until the edge is broken properly
- The cycles stay in the graph and are documented rather than prevented

Follow-up: remove the `pix-core` docs edges either by importing siblings through relative `../<package>/artifact/index.js` paths — the pattern already used for `@pix-galaxy/pix-vanilla-reactive` in `pix-core/docs/docs-site.js` — or by splitting the docs tooling into a private `pix-docs-tooling` package (plan step S4.1, ADR-020 / DSL-09).

## Tags

workspace, dependencies, pnpm, docs, ci
