# __BRAND_NAME__

## Overview

This package exports a reusable native CSS design system.

## Install

Import the design system CSS from `__PACKAGE_NAME__/css`.

## Layers

The CSS entrypoint declares `@layer reset, foundations, layout, components, helpers;`.

## Token Levels

- Primitive tokens store raw values.
- Semantic tokens describe product meaning.
- Component aliases expose stable styling hooks for UI components.

## Foundations

- Typography lives in `src/foundations/_typography.css`.
- Spacing lives in `src/foundations/_spacings.css`.
- Radii live in `src/foundations/_radii.css`.
- Elevations live in `src/foundations/_elevations.css`.
- Colors live in `src/foundations/_colors.css`.

## Extras

- Reset styles live in `src/_reset.css`.
- Layout primitives live in `src/_layout.css`.
- Component aliases live in `src/_components.css`.
- Helpers live in `src/_helpers.css`.
