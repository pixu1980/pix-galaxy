# Pix-Galaxy - Architectural Review

> **Author:** Senior UI Architect review  
> **Date:** 2026-07-05  
> **Scope:** All `packages/*/src/` components (excludes `node_modules`)

---

## Quality Signal: 7213/10000

| Dimensione              | Punteggio | Stato                          |
| ----------------------- | --------- | ------------------------------ |
| **Acyclicity**          | 0.86      | ⚠️ Buono (cicli solo in jsdom) |
| **Depth**               | 1.0       | ✅ Ottimo                      |
| **Equality**            | 0.25      | 🚨 **GOD FILES** (Gini 0.745)  |
| **Redundancy**          | 0.89      | ⚠️ 11% dead code               |
| **Modularity**          | 1.0       | ✅ Eccellente                  |
| **Coverage discipline** | 1.0       | ✅                             |

> Il quality signal `7213/10000` è trainato verso il basso dalla **disuguaglianza estrema** (Gini 0.745) - pochi file concentrano la maggior parte della complessità.

---

## 🔴 CRITICAL - 6 problemi strutturali

### 1. Memory leak: event listener inline arrow functions mai rimossi

**Coinvolge:** `pix-color`, `pix-recorder`, `pix-command` (parziale)

Ogni componente che usa **inline arrow function** in `addEventListener` perde quei listener quando il componente viene rimosso dal DOM.

```js
// pix-color: righe 128, 158, 168 - MAI rimossi in disconnectedCallback
this.#colorInput.addEventListener('input', (e) => { ... });
this.#bar.addEventListener('click', (e) => { ... });
this.#bar.addEventListener('keydown', (e) => { ... });

// pix-recorder: righe 113–132 - IDEM
recordBtn.addEventListener('click', () => { ... });
pauseBtn.addEventListener('click', () => { ... });
stopBtn.addEventListener('click', () => { ... });
downloadBtn.addEventListener('click', () => this.#doDownload());
```

**Impatto:** In una SPA con routing, ogni mount/unmount accumula listener. I riferimenti chiusi (`this`, `#expanded`, `#state`) impediscono al GC di raccogliere il componente.

**Fix:** Usare private field pre-assigned:

```js
#onBarClick = (e) => { ... };

connectedCallback() {
  this.#bar.addEventListener('click', this.#onBarClick);
}

disconnectedCallback() {
  this.#bar.removeEventListener('click', this.#onBarClick);
}
```

---

### 2. `.bind()` senza referenza stabile - leak garantito

**Coinvolge:** `pix-toast`

```js
// pix-toast/src/components/PixToast/PixToast.js:90
this.addEventListener('click', this.#handleContainerClick.bind(this));
```

`disconnectedCallback` **non rimuove** questo listener, e non potrebbe perché `.bind(this)` crea una nuova funzione ogni volta. Ogni `connectedCallback` aggiunge un leak.

**Fix:**

```js
#onClick = (e) => {
  if (e.target.closest('[data-toast-dismiss]')) this.dismiss();
};
```

---

### 3. Pix-color: global listener con setTimeout race condition

**Coinvolge:** `pix-color`

```js
// pix-color/src/components/PixColor/PixColor.js:245
setTimeout(() => document.addEventListener('click', this.#onDocumentClick), 0);
```

1. Se il componente viene smontato durante quei 0ms, il listener viene registrato su un componente morto.
2. Se `#teardownPanel()` viene chiamata mentre un timeout è in sospeso, i listener vengono rimossi ma un nuovo `setTimeout` in una successiva `#renderPanel()` aggiunge nuovi listener.

**Fix:** Sostituire con event delegation sull'overlay:

```js
this.#overlay.addEventListener('click', (e) => {
  if (e.target === this.#overlay) this.expanded = false;
});
```

---

### 4. Pix-splitter modifica `document.body.dataset` - side effect globale

**Coinvolge:** `pix-splitter`

```js
document.body.dataset.splitterResizing = '';
document.body.dataset.splitterOrientation = this.orientation;
```

Due splitter sulla stessa pagina: un resize su uno lascia `data-splitter-orientation` sul body anche dopo che l'altro ha finito. Conflitto con librerie che usano dataset sul body.

**Fix:** Usare `this.style.cursor` sul componente:

```js
#handlePointerDown() { this.style.cursor = 'col-resize'; }
#handlePointerUp()   { this.style.cursor = ''; }
```

---

### 5. Pix-sortable: MutationObserver loop

**Coinvolge:** `pix-sortable`

Stesso pattern di pix-splitter: `#init()` setup un `MutationObserver` su `childList`, poi `#rebuild()` modifica i figli triggerando l'observer.

**Fix:** Usare `MutationObserver.takeRecords()` all'inizio di `#rebuild()`:

```js
#rebuild() {
  this.#observer?.disconnect();
  this.#observer?.takeRecords(); // svuota coda
  // ... rebuild ...
}
```

---

### 6. Pix-recorder: ciclo vita incompleto

**Coinvolge:** `pix-recorder`

- Se `disconnectedCallback` viene chiamato durante una registrazione, `#stopMedia()` ferma lo stream ma non chiama `mediaRecorder.stop()`, lasciando chunk in sospeso.
- Se l'utente nega il permesso microfono, nessun recovery possibile.

**Fix:**

```js
disconnectedCallback() {
  if (this.#mediaRecorder?.state !== 'inactive') {
    this.#mediaRecorder?.stop();
  }
  this.#stopMedia();
  // ...
}
```

---

## 🟡 MODERATE - 8 problemi

### 7. `light-dark()` senza fallback per browser vecchi

**Coinvolge:** **Tutti i componenti**

`light-dark()` è supportato da Chrome 119+, Safari 17.5+, Firefox 120+. Su browser più vecchi, l'intera dichiarazione CSS viene scartata - il componente diventa invisibile.

```css
--pix-command--fg: light-dark(oklch(0.18 0.012 60), oklch(0.88 0.01 85));
/* Su Safari 16: --pix-command--fg NON VIENE DEFINITO */
```

**Fix:**

```css
--pix-command--fg: oklch(0.18 0.012 60); /* fallback */
--pix-command--fg: light-dark(oklch(0.18 0.012 60), oklch(0.88 0.01 85));
```

---

### 8. `adoptedStyleSheets` ordering - conflitto potenziale

**Coinvolge:** **Tutti i componenti**

Ogni componente pusha il proprio CSS in `document.adoptedStyleSheets`. L'ultimo adottato vince in caso di specificità identica.

**Mitigazione:** I `@layer pix-galaxy { @layer pix-component { ... } }` isolano le regole. Ma se due componenti definiscono regole sullo stesso selettore, l'ordine conta.

---

### 9. Pix-recorder: microfono - nessun recovery

**Coinvolge:** `pix-recorder`

L'utente che nega il permesso vede "Microphone access denied" ma non può riprovare.

**Fix:** Dispatchare `recorder-error` + permettere un secondo tentativo.

---

### 10. Pix-command: lista risultati dinamici senza `aria-live`

**Coinvolge:** `pix-command`

Quando l'utente digita, i risultati vengono filtrati ma non c'è annuncio screen reader.

**WCAG SC 4.1.3 (Status Messages):** Violato. I cambiamenti di contenuto senza focus devono essere annunciati.

**Fix:** Aggiungere `aria-live="polite"` al footer.

---

### 11. Incoerenza `_property` vs `#property`

**Coinvolge:** **Tutti i componenti**

| Componente        | Pattern                   | Accessibile da subclass |
| ----------------- | ------------------------- | ----------------------- |
| Componenti vecchi | `this._onChange` (public) | ✅                      |
| Componenti nuovi  | `this.#items` (private)   | ❌                      |

**Raccomandazione:** `#private` per campi interni (timer, observer), `_protected` per metodi estendibili.

---

### 12. Pix-color: `<input type="color">` nativo bypassa UI

Il native input hidden apre il picker colore nativo del browser se cliccato direttamente, bypassando l'UI OKLCH/HSL/RGB.

**Fix:** `pointer-events: none` sul native input.

---

### 13. Pix-sortable: touch drag threshold

Il timeout di 150ms confligge con lo scroll su mobile.

**Fix:** Aggiungere threshold di spostamento > 10px per distinguere scroll da long-press.

---

### 14. `ElementInternals` non implementato

Pix-color e pix-sortable dichiarano form association ma non chiamano `attachInternals()`.

---

## 🟢 MINOR - 10 note

### 15. `innerHTML` - escape parziale

Pix-color non fa escapeHTML sui gradient backgrounds (riga 347-349). Rischio XSS teorico se un valore slider viene manipolato.

### 16. Pix-recorder: `format="wav"` non implementato

La codifica WAV richiede encoder PCM manuale assente.

### 17. Pix-color: gradient slider non aggiornato

Il gradiente OKLCH usa `hex` corrente ma non viene ricalcolato su `updateDisplay()`, solo su `switchFormat()`.

### 18. `performance.now()` precisione

`DOMHighResTimeStamp` perde risoluzione dopo ~104 giorni di uptime. Documentare per registrazioni lunghe.

### 19. Pix-sortable: `draggable: true` su contenuti interattivi

Link e pulsanti dentro item sortable non sono cliccabili. Rendere `data-sortable-handle` obbligatorio.

### 20. Pix-command: `isMetaOrCtrl()` - comportamento corretto

CMD+K su Mac, Ctrl+K su Windows. Volutamente inclusivo, nessuna ambiguità.

### 21. `@layer` ordering non documentato

Layer innestati `pix-galaxy > pix-component`. L'ultimo stylesheet adottato vince. Documentare il comportamento.

### 22. Pix-component-template: dipendenze mancanti

Mancano `@pix-galaxy/pix-core`, `@pix-galaxy/pix-color-scheme-selector`, `@pix-galaxy/pix-highlighter` nel package.json del template.

### 23. Zero test coverage sui nuovi componenti

| Componente                                                                              | Test |
| --------------------------------------------------------------------------------------- | ---- |
| `pix-accent-color-selector`                                                             | ✅ 3 |
| `pix-highlighter`                                                                       | ✅ 4 |
| `pix-command`, `pix-color`, `pix-recorder`, `pix-sortable`, `pix-splitter`, `pix-toast` | ❌ 0 |

### 24. Boilerplate SSR ridondante

`typeof document === 'undefined'` e `CSSStyleSheet` guards identiche in ogni componente. Centralizzare in `@pix-galaxy/pix-core/dom/ssr-safe.js`.

---

## Raccomandazioni architetturali chiave

### 1. Centralizzare cleanup event listener

```js
class PixElement extends HTMLElement {
  #cleanup = [];

  on(el, type, handler, opts) {
    el.addEventListener(type, handler, opts);
    this.#cleanup.push(() => el.removeEventListener(type, handler, opts));
  }

  disconnectedCallback() {
    for (const fn of this.#cleanup) fn();
    this.#cleanup.length = 0;
  }
}
```

### 2. Standardizzare `light-dark()` con fallback

```css
--pix-component-color: oklch(0.18 0.012 60);
--pix-component-color: light-dark(oklch(0.18 0.012 60), oklch(0.88 0.01 85));
```

### 3. Unificare `_` vs `#`

- `#private` per campi interni (timer, observer, riferimenti DOM)
- `_protected` per metodi estendibili da subclass

### 4. Test coverage minimo

1 test per componente che verifichi: registrazione custom element, render iniziale, evento change, cleanup disconnectedCallback.

### 5. Fixare pix-component-template package.json

Aggiungere dipendenze mancanti.

---

## Riepilogo per priorità

| Priorità    | Issue                               | Componente                         | Impatto |
| ----------- | ----------------------------------- | ---------------------------------- | ------- |
| 🔴 CRITICAL | Memory leak inline listeners        | pix-color, pix-recorder, pix-toast | Alto    |
| 🔴 CRITICAL | `.bind()` senza riferimento         | pix-toast                          | Alto    |
| 🔴 CRITICAL | Global listener race condition      | pix-color                          | Medio   |
| 🔴 CRITICAL | `document.body.dataset` side effect | pix-splitter                       | Medio   |
| 🔴 CRITICAL | MutationObserver loop risk          | pix-sortable                       | Medio   |
| 🔴 CRITICAL | disconnectedCallback incompleto     | pix-toast-stack, pix-recorder      | Alto    |
| 🟡 MODERATE | `light-dark()` senza fallback       | Tutti                              | Alto    |
| 🟡 MODERATE | `adoptedStyleSheets` ordering       | Tutti                              | Basso   |
| 🟡 MODERATE | Microfono recovery                  | pix-recorder                       | Medio   |
| 🟡 MODERATE | `aria-live` mancante                | pix-command                        | Medio   |
| 🟡 MODERATE | `_` vs `#` incoerenza               | Tutti                              | Basso   |
| 🟡 MODERATE | Native input bypass                 | pix-color                          | Basso   |
| 🟡 MODERATE | Touch drag threshold                | pix-sortable                       | Medio   |
| 🟡 MODERATE | ElementInternals non implementato   | pix-color, pix-sortable            | Basso   |
| 🟢 MINOR    | innerHTML escape                    | pix-color                          | Basso   |
| 🟢 MINOR    | WAV format non implementato         | pix-recorder                       | Basso   |
| 🟢 MINOR    | Gradient slider statico             | pix-color                          | Basso   |
| 🟢 MINOR    | Template shared dep mancante        | pix-component-template             | Alto    |
| 🟢 MINOR    | Zero test coverage                  | 5 componenti nuovi                 | Alto    |
| 🟢 MINOR    | SSR boilerplate duplicato           | Tutti                              | Basso   |
