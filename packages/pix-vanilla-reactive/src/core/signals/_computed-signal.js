// @ts-check
/**
 * @module core/signals/_computed-signal
 * Lazy derived signal - the primitive behind `Signal.Computed`.
 */

import { BaseSignal } from './_base-signal.js';
import { withCollector } from './_collector-context.js';

/**
 * A lazily-evaluated, cached derived signal.
 *
 * The compute function runs on first `get()` and whenever any tracked
 * dependency invalidates the cached value. Reads inside `compute` that go
 * through `signal.get()` are collected as dependencies.
 *
 * @template T Result type.
 * @example
 * const doubled = new ComputedSignal(() => count.get() * 2);
 * doubled.get(); // → 2 (evaluates)
 * count.set(3);
 * doubled.get(); // → 6 (re-evaluates because count changed)
 */
export class ComputedSignal extends BaseSignal {
  /**
   * @param {() => T} compute Derivation function.
   * @param {{ equals?: (a: T, b: T) => boolean }} [opts] Equality predicate
   *   used to decide whether a re-evaluated value invalidates downstream.
   *   Defaults to `Object.is`.
   */
  constructor(compute, opts = {}) {
    super();
    /** @type {() => T} */
    this.compute = compute;
    /** @type {(a: T, b: T) => boolean} */
    this.equals = opts.equals ?? Object.is;
    /** @type {Map<BaseSignal, () => void>} Dependency → unsubscribe. */
    this.deps = new Map();
    /** @type {T} Cached value (uninitialized until first evaluate). */
    this.cached = /** @type {T} */ (undefined);
    /** @type {boolean} Whether the cached value is stale. */
    this.dirty = true;
    /** @type {boolean} Re-entrancy guard while evaluating. */
    this.recomputing = false;
    /** @type {() => void} Bound invalidate handler. */
    this.boundInvalidate = this.invalidate.bind(this);
  }

  /**
   * Collect a dependency (called by {@link BaseSignal#track}).
   * @param {BaseSignal} sig
   */
  addDependency(sig) {
    if (this.deps.has(sig)) return;
    this.deps.set(sig, sig.subscribe(this.boundInvalidate));
  }

  /** Unsubscribe from every tracked dependency. */
  cleanupDeps() {
    for (const unsubscribe of this.deps.values()) unsubscribe();
    this.deps.clear();
  }

  /**
   * Mark the cache dirty and notify downstream subscribers. Called by
   * dependency signals when they change.
   */
  invalidate() {
    if (this.dirty) return;
    this.dirty = true;
    this.notify();
  }

  /**
   * Recompute if dirty and return the cached value.
   * @returns {T}
   */
  evaluate() {
    if (!this.dirty) return this.cached;
    if (this.recomputing) return this.cached;
    this.recomputing = true;
    this.cleanupDeps();
    try {
      const next = withCollector(this, () => this.compute());
      if (this.dirty || !this.equals(this.cached, next)) this.cached = next;
      this.dirty = false;
      return this.cached;
    } finally {
      this.recomputing = false;
    }
  }

  /**
   * Read the derived value, tracking this signal as a dependency.
   * @returns {T}
   */
  get() {
    this.track();
    return this.evaluate();
  }

  /**
   * Read the derived value without tracking.
   * @returns {T}
   */
  peek() {
    return this.evaluate();
  }
}
