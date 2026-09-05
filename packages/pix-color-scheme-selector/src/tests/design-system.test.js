import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe('Design system', () => {
  test('DS tokens use pix-galaxy @layer', async () => {
    const cssText = await readFile(new URL('../../../pix-foundations/src/shared/_ds-tokens.css', import.meta.url), 'utf8');

    assert.ok(cssText.includes('@layer pix-galaxy'));
    assert.ok(cssText.includes('@layer design-system'));
    assert.ok(cssText.includes('--pix-ink-950'));
    assert.ok(cssText.includes('--pix-t-sans'));
    assert.ok(cssText.includes('--pix-e-2'));
    assert.ok(!cssText.includes('@import'));
  });
});
