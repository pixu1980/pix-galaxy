# How It Works

## Data flow

```
User input → model binding setter
  → Store proxy trap → store:change
  → createTickState bridge → tick.set()
  → computed invalidation → effect scheduling (microtask)
  → render() → parts write directly to DOM
```

There is **no virtual DOM**. `html\`\`` packages static strings + values; the
template engine parses each unique template once (cached) and drives live
"parts" (text slots, attributes, events, lists) that write directly to the DOM.

## Two expression systems

| Syntax                   | Part type  | Behavior                                              |
| ------------------------ | ---------- | ----------------------------------------------------- |
| `${expr}`                | child slot | JS value — handler, signal, iterable, directive       |
| `{{ expr }}`             | expression | Data read + filter pipes, e.g. `{{ title \| upper }}` |
| `@click=${fn}`           | event      | Event listener                                        |
| `.value=${v}`            | property   | DOM property assignment                               |
| `model=${cfg}`           | attribute  | Two-way binding                                       |
| `repeat(items, key, fn)` | directive  | Keyed list reconciliation                             |

## Signals primer

```js
const count = new Signal.State(0); // writable cell
const doubled = new Signal.Computed(() => count.get() * 2); // lazy, cached
const dispose = effect(() => console.log(doubled.get())); // auto-tracked
dispose(); // stop the effect
```

Reads inside `effect`/`Computed` register dependencies automatically; changes
re-run effects on the microtask queue (multiple changes collapse into one run).

## Store rules

1. Mutate `store.state` directly — Proxy traps fire `store:change`.
2. Replace arrays/objects immutably: `store.state.todos = [...todos, next]`.
3. Computed signals that read store state **must also read** `tick.get()`.
4. Use `store.snapshot()` / `deepClone()` before handing state outside.
5. Reserved keys (`__proto__`, `prototype`, `constructor`) are **blocked** in
   every path — writes throw a `TypeError` (prototype-pollution guard).

## Security model

- **`${}` slots and `{{ }}` expressions are HTML-escaped by default.** A value
  like `'<img src=x onerror=…>'` renders as visible text, never as a node.
- **`| raw` is the explicit trusted-HTML escape hatch.** Only pipe data you
  control into it: `{{ article.body | raw }}`. Everything else stays escaped.
- **Attribute values** are written with `setAttribute` (never parsed as HTML),
  so `{{ attr }}` cannot break out of the attribute.
- **The Store refuses prototype-chain keys**, closing the classic
  `store.set('__proto__.polluted', …)` attack.

## Pitfalls

1. **`${}` after `attr=`** — a slot directly after `name=` in _text_ is parsed
   as an attribute. Use `{{ }}` (or add a space) for text like `<p>n={{ n }}</p>`.
2. **Item handlers need proxy items.** `store.snapshot()` returns plain clones;
   mutating them does nothing. Read lists through the proxy
   (`store.state.todos`) so handlers like `todo.done = true` propagate.
3. **Forget `tick.get()` in computeds** that read store state — the view never
   re-renders.
4. **Forget `result._context`** — `{{ }}` expressions resolve to nothing.
5. **`<for>` string mode is static.** `{{ }}` works, but `${}` handlers cannot
   reference the loop item. Use `repeat()` for interactive items.

## Unmounting and Explicit Resource Management

`render(null, container)` releases every subscription held by the mounted view
and empties the container. `effect()` returns a disposer — call it when
removing a component to stop its re-renders.

Every disposable in the framework implements **both** cleanup protocols:

- `.dispose()` — works on every supported engine (including Safari 17.5)
- `[Symbol.dispose]()` — attached when the engine defines the symbol
  (Chrome 125+, Firefox 141+, Node 18.18+, Safari 26.4+)

| Thing                      | Disposer                             | Disposes                     |
| -------------------------- | ------------------------------------ | ---------------------------- |
| `effect(fn)`               | callable handle + `[Symbol.dispose]` | stops the effect, frees deps |
| `store.subscribe(fn)`      | callable handle + `[Symbol.dispose]` | removes the listener         |
| `render(result, el)`       | returns a mount disposer             | unmounts the view            |
| parts / template instances | `[Symbol.dispose]` alias             | releases subscriptions       |

On ES2026 engines you can use the native declaration:

```js
using _ = effect(() => render(view.get(), root)); // disposed on scope exit
await using sub = store.subscribe(log);
```

On older engines the same code via `.dispose()`:

```js
const dispose = effect(() => ...);
// ... later
dispose();
```

The framework also ships its own `DisposableStack` / `AsyncDisposableStack`
(mirroring the ES2026 stacks, but engine-independent):

```js
import { DisposableStack } from '@pix-galaxy/pix-vanilla-reactive';

function startWidget(container) {
  const cleanup = new DisposableStack();
  cleanup.use(render(view, container)); // view unmount
  cleanup.defer(() => clearInterval(timer)); // arbitrary teardown
  cleanup.adopt(observer, (o) => o.disconnect()); // value + cleanup fn
  return cleanup.move(); // hand ownership out
}
// cleanup.dispose() runs everything in reverse order
```

Disposal runs in **reverse registration order**; if a disposer throws while
another already failed, the first failure is re-thrown with the remaining
ones attached as `.suppressed` (SuppressedError-compatible shape).

### Why not rely on `using` in the source?

The `using`/`await using` declaration is native only on ES2026 engines
(Chrome 134+, Firefox 141+, Node 24+). pix-galaxy targets Safari 17.5+, where
the syntax is a parse error — so the framework ships the symbol-based
protocol (feature-detected) and the stacks instead, and consumers opt into
`using` on the engines that support it.
