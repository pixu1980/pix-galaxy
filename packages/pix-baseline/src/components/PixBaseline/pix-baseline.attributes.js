// @ts-check

import { normalizeVariant } from './pix-baseline.utils.js';

/**
 * Attribute handlers for PixBaseline.
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
