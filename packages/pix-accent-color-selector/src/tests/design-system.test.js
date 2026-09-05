import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe('Design system', () => {
  test('tokens are defined and self-contained across palettes + ds-tokens', async () => {
    const [ds, palettes] = await Promise.all([
      readFile(new URL('../../../pix-foundations/src/shared/_ds-tokens.css', import.meta.url), 'utf8'),
      readFile(new URL('../../../pix-foundations/lib/_palettes.css', import.meta.url), 'utf8'),
    ]);

    // Scheme-independent tokens (unlayered, no @import, no light-dark())
    assert.ok(ds.includes(':root {'));
    assert.ok(ds.includes('--pix-t-sans'));
    assert.ok(ds.includes('--pix-e-2'));
    assert.ok(!ds.includes('@import'));

    // Calibrated palettes define light + dark schemes driven by the toggle
    assert.ok(palettes.includes('--pix-ink-950'));
    assert.ok(palettes.includes(":root[data-color-scheme='dark']"));
    assert.ok(palettes.includes('@media (prefers-color-scheme: dark)'));
    assert.ok(palettes.includes(":root[data-increase-contrast='true']"));
    assert.ok(!palettes.includes('light-dark('));
  });
});
