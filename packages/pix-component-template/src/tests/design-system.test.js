import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe('Design system', () => {
  test('DS tokens use pix-galaxy @layer', async () => {
    const cssText = await readFile(
      new URL('../shared/_ds-tokens.css', import.meta.url),
      'utf8'
    );

    assert.ok(cssText.includes('@layer pix-galaxy'));
    assert.ok(cssText.includes('@layer design-system'));
    assert.ok(cssText.includes('--pix-ds-color-ink-950'));
    assert.ok(cssText.includes('--pix-ds-font-sans'));
    assert.ok(cssText.includes('--pix-ds-elevation-2'));
    assert.ok(!cssText.includes('@import'));
  });
});
