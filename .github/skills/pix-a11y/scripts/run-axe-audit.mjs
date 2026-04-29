// @ts-check

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * @param {string[]} argv
 * @returns {{ url: string; out: string; source: string }}
 */
const parseArgs = (argv) => {
  const getArg = (flag) => {
    const index = argv.findIndex((entry) => entry === flag);
    return index !== -1 ? argv[index + 1] : '';
  };

  return {
    url: getArg('--url'),
    out: getArg('--out') || 'reports/a11y/axe.json',
    source: getArg('--source') || '',
  };
};

/**
 * @returns {Promise<void>}
 */
const main = async () => {
  const { url, out, source } = parseArgs(process.argv.slice(2));

  if (!url && !source) {
    throw new Error('Provide one input source: --url "http://..." or --source "./page.html"');
  }

  let html = '';
  let targetUrl = url;

  if (source) {
    html = await readFile(path.resolve(source), 'utf8');
    targetUrl = `file://${path.resolve(source)}`;
  }

  const { JSDOM } = await import('jsdom');
  const axe = await import('axe-core');

  const dom = source ? new JSDOM(html) : await JSDOM.fromURL(url);
  const { window } = dom;

  const axeSource = axe.default?.source || axe.source;
  window.eval(axeSource);
  const result = await window.axe.run(window.document, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag22aa'],
    },
  });

  result.timestamp = new Date().toISOString();
  result.url = targetUrl;

  const outPath = path.resolve(out);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

  process.stdout.write(`Axe audit JSON generated: ${outPath}\n`);
};

main().catch((error) => {
  process.stderr.write(`run-axe-audit error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
