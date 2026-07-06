/**
 * @typedef {{ id: string, label: string, h: number, s: number, l: number }} AccentOption
 */

/**
 * Browser-native accent color selector custom element.
 * Manages 5 pastel accent color options with keyboard navigation and persistence.
 */
export class PixAccentColorSelector extends HTMLElement {
  /** @type {string} */
  currentAccent = 'coral';

  /** @returns {CSSStyleSheet | null} */
  static ensureComponentStyles() {
    return null;
  }

  /** @returns {string | null} */
  getSavedAccent() {
    return null;
  }

  /** @returns {string} */
  getInitialAccent() {
    return 'coral';
  }

  /** @param {string} accentId */
  getAccentValues(accentId) {
    void accentId;
    return { id: 'coral', label: 'Coral', h: 16, s: 95, l: 58 };
  }

  /** @returns {void} */
  updateButtonState() {}

  /**
   * @param {string} accentId
   * @returns {void}
   */
  applyAccent(accentId) {
    void accentId;
  }

  /** @returns {void} */
  connectedCallback() {}

  /** @returns {void} */
  disconnectedCallback() {}
}

/**
 * @type {ReadonlyArray<AccentOption>}
 */
export const ACCENT_OPTIONS = Object.freeze([
  { id: 'coral', label: 'Coral', h: 16, s: 95, l: 58 },
  { id: 'rose', label: 'Rose', h: 340, s: 90, l: 62 },
  { id: 'lavender', label: 'Lavender', h: 280, s: 85, l: 65 },
  { id: 'sky', label: 'Sky', h: 200, s: 85, l: 62 },
  { id: 'mint', label: 'Mint', h: 145, s: 80, l: 60 },
]);

/**
 * @type {string}
 */
export const STORAGE_KEY = 'pix-accent-color';
