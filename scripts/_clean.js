// @ts-check
import { existsSync, readdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { log, logTitle } from './_cli.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');

/**
 * @param {string} repoRoot
 * @param {string[]} packageNames
 * @param {string | null} targetPackage
 * @returns {string[]}
 */
export function collectCleanTargets(repoRoot, packageNames, targetPackage) {
  if (targetPackage) {
    return [join(repoRoot, 'packages', targetPackage, 'dist')];
  }

  return [
    join(repoRoot, 'site'),
    ...packageNames.map((pkg) => join(repoRoot, 'packages', pkg, 'dist')),
  ];
}

/**
 * @param {string | null} targetPackage
 * @returns {Promise<void>}
 */
export async function cleanArtifacts(targetPackage = null) {
  const packagesDir = join(rootDir, 'packages');
  const packageNames = existsSync(packagesDir) ? readdirSync(packagesDir) : [];

  if (targetPackage && !packageNames.includes(targetPackage)) {
    throw new Error(`package not found: ${targetPackage}`);
  }

  logTitle(targetPackage ? `Cleaning ${targetPackage}` : 'Cleaning repository artifacts');

  for (const target of collectCleanTargets(rootDir, packageNames, targetPackage)) {
    if (!existsSync(target)) {
      continue;
    }

    await rm(target, { recursive: true, force: true });
    log('success', `Removed ${target.replace(`${rootDir}/`, '')}`);
  }

  log('success', 'Clean complete');
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? resolve(process.argv[1]) : '';

if (invokedFile === currentFile) {
  cleanArtifacts(process.argv[2] ?? null).catch((error) => {
    log('error', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
