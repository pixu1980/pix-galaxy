# .agents - Source of truth for AI configuration

All AI instructions, prompts, and skills live here. Tool-specific directories
are symlinks that point back to this folder.

## Structure

```
.agents/
  instructions/   ← instruction files (.instructions.md)
  prompts/        ← reusable prompt files (.prompt.md)
  skills/         ← skill definitions (SKILL.md per skill)
  AGENTS.md       ← entry-point for Codex
```

## Symlink map

| Tool | Path | Points to |
|---|---|---|
| GitHub Copilot | `.github/instructions` | `.agents/instructions` |
| GitHub Copilot | `.github/prompts` | `.agents/prompts` |
| GitHub Copilot | `.github/skills` | `.agents/skills` |
| Cursor | `.cursor/rules` | `.agents/instructions` |
| Claude Code | `.claude/commands` | `.agents/skills` |
| OpenCode | `.opencode/rules` | `.agents/instructions` |
| OpenCode | `.opencode/prompts` | `.agents/prompts` |
| OpenCode | `.opencode/commands` | `.agents/skills` |
| Codex | `AGENTS.md` | `.agents/AGENTS.md` |

## Adding new content

Edit or add files directly in `.agents/`. All symlinked paths will reflect
changes automatically - no need to copy files across tool directories.
