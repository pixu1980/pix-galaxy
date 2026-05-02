---
description: "Use when routing tasks across project skills, handling /pix-galaxy prompts, choosing between pix-styleguides, pix-a11y, pix-template-engine, pix-design-system, pix-custom-element, and pix-color-scheme-switcher, or updating orchestration rules."
name: "pix Galaxy Orchestration"
---
# pix Galaxy Orchestration Instructions

- Treat `pix-galaxy` as the single orchestration entrypoint for multi-skill routing.
- Route design system setup, foundations, tokens, theme baseline, layout primitives, helpers, and reusable CSS package requests to `pix-design-system`.
- Route custom element creation, web component scaffolding, `is="..."` customized built-ins, `componentDecorator`, `adoptedStyleSheets`, and component lifecycle requests to `pix-custom-element`.
- Route light/dark/system theme controls, `data-color-scheme`, `prefers-color-scheme`, color-scheme meta, and persisted color-scheme UI requests to `pix-color-scheme-switcher`.
- If prompt starts with `/pix-galaxy`, classify only content after the prefix.
- Route using deterministic scoring and confidence threshold rules from skill registry.
- Use explicit user override if user directly names a registered skill.
- When routing confidence is below threshold, fall back to default skill.
- Return both selected skill and ranked recommendations when orchestrating.

## Update rules

- Keep registry changes minimal and backward compatible.
- For every new skill in routing, define:
  - `name`, `priority`, `description`
  - `triggers.keywords`, `triggers.regex`, `triggers.fileExtensions`, `triggers.operations`, `triggers.intents`
- Validate routing updates with router tests before completion.
