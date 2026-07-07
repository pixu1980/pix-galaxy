# How It Works

Pix-foundations provides a single CSS entry point that imports all token files in the correct order:

1. **Reset** — Normalises box-sizing, margins, and media elements.
2. **Radii** — Border-radius scale from 2px to 999px.
3. **Spacing** — Spacing scale (ratio 1.25) from 4px to 48px.
4. **Typography** — Font stacks and line-height.
5. **Colors** — Semantic color tokens using `light-dark()` for theme support.
6. **Focus** — Universal `:focus-visible` ring (2px solid currentColor).
7. **Elevations** — Box-shadow scale from subtle to prominent.

The focus ring is intentionally **unlayered** (imported before all layered tokens) so it always overrides component-specific styles. This guarantees WCAG 2.2 SC 2.4.7 compliance.
