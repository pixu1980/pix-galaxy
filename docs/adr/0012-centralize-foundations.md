# ADR-012: Centralize design-system foundations in `pix-foundations`

## Status

Accepted

## Context

Component CSS duplicated focus ring, typography, spacing, radius, and control styles. A single source of truth was required.

## Decision

Move foundational tokens and global rules into `packages/pix-foundations/lib/`:

- typography in `_typography.css`
- focus in `_focus.css`
- radii in `_radii.css`
- spacing in `_spacings.css`
- controls in `_controls.css`

Component CSS must use foundations tokens for focus, border-radius, gap, padding, margin, controls sizing, and typography.

## Consequences

Positive:

- Consistent control sizes and focus ring across components
- Lower component CSS duplication
- Better design-system governance

Negative:

- Broad CSS churn
- Existing component-specific text/spacing details removed or tokenized
- Artifact rebuild mandatory to see portal changes

## Follow-up

Future components must not define local focus/text/spacing primitives unless adding new foundations tokens first.

## Tags

css, design-tokens, architecture
