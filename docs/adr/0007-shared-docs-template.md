# ADR-007: Shared docs template over per-package duplication

## Status

Accepted

## Context

Each package has a documentation site. Initially the template was duplicated per package.

## Decision

Centralise the docs template in `@pix-galaxy/pix-core/docs/docs-site.js`. Each package imports `createDocsSite()`, `buildDocsPages()`.

## Rationale

- Single source of truth for docs layout
- All sites get new features automatically
- Consistent visual appearance

## Consequences

- Legacy components (highlighter, accent-color-selector, color-scheme-selector) still use the inline template — migration pending (Phase 5)
- Shared CSS in `packages/pix-core/docs/docs.css` adopted automatically

## Tags

docs, architecture, monorepo
