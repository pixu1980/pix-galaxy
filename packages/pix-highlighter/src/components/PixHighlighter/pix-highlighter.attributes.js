// @ts-check

import { normalizeVariant } from './pix-highlighter.utils.js';

/**
 * Attribute handlers for PixHighlighter.
 */
export default {
  /**
   * @this {HTMLElement}
   * @param {string | null} _oldValue
   * @param {string | null} newValue
   */
  variant(_oldValue, newValue) {
    this.setAttribute('data-variant', normalizeVariant(newValue));
  },
};
