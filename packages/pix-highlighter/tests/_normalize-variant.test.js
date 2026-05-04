// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeVariant } from '../src/components/PixHighlighter/pix-highlighter.utils.js';

test('normalizeVariant returns default for null', () => {
  assert.equal(normalizeVariant(null), 'default');
});

test('normalizeVariant preserves outlined', () => {
  assert.equal(normalizeVariant('outlined'), 'outlined');
});
