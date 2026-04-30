# .ai — Source of truth for AI configuration

All AI instructions, prompts, and skills live here. Tool-specific directories
are symlinks that point back to this folder.

## Structure

```
.ai/
  instructions/   ← instruction files (.instructions.md)
  prompts/        ← reusable prompt files (.prompt.md)
  skills/         ← skill definitions (SKILL.md per skill)
  AGENTS.md       ← entry-point for Codex
```

## Symlink map

| Tool | Path | Points to |
|---|---|---|
| GitHub Copilot | `.github/instructions` | `.ai/instructions` |
| GitHub Copilot | `.github/prompts` | `.ai/prompts` |
| GitHub Copilot | `.github/skills` | `.ai/skills` |
| Cursor | `.cursor/rules` | `.ai/instructions` |
| Claude Code | `.claude/commands` | `.ai/skills` |
| OpenCode | `.opencode/rules` | `.ai/instructions` |
| OpenCode | `.opencode/prompts` | `.ai/prompts` |
| OpenCode | `.opencode/commands` | `.ai/skills` |
| Codex | `AGENTS.md` | `.ai/AGENTS.md` |

## Adding new content

Edit or add files directly in `.ai/`. All symlinked paths will reflect
changes automatically — no need to copy files across tool directories.
