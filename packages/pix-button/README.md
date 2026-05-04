# @pix-galaxy/pix-button

Accessible button Web Component. Zero runtime dependencies.

## Installation

```sh
pnpm add @pix-galaxy/pix-button
```

## Usage

```js
import "@pix-galaxy/pix-button";
```

```html
<pix-button>Click me</pix-button>
<pix-button variant="secondary">Secondary</pix-button>
<pix-button variant="ghost">Ghost</pix-button>
<pix-button disabled>Disabled</pix-button>
```

## Attributes

| Attribute | Type                              | Default     | Description          |
|-----------|-----------------------------------|-------------|----------------------|
| variant   | "primary" \| "secondary" \| "ghost" | "primary"   | Visual variant       |
| disabled  | boolean                           | false       | Disables the button  |

## Properties

| Property | Type                              | Description          |
|----------|-----------------------------------|----------------------|
| variant  | "primary" \| "secondary" \| "ghost" | Button variant       |
| disabled | boolean                           | Whether disabled     |

## Events

| Event            | Bubbles | Composed | Detail              | Description                     |
|------------------|---------|----------|---------------------|---------------------------------|
| pix-button:click | yes     | yes      | `{ variant: string }` | Fired when button is activated  |

## CSS Custom Properties

| Property                      | Description              |
|-------------------------------|--------------------------|
| --pix-button-background       | Button background color  |
| --pix-button-color            | Button text color        |
| --pix-button-border-color     | Button border color      |
| --pix-button-radius           | Button border radius     |
| --pix-button-padding-block    | Block padding            |
| --pix-button-padding-inline   | Inline padding           |

## Parts

| Part   | Description                |
|--------|----------------------------|
| button | The native button element  |

## Accessibility

- Uses a native `<button>` in light DOM — full keyboard support
- `disabled` state communicated via `aria-disabled`
- Focus outline preserved via `:focus-visible`
- Supports forced colors (high contrast)
- Supports `prefers-reduced-motion`

## Commands

```sh
pnpm --filter @pix-galaxy/pix-button build
pnpm --filter @pix-galaxy/pix-button test
```
