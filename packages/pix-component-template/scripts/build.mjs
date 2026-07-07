import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { mkdir, rm } from 'node:fs/promises';
import { rawTextEsbuildPlugin } from './raw-text-plugin.mjs';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const packageJsonPath = resolve(projectRoot, 'package.json');

// Detect if this is an uninitialized template (contains {% %} placeholders)
const pkg = JSON.parse(await readFile(packageJsonPath, 'utf8'));
if (pkg.name && pkg.name.startsWith('{%')) {
  console.log('[template] Skipping build - uninitialized template detected.');
  console.log('[template] Run `node ./scripts/init.mjs <package-name> "<description>"` after scaffolding.');
  process.exit(0);
}

const entryPoint = resolve(projectRoot, 'src/index.js');
const artifactDir = resolve(projectRoot, 'artifact');

const sharedOptions = {
  bundle: true,
  charset: 'utf8',
  entryPoints: [entryPoint],
  legalComments: 'none',
  logLevel: 'info',
  minify: true,
  platform: 'browser',
  plugins: [rawTextEsbuildPlugin()],
  target: ['es2020'],
  treeShaking: true,
};

await rm(artifactDir, { force: true, recursive: true });
await mkdir(artifactDir, { recursive: true });

await Promise.all([
  build({
    ...sharedOptions,
    format: 'esm',
    outfile: resolve(artifactDir, 'index.js'),
  }),
  build({
    ...sharedOptions,
    format: 'cjs',
    outfile: resolve(artifactDir, 'index.cjs'),
  }),
]);
