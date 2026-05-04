# Examples

## Outlined Variant

Use the outlined presentation when the card should sit lightly on dense layouts.

```html
<pix-card variant="outlined">
  <span slot="header">Outlined Card</span>
  Body content
</pix-card>
```

## Elevated Variant

Switch to the elevated variant for featured content that needs stronger visual separation.

```html
<pix-card variant="elevated">
  <span slot="header">Elevated Card</span>
  Body content
</pix-card>
```

## Link Card

Set href to turn the card into a native link without changing the slot structure.

```html
<pix-card href="/docs/getting-started">
  <span slot="header">Open docs</span>
  This card behaves like a native link.
</pix-card>
```
