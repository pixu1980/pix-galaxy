// @ts-check

import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * @param {string[]} argv
 * @returns {{ input: string; blockImpacts: string[] }}
 */
const parseArgs = (argv) => {
  const getArg = (flag) => {
    const index = argv.findIndex((entry) => entry === flag);
    return index !== -1 ? argv[index + 1] : '';
  };

  const input = getArg('--input') || 'reports/a11y/axe.json';
  const blockImpacts = (getArg('--block-impacts') || 'critical,serious')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return { input, blockImpacts };
};

/**
 * @returns {Promise<void>}
 */
const main = async () => {
  const { input, blockImpacts } = parseArgs(process.argv.slice(2));
  const raw = await readFile(path.resolve(input), 'utf8');
  const payload = JSON.parse(raw);
  const violations = Array.isArray(payload.violations) ? payload.violations : [];

  const blocked = violations.filter((violation) => blockImpacts.includes(String(violation.impact || 'unknown')));

  if (blocked.length > 0) {
    process.stderr.write(`A11y CI gate failed. Blocking violations: ${blocked.length}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write('A11y CI gate passed.\n');
};

main().catch((error) => {
  process.stderr.write(`ci-gate-a11y error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
