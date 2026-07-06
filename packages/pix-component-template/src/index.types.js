/**
 * @typedef {{ id: string, label: string }} {%COMPONENT_CLASS%}Option
 */

/**
 * Browser-native {%COMPONENT_NAME%} custom element.
 * (TODO: describe what this component does)
 */
export class {%COMPONENT_CLASS%} extends HTMLElement {
  /** @type {string} */
  currentValue = '';

  /** @returns {CSSStyleSheet | null} */
  static ensureComponentStyles() {
    return null;
  }

  /** @returns {void} */
  connectedCallback() {}

  /** @returns {void} */
  disconnectedCallback() {}
}

/**
 * @type {string}
 */
export const STORAGE_KEY = '{%STORAGE_KEY%}';
