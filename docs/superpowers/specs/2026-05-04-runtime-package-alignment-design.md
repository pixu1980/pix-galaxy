# Runtime Package Alignment Design

## Purpose

Align runtime packages with the current pix skill stack so generated and maintained packages are self-contained, structurally consistent, and no longer depend on relative links back into skill asset folders.

## Problems To Fix

1. The local `packages/pix-design-system` package links CSS back to skill assets instead of materializing package-owned CSS source.
2. Runtime component packages (`pix-button`, `pix-card`, `pix-highlighter`, `pix-baseline`) still use a Shadow DOM/template scaffold that conflicts with `pix-custom-element` guidance.
3. The current package scaffold in `scripts/_create-package.js` generates the outdated component model.
4. The `pix-custom-element` sample folder, skill text, and scaffolder are not fully synchronized.

## Scope

This refactor includes:

- `packages/pix-design-system`
- `packages/pix-button`
- `packages/pix-card`
- `packages/pix-highlighter`
- `packages/pix-baseline`
- root scaffolding/build scripts that create or bundle package runtime source
- involved skill docs and reference samples for `pix-custom-element`, `pix-design-system`, `pix-template-engine`, and `pix-styleguides`

## Chosen Architecture

Use a package-self-contained structure for runtime component packages.

Each component package will keep all runtime source under its own `src/` tree:

```text
src/
  index.js
  index.css
  shared/
    custom-element/
      decorator/
      events/
    template-engine/
      index.js
      _filters.js
      _renderer.js
      _expression-parser.js
  components/
    PixButton/
      PixButton.js
      PixButton.template.js
      PixButton.consts.js
      PixButton.utils.js
      PixButton.attributes.js
      PixButton.events.js
      styles/
        pix-button.css
        _core.css
        states/
          _states.css
      icons/
```

Rationale:

- stays compatible with current per-package `tsconfig.types.json`
- uses a single workspace shared runtime package with stable bare imports
- keeps each published component package lean while centralizing author-time helpers
- matches the current `pix-custom-element` scaffolder for this monorepo

## Design System Packaging

`packages/pix-design-system` must own its CSS source. The generated package may still originate from shared skill templates, but the package checked into the repo and the package emitted by install/package flows must contain materialized CSS files inside `src/`.

The single source of truth remains the skill shared assets. Package output is a copied/materialized result, not a runtime relative link.

## Component Runtime Rules

Every runtime component package must:

- use light DOM only
- register through `componentDecorator(this)` in a `static {}` block
- use the shared workspace runtime package at `packages/shared/`, imported as `@pix-galaxy/shared/...`
- avoid package-local `src/shared/` copies and standalone `src/index.css` barrels
- re-export public helpers such as `normalizeVariant` from the component entry module
- render through `TemplateEngine` tagged template literals compiled at module load
- keep component CSS in `@layer components.<tag>` and consume pix-design-system tokens on the right-hand side of component-scoped tokens
- document public APIs and internal helpers with JSDoc where missing

## Refactor Strategy

1. Add failing tests for package materialization and package scaffolding expectations.
2. Update generators/build support first (`scripts/_create-package.js`, `scripts/_build-package.js`, skill scaffold tests).
3. Materialize `packages/pix-design-system` CSS into package-owned files.
4. Migrate existing component packages to the shared-runtime custom-element structure.
5. Update skill docs, instructions, and sample files so documentation matches generated output.
6. Run tests, validate, and build across the repo.

## Validation

Required validation after implementation:

```sh
node --test scripts/tests/index.js
node --test ./.github/skills/pix-design-system/scripts/install-design-system.test.mjs
node --test ./.github/skills/pix-custom-element/scripts/scaffold-component.test.mjs
pnpm test
pnpm validate
pnpm build
```

## Notes

- No git commit is included in this task.
- Skill docs remain in English.
