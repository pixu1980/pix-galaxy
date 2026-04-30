# Design System Architecture

## Layers

Use one stable cascade declaration:

```css
@layer reset, foundations, layout, components, helpers;
```

Layer responsibilities:
- `reset`: safe defaults and focus visibility.
- `foundations`: tokens and basic text defaults.
- `layout`: containers, grids, stacks, clusters, and sections.
- `components`: component aliases and low-level UI defaults.
- `helpers`: one-purpose utility helpers.

## File Layout

App mode installs:

```text
src/styles/index.css
src/styles/reset.css
src/styles/foundations/colors.css
src/styles/foundations/typography.css
src/styles/foundations/spacing.css
src/styles/foundations/radii.css
src/styles/foundations/elevations.css
src/styles/layout.css
src/styles/components.css
src/styles/helpers.css
docs/design-system.md
```

Package mode installs the same CSS structure under `src/` inside a package folder.

## Token Levels

Use three token levels:
- Primitive tokens store raw values, for example `--color-primitive-accent-500`.
- Semantic tokens describe meaning, for example `--color-surface`.
- Component aliases expose UI contracts, for example `--card-border-radius`.

This hierarchy keeps product identity, system meaning, and component implementation separate.

## Selector Strategy

Prefer selectors in this order:
- Elements when native semantics fit.
- Attributes for variants, layout helpers, and component aliases.
- Classes only when element or attribute selectors cannot express the target safely.

Avoid id selectors for reusable systems.

## Native CSS Rules

- Use native CSS only.
- Use custom properties for reusable decisions.
- Use CSS nesting only where it improves scoping and stays shallow.
- Avoid `!important` except for helpers such as `[hidden]`.
- Keep global rules in reset and foundations.
- Keep component-level contracts in component aliases.

## Maintenance Checklist

- Keep docs and examples in English.
- Update docs when token names change.
- Run installer tests after editing script or assets.
- Run router tests after editing `pix-galaxy`.
- Keep starter files small and split by responsibility.
