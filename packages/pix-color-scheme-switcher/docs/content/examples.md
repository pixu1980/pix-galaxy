# Examples

## App Header Control

Shared docs builds surface fenced examples as interactive gallery cards.

```html
<header>
	<a href="/">pix-galaxy</a>
	<pix-color-scheme-switcher></pix-color-scheme-switcher>
</header>
```

## Seed From Saved Or System Preference

Seed the document with a broad `meta[name="color-scheme"]` value and let the switcher resolve the active mode when it loads.

```html
<meta name="color-scheme" content="light dark" />

<script type="module">
	import '@pix-galaxy/pix-color-scheme-switcher';
</script>

<pix-color-scheme-switcher></pix-color-scheme-switcher>
```

## Programmatic Mode Changes

```js
import {
	PixColorSchemeSwitcher,
	normalizeScheme,
} from '@pix-galaxy/pix-color-scheme-switcher';

await customElements.whenDefined('pix-color-scheme-switcher');

const switcher = document.querySelector('pix-color-scheme-switcher');

if (switcher instanceof PixColorSchemeSwitcher) {
	switcher.applyColorScheme(normalizeScheme('dark'));
}
```

## Listen For Resolved Scheme Changes

```js
const switcher = document.querySelector('pix-color-scheme-switcher');

switcher?.addEventListener('pix-color-scheme-switcher:change', (event) => {
	document.body.dataset.scheme = event.detail.resolvedScheme;
});
```
