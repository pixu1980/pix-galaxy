/**
 * <pix-splitter></pix-splitter>
 *
 * Accessible resizable panel splitter using CSS Grid with handles
 * between each pair of adjacent panels. Drag the handle or use
 * arrow keys to resize.
 *
 * ## Usage
 * ```html
 * <pix-splitter orientation="horizontal">
 *   <div>Left panel</div>
 *   <div>Right panel</div>
 * </pix-splitter>
 * ```
 *
 * @fires splitter-resize - while dragging
 * @fires splitter-resize-end - when drag ends
 */
import componentCSS from './PixSplitter.css?raw';

const ELEMENT_NAME = 'pix-splitter';
const HANDLE_SIZE = 8; // px - must match --pix-splitter--handle-size in CSS
const KEYBOARD_STEP = 10; // px
const KEYBOARD_FINE_STEP = 1; // px
const MIN_PANEL_SIZE = 100; // px - default min

let componentStyleSheet = null;

function adoptComponentStyles() {
  if (
    typeof document === 'undefined' ||
    !('adoptedStyleSheets' in document) ||
    typeof globalThis.CSSStyleSheet !== 'function' ||
    typeof globalThis.CSSStyleSheet.prototype.replaceSync !== 'function'
  ) {
    return null;
  }

  if (!componentStyleSheet) {
    componentStyleSheet = new CSSStyleSheet();
    componentStyleSheet.replaceSync(componentCSS);
  }

  if (!document.adoptedStyleSheets.includes(componentStyleSheet)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, componentStyleSheet];
  }

  return componentStyleSheet;
}

class PixSplitter extends HTMLElement {
  static observedAttributes = ['orientation', 'min-panel-size'];

  static ensureComponentStyles() {
    return adoptComponentStyles();
  }

  static {
    this.ensureComponentStyles();
    if (!globalThis.customElements?.get(ELEMENT_NAME)) {
      globalThis.customElements.define(ELEMENT_NAME, this);
    }
  }

  /* ── State ─────────────────────────────────────────────────────── */

  #panels = [];
  #handles = [];
  #ratios = [];
  #activeIndex = -1;
  #startPointer = 0;
  #startRatios = [];
  #observer = null;

  /* ── Bound handlers ────────────────────────────────────────────── */

  #onPointerDown = this.#handlePointerDown.bind(this);
  #onPointerMove = this.#handlePointerMove.bind(this);
  #onPointerUp = this.#handlePointerUp.bind(this);
  #onKeyDown = this.#handleKeyDown.bind(this);
  #onSlotChange = this.#handleSlotChange.bind(this);

  constructor() {
    super();
  }

  connectedCallback() {
    this.constructor.ensureComponentStyles();
    this.#init();
  }

  disconnectedCallback() {
    this.#teardown();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'orientation') {
      const orientation = newValue === 'vertical' ? 'vertical' : 'horizontal';
      this.dataset.orientation = orientation;
      this.dataset.resizing = this.#activeIndex >= 0 ? 'true' : '';
      this.#updateGrid();
    }

    if (name === 'min-panel-size') {
      this.#updateGrid();
    }
  }

  /* ── Public API ────────────────────────────────────────────────── */

  get orientation() {
    return this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
  }

  set orientation(value) {
    this.setAttribute('orientation', value);
  }

  get ratios() {
    return [...this.#ratios];
  }

  /* ── Init & teardown ───────────────────────────────────────────── */

  #init() {
    const orientation = this.orientation;
    this.dataset.orientation = orientation;

    // Observe children changes
    this.#observer = new MutationObserver(() => {
      this.#rebuild();
    });
    this.#observer.observe(this, { childList: true });

    this.#rebuild();
  }

  #teardown() {
    this.#observer?.disconnect();
    this.#observer = null;
    this.#removePointerListeners();
    this.#handles.forEach((handle) => {
      handle.removeEventListener('keydown', this.#onKeyDown);
    });
    this.#panels = [];
    this.#handles = [];
    this.dataset.resizing = '';
  }

  #rebuild() {
    // Disconnect observer to prevent infinite loop on replaceChildren
    this.#observer?.disconnect();

    // Remove old handles
    this.#handles.forEach((h) => h.remove());
    this.#panels = [];
    this.#handles = [];
    this.#removePointerListeners();

    const children = Array.from(this.children);
    if (children.length < 2) {
      this.#updateGrid();
      return;
    }

    // Insert handles between children
    const DocumentFragment = globalThis.DocumentFragment || window.DocumentFragment;
    const fragment = new DocumentFragment();
    const newPanels = [];
    const newHandles = [];

    for (let i = 0; i < children.length; i++) {
      const panel = children[i];
      panel.dataset.splitterPanel = '';
      newPanels.push(panel);

      if (i < children.length - 1) {
        const handle = document.createElement('div');
        handle.dataset.splitterHandle = '';
        handle.tabIndex = 0;
        handle.setAttribute('role', 'separator');
        handle.setAttribute('aria-valuenow', '50');
        handle.setAttribute('aria-valuemin', '0');
        handle.setAttribute('aria-valuemax', '100');
        handle.setAttribute('aria-label', `Resize panel ${i + 1}`);
        newHandles.push(handle);
      }
    }

    // Append handles after their respective panels (maintain correct DOM order)
    // We need to reorder: panel0, handle0, panel1, handle1, panel2...
    const ordered = [];
    for (let i = 0; i < newPanels.length; i++) {
      ordered.push(newPanels[i]);
      if (i < newHandles.length) {
        ordered.push(newHandles[i]);
      }
    }

    this.replaceChildren(...ordered);

    this.#panels = newPanels;
    this.#handles = newHandles;

    // Re-observe children changes
    this.#observer?.observe(this, { childList: true });

    // Initialize ratios (equal distribution)
    this.#ratios = new Array(this.#panels.length).fill(0);
    this.#resetRatios();

    // Bind handles
    this.#handles.forEach((handle, i) => {
      handle.addEventListener('pointerdown', this.#onPointerDown);
      handle.addEventListener('keydown', this.#onKeyDown);
    });

    this.#updateGrid();
  }

  #resetRatios() {
    const count = this.#panels.length;
    for (let i = 0; i < count; i++) {
      this.#ratios[i] = 1 / count;
    }
    this.#updateGrid();
  }

  /* ── Grid update ───────────────────────────────────────────────── */

  #getMinPanelSize() {
    const val = parseInt(this.getAttribute('min-panel-size'), 10);
    return val > 0 ? val : MIN_PANEL_SIZE;
  }

  #updateGrid() {
    if (this.#panels.length === 0) {
      this.style.removeProperty('--pix-splitter--ratios');
      return;
    }

    const isHorizontal = this.orientation === 'horizontal';
    const totalHandles = this.#handles.length;
    const containerSize = isHorizontal ? this.clientWidth : this.clientHeight;
    const availableSize = containerSize - totalHandles * HANDLE_SIZE;
    const minPanelSize = this.#getMinPanelSize();

    // Clamp ratios so no panel is below min size
    const clamped = [...this.#ratios];
    if (availableSize > 0 && clamped.length > 1) {
      const minFrac = minPanelSize / availableSize;
      let sumClamped = 0;
      let adjusted = false;

      for (let i = 0; i < clamped.length; i++) {
        if (clamped[i] < minFrac && clamped.length > 1) {
          clamped[i] = minFrac;
          adjusted = true;
        }
        sumClamped += clamped[i];
      }

      if (adjusted && sumClamped > 0) {
        // Normalize back to 1
        for (let i = 0; i < clamped.length; i++) {
          clamped[i] /= sumClamped;
        }
      }
    }

    const frValues = clamped.map((r) => `${Math.max(r, 0.01)}fr`);
    const trackValues = [];

    for (let i = 0; i < frValues.length; i++) {
      trackValues.push(frValues[i]);
      if (i < totalHandles) {
        trackValues.push(`${HANDLE_SIZE}px`);
      }
    }

    this.style.setProperty('--pix-splitter--ratios', trackValues.join(' '));

    // Update aria-valuenow on handles
    for (let i = 0; i < this.#handles.length; i++) {
      const leftRatio = this.#ratios[i] || 0;
      const rightRatio = this.#ratios[i + 1] || 0;
      const total = leftRatio + rightRatio;
      const pct = total > 0 ? Math.round((leftRatio / total) * 100) : 50;
      this.#handles[i].setAttribute('aria-valuenow', String(pct));
    }
  }

  /* ── Pointer handling ──────────────────────────────────────────── */

  #handlePointerDown(event) {
    if (event.button !== 0) return;
    const handle = event.currentTarget;
    const index = this.#handles.indexOf(handle);
    if (index < 0) return;

    event.preventDefault();
    handle.setPointerCapture(event.pointerId);
    handle.setAttribute('data-active', '');

    this.#activeIndex = index;
    this.#startPointer = this.orientation === 'horizontal' ? event.clientX : event.clientY;
    this.#startRatios = [...this.#ratios];

    this.dataset.resizing = 'true';

    // Add global listeners for move/up so we don't lose the drag
    document.addEventListener('pointermove', this.#onPointerMove);
    document.addEventListener('pointerup', this.#onPointerUp);
  }

  #handlePointerMove(event) {
    if (this.#activeIndex < 0) return;

    const current = this.orientation === 'horizontal' ? event.clientX : event.clientY;
    const delta = current - this.#startPointer;

    const isHorizontal = this.orientation === 'horizontal';
    const containerSize = isHorizontal ? this.clientWidth : this.clientHeight;
    const availableSize = containerSize - this.#handles.length * HANDLE_SIZE;

    if (availableSize <= 0) return;

    const deltaRatio = delta / availableSize;
    const i = this.#activeIndex;

    const newRatios = [...this.#startRatios];
    const leftIdx = i;
    const rightIdx = i + 1;

    const leftNew = newRatios[leftIdx] + deltaRatio;
    const rightNew = newRatios[rightIdx] - deltaRatio;

    const minFrac = this.#getMinPanelSize() / availableSize;

    if (leftNew >= minFrac && rightNew >= minFrac) {
      newRatios[leftIdx] = leftNew;
      newRatios[rightIdx] = rightNew;
    } else if (leftNew < minFrac) {
      // Left panel at minimum - give remaining to right
      const diff = minFrac - leftNew;
      newRatios[leftIdx] = minFrac;
      newRatios[rightIdx] = rightNew - diff;
    } else {
      // Right panel at minimum - give remaining to left
      const diff = minFrac - rightNew;
      newRatios[rightIdx] = minFrac;
      newRatios[leftIdx] = leftNew - diff;
    }

    this.#ratios = newRatios;
    this.#updateGrid();

    this.dispatchEvent(
      new CustomEvent('splitter-resize', {
        detail: { ratios: [...this.#ratios], index: this.#activeIndex },
        bubbles: true,
      })
    );
  }

  #handlePointerUp() {
    if (this.#activeIndex < 0) return;

    this.#removePointerListeners();

    const handle = this.#handles[this.#activeIndex];
    if (handle) {
      handle.removeAttribute('data-active');
    }

    this.dataset.resizing = '';

    this.dispatchEvent(
      new CustomEvent('splitter-resize-end', {
        detail: { ratios: [...this.#ratios], index: this.#activeIndex },
        bubbles: true,
      })
    );

    this.#activeIndex = -1;
  }

  #removePointerListeners() {
    document.removeEventListener('pointermove', this.#onPointerMove);
    document.removeEventListener('pointerup', this.#onPointerUp);
  }

  /* ── Keyboard handling ─────────────────────────────────────────── */

  #handleKeyDown(event) {
    const handle = event.currentTarget;
    const index = this.#handles.indexOf(handle);
    if (index < 0) return;

    const isHorizontal = this.orientation === 'horizontal';
    const step = event.shiftKey ? KEYBOARD_FINE_STEP : KEYBOARD_STEP;
    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

    let delta = 0;

    switch (event.key) {
      case 'ArrowLeft':
        delta = isHorizontal ? (isRTL ? step : -step) : 0;
        break;
      case 'ArrowRight':
        delta = isHorizontal ? (isRTL ? -step : step) : 0;
        break;
      case 'ArrowUp':
        delta = isHorizontal ? 0 : -step;
        break;
      case 'ArrowDown':
        delta = isHorizontal ? 0 : step;
        break;
      case 'Home': {
        event.preventDefault();
        const newRatios = [...this.#ratios];
        newRatios[index] = 0.9;
        newRatios[index + 1] = 0.1;
        // Re-normalize surrounding panels
        this.#ratios = newRatios;
        this.#updateGrid();
        return;
      }
      case 'End': {
        event.preventDefault();
        const newRatios = [...this.#ratios];
        newRatios[index] = 0.1;
        newRatios[index + 1] = 0.9;
        this.#ratios = newRatios;
        this.#updateGrid();
        return;
      }
      default:
        return;
    }

    if (delta === 0) return;
    event.preventDefault();

    const containerSize = isHorizontal ? this.clientWidth : this.clientHeight;
    const availableSize = containerSize - this.#handles.length * HANDLE_SIZE;

    if (availableSize <= 0) return;

    const deltaRatio = delta / availableSize;
    const newRatios = [...this.#ratios];
    const leftIdx = index;
    const rightIdx = index + 1;

    const leftNew = newRatios[leftIdx] + deltaRatio;
    const rightNew = newRatios[rightIdx] - deltaRatio;
    const minFrac = this.#getMinPanelSize() / availableSize;

    if (leftNew >= minFrac && rightNew >= minFrac) {
      newRatios[leftIdx] = leftNew;
      newRatios[rightIdx] = rightNew;
      this.#ratios = newRatios;
      this.#updateGrid();
    }

    this.dispatchEvent(
      new CustomEvent('splitter-resize', {
        detail: { ratios: [...this.#ratios], index },
        bubbles: true,
      })
    );
  }

  /* ── Slot change (when children change outside our control) ────── */

  #handleSlotChange() {
    this.#rebuild();
  }
}

export { PixSplitter };
