# How It Works

`<pix-command>` is an autonomous custom element that creates a modal command palette overlay.

1. **Data loading**: Commands are loaded from either the `src` attribute (via `fetch`) or an inline `<script type="application/json">` child.
2. **Filtering**: As the user types, commands are filtered using a simple fuzzy match against `label`, `description`, and `keywords`.
3. **Navigation**: Arrow keys, Home/End, and Enter navigate and select results. Escape closes the palette.
4. **Selection**: On selection, a `command-selected` event is dispatched and the palette closes.
