# Getting Started

@pix-galaxy/pix-color-scheme-selector is released as a browser-native Web Component with zero runtime dependencies.

## Install

```bash
pnpm add @pix-galaxy/pix-color-scheme-selector
```

## Basic Usage

```html
<script type="module">
  import '@pix-galaxy/pix-color-scheme-selector';
</script>

<pix-color-scheme-selector></pix-color-scheme-selector>
```

The component self-registers as a custom element named `pix-color-scheme-selector`. It manages `light`, `dark`, and `system` color scheme preferences.

## Programmatic Control

```js
import { PixColorSchemeSelector } from '@pix-galaxy/pix-color-scheme-selector';

const selector = document.querySelector('pix-color-scheme-selector');
selector.applyScheme('dark');
console.log(selector.currentScheme);
```
