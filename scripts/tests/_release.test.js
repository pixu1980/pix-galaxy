// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const repoRoot = new URL('../../', import.meta.url);

test('root package exposes local release helper scripts', async () => {
  const manifest = JSON.parse(await readFile(new URL('package.json', repoRoot), 'utf8'));

  assert.equal(typeof manifest.scripts['rel:patch'], 'string');
  assert.equal(typeof manifest.scripts['rel:minor'], 'string');
  assert.equal(typeof manifest.scripts['rel:major'], 'string');
});

test('release workflow publishes committed dist artifacts without rebuilding packages in CI', async () => {
  const workflow = await readFile(new URL('.github/workflows/release.yml', repoRoot), 'utf8');

  assert.doesNotMatch(workflow, /name: Build packages/u);
  assert.match(workflow, /name: Verify release artifacts/u);
  assert.match(workflow, /run: pnpm release:verify/u);
});

test('root changelog exists and advertises conventional-commit generation', async () => {
  const changelog = await readFile(new URL('CHANGELOG.md', repoRoot), 'utf8');

  assert.match(changelog, /^# Changelog/mu);
  assert.match(changelog, /Generated from Conventional Commits/u);
  assert.match(changelog, /^## Unreleased$/mu);
});
