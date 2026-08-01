# ADR-002: `adoptedStyleSheets` over `<link>` or `<style>`

## Status

Accepted

## Context

Components need to inject CSS into the page.

## Decision

Use `document.adoptedStyleSheets` via a singleton `CSSStyleSheet` per component.

## Rationale

- No duplicate `<style>` elements for multiple component instances
- Styles are parsed once, shared across all instances
- Works with `@layer`, `@supports`, `@container`
- Fallback to single `<style>` element when `adoptedStyleSheets` not supported

## Consequences

- Order of stylesheet adoption matters (last wins)
- Use `includes()` check to avoid duplicate adoption
- Inline `?raw` CSS imports (Vite) or `bundle-text:` (Parcel)

## Tags

css, web-components
