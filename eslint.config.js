import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/artifact/**',
      '**/coverage/**',
      '**/.artifacts/**',
      '**/.vite/**',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        globalThis: 'readonly',
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        CustomEvent: 'readonly',
        customElements: 'readonly',
        CSSStyleSheet: 'readonly',
        KeyboardEvent: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
        queueMicrotask: 'readonly',
        MutationObserver: 'readonly',
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        fetch: 'readonly',
        structuredClone: 'readonly',
        URL: 'readonly',
        performance: 'readonly',
        localStorage: 'readonly',
        navigator: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-console': 'off',
    },
  },
];
