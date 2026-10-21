/**
 * Vitest configuration - jsdom environment for the reactive core.
 *
 * @module vitest.config
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.js"],
  },
});
