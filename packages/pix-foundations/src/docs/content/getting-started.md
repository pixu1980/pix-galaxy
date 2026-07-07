# Getting Started

## Installation

```bash
pnpm add @pix-galaxy/pix-foundations
```

In your CSS entry point:

```css
@import '@pix-galaxy/pix-foundations/foundations.css';
```

For Vite projects, also works as a JS import:

```js
import '@pix-galaxy/pix-foundations/foundations.css';
```

## What you get

Once imported, every `--pix--*` custom property is available on `:root`:

```css
.card {
  padding: var(--pix--s--md);
  border-radius: var(--pix--r--md);
  background: var(--pix--c--surface);
  color: var(--pix--c--text);
  box-shadow: var(--pix--e--sm);
}
```

No classes. No components. Pure CSS custom properties.
