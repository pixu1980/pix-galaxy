// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createJavaScriptBuildOptions, resolvePackageContext, resolveStylesheetEntry } from '../_build-package.js';

test('resolvePackageContext returns expected package paths', () => {
  const context = resolvePackageContext('/repo', 'pix-button');

  assert.equal(context.packageDir, '/repo/packages/pix-button');
  assert.equal(context.srcDir, '/repo/packages/pix-button/src');
  assert.equal(context.distDir, '/repo/packages/pix-button/dist');
});

test('createJavaScriptBuildOptions treats css and svg imports as raw text assets', () => {
  const options = createJavaScriptBuildOptions('/repo/packages/pix-button/src', '/repo/packages/pix-button/dist/index.js', false);

  assert.equal(options.loader['.css'], 'text');
  assert.equal(options.loader['.svg'], 'text');
});

test('resolveStylesheetEntry returns null when a component package has no src/index.css', async () => {
  const target = await mkdtemp(join(tmpdir(), 'pix-build-test-'));
  const srcDir = join(target, 'src');

  await mkdir(srcDir, { recursive: true });
  await writeFile(join(srcDir, 'index.js'), 'export const ready = true;\n', 'utf8');

  assert.equal(await resolveStylesheetEntry(srcDir), null);
});
