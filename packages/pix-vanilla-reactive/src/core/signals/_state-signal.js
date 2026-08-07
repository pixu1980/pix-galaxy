// @ts-check
/**
 * @module core/signals/_state-signal
 * Writable state signal - the primitive behind `Signal.State`.
 */

import { BaseSignal } from './_base-signal.js';

/**
 * A writable reactive cell.
 *
 * @template T Value type.
 * @example
 * const count = new StateSignal(0);
 * effect(() => console.log(count.get())); // logs 0, re-runs on set
 * count.set(1); // → logs 1
 */
export class StateSignal extends BaseSignal {
  /**
   * @param {T} value Initial value.
   * @param {{ equals?: (a: T, b: T) => boolean }} [opts]
   *   - `equals`: equality predicate deciding whether `set` notifies.
   *     Defaults to `Object.is`. Pass `() => false` to always notify.
   */
  constructor(value, opts = {}) {
    super();
    /** @type {T} */
    this.value = value;
    /** @type {(a: T, b: T) => boolean} */
    this.equals = opts.equals ?? Object.is;
  }

  /**
   * Read the current value, tracking this signal as a dependency.
   * @returns {T}
   */
  get() {
    this.track();
    return this.value;
  }

  /**
   * Read the current value without tracking.
   * @returns {T}
   */
  peek() {
    return this.value;
  }

  /**
   * Write a new value. Notifies subscribers when `equals(old, next)` is false.
   * @param {T} next
   * @returns {T} The stored value.
   */
  set(next) {
    if (this.equals(this.value, next)) return this.value;
    this.value = next;
    this.notify();
    return this.value;
  }
}
