# Getting Started

@pix-galaxy/pix-a11y-panel is released as a browser-native Web Component with zero runtime dependencies.

## Install

```bash
pnpm add @pix-galaxy/pix-a11y-panel
```

## Basic Usage

```html
<script type="module">
  import '@pix-galaxy/pix-a11y-panel';
</script>

<pix-a11y-panel></pix-a11y-panel>
```

The component self-registers as a custom element named `pix-a11y-panel`. Click the toggle button to open the popover panel and adjust colour scheme, accent colour, accessibility options, typography, and corner radius.

## Programmatic Control

```js
import { PixA11yPanel } from '@pix-galaxy/pix-a11y-panel';

const prefs = document.querySelector('pix-a11y-panel');
prefs.updatePreference('fontScale', '125%');
prefs.updatePreference('increaseContrast', true);
```
