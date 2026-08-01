# ADR-013: Centralize focus ring in `pix-foundations`

## Status

Accepted

## Context

Components contained local `:focus-visible`, `outline`, and focus box-shadow rules.

## Decision

Only `packages/pix-foundations/lib/_focus.css` manages the focus ring. Focus selectors in component/docs CSS were removed.

## Consequences

Positive:

- Focus ring consistency
- Lower risk of inaccessible missing focus states
- WCAG focus behavior controlled globally

Negative:

- Components cannot customize focus style locally
- Special focus geometry must be handled through foundations tokens or structural CSS

## Follow-up

Add dedicated focus tokens in `pix-foundations` if special offset/width variants are needed.

## Tags

css, accessibility, design-tokens
