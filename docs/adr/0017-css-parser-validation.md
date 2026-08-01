# ADR-017: Validate CSS with a real parser after automated refactors

## Status

Accepted

## Context

A previous automated CSS tokenization pass introduced syntax errors such as broken `var()` and `light-dark()` expressions.

## Decision

Use the `lightningcss` parser validation after any broad CSS transformation.

## Consequences

Positive:

- Detects syntax errors not caught by grep or Prettier
- Prevents broken runtime styles

Negative:

- Requires command snippet or script wrapper until formalized

## Follow-up

Promote CSS parser validation into the root `quality` script or a dedicated `lint:css` script.

## Tags

css, tooling, quality
