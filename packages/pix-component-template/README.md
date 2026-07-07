# {%COMPONENT_NAME%}

{%COMPONENT_DESCRIPTION%}

## ✨ Quick start

### Use this template

Click **"Use this template"** on GitHub, then clone your new repo.

### Replace placeholders

Search for `{%...%}` placeholders across all files and replace with your component's values:

| Placeholder | Example value |
|---|---|
| `{%COMPONENT_NAME%}` | `pix-accent-color-selector` |
| `{%PACKAGE_NAME%}` | `@pix-galaxy/pix-accent-color-selector` |
| `{%COMPONENT_CLASS%}` | `PixAccentColorSelector` |
| `{%ELEMENT_NAME%}` | `pix-accent-color-selector` |
| `{%STORAGE_KEY%}` | `pix-accent-color` |
| `{%COMPONENT_DESCRIPTION%}` | `Accent color selector Web Component for the pix-galaxy suite.` |
| `{%REPO_OWNER%}` | `pixu1980` |
| `{%REPO_NAME%}` | `pix-accent-color-selector` |
| `{%DOCS_TITLE%}` | `pix-accent-color-selector` |

### Install & develop

```bash
pnpm install
pnpm test
pnpm build
pnpm dev
```

## 📦 Package

### Install

```bash
pnpm add {%PACKAGE_NAME%}
```

### Basic usage

```html
<script type="module">
  import '{%PACKAGE_NAME%}';
</script>

<{%ELEMENT_NAME%}></{%ELEMENT_NAME%}>
```

### Programmatic control

```js
import { {%COMPONENT_CLASS%} } from '{%PACKAGE_NAME%}';

const el = document.querySelector('{%ELEMENT_NAME%}');
el.doSomething();
```

## 📁 Project structure

```
├── scripts/                  # Build & release scripts
│   ├── build.mjs            # ESM + CJS bundle with esbuild
│   ├── docs.mjs             # Build docs from markdown
│   ├── finalize-types.mjs   # Rename typedef output
│   ├── raw-text-loader.mjs  # Node loader for ?raw imports
│   ├── raw-text-plugin.mjs  # esbuild plugin for ?raw imports
│   ├── register-test-loader.mjs # Node test loader
│   └── release.mjs          # Auto-bump & changelog
├── src/
│   ├── index.js             # Package entry (re-exports from components/)
│   ├── index.types.js       # JSDoc typedefs (TypeScript declaration source)
│   ├── shared/
│   │   └── _ds-tokens.css   # Shared design system tokens
│   ├── components/
│   │   ├── index.js         # Barrel file
│   │   └── ComponentName/   # Template component
│   │       ├── ComponentName.css
│   │       └── ComponentName.js
│   ├── docs/
│   │   ├── index.html       # Docs site entry
│   │   ├── index.css        # Docs site styles
│   │   ├── index.js         # Docs site app
│   │   └── content/         # Markdown docs pages
│   │       ├── getting-started.md
│   │       ├── api.md
│   │       ├── how-it-works.md
│   │       ├── examples.md
│   │       └── releasing.md
│   └── tests/
│       ├── components.test.js
│       ├── design-system.test.js
│       └── docs-build.test.js
├── artifact/                 # Build output (generated)
├── dist/                     # Docs site build (generated)
├── package.json
├── tsconfig.types.json
├── vite.config.mjs
├── pnpm-workspace.yaml
└── .github/
    ├── workflows/
    │   ├── ci.yml
    │   └── release.yml
    ├── pull_request_template.md
    ├── dependabot.yml
    ├── CODEOWNERS
    └── FUNDING.yml
```

## 🧪 Commands

| Command | Description |
|---------|-------------|
| `pnpm build:lib` | Build npm artifacts (ESM + CJS) |
| `pnpm build:site` | Build docs site |
| `pnpm build` | Build library and site |
| `pnpm dev` | Start Vite docs dev server |
| `pnpm test` | Run component and docs tests |
| `pnpm check` | Test + build |
| `pnpm release` | Auto-detect bump, update changelog, tag and commit |
| `pnpm clean` | Remove build artifacts |

## 🧩 Component patterns

All pix-galaxy components follow these conventions:

- **Self-registering** - `static { customElements.define(ELEMENT_NAME, this) }` in class body
- **Scoped CSS** - `adoptedStyleSheets` with `CSSStyleSheet` (falls back to `<style>` element)
- **No CSS classes** - element + `[data-*]` attribute selectors only
- **No inline styles** - all styling via CSS custom properties and external stylesheets
- **`@layer` CSS** - `@layer pix-galaxy { @layer component-name { ... } }`
- **Zero dependencies** - browser-native Web Components
- **`?raw` CSS imports** - imported as strings, handled by esbuild plugin and Node test loader
- **JSDoc types** - TypeScript declarations generated from `index.types.js`
- **Dual format** - ESM + CJS output via esbuild
- **ARIA** - full keyboard navigation and accessible labels
- **localStorage** - preference persistence when applicable

## 🚀 Release automation

```bash
pnpm release
```

Reads commits since last tag → auto-detects bump → bumps version → rolls changelog → commits + tags.

```bash
git push origin main --follow-tags
```

GitHub Actions then validates, publishes to npm, and deploys docs site to GitHub Pages.

### Required repo setup

1. Add `NPM_TOKEN` repository secret with publish access to `{%PACKAGE_NAME%}`
2. Set GitHub Pages source to **GitHub Actions**
3. Keep `id-token: write` and `pages: write` workflow permissions

## 📄 License

MIT, see LICENSE.
