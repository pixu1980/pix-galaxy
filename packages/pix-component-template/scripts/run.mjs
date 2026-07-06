#!/usr/bin/env node

/**
 * Template-aware script runner.
 *
 * If the package.json contains {% %} placeholders (uninitialized template),
 * the requested command is skipped with exit code 0.
 *
 * Usage (in package.json scripts):
 *   "build": "node ./scripts/run.mjs \"node ./scripts/build.mjs\""
 *   "test":  "node ./scripts/run.mjs \"pnpm docs:build && node --test ...\""
 */

import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const pkg = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8'));

// If the name contains {% %} placeholders, skip
if (pkg.name && pkg.name.includes('{%')) {
  // Always exit 0 — the template is not an error, it just needs initialisation
  process.exit(0);
}

const command = process.argv.slice(2).join(' ').trim();
if (!command) {
  process.exit(0);
}

const result = spawnSync(command, {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, CI: process.env.CI || '1' },
});

process.exit(result.status ?? 1);
