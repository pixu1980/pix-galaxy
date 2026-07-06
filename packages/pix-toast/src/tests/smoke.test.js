/**
 * pix-toast smoke test
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost', pretendToBeVisual: true });

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

describe('pix-toast', () => {
  it('defines custom element', async () => {
    await import('../components/PixToast/PixToast.js');
    const Toast = customElements.get('pix-toast');
    assert.ok(Toast, 'pix-toast should be defined');
  });

  it('PixToast.render() creates a toast element', async () => {
    const { PixToast } = await import('../components/PixToast/PixToast.js');
    const el = PixToast.render({ message: 'Test toast', variant: 'success' });
    assert.ok(el, 'should create element');
    assert.equal(el.dataset.variant, 'success');
  });

  it('defines pix-toast-stack', async () => {
    await import('../components/PixToast/PixToastStack.js');
    const Stack = customElements.get('pix-toast-stack');
    assert.ok(Stack, 'pix-toast-stack should be defined');
  });
});
