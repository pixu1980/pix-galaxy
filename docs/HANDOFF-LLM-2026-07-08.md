# pix-galaxy — LLM Handoff

**Date:** 2026-07-08  
**Audience:** future LLM/developer session  
**Scope:** repo architecture, design-system consolidation, component renames, build tooling, formatting/linting, validation status.

---

## 1. Executive Summary

This session performed a broad consolidation of pix-galaxy around three directions:

1. **Design-system source of truth moved into `packages/pix-foundations/`.**

   - Typography, focus ring, radius, spacing, and control tokens now live there.
   - Component CSS should not own focus/typography/spacing/radius primitives.

2. **`pix-display-preferences` was renamed to `pix-a11y-panel`.**

   - Package folder, package name, custom element tag, class, CSS selectors, docs, tests, and portal references were updated.

3. **Shared runtime/build tooling was moved into `packages/pix-core/`.**
   - Former `packages/shared` became `packages/pix-core`.
   - Duplicated package scripts were removed and packages delegate to `pix-core/scripts/*`.

Validation after latest changes:

- `pnpm format`: pass
- `pnpm format:check`: pass
- `pnpm lint`: pass with warnings only
- CSS parse with `lightningcss`: 0 errors
- `pix-a11y-panel` tests: 56 pass
- Relevant artifact rebuilds: pass
- Portal dev server: `http://localhost:3000/`

---

## 2. Current Dev Server State

Only portal server should be active:

```text
http://localhost:3000/
```

Verified last:

- only port 3000 busy
- only `scripts/dev.mjs --name portal --port 3000`
- only `vite.js --port 3000 --config vite.config.mjs`

Useful reset command:

```bash
pkill -f "vite" 2>/dev/null || true
pkill -f "parcel" 2>/dev/null || true
pkill -f "scripts/dev.mjs" 2>/dev/null || true
sleep 2
pnpm dev --port 3000
```

---

## 3. Major Changes Completed

### 3.1 Package Rename: `pix-display-preferences` → `pix-a11y-panel`

Changed:

| Old                                   | New                          |
| ------------------------------------- | ---------------------------- |
| `packages/pix-display-preferences/`   | `packages/pix-a11y-panel/`   |
| `@pix-galaxy/pix-display-preferences` | `@pix-galaxy/pix-a11y-panel` |
| `<pix-display-preferences>`           | `<pix-a11y-panel>`           |
| `PixDisplayPreferences`               | `PixA11yPanel`               |
| `DisplayPreferencesPopover/`          | `A11yPanel/`                 |
| `@layer pix-display-preferences`      | `@layer pix-a11y-panel`      |
| `pix-display-preferences` storage key | `pix-a11y-panel`             |

Important files:

- `packages/pix-a11y-panel/package.json`
- `packages/pix-a11y-panel/src/components/A11yPanel/_A11yPanel.js`
- `packages/pix-a11y-panel/src/components/A11yPanel/_A11yPanel.css`
- `src/docs/index.js`
- `src/docs/content/components.json`
- `.github/workflows/pages.yml`
- `e2e/portal.spec.mjs`

### 3.2 A11y Panel Behavior

Portal now mounts component directly:

```html
<pix-color-scheme-selector></pix-color-scheme-selector> <pix-a11y-panel></pix-a11y-panel>
```

Removed broken custom portal button that called `togglePopover()` on the custom element.

A11y panel includes:

- `accent-color-selector`
- accessibility checkboxes:
  - reduce motion
  - reduce transparency
  - increase contrast
- typography controls:
  - font scale
  - line-height
  - heading font
  - body font
  - code font
- radius picker

A11y panel no longer embeds `pix-color-scheme-selector`; color scheme remains in portal topbar.

### 3.3 Design-System Consolidation in `pix-foundations`

Important files:

- `packages/pix-foundations/lib/_typography.css`
- `packages/pix-foundations/lib/_focus.css`
- `packages/pix-foundations/lib/_radii.css`
- `packages/pix-foundations/lib/_spacings.css`
- `packages/pix-foundations/lib/_controls.css`
- `packages/pix-foundations/lib/foundations.css`

`_controls.css` was added.

Control heights:

```css
--pix--ctrl--h-sm: 3.6rem;
--pix--ctrl--h-md: 4rem;
--pix--ctrl--h-lg: 4.4rem;
--pix--ctrl--h: var(--pix--ctrl--h-md);
```

Control API:

- `data-size="sm|md|lg"`
- `data-variant="primary|secondary"`
- checkbox/radio label wrappers share control height
- border/background/placeholder/check tokens centralized

Focus:

- focus ring only in `packages/pix-foundations/lib/_focus.css`
- no component-local `:focus-visible`, `outline`, or `outline-offset`

Typography:

- text props only in `packages/pix-foundations/lib/_typography.css` and required foundations control/reset files
- removed from component/docs CSS:
  - `font-size`
  - `line-height`
  - `font-family`
  - `font-weight`
  - `letter-spacing`
  - `text-transform`
  - `font`

Radius:

- radius presets centralized in `packages/pix-foundations/lib/_radii.css`
- `rounded` uses `0.25rem` for 4px-equivalent radius
- `px > 3` converted to `rem`

Spacing:

- `gap`, `padding`, `margin`, `border-radius` outside foundations should use tokens.

### 3.4 Shared Runtime Rename: `shared` → `pix-core`

Changed:

| Old                  | New                    |
| -------------------- | ---------------------- |
| `packages/shared`    | `packages/pix-core`    |
| `@pix-galaxy/shared` | `@pix-galaxy/pix-core` |

`pix-core` contains:

```text
packages/pix-core/docs/docs-site.js
packages/pix-core/docs/docs.css
packages/pix-core/dom/ssr-safe.js
packages/pix-core/scripts/build.mjs
packages/pix-core/scripts/docs.mjs
packages/pix-core/scripts/finalize-types.mjs
packages/pix-core/scripts/raw-text-loader.mjs
packages/pix-core/scripts/raw-text-plugin.mjs
packages/pix-core/scripts/register-test-loader.mjs
```

Duplicated per-package build/test/doc scripts were deleted.

Package scripts now call shared scripts, for example:

```json
{
  "build:lib": "node ../pix-core/scripts/build.mjs && pnpm build:types",
  "docs:build": "node ../pix-core/scripts/docs.mjs",
  "test": "pnpm docs:build && node --test --import ../pix-core/scripts/register-test-loader.mjs ./src/tests/*.test.js"
}
```

`raw-text-plugin.mjs` now supports package specifiers such as:

```js
import foundationsCSS from '@pix-galaxy/pix-foundations/foundations.css?raw';
```

This fixed `pix-highlighter build:lib`.

### 3.5 Formatting and Linting

Root scripts updated:

```json
{
  "format": "prettier --write '**/*.{js,mjs,cjs,css,html,md,json,yml,yaml}'",
  "format:check": "prettier --check '**/*.{js,mjs,cjs,css,html,md,json,yml,yaml}'",
  "lint:format": "prettier --check '**/*.{js,mjs,cjs,css,html,md,json,yml,yaml}'",
  "quality": "pnpm format:check && pnpm lint"
}
```

`.prettierignore` excludes three uninitialized template files containing `{%PLACEHOLDER%}` tokens that are invalid JS:

```text
packages/pix-component-template/src/components/ComponentName/_ComponentName.js
packages/pix-component-template/src/index.types.js
packages/pix-component-template/src/tests/components.test.js
```

ESLint config expanded with browser/test globals and ignores for template placeholder files.

---

## 4. Validation Commands

Run after future edits:

```bash
pnpm format:check
pnpm lint
pnpm --filter @pix-galaxy/pix-a11y-panel test
```

CSS parse validation used in this session:

```bash
node --input-type=module - <<'NODE'
import { transform } from './node_modules/.pnpm/lightningcss@1.32.0/node_modules/lightningcss/node/index.js';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
const files = execSync("find src packages -name '*.css' -not -path '*/node_modules/*' -not -path '*/dist/*' -not -path '*/artifact/*'", { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean);
let bad = [];
for (const f of files) {
  try {
    transform({ filename: f, code: Buffer.from(readFileSync(f)), minify: false, errorRecovery: false });
  } catch (e) {
    bad.push(`${f}:${e.loc?.line ?? '?'}:${e.loc?.column ?? '?'} ${e.message}`);
  }
}
console.log('css-parse-errors', bad.length);
if (bad.length) console.log(bad.join('\n'));
process.exit(bad.length ? 1 : 0);
NODE
```

Source policy scans used:

```bash
# Focus outside foundations
rg -n "focus-visible|outline|outline-offset|--pix-ds-focus-ring|--pix--f--" \
  --glob '!**/node_modules/**' --glob '!**/artifact/**' --glob '!**/dist/**' \
  --glob '*.{css,js,cjs}' src packages | grep -v 'packages/pix-foundations/lib/_focus.css'

# Text props outside foundations
rg -n "^[[:space:]]*(font-size|line-height|font-family|font-weight|letter-spacing|text-transform|font):" \
  --glob '!**/node_modules/**' --glob '!**/artifact/**' --glob '!**/dist/**' \
  --glob '*.css' src packages | grep -v 'packages/pix-foundations/lib/'
```

Latest status:

- Prettier format/check: pass
- ESLint: pass with warnings only
- CSS parser: pass, 0 errors
- CSSDoc first-token check: pass
- `pix-a11y-panel` tests: pass, 56 tests

---

## 5. Known Warnings / Open Items

### 5.1 ESLint warnings remain

`pnpm lint` passes but warnings remain in legacy packages:

- `prefer-const` warnings in `pix-highlighter` lexer files
- unused variables in some older components/tests
- unused private class members in several components

These are warnings, not blocking errors.

### 5.2 Large uncommitted diff

Repo contains many uncommitted changes, including `.agents/` files and package docs. Future session should inspect carefully before committing.

Recommended:

```bash
git status --short
git diff --stat
git diff -- packages/pix-foundations packages/pix-core packages/pix-a11y-panel package.json pnpm-lock.yaml
```

### 5.3 Artifacts and source divergence risk

Portal imports packages through package exports, which point to `artifact/index.js`. If source changes and artifacts are not rebuilt, UI may still show old behavior.

Always rebuild affected package artifacts:

```bash
pnpm --filter @pix-galaxy/pix-accent-color-selector build:lib
pnpm --filter @pix-galaxy/pix-color-scheme-selector build:lib
pnpm --filter @pix-galaxy/pix-a11y-panel build:lib
```

### 5.4 Placeholder template files

`pix-component-template` contains uninitialized `{%PLACEHOLDER%}` JS files. These are intentionally excluded from Prettier and ESLint parsing.

---

# ADR Log

## ADR-001: Rename `pix-display-preferences` to `pix-a11y-panel`

**Status:** Accepted  
**Date:** 2026-07-08

### Context

The component formerly called `pix-display-preferences` primarily exposes accessibility, typography, radius, and display preferences. The user clarified the intended name should be `pix-a11y-panel`.

### Decision

Rename package, custom element, class, CSS selectors, storage key, docs, tests, and portal references from `pix-display-preferences` to `pix-a11y-panel`.

### Consequences

Positive:

- Name reflects user intent and product semantics.
- Portal and component catalog use consistent naming.

Negative:

- Breaking API/package rename.
- Existing saved localStorage under old key is not migrated.

### Follow-up

If backward compatibility is needed, add one-time migration from `pix-display-preferences` storage key.

---

## ADR-002: Centralize design-system foundations in `pix-foundations`

**Status:** Accepted  
**Date:** 2026-07-08

### Context

Component CSS duplicated focus ring, typography, spacing, radius, and control styles. User required a single source of truth.

### Decision

Move foundational tokens and global rules into `packages/pix-foundations/lib/`:

- typography in `_typography.css`
- focus in `_focus.css`
- radii in `_radii.css`
- spacing in `_spacings.css`
- controls in `_controls.css`

Component CSS must use foundations tokens for:

- focus
- border-radius
- gap
- padding
- margin
- controls sizing
- typography

### Consequences

Positive:

- Consistent control sizes and focus ring across components.
- Lower component CSS duplication.
- Better design-system governance.

Negative:

- Broad CSS churn.
- Existing component-specific text/spacing details removed or tokenized.
- Artifact rebuild mandatory to see portal changes.

### Follow-up

Future components must not define local focus/text/spacing primitives unless adding new foundations tokens first.

---

## ADR-003: Centralize focus ring in `pix-foundations`

**Status:** Accepted  
**Date:** 2026-07-08

### Context

Components contained local `:focus-visible`, `outline`, and focus box-shadow rules. User required focus ring centralization.

### Decision

Only `packages/pix-foundations/lib/_focus.css` manages focus ring.

Focus selectors in component/docs CSS were removed. Browser focus globals remain in ESLint config only.

### Consequences

Positive:

- Focus ring consistency.
- Lower risk of inaccessible missing focus states.
- WCAG focus behavior controlled globally.

Negative:

- Components cannot customize focus style locally.
- If a component needs special focus geometry, it must be handled through foundations tokens or structural CSS, not a local outline.

### Follow-up

Add dedicated focus tokens in `pix-foundations` if special offset/width variants are needed.

---

## ADR-004: Centralize shared runtime and scripts in `pix-core`

**Status:** Accepted  
**Date:** 2026-07-08

### Context

Every component package duplicated scripts:

- `build.mjs`
- `docs.mjs`
- `finalize-types.mjs`
- `raw-text-loader.mjs`
- `raw-text-plugin.mjs`
- `register-test-loader.mjs`

Package `packages/shared` already held docs and SSR helpers, but name was generic.

### Decision

Rename `packages/shared` to `packages/pix-core` and move shared build/test/docs scripts there.

Update all package scripts to call `../pix-core/scripts/*`.

### Consequences

Positive:

- Duplicated scripts removed.
- Shared raw text plugin now fixed once for all packages.
- Package docs builder centralized.

Negative:

- Workspace dependency rename affects many package manifests.
- `pix-core` now has build-time dependency on `esbuild`.

### Follow-up

Keep package-specific scripts only when genuinely package-specific. Otherwise add behavior to `pix-core/scripts/*`.

---

## ADR-005: Keep `pix-foundations` independent of `pix-core`

**Status:** Accepted  
**Date:** 2026-07-08

### Context

Renaming `shared` to `pix-core` initially created a cycle:

```text
pix-core → pix-color-scheme-selector → pix-foundations → pix-core
```

### Decision

Remove `pix-core` dependency from `pix-foundations`.

### Consequences

Positive:

- Avoids cyclic workspace dependency.
- Keeps design tokens package low-level and independent.

Negative:

- Foundations docs may import `pix-core` at docs-app level, but package manifest should not make foundations runtime depend on core.

### Follow-up

Maintain foundations as leaf/primitive design-system package.

---

## ADR-006: Root formatting and linting are reproducible scripts

**Status:** Accepted  
**Date:** 2026-07-08

### Context

User required formatting/linting across JS, CSS, HTML and reusable npm scripts.

### Decision

Root `package.json` now exposes:

```json
{
  "format": "prettier --write '**/*.{js,mjs,cjs,css,html,md,json,yml,yaml}'",
  "format:check": "prettier --check '**/*.{js,mjs,cjs,css,html,md,json,yml,yaml}'",
  "lint:format": "prettier --check '**/*.{js,mjs,cjs,css,html,md,json,yml,yaml}'",
  "quality": "pnpm format:check && pnpm lint"
}
```

### Consequences

Positive:

- Formatting is reproducible.
- CI can call `pnpm quality`.

Negative:

- Uninitialized scaffold placeholders need `.prettierignore` exclusions because they are not valid JS.

### Follow-up

Consider adding `lint:css` with a CSS parser/stylelint if desired.

---

## ADR-007: Validate CSS with a real parser after automated refactors

**Status:** Accepted  
**Date:** 2026-07-08

### Context

A previous automated CSS tokenization pass introduced syntax errors such as broken `var()` and `light-dark()` expressions.

### Decision

Use `lightningcss` parser validation after any broad CSS transformation.

### Consequences

Positive:

- Detects syntax errors not caught by grep or Prettier.
- Prevents broken runtime styles.

Negative:

- Requires command snippet or script wrapper until formalized.

### Follow-up

Promote CSS parser validation into root `quality` script or a dedicated `lint:css` script.

---

## 6. Recommended Next Steps

1. Review large git diff carefully.
2. Decide whether to commit `.agents/` changes; many are unrelated to package runtime.
3. Add formal `lint:css` script using `lightningcss` parser check.
4. Clean remaining ESLint warnings when convenient.
5. Consider storage migration from old `pix-display-preferences` key.
6. Run full portal smoke/e2e after hard browser reload.
7. If preparing PR, include explicit breaking-change notice for `pix-a11y-panel` rename.
