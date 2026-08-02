# pix-galaxy — Execution Plan

> **Status:** approvato (Wave 1 + Wave 2 questionnaire, 2026-07-09)
> **Obiettivo:** stabilizzare la repo, chiudere il debito critico, alzare la qualità, completare docs/release. **Nessuna nuova componente** finché queste fasi non sono complete.

---

## Decisioni strategiche (approvate)

| Area           | Decisione                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Posizionamento | Libreria **open-source pubblica**                                                                                                                       |
| Dipendenze     | **Zero-dependency assoluta** (runtime)                                                                                                                  |
| A11y           | **WCAG 2.2 AA sempre** (requisito non negoziabile)                                                                                                      |
| Browser        | **Modern-only** (ultimi 2 anni: Chrome 119+, Safari 17.5+, Firefox 120+) — i fallback `light-dark()` si **mantengono** comunque (ADR-004 resta)         |
| Branch         | **develop = trunk**, **main = release**                                                                                                                 |
| Testing        | Unit test per componente (node:test + jsdom) + e2e espanso + axe-core + visual regression                                                               |
| Tipi           | **JSDoc + typecheck strict** in CI (nessuna migrazione a .ts)                                                                                           |
| Architettura   | **Fix puntuali** dei 6 critici — nessuna base class condivisa (DNA zero-astrazioni)                                                                     |
| Docs           | Migrare i **4 componenti legacy** al template docs condiviso (`pix-core/docs-site.js`)                                                                  |
| Release        | Migrare a **`commit-and-tag-version`** (fork mantenuto), **release locale**, niente CI publish con NPM_TOKEN — allineato a `pi-coding-agent-extensions` |
| ADR            | Consolidare i 18 ADR sparsi in `docs/adr/` con stato aggiornato                                                                                         |

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

### Fase 2 — ADR consolidation ✅ FATTA

- [x] Creato `docs/adr/` con 24 ADR numerati e indicizzati (Nygard format, README index)
- [x] Stati aggiornati: ADR-009 (standard-version) → superseded da ADR-018 (commit-and-tag-version)
- [x] Aggiunti ADR 018-024 per le decisioni strategiche (release locale, modern-only, zero-dep, WCAG, branch, JSDoc strict, skills→MCP)
- [x] HANDOFF.md e HANDOFF-LLM aggiornati: sezioni ADR sostituite con riferimento a docs/adr/

### Fase 3 — Fix critici (architectural review) ✅ FATTA

- [x] Audit dei 6 critici: **4 già fixati** in sessioni precedenti (inline arrows, .bind, setTimeout race, body.dataset)
- [x] **pix-sortable**: rimosso observer ridondante per-item in #setupItem (rischio loop) + disconnect observer in disconnectedCallback
- [x] **pix-toast-stack**: rimozione toast attivi in disconnectedCallback (cleanup listener orfani)
- [x] **pix-toast**: rimossi #onDismissClick/#handleDismiss morti (warning lint)
- [x] **Fix test preesistenti**: 7 package con smoke test che importavano nomi pre-rinominazione (`PixColor.js` → `_PixColor.js` ecc.)
- [x] **Aggiornati test obsoleti** post-ADR-012: highlighter (CSS spostato in theme-defaults, selettori tema con apici singoli, token reali)
- [x] **Risultato: 124 test pass / 0 fail su 10 package**; lint e format puliti
- [x] **Typecheck strict completato**: creati `index.types.js` mancanti (pix-color, pix-sortable, pix-recorder) con typedef API pubbliche; typecheck ora passa su 10/10 package; root `typecheck` + aggiunto a `pnpm quality` (ADR-023)
- [x] Template: rimosso script typecheck (placeholder {%...%} non compilabili, come per prettier/eslint)

### Fase 4 — Testing ✅ FATTA

- [x] **Audit axe-core (WCAG 2.2 AA)**: nuovo `e2e/a11y.spec.mjs` — 12/12 su portal + 11 docs sites
- [x] **E2E espanso**: nuovo `e2e/interactions.spec.mjs` — 15 test (interazioni reali + audit componenti live)
- [x] **49/49 e2e** totali (22 portal + 12 a11y + 15 interactions)
- [x] **Fix a11y reali scoperti dall'audit**:
  - pix-color: nested-interactive (input color dentro role=button) + label mancante → input spostato a sibling
  - pix-sortable: aria-required-children → live region spostata fuori dal listbox (wrapper interno)
  - pix-toast-stack: aria-prohibited → aggiunto role=region
  - Portal: role=listitem sulle card, contrasto text-muted (ink-600→950) e footer link (sky-700)
  - foundations: warning token scurito (contrasto 4.5+)
  - docs template: `pre` scrollabile → tabindex=0; placeholder live rotto → testo statico
- [x] **Fix bug sistemici trovati**:
  - **port-map disallineata**: dev-all (ordine alfabetico) vs portal fallback (ordine hardcoded) → nuovo `scripts/port-map.mjs` condiviso
  - **index.html con title sbagliato** in recorder/sortable/splitter (copia-incolla "pix-color docs")
  - **foundations docs 500**: mancava pix-core tra le devDeps
- [x] **Docs sites migliorati**: aggiunto `liveHtml` (componente live montato) a 6 docs che non lo avevano
- [x] CI: aggiunto job e2e Playwright (chromium + dev:all via webServer)
- [x] `pnpm test:e2e` script root; `pnpm quality` già copre format+lint+typecheck

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
