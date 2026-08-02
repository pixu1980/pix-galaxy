/**
 * pix-galaxy · End-to-end test suite
 *
 * Prerequisite: all 12 dev servers running (pnpm dev:all).
 *
 * Run:
 *   npx playwright test
 *
 * Run with UI:
 *   npx playwright test --ui
 */

import { test, expect } from '@playwright/test';

/* ── Helpers ────────────────────────────────────────────────────── */

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

/* ── 1. Portal smoke tests ──────────────────────────────────────── */

test.describe('Portal (http://localhost:3000)', () => {
  test('loads and shows all component cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-part="grid"]', { timeout: 8000 });
    const cards = page.locator('[data-part="card"]');
    await expect(cards).toHaveCount(COMPONENTS.length + 1);
  });

  test('each real card has a valid href pointing to localhost', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-part="card"]');
    const cards = page.locator('[data-part="card"]');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const href = await cards.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      if (href === '#') continue;
      expect(href).toMatch(/^https?:\/\/localhost/);
    }
  });

  test('clicking pix-highlighter card opens its docs page', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForSelector('[data-part="card"]');

    const hlCard = page.locator('[data-part="card"]', { hasText: 'Pix Highlighter' });
    await expect(hlCard).toBeVisible();

    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 8000 }),
      hlCard.click(),
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    expect(newPage.url()).toContain('localhost:3007');
    await newPage.close();
  });

  test('color scheme selector is present', async ({ page }) => {
    await page.goto('/');
    const selector = page.locator('pix-color-scheme-selector').first();
    await expect(selector).toBeVisible({ timeout: 8000 });
  });

  test('focus ring appears on card tab', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-part="card"]');
    // Tab three times to reach first card
    for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
    const focused = page.locator(':focus-visible');
    await expect(focused).toHaveCount(1);
    const outline = await focused.evaluate((el) => getComputedStyle(el).outline);
    expect(outline).not.toBe('0px');
    expect(outline).not.toBe('none');
  });
});

/* ── 2. Component docs sites ───────────────────────────────────── */

test.describe('Component docs sites', () => {
  for (const comp of COMPONENTS) {
    test(`${comp.name} docs loads at :${comp.port}`, async ({ page }) => {
      await page.goto(`http://localhost:${comp.port}/`);
      await page.waitForSelector('[data-part="shell"]', { timeout: 10000 });
      const heading = page.locator('[data-part="hero"] h1');
      await expect(heading).toBeVisible();
    });
  }

  test('color scheme selector is present on new-template docs', async ({ page }) => {
    // Old-template sites (accent-color-selector, a11y-panel, highlighter, etc.)
    // use inline createDocsSite and don't get the shared color-scheme-selector.
    const skip = new Set([3001, 3002, 3007]);
    for (const comp of COMPONENTS) {
      if (skip.has(comp.port)) continue;
      await page.goto(`http://localhost:${comp.port}/`);
      await page.waitForSelector('pix-color-scheme-selector', {
        state: 'attached',
        timeout: 10000,
      });
      await expect(page.locator('pix-color-scheme-selector').first()).toBeAttached();
    }
  });

  test('nav links are present on all docs', async ({ page }) => {
    for (const comp of COMPONENTS) {
      await page.goto(`http://localhost:${comp.port}/`);
      await page.waitForSelector('[data-part="nav-link"]', { timeout: 10000 });
      const count = await page.locator('[data-part="nav-link"]').count();
      expect(count).toBeGreaterThanOrEqual(4);
    }
  });
});

/* ── 3. pix-highlighter specific ────────────────────────────────── */

test.describe('Pix Highlighter', () => {
  test('code blocks show toolbar', async ({ page }) => {
    await page.goto('http://localhost:3007/');
    await page.waitForSelector('pre[is="pix-highlighter"]', { timeout: 8000 });
    const toolbar = page.locator('pre[is="pix-highlighter"] [data-toolbar]').first();
    await expect(toolbar).toBeVisible();
  });

  test('theme selector button has visible border', async ({ page }) => {
    await page.goto('http://localhost:3007/');
    await page.waitForSelector('[data-theme-trigger]', { timeout: 8000 });
    const btn = page.locator('[data-theme-trigger]').first();
    const border = await btn.evaluate((el) => getComputedStyle(el).border);
    expect(border).not.toBe('0px');
    expect(border).not.toBe('none');
  });

  test('theme menu opens and lists options', async ({ page }) => {
    await page.goto('http://localhost:3007/');
    await page.waitForSelector('[data-theme-trigger]', { timeout: 8000 });
    await page.locator('[data-theme-trigger]').first().click();
    await page.waitForSelector('[data-theme-option]', { timeout: 3000 });
    const count = await page.locator('[data-theme-option]').count();
    expect(count).toBeGreaterThanOrEqual(5);
  });
});

/* ── 4. Keyboard navigation ─────────────────────────────────────── */

test.describe('Keyboard a11y', () => {
  test('Enter activates nav link on pix-command docs', async ({ page }) => {
    await page.goto('http://localhost:3004/');
    await page.waitForSelector('[data-part="nav-link"]', { timeout: 8000 });
    const firstLink = page.locator('[data-part="nav-link"]').first();
    await firstLink.focus();
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-site-doc-content]');
    await expect(page.locator('[data-site-doc-content]')).toBeVisible();
  });
});
