# @pix-galaxy/pix-vanilla-reactive

Zero-runtime-dependency reactive UI framework for the pix-galaxy suite.

**No frameworks, no virtual DOM, no build step.** Proxy **Store**, fine-grained
**Signals**, an `html` tagged **template engine**, and a store↔signal **bridge**
that makes browser-native custom elements reactive.

## Security

`{{ }}` and `${}` values are HTML-escaped by default; `| raw` is the explicit
trusted-HTML escape hatch. The Store blocks prototype-chain keys
(`__proto__`, `prototype`, `constructor`). See `src/docs/content/how-it-works.md`.

## Examples

Open `examples/` with any static server — no build step:

```bash
npx serve examples/     # then open /counter.html, /todo.html, /form.html
```

## Install

```bash
pnpm add @pix-galaxy/pix-vanilla-reactive
```

## Quick start

```js
import {
  Store,
  Signal,
  effect,
  html,
  render,
  createTickState,
} from '@pix-galaxy/pix-vanilla-reactive';

const store = new Store({ count: 0 });
const tick = createTickState(store); // every store write bumps this signal

const view = new Signal.Computed(() => {
  tick.get();
  const result = html`
    <p>Count: {{ count }}</p>
    <button
      @click=${() => {
        store.state.count += 1;
      }}
    >
      +1
    </button>
  `;
  result._context = store.snapshot();
  return result;
});

effect(() => render(view.get(), document.querySelector('#app')));
```

## Modules

| Module          | API                                                                   |
| --------------- | --------------------------------------------------------------------- |
| Store           | `Store`, `deepClone`, `toPathArray`, …                                |
| Signals         | `Signal.State`, `Signal.Computed`, `effect`, `isSignalLike`, …        |
| Template engine | `html`, `render`, `model`, `repeat`, `directive`, `registerFilter`, … |
| Bridge          | `createTickState(store)`                                              |

## How it works

- **Store** — a `Proxy`-wrapped state tree; mutations fire `store:change`.
- **Signals** — `State` (writable), `Computed` (lazy derived), `effect`
  (auto-tracked side effects), batched on the microtask queue.
- **Template engine** — `html\`\``results render incrementally into the DOM
via parts;`{{ expr | filter }}`for data,`${value}` for JS values.
- **Bridge** — `createTickState` converts store writes into signal
  notifications, so computed views re-render on any mutation.

## Docs

Run `pnpm dev` in this package for the docs site, or see
`src/docs/content/` for getting-started, API, and examples pages.

## License

MIT
