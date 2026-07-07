# Examples

## Using tokens in a component

```css
.my-component {
  padding: var(--pix--s--md);
  border-radius: var(--pix--r--md);
  background: var(--pix--c--surface);
  color: var(--pix--c--text);
  border: 1px solid var(--pix--c--border);
  box-shadow: var(--pix--e--sm);
}
```

## Override tokens for a section

```css
.dark-section {
  --pix--c--surface: oklch(0.18 0.01 260);
  --pix--c--text: oklch(0.88 0.01 85);
}
```
