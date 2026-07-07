# API

## Exports

- `PixColorSchemeSelector` - Component class (extends `HTMLElement`)
- `META_CONTENT` - Read-only mapping of scheme → meta content value
- `SCHEMES` - Read-only array of supported scheme values
- `STORAGE_KEY` - The `localStorage` key used for persistence

## Component class: `PixColorSchemeSelector`

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `currentScheme` | `'light' \| 'dark' \| 'system'` | The currently active scheme |

### Methods

| Method | Description |
|--------|-------------|
| `applyScheme(scheme)` | Apply a color scheme (light, dark, or system) |
| `getInitialScheme()` | Read the initial scheme from localStorage or meta |
| `getSavedScheme()` | Read the scheme from localStorage, or null |
| `getSchemeFromMeta()` | Read the scheme from `<meta name="color-scheme">` |

### Static Methods

| Method | Description |
|--------|-------------|
| `ensureComponentStyles()` | Ensure component CSS is adopted in the document |

## Example

```js
import {
  PixColorSchemeSelector,
  META_CONTENT,
  SCHEMES,
  STORAGE_KEY,
} from '@pix-galaxy/pix-color-scheme-selector';

const selector = document.querySelector('pix-color-scheme-selector');
selector.applyScheme('dark');

console.log(META_CONTENT.dark);    // 'dark'
console.log(SCHEMES);              // ['light', 'dark', 'system']
console.log(STORAGE_KEY);          // 'pix-color-scheme'
```
