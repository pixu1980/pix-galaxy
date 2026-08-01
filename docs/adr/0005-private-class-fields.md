# ADR-005: Private class fields for internal state

## Status

Accepted

## Context

Component internal state needs encapsulation.

## Decision

Use `#private` fields for all internal state, DOM references, and bound handlers. Public API via getters/setters.

## Rationale

- True privacy (not just convention with `_` prefix)
- Prevents accidental external access
- Works with `static {}` blocks for class-level initialisation

## Consequences

- Cannot be accessed by subclass — use `_protected` convention for extensible methods
- Legacy components (accent-color-selector, highlighter) still use `_` prefix — migration pending
- Event listeners must be pre-bound private fields (never inline arrows or `.bind()`) to allow removal in `disconnectedCallback`

## Tags

web-components, javascript
