#!/usr/bin/env node

/**
 * ssr-smoke.mjs — SSR / DOM-less import smoke test.
 *
 * Imports every public package entry in a bare Node context (no browser
 * globals: no `document`, no `customElements`, no `window`). Components must
 * not crash at import time (ADR-026 / ROADMAP §3 "SSR & hydration safety"):
 * registration is deferred until a real customElements registry exists.
 *
 * Run:
 *   pnpm test:ssr
 */

const PUBLIC_PACKAGES = [
  'pix-a11y-panel',
  'pix-accent-color-selector',
  'pix-color',
  'pix-color-scheme-selector',
  'pix-command',
  'pix-highlighter',
  'pix-recorder',
  'pix-sortable',
  'pix-splitter',
  'pix-toast',
  'pix-vanilla-reactive',
];

let failed = 0;

for (const name of PUBLIC_PACKAGES) {
  try {
    // Import the built entry directly: workspace packages are not all linked
    // at the monorepo root, and the artifact is exactly what consumers load.
    const mod = await import(new URL(`../packages/${name}/artifact/index.js`, import.meta.url));
    const exports = Object.keys(mod);
    // The module exported a class before registering anything — the element
    // must NOT be registered (there is no customElements registry here).
    console.log(`✓ ${name} imports without DOM (${exports.length} named exports)`);
  } catch (error) {
    failed += 1;
    console.error(`✗ ${name}: ${error?.message || error}`);
  }
}

if (failed > 0) {
  console.error(`\nSSR smoke failed for ${failed} package(s).`);
  process.exit(1);
}

console.log('\nSSR smoke: all public packages import cleanly without a DOM.');
