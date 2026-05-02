# Design System Usage

## App Mode

Use app mode when the target project needs local CSS files:

```bash
node ./.github/skills/pix-design-system/scripts/install-design-system.mjs --target "<project-root>"
```

App mode writes:
- `src/styles/index.css`
- `src/styles/_reset.css`
- `src/styles/foundations/index.css`
- `src/styles/foundations/_colors.css`
- `src/styles/foundations/_typography.css`
- `src/styles/foundations/_spacings.css`
- `src/styles/foundations/_radii.css`
- `src/styles/foundations/_elevations.css`
- `src/styles/_layout.css`
- `src/styles/_components.css`
- `src/styles/_helpers.css`
- `docs/design-system.md`

These files are materialized from `assets/design-system/shared/`, even though the skill keeps app-mode wrappers for structure and examples.

## Package Mode

Use package mode when the target project needs a reusable workspace package:

```bash
node ./.github/skills/pix-design-system/scripts/install-design-system.mjs --target "<project-root>" --mode package
```

Package defaults:
- package name: `@pix-galaxy/pix-design-system`
- destination: `packages/pix-design-system`

Override them when needed:

```bash
node ./.github/skills/pix-design-system/scripts/install-design-system.mjs --target "<project-root>" --mode package --package-name "@example/design-system" --dest "vendor/design-system"
```

## CLI Options

- `--target`: target project root, default current working directory.
- `--mode app|package`: install mode, default `app`.
- `--brand-name`: docs and example title.
- `--accent`: accent color token.
- `--font`: sans font stack token.
- `--radius subtle|comfortable|round`: base value for `--ds--radii--base`.
- `--density compact|comfortable|spacious`: multiplier applied to `--ds--spacings--base`.
- `--package-name`: package name for package mode.
- `--dest`: package destination for package mode.
- `--docs-site`: copy optional static docs-site scaffold.
- `--force`: overwrite existing output files.

## Proportional Foundations

Generated typography, spacing, and radii files use CSS `pow()` with namespaced base and ratio tokens.

- Typography starts from `--ds--typography--font-size--base` and `--ds--typography--ratio`.
- Spacing starts from `--ds--spacings--base`, `--ds--spacings--ratio`, and `--ds--spacings--density`.
- Radii start from `--ds--radii--base` and `--ds--radii--ratio`.

If the target needs older browser support, add build-time fallbacks or precomputed alias tokens in the consuming project.

## Conflict Handling

The installer refuses to overwrite existing files by default. When conflicts occur:

1. Read the conflict list.
2. Decide whether to preserve, merge manually, or overwrite.
3. Use `--force` only when overwrite is intended.

## Validation

Run installer tests after script or asset edits:

```bash
node --test ./.github/skills/pix-design-system/scripts/install-design-system.test.mjs
```

Run router tests after orchestration edits:

```bash
node --test ./.github/skills/pix-galaxy/scripts/select-skill.test.mjs
```

Check generated `_components.css` before completion: it should contain commented placeholder examples only, not concrete component selectors shipped by default.
