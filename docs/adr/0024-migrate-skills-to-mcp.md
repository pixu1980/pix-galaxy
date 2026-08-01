# ADR-024: Migrate .agents skills to pix-galaxy-mcp, remove .agents

## Status

Accepted

## Context

The repo carried agent instructions, prompts, and skills under `.agents/`. The `pix-galaxy-mcp` server already serves the pix skill ecosystem and is the better home for them.

## Decision

- Migrate the two valuable skills to `pix-galaxy-mcp`:
  - `pix-custom-element` → **`pix-frontend-custom-element`**
  - `pix-template-engine` → **`pix-frontend-template-engine`**
- Delete `.agents/` from this repo
- Replace the `AGENTS.md` symlink with a real file describing project rules
- Remove dead symlinks (`.ai/` and `.github/` targets no longer exist)

## Rationale

- Skills are served to any agent by the MCP server
- Removes ~96 duplicated files and 7 broken symlinks
- Single source of truth for skill content

## Consequences

Positive:

- Repo is cleaner; skills are centralized
- Skills gain MCP tooling (search, guardrails, scaffold)

Negative:

- Repo no longer self-contained for agent instructions (requires the MCP server installed)

## Follow-up

Keep `AGENTS.md` updated as the single agent entry point.

## Tags

architecture, skills, tooling
