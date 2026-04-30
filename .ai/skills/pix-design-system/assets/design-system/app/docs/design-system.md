# __BRAND_NAME__

## Overview

This design system provides native CSS foundations, layout primitives, component aliases, and helpers.

## Install

Import `src/styles/index.css` from the application entrypoint.

## Layers

The CSS entrypoint declares `@layer reset, foundations, layout, components, helpers;`.

## Token Levels

- Primitive tokens store raw values.
- Semantic tokens describe product meaning.
- Component aliases expose stable styling hooks for UI components.

## Foundations

- Typography lives in `src/styles/foundations/typography.css`.
- Spacing lives in `src/styles/foundations/spacing.css`.
- Radii live in `src/styles/foundations/radii.css`.
- Elevations live in `src/styles/foundations/elevations.css`.
- Colors live in `src/styles/foundations/colors.css`.

## Extras

- Reset styles live in `src/styles/reset.css`.
- Layout primitives live in `src/styles/layout.css`.
- Component aliases live in `src/styles/components.css`.
- Helpers live in `src/styles/helpers.css`.
