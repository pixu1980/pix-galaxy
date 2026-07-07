# How it works

`pix-display-preferences` is a lightweight Web Component that manages display preferences in the browser with zero runtime dependencies.

## Persistence

All preferences are stored in `localStorage` under the key `pix-display-preferences`. On subsequent page loads, the saved preferences are restored automatically.

```js
// Reading the stored preferences
const raw = localStorage.getItem('pix-display-preferences');
const prefs = JSON.parse(raw);
// → { fontScale: '125%', headingFont: 'system-sans', ... }
```

## Colour scheme & accent colour

The component integrates two sibling pix-galaxy components:

- **`<pix-color-scheme-selector>`** (from `@pix-galaxy/pix-color-scheme-selector`) - manages light, dark, and system colour scheme preferences.
- **`<accent-color-selector>`** (from `@pix-galaxy/pix-accent-color-selector`) - manages accent colour swatches.

Both self-register when their packages are imported.

## Accessibility attributes

The component sets data attributes on `<html>` for each accessibility preference:

| Preference | Attribute |
|---|---|
| Reduce Motion | `data-reduce-motion` |
| Reduce Transparency | `data-reduce-transparency` |
| Increase Contrast | `data-increase-contrast` |

To hook your CSS into these preferences:

```css
:root[data-reduce-motion="true"] .animated-element {
  animation: none;
}

:root[data-increase-contrast="true"] {
  --text: #000;
  --bg: #fff;
}
```

## Typography

Font preferences are applied as CSS custom properties ond `<html>`:

- `--pix-ds-font-display` - heading font stack
- `--pix-ds-font-sans` - body font stack
- `--pix-ds-font-mono` - code font stack

Font scale is applied as an inline `font-size` on `<html>`.

## Corner radius

The selected radius preset is set as `data-radius-preset` on `<html>`. Use it in CSS:

```css
:root[data-radius-preset="square"] {
  --radius-card: 0;
}

:root[data-radius-preset="rounded"] {
  --radius-card: 4px;
}

:root[data-radius-preset="squircle"] {
  --radius-card: 1rem;
  corner-shape: squircle;
}
```

## Native popover API

The panel uses the native `popover="auto"` API when available, with a click-driven fallback for unsupported browsers. The panel position is dynamically calculated to stay within the viewport.
