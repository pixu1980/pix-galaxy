// @ts-check

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  dispatchSystemSchemeChange,
  getSystemListenerCount,
  resetDom,
  setupDom,
} from './_mocks.js';

setupDom();

let PixColorSchemeSwitcher;

function mountSwitcher() {
  const switcher = document.createElement('pix-color-scheme-switcher');
  document.body.append(switcher);
  switcher.connectedCallback?.();
  return switcher;
}

test.before(async () => {
  ({ PixColorSchemeSwitcher } = await import(new URL(`../src/index.js?component-test=${Date.now()}`, import.meta.url)));
});

test.beforeEach(() => {
  resetDom();
});

test('hydrates from persisted scheme and syncs document state on connect', () => {
  window.localStorage.setItem('color-scheme', 'dark');

  const switcher = mountSwitcher();
  const darkInput = switcher.querySelector('input[name="color-scheme"][value="dark"]');

  assert.ok(switcher instanceof PixColorSchemeSwitcher);
  assert.equal(document.adoptedStyleSheets.length, 1);
  assert.equal(document.documentElement.getAttribute('data-color-scheme'), 'dark');
  assert.equal(document.documentElement.getAttribute('data-color-scheme-mode'), 'dark');
  assert.equal(document.documentElement.style.colorScheme, 'dark');
  assert.equal(document.querySelector('meta[name="color-scheme"]')?.getAttribute('content'), 'dark');
  assert.equal(darkInput?.checked, true);
});

test('applyColorScheme persists state and dispatches change payload', () => {
  const switcher = mountSwitcher();
  /** @type {CustomEvent | null} */
  let receivedEvent = null;

  switcher.addEventListener('pix-color-scheme-switcher:change', (event) => {
    receivedEvent = /** @type {CustomEvent} */ (event);
  });

  switcher.applyColorScheme('light');

  assert.equal(switcher.currentScheme, 'light');
  assert.equal(switcher.resolvedScheme, 'light');
  assert.equal(window.localStorage.getItem('color-scheme'), 'light');
  assert.equal(document.documentElement.getAttribute('data-color-scheme'), 'light');
  assert.equal(document.documentElement.getAttribute('data-color-scheme-mode'), 'light');
  assert.equal(document.querySelector('meta[name="color-scheme"]')?.getAttribute('content'), 'light');
  assert.deepEqual(receivedEvent?.detail, {
    scheme: 'light',
    resolvedScheme: 'light',
  });
});

test('system mode follows matchMedia changes and keeps persisted mode stable', () => {
  const switcher = mountSwitcher();

  switcher.applyColorScheme('system');
  dispatchSystemSchemeChange(true);

  assert.equal(switcher.currentScheme, 'system');
  assert.equal(switcher.resolvedScheme, 'dark');
  assert.equal(window.localStorage.getItem('color-scheme'), 'system');
  assert.equal(document.documentElement.getAttribute('data-color-scheme'), 'dark');
  assert.equal(document.documentElement.getAttribute('data-color-scheme-mode'), 'system');
  assert.equal(document.querySelector('meta[name="color-scheme"]')?.getAttribute('content'), 'light dark');
});

test('disconnecting removes prefers-color-scheme listener', () => {
  const switcher = mountSwitcher();

  assert.equal(getSystemListenerCount(), 1);

  switcher.disconnectedCallback();

  assert.equal(getSystemListenerCount(), 0);
});
