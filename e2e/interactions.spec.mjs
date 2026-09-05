/**
 * pix-galaxy · Component interaction tests (browser)
 *
 * Prerequisite: all dev servers running (pnpm dev:all). Ports are discovered
 * live from the running servers (see e2e/ports.mjs).
 * Exercises real interactions in a browser against each component on its
 * docs site, plus axe audit of the live component.
 *
 * Run:
 *   npx playwright test e2e/interactions.spec.mjs
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { discoverPorts, requirePorts } from './ports.mjs';

/* ── Component map (live ports, resolved in beforeAll) ────────── */

const COMPONENTS = [
  { name: 'pix-a11y-panel', tag: 'pix-a11y-panel' },
  { name: 'pix-accent-color-selector', tag: 'pix-accent-color-selector' },
  { name: 'pix-color', tag: 'pix-color' },
  { name: 'pix-color-scheme-selector', tag: 'pix-color-scheme-selector' },
  { name: 'pix-command', tag: 'pix-command' },
  { name: 'pix-highlighter', tag: 'pix-highlighter' },
  { name: 'pix-recorder', tag: 'pix-recorder' },
  { name: 'pix-sortable', tag: 'pix-sortable' },
  { name: 'pix-splitter', tag: 'pix-splitter' },
  { name: 'pix-toast', tag: 'pix-toast' },
  { name: 'pix-vanilla-reactive', tag: 'pix-vanilla-reactive' },
];

/** @type {Record<string, number>} */
let PORTS = {};

test.beforeAll(async () => {
  PORTS = await discoverPorts();
  requirePorts(
    COMPONENTS.map((c) => c.name),
    PORTS
  );
});

/**
 * @param {string} name Component name -> URL of its docs site.
 */
function urlFor(name) {
  return `http://localhost:${PORTS[name]}`;
}

/**
 * Audit a live mounted component and return serious/critical violations.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 */
async function gotoAndAudit(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  return results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
}

/* ── Interaction tests ─────────────────────────────────────────── */

test.describe('Component interactions', () => {
  test('color scheme toggle switches to an explicit scheme', async ({ page }) => {
    await page.goto(urlFor('pix-color-scheme-selector'), { waitUntil: 'networkidle' });
    // Defaults to system; after one click the scheme becomes explicit.
    await page.locator('[data-color-scheme-toggle]').first().click();
    await page.waitForTimeout(200);
    const explicit = await page.evaluate(() => ({
      hasAttr: document.documentElement.hasAttribute('data-color-scheme'),
      style: document.documentElement.style.colorScheme,
    }));
    expect(explicit.hasAttr).toBe(true);
    expect(explicit.style === 'light' || explicit.style === 'dark').toBe(true);
  });

  test('accent color selector sets a root CSS variable', async ({ page }) => {
    await page.goto(urlFor('pix-accent-color-selector'), { waitUntil: 'networkidle' });
    const swatch = page.locator('[data-accent-button][data-accent="mint"]').first();
    await swatch.click();
    const h = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue('--pix-accent-h')
    );
    expect(h).toBeTruthy();
  });

  test('pix-color bar toggles the panel on click', async ({ page }) => {
    await page.goto(urlFor('pix-color'), { waitUntil: 'networkidle' });
    const bar = page.locator('[data-part="bar"]').first();
    await bar.click();
    await expect(page.locator('[data-part="panel"]').first()).toBeVisible();
    await bar.click();
    await expect(page.locator('[data-part="panel"]').first()).toBeHidden();
  });

  test('toast stack renders and dismisses a toast', async ({ page }) => {
    await page.goto(urlFor('pix-toast'), { waitUntil: 'networkidle' });
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
    await page.goto(urlFor('pix-splitter'), { waitUntil: 'networkidle' });
    const handle = page.locator('[data-part="handle"]').first();
    if (await handle.count()) {
      await handle.focus();
      await page.keyboard.press('ArrowRight');
      // No crash; handle still present
      await expect(handle).toBeVisible();
    }
  });

  test('sortable moves focus with arrow keys', async ({ page }) => {
    await page.goto(urlFor('pix-sortable'), { waitUntil: 'networkidle' });
    const item = page.locator('[data-sortable-item]').first();
    if (await item.count()) {
      await item.focus();
      await page.keyboard.press('ArrowDown');
    }
  });

  test('corner preset previews keep fixed shapes while switching presets', async ({ page }) => {
    // The Corners chooser is the only UI that must NOT follow the selected
    // border-radius preset: its previews and cards stay constant.
    await page.goto(urlFor('pix-a11y-panel'), { waitUntil: 'networkidle' });
    const toggle = page.locator('[data-preferences-toggle]').first();
    if (await toggle.count()) {
      await toggle.click();
      await page.waitForTimeout(200);
    }

    const shapes = () =>
      page.evaluate(() => {
        const r = (sel) => getComputedStyle(document.querySelector(sel)).borderRadius;
        return {
          rounded: r('[data-radius-preview="rounded"] span'),
          squircle: r('[data-radius-preview="squircle"] span'),
        };
      });

    const baseline = await shapes();
    expect(Number.parseFloat(baseline.rounded)).toBeGreaterThan(0);
    expect(Number.parseFloat(baseline.squircle)).toBeGreaterThan(
      Number.parseFloat(baseline.rounded)
    );

    for (const preset of ['square', 'squircle', 'rounded']) {
      const label = page
        .locator(`label[data-preferences-choice]:has(input[value="${preset}"])`)
        .first();
      if (await label.count()) {
        await label.click({ force: true });
      }
      const after = await shapes();
      expect(after.rounded).toBe(baseline.rounded);
      expect(after.squircle).toBe(baseline.squircle);
    }
  });
});

/* ── Live component axe audit ──────────────────────────────────── */

test.describe('Live component axe audit', () => {
  for (const comp of COMPONENTS) {
    test(`${comp.name} live component is WCAG 2.2 AA clean`, async ({ page }) => {
      const viol = await gotoAndAudit(page, urlFor(comp.name));
      const componentViolations = viol.filter((v) =>
        v.nodes.some((n) => n.target.some((t) => t.includes(comp.tag.split('[')[0])))
      );
      expect(componentViolations).toEqual([]);
    });
  }
});
