/**
 * Base signal: subscription bookkeeping, dependency tracking, notification.
 *
 * @module core/signals/base-signal
 */

import { getCurrentCollector } from "./_collector-context.js";

/** Brand used by `isSignalLike` to recognise signals. */
export const SIGNAL_BRAND = Symbol("pix.signal");

/**
 * Shared base for {@link StateSignal} and {@link ComputedSignal}.
 */
export class BaseSignal {
  constructor() {
    /** @type {Set<object>} */
    this._subscribers = new Set();
    /** @type {true} */
    this[SIGNAL_BRAND] = true;
  }

  /**
   * Register the active collector as a dependant and record the reverse edge.
   *
   * @returns {void}
   */
  track() {
    const collector = getCurrentCollector();

    if (collector === null || collector === this) {
      return;
    }

    collector.addDependency(this);
    this._subscribers.add(collector);
  }

  /**
   * Add a subscriber that should be invalidated on change.
   *
   * @param {object} subscriber - A collector with an `invalidate` method.
   * @returns {void}
   */
  addSubscriber(subscriber) {
    this._subscribers.add(subscriber);
  }

  /**
   * Remove a subscriber (dependency teardown).
   *
   * @param {object} subscriber - Previously added collector.
   * @returns {void}
   */
  removeSubscriber(subscriber) {
    this._subscribers.delete(subscriber);
  }

  /**
   * Invalidate every current subscriber.
   *
   * @returns {void}
   */
  notify() {
    for (const subscriber of Array.from(this._subscribers)) {
      subscriber.invalidate();
    }
  }
}
