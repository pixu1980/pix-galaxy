import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const RAW_QUERY = '?raw';

export function rawTextEsbuildPlugin() {
  return {
    name: 'raw-text',
    setup(buildApi) {
      buildApi.onResolve({ filter: /\?raw$/ }, (args) => ({
        path: resolve(args.resolveDir, args.path.slice(0, -RAW_QUERY.length)),
        namespace: 'raw-text',
      }));

      buildApi.onLoad({ filter: /.*/, namespace: 'raw-text' }, async (args) => ({
        contents: await readFile(args.path, 'utf8'),
        loader: 'text',
      }));
    },
  };
}
