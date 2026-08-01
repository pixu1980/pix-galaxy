# API

All tokens are CSS custom properties on `:root`, grouped by prefix.

## Radii — `--pix-ds--r--*`

| Token               | Value | Use                     |
| ------------------- | ----- | ----------------------- |
| `--pix-ds--r--xs`   | 2px   | Micro decorations       |
| `--pix-ds--r--sm`   | 4px   | Small tags, badges      |
| `--pix-ds--r--md`   | 8px   | Buttons, inputs, cards  |
| `--pix-ds--r--lg`   | 12px  | Panels, modals          |
| `--pix-ds--r--xl`   | 16px  | Page sections           |
| `--pix-ds--r--pill` | 999px | Pills, chips, nav-links |

## Spacing — `--pix-ds--s--*`

Scale ratio 1.25, base 1rem.

| Token              | Value   | Rem  |
| ------------------ | ------- | ---- |
| `--pix-ds--s--xs`  | 0.25rem | 4px  |
| `--pix-ds--s--sm`  | 0.5rem  | 8px  |
| `--pix-ds--s--md`  | 1rem    | 16px |
| `--pix-ds--s--lg`  | 1.5rem  | 24px |
| `--pix-ds--s--xl`  | 2rem    | 32px |
| `--pix-ds--s--2xl` | 3rem    | 48px |

## Colors — `--pix-ds--c--*`

All color tokens use `light-dark()` for automatic light/dark mode.

| Token                         | Description               |
| ----------------------------- | ------------------------- |
| `--pix-ds--c--page`           | Page background           |
| `--pix-ds--c--surface`        | Card/surface background   |
| `--pix-ds--c--surface-raised` | Elevated surface (modals) |
| `--pix-ds--c--text`           | Primary text              |
| `--pix-ds--c--text-muted`     | Secondary/muted text      |
| `--pix-ds--c--border`         | Subtle borders            |
| `--pix-ds--c--border-strong`  | Strong borders            |
| `--pix-ds--c--accent`         | Accent / link colour      |
| `--pix-ds--c--success`        | Positive feedback         |
| `--pix-ds--c--warning`        | Warning feedback          |
| `--pix-ds--c--danger`         | Error feedback            |

## Focus — `--pix-ds--f--*`

Applied globally via `:focus-visible`. Override per component:

```css
:focus-visible {
  outline-width: var(--pix-ds--f--width);
  outline-offset: var(--pix-ds--f--offset);
  outline-color: var(--pix-ds--f--color);
}
```

## Elevations — `--pix-ds--e--*`

| Token             | Use case                   |
| ----------------- | -------------------------- |
| `--pix-ds--e--sm` | Subtle card shadow         |
| `--pix-ds--e--md` | Floating panels, dropdowns |
| `--pix-ds--e--lg` | Modals, dialogs            |

## Typography — `--pix-ds--t--*`

| Token                            | Value                           |
| -------------------------------- | ------------------------------- |
| `--pix-ds--t--font-family`       | `system-ui, -apple-system, ...` |
| `--pix-ds--t--font-family-mono`  | `ui-monospace, SF Mono, ...`    |
| `--pix-ds--t--line-height`       | 1.6                             |
| `--pix-ds--t--line-height-tight` | 1.2                             |
