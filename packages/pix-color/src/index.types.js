/* eslint-disable getter-return -- type declaration file: getters are JSDoc signatures, not implementations */
/**
 * @typedef {string} PixColorValue
 * HEX colour string, e.g. "#6366F1".
 */

/**
 * @typedef {'hex' | 'rgb' | 'hsl' | 'oklch'} PixColorFormat
 * Colour format currently displayed in the picker.
 */

/**
 * @fires PixColor#color-change
 * @type {CustomEvent<{ value: string, format: PixColorFormat }>}
 */

/**
 * @fires PixColor#expanded-change
 * @type {CustomEvent<{ expanded: boolean }>}
 */

/**
 * Browser-native OKLCH colour picker custom element.
 * Supports HEX, RGB, HSL and OKLCH formats, WCAG contrast checking,
 * and native form participation via ElementInternals.
 */
export class PixColor extends HTMLElement {
  /** @returns {string} The current colour as a HEX string. */
  get value() {}
  /** @param {string} value HEX colour to set. */
  set value(value) {}
  /** @returns {boolean} Whether the colour panel is open. */
  get expanded() {}
  /** @param {boolean} expanded Open or close the colour panel. */
  set expanded(expanded) {}
}
