# pix-galaxy — Status Recap

> **Type:** project status report · **Scope:** repository structure, components/libraries,
> file organization, code quality, usage examples, open work.
> **Method:** evidence gathered with the **tokensave** code-graph MCP
> (`tokensave_status/context/files/health/complexity/largest/dead_code/circular/todos/dependencies/doc_coverage`)
> and the **pix-galaxy-mcp** tools (`pix_tool_detect`, `pix_tool_search`,
> `pix_tool_styleguide_file_tree/naming/comments/readme`), plus direct file reads.
> Every claim below is verified against the code. No invented data.

## 1. Graph overview

- **502 indexed files**, **4445 nodes**, **1621 edges**, ~1.67 MB of sources; 204 JavaScript files.
- `pix_tool_detect` → `projectName: pix-galaxy`, `framework: vanilla`, `typescript: true`
  (typecheck/`.d.ts` only), `buildTool: vite`, `tokensave: true`.
- Active branch `develop`; last commit `848327e` (2026-09-21), 1 commit ahead of `origin/develop`.
- TokenSave'd ~9k tokens across the main MCP queries.

## 2. Repository structure (root)

```text
pix-galaxy/
├── packages/            # 14 directories (13 workspace projects + excluded template)
├── src/docs/            # PORTAL component browser (index.html/js/css, catalog.js,
│                        #   catalog.test.mjs, content/components.json)
├── e2e/                 # Playwright: a11y.spec.mjs, interactions.spec.mjs,
│                        #   portal.spec.mjs, visual.spec.mjs, ports.mjs
├── scripts/             # dev.mjs, dev-all.mjs, port-map.mjs, release.mjs,
│                        #   scaffold-component.mjs, ssr-smoke.mjs, fetch-downloads.mjs
├── docs/                # adr/, plans/release-0.1.0.md, guides/,
│                        #   HANDOFF*.md, architecture-review.md, status-recap.md
├── .github/workflows/   # ci.yml, release.yml (quality gate, no publish),
│                        #   pages.yml, check-workflows.yaml
├── AGENTS.md · ROADMAP.md · RELEASE.md · GOVERNANCE.md · CONTRIBUTING.md · README.md
├── eslint.config.js · playwright.config.mjs · pnpm-workspace.yaml · tsconfig.types.json · vite.config.mjs
```

`pnpm-workspace.yaml` excludes `packages/pix-component-template` (it contains `{%...%}`
placeholders) and defines supply-chain `overrides` (brace-expansion, js-yaml) plus `allowBuilds`.

## 3. Package anatomy (actual convention)

All packages follow the same layout (`pix-styleguide-file-tree`: PascalCase folder + barrel +
underscore-prefixed files per concern):

```text
packages/pix-<name>/
├── README.md · CHANGELOG.md · LICENSE · CODE_OF_CONDUCT.md · CONTRIBUTING.md
│   · GOVERNANCE.md · SECURITY.md · SUPPORT.md
├── package.json · tsconfig.types.json · vite.config.mjs
├── src/
│   ├── index.js                 # public barrel: export * from './components/index.js'
│   ├── index.types.js           # JSDoc typedefs → generated .d.ts (ADR-023)
│   ├── components/
│   │   ├── index.js             # barrel
│   │   └── <PascalName>/
│   │       ├── _<PascalName>.js  # HTMLElement class: private # fields, static{} as the only registration
│   │       ├── _<PascalName>.css # imported with ?raw, @layer pix-galaxy { @layer pix-<comp> {...} }
│   │       └── index.js
│   ├── docs/
│   │   ├── index.html · index.css · index.js   # uses shared template pix-core/docs/docs-site.js
│   │   └── content/  getting-started.md · how-it-works.md · api.md · examples.md · releasing.md
│   └── tests/        *.test.js (node:test + jsdom)
└── artifact/          # esbuild build: index.js (ESM), index.cjs (CJS), index.d.ts — gitignored
```

Verified examples of this convention:

- `packages/pix-toast/src/index.js` → `export * from './components/index.js';`
- `_PixToast.js`: `const ELEMENT_NAME = 'pix-toast'`, `static observedAttributes`,
  `static { this.ensureComponentStyles(); customElements.define(...) }`, private fields
  `#toastId/#duration/#leaving`, bound listeners stored in fields
  (`#onPointerEnter = this.#handlePause.bind(this)`).
- `_PixToast.css`: `@layer pix-galaxy { @layer pix-toast { ... } }` with element/attribute
  selectors only (zero classes).
- Build: `packages/pix-core/scripts/build.mjs` → esbuild `bundle+minify`, `target es2020`,
  ESM + CJS; types via `tsc` + `finalize-types.mjs`.
- Special entry points: `pix-core/dom/ssr-safe.js` (`adoptStyles/safeDefine/canAdoptStyles`),
  `pix-core/docs/docs-site.js` (shared docs template built on `pix-vanilla-reactive`
  Store + Signals + `html\`\``).

**Special sub-structures:**

- `pix-highlighter/src/components/PixHighlighter/lexers/` → 16 files (`_Bash.js`, `_C.js`, …
  `_Utils.js`) + `index.js` with the `LEXERS` `Map` and `getLexer(language)`.
- `pix-highlighter/src/components/PixHighlighter/styles/themes/` → 13 CSS themes
  (`_atlas.css`, `_monokai.css`, `_nord.css`, …) + `_theme-defaults.css`.
- `pix-color/src/components/PixColor/`: besides the `_PixColor.js` component, it holds the
  `_color.js` library (sRGB/HEX/HSL/OKLCH conversions).
- `pix-vanilla-reactive/src/core/`: `store/`, `signals/`, `template-engine/` (part system:
  `_attribute-part`, `_event-part`, `_if-part`, `_for-part`, …), `disposable/`, `bridge.js`.

## 4. Components / libraries inventory

| Package                     | Tag / API                                                                          | Type                            | `src` LOC                       | Test files | releaseStatus |
| --------------------------- | ---------------------------------------------------------------------------------- | ------------------------------- | ------------------------------- | ---------- | ------------- |
| `pix-foundations`           | CSS `foundations.css` + `ds-tokens.css`                                            | library (tokens)                | 365 (+`lib/*.css`)              | 0          | wip (private) |
| `pix-core`                  | `dom/ssr-safe.js`, `docs/docs-site.js`, scripts                                    | infrastructure                  | — (`docs/`, `dom/`, `scripts/`) | 0          | wip (private) |
| `pix-vanilla-reactive`      | `Store`, `Signal`, `html\`\``, `render`, `effect`, `createTickState`, `Disposable` | library/framework               | 4161                            | 8          | wip           |
| `pix-color`                 | `<pix-color>` + `_color.js`                                                        | component+library               | 1481                            | 1          | wip           |
| `pix-a11y`                  | `<pix-a11y>` (display preferences popover)                                         | component                       | 1813                            | 3          | wip           |
| `pix-accent-color-selector` | `<pix-accent-color-selector>`                                                      | component                       | 745                             | 3          | wip           |
| `pix-color-scheme-selector` | `<pix-color-scheme-selector>`                                                      | component                       | 683                             | 3          | wip           |
| `pix-command`               | `<pix-command>` (palette, fuzzy search)                                            | component                       | 1222                            | 1          | wip           |
| `pix-highlighter`           | `<pre is="pix-highlighter">` + `enhancePixHighlighters()`                          | component (customized built-in) | 4627                            | 5          | **ready**     |
| `pix-toast`                 | `<pix-toast>` + `<pix-toast-stack>`                                                | component                       | 1027                            | 1          | wip           |
| `pix-sortable`              | `<pix-sortable>`                                                                   | component                       | 802                             | 1          | wip           |
| `pix-splitter`              | `<pix-splitter>`                                                                   | component                       | 807                             | 1          | wip           |
| `pix-recorder`              | `<pix-recorder>`                                                                   | component                       | 930                             | 1          | wip           |
| `pix-component-template`    | `_ComponentName` with `{%…%}`                                                      | scaffold                        | 382                             | 3          | wip           |

> Only `pix-highlighter` is `releaseStatus: "ready"` (commit `cba0705`). `pix-core` and
> `pix-foundations` are private.

## 5. Usage examples (excerpted from the code)

**pix-highlighter** (correct README):

```html
<script type="module">
  import '@pix-galaxy/pix-highlighter';
</script>
<pre is="pix-highlighter" data-lang="ts"><code>const g = formatMessage('pix-galaxy');</code></pre>
```

```js
import { PixHighlighter, enhancePixHighlighters } from '@pix-galaxy/pix-highlighter';
PixHighlighter.applyTheme('atlas');
```

**pix-vanilla-reactive** (correct README):

```js
import {
  Store,
  Signal,
  effect,
  html,
  render,
  createTickState,
} from '@pix-galaxy/pix-vanilla-reactive';
const store = new Store({ count: 0 });
const tick = createTickState(store); // every store write bumps this signal
```

**pix-toast** (`src/docs/content/examples.md`):

```js
const stack = document.querySelector('pix-toast-stack');
stack.add({ title: 'Saved', message: 'Changes saved', variant: 'success' });
stack.add({ message: 'Stays until dismissed', duration: 0 });
```

**pix-toast** (`src/docs/index.js`, live examples): variants, smart queuing (max 5 + queue),
dedup by `id`, persistent toast.

**Shared docs template** (`packages/pix-toast/src/docs/index.js`): loads `content/*.md?raw`,
uses `createDocsSite` + `buildDocsPages`, mounts into `#app`, and imports `pix-highlighter`
and `pix-color-scheme-selector`.

## 6. Code quality

### tokensave metrics

- `quality_signal: 6702`. Dimensions: `acyclicity 0.91` (10 edges in cycles), `depth 1.0`,
  `equality 0.20` (**gini 0.80**, "god files"), `redundancy 0.76` (**266 dead fns / 1101**),
  `modularity 0.998`, `coverage_discipline 1.0`.
  - ⚠️ `dead_code`/`complexity` include **generated `dist/` bundles and test files** (the
    `describe/it` blocks count as dead): read them with care.
- Largest files: `_PixHighlighter.js` **1071 lines**, `_A11y.js` 747, `_PixCommand.js` 660,
  `_PixColor.js` 628.
- Most complex functions: `getTemplate()` in `_template-instance.js` (209 lines, cyclomatic 27,
  **cognitive 112**); `lexCBase` in `_C.js` (cyclomatic 12).
- Cycles (5): 2 real in the framework — `store/_clone.js ↔ store/_store.js`,
  `template-engine/_child-node-part.js ↔ _template-instance.js`; the others are `source↔test`
  or `dist` bundles.
- Markers: 166 (`48 TODO`, `107 WIP` mostly the `releaseStatus` keyword in docs,
  `3 UNIMPLEMENTED`, `1 HACK`).
- `doc_coverage`: 50 undocumented symbols across 6 files (mostly Markdown headings parsed as
  symbols).

### Verified concrete issues

1. **File organization conforms** to the `pix-styleguide-file-tree` convention
   (underscore + barrel) — this is a strength.
2. **Copy-pasted READMEs**: `packages/*/README.md` carries the **pix-accent-color-selector**
   title and content in `pix-color`, `pix-command`, `pix-recorder`, `pix-sortable`,
   `pix-splitter`, `pix-toast` (6 packages). Verified with `head -1`.
3. **Dual token system** (`_ds-tokens.css` vs `lib/`): `--pix-space-1..9` are **literal values**
   (0.25…4rem) while `--pix--s--*` is the canonical scale; `--pix-t-*` alias `--pix--t--*` but
   `--pix-space-*` does not (DSL-02).
4. **Undefined component tokens**: `_PixToast.css` consumes `--pix-toast--radius/bg/border`;
   repo-wide definitions = 0 → context-dependent rendering (DSL-01, critical).
5. **Theming drift**: `_palettes.css` uses `data-color-scheme` + `@media prefers-color-scheme`
   plus a duplicated dark block, with a stale note ("light-dark() does not resolve in
   Chromium"); ADR-003/004 prescribe fallback-first `light-dark()`. Several components use
   `light-dark()` inside custom properties **without fallback** (DSL-03).
6. **Unjustified grid / CSS comments**: `_PixToast.css` uses 1D `display: grid` without the
   `/* grid: why */` comment; file headers are one-liners (`/** PixToast - … */`) instead of the
   `FILE/USAGE/SCOPE` format (DSL-12).
7. **Broken root gates** (verified by running the commands):
   - `pnpm quality` → RED on `format:check` (~30 files) + fatal error in
     `packages/pix-component-template/.github/FUNDING.yml` (`{ %REPO_OWNER% }` is invalid YAML).
   - `pnpm lint/typecheck/test/build:lib` → `ERR_PNPM_TASK_CYCLE`: `pix-a11y ↔ pix-core` and
     `pix-color-scheme-selector ↔ pix-foundations` (workspace deps in `dependencies` + inverse
     in `devDependencies`) = ADR-020 violation (DSL-09).
   - `ci.yml` runs exactly those commands → CI is red.
8. **Testing**: 69 unit test files, ~263 unit cases + **26 e2e cases** (`e2e/*.mjs`);
   **per-package** tests pass (verified: highlighter 35, toast 3, command 5, color 3, 0 fail).
   `test-results/.last-run.json` = `passed`.
9. **Coverage**: `pix-highlighter`'s `test:coverage` **lacks** `--check-coverage`; the ROADMAP
   claims enforcement is active on 3 packages + portal, but `pix-highlighter` sits at ~89.6/83.3.
10. **ADR-020 (zero runtime deps)**: `pix-core/package.json` keeps
    `@pix-galaxy/pix-a11y` and `@pix-galaxy/pix-color-scheme-selector` in `dependencies`
    (core→components layer inversion). In the working tree `marked`/`esbuild` have already been
    moved to `devDependencies` (fix started, incomplete).

## 7. Testing & tooling

- Unit: `node:test` + `jsdom` per package (`test:coverage` with c8). E2E: Playwright (`a11y`
  with axe-core, `interactions`, `portal`, `visual` with screenshot baselines, port discovery in
  `e2e/ports.mjs`).
- Quality: `pnpm quality` = `format:check + lint + typecheck`; `pnpm test:ssr` (DOM-less smoke);
  ESLint flat config + Prettier; JSDoc + `tsc --noEmit`.
- Build/release: esbuild (`build.mjs`), Vite for docs; **local** release via
  `commit-and-tag-version` (`scripts/release.mjs`), tag → `release.yml` quality gate (no CI publish).

## 8. Open work (brainstorming base)

- **Active plan (single source):** [`docs/plans/release-0.1.0.md`](./plans/release-0.1.0.md) —
  coorte 0.1.0 npm (`highlighter`, `color-scheme-selector`, `accent-color-selector`, `a11y`,
  `vanilla-reactive`), packaging `workspace:*` → `devDependencies`, coverage ADR-026, portal
  high-severity fixes, then local `pnpm release`. Audits/reviews e piani paralleli rimossi.
- `ROADMAP.md`: open items fuori coorte (form/`ElementInternals`, i18n/RTL, nuovi componenti,
  community) restano post-0.1.0.
- Documentation drift: README root dichiara ready non allineati a `package.json` (solo
  `pix-highlighter` è `ready` oggi); tracked in Fase C.4 del piano.

## 9. Maturity study: `@pix-galaxy/pix-vanilla-reactive`

> Scope: the reactive framework package only. Evidence from `package.json`, `src/`, the 8 test
> files, coverage run with c8, `src/docs/content/`, `examples/`, and the bundled VS Code
> extension. No comparisons, no invented benchmarks.

### 9.1 Snapshot

| Fact             | Value                                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version / status | `0.1.0` · `releaseStatus: "wip"` (not publishable)                                                                                                                      |
| Core code        | ~3553 LOC across `src/core/**`                                                                                                                                          |
| Module split     | template-engine 2158 · signals 511 · disposable 405 · store 368 · bridge+index 111                                                                                      |
| Public API       | **55 exported symbols** in `src/index.types.js`                                                                                                                         |
| Tests            | **92 tests / 32 suites**, all green (`node:test` + jsdom)                                                                                                               |
| Coverage         | **92.71% stmts · 77.06% branch · 89.47% funcs** (c8, measured)                                                                                                          |
| Distribution     | ESM + CJS + `.d.ts` (`artifact/`), Vite docs site (`dist/`), 3 runnable examples, a shipped VS Code extension (`vsix/vanilla-reactive-0.1.0.vsix`)                      |
| Dependencies     | `pix-core`, `pix-color-scheme-selector`, `pix-highlighter` in **`dependencies`** (docs-only imports), dev: `@vscode/vsce`, c8, esbuild, jsdom, marked, typescript, vite |
| Governance files | **absent**: no `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `GOVERNANCE.md`, `SECURITY.md`, `SUPPORT.md` (all present in the component packages)            |

### 9.2 Dimension-by-dimension

| Dimension               | Evidence                                                                                                                                                                                                                                                                                               | Rating                                                                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Architecture & scope    | 4 clean modules (Store proxy, Signals, template engine, bridge), plus an Explicit Resource Management layer. Clear data-flow documented in `how-it-works.md`: proxy trap → `store:change` → `createTickState` → computed → microtask effect → `render()` parts. No virtual DOM.                        | Strong                                                                                                                                                                                                                                            |
| Public API surface      | 55 exports for a `0.1.0`: Store (+`deepClone`, path helpers), Signals (`State`, `Computed`, `effect`, collector internals), template engine (`html`, `render`, `model`, `repeat`, `directive`, `registerFilter`, 22 filters, 7 Parts), bridge, disposables. Broad but large for an unversioned API.    | Good (breadth) / Risk (surface size)                                                                                                                                                                                                              |
| Correctness tests       | 92 green tests. Coverage split: template 15, disposable 15, store 13, signals 13, stress 12, security 11, expression 11, framework 2. `store`, `signals`, `bridge` are ≥98.9% statements.                                                                                                              | Good                                                                                                                                                                                                                                              |
| Coverage gaps           | `_filters.js` **68.88% stmts / 45% branch**, `_event-part.js` 82.97/60, `_if-part.js` 86.55/56.25, `_for-part.js` 86.01/57.69, `_disposable-stack.js` 89.92/79.31, `_symbols.js` 87.17/50. Template-engine module 90.31/72.34; disposable 90.86/76.92. Below the project's 95% bar.                    | Partial                                                                                                                                                                                                                                           |
| Security model          | Escaping-by-default for `${}`/`{{ }}`; `                                                                                                                                                                                                                                                               | raw`is the explicit escape hatch; attributes written via`setAttribute`; Store blocks prototype-chain keys (`**proto**`/`prototype`/`constructor`) with `TypeError`. Dedicated `security.test.js` (11 cases). Documented as a first-class section. | Strong |
| Resource management     | `makeDisposable`, `DisposableStack`, `AsyncDisposableStack`, plus feature-detected `Symbol.dispose`/`Symbol.asyncDispose` with an explicit Safari 17.5+ degradation note (`_symbols.js`). `render()` returns a mount disposer; `effect()`/`subscribe()` return disposers; leak-regression tests exist. | Strong / advanced                                                                                                                                                                                                                                 |
| Performance & scale     | `stress.test.js` asserts 10k independent signals subscribe/notify, N rapid sets collapse into one effect run (batching), and subscriptions are released when dynamic parts are removed. Bounds are intentionally generous to avoid flakes.                                                             | Good (asserted, not benchmarked)                                                                                                                                                                                                                  |
| Documentation           | README (correct package, no clone), docs site with `getting-started`, `how-it-works`, `api`, `examples`, `releasing`; explicit "Pitfalls" and "Security model" sections; two expression systems (`${}` vs `{{                                                                                          | filter }}`) tabulated.                                                                                                                                                                                                                            | Strong |
| Distribution & tooling  | esbuild dual ESM/CJS + generated `.d.ts`, `sideEffects: false`, `publishConfig.access: public`, Vite docs build, `check` (test+build) and `test:coverage` scripts.                                                                                                                                     | Good                                                                                                                                                                                                                                              |
| Ecosystem / integration | Powers the shared docs template `pix-core/docs/docs-site.js` (Store + Signals + `html\`\``); ships a VS Code extension (grammar injection into JS/TS, snippets, completion for filters/`data-part`). The extension has **no tests**.                                                                   | Good                                                                                                                                                                                                                                              |
| Packaging hygiene       | Docs-only deps declared as runtime `dependencies` (would publish `pix-highlighter` + `pix-color-scheme-selector` into a consumer install); missing `CHANGELOG` and all governance files; still `wip`.                                                                                                  | Partial / Risk                                                                                                                                                                                                                                    |
| Maintainability         | `template-engine` is 60.7% of core LOC (2158); `getTemplate()` in `_template-instance.js` is 209 lines with cyclomatic 27 / **cognitive 112**; the file `_PixHighlighter.js` (other package) aside, this is the highest-cognitive unit in the repo.                                                    | Partial                                                                                                                                                                                                                                           |

### 9.3 Strengths (verified)

- Real, non-trivial engineering: proxy store, fine-grained signals with microtask batching,
  incremental parts-based rendering, and a store↔signal bridge — all zero-runtime-dependency.
- Security is designed in, not bolted on (escaping default, prototype-pollution guard, dedicated
  test file and docs).
- Ahead-of-the-curve resource management (ES2026 disposables) with deliberate feature detection
  for the declared browser matrix.
- Excellent docs and a working docs-site/extension ecosystem around the framework.
- Test discipline above the repo average for a single package (92 tests, 32 suites).

### 9.4 Gaps and risks (verified)

1. **Not release-ready by the repo's own bar**: `releaseStatus: "wip"`, coverage below 95%
   (especially `_filters.js` branch 45%), and the root gates that would validate a release are
   currently broken by the workspace dependency cycle.
2. **API surface is large and unversioned**: 55 exports at `0.1.0` with no stability/deprecation
   policy attached specifically to this package (no `CHANGELOG`).
3. **Packaging inversion**: `pix-highlighter`/`pix-color-scheme-selector`/`pix-core` are imported
   only by `src/docs/`, yet declared as runtime `dependencies` — the same ADR-020 layer issue
   tracked for `pix-core` (DSL-09).
4. **Missing governance artifacts** present in every component package (CHANGELOG, CONTRIBUTING,
   GOVERNANCE, SECURITY, SUPPORT, CODE_OF_CONDUCT).
5. **Maintainability concentration**: template-engine owns ~61% of core code and the
   highest-cognitive function in the repo.
6. **Extension untested** and not referenced by CI/e2e; `examples/` are not exercised by tests or
   the Playwright suite.
7. **Docs claim "no build step"** while the repo ships a bundler build and the examples inline all
   logic in each HTML file — accurate for consumers, but the package docs site itself is a Vite
   build.

### 9.5 Verdict

Using a 0–5 scale (0 placeholder · 1 experimental · 2 alpha · 3 beta · 4 release-ready ·
5 mature/GA):

- **Engineering depth: ~3.5–4 (beta to release-ready).** The framework itself is coherent,
  tested, secure, and unusually advanced on resource management and performance assertions.
- **Product/release maturity: ~2 (alpha).** `0.1.0`, `wip`, no changelog/governance files,
  docs-only runtime deps, coverage below the project bar, extension and examples outside CI.
- **Overall: late alpha / early beta — technically strong, not releasable as-is.** The remaining
  work is mostly packaging, coverage, and governance rather than core design.

> The step-by-step path to move this verdict to level 5 is defined in §9.6. The verdict above
> stays unchanged until the exit criteria are measured — no rating is claimed before its evidence.

### 9.6 Path to level 5 (action plan)

**What "5 (mature/GA)" means here:** a published `1.0.0` with a semver-stable API and documented
deprecation policy, ≥95% coverage on all four metrics enforced in CI, no known governance gaps,
no docs-only runtime dependencies, and the extension/examples covered by tests.

#### Prerequisites — repo blockers (must land first)

| #     | Step                                                                                                                                                               | Exit criterion (evidence)                                                        |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| P-0.1 | Remove the workspace dependency cycles (`pix-a11y ↔ pix-core`, `pix-color-scheme-selector ↔ pix-foundations`) by keeping workspace links in `devDependencies` only | `pnpm -r run test/typecheck/lint/build:lib` exit 0 (`pnpm test`, `pnpm quality`) |
| P-0.2 | Fix `format:check`: format changed files + repair the invalid YAML in `packages/pix-component-template/.github/FUNDING.yml`                                        | `pnpm quality` green                                                             |

Without P-0, none of the phases below can be validated locally or in CI (the gates are currently
red — see §6/§8).

#### Phase A — Coverage to ≥95% on every metric

Measured gaps (c8, this run): template-engine 90.31/72.34, disposable 90.86/76.92;
per-file weak spots below.

| #   | File / area                                                       | Current (stmts/branch)               | Target                                                                                                                                       |
| --- | ----------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| A.1 | `template-engine/_filters.js`                                     | 68.88 / 45.00                        | ≥95 / ≥95                                                                                                                                    |
| A.2 | `template-engine/_event-part.js` · `_if-part.js` · `_for-part.js` | 82.97/60 · 86.55/56.25 · 86.01/57.69 | ≥95 / ≥95                                                                                                                                    |
| A.3 | `disposable/_disposable-stack.js` · `_symbols.js`                 | 89.92/79.31 · 87.17/50               | ≥95 / ≥95                                                                                                                                    |
| A.4 | `template-engine` module as a whole                               | 90.31 / 72.34                        | ≥95 / ≥95                                                                                                                                    |
| A.5 | Enforce the threshold in `test:coverage`                          | —                                    | add `c8 --check-coverage --lines=95 --functions=95 --branches=95 --statements=95` (mirrors `test:coverage:portal`) so CI fails below the bar |

Add cases for: each filter's edge branches (`date`, `timeAgo`, `truncate`, `sortBy`, `tagLabel`,
`tagHref`, `default`, `json`, `urlencode`), event-listener teardown, falsy/absent branches in
`<if>`/`<for>`, keyed reconciliation edge cases, async dispose ordering, moved stacks, and the
`defineDisposable` own-property/no-symbol paths.

#### Phase B — Complexity and documentation debt

| #   | Step                                                                                                                          | Exit criterion                                            |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| B.1 | Split `getTemplate()` in `template-engine/_template-instance.js` (209 lines, cyclomatic 27, cognitive 112) into smaller units | cognitive complexity < 30; all 92 tests stay green        |
| B.2 | Close `doc_coverage` gaps on the 55 exported symbols with JSDoc                                                               | typecheck + `finalize-types.mjs` produce complete `.d.ts` |

#### Phase C — Packaging and governance

| #   | Step                                                                                                                                                                                 | Exit criterion                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| C.1 | Move `pix-core`, `pix-color-scheme-selector`, `pix-highlighter` from `dependencies` to `devDependencies` (docs-only imports per ADR-020 / DSL-09)                                    | `npm pack --dry-run` shows `dependencies: {}`                                                                       |
| C.2 | Add `CHANGELOG.md` (generated by `commit-and-tag-version` at release) + the package-standard governance set (`CONTRIBUTING`, `CODE_OF_CONDUCT`, `GOVERNANCE`, `SECURITY`, `SUPPORT`) | same file set as the component packages                                                                             |
| C.3 | Publish a stability/semver statement for the 55-export API, linked to the ADR-026 95% quality bar                                                                                    | API doc section present; no orphan exports                                                                          |
| C.4 | Flip `releaseStatus` to `"ready"`                                                                                                                                                    | only after Phases A–C and the CI gates pass (see `docs/plans/release-0.1.0.md` §2)                                  |

#### Phase D — Beyond unit tests

| #   | Step                                                                                              | Exit criterion                                                       |
| --- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| D.1 | Test the VS Code extension (currently 0 tests): activation, completion provider, grammar fixtures | extension test suite green                                           |
| D.2 | Exercise `examples/` (`counter.html`, `form.html`, `todo.html`) in CI                             | static-server smoke or a Playwright spec covering the three examples |
| D.3 | Confirm `pnpm test:ssr` (DOM-less import smoke) covers this package                               | smoke green                                                          |

#### Phase E — GA (level 5)

| #   | Step                                                                                 | Exit criterion                                                            |
| --- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| E.1 | Local publish of `1.0.0` (`pnpm release --package @pix-galaxy/pix-vanilla-reactive`) | tarball published, malware-scan passed                                    |
| E.2 | Post-publish verification                                                            | `--verify` + jsDelivr `+esm` load; portal ordering by downloads (ADR-025) |
| E.3 | Keep the API stable under semver and maintain the changelog                          | sustained across ≥1 minor release                                         |

#### Target table (current → level 5)

| Metric                               | Current (measured)     | Level 5 target                   |
| ------------------------------------ | ---------------------- | -------------------------------- |
| Coverage stmts / branch / funcs      | 92.71 / 77.06 / 89.47  | ≥95 / ≥95 / ≥95 (enforced)       |
| Exported symbols with JSDoc          | gaps across 55 exports | 100%                             |
| `getTemplate()` cognitive complexity | 112                    | < 30                             |
| Runtime `dependencies`               | 3 (docs-only)          | 0                                |
| Governance files                     | 0 of 6                 | 6 of 6                           |
| Extension tests                      | 0                      | ≥1 suite green                   |
| Examples in CI                       | 0                      | 3 of 3                           |
| `releaseStatus`                      | `wip`                  | `ready` (then published `1.0.0`) |

> The §9.5 verdict stays at ~3.5–4 engineering / ~2 product until this table is met with measured
> evidence. This plan defines the target and the exit criteria; it does not upgrade the rating by
> assertion.
