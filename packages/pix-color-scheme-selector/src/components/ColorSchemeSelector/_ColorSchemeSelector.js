/**
 * <pix-color-scheme-selector></pix-color-scheme-selector>
 *
 * Light/dark color-scheme toggle Web Component for the pix-galaxy suite.
 * Renders as a single switch button that alternates between light and dark.
 * Defaults to the system preference when nothing is saved.
 * Persists to localStorage, syncs with <meta name="color-scheme">,
 * and sets both data-color-scheme attribute and style.colorScheme on <html>.
 */
import componentCSS from './_ColorSchemeSelector.css?raw';
import sunIconSVG from './icons/sun.svg?raw';
import moonIconSVG from './icons/moon.svg?raw';

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

function getSystemScheme() {
  const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
  return mq?.matches ? 'dark' : 'light';
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

const ComponentBase = globalThis.HTMLElement ?? class {};
class PixColorSchemeSelector extends ComponentBase {
  static ensureComponentStyles() {
    return adoptComponentStyles();
  }

  static {
    this.ensureComponentStyles();
    if (
      typeof globalThis.customElements !== 'undefined' &&
      !globalThis.customElements.get(ELEMENT_NAME)
    ) {
      globalThis.customElements.define(ELEMENT_NAME, this);
    }
  }

  constructor() {
    super();
    this._onToggle = this._onToggle.bind(this);
    this._onSystemChange = this._onSystemChange.bind(this);
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
      <button
        type="button"
        data-color-scheme-toggle
        role="switch"
        aria-checked="false"
        aria-label="Toggle dark mode"
        title="Switch between light and dark"
      >
        <span data-color-scheme-icon-current data-icon="sun" data-visible="false">${sunIconSVG}</span>
        <span data-color-scheme-icon-current data-icon="moon" data-visible="false">${moonIconSVG}</span>
        <span data-visually-hidden>Dark mode</span>
      </button>
    `;

    this.appendChild(template.content.cloneNode(true));
    this._toggle = this.querySelector('[data-color-scheme-toggle]');
    // Apply the initial scheme (root attributes, meta, storage) on mount.
    this.applyScheme(this.currentScheme);
  }

  attachEventListeners() {
    this._toggle?.addEventListener('click', this._onToggle);
    this._mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    this._mq?.addEventListener('change', this._onSystemChange);
  }

  disconnectedCallback() {
    this._toggle?.removeEventListener('click', this._onToggle);
    this._mq?.removeEventListener('change', this._onSystemChange);
    this._mq = undefined;
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

  getInitialScheme() {
    // Default to the system preference unless the user explicitly saved a scheme.
    return this.getSavedScheme() || 'system';
  }

  isDark() {
    if (this.currentScheme === 'system') {
      return getSystemScheme() === 'dark';
    }
    return this.currentScheme === 'dark';
  }

  updateButtonState() {
    const dark = this.isDark();
    this._toggle?.setAttribute('aria-checked', String(dark));
    this._toggle?.toggleAttribute('data-active', dark);

    this.querySelector('[data-icon="sun"]')?.setAttribute('data-visible', String(!dark));
    this.querySelector('[data-icon="moon"]')?.setAttribute('data-visible', String(dark));
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

    this.updateButtonState();
  }

  _onSystemChange(event) {
    // Follow the OS while the preference is left on "system".
    if (this.currentScheme === 'system') {
      this.updateButtonState();
    }
  }

  _onToggle() {
    const target = this.isDark() ? 'light' : 'dark';
    this.applyScheme(target);
  }
}

export { PixColorSchemeSelector, META_CONTENT, SCHEMES, STORAGE_KEY };

export default PixColorSchemeSelector;
