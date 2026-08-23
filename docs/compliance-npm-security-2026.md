# Compliance Study — npm Release Security 2026 + jsDelivr ESM

> **Data:** 2026-08-12 · **Scope:** pix-galaxy monorepo (`pixu1980/pix-galaxy`)
> **Riferimenti:** "The secure way to release an npm package in 2026" (Evil Martians / A. Sitnik, 2026-07-28),
> skill `secure-npm-package`, "Making More npm Packages Work with jsDelivr ESM mode" (M. Kolárik, 2026-08-08)
> **Vincolo:** nessuna dipendenza/comando/script di `package.json` è stata modificata — documento di sola analisi.
> **Aggiornamento 2026-08-23:** l'utente ha scelto il modello di release **locale** (ADR-018), clonato da
> `pixu1980/pi-coding-agent-extensions`: `pnpm release` → bump+tag+push → `npm publish --access public`
> con credenziali personali. Le raccomandazioni 2.2 (CI-only, staged publishing, provenance) NON sono
> adottate: niente `publish.yaml`, `publishConfig` minimali `{ "access": "public" }` senza `provenance`.
> Gli unici blocker pre-publish erano le sezioni 2.2.5 (`workspace:*` → ora in `devDependencies`,
> applicato) e 2.2.3 (`pix-vanilla-reactive` → `publishConfig` aggiunto, applicato).

---

## 1. Fatti raccolti (Step 1 read-only della skill)

| Fatto | Valore |
|---|---|
| Repo | `pixu1980/pix-galaxy` (account **personale**, non organizzazione) |
| Trunk | `develop` — `main` riceve solo merge di release (ADR-022) |
| Package manager | pnpm — root `11.20.0`, CI `11.9.0`, sub-pacchetti `10.33.2` |
| Cooldown dipendenze | `.npmrc` → `minimumReleaseAge=4320` (**3 giorni**) + `pnpm-workspace.yaml` → `minimumReleaseAgeExclude: vite@8.2.1` |
| Postinstall dipendenze | pnpm 10/11 li bloccano di default; allowlist `allowBuilds: esbuild` (unico script consentito) |
| Override vulnerabilità | `brace-expansion` e `js-yaml` forzati a versioni patched via `pnpm-workspace.yaml` |
| Pacchetti pubblici | **11×** `@pix-galaxy/*` — **nessuno ancora pubblicato** (`npm view` → E404 su tutti) |
| Pacchetti privati | `@pix-galaxy/pix-core`, `@pix-galaxy/pix-foundations` (`private: true`) + template `pix-component-template` |
| Modello di release | **Locale** (ADR-018): `scripts/release.mjs` → bump + tag + `npm publish --access public` da macchina dev |
| Workflow CI | `ci.yml`, `release.yml` (quality gate, non pubblica), `pages.yml`, `check-workflows.yaml` (zizmor) |
| zizmor (eseguito il 2026-08-12) | ✅ **0 findings** su tutti e 4 i workflow |
| Tag git | **Nessun tag esistente** — formato previsto `@pix-galaxy/<pkg>@<semver>` |
| Build | esbuild: `bundle:true`, `platform:'browser'`, `minify`, `target es2020`, format ESM+CJS |
| Artifact | `artifact/index.js` (ESM) + `artifact/index.cjs` (CJS) + `index.d.ts` — **self-contained** (verificato: 0 import esterni residui) |
| Source maps | Nessuna emessa ✓ |
| Provenance | `publishConfig.provenance: true` su 10/11 pacchetti pubblici; `pix-vanilla-reactive` **senza** `publishConfig` |
| Dipendenze runtime dei pacchetti pubblici | Solo `@pix-galaxy/*` workspace (`workspace:*`), incluse **2 private** (`pix-core`, `pix-foundations`) — inliniate dal bundle |
| Node built-in / `import.meta.url` / `NODE_ENV` / TLA nel runtime | **Assenti** nei componenti (presenti solo in test/docs non pubblicati) |

---

## 2. Compliance — "The secure way to release" + skill `secure-npm-package`

### 2.1 ✅ Già conforme (lato repo — lato GitHub Actions è ~90% allineato)

| Requisito | Stato |
|---|---|
| Action di terze parti pinnate per SHA + commento versione (checkout, setup-node, pnpm/action-setup, harden-runner, zizmor, upload/download-artifact, configure/upload/deploy-pages) | ✅ |
| Lint workflow con zizmor (`check-workflows.yaml`) | ✅ Presente e pulito |
| Harden Runner (`egress-policy: audit`) | ✅ su `ci.yml`, `release.yml`, `pages.yml` |
| `--ignore-scripts` su tutti gli install CI | ✅ |
| `package-manager-cache: false` | ✅ in `release.yml` |
| Nessun `NPM_TOKEN` in workflow o secrets | ✅ (rimosso da ADR-018) |
| `persist-credentials: false` sui checkout | ✅ |
| Cooldown dipendenze (3 giorni = il massimo consigliato; blocca ~94% dei pacchetti malevoli) | ✅ |
| Postinstall delle dipendenze disabilitati (pnpm 10/11 di default + allowlist) | ✅ |
| Trigger di release sul formato tag del repo (`@pix-galaxy/*@*`) | ✅ |
| Superficie d'attacco ridotta: artifact bundled e minificati, browser-only, niente sourcemap | ✅ |
| `SECURITY.md`, `GOVERNANCE.md`, `CODE_OF_CONDUCT.md`, `SUPPORT.md` | ✅ |
| Override di versioni vulnerabili transitive (`brace-expansion`, `js-yaml`) | ✅ (extra, ottimo) |

### 2.2 ❌ Non conforme — il cuore della skill

1. **Release locale, non CI-only (ADR-018).** Regola n.1 dell'articolo: *"The best token is no token"*.
   Le credenziali npm (`npm login` in `release-helpers.mjs`) vivono sulla macchina dello sviluppatore —
   esattamente il vettore descritto dall'articolo (token rubati da plugin IDE, malware in `node_modules`,
   social engineering "fake job interview"). La skill impone: *"releases can come only from one CI workflow"*.
2. **Niente Staged Publishing.** `npm publish` diretto (non `npm stage publish`) → nessuna approvazione
   umana con 2FA sul contenuto. Lo script si affida solo allo scan malware automatico di npm
   (non è la stessa cosa dell'approvazione staged).
3. **Niente Trusted Publishing configurato.** Configurabile solo **dopo** il primo publish
   (pagina settings non esiste finché il pacchetto è E404) → vale il flusso "Not yet published" della skill:
   primo rilascio manuale per ogni pacchetto, poi configurazione per-package.
4. **Conflitto `provenance: true` vs. publish locale.** npm provenance richiede OIDC, disponibile solo
   in CI (GitHub Actions ecc.). Un `npm publish` da macchina locale con `publishConfig.provenance: true`
   fallisce (EUSAGE). Il repo è "a metà migrazione": configurato per CI, ma con flusso locale.
5. **`dependencies` rotte nei pacchetti pubblici.** Tutti (tranne `pix-vanilla-reactive`) dichiarano
   `@pix-galaxy/pix-core` e/o `@pix-galaxy/pix-foundations` (`private: true`, mai pubblicate) con
   protocollo `workspace:*`. `npm publish` **non riscrive** `workspace:*` (lo fa `pnpm publish`):
   il package.json pubblicato conterrebbe `"workspace:*"` letterale → **install impossibile per i consumer**.
   Anche con `pnpm publish` (che riscrive alla versione corrente) i consumer andrebbero in **E404** sul
   pacchetto privato. L'artifact è già self-contained, quindi queste dipendenze vanno spostate in
   `devDependencies` (è **l'opposto** dell'hack `--omit=dev` dell'articolo, che riguarda i build tool).
6. **`pix-vanilla-reactive` senza `publishConfig`** (manca `access`/`provenance` rispetto agli altri 10).
7. **Branch stantii con vecchi workflow:** `backup/develop-pre-message-fix`, `backup/develop-pre-rewrite`,
   `backup/main-pre-rewrite` + branch dependabot obsoleto. L'articolo: *"Remove all old branches after
   fixing a security issue in your CI workflows"* (vettore d'attacco Nx: PR contro branch vecchi con
   workflow vulnerabili). I backup predatano il pinning SHA.
8. **Settings GitHub/npmjs non verificabili dal repo** (nessuna `gh` CLI): 2FA, tag ruleset,
   Immutable Releases, disallow tokens → conferma manuale dell'utente richiesta.

### 2.3 ⚠️ Note minori

- `check-workflows.yaml` fa push-lint solo su `main`; il trunk è `develop` (i PR sono coperti da
  `pull_request: ['**']`, ma aggiungere `develop` ai push sarebbe più coerente).
- Versioni pnpm disallineate (root `11.20.0` / CI `11.9.0` / packages `10.33.2`) — tutte ≥10,
  quindi il blocco script regge; allineamento consigliato.
- `.npmrc` contiene chiavi pnpm-only (`strict-peer-dependencies` ecc.) → npm warn "Unknown project
  config" a ogni comando npm del flusso di release (cosmetico).
- `npm publish` senza `--ignore-scripts` esegue `prepublishOnly` (`pnpm check && pnpm pack`): pesante ma corretto.
- `git push --follow-tags origin main` in `release.mjs` spinge commit di release direttamente su `main`
  mentre `develop` è il trunk (ADR-022) — da rivedere nel modello CI.

---

## 3. Compliance — jsDelivr ESM mode

**Verdetto: eccellente per design.** L'architettura (zero dipendenze runtime, browser-only, ESM nativo,
artifact bundled) è esattamente ciò che `/ +esm` serve meglio.

| Fix dell'articolo | Rilevanza per pix-galaxy |
|---|---|
| `"type": "module"` → `.js` parsato come ESM, niente conversione CJS | ✅ Presente ovunque; `artifact/index.js` è ESM nativo |
| JSON import attributes | ✅ Nessun import JSON nel runtime |
| Top-level await | ✅ Assente nei componenti (solo test/docs, non pubblicati) |
| `NODE_ENV` in più forme (dot/bracket, `global.process`, `globalThis.process`) | ✅ Assente nel runtime |
| Shebang `#!` | ✅ Non è un CLI |
| Self-mapping del campo `browser` | ✅ Nessun campo `browser` (entry unica via `exports`) |
| Long-tail CommonJS (`__exportStar`, lexer combinati, re-export string-literal, esterni ESM) | ✅ Irrilevante: artifact **bundled** ESM/CJS da esbuild, senza helper esterni |
| Asset relativi via `import.meta.url` (QuickJS, Box2D-WASM) | ✅ Nessun asset runtime; il fix `resolveImportMeta` di jsDelivr coprirebbe usi futuri |
| Source map (pixi-filters) | ✅ Nessuna sourcemap emessa |
| Tree-shaking dei built-in Node non supportati | ✅ Nessun Node built-in nel runtime (solo `fetch`, `navigator.clipboard`, `getUserMedia`) |
| Polyfill layer Node.js (16 fix) | ✅ Non necessario |
| Minificazione esbuild (file > 4 MiB) | ✅ Già minificati da esbuild |
| JSX non supportato | ✅ Nessun JSX |
| Risoluzione dipendenze | ⚠️ Unico neo: le `dependencies` `workspace:*` verso pacchetti privati; spostandole in `devDependencies` la risoluzione `/ +esm` resta pulita (l'artifact non importa nulla) |

Dettagli favorevoli: `exports` con condizioni `import`/`require`/`types` + `main`/`module` + `types` +
`files: ["artifact", …]` → risoluzione `/ +esm` immediata sul file ESM corretto. `sideEffects: true` è
corretto (i componenti registrano custom elements all'import). `target: es2020` è compatibile con i
browser target (Chrome 119+, Safari 17.5+, Firefox 120+).

---

## 4. Blocker prima del primo rilascio (ordine di priorità)

1. **Spostare `@pix-galaxy/pix-core` e `@pix-galaxy/pix-foundations` da `dependencies` a
   `devDependencies`** in tutti i pacchetti pubblici (verificare anche le catene: ogni pacchetto pubblico
   dipende da `pix-foundations`; `pix-color`, `pix-command`, `pix-recorder`, `pix-sortable`, `pix-splitter`,
   `pix-toast` dipendono anche da `pix-core`). Senza questo, i pacchetti pubblicati sono **ininstallabili**.
2. **Risolvere il conflitto provenance/publish-locale**: il primo rilascio manuale va eseguito con
   provenance disattivata (`npm publish --ignore-scripts --no-provenance --access public`, 2FA),
   poi il provenance torna attivo automaticamente pubblicando da CI.
3. **`pix-vanilla-reactive`: aggiungere `publishConfig`** coerente con gli altri pacchetti
   (`{ "access": "public", "provenance": true }`).

---

## 5. Studio di migrazione (come *potrebbe* cambiare — nessuna modifica applicata)

Obiettivo: allineare il modello di release alla skill, mantenendo il tooling esistente dove possibile.

1. **Primo rilascio manuale per ciascuno degli 11 pacchetti** (regola "Not yet published" della skill):
   `npm publish --ignore-scripts --no-provenance --access public` con 2FA — poi la pagina settings esiste.
2. **npmjs.com, per ogni pacchetto** (`https://www.npmjs.com/package/@pix-galaxy/<nome>/access`):
   - Trusted Publisher → GitHub Actions, `pixu1980` / `pix-galaxy`, workflow `publish.yaml`,
     **solo "Allow npm stage publish"** (nega `npm publish` diretto)
   - Publishing access → **Require two-factor authentication** e **disallow tokens**
3. **github.com**:
   - Tag ruleset **"Tags only by admins"** (Restrict creations, bypass: Repository admins, Include all tags)
   - **Immutable Releases** attivo
   - 2FA personale (account personale → niente enforcement org; confermare hardware key/passkey)
4. **Repo**:
   - Nuovo `.github/workflows/publish.yaml` adattato al formato tag del repo (`@pix-galaxy/*@*`):
     job `test` + `build` (già presenti in `release.yml`, riusabili) e job `publish` con
     `id-token: write` **solo** lì; **nessun install di dipendenze nel job publish** (l'artifact è
     self-contained: checkout + download-artifact + `npm stage publish --ignore-scripts --workspace=<pkg>`);
     `--ignore-scripts` ovunque; `package-manager-cache: false`.
   - Il **version bump/changelog** (commit-and-tag-version) può restare locale e precedere il tag:
     il tag spinge CI che fa lo staging; oppure passare a `pnpm version -r` (opzionale).
   - `check-workflows.yaml`: aggiungere `develop` ai trigger push.
   - Cancellare i branch backup con i vecchi workflow.
   - Allineare le versioni pnpm nei workflow.
5. **Flusso di release finale**: bump + tag (`@pix-galaxy/<pkg>@<version>`) → CI test/build →
   `npm stage publish` → **approvazione manuale con 2FA** in "Staged Packages" (npm user menu) o
   `npm stage approve`. Opzionale: account **drydock** (token read-only) per review del diff prima
   dell'approvazione.

---

## 6. Da confermare dall'utente (non verificabile dal repo)

- [ ] 2FA attiva con hardware key/passkey su github.com (`https://github.com/settings/security`)
- [ ] Tag ruleset attivo / Immutable Releases attivo (impostazioni repo)
- [ ] Nessun altro tool/pipeline pubblica i pacchetti con token
- [ ] Scelta cooldown: già 3 giorni (il più sicuro) → nessuna decisione necessaria

---

## 7. Sintesi

| Area | Verdetto |
|---|---|
| Lato GitHub Actions (pinning, zizmor, harden-runner, no token, cooldown, ignore-scripts) | ✅ Conforme |
| Modello di release (locale ADR-018 vs. CI-only + staged) | ❌ Non conforme — è il gap principale |
| Trusted Publishing / Staged Publishing / 2FA settings | ⏳ Da configurare dopo il primo publish |
| Packaging (deps `workspace:*` verso pacchetti privati) | ❌ Blocker pre-publish |
| Compatibilità jsDelivr `/ +esm` | ✅ Eccellente per design |
