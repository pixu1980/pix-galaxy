/**
 * pix-galaxy · Visual regression
 *
 * Baseline screenshots of the portal (light/dark/mobile). Ports are
 * discovered at runtime (see e2e/ports.mjs).
 *
 * First run (create baselines):
 *   npx playwright test e2e/visual.spec.mjs --update-snapshots
 * Normal runs compare against the committed baselines.
 */

import { test, expect } from '@playwright/test';
import { discoverPorts, requirePorts } from './ports.mjs';

/** @type {Record<string, number>} */
let PORTS = {};

test.beforeAll(async () => {
  PORTS = await discoverPorts();
  requirePorts(['pix_galaxy'], PORTS);
});

test.describe('Visual regression (portal)', () => {
  test('portal light desktop', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(`http://localhost:${PORTS.pix_galaxy}`);
    await page.waitForSelector('[data-part="grid"]');
    await expect(page).toHaveScreenshot('portal-light.png');
  });

  test('portal dark desktop', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(`http://localhost:${PORTS.pix_galaxy}`);
    await page.waitForSelector('[data-part="grid"]');
    await expect(page).toHaveScreenshot('portal-dark.png');
  });

  test('portal mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`http://localhost:${PORTS.pix_galaxy}`);
    await page.waitForSelector('[data-part="grid"]');
    await expect(page).toHaveScreenshot('portal-mobile.png');
  });
});
