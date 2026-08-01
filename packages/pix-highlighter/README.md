# @pix-galaxy/pix-highlighter

@pix-galaxy/pix-highlighter is a browser-first syntax-highlighting Web Component designed for the pix-galaxy suite. It enhances pre elements in place, uses the CSS Custom Highlight API when available, falls back to token spans when it is not, and ships as a minified npm package with zero runtime dependencies.

Live docs site: https://pixu1980.github.io/pix-highlighter/

## Getting Started

### Install

```bash
pnpm add @pix-galaxy/pix-highlighter
```

### Basic usage

The component works as a customized built-in `<pre>` element. Drop it in your HTML and import the package once:

```html
<script type="module">
  import '@pix-galaxy/pix-highlighter';
</script>

<pre is="pix-highlighter" data-lang="ts">
  <code>const greeting = formatMessage('pix-galaxy');</code>
</pre>
```

The package registers `pix-highlighter` as a customized built-in extending `<pre>`. If customized built-ins are not supported by the browser, matching `<pre>` elements are still enhanced at runtime via `enhancePixHighlighters()`.

### Programmatic theme control

```js
import { PixHighlighter } from '@pix-galaxy/pix-highlighter';

PixHighlighter.applyTheme('atlas');
```

### Import and enhance

```js
import { enhancePixHighlighters } from '@pix-galaxy/pix-highlighter';

document.addEventListener('DOMContentLoaded', () => {
  enhancePixHighlighters(document);
});
```

### Code trimming

By default, pix-highlighter trims surrounding whitespace in the nested `<code>` content, like highlight.js `data-trim`. To preserve whitespace, set `data-trim="false"` on the `<pre>` or on its nested `<code>` element.

### Supported languages

JavaScript, TypeScript, CSS, JSON, HTML, Python, Rust, C, C++, PHP, C#, Go, Markdown, YAML, Bash.

## Available themes

| Theme          | Description                                |
| -------------- | ------------------------------------------ |
| `default`      | Balanced light‑dark theme with muted tones |
| `prism`        | Inspired by the Prism.js default palette   |
| `prettylights` | GitHub Pretty Lights palette               |
| `darcula`      | JetBrains Darcula-inspired dark theme      |
| `cyberpunk`    | Neon‑accented dark theme                   |
| `monokai`      | Classic Monokai palette                    |
| `nord`         | Arctic, north-bluish color theme           |
| `aurora`       | Cool blue‑purple gradients                 |
| `atlas`        | Warm earth tones with amber accents        |
| `ember`        | Fiery orange‑red palette                   |
| `paper`        | Light, paper‑like theme                    |
| `tide`         | Ocean‑inspired blue‑green palette          |

## Package API

### Exports

| Symbol                          | Description                                                |
| ------------------------------- | ---------------------------------------------------------- |
| `PixHighlighter`                | Component class (extends `HTMLPreElement`)                 |
| `PIX_HIGHLIGHTER_THEME_OPTIONS` | Read-only array of `{ value, label }` theme definitions    |
| `enhancePixHighlighters(root?)` | Enhance all matching `<pre>` elements under the given root |
| `normalizeLang(value?)`         | Normalise language aliases (`"javascript"` → `"js"`)       |
| `lexJS`, `lexTS`, `lexCSS`, …   | Individual language lexers                                 |

### Programmatic example

```js
import {
  PixHighlighter,
  enhancePixHighlighters,
  lexJS,
  normalizeLang,
} from '@pix-galaxy/pix-highlighter';

// Normalise a language alias
const lang = normalizeLang('TypeScript');

// Enhance existing elements
enhancePixHighlighters(document);

// Switch theme
PixHighlighter.applyTheme('nord');

// Use a lexer directly
const tokens = lexJS('const version = "0.1.0";');
```

## Browser behaviour

- Uses `CSS.highlights` + `Highlight` when the platform supports them.
- Falls back to inline `<span data-token="...">` elements when the Highlight API is unavailable.
- Injects component-owned CSS once per document through `adoptedStyleSheets`, with a managed `<style>` fallback.
- Persists the selected theme in `localStorage` under `pix-highlighter-theme`.
- Trims surrounding whitespace by default; set `data-trim="false"` to preserve it.

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
- docs/examples site source under src/docs/
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
