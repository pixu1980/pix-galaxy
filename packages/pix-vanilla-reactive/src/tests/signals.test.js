/**
 * Signals unit tests - no DOM required.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  Signal,
  effect,
  isSignalLike,
  StateSignal,
  ComputedSignal,
  schedule,
} from '../core/signals/index.js';

describe('StateSignal', () => {
  it('get/set roundtrip with Object.is equality', () => {
    const s = new StateSignal(0);
    assert.equal(s.get(), 0);
    assert.equal(s.set(5), 5);
    assert.equal(s.get(), 5);
  });

  it('does not notify when the value is unchanged', () => {
    const s = new StateSignal(0);
    let calls = 0;
    s.subscribe(() => calls++);
    s.set(0);
    assert.equal(calls, 0);
    s.set(1);
    assert.equal(calls, 1);
  });

  it('always notifies when equals: () => false (tick pattern)', () => {
    const s = new StateSignal(0, { equals: () => false });
    let calls = 0;
    s.subscribe(() => calls++);
    s.set(0);
    s.set(0);
    assert.equal(calls, 2);
  });

  it('peek reads without tracking', () => {
    const s = new StateSignal(1);
    assert.equal(s.peek(), 1);
  });
});

describe('ComputedSignal', () => {
  it('lazily evaluates and caches', () => {
    const base = new StateSignal(2);
    let evals = 0;
    const doubled = new ComputedSignal(() => {
      evals++;
      return base.get() * 2;
    });
    assert.equal(evals, 0, 'no evaluation before first get');
    assert.equal(doubled.get(), 4);
    assert.equal(doubled.get(), 4);
    assert.equal(evals, 1, 'cached on second get');
  });

  it('re-evaluates when a dependency changes', () => {
    const base = new StateSignal(2);
    const doubled = new ComputedSignal(() => base.get() * 2);
    assert.equal(doubled.get(), 4);
    base.set(3);
    assert.equal(doubled.get(), 6);
  });

  it('chains computed signals', () => {
    const a = new StateSignal(1);
    const b = new ComputedSignal(() => a.get() + 1);
    const c = new ComputedSignal(() => b.get() * 10);
    assert.equal(c.get(), 20);
    a.set(5);
    assert.equal(c.get(), 60);
  });
});

describe('effect()', () => {
  it('runs immediately and re-runs on dependency change (batched)', async () => {
    const s = new StateSignal(0);
    const seen = [];
    const dispose = effect(() => seen.push(s.get()));
    assert.deepEqual(seen, [0]);

    s.set(1);
    s.set(2);
    await Promise.resolve(); // microtask flush
    assert.deepEqual(seen, [0, 2], 'multiple sets collapse into one run');
    dispose();
  });

  it('dispose stops the effect', async () => {
    const s = new StateSignal(0);
    const seen = [];
    const dispose = effect(() => seen.push(s.get()));
    dispose();
    s.set(1);
    await Promise.resolve();
    assert.deepEqual(seen, [0]);
  });

  it('dynamically re-collects dependencies on every run', async () => {
    const a = new StateSignal(0);
    const b = new StateSignal(0);
    const flag = new StateSignal(true);
    const seen = [];
    effect(() => {
      seen.push(flag.get() ? a.get() : b.get());
    });
    flag.set(false); // drop dependency on a, add b
    b.set(42);
    await Promise.resolve();
    assert.equal(seen[seen.length - 1], 42);
  });

  it('untrack reads inside effects do not subscribe', async () => {
    const tracked = new StateSignal(1);
    const untracked = new StateSignal(1);
    const seen = [];
    effect(() => {
      seen.push(tracked.get() + Signal.subtle.untrack(() => untracked.get()));
    });
    untracked.set(99);
    await Promise.resolve();
    assert.equal(seen.length, 1, 'untracked read does not re-run the effect');
  });
});

describe('schedule()', () => {
  it('batches by identity on the microtask queue', async () => {
    let runs = 0;
    const job = { run: () => runs++ };
    schedule(job);
    schedule(job);
    schedule(job);
    assert.equal(runs, 0);
    await Promise.resolve();
    assert.equal(runs, 1);
  });
});

describe('isSignalLike', () => {
  it('recognizes signals and rejects plain values', () => {
    assert.equal(isSignalLike(new StateSignal(0)), true);
    assert.equal(isSignalLike(new ComputedSignal(() => 1)), true);
    assert.equal(isSignalLike(5), false);
    assert.equal(isSignalLike({ get: () => 1 }), false, 'needs __isSignal brand');
  });
});
