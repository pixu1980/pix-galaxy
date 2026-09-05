# Roadmap

Public roadmap for pix-galaxy (ADR-026). Status: `[ ]` planned · `[x]` done · `[~]` in progress.

## 1 · UI & portal audit

- [ ] Hero/header: typography, gradient title, controls placement (sanity pass done, refine further)
- [ ] Cards & grid: visual density, hover/focus states, WIP blur treatment across breakpoints
- [ ] Dark mode & theme: contrast sweep, accent-color propagation on every surface
- [ ] Responsive/mobile: portal + per-package docs sites on small viewports
- [ ] Accessibility audit: `@axe-core/playwright` on the portal, keyboard walkthrough of all components

## 2 · Documentation & context

- [ ] Consumer quickstarts: install + first-use guides for every public package
- [ ] API reference: full attribute/property/event/method tables per component
- [ ] Migration & version notes: guidance between majors, deprecation notices
- [ ] Showcase/gallery: live demos and use-cases on the portal

## 3 · Component behavior

- [ ] Form & `ElementInternals`: native form association, validity, `FormData` support
- [ ] i18n / l10n / RTL: localizable labels, `dir="rtl"` layouts
- [x] SSR / hydration safety: DOM-less import smoke across all public packages (scripts/ssr-smoke.mjs, `pnpm test:ssr`) — guarded custom-element registration + guarded base classes
- [ ] Keyboard & focus-trap patterns: dialog, command palette, popover, sortable

## 4 · Quality bar (enforced before any package is promoted/published, ADR-026)

- [x] `node:test` unit tests (present per package)
- [x] Playwright e2e — port-discovery resilient (e2e/ports.mjs), **54/54 green**
- [x] `@axe-core/playwright` on the portal + every docs site — portal contrast violations fixed (WIP badge/pill colors AA)
- [x] Visual regression baseline (portal light/dark/mobile, e2e/visual.spec.mjs)
- [~] Coverage **>= 95%** per package — after test additions:
  - color-scheme-selector: **100 / 100 / 100** ✓
  - accent-color-selector: **99.1 lines / 95.7 branch** ✓ (keyboard wrap, Home/End, Enter/Space, storage)
  - a11y-panel: **98.9 lines / 96.0 branch** ✓ (popover mode, closed guards, storage/JSON)
  - highlighter: **89.6 lines / 83.3 branch** — 15-language lexer sweep added; component internals
    (clipboard, CSS.highlights, anchor-positioning, popover) need browser-level coverage to reach 95
  - portal: **100 / 100 / 100** ✓ (src/docs/catalog.test.mjs + e2e ordering assertions)
    Enforcement active: `--check-coverage` (95) enabled in test:coverage of the 3 ready packages + `test:coverage:portal` — all pass.
    Remaining: browser-side coverage job for pix-highlighter component internals to reach 95.

## 5 · Governance & process

- [x] BDFL governance model formalized (GOVERNANCE.md + ADR-026)
- [x] Detailed CONTRIBUTING flow (issue → branch → conventional commits → review → release)
- [x] Stricter CODEOWNERS / review ownership per package
- [x] Release cadence + semver policy (per-package; RELEASE.md + GOVERNANCE.md updated)
- [x] Deprecation & EOL policy (GOVERNANCE.md + SECURITY.md)
- [x] Security triage / vulnerability response (scope + response targets + supported lines)

## 6 · Release & distribution

- [x] `pnpm release:dry` verified: 4 `ready` packages pass, private/wip correctly skipped
- [ ] Package audit vs 95% bar, then promote candidates to `ready`
- [ ] First public npm release (`pnpm release`) for promoted packages
- [ ] Publish correctness check: `--verify` post-publish, download-based portal ordering (ADR-025)

## 7 · Community

- [ ] Enable GitHub Discussions (repo settings — maintainer action)
- [x] Marketing badges (CI, Conventional Commits, license; package status table) in README
- [x] Funding platforms on FUNDING.yml (GitHub Sponsors + Patreon)
- [ ] Announcement / onboarding post
