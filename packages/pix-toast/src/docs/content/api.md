# API

## `<pix-toast-stack>`

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `position` | `string` | `"top-right"` | Stack position: `top-right`, `top-left`, `bottom-right`, `bottom-left` |
| `max-visible` | `number` | `5` | Maximum visible toasts before queueing |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `add(item)` | `string` | Add a toast, returns the toast ID |
| `dismiss(id)` | — | Dismiss a toast by ID |
| `dismissAll()` | — | Dismiss all visible toasts |

## `<pix-toast>`

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `string` | `"info"` | `info`, `success`, `warning`, `error` |
| `duration` | `number` | `5000` | Auto-dismiss ms. `0` = persistent |
| `dismissible` | `boolean` | `true` | Show dismiss button |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `toast-dismiss` | `{ id }` | Fired when a toast is dismissed |
