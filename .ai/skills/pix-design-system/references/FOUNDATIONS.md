# Foundations Reference

## Typography

Typography tokens define font family, type scale, line height, weight, tracking, and readable measure.

Use primitive tokens for raw type values and semantic tokens for usage decisions. Keep component aliases stable so components can change internals without breaking consumers.

Core checks:
- `--font-family-sans` exists and reflects project identity.
- `--font-size-0` remains readable as default body text.
- Heading line height is tighter than body line height.
- Paragraph measure prevents overly long lines.

## Spacing

Spacing tokens define density-aware rhythm for components and layouts.

Use `--density-scale` to tune compact, comfortable, or spacious interfaces without renaming every token.

Core checks:
- Spacing scale progresses predictably.
- Layout spacing uses semantic tokens such as `--space-layout`.
- Component spacing uses aliases such as `--stack-gap`.

## Radii

Radii tokens define shape language.

Keep primitive values for raw shape options and semantic aliases for controls, panels, cards, and special cases.

Core checks:
- `--radius-control` maps to the selected radius mode.
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
- Token names stay readable and do not use BEM, SMACSS, OOCSS, ITCSS, CUBE CSS, or similar methodology naming.
- Accessibility-sensitive tokens cover focus, contrast, reduced motion, and readable spacing.
