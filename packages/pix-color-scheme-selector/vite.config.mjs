import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default {
  base: process.env.GITHUB_ACTIONS ? '/pix-color-scheme-selector/' : '/',
  build: {
    emptyOutDir: true,
    outDir: resolve(projectRoot, 'dist'),
  },
  root: resolve(projectRoot, 'src/docs'),
  server: {
    host: true,
    open: false,
  },
};
