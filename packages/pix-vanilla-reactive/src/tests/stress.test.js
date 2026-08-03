/**
 * Stress tests: scale, batching and leak regression.
 *
 * These assert correctness at scale and that subscriptions are released when
 * dynamic parts are removed — the two things that break silently in reactive
 * UIs. Timing assertions use generous bounds to stay non-flaky.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
});

globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.HTMLInputElement = dom.window.HTMLInputElement;
globalThis.Node = dom.window.Node;
globalThis.Comment = dom.window.Comment;
globalThis.Event = dom.window.Event;
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.NodeFilter = dom.window.NodeFilter;

import { html, render, repeat } from '../core/template-engine/index.js';
import { Signal, effect } from '../core/signals/index.js';
import { Store } from '../core/store/index.js';

describe('signals at scale', () => {
  it('10k independent signals subscribe/notify without errors', () => {
    const signals = Array.from({ length: 10_000 }, () => new Signal.State(0));
    let notified = 0;
    for (const s of signals) s.subscribe(() => notified++);
    for (const s of signals) s.set(1);
    assert.equal(notified, 10_000);
  });

  it('N rapid sets collapse into one effect run (batching)', async () => {
    const s = new Signal.State(0);
    let runs = 0;
    const dispose = effect(() => {
      s.get();
      runs++;
    });
    for (let i = 1; i <= 1000; i++) s.set(i);
    assert.equal(runs, 1, 'no intermediate flush before microtask');
    await Promise.resolve();
    assert.equal(runs, 2, 'exactly one batched re-run after 1000 sets');
    dispose();
  });

  it('computed chains of depth 50 stay consistent', () => {
    const root = new Signal.State(1);
    let prev = root;
    /** @type {Signal.Computed<number>[]} */
    const chain = [];
    for (let i = 0; i < 50; i++) {
      const parent = prev;
      prev = new Signal.Computed(() => parent.get() + 1);
      chain.push(prev);
    }
    assert.equal(chain[49].get(), 51);
    root.set(10);
    assert.equal(chain[49].get(), 60);
  });
});

describe('store at scale', () => {
  it('1k mutations notify subscribers once each', () => {
    const store = new Store({ list: [] });
    let changes = 0;
    store.subscribe(() => changes++);
    for (let i = 0; i < 1000; i++) store.state.list = [...store.state.list, i];
    assert.equal(changes, 1000);
    assert.equal(store.snapshot().list.length, 1000);
  });

  it('replace() with a large tree emits a single change', () => {
    const store = new Store({});
    let changes = 0;
    store.subscribe(() => changes++);
    const big = { rows: Array.from({ length: 5000 }, (_, i) => ({ i, v: `v${i}` })) };
    store.replace(big);
    assert.equal(changes, 1);
    assert.equal(store.snapshot().rows.length, 5000);
  });
});

describe('template at scale', () => {
  it('renders and reconciles a 2k-item repeat list', () => {
    const items = new Signal.State(
      Array.from({ length: 2000 }, (_, i) => ({ id: i, label: `item-${i}` }))
    );
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(
      html`<ul>
        ${repeat(
          items,
          (item) => item.id,
          (item) => html`<li>${item.label}</li>`
        )}
      </ul>`,
      container
    );
    assert.equal(container.querySelectorAll('li').length, 2000);

    // shrink by half
    items.set(items.get().slice(0, 1000));
    assert.equal(container.querySelectorAll('li').length, 1000);

    // reorder: move last to front
    const half = items.get();
    const reordered = [half[half.length - 1], ...half.slice(0, half.length - 1)];
    items.set(reordered);
    assert.equal(container.querySelectorAll('li').length, 1000);
    assert.equal(container.querySelector('li').textContent, `item-${999}`);
  });

  it('1k rapid re-renders stay consistent', () => {
    const count = new Signal.State(0);
    const container = document.createElement('div');
    document.body.appendChild(container);
    const dispose = effect(() => render(html`<p>n=${count.get()}</p>`, container));
    for (let i = 1; i <= 1000; i++) count.set(i);
    return Promise.resolve().then(() => {
      assert.equal(container.textContent, 'n=1000');
      dispose();
    });
  });
});

describe('leak regression', () => {
  it('removing repeat blocks releases their signal subscriptions', () => {
    const label = new Signal.State('x');
    const items = new Signal.State([{ id: 1 }, { id: 2 }, { id: 3 }]);
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(
      html`<ul>
        ${repeat(
          items,
          (item) => item.id,
          () => html`<li>${label}</li>`
        )}
      </ul>`,
      container
    );
    assert.equal(label.subscribers.size, 3);
    items.set([{ id: 1 }]);
    assert.equal(label.subscribers.size, 1, 'removed blocks unsubscribe');
    items.set([]);
    assert.equal(label.subscribers.size, 0, 'empty list unsubscribes everything');
  });

  it('swapping templates releases the previous instance subscriptions', () => {
    const a = new Signal.State('a');
    const b = new Signal.State('b');
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(html`<p>${a}</p>`, container);
    assert.equal(a.subscribers.size, 1);
    render(html`<span>${b}</span>`, container); // different strings → new instance
    assert.equal(a.subscribers.size, 0, 'old instance disposed');
    assert.equal(b.subscribers.size, 1);
  });

  it('render(null) unmounts and releases subscriptions', () => {
    const sig = new Signal.State(0);
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(html`<p>${sig}</p>`, container);
    assert.equal(sig.subscribers.size, 1);
    render(null, container);
    assert.equal(sig.subscribers.size, 0);
    assert.equal(container.textContent, '', 'markers removed');
  });

  it('disposed effects release their dependencies', () => {
    const s = new Signal.State(0);
    const dispose = effect(() => s.get());
    assert.equal(s.subscribers.size, 1);
    dispose();
    assert.equal(s.subscribers.size, 0);
  });

  it('disposing a model binding removes the DOM listener', () => {
    const state = new Signal.State('v');
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(
      html`<input
        model=${{
          signal: state,
          get: () => state.get(),
          set: (v) => state.set(v),
        }}
      />`,
      container
    );
    const input = container.querySelector('input');
    // listener count is not directly observable in jsdom; assert behavior:
    // after unmount, changing the signal no longer touches the detached input
    render(null, container);
    state.set('after-unmount');
    assert.equal(input.value, 'v', 'binding disposed with the template');
  });
});
