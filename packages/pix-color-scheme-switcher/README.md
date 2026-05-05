# @pix-galaxy/pix-color-scheme-switcher

@pix-galaxy/pix-color-scheme-switcher is a browser-native Web Component that exposes a reusable light, dark, and system mode control for pix-galaxy apps and docs. It keeps zero runtime dependencies, persists the selected mode in localStorage, and synchronizes the active choice with the document root.

## Highlights

- Autonomous custom element registered as `<pix-color-scheme-switcher>`.
- Supports `light`, `dark`, and `system` modes with `prefers-color-scheme` fallback.
- Updates `html[data-color-scheme]`, `html[data-color-scheme-mode]`, `document.documentElement.style.colorScheme`, and `meta[name="color-scheme"]`.
- Persists the chosen mode under the `color-scheme` storage key.
- Dispatches `pix-color-scheme-switcher:change` with the selected and resolved scheme.
- Exports `normalizeScheme(value?)` for programmatic normalization.

## Install

```bash
pnpm add @pix-galaxy/pix-color-scheme-switcher
```

## Quick Start

```html
<meta name="color-scheme" content="light dark" />

<script type="module">
	import '@pix-galaxy/pix-color-scheme-switcher';

	const switcher = document.querySelector('pix-color-scheme-switcher');
	switcher?.addEventListener('pix-color-scheme-switcher:change', (event) => {
		console.log(event.detail.scheme, event.detail.resolvedScheme);
	});
</script>

<header>
	<pix-color-scheme-switcher></pix-color-scheme-switcher>
</header>
```

When the user selects `system`, the component keeps the persisted mode as `system` and resolves the active document scheme from `matchMedia('(prefers-color-scheme: dark)')`.

## Programmatic API

```js
import {
	PixColorSchemeSwitcher,
	normalizeScheme,
} from '@pix-galaxy/pix-color-scheme-switcher';

await customElements.whenDefined('pix-color-scheme-switcher');

const switcher = document.querySelector('pix-color-scheme-switcher');

if (switcher instanceof PixColorSchemeSwitcher) {
	switcher.applyColorScheme(normalizeScheme('dark'));
	console.log(switcher.currentScheme, switcher.resolvedScheme);
}
```

## Development

```bash
pnpm --filter @pix-galaxy/pix-color-scheme-switcher test
pnpm --filter @pix-galaxy/pix-color-scheme-switcher build
pnpm --filter @pix-galaxy/pix-color-scheme-switcher typecheck
pnpm --filter @pix-galaxy/pix-color-scheme-switcher docs:build
```
