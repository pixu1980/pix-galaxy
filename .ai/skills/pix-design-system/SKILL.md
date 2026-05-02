---
name: pix-design-system
description: 'Create, install, document, and maintain pix-native design systems with reusable CSS foundations, shared-source app/package starters, proportional typography/spacing/radii scales driven by CSS `pow()`, docs, examples, and installer scripts. Use when users ask for design system setup, foundations, typography scale, spacing scale, radii, elevations, color tokens, CSS variables, reset, layout primitives, helpers, theme baseline, or reusable design-system package creation.'
argument-hint: 'Design system task, e.g. "create a design system baseline for this project"'
---

# pix Design System

## Outcome
Create or update a native CSS design system baseline that follows `pix-styleguides`.

The baseline includes:
- proportional foundations for typography, spacing, radii, elevations, and colors
- extras for reset, layout primitives, component aliases, and helpers
- docs in English
- reusable app and package starters
- examples for app, package, and docs-site usage
- one shared source of truth for duplicated starter CSS and docs

## When to use
Use this skill when a user or orchestrator asks to:
- create or scaffold a design system
- install foundations and tokens
- define typography, spacing, radii, elevations, or color tokens
- create CSS variables or token architecture
- add reset, layout primitives, helpers, or component aliases
- create a theme baseline
- create a reusable design-system CSS package
- document design system usage

Trigger phrases:
- design system
- design tokens
- foundations
- typography scale
- spacing scale
- radii
- elevations
- color tokens
- css variables
- theme baseline
- layout primitives
- helpers
- reusable style package

## Inputs
1. Target project root.
2. Installation mode:
   - `app`, default, installs into `src/styles/` and `docs/design-system.md`.
   - `package`, installs into `packages/pix-design-system/` by default.
3. Optional brand overrides:
   - `--brand-name`
   - `--accent`
   - `--font`
   - `--radius subtle|comfortable|round`
   - `--density compact|comfortable|spacious`
4. Optional package overrides:
   - `--package-name`, default `@pix-galaxy/pix-design-system`
   - `--dest`, default `packages/pix-design-system`
5. Whether to include the optional docs-site scaffold with `--docs-site`.

## Resources
- Installer: [./scripts/install-design-system.mjs](./scripts/install-design-system.mjs)
- Installer tests: [./scripts/install-design-system.test.mjs](./scripts/install-design-system.test.mjs)
- Foundations reference: [./references/FOUNDATIONS.md](./references/FOUNDATIONS.md)
- Architecture reference: [./references/ARCHITECTURE.md](./references/ARCHITECTURE.md)
- Usage reference: [./references/USAGE.md](./references/USAGE.md)
- Examples reference: [./references/EXAMPLES.md](./references/EXAMPLES.md)
- Shared source templates: [./assets/design-system/shared](./assets/design-system/shared)
- App starter: [./assets/design-system/app](./assets/design-system/app)
- Package starter: [./assets/design-system/package](./assets/design-system/package)
- Examples: [./assets/examples](./assets/examples)

## Decision flow
1. If the target project needs local app styles, choose `app` mode.
2. If the target project needs a reusable workspace package, choose `package` mode.
3. If files already exist, do not overwrite them unless the user explicitly approves `--force`.
4. If project identity is known, pass brand override flags during install.
5. If identity is unknown, install pix defaults first and document follow-up token decisions.
6. Use `pix-styleguides` rules for every generated CSS and docs edit.
7. Update `assets/design-system/shared/` first when changing starter CSS or docs. Keep `app/` and `package/` as thin wrappers pointing back to shared templates.

## Procedure
1. Inspect the target project structure.
2. Run app mode:
   - `node ./.github/skills/pix-design-system/scripts/install-design-system.mjs --target "<project-root>"`
3. Or run package mode:
   - `node ./.github/skills/pix-design-system/scripts/install-design-system.mjs --target "<project-root>" --mode package --package-name "@pix-galaxy/pix-design-system" --dest "packages/pix-design-system"`
4. Add optional brand flags when known.
5. Add `--docs-site` when a static docs scaffold is useful.
6. Review generated CSS against `pix-styleguides`.
7. Adapt tokens to product identity.
8. Keep docs in English and update examples when token APIs change.
9. Run installer tests when modifying this skill.
10. Keep the `components` layer as commented placeholder guidance only. Do not ship concrete component implementations from this skill.

## Completion criteria
1. Generated CSS declares `@layer reset, foundations, layout, components, helpers;`.
2. Foundations cover typography, spacing, radii, elevations, and colors.
3. Typography, spacing, and radii derive from base tokens plus ratio tokens using CSS `pow()`.
4. App and package starter duplicates resolve back to `shared/` as the single source of truth.
5. The `components` layer contains commented placeholder examples only.
6. Extras cover reset, layout, component aliases, and helpers.
7. Token hierarchy includes primitive, semantic, and component alias levels.
8. Docs explain install, layers, token levels, foundations, and extension points.
9. Examples remain consultable and aligned with current token names.
10. Validation commands pass or failures are reported with exact output.

## Response template
1. `Installed files`: paths created or updated.
2. `Token decisions`: brand, accent, font, radius, and density values.
3. `Validation`: commands run and outcomes.
4. `Open items`: manual integration steps or unresolved decisions.
