# Examples

## Card with all tokens

```css
.panel {
  padding: var(--pix--s--md);
  border-radius: var(--pix--r--md);
  background: var(--pix--c--surface);
  color: var(--pix--c--text);
  border: 1px solid var(--pix--c--border);
  box-shadow: var(--pix--e--sm);
}

.panel h2 {
  font-family: var(--pix--t--font-family);
}
```

## Button

```css
.btn {
  padding: var(--pix--s--sm) var(--pix--s--md);
  border-radius: var(--pix--r--md);
  border: 1px solid var(--pix--c--border);
  background: var(--pix--c--surface);
  color: var(--pix--c--text);
  cursor: pointer;
}

.btn:focus-visible {
  outline: 2px solid var(--pix--f--color);
  outline-offset: 2px;
}

.btn-primary {
  background: var(--pix--c--accent);
  color: white;
  border-color: var(--pix--c--accent);
}
```

## Dark section override

```css
.hero {
  --pix--c--surface: oklch(0.15 0.015 260);
  --pix--c--text: oklch(0.9 0.01 85);
  --pix--c--border: oklch(0.3 0.01 0 / 0.4);
  padding: var(--pix--s--xl);
}
```

## Focus ring customisation

```css
:root {
  --pix--f--color: oklch(0.6 0.18 160);
}
```
