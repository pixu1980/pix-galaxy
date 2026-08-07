/**
 * Explicit Resource Management tests: Symbol.dispose integration,
 * DisposableStack / AsyncDisposableStack semantics.
 *
 * The framework targets Safari 17.5+ where `using` syntax and
 * `Symbol.dispose` may be absent - so every feature here must also work
 * through the plain `.dispose()` / `.dispose()`-stack API.
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

import {
  DISPOSE,
  ASYNC_DISPOSE,
  makeDisposable,
  DisposableStack,
  AsyncDisposableStack,
} from '../core/disposable/index.js';
import { html, render } from '../core/template-engine/index.js';
import { Signal, effect } from '../core/signals/index.js';
import { Store } from '../core/store/index.js';

describe('makeDisposable', () => {
  it('produces a callable handle with .dispose()', () => {
    let cleaned = 0;
    const handle = makeDisposable(() => cleaned++);
    handle.dispose();
    handle.dispose(); // idempotent by contract of the caller's callback
    handle(); // callable form (back-compat)
    assert.equal(cleaned, 3);
  });

  it('attaches Symbol.dispose when the engine has it', () => {
    const handle = makeDisposable(() => {});
    if (typeof DISPOSE === 'symbol') {
      assert.equal(typeof handle[DISPOSE], 'function');
      assert.equal(handle[DISPOSE], handle.dispose);
    }
  });
});

describe('effect() disposer', () => {
  it('is callable and Symbol.dispose-ready', () => {
    const s = new Signal.State(0);
    const dispose = effect(() => s.get());
    assert.equal(s.subscribers.size, 1);
    if (typeof DISPOSE === 'symbol') {
      dispose[DISPOSE]();
      assert.equal(s.subscribers.size, 0, 'symbol dispose stops the effect');
    } else {
      dispose();
      assert.equal(s.subscribers.size, 0);
    }
  });
});

describe('Store.subscribe disposer', () => {
  it('unsubscribes via .dispose() and Symbol.dispose', () => {
    const store = new Store({ n: 0 });
    let calls = 0;
    const unsubscribe = store.subscribe(() => calls++);
    store.state.n = 1;
    assert.equal(calls, 1);
    if (typeof DISPOSE === 'symbol') unsubscribe[DISPOSE]();
    else unsubscribe.dispose();
    store.state.n = 2;
    assert.equal(calls, 1, 'no notifications after dispose');
  });
});

describe('render() mount disposer', () => {
  it('returns a disposer that unmounts and frees subscriptions', () => {
    const sig = new Signal.State(0);
    const container = document.createElement('div');
    document.body.appendChild(container);
    const view = render(html`<p>${sig}</p>`, container);
    assert.equal(sig.subscribers.size, 1);
    view.dispose();
    assert.equal(sig.subscribers.size, 0);
    assert.equal(container.textContent, '', 'content cleared');
  });

  it('works with DisposableStack.defer() for scoped teardown', () => {
    const sig = new Signal.State(0);
    const container = document.createElement('div');
    document.body.appendChild(container);
    const stack = new DisposableStack();
    stack.defer(() => render(null, container));
    render(html`<p>${sig}</p>`, container);
    assert.equal(sig.subscribers.size, 1);
    stack.dispose();
    assert.equal(sig.subscribers.size, 0);
  });
});

describe('DisposableStack', () => {
  it('disposes in reverse registration order', () => {
    const order = [];
    const stack = new DisposableStack();
    stack.defer(() => order.push('a'));
    stack.defer(() => order.push('b'));
    stack.defer(() => order.push('c'));
    stack.dispose();
    assert.deepEqual(order, ['c', 'b', 'a']);
  });

  it('use()/adopt()/defer() cover the three resource shapes', () => {
    const calls = [];
    const stack = new DisposableStack();
    stack.use({ dispose: () => calls.push('use') });
    stack.adopt(42, (v) => calls.push(`adopt:${v}`));
    stack.defer(() => calls.push('defer'));
    stack.dispose();
    assert.deepEqual(calls, ['defer', 'adopt:42', 'use']);
  });

  it('double dispose is a no-op', () => {
    let calls = 0;
    const stack = new DisposableStack();
    stack.defer(() => calls++);
    stack.dispose();
    stack.dispose();
    assert.equal(calls, 1);
  });

  it('move() transfers ownership without disposing', () => {
    let calls = 0;
    const stack = new DisposableStack();
    stack.defer(() => calls++);
    const moved = stack.move();
    assert.equal(stack.disposed, true);
    assert.equal(calls, 0, 'move() does not dispose');
    moved.dispose();
    assert.equal(calls, 1, 'moved stack owns cleanup');
  });

  it('throws on use() after dispose', () => {
    const stack = new DisposableStack();
    stack.dispose();
    assert.throws(() => stack.defer(() => {}), /already disposed/);
  });

  it('aggregates disposal errors with .suppressed', () => {
    const stack = new DisposableStack();
    stack.defer(() => {
      throw new Error('first');
    });
    stack.defer(() => {
      throw new Error('second');
    });
    try {
      stack.dispose();
      assert.fail('should throw');
    } catch (err) {
      assert.equal(err.message, 'second', 'last-registered runs first and throws');
      assert.equal(err.suppressed.length, 1);
      assert.equal(err.suppressed[0].message, 'first');
    }
  });
});

describe('AsyncDisposableStack', () => {
  it('awaits async cleanup in reverse order', async () => {
    const order = [];
    const stack = new AsyncDisposableStack();
    stack.defer(async () => {
      await Promise.resolve();
      order.push('async-a');
    });
    stack.defer(() => order.push('sync-b'));
    await stack.dispose();
    assert.deepEqual(order, ['sync-b', 'async-a']);
  });

  it('exposes Symbol.asyncDispose when available', () => {
    const stack = new AsyncDisposableStack();
    if (typeof ASYNC_DISPOSE === 'symbol') {
      assert.equal(typeof stack[ASYNC_DISPOSE], 'function');
    }
  });
});

describe('class-level Symbol.dispose aliases', () => {
  it('parts and template instances alias dispose()', async () => {
    const { Part, TemplateInstance, ChildNodePart } = await import(
      '../core/template-engine/index.js'
    );
    for (const cls of [Part, ChildNodePart, TemplateInstance]) {
      if (typeof DISPOSE === 'symbol') {
        assert.equal(
          cls.prototype[DISPOSE],
          cls.prototype.dispose,
          `${cls.name} aliases Symbol.dispose to dispose()`
        );
      } else {
        assert.equal(typeof cls.prototype.dispose, 'function', `${cls.name} keeps dispose()`);
      }
    }
  });
});
