/**
 * Store unit tests — uses the Node 20+ global CustomEvent / EventTarget.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  Store,
  STORE_CHANGE_EVENT,
  deepClone,
  toPathArray,
  pathToString,
} from '../core/store/index.js';

describe('Store', () => {
  it('deep-clones the initial state (no shared references)', () => {
    const initial = { nested: { list: [1, 2] } };
    const store = new Store(initial);
    initial.nested.list.push(3);
    assert.deepEqual(store.snapshot(), { nested: { list: [1, 2] } });
  });

  it('mutations through the proxy emit store:change with path + values', () => {
    const store = new Store({ a: { b: 1 } });
    const changes = [];
    const unsubscribe = store.subscribe((detail) => changes.push(detail));

    store.state.a.b = 2;
    assert.equal(changes.length, 1);
    assert.equal(changes[0].path, 'a.b');
    assert.equal(changes[0].oldValue, 1);
    assert.equal(changes[0].newValue, 2);
    unsubscribe();
  });

  it('immutable array replacement is the supported mutation style', () => {
    const store = new Store({ todos: [] });
    store.state.todos = [...store.state.todos, { id: 1, title: 'x' }];
    assert.deepEqual(store.snapshot(), { todos: [{ id: 1, title: 'x' }] });
  });

  it('get()/set() by dot-path', () => {
    const store = new Store({ user: { name: 'Ada' } });
    assert.equal(store.get('user.name'), 'Ada');
    store.set('user.name', 'Grace');
    assert.equal(store.get('user.name'), 'Grace');
    assert.equal(store.snapshot().user.name, 'Grace');
  });

  it('set() creates intermediate objects', () => {
    const store = new Store({});
    store.set('a.b.c', 42);
    assert.equal(store.get('a.b.c'), 42);
  });

  it('update(path, fn) derives from the current value', () => {
    const store = new Store({ count: 1 });
    store.update('count', (n) => n + 1);
    assert.equal(store.get('count'), 2);
  });

  it('deleteProperty emits a change', () => {
    const store = new Store({ a: 1, b: 2 });
    const changes = [];
    store.subscribe((d) => changes.push(d));
    delete store.state.a;
    assert.deepEqual(store.snapshot(), { b: 2 });
    assert.equal(changes.length, 1);
    assert.equal(changes[0].path, 'a');
  });

  it('replace() swaps the whole tree with a single change event', () => {
    const store = new Store({ a: 1 });
    const changes = [];
    store.subscribe((d) => changes.push(d));
    store.replace({ z: 9 });
    assert.deepEqual(store.snapshot(), { z: 9 });
    assert.equal(changes.length, 1);
    assert.equal(changes[0].path, '');
  });

  it('snapshot() returns a detached deep clone', () => {
    const store = new Store({ list: [{ n: 1 }] });
    const snap = store.snapshot();
    snap.list.push({ n: 2 });
    assert.deepEqual(store.snapshot(), { list: [{ n: 1 }] });
  });

  it('dispatches store:change CustomEvent on the events target', () => {
    const eventsTarget = new EventTarget();
    const store = new Store({ v: 0 }, { eventsTarget });
    let received = null;
    eventsTarget.addEventListener(STORE_CHANGE_EVENT, (e) => {
      received = e.detail;
    });
    store.state.v = 5;
    assert.equal(received.path, 'v');
    assert.equal(received.newValue, 5);
  });

  it('works without window (SSR-safe default target)', () => {
    const store = new Store({ n: 1 });
    store.state.n = 2;
    assert.equal(store.get('n'), 2);
  });
});

describe('store helpers', () => {
  it('deepClone preserves Date/Map/Set and breaks cycles', () => {
    const original = { when: new Date(0), map: new Map([['k', 1]]), set: new Set([1, 2]) };
    original.self = original;
    const clone = deepClone(original);
    assert.notEqual(clone, original);
    assert.equal(clone.when.getTime(), 0);
    assert.equal(clone.map.get('k'), 1);
    assert.ok(clone.set.has(2));
    assert.equal(clone.self, clone, 'cycle resolves to the clone');
  });

  it('path helpers normalize dot-paths and arrays', () => {
    assert.deepEqual(toPathArray('a.b.c'), ['a', 'b', 'c']);
    assert.deepEqual(toPathArray(['a']), ['a']);
    assert.deepEqual(toPathArray(''), []);
    assert.equal(pathToString(['a', 'b']), 'a.b');
  });
});
