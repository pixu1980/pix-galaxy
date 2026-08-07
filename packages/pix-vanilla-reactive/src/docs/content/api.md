# API Reference

## Store

```js
import { Store } from '@pix-galaxy/pix-vanilla-reactive';

const store = new Store(initialState, { eventsTarget });
store.state; // reactive proxy - mutate directly
store.get(path); // read by dot-path
store.set(path, value); // write by dot-path
store.update(path, fn); // (current) => next
store.replace(next); // swap entire tree
store.snapshot(); // detached deep clone
store.subscribe(fn); // per-store listener, returns unsubscribe
```

Events: `store:change` CustomEvent with `{ path, oldValue, newValue }`.

## Signals

```js
new Signal.State(value, { equals }); // writable cell
new Signal.Computed(fn, { equals }); // lazy derived value
Signal.subtle.untrack(fn); // read without tracking
effect(fn); // auto-tracked side effect → dispose()
isSignalLike(value); // narrowing guard
```

Also exported: `BaseSignal`, `StateSignal`, `ComputedSignal`,
`EffectCollector`, `schedule`, collector context helpers.

## Template engine

```js
html`...`; // template result (NOT a real tag)
render(result, container); // mount / update in place
render(null, container); // unmount: release subscriptions + clear
model(config); // two-way binding directive
repeat(items, key, renderItem); // keyed list directive
directive(name, payload); // custom directive factory
registerFilter(name, fn); // add a {{ }} filter
escapeHtmlText(value); // escape a value for HTML text interpolation
```

Built-in filters: `upper`, `lower`, `capitalize`, `slugify`, `slug`, `trim`,
`escapeHtml`, `striptags`, `raw`, `json`, `default`, `truncate`, `length`,
`first`, `last`, `join`, `date`, `timeAgo`, `urlencode`, `sortBy`, `tagLabel`,
`tagHref`.

Parts (advanced): `ChildNodePart`, `AttributePart`, `PropertyPart`,
`EventPart`, `ExprPart`, `ForPart`, `IfPart`, `TemplateInstance`, `getTemplate`.

## Bridge

```js
createTickState(store); // → Signal.State<number> that notifies on every write
```

## Disposables

```js
makeDisposable(fn); // callable handle + Symbol.dispose
new DisposableStack(); // use / adopt / defer / move / dispose
new AsyncDisposableStack(); // async variant (await dispose())
DISPOSE / ASYNC_DISPOSE; // feature-detected symbols
```

`effect()` and `store.subscribe()` return disposable handles; `render()`
returns a mount disposer (unmount with `.dispose()` or `render(null, el)`).

## Helpers

`deepClone`, `clonePlainValue`, `isObject`, `toPathArray`, `pathToString`,
`parseExpression`, `evaluateExpression`, `getFromPath`, `parseArg`, `FILTERS`.
