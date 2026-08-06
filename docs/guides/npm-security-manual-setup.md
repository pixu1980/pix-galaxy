# Guida alla configurazione manuale della sicurezza npm

Questa guida elenca i passaggi da eseguire **una tantum** su GitHub e npmjs.com
per completare l'hardening della supply chain di pix-galaxy. I workflow CI e la
configurazione `pnpm` sono già stati aggiornati — queste sono le azioni che
richiedono accesso amministrativo alle impostazioni web.

---

## 1. GitHub — Tag protection (solo admin creano tag)

Impedisce a chiunque tranne gli admin di repository di creare tag. La release
di pix-galaxy parte proprio da un tag (`@pix-galaxy/<pkg>@<version>`), quindi
proteggere i tag è fondamentale per evitare rilasci non autorizzati.

**URL diretto:**
https://github.com/pixu1980/pix-galaxy/settings/rules

**Procedura:**

1. Clicca **New ruleset** → seleziona **New tag ruleset**
2. Compila i campi:

   | Campo | Valore |
   |---|---|
   | Ruleset Name | `Tags only by admins` |
   | Enforcement status | `Active` |
   | Bypass list | `Repository admins` |
   | Target tags | `Include all tags` |

3. In **Tag rules**, abilita **Restrict creations**
4. Clicca **Create**

Verifica: prova a creare un tag da un account non-admin — deve essere bloccato.

---

## 2. GitHub — Immutable Releases

Impedisce che i rilasci già pubblicati vengano modificati o cancellati.

**URL diretto:**
https://github.com/pixu1980/pix-galaxy/settings

(scrolla fino alla sezione **Releases**)

**Procedura:**

1. Nella pagina Settings generale del repo (assicurati di essere sul tab
   _General_ in alto a sinistra, non sul menu laterale)
2. Scorri fino alla sezione **Releases**
3. Attiva il toggle **Immutable Releases**

---

## 3. GitHub Organization — 2FA obbligatoria

Richiede che tutti i membri dell'organizzazione abbiano l'autenticazione
a due fattori attiva.

**URL diretto:**
https://github.com/organizations/pixu1980/settings/security

**Procedura:**

1. Vai alla sezione **Authentication security**
2. Attiva **Require two-factor authentication for everyone**
3. GitHub invierà una notifica ai membri che non hanno ancora la 2FA
   configurata

Nota: se sei l'unico membro e hai già la 2FA, l'opzione è comunque
consigliata come enforcement per il futuro.

---

## 4. npm — Publishing access per ogni pacchetto pubblico

Per ogni pacchetto `@pix-galaxy/*` pubblicato, bisogna:

1. Revocare tutti i token di pubblicazione esistenti (così nessun token
   rubato può essere usato per pubblicare)
2. Richiedere la 2FA per la pubblicazione (il publish locale con `npm login`
   interattivo la soddisfa già)

### Elenco dei pacchetti pubblici

| Pacchetto | URL impostazioni |
|---|---|
| `@pix-galaxy/pix-a11y-panel` | https://www.npmjs.com/package/@pix-galaxy/pix-a11y-panel/settings |
| `@pix-galaxy/pix-accent-color-selector` | https://www.npmjs.com/package/@pix-galaxy/pix-accent-color-selector/settings |
| `@pix-galaxy/pix-color` | https://www.npmjs.com/package/@pix-galaxy/pix-color/settings |
| `@pix-galaxy/pix-color-scheme-selector` | https://www.npmjs.com/package/@pix-galaxy/pix-color-scheme-selector/settings |
| `@pix-galaxy/pix-command` | https://www.npmjs.com/package/@pix-galaxy/pix-command/settings |
| `@pix-galaxy/pix-highlighter` | https://www.npmjs.com/package/@pix-galaxy/pix-highlighter/settings |
| `@pix-galaxy/pix-recorder` | https://www.npmjs.com/package/@pix-galaxy/pix-recorder/settings |
| `@pix-galaxy/pix-sortable` | https://www.npmjs.com/package/@pix-galaxy/pix-sortable/settings |
| `@pix-galaxy/pix-splitter` | https://www.npmjs.com/package/@pix-galaxy/pix-splitter/settings |
| `@pix-galaxy/pix-toast` | https://www.npmjs.com/package/@pix-galaxy/pix-toast/settings |
| `@pix-galaxy/pix-vanilla-reactive` | https://www.npmjs.com/package/@pix-galaxy/pix-vanilla-reactive/settings |

### Procedura (uguale per ogni pacchetto):

1. Apri l'URL delle impostazioni del pacchetto
2. Nella sezione **Publishing access**:
   - Disabilita eventuali token esistenti (se c'è un elenco di token,
     revocali manualmente)
   - Attiva **Require two-factor authentication or automation tokens
     for publish**
3. **Non** abilitare Trusted Publishing — le release continuano in locale
   con `pnpm release`

---

## 5. Verifica finale

Dopo aver completato i 4 passaggi, esegui un dry-run per confermare che
la pipeline funzioni:

```bash
# Test del meccanismo di release (senza pubblicare)
pnpm release:dry

# Test del quality gate CI (pusha un tag fittizio, poi rimuovilo)
git tag @pix-galaxy/pix-toast@0.0.0-test
git push origin @pix-galaxy/pix-toast@0.0.0-test
# controlla che il workflow release.yml giri su GitHub Actions
git push origin --delete @pix-galaxy/pix-toast@0.0.0-test
```

---

## Riferimenti

- [The secure way to release an npm package in 2026](https://evilmartians.com/chronicles/the-secure-way-to-release-an-npm-package-in-2026) — Evil Martians
- [npm Trusted Publishing docs](https://docs.npmjs.com/generating-provenance-statements)
- [npm Staged Publishing docs](https://docs.npmjs.com/managing-packages/staged-publishing)
- [GitHub Immutable Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases#immutable-releases)
