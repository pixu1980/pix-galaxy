// @ts-check
/**
 * @module core/signals/index
 * Signals public API: state, computed, effects, scheduler and tracking helpers.
 */

import { BaseSignal } from './_base-signal.js';
import { StateSignal } from './_state-signal.js';
import { ComputedSignal } from './_computed-signal.js';
import { EffectCollector } from './_effect-collector.js';
import {
  withCollector,
  withoutCollector,
  getCurrentCollector,
  pushCollector,
  popCollector,
} from './_collector-context.js';
import { schedule } from './_scheduler.js';
import { DISPOSE, defineDisposable, makeDisposable } from '../disposable/index.js';

export {
  BaseSignal,
  StateSignal,
  ComputedSignal,
  EffectCollector,
  schedule,
  withCollector,
  withoutCollector,
  getCurrentCollector,
  pushCollector,
  popCollector,
};

/**
 * Namespaced signal constructors, mirroring the TC39 "Signals" proposal shape.
 *
 * @example
 * const count = new Signal.State(0);
 * const doubled = new Signal.Computed(() => count.get() * 2);
 * const read = Signal.subtle.untrack(() => store.state.raw);
 */
export const Signal = {
  State: StateSignal,
  Computed: ComputedSignal,
  subtle: {
    /**
     * Run `fn` with dependency tracking suspended.
     * @template T
     * @param {() => T} fn
     * @returns {T}
     */
    untrack: (fn) => {
      const collector = popCollector();
      try {
        return fn();
      } finally {
        if (collector) pushCollector(collector);
      }
    },
  },
};

/**
 * Create and auto-track a side-effect.
 *
 * The effect runs immediately; every signal read inside becomes a dependency
 * and any change re-schedules the effect (batched on the microtask queue).
 *
 * @template T
 * @param {() => T} fn Effect body.
 * @returns {import('../disposable/_make-disposable.js').DisposableHandle & (() => void)}
 *   Disposer — stops the effect and frees dependencies. Callable for
 *   back-compat and `[Symbol.dispose]`-ready on modern engines.
 * @example
 * const dispose = effect(() => render(root, store.state.todos));
 * // later:
 * dispose();
 * // or, on ES2026 engines:
 * // using _ = effect(() => render(root, store.state.todos));
 */
export function effect(fn) {
  const collector = new EffectCollector(fn);
  return makeDisposable(() => collector.stop());
}

defineDisposable(EffectCollector);

/**
 * Readable signal shape used by narrowing guards.
 * @typedef {BaseSignal & { get(): unknown }} ReadableSignal
 */

/**
 * Narrowing guard: true when `value` looks like a signal.
 * @param {unknown} value
 * @returns {value is ReadableSignal}
 */
export function isSignalLike(value) {
  const record =
    value && typeof value === 'object' ? /** @type {Record<string, unknown>} */ (value) : null;
  return Boolean(record && typeof record.get === 'function' && record.__isSignal === true);
}
