# pix-galaxy — LLM Handoff

**Date:** 2026-08-02
**Audience:** future LLM/developer session
**Scope:** project identity, full ADR log (24), recent commits, documentation status. Generated via `pix-galaxy-mcp handoff --compress`.

---

## HANDOFF: pix-galaxy

### Project Identity
- Description: Monorepo for PixGalaxy ecosystem of zero-runtime-dependency vanilla JS Web Components
- Version: 0.1.0

### ADR Log

| # | Status | Title | Tags | Decision |
|---|--------|-------|------|----------|
| 024 | Accepted | Migrate .agents skills to pix-galaxy-mcp, remove .agents |  | - Migrate the two valuable skills to `pix-galaxy-mcp`:   - `pix-custom-element` → **`pix-frontend... |
| 023 | Accepted | JSDoc types with strict typecheck, no TypeScript migration |  | Keep **vanilla JS + JSDoc types** and enforce **strict typecheck** in CI (`tsc --noEmit` with str... |
| 022 | Accepted | Branch strategy — develop as trunk, main for releases |  | - **`develop`** is the trunk: all work lands here - **`main`** receives merges only for releases |
| 021 | Accepted | WCAG 2.2 AA is a non-negotiable requirement |  | Every component must meet **WCAG 2.2 AA** — keyboard navigation, ARIA semantics, color contrast, ... |
| 020 | Accepted | Zero runtime dependencies is an absolute rule |  | **Zero runtime dependencies** is an absolute, non-negotiable rule. No frameworks, no libraries, n... |
| 019 | Accepted | Modern-only browser matrix with light-dark fallback kept |  | Target **modern-only** browsers (last ~2 years):  |
| 018 | Accepted | Local release via `commit-and-tag-version`, no CI publish |  | - Replace `standard-version` with **`commit-and-tag-version`** - Adopt the release orchestration ... |
| 017 | Accepted | Validate CSS with a real parser after automated refactors |  | Use the `lightningcss` parser validation after any broad CSS transformation.  |
| 016 | Accepted | Root formatting and linting are reproducible scripts |  | Root `package.json` exposes:  |
| 015 | Accepted | Keep `pix-foundations` independent of `pix-core` |  | Remove the `pix-core` dependency from `pix-foundations`.  |
| 014 | Accepted | Centralize shared runtime and scripts in `pix-core` |  | Rename `packages/shared` to `packages/pix-core` and move shared build/test/docs scripts there. Up... |
| 013 | Accepted | Centralize focus ring in `pix-foundations` |  | Only `packages/pix-foundations/lib/_focus.css` manages the focus ring. Focus selectors in compone... |
| 012 | Accepted | Centralize design-system foundations in `pix-foundations` |  | Move foundational tokens and global rules into `packages/pix-foundations/lib/`:  |
| 011 | Accepted | Rename `pix-display-preferences` to `pix-a11y-panel` |  | Rename package, custom element, class, CSS selectors, storage key, docs, tests, and portal refere... |
| 010 | Accepted | Single test runner suite over scattered tests |  | Use Playwright for e2e tests (22 tests covering portal + all docs sites). Each component has a mi... |
| 009 | Superseded | Release via standard-version |  | Use `standard-version` for semver bump, CHANGELOG generation, and git tag creation. Single orches... |
| 008 | Accepted | `ElementInternals` for form association |  | Use the `ElementInternals` API (`static formAssociated = true`, `attachInternals()`, `setFormValu... |
| 007 | Accepted | Shared docs template over per-package duplication |  | Centralise the docs template in `@pix-galaxy/pix-core/docs/docs-site.js`. Each package imports `c... |
| 006 | Accepted | Oklch colour space |  | Use `oklch()` for all colour values. Provide HSL/HEX/RGB in the colour picker for compatibility.  |
| 005 | Accepted | Private class fields for internal state |  | Use `#private` fields for all internal state, DOM references, and bound handlers. Public API via ... |
| 004 | Accepted | CSS fallback before `light-dark()` |  | Always add a fallback value BEFORE the `light-dark()` declaration:  |
| 003 | Accepted | `light-dark()` over CSS custom properties + media query t... |  | Use `light-dark()` CSS function instead of `@media (prefers-color-scheme)` or JavaScript toggle.  |
| 002 | Accepted | `adoptedStyleSheets` over `<link>` or `<style>` |  | Use `document.adoptedStyleSheets` via a singleton `CSSStyleSheet` per component.  |
| 001 | Accepted | Light DOM over Shadow DOM |  | All components use Light DOM + `document.adoptedStyleSheets`. No Shadow DOM, no `<template>` elem... |

### Recent Commits

```
cd644e4 refactor(release): align release pipeline with pi-coding-agent-extensions
13093b2 feat(release): migrate to commit-and-tag-version, local-only publishing
7a5e8cd docs: migrate 4 legacy docs sites to shared pix-core template
2ef09ad test(e2e): add axe-core audit and interaction tests, fix a11y violations
f7bcaa5 fix(types): add missing index.types.js and enable typecheck in quality
c811df0 fix: address remaining critical issues and repair pre-existing test failures
b33137a docs(adr): consolidate 24 ADRs into docs/adr with status
e704b7c chore: remove .agents, migrate skills to pix-galaxy-mcp
b25e06c docs: mark phase 0-1 complete in execution plan
fd2d642 chore: untrack test result artifacts (now gitignored)
b18b298 docs: update handoff, architecture review, and execution plan
```

### Documentation Status

**Roadmaps:**
- `docs/plans/execution-plan.md` (9530B, last modified: 2026-08-02)

**Key documents:**
- `docs/HANDOFF-LLM-2026-07-08.md` (12981B, 2026-08-02)
- `docs/HANDOFF.md` (22617B, 2026-08-02)
- `docs/adr/0007-shared-docs-template.md` (974B, 2026-08-02)
- `docs/adr/README.md` (5237B, 2026-08-02)
- `docs/adr/0001-light-dom-over-shadow-dom.md` (812B, 2026-08-01)
- `docs/adr/0002-adopted-stylesheets.md` (711B, 2026-08-01)
- `docs/adr/0003-light-dark.md` (792B, 2026-08-01)
- `docs/adr/0004-light-dark-fallback.md` (796B, 2026-08-01)
- `docs/adr/0005-private-class-fields.md` (800B, 2026-08-01)
- `docs/adr/0006-oklch-colour-space.md` (657B, 2026-08-01)

### Handoff Instruction

You are continuing work on **pix-galaxy**.
ADR log and context snapshot capture everything decided so far.

Review ADRs for architectural decisions. Review snapshot for configuration.
Continue without re-asking answered questions.
