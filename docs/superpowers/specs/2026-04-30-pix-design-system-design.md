# pix-design-system Design

## Purpose

Create a repo-local pix skill named `pix-design-system` that helps agents install, document, and maintain a reusable design system in target projects. The skill builds on `pix-styleguides`, keeps all content in English, and gives agents both procedural guidance and deterministic Node scripts.

## Scope

The work includes:

- A new `.github/skills/pix-design-system/` skill folder.
- Reusable design system assets for app and package installation modes.
- Node scripts that copy and customize starter files into a target project.
- Consultable, documented examples for common design system use cases.
- Prompt and instruction files for easy invocation.
- pix Galaxy orchestrator updates.
- Router and installer tests.

The work does not introduce runtime dependencies, frontend frameworks, CSS preprocessors, or external build tools.

## Skill Structure

The skill will use progressive disclosure:

- `SKILL.md` contains the core workflow, trigger guidance, inputs, decisions, and completion criteria.
- `references/FOUNDATIONS.md` documents typography, spacing, radii, elevations, and colors.
- `references/ARCHITECTURE.md` documents CSS layers, token architecture, file layout, naming, and maintenance rules.
- `references/USAGE.md` documents CLI usage and implementation workflows.
- `references/EXAMPLES.md` documents bundled examples and when to inspect each one.
- `assets/design-system/app/` contains the app-mode starter.
- `assets/design-system/package/` contains the package-mode starter.
- `assets/examples/app-basic/`, `package-basic/`, `web-component-theme/`, and `docs-site/` contain consultable examples.
- `scripts/install-design-system.js` installs the selected starter into a target project.
- `scripts/install-design-system.test.js` validates installer behavior.

## Design System Output

The installer supports two modes:

- `app`, default mode, installs design system files into `src/styles/` and docs into `docs/design-system.md`.
- `package`, installs a reusable package into `packages/pix-design-system/` by default.

Package mode defaults:

- Package name: `@pix-galaxy/pix-design-system`
- Destination: `packages/pix-design-system/`
- Test directory: `tests/`

Both modes use the same CSS architecture:

```css
@layer reset, foundations, layout, components, helpers;
```

Files are split by responsibility. The entrypoint imports reset, foundation tokens, layout primitives, component aliases, and helpers in stable order.

When the design system is installed as a repo package, runtime folders follow the repo convention:

- `src/index.js` and `src/index.css` stay as barrels.
- `tests/index.js` stays as the package test entrypoint.
- Other runtime files in `src/`, `scripts/`, and `tests/` are underscore-prefixed.

## Token Architecture

The starter uses three levels:

- Primitive tokens: raw values such as color scales, type scales, spacing steps, radii, and elevation shadows.
- Semantic tokens: product meaning such as `--color-surface`, `--color-text`, `--space-layout`, and `--radius-interactive`.
- Component aliases: component-level hooks such as `--button-background-color`, `--card-border-radius`, and `--field-focus-ring`.

The foundations include:

- Typography: font family, size scale, line height, weight, tracking, measure.
- Spacing: compact to spacious scale, layout gaps, section spacing.
- Radii: none, subtle, comfortable, pill, circle.
- Elevations: low, medium, high, overlay, focus ring.
- Colors: primitive palette, semantic foreground/background/surface/border/accent/danger/success/warning tokens.

Extras include:

- Reset styles with accessibility-safe defaults.
- Layout primitives for containers, grids, stacks, clusters, and sections.
- Helpers for visually hidden content, focus rings, reduced motion, text balance, and flow spacing.
- Documentation that explains token levels, usage rules, and extension points.

## Installer Behavior

The script is fail-safe by default:

- It accepts `--mode app|package`, default `app`.
- It accepts optional `--brand-name`, `--accent`, `--font`, `--radius`, and `--density`.
- It accepts package-mode `--package-name` and `--dest`.
- It accepts `--target`, default current working directory.
- It accepts `--docs-site` for optional static docs site scaffold.
- It accepts `--force` to overwrite existing files.
- Without `--force`, it aborts before writing if any output file already exists.
- It prints created files and conflict paths.

The script should not modify unrelated files. If workspace integration needs package workspace changes, the skill documents manual follow-up instead of silently editing broad config.

## Prompts And Instructions

Add:

- `.github/prompts/pix-design-system.prompt.md`
- `.github/instructions/pix-design-system.instructions.md`

The prompt guides an agent to create a design system baseline in a project using the installer, then adapt tokens and docs safely.

The instructions apply to CSS and design system documentation files. They reinforce:

- Native CSS only.
- `@layer` organization.
- Custom properties.
- CSS nesting where useful.
- Element and attribute selectors first.
- No methodology naming frameworks.
- Token hierarchy and docs requirements.

## Orchestrator Updates

Update `pix-galaxy` so it routes design system tasks to `pix-design-system`.

Changes include:

- Add `pix-design-system` to current orchestration targets in `SKILL.md`.
- Add the skill to `assets/registry.json`.
- Add specific triggers for design system creation, tokens, foundations, theme baseline, CSS variables, spacing scale, radii, elevation, and reusable style packages.
- Keep `pix-styleguides` as fallback and ensure general CSS styleguide prompts still route to `pix-styleguides`.
- Add routing tests for positive and negative coverage.

## Testing

Add tests for:

- Routing to `pix-design-system` for design system prompts.
- Preserving `pix-styleguides` routing for generic styleguide cleanup.
- App install creates expected starter files.
- Package install creates expected package files with default name and destination.
- Existing output files cause failure without `--force`.
- Optional overrides replace brand name, accent, font, radius, and density tokens.

Validation commands:

```bash
node --test ./.github/skills/pix-galaxy/scripts/select-skill.test.js
node --test ./.github/skills/pix-design-system/scripts/install-design-system.test.js
```

## Acceptance Criteria

The task is complete when:

- `pix-design-system` exists and can be used by future agents without extra context.
- The installer creates app and package design system baselines.
- The generated CSS follows pix styleguide rules.
- The generated docs are in English and explain foundations, extras, and usage.
- Examples are present, documented, and useful as references.
- Prompts and instructions make the skill easy to invoke.
- pix Galaxy routes design system requests correctly.
- All added tests pass.

