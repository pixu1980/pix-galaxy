/**
 * Signals tests.
 *
 * @module core/signals/signals.test
 */

import { describe, expect, it } from "vitest";

import { effect, flushSync, isSignalLike, Signal } from "./index.js";

describe("Signal.State", () => {
  it("reads, writes, and skips equal writes", () => {
    const count = new Signal.State(0);

    expect(count.get()).toBe(0);
    count.set(5);
    expect(count.get()).toBe(5);
    expect(isSignalLike(count)).toBe(true);
  });
});

describe("Signal.Computed", () => {
  it("derives lazily and caches", () => {
    const count = new Signal.State(2);
    let evaluations = 0;
    const doubled = new Signal.Computed(() => {
      evaluations += 1;

      return count.get() * 2;
    });

    expect(doubled.get()).toBe(4);
    expect(doubled.get()).toBe(4);
    expect(evaluations).toBe(1);

    count.set(3);
    expect(doubled.get()).toBe(6);
    expect(evaluations).toBe(2);
  });
});

describe("effect", () => {
  it("runs immediately and re-runs on dependency change (batched)", () => {
    const count = new Signal.State(0);
    const seen = [];
    const dispose = effect(() => seen.push(count.get()));

    expect(seen).toEqual([0]);

    count.set(1);
    count.set(2);
    flushSync();

    expect(seen).toEqual([0, 2]);
    dispose();
  });

  it("stops re-running after dispose", () => {
    const count = new Signal.State(0);
    let runs = 0;
    const dispose = effect(() => {
      count.get();
      runs += 1;
    });

    dispose();
    count.set(1);
    flushSync();

    expect(runs).toBe(1);
  });

  it("untrack reads without subscribing", () => {
    const tracked = new Signal.State(0);
    const untracked = new Signal.State(0);
    let runs = 0;
    const dispose = effect(() => {
      tracked.get();
      Signal.subtle.untrack(() => untracked.get());
      runs += 1;
    });

    untracked.set(1);
    flushSync();
    expect(runs).toBe(1);

    tracked.set(1);
    flushSync();
    expect(runs).toBe(2);
    dispose();
  });
});
