---
description: "Use when adding or adapting a Pix light/dark/system color-scheme switcher — including `html[data-color-scheme]` integration, color-scheme meta synchronization, system `prefers-color-scheme` fallback, and persisted theme-mode control."
name: "pix Color Scheme Switcher"
applyTo: "**/*.{js,mjs,css,html}"
---
# pix Color Scheme Switcher Instructions

- Install `<pix-color-scheme-switcher>` as an autonomous Custom Element v1 using light DOM and `componentDecorator`.
- Follow the full `pix-custom-element` conventions: `adoptedStyleSheets`, `static {}` block, `static attributes`, `static events`.

## File structure

Every component folder uses PascalCase (folder and file names):

```
ColorSchemeSwitcher/
  ColorSchemeSwitcher.js             # class + static decorator call
  ColorSchemeSwitcher.template.js    # TemplateEngine instance + compiled engine.html render functions
  ColorSchemeSwitcher.consts.js      # named constants (STORAGE_KEY, SCHEMES, META_CONTENT)
  ColorSchemeSwitcher.utils.js       # pure helpers (isSupportedScheme, getStorage, getSystemMedia)
  ColorSchemeSwitcher.attributes.js  # { attrName: handler } — empty object when no observed attrs
  ColorSchemeSwitcher.events.js      # { eventType: handler } — DOM event map
  ColorSchemeSwitcher.css            # component styles imported via bundle-text:
  icons/
    light.svg                        # imported via bundle-text:./icons/light.svg
    dark.svg
    system.svg
```

## Behavior contract

- Valid schemes: `light`, `dark`, `system`. Storage key: `color-scheme`.
- Invalid storage → fall back to existing meta, then `system`.
- `system` resolves via `prefers-color-scheme: dark`.
- Always set `html[data-color-scheme]` to resolved value (`light` or `dark`).
- Always set `html[data-color-scheme-mode]` to selected value (`light`, `dark`, or `system`).
- Set `meta[name="color-scheme"]`: `light` → `"light"`, `dark` → `"dark"`, `system` → `"light dark"`.
- Expose `applyColorScheme(scheme)`, `currentScheme`, and `resolvedScheme`.
- Keep `MediaQueryList` listener in private fields for manual cleanup.

## Template and rendering

- Compile render functions once at module load with `engine.html` inside `ColorSchemeSwitcher.template.js`.
- Import SVG icons as raw strings via `bundle-text:./icons/<name>.svg`. Never inline SVG markup in JS.
- Use semantic controls: `section[role="radiogroup"]`, `label`, `input[type="radio"]`, visually hidden labels.

## CSS rules

- Layer: `@layer components.pix-color-scheme-switcher`.
- Element and attribute selectors only. No classes, no IDs.
- Component aliases: `--pix-color-scheme-switcher--*` mapped to design-system tokens (`--space-*`, `--color-*`, `--radius-*`, `--font-*`).
- Preserve `:focus-visible`. Respect `@media (prefers-reduced-motion: reduce)`.

## Theme integration

After installing the component, ensure application CSS responds to:
- `html[data-color-scheme="light"]`
- `html[data-color-scheme="dark"]`
- `html[data-color-scheme-mode="system"]`
