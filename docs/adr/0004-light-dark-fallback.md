# ADR-004: CSS fallback before `light-dark()`

## Status

Accepted

## Context

`light-dark()` unsupported on older browsers - the declaration is completely dropped, not partially applied.

## Decision

Always add a fallback value BEFORE the `light-dark()` declaration:

```css
--color: oklch(0.18 0.012 60); /* fallback */
--color: light-dark(oklch(0.18 0.012 60), oklch(0.88 0.01 85));
```

## Rationale

Browsers apply the last valid declaration. Old browsers: fallback applies. Modern browsers: `light-dark()` wins.

## Consequences

- Slightly more CSS per declaration
- Even though the target matrix is modern-only (ADR-019), the fallback is kept as cheap defence-in-depth
- Fallback must be identical to the light-mode value to avoid visual drift

## Tags

css, theming, browser-support
