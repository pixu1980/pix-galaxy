// @ts-check

import { normalizeVariant } from './pix-card.utils.js';

/**
 * Attribute handlers for PixCard.
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

  /**
   * @this {HTMLElement}
   * @param {string | null} _oldValue
   * @param {string | null} _newValue
   */
  href(_oldValue, _newValue) {},
};
