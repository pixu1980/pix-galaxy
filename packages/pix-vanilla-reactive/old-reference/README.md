# vanilla-reactive-old-reference

An earlier vanilla-reactive core, kept as a reference for `pix-vanilla-reactive`: no framework,
no JSX, no runtime dependency.

## Architecture

```
Store (Proxy, emits store:change)    Signals (State/Computed) -> effect (microtask scheduler)
                                       -> Template Engine (html``) -> DOM
```

- **`src/core/store`** - Proxy-based state container emitting `store:change` events.
- **`src/core/signals`** - `Signal.State`, `Signal.Computed`, `effect`, microtask scheduler.
- **`src/core/template-engine`** - `html\`\``, `render`, `{{ expr | filter }}` expressions,
  `${}` value holes, `@event` / `.prop` / `model` bindings, and `<for>` / `<if>` /
  `<switch>` directives with keyed reconciliation.

A consumer connects the store to the signals by bumping a `Signal.State` on every
`store:change`, so that computed signals reading the store re-evaluate.

## Scripts

```bash
pnpm test        # unit tests (Vitest + jsdom): store, signals, template engine
pnpm test:watch  # the same, in watch mode
```
