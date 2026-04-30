// @ts-check

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * @param {string[]} argv
 * @returns {{ input: string; output: string }}
 */
const parseArgs = (argv) => {
  const getArg = (flag) => {
    const index = argv.findIndex((entry) => entry === flag);
    return index !== -1 ? argv[index + 1] : '';
  };

  const input = getArg('--input');
  const output = getArg('--output') || 'reports/a11y/remediation-checklist.md';

  if (!input) {
    throw new Error('Missing required argument: --input "<axe-json-path>"');
  }

  return { input, output };
};

/**
 * @param {string[]} targets
 * @returns {string}
 */
const inferComponent = (targets) => {
  const selector = (targets || []).join(' ');

  if (selector.includes('pix-button')) return 'pix-button';
  if (selector.includes('pix-card')) return 'pix-card';
  if (selector.includes('button')) return 'button';
  if (selector.includes('input') || selector.includes('form')) return 'form-controls';
  if (selector.includes('nav')) return 'navigation';

  return 'generic-ui';
};

/**
 * @param {string} ruleId
 * @returns {string[]}
 */
const remediationSteps = (ruleId) => {
  if (ruleId.includes('color-contrast')) {
    return [
      'Adjust foreground/background tokens to meet WCAG 2.2 AA contrast.',
      'Re-test disabled/hover/focus states for contrast regression.',
    ];
  }

  if (ruleId.includes('aria')) {
    return [
      'Prefer native semantic element before adding ARIA role/attribute.',
      'Ensure accessible name and state are programmatically exposed.',
    ];
  }

  if (ruleId.includes('label')) {
    return [
      'Attach explicit label to every form control.',
      'Verify error/help text is associated with control via aria-describedby.',
    ];
  }

  if (ruleId.includes('focus')) {
    return [
      'Restore visible focus style with sufficient contrast.',
      'Validate keyboard-only flow and tab order.',
    ];
  }

  return [
    'Review rule guidance and update semantic markup.',
    'Re-run axe audit and verify issue is resolved.',
  ];
};

/**
 * @returns {Promise<void>}
 */
const main = async () => {
  const { input, output } = parseArgs(process.argv.slice(2));
  const raw = await readFile(path.resolve(input), 'utf8');
  const payload = JSON.parse(raw);
  const violations = Array.isArray(payload.violations) ? payload.violations : [];

  /** @type {Map<string, Array<any>>} */
  const byComponent = new Map();

  for (const violation of violations) {
    const nodes = Array.isArray(violation.nodes) ? violation.nodes : [];

    for (const node of nodes) {
      const targets = Array.isArray(node.target) ? node.target : [];
      const component = inferComponent(targets);
      const item = {
        id: violation.id || 'unknown-rule',
        impact: violation.impact || 'unknown',
        target: targets.join(', ') || 'N/A',
        help: violation.help || '',
        steps: remediationSteps(String(violation.id || '')),
      };

      const current = byComponent.get(component) || [];
      current.push(item);
      byComponent.set(component, current);
    }
  }

  const lines = [
    '# Accessibility remediation checklist (design-system components)',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Target: ${payload.url || 'N/A'}`,
    '',
  ];

  if (byComponent.size === 0) {
    lines.push('No violations found.');
  }

  for (const [component, items] of byComponent.entries()) {
    lines.push(`## ${component}`);
    lines.push('');

    items.forEach((item, index) => {
      lines.push(`### ${index + 1}. ${item.id} (${item.impact})`);
      lines.push(`- Target: ${item.target}`);
      lines.push(`- Rule: ${item.help}`);
      lines.push(`- [ ] ${item.steps[0] || 'Review and remediate.'}`);
      lines.push(`- [ ] ${item.steps[1] || 'Re-run audit.'}`);
      lines.push('');
    });
  }

  const outPath = path.resolve(output);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, `${lines.join('\n')}\n`, 'utf8');

  process.stdout.write(`Remediation checklist generated: ${outPath}\n`);
};

main().catch((error) => {
  process.stderr.write(`map-violations-checklist error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
