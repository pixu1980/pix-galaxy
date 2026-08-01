import { rename } from 'node:fs/promises';
import { resolve } from 'node:path';

const projectRoot = process.cwd();

await rename(
  resolve(projectRoot, 'artifact/index.types.d.ts'),
  resolve(projectRoot, 'artifact/index.d.ts')
);
