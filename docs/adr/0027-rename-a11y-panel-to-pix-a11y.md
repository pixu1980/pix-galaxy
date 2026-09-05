# ADR-027: Rename `pix-a11y-panel` to `pix-a11y`

## Status

Accepted

## Context

`pix-a11y-panel` is the display-preferences popover (color scheme, accent, typography, radius) and the design-system control surface every docs site mounts next to the color-scheme selector. The `-panel` suffix describes one presentation detail instead of the package's role; the intended name is `pix-a11y` (follows ADR-011, which renamed `pix-display-preferences` to `pix-a11y-panel`). Nothing is published to npm yet, so the rename has no external consumers to migrate.

## Decision

Rename package, custom element (`pix-a11y`), class (`PixA11y`), CSS selectors, storage key, docs, tests, catalog, e2e maps, and portal references from `pix-a11y-panel` to `pix-a11y`. Historical records (ADR-011, plans, handoffs) keep the old name.

## Consequences

Positive:

- Short name matches the package's role as the suite-wide a11y control surface
- Package, element tag, class, and storage key use consistent naming

Negative:

- Breaking API/package rename
- Existing saved localStorage under the old key is not migrated (no published users)

## Tags

rename, a11y, package
