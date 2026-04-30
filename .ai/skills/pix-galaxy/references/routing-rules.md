# pix Galaxy routing rules

This document defines how the orchestrator routes a request to a skill.

## Rule hierarchy

1. Explicit user override (if valid skill exists)
2. Score-based routing from registry signals
3. Tie-break by explicit `priority`
4. Final deterministic tie-break by skill `name`
5. Confidence threshold gate
6. Fallback to `defaultSkill`

## Signals used for score

- `keywords`: direct text fragments in prompt
- `regex`: pattern matches for higher precision
- `fileExtensions`: inferred from provided target files
- `operations`: task mode such as `review` or `refactor`
- `intents`: semantic hints like `accessibility` or `consistency`

## Default weights

Defined in [../assets/registry.json](../assets/registry.json):

- `keyword`: 10
- `regex`: 12
- `fileExtension`: 20
- `operation`: 40
- `intent`: 6

## Confidence levels

Score is mapped to confidence levels:

- `high`: score >= `confidenceThresholds.high`
- `medium`: score >= `confidenceThresholds.medium`
- `low`: score below medium threshold

`minimumConfidence` is enforced globally. If best match is below that level, router falls back to `defaultSkill`.

## Priority policy

Each skill must declare `priority` (integer).

- Higher `priority` wins when score ties.
- If priority also ties, alphabetical order by `name` is used.

Recommended ranges:

- 90-100: foundational or safety-critical skills
- 60-89: specialized high-value skills
- 30-59: optional helper skills
- 1-29: experimental or narrow skills

## Update policy

When adding a new skill:

1. Add skill to registry with complete trigger object.
2. Start with conservative triggers to avoid false positives.
3. Add at least one positive and one negative test case.
4. Run router tests and inspect routing rationale.
5. Tune weights only when priorities and trigger quality are insufficient.

## Validation command

```bash
node --test ./.github/skills/pix-galaxy/scripts/select-skill.test.mjs
```
