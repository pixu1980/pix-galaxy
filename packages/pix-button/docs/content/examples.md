# Examples

## Variants

```html
<pix-button>Primary</pix-button>
<pix-button variant="secondary">Secondary</pix-button>
<pix-button variant="ghost">Ghost</pix-button>
```

## Disabled State

```html
<pix-button disabled>Disabled</pix-button>
```

## Event Handling

```js
const button = document.querySelector('pix-button');

button?.addEventListener('pix-button:click', (event) => {
  console.log(event.detail.variant);
});
```
