# ADR-019: Modern-only browser matrix with light-dark fallback kept

## Status

Accepted

## Context

The project uses `light-dark()`, `oklch()`, `adoptedStyleSheets`, and the CSS Highlight API. Supporting legacy browsers costs significant fallback CSS work.

## Decision

Target **modern-only** browsers (last ~2 years):

- Chrome 119+
- Safari 17.5+
- Firefox 120+

Despite the modern target, the `light-dark()` fallback pattern (ADR-004) is **kept** as cheap defence-in-depth — no new fallbacks are added elsewhere.

## Consequences

Positive:

- Less fallback CSS to write and maintain
- Can use modern CSS features freely

Negative:

- Older browsers (Safari 16, Chrome <119) get degraded or broken UI
- Fallback-before-`light-dark()` still adds slight CSS volume

## Follow-up

Document the matrix in `README.md` and component docs.

## Tags

browser-support, css, strategy
