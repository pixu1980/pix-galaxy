# How It Works

`<pix-color>` wraps an `<input type="color">` under the hood for native browser color dialog fallback, while providing its own advanced color picker UI.

Color conversions are done entirely client-side using the `Color` class, which supports:

- **sRGB** — standard 0–255 channel values
- **HEX** — #RRGGBB notation
- **HSL** — Hue, Saturation, Lightness
- **OKLCH** — Oklab-based perceptually uniform color space

The component also performs **WCAG 2.2 contrast ratio** calculations to show AA/AAA pass/fail against black and white backgrounds.
