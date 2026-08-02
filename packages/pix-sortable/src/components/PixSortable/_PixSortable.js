/**
 * <pix-sortable></pix-sortable>
 *
 * Accessible sortable list with drag & drop, touch, keyboard, a11y.
 *
 * Children become sortable items. Use `data-sortable-handle` to limit
 * drag to a specific element within each item.
 * Use `data-sortable-value` on items to identify them.
 *
 * @fires sortable-change - { fromIndex, toIndex, items }
 */
import componentCSS from './_PixSortable.css?raw';

const ELEMENT_NAME = 'pix-sortable';
const SVG_GRIP =
  '<svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="4" r="1.2"/><circle cx="11" cy="4" r="1.2"/><circle cx="5" cy="8" r="1.2"/><circle cx="11" cy="8" r="1.2"/><circle cx="5" cy="12" r="1.2"/><circle cx="11" cy="12" r="1.2"/></svg>';

let componentStyleSheet = null;
function adoptComponentStyles() {
  if (
    typeof document === 'undefined' ||
    !('adoptedStyleSheets' in document) ||
    typeof CSSStyleSheet !== 'function'
  )
    return null;
  if (!componentStyleSheet) {
    componentStyleSheet = new CSSStyleSheet();
    componentStyleSheet.replaceSync(componentCSS);
  }
  if (!document.adoptedStyleSheets.includes(componentStyleSheet))
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, componentStyleSheet];
  return componentStyleSheet;
}

class PixSortable extends HTMLElement {
  static formAssociated = true;
  static ensureComponentStyles() {
    return adoptComponentStyles();
  }
  static {
    this.ensureComponentStyles();
    if (!globalThis.customElements?.get(ELEMENT_NAME))
      globalThis.customElements.define(ELEMENT_NAME, this);
  }

  /* ── State ────────────────────────────────────────────────────── */

  #items = [];
  #draggedIndex = -1;
  #dragOverIndex = -1;
  #keyboardMode = false;
  #touchDrag = null; // { element, clone, startY, startIndex }
  #observer = null;
  #listbox = null;

  /* ── Bound handlers ───────────────────────────────────────────── */

  #onDragStart = this.#handleDragStart.bind(this);
  #onDragOver = this.#handleDragOver.bind(this);
  #onDragEnd = this.#handleDragEnd.bind(this);
  #onDrop = this.#handleDrop.bind(this);
  #onTouchStart = this.#handleTouchStart.bind(this);
  #onTouchMove = this.#handleTouchMove.bind(this);
  #onTouchEnd = this.#handleTouchEnd.bind(this);
  #onKeyDown = this.#handleKeyDown.bind(this);
  #onClick = this.#handleClick.bind(this);

  #internals = null;

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
  }

  connectedCallback() {
    this.constructor.ensureComponentStyles();
    this.#init();
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = null;
    document.removeEventListener('keydown', this.#onKeyDown);
  }

  /* ── Init ─────────────────────────────────────────────────────── */

  #init() {
    // Live region: sibling of the listbox (aria-live cannot be a child of
    // role=listbox — axe flags aria-required-children otherwise).
    const announce = document.createElement('div');
    announce.setAttribute('data-part', 'announce');
    announce.setAttribute('role', 'status');
    announce.setAttribute('aria-live', 'polite');
    announce.setAttribute('aria-atomic', 'true');

    // Listbox wrapper holds only role=option items.
    const listbox = document.createElement('div');
    listbox.setAttribute('data-part', 'listbox');
    listbox.setAttribute('role', 'listbox');
    listbox.setAttribute('aria-label', 'Sortable list');

    // Move existing children (the user's items) into the listbox.
    while (this.firstChild) {
      listbox.appendChild(this.firstChild);
    }
    this.append(announce, listbox);
    this.#listbox = listbox;

    // Observe children
    this.#observer = new MutationObserver(() => this.#rebuild());
    this.#observer.observe(listbox, { childList: true });

    this.#rebuild();
    this.setAttribute('tabindex', '0');
    document.addEventListener('keydown', this.#onKeyDown);
  }

  #rebuild() {
    this.#observer?.disconnect();
    this.#observer?.takeRecords(); // svuota coda mutazioni pendenti
    this.#observer = null;

    const listbox = this.#listbox;
    if (!listbox) return;

    const announce = this.querySelector('[data-part="announce"]');

    // Setup children as sortable items (only within the listbox wrapper)
    const children = Array.from(listbox.children).filter((el) => !el.hasAttribute('data-part'));
    this.#items = [];

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      this.#setupItem(child, i);
      this.#items.push(child);
    }

    this.#observer?.observe(listbox, { childList: true });
  }

  #setupItem(el, index) {
    el.setAttribute('data-sortable-item', '');
    el.setAttribute('role', 'option');
    el.setAttribute('aria-posinset', String(index + 1));
    el.setAttribute(
      'aria-setsize',
      String(this.#items.length || this.#listbox?.children.length || 0)
    );
    el.setAttribute('tabindex', '-1');
    el.draggable = true;

    // Auto-add drag handle if not present
    if (!el.querySelector('[data-sortable-handle]')) {
      const handle = document.createElement('span');
      handle.setAttribute('data-sortable-handle', '');
      handle.innerHTML = SVG_GRIP;
      el.prepend(handle);
    }

    // Wrap content if needed
    const content = el.querySelector('[data-sortable-content]');
    if (!content) {
      const existingContent = document.createElement('span');
      existingContent.setAttribute('data-sortable-content', '');
      const children = Array.from(el.childNodes);
      // Move all child nodes EXCEPT [data-sortable-handle] and [data-sortable-content] into content
      const handleEl = el.querySelector('[data-sortable-handle]');
      const Node = globalThis.Node;
      for (const child of children) {
        if (
          child !== handleEl &&
          child.nodeType === (Node?.ELEMENT_NODE || 1) &&
          !child.hasAttribute('data-sortable-content')
        ) {
          existingContent.appendChild(child);
        }
      }
      el.appendChild(existingContent);
    }

    // NOTE: the MutationObserver is created once in #rebuild() after all
    // child mutations are applied. Never re-create it here — doing so would
    // stack observers per item and re-trigger #rebuild on the DOM writes
    // above (prepend/append), risking an infinite loop.

    // Events
    el.removeEventListener('dragstart', this.#onDragStart);
    el.removeEventListener('dragover', this.#onDragOver);
    el.removeEventListener('dragend', this.#onDragEnd);
    el.removeEventListener('drop', this.#onDrop);
    el.removeEventListener('touchstart', this.#onTouchStart);
    el.removeEventListener('touchmove', this.#onTouchMove);
    el.removeEventListener('touchend', this.#onTouchEnd);
    el.addEventListener('dragstart', this.#onDragStart);
    el.addEventListener('dragover', this.#onDragOver);
    el.addEventListener('dragend', this.#onDragEnd);
    el.addEventListener('drop', this.#onDrop);
    el.addEventListener('touchstart', this.#onTouchStart, { passive: true });
    el.addEventListener('touchmove', this.#onTouchMove, { passive: false });
    el.addEventListener('touchend', this.#onTouchEnd);
    el.addEventListener('click', this.#onClick);
  }

  /* ── HTML5 Drag & Drop ────────────────────────────────────────── */

  #handleDragStart(event) {
    const el = event.target.closest('[data-sortable-item]');
    if (!el) return;
    const handle = event.target.closest('[data-sortable-handle]');
    // If there IS a handle, only allow drag from it
    if (el.querySelector('[data-sortable-handle]') && !handle) {
      event.preventDefault();
      return;
    }
    this.#draggedIndex = this.#items.indexOf(el);
    if (this.#draggedIndex < 0) return;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(this.#draggedIndex));
    el.setAttribute('data-dragging', '');
    // Ensure dragover works
    el.parentElement?.addEventListener('dragover', this.#onDragOver);
  }

  #handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const el = event.target.closest('[data-sortable-item]');
    if (!el || this.#draggedIndex < 0) return;
    const overIndex = this.#items.indexOf(el);
    if (overIndex < 0 || overIndex === this.#draggedIndex) return;

    // Clean up previous
    if (this.#dragOverIndex >= 0 && this.#items[this.#dragOverIndex]) {
      this.#items[this.#dragOverIndex].removeAttribute('data-drag-over');
    }

    this.#dragOverIndex = overIndex;
    el.setAttribute('data-drag-over', '');
  }

  #handleDrop(event) {
    event.preventDefault();
    const el = event.target.closest('[data-sortable-item]');
    if (!el || this.#draggedIndex < 0) return;
    const toIndex = this.#items.indexOf(el);
    if (toIndex < 0 || toIndex === this.#draggedIndex) return;

    this.#moveItem(this.#draggedIndex, toIndex);
    this.#cleanDrag();
  }

  #handleDragEnd() {
    this.#cleanDrag();
  }

  #cleanDrag() {
    for (const item of this.#items) {
      item.removeAttribute('data-dragging');
      item.removeAttribute('data-drag-over');
    }
    this.#draggedIndex = -1;
    this.#dragOverIndex = -1;
  }

  /* ── Touch drag ───────────────────────────────────────────────── */

  #handleTouchStart(event) {
    const el = event.target.closest('[data-sortable-item]');
    if (!el) return;
    const handle = event.target.closest('[data-sortable-handle]');
    if (el.querySelector('[data-sortable-handle]') && !handle) return;

    const index = this.#items.indexOf(el);
    if (index < 0) return;

    // Use a long-press threshold (150ms) + movement threshold (10px)
    this.#touchDrag = {
      element: el,
      startX: event.touches[0].clientX,
      startY: event.touches[0].clientY,
      startIndex: index,
      active: false,
      timer: setTimeout(() => {
        if (!this.#touchDrag) return;
        this.#draggedIndex = index;
        el.setAttribute('data-dragging', '');
        this.#touchDrag.active = true;
      }, 150),
    };
  }

  #handleTouchMove(event) {
    if (!this.#touchDrag) return;

    // Movement threshold: se l'utente ha spostato il dito > 10px, è scroll, non drag
    const dx = Math.abs(event.touches[0].clientX - this.#touchDrag.startX);
    const dy = Math.abs(event.touches[0].clientY - this.#touchDrag.startY);
    if (!this.#touchDrag.active && (dx > 10 || dy > 10)) {
      clearTimeout(this.#touchDrag.timer);
      this.#touchDrag = null;
      return;
    }

    if (!this.#touchDrag.active) return;
    event.preventDefault();

    const touch = event.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return;
    const item = el.closest('[data-sortable-item]');
    if (!item || this.#draggedIndex < 0) return;
    const overIndex = this.#items.indexOf(item);
    if (overIndex < 0 || overIndex === this.#draggedIndex) return;

    if (this.#dragOverIndex >= 0 && this.#items[this.#dragOverIndex]) {
      this.#items[this.#dragOverIndex].removeAttribute('data-drag-over');
    }
    this.#dragOverIndex = overIndex;
    item.setAttribute('data-drag-over', '');
  }

  #handleTouchEnd() {
    if (!this.#touchDrag) return;
    clearTimeout(this.#touchDrag.timer);

    if (
      this.#touchDrag.active &&
      this.#dragOverIndex >= 0 &&
      this.#draggedIndex >= 0 &&
      this.#dragOverIndex !== this.#draggedIndex
    ) {
      this.#moveItem(this.#draggedIndex, this.#dragOverIndex);
    }

    this.#cleanDrag();
    this.#touchDrag = null;
  }

  /* ── Keyboard ─────────────────────────────────────────────────── */

  #handleKeyDown(event) {
    if (!this.contains(event.target) && event.target !== this) return;

    const active = this.querySelector('[data-sortable-item][tabindex="0"]') || this.#items[0];

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (event.altKey && active) {
          const idx = this.#items.indexOf(active);
          if (idx < this.#items.length - 1) this.#moveItem(idx, idx + 1);
        } else {
          this.#focusNext(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (event.altKey && active) {
          const idx = this.#items.indexOf(active);
          if (idx > 0) this.#moveItem(idx, idx - 1);
        } else {
          this.#focusNext(-1);
        }
        break;
      case 'Home':
        event.preventDefault();
        this.#focusIndex(0);
        break;
      case 'End':
        event.preventDefault();
        this.#focusIndex(this.#items.length - 1);
        break;
    }
  }

  #handleClick(event) {
    const item = event.target.closest('[data-sortable-item]');
    if (!item) return;

    // Focus the clicked item
    for (const el of this.#items) el.setAttribute('tabindex', '-1');
    item.setAttribute('tabindex', '0');
    item.focus();
    item.setAttribute('aria-selected', 'true');
    for (const el of this.#items) {
      if (el !== item) el.removeAttribute('aria-selected');
    }
  }

  #focusNext(dir) {
    const current = this.querySelector('[tabindex="0"]');
    const idx = current ? this.#items.indexOf(current) : -1;
    const next = idx < 0 ? 0 : Math.max(0, Math.min(this.#items.length - 1, idx + dir));
    this.#focusIndex(next);
  }

  #focusIndex(index) {
    if (index < 0 || index >= this.#items.length) return;
    for (const el of this.#items) {
      el.setAttribute('tabindex', '-1');
      el.removeAttribute('aria-selected');
    }
    const target = this.#items[index];
    target.setAttribute('tabindex', '0');
    target.setAttribute('aria-selected', 'true');
    target.focus();
  }

  /* ── Move ─────────────────────────────────────────────────────── */

  #moveItem(from, to) {
    if (from === to || from < 0 || to < 0 || from >= this.#items.length || to >= this.#items.length)
      return;

    const [moved] = this.#items.splice(from, 1);
    this.#items.splice(to, 0, moved);

    // Reorder DOM
    const announce = this.querySelector('[data-part="announce"]');
    if (to > from) {
      // Moving down: insert after target
      const target = this.#items[to];
      this.insertBefore(moved, target.nextSibling);
    } else {
      // Moving up: insert before target
      const target = this.#items[to];
      this.insertBefore(moved, target);
    }

    // Update indices
    for (let i = 0; i < this.#items.length; i++) {
      this.#items[i].setAttribute('aria-posinset', String(i + 1));
    }

    // Focus the moved item
    this.#focusIndex(to);

    // Announce
    const label = moved.textContent?.trim().slice(0, 50) || 'Item';
    if (announce) announce.textContent = `Moved "${label}" from position ${from + 1} to ${to + 1}`;

    if (this.#internals?.setFormValue) this.#internals.setFormValue(this.values.join(','));

    this.dispatchEvent(
      new CustomEvent('sortable-change', {
        detail: {
          fromIndex: from,
          toIndex: to,
          items: this.values,
        },
        bubbles: true,
      })
    );
  }

  /* ── Public API ────────────────────────────────────────────────── */

  get items() {
    return [...this.#items];
  }

  get values() {
    return this.#items.map(
      (el) => el.getAttribute('data-sortable-value') || el.textContent?.trim() || ''
    );
  }
}

export { PixSortable };
