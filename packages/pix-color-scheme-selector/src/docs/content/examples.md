# Examples

## Basic usage

```html
<pix-color-scheme-selector></pix-color-scheme-selector>
```

## With custom integration

```js
import '@pix-galaxy/pix-color-scheme-selector';

// The component auto-registers. Listen for color scheme changes
// by reading the meta tag or the html element's data attribute.
const observer = new MutationObserver(() => {
  const scheme = document.documentElement.dataset.colorScheme || 'system';
  console.log('Color scheme changed:', scheme);
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-color-scheme'],
});
```

## Multiple instances

Multiple `pix-color-scheme-selector` elements on the same page stay in sync because they all read from and write to the same `localStorage` key and `<meta name="color-scheme">` tag.
