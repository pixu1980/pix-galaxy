# Execution Plan — Secure npm Release + jsDelivr ESM (2026)

> **Status:** in esecuzione · **Data:** 2026-08-12 · **aggiornato:** 2026-08-23
> **Riferimento studio:** [`docs/compliance-npm-security-2026.md`](../compliance-npm-security-2026.md)
> **Decisione utente (2026-08-23):** modello di release **locale** — clonato e riadattato da
> `pixu1980/pi-coding-agent-extensions` (ADR-018), che funziona come richiesto:
> `pnpm release` → bump+CHANGELOG+tag (`<pkg>@<ver>`) → push tag → `npm publish --access public`
> con le credenziali npm dell'utente. **Niente workflow di publish in CI, niente `provenance`**
> (le Fasi 4/5 del modello CI-only non si applicano più; il primo rilascio è comunque manuale).
> **Vincolo attivo:** nessuna modifica a dipendenze / comandi / `scripts` di `package.json` senza
> autorizzazione esplicita dell'utente (gli item che la richiedono sono marcati **🔒**).

---

## Fase 0 — Decisioni preliminari (utente)

- [x] Cooldown: **3 giorni** — già attivo (`.npmrc` `minimumReleaseAge=4320`)
- [x] Campo `repository` presente in tutti i package.json
- [x] 🔒 **Autorizzazione (2026-08-23, applicata):** spostare `@pix-galaxy/pix-core` e
      `@pix-galaxy/pix-foundations` (e tutte le altre workspace dep inliniate nel bundle) da
      `dependencies` a `devDependencies` nei 10 pacchetti pubblici. **Conseguenza se non
      autorizzato:** i pacchetti pubblicati risulterebbero ininstallabili (`workspace:*` letterale via
      `npm publish`, o E404 sul pacchetto privato). L'artifact è self-contained → nessun impatto runtime.
      ✅ Verificato: `npm pack` → `dependencies: {}` nel tarball.
- [ ] Conferma: **nessun altro tool/pipeline** pubblica i pacchetti con token npm
- [ ] Conferma: 2FA personale attiva con hardware key/passkey
      (`https://github.com/settings/security`)

## Fase 1 — Impostazioni manuali GitHub (utente) — eseguibile SUBITO

Le impostazioni GitHub non dipendono dallo stato di pubblicazione dei pacchetti.

- [ ] **Tag ruleset "Tags only by admins"** — con CI publishing, chiunque possa creare tag `v*`/
      `@pix-galaxy/*@*` può triggerare una release:
      `https://github.com/pixu1980/pix-galaxy/settings/rules/new?target=tag`
      - Ruleset Name: `Tags only by admins`
      - Enforcement status: **Active**
      - Bypass list: **Repository admins**
      - Target tags: **Include all tags**
      - Tag rules: **Restrict creations**
- [ ] **Immutable Releases** — tag e asset di release non modificabili/cancellabili:
      `https://github.com/pixu1980/pix-galaxy/settings` → sezione **Releases** → **Immutable releases**
- [ ] **2FA personale** confermata (item Fase 0) — account personale, niente enforcement a livello org
- [ ] Verifica **assenza di `NPM_TOKEN`** nei secrets:
      `https://github.com/pixu1980/pix-galaxy/settings/secrets/actions` (atteso: nessuno)

> ⏸️ **Fermati qui.** Conferma a piè di risposta il completamento della Fase 1 (e le decisioni Fase 0)
> prima di procedere: le modifiche repo (Fase 2) partono solo dopo la tua conferma.

## Fase 2 — Modifiche repo (agent) — **ESEGUITE 2026-08-23**

Scelta utente: modello di release **locale** (come `pi-coding-agent-extensions`) → **niente
`publish.yaml`**, niente staged publishing, niente provenance CI.

- [x] ~~Creare `.github/workflows/publish.yaml`~~ **NON eseguito — decisione utente: modello locale**.
      Il workflow `publish.yaml` creato in bozza è stato **rimosso**. `release.yml` resta il quality
      gate sui tag (`@pix-galaxy/*@*`): typecheck + test + build, nessun publish.
- [x] Estrazione del pacchetto dal tag già presente in `release.yml` (pattern
      `NAME="${TAG%@*}"` → `packages/${NAME##*/}`) — invariato.
- [x] Destino di `release.yml`: **mantenuto come quality gate sui tag**; nessuna duplicazione con
      un publish workflow (non esiste più).
- [x] `check-workflows.yaml`: aggiunto `develop` ai trigger `push` ✓
- [x] **zizmor** ri-eseguito localmente su tutti i workflow → **0 findings** (v1.29.0, offline)
- [x] Branch stantii: **verificato — nessun branch `backup/*` presente in remote** (già rimossi in
      sessioni precedenti); i branch `dependabot/*` restano gestiti da Dependabot.
- [x] Allineata versione pnpm nei workflow CI: `pnpm/action-setup` `11.9.0` → `11.20.0`
      (`ci.yml`, `release.yml`, `pages.yml`) ✓
- [x] 🔒 Spostate le workspace deps inliniate in `devDependencies` (10 pacchetti) + `publishConfig`
      aggiunto a `pix-vanilla-reactive` — **`{ "access": "public" }`** (senza `provenance`,
      allineato al modello locale; rimosso `provenance: true` dagli altri 10)
- [x] 🔒 `scripts/release.mjs` adattato al modello locale come `pi-coding-agent-extensions`:
      bump+tag (commit-and-tag-version), `git push --follow-tags origin develop` (trunk ADR-022),
      `npm publish --access public` con credenziali utente (niente `--no-provenance`, niente CI)
- [x] `.npmrc`: `registry=https://registry.npmjs.org/` esplicito + `access=public` + cooldown
- [x] `packages/pix-vanilla-reactive/LICENSE` creato (era listato in `files` ma assente) —
      blocco `npm pack` mancante risolto
- [x] Validazione: typecheck `pnpm -r` ✅ · test `pix-toast` + `pix-vanilla-reactive` ✅ ·
      `npm pack --dry-run` su tutti gli 11 tarball ✅ · tarball verificato: nessuna `dependencies`,
      docs+artifact+LICENSE presenti
- [x] **Marcatore di readiness** (2026-08-23): `releaseStatus: "wip" | "ready"` in ogni
      `package.json` (fonte di verità unica). `release.mjs` salta i non-ready; portal
      (`src/docs/index.js`) e aggregazione `pages.yml` mostrano solo i ready; e2e derivano la
      lista dai package.json. Primi ready: `pix-highlighter`, `pix-color-scheme-selector`,
      `pix-accent-color-selector`, `pix-a11y-panel` — il resto resta wip.

## Fase 3 — Primo rilascio manuale (utente, per ciascuno degli 11 pacchetti)

Modello locale (come `pi-coding-agent-extensions`): `pnpm release` in root fa tutto
(bump+CHANGELOG+tag + push + `npm publish --access public`), oppure manualmente per pacchetto:

- [ ] `cd packages/<pkg>` && `npm publish --access public` (con 2FA npm attiva; nessun
      `provenance` in `publishConfig`, quindi nessun flag speciale)
      (in alternativa: `node scripts/release.mjs` da root per tutti i pacchetti con cambi)
- [ ] Prerequisiti: `npm whoami` funzionante (401 al momento della verifica del 2026-08-23 →
      serve `npm login` una tantum) · working tree pulito (commit in sospeso da chiudere)
- [ ] ⚠️ La Fase 0/2 ha già autorizzato e applicato lo spostamento deps → nessun blocco residuo
      (verificato: `dependencies: {}` nei tarball)
- [ ] Dopo il primo publish: verificare la pagina del pacchetto su npmjs.com (nome, README, files)
      e contare ~5 min di malware scan prima dell'installabilità

## Fase 4 — Impostazioni manuali npmjs.com (utente, opzionali ma consigliate) — per ogni pacchetto

Ripetere per ognuno degli 11 pacchetti (link: `https://www.npmjs.com/package/@pix-galaxy/<nome>/access`):

- [ ] **Publishing access:** **Require two-factor authentication**
      (+ eventualmente disallow tokens, se si vuole vietare publish automatizzati)
- [ ] ~~Trusted Publisher / staged publishing~~ **NON applicabile**: il modello è locale, niente
      `publish.yaml` (niente OIDC/provenance)

## Fase 5 — Verifica e test end-to-end

- [ ] Bump versione + CHANGELOG + tag `@pix-galaxy/<pkg>@<version>` → `git push origin <tag>`
      (lo fa `release.mjs`: push del tag sul trunk `develop`)
- [ ] Quality gate su tag: `release.yml` (typecheck + test + build) automatico alla push del tag
- [ ] ~5 min di malware scan npm dopo ogni publish (verifica con `npm view <pkg>@<ver>` o
      `node scripts/release.mjs --verify`)
- [ ] Verifica jsDelivr `/ +esm` su un pacchetto (es. `https://cdn.jsdelivr.net/npm/@pix-galaxy/pix-toast/+esm`)
- [ ] Test release **patch** end-to-end su un pacchetto pilota (es. `pix-toast`) prima di rilasciare tutti
- [ ] Checklist finale modello locale: zizmor pulito · action pinnate SHA · cooldown attivo ·
      postinstall disabilitati · niente NPM_TOKEN · 2FA su npm · tag ruleset GitHub (consigliato) ·
      `npm whoami` autenticato

---

## Stato del piano

- [x] Fase 0 — decisioni utente (autorizzazione 🔒 concessa 2026-08-23)
- [ ] Fase 1 — impostazioni manuali GitHub (utente): tag ruleset + immutable releases + 2FA
- [x] Fase 2 — modifiche repo (agent) — **eseguite 2026-08-23** secondo il modello locale
- [ ] Fase 3 — primo rilascio manuale (utente)
- [ ] Fase 4 — 2FA npm per pacchetto (opzionale ma consigliata)
- [ ] Fase 5 — verifica end-to-end
