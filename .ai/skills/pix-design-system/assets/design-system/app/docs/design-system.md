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

- Typography lives in `src/styles/foundations/_typography.css`.
- Spacing lives in `src/styles/foundations/_spacings.css`.
- Radii live in `src/styles/foundations/_radii.css`.
- Elevations live in `src/styles/foundations/_elevations.css`.
- Colors live in `src/styles/foundations/_colors.css`.

## Extras

- Reset styles live in `src/styles/_reset.css`.
- Layout primitives live in `src/styles/_layout.css`.
- Component aliases live in `src/styles/_components.css`.
- Helpers live in `src/styles/_helpers.css`.
