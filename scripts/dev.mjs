#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const args = process.argv.slice(2);
const getFlag = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : undefined;
};

const configRel = getFlag('--config');
const name = getFlag('--name') || 'pix-galaxy';
const configPath = configRel ? resolve(process.cwd(), configRel) : undefined;
const explicitPort = getFlag('--port');

const MIN_PORT = 3000;
const MAX_PORT = 6000;

/**
 * @returns {Promise<'free' | 'busy' | 'unavailable'>}
 */
function probePort(port, host) {
  return new Promise((resolveStatus) => {
    const server = createServer();
    server.once('error', (err) => {
      resolveStatus(err.code === 'EADDRINUSE' ? 'busy' : 'unavailable');
    });
    server.listen(port, host, () => {
      server.close(() => resolveStatus('free'));
    });
  });
}

async function findFreePort(start = MIN_PORT) {
  for (let port = start; port <= MAX_PORT; port++) {
    const v4 = await probePort(port, '127.0.0.1');
    if (v4 !== 'free') continue;
    const v6 = await probePort(port, '::');
    if (v6 === 'busy') continue;
    return port;
  }
  throw new Error(`[${name}] no free port in ${MIN_PORT}-${MAX_PORT}`);
}

async function main() {
  // Use explicit port if provided (e.g. from dev-all.mjs), otherwise auto-detect
  const port = explicitPort !== undefined ? Number(explicitPort) : await findFreePort(MIN_PORT);

  const viteBin = resolve(projectRoot, 'node_modules', '.bin', 'vite');
  const viteArgs = ['--port', String(port), '--strict-port', 'true'];
  if (configPath) {
    viteArgs.push('--config', configPath);
  }

  const proc = spawn(viteBin, viteArgs, {
    cwd: projectRoot,
    stdio: 'inherit',
    env: { ...process.env },
  });

  // Only install signal handlers when running directly in terminal
  // (not when spawned by dev-all.mjs, which manages signals itself)
  if (process.stdout.isTTY) {
    process.on('SIGINT', () => {
      console.log(`\n  ⏎  ${name} shutting down gracefully\n`);
      proc.kill('SIGINT');
      setTimeout(() => process.exit(0), 2000);
    });
    process.on('SIGTERM', () => {
      proc.kill('SIGTERM');
      setTimeout(() => process.exit(0), 2000);
    });
  }

  proc.on('exit', (code, signal) => {
    // Exit cleanly when killed by signal - no ugly error propagation
    process.exit(signal ? 0 : (code ?? 0));
  });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
