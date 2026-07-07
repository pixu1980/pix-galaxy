# Getting Started

## Installation

```bash
pnpm add @pix-galaxy/pix-foundations
```

In your CSS, import the foundations:

```css
@import '@pix-galaxy/pix-foundations/foundations.css';
```

In Vite / JavaScript:

```js
import '@pix-galaxy/pix-foundations/foundations.css';
```

## Layer Structure

Foundations are organized in CSS layers:

```
pix.reset          → minimal box-sizing / margin reset
pix.foundations    → radii, spacing, typography, colors, focus, elevations
pix.components     → (reserved for component-specific layers)
```

Import foundations before your component styles so the cascade works predictably.
