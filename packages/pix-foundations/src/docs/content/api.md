# API

All tokens are CSS custom properties on `:root`, grouped by prefix.

## Radii — `--pix--r--*`

| Token | Value | Use |
|-------|-------|-----|
| `--pix--r--xs` | 2px | Micro decorations |
| `--pix--r--sm` | 4px | Small tags, badges |
| `--pix--r--md` | 8px | Buttons, inputs, cards |
| `--pix--r--lg` | 12px | Panels, modals |
| `--pix--r--xl` | 16px | Page sections |
| `--pix--r--pill` | 999px | Pills, chips, nav-links |

## Spacing — `--pix--s--*`

Scale ratio 1.25, base 1rem.

| Token | Value | Rem |
|-------|-------|-----|
| `--pix--s--xs` | 0.25rem | 4px |
| `--pix--s--sm` | 0.5rem | 8px |
| `--pix--s--md` | 1rem | 16px |
| `--pix--s--lg` | 1.5rem | 24px |
| `--pix--s--xl` | 2rem | 32px |
| `--pix--s--2xl` | 3rem | 48px |

## Colors — `--pix--c--*`

All color tokens use `light-dark()` for automatic light/dark mode.

| Token | Description |
|-------|-------------|
| `--pix--c--page` | Page background |
| `--pix--c--surface` | Card/surface background |
| `--pix--c--surface-raised` | Elevated surface (modals) |
| `--pix--c--text` | Primary text |
| `--pix--c--text-muted` | Secondary/muted text |
| `--pix--c--border` | Subtle borders |
| `--pix--c--border-strong` | Strong borders |
| `--pix--c--accent` | Accent / link colour |
| `--pix--c--success` | Positive feedback |
| `--pix--c--warning` | Warning feedback |
| `--pix--c--danger` | Error feedback |

## Focus — `--pix--f--*`

Applied globally via `:focus-visible`. Override per component:

```css
:focus-visible {
  outline-width: var(--pix--f--width);
  outline-offset: var(--pix--f--offset);
  outline-color: var(--pix--f--color);
}
```

## Elevations — `--pix--e--*`

| Token | Use case |
|-------|----------|
| `--pix--e--sm` | Subtle card shadow |
| `--pix--e--md` | Floating panels, dropdowns |
| `--pix--e--lg` | Modals, dialogs |

## Typography — `--pix--t--*`

| Token | Value |
|-------|-------|
| `--pix--t--font-family` | `system-ui, -apple-system, ...` |
| `--pix--t--font-family-mono` | `ui-monospace, SF Mono, ...` |
| `--pix--t--line-height` | 1.6 |
| `--pix--t--line-height-tight` | 1.2 |
