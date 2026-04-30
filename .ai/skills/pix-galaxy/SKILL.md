---
name: pix-galaxy
description: 'Orchestrate pix skills from a user prompt. Use to route requests to the right skill, keep orchestration updated, and scale to multiple skills over time. Trigger words: orchestrator, route skill, choose skill, dispatch workflow, pix-galaxy.'
argument-hint: 'User request to route (e.g., "review CSS and fix styleguide violations")'
---

# pix Galaxy Orchestrator

## Outcome
Route user requests to the most relevant pix skill using a deterministic, extensible workflow.

Current orchestration target:
- `pix-styleguides`
- `pix-a11y`
- `pix-template-engine`
- `pix-design-system`

This skill is designed to scale as more skills are added to the registry.

## When to use
Use this skill when the user asks to:
- select the best skill based on a prompt
- route a request through a central orchestrator
- keep the orchestration map updated over time
- add new skills to a single dispatch point

Explicit slash trigger:
- start prompt with `/pix-galaxy` to force orchestration mode.
- router strips `/pix-galaxy` prefix and classifies remaining prompt.

## Inputs
1. User prompt to classify.
2. Optional override if the user explicitly asks for a specific skill.
3. Optional context signals for precision:
   - target files (extensions and paths)
   - operation (`review`, `refactor`, `format`, `lint`, `fix`, `generate`)
4. Update intent:
   - `route-only`: select skill only.
   - `route-and-update`: select and evolve orchestrator mapping.

## Resources
- Router script: [./scripts/select-skill.mjs](./scripts/select-skill.mjs)
- Skill registry: [./assets/registry.json](./assets/registry.json)
- Routing rules: [./references/routing-rules.md](./references/routing-rules.md)
- Router tests: [./scripts/select-skill.test.mjs](./scripts/select-skill.test.mjs)
- Current routed skill: [../pix-styleguides/SKILL.md](../pix-styleguides/SKILL.md)
- Current routed skill: [../pix-a11y/SKILL.md](../pix-a11y/SKILL.md)
- Current routed skill: [../pix-template-engine/SKILL.md](../pix-template-engine/SKILL.md)
- Current routed skill: [../pix-design-system/SKILL.md](../pix-design-system/SKILL.md)

## Decision flow
1. If the user explicitly names a skill and it exists in the registry, select it.
2. Otherwise run the router script against prompt plus optional file/operation context.
   - if prompt starts with `/pix-galaxy`, classify only text after slash prefix.
3. Compute score using multi-signal rules:
   - keywords
   - regex patterns
   - file extension matches
   - operation matches
   - intent matches
4. If scores tie, apply explicit priority from registry.
5. If still tied, apply deterministic fallback sort by skill name.
6. Enforce minimum confidence threshold from registry.
7. If top result is below threshold, use `defaultSkill`.
8. Return selected skill + confidence + score + reason.
9. Return ranked recommendations so orchestrator can evaluate quali skill usare.

## Procedure
1. Read [./assets/registry.json](./assets/registry.json).
2. Run:
   - `node ./.github/skills/pix-galaxy/scripts/select-skill.mjs --prompt "/pix-galaxy <user prompt>" --files "path/a.css,path/b.md" --operation "review"`
3. Inspect output JSON:
   - `selectedSkill`
   - `confidence`
   - `score`
   - `reason`
   - `fallbackUsed`
   - `slashCommandUsed`
   - `routedPrompt`
   - `recommendedSkills`
4. Execute the selected skill workflow.
5. If user asks to improve routing, update registry rules and priorities.
6. Re-run router tests to verify expected dispatch.

## Adding new skills
1. Create the new skill folder and `SKILL.md`.
2. Add a new object to `skills` in [./assets/registry.json](./assets/registry.json):
   - `name`
   - `priority`
   - `description`
   - `triggers.keywords`
   - `triggers.regex`
   - `triggers.fileExtensions`
   - `triggers.operations`
   - `triggers.intents`
3. Keep rules specific and non-overlapping where possible.
4. Validate with tests:
   - `node --test ./.github/skills/pix-galaxy/scripts/select-skill.test.mjs`
5. If overlap is frequent, refine weights/priorities in registry before changing script behavior.

## Completion criteria
A routing task is complete when:
1. The selected skill is returned with confidence and rationale.
2. Minimum confidence threshold is enforced.
3. Priority-based tie-break behavior is deterministic.
4. Non-textual signals (files/operation) are considered when provided.
5. Fallback behavior is deterministic.
6. Any registry updates are saved and validated with tests.
7. The final report includes routing result and any orchestrator updates.

## Response template
1. `Routing result`: selected skill and confidence.
2. `Why`: matched triggers or fallback reason.
3. `Action taken`: skill invoked and outcome.
4. `Orchestrator updates`: registry/script changes, if any.

## Notes
- Keep this skill as the single orchestration entrypoint.
- Prefer minimal safe updates when evolving routing logic.
- Preserve backward compatibility for existing trigger behavior.
