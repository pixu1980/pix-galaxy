# Foundations Reference

## Typography

Typography starts from `--ds--typography--font-size--base` and `--ds--typography--ratio`.

Use CSS `pow()` to derive the proportional scale, then map semantic aliases such as `--font-size-0` and `--font-size-1` from the namespaced source tokens.

Core checks:
- `--ds--typography--font-family--sans` exists and reflects project identity.
- `--ds--typography--font-size--base` remains readable as default body text.
- Heading steps derive from `pow(var(--ds--typography--ratio), n)` rather than hard-coded one-off values.
- Paragraph measure prevents overly long lines.

## Spacing

Spacing starts from `--ds--spacings--base`, `--ds--spacings--ratio`, and `--ds--spacings--density`.

Treat density as the multiplier that changes the base value. Derive the rest of the scale from the base with `pow()` so the whole system stays proportional.

Core checks:
- Spacing scale progresses predictably from the base token.
- `--space-*` aliases map to the namespaced proportional scale.
- Layout spacing uses semantic tokens such as `--space-layout`.
- Component spacing guidance uses aliases such as `--stack-gap`.

## Radii

Radii start from `--ds--radii--base` and `--ds--radii--ratio`.

Keep semantic aliases such as `--radius-control` and `--radius-panel`, but derive their backing values from the namespaced proportional scale.

Core checks:
- `--radius-control` maps to the selected radius base.
- Supporting radius steps derive from `pow(var(--ds--radii--ratio), n)`.
- Components consume aliases such as `--card-border-radius`.
- Pill and circle tokens exist only for shapes that require them.

## Elevations

Elevation tokens define depth, overlay treatment, and focus ring geometry.

Use shadows sparingly and keep focus ring tokens separate from decorative shadow tokens.

Core checks:
- Low, medium, high, and overlay elevations exist.
- Focus ring width and offset are explicit.
- Component aliases such as `--card-box-shadow` map to semantic elevation.

## Colors

Color tokens use primitive, semantic, and component alias levels.

Primitive tokens store raw palette values. Semantic tokens describe product meaning. Component aliases expose stable hooks for UI parts.

Core checks:
- `--color-primitive-accent-500` uses the configured accent.
- Text, muted text, canvas, surface, border, focus, danger, success, and warning semantic tokens exist.
- Component aliases do not point directly to hex values when a semantic token exists.

## Token Review Checklist

- Primitive tokens hold raw values.
- Semantic tokens express intent.
- Component aliases express stable component styling contracts.
- The `components` layer documents hooks with commented placeholders only; it does not ship concrete component implementations.
- App and package starter duplicates point back to `shared/` as the single source of truth inside the skill.
- Token names stay readable and do not use BEM, SMACSS, OOCSS, ITCSS, CUBE CSS, or similar methodology naming.
- Accessibility-sensitive tokens cover focus, contrast, reduced motion, and readable spacing.
