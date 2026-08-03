// @ts-check
/**
 * @module core/signals/_base-signal
 * Base signal primitive: subscriber management, dependency tracking and
 * notification. Extended by {@link StateSignal} and {@link ComputedSignal}.
 */

import { getCurrentCollector } from './_collector-context.js';

/**
 * Base class shared by all signal types.
 *
 * A signal is a single reactive value. Reading it through {@link BaseSignal#get}
 * inside an effect/computed registers a dependency; calling
 * {@link BaseSignal#set} (or invalidating a computed) notifies subscribers,
 * which re-schedules the owning effects.
 */
export class BaseSignal {
  constructor() {
    /** @type {Set<() => void>} Subscribers invoked on notify. */
    this.subscribers = new Set();
    /** @type {true} Marker consumed by {@link isSignalLike}. */
    this.__isSignal = true;
  }

  /**
   * Subscribe to value changes.
   * @param {() => void} fn Callback invoked after the value changes.
   * @returns {() => void} Unsubscribe function (idempotent).
   */
  subscribe(fn) {
    this.subscribers.add(fn);
    return () => {
      this.subscribers.delete(fn);
    };
  }

  /**
   * Register this signal as a dependency of the active collector, if any.
   * Called by concrete subclasses from `get()`.
   */
  track() {
    const collector = getCurrentCollector();
    if (collector) collector.addDependency(this);
  }

  /**
   * Invoke every subscriber. Subscribers run synchronously; effects are
   * batched by the scheduler.
   */
  notify() {
    for (const subscriber of [...this.subscribers]) subscriber();
  }
}
