# Getting Started

`@pix-galaxy/pix-vanilla-reactive` is a zero-runtime-dependency reactive UI
framework: a Proxy **Store**, fine-grained **Signals**, an `html` tagged
**template engine**, and the store↔signal **bridge**. No build step required
beyond a bundler-friendly ESM artifact.

```bash
pnpm add @pix-galaxy/pix-vanilla-reactive
```

## Minimal counter

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
  tick.get(); // read the bridge so the computed re-runs on store changes
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

## What you get

| Piece    | API                                           | Role                                               |
| -------- | --------------------------------------------- | -------------------------------------------------- |
| Store    | `new Store(state)`                            | Proxy-based state container, `store:change` events |
| Signals  | `Signal.State`, `Signal.Computed`, `effect()` | Fine-grained reactivity, microtask batching        |
| Template | `html\`\``, `render()`, `model`, `repeat`     | DOM rendering with incremental updates             |
| Bridge   | `createTickState(store)`                      | Store → signals notification                       |

Works with plain custom elements - see the How It Works page.
