# How it works

pix-highlighter uses a three-layer architecture: **lexing**, **highlighting**, and **theming**.

## 1. Lexing - tokenising source code

When a `<pre is="pix-highlighter">` block connects, the component reads the text content of the nested `<code>` element and selects a lexer based on the `data-lang` attribute.

Each lexer is a hand-tuned function that scans the source string character by character and returns an array of semantic tokens - flat ranges with a type label:

```
{ start: 6, end: 13, type: 'keyword' }
{ start: 14, end: 26, type: 'function' }
```

The type is one of the **semantic token groups**: `keyword`, `variable`, `function`, `value`, `string`, `property`, `type`, `comment`, or `markdown` - each maps to a theme colour.

### Supported lexers

- JavaScript (`js`)
- TypeScript (`ts`)
- CSS (`css`)
- JSON (`json`)
- HTML (`html`)
- Python (`python`)
- Rust (`rust`)
- C and C++ (`c`, `cpp`)
- C# (`csharp`)
- Go (`go`)
- PHP (`php`)
- Markdown (`md`, `markdown`)
- YAML (`yml`, `yaml`)
- Bash (`bash`, `sh`)

You can call any lexer directly via its exported function (e.g. `lexJS('const x = 1;')`) for use outside the component.

## 2. Highlighting - two rendering paths

### Primary: CSS Custom Highlight API

When the browser supports `CSS.highlights` (Chrome 105+, Edge 105+, Safari 18.2+, Firefox 134+), pix-highlighter uses the [CSS Custom Highlight API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API).

For every connected instance, the component collects all token ranges into `Highlight` objects - one per token type - and registers them with `CSS.highlights.set()`. The browser paints the highlights using CSS `::highlight()` pseudo-elements, which inherit colours from the active theme.

```css
/* The theme defines colours per token type */
::highlight(pix-keyword)   { color: var(--pix-highlighter--keyword); }
::highlight(pix-string)    { color: var(--pix-highlighter--string); }
```

Because highlights are registered globally on the document, all instances share a single set of `Highlight` objects - the component batches ranges from every connected block into the same highlight groups. When an instance connects or disconnects, `PixHighlighter.renderHighlights()` rebuilds the full set.

This path keeps the DOM clean: the `<code>` element contains only a single `TextNode`, regardless of how many tokens are highlighted.

### Fallback: DOM token spans

When the Highlight API is unavailable, pix-highlighter falls back to wrapping each token in a `<span data-token="type">` element inside the `<code>` block. The same theme CSS variables style the spans via attribute selectors:

```css
code span[data-token="keyword"] { color: var(--pix-highlighter--keyword); }
```

This ensures the component works in all browsers without a polyfill.

## 3. Theming - CSS custom properties

Every theme is a set of CSS custom properties scoped to `html[data-pix-highlighter-theme="<name>"]`:

```css
html[data-pix-highlighter-theme="nord"] {
  --pix-highlighter--keyword: #81a1c1;
  --pix-highlighter--string:  #a3be8c;
  --pix-highlighter--function: #88c0d0;
  /* ... */
}
```

### Built-in themes

| Theme          | Description |
|----------------|-------------|
| `default`      | Warm, readable defaults |
| `prism`        | Inspired by Prism.js |
| `prettylights` | GitHub-inspired |
| `darcula`      | JetBrains Darcula |
| `cyberpunk`    | Neon on dark |
| `monokai`      | Classic Monokai |
| `nord`         | Arctic, blue-tinted |

Themes are applied globally via `PixHighlighter.applyTheme('nord')` and persisted to `localStorage` under the key `pix-highlighter-theme`.

Every `<pre is="pix-highlighter">` instance ships an inline theme picker - click the palette icon in the toolbar to switch themes on any individual block.

## 4. Toolbar - copy and theme control

Each PixHighlighter instance renders a toolbar with:

- **Copy button** - copies the code text to the clipboard with visual feedback (check/error icons)
- **Theme picker** - a dropdown listing all available themes, updated to reflect the global selection

The toolbar uses semantic `<details>` / `<summary>` for the theme dropdown, with anchor positioning where supported and a manual `position: fixed` fallback.

## 5. Auto‑boot and static enhancement

On import, the component registers the custom element and sets up a `DOMContentLoaded` listener that auto-enhances all `<pre is="pix-highlighter">` blocks already in the DOM.

For dynamically added content, call `enhancePixHighlighters(root)` - it runs the static `PixHighlighter.enhanceAll()` which discovers and upgrades every matching element in the given subtree.
