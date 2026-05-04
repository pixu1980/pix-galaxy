// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PIX_DESIGN_SYSTEM_PACKAGE } from '../src/index.js';

test('exports the package identifier', () => {
  assert.equal(PIX_DESIGN_SYSTEM_PACKAGE, '@pix-galaxy/pix-design-system');
});

test('keeps package css self-contained', async () => {
  const indexCss = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

  assert.doesNotMatch(indexCss, /\.github|\.ai|shared\/styles|\.\.\/\.\./);
  assert.match(indexCss, /@layer reset, foundations, layout, components, helpers;/);
});
