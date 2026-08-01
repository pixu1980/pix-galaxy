# @pix-galaxy/pix-a11y-panel

@pix-galaxy/pix-a11y-panel is a browser-first display preferences popover Web Component designed for the pix-galaxy suite. It provides an accessible popover panel for adjusting color scheme, accent color, accessibility options, typography, and corner radius preferences - all persisted to localStorage and applied to the document in real time.

Live docs site: https://pixu1980.github.io/pix-a11y-panel/

## Getting Started

### Install

```bash
pnpm add @pix-galaxy/pix-a11y-panel
```

### Basic usage

The component self-registers as a custom element. Drop it in your HTML and import the package once:

```html
<script type="module">
  import '@pix-galaxy/pix-a11y-panel';
</script>

<pix-a11y-panel></pix-a11y-panel>
```

### How it works

- Persists all preferences in `localStorage` under `pix-a11y-panel`.
- Manages colour scheme via `<pix-color-scheme-selector>`.
- Manages accent colour via `<pix-accent-color-selector>`.
- Applies accessibility attributes (`data-reduce-motion`, `data-reduce-transparency`, `data-increase-contrast`) on `<html>`.
- Sets font scale, heading/body/code font stacks as CSS custom properties.
- Sets `data-radius-preset` for corner style.
- Uses the native Popover API with a click-driven fallback for unsupported browsers.

## Package API

### Exports

| Symbol                              | Description                                 |
| ----------------------------------- | ------------------------------------------- |
| `PixA11yPanel`                      | Component class (extends `HTMLElement`)     |
| `DEFAULT_PREFERENCES`               | Default preference values                   |
| `STORAGE_KEY`                       | The `localStorage` key used for persistence |
| `ACCESSIBILITY_OPTIONS`             | Array of accessibility toggle definitions   |
| `RADIUS_PRESET_OPTIONS`             | Array of corner radius preset definitions   |
| `FONT_SCALE_OPTIONS`                | Array of font scale percentage options      |
| `HEADING_FONT_OPTIONS`              | Array of heading font options               |
| `BODY_FONT_OPTIONS`                 | Array of body font options                  |
| `CODE_FONT_OPTIONS`                 | Array of code font options                  |
| `readPreferences()`                 | Read saved preferences from localStorage    |
| `applyPreferencesToDocument(prefs)` | Apply preferences to the document           |

### Programmatic example

```js
import {
  PixA11yPanel,
  applyPreferencesToDocument,
  DEFAULT_PREFERENCES,
} from '@pix-galaxy/pix-a11y-panel';

// Apply defaults programmatically
applyPreferencesToDocument(DEFAULT_PREFERENCES);

// Or use the component
const prefs = document.querySelector('pix-a11y-panel');
prefs.updatePreference('fontScale', '125%');
```

## Browser behaviour

- Uses `CSSStyleSheet` + `adoptedStyleSheets` for scoped component styles.
- Persists preferences in `localStorage` under `pix-a11y-panel`.
- Integrates `@pix-galaxy/pix-color-scheme-selector` and `@pix-galaxy/pix-accent-color-selector`.
- Processes preferences on `connectedCallback` and on every preference change.
- Uses the native Popover API (`popover="auto"`) with a click/keyboard fallback.
- Accessible: uses `role="dialog"`, `aria-labelledby`, `aria-label`, `role="radiogroup"`, and visually hidden text labels.

## Development

```bash
pnpm install
pnpm test
pnpm build
```

Repo commands:

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `pnpm build:lib`  | Build npm artifacts (ESM + CJS) |
| `pnpm build:site` | Build docs site                 |
| `pnpm build`      | Build library and site          |
| `pnpm dev`        | Start Vite docs dev server      |
| `pnpm test`       | Run component and site tests    |

Library build outputs:

- `artifact/index.js` - ESM
- `artifact/index.cjs` - CommonJS
- `artifact/index.d.ts` - TypeScript declarations

Docs source: `src/docs/content/`. Docs app source: `src/docs/`, builds to `dist/`.

## Release Readiness

This repository includes the standard open-source governance and delivery files expected by GitHub and npm:

- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- GOVERNANCE.md
- SECURITY.md
- SUPPORT.md
- CHANGELOG.md
- docs markdown source under src/docs/content/
- docs site source under src/docs/
- GitHub issue templates and PR template
- CI, npm publish and GitHub Pages workflows

## License

MIT, see LICENSE.
