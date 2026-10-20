# Session handoff 01 — release 0.1.0 plan

- **Branch:** `develop`
- **Commit range:** `bce8f44..868798d` (9 commits; plus this handoff commit)
- **Date:** 2026-10-20
- **Active plan:** `docs/plans/release-0.1.0.md` (single source; no parallel audits/reviews)

## What landed this session

1. `ignoreWorkspaceCycles: true` (ADR-028) so recursive pnpm tasks run with docs aggregator edges.
2. Tooling bumps + workspace package edges declared; `marked`/`esbuild` in `pix-core` `devDependencies`.
3. Shared docs site rebuilt on `pix-vanilla-reactive` (in-place nav); docs shells use `<main id="app">` + `color-scheme` meta.
4. Portal lists only documented packages; removed coming-soon placeholder (ADR-029).
5. Scaffold `FUNDING.yml` placeholders fixed for valid YAML.
6. Vanilla-reactive extension/typedef polish; keyboard nav index init fixes; Prettier leftovers.
7. Docs: unique `release-0.1.0` plan; ADRs 028–029; AGENTS/handoff pointers. Old execution plans deleted.

## Still open (from plan; verified in code)

| Blocker | Evidence |
| ------- | -------- |
| Publish blocked: tarballs still embed `workspace:*` in `dependencies` | `npm pack` on public packages |
| Only `pix-highlighter` is `releaseStatus: "ready"` | `packages/*/package.json` |
| Coverage below ADR-026 bar: highlighter ~89%, vanilla-reactive ~92%/77% branch | `test:coverage` |
| `npm whoami` → 401 | local registry auth |
| Portal e2e still hardcodes `readyCount >= 4` | `e2e/portal.spec.mjs` |
| Nested `<if>` interpolation (WIP pill) still broken | plan UI-23 / B.1 |
| Coorte not flipped: color-scheme, accent, a11y, vanilla-reactive | plan §1 |

**Out of tree (not committed):** `packages/pix-highlighter/*.tgz`, `tmp-screenshots/`.

## Coorte for npm `0.1.0`

`pix-highlighter`, `pix-color-scheme-selector`, `pix-accent-color-selector`, `pix-a11y`, `pix-vanilla-reactive`.

## ADR tip

029 portal documented-only · 028 workspace cycles · 026 95% bar · 020 zero deps · 018 local release.

### Resume Prompt

```prompt
Resume work on pix-galaxy from docs/handoff/01-release-0.1.0-plan.md.
Run `pix_tool_handon` first; trust only claims that still hold.
Active plan only: docs/plans/release-0.1.0.md — do not recreate audits/reviews or parallel plans.
First step: Fase A packaging — move docs-only `@pix-galaxy/*` links from `dependencies` to `devDependencies` so `npm pack` shows `dependencies: {}` (publish is blocked while tarballs embed `workspace:*`).
Then B (vanilla-reactive → ready: UI-23 if-nested fix, coverage ≥95% + --check-coverage, governance files), C (flip color-scheme / accent / a11y; highlighter coverage + mono typo), D portal high (WIP blur, listitem, e2e readyCount), E drift, F local `pnpm release` after `npm login`.
Coorte 0.1.0: highlighter, color-scheme-selector, accent-color-selector, a11y, vanilla-reactive. Other public packages stay wip.
Commits: `type(scope): subject`. Never push unless asked.
```
