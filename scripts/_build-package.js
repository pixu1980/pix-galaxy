// @ts-check
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { log, logTitle } from './_cli.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');

/**
 * @param {string} repoRoot
 * @param {string} packageName
 * @returns {{ packageDir: string; srcDir: string; distDir: string }}
 */
export function resolvePackageContext(repoRoot, packageName) {
  const packageDir = join(repoRoot, 'packages', packageName);
  return {
    packageDir,
    srcDir: join(packageDir, 'src'),
    distDir: join(packageDir, 'dist'),
  };
}

/**
 * @param {string} srcDir
 * @param {string} outfile
 * @param {boolean} minify
 * @returns {import('esbuild').BuildOptions}
 */
export function createJavaScriptBuildOptions(srcDir, outfile, minify) {
  return {
    bundle: true,
    platform: 'browser',
    target: 'es2022',
    format: 'esm',
    legalComments: 'none',
    sourcemap: true,
    entryPoints: [join(srcDir, 'index.js')],
    outfile,
    minify,
    loader: {
      '.css': 'text',
      '.svg': 'text',
    },
  };
}

/**
 * @param {string} srcDir
 * @param {string} outfile
 * @param {boolean} minify
 * @returns {import('esbuild').BuildOptions}
 */
export function createStylesheetBuildOptions(srcDir, outfile, minify) {
  return {
    bundle: true,
    platform: 'browser',
    target: 'es2022',
    format: 'esm',
    legalComments: 'none',
    sourcemap: true,
    entryPoints: [join(srcDir, 'index.css')],
    outfile,
    minify,
  };
}

/**
 * @param {string} srcDir
 * @returns {Promise<string | null>}
 */
export async function resolveStylesheetEntry(srcDir) {
  const entryPath = join(srcDir, 'index.css');
  return existsSync(entryPath) ? entryPath : null;
}

/**
 * @param {string} packageName
 * @returns {Promise<void>}
 */
export async function buildPackage(packageName) {
  if (!packageName) {
    throw new Error('usage: node scripts/_build-package.js <package-folder-name>');
  }

  const { packageDir, srcDir, distDir } = resolvePackageContext(rootDir, packageName);

  if (!existsSync(packageDir)) {
    throw new Error(`package not found: ${packageName}`);
  }

  logTitle(`Building ${packageName}`);

  if (existsSync(distDir)) {
    await rm(distDir, { recursive: true, force: true });
  }
  await mkdir(distDir, { recursive: true });

  await esbuild.build(createJavaScriptBuildOptions(srcDir, join(distDir, 'index.js'), false));
  log('success', 'Built JS bundle');

  await esbuild.build(createJavaScriptBuildOptions(srcDir, join(distDir, 'index.min.js'), true));
  log('success', 'Built minified JS bundle');

  const stylesheetEntry = await resolveStylesheetEntry(srcDir);

  if (stylesheetEntry) {
    await esbuild.build(createStylesheetBuildOptions(srcDir, join(distDir, 'index.css'), false));
    log('success', 'Built CSS bundle');

    await esbuild.build(createStylesheetBuildOptions(srcDir, join(distDir, 'index.min.css'), true));
    log('success', 'Built minified CSS bundle');
  } else {
    log('info', 'No src/index.css found, skipping standalone CSS bundles');
  }

  log('step', 'Generating type declarations');
  execSync(`pnpm exec tsc -p packages/${packageName}/tsconfig.types.json`, {
    cwd: rootDir,
    stdio: 'inherit',
  });

  log('success', `Build complete: packages/${packageName}/dist`);
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? resolve(process.argv[1]) : '';

if (invokedFile === currentFile) {
  buildPackage(process.argv[2] ?? '').catch((error) => {
    log('error', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
