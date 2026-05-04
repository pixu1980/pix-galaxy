// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  groupConventionalCommits,
  parseConventionalCommit,
  renderChangelog,
  renderUnreleasedSection,
} from '../_generate-changelog.js';

test('parseConventionalCommit extracts type, scope, breaking, and description', () => {
  assert.deepEqual(parseConventionalCommit('feat(shared)!: align runtime package'), {
    type: 'feat',
    scope: 'shared',
    breaking: true,
    description: 'align runtime package',
  });
});

test('groupConventionalCommits buckets parsed commits into changelog sections', () => {
  const groups = groupConventionalCommits([
    'feat(button): add light-dom event bridge',
    'fix(card): preserve href after rerender',
    'docs: document package scaffolding',
    'chore(ci): refresh workflow versions',
  ]);

  assert.deepEqual(groups, {
    Breaking: [],
    Added: ['button: add light-dom event bridge'],
    Fixed: ['card: preserve href after rerender'],
    Documentation: ['document package scaffolding'],
    Maintenance: ['ci: refresh workflow versions'],
    Changed: [],
    Testing: [],
  });
});

test('renderUnreleasedSection omits empty categories and preserves order', () => {
  const markdown = renderUnreleasedSection([
    'feat: add shared runtime package',
    'fix(button): keep aria-disabled in sync',
  ]);

  assert.match(markdown, /^## Unreleased/m);
  assert.match(markdown, /### Added\n\n- add shared runtime package/);
  assert.match(markdown, /### Fixed\n\n- button: keep aria-disabled in sync/);
  assert.doesNotMatch(markdown, /### Documentation/);
});

test('renderChangelog replaces the unreleased section in an existing changelog', () => {
  const existing = [
    '# Changelog',
    '',
    'Intro text.',
    '',
    '## Unreleased',
    '',
    'Old body',
    '',
    '## 0.1.0 - 2026-04-28',
    '',
    '- first release',
    '',
  ].join('\n');

  const output = renderChangelog(existing, [
    'feat: add seeded docs pages',
  ]);

  assert.match(output, /## Unreleased\n\n### Added\n\n- add seeded docs pages\n\n## 0\.1\.0 - 2026-04-28/);
  assert.doesNotMatch(output, /Old body/);
});