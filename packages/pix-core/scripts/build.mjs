import { accessSync, constants } from 'node:fs';
import { readFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import { rawTextEsbuildPlugin } from './raw-text-plugin.mjs';

const projectRoot = process.cwd();
const packageJsonPath = resolve(projectRoot, 'package.json');
const packagesRoot = resolve(projectRoot, '..');

const pkg = JSON.parse(await readFile(packageJsonPath, 'utf8'));
if (pkg.name && pkg.name.startsWith('{%')) {
  console.log('[template] Skipping build - uninitialized template detected.');
  console.log(
    '[template] Run `node ./scripts/init.mjs <package-name> "<description>" after scaffolding.'
  );
  process.exit(0);
}

/**
 * Bundle sibling `@pix-galaxy/*` packages from their `src/index.js` instead of
 * package `exports` → `artifact/`. Recursive `build:lib` runs without topology
 * when workspace cycles are ignored (ADR-028), so sibling artifacts may not
 * exist yet; resolving to source keeps published bundles self-contained (ADR-020).
 *
 * @returns {import('esbuild').Plugin}
 */
function workspaceSourcePlugin() {
  return {
    name: 'workspace-source',
    setup(buildApi) {
      buildApi.onResolve({ filter: /^@pix-galaxy\/[^/?]+$/ }, (args) => {
        const dirName = args.path.slice('@pix-galaxy/'.length);
        const sourceEntry = resolve(packagesRoot, dirName, 'src/index.js');
        try {
          accessSync(sourceEntry, constants.R_OK);
        } catch {
          return undefined;
        }
        return { path: sourceEntry };
      });
    },
  };
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
  plugins: [workspaceSourcePlugin(), rawTextEsbuildPlugin()],
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
