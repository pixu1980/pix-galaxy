# ADR-006: Oklch colour space

## Status

Accepted

## Context

Components need a perceptually uniform colour space for colour pickers and design tokens.

## Decision

Use `oklch()` for all colour values. Provide HSL/HEX/RGB in the colour picker for compatibility.

## Rationale

- Perceptually uniform (equal distance in colour ≈ equal perceptual difference)
- HDR-ready
- Supported in Chrome 111+, Safari 15.4+, Firefox 113+
- `color-mix(in srgb, ...)` for colour manipulation

## Consequences

- All `pix-foundations` colour tokens use `oklch()`
- Component CSS must use design tokens instead of raw hex/rgb values

## Tags

css, colour, design-tokens
