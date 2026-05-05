import { extname } from 'node:path';
import { readFile } from 'node:fs/promises';

const RAW_PREFIX = 'raw-text:';
const TEXT_EXTENSIONS = new Set(['.css', '.svg']);

export async function resolve(specifier, context, nextResolve) {
  const cleanSpecifier = specifier.endsWith('?raw') ? specifier.slice(0, -4) : specifier;

  if (!TEXT_EXTENSIONS.has(extname(cleanSpecifier))) {
    return nextResolve(specifier, context);
  }

  const resolved = new URL(cleanSpecifier, context.parentURL).href;
  return {
    shortCircuit: true,
    url: `${RAW_PREFIX}${resolved}`,
  };
}

export async function load(url, context, nextLoad) {
  if (!url.startsWith(RAW_PREFIX)) {
    return nextLoad(url, context);
  }

  const targetUrl = new URL(url.slice(RAW_PREFIX.length));
  const source = await readFile(targetUrl, 'utf8');
  return {
    format: 'module',
    shortCircuit: true,
    source: `export default ${JSON.stringify(source)};`,
  };
}
