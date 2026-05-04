# Examples

## Variants

Show the three supported button treatments side by side to compare hierarchy and contrast.

```html
<pix-button>Primary</pix-button>
<pix-button variant="secondary">Secondary</pix-button>
<pix-button variant="ghost">Ghost</pix-button>
```

## Disabled State

Use the native disabled attribute when the action is unavailable but should remain visible.

```html
<pix-button disabled>Disabled</pix-button>
```

## Event Handling

Listen for the component event when you need the normalized variant in application code.

```js
const button = document.querySelector('pix-button');

button?.addEventListener('pix-button:click', (event) => {
  console.log(event.detail.variant);
});
```
