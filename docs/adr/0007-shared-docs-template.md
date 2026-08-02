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

- Centralises the docs template in `@pix-galaxy/pix-core/docs/docs-site.js`; each package imports `createDocsSite()`, `buildDocsPages()`
- All 11 component docs sites now use the shared template (migration completed in Phase 5, 2026-07-09)
- Shared CSS in `packages/pix-core/docs/docs.css` adopted automatically
- Docs sites gain the shared `pix-color-scheme-selector`, live component preview (`liveHtml`), and WCAG 2.2 AA compliance (axe-core audited)

## Tags

docs, architecture, monorepo
