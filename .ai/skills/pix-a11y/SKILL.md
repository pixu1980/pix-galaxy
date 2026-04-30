---
name: pix-a11y
description: 'Integrate and run accessibility checks with axe-core and WCAG 2.2 AA guidance. Use to add automated a11y tests, generate audit results, and create standalone HTML reports from axe-core output.'
argument-hint: 'A11y task, e.g. "add axe-core checks and generate HTML report"'
---

# pix A11y

## Outcome
Integrate accessibility testing into current project with `axe-core`, then generate human-readable standalone HTML reports for violations and remediation tracking.

All generated reports must be English-only (EN).

## When to use
Use this skill when user or another skill asks to:
- add accessibility tests to project
- validate against WCAG 2.2 AA baseline
- run `axe-core` on pages/components
- convert axe JSON output into shareable HTML report
- attach a11y report as CI artifact
- compare current run against baseline
- generate SARIF output for code scanning tools
- map violations to design-system remediation checklist

Trigger phrases:
- accessibility audit
- axe-core
- WCAG 2.2 AA
- a11y test
- accessibility report
- aria violations
- contrast and focus checks

## Inputs
1. Target project root path.
2. Audit target URL, file, or rendered HTML source.
3. Output folder (default: `reports/a11y`).
4. Strictness:
   - `ci-blocking`: fail process when critical/serious issues exist.
   - `report-only`: always emit report, do not block.

## Resources
- Installer/update script: [./scripts/setup-axe-core.mjs](./scripts/setup-axe-core.mjs)
- HTML report generator: [./scripts/beautify-axe-report.mjs](./scripts/beautify-axe-report.mjs)
- Optional runner helper: [./scripts/run-axe-audit.mjs](./scripts/run-axe-audit.mjs)
- Baseline diff script: [./scripts/diff-axe-baseline.mjs](./scripts/diff-axe-baseline.mjs)
- SARIF converter: [./scripts/axe-to-sarif.mjs](./scripts/axe-to-sarif.mjs)
- Remediation mapper: [./scripts/map-violations-checklist.mjs](./scripts/map-violations-checklist.mjs)
- CI gating script: [./scripts/ci-gate-a11y.mjs](./scripts/ci-gate-a11y.mjs)
- Report style template: [./assets/templates/report.css](./assets/templates/report.css)
- Example axe JSON payload: [./assets/examples/axe-sample.json](./assets/examples/axe-sample.json)
- GitHub Actions workflow example: [./assets/examples/a11y-workflow.yml](./assets/examples/a11y-workflow.yml)
- WCAG references: [./references/wcag.md](./references/wcag.md)
- CI gating guide: [./references/ci-gating.md](./references/ci-gating.md)
- Design-system remediation map: [./references/remediation-mapping.md](./references/remediation-mapping.md)

## Decision flow
1. If project has no a11y automation, run setup script to install and scaffold.
2. If project already has axe pipeline, align existing scripts with this skill output format.
3. Run axe audit and store raw JSON output.
4. Generate standalone HTML report from raw output.
5. Generate SARIF and remediation checklist outputs.
6. Compare current run with previous baseline.
7. Apply CI policy:
   - `ci-blocking`: fail for severe issues.
   - `report-only`: keep non-blocking artifact workflow.

## Procedure
1. Bootstrap project integration:
   - `node ./.github/skills/pix-a11y/scripts/setup-axe-core.mjs --target "<project-root>" --mode "report-only" --with-workflow true`
2. Run audit:
   - `node ./.github/skills/pix-a11y/scripts/run-axe-audit.mjs --url "http://localhost:4173" --out "reports/a11y/axe.json"`
3. Build standalone HTML report:
   - `node ./.github/skills/pix-a11y/scripts/beautify-axe-report.mjs --input "reports/a11y/axe.json" --output "reports/a11y/axe-report.html" --title "Accessibility Audit"`
4. Build SARIF output:
   - `node ./.github/skills/pix-a11y/scripts/axe-to-sarif.mjs --input "reports/a11y/axe.json" --output "reports/a11y/axe.sarif"`
5. Build remediation checklist:
   - `node ./.github/skills/pix-a11y/scripts/map-violations-checklist.mjs --input "reports/a11y/axe.json" --output "reports/a11y/remediation-checklist.md"`
6. Build baseline diff:
   - `node ./.github/skills/pix-a11y/scripts/diff-axe-baseline.mjs --baseline "reports/a11y/baseline.json" --current "reports/a11y/axe.json" --output "reports/a11y/diff.json"`
7. Review issues grouped by impact and affected nodes.
8. Track fixes and rerun until acceptable baseline.

## Completion criteria
A task is complete when:
1. `axe-core` integration exists in project scripts/dev dependencies.
2. Raw audit JSON is generated for target scope.
3. Standalone HTML report is generated and readable without external assets.
4. SARIF output is generated for CI code-scanning pipelines.
5. Baseline diff output is generated and highlights regressions/fixes.
6. Remediation checklist mapping per design-system component is generated.
7. Report includes summary by impact and actionable violation details.
8. Final output includes commands used and CI policy state.

## Notes
- Always reference WCAG 2.2 AA in audit context.
- Keep HTML report self-contained for CI artifacts and sharing.
- Keep report text and labels in English only.
- Prefer deterministic output paths for easier automation.
