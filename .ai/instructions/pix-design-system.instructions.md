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
- Build typography, spacing, and radii foundations from namespaced base tokens and ratios: `--ds--typography--ratio`, `--ds--spacings--ratio`, `--ds--radii--ratio`.
- Use CSS `pow()` to derive proportional scales from `--ds--typography--font-size--base`, `--ds--spacings--base`, and `--ds--radii--base`.
- Keep foundation files split by typography, spacing, radii, elevations, and colors.
- Include reset, layout, component aliases, and helpers.
- Keep `assets/design-system/shared/` as the only authoring source inside the skill, but always materialize the full CSS tree into installed app/package outputs. Generated targets must not import back into `.github/`, `.ai/`, or other skill-relative paths.
- When the design system is packaged inside a repo, use `src/index.*` and `tests/index.js` as barrels and keep sibling runtime files underscore-prefixed.
- The `components` layer may document hooks and aliases, but starter CSS must not ship concrete component implementations; use commented placeholders instead.
- Prefer element and attribute selectors. Use class selectors only when no safer selector exists.
- Keep docs and generated examples in English.
- Use fail-safe installer behavior. Do not overwrite existing files without explicit `--force`.
