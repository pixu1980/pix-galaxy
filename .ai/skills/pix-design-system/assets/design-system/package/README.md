# __BRAND_NAME__

Reusable native CSS design system package.

## Install

Import the package CSS from `__PACKAGE_NAME__/css`.

```css
@import "__PACKAGE_NAME__/css";
```

## Contents

- `src/index.css` declares stable cascade layers.
- `src/_reset.css` contains reset styles.
- `src/foundations/index.css` contains proportional typography, spacing, radii, elevations, and colors.
- `src/_layout.css` contains layout primitives.
- `src/_components.css` contains commented component placeholders and token contracts.
- `src/_helpers.css` contains reusable helpers.

## Notes

- Typography, spacing, and radii derive from base tokens plus ratio tokens using CSS `pow()`.
- Concrete component implementations are intentionally left to the consuming project.
