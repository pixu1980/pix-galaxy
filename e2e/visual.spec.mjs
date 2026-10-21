/**
 * pix-galaxy · Visual regression
 *
 * Baseline screenshots of the portal (light/dark/mobile). Ports are
 * discovered at runtime (see e2e/ports.mjs).
 *
 * First run (create baselines for the current OS):
 *   npx playwright test e2e/visual.spec.mjs --update-snapshots
 * Normal runs compare against the committed baselines.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { discoverPorts, requirePorts } from './ports.mjs';

/** @type {Record<string, number>} */
let PORTS = {};

const SNAP_DIR = fileURLToPath(new URL('./visual.spec.mjs-snapshots/', import.meta.url));
const PLATFORM =
  process.platform === 'darwin' ? 'darwin' : process.platform === 'win32' ? 'win32' : 'linux';

/**
 * @param {string} name Snapshot basename used in toHaveScreenshot (e.g. portal-light.png).
 * @returns {boolean}
 */
function hasBaseline(name) {
  const stem = name.replace(/\.png$/, '');
  return existsSync(join(SNAP_DIR, `${stem}-${PLATFORM}.png`));
}

test.beforeAll(async () => {
  PORTS = await discoverPorts();
  requirePorts(['pix_galaxy'], PORTS);
});

test.describe('Visual regression (portal)', () => {
  test('portal light desktop', async ({ page }) => {
    test.skip(!hasBaseline('portal-light.png'), `No ${PLATFORM} baseline committed yet`);
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(`http://localhost:${PORTS.pix_galaxy}`);
    await page.waitForSelector('[data-part="grid"]');
    await expect(page).toHaveScreenshot('portal-light.png');
  });

  test('portal dark desktop', async ({ page }) => {
    test.skip(!hasBaseline('portal-dark.png'), `No ${PLATFORM} baseline committed yet`);
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(`http://localhost:${PORTS.pix_galaxy}`);
    await page.waitForSelector('[data-part="grid"]');
    await expect(page).toHaveScreenshot('portal-dark.png');
  });

  test('portal mobile', async ({ page }) => {
    test.skip(!hasBaseline('portal-mobile.png'), `No ${PLATFORM} baseline committed yet`);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`http://localhost:${PORTS.pix_galaxy}`);
    await page.waitForSelector('[data-part="grid"]');
    await expect(page).toHaveScreenshot('portal-mobile.png');
  });
});
