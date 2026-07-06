import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { buildDocsManifest } from '../../scripts/docs.mjs';

describe('docs build', () => {
  test('buildDocsManifest returns expected structure', async () => {
    const result = await buildDocsManifest();

    assert.ok(Array.isArray(result.docs));
    assert.ok(result.docs.length >= 1);
    assert.ok(result.meta.version);
    assert.ok(result.meta.generatedAt);
    assert.ok(result.meta.releaseTag);
  });

  test('each doc page has slug, title, html and sourcePath', async () => {
    const result = await buildDocsManifest();

    for (const doc of result.docs) {
      assert.equal(typeof doc.slug, 'string');
      assert.ok(doc.slug.length > 0);
      assert.equal(typeof doc.title, 'string');
      assert.ok(doc.title.length > 0);
      assert.equal(typeof doc.html, 'string');
      assert.ok(doc.html.length > 0);
      assert.ok(doc.sourcePath.startsWith('src/docs/content/'));
    }
  });

  test('docs markdown renders to valid HTML with code blocks', async () => {
    const result = await buildDocsManifest();
    const gettingStarted = result.docs.find((doc) => doc.slug === 'getting-started');

    assert.ok(gettingStarted);
    assert.ok(gettingStarted.html.includes('<pre'));
    assert.ok(gettingStarted.html.includes('<code'));
    assert.ok(gettingStarted.html.includes('</code>'));
  });

  test('meta contains valid semver version', async () => {
    const result = await buildDocsManifest();
    const versionPattern = /^\d+\.\d+\.\d+$/u;
    const tagPattern = /^v\d+\.\d+\.\d+$/u;

    assert.ok(versionPattern.test(result.meta.version));
    assert.ok(tagPattern.test(result.meta.releaseTag));
  });
});
