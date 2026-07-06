# __BRAND_NAME__

## Overview

This design system provides native CSS foundations, layout primitives, component token contracts, and helpers.

## Install

__INSTALL_LINE__

## Layers

The CSS entrypoint declares `@layer reset, foundations, layout, components, helpers;`.

## Token Levels

- Primitive tokens store raw values.
- Semantic tokens describe product meaning.
- Component aliases expose stable styling hooks for UI components without hard-coding implementations.

## Foundations

- Typography lives in `__STYLE_ROOT__/foundations/_typography.css` and scales from `--ds--typography--font-size--base` with `pow(var(--ds--typography--ratio), n)`.
- Spacing lives in `__STYLE_ROOT__/foundations/_spacings.css` and scales from `--ds--spacings--base` with `pow(var(--ds--spacings--ratio), n)`.
- Radii live in `__STYLE_ROOT__/foundations/_radii.css` and scale from `--ds--radii--base` with `pow(var(--ds--radii--ratio), n)`.
- Elevations live in `__STYLE_ROOT__/foundations/_elevations.css`.
- Colors live in `__STYLE_ROOT__/foundations/_colors.css`.

## Extras

- Reset styles live in `__STYLE_ROOT__/_reset.css`.
- Layout primitives live in `__STYLE_ROOT__/_layout.css`.
- Component guidance lives in `__STYLE_ROOT__/_components.css` as commented placeholder examples only.
- Helpers live in `__STYLE_ROOT__/_helpers.css`.

## Source of Truth

Inside this skill, shared CSS and docs live under `assets/design-system/shared/`. App and package starter files point back to those shared templates so updates stay centralized.

## Browser Support Note

The proportional foundation scales use CSS `pow()`. If the target needs older browser support, precompute fallback tokens during build or add alias fallbacks in the consuming project.
