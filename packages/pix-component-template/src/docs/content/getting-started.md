# Getting Started

{%PACKAGE_NAME%} is released as a browser-native Web Component with zero runtime dependencies.

## Install

```bash
pnpm add {%PACKAGE_NAME%}
```

## Basic Usage

```html
<script type="module">
  import '{%PACKAGE_NAME%}';
</script>

<{%ELEMENT_NAME%}></{%ELEMENT_NAME%}>
```

The component self-registers as a custom element named `{%ELEMENT_NAME%}`.

## Programmatic Control

```js
import { {%COMPONENT_CLASS%} } from '{%PACKAGE_NAME%}';

const el = document.querySelector('{%ELEMENT_NAME%}');
// TODO: call el.someMethod()
```
