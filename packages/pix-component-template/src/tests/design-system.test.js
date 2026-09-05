import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe('Design system', () => {
  test('DS tokens are defined and self-contained', async () => {
    const cssText = await readFile(new URL('../../../pix-foundations/src/shared/_ds-tokens.css', import.meta.url), 'utf8');

    // Tokens are unlayered (light-dark() does not resolve inside CSS layers)
    assert.ok(cssText.includes(':root {'));
    assert.ok(cssText.includes('--pix-ink-950'));
    assert.ok(cssText.includes('--pix-t-sans'));
    assert.ok(cssText.includes('--pix-e-2'));
    assert.ok(!cssText.includes('@import'));
  });
});
