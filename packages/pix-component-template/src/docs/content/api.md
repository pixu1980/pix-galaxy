# API

## Exports

- `{%COMPONENT_CLASS%}` - Component class (extends `HTMLElement`)
- `STORAGE_KEY` - The `localStorage` key used for persistence

## Component class: `{%COMPONENT_CLASS%}`

### Properties

| Property       | Type     | Description                |
| -------------- | -------- | -------------------------- |
| `currentValue` | `string` | The currently active value |

### Methods

| Method   | Description |
| -------- | ----------- |
| _(TODO)_ | _(TODO)_    |

### Static Methods

| Method                    | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `ensureComponentStyles()` | Ensure component CSS is adopted in the document |

## Events

| Event    | Detail   | Description |
| -------- | -------- | ----------- |
| _(TODO)_ | _(TODO)_ | _(TODO)_    |

## CSS custom properties set on `:root`

_(TODO)_

## Example

```js
import {
  {%COMPONENT_CLASS%},
  STORAGE_KEY,
} from '{%PACKAGE_NAME%}';

const el = document.querySelector('{%ELEMENT_NAME%}');
// TODO: add usage examples
```
