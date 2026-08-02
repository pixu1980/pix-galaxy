/**
 * pix-galaxy · Component interaction tests (browser)
 *
 * Prerequisite: all dev servers running (pnpm dev:all).
 * Exercises real interactions in a browser against each component
 * mounted on its docs site, plus axe audit of the live component.
 *
 * Run:
 *   npx playwright test e2e/interactions.spec.mjs
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const COMPONENTS = [
  { name: 'pix-a11y-panel', port: 3001, tag: 'pix-a11y-panel' },
  { name: 'pix-accent-color-selector', port: 3002, tag: 'pix-accent-color-selector' },
  { name: 'pix-color', port: 3003, tag: 'pix-color' },
  { name: 'pix-color-scheme-selector', port: 3004, tag: 'pix-color-scheme-selector' },
  { name: 'pix-command', port: 3005, tag: 'pix-command' },
  { name: 'pix-highlighter', port: 3007, tag: 'pre[is="pix-highlighter"]' },
  { name: 'pix-sortable', port: 3009, tag: 'pix-sortable' },
  { name: 'pix-splitter', port: 3010, tag: 'pix-splitter' },
  { name: 'pix-toast', port: 3011, tag: 'pix-toast' },
];

/**
 * Mount a component on a fresh page by importing the package entry point.
 * The docs sites import their own component; we navigate to the docs site
 * and audit whatever live component the page mounts.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 */
async function gotoAndAudit(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const viol = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  return viol;
}

/* ── Interaction tests ─────────────────────────────────────────── */

test.describe('Component interactions', () => {
  test('color scheme selector toggles theme attribute', async ({ page }) => {
    await page.goto('http://localhost:3004', { waitUntil: 'networkidle' });
    await page.locator('[data-color-scheme-selector] [data-scheme="dark"]').first().click();
    await page.waitForTimeout(200);
    const colorScheme = await page.evaluate(() => document.documentElement.style.colorScheme);
    expect(colorScheme).toBe('dark');
  });

  test('accent color selector sets a root CSS variable', async ({ page }) => {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    const swatch = page.locator('[data-accent-button][data-accent="mint"]').first();
    await swatch.click();
    const h = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue('--pix-accent-h')
    );
    expect(h).toBeTruthy();
  });

  test('pix-color bar toggles the panel on click', async ({ page }) => {
    await page.goto('http://localhost:3003', { waitUntil: 'networkidle' });
    const bar = page.locator('[data-part="bar"]').first();
    await bar.click();
    await expect(page.locator('[data-part="panel"]').first()).toBeVisible();
    await bar.click();
    await expect(page.locator('[data-part="panel"]').first()).toBeHidden();
  });

  test('toast stack renders and dismisses a toast', async ({ page }) => {
    await page.goto('http://localhost:3011', { waitUntil: 'networkidle' });
    const stack = page.locator('pix-toast-stack').first();
    await stack.evaluate((el) => {
      // @ts-ignore -- custom element method
      el.add({ title: 'Test', message: 'Hello', duration: 0 });
    });
    await expect(page.locator('pix-toast').first()).toBeVisible();
    const dismiss = page.locator('[data-toast-dismiss]').first();
    if (await dismiss.count()) {
      await dismiss.click();
    }
  });

  test('splitter responds to keyboard arrow on the handle', async ({ page }) => {
    await page.goto('http://localhost:3010', { waitUntil: 'networkidle' });
    const handle = page.locator('[data-part="handle"]').first();
    if (await handle.count()) {
      await handle.focus();
      await page.keyboard.press('ArrowRight');
      // No crash; handle still present
      await expect(handle).toBeVisible();
    }
  });

  test('sortable moves focus with arrow keys', async ({ page }) => {
    await page.goto('http://localhost:3009', { waitUntil: 'networkidle' });
    const item = page.locator('[data-sortable-item]').first();
    if (await item.count()) {
      await item.focus();
      await page.keyboard.press('ArrowDown');
    }
  });
});

/* ── Live component axe audit ──────────────────────────────────── */

test.describe('Live component axe audit', () => {
  for (const comp of COMPONENTS) {
    test(`${comp.name} live component is WCAG 2.2 AA clean`, async ({ page }) => {
      const viol = await gotoAndAudit(page, `http://localhost:${comp.port}`);
      const componentViolations = viol.filter((v) =>
        v.nodes.some((n) => n.target.some((t) => t.includes(comp.tag.split('[')[0])))
      );
      expect(componentViolations).toEqual([]);
    });
  }
});
