// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('pix-baseline uses the shared decorator architecture', async () => {
  const componentJs = await readFile(new URL('../src/components/PixBaseline/pix-baseline.js', import.meta.url), 'utf8');
  const templateJs = await readFile(new URL('../src/components/PixBaseline/pix-baseline.template.js', import.meta.url), 'utf8');

  assert.match(componentJs, /static styles = styles/);
  assert.match(componentJs, /componentDecorator\(this\)/);
  assert.doesNotMatch(componentJs, /attachShadow|shadowRoot|<template>/);
  assert.match(templateJs, /new TemplateEngine\(/);
});
