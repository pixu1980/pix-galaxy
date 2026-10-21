/**
 * Event part: binds an `@event=${handler}` listener.
 *
 * @module core/template-engine/event-part
 */

/**
 * Binds (and rebinds) a DOM event listener from a `${}` value.
 */
export class EventPart {
  /**
   * @param {Element} element - Target element.
   * @param {string} eventName - Event type (without the `@`).
   * @param {number} valueIndex - Index into the values array.
   */
  constructor(element, eventName, valueIndex) {
    /** @type {Element} */
    this.element = element;
    /** @type {string} */
    this.eventName = eventName;
    /** @type {number} */
    this.valueIndex = valueIndex;
    /** @type {EventListener | null} */
    this.current = null;
  }

  /**
   * Attach the current handler, replacing any previous one.
   *
   * @param {unknown[]} values - Interpolated values.
   * @returns {void}
   */
  update(values) {
    const next = values[this.valueIndex];

    if (next === this.current) {
      return;
    }

    if (this.current) {
      this.element.removeEventListener(this.eventName, this.current);
    }

    if (typeof next === "function") {
      this.element.addEventListener(this.eventName, next);
      this.current = next;
    } else {
      this.current = null;
    }
  }
}
