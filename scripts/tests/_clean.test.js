// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { collectCleanTargets } from '../_clean.js';

test('collectCleanTargets returns site and every dist for full clean', () => {
  const targets = collectCleanTargets('/repo', ['pix-button', 'pix-card'], null);

  assert.deepEqual(targets, [
    '/repo/site',
    '/repo/packages/pix-button/dist',
    '/repo/packages/pix-card/dist',
  ]);
});

test('collectCleanTargets returns only target package dist for package clean', () => {
  const targets = collectCleanTargets('/repo', ['pix-button', 'pix-card'], 'pix-card');

  assert.deepEqual(targets, ['/repo/packages/pix-card/dist']);
});
