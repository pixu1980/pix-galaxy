// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { log, logTitle } from './_cli.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');

export const REQUIRED_SCRIPTS = Object.freeze([
  'build',
  'test',
  'typecheck',
  'validate',
  'docs:build',
  'docs:serve',
]);

/**
 * @param {Record<string, any>} pkg
 * @returns {{ ok: boolean; errors: string[] }}
 */
export function validatePackageManifest(pkg) {
  const errors = [];

  for (const script of REQUIRED_SCRIPTS) {
    if (typeof pkg.scripts?.[script] !== 'string') {
      errors.push(`missing script: ${script}`);
    }
  }

  if ((Object.keys(pkg.dependencies ?? {})).length > 0) {
    errors.push('runtime dependencies are not allowed');
  }

  if (pkg.type !== 'module') {
    errors.push('package type must be module');
  }

  if (pkg.exports?.['.']?.import == null) {
    errors.push('exports["."].import must be defined');
  }

  return { ok: errors.length === 0, errors };
}

/**
 * @param {string} targetPackage
 * @returns {void}
 */
export function validatePackage(targetPackage) {
  if (!targetPackage) {
    throw new Error('usage: node scripts/_validate-package.js <package-folder-name>');
  }

  const packageDir = join(rootDir, 'packages', targetPackage);
  if (!existsSync(packageDir)) {
    throw new Error(`package not found: ${targetPackage}`);
  }

  logTitle(`Validating ${targetPackage}`);

  const requiredFiles = [
    'package.json',
    'src/index.js',
    'README.md',
    'docs/index.html',
    'tsconfig.types.json',
    'tests/index.js',
  ];

  let hasErrors = false;
  for (const relativePath of requiredFiles) {
    const full = join(packageDir, relativePath);
    if (!existsSync(full)) {
      log('error', `Missing ${relativePath}`);
      hasErrors = true;
    } else {
      log('success', `Found ${relativePath}`);
    }
  }

  const pkg = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
  const manifestResult = validatePackageManifest(pkg);

  for (const message of manifestResult.errors) {
    log('error', message);
  }

  if (!manifestResult.ok || hasErrors) {
    throw new Error(`validation failed for ${targetPackage}`);
  }

  log('success', `Validation passed for ${targetPackage}`);
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? resolve(process.argv[1]) : '';

if (invokedFile === currentFile) {
  try {
    validatePackage(process.argv[2] ?? '');
  } catch (error) {
    log('error', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
