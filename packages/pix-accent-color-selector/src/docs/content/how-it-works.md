# How it works

`pix-accent-color-selector` is a lightweight Web Component that manages accent color preferences in the browser with zero runtime dependencies.

## Persistence

The selected accent is stored in `localStorage` under the key `pix-accent-color`. On subsequent page loads, the saved preference is restored automatically.

```js
// Reading the stored accent
const saved = localStorage.getItem('pix-accent-color');
// → 'coral' | 'rose' | 'lavender' | 'sky' | 'mint' | null
```

## CSS custom properties

When an accent is selected, the component sets three CSS custom properties on the root `<html>` element:

| Property         | Description           |
| ---------------- | --------------------- |
| `--pix-accent-h` | Hue value (0-360)     |
| `--pix-accent-s` | Saturation percentage |
| `--pix-accent-l` | Lightness percentage  |

This allows you to use the accent color anywhere in your CSS:

```css
:root {
  --accent: hsl(var(--pix-accent-h), var(--pix-accent-s), var(--pix-accent-l));
}

.button-primary {
  background: var(--accent);
}
```

## Accent options

| Name     | Hue  | Saturation | Lightness | Preview |
| -------- | ---- | ---------- | --------- | ------- |
| Coral    | 16°  | 95%        | 58%       | 🔴      |
| Rose     | 340° | 90%        | 62%       | 🩷      |
| Lavender | 280° | 85%        | 65%       | 🟣      |
| Sky      | 200° | 85%        | 62%       | 🔵      |
| Mint     | 145° | 80%        | 60%       | 🟢      |

## Events

The component dispatches an `accent-changed` custom event whenever the accent changes:

```js
document.querySelector('pix-accent-color-selector').addEventListener('accent-changed', (event) => {
  console.log('New accent:', event.detail.accentId, event.detail.label);
});
```

## Keyboard navigation

Inside the component, accent buttons follow the WAI-ARIA radiogroup pattern:

| Key                    | Action                |
| ---------------------- | --------------------- |
| ArrowRight / ArrowDown | Next accent           |
| ArrowLeft / ArrowUp    | Previous accent       |
| Home                   | First accent          |
| End                    | Last accent           |
| Space / Enter          | Select current accent |

## Synchronised instances

Multiple `pix-accent-color-selector` elements on the same page stay in sync because they all read from and write to the same `localStorage` key and CSS custom properties on the root element.
