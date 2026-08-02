import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';

test('defines the shared token groups and consumes them in component and docs styles', async () => {
  const [tokensCss, componentCss, siteCss] = await Promise.all([
    readFile(new URL('../shared/_ds-tokens.css', import.meta.url), 'utf8'),
    readFile(new URL('../components/PixHighlighter/_PixHighlighter.css', import.meta.url), 'utf8'),
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

  // Component defines its own scoped tokens (ADR-012: local primitives
  // live in the component layer; foundations owns global primitives).
  assert.ok(componentCss.includes('var(--pix-highlighter--'));
  assert.ok(tokensCss.includes('light-dark('));
  assert.ok(siteCss.includes("@import '../shared/_ds-tokens.css';"));
  assert.ok(siteCss.includes('data-site-color-mode'));
  assert.ok(siteCss.includes('var(--pix-ds-accent-primary)'));
});
