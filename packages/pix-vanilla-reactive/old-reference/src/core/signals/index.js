/**
 * Signals barrel — fine-grained reactivity primitives.
 *
 * @module core/signals
 */

import { SIGNAL_BRAND } from "./_base-signal.js";
import { ComputedSignal } from "./_computed-signal.js";
import { EffectCollector } from "./_effect-collector.js";
import { withoutCollector } from "./_collector-context.js";
import { StateSignal } from "./_state-signal.js";

export { flushSync, schedule } from "./_scheduler.js";

/**
 * Unified signal namespace mirroring the TC39 Signals proposal shape.
 *
 * @type {{ State: typeof StateSignal, Computed: typeof ComputedSignal, subtle: { untrack: (fn: () => unknown) => unknown } }}
 */
export const Signal = {
  State: StateSignal,
  Computed: ComputedSignal,
  subtle: {
    /**
     * Read signals inside `fn` without tracking them as dependencies.
     *
     * @param {() => unknown} fn - Function to run untracked.
     * @returns {unknown} The result of `fn`.
     */
    untrack(fn) {
      return withoutCollector(fn);
    },
  },
};

/**
 * Create an auto-tracking effect that runs immediately and re-runs on change.
 *
 * @param {() => void} fn - Effect body.
 * @returns {() => void} Disposer that stops the effect.
 */
export function effect(fn) {
  const collector = new EffectCollector(fn);

  collector.run();

  return () => collector.dispose();
}

/**
 * Duck-type test for a signal-like value.
 *
 * @param {unknown} value - Candidate value.
 * @returns {boolean} True when `value` is a signal.
 */
export function isSignalLike(value) {
  return Boolean(value) && typeof value === "object" && value[SIGNAL_BRAND] === true;
}
