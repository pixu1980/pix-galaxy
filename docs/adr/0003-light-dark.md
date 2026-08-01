# ADR-003: `light-dark()` over CSS custom properties + media query toggle

## Status

Accepted

## Context

Components need light/dark mode support.

## Decision

Use `light-dark()` CSS function instead of `@media (prefers-color-scheme)` or JavaScript toggle.

## Rationale

- Single declaration handles both modes
- Works with `pix-color-scheme-selector` which sets `document.documentElement.style.colorScheme`
- No JavaScript needed for theme switching
- Supported in Chrome 119+, Safari 17.5+, Firefox 120+

## Consequences

- Add fallback before `light-dark()` for older browsers (see ADR-004)
- `light-dark()` reads from computed `color-scheme` on the element
- Target browser matrix is modern-only (see ADR-019), fallback kept as defence-in-depth

## Tags

css, theming, web-components
