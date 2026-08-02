/**
 * pix-galaxy · Accessibility audit (axe-core)
 *
 * Prerequisite: all 12 dev servers running (pnpm dev:all).
 *
 * Runs the axe-core engine against the portal and every component docs
 * site, asserting WCAG 2.2 AA compliance (ADR-021).
 *
 * Run:
 *   npx playwright test e2e/a11y.spec.mjs
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/* ── Component map (kept in sync with portal.spec.mjs) ──────────── */

const COMPONENTS = [
  { name: 'pix-a11y-panel', port: 3001 },
  { name: 'pix-accent-color-selector', port: 3002 },
  { name: 'pix-color', port: 3003 },
  { name: 'pix-color-scheme-selector', port: 3004 },
  { name: 'pix-command', port: 3005 },
  { name: 'pix-foundations', port: 3006 },
  { name: 'pix-highlighter', port: 3007 },
  { name: 'pix-recorder', port: 3008 },
  { name: 'pix-sortable', port: 3009 },
  { name: 'pix-splitter', port: 3010 },
  { name: 'pix-toast', port: 3011 },
];

const PORTAL_URL = 'http://localhost:3000';

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
    await auditPage(page, PORTAL_URL);
  });

  for (const comp of COMPONENTS) {
    test(`${comp.name} docs is WCAG 2.2 AA clean`, async ({ page }) => {
      await auditPage(page, `http://localhost:${comp.port}`);
    });
  }
});
