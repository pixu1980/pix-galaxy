# ADR-021: WCAG 2.2 AA is a non-negotiable requirement

## Status

Accepted

## Context

Accessibility is core to the library's value proposition.

## Decision

Every component must meet **WCAG 2.2 AA** - keyboard navigation, ARIA semantics, color contrast, visible focus, screen-reader announcements (including `aria-live` for dynamic content). This is a hard requirement even when it slows development.

## Consequences

Positive:

- Components are usable by everyone
- Compliance is a selling point for an open-source library

Negative:

- Some interactions (drag & drop, autocomplete) need extra keyboard/A11y work
- Automated axe-core audit needed to verify (Phase 4)

## Follow-up

- axe-core audit on portal + docs sites (Phase 4)
- `aria-live` on pix-command dynamic results

## Tags

accessibility, quality
