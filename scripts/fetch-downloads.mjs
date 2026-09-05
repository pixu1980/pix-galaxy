#!/usr/bin/env node

/**
 * fetch-downloads.mjs - pix-galaxy portal build step
 *
 * Fetches last-month download counts from the npm registry API for every
 * package in the portal catalog and writes them to
 * src/docs/content/downloads.json so the portal can order cards by
 * popularity at build time.
 *
 * Unpublished / private packages return 404 from the registry and are
 * simply omitted - the portal falls back to the curated importance order
 * for them. The script is deliberately non-fatal: network hiccups must
 * never break the build.
 *
 * Usage:
 *   node scripts/fetch-downloads.mjs
 * (wire it into the portal build: build:portal runs it before vite)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/docs/content/downloads.json');
const CATALOG = join(ROOT, 'src/docs/content/components.json');

const NPM_API = (pkg) =>
  `https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(pkg)}`;

const PERIOD = 'last-month';

const components = JSON.parse(readFileSync(CATALOG, 'utf-8'));
const packageNames = [...new Set(components.map((c) => c.packageName).filter(Boolean))].sort();

console.log(`pix-galaxy · npm downloads (${PERIOD}) for ${packageNames.length} packages`);

/** @type {Record<string, number>} */
const downloads = {};

for (const pkg of packageNames) {
  try {
    const res = await fetch(NPM_API(pkg), { signal: AbortSignal.timeout(8_000) });
    if (res.ok) {
      const data = await res.json();
      downloads[pkg] = Number.isFinite(data?.downloads) ? data.downloads : 0;
      console.log(`  ✓ ${pkg}: ${downloads[pkg]}`);
    } else {
      console.log(`  – ${pkg}: no data (${res.status})`);
    }
  } catch (err) {
    console.log(`  ⚠ ${pkg}: fetch failed (${err?.cause?.code || err?.message || 'unknown'})`);
  }
}

writeFileSync(OUT, `${JSON.stringify(downloads, null, 2)}\n`);
console.log(`\nwrote ${OUT} (${Object.keys(downloads).length} packages)`);
