# ADR-001: Light DOM over Shadow DOM

## Status

Accepted

## Context

Custom Elements can use Shadow DOM for encapsulation or Light DOM for simplicity.

## Decision

All components use Light DOM + `document.adoptedStyleSheets`. No Shadow DOM, no `<template>` elements.

## Rationale

- Shadow DOM breaks form participation (need `ElementInternals`)
- Shadow DOM breaks global CSS (fonts, reset, design tokens)
- Shadow DOM adds performance cost (style recalculation per shadow root)
- Light DOM + `data-part` selectors provide sufficient encapsulation

## Consequences

- CSS uses `@layer` to isolate component styles
- Component styles are prefixed with component element selector (e.g., `pix-command [data-part="input"]`)
- Need to be careful about global CSS conflicts

## Tags

web-components, architecture
