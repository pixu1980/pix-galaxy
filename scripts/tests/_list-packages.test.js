// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { formatPackageRows } from '../_list-packages.js';

test('formatPackageRows returns aligned output rows', () => {
  const rows = formatPackageRows([
    { folder: 'pix-button', packageName: '@pix-galaxy/pix-button' },
  ]);

  assert.equal(rows.length, 1);
  assert.match(rows[0], /pix-button/u);
  assert.match(rows[0], /@pix-galaxy\/pix-button/u);
});
