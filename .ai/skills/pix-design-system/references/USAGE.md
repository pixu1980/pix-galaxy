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

## Package Mode

Use package mode when the target project needs a reusable workspace package:

```bash
node ./.github/skills/pix-design-system/scripts/install-design-system.mjs --target "<project-root>" --mode package
```

Package defaults:
- package name: `@pix-galaxy/pix-design-system`
- destination: `packages/design-system`

Override them when needed:

```bash
node ./.github/skills/pix-design-system/scripts/install-design-system.mjs --target "<project-root>" --mode package --package-name "@example/design-system" --dest "packages/design-system"
```

## CLI Options

- `--target`: target project root, default current working directory.
- `--mode app|package`: install mode, default `app`.
- `--brand-name`: docs and example title.
- `--accent`: accent color token.
- `--font`: sans font stack token.
- `--radius subtle|comfortable|round`: control shape.
- `--density compact|comfortable|spacious`: spacing scale multiplier.
- `--package-name`: package name for package mode.
- `--dest`: package destination for package mode.
- `--docs-site`: copy optional static docs-site scaffold.
- `--force`: overwrite existing output files.

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
