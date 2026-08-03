// @ts-check
/**
 * @module core/bridge
 * Store → signals bridge (the "tickState" pattern).
 *
 * Every store mutation bumps a tick signal that never compares equal, so
 * computed signals reading `store.state.X` MUST also read the tick to react
 * to store changes. The bridge wires this up in one call.
 */

import { StateSignal } from './signals/_state-signal.js';

/**
 * Create the tick signal for a store and wire it to every mutation.
 *
 * The returned signal notifies on every write (never equal), so computed
 * signals that read store state should also read `tick.get()`:
 *
 * ```js
 * const tick = createTickState(store);
 * const context = new Signal.Computed(() => {
 *   tick.get();
 *   return { count: store.state.count };
 * });
 * ```
 *
 * @param {import('./store/_store.js').Store<any>} store
 * @returns {StateSignal<number>} Tick signal.
 */
export function createTickState(store) {
  const tick = new StateSignal(0, { equals: () => false });
  store.subscribe(() => tick.set(performance.now()));
  return tick;
}
