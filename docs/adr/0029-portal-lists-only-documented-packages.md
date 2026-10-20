# ADR-029: The portal lists only packages with published documentation

## Status

Accepted

## Context

The component portal (`src/docs`) rendered one card per catalog entry in `src/docs/content/components.json`, including a placeholder entry (`coming-soon`, no `packageName`, no `homepage`) that appeared as a card titled "Coming Soon..." sorted last in the Components section. The placeholder card was styled with `opacity: 0.6` and `pointer-events: none` while still being an anchor with `href="#"` and `tabIndex` 0.

Measured on the portal before ADR-029: the placeholder description reached 2.52:1 contrast in the light scheme and 4.46:1 in the dark one, axe-core reported `color-contrast` as a serious violation on that node, keyboard focus landed on a link that went nowhere, and the placeholder title appeared in the heading outline next to real section headings.

## Decision

The portal lists only entries that have a documentation homepage. `groupSections` in `src/docs/catalog.js` drops entries without `homepage` before splitting the catalog into the Components and Libraries sections, so a placeholder can no longer reach a rendered card, the card sort no longer needs a placeholder rank, `summarize` no longer excludes placeholder entries, and the card template, its CSS and the portal e2e expectations carry no placeholder branch.

## Consequences

Positive:

- Every rendered card opens real documentation, so the catalog has no dead links and no focusable element without a destination
- The card contrast violation measured by axe is gone (only `aria-allowed-role` remains, tracked as UI-03)
- One less visual state to style, test and document

Negative:

- The portal no longer advertises work in progress that has no documentation site yet; that signal now lives only in the WIP badge on entries that do have one
- Reintroducing a "coming soon" surface later means designing it as a first-class status with its own contrast and focus rules, not as a dimmed card

## Tags

portal, catalog, ui, accessibility
