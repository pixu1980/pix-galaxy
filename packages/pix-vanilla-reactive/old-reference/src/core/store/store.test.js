/**
 * Store tests.
 *
 * @module core/store/store.test
 */

import { describe, expect, it } from "vitest";

import { Store } from "./index.js";

describe("Store", () => {
  it("reads and writes by dot-path", () => {
    const store = new Store({ user: { name: "Ada" }, todos: [] });

    expect(store.get("user.name")).toBe("Ada");
    store.set("user.name", "Grace");
    expect(store.get("user.name")).toBe("Grace");
  });

  it("emits store:change with path, old and new value on direct mutation", () => {
    const target = new EventTarget();
    const store = new Store({ count: 1 }, { eventTarget: target });
    const events = [];

    target.addEventListener("store:change", (event) => events.push(event.detail));
    store.state.count = 2;

    expect(events).toEqual([{ path: "count", oldValue: 1, newValue: 2 }]);
  });

  it("does not emit when the value is unchanged", () => {
    const target = new EventTarget();
    const store = new Store({ count: 1 }, { eventTarget: target });
    let calls = 0;

    target.addEventListener("store:change", () => (calls += 1));
    store.state.count = 1;

    expect(calls).toBe(0);
  });

  it("update transforms the current value", () => {
    const store = new Store({ count: 10 });

    store.update("count", (current) => current + 5);
    expect(store.get("count")).toBe(15);
  });

  it("snapshot is a detached deep clone", () => {
    const store = new Store({ nested: { list: [1, 2] } });
    const snap = store.snapshot();

    store.state.nested.list = [1, 2, 3];
    expect(snap.nested.list).toEqual([1, 2]);
  });

  it("subscribe receives change details and can unsubscribe", () => {
    const store = new Store({ a: 1 }, { eventTarget: new EventTarget() });
    const seen = [];
    const off = store.subscribe((detail) => seen.push(detail.path));

    store.state.a = 2;
    off();
    store.state.a = 3;

    expect(seen).toEqual(["a"]);
  });
});
