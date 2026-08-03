// @ts-check
/**
 * @module pix-vanilla-reactive
 * @packageDocumentation
 * Zero-dependency reactive UI framework: Proxy store, fine-grained signals,
 * `html` template engine, and the store↔signal bridge.
 *
 * @example
 * import { Store, Signal, effect, html, render, createTickState } from '@pix-galaxy/pix-vanilla-reactive';
 *
 * const store = new Store({ count: 0 });
 * const tick = createTickState(store);
 * const view = new Signal.Computed(() => {
 *   tick.get();
 *   const result = html`<button @click=${() => { store.state.count += 1; }}>
 *     Count: {{ count }}</button>`;
 *   result._context = store.state;
 *   return result;
 * });
 *
 * effect(() => render(view.get(), document.querySelector('#app')));
 */

export * from './core/index.js';
