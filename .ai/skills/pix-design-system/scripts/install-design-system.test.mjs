// @ts-check

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const skillRoot = path.resolve(path.dirname(currentFile), '..');
const scriptPath = path.join(skillRoot, 'scripts', 'install-design-system.mjs');

const createTarget = async () => {
  return mkdtemp(path.join(os.tmpdir(), 'pix-design-system-'));
};

/**
 * @param {string} target
 * @param {string[]} args
 * @returns {ReturnType<typeof spawnSync>}
 */
const runInstaller = (target, args = []) => {
  return spawnSync(process.execPath, [scriptPath, '--target', target, ...args], {
    cwd: target,
    encoding: 'utf8',
  });
};

/**
 * @param {string} target
 * @param {string} relativePath
 * @returns {Promise<string>}
 */
const readTargetFile = (target, relativePath) => {
  return readFile(path.join(target, relativePath), 'utf8');
};

test('installs app design system by default', async () => {
  const target = await createTarget();
  const result = runInstaller(target);

  assert.equal(result.status, 0, result.stderr);

  const indexCss = await readTargetFile(target, 'src/styles/index.css');
  const colorsCss = await readTargetFile(target, 'src/styles/foundations/colors.css');
  const docs = await readTargetFile(target, 'docs/design-system.md');

  assert.match(indexCss, /@layer reset, foundations, layout, components, helpers;/);
  assert.match(indexCss, /@import "\.\/reset\.css" layer\(reset\);/);
  assert.match(colorsCss, /--color-primitive-accent-500: #3f6df6;/);
  assert.match(docs, /# pix Design System/);
});

test('installs package design system with default package name and destination', async () => {
  const target = await createTarget();
  const result = runInstaller(target, ['--mode', 'package']);

  assert.equal(result.status, 0, result.stderr);

  const packageJson = JSON.parse(await readTargetFile(target, 'packages/pix-design-system/package.json'));
  const indexCss = await readTargetFile(target, 'packages/pix-design-system/src/index.css');

  assert.equal(packageJson.name, '@pix-galaxy/pix-design-system');
  assert.equal(packageJson.sideEffects.includes('**/*.css'), true);
  assert.match(indexCss, /@layer reset, foundations, layout, components, helpers;/);
});

test('accepts package name and destination overrides', async () => {
  const target = await createTarget();
  const result = runInstaller(target, [
    '--mode',
    'package',
    '--package-name',
    '@example/tokens',
    '--dest',
    'vendor/design-system',
  ]);

  assert.equal(result.status, 0, result.stderr);

  const packageJson = JSON.parse(await readTargetFile(target, 'vendor/design-system/package.json'));
  assert.equal(packageJson.name, '@example/tokens');
});

test('fails safely when output files already exist without force', async () => {
  const target = await createTarget();
  await mkdir(path.join(target, 'src/styles'), { recursive: true });
  await writeFile(path.join(target, 'src/styles/index.css'), 'existing file\n', 'utf8');

  const result = runInstaller(target);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /install-design-system error:/);
  assert.match(result.stderr, /src\/styles\/index\.css/);
});

test('force overwrites conflicting files', async () => {
  const target = await createTarget();
  await mkdir(path.join(target, 'src/styles'), { recursive: true });
  await writeFile(path.join(target, 'src/styles/index.css'), 'existing file\n', 'utf8');

  const result = runInstaller(target, ['--force']);

  assert.equal(result.status, 0, result.stderr);

  const indexCss = await readTargetFile(target, 'src/styles/index.css');
  assert.match(indexCss, /@layer reset, foundations, layout, components, helpers;/);
});

test('applies brand, accent, font, radius, and density overrides', async () => {
  const target = await createTarget();
  const result = runInstaller(target, [
    '--brand-name',
    'Nova UI',
    '--accent',
    '#ff5500',
    '--font',
    'Fraunces, serif',
    '--radius',
    'round',
    '--density',
    'compact',
  ]);

  assert.equal(result.status, 0, result.stderr);

  const typographyCss = await readTargetFile(target, 'src/styles/foundations/typography.css');
  const colorsCss = await readTargetFile(target, 'src/styles/foundations/colors.css');
  const radiiCss = await readTargetFile(target, 'src/styles/foundations/radii.css');
  const spacingCss = await readTargetFile(target, 'src/styles/foundations/spacing.css');
  const docs = await readTargetFile(target, 'docs/design-system.md');

  assert.match(typographyCss, /--font-family-sans: Fraunces, serif;/);
  assert.match(colorsCss, /--color-primitive-accent-500: #ff5500;/);
  assert.match(radiiCss, /--radius-control: 1\.6rem;/);
  assert.match(spacingCss, /--density-scale: 0\.875;/);
  assert.match(docs, /# Nova UI/);
});

test('copies optional docs site when requested', async () => {
  const target = await createTarget();
  const result = runInstaller(target, ['--docs-site']);

  assert.equal(result.status, 0, result.stderr);

  const docsSite = await readTargetFile(target, 'docs/design-system-site/index.html');
  assert.match(docsSite, /pix Design System/);
});
