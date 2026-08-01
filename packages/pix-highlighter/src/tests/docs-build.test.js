import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';

test('docs build derives pages and release metadata from src/docs markdown sources', async () => {
  const [{ buildDocsManifest }, docEntries, packageJsonText] = await Promise.all([
    import(new URL('../../../pix-core/scripts/docs.mjs', import.meta.url)),
    readdir(new URL('../docs/content/', import.meta.url)),
    readFile(new URL('../../package.json', import.meta.url), 'utf8'),
  ]);

  const { docs: docsPages, meta: siteMeta } = await buildDocsManifest();

  const packageJson = JSON.parse(packageJsonText);
  const markdownFiles = docEntries.filter((entry) => entry.endsWith('.md'));

  assert.equal(docsPages.length, markdownFiles.length);
  assert.ok(docsPages.every((doc) => doc.slug && doc.title && doc.html && doc.sourcePath));
  assert.ok(docsPages.some((doc) => doc.html.includes('<pre is="pix-highlighter"')));
  assert.equal(siteMeta.version, packageJson.version);
  assert.equal(siteMeta.releaseTag, `v${packageJson.version}`);
});
