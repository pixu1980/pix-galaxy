# API

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | `boolean` | `false` | Toggles the command palette visibility |
| `src` | `string` | `—` | URL to fetch commands JSON from |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `open` | `boolean` | Get/set palette open state |
| `items` | `PixCommandItem[]` | The command items (from `src` or inline) |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `command-selected` | `PixCommandItem` | Fired when a command is activated |
| `command-dismissed` | — | Fired when the palette is closed without selecting |
