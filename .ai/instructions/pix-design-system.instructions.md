---
description: "Use when creating or editing design system CSS, tokens, foundations, layout primitives, helpers, docs, examples, or reusable design-system packages."
name: "pix Design System"
applyTo: "**/*.{css,html,js,mjs,json,md}"
---
# pix Design System Instructions

- Build design systems with native CSS only.
- Use `@layer reset, foundations, layout, components, helpers;`.
- Use custom properties for every reusable design decision.
- Use three token levels: primitive, semantic, and component aliases.
- Keep foundation files split by typography, spacing, radii, elevations, and colors.
- Include reset, layout, component aliases, and helpers.
- Prefer element and attribute selectors. Use class selectors only when no safer selector exists.
- Keep docs and generated examples in English.
- Use fail-safe installer behavior. Do not overwrite existing files without explicit `--force`.
