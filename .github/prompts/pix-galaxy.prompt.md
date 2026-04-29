---
name: "PIX Galaxy Route"
description: "Route a task to the correct skill using pix-galaxy, with scoring, confidence threshold, and deterministic fallback."
argument-hint: "Prompt to route (e.g. '/pix-galaxy integrate axe-core and generate report')"
agent: "agent"
---
Route the user task with the PIX Galaxy orchestrator.

Input:
- User prompt (preferably with `/pix-galaxy` prefix)
- Optional target files
- Optional operation (`review`, `refactor`, `format`, `lint`, `fix`, `generate`, `audit`, `install`, `report`)

Execute in order:
1. Read [skill pix-galaxy](../skills/pix-galaxy/SKILL.md) and [registry](../skills/pix-galaxy/assets/registry.json).
2. Run router command:
   - `node ./.github/skills/pix-galaxy/scripts/select-skill.mjs --prompt "<prompt>" --files "<csv-file-paths>" --operation "<operation>"`
3. Return result with format:
   - `selectedSkill`
   - `confidence`
   - `score`
   - `reason`
   - `fallbackUsed`
   - `recommendedSkills`
4. If an orchestrator update is requested, modify registry with a minimal patch and validate with:
   - `node --test ./.github/skills/pix-galaxy/scripts/select-skill.test.mjs`

Hard rules:
- Respect confidence threshold and fallback from registry.
- Do not skip tests when touching routing.
- Keep compatibility with existing behavior.
