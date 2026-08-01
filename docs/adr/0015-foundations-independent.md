# ADR-015: Keep `pix-foundations` independent of `pix-core`

## Status

Accepted

## Context

Renaming `shared` to `pix-core` initially created a cycle:

```text
pix-core → pix-color-scheme-selector → pix-foundations → pix-core
```

## Decision

Remove the `pix-core` dependency from `pix-foundations`.

## Consequences

Positive:

- Avoids cyclic workspace dependency
- Keeps the design tokens package low-level and independent

Negative:

- Foundations docs may import `pix-core` at docs-app level, but the package manifest should not make foundations runtime depend on core

## Follow-up

Maintain foundations as a leaf/primitive design-system package.

## Tags

architecture, monorepo
