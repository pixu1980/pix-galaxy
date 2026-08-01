# ADR-010: Single test runner suite over scattered tests

## Status

Accepted

## Context

Component testing was ad-hoc with varying quality.

## Decision

Use Playwright for e2e tests (22 tests covering portal + all docs sites). Each component has a minimal node:test smoke test.

## Rationale

- Playwright catches real browser rendering issues
- Smoke tests verify element registration and basic rendering
- Combined: fast unit-level + comprehensive browser-level

## Consequences

- Tests depend on dev servers running (12 servers)
- CI needs dev server setup
- Portal card count test must be kept in sync with `components.json`
- Unit tests per component planned (Phase 4) — registration, render, events, cleanup

## Tags

testing, quality
