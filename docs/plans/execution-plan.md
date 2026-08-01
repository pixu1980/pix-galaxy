# pix-galaxy — Execution Plan

> **Status:** approvato (Wave 1 + Wave 2 questionnaire, 2026-07-09)
> **Obiettivo:** stabilizzare la repo, chiudere il debito critico, alzare la qualità, completare docs/release. **Nessuna nuova componente** finché queste fasi non sono complete.

---

## Decisioni strategiche (approvate)

| Area | Decisione |
| ---- | --------- |
| Posizionamento | Libreria **open-source pubblica** |
| Dipendenze | **Zero-dependency assoluta** (runtime) |
| A11y | **WCAG 2.2 AA sempre** (requisito non negoziabile) |
| Browser | **Modern-only** (ultimi 2 anni: Chrome 119+, Safari 17.5+, Firefox 120+) — i fallback `light-dark()` si **mantengono** comunque (ADR-004 resta) |
| Branch | **develop = trunk**, **main = release** |
| Testing | Unit test per componente (node:test + jsdom) + e2e espanso + axe-core + visual regression |
| Tipi | **JSDoc + typecheck strict** in CI (nessuna migrazione a .ts) |
| Architettura | **Fix puntuali** dei 6 critici — nessuna base class condivisa (DNA zero-astrazioni) |
| Docs | Migrare i **4 componenti legacy** al template docs condiviso (`pix-core/docs-site.js`) |
| Release | Migrare a **`commit-and-tag-version`** (fork mantenuto), **release locale**, niente CI publish con NPM_TOKEN — allineato a `pi-coding-agent-extensions` |
| ADR | Consolidare i 18 ADR sparsi in `docs/adr/` con stato aggiornato |

---

## Fasi di esecuzione

### Fase 0 — Review del diff (366 file, +5374/−10914) ✅ FATTA
- [x] Esaminare tutti i file modificati/eliminati/untracked
- [x] Segmentare per aree logiche (rename, foundations, core, scripts, docs, config)
- [x] Proporre sequenza di commit logici da approvare
- [x] Verificare `packages/pix-a11y-panel` (node_modules/artifact gitignored — 556MB solo su disco, non in git)

**Sequenza commit approvata (7+1 commit, ordine topologico):**
1. `feat(pix-foundations)`: consolidate design tokens + `_controls.css`
2. `feat(pix-core)`: centralize shared runtime + build scripts (delete `shared`, add `pix-core`)
3. `refactor(pix-a11y-panel)`: rename da `pix-display-preferences` (delete+add+root pkg+lock+portal)
4. `refactor(packages)`: 10 package + highlighter → pix-core scripts, CSS tokenizzato, docs/tests
5. `chore(root)`: tooling config (eslint, prettier, playwright, CI, README, .vscode)
6. `chore(scripts)`: dev/release/scaffold scripts
7. `docs`: handoff + architecture-review + HANDOFF-LLM
8. `.agents`: formatting + import rename (separato, da confermare)

**Da decidere prima del commit 3:**
- [ ] typedef `DisplayPreferences` in `a11y-panel/src/index.types.js`: alias + deprecation o rename breaking
- [ ] `e2e/results.json` + `test-results/.last-run.json`: aggiungere a .gitignore

### Fase 1 — Commit logici ✅ FATTA
- [x] Commit `feat(pix-foundations)` — 21 file, token + controls
- [x] Commit `feat(pix-core)` — shared → pix-core, script centralizzati
- [x] Commit `refactor(pix-a11y-panel)` — rename da display-preferences + typedef deprecato
- [x] Commit `refactor(packages)` — 10 package + highlighter → pix-core, CSS tokenizzato
- [x] Commit `chore(root)` — tooling config (13 file)
- [x] Commit `chore(scripts)` — dev/release/scaffold
- [x] Commit `docs` — handoff + architecture-review + HANDOFF-LLM
- [x] Untrack test artifacts (e2e/results.json, test-results/.last-run.json)
- [x] **RIMOSSO**: `.agents/` (96 file) — contenuto migrato in pix-galaxy-mcp (`pix-frontend-custom-element`, `pix-frontend-template-engine`)

### Fase 2 — ADR consolidation
- [ ] Creare `docs/adr/` con ADR numerati e indicizzati (001–018)
- [ ] Aggiornare stati: deprecare ADR superati (rename, shared→core)
- [ ] Aggiungere ADR per le nuove decisioni (release locale, JSDoc strict, modern-only)

### Fase 3 — Fix critici (architectural review, quality signal 7213)
- [ ] Memory leak inline arrow listeners → private field pre-bound (`pix-color`, `pix-recorder`, `pix-command`)
- [ ] `.bind()` senza referenza stabile (`pix-toast`) → private field + removeEventListener in disconnectedCallback
- [ ] Race condition `setTimeout` global listener (`pix-color`) → event delegation sull'overlay
- [ ] `document.body.dataset` side effect (`pix-splitter`) → `this.style.cursor`
- [ ] MutationObserver loop (`pix-sortable`) → `takeRecords()` in `#rebuild`
- [ ] Lifecycle incompleto (`pix-recorder`, `pix-toast-stack`) → stop media/cleanup in disconnectedCallback
- [ ] Typecheck strict (JSDoc) in CI
- [ ] Cleanup ESLint warnings legacy

### Fase 4 — Testing
- [ ] Unit test per ogni componente (registrazione, render, eventi, cleanup) — node:test + jsdom
- [ ] Guardie per API non supportate da jsdom (adoptedStyleSheets, setFormValue, Highlight API)
- [ ] E2E espanso (interazioni reali, keyboard, temi)
- [ ] Audit axe-core su portal + docs sites (Playwright)
- [ ] Visual regression con snapshot Playwright
- [ ] Aggiornare/estendere `pnpm quality` (format:check + lint + typecheck)

### Fase 5 — Docs & Portal
- [ ] Migrare i 4 componenti legacy al template `pix-core/docs-site.js` (highlighter, accent-color-selector, color-scheme-selector, a11y-panel)
- [ ] Aggiornare HANDOFF.md / HANDOFF-LLM (stato corrente, ADR aggiornati)
- [ ] Rivedere portal (components.json, "Coming Soon" placeholder)

### Fase 6 — Release tooling
- [ ] Sostituire `standard-version` con `commit-and-tag-version`
- [ ] Portare script `release.mjs` + `release-helpers.mjs` da `pi-coding-agent-extensions` (tag per-package `<name>@<version>`, `--first-release`, push su main)
- [ ] Rimuovere/neutralizzare CI publish con NPM_TOKEN (release locale)
- [ ] Verificare package.json per-package (files, publishConfig, repository URL)
- [ ] Dry-run release (`pnpm release:dry`)

---

## Non in scope (posticipato)
- Nuove componenti (combobox, tabs, tooltip, tree) — solo dopo Fasi 0–6 complete
- Migrazione a TypeScript .ts
- Base class condivisa
- GitHub Pages per-package (solo portal per ora)
