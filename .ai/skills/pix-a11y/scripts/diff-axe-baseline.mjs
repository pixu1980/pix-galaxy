// @ts-check

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * @param {string[]} argv
 * @returns {{ baseline: string; current: string; output: string }}
 */
const parseArgs = (argv) => {
  const getArg = (flag) => {
    const index = argv.findIndex((entry) => entry === flag);
    return index !== -1 ? argv[index + 1] : '';
  };

  const baseline = getArg('--baseline');
  const current = getArg('--current');
  const output = getArg('--output') || 'reports/a11y/diff.json';

  if (!baseline || !current) {
    throw new Error('Missing required arguments: --baseline "<baseline-json>" --current "<current-json>"');
  }

  return { baseline, current, output };
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
 * @param {any} result
 * @returns {Map<string, { id: string; impact: string; count: number }>}
 */
const buildViolationMap = (result) => {
  const map = new Map();
  const violations = Array.isArray(result?.violations) ? result.violations : [];

  for (const violation of violations) {
    const key = String(violation.id || 'unknown');
    const existing = map.get(key);
    const count = Array.isArray(violation.nodes) ? violation.nodes.length : 0;

    if (existing) {
      existing.count += count;
      continue;
    }

    map.set(key, {
      id: key,
      impact: String(violation.impact || 'unknown'),
      count,
    });
  }

  return map;
};

/**
 * @returns {Promise<void>}
 */
const main = async () => {
  const { baseline, current, output } = parseArgs(process.argv.slice(2));

  const baselinePath = path.resolve(baseline);
  const currentPath = path.resolve(current);

  const [hasBaseline, currentRaw] = await Promise.all([
    fileExists(baselinePath),
    readFile(currentPath, 'utf8'),
  ]);

  const baselineJson = hasBaseline
    ? JSON.parse(await readFile(baselinePath, 'utf8'))
    : { violations: [] };
  const currentJson = JSON.parse(currentRaw);

  const baselineMap = buildViolationMap(baselineJson);
  const currentMap = buildViolationMap(currentJson);

  const added = [];
  const removed = [];
  const changed = [];

  for (const [id, curr] of currentMap.entries()) {
    const prev = baselineMap.get(id);

    if (!prev) {
      added.push(curr);
      continue;
    }

    if (prev.count !== curr.count || prev.impact !== curr.impact) {
      changed.push({
        id,
        previous: prev,
        current: curr,
      });
    }
  }

  for (const [id, prev] of baselineMap.entries()) {
    if (!currentMap.has(id)) {
      removed.push(prev);
    }
  }

  const summary = {
    baselineViolations: baselineMap.size,
    currentViolations: currentMap.size,
    added: added.length,
    removed: removed.length,
    changed: changed.length,
  };

  const payload = {
    generatedAt: new Date().toISOString(),
    summary,
    added,
    removed,
    changed,
  };

  const outPath = path.resolve(output);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  process.stdout.write(`A11y baseline diff generated: ${outPath}\n`);
};

main().catch((error) => {
  process.stderr.write(`diff-axe-baseline error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
