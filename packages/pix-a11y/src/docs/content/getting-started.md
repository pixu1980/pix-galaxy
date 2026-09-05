# Getting Started

@pix-galaxy/pix-a11y is released as a browser-native Web Component with zero runtime dependencies.

## Install

```bash
pnpm add @pix-galaxy/pix-a11y
```

## Basic Usage

```html
<script type="module">
  import '@pix-galaxy/pix-a11y';
</script>

<pix-a11y></pix-a11y>
```

The component self-registers as a custom element named `pix-a11y`. Click the toggle button to open the popover panel and adjust colour scheme, accent colour, accessibility options, typography, and corner radius.

## Programmatic Control

```js
import { PixA11y } from '@pix-galaxy/pix-a11y';

const prefs = document.querySelector('pix-a11y');
prefs.updatePreference('fontScale', '125%');
prefs.updatePreference('increaseContrast', true);
```
