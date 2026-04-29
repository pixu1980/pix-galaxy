// @ts-check

import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @param {string[]} argv
 * @returns {{ target: string; dest: string; withExamples: boolean }}
 */
const parseArgs = (argv) => {
  const targetIndex = argv.findIndex((arg) => arg === '--target');
  const destIndex = argv.findIndex((arg) => arg === '--dest');
  const withExamples = argv.includes('--with-examples');

  if (targetIndex === -1 || !argv[targetIndex + 1]) {
    throw new Error('Missing required argument: --target "<project-root>"');
  }

  return {
    target: argv[targetIndex + 1],
    dest: destIndex !== -1 && argv[destIndex + 1] ? argv[destIndex + 1] : 'src/template-engine',
    withExamples,
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
  const { target, dest, withExamples } = parseArgs(process.argv.slice(2));

  const currentFile = fileURLToPath(import.meta.url);
  const skillRoot = path.resolve(path.dirname(currentFile), '..');

  const sourceEngineDir = path.join(skillRoot, 'assets/template-engine');
  const sourceExamplesDir = path.join(skillRoot, 'assets/examples');

  const targetEngineDir = path.resolve(target, dest);
  const targetExamplesDir = path.resolve(target, 'examples/template-engine');

  await mkdir(targetEngineDir, { recursive: true });
  await cp(sourceEngineDir, targetEngineDir, { recursive: true, force: true });

  if (withExamples) {
    await mkdir(targetExamplesDir, { recursive: true });
    await cp(sourceExamplesDir, targetExamplesDir, { recursive: true, force: true });
  }

  const packageJsonPath = path.resolve(target, 'package.json');
  const hasPackageJson = await fileExists(packageJsonPath);

  if (hasPackageJson) {
    const packageRaw = await readFile(packageJsonPath, 'utf8');
    /** @type {any} */
    const packageJson = JSON.parse(packageRaw);

    packageJson.devDependencies ??= {};
    packageJson.devDependencies.jsdom ??= '^26.1.0';

    await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
  }

  const summary = {
    installedEngine: targetEngineDir,
    installedExamples: withExamples ? targetExamplesDir : null,
    packageJsonUpdated: hasPackageJson,
    nextSteps: [
      'Install dependencies with pnpm install',
      `Run tests: node --test ${path.join(dest, 'tests/*.test.js')}`,
      `Import TemplateEngine from ${path.join(dest, 'index.js')}`,
    ],
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
};

main().catch((error) => {
  process.stderr.write(`install-template-engine error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
