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
  const output = getArg('--output') || 'reports/a11y/axe.sarif';

  if (!input) {
    throw new Error('Missing required argument: --input "<axe-json-path>"');
  }

  return { input, output };
};

/**
 * @param {string} impact
 * @returns {"error" | "warning" | "note"}
 */
const toSarifLevel = (impact) => {
  if (impact === 'critical' || impact === 'serious') {
    return 'error';
  }

  if (impact === 'moderate') {
    return 'warning';
  }

  return 'note';
};

/**
 * @returns {Promise<void>}
 */
const main = async () => {
  const { input, output } = parseArgs(process.argv.slice(2));
  const raw = await readFile(path.resolve(input), 'utf8');
  const payload = JSON.parse(raw);

  const violations = Array.isArray(payload.violations) ? payload.violations : [];

  const results = violations.flatMap((violation) => {
    const nodes = Array.isArray(violation.nodes) ? violation.nodes : [];

    return nodes.map((node) => {
      const selector = Array.isArray(node.target) ? node.target.join(', ') : 'unknown-selector';
      return {
        ruleId: String(violation.id || 'axe-rule'),
        level: toSarifLevel(String(violation.impact || 'minor')),
        message: {
          text: `${violation.help || 'Accessibility violation'} [target: ${selector}]`,
        },
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: payload.url || 'unknown-target',
              },
              region: {
                snippet: {
                  text: node.html || '',
                },
              },
            },
          },
        ],
        properties: {
          impact: violation.impact || 'unknown',
          helpUrl: violation.helpUrl || '',
          failureSummary: node.failureSummary || '',
        },
      };
    });
  });

  const rules = violations.map((violation) => ({
    id: String(violation.id || 'axe-rule'),
    shortDescription: { text: violation.help || 'Accessibility rule' },
    fullDescription: { text: violation.description || '' },
    helpUri: violation.helpUrl || '',
    properties: {
      tags: ['accessibility', 'wcag-2.2-aa', 'axe-core'],
      precision: 'high',
    },
  }));

  const sarif = {
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: payload.testEngine?.name || 'axe-core',
            version: payload.testEngine?.version || 'unknown',
            informationUri: 'https://github.com/dequelabs/axe-core',
            rules,
          },
        },
        results,
      },
    ],
  };

  const outPath = path.resolve(output);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(sarif, null, 2)}\n`, 'utf8');

  process.stdout.write(`SARIF generated: ${outPath}\n`);
};

main().catch((error) => {
  process.stderr.write(`axe-to-sarif error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
