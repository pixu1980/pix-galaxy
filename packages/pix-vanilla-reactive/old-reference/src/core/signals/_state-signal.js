/**
 * Writable state signal.
 *
 * @module core/signals/state-signal
 */

import { BaseSignal } from "./_base-signal.js";

/**
 * A mutable reactive value.
 */
export class StateSignal extends BaseSignal {
  /**
   * @param {unknown} initialValue - Initial value.
   * @param {object} [options] - Options.
   * @param {(a: unknown, b: unknown) => boolean} [options.equals] - Equality test; return `false` to always notify.
   */
  constructor(initialValue, options = {}) {
    super();
    /** @type {unknown} */
    this._value = initialValue;
    /** @type {(a: unknown, b: unknown) => boolean} */
    this._equals = options.equals ?? Object.is;
  }

  /**
   * Read the value and track it as a dependency of the active collector.
   *
   * @returns {unknown} Current value.
   */
  get() {
    this.track();

    return this._value;
  }

  /**
   * Read the value without tracking a dependency.
   *
   * @returns {unknown} Current value.
   */
  peek() {
    return this._value;
  }

  /**
   * Replace the value, notifying subscribers when it changed.
   *
   * @param {unknown} next - Next value.
   * @returns {void}
   */
  set(next) {
    if (this._equals(this._value, next)) {
      return;
    }

    this._value = next;
    this.notify();
  }
}
