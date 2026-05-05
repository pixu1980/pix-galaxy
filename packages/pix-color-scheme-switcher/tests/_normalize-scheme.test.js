// @ts-check

import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeScheme } from '../src/components/PixColorSchemeSwitcher/pix-color-scheme-switcher.utils.js';

test('normalizeScheme preserves supported color schemes', () => {
  assert.equal(normalizeScheme('light'), 'light');
  assert.equal(normalizeScheme('dark'), 'dark');
  assert.equal(normalizeScheme('system'), 'system');
});

test('normalizeScheme falls back to system for unsupported values', () => {
  assert.equal(normalizeScheme('sepia'), 'system');
  assert.equal(normalizeScheme(null), 'system');
});
