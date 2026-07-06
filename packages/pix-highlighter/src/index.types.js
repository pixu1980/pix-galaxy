/** @typedef {'kw' | 'str' | 'num' | 'com' | 'id' | 'op' | 'tag' | 'attr' | 'key' | 'var' | 'mac' | 'pp' | 'prop' | 'type' | 'mdh' | 'mde' | 'mds' | 'mdc' | 'mdl' | 'mdbq' | 'mdli' | 'mdhr' | 'mdimg'} PixHighlighterTokenType */

/**
 * @typedef {object} PixHighlighterToken
 * @property {PixHighlighterTokenType} type
 * @property {number} start
 * @property {number} end
 */

/**
 * @callback PixHighlighterLexer
 * @param {string} source
 * @returns {PixHighlighterToken[]}
 */

/**
 * Browser-native syntax-highlighting custom element.
 */
export class PixHighlighter extends HTMLPreElement {
  /** @type {Set<PixHighlighter>} */
  static instances = new Set();

  /** @type {readonly PixHighlighterTokenType[]} */
  static KNOWN_TYPES = [];

  /** @returns {CSSStyleSheet | HTMLStyleElement | null} */
  static ensureComponentStyles() {
    return null;
  }

  /** @returns {boolean} */
  static registerCustomElement() {
    return false;
  }

  /** @returns {boolean} */
  static supportsHighlights() {
    return false;
  }

  /** @returns {string | null} */
  static getSavedTheme() {
    return null;
  }

  /** @returns {string} */
  static getCurrentTheme() {
    return 'default';
  }

  /** @returns {string} */
  static getInitialTheme() {
    return 'default';
  }

  /**
   * @param {string} theme
   * @param {{ persist?: boolean; syncInstances?: boolean }} [options]
   * @returns {string}
   */
  static applyTheme(theme, options = {}) {
    void options;
    return theme;
  }

  /** @returns {void} */
  static clearManagedHighlights() {}

  /**
   * @param {HTMLPreElement} element
   * @returns {PixHighlighter | null}
   */
  static enhanceElement(element) {
    void element;
    return null;
  }

  /**
   * @param {Document | Element} [root=document]
   * @returns {PixHighlighter[]}
   */
  static enhanceAll(root = document) {
    void root;
    return [];
  }

  /** @returns {void} */
  connectedCallback() {}

  /** @returns {void} */
  disconnectedCallback() {}
}

/**
 * @type {ReadonlyArray<{value: string, label: string}>}
 */
export const PIX_HIGHLIGHTER_THEME_OPTIONS = [];

/**
 * Enhance all matching `pre[is="pix-highlighter"]` blocks under the provided root.
 * @param {Document | Element} [root=document]
 * @returns {PixHighlighter[]}
 */
export function enhancePixHighlighters(root = document) {
  void root;
  return [];
}

/**
 * @param {string | null | undefined} [value]
 * @returns {string}
 */
export function normalizeLang(value) {
  return String(value ?? '');
}

/** @type {PixHighlighterLexer} */
export const lexBash = () => [];

/** @type {PixHighlighterLexer} */
export const lexC = () => [];

/** @type {PixHighlighterLexer} */
export const lexCPP = () => [];

/** @type {PixHighlighterLexer} */
export const lexCSharp = () => [];

/** @type {PixHighlighterLexer} */
export const lexCSS = () => [];

/** @type {PixHighlighterLexer} */
export const lexGo = () => [];

/** @type {PixHighlighterLexer} */
export const lexHTML = () => [];

/** @type {PixHighlighterLexer} */
export const lexJS = () => [];

/** @type {PixHighlighterLexer} */
export const lexJSON = () => [];

/** @type {PixHighlighterLexer} */
export const lexMarkdown = () => [];

/** @type {PixHighlighterLexer} */
export const lexPHP = () => [];

/** @type {PixHighlighterLexer} */
export const lexPython = () => [];

/** @type {PixHighlighterLexer} */
export const lexRust = () => [];

/** @type {PixHighlighterLexer} */
export const lexTS = () => [];

/** @type {PixHighlighterLexer} */
export const lexYAML = () => [];
