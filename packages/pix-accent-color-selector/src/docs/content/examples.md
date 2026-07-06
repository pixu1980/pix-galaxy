# Examples

## Basic usage

```html
<pix-accent-color-selector></pix-accent-color-selector>
```

## With custom integration

```js
import '@pix-galaxy/pix-accent-color-selector';

// The component auto-registers. Listen for accent changes
// via the custom event.
const selector = document.querySelector('pix-accent-color-selector');
selector.addEventListener('accent-changed', (event) => {
  document.documentElement.style.setProperty(
    '--my-theme-accent',
    `hsl(${event.detail.accentId === 'mint' ? '145, 80%, 60%' : '16, 95%, 58%'})`
  );
});
```

## Multiple instances

Multiple `pix-accent-color-selector` elements on the same page stay in sync because they all read from and write to the same `localStorage` key and CSS custom properties on the root element.
