import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { isAbsolute, resolve } from 'node:path';

const RAW_QUERY = '?raw';

/**
 * Resolve a `?raw` import to an absolute file path for esbuild.
 * Supports relative, absolute, and package specifiers.
 *
 * @param {{ path: string, resolveDir: string }} args Esbuild resolve arguments.
 * @returns {string} Absolute path to the raw imported file.
 */
function resolveRawPath(args) {
  const specifier = args.path.slice(0, -RAW_QUERY.length);

  if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('..')) {
    return isAbsolute(specifier) ? specifier : resolve(args.resolveDir, specifier);
  }

  const requireFromImporter = createRequire(resolve(args.resolveDir, '__raw_text_importer__.js'));
  return requireFromImporter.resolve(specifier);
}

/**
 * Create an esbuild plugin that inlines `?raw` imports as text modules.
 *
 * @returns {import('esbuild').Plugin} Esbuild plugin definition.
 */
export function rawTextEsbuildPlugin() {
  return {
    name: 'raw-text',
    setup(buildApi) {
      buildApi.onResolve({ filter: /\?raw$/ }, (args) => ({
        path: resolveRawPath(args),
        namespace: 'raw-text',
      }));

      buildApi.onLoad({ filter: /.*/, namespace: 'raw-text' }, async (args) => ({
        contents: await readFile(args.path, 'utf8'),
        loader: 'text',
      }));
    },
  };
}
