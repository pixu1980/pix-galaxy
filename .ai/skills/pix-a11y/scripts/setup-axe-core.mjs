// @ts-check

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @param {string[]} argv
 * @returns {{ target: string; mode: string; withWorkflow: boolean }}
 */
const parseArgs = (argv) => {
  const getArg = (flag) => {
    const index = argv.findIndex((entry) => entry === flag);
    return index !== -1 ? argv[index + 1] : '';
  };

  const target = getArg('--target');

  if (!target) {
    throw new Error('Missing required argument: --target "<project-root>"');
  }

  return {
    target,
    mode: getArg('--mode') || 'report-only',
    withWorkflow: getArg('--with-workflow') !== 'false',
  };
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
 * @returns {Promise<void>}
 */
const main = async () => {
  const { target, mode, withWorkflow } = parseArgs(process.argv.slice(2));

  const targetRoot = path.resolve(target);
  const packageJsonPath = path.join(targetRoot, 'package.json');
  const scriptsDir = path.join(targetRoot, 'scripts', 'a11y');
  const workflowDir = path.join(targetRoot, '.github', 'workflows');

  const currentFile = fileURLToPath(import.meta.url);
  const skillRoot = path.resolve(path.dirname(currentFile), '..');

  await mkdir(scriptsDir, { recursive: true });

  const sourceRunner = path.join(skillRoot, 'scripts', 'run-axe-audit.mjs');
  const sourceBeautifier = path.join(skillRoot, 'scripts', 'beautify-axe-report.mjs');
  const sourceDiff = path.join(skillRoot, 'scripts', 'diff-axe-baseline.mjs');
  const sourceSarif = path.join(skillRoot, 'scripts', 'axe-to-sarif.mjs');
  const sourceChecklist = path.join(skillRoot, 'scripts', 'map-violations-checklist.mjs');
  const sourceGate = path.join(skillRoot, 'scripts', 'ci-gate-a11y.mjs');
  const sourceCss = path.join(skillRoot, 'assets', 'templates', 'report.css');
  const sourceWorkflow = path.join(skillRoot, 'assets', 'examples', 'a11y-workflow.yml');

  const [runnerContent, beautifierContent, diffContent, sarifContent, checklistContent, gateContent, cssContent, workflowContent] = await Promise.all([
    readFile(sourceRunner, 'utf8'),
    readFile(sourceBeautifier, 'utf8'),
    readFile(sourceDiff, 'utf8'),
    readFile(sourceSarif, 'utf8'),
    readFile(sourceChecklist, 'utf8'),
    readFile(sourceGate, 'utf8'),
    readFile(sourceCss, 'utf8'),
    readFile(sourceWorkflow, 'utf8'),
  ]);

  await Promise.all([
    writeFile(path.join(scriptsDir, 'run-axe-audit.mjs'), runnerContent, 'utf8'),
    writeFile(path.join(scriptsDir, 'beautify-axe-report.mjs'), beautifierContent, 'utf8'),
    writeFile(path.join(scriptsDir, 'diff-axe-baseline.mjs'), diffContent, 'utf8'),
    writeFile(path.join(scriptsDir, 'axe-to-sarif.mjs'), sarifContent, 'utf8'),
    writeFile(path.join(scriptsDir, 'map-violations-checklist.mjs'), checklistContent, 'utf8'),
    writeFile(path.join(scriptsDir, 'ci-gate-a11y.mjs'), gateContent, 'utf8'),
    writeFile(path.join(scriptsDir, 'axe-report.css'), cssContent, 'utf8'),
  ]);

  let workflowPath = '';
  if (withWorkflow) {
    await mkdir(workflowDir, { recursive: true });
    workflowPath = path.join(workflowDir, 'a11y-audit.yml');

    if (!(await fileExists(workflowPath))) {
      await writeFile(workflowPath, workflowContent, 'utf8');
    }
  }

  const packageRaw = await readFile(packageJsonPath, 'utf8');
  /** @type {any} */
  const packageJson = JSON.parse(packageRaw);

  packageJson.devDependencies ??= {};
  packageJson.devDependencies['axe-core'] ??= '^4.10.2';
  packageJson.devDependencies.jsdom ??= '^26.1.0';

  packageJson.scripts ??= {};
  packageJson.scripts['a11y:audit'] = 'node ./scripts/a11y/run-axe-audit.mjs --url "http://localhost:4173" --out "reports/a11y/axe.json"';
  packageJson.scripts['a11y:report'] = 'node ./scripts/a11y/beautify-axe-report.mjs --input "reports/a11y/axe.json" --output "reports/a11y/axe-report.html" --title "Accessibility Audit" --css "./scripts/a11y/axe-report.css"';
  packageJson.scripts['a11y:sarif'] = 'node ./scripts/a11y/axe-to-sarif.mjs --input "reports/a11y/axe.json" --output "reports/a11y/axe.sarif"';
  packageJson.scripts['a11y:checklist'] = 'node ./scripts/a11y/map-violations-checklist.mjs --input "reports/a11y/axe.json" --output "reports/a11y/remediation-checklist.md"';
  packageJson.scripts['a11y:diff'] = 'node ./scripts/a11y/diff-axe-baseline.mjs --baseline "reports/a11y/baseline.json" --current "reports/a11y/axe.json" --output "reports/a11y/diff.json"';
  packageJson.scripts['a11y:gate'] = 'node ./scripts/a11y/ci-gate-a11y.mjs --input "reports/a11y/axe.json" --block-impacts critical,serious';
  packageJson.scripts['a11y'] = 'pnpm run a11y:audit && pnpm run a11y:report && pnpm run a11y:sarif && pnpm run a11y:checklist';

  if (mode === 'ci-blocking') {
    packageJson.scripts['a11y:ci'] = 'pnpm run a11y && pnpm run a11y:diff && pnpm run a11y:gate';
  } else {
    packageJson.scripts['a11y:ci'] = 'pnpm run a11y && pnpm run a11y:diff';
  }

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');

  const summary = {
    updatedPackageJson: packageJsonPath,
    installedScripts: [
      path.join(scriptsDir, 'run-axe-audit.mjs'),
      path.join(scriptsDir, 'beautify-axe-report.mjs'),
      path.join(scriptsDir, 'diff-axe-baseline.mjs'),
      path.join(scriptsDir, 'axe-to-sarif.mjs'),
      path.join(scriptsDir, 'map-violations-checklist.mjs'),
      path.join(scriptsDir, 'ci-gate-a11y.mjs'),
      path.join(scriptsDir, 'axe-report.css'),
    ],
    mode,
    workflow: workflowPath || 'not-generated',
    nextSteps: [
      'pnpm install',
      'pnpm run a11y',
      'Open reports/a11y/axe-report.html',
    ],
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
};

main().catch((error) => {
  process.stderr.write(`setup-axe-core error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
