# ADR-011: Rename `pix-display-preferences` to `pix-a11y-panel`

## Status

Accepted

## Context

The component formerly called `pix-display-preferences` primarily exposes accessibility, typography, radius, and display preferences. The intended name is `pix-a11y-panel`.

## Decision

Rename package, custom element, class, CSS selectors, storage key, docs, tests, and portal references from `pix-display-preferences` to `pix-a11y-panel`.

## Consequences

Positive:

- Name reflects user intent and product semantics
- Portal and component catalog use consistent naming

Negative:

- Breaking API/package rename
- Existing saved localStorage under old key is not migrated
- `DisplayPreferences` typedef kept as deprecated alias of `A11yPanelPreferences`

## Follow-up

If backward compatibility is needed, add one-time migration from `pix-display-preferences` storage key.

## Tags

rename, a11y, package
