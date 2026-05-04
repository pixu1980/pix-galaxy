/**
 * Normalize a pix-card variant.
 *
 * @param {string | null | undefined} value
 * @returns {import('./pix-card.consts.js').PixCardVariant}
 */
export function normalizeVariant(value: string | null | undefined): import("./pix-card.consts.js").PixCardVariant;
/**
 * Filter out the managed root node before an initial render.
 *
 * @param {ChildNode[]} nodes
 * @returns {ChildNode[]}
 */
export function filterCardContentNodes(nodes: ChildNode[]): ChildNode[];
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
export function partitionSlotNodes(nodes: ChildNode[]): CardSections;
export type CardSections = {
    headerNodes: ChildNode[];
    bodyNodes: ChildNode[];
    footerNodes: ChildNode[];
};
import { BODY_PART } from './pix-card.consts.js';
import { FOOTER_PART } from './pix-card.consts.js';
import { HEADER_PART } from './pix-card.consts.js';
export { BODY_PART, FOOTER_PART, HEADER_PART };
//# sourceMappingURL=pix-card.utils.d.ts.map