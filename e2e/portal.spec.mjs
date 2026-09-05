/**
 * pix-galaxy · End-to-end test suite
 *
 * Prerequisite: all dev servers running (pnpm dev:all) or let Playwright
 * start them via the webServer in playwright.config.mjs. Ports are
 * discovered live from the running servers (see e2e/ports.mjs).
 *
 * Run:
 *   npx playwright test
 */

import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverPorts, requirePorts } from './ports.mjs';

/* ── Setup ─────────────────────────────────────────────────────── */

const PKGS_DIR = fileURLToPath(new URL('../packages/', import.meta.url));

// Derive the component list from packages/*/package.json (non-private).
const COMPONENTS = readdirSync(PKGS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    let pkg = {};
    try {
      pkg = JSON.parse(readFileSync(join(PKGS_DIR, entry.name, 'package.json'), 'utf8'));
    } catch {
      /* ignore */
    }
    return pkg;
  })
  .filter((pkg) => pkg && pkg.name && !pkg.private)
  .map((pkg) => pkg.name.replace(/^@pix-galaxy\//, ''));

/** @type {Record<string, number>} */
let PORTS = {};

test.beforeAll(async () => {
  PORTS = await discoverPorts();
  requirePorts(['pix_galaxy', ...COMPONENTS], PORTS);
});

/** @param {string} component Canonical package name or the portal. */
function portalUrl() {
  return `http://localhost:${PORTS.pix_galaxy}`;
}

/** @param {string} name Canonical package name. */
function componentUrl(name) {
  return `http://localhost:${PORTS[name]}`;
}

/* ── 1. Portal smoke tests ──────────────────────────────────────── */

test.describe('Portal', () => {
  test('loads and shows all component cards', async ({ page }) => {
    await page.goto(portalUrl());
    await page.waitForSelector('[data-part="grid"]', { timeout: 8000 });
    const cards = page.locator('[data-part="card"]');
    // non-private packages + private-but-catalogued (foundations) + placeholder
    await expect(cards).toHaveCount(COMPONENTS.length + 2);
  });

  test('each real card has a valid href pointing to localhost', async ({ page }) => {
    await page.goto(portalUrl());
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
    await page.goto(portalUrl());
    await page.waitForSelector('[data-part="card"]');

    const hlCard = page.locator('[data-part="card"]', { hasText: 'Pix Highlighter' });
    await expect(hlCard).toBeVisible();

    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 8000 }),
      hlCard.click(),
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    expect(newPage.url()).toContain(`localhost:${PORTS['pix-highlighter']}`);
    await newPage.close();
  });

  test('color scheme selector is present', async ({ page }) => {
    await page.goto(portalUrl());
    const selector = page.locator('pix-color-scheme-selector').first();
    await expect(selector).toBeVisible({ timeout: 8000 });
  });

  test('focus ring appears on card tab', async ({ page }) => {
    await page.goto(portalUrl());
    await page.waitForSelector('[data-part="card"]');
    // Tab three times to reach first card
    for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
    const focused = page.locator(':focus-visible');
    await expect(focused).toHaveCount(1);
    const outline = await focused.evaluate((el) => getComputedStyle(el).outline);
    expect(outline).not.toBe('0px');
    expect(outline).not.toBe('none');
  });

  test('cards are grouped Components-first, ready-first, with WIP badges', async ({ page }) => {
    await page.goto(portalUrl());
    await page.waitForSelector('[data-part="card"]');

    const sections = await page.$$eval('[data-part="section"]', (els) =>
      els.map((section) => ({
        title: section.querySelector('[data-part="section-title"] span')?.textContent.trim(),
        cards: [...section.querySelectorAll('[data-part="card"]')].map((card) => ({
          title: card.querySelector('[data-part="card-title"]')?.textContent.trim(),
          wip: card.hasAttribute('data-status'),
        })),
      }))
    );

    // Components section comes before Libraries.
    expect(sections.map((s) => s.title)).toEqual(['Components', 'Libraries']);

    // Ready (non-WIP) cards come first within Components.
    const components = sections[0].cards;
    const badges = components.map((c) => c.wip);
    const firstWip = badges.indexOf(true);
    const readyCount = firstWip === -1 ? badges.length : firstWip;
    expect(readyCount).toBeGreaterThanOrEqual(4);
    expect(badges.slice(0, readyCount).every((w) => !w)).toBe(true);
    expect(badges.slice(readyCount).some((w) => w)).toBe(true);

    // Every WIP card carries the status badge marker.
    for (const card of components.filter((c) => c.wip)) {
      expect(card.title.length).toBeGreaterThan(0);
    }
  });
});

/* ── 2. Component docs sites ───────────────────────────────────── */

test.describe('Component docs sites', () => {
  for (const comp of COMPONENTS) {
    test(`${comp} docs loads`, async ({ page }) => {
      await page.goto(componentUrl(comp));
      await page.waitForSelector('[data-part="shell"]', { timeout: 10000 });
      const heading = page.locator('[data-part="hero"] h1');
      await expect(heading).toBeVisible();
    });
  }

  test('color scheme selector is present on new-template docs', async ({ page }) => {
    // Old-template sites (accent-color-selector, a11y-panel, highlighter)
    // use inline createDocsSite and don't get the shared color-scheme-selector.
    const skip = new Set(['pix-accent-color-selector', 'pix-a11y', 'pix-highlighter']);
    for (const comp of COMPONENTS) {
      if (skip.has(comp)) continue;
      await page.goto(componentUrl(comp));
      await page.waitForSelector('pix-color-scheme-selector', {
        state: 'attached',
        timeout: 10000,
      });
      await expect(page.locator('pix-color-scheme-selector').first()).toBeAttached();
    }
  });

  test('nav links are present on all docs', async ({ page }) => {
    for (const comp of COMPONENTS) {
      await page.goto(componentUrl(comp));
      await page.waitForSelector('[data-part="nav-link"]', { timeout: 10000 });
      const count = await page.locator('[data-part="nav-link"]').count();
      expect(count).toBeGreaterThanOrEqual(4);
    }
  });
});

/* ── 3. pix-highlighter specific ────────────────────────────────── */

test.describe('Pix Highlighter', () => {
  const HL = () => componentUrl('pix-highlighter');

  test('code blocks show toolbar', async ({ page }) => {
    await page.goto(HL());
    await page.waitForSelector('pre[is="pix-highlighter"]', { timeout: 8000 });
    const toolbar = page.locator('pre[is="pix-highlighter"] [data-toolbar]').first();
    await expect(toolbar).toBeVisible();
  });

  test('theme selector button has visible border', async ({ page }) => {
    await page.goto(HL());
    await page.waitForSelector('[data-theme-trigger]', { timeout: 8000 });
    const btn = page.locator('[data-theme-trigger]').first();
    const border = await btn.evaluate((el) => getComputedStyle(el).border);
    expect(border).not.toBe('0px');
    expect(border).not.toBe('none');
  });

  test('theme menu opens and lists options', async ({ page }) => {
    await page.goto(HL());
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
    await page.goto(componentUrl('pix-command'));
    await page.waitForSelector('[data-part="nav-link"]', { timeout: 8000 });
    const firstLink = page.locator('[data-part="nav-link"]').first();
    await firstLink.focus();
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-site-doc-content]');
    await expect(page.locator('[data-site-doc-content]')).toBeVisible();
  });
});
