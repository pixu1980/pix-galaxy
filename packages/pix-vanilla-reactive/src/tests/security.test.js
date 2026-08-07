/**
 * Security regression tests.
 *
 * Guards the two properties every template/store must enforce:
 * 1. `{{ }}` values are HTML-escaped by default (XSS); `| raw` is the
 *    explicit trusted-HTML escape hatch.
 * 2. The Store refuses keys that could reach the prototype chain
 *    (prototype pollution).
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

import { html, render } from '../core/template-engine/index.js';
import { Store } from '../core/store/index.js';

const XSS_PAYLOAD = '<img src=x onerror="window.__pwned=1">';

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

describe('XSS - ${} slots and {{ }} expressions', () => {
  it('${} slots render values as text nodes', () => {
    const container = withContext({})`<p>${XSS_PAYLOAD}</p>`;
    assert.equal(container.querySelector('img'), null);
    assert.ok(container.textContent.includes(XSS_PAYLOAD), 'payload visible as text');
  });

  it('{{ }} expressions escape HTML by default', () => {
    const container = withContext({ payload: XSS_PAYLOAD })`<p>{{ payload }}</p>`;
    assert.equal(container.querySelector('img'), null);
    assert.ok(container.textContent.includes('<img'), 'payload visible as escaped text');
  });

  it('attribute {{ }} values cannot break out of the attribute', () => {
    const payload = '" onmouseover="pwn() x="';
    const container = withContext({ payload })`<div data-x="{{ payload }}">y</div>`;
    const div = container.querySelector('div');
    assert.equal(div.getAttribute('onmouseover'), null, 'no attribute breakout');
    assert.equal(div.getAttribute('data-x'), payload, 'value stored verbatim via setAttribute');
  });
});

describe('XSS - <for>/<if> string blocks', () => {
  it('{{ }} inside <for> is escaped by default', () => {
    const container = withContext({ todos: [{ id: 1, title: XSS_PAYLOAD }] })`
      <ul><for each="todo in todos"><li>{{ todo.title }}</li></for></ul>`;
    assert.equal(container.querySelector('img'), null, 'no element injection');
    assert.ok(container.querySelector('li').textContent.includes('<img'));
  });

  it('{{ }} inside <if> is escaped by default', () => {
    const container = withContext({ done: true, body: XSS_PAYLOAD })`
      <p><if condition="done">{{ body }}</if></p>`;
    assert.equal(container.querySelector('img'), null);
  });

  it('| raw is the explicit trusted-HTML escape hatch', () => {
    const container = withContext({ todos: [{ id: 1, body: '<b>bold</b>' }] })`
      <p><for each="t in todos">{{ t.body | raw }}</for></p>`;
    assert.ok(container.querySelector('b'), 'raw filter renders HTML');
  });

  it('escapeHtml filter double-encodes raw sources safely', () => {
    const container = withContext({ body: '<b>bold</b>' })`
      <p>{{ body | escapeHtml }}</p>`;
    assert.equal(container.querySelector('b'), null, 'no element from escaped source');
    assert.ok(container.textContent.includes('&lt;b&gt;'));
  });
});

describe('Store - prototype pollution guard', () => {
  it('store.set blocks __proto__/prototype/constructor paths', () => {
    const store = new Store({});
    for (const path of [
      '__proto__.polluted',
      'prototype.polluted',
      'constructor.prototype.polluted',
    ]) {
      assert.throws(() => store.set(path, 'yes'), TypeError, `path "${path}" blocked`);
    }
    assert.equal({}.polluted, undefined, 'Object.prototype stays clean');
  });

  it('proxy mutation blocks reserved keys', () => {
    const store = new Store({});
    assert.throws(() => {
      store.state.__proto__ = { hacked: true };
    }, TypeError);
    assert.throws(() => {
      delete store.state.__proto__;
    }, TypeError);
    assert.equal({}.hacked, undefined);
  });

  it('reserved keys remain readable (no proxy wrap, no crash)', () => {
    const store = new Store({});
    assert.equal(store.state.__proto__, Object.prototype);
    assert.equal(store.state.constructor, Object);
  });

  it('legitimate nested state still works', () => {
    const store = new Store({ user: { name: 'Ada' } });
    store.state.user.name = 'Grace';
    store.set('user.age', 36);
    assert.deepEqual(store.snapshot(), { user: { name: 'Grace', age: 36 } });
  });
});
