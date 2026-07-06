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

function findFreePort(start = MIN_PORT) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      if (port > MAX_PORT) {
        return reject(
          new Error(`[${name}] no free port in ${MIN_PORT}-${MAX_PORT}`),
        );
      }
      // Dual-stack check: try both IPv4 (127.0.0.1) and IPv6 (::)
      // On macOS, IPv4 and IPv6 are independent stacks, so a process
      // listening on [::]:PORT won't be detected by binding to 127.0.0.1 alone
      let v4ok = false;
      let v6ok = false;
      const srv4 = createServer();
      const srv6 = createServer();

      const closeAll = () => {
        srv4.close();
        srv6.close();
      };

      srv4.on('error', () => { closeAll(); tryPort(port + 1); });
      srv6.on('error', () => { closeAll(); tryPort(port + 1); });

      srv4.listen(port, '127.0.0.1', () => {
        v4ok = true;
        if (v6ok) { closeAll(); resolve(port); }
      });

      srv6.listen(port, '::', () => {
        v6ok = true;
        if (v4ok) { closeAll(); resolve(port); }
      });
    };
    tryPort(start);
  });
}

async function main() {
  // Use explicit port if provided (e.g. from dev-all.mjs), otherwise auto-detect
  const port = explicitPort !== undefined
    ? Number(explicitPort)
    : await findFreePort(MIN_PORT);

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
    // Exit cleanly when killed by signal — no ugly error propagation
    process.exit(signal ? 0 : (code ?? 0));
  });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
