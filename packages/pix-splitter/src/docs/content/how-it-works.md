# How It Works

`<pix-splitter>` uses CSS Grid `grid-template-columns`/`grid-template-rows` with `var(--pix-splitter--ratios)` to distribute space. Dragging the handle updates the CSS custom property - no layout thrashing.

- On `pointerdown`, a `pointermove` listener captures the drag delta
- The delta is converted to a ratio via the container size
- Only the CSS variable changes - no `style` attribute on children
- Keyboard: Arrow keys (10px step), Shift+Arrow (1px fine step)
