/**
 * <pix-command></pix-command>
 *
 * Accessible command palette Web Component.
 *
 * ## Usage
 * ```html
 * <pix-command src="/api/commands.json"></pix-command>
 * ```
 *
 * Or with inline data:
 * ```html
 * <pix-command>
 *   <script type="application/json">[{"id":"x","label":"X"}]</script>
 * </pix-command>
 * ```
 *
 * Press CMD+K (Mac) / Ctrl+K (Win/Linux) to toggle.
 *
 * @fires command-selected - when a command is activated
 * @fires command-dismissed - when the palette is closed without selecting
 */
import componentCSS from './_PixCommand.css?raw';

const ELEMENT_NAME = 'pix-command';

/* ── Fuzzy match ────────────────────────────────────────────────── */

function fuzzyScore(query, text) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  let score = 0;
  let prevMatch = -2;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      if (ti === prevMatch + 1) score += 8;
      else if (ti > 0 && /[\s_-]/.test(t[ti - 1])) score += 6;
      else if (ti > 0 && /[a-z]/.test(t[ti - 1]) && /[A-Z]/.test(t[ti])) score += 5;
      else score += 4;
      if (ti === 0) score += 3;
      prevMatch = ti;
      qi++;
    }
  }

  return qi === q.length ? score : 0;
}

function matchLabel(query, item) {
  const text = [item.label, item.description || '', ...(item.keywords || [])].join(' ');
  return fuzzyScore(query, text);
}

/* ── Shortcut helpers ───────────────────────────────────────────── */

function parseShortcut(shortcut) {
  if (!shortcut) return [];
  const isMac = typeof navigator !== 'undefined' && /Mac|iP(hone|ad|od)/.test(navigator.platform);
  return shortcut.split('+').map((key) => {
    if (key === 'Mod') return isMac ? '⌘' : 'Ctrl';
    if (key === 'Shift') return isMac ? '⇧' : 'Shift';
    if (key === 'Alt') return isMac ? '⌥' : 'Alt';
    if (key === 'Meta') return isMac ? '⌘' : 'Win';
    return key;
  });
}

function isMetaOrCtrl(event) {
  return event.metaKey || event.ctrlKey;
}

/* ── Default icons ──────────────────────────────────────────────── */

const SEARCH_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>';
const NAV_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const APPEARANCE_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke-linecap="round"/></svg>';
const ACTION_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const CLOSE_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

const UNKNOWN_ICON = SEARCH_ICON;

function iconForCategory(category) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('nav') || cat.includes('goto') || cat.includes('page')) return NAV_ICON;
  if (
    cat.includes('appear') ||
    cat.includes('theme') ||
    cat.includes('color') ||
    cat.includes('display')
  )
    return APPEARANCE_ICON;
  if (cat.includes('action') || cat.includes('util') || cat.includes('tool')) return ACTION_ICON;
  return UNKNOWN_ICON;
}

/* ── Component styles ───────────────────────────────────────────── */

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

/* ── Component class ────────────────────────────────────────────── */

class PixCommand extends HTMLElement {
  static observedAttributes = ['open', 'src'];

  static ensureComponentStyles() {
    return adoptComponentStyles();
  }

  /** @type {Set<PixCommand>} - all live instances for global shortcut dispatch */
  static #instances = new Set();

  static #onGlobalKeyDown = (event) => {
    // CMD+K / Ctrl+K
    if (isMetaOrCtrl(event) && event.key === 'k') {
      event.preventDefault();
      // Toggle the first (or last-interacted) instance
      const instances = [...this.#instances];
      if (instances.length === 0) return;

      // Try to find the one nearest to the active element
      let target = instances[0];
      for (const inst of instances) {
        if (inst.contains(document.activeElement) || inst === document.activeElement) {
          target = inst;
          break;
        }
      }
      target.open = !target.open;
    }
  };

  static {
    this.ensureComponentStyles();
    if (!globalThis.customElements?.get(ELEMENT_NAME)) {
      globalThis.customElements.define(ELEMENT_NAME, this);
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this.#onGlobalKeyDown);
    }
  }

  /* ── Properties ────────────────────────────────────────────────── */

  #items = [];
  #filtered = [];
  #activeIndex = -1;
  #uid = 0;

  /* ── DOM refs set after first render ────────────────────────────── */

  #overlay = null;
  #panel = null;
  #input = null;
  #list = null;
  #empty = null;
  #footer = null;

  /* ── Bound handlers ────────────────────────────────────────────── */

  #onInput = this.#handleInput.bind(this);
  #onKeydown = this.#handleKeydown.bind(this);
  #onClick = this.#handleClick.bind(this);
  #onTransitionEnd = this.#handleTransitionEnd.bind(this);
  #onOverlayClick = this.#handleOverlayClick.bind(this);
  #onWindowKeyDown = this.#handleWindowKeyDown.bind(this);

  constructor() {
    super();
  }

  /* ── Lifecycle ─────────────────────────────────────────────────── */

  connectedCallback() {
    this.constructor.ensureComponentStyles();
    PixCommand.#instances.add(this);
    this.#loadItems();
  }

  disconnectedCallback() {
    PixCommand.#instances.delete(this);
    this.#teardown();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open') {
      const isOpen = newValue !== null;
      if (isOpen) {
        this.#open();
      } else {
        this.#close();
      }
    }

    if (name === 'src' && oldValue !== newValue) {
      this.#loadItems();
    }
  }

  /* ── Public API ────────────────────────────────────────────────── */

  get open() {
    return this.hasAttribute('open');
  }

  set open(value) {
    this.toggleAttribute('open', Boolean(value));
  }

  get items() {
    return this.#items;
  }

  set items(value) {
    this.#items = Array.isArray(value) ? value : [];
    if (this.open) {
      this.#renderResults();
    }
  }

  /* ── Data loading ──────────────────────────────────────────────── */

  async #loadItems() {
    const src = this.getAttribute('src');

    if (src) {
      try {
        const response = await fetch(src);
        const data = await response.json();
        this.#items = Array.isArray(data) ? data : [];
        if (this.open) this.#renderResults();
        return;
      } catch {
        this.#items = [];
        if (this.open) this.#renderResults();
        return;
      }
    }

    const inline = this.querySelector('script[type="application/json"]');
    if (inline) {
      try {
        const data = JSON.parse(inline.textContent);
        this.#items = Array.isArray(data) ? data : [];
      } catch {
        this.#items = [];
      }
      if (this.open) this.#renderResults();
      return;
    }

    this.#items = [];
    if (this.open) this.#renderResults();
  }

  /* ── Open/close ────────────────────────────────────────────────── */

  #open() {
    if (this.#overlay) {
      this.#overlay.setAttribute('data-open', '');
      // Remove inert on next frame after transition starts
      requestAnimationFrame(() => {
        this.#overlay?.removeAttribute('inert');
        this.#input?.focus();
      });
      return;
    }

    this.#render();
    requestAnimationFrame(() => {
      this.#overlay?.setAttribute('data-open', '');
      requestAnimationFrame(() => {
        this.#overlay?.removeAttribute('inert');
        this.#input?.focus();
      });
    });
  }

  #close() {
    if (this.#overlay) {
      this.#overlay.removeAttribute('data-open');
      this.#overlay.setAttribute('inert', '');
    }

    if (this.#input) {
      this.#input.value = '';
    }

    this.#activeIndex = -1;
    this.#filtered = [];

    this.dispatchEvent(new CustomEvent('command-dismissed', { bubbles: true }));
  }

  /* ── Render ────────────────────────────────────────────────────── */

  #render() {
    if (this.#overlay) return;

    const uid = (this.#uid = (this.#uid + 1).toString(36));

    this.#overlay = document.createElement('div');
    this.#overlay.dataset.commandOverlay = '';
    this.#overlay.setAttribute('role', 'presentation');
    this.#overlay.setAttribute('inert', '');

    this.#panel = document.createElement('div');
    this.#panel.dataset.commandPanel = '';

    // Input wrapper with search icon
    const inputWrapper = document.createElement('div');
    inputWrapper.style.cssText =
      'display:flex;align-items:center;gap:0.5rem;padding:0 1rem;border-bottom:1px solid var(--pix-command--border, inherit);';

    const searchIcon = document.createElement('span');
    searchIcon.dataset.commandSearchIcon = '';
    searchIcon.innerHTML = SEARCH_ICON;
    searchIcon.style.cssText =
      'flex-shrink:0;width:1.25rem;height:1.25rem;display:flex;color:var(--pix-command--muted, inherit);opacity:0.5;';
    inputWrapper.append(searchIcon);

    this.#input = document.createElement('input');
    this.#input.dataset.commandInput = '';
    this.#input.type = 'text';
    this.#input.placeholder = 'Search commands…';
    this.#input.setAttribute('role', 'combobox');
    this.#input.setAttribute('aria-autocomplete', 'list');
    this.#input.setAttribute('aria-controls', `pix-cmd-list-${uid}`);
    this.#input.setAttribute('aria-expanded', 'true');
    this.#input.autocomplete = 'off';
    this.#input.spellcheck = false;
    this.#input.style.cssText =
      'flex:1;border:0;background:transparent;font:inherit;font-size:1rem;padding:0.875rem 0;color:inherit;';
    inputWrapper.append(this.#input);

    this.#list = document.createElement('ul');
    this.#list.dataset.commandList = '';
    this.#list.id = `pix-cmd-list-${uid}`;
    this.#list.setAttribute('role', 'listbox');
    this.#list.setAttribute('aria-label', 'Commands');

    this.#empty = document.createElement('div');
    this.#empty.dataset.commandEmpty = '';
    this.#empty.innerHTML = '<span style="opacity:0.6;">No matching commands</span>';

    this.#footer = document.createElement('div');
    this.#footer.dataset.commandFooter = '';
    this.#footer.setAttribute('role', 'status');
    this.#footer.setAttribute('aria-live', 'polite');
    this.#footer.setAttribute('aria-atomic', 'true');
    this.#footer.innerHTML = `
      <span><kbd>↑↓</kbd> navigate · <kbd>↵</kbd> select</span>
      <span><kbd>esc</kbd> close</span>
    `;

    this.#panel.append(inputWrapper, this.#list, this.#empty, this.#footer);
    this.#overlay.append(this.#panel);
    document.body.appendChild(this.#overlay);

    this.#renderResults();
    this.#bind();
  }

  #teardown() {
    this.#unbind();
    this.#overlay?.remove();
    this.#overlay = null;
    this.#panel = null;
    this.#input = null;
    this.#list = null;
    this.#empty = null;
    this.#footer = null;
  }

  /* ── Results rendering ─────────────────────────────────────────── */

  #renderResults() {
    if (!this.#list || !this.#empty) return;

    const query = (this.#input?.value || '').trim();

    if (!query) {
      this.#filtered = [...this.#items];
    } else {
      const scored = this.#items
        .map((item) => ({ item, score: matchLabel(query, item) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);
      this.#filtered = scored.map((entry) => entry.item);
    }

    // Group by category
    const groups = new Map();
    for (const item of this.#filtered) {
      const cat = item.category || 'General';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat).push(item);
    }

    let html = '';
    let itemIndex = 0;

    for (const [category, items] of groups) {
      html += `<li data-command-group-label role="presentation">${escapeHtml(category)}</li>`;
      for (const item of items) {
        const keys = parseShortcut(item.shortcut);
        html += `
          <li
            role="option"
            id="pix-cmd-item-${this.#uid}-${itemIndex}"
            data-command-item
            data-command-index="${itemIndex}"
            aria-selected="false"
          >
            <span data-command-item-icon>${item.icon || iconForCategory(item.category)}</span>
            <span data-command-item-body>
              <span data-command-item-label>${highlight(query, escapeHtml(item.label))}</span>
              ${item.description ? `<span data-command-item-desc>${escapeHtml(item.description)}</span>` : ''}
            </span>
            ${keys.length ? `<span data-command-shortcut>${keys.map((k) => `<kbd>${escapeHtml(k)}</kbd>`).join('')}</span>` : ''}
          </li>
        `;
        itemIndex++;
      }
    }

    if (this.#filtered.length === 0) {
      this.#empty.setAttribute('data-visible', '');
      this.#list.innerHTML = '';
      this.#input?.setAttribute('aria-activedescendant', '');
    } else {
      this.#empty.removeAttribute('data-visible');
      this.#list.innerHTML = html;
      this.#activeIndex = -1;
      this.#updateActiveDescendant();
    }

    if (this.#footer) {
      const total = this.#filtered.length;
      this.#footer.innerHTML = `
        <span>${total} command${total !== 1 ? 's' : ''}</span>
        <span><kbd>esc</kbd> close</span>
      `;
    }
  }

  /* ── Events ────────────────────────────────────────────────────── */

  #bind() {
    this.#input?.addEventListener('input', this.#onInput);
    this.#panel?.addEventListener('keydown', this.#onKeydown);
    this.#panel?.addEventListener('click', this.#onClick);
    this.#overlay?.addEventListener('transitionend', this.#onTransitionEnd);
    this.#overlay?.addEventListener('click', this.#onOverlayClick);
    // Also intercept Escape when overlay is open (catches keydown anywhere in panel)
  }

  #unbind() {
    this.#input?.removeEventListener('input', this.#onInput);
    this.#panel?.removeEventListener('keydown', this.#onKeydown);
    this.#panel?.removeEventListener('click', this.#onClick);
    this.#overlay?.removeEventListener('transitionend', this.#onTransitionEnd);
    this.#overlay?.removeEventListener('click', this.#onOverlayClick);
  }

  #handleInput() {
    this.#renderResults();
    // Reset active index on new search
    this.#activeIndex = -1;
    this.#updateActiveDescendant();
  }

  #handleWindowKeyDown(event) {
    if (event.key === 'Escape' && this.open) {
      this.open = false;
    }
  }

  #handleKeydown(event) {
    const items = this.#list?.querySelectorAll('[data-command-item]') || [];
    if (items.length === 0) {
      if (event.key === 'Escape') {
        this.open = false;
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        this.#activeIndex = this.#activeIndex < items.length - 1 ? this.#activeIndex + 1 : 0;
        this.#updateActiveDescendant(items);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        this.#activeIndex = this.#activeIndex > 0 ? this.#activeIndex - 1 : items.length - 1;
        this.#updateActiveDescendant(items);
        break;
      }
      case 'Home': {
        event.preventDefault();
        this.#activeIndex = 0;
        this.#updateActiveDescendant(items);
        break;
      }
      case 'End': {
        event.preventDefault();
        this.#activeIndex = items.length - 1;
        this.#updateActiveDescendant(items);
        break;
      }
      case 'Enter': {
        event.preventDefault();
        if (this.#activeIndex >= 0 && this.#activeIndex < items.length) {
          const index = parseInt(items[this.#activeIndex].dataset.commandIndex, 10);
          if (index >= 0 && index < this.#filtered.length) {
            this.#select(this.#filtered[index]);
          }
        }
        break;
      }
      case 'Escape': {
        event.preventDefault();
        this.open = false;
        break;
      }
      default: {
        // If a printable key is pressed and input isn't focused, focus it
        if (
          event.key.length === 1 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey &&
          document.activeElement !== this.#input
        ) {
          this.#input?.focus();
        }
      }
    }
  }

  #handleClick(event) {
    const item = event.target.closest('[data-command-item]');
    if (!item) return;

    const index = parseInt(item.dataset.commandIndex, 10);
    if (index >= 0 && index < this.#filtered.length) {
      this.#activeIndex = index;
      this.#select(this.#filtered[index]);
    }
  }

  #handleOverlayClick(event) {
    if (event.target === this.#overlay) {
      this.open = false;
    }
  }

  #handleTransitionEnd(event) {
    if (event.propertyName === 'opacity' && !this.#overlay?.hasAttribute('data-open')) {
      this.#teardown();
    }
  }

  #updateActiveDescendant(items) {
    if (!items) {
      items = this.#list?.querySelectorAll('[data-command-item]') || [];
    }

    for (const el of items) {
      el.setAttribute('aria-selected', 'false');
    }

    if (this.#activeIndex >= 0 && this.#activeIndex < items.length) {
      const active = items[this.#activeIndex];
      active.setAttribute('aria-selected', 'true');
      active.scrollIntoView({ block: 'nearest' });
      this.#input?.setAttribute('aria-activedescendant', active.id);
    } else {
      this.#input?.setAttribute('aria-activedescendant', '');
    }
  }

  #select(item) {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('command-selected', {
        detail: { ...item },
        bubbles: true,
      })
    );
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function highlight(query, text) {
  if (!query) return text;
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lower = text.toLowerCase();
  const qLower = q.toLowerCase();
  let result = '';
  let qi = 0;
  for (let i = 0; i < text.length; i++) {
    if (qi < qLower.length && lower[i] === qLower[qi]) {
      result += `<mark>${text[i]}</mark>`;
      qi++;
    } else {
      result += text[i];
    }
  }
  return result;
}

export { PixCommand, fuzzyScore };
