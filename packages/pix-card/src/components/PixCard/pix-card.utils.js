// @ts-check

import {
  BODY_PART,
  DEFAULT_VARIANT,
  FOOTER_PART,
  HEADER_PART,
  ROOT_PART,
  SUPPORTED_VARIANTS,
} from './pix-card.consts.js';

/**
 * Normalize a pix-card variant.
 *
 * @param {string | null | undefined} value
 * @returns {import('./pix-card.consts.js').PixCardVariant}
 */
export function normalizeVariant(value) {
  return SUPPORTED_VARIANTS.includes(String(value))
    ? /** @type {import('./pix-card.consts.js').PixCardVariant} */ (value)
    : DEFAULT_VARIANT;
}

/**
 * Filter out the managed root node before an initial render.
 *
 * @param {ChildNode[]} nodes
 * @returns {ChildNode[]}
 */
export function filterCardContentNodes(nodes) {
  return nodes.filter((node) => {
    return !(node.nodeType === Node.ELEMENT_NODE
      && node instanceof HTMLElement
      && node.getAttribute('data-part') === ROOT_PART);
  });
}

/**
 * @typedef {{
 *   headerNodes: ChildNode[],
 *   bodyNodes: ChildNode[],
 *   footerNodes: ChildNode[],
 * }} CardSections
 */

/**
 * Partition nodes according to their legacy slot usage.
 *
 * @param {ChildNode[]} nodes
 * @returns {CardSections}
 */
export function partitionSlotNodes(nodes) {
  /** @type {CardSections} */
  const sections = {
    headerNodes: [],
    bodyNodes: [],
    footerNodes: [],
  };

  for (const node of nodes) {
    if (node.nodeType === Node.ELEMENT_NODE && node instanceof Element) {
      const slotName = node.getAttribute('slot');

      if (slotName === HEADER_PART) {
        sections.headerNodes.push(node);
        continue;
      }

      if (slotName === FOOTER_PART) {
        sections.footerNodes.push(node);
        continue;
      }
    }

    sections.bodyNodes.push(node);
  }

  return sections;
}

export { BODY_PART, FOOTER_PART, HEADER_PART };
