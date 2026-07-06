/**
 * <pix-color-scheme-selector></pix-color-scheme-selector>
 *
 * Color-scheme selector Web Component for the pix-galaxy suite.
 * Manages light, dark, and system color scheme preferences.
 * Persists to localStorage, syncs with <meta name="color-scheme">,
 * and sets both data-color-scheme attribute and style.colorScheme on <html>.
 */
import componentCSS from './ColorSchemeSelector.css?raw';
import sunIconSVG from './icons/sun.svg?raw';
import moonIconSVG from './icons/moon.svg?raw';
import monitorIconSVG from './icons/monitor.svg?raw';

const STORAGE_KEY = 'pix-color-scheme';
const SCHEMES = ['light', 'dark', 'system'];
const ELEMENT_NAME = 'pix-color-scheme-selector';

const META_CONTENT = {
  light: 'light',
  dark: 'dark',
  system: 'light dark',
};

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

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

class PixColorSchemeSelector extends HTMLElement {
  static ensureComponentStyles() {
    return adoptComponentStyles();
  }

  static {
    this.ensureComponentStyles();
    if (!globalThis.customElements?.get(ELEMENT_NAME)) {
      globalThis.customElements.define(ELEMENT_NAME, this);
    }
  }

  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
    this.currentScheme = this.getInitialScheme();
  }

  connectedCallback() {
    this.constructor.ensureComponentStyles();
    this.render();
    this.attachEventListeners();
  }

  render() {
    const template = document.createElement('template');
    this.textContent = '';

    template.innerHTML = `
      <section
        data-color-scheme-selector
        aria-label="Color scheme selection"
        role="radiogroup"
      >
        <label data-scheme="light" aria-label="Light mode">
          <input type="radio" name="color-scheme" value="light" />
          ${sunIconSVG}
          <span data-visually-hidden>Light</span>
        </label>

        <label data-scheme="dark" aria-label="Dark mode">
          <input type="radio" name="color-scheme" value="dark" />
          ${moonIconSVG}
          <span data-visually-hidden>Dark</span>
        </label>

        <label data-scheme="system" aria-label="System preference">
          <input type="radio" name="color-scheme" value="system" />
          ${monitorIconSVG}
          <span data-visually-hidden>System</span>
        </label>
      </section>
    `;

    this.appendChild(template.content.cloneNode(true));
    this._inputs = Array.from(this.querySelectorAll('input[name="color-scheme"]'));
    this._options = Array.from(this.querySelectorAll('label'));
    this.applyScheme(this.currentScheme);
  }

  attachEventListeners() {
    this._inputs?.forEach((input) => {
      input.addEventListener('change', this._onChange);
    });
  }

  disconnectedCallback() {
    this._inputs?.forEach((input) => {
      input.removeEventListener('change', this._onChange);
    });
  }

  getOrCreateMeta() {
    const existing = document.querySelector('meta[name="color-scheme"]');
    if (existing) return existing;

    const meta = document.createElement('meta');
    meta.setAttribute('name', 'color-scheme');
    document.head.appendChild(meta);
    return meta;
  }

  getSavedScheme() {
    const saved = getStorage()?.getItem(STORAGE_KEY);
    return SCHEMES.includes(saved) ? saved : null;
  }

  getSchemeFromMeta() {
    const meta = document.querySelector('meta[name="color-scheme"]');
    const content = meta?.getAttribute('content') || '';

    if (content === 'light') return 'light';
    if (content === 'dark') return 'dark';
    return 'system';
  }

  getInitialScheme() {
    return this.getSavedScheme() || this.getSchemeFromMeta() || 'system';
  }

  updateOptionState() {
    const current = this.querySelector(`input[value="${this.currentScheme}"]`);
    if (current) {
      current.checked = true;
    }

    this._options?.forEach((option) => {
      const input = option.querySelector('input');
      option.toggleAttribute('data-active', input?.value === this.currentScheme);
    });
  }

  applyScheme(scheme) {
    const normalized = SCHEMES.includes(scheme) ? scheme : 'system';
    const meta = this.getOrCreateMeta();
    const root = document.documentElement;

    this.currentScheme = normalized;
    getStorage()?.setItem(STORAGE_KEY, normalized);
    meta.setAttribute('content', META_CONTENT[this.currentScheme]);

    if (this.currentScheme === 'system') {
      root.removeAttribute('data-color-scheme');
      root.style.colorScheme = 'light dark';
    } else {
      root.setAttribute('data-color-scheme', this.currentScheme);
      root.style.colorScheme = this.currentScheme;
    }

    this.updateOptionState();
  }

  _onChange(event) {
    const value = event.target.value;
    this.applyScheme(value);
  }
}

export { PixColorSchemeSelector, META_CONTENT, SCHEMES, STORAGE_KEY };

export default PixColorSchemeSelector;
