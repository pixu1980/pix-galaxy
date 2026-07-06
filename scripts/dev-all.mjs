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
  'pix-galaxy': '36',                    // cyan
  'pix-highlighter': '34',               // blue
  'pix-display-preferences': '38;5;208', // orange
  'pix-accent-color-selector': '32',     // green
  'pix-color-scheme-selector': '35',     // violet
  'pix-command': '38;5;63',              // indigo
  'pix-splitter': '33',                  // yellow
  'pix-toast': '31',                     // red
  'pix-color': '38;5;47',                // emerald
  'pix-recorder': '38;5;45',             // aqua
  'pix-sortable': '38;5;75',             // sky (light blue)
  'pix-component-template': '90',        // dark grey — hidden, not auto-started
};

// Palette for packages without a known color — cycles through them
const fallbackPalette = ['33', '31', '35;1', '36;1', '32;1', '34;1', '38;5;130', '38;5;164', '38;5;70', '38;5;202'];

/**
 * Discover servers dynamically:
 * 1. pix-galaxy (root portal) is always first
 * 2. Any directory under ./packages/ with a vite.config.mjs is included
 */
function discoverServers() {
  const servers = [
    { name: 'pix-galaxy', config: './vite.config.mjs' },
  ];

  const packagesDir = resolve(projectRoot, 'packages');
  if (existsSync(packagesDir)) {
    const entries = readdirSync(packagesDir).sort();
    for (const entry of entries) {
      const pkgDir = join(packagesDir, entry);
      if (statSync(pkgDir).isDirectory()) {
        const viteConfigPath = join(pkgDir, 'vite.config.mjs');
        if (existsSync(viteConfigPath)) {
          servers.push({
            name: entry,
            config: `./packages/${entry}/vite.config.mjs`,
          });
        }
      }
    }
  }

  return servers;
}

const servers = discoverServers();

function getColor(name, index) {
  return knownColors[name] || fallbackPalette[index % fallbackPalette.length];
}

/**
 * Find the next free port starting from `start`, one at a time.
 * Sequential calls guarantee no two callers get the same port.
 */
function findFreePort(start) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      if (port > MAX_PORT) {
        return reject(new Error(`no free port in ${MIN_PORT}-${MAX_PORT}`));
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

    const child = spawn('node', [
      DEV_SCRIPT,
      '--config',
      srv.config,
      '--name',
      srv.name,
      '--port',
      String(port),
    ], {
      cwd: projectRoot,
      stdio: ['inherit', 'pipe', 'inherit'],
      env: { ...process.env, VITE_DEV_PORTS: portMapEnv },
    });

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
        // Child was killed by signal — ignore in shutdown
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
