/**
 * Lazy, cached derived signal.
 *
 * A computed is both a signal (other collectors may depend on it) and a
 * collector (it depends on the signals read inside its compute function).
 *
 * @module core/signals/computed-signal
 */

import { BaseSignal } from "./_base-signal.js";
import { withCollector } from "./_collector-context.js";

/**
 * A value derived from other signals, recomputed lazily on read when dirty.
 */
export class ComputedSignal extends BaseSignal {
  /**
   * @param {() => unknown} compute - Pure derivation function.
   * @param {object} [options] - Options.
   * @param {(a: unknown, b: unknown) => boolean} [options.equals] - Equality test for the derived value.
   */
  constructor(compute, options = {}) {
    super();
    /** @type {() => unknown} */
    this._compute = compute;
    /** @type {(a: unknown, b: unknown) => boolean} */
    this._equals = options.equals ?? Object.is;
    /** @type {unknown} */
    this._value = undefined;
    /** @type {boolean} */
    this._dirty = true;
    /** @type {Set<BaseSignal>} */
    this._deps = new Set();
  }

  /**
   * Record a dependency edge (called by `BaseSignal.track`).
   *
   * @param {BaseSignal} signal - Signal read during computation.
   * @returns {void}
   */
  addDependency(signal) {
    this._deps.add(signal);
  }

  /**
   * Mark dirty and cascade invalidation to dependants.
   *
   * @returns {void}
   */
  invalidate() {
    if (this._dirty) {
      return;
    }

    this._dirty = true;
    this.notify();
  }

  /**
   * Drop all dependency edges before a recompute.
   *
   * @returns {void}
   */
  _cleanupDeps() {
    for (const dep of this._deps) {
      dep.removeSubscriber(this);
    }

    this._deps.clear();
  }

  /**
   * Read the derived value, recomputing if dirty. Tracks as a dependency.
   *
   * @returns {unknown} Derived value.
   */
  get() {
    this.track();

    if (this._dirty) {
      this._cleanupDeps();
      this._value = withCollector(this, () => this._compute());
      this._dirty = false;
    }

    return this._value;
  }

  /**
   * Read without tracking, forcing evaluation if dirty.
   *
   * @returns {unknown} Derived value.
   */
  peek() {
    if (this._dirty) {
      this._cleanupDeps();
      this._value = withCollector(this, () => this._compute());
      this._dirty = false;
    }

    return this._value;
  }
}
