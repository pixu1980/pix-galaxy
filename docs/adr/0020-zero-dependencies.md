# ADR-020: Zero runtime dependencies is an absolute rule

## Status

Accepted

## Context

The monorepo is positioned as a public open-source library of zero-runtime-dependency vanilla JS Web Components.

## Decision

**Zero runtime dependencies** is an absolute, non-negotiable rule. No frameworks, no libraries, no runtime packages. Dev-only tooling (esbuild, vite, typescript, playwright, jsdom) is allowed in `devDependencies`.

## Rationale

- It is the project's DNA and differentiator
- Small, auditable, dependency-free components
- No supply-chain risk at runtime

## Consequences

Positive:

- Every component ships standalone
- Full control over bundle size and behavior

Negative:

- More hand-written code where a dependency would be convenient
- Certain features (e.g. WAV encoding) require custom implementations

## Follow-up

Enforce in CI (lint rule or review checklist).

## Tags

architecture, dependencies
