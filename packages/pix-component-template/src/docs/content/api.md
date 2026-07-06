# API

## Exports

- `{%COMPONENT_CLASS%}` — Component class (extends `HTMLElement`)
- `STORAGE_KEY` — The `localStorage` key used for persistence

## Component class: `{%COMPONENT_CLASS%}`

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `currentValue` | `string` | The currently active value |

### Methods

| Method | Description |
|--------|-------------|
| *(TODO)* | *(TODO)* |

### Static Methods

| Method | Description |
|--------|-------------|
| `ensureComponentStyles()` | Ensure component CSS is adopted in the document |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| *(TODO)* | *(TODO)* | *(TODO)* |

## CSS custom properties set on `:root`

*(TODO)*

## Example

```js
import {
  {%COMPONENT_CLASS%},
  STORAGE_KEY,
} from '{%PACKAGE_NAME%}';

const el = document.querySelector('{%ELEMENT_NAME%}');
// TODO: add usage examples
```
