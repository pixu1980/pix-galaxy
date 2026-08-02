/**
 * pix-command smoke test
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
});

// Patch globalThis with what pix-command needs
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.customElements = dom.window.customElements;
globalThis.CSSStyleSheet = dom.window.CSSStyleSheet;
globalThis.window = dom.window;
if (!document.adoptedStyleSheets) document.adoptedStyleSheets = [];
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.requestAnimationFrame = (cb) => cb();
globalThis.cancelAnimationFrame = () => {};
globalThis.performance = dom.window.performance;
globalThis.Node = dom.window.Node;
globalThis.CustomEvent = dom.window.CustomEvent;
globalThis.requestAnimationFrame = (cb) => cb();
globalThis.cancelAnimationFrame = () => {};
globalThis.performance = dom.window.performance;
globalThis.Node = dom.window.Node;

// Mock navigator for platform checks (parseShortcut, isMetaOrCtrl)
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  writable: false,
  configurable: true,
});

describe('pix-command', () => {
  it('defines custom element', async () => {
    await import('../components/PixCommand/_PixCommand.js');
    const el = customElements.get('pix-command');
    assert.ok(el, 'pix-command should be defined');
  });

  it('sets items programmatically', async () => {
    await import('../components/PixCommand/_PixCommand.js');
    const el = document.createElement('pix-command');
    el.items = [{ id: 'x', label: 'Test' }];
    assert.equal(el.items.length, 1, 'should accept items');
  });

  it('toggles open/close', async () => {
    await import('../components/PixCommand/_PixCommand.js');
    const el = document.createElement('pix-command');
    el.items = [{ id: 'x', label: 'Test' }];
    document.body.appendChild(el);
    el.open = true;
    assert.ok(el.hasAttribute('open'), 'open attribute set');
    el.open = false;
    assert.ok(!el.hasAttribute('open'), 'open attribute removed');
    el.remove();
  });
});
