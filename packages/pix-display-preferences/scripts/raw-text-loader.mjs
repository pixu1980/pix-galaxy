import { readFile } from 'node:fs/promises';

const RAW_QUERY = '?raw';

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.endsWith(RAW_QUERY)) {
    return nextResolve(specifier, context);
  }

  const resolved = new URL(specifier.slice(0, -RAW_QUERY.length), context.parentURL).href;
  return {
    shortCircuit: true,
    url: `raw-text:${resolved}`,
  };
}

export async function load(url, context, nextLoad) {
  if (!url.startsWith('raw-text:')) {
    return nextLoad(url, context);
  }

  const targetUrl = new URL(url.slice('raw-text:'.length));
  const source = await readFile(targetUrl, 'utf8');
  return {
    format: 'module',
    shortCircuit: true,
    source: `export default ${JSON.stringify(source)};`,
  };
}
