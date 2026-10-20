import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const vanillaReactive = resolve(projectRoot, 'packages/pix-vanilla-reactive/artifact/index.js');

export default {
  base: process.env.GITHUB_ACTIONS ? '/pix-galaxy/' : '/',
  build: {
    emptyOutDir: true,
    outDir: resolve(projectRoot, 'dist'),
  },
  resolve: {
    alias: {
      '@pix-galaxy/pix-vanilla-reactive': vanillaReactive,
    },
  },
  root: resolve(projectRoot, 'src/docs'),
  server: {
    host: true,
    open: false,
  },
};
