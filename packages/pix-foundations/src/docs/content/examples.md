# Examples

## Card with all tokens

```css
.panel {
  padding: var(--pix-ds--s--md);
  border-radius: var(--pix-ds--r--md);
  background: var(--pix-ds--c--surface);
  color: var(--pix-ds--c--text);
  border: 1px solid var(--pix-ds--c--border);
  box-shadow: var(--pix-ds--e--sm);
}

.panel h2 {
  font-family: var(--pix-ds--t--font-family);
}
```

## Button

```css
.btn {
  padding: var(--pix-ds--s--sm) var(--pix-ds--s--md);
  border-radius: var(--pix-ds--r--md);
  border: 1px solid var(--pix-ds--c--border);
  background: var(--pix-ds--c--surface);
  color: var(--pix-ds--c--text);
  cursor: pointer;
}

.btn:focus-visible {
  outline: 2px solid var(--pix-ds--f--color);
  outline-offset: 2px;
}

.btn-primary {
  background: var(--pix-ds--c--accent);
  color: white;
  border-color: var(--pix-ds--c--accent);
}
```

## Dark section override

```css
.hero {
  --pix-ds--c--surface: oklch(0.15 0.015 260);
  --pix-ds--c--text: oklch(0.9 0.01 85);
  --pix-ds--c--border: oklch(0.3 0.01 0 / 0.4);
  padding: var(--pix-ds--s--xl);
}
```

## Focus ring customisation

```css
:root {
  --pix-ds--f--color: oklch(0.6 0.18 160);
}
```
