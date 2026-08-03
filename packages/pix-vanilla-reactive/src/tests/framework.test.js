/**
 * End-to-end framework test: Store + tick bridge + computed + effect + render.
 * Mirrors the canonical bootstrap sequence from the docs.
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
globalThis.Event = dom.window.Event;
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.NodeFilter = dom.window.NodeFilter;

import {
  Store,
  Signal,
  effect,
  html,
  render,
  createTickState,
  registerFilter,
} from '../core/index.js';

describe('pix-vanilla-reactive bootstrap', () => {
  it('renders a store-driven todo view and reacts to mutations', async () => {
    registerFilter('upper', (v) => String(v).toUpperCase());

    // 1. store + tick bridge
    const store = new Store({
      title: 'pix',
      todos: [
        { id: 1, title: 'one', done: false },
        { id: 2, title: 'two', done: true },
      ],
    });
    const tick = createTickState(store);

    // 2. derived render context (must read tick)
    const renderContext = new Signal.Computed(() => {
      tick.get();
      return store.snapshot();
    });

    // 3. mount
    const root = document.createElement('div');
    document.body.appendChild(root);
    const dispose = effect(() => {
      const ctx = renderContext.get();
      const view = html`
        <h1>{{ title | upper }}</h1>
        <ul>
          <for each="todo in todos">
            <li data-done="{{ todo.done }}">{{ todo.title }}</li>
          </for>
        </ul>
      `;
      view._context = ctx;
      render(view, root);
    });

    assert.equal(root.querySelector('h1').textContent, 'PIX');
    assert.equal(root.querySelectorAll('li').length, 2);

    // 4. mutate the store → re-render on microtask flush
    store.state.todos.push({ id: 3, title: 'three', done: false });
    store.state.title = 'galaxy';
    await Promise.resolve();
    assert.equal(root.querySelector('h1').textContent, 'GALAXY');
    assert.equal(root.querySelectorAll('li').length, 3);

    dispose();
  });

  it('two-way model binding drives store state back into the view', async () => {
    const store = new Store({ name: 'Ada' });
    const tick = createTickState(store);

    const context = new Signal.Computed(() => {
      tick.get();
      return store.snapshot();
    });

    const root = document.createElement('div');
    document.body.appendChild(root);
    const dispose = effect(() => {
      const ctx = context.get();
      const view = html`
        <input
          model=${{
            get: () => store.state.name,
            set: (v) => {
              store.state.name = v;
            },
          }}
        />
        <p>{{ name }}</p>
      `;
      view._context = ctx;
      render(view, root);
    });

    const input = root.querySelector('input');
    assert.equal(input.value, 'Ada');

    input.value = 'Grace';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    assert.equal(store.get('name'), 'Grace');

    await Promise.resolve();
    assert.equal(root.querySelector('p').textContent, 'Grace');
    dispose();
  });
});
