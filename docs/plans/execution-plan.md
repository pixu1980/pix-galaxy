# pix-galaxy — Execution Plan

> **Status:** approved (Wave 1 + Wave 2 questionnaire, 2026-07-09)  
> **Goal:** stabilize the repo, close critical debt, raise quality, complete docs/release. **No new components** until these phases are complete.

---

## Strategic decisions (approved)

| Area         | Decision                                                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Positioning  | **Public open-source** library                                                                                                                       |
| Dependencies | **Absolute zero-dependency** (runtime)                                                                                                               |
| A11y         | **WCAG 2.2 AA always** (non-negotiable requirement)                                                                                                  |
| Browser      | **Modern-only** (last 2 years: Chrome 119+, Safari 17.5+, Firefox 120+) — `light-dark()` fallbacks are **kept** anyway (ADR-004 stays)               |
| Branch       | **develop = trunk**, **main = release**                                                                                                              |
| Testing      | Per-component unit tests (node:test + jsdom) + expanded e2e + axe-core + visual regression                                                           |
| Types        | **JSDoc + strict typecheck** in CI (no migration to .ts)                                                                                             |
| Architecture | **Targeted fixes** for the 6 critical issues — no shared base class (zero-abstraction DNA)                                                            |
| Docs         | Migrate the **4 legacy components** to shared docs template (`pix-core/docs-site.js`)                                                                |
| Release      | Migrate to **`commit-and-tag-version`** (maintained fork), **local release**, no CI publish with NPM_TOKEN — aligned with `pi-coding-agent-extensions` |
| ADR          | Consolidate the 18 scattered ADRs into `docs/adr/` with updated status                                                                               |

---

## Execution phases

### Phase 0 — Diff review (366 files, +5374/−10914) ✅ DONE

- [x] Review all modified/deleted/untracked files
- [x] Segment by logical areas (renames, foundations, core, scripts, docs, config)
- [x] Propose logical commit sequence for approval
- [x] Verify `packages/pix-a11y-panel` (node_modules/artifact gitignored — 556MB on disk only, not in git)

**Approved commit sequence (7+1 commits, topological order):**

1. `feat(pix-foundations)`: consolidate design tokens + `_controls.css`
2. `feat(pix-core)`: centralize shared runtime + build scripts (delete `shared`, add `pix-core`)
3. `refactor(pix-a11y-panel)`: rename from `pix-display-preferences` (delete+add+root pkg+lock+portal)
4. `refactor(packages)`: 10 package + highlighter → pix-core scripts, tokenized CSS, docs/tests
5. `chore(root)`: tooling config (eslint, prettier, playwright, CI, README, .vscode)
6. `chore(scripts)`: dev/release/scaffold scripts
7. `docs`: handoff + architecture-review + HANDOFF-LLM
8. `.agents`: formatting + import rename (separate, to be confirmed)

**To decide before commit 3:**

- [ ] `DisplayPreferences` typedef in `a11y-panel/src/index.types.js`: alias + deprecation or breaking rename
- [ ] `e2e/results.json` + `test-results/.last-run.json`: add to .gitignore

### Phase 1 — Logical commits ✅ DONE

- [x] Commit `feat(pix-foundations)` — 21 files, tokens + controls
- [x] Commit `feat(pix-core)` — shared → pix-core, centralized scripts
- [x] Commit `refactor(pix-a11y-panel)` — rename from display-preferences + deprecated typedef
- [x] Commit `refactor(packages)` — 10 package + highlighter → pix-core, tokenized CSS
- [x] Commit `chore(root)` — tooling config (13 files)
- [x] Commit `chore(scripts)` — dev/release/scaffold
- [x] Commit `docs` — handoff + architecture-review + HANDOFF-LLM
- [x] Untrack test artifacts (e2e/results.json, test-results/.last-run.json)
- [x] **REMOVED**: `.agents/` (96 files) — content migrated to pix-galaxy-mcp (`pix-frontend-custom-element`, `pix-frontend-template-engine`)

### Phase 2 — ADR consolidation ✅ DONE

- [x] Created `docs/adr/` with 24 numbered and indexed ADRs (Nygard format, README index)
- [x] Updated statuses: ADR-009 (standard-version) → superseded by ADR-018 (commit-and-tag-version)
- [x] Added ADR 018-024 for strategic decisions (local release, modern-only, zero-dep, WCAG, branch, JSDoc strict, skills→MCP)
- [x] Updated HANDOFF.md and HANDOFF-LLM: ADR sections replaced with reference to docs/adr/

### Phase 3 — Critical fixes (architectural review) ✅ DONE

- [x] Audit of 6 critical issues: **4 already fixed** in previous sessions (inline arrows, .bind, setTimeout race, body.dataset)
- [x] **pix-sortable**: removed redundant per-item observer in #setupItem (loop risk) + disconnect observer in disconnectedCallback
- [x] **pix-toast-stack**: remove active toasts in disconnectedCallback (cleanup orphaned listeners)
- [x] **pix-toast**: removed dead #onDismissClick/#handleDismiss (lint warnings)
- [x] **Fixed pre-existing tests**: 7 packages with smoke tests importing pre-rename names (`PixColor.js` → `_PixColor.js` etc.)
- [x] **Updated obsolete tests** post-ADR-012: highlighter (CSS moved to theme-defaults, single-quoted theme selectors, real tokens)
- [x] **Result: 124 tests pass / 0 fail across 10 packages**; lint and format clean
- [x] **Strict typecheck completed**: created missing `index.types.js` (pix-color, pix-sortable, pix-recorder) with public API typedefs; typecheck now passes on 10/10 packages; root `typecheck` + added to `pnpm quality` (ADR-023)
- [x] Template: removed typecheck script (non-compilable {%...%} placeholders, same as prettier/eslint)

### Phase 4 — Testing ✅ DONE

- [x] **axe-core audit (WCAG 2.2 AA)**: new `e2e/a11y.spec.mjs` — 12/12 on portal + 11 docs sites
- [x] **Expanded E2E**: new `e2e/interactions.spec.mjs` — 15 tests (real interactions + live component audit)
- [x] **49/49 e2e** total (22 portal + 12 a11y + 15 interactions)
- [x] **Real a11y fixes discovered by audit**:
  - pix-color: nested-interactive (color input inside role=button) + missing label → input moved to sibling
  - pix-sortable: aria-required-children → live region moved outside listbox (internal wrapper)
  - pix-toast-stack: aria-prohibited → added role=region
  - Portal: role=listitem on cards, text-muted contrast (ink-600→950) and footer link (sky-700)
  - foundations: token warning darkened (4.5+ contrast)
  - docs template: scrollable `pre` → tabindex=0; broken live placeholder → static text
- [x] **Systemic bugs found and fixed**:
  - **port-map misalignment**: dev-all (alphabetical order) vs portal fallback (hardcoded order) → new shared `scripts/port-map.mjs`
  - **index.html with wrong title** in recorder/sortable/splitter (copy-paste "pix-color docs")
  - **foundations docs 500**: missing pix-core in devDeps
- [x] **Docs sites improved**: added `liveHtml` (live mounted component) to 6 docs that were missing it
- [x] CI: added e2e Playwright job (chromium + dev:all via webServer)
- [x] `pnpm test:e2e` root script; `pnpm quality` already covers format+lint+typecheck

### Phase 5 — Docs & Portal ✅ DONE

- [x] **Migrated 4 legacy to shared template** `pix-core/docs-site.js` (ADR-007 completed):
  - pix-a11y-panel, pix-accent-color-selector, pix-color-scheme-selector, pix-highlighter
  - Removed duplicate inline functions (buildDocsPages, createDocsSite, escapeHtml, renderExamples)
  - Added pix-core devDependency to the 4 packages; removed unused marked
  - Updated highlighter site-app.test.js (shared template test, not old inline)
- [x] **Update HANDOFF.md / HANDOFF-LLM** (to be done in docs commit)
- [x] Portal: "Coming Soon" kept (valid roadmap placeholder); card role=listitem already fixed in Phase 4
- [x] 49/49 e2e + 124 unit tests pass with migrated docs

### Phase 6 — Release tooling ✅ DONE

- [x] `standard-version` → **`commit-and-tag-version@13.1.2** (root devDep)
- [x] Ported `scripts/release-helpers.mjs` (standardVersionCommand with --first-release)
- [x] `release.mjs` updated: uses helper + commit-and-tag-version (no more npx)
- [x] **CI publish neutralized** (ADR-018): release.yml is now a quality gate (typecheck+test+build), no NPM_TOKEN
- [x] **Package.json verified**: files/publishConfig OK on 10 packages; repository → monorepo + `directory` (was per-package nonexistent repo)
- [x] **Dry-run verified**: `pnpm release:dry` generates correct CHANGELOGs for 10 packages (first release)
- [x] RELEASE.md and HANDOFF.md updated (local flow, no token)

---

## Out of scope (deferred)

- New components (combobox, tabs, tooltip, tree) — only after Phases 0–6 complete
- Migration to TypeScript .ts
- Shared base class
- Per-package GitHub Pages (portal only for now)
