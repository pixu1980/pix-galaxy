// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPackageFiles, buildPackageManifest, isValidPackageName, toPascalCase } from '../_create-package.js';

test('isValidPackageName accepts lowercase kebab-case names', () => {
  assert.equal(isValidPackageName('pix-baseline'), true);
  assert.equal(isValidPackageName('PixBaseline'), false);
});

test('toPascalCase converts kebab-case to PascalCase', () => {
  assert.equal(toPascalCase('pix-highlighter'), 'PixHighlighter');
});

test('buildPackageManifest includes docs:serve and omits standalone css export for component packages', () => {
  const manifest = buildPackageManifest('pix-baseline');

  assert.equal(manifest.scripts['docs:serve'], 'node ../../scripts/_serve-docs.js pix-baseline');
  assert.equal(manifest.exports['./css'], undefined);
  assert.equal(manifest.devDependencies['@pix-galaxy/shared'], 'workspace:*');
});

test('buildPackageFiles creates shared-runtime component package structure', () => {
  const files = buildPackageFiles('pix-baseline');

  assert.ok(files['../shared/decorator/index.js']);
  assert.ok(files['../shared/events/index.js']);
  assert.ok(files['../shared/template-engine/index.js']);
  assert.ok(files['src/components/PixBaseline/pix-baseline.js']);
  assert.ok(files['src/components/PixBaseline/pix-baseline.template.js']);
  assert.ok(files['src/components/PixBaseline/pix-baseline.consts.js']);
  assert.ok(files['src/components/PixBaseline/pix-baseline.utils.js']);
  assert.ok(files['src/components/PixBaseline/pix-baseline.attributes.js']);
  assert.ok(files['src/components/PixBaseline/pix-baseline.events.js']);
  assert.ok(files['src/components/PixBaseline/styles/pix-baseline.css']);
  assert.ok(files['src/components/PixBaseline/styles/_core.css']);
  assert.ok(files['src/components/PixBaseline/styles/states/_states.css']);
  assert.ok(files['docs/content/getting-started.md']);
  assert.ok(files['docs/content/examples.md']);
  assert.ok(files['docs/content/api.md']);
  assert.ok(files['docs/content/releasing.md']);
  assert.equal(files['docs/index.html'], undefined);
  assert.equal(files['docs/styles.css'], undefined);
  assert.equal(files['src/index.css'], undefined);

  assert.match(files['src/index.js'], /components\/PixBaseline\/pix-baseline\.js/);
  assert.doesNotMatch(files['src/index.js'], /pix-baseline\.utils\.js/);
  assert.match(files['src/index.js'], /export \{ PixBaseline, normalizeVariant \} from '\.\/components\/PixBaseline\/pix-baseline\.js';/);
  assert.match(files['src/components/PixBaseline/pix-baseline.js'], /static styles = styles/);
  assert.match(files['src/components/PixBaseline/pix-baseline.js'], /componentDecorator\(this\)/);
  assert.match(files['src/components/PixBaseline/pix-baseline.js'], /from '@pix-galaxy\/shared\/decorator\/index\.js'/);
  assert.match(files['src/components/PixBaseline/pix-baseline.js'], /export \{ normalizeVariant \} from '\.\/pix-baseline\.utils\.js';/);
  assert.doesNotMatch(files['src/components/PixBaseline/pix-baseline.js'], /attachShadow|shadowRoot|<template>/);
  assert.match(files['src/components/PixBaseline/pix-baseline.template.js'], /new TemplateEngine\(/);
  assert.match(files['src/components/PixBaseline/pix-baseline.template.js'], /from '@pix-galaxy\/shared\/template-engine\/index\.js'/);
  assert.match(files['src/components/PixBaseline/pix-baseline.template.js'], /engine\.html`/);
  assert.match(files['docs/content/getting-started.md'], /shared docs template/u);
  assert.match(files['docs/content/examples.md'], /<pix-baseline>/u);
  assert.doesNotMatch(files['../shared/template-engine/index.js'], /node:|jsdom|marked/);
});
