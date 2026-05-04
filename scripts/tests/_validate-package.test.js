// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REQUIRED_PACKAGE_FILES,
  REQUIRED_SCRIPTS,
  validatePackageManifest,
} from '../_validate-package.js';

test('REQUIRED_SCRIPTS includes docs:serve', () => {
  assert.equal(REQUIRED_SCRIPTS.includes('docs:serve'), true);
});

test('REQUIRED_PACKAGE_FILES tracks markdown docs sources instead of package-local docs shell files', () => {
  assert.equal(REQUIRED_PACKAGE_FILES.includes('docs/content/getting-started.md'), true);
  assert.equal(REQUIRED_PACKAGE_FILES.includes('docs/index.html'), false);
});

test('validatePackageManifest reports missing scripts', () => {
  const result = validatePackageManifest({
    scripts: {
      build: 'node build',
      test: 'node test',
    },
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /docs:serve/u);
});

test('validatePackageManifest allows component packages without standalone css export', () => {
  const result = validatePackageManifest({
    type: 'module',
    scripts: {
      build: 'node build',
      test: 'node test',
      typecheck: 'node typecheck',
      validate: 'node validate',
      'docs:build': 'node docs',
      'docs:serve': 'node serve',
    },
    exports: {
      '.': {
        import: './dist/index.js',
      },
      './package.json': './package.json',
    },
  });

  assert.equal(result.ok, true);
});
