// @ts-check
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, isAbsolute, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDocsSite } from './_build-docs.js';
import { log, logTitle } from './_cli.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const siteDir = join(rootDir, 'site');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

/**
 * @param {string[]} argv
 * @param {NodeJS.ProcessEnv} env
 * @returns {{ packageName: string | null; port: number; host: string }}
 */
export function parseArgs(argv, env = process.env) {
  const options = {
    packageName: null,
    port: Number.parseInt(env.PORT ?? '4173', 10),
    host: env.HOST ?? '127.0.0.1',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const entry = argv[index];

    if (entry === '--port') {
      options.port = Number.parseInt(argv[index + 1] ?? '', 10);
      index += 1;
      continue;
    }

    if (entry === '--host') {
      options.host = argv[index + 1] ?? options.host;
      index += 1;
      continue;
    }

    if (entry.startsWith('--')) {
      throw new Error(`unknown option: ${entry}`);
    }

    if (options.packageName !== null) {
      throw new Error('only one package name can be served at a time');
    }

    options.packageName = entry;
  }

  if (!Number.isInteger(options.port) || options.port < 1 || options.port > 65535) {
    throw new Error(`invalid port: ${options.port}`);
  }

  return options;
}

/**
 * @param {string} pathname
 * @param {string | null} packageName
 * @returns {{ kind: 'file'; relativePath: string } | { kind: 'redirect'; location: string } | { kind: 'error'; message: string }}
 */
export function resolveRequest(pathname, packageName) {
  const decodedPath = decodeURIComponent(pathname);

  if (packageName && decodedPath === '/') {
    return { kind: 'redirect', location: `/${packageName}/` };
  }

  const relativePath = decodedPath === '/'
    ? 'index.html'
    : decodedPath.endsWith('/')
      ? `${decodedPath.slice(1)}index.html`
      : decodedPath.slice(1);

  const normalizedPath = normalize(relativePath);
  if (
    normalizedPath.startsWith(`..${sep}`)
    || normalizedPath === '..'
    || normalizedPath.includes(`${sep}..${sep}`)
    || isAbsolute(normalizedPath)
  ) {
    return { kind: 'error', message: 'invalid path' };
  }

  return { kind: 'file', relativePath: normalizedPath.replaceAll(sep, '/') };
}

/**
 * @param {{ packageName: string | null; port: number; host: string }} options
 * @returns {Promise<void>}
 */
export async function serveDocs(options) {
  logTitle(options.packageName ? `Serving docs for ${options.packageName}` : 'Serving docs site');
  await buildDocsSite(options.packageName);

  if (!existsSync(siteDir)) {
    throw new Error('site directory not found after docs build');
  }

  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const resolution = resolveRequest(url.pathname, options.packageName);

    if (resolution.kind === 'redirect') {
      response.writeHead(302, { Location: resolution.location });
      response.end();
      return;
    }

    if (resolution.kind === 'error') {
      response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(`${resolution.message}\n`);
      return;
    }

    let filePath = join(siteDir, resolution.relativePath);
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        response.writeHead(302, { Location: `${url.pathname}/` });
        response.end();
        return;
      }

      filePath = join(filePath, 'index.html');
    }

    if (!existsSync(filePath)) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('not found\n');
      return;
    }

    response.writeHead(200, { 'Content-Type': MIME_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream' });
    createReadStream(filePath).pipe(response);
  });

  await new Promise((resolvePromise, rejectPromise) => {
    server.once('error', rejectPromise);
    server.listen(options.port, options.host, resolvePromise);
  });

  const startPath = options.packageName ? `/${options.packageName}/` : '/';
  log('success', `Serving docs at http://${options.host}:${options.port}${startPath}`);
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? resolve(process.argv[1]) : '';

if (invokedFile === currentFile) {
  serveDocs(parseArgs(process.argv.slice(2))).catch((error) => {
    log('error', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
