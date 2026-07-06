# API

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | `#6366F1` | HEX color value |
| `name` | `string` | — | Form field name |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Get/set the HEX value |
| `expanded` | `boolean` | Get/set panel expanded state |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `color-change` | `{ hex, rgb }` | Fired when color changes |

## Formats

The color picker supports four formats:
- **HEX** — `#RRGGBB` (uppercase)
- **RGB** — `rgb(R, G, B)` with 0–255 sliders
- **HSL** — Hue 0–360°, Saturation 0–100%, Lightness 0–100%
- **OKLCH** — Lightness 0–100%, Chroma 0–0.4, Hue 0–360°
