/* eslint-disable getter-return -- type declaration file: getters are JSDoc signatures, not implementations */
/**
 * @typedef {string} PixSortableValue
 * The `data-sortable-value` of an item in the list.
 */

/**
 * @fires PixSortable#sortable-change
 * @type {CustomEvent<{ fromIndex: number, toIndex: number, items: Element[] }>}
 */

/**
 * Browser-native accessible sortable list custom element.
 * Drag & drop with touch support and full keyboard navigation (WCAG 2.2 AA).
 */
export class PixSortable extends HTMLElement {
  /** @returns {Element[]} The sortable items in current order. */
  get items() {}
  /** @returns {PixSortableValue[]} The ordered `data-sortable-value` attributes. */
  get values() {}
}
