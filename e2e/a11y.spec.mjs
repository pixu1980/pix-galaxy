/**
 * pix-galaxy · Accessibility audit (axe-core)
 *
 * Prerequisite: all dev servers running (pnpm dev:all). Ports are discovered
 * live from the running servers (see e2e/ports.mjs), so this suite works
 * whether or not port 3000 is busy.
 *
 * Runs the axe-core engine against the portal and every non-private package
 * docs site, asserting WCAG 2.2 AA compliance (ADR-021).
 *
 * Run:
 *   npx playwright test e2e/a11y.spec.mjs
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { discoverPorts, requirePorts } from './ports.mjs';

/* ── Component map (non-private packages only) ────────────────── */

const COMPONENTS = [
  'pix-a11y',
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

/** @type {Record<string, number>} */
let PORTS = {};

test.beforeAll(async () => {
  PORTS = await discoverPorts();
  requirePorts(['pix_galaxy', ...COMPONENTS], PORTS);
});

/**
 * Audit a page with axe-core. Fails the test when any violation of
 * WCAG 2.2 AA (serious or critical) is found.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 */
async function auditPage(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  const violations = results.violations.filter((v) => {
    const impact = v.impact;
    return impact === 'serious' || impact === 'critical';
  });

  if (violations.length > 0) {
    const summary = violations
      .map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s)`)
      .join('\n  ');
    throw new Error(`axe violations on ${url}:\n  ${summary}`);
  }
}

test.describe('Accessibility audit (WCAG 2.2 AA, axe-core)', () => {
  test('portal is WCAG 2.2 AA clean', async ({ page }) => {
    await auditPage(page, `http://localhost:${PORTS.pix_galaxy}`);
  });

  for (const comp of COMPONENTS) {
    test(`${comp} docs is WCAG 2.2 AA clean`, async ({ page }) => {
      await auditPage(page, `http://localhost:${PORTS[comp]}`);
    });
  }
});
