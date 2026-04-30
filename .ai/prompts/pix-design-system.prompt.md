---
name: "pix Design System Create"
description: "Create a native CSS design system baseline with foundations, reset, layout, helpers, docs, examples, and optional package mode."
argument-hint: "Design system task, e.g. 'create app mode with brand name Nova UI and accent #ff5500'"
agent: "agent"
---
Create or update a design system baseline with `pix-design-system`.

Mandatory references:
- [skill pix-design-system](../skills/pix-design-system/SKILL.md)
- [foundations reference](../skills/pix-design-system/references/FOUNDATIONS.md)
- [architecture reference](../skills/pix-design-system/references/ARCHITECTURE.md)
- [usage reference](../skills/pix-design-system/references/USAGE.md)
- [examples reference](../skills/pix-design-system/references/EXAMPLES.md)

Default command:
- `node ./.github/skills/pix-design-system/scripts/install-design-system.mjs --target "<project-root>"`

Package command:
- `node ./.github/skills/pix-design-system/scripts/install-design-system.mjs --target "<project-root>" --mode package --package-name "@pix-galaxy/pix-design-system" --dest "packages/pix-design-system"`

Hard rules:
- Native CSS only.
- Use `@layer reset, foundations, layout, components, helpers;`.
- Use primitive, semantic, and component alias tokens.
- Keep generated docs in English.
- Do not overwrite existing files unless user approved `--force`.

Mandatory final output:
1. `Installed files`
2. `Token decisions`
3. `Validation`
4. `Open items`
