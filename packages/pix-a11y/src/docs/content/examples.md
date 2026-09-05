# Examples

## Basic usage

```html
<pix-a11y></pix-a11y>
```

## With custom integration

```js
import '@pix-galaxy/pix-a11y';

// The component auto-registers. Listen for preference changes
// by reading localStorage or observing data attributes on <html>.
const observer = new MutationObserver(() => {
  const radius = document.documentElement.dataset.radiusPreset || 'rounded';
  console.log('Radius preset changed:', radius);
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-radius-preset', 'data-reduce-motion'],
});
```

## Multiple instances

Multiple `pix-a11y` elements on the same page stay in sync because they all read from and write to the same `localStorage` key and the same `<html>` attributes.
