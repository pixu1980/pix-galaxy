# API

## Attributes

| Attribute        | Type          | Default     | Description              |
| ---------------- | ------------- | ----------- | ------------------------ | --------------- |
| `orientation`    | `"horizontal" | "vertical"` | `"horizontal"`           | Split direction |
| `min-panel-size` | `number`      | `100`       | Minimum panel size in px |

## Properties

| Property      | Type       | Description               |
| ------------- | ---------- | ------------------------- |
| `orientation` | `string`   | Get/set orientation       |
| `ratios`      | `number[]` | Current size ratios (0–1) |

## Events

| Event                 | Detail              | Description            |
| --------------------- | ------------------- | ---------------------- |
| `splitter-resize`     | `{ ratios, index }` | Fired while dragging   |
| `splitter-resize-end` | `{ ratios, index }` | Fired when resize ends |
