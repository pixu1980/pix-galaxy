# @pix-galaxy/pix-accent-color-selector

@pix-galaxy/pix-accent-color-selector is a browser-first accent color selector Web Component designed for the pix-galaxy suite. It manages 5 pastel accent color options with keyboard navigation, persists to localStorage, sets CSS custom properties on the root element, and ships as a minified npm package with zero runtime dependencies.

Live docs site: https://pixu1980.github.io/pix-accent-color-selector/

## Getting Started

### Install

```bash
pnpm add @pix-galaxy/pix-accent-color-selector
```

### Basic usage

The component self-registers as a custom element. Drop it in your HTML and import the package once:

```html
<script type="module">
  import '@pix-galaxy/pix-accent-color-selector';
</script>

<pix-accent-color-selector></pix-accent-color-selector>
```

### Programmatic control

```js
import { PixAccentColorSelector } from '@pix-galaxy/pix-accent-color-selector';

const selector = document.querySelector('pix-accent-color-selector');
selector.applyAccent('mint');
```

### How it works

- Persists the selected accent in `localStorage` under `pix-accent-color`.
- Sets `--pix-accent-h`, `--pix-accent-s`, `--pix-accent-l` CSS custom properties on `<html>`.
- Provides 5 pastel accent options: Coral, Rose, Lavender, Sky, Mint.
- Includes full keyboard navigation following WAI-ARIA radiogroup pattern.
- Dispatches `accent-changed` custom event on selection change.

## Available accents

| Accent   | Color | HSL |
|----------|-------|-----|
| Coral    | 🔴 | 16°, 95%, 58% |
| Rose     | 🩷 | 340°, 90%, 62% |
| Lavender | 🟣 | 280°, 85%, 65% |
| Sky      | 🔵 | 200°, 85%, 62% |
| Mint     | 🟢 | 145°, 80%, 60% |

## Package API

### Exports

| Symbol | Description |
|--------|-------------|
| `PixAccentColorSelector` | Component class (extends `HTMLElement`) |
| `ACCENT_OPTIONS` | Read-only array of accent option objects |
| `STORAGE_KEY` | The `localStorage` key used for persistence |

### Programmatic example

```js
import {
  PixAccentColorSelector,
  ACCENT_OPTIONS,
} from '@pix-galaxy/pix-accent-color-selector';

const selector = document.querySelector('pix-accent-color-selector');
selector.applyAccent('sky');

console.log(selector.currentAccent); // 'sky'
```

## Browser behaviour

- Uses `CSSStyleSheet` + `adoptedStyleSheets` for scoped component styles.
- Persists the selected accent in `localStorage` under `pix-accent-color`.
- Sets `--pix-accent-h`, `--pix-accent-s`, `--pix-accent-l` CSS custom properties on `<html>`.
- Five button options with radiogroup ARIA pattern - with accessible labels.
- Full keyboard navigation with arrow keys, Home, and End.
- Dispatches `accent-changed` custom event with `{ accentId, label }` detail.

## Development

```bash
pnpm install
pnpm test
pnpm build
```

Repo commands:

| Command | Description |
|---------|-------------|
| `pnpm build:lib` | Build npm artifacts (ESM + CJS) |
| `pnpm build:site` | Build docs site |
| `pnpm build` | Build library and site |
| `pnpm dev` | Start Vite docs dev server |
| `pnpm test` | Run component and site tests |
| `pnpm release` | Auto-detect bump, update changelog, tag and commit |

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
pnpm release
```

The command reads commits since the last tag, auto-detects the bump type (major/minor/patch), bumps version, rolls changelog, creates a release commit and local tag. Push manually with `git push origin main --follow-tags`.

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
