// @ts-check

import { DEFAULT_VARIANT, ROOT_PART, SUPPORTED_VARIANTS } from './pix-baseline.consts.js';

/**
 * Normalize a pix-baseline variant.
 *
 * @param {string | null | undefined} value
 * @returns {import('./pix-baseline.consts.js').PixBaselineVariant}
 */
export function normalizeVariant(value) {
  return SUPPORTED_VARIANTS.includes(String(value))
    ? /** @type {import('./pix-baseline.consts.js').PixBaselineVariant} */ (value)
    : DEFAULT_VARIANT;
}

/**
 * Collect user-provided nodes while skipping the managed wrapper.
 *
 * @param {ChildNode[]} nodes
 * @returns {ChildNode[]}
 */
export function filterRenderableNodes(nodes) {
  return nodes.filter((node) => {
    return !(node.nodeType === Node.ELEMENT_NODE
      && node instanceof HTMLElement
      && node.getAttribute('data-part') === ROOT_PART);
  });
}
