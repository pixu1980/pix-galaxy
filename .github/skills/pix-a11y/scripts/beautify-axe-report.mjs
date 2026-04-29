// @ts-check

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @param {string[]} argv
 * @returns {{ input: string; output: string; title: string; css: string }}
 */
const parseArgs = (argv) => {
  const getArg = (flag) => {
    const index = argv.findIndex((entry) => entry === flag);
    return index !== -1 ? argv[index + 1] : '';
  };

  const input = getArg('--input');
  const output = getArg('--output');
  const title = getArg('--title') || 'Axe Accessibility Report';
  const css = getArg('--css') || '';

  if (!input) {
    throw new Error('Missing required argument: --input "<axe-json-path>"');
  }

  if (!output) {
    throw new Error('Missing required argument: --output "<report-html-path>"');
  }

  return { input, output, title, css };
};

/**
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
const fileExists = async (filePath) => {
  try {
    await readFile(filePath, 'utf8');
    return true;
  } catch {
    return false;
  }
};

/**
 * @param {string} value
 * @returns {string}
 */
const escapeHtml = (value) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
};

/**
 * @param {Array<any>} violations
 * @returns {Record<string, number>}
 */
const summarizeByImpact = (violations) => {
  return violations.reduce((acc, violation) => {
    const impact = violation.impact || 'unknown';
    acc[impact] = (acc[impact] || 0) + 1;
    return acc;
  }, /** @type {Record<string, number>} */ ({}));
};

/**
 * @param {Record<string, number>} summary
 * @returns {string}
 */
const renderSummaryCards = (summary) => {
  const impacts = ['critical', 'serious', 'moderate', 'minor', 'unknown'];
  return impacts
    .filter((impact) => summary[impact])
    .map((impact) => {
      const count = summary[impact];
      const impactClass = `impact-${impact}`;
      return `<article class="summary-card ${impactClass}"><h3>${escapeHtml(impact)}</h3><strong>${count}</strong><p>violations</p></article>`;
    })
    .join('');
};

/**
 * @param {Array<any>} violations
 * @returns {string}
 */
const renderViolations = (violations) => {
  return violations
    .map((violation) => {
      const nodes = Array.isArray(violation.nodes) ? violation.nodes : [];
      const nodeBlocks = nodes
        .map((node) => {
          const target = Array.isArray(node.target) ? node.target.join(', ') : '';
          const html = node.html || '';
          const failureSummary = node.failureSummary || '';

          return [
            '<article>',
            `<p><strong>Target:</strong> ${escapeHtml(target || 'N/A')}</p>`,
            `<p><strong>Failure:</strong> ${escapeHtml(failureSummary || 'N/A')}</p>`,
            `<pre><code>${escapeHtml(html)}</code></pre>`,
            '</article>',
          ].join('');
        })
        .join('');

      return [
        `<section class="violation impact-${escapeHtml(violation.impact || 'unknown')}">`,
        `<h3>${escapeHtml(violation.id || 'unknown-rule')}</h3>`,
        `<p>${escapeHtml(violation.help || '')}</p>`,
        `<p><strong>Impact:</strong> ${escapeHtml(violation.impact || 'unknown')}</p>`,
        `<p><strong>Description:</strong> ${escapeHtml(violation.description || '')}</p>`,
        violation.helpUrl ? `<p><a href="${escapeHtml(violation.helpUrl)}">Rule documentation</a></p>` : '',
        nodeBlocks,
        '</section>',
      ].join('');
    })
    .join('');
};

/**
 * @returns {Promise<void>}
 */
const main = async () => {
  const { input, output, title, css } = parseArgs(process.argv.slice(2));

  const currentFile = fileURLToPath(import.meta.url);
  const scriptDir = path.dirname(currentFile);
  const skillRoot = path.resolve(scriptDir, '..');

  const candidateCssPaths = [
    css ? path.resolve(css) : '',
    path.join(scriptDir, 'axe-report.css'),
    path.join(skillRoot, 'assets/templates/report.css'),
  ].filter(Boolean);

  let cssPath = '';
  for (const candidate of candidateCssPaths) {
    const exists = await fileExists(candidate);
    if (exists) {
      cssPath = candidate;
      break;
    }
  }

  if (!cssPath) {
    throw new Error('Cannot find report CSS. Use --css "<path-to-report.css>".');
  }

  const [rawInput, cssContent] = await Promise.all([
    readFile(path.resolve(input), 'utf8'),
    readFile(cssPath, 'utf8'),
  ]);

  const payload = JSON.parse(rawInput);
  const violations = Array.isArray(payload.violations) ? payload.violations : [];
  const summary = summarizeByImpact(violations);

  const html = [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${escapeHtml(title)}</title>`,
    `<style>${cssContent}</style>`,
    '</head>',
    '<body>',
    '<main>',
    '<header>',
    `<h1>${escapeHtml(title)}</h1>`,
    `<p><strong>URL:</strong> ${escapeHtml(payload.url || 'N/A')}</p>`,
    `<p><strong>Timestamp:</strong> ${escapeHtml(payload.timestamp || new Date().toISOString())}</p>`,
    `<p><strong>Engine:</strong> ${escapeHtml(payload.testEngine?.name || 'axe-core')} ${escapeHtml(payload.testEngine?.version || '')}</p>`,
    '</header>',
    '<section>',
    '<h2>Summary by impact</h2>',
    `<div class="summary-grid">${renderSummaryCards(summary)}</div>`,
    '</section>',
    '<section>',
    `<h2>Violations (${violations.length})</h2>`,
    violations.length > 0 ? renderViolations(violations) : '<p>No violations found.</p>',
    '</section>',
    '</main>',
    '</body>',
    '</html>',
  ].join('');

  await writeFile(path.resolve(output), `${html}\n`, 'utf8');
  process.stdout.write(`Standalone report generated: ${path.resolve(output)}\n`);
};

main().catch((error) => {
  process.stderr.write(`beautify-axe-report error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
