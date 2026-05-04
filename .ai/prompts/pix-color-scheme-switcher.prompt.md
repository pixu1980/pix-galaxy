---
name: "pix Color Scheme Switcher Install"
description: "Add or adapt a persisted light/dark/system color-scheme switcher as a Custom Elements v1 component following pix-custom-element, pix-template-engine, pix-design-system, and pix-styleguides conventions."
argument-hint: "Install target and options (e.g. 'install in src/components, bundler Parcel')"
agent: "agent"
---
Install `<pix-color-scheme-switcher>` following the `pix-color-scheme-switcher` skill.

Mandatory references:
- [skill pix-color-scheme-switcher](../skills/pix-color-scheme-switcher/SKILL.md)
- [component class](../skills/pix-color-scheme-switcher/assets/ColorSchemeSwitcher/ColorSchemeSwitcher.js)
- [template](../skills/pix-color-scheme-switcher/assets/ColorSchemeSwitcher/ColorSchemeSwitcher.template.js)
- [consts](../skills/pix-color-scheme-switcher/assets/ColorSchemeSwitcher/ColorSchemeSwitcher.consts.js)
- [utils](../skills/pix-color-scheme-switcher/assets/ColorSchemeSwitcher/ColorSchemeSwitcher.utils.js)
- [attributes](../skills/pix-color-scheme-switcher/assets/ColorSchemeSwitcher/ColorSchemeSwitcher.attributes.js)
- [events](../skills/pix-color-scheme-switcher/assets/ColorSchemeSwitcher/ColorSchemeSwitcher.events.js)
- [CSS](../skills/pix-color-scheme-switcher/assets/ColorSchemeSwitcher/ColorSchemeSwitcher.css)
- [icon light](../skills/pix-color-scheme-switcher/assets/ColorSchemeSwitcher/icons/light.svg)
- [icon dark](../skills/pix-color-scheme-switcher/assets/ColorSchemeSwitcher/icons/dark.svg)
- [icon system](../skills/pix-color-scheme-switcher/assets/ColorSchemeSwitcher/icons/system.svg)

Execute in order:
1. Inspect target project for `componentDecorator` (shared custom element helpers). If missing, install with `pix-custom-element`.
2. Inspect target project for `TemplateEngine`. If missing, install with `pix-template-engine`.
3. Copy `assets/ColorSchemeSwitcher/` into target component directory (usually `src/components/ColorSchemeSwitcher/`).
4. Update import paths in `ColorSchemeSwitcher.template.js` and `ColorSchemeSwitcher.js` to point to installed helpers and template engine.
5. Align `bundle-text:` import prefix with the target bundler (Parcel: `bundle-text:`, Vite/Rollup/webpack/esbuild: `?raw` or `text` loader).
6. Import `ColorSchemeSwitcher.js` once at the app entrypoint.
7. Render `<pix-color-scheme-switcher></pix-color-scheme-switcher>` in the desired location.
8. Ensure theme CSS responds to `html[data-color-scheme="light"]`, `html[data-color-scheme="dark"]`, and `html[data-color-scheme-mode="system"]`.

Hard rules:
- Autonomous element only (`PixColorSchemeSwitcher extends HTMLElement`). No Shadow DOM.
- Declare `static styles = styles;` and keep `componentDecorator(this)` in `static {}` as the only registration site.
- SVG icons imported as raw strings — never inlined in JS.
- `TemplateEngine` instantiated once in `ColorSchemeSwitcher.template.js`, not in the class file.
- Do not overwrite existing files unless user approved `--force`.

Mandatory final output:
1. `Installed files`: paths of every file written.
2. `Shared library path`: canonical `decorator/` and `events/` location.
3. `Bundler config`: raw-text import method used.
4. `Validation`: element renders and persists `localStorage` on scheme change.
5. `Open items`: theme CSS, polyfills, or manual integration steps.
