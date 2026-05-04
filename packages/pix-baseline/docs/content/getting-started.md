# Getting Started

@pix-galaxy/pix-highlighter is released as a browser-native Web Component with zero runtime dependencies.

## Install

```bash
pnpm add @pix-galaxy/pix-highlighter
```

## Basic Usage

```html
<script type="module">
  import '@pix-galaxy/pix-highlighter';
</script>

<pre is="pix-highlighter" data-lang="ts">
  <code>const galaxy = createSuite('pix-galaxy');</code>
</pre>
```

By default, pix-highlighter trims surrounding whitespace in the nested `code` content. To preserve it, set `data-trim="false"` on the `pre[is="pix-highlighter"]` element or on its nested `code` element.

## Programmatic Theme Control

```js
import { PixHighlighter } from '@pix-galaxy/pix-highlighter';

PixHighlighter.applyTheme('atlas');
```

## Supported Languages

- JavaScript
- TypeScript
- CSS
- JSON
- HTML
- Python
- Rust
- C and C++
- PHP
- C#
- Go
- Markdown
- YAML
- Bash
