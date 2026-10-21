/**
 * Template-engine tests: interpolation, expressions, attribute families,
 * directives, and end-to-end reactive rendering.
 *
 * @module core/template-engine/template.test
 */

import { beforeEach, describe, expect, it } from "vitest";

import { effect, flushSync, Signal } from "../signals/index.js";
import { Store } from "../store/index.js";
import { html, rawHtml, render } from "./index.js";

/**
 * Create a detached container attached to the document body.
 *
 * @returns {HTMLElement} Fresh container.
 */
function makeContainer() {
  const container = document.createElement("div");

  document.body.appendChild(container);

  return container;
}

describe("template engine — values and expressions", () => {
  let container;

  beforeEach(() => {
    container = makeContainer();
  });

  it("renders ${} text and reuses the text node across updates", () => {
    const view = (name) => html`<p>${name}</p>`;

    render(view("Ada"), container);
    const textNode = container.querySelector("p").firstChild;

    render(view("Grace"), container);
    expect(container.querySelector("p").textContent).toBe("Grace");
    expect(container.querySelector("p").firstChild).toBe(textNode);
  });

  it("evaluates {{ expr | filter }} against context", () => {
    const result = html`<h1>{{ title | upper }}</h1><dd>{{ count }}</dd>`;

    result._context = { title: "playground", count: 31 };
    render(result, container);

    expect(container.querySelector("h1").textContent).toBe("PLAYGROUND");
    expect(container.querySelector("dd").textContent).toBe("31");
  });

  it("sets a plain attribute from ${} and toggles it off for null", () => {
    const view = (value) => html`<a href=${value}>link</a>`;

    render(view("#x"), container);
    expect(container.querySelector("a").getAttribute("href")).toBe("#x");

    render(view(null), container);
    expect(container.querySelector("a").hasAttribute("href")).toBe(false);
  });

  it("binds @event handlers and rebinds on change", () => {
    let count = 0;
    const inc = () => (count += 1);
    const view = (handler) => html`<button @click=${handler}>go</button>`;

    render(view(inc), container);
    container.querySelector("button").click();
    expect(count).toBe(1);

    render(view(null), container);
    container.querySelector("button").click();
    expect(count).toBe(1);
  });

  it("injects trusted markup via rawHtml", () => {
    const result = html`<section>${rawHtml('<strong id="raw">hi</strong>')}</section>`;

    render(result, container);
    expect(container.querySelector("#raw")).not.toBeNull();
    expect(container.querySelector("#raw").textContent).toBe("hi");
  });

  it("renders nested template results", () => {
    const badge = (label) => html`<span class="b">${label}</span>`;
    const view = (label) => html`<div>${badge(label)}</div>`;

    render(view("alpha"), container);
    expect(container.querySelector("div span").textContent).toBe("alpha");
  });
});

describe("template engine — directives", () => {
  let container;

  beforeEach(() => {
    container = makeContainer();
  });

  it("<for> inner-template mode repeats with child context", () => {
    const view = (ctx) => {
      const result = html`<ul><for each="item in items"><li>{{ item.label }}</li></for></ul>`;

      result._context = ctx;

      return result;
    };

    render(view({ items: [{ label: "a" }, { label: "b" }] }), container);
    expect([...container.querySelectorAll("li")].map((li) => li.textContent)).toEqual(["a", "b"]);
  });

  it("<for of> component mode reconciles by key and preserves elements", () => {
    const Item = { render: (item) => html`<li data-id=${item.id}>${item.label}</li>` };
    const view = (items) => {
      const result = html`<ul><for each="item in items" of="Item" key="id"></for></ul>`;

      result._context = { items, Item };

      return result;
    };

    render(view([{ id: 1, label: "one" }, { id: 2, label: "two" }]), container);
    const firstLi = container.querySelector('[data-id="1"]');

    render(view([{ id: 2, label: "two" }, { id: 1, label: "one!" }]), container);

    expect([...container.querySelectorAll("li")].map((li) => li.getAttribute("data-id"))).toEqual(["2", "1"]);
    expect(container.querySelector('[data-id="1"]')).toBe(firstLi);
    expect(firstLi.textContent).toBe("one!");
  });

  it("<if> mounts and unmounts its body", () => {
    const view = (show) => {
      const result = html`<section><if condition="show"><p>here</p></if></section>`;

      result._context = { show };

      return result;
    };

    render(view(true), container);
    expect(container.querySelector("p")).not.toBeNull();

    render(view(false), container);
    expect(container.querySelector("p")).toBeNull();
  });
});

describe("template engine — reactive wiring", () => {
  it("re-renders through Store → tickState → effect and keeps the input element", async () => {
    const container = makeContainer();
    const store = new Store({ query: "" }, { eventTarget: new EventTarget() });
    const tickState = new Signal.State(0, { equals: () => false });

    store.subscribe(() => tickState.set(1));

    const queryModel = {
      get: () => store.state.query,
      set: (value) => {
        store.state.query = value;
      },
    };

    const renderContext = new Signal.Computed(() => {
      tickState.get();

      return { query: store.state.query, queryModel };
    });

    const dispose = effect(() => {
      const ctx = renderContext.get();
      const result = html`<label><input type="search" model=${ctx.queryModel} /><output>{{ query }}</output></label>`;

      result._context = ctx;
      render(result, container);
    });

    const input = container.querySelector("input");

    input.value = "btn";
    input.dispatchEvent(new Event("input"));
    flushSync();

    expect(store.state.query).toBe("btn");
    expect(container.querySelector("output").textContent).toBe("btn");
    expect(container.querySelector("input")).toBe(input);

    dispose();
  });
});

describe("template engine — app-shaped shell", () => {
  it("renders select options, a model value, a keyed grid, metrics, and empty state", () => {
    const container = makeContainer();
    const Card = { render: (item) => html`<component-card data-id=${item.id}>${item.name}</component-card>` };
    const cats = ["All", "Forms"];
    let category = "All";
    const catModel = {
      get: () => category,
      set: (value) => {
        category = value;
      },
    };
    const view = (components) => {
      const result = html`<main>
        <dl><dd>{{ count }}</dd></dl>
        <select model=${catModel}>${cats.map((cat) => html`<option value=${cat}>${cat}</option>`)}</select>
        <section><for each="component in components" of="Card" key="id"></for></section>
        ${components.length === 0 ? html`<p data-part="empty">none</p>` : ""}
      </main>`;

      result._context = { count: components.length, components, Card };

      return result;
    };

    render(view([]), container);

    expect(container.querySelectorAll("select option")).toHaveLength(2);
    expect(container.querySelector("select").value).toBe("All");
    expect(container.querySelector("dd").textContent).toBe("0");
    expect(container.querySelector('[data-part="empty"]')).not.toBeNull();
    expect(container.querySelectorAll("component-card")).toHaveLength(0);

    render(view([{ id: "button", name: "Button" }]), container);

    expect(container.querySelector("dd").textContent).toBe("1");
    expect(container.querySelectorAll("component-card")).toHaveLength(1);
    expect(container.querySelector("component-card").textContent).toBe("Button");
    expect(container.querySelector('[data-part="empty"]')).toBeNull();
  });
});
