# @pix-galaxy/pix-card

Accessible card Web Component. Zero runtime dependencies.

## Installation

```sh
pnpm add @pix-galaxy/pix-card
```

## Usage

```js
import "@pix-galaxy/pix-card";
import "@pix-galaxy/pix-card/css";
```

```html
<pix-card>Card content</pix-card>
<pix-card variant="outlined">
  <span slot="header">Header</span>
  Body content
  <span slot="footer">Footer</span>
</pix-card>
```

## Attributes

| Attribute | Type                                  | Default     | Description                            |
|-----------|---------------------------------------|-------------|----------------------------------------|
| variant   | "default" \| "outlined" \| "elevated" | "default"   | Visual variant                         |
| href      | string                                | —           | When set, card renders as a link       |

## Properties

| Property | Type                                  | Description           |
|----------|---------------------------------------|-----------------------|
| variant  | "default" \| "outlined" \| "elevated" | Card variant          |
| href     | string \| null                        | Card link href        |

## Slots

| Slot      | Description          |
|-----------|----------------------|
| (default) | Card body content    |
| header    | Card header content  |
| footer    | Card footer content  |

## CSS Custom Properties

| Property                | Description          |
|-------------------------|----------------------|
| --pix-card-background   | Card background      |
| --pix-card-color        | Card text color      |
| --pix-card-border-color | Card border color    |
| --pix-card-radius       | Card border radius   |
| --pix-card-shadow       | Card box shadow      |
| --pix-card-padding      | Card padding         |

## Parts

| Part   | Description                |
|--------|----------------------------|
| card   | The outer card element     |
| header | The header container       |
| body   | The body container         |
| footer | The footer container       |

## Accessibility

- When `href` is set, uses a native `<a>` element (not a fake link)
- Focus outline preserved via `:focus-visible`
- Supports forced colors (high contrast)
- Semantic slot structure

## Commands

```sh
pnpm --filter @pix-galaxy/pix-card build
pnpm --filter @pix-galaxy/pix-card test
```
