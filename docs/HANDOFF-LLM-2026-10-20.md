# HANDOFF-LLM — 2026-10-20

Compressed handoff for the next session. Source of truth for open work:
**[`docs/plans/release-0.1.0.md`](./plans/release-0.1.0.md)** (unico piano attivo).

Audits/reviews e piani paralleli rimossi; `AGENTS.md` punta solo a quel file.

---

## Resume prompt

```prompt
Resume work on pix-galaxy. Run `pix_tool_handon` first: it checks which claims in this handoff still hold before any of them are trusted.
Active plan only: docs/plans/release-0.1.0.md — do not recreate audits/reviews or parallel plans.
First step: Fase A packaging — move docs-only @pix-galaxy/* from dependencies to devDependencies so npm pack shows dependencies: {} (today tarballs still embed workspace:*; publish is blocked).
Then B (pix-vanilla-reactive → ready: UI-23 if-nested fix, coverage ≥95% + --check-coverage, governance files), then C (flip color-scheme / accent / a11y / highlighter coverage+mono typo), then D portal high (WIP blur, listitem, e2e readyCount), then E drift, then F local npm release (user must npm login — whoami is 401).
Coorte 0.1.0: highlighter, color-scheme-selector, accent-color-selector, a11y, vanilla-reactive. Other public packages stay wip.
ADR log and context snapshot capture decisions; do not re-ask. Commits: type(scope): subject.
```

---

## Snapshot (verified 2026-10-20)

| Item | State |
| ---- | ----- |
| Branch | `develop` (ahead of origin) |
| Ready today | only `pix-highlighter` |
| npm | nothing published; `npm whoami` → 401 |
| Pack | `workspace:*` still in published `dependencies` |
| Coverage | a11y/accent/scheme ≥95% enforced; highlighter ~89% no check; vanilla ~92%/77% branch no check |
| Quality | `format:check` green; typecheck green with `ignoreWorkspaceCycles` (ADR-028) |
| Portal e2e | `readyCount >= 4` hardcodato → fail con 1 ready |

## ADR tip

29 ADRs in `docs/adr/`. Relevant: 018 local release, 020 zero deps, 026 95% bar, 028 workspace cycles, 029 portal documented-only.

## Do not reopen

- Full DSL token/dialog migration for toast/command/sortable/splitter (post-0.1.0 backlog in plan §5)
- Parallel `docs/audits/` or `docs/reviews/`
- CI npm publish / provenance (ADR-018 locale)
