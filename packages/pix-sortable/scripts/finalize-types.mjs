import { rename } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));

await rename(
	resolve(projectRoot, 'artifact/index.types.d.ts'),
	resolve(projectRoot, 'artifact/index.d.ts')
);
