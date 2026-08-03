// @ts-check
/**
 * @module core/signals/_collector-context
 * Stack-based tracking context.
 *
 * While an effect or computed evaluates, its collector is pushed onto a
 * global stack. Every {@link BaseSignal#track} call registers the current
 * signal as a dependency of the top-of-stack collector.
 */

/**
 * @typedef {import('./_effect-collector.js').EffectCollector<any>} EffectCollector
 * @typedef {import('./_computed-signal.js').ComputedSignal<any>} ComputedSignal
 */

/** @type {Array<EffectCollector | ComputedSignal>} Active evaluation stack. */
const collectorStack = [];

/**
 * Return the collector currently collecting dependencies, or `undefined`.
 * @returns {EffectCollector | ComputedSignal | undefined}
 */
export function getCurrentCollector() {
  return collectorStack[collectorStack.length - 1];
}

/**
 * Push a collector onto the evaluation stack.
 * @param {EffectCollector | ComputedSignal} collector
 */
export function pushCollector(collector) {
  collectorStack.push(collector);
}

/**
 * Pop and return the top collector from the stack.
 * @returns {EffectCollector | ComputedSignal | undefined}
 */
export function popCollector() {
  return collectorStack.pop();
}

/**
 * Run `fn` with `collector` as the active dependency target.
 * @template T
 * @param {EffectCollector | ComputedSignal} collector
 * @param {() => T} fn
 * @returns {T}
 */
export function withCollector(collector, fn) {
  pushCollector(collector);
  try {
    return fn();
  } finally {
    popCollector();
  }
}

/**
 * Run `callback` without tracking dependencies (temporarily suspends the
 * active collector).
 * @template T
 * @param {() => T} callback
 * @returns {T}
 */
export function withoutCollector(callback) {
  const current = popCollector();
  try {
    return callback();
  } finally {
    if (current) pushCollector(current);
  }
}
