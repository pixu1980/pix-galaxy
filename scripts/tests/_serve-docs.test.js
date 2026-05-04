// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs, resolveRequest } from '../_serve-docs.js';

test('parseArgs uses defaults', () => {
  const options = parseArgs([], {});

  assert.deepEqual(options, {
    packageName: null,
    port: 4173,
    host: '127.0.0.1',
  });
});

test('parseArgs accepts package, port, and host', () => {
  const options = parseArgs(['pix-button', '--port', '8080', '--host', '0.0.0.0'], {});

  assert.deepEqual(options, {
    packageName: 'pix-button',
    port: 8080,
    host: '0.0.0.0',
  });
});

test('resolveRequest redirects root to package docs when serving a single package', () => {
  const result = resolveRequest('/', 'pix-button');

  assert.deepEqual(result, {
    kind: 'redirect',
    location: '/pix-button/',
  });
});

test('resolveRequest serves index.html for directories', () => {
  const result = resolveRequest('/pix-button/', null);

  assert.deepEqual(result, {
    kind: 'file',
    relativePath: 'pix-button/index.html',
  });
});

test('resolveRequest blocks path traversal', () => {
  const result = resolveRequest('/../../etc/passwd', null);

  assert.equal(result.kind, 'error');
  assert.match(result.message, /invalid path/i);
});
