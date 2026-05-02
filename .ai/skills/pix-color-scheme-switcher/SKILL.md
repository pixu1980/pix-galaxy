---
name: pix-color-scheme-switcher
description: Add or adapt a Pix light/dark/system color-scheme switcher as a Custom Elements v1 component. Use when Codex needs a persisted theme-mode control, `html[data-color-scheme]` integration, color-scheme meta synchronization, system `prefers-color-scheme` fallback, or a reusable Pix component that must follow pix-guidelines, pix-custom-element, pix-template-engine, pix-design-system, and pix-styleguides.
---

# pix Color Scheme Switcher

## Outcome
Add a reusable `<pix-color-scheme-switcher>` component that lets users choose `light`, `dark`, or `system`.

The component:
- uses Pix Custom Element conventions
- renders with `pix-template-engine` tagged template literals
- styles through `document.adoptedStyleSheets`
- uses pix-design-system tokens through component-scoped aliases
- persists choice in `localStorage`
- keeps `html[data-color-scheme]`, `html[data-color-scheme-mode]`, and `meta[name="color-scheme"]` synchronized

## Resources
- Component: [./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.js](./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.js)
- Template: [./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.template.js](./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.template.js)
- Constants: [./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.consts.js](./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.consts.js)
- Utilities: [./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.utils.js](./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.utils.js)
- Attributes: [./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.attributes.js](./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.attributes.js)
- Events: [./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.events.js](./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.events.js)
- CSS: [./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.css](./assets/ColorSchemeSwitcher/ColorSchemeSwitcher.css)
- Icon — light: [./assets/ColorSchemeSwitcher/icons/light.svg](./assets/ColorSchemeSwitcher/icons/light.svg)
- Icon — dark: [./assets/ColorSchemeSwitcher/icons/dark.svg](./assets/ColorSchemeSwitcher/icons/dark.svg)
- Icon — system: [./assets/ColorSchemeSwitcher/icons/system.svg](./assets/ColorSchemeSwitcher/icons/system.svg)

## Dependencies
Use these Pix skills together:
- `pix-custom-element` for `componentDecorator`, light DOM lifecycle, and shared helper location
- `pix-template-engine` for `TemplateEngine` and `engine.html`
- `pix-design-system` for tokens, layers, helpers, and theme CSS
- `pix-styleguides` for HTML, CSS, JavaScript, and accessibility checks

## Install Flow
1. Inspect target project for existing shared custom element helpers:
   - find `componentDecorator`
   - find `decorator/index.js`
   - find `events/index.js`
2. If missing, install shared helpers using `pix-custom-element`. Keep one canonical helper path.
3. Inspect target project for `TemplateEngine`. If missing, install it using `pix-template-engine`.
4. Copy `assets/ColorSchemeSwitcher/` into the project component directory, usually `src/components/ColorSchemeSwitcher/`.
5. Update import paths in `ColorSchemeSwitcher.template.js` and `ColorSchemeSwitcher.js`:
   - `../../template-engine/index.js` (in `template.js`) must point to the installed template engine
   - `../../lib/custom-element/decorator/index.js` (in the class file) must point to shared custom element helpers
   - `bundle-text:` imports for CSS and SVG icons must match bundler raw-string support (see Bundler support in `pix-custom-element`)
6. Import `ColorSchemeSwitcher.js` once in the app entrypoint.
7. Render `<pix-color-scheme-switcher></pix-color-scheme-switcher>` where the mode control belongs.
8. Ensure application/theme CSS responds to:
   - `html[data-color-scheme="light"]`
   - `html[data-color-scheme="dark"]`
   - `html[data-color-scheme-mode="system"]`

## File Structure

Every component folder follows this layout (PascalCase folder name, PascalCase file names):

```
ColorSchemeSwitcher/
  ColorSchemeSwitcher.js           # class + static decorator call
  ColorSchemeSwitcher.template.js  # TemplateEngine instance + compiled render functions (engine.html)
  ColorSchemeSwitcher.consts.js    # named constants (STORAGE_KEY, SCHEMES, META_CONTENT, …)
  ColorSchemeSwitcher.utils.js     # pure helper functions (isSupportedScheme, getStorage, …)
  ColorSchemeSwitcher.attributes.js  # { attrName: handler } — empty object if no observed attrs
  ColorSchemeSwitcher.events.js    # { eventType: handler } — DOM event map
  ColorSchemeSwitcher.css          # component styles (imported via bundle-text:)
  icons/
    light.svg                      # imported via bundle-text:./icons/light.svg
    dark.svg
    system.svg
```

## Component Rules
- Keep the element autonomous: `PixColorSchemeSwitcher extends HTMLElement`.
- Keep light DOM only. Do not add Shadow DOM.
- Do not use `<template>` elements.
- Keep `componentDecorator(this)` as the only static registration site.
- Declare `static attributes` from `ComponentName.attributes.js`.
- Register native DOM events through `static events` from `ComponentName.events.js`.
- Keep `MediaQueryList` listener cleanup in private fields, because it is outside the component DOM event map.
- Keep internal state in private fields.
- Expose behavior through `applyColorScheme(scheme)`, `currentScheme`, and `resolvedScheme`.

## Template Rules
- Use `new TemplateEngine({ rootDir: "/" })` for browser-safe tagged literal rendering.
- Compile render functions once at module load with `engine.html`.
- Import SVG icons as raw text strings via `bundle-text:./icons/<name>.svg` — do not inline SVG markup directly in the JS file.
- Insert imported SVG strings through template interpolation, not by constructing markup from runtime user data.
- Use semantic controls:
  - `section[role="radiogroup"]`
  - `label`
  - `input[type="radio"]`
  - visually hidden labels for icon-only UI

## CSS Rules
- Put component CSS in `@layer components.pix-color-scheme-switcher`.
- Use element and attribute selectors only.
- Do not use BEM, SMACSS, OOCSS, ITCSS, CUBE CSS, ids, or component classes.
- Define component aliases as `--pix-color-scheme-switcher--*`.
- Put design-system tokens on the right-hand side:
  - `--space-*`
  - `--color-*`
  - `--radius-*`
  - `--font-*`
- Preserve visible focus with `:focus-visible`.
- Respect `prefers-reduced-motion`.

## Behavior Contract
- Valid stored values: `light`, `dark`, `system`.
- Storage key: `color-scheme`.
- Invalid storage falls back to existing meta value, then `system`.
- `system` resolves through `prefers-color-scheme: dark`.
- Always set `html[data-color-scheme]` to the resolved mode, `light` or `dark`.
- Always set `html[data-color-scheme-mode]` to selected mode, `light`, `dark`, or `system`.
- Set `meta[name="color-scheme"]`:
  - `light` -> `light`
  - `dark` -> `dark`
  - `system` -> `light dark`
- Dispatch `pix-color-scheme-switcher:change` with `{ scheme, resolvedScheme }` after applying a mode.

## Validation
After install in a target project:
1. Run project tests, build, or validation scripts.
2. Manually verify:
   - radio keyboard navigation works
   - selected option persists across reload
   - `system` follows OS preference changes
   - `meta[name="color-scheme"]` updates
   - no duplicate `componentDecorator`, `decorator/`, or `events/` helpers are added
3. If routing is updated, run pix-galaxy router tests.

## Completion Report
Report:
- component paths installed
- import paths adjusted
- validation commands and results
- any fallback, missing dependency, or bundler raw-CSS change
