# CI gating implementation guide (axe-core, WCAG 2.2 AA)

Use this guide to enforce accessibility quality gates and publish artifacts.

## Goal

- Always generate machine + human outputs:
  - `reports/a11y/axe.json`
  - `reports/a11y/axe-report.html`
  - `reports/a11y/axe.sarif`
  - `reports/a11y/diff.json`
  - `reports/a11y/remediation-checklist.md`
- Fail CI if blocking impacts exist (`critical`, `serious` by default).
- Upload HTML report as CI artifact.

## Required package scripts

Expected scripts (installed by `setup-axe-core.mjs`):

- `a11y:audit`
- `a11y:report`
- `a11y:sarif`
- `a11y:diff`
- `a11y:checklist`
- `a11y:gate`
- `a11y` (full pipeline)
- `a11y:ci` (pipeline + gate)

## GitHub Actions integration

Use template [../assets/examples/a11y-workflow.yml](../assets/examples/a11y-workflow.yml) and adjust trigger/scope.

Key steps:

1. Install deps (`pnpm install`).
2. Run `pnpm run a11y` or `pnpm run a11y:ci`.
3. Upload standalone HTML report artifact.
4. Upload SARIF to code scanning.

## Artifact upload (mandatory)

Always upload at least:

- `reports/a11y/axe-report.html`
- optionally full `reports/a11y/` folder

## Baseline diff strategy

Store previous run baseline at `reports/a11y/baseline.json`.

- Nightly/main branch job updates baseline artifact.
- PR job compares current run against baseline using `a11y:diff`.
- Regressions (`added` or `changed`) can be used to tighten gates over time.

## Gating policy options

- strict: block on `critical,serious,moderate`
- default: block on `critical,serious`
- soft: block on `critical`

Example:

```bash
node ./scripts/a11y/ci-gate-a11y.mjs --input reports/a11y/axe.json --block-impacts critical,serious
```

## EN-only output policy

Reports and checklist text should remain English-only for consistent CI artifacts across teams.
