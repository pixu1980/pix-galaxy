# API

## Main exports

- `PixHighlighter`
- `PIX_HIGHLIGHTER_THEME_OPTIONS`
- `enhancePixHighlighters(root?)`
- `normalizeLang(value?)`
- `tokenizeSource(language, source)`

## Example

```js
import {
  PIX_HIGHLIGHTER_THEME_OPTIONS,
  PixHighlighter,
  enhancePixHighlighters,
  tokenizeSource,
} from '@pix-galaxy/pix-highlighter';

enhancePixHighlighters(document);
PixHighlighter.applyTheme('tide');

const tokens = tokenizeSource('js', 'const theme = getTheme();');
console.log(tokens, PIX_HIGHLIGHTER_THEME_OPTIONS.length);
```

## Semantic token groups

Themes ship consistent colors for:

- keywords
- variables
- methods and functions
- values and numbers
- strings
- properties
- types
- comments
- markdown tokens
