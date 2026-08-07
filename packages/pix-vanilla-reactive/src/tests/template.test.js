/**
 * Template engine tests - DOM via jsdom.
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
globalThis.CustomEvent = dom.window.CustomEvent;
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.NodeFilter = dom.window.NodeFilter;

import { html, render, model, repeat } from '../core/template-engine/index.js';
import { Signal, effect } from '../core/signals/index.js';

/** Tagged helper: mount a template result (no data context). */
function mount(strings, ...values) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const result = html(strings, ...values);
  result._context = {};
  render(result, container);
  return container;
}

/**
 * Tagged helper factory: mount with an attached data context.
 * Usage: `withContext(ctx)\`<p>{{ x }}</p>\``
 * @param {object} context
 */
function withContext(context) {
  return (strings, ...values) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const result = html(strings, ...values);
    result._context = context;
    render(result, container);
    return container;
  };
}

describe('render + ${} slots', () => {
  it('renders text values', () => {
    const container = mount`<p>Hello ${'world'}</p>`;
    assert.equal(container.textContent, 'Hello world');
  });

  it('updates in place when a signal value changes', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const value = new Signal.State('a');
    const result = html`<p>${value}</p>`;
    render(result, container);
    assert.equal(container.textContent, 'a');
    value.set('b');
    assert.equal(container.textContent, 'b');
  });

  it('binds events with @click=${fn}', () => {
    let clicks = 0;
    const container = mount`<button @click=${() => clicks++}>go</button>`;
    container.querySelector('button').click();
    assert.equal(clicks, 1);
  });

  it('sets DOM properties with .prop=${value}', () => {
    const container = mount`<input .value=${'typed'} />`;
    assert.equal(container.querySelector('input').value, 'typed');
  });

  it('sets attributes and removes them on falsy values', () => {
    const container = mount`<div class=${'box'} data-x=${false}>x</div>`;
    assert.equal(container.querySelector('div').getAttribute('class'), 'box');
    assert.equal(container.querySelector('div').hasAttribute('data-x'), false);
  });
});

describe('{{ }} expressions', () => {
  it('resolves from the attached context with filters', () => {
    const container = withContext({ title: 'hello' })`<h1>{{ title | upper }}</h1>`;
    assert.equal(container.textContent, 'HELLO');
  });

  it('escapes HTML by default and allows | raw', () => {
    const context = { html: '<b>bold</b>' };
    const escaped = withContext(context)`<p>{{ html }}</p>`;
    assert.equal(escaped.textContent, '<b>bold</b>');
    assert.equal(escaped.querySelector('b'), null);

    const raw = withContext(context)`<p>{{ html | raw }}</p>`;
    assert.ok(raw.querySelector('b'), 'raw filter parses HTML');
  });

  it('updates {{ }} when the expression resolves to a signal', () => {
    const name = new Signal.State('Ada');
    const container = withContext({ name })`<p>{{ name }}</p>`;
    assert.equal(container.textContent, 'Ada');
    name.set('Grace');
    assert.equal(container.textContent, 'Grace');
  });

  it('resolves {{ }} in attribute values', () => {
    const container = withContext({
      cls: 'is-active',
      n: 3,
    })`<div class="{{ cls }}" data-n="{{ n }}">x</div>`;
    const div = container.querySelector('div');
    assert.equal(div.getAttribute('class'), 'is-active');
    assert.equal(div.getAttribute('data-n'), '3');
  });
});

describe('repeat() directive', () => {
  it('renders items and reconciles by key', () => {
    const container = mount(
      ['<ul>', '</ul>'],
      repeat(
        [
          { id: 1, label: 'a' },
          { id: 2, label: 'b' },
        ],
        (item) => item.id,
        (item) => html`<li>${item.label}</li>`
      )
    );
    assert.deepEqual(
      [...container.querySelectorAll('li')].map((li) => li.textContent),
      ['a', 'b']
    );
  });

  it('updates on signal changes', () => {
    const items = new Signal.State([{ id: 1, label: 'a' }]);
    const container = mount(
      ['<ul>', '</ul>'],
      repeat(
        items,
        (item) => item.id,
        (item) => html`<li>${item.label}</li>`
      )
    );
    assert.equal(container.querySelectorAll('li').length, 1);
    items.set([
      { id: 1, label: 'a' },
      { id: 2, label: 'b' },
    ]);
    assert.equal(container.querySelectorAll('li').length, 2);
    items.set([{ id: 2, label: 'b' }]);
    assert.equal(container.querySelectorAll('li').length, 1);
    assert.equal(container.querySelector('li').textContent, 'b');
  });
});

describe('model directive (two-way binding)', () => {
  it('syncs input → config.set and config.get → input', () => {
    const state = new Signal.State('hello');
    const container = mount`<input model=${{
      signal: state,
      get: () => state.get(),
      set: (v) => state.set(v),
    }} />`;
    const input = container.querySelector('input');
    assert.equal(input.value, 'hello');

    input.value = 'world';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    assert.equal(state.get(), 'world');

    state.set('again');
    assert.equal(input.value, 'again');
  });
});

describe('<for>/<if> string blocks', () => {
  it('renders <for each="item in items"> in string templates', () => {
    const container = withContext({
      todos: ['a', 'b'],
    })`<ul><for each="todo in todos"><li>{{ todo }}</li></for></ul>`;
    assert.deepEqual(
      [...container.querySelectorAll('li')].map((li) => li.textContent),
      ['a', 'b']
    );
  });

  it('renders <if condition="..."> and hides when falsy', () => {
    const shown = withContext({ done: true })`<p><if condition="done">done!</if></p>`;
    assert.ok(shown.textContent.includes('done!'));
    const hidden = withContext({ done: false })`<p><if condition="done">done!</if></p>`;
    assert.ok(!hidden.textContent.includes('done!'));
  });
});

describe('effect-driven rendering', () => {
  it('re-renders the view when a signal changes', async () => {
    const count = new Signal.State(0);
    const container = document.createElement('div');
    document.body.appendChild(container);

    const dispose = effect(() => {
      const view = html`<p>Count: ${count.get()}</p>`;
      render(view, container);
    });
    assert.equal(container.textContent, 'Count: 0');

    count.set(3);
    await Promise.resolve(); // microtask flush
    assert.equal(container.textContent, 'Count: 3');
    dispose();
  });
});
