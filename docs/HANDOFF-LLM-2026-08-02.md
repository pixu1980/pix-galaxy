# pix-galaxy — LLM Handoff

**Date:** 2026-08-02 (end of session)
**Audience:** future LLM/developer session
**Scope:** new `@pix-galaxy/pix-vanilla-reactive` framework package, security hardening, stress tests, Explicit Resource Management. Generated via `pix-galaxy-mcp handoff`.

---

## Project Identity

Monorepo for the PixGalaxy ecosystem of zero-runtime-dependency vanilla JS Web Components. Branch: `develop` (trunk), `main` for releases only. Version 0.1.0.

## Session Summary

**Deliverable:** `packages/pix-vanilla-reactive/` — a zero-dependency reactive UI framework canonized from the `pix-frontend-vanilla-reactive` skill:

- **Store** — Proxy-based state container: `subscribe()`, `update()`, dot-path `get/set`, SSR-safe events target, `store:change` events, **prototype-pollution guard** (blocks `__proto__`/`prototype`/`constructor`).
- **Signals** — `Signal.State` / `Signal.Computed` / `effect()`, collector stack, microtask-batched scheduler, `untrack`.
- **Template engine** — `html` tagged templates, `render()` (mount/update/unmount), `{{ }}` expressions (escape-by-default, `| raw` hatch), `${ }` slots, `model` two-way binding, `repeat()` keyed lists, `<for>/<if>` string blocks, 22 filters.
- **Bridge** — `createTickState(store)` converts store writes into signal notifications.
- **Explicit Resource Management** — every disposable implements `.dispose()` + feature-detected `[Symbol.dispose]`; framework-owned `DisposableStack`/`AsyncDisposableStack` (use/adopt/defer/move, reverse-order disposal, `.suppressed` error aggregation). `using` works natively on ES2026 engines; Safari 17.5+ uses `.dispose()`.

**Hardening this session (real bugs found & fixed):**
1. XSS in `<for>/<if>` string templates (`{{ }}` now escaped; `| raw` is the explicit trusted-HTML hatch).
2. Store prototype pollution via `__proto__` paths (blocked with TypeError).
3. `{{ }}` in attribute values was broken (marker lost) — fixed.
4. `${ }` after `attr=` in text misparsed as attribute — parser heuristic tightened.
5. Memory leaks: repeat-block removal, template swap, and `render(null)` unmount now release all subscriptions (full `dispose()` chain).

**Validation:** 92 node:test tests (signals, store, expressions, template, security, stress, disposables) · typecheck 0 errors (JSDoc + `// @ts-check`) · esbuild artifact ESM+CJS with full `.d.ts` · docs site (shared pix-core template) · 3 runnable examples in `examples/` (counter, todo, form — no build step) · Prettier clean.

## ADR Log (24)

| # | Status | Title |
|---|--------|-------|
| 024 | Accepted | Migrate .agents skills to pix-galaxy-mcp, remove .agents |
| 023 | Accepted | JSDoc types with strict typecheck, no TypeScript migration |
| 022 | Accepted | Branch strategy — develop as trunk, main for releases |
| 021 | Accepted | WCAG 2.2 AA is a non-negotiable requirement |
| 020 | Accepted | Zero runtime dependencies is an absolute rule |
| 019 | Accepted | Modern-only browser matrix with light-dark fallback kept |
| 018 | Accepted | Local release via `commit-and-tag-version`, no CI publish |
| 017 | Accepted | Validate CSS with a real parser after automated refactors |
| 016 | Accepted | Root formatting and linting are reproducible scripts |
| 015 | Accepted | Keep `pix-foundations` independent of `pix-core` |
| 014 | Accepted | Centralize shared runtime and scripts in `pix-core` |
| 013 | Accepted | Centralize focus ring in `pix-foundations` |
| 012 | Accepted | Centralize design-system foundations in `pix-foundations` |
| 011 | Accepted | Rename `pix-display-preferences` → `pix-a11y-panel` |
| 010 | Accepted | Single test runner suite over scattered tests |
| 009 | Superseded | Release via standard-version (superseded by 018) |
| 008 | Accepted | `ElementInternals` for form association |
| 007 | Accepted | Shared docs template over per-package duplication |
| 006 | Accepted | Oklch colour space |
| 005 | Accepted | Private class fields for internal state |
| 004 | Accepted | CSS fallback before `light-dark()` |
| 003 | Accepted | `light-dark()` over CSS custom properties + media query |
| 002 | Accepted | `adoptedStyleSheets` over `<link>` or `<style>` |
| 001 | Accepted | Light DOM over Shadow DOM |

## Working Tree Changes (committed this session)

- `packages/pix-vanilla-reactive/` — the new framework package (61 source files)
- `scripts/dev-all.mjs` — knownColors mint entry
- `scripts/port-map.mjs` — DEV_PORT_ORDER (dev port 3012)
- `src/docs/content/components.json` — portal card
- `src/docs/index.js` — portal ICONS entry
- `pnpm-lock.yaml` — workspace link
- `docs/HANDOFF-LLM-2026-08-02.md` — this file

## Recent Commits (HEAD)

```
feat(pix-vanilla-reactive): add reactive framework with store, signals, template engine, disposables
050f4b1 refactor(release): align release pipeline with pi-coding-agent-extensions
13093b2 feat(release): migrate to commit-and-tag-version, local-only publishing
7a5e8cd docs: migrate 4 legacy docs sites to shared pix-core template
2ef09ad test(e2e): add axe-core audit and interaction tests, fix a11y violations
```

## Documentation Status

- Roadmap: `docs/plans/execution-plan.md` (modified 2026-08-02)
- `docs/HANDOFF.md` (22617B)
- `docs/HANDOFF-LLM-2026-07-08.md`
- `docs/adr/` — 24 ADRs + README

## Handoff Instruction

You are continuing work on **pix-galaxy** on branch `develop`. The `pix-vanilla-reactive` framework is complete and committed; a next logical step is consuming it in a component (e.g. wiring a reactive demo into the portal) or extending the docs. Follow the ADRs: zero runtime dependencies, light DOM, oklch, JSDoc + `@ts-check` with strict typecheck, `node:test`, shared pix-core build/docs scripts. Conventional commits with mandatory scope. Continue without re-asking answered questions.
