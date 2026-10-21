/**
 * Helpers for manipulating contiguous runs of DOM nodes.
 *
 * @module core/template-engine/range
 */

/**
 * Remove every node in a list from its parent.
 *
 * @param {Node[]} nodes - Nodes to remove.
 * @returns {void}
 */
export function clearRange(nodes) {
  for (const node of nodes) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
}

/**
 * Move a run of nodes so they sit immediately before a reference node.
 *
 * @param {Node[]} nodes - Nodes to move (in desired order).
 * @param {Node} reference - Node to insert before.
 * @returns {void}
 */
export function moveRangeBefore(nodes, reference) {
  const parent = reference.parentNode;

  if (!parent) {
    return;
  }

  for (const node of nodes) {
    parent.insertBefore(node, reference);
  }
}
