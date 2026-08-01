# @pix-galaxy/pix-color-scheme-selector

@pix-galaxy/pix-color-scheme-selector is a browser-first color scheme selector Web Component designed for the pix-galaxy suite. It manages light, dark, and system color scheme preferences, persists to localStorage, syncs with `<meta name="color-scheme">`, and ships as a minified npm package with zero runtime dependencies.

Live docs site: https://pixu1980.github.io/pix-color-scheme-selector/

## Getting Started

### Install

```bash
pnpm add @pix-galaxy/pix-color-scheme-selector
```

### Basic usage

The component self-registers as a custom element. Drop it in your HTML and import the package once:

```html
<script type="module">
  import '@pix-galaxy/pix-color-scheme-selector';
</script>

<pix-color-scheme-selector></pix-color-scheme-selector>
```

### Programmatic control

```js
import { PixColorSchemeSelector } from '@pix-galaxy/pix-color-scheme-selector';

const selector = document.querySelector('pix-color-scheme-selector');
selector.applyScheme('dark');
```

### How it works

- Persists the selected scheme in `localStorage` under `pix-color-scheme`.
- Syncs with `<meta name="color-scheme">` for browser-level color scheme enforcement.
- Sets `data-color-scheme` attribute and `style.colorScheme` on `<html>`.
- In `system` mode, removes the explicit attribute and sets `color-scheme: light dark`.

## Package API

### Exports

| Symbol                   | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `PixColorSchemeSelector` | Component class (extends `HTMLElement`)          |
| `META_CONTENT`           | Read-only mapping of scheme → meta content value |
| `SCHEMES`                | Read-only array of supported scheme values       |
| `STORAGE_KEY`            | The `localStorage` key used for persistence      |

### Programmatic example

```js
import {
  PixColorSchemeSelector,
  META_CONTENT,
  SCHEMES,
} from '@pix-galaxy/pix-color-scheme-selector';

const selector = document.querySelector('pix-color-scheme-selector');
selector.applyScheme('system');

console.log(META_CONTENT[selector.currentScheme]); // 'light dark'
```

## Browser behaviour

- Uses `CSSStyleSheet` + `adoptedStyleSheets` for scoped component styles.
- Persists the selected scheme in `localStorage` under `pix-color-scheme`.
- Creates or updates `<meta name="color-scheme">` in the document `<head>`.
- Sets both `data-color-scheme` attribute and inline `colorScheme` style on `<html>`.
- Three radio-button options: Light, Dark, System - with SVG icons.
- Accessible: uses `role="radiogroup"`, `aria-label`, and visually hidden text labels.

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
| `pnpm rel:patch`  | Bump patch version and tag      |
| `pnpm rel:minor`  | Bump minor version and tag      |
| `pnpm rel:major`  | Bump major version and tag      |

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

## Release Automation

Local release prep uses pnpm.

```bash
pnpm rel:patch
pnpm rel:minor
pnpm rel:major
```

Each command bumps version, rolls changelog, creates release commit and local tag. Push manually with `git push origin main --follow-tags`.

GitHub Actions then:

1. validates install, tests, library build, site build and package archive with pnpm
2. publishes package to npm with npm only
3. deploys docs site to GitHub Pages after publish succeeds

Required repo setup:

1. Add repository secret `NPM_TOKEN` with publish permission.
2. Set GitHub Pages source to `GitHub Actions`.
3. Keep workflow permissions for `id-token: write` and `pages: write` enabled.

## Community

- Contribution guide: see CONTRIBUTING.md
- Governance model: see GOVERNANCE.md
- Security process: see SECURITY.md
- Support process: see SUPPORT.md

## License

MIT, see LICENSE.
