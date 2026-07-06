---
name: "pix Custom Element Scaffold"
description: "Scaffold a new Custom Element v1 (autonomous or customized built-in) following the pix-custom-element rules — light DOM, adoptedStyleSheets, componentDecorator in a static {} block — with shared decorator/events helpers centralised at the project level."
argument-hint: "Component intent, e.g. 'scaffold PixCard autonomous element with click event' or 'scaffold PixDetails extending details with open attribute'"
agent: "agent"
---
Scaffold a new component with `pix-custom-element`.

Mandatory references:
- [skill pix-custom-element](../skills/pix-custom-element/SKILL.md)
- [decorator helpers](../skills/pix-custom-element/scripts/decorator/index.js)
- [events utilities](../skills/pix-custom-element/scripts/events/index.js)
- [PixDetails example](../skills/pix-custom-element/scripts/PixDetails/pix-details.js)
- [scaffold script](../skills/pix-custom-element/scripts/scaffold-component.mjs)
- [scaffold tests](../skills/pix-custom-element/scripts/scaffold-component.test.mjs)

Default command (autonomous element):
- `node ./.github/skills/pix-custom-element/scripts/scaffold-component.mjs --name "PixCard" --target "<project-root>"`

Customized built-in command:
- `node ./.github/skills/pix-custom-element/scripts/scaffold-component.mjs --name "PixDetails" --extends "details" --attributes "open" --target "<project-root>"`

First-run command (no shared library yet) — installs `decorator/` and `events/` once:
- `node ./.github/skills/pix-custom-element/scripts/scaffold-component.mjs --name "PixCard" --install-shared --shared-dir "packages/shared" --target "<project-root>"`

Hard rules:
- No Shadow DOM. No `<template>` elements.
- Declare `static styles = styles;` and keep the `static {}` block calling `componentDecorator(this)` as the only registration site.
- CSS adopted via `document.adoptedStyleSheets`. Never inject `<style>` tags at runtime.
- `decorator/` and `events/` are project singletons. Detect an existing installation before copying anything.
- Component folder: `PascalCase`. File names inside: `kebab-case` (match the tag).
- Use pix-design-system tokens. Selectors prefer attributes over classes.
- Render uses `pix-template-engine` tagged template literals when templating is needed.
- Do not overwrite existing files unless user approved `--force`.

Mandatory final output:
1. `Created files`: paths of every file written, grouped by component folder and shared library.
2. `Shared library`: resolved path of `decorator/` and `events/` (existing or newly installed).
3. `Imports to use`: the exact relative or alias path the new component imports from.
4. `Validation`: command(s) run and outcome.
5. `Open items`: bundler config, polyfills (Safari customized built-ins), or manual integration steps.
