# API

## Exports

- `PixAccentColorSelector` — Component class (extends `HTMLElement`)
- `ACCENT_OPTIONS` — Read-only array of accent option objects
- `STORAGE_KEY` — The `localStorage` key used for persistence

## Component class: `PixAccentColorSelector`

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `currentAccent` | `string` | The currently active accent ID |

### Methods

| Method | Description |
|--------|-------------|
| `applyAccent(accentId)` | Apply an accent color by ID |
| `getInitialAccent()` | Read the initial accent from localStorage or default |
| `getSavedAccent()` | Read the accent from localStorage, or null |
| `getAccentValues(accentId)` | Get the HSL values for an accent ID |

### Static Methods

| Method | Description |
|--------|-------------|
| `ensureComponentStyles()` | Ensure component CSS is adopted in the document |

## Accent options `ACCENT_OPTIONS`

```js
[
  { id: 'coral',    label: 'Coral',    h: 16,  s: 95, l: 58 },
  { id: 'rose',     label: 'Rose',     h: 340, s: 90, l: 62 },
  { id: 'lavender', label: 'Lavender', h: 280, s: 85, l: 65 },
  { id: 'sky',      label: 'Sky',      h: 200, s: 85, l: 62 },
  { id: 'mint',     label: 'Mint',     h: 145, s: 80, l: 60 },
]
```

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `accent-changed` | `{ accentId, label }` | Dispatched when the accent changes |

## CSS custom properties set on `:root`

| Property | Type | Example |
|----------|------|---------|
| `--pix-accent-h` | number (0-360) | `340` |
| `--pix-accent-s` | percentage | `90%` |
| `--pix-accent-l` | percentage | `62%` |

## Example

```js
import {
  PixAccentColorSelector,
  ACCENT_OPTIONS,
  STORAGE_KEY,
} from '@pix-galaxy/pix-accent-color-selector';

const selector = document.querySelector('pix-accent-color-selector');
selector.applyAccent('sky');

console.log(ACCENT_OPTIONS.find(o => o.id === 'sky'));
// → { id: 'sky', label: 'Sky', h: 200, s: 85, l: 62 }

console.log(STORAGE_KEY);
// → 'pix-accent-color'
```
