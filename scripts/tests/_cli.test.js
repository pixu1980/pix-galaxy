// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { formatMessage, paint } from '../_cli.js';

test('paint applies ansi color codes', () => {
  const output = paint('pix', 'cyan');

  assert.match(output, /\u001b\[/u);
  assert.match(output, /pix/u);
});

test('formatMessage prefixes emoji by level', () => {
  const output = formatMessage('success', 'done');

  assert.match(output, /✅/u);
  assert.match(output, /done/u);
});
