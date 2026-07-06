# Getting Started

@pix-galaxy/pix-display-preferences is released as a browser-native Web Component with zero runtime dependencies.

## Install

```bash
pnpm add @pix-galaxy/pix-display-preferences
```

## Basic Usage

```html
<script type="module">
  import '@pix-galaxy/pix-display-preferences';
</script>

<pix-display-preferences></pix-display-preferences>
```

The component self-registers as a custom element named `pix-display-preferences`. Click the toggle button to open the popover panel and adjust colour scheme, accent colour, accessibility options, typography, and corner radius.

## Programmatic Control

```js
import { PixDisplayPreferences } from '@pix-galaxy/pix-display-preferences';

const prefs = document.querySelector('pix-display-preferences');
prefs.updatePreference('fontScale', '125%');
prefs.updatePreference('increaseContrast', true);
```
