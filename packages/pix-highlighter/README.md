# @pix-galaxy/pix-highlighter

@pix-galaxy/pix-highlighter is a browser-first syntax-highlighting Web Component for the pix-galaxy suite. It enhances `pre[is="pix-highlighter"]` blocks in place, uses the CSS Custom Highlight API when available, falls back to token spans when it is not, and keeps zero runtime dependencies.

## Highlights

- Customized built-in element based on `pre` with automatic registration.
- CSS Custom Highlight API support with graceful span fallback.
- Ten built-in themes shared across all enhanced blocks on the page.
- Built-in copy action and theme picker UI.
- Exported lexers and `tokenizeSource()` utility for programmatic usage.

## Install

```bash
pnpm add @pix-galaxy/pix-highlighter
```

## Quick Start

```html
<script type="module">
	import '@pix-galaxy/pix-highlighter';
</script>

<pre is="pix-highlighter" data-lang="ts">
	<code>const greeting = formatMessage('pix-galaxy');</code>
</pre>
```

By default, the component trims surrounding whitespace inside the nested `code` block. Set `data-trim="false"` on the `pre[is="pix-highlighter"]` element or on its nested `code` element to preserve leading and trailing whitespace.

## Programmatic API

```js
import {
	PIX_HIGHLIGHTER_THEME_OPTIONS,
	PixHighlighter,
	enhancePixHighlighters,
	tokenizeSource,
} from '@pix-galaxy/pix-highlighter';

enhancePixHighlighters(document);
PixHighlighter.applyTheme('aurora');

const tokens = tokenizeSource('js', 'const formatter = createFormatter();');
console.log(tokens, PIX_HIGHLIGHTER_THEME_OPTIONS.map((option) => option.value));
```

## Supported Languages

- JavaScript
- TypeScript
- CSS
- JSON
- HTML
- Python
- Rust
- C
- C++
- PHP
- C#
- Go
- Markdown
- YAML
- Bash

## Built-in Themes

- default
- prism
- prettylights
- darcula
- cyberpunk
- aurora
- atlas
- ember
- paper
- tide

## Development

```bash
pnpm --filter @pix-galaxy/pix-highlighter test
pnpm --filter @pix-galaxy/pix-highlighter build
pnpm --filter @pix-galaxy/pix-highlighter docs:build
```
