# Pix-Galaxy — Architectural Review

> **Author:** Senior UI Architect review  
> **Date:** 2026-07-05  
> **Scope:** All `packages/*/src/` components (excludes `node_modules`)

---

## Quality Signal: 7213/10000

| Dimension               | Score  | Status                           |
| ----------------------- | ------ | -------------------------------- |
| **Acyclicity**          | 0.86   | ⚠️ Good (cycles only in jsdom)  |
| **Depth**               | 1.0    | ✅ Excellent                     |
| **Equality**            | 0.25   | 🚨 **GOD FILES** (Gini 0.745)   |
| **Redundancy**          | 0.89   | ⚠️ 11% dead code                |
| **Modularity**          | 1.0    | ✅ Excellent                     |
| **Coverage discipline** | 1.0    | ✅                               |

> The quality signal `7213/10000` is dragged down by **extreme inequality** (Gini 0.745) — a few files concentrate most of the complexity.

---

## 🔴 CRITICAL — 6 structural issues

### 1. Memory leak: event listener inline arrow functions never removed

**Affects:** `pix-color`, `pix-recorder`, `pix-command` (partial)

Every component that uses **inline arrow functions** in `addEventListener` leaks those listeners when the component is removed from the DOM.

```js
// pix-color: lines 128, 158, 168 — NEVER removed in disconnectedCallback
this.#colorInput.addEventListener('input', (e) => { ... });
this.#bar.addEventListener('click', (e) => { ... });
this.#bar.addEventListener('keydown', (e) => { ... });

// pix-recorder: lines 113–132 — SAME
recordBtn.addEventListener('click', () => { ... });
pauseBtn.addEventListener('click', () => { ... });
stopBtn.addEventListener('click', () => { ... });
downloadBtn.addEventListener('click', () => this.#doDownload());
```

**Impact:** In a SPA with routing, each mount/unmount accumulates listeners. Closed-over references (`this`, `#expanded`, `#state`) prevent the GC from collecting the component.

**Fix:** Use pre-assigned private fields:

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

### 2. `.bind()` without stable reference — guaranteed leak

**Affects:** `pix-toast`

```js
// pix-toast/src/components/PixToast/PixToast.js:90
this.addEventListener('click', this.#handleContainerClick.bind(this));
```

`disconnectedCallback` **does not remove** this listener, and it can't because `.bind(this)` creates a new function each time. Every `connectedCallback` adds a leak.

**Fix:**

```js
#onClick = (e) => {
  if (e.target.closest('[data-toast-dismiss]')) this.dismiss();
};
```

---

### 3. Pix-color: global listener with setTimeout race condition

**Affects:** `pix-color`

```js
// pix-color/src/components/PixColor/PixColor.js:245
setTimeout(() => document.addEventListener('click', this.#onDocumentClick), 0);
```

1. If the component is unmounted during those 0ms, the listener is registered on a dead component.
2. If `#teardownPanel()` is called while a timeout is pending, listeners are removed but a new `setTimeout` in a subsequent `#renderPanel()` adds new listeners.

**Fix:** Replace with event delegation on the overlay:

```js
this.#overlay.addEventListener('click', (e) => {
  if (e.target === this.#overlay) this.expanded = false;
});
```

---

### 4. Pix-splitter modifies `document.body.dataset` — global side effect

**Affects:** `pix-splitter`

```js
document.body.dataset.splitterResizing = '';
document.body.dataset.splitterOrientation = this.orientation;
```

Two splitters on the same page: a resize on one leaves `data-splitter-orientation` on the body even after the other finishes. Conflict with libraries that use body dataset.

**Fix:** Use `this.style.cursor` on the component:

```js
#handlePointerDown() { this.style.cursor = 'col-resize'; }
#handlePointerUp()   { this.style.cursor = ''; }
```

---

### 5. Pix-sortable: MutationObserver loop

**Affects:** `pix-sortable`

Same pattern as pix-splitter: `#init()` sets up a `MutationObserver` on `childList`, then `#rebuild()` modifies children triggering the observer.

**Fix:** Use `MutationObserver.takeRecords()` at the start of `#rebuild()`:

```js
#rebuild() {
  this.#observer?.disconnect();
  this.#observer?.takeRecords(); // drain queue
  // ... rebuild ...
}
```

---

### 6. Pix-recorder: incomplete lifecycle

**Affects:** `pix-recorder`

- If `disconnectedCallback` is called during a recording, `#stopMedia()` stops the stream but does not call `mediaRecorder.stop()`, leaving pending chunks.
- If the user denies microphone permission, no recovery is possible.

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

## 🟡 MODERATE — 8 issues

### 7. `light-dark()` without fallback for older browsers

**Affects:** **All components**

`light-dark()` is supported by Chrome 119+, Safari 17.5+, Firefox 120+. On older browsers, the entire CSS declaration is discarded — the component becomes invisible.

```css
--pix-command--fg: light-dark(oklch(0.18 0.012 60), oklch(0.88 0.01 85));
/* On Safari 16: --pix-command--fg IS NOT DEFINED */
```

**Fix:**

```css
--pix-command--fg: oklch(0.18 0.012 60); /* fallback */
--pix-command--fg: light-dark(oklch(0.18 0.012 60), oklch(0.88 0.01 85));
```

---

### 8. `adoptedStyleSheets` ordering — potential conflict

**Affects:** **All components**

Each component pushes its own CSS into `document.adoptedStyleSheets`. The last one adopted wins in case of identical specificity.

**Mitigation:** `@layer pix-galaxy { @layer pix-component { ... } }` isolates the rules. But if two components define rules on the same selector, order matters.

---

### 9. Pix-recorder: microphone — no recovery

**Affects:** `pix-recorder`

The user who denies permission sees "Microphone access denied" but cannot retry.

**Fix:** Dispatch `recorder-error` + allow a second attempt.

---

### 10. Pix-command: dynamic result list without `aria-live`

**Affects:** `pix-command`

When the user types, results are filtered but there is no screen reader announcement.

**WCAG SC 4.1.3 (Status Messages):** Violated. Content changes without focus must be announced.

**Fix:** Add `aria-live="polite"` to the footer.

---

### 11. `_property` vs `#property` inconsistency

**Affects:** **All components**

| Component       | Pattern                   | Subclass-accessible |
| --------------- | ------------------------- | ------------------- |
| Older components | `this._onChange` (public) | ✅                  |
| Newer components | `this.#items` (private)   | ❌                  |

**Recommendation:** `#private` for internal fields (timers, observers), `_protected` for extensible methods.

---

### 12. Pix-color: native `<input type="color">` bypasses UI

The hidden native input opens the browser's native color picker when clicked directly, bypassing the OKLCH/HSL/RGB UI.

**Fix:** `pointer-events: none` on the native input.

---

### 13. Pix-sortable: touch drag threshold

The 150ms timeout conflicts with mobile scrolling.

**Fix:** Add a movement threshold > 10px to distinguish scroll from long-press.

---

### 14. `ElementInternals` not implemented

Pix-color and pix-sortable declare form association but do not call `attachInternals()`.

---

## 🟢 MINOR — 10 notes

### 15. `innerHTML` — partial escaping

Pix-color does not escapeHTML on gradient backgrounds (line 347-349). Theoretical XSS risk if a slider value is manipulated.

### 16. Pix-recorder: `format="wav"` not implemented

WAV encoding requires a manual PCM encoder which is absent.

### 17. Pix-color: gradient slider not updated

The OKLCH gradient uses `hex` but is not recalculated on `updateDisplay()`, only on `switchFormat()`.

### 18. `performance.now()` precision

`DOMHighResTimeStamp` loses resolution after ~104 days of uptime. Document for long recordings.

### 19. Pix-sortable: `draggable: true` on interactive content

Links and buttons inside sortable items are not clickable. Make `data-sortable-handle` mandatory.

### 20. Pix-command: `isMetaOrCtrl()` — correct behavior

CMD+K on Mac, Ctrl+K on Windows. Deliberately inclusive, no ambiguity.

### 21. `@layer` ordering not documented

Nested layers `pix-galaxy > pix-component`. The last adopted stylesheet wins. Document the behavior.

### 22. Pix-component-template: missing dependencies

Missing `@pix-galaxy/pix-core`, `@pix-galaxy/pix-color-scheme-selector`, `@pix-galaxy/pix-highlighter` in the template's package.json.

### 23. Zero test coverage on newer components

| Component                                                                              | Tests |
| -------------------------------------------------------------------------------------- | ----- |
| `pix-accent-color-selector`                                                            | ✅ 3  |
| `pix-highlighter`                                                                      | ✅ 4  |
| `pix-command`, `pix-color`, `pix-recorder`, `pix-sortable`, `pix-splitter`, `pix-toast` | ❌ 0  |

### 24. Redundant SSR boilerplate

`typeof document === 'undefined'` and `CSSStyleSheet` guards are identical in every component. Centralize in `@pix-galaxy/pix-core/dom/ssr-safe.js`.

---

## Key architectural recommendations

### 1. Centralize event listener cleanup

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

### 2. Standardize `light-dark()` with fallback

```css
--pix-component-color: oklch(0.18 0.012 60);
--pix-component-color: light-dark(oklch(0.18 0.012 60), oklch(0.88 0.01 85));
```

### 3. Unify `_` vs `#`

- `#private` for internal fields (timers, observers, DOM references)
- `_protected` for methods extensible by subclasses

### 4. Minimum test coverage

1 test per component verifying: custom element registration, initial render, change event, disconnectedCallback cleanup.

### 5. Fix pix-component-template package.json

Add missing dependencies.

---

## Priority summary

| Priority    | Issue                               | Component                          | Impact |
| ----------- | ----------------------------------- | ---------------------------------- | ------ |
| 🔴 CRITICAL | Memory leak inline listeners        | pix-color, pix-recorder, pix-toast | High   |
| 🔴 CRITICAL | `.bind()` without reference         | pix-toast                          | High   |
| 🔴 CRITICAL | Global listener race condition      | pix-color                          | Medium |
| 🔴 CRITICAL | `document.body.dataset` side effect | pix-splitter                       | Medium |
| 🔴 CRITICAL | MutationObserver loop risk          | pix-sortable                       | Medium |
| 🔴 CRITICAL | Incomplete disconnectedCallback     | pix-toast-stack, pix-recorder      | High   |
| 🟡 MODERATE | `light-dark()` without fallback     | All                                | High   |
| 🟡 MODERATE | `adoptedStyleSheets` ordering       | All                                | Low    |
| 🟡 MODERATE | Microphone recovery                 | pix-recorder                       | Medium |
| 🟡 MODERATE | Missing `aria-live`                 | pix-command                        | Medium |
| 🟡 MODERATE | `_` vs `#` inconsistency            | All                                | Low    |
| 🟡 MODERATE | Native input bypass                 | pix-color                          | Low    |
| 🟡 MODERATE | Touch drag threshold                | pix-sortable                       | Medium |
| 🟡 MODERATE | ElementInternals not implemented    | pix-color, pix-sortable            | Low    |
| 🟢 MINOR    | innerHTML escape                    | pix-color                          | Low    |
| 🟢 MINOR    | WAV format not implemented          | pix-recorder                       | Low    |
| 🟢 MINOR    | Static gradient slider              | pix-color                          | Low    |
| 🟢 MINOR    | Template missing shared deps        | pix-component-template             | High   |
| 🟢 MINOR    | Zero test coverage                  | 5 newer components                 | High   |
| 🟢 MINOR    | Duplicate SSR boilerplate           | All                                | Low    |
