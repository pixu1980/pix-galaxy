/**
 * @typedef {'light' | 'dark' | 'system'} ColorScheme
 */

/**
 * Browser-native color-scheme selector custom element.
 * Manages light, dark, and system color scheme preferences.
 */
export class PixColorSchemeSelector extends HTMLElement {
  /** @type {'light' | 'dark' | 'system'} */
  currentScheme = 'system';

  /** @returns {CSSStyleSheet | null} */
  static ensureComponentStyles() {
    return null;
  }

  /** @returns {HTMLMetaElement} */
  getOrCreateMeta() {
    return document.createElement('meta');
  }

  /** @returns {ColorScheme | null} */
  getSavedScheme() {
    return null;
  }

  /** @returns {ColorScheme} */
  getSchemeFromMeta() {
    return 'system';
  }

  /** @returns {ColorScheme} */
  getInitialScheme() {
    return 'system';
  }

  /** @returns {void} */
  updateOptionState() {}

  /**
   * @param {ColorScheme} scheme
   * @returns {void}
   */
  applyScheme(scheme) {
    void scheme;
  }

  /** @returns {void} */
  connectedCallback() {}

  /** @returns {void} */
  disconnectedCallback() {}
}

/**
 * @type {Readonly<Record<ColorScheme, string>>}
 */
export const META_CONTENT = Object.freeze({
  light: 'light',
  dark: 'dark',
  system: 'light dark',
});

/**
 * @type {ReadonlyArray<ColorScheme>}
 */
export const SCHEMES = Object.freeze(['light', 'dark', 'system']);

/**
 * @type {string}
 */
export const STORAGE_KEY = 'pix-color-scheme';
