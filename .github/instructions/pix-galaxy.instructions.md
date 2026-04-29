---
description: "Use when routing tasks across project skills, handling /pix-galaxy prompts, choosing between pix-styleguides, pix-a11y, and pix-template-engine, or updating orchestration rules."
name: "PIX Galaxy Orchestration"
---
# PIX Galaxy Orchestration Instructions

- Treat `pix-galaxy` as the single orchestration entrypoint for multi-skill routing.
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
