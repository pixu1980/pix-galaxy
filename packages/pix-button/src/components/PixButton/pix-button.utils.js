// @ts-check

import { BUTTON_PART, DEFAULT_VARIANT, SUPPORTED_VARIANTS } from './pix-button.consts.js';

/**
 * Normalize a pix-button variant.
 *
 * @param {string | null | undefined} value
 * @returns {import('./pix-button.consts.js').PixButtonVariant}
 */
export function normalizeVariant(value) {
  return SUPPORTED_VARIANTS.includes(String(value))
    ? /** @type {import('./pix-button.consts.js').PixButtonVariant} */ (value)
    : DEFAULT_VARIANT;
}

/**
 * Collect user-provided nodes while skipping the managed button root.
 *
 * @param {ChildNode[]} nodes
 * @returns {ChildNode[]}
 */
export function filterButtonContentNodes(nodes) {
  return nodes.filter((node) => {
    return !(node.nodeType === Node.ELEMENT_NODE
      && node instanceof HTMLElement
      && node.getAttribute('data-part') === BUTTON_PART);
  });
}
