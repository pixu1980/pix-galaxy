---
description: "Use when implementing accessibility audits with axe-core, WCAG 2.2 AA checks, SARIF output, baseline diff, remediation mapping, CI gating, or report artifacts."
name: "PIX A11y Automation"
applyTo: "**/*.{html,css,js,mjs,md,yml,yaml}"
---
# PIX A11y Instructions

- Treat accessibility as WCAG 2.2 AA baseline by default.
- Keep a11y report outputs in English only.
- Generate both machine and human outputs for each audit run.

## Required outputs

- `reports/a11y/axe.json`
- `reports/a11y/axe-report.html` (standalone artifact)
- `reports/a11y/axe.sarif`
- `reports/a11y/diff.json` (baseline vs current)
- `reports/a11y/remediation-checklist.md`

## CI integration

- Upload standalone HTML report as CI artifact.
- Upload SARIF for code scanning when supported.
- Apply CI gate policy (default: block `critical,serious`).
- Support configurable gating levels for stricter pipelines.

## Baseline strategy

- Compare current run with previous baseline to detect regressions/fixes.
- Keep deterministic report paths to simplify artifacts and automation.

## Remediation mapping

- Map violations to design-system component checklist items.
- Group remediation tasks by component target and impact.
