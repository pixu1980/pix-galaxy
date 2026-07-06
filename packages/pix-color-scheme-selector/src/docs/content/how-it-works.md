# How it works

`pix-color-scheme-selector` is a lightweight Web Component that manages color scheme preferences in the browser with zero runtime dependencies.

## Persistence

The selected scheme is stored in `localStorage` under the key `pix-color-scheme`. On subsequent page loads, the saved preference is restored automatically — no flicker, no flash of unstyled content.

```js
// Reading the stored preference
const saved = localStorage.getItem('pix-color-scheme');
// → 'light' | 'dark' | 'system' | null
```

## Meta tag sync

The component creates or updates a `<meta name="color-scheme">` tag in the document `<head>`. This tells the browser which color schemes the page supports, enabling native browser UI theming (scrollbars, form controls, etc.).

| Scheme | Meta content    |
|--------|-----------------|
| light  | `light`         |
| dark   | `dark`          |
| system | `light dark`    |

## Attribute & style injection

On the `<html>` element, the component sets:

- **`data-color-scheme` attribute** — `"light"` or `"dark"` for explicit schemes; removed in system mode.
- **`style.colorScheme`** — `"light"`, `"dark"`, or `"light dark"` for system mode.

This allows your CSS to hook into the scheme with an attribute selector:

```css
:root[data-color-scheme="dark"] {
  --bg: #1a1a2e;
  --text: #e0e0e0;
}
```

Or use the CSS `light-dark()` function which responds to the `color-scheme` property:

```css
:root {
  --bg: light-dark(#fafafa, #1a1a2e);
  --text: light-dark(#222, #e0e0e0);
}
```

## System mode

When the user selects "System", the component removes the explicit `data-color-scheme` attribute and sets `color-scheme: light dark` on the root element. This lets the browser decide based on the OS-level preference (`prefers-color-scheme`).

## Synchronised instances

Multiple `pix-color-scheme-selector` elements on the same page stay in sync because they all read from and write to the same `localStorage` key and `<meta name="color-scheme">` tag. No event bus, no global state manager — just shared DOM and storage.
