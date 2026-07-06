# Getting Started

@pix-galaxy/pix-accent-color-selector is released as a browser-native Web Component with zero runtime dependencies.

## Install

```bash
pnpm add @pix-galaxy/pix-accent-color-selector
```

## Basic Usage

```html
<script type="module">
  import '@pix-galaxy/pix-accent-color-selector';
</script>

<pix-accent-color-selector></pix-accent-color-selector>
```

The component self-registers as a custom element named `pix-accent-color-selector`. It manages 5 pastel accent color options with keyboard navigation and accessibility support.

## Programmatic Control

```js
import { PixAccentColorSelector } from '@pix-galaxy/pix-accent-color-selector';

const selector = document.querySelector('pix-accent-color-selector');
selector.applyAccent('mint');
console.log(selector.currentAccent);
```
