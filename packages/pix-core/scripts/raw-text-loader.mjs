import { readFile } from 'node:fs/promises';

const RAW_QUERY = '?raw';

/**
 * Resolve Node ESM `?raw` specifiers into a private `raw-text:` URL.
 *
 * @param {string} specifier Import specifier passed by Node.
 * @param {object} context Loader resolution context.
 * @param {Function} nextResolve Default Node resolver.
 * @returns {Promise<object>} Loader resolve result.
 */
export async function resolve(specifier, context, nextResolve) {
  if (!specifier.endsWith(RAW_QUERY)) {
    return nextResolve(specifier, context);
  }

  const resolved = await nextResolve(specifier.slice(0, -RAW_QUERY.length), context);
  return {
    shortCircuit: true,
    url: `raw-text:${resolved.url}`,
  };
}

/**
 * Load `raw-text:` URLs as ESM modules exporting file contents.
 *
 * @param {string} url URL produced by `resolve()`.
 * @param {object} context Loader load context.
 * @param {Function} nextLoad Default Node loader.
 * @returns {Promise<object>} Loader load result.
 */
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
