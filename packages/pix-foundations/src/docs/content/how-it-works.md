# How It Works

Foundations is a pure CSS package. No JavaScript. No component registration. No runtime overhead.

## CSS Layer structure

```css
@layer pix.reset, pix.foundations, pix.components;
```

| Layer | Contents |
|-------|----------|
| `pix.reset` | Box-sizing, margin removal, media defaults |
| `pix.foundations.radii` | `--pix--r--*` tokens |
| `pix.foundations.spacings` | `--pix--s--*` tokens |
| `pix.foundations.typography` | `--pix--t--*` tokens |
| `pix.foundations.colors` | `--pix--c--*` tokens with `light-dark()` |
| `pix.foundations.elevations` | `--pix--e--*` box-shadow tokens |

## Focus ring — unlayered

`_focus.css` is intentionally imported **outside** all layers. This guarantees WCAG 2.2 SC 2.4.7 compliance — the focus ring always shows regardless of component CSS.

## Theme switching

Color tokens use `light-dark()`. When a `color-scheme` value is set on `<html>` (e.g. by `<pix-color-scheme-selector>`), all `--pix--c--*` tokens adapt automatically.
