import { register } from 'node:module';

register(new URL('./raw-text-loader.mjs', import.meta.url), import.meta.url);
