/**
 * Property part: binds a `.prop=${value}` DOM property.
 *
 * @module core/template-engine/property-part
 */

/**
 * Assigns a `${}` value to a DOM property.
 */
export class PropertyPart {
  /**
   * @param {Element} element - Target element.
   * @param {string} propertyName - DOM property name (without the `.`).
   * @param {number} valueIndex - Index into the values array.
   */
  constructor(element, propertyName, valueIndex) {
    /** @type {Element} */
    this.element = element;
    /** @type {string} */
    this.propertyName = propertyName;
    /** @type {number} */
    this.valueIndex = valueIndex;
  }

  /**
   * Assign the current value to the property.
   *
   * @param {unknown[]} values - Interpolated values.
   * @returns {void}
   */
  update(values) {
    this.element[this.propertyName] = values[this.valueIndex];
  }
}
