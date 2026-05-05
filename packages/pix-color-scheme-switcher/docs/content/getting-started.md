# Getting Started

@pix-galaxy/pix-color-scheme-switcher is a browser-native Web Component with zero runtime dependencies. It renders a light, dark, and system radiogroup in light DOM and keeps the selected mode synchronized with the document.

## Install

```bash
pnpm add @pix-galaxy/pix-color-scheme-switcher
```

## Basic Usage

```html
<meta name="color-scheme" content="light dark" />

<script type="module">
  import '@pix-galaxy/pix-color-scheme-switcher';
</script>

<pix-color-scheme-switcher></pix-color-scheme-switcher>
```

After the first render, the component keeps these document values in sync:

- `html[data-color-scheme]` with the resolved `light` or `dark` scheme.
- `html[data-color-scheme-mode]` with the selected `light`, `dark`, or `system` mode.
- `document.documentElement.style.colorScheme` for native form controls.
- `meta[name="color-scheme"]` with either `light`, `dark`, or `light dark`.

If the document has no `meta[name="color-scheme"]`, the component creates one automatically.

## Reacting to Changes

```js
const switcher = document.querySelector('pix-color-scheme-switcher');

switcher?.addEventListener('pix-color-scheme-switcher:change', (event) => {
  console.log(event.detail.scheme, event.detail.resolvedScheme);
});
```

The selected mode is persisted under the `color-scheme` localStorage key. When the stored value is `system`, the component follows `prefers-color-scheme` changes automatically.

## Local Development

```bash
pnpm --filter @pix-galaxy/pix-color-scheme-switcher build
pnpm --filter @pix-galaxy/pix-color-scheme-switcher test
pnpm --filter @pix-galaxy/pix-color-scheme-switcher typecheck
pnpm --filter @pix-galaxy/pix-color-scheme-switcher docs:build
```
