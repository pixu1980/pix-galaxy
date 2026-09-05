/**
 * catalog.test.mjs — unit tests for the portal's catalog logic
 * (src/docs/catalog.js): release-status mapping, card ordering
 * (ready-first, then downloads, then curated), section grouping and
 * hero summaries.
 */

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  buildReleaseStatus,
  COMPONENT_ORDER,
  groupSections,
  LIBRARY_ORDER,
  makeOrderRank,
  sortSection,
  summarize,
} from './catalog.js';

const ready = (name) => ({ name, packageName: `@pix-galaxy/${name}`, kind: 'component' });
const library = (name) => ({ name, packageName: `@pix-galaxy/${name}`, kind: 'library' });
const placeholder = (name) => ({ name });

describe('buildReleaseStatus', () => {
  test('maps ready / wip and defaults unmarked packages to wip', () => {
    const status = buildReleaseStatus([
      ['pix-a', { releaseStatus: 'ready' }],
      ['pix-b', { releaseStatus: 'wip' }],
      ['pix-c', {}],
      ['pix-d', null],
    ]);
    assert.equal(status.get('pix-a'), 'ready');
    assert.equal(status.get('pix-b'), 'wip');
    assert.equal(status.get('pix-c'), 'wip');
    assert.equal(status.has('pix-d'), false);
  });
});

describe('makeOrderRank', () => {
  test('ranks known names, unknowns rank last', () => {
    const rank = makeOrderRank(['a', 'b', 'c']);
    assert.equal(rank({ name: 'a' }), 0);
    assert.equal(rank({ name: 'c' }), 2);
    assert.equal(rank({ name: 'zzz' }), 3);
  });
});

describe('sortSection', () => {
  const status = buildReleaseStatus([
    ['ready-a', { releaseStatus: 'ready' }],
    ['ready-b', { releaseStatus: 'ready' }],
    ['wip-a', { releaseStatus: 'wip' }],
    ['wip-b', { releaseStatus: 'wip' }],
  ]);

  test('sorts ready first, then wip, then placeholders', () => {
    const items = [
      ready('wip-a'),
      ready('wip-b'),
      placeholder('soon'),
      ready('ready-a'),
      ready('ready-b'),
    ];
    const sorted = sortSection(items, [], status, {});
    assert.deepEqual(
      sorted.map((c) => c.name),
      ['ready-a', 'ready-b', 'wip-a', 'wip-b', 'soon']
    );
  });

  test('downloads win within the same status group', () => {
    const items = [ready('wip-a'), ready('wip-b')];
    const sorted = sortSection(items, ['wip-b', 'wip-a'], status, {
      '@pix-galaxy/wip-b': 120_000,
      '@pix-galaxy/wip-a': 10_000,
    });
    assert.deepEqual(
      sorted.map((c) => c.name),
      ['wip-b', 'wip-a']
    );
  });

  test('curated order is the tie-breaker when downloads are missing', () => {
    const items = [ready('wip-a'), ready('wip-b')];
    const sorted = sortSection(items, ['wip-b', 'wip-a'], status, {});
    assert.deepEqual(
      sorted.map((c) => c.name),
      ['wip-b', 'wip-a']
    );
  });

  test('placeholders sort last even when compared against each other', () => {
    const items = [ready('wip-a'), placeholder('soon-a'), placeholder('soon-b')];
    const sorted = sortSection(items, [], status, {});
    assert.deepEqual(
      sorted.map((c) => c.name),
      ['wip-a', 'soon-a', 'soon-b']
    );
  });
});

describe('groupSections', () => {
  test('Components section comes first, then Libraries', () => {
    const status = buildReleaseStatus([]);
    const components = [library('pix-foundations'), ready('pix-toast'), library('pix-color')];
    const sections = groupSections(components, { releaseStatus: status, downloads: {} });
    assert.deepEqual(
      sections.map((s) => s.title),
      ['Components', 'Libraries']
    );
    assert.deepEqual(
      sections[0].items.map((c) => c.name),
      ['pix-toast']
    );
    assert.deepEqual(
      sections[1].items.map((c) => c.name),
      ['pix-foundations', 'pix-color']
    );
  });

  test('exposes stable ids used by aria-labelledby', () => {
    const sections = groupSections([], {
      releaseStatus: new Map(),
      downloads: {},
    });
    assert.deepEqual(
      sections.map((s) => s.id),
      ['portal-components', 'portal-libraries']
    );
  });
});

describe('summarize', () => {
  test('counts wip packages and total cards, ignoring placeholders', () => {
    const status = buildReleaseStatus([
      ['a', { releaseStatus: 'ready' }],
      ['b', { releaseStatus: 'wip' }],
      ['c', { releaseStatus: 'wip' }],
    ]);
    const sections = [
      { items: [ready('a'), ready('b'), placeholder('soon')] },
      { items: [library('c')] },
    ];
    assert.deepEqual(summarize(sections, status), { wipCount: 2, totalCount: 4 });
  });

  test('packages missing from the status map are treated as wip', () => {
    const sections = [{ items: [ready('unknown-pkg')] }];
    assert.deepEqual(summarize(sections, new Map()), { wipCount: 1, totalCount: 1 });
  });
});

describe('catalog order definitions', () => {
  test('curated orders exist and are unique', () => {
    assert.equal(new Set(LIBRARY_ORDER).size, LIBRARY_ORDER.length);
    assert.equal(new Set(COMPONENT_ORDER).size, COMPONENT_ORDER.length);
    assert.ok(LIBRARY_ORDER.length >= 3);
    assert.ok(COMPONENT_ORDER.length >= 8);
  });
});
