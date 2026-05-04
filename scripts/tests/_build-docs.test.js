// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderRootIndex, resolvePackages } from '../_build-docs.js';

test('resolvePackages returns all packages when no target is set', () => {
  assert.deepEqual(resolvePackages(['pix-button', 'pix-card'], null), ['pix-button', 'pix-card']);
});

test('resolvePackages throws when target package is missing', () => {
  assert.throws(() => resolvePackages(['pix-button'], 'pix-card'), /package not found/u);
});

test('renderRootIndex includes package links', () => {
  const html = renderRootIndex([
    { folder: 'pix-button', packageName: '@pix-galaxy/pix-button' },
  ]);

  assert.match(html, /@pix-galaxy\/pix-button/u);
  assert.match(html, /\.\/pix-button\//u);
});
