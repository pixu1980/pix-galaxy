// @ts-check
/**
 * @module core/template-engine/_part
 * Base class for parts that can bind to a signal.
 */

import { isSignalLike } from '../signals/index.js';
import { defineDisposable } from '../disposable/index.js';

/**
 * Base part: holds a value and manages a signal subscription when the value
 * is a signal.
 */
export class Part {
  constructor() {
    /** @type {unknown} Last committed value. */
    this.value = undefined;
    /** @type {(() => void) | null} Signal unsubscribe handle. */
    this.signalCleanup = null;
  }

  /**
   * Commit a value. Subclasses override.
   * @param {unknown} _value Value to commit.
   */
  setValue(_value) {
    // Base implementation is a no-op; concrete parts override.
  }

  /**
   * Subscribe to `sig` (immediate callback, then on change).
   * @param {import('../signals/index.js').ReadableSignal} sig
   * @param {(value: unknown) => void} cb
   */
  bindSignal(sig, cb) {
    this.disposeSignal();
    this.signalCleanup = sig.subscribe(() => cb(sig.get()));
    cb(sig.get());
  }

  /** Unsubscribe from the bound signal, if any. */
  disposeSignal() {
    if (this.signalCleanup) {
      this.signalCleanup();
      this.signalCleanup = null;
    }
  }

  /**
   * Release every subscription held by this part. Subclasses extend.
   */
  dispose() {
    this.disposeSignal();
  }
}

defineDisposable(Part);

/**
 * Helper for subclasses: commit a value, binding signals when present.
 * @template T
 * @param {T} value
 * @param {(raw: unknown) => void} commit Commit function.
 * @param {Part} part
 */
export function commitWithSignal(value, commit, part) {
  if (isSignalLike(value)) {
    part.bindSignal(value, commit);
    return;
  }
  part.disposeSignal();
  commit(value);
}
