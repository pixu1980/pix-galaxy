import { register } from 'node:module';

register(new URL('./_raw-text-loader.mjs', import.meta.url), import.meta.url);
