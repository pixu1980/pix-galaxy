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
- `components`: component contracts and commented placeholders only.
- `helpers`: one-purpose utility helpers.

The `foundations` layer uses sub-layers declared in `foundations/index.css`:

```css
@import "./_colors.css" layer(colors);
@import "./_typography.css" layer(typography);
@import "./_spacings.css" layer(spacings);
@import "./_radii.css" layer(radii);
@import "./_elevations.css" layer(elevations);
```

## Skill Source Of Truth

Inside the skill, shared assets are the only source of truth for starter CSS and starter docs:

```text
assets/design-system/shared/styles/
assets/design-system/shared/docs/design-system.md
```

The `app/` and `package/` starter trees keep their public structure, but their duplicated CSS and docs files are thin wrappers that point back to `shared/` through relative imports or include directives.

The installer resolves those wrappers and materializes normal output files in the target project.

## Installed File Layout

App mode installs:

```text
src/styles/index.css
src/styles/_reset.css
src/styles/foundations/index.css
src/styles/foundations/_colors.css
src/styles/foundations/_typography.css
src/styles/foundations/_spacings.css
src/styles/foundations/_radii.css
src/styles/foundations/_elevations.css
src/styles/_layout.css
src/styles/_components.css
src/styles/_helpers.css
docs/design-system.md
```

Package mode installs the same CSS structure under `src/` inside a package folder, plus package-specific metadata files.

## Token Levels

Use three token levels:
- Primitive tokens store raw values, for example `--color-primitive-accent-500`.
- Semantic tokens describe meaning, for example `--color-surface`.
- Component aliases expose UI contracts, for example `--card-border-radius`.

Typography, spacing, and radii primitives should start from namespaced base tokens and ratio tokens:
- `--ds--typography--font-size--base` + `--ds--typography--ratio`
- `--ds--spacings--base` + `--ds--spacings--ratio`
- `--ds--radii--base` + `--ds--radii--ratio`

Use CSS `pow()` to derive the proportional scale before mapping semantic aliases.

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
- Keep component-level contracts in aliases and commented placeholders, not in shipped component implementations.

## Maintenance Checklist

- Keep docs and examples in English.
- Update docs when token names change.
- Update `shared/` first, then keep wrappers thin.
- Run installer tests after editing script or assets.
- Run router tests after editing `pix-galaxy`.
- Keep starter files small and split by responsibility.
