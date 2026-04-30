// @ts-check

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('package CSS declares stable layers', async () => {
  const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
  assert.match(css, /@layer reset, foundations, layout, components, helpers;/);
});
