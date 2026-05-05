# API

## Main exports

- `PixColorSchemeSwitcher`
- `normalizeScheme(value?)`

## Custom element

- Tag name: `<pix-color-scheme-switcher>`
- Registration: autonomous custom element
- Public methods: `applyColorScheme(scheme)`
- Public getters: `currentScheme`, `resolvedScheme`

## Attributes

- No public attributes.

## Events

- `pix-color-scheme-switcher:change`

The event detail includes:

- `scheme`: selected mode as `light`, `dark`, or `system`
- `resolvedScheme`: resolved document scheme as `light` or `dark`

## Parts

- `control`
- `option`

## Slots

- No public slots.

## CSS custom properties

- `--pix-color-scheme-switcher--border-width`
- `--pix-color-scheme-switcher--border-color`
- `--pix-color-scheme-switcher--background-color`
- `--pix-color-scheme-switcher--text-color`
- `--pix-color-scheme-switcher--active-background-color`
- `--pix-color-scheme-switcher--active-text-color`
- `--pix-color-scheme-switcher--focus-ring-color`
- `--pix-color-scheme-switcher--radius`
- `--pix-color-scheme-switcher--control-size`
- `--pix-color-scheme-switcher--icon-size`
- `--pix-color-scheme-switcher--transition-duration`

## Document side effects

- Persists the selected mode in localStorage under `color-scheme`.
- Updates `html[data-color-scheme]` with the resolved `light` or `dark` value.
- Updates `html[data-color-scheme-mode]` with the selected `light`, `dark`, or `system` value.
- Updates `document.documentElement.style.colorScheme` for native control rendering.
- Ensures `meta[name="color-scheme"]` exists and keeps its content synchronized.
