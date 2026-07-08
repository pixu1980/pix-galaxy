# pix-galaxy — Handoff Document

> **Author:** Senior Software/Product Engineer  
> **Date:** 2026-07-07  
> **Purpose:** Complete project handoff for another AI session or developer to resume work seamlessly.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [ADR Log](#3-adr-log)
4. [Package Catalog](#4-package-catalog)
5. [Component API Reference](#5-component-api-reference)
6. [Design System & Tokens](#6-design-system--tokens)
7. [Development Workflow](#7-development-workflow)
8. [Testing](#8-testing)
9. [Release Process](#9-release-process)
10. [Known Issues & Technical Debt](#10-known-issues--technical-debt)
11. [Future Roadmap](#11-future-roadmap)

---

## 1. Project Overview

**pix-galaxy** is a monorepo of zero-runtime-dependency vanilla JS Web Components. Every component is:

- **Custom Elements v1** (no Shadow DOM, light DOM only)
- **WCAG 2.2 AA** compliant
- **Zero dependencies** (no frameworks, no libraries)
- **vanilla CSS** via `document.adoptedStyleSheets`
- **semantic HTML** with `data-part` selectors (no CSS classes)
- **`light-dark()`** for automatic light/dark mode
- **`oklch()`** colour space for perceptually uniform colours

### Repository

```
git@github.com:pixu1980/pix-galaxy.git
```

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | ≥20.11 |
| Package Manager | pnpm | ≥11.9 |
| Bundler | Vite | 8.x |
| Build | esbuild | 0.28.x |
| Types | TypeScript (JSDoc) | 6.x |
| Testing | node:test + Playwright | latest |
| Linting | ESLint | 9.x |
| Formatting | Prettier | 3.x |

---

## 2. Architecture

### 2.1 Monorepo Structure

```
pix-galaxy/
├── packages/
│   ├── pix-highlighter/          # Syntax highlighting (CSS Highlight API)
│   ├── pix-accent-color-selector/ # Accent colour picker
│   ├── pix-color-scheme-selector/ # Light/dark/system toggle
│   ├── pix-display-preferences/  # Popover display prefs
│   ├── pix-command/              # ⌘K command palette
│   ├── pix-color/                # OKLCH colour picker
│   ├── pix-recorder/             # Audio recorder with waveform
│   ├── pix-sortable/             # Drag & drop sortable list
│   ├── pix-splitter/             # Resizable panel splitter
│   ├── pix-toast/                # Toast notification system
│   ├── pix-foundations/          # CSS design tokens library
│   ├── pix-component-template/   # Scaffold template (private)
│   └── shared/                   # Shared runtime (docs, ssr-safe)
├── src/
│   └── docs/                     # Portal (component browser)
├── scripts/
│   ├── dev-all.mjs               # Multi-server dev launcher
│   ├── dev.mjs                   # Single Vite server launcher
│   ├── release.mjs               # Release orchestration
│   ├── scaffold-component.mjs    # New component generator
│   └── add-lightdark-fallback.mjs # CSS maintenance
├── e2e/
│   └── portal.spec.mjs           # Playwright test suite
├── docs/
│   ├── architecture-review.md    # Full architectural audit
│   └── plans/                    # Execution plans
└── playwright.config.mjs
```

### 2.2 Package Anatomy

Every component package follows the same structure:

```
packages/pix-<name>/
├── package.json                  # workspace:* deps
├── vite.config.mjs               # Vite config for docs site
├── tsconfig.types.json
├── scripts/
│   ├── build.mjs                 # esbuild bundling
│   ├── docs.mjs                  # markdown → HTML docs builder
│   ├── finalize-types.mjs
│   ├── raw-text-loader.mjs
│   ├── raw-text-plugin.mjs
│   ├── register-test-loader.mjs
│   └── release.mjs               # DEPRECATED — removed, use root script
├── src/
│   ├── index.js                  # Re-exports from components/
│   ├── index.types.js            # JSDoc typedefs
│   ├── components/
│   │   ├── index.js              # Barrel export
│   │   └── PascalName/
│   │       ├── PascalName.js     # Component class
│   │       └── PascalName.css    # Component styles
│   ├── shared/
│   │   └── _ds-tokens.css        # Legacy tokens (migrating to foundations)
│   ├── docs/
│   │   ├── index.html            # Docs entry
│   │   ├── index.js              # Docs app (uses shared template)
│   │   ├── index.css             # Docs styles
│   │   └── content/              # Markdown docs pages
│   └── tests/
│       └── smoke.test.js         # Minimal smoke test
```

### 2.3 Component Lifecycle Pattern

```js
class PixComponent extends HTMLElement {
  static formAssociated = true;          // Enable ElementInternals
  static observedAttributes = ['value']; // Reactive attributes
  static styles = null;                  // CSSStyleSheet singleton

  // Bound handlers (private fields, NEVER inline arrows)
  #onClick = (e) => this.#handleClick(e);
  #onKeydown = (e) => this.#handleKeydown(e);

  constructor() {
    super();
    this.#internals = this.attachInternals?.();  // Form participation
  }

  connectedCallback() {
    this.constructor.ensureStyles();  // Adopt CSS
    this.#render();                   // Build DOM
  }

  disconnectedCallback() {
    // Clean up ALL listeners that were added
  }
}
```

### 2.4 CSS Architecture

```css
@layer pix.reset, pix.foundations, pix.components;
```

- **`pix.reset`**: box-sizing, margin removal
- **`pix.foundations.*`**: radii, spacing, colours, typography, elevations
- **`pix.components`**: reserved for component-specific styles (via `@layer pix-galaxy { @layer pix-component { ... } }`)

**Focus ring** (`_focus.css`) is imported **unlayered** to always beat component CSS:

```css
/* Unlayered → highest cascade priority */
@import "./_focus.css";

/* Everything else is layered */
@import "./_colors.css" layer(pix.foundations.colors);
```

### 2.5 State Management

Components use **private class fields** (`#field`) for internal state. Reactive properties use getters/setters + `attributeChangedCallback`:

```js
get value() { return this.#color.toHEXString(); }
set value(v) { this.setAttribute('value', v); }

attributeChangedCallback(name, oldVal, newVal) {
  if (name === 'value') this.#updateDisplay();
}
```

No external state management. No stores. No signals (except vanilla reactive pattern).

---

## 3. ADR Log

### ADR-001: Light DOM over Shadow DOM

**Date:** 2026-06-01  
**Status:** Accepted

**Context:** Custom Elements can use Shadow DOM for encapsulation or Light DOM for simplicity.

**Decision:** All components use Light DOM + `document.adoptedStyleSheets`. No Shadow DOM, no `<template>` elements.

**Rationale:**
- Shadow DOM breaks form participation (need `ElementInternals`)
- Shadow DOM breaks global CSS (fonts, reset, design tokens)
- Shadow DOM adds performance cost (style recalculation per shadow root)
- Light DOM + `data-part` selectors provide sufficient encapsulation

**Consequences:**
- CSS uses `@layer` to isolate component styles
- Component styles are prefixed with component element selector (e.g., `pix-command [data-part="input"]`)
- Need to be careful about global CSS conflicts

### ADR-002: `adoptedStyleSheets` over `<link>` or `<style>`

**Date:** 2026-06-01  
**Status:** Accepted

**Context:** Components need to inject CSS into the page.

**Decision:** Use `document.adoptedStyleSheets` via a singleton `CSSStyleSheet` per component.

**Rationale:**
- No duplicate `<style>` elements for multiple component instances
- Styles are parsed once, shared across all instances
- Works with `@layer`, `@supports`, `@container`
- Fallback to single `<style>` element when `adoptedStyleSheets` not supported

**Consequences:**
- Order of stylesheet adoption matters (last wins)
- Use `includes()` check to avoid duplicate adoption
- Inline `?raw` CSS imports (Vite) or `bundle-text:` (Parcel)

### ADR-003: `light-dark()` over CSS custom properties + media query toggle

**Date:** 2026-06-15  
**Status:** Accepted

**Context:** Components need light/dark mode support.

**Decision:** Use `light-dark()` CSS function instead of `@media (prefers-color-scheme)` or JavaScript toggle.

**Rationale:**
- Single declaration handles both modes
- Works with `pix-color-scheme-selector` which sets `document.documentElement.style.colorScheme`
- No JavaScript needed for theme switching
- Supported in Chrome 119+, Safari 17.5+, Firefox 120+

**Consequences:**
- Add fallback before `light-dark()` for older browsers (see ADR-004)
- `light-dark()` reads from computed `color-scheme` on the element

### ADR-004: CSS fallback before `light-dark()`

**Date:** 2026-07-05  
**Status:** Accepted

**Context:** `light-dark()` unsupported on older browsers — declaration is completely dropped, not partially applied.

**Decision:** Always add a fallback value BEFORE the `light-dark()` declaration:

```css
--color: oklch(0.18 0.012 60);            /* fallback */
--color: light-dark(oklch(0.18 0.012 60), oklch(0.88 0.01 85));
```

**Rationale:** Browsers apply the last valid declaration. Old browsers: fallback applies. Modern browsers: `light-dark()` wins.

### ADR-005: Private class fields for internal state

**Date:** 2026-06-20  
**Status:** Accepted

**Context:** Component internal state needs encapsulation.

**Decision:** Use `#private` fields for all internal state, DOM references, and bound handlers. Public API via getters/setters.

**Rationale:**
- True privacy (not just convention with `_` prefix)
- Prevents accidental external access
- Works with `static {}` blocks for class-level initialisation

**Consequences:**
- Cannot be accessed by subclass — use `_protected` convention for extensible methods
- Old components (accent-color-selector, highlighter) use `_` prefix — migration needed

### ADR-006: Oklch colour space

**Date:** 2026-07-01  
**Status:** Accepted

**Context:** Components need a perceptually uniform colour space for colour pickers and design tokens.

**Decision:** Use `oklch()` for all colour values. Provide HSL/HEX/RGB in colour picker for compatibility.

**Rationale:**
- Perceptually uniform (equal distance in colour ≈ equal perceptual difference)
- HDR-ready
- Supported in Chrome 111+, Safari 15.4+, Firefox 113+
- `color-mix(in srgb, ...)` for colour manipulation

### ADR-007: Shared docs template over per-package duplication

**Date:** 2026-07-05  
**Status:** Accepted

**Context:** Each package has a documentation site. Initially duplicated per package.

**Decision:** Centralise docs template in `@pix-galaxy/shared/docs/docs-site.js`. Each package imports `createDocsSite()`, `buildDocsPages()`.

**Rationale:**
- Single source of truth for docs layout
- All sites get new features automatically (e.g., `pix-color-scheme-selector`)
- Consistent visual appearance

**Consequences:**
- Old components (highlighter, accent-color-selector, display-preferences) still use inline template — migration pending
- Shared CSS in `packages/shared/docs/docs.css` adopted automatically

### ADR-008: `ElementInternals` for form association

**Date:** 2026-07-05  
**Status:** Accepted

**Context:** Custom elements should participate in native HTML forms.

**Decision:** Use `ElementInternals` API (`static formAssociated = true`, `attachInternals()`, `setFormValue()`).

**Rationale:**
- Form data submission without hidden inputs
- Native validation API (`setValidity()`)
- Works with `<form>` elements

**Consequences:**
- Only pix-color and pix-sortable currently implement it
- JSDOM doesn't fully support `setFormValue` — guarded with `typeof` check

### ADR-009: Release via standard-version

**Date:** 2026-07-07  
**Status:** Accepted

**Context:** Manual versioning and changelog maintenance is error-prone.

**Decision:** Use `standard-version` for semver bump, CHANGELOG generation, and git tag creation. Single orchestration script discovers all packages.

**Rationale:**
- Conventional commits → automatic version bump
- CHANGELOG auto-generated from commit messages
- Standard industry tool
- Works with pnpm workspaces

**Consequences:**
- Requires conventional commit format for proper versioning
- Old per-package release scripts removed

### ADR-010: Single test runner suite over scattered tests

**Date:** 2026-07-07  
**Status:** Accepted

**Context:** Component testing was ad-hoc with varying quality.

**Decision:** Use Playwright for e2e tests (22 tests covering portal + all docs sites). Each component has a minimal node:test smoke test.

**Rationale:**
- Playwright catches real browser rendering issues
- Smoke tests verify element registration and basic rendering
- Combined: fast unit-level + comprehensive browser-level

**Consequences:**
- Tests depend on dev servers running (12 servers)
- CI needs dev server setup
- Portal card count test must be kept in sync with components.json

---

## 4. Package Catalog

### Published Packages

| Package | Version | Description | Port |
|---------|---------|-------------|------|
| `@pix-galaxy/pix-highlighter` | 0.1.0 | Syntax highlighting (CSS Highlight API) | 3007 |
| `@pix-galaxy/pix-accent-color-selector` | 0.1.0 | Accent colour picker | 3001 |
| `@pix-galaxy/pix-color-scheme-selector` | 0.1.0 | Light/dark/system toggle | 3003 |
| `@pix-galaxy/pix-display-preferences` | 0.1.0 | Display preferences popover | 3005 |
| `@pix-galaxy/pix-command` | 0.1.0 | ⌘K command palette | 3004 |
| `@pix-galaxy/pix-color` | 0.1.0 | OKLCH colour picker | 3002 |
| `@pix-galaxy/pix-recorder` | 0.1.0 | Audio recorder + waveform | 3008 |
| `@pix-galaxy/pix-sortable` | 0.1.0 | Drag & drop sortable list | 3009 |
| `@pix-galaxy/pix-splitter` | 0.1.0 | Resizable panel splitter | 3010 |
| `@pix-galaxy/pix-toast` | 0.1.0 | Toast notification system | 3011 |

### Private Packages

| Package | Description |
|---------|-------------|
| `@pix-galaxy/pix-foundations` | CSS design tokens (radii, spacing, colours, etc.) |
| `@pix-galaxy/pix-component-template` | Scaffold template for new components |
| `@pix-galaxy/shared` | Shared runtime (docs template, SSR helpers) |

### Portal

- **URL:** http://localhost:3000
- **Source:** `src/docs/`
- **Content:** `src/docs/content/components.json` — includes a "Coming Soon..." placeholder card

### Workspace Port Map

All 12 servers run on ports 3000–3011. The portal uses `getDevPort()` with fallback order:

```js
const order = [
  'pix-galaxy', 'pix-accent-color-selector', 'pix-color',
  'pix-color-scheme-selector', 'pix-command', 'pix-display-preferences',
  'pix-foundations', 'pix-highlighter', 'pix-recorder',
  'pix-sortable', 'pix-splitter', 'pix-toast',
];
// Port = 3000 + index
```

---

## 5. Component API Reference

### pix-command

```html
<pix-command src="/api/commands.json"></pix-command>

<!-- Or inline -->
<pix-command>
  <script type="application/json">[{ "id": "x", "label": "X" }]</script>
</pix-command>
```

| Prop/Attr | Type | Description |
|-----------|------|-------------|
| `open` | boolean | Toggle palette |
| `items` | PixCommandItem[] | Command items |
| `@command-selected` | Event | Fired on selection |

CMD+K (Mac) / Ctrl+K (Win/Linux) toggles globally.

### pix-color

```html
<pix-color name="brand" value="#6366F1"></pix-color>
```

| Prop/Attr | Type | Description |
|-----------|------|-------------|
| `value` | string | HEX colour |
| `expanded` | boolean | Panel open state |
| `name` | string | Form field name |
| `@color-change` | Event | Fired on colour change |

Formats: HEX, RGB, HSL, OKLCH. Always shows all 4 values simultaneously. `<input type="color">` under the hood. WCAG contrast checker.

### pix-recorder

```html
<pix-recorder max-duration="300" format="webm" filename="recording"></pix-recorder>
```

| Prop/Attr | Type | Description |
|-----------|------|-------------|
| `max-duration` | number | Auto-stop seconds (0 = no limit) |
| `format` | "webm" \| "ogg" | Audio format |
| `filename` | string | Download filename |
| `state` | "idle"\|"recording"\|"paused"\|"done" | Read-only state |
| `@recorder-complete` | Event | `{ blob, duration }` |

### pix-sortable

```html
<pix-sortable>
  <div data-sortable-value="1">Item 1</div>
  <div data-sortable-value="2">Item 2</div>
</pix-sortable>
```

| Prop/Attr | Type | Description |
|-----------|------|-------------|
| `values` | string[] | Read-only ordered values |
| `@sortable-change` | Event | `{ fromIndex, toIndex, items }` |

Drag handle auto-added. Keyboard: Alt+Arrow, Enter, Escape. Touch: long-press with 10px threshold.

### pix-splitter

```html
<pix-splitter orientation="horizontal">
  <div>Left</div>
  <div>Right</div>
</pix-splitter>
```

| Prop/Attr | Type | Description |
|-----------|------|-------------|
| `orientation` | "horizontal" \| "vertical" | Split direction |
| `min-panel-size` | number | Min panel size in px |
| `ratios` | number[] | Read-only size ratios |
| `@splitter-resize` | Event | While dragging |
| `@splitter-resize-end` | Event | Drag ended |

### pix-toast

```html
<pix-toast-stack position="top-right"></pix-toast-stack>
```

| Method | Returns | Description |
|--------|---------|-------------|
| `add(config)` | string | Add toast, returns ID |
| `dismiss(id)` | — | Dismiss by ID |
| `dismissAll()` | — | Dismiss all |

Config: `{ id?, title?, message, variant, duration, dismissible }`. Smart queuing (max-visible=5), dedup by ID.

### pix-highlighter

```html
<pre is="pix-highlighter" data-lang="js"><code>console.log('hello')</code></pre>
```

Customized built-in extending `<pre>`. Supports 15+ languages via lexers. 7+ colour themes. Uses CSS Custom Highlight API. Fallback to token spans.

---

## 6. Design System & Tokens

### pix-foundations

Import once per project:

```css
@import '@pix-galaxy/pix-foundations/foundations.css';
```

**Radii:** `--pix--r--{xs,sm,md,lg,xl,pill}` (2px → 999px)  
**Spacing:** `--pix--s--{xs,sm,md,lg,xl,2xl}` (0.25rem → 3rem)  
**Colours:** `--pix--c--{page,surface,text,text-muted,border,border-strong,accent,success,warning,danger}`  
**Focus:** `--pix--f--{width,style,offset,color}` (2px solid accent, 2px offset)  
**Elevations:** `--pix--e--{sm,md,lg}`  
**Typography:** `--pix--t--{font-family,font-family-mono,line-height,line-height-tight}`

All colour tokens use `light-dark()` for automatic theme switching. `--pix--f--color` defaults to `--pix--c--accent`.

---

## 7. Development Workflow

### Starting Dev Servers

```bash
pnpm dev:all    # Starts all 12 servers (3000–3011)
pnpm dev        # Starts only portal (3000)
```

The portal shows cards linking to each component's docs site. Ports are dynamically assigned by `dev-all.mjs` starting from 3000.

### Scaffolding a New Component

```bash
pnpm scaffold PixName "Description"
```

This copies `packages/pix-component-template/` → `packages/pix-name/`, replaces all `{%...%}` placeholders, installs deps, and builds docs.

After scaffold:
1. Add entry to `src/docs/content/components.json` (name, accent, keywords)
2. Add accent palette to `src/docs/index.css`
3. Add icon to `src/docs/index.js` ICONS map
4. Add known colour to `scripts/dev-all.mjs`
5. `pnpm install && pnpm dev:all`

### CSS `@import` Resolution

Stylesheets are concatenated via `?raw` imports and joined into a single `CSSStyleSheet`:

```js
import mainCSS from './PixComponent.css?raw';
import foundationsCSS from '@pix-galaxy/pix-foundations/foundations.css?raw';

const SHEET = [foundationsCSS, mainCSS].join('\n');
```

### Event Listener Cleanup (CRITICAL)

**Never use inline arrow functions in `addEventListener`:**

```js
// ❌ BAD — leaks on every mount/unmount
this.#bar.addEventListener('click', (e) => { ... });

// ✅ GOOD — stable reference
#onBarClick = (e) => { ... };
this.#bar.addEventListener('click', this.#onBarClick);
disconnectedCallback() { this.#bar.removeEventListener('click', this.#onBarClick); }
```

**Never use `.bind()` in `addEventListener`:**

```js
// ❌ BAD — new reference every time, cannot remove
this.addEventListener('click', this.#handleClick.bind(this));

// ✅ GOOD — pre-bound via private field
#onClick = (e) => this.#handleClick(e);
```

---

## 8. Testing

### Smoke Tests (22 total, 4.8s)

```bash
npx playwright test
```

Prerequisite: all 12 dev servers running (`pnpm dev:all`).

**Test groups:**

| Group | Tests | What it checks |
|-------|-------|----------------|
| Portal | 5 | Card count, href validity, click navigates, focus ring, color-scheme |
| Component docs | 11 | Each docs site loads with shell + heading |
| Cross-docs | 2 | Color scheme selector present, nav links present |
| Pix Highlighter | 3 | Toolbar visible, theme button border, menu options |
| Keyboard a11y | 1 | Enter activates nav link |

### Playwright Config

- Location: `playwright.config.mjs`
- Workers: 1 (sequential, avoids port conflicts)
- Timeout: 15s (10s for individual selectors)
- Viewport: 1280×720
- Headless: true

### Adding Tests

Add to `e2e/portal.spec.mjs`. Update `COMPONENTS` array when adding new packages.

---

## 9. Release Process

### Manual Release (Local)

```bash
pnpm release        # Bump + CHANGELOG + tag + publish
pnpm release:dry    # Preview only
pnpm release --force   # Force release even without changes
```

The script:
1. Ensures clean working tree
2. Discovers all non-private packages in `packages/`
3. For each: checks if changes exist since last `@pix-galaxy/pkg@version` tag
4. Runs `standard-version --tag-prefix "@pix-galaxy/pkg@"` for semver bump + CHANGELOG + tag
5. Runs `pnpm publish --access public`
6. Pushes tags

### CI/CD (GitHub Actions)

Triggered by tag push matching `@pix-galaxy/*@*`. Workflow in `.github/workflows/release.yml`:

1. Checks out repo
2. Extracts package name from tag
3. Builds library
4. Publishes to npm with provenance

**Required secrets:**
- `NPM_TOKEN` — npm automation token with publish access to `@pix-galaxy/*`

---

## 10. Known Issues & Technical Debt

### High Priority

- **light-dark() fallback missing in old components:** pix-accent-color-selector, display-preferences, highlighter, color-scheme-selector haven't been updated with fallback before `light-dark()`
- **Old template migration:** 4 packages (accent-color-selector, color-scheme-selector, display-preferences, highlighter) still use inline docs template instead of `@pix-galaxy/shared/docs/docs-site.js`
- **`_` vs `#` inconsistency:** Old components use `this._field` (public), new use `this.#field` (private). Need unified convention.

### Medium Priority

- **Test coverage:** Only smoke + e2e tests. No unit tests for individual component logic.
- **`@pix-galaxy/pix-foundations` not embeddable:** Docs site works but the package exports path requires Vite resolution. Direct `@import` from CSS works.
- **Component template missing `@pix-galaxy/pix-foundations`:** Scaffold template doesn't include foundations as a dependency yet.
- **Production builds not verified:** Only dev server tested. Vite production build may have issues.

### Low Priority

- **Console.log in docs examples:** Code examples in docs use `console.log` — fine for examples, not a real issue.
- **Scaffold script needs `.DS_Store` exclusion:** Copying template includes `.DS_Store` files on macOS.
- **dev-all.mjs port conflict:** If port range 3000–3011 is occupied, servers shift silently.

---

## 11. Future Roadmap

### Next Components (from architectural review)

1. **pix-combobox** — Accessible autocomplete with `aria-activedescendant`, fuzzy filtering, remote data
2. **pix-tabs** — Tab panel with `role="tablist"`, keyboard navigation, orientation
3. **pix-tooltip** — CSS anchor-positioning based tooltip with `role="tooltip"`
4. **pix-tree** — Tree view with async loading, checkbox support, keyboard navigation

### Infrastructure

- Migrate old 4 packages to shared docs template
- Add `@pix-galaxy/pix-foundations` to component template dependencies
- Add CI GitHub Actions workflow for PR validation (lint + test)
- Vite production build for all packages
- Bundle size monitoring

### Quality

- Unit tests for colour conversion library
- Accessibility audit with axe-core
- Visual regression tests with Playwright snapshots
- Bundle size budgets per component

---

*This document was generated on 2026-07-07. For questions, refer to the commit history or open an issue on GitHub.*
