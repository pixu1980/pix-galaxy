import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';

test('defines the shared token groups and consumes them in component and docs styles', async () => {
  const [tokensCss, componentCss, siteCss] = await Promise.all([
    readFile(new URL('../shared/_ds-tokens.css', import.meta.url), 'utf8'),
    readFile(new URL('../components/PixHighlighter/PixHighlighter.css', import.meta.url), 'utf8'),
    readFile(new URL('../docs/index.css', import.meta.url), 'utf8'),
  ]);

  for (const token of [
    '--pix-ds-color-ink-950',
    '--pix-ds-font-display',
    '--pix-ds-space-4',
    '--pix-ds--r--lg',
    '--pix-ds-elevation-2',
    '--pix-ds-duration-fast',
  ]) {
    assert.ok(tokensCss.includes(token), `missing token ${token}`);
  }

  assert.ok(componentCss.includes('var(--dout--radius-md, 0.85rem)'));
  assert.ok(
    componentCss.includes('var(--dout--motion-fast, 160ms) var(--dout--motion-ease, ease)')
  );
  assert.ok(tokensCss.includes('light-dark('));
  assert.ok(siteCss.includes("@import '../shared/_ds-tokens.css';"));
  assert.ok(siteCss.includes('[data-part="color-mode-group"]'));
  assert.ok(siteCss.includes('var(--pix-ds-font-display)'));
});
