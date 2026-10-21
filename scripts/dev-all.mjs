#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const DEV_SCRIPT = resolve(__dirname, 'dev.mjs');

const MIN_PORT = 3000;
const MAX_PORT = 6000;

const knownColors = {
  'pix-galaxy': '36', // cyan
  'pix-highlighter': '34', // blue
  'pix-a11y': '38;5;208', // orange
  'pix-accent-color-selector': '32', // green
  'pix-color-scheme-selector': '35', // violet
  'pix-command': '38;5;63', // indigo
  'pix-splitter': '33', // yellow
  'pix-toast': '31', // red
  'pix-color': '38;5;47', // emerald
  'pix-recorder': '38;5;45', // aqua
  'pix-sortable': '38;5;75', // sky (light blue)
  'pix-foundations': '38;5;214', // gold
  'pix-vanilla-reactive': '38;5;79', // mint
  'pix-component-template': '90', // dark grey - hidden, not auto-started
};

// Palette for packages without a known color - cycles through them
const fallbackPalette = [
  '33',
  '31',
  '35;1',
  '36;1',
  '32;1',
  '34;1',
  '38;5;130',
  '38;5;164',
  '38;5;70',
  '38;5;202',
];

/**
 * Discover servers dynamically:
 * 1. pix-galaxy (root portal) is always first
 * 2. Any directory under ./packages/ with a vite.config.mjs is included
 *
 * Order follows the canonical DEV_PORT_ORDER (scripts/port-map.mjs) so the
 * portal's dev-port links always match. Unknown packages are appended in
 * alphabetical order after the canonical list.
 */
import { DEV_PORT_ORDER } from './port-map.mjs';

function discoverServers() {
  const byName = new Map();
  byName.set('pix-galaxy', { name: 'pix-galaxy', config: './vite.config.mjs' });

  const packagesDir = resolve(projectRoot, 'packages');
  if (existsSync(packagesDir)) {
    const entries = readdirSync(packagesDir).sort();
    for (const entry of entries) {
      const pkgDir = join(packagesDir, entry);
      if (statSync(pkgDir).isDirectory()) {
        const viteConfigPath = join(pkgDir, 'vite.config.mjs');
        if (existsSync(viteConfigPath)) {
          byName.set(entry, { name: entry, config: `./packages/${entry}/vite.config.mjs` });
        }
      }
    }
  }

  // Canonical order first; any extras (not in DEV_PORT_ORDER) follow alphabetically.
  const canonical = DEV_PORT_ORDER.filter((name) => byName.has(name)).map((name) =>
    byName.get(name)
  );
  const extras = [...byName.keys()]
    .filter((name) => !DEV_PORT_ORDER.includes(name))
    .sort()
    .map((name) => byName.get(name));
  return [...canonical, ...extras];
}

const servers = discoverServers();

function getColor(name, index) {
  return knownColors[name] || fallbackPalette[index % fallbackPalette.length];
}

/**
 * Probe whether `port` can be bound on `host`.
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

/**
 * Find the next free port starting from `start`, one at a time.
 * Sequential calls guarantee no two callers get the same port.
 *
 * Checks IPv4 then IPv6 separately (macOS keeps the stacks independent).
 * If IPv6 is unsupported on the host (common on Linux CI), a free IPv4
 * port is accepted instead of skipping the whole range.
 */
async function findFreePort(start) {
  for (let port = start; port <= MAX_PORT; port++) {
    const v4 = await probePort(port, '127.0.0.1');
    if (v4 !== 'free') continue;
    const v6 = await probePort(port, '::');
    if (v6 === 'busy') continue;
    return port;
  }
  throw new Error(`no free port in ${MIN_PORT}-${MAX_PORT}`);
}

/**
 * Pre-allocate one unique port per server, sequentially,
 * so no two servers race for the same port.
 */
async function assignPorts(servers) {
  const ports = [];
  let nextPort = MIN_PORT;
  for (const srv of servers) {
    const port = await findFreePort(nextPort);
    ports.push(port);
    nextPort = port + 1; // next server starts scanning after this one
  }
  return ports;
}

async function main() {
  const ports = await assignPorts(servers);

  // Build dynamic port map so each server knows where its siblings are
  /** @type {Record<string, number>} */
  const portMap = {};
  for (let i = 0; i < servers.length; i++) {
    portMap[servers[i].name] = ports[i];
  }
  const portMapEnv = JSON.stringify(portMap);

  const children = [];
  let closing = false;

  for (let i = 0; i < servers.length; i++) {
    const srv = servers[i];
    const port = ports[i];

    const child = spawn(
      'node',
      [DEV_SCRIPT, '--config', srv.config, '--name', srv.name, '--port', String(port)],
      {
        cwd: projectRoot,
        stdio: ['inherit', 'pipe', 'inherit'],
        env: { ...process.env, VITE_DEV_PORTS: portMapEnv },
      }
    );

    const code = getColor(srv.name, i);
    const prefix = `\x1b[${code}m[${srv.name}:${port}]\x1b[0m`;

    child.stdout.on('data', (data) => {
      const text = data.toString();
      for (const line of text.split('\n').filter(Boolean)) {
        process.stdout.write(`${prefix} ${line}\n`);
      }
    });

    child.on('exit', (code, signal) => {
      if (!closing && signal) {
        // Child was killed by signal - ignore in shutdown
      }
    });

    children.push(child);
  }

  const portSummary = servers
    .map((s, i) => `  \x1b[${getColor(s.name, i)}m${s.name}\x1b[0m → http://localhost:${ports[i]}`)
    .join('\n');

  console.log(`\n  ✨  pix-galaxy dev servers:
${portSummary}\n`);

  process.on('SIGINT', () => {
    if (closing) return;
    closing = true;
    console.log('\n  ⏎  shutting down all dev servers gracefully\n');
    for (const child of children) {
      child.kill('SIGINT');
    }
    const timer = setTimeout(() => process.exit(0), 3000);
    timer.unref();
  });

  process.on('SIGTERM', () => {
    if (closing) return;
    closing = true;
    for (const child of children) {
      child.kill('SIGTERM');
    }
    const timer = setTimeout(() => process.exit(0), 3000);
    timer.unref();
  });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
