# Release 0.1.0 — piano unico

> **Status:** attivo · **Data:** 2026-10-20  
> **Obiettivo:** pubblicare su npm `@pix-galaxy/<pkg>@0.1.0` per **tutti i package della coorte ready**, con `pix-vanilla-reactive` portato a `releaseStatus: "ready"`.  
> **Metodo:** solo gap verificati nel codice al 2026-10-20. Nessun item inventato.  
> **Sostituisce:** `docs/plans/execution-plan.md`, `execution-plan-npm-security-2026.md`, `design-system-lead.md`, `ui.md` + `docs/audits/*` + `docs/reviews/*` (rimossi).

---

## 0. Evidenza di partenza (misurata)

| Fatto | Evidenza |
| ----- | -------- |
| Solo `pix-highlighter` è `releaseStatus: "ready"` | `packages/*/package.json` |
| README elenca 4 ready (highlighter, color-scheme, accent, a11y) | `README.md` — **drift** vs package.json |
| Nessun package `@pix-galaxy/*` pubblicato su npm | `npm view` non risolve; `npm whoami` → **401** |
| Tutti i package pubblici sono già a versione `0.1.0` | `package.json` per-package |
| Tarball includono ancora `dependencies: { "@pix-galaxy/…": "workspace:*" }` | `npm pack` su `pix-vanilla-reactive` (e stessi campi in highlighter/a11y/toast) — **blocco publish** |
| ADR-028: cicli docs-only accettati con `ignoreWorkspaceCycles: true` | `pnpm-workspace.yaml` + `docs/adr/0028-…` |
| Quality: `format:check` verde; typecheck verde (con warn cicli) | `pnpm quality` |
| Coverage ADR-026 (≥95% enforced): a11y / accent / color-scheme OK; highlighter **89.63/83.13** senza `--check-coverage`; vanilla-reactive **~92.7/77** senza enforcement | `pnpm --filter … test:coverage` |
| Portal e2e: `expect(readyCount).toBeGreaterThanOrEqual(4)` con 1 solo ready | `e2e/portal.spec.mjs:137` |
| 6 README clonati da accent-color-selector | `head -1` su color/command/recorder/sortable/splitter/toast |
| Token componente indefiniti (command/toast/sortable/splitter) | CSS consuma `--pix-*-*` senza default sul root |
| Focus calibrato inutilizzato | `_palettes.css` definisce `--pix-focus`; `_focus.css` usa `--pix-focus-color` → accent |
| WIP card blur touch-hostile | `_docs-site.css` `filter: blur(2.25px) saturate(0.3)` solo hover/focus-visible |
| Catalog anchors con `role="listitem"` | `src/docs/index.js:100` |
| Docs nav = button, no URL/title | `packages/pix-core/docs/docs-site.js` |
| Interpolazione dentro `<if>` rotta (pill `${wip} in WIP`) | portal `src/docs/index.js:235-236` + review UI-23 |
| Highlighter typo token mono | `_theme-defaults.css`: `--pix-t-font-mono` (inesistente) vs `--pix-t-mono` |
| vanilla-reactive: no CHANGELOG/governance; `files` solo `artifact/README/LICENSE` | listing package dir + `package.json` |

---

## 1. Coorte 0.1.0 (cosa si pubblica)

Pacchetti pubblici che devono risultare `releaseStatus: "ready"` e pubblicati a `0.1.0`:

| Package | Oggi | Motivo in coorte |
| ------- | ---- | ---------------- |
| `@pix-galaxy/pix-highlighter` | `ready` | Già gated; incompleto vs ADR-026 (coverage) + packaging |
| `@pix-galaxy/pix-color-scheme-selector` | `wip` | README + coverage ≥95% enforced già verde |
| `@pix-galaxy/pix-accent-color-selector` | `wip` | README + coverage ≥95% enforced già verde |
| `@pix-galaxy/pix-a11y` | `wip` | README + coverage ≥95% enforced già verde |
| `@pix-galaxy/pix-vanilla-reactive` | `wip` | Richiesta esplicita: portare a ready for release |

**Fuori scope 0.1.0** (restano `wip`, nessun flip, nessun publish):  
`pix-toast`, `pix-command`, `pix-sortable`, `pix-splitter`, `pix-color`, `pix-recorder`.  
`pix-core` / `pix-foundations` restano `private`.  
Il debito design-system (token default su command/toast/…, dialog migration, i18n API, W3C DT) resta backlog post-0.1.0 — non bloccante per questa coorte.

---

## 2. Gate di promozione (ADR-026) — obbligatori prima di ogni flip `"ready"`

Per **ogni** package della coorte:

- [ ] Unit `node:test` verdi
- [ ] `pnpm test:e2e` verdi (axe docs site incluso)
- [ ] Visual regression baseline non regressa
- [ ] Coverage **≥ 95%** stmts/branch/funcs/lines con `c8 --check-coverage` nello script `test:coverage`
- [ ] `npm pack` → `dependencies` assenti o `{}` (nessun `workspace:*`)
- [ ] README del package descrive **quel** package (titolo = `@pix-galaxy/<name>`)
- [ ] Set governance allineato agli altri pubblici: `CHANGELOG.md`, `LICENSE`, `README.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `GOVERNANCE.md`, `SECURITY.md`, `SUPPORT.md` presenti e listati in `files`
- [ ] Solo dopo: `releaseStatus: "ready"`

---

## 3. Fasi

### Fase A — Packaging publish-safe (blocco #1, tutti i package)

ADR-020 + ADR-028 follow-up. Oggi i link docs-only sono in `dependencies` e finiscono nel tarball come `workspace:*`.

- [ ] **A.1** Per ogni package pubblico (coorte + gli altri, per non lasciare bombe future): spostare ogni `@pix-galaxy/*` usato **solo** da `src/docs` / test in `devDependencies`. Runtime reale (se esiste) resta in `dependencies` solo se importato da `src/` fuori docs/tests.
  - Verificato runtime reale: `pix-a11y` importa `pix-accent-color-selector` (side-effect); `pix-highlighter` importa CSS foundations via `?raw` (bundlato). Il resto dei sibling è docs-time.
  - `pix-core`: `@pix-galaxy/pix-a11y` e `pix-color-scheme-selector` → `devDependencies` (docs-site only; `marked`/`esbuild` già in devDeps).
  - `pix-vanilla-reactive`: `pix-core` / `pix-highlighter` / `pix-color-scheme-selector` → `devDependencies`.
- [ ] **A.2** Criterio: `npm pack` + lettura `package/package.json` nel tarball → `dependencies` assenti/`{}` per tutta la coorte.
- [ ] **A.3** Script CI `scripts/check-zero-deps.mjs` (o equivalente) che fallisce se un package componente ha `dependencies` non vuote / `workspace:*` — follow-up ADR-020 ancora aperto.
- [ ] **A.4** `pix-vanilla-reactive`: allineare `files` al set standard dei componenti (oggi manca CHANGELOG + governance nel tarball).

### Fase B — pix-vanilla-reactive → ready

- [ ] **B.1** Fix **UI-23**: interpolazione nested dentro `<if>` (portal pill `${wip} in WIP` mostra marker vuoto). Test unitario (number/string/`0`) + fix in template-engine (`_if-part` / `_inner-template` / binding ExprPart) + asserzione e2e sul testo della pill.
- [ ] **B.2** Coverage → ≥95% su stmts/branch/funcs/lines; foci misurati: `_filters.js` (68.88/45), `_event-part.js`, `_if-part.js`, `_for-part.js`, disposable stack/symbols. Aggiungere `c8 --check-coverage --lines=95 --functions=95 --branches=95 --statements=95` a `test:coverage`.
- [ ] **B.3** Aggiungere i 6 file governance + CHANGELOG (prima release stub ok; `commit-and-tag-version` aggiorna al publish).
- [ ] **B.4** Lint warnings del package (prefer-const / unused) a 0 errori/warning bloccanti se la policy root li tratta come fail.
- [ ] **B.5** Flip `releaseStatus: "ready"` solo dopo A + B.1–B.4 + gate §2.

**Esplicitamente non richiesti per ready 0.1.0** (restano post-release / 1.0): split cognitivo di `getTemplate()`, test VS Code extension, examples in CI Playwright, semver freeze GA.

### Fase C — Coorte componenti → ready

- [ ] **C.1** `pix-highlighter`: portare coverage a ≥95% **oppure** documentare eccezione ADR se browser-only (clipboard / CSS.highlights / anchor / popover) e aggiungere job coverage browser; comunque attivare `--check-coverage` allo stato target. Fix typo `--pix-t-font-mono` → `--pix-t-mono` in `_theme-defaults.css`.
- [ ] **C.2** `pix-color-scheme-selector` / `pix-accent-color-selector` / `pix-a11y`: packaging A.1–A.2; README già corretti; coverage già ≥95% enforced → flip `ready` dopo gate §2.
- [ ] **C.3** Focus ring (DSL-08): `_focus.css` deve consumare `--pix-focus` (calibrato in `_palettes.css`); `--pix-focus-color` solo come alias deprecato se serve. Impatta tutto il sito + componenti.
- [ ] **C.4** Allineare `README.md` root alla tabella `releaseStatus` reale (niente ready inventati).

### Fase D — Portal / docs minimi che bloccano la coorte

Solo finding **high** che toccano portal o package ready (verificati aperti):

- [ ] **D.1 UI-02**: rimuovere blur sulle card WIP (segnale solo badge/border); se resta de-emphasis, gate `@media (hover: hover)` + `:focus-within`. File: `packages/pix-foundations/lib/_docs-site.css`.
- [ ] **D.2 UI-03**: catalog = `ul`/`li` + anchor senza `role="listitem"`. File: `src/docs/index.js` (+ CSS se serve). Re-run axe portal.
- [ ] **D.3 UI-25**: e2e portal — `readyCount` derivato dai `package.json` / catalog, non `>= 4` hardcodato; theme menu scoped all’istanza aperta.
- [ ] **D.4 UI-14**: typo mono highlighter (già in C.1).
- [ ] **D.5** (consigliato pre-publish, high docs): docs nav URL + `document.title` (UI-04) almeno slug hash/`pushState` — oggi 13 siti senza deep link. Se troppo largo, registrare come follow-up immediato post-0.1.0 **solo** se il publish non dipende da esso; default: **fare prima del flip** perché è la superficie consumer delle docs pubblicate su Pages.

### Fase E — Quality repo e drift

- [ ] **E.1** Riscivere i 6 README clonati (`pix-color`, `pix-command`, `pix-recorder`, `pix-sortable`, `pix-splitter`, `pix-toast`) anche se restano wip — evita che un flip futuro pubblichi docs sbagliate; obbligatorio se qualcuno entra in coorte.
- [ ] **E.2** Aggiornare `ROADMAP.md` §4–6: stato ready reale, coverage highlighter, primo publish ancora aperto.
- [ ] **E.3** `pnpm quality` + `pnpm test` + `pnpm test:e2e` + `pnpm release:dry` verdi sulla coorte.

### Fase F — Release npm (modello locale, ADR-018)

Prerequisiti utente (non automatizzabili dall’agent):

- [ ] **F.1** `npm login` / `npm whoami` ok (oggi 401).
- [ ] **F.2** 2FA npm attiva (hardware key/passkey consigliata).
- [ ] **F.3** GitHub: tag ruleset “Tags only by admins”; Immutable Releases; verifica assenza `NPM_TOKEN` nei secrets Actions.
- [ ] **F.4** Working tree pulito; coorte tutta `ready`.
- [ ] **F.5** `pnpm release:dry` — solo coorte, changelog first-release coerenti.
- [ ] **F.6** `pnpm release` (bump se serve / first publish `0.1.0` + tag `@pix-galaxy/<pkg>@0.1.0` + push + `npm publish --access public`).
- [ ] **F.7** Post-publish: `npm view @pix-galaxy/<pkg>@0.1.0`; attendere malware scan (~5 min); `node scripts/release.mjs --verify` se disponibile; smoke jsDelivr `/+esm` su almeno highlighter + vanilla-reactive.
- [ ] **F.8** (opzionale) Su ogni package npm: Publishing access → Require 2FA.

---

## 4. Ordine di esecuzione

```
A (packaging) ──► B (vanilla-reactive) ──► C (flip componenti) ──► D (portal) ──► E (drift) ──► F (publish)
         │                                      ▲
         └──────── C.3 focus token ─────────────┘
```

Nessun `releaseStatus: "ready"` e nessun `npm publish` prima di A.2 + gate §2.

---

## 5. Backlog esplicito (NON in questo piano)

Tracciato qui solo per non ripescarlo inventando: resta dopo 0.1.0.

- Token contract componenti wip (DSL-01): default/fallback su command/toast/splitter/sortable (+ lint `var(--pix*)`).
- Unificazione namespace token / `_ds-tokens.css` duplicati (DSL-02 / UI-08).
- Theming ADR-003/004: `_palettes.css` ancora attribute + `prefers-color-scheme` duplicato; `light-dark()` senza fallback-first nei toast (DSL-03).
- `pix-command` → `<dialog showModal()>`, zero inline styles, i18n labels (DSL-04/05/13).
- Docs site re-render parziale, TOC/prev-next, FOUC color-scheme, search portal, forced-colors, reduced-motion gaps (UI-07…UI-22 medium/low).
- Safari customized built-in highlighter: documentare limite (DSL-06), no migrazione ora.
- Coverage browser-only highlighter internals; extension/examples VR; GA `1.0.0`.
- Nuovi componenti (combobox, tabs, …).

---

## 6. Definition of done

1. Coorte §1 tutta `releaseStatus: "ready"`.
2. Tutti i gate §2 verdi per la coorte.
3. `@pix-galaxy/<pkg>@0.1.0` installabile da npm per ogni membro della coorte (`npm view` + install smoke).
4. Portal e README root coerenti con i ready reali.
5. Questo file aggiornato con checkbox `[x]`; nessun altro piano/audit/review sotto `docs/`.
