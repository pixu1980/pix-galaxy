import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 15000,
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'e2e/results.json' }]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    // Ports are discovered at runtime from the running docs servers
    // (e2e/ports.mjs) — no static baseURL, so the suite survives port shifts.
  },
  // Convenience for local runs without a pre-started dev:all. Playwright
  // probes this port; when the server is already up it is reused as-is.
  webServer: {
    // CI already runs build:lib; locally prefer the full dev:all (build + servers).
    command: process.env.CI ? 'node scripts/dev-all.mjs' : 'pnpm dev:all',
    port: 3001,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
