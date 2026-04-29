---
name: "PIX A11y Audit Pipeline"
description: "Configure an a11y pipeline with axe-core, standalone HTML report, SARIF, baseline diff, remediation checklist, and CI gating."
argument-hint: "A11y task (e.g. 'setup ci-blocking with HTML artifact and SARIF')"
agent: "agent"
---
Run a complete `pix-a11y` pipeline compliant with WCAG 2.2 AA.

Mandatory references:
- [skill pix-a11y](../skills/pix-a11y/SKILL.md)
- [wcag references](../skills/pix-a11y/references/wcag.md)
- [ci gating guide](../skills/pix-a11y/references/ci-gating.md)
- [workflow example](../skills/pix-a11y/assets/examples/a11y-workflow.yml)

Commands to follow:
1. Project setup:
   - `node ./.github/skills/pix-a11y/scripts/setup-axe-core.mjs --target "<project-root>" --mode "ci-blocking" --with-workflow true`
2. Audit:
   - `node ./.github/skills/pix-a11y/scripts/run-axe-audit.mjs --url "<url>" --out "reports/a11y/axe.json"`
3. Report HTML standalone (EN only):
   - `node ./.github/skills/pix-a11y/scripts/beautify-axe-report.mjs --input "reports/a11y/axe.json" --output "reports/a11y/axe-report.html" --title "Accessibility Audit" --css "./scripts/a11y/axe-report.css"`
4. SARIF:
   - `node ./.github/skills/pix-a11y/scripts/axe-to-sarif.mjs --input "reports/a11y/axe.json" --output "reports/a11y/axe.sarif"`
5. Baseline diff:
   - `node ./.github/skills/pix-a11y/scripts/diff-axe-baseline.mjs --baseline "reports/a11y/baseline.json" --current "reports/a11y/axe.json" --output "reports/a11y/diff.json"`
6. Checklist remediation:
   - `node ./.github/skills/pix-a11y/scripts/map-violations-checklist.mjs --input "reports/a11y/axe.json" --output "reports/a11y/remediation-checklist.md"`
7. CI gate:
   - `node ./.github/skills/pix-a11y/scripts/ci-gate-a11y.mjs --input "reports/a11y/axe.json" --block-impacts critical,serious`

Hard rules:
- report in English
- HTML artifact always generated
- SARIF always generated
- gate policy explicitly stated in output

Mandatory final output:
1. `Artifacts generated`
2. `Gate result`
3. `Top violations`
4. `Next remediation actions`
