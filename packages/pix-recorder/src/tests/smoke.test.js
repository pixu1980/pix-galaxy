/**
 * pix-recorder smoke test
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

describe('pix-recorder', () => {
  it('defines custom element', async () => {
    await import('../components/PixRecorder/PixRecorder.js');
    const el = customElements.get('pix-recorder');
    assert.ok(el, 'pix-recorder should be defined');
  });

  it('renders toolbar with buttons', async () => {
    await import('../components/PixRecorder/PixRecorder.js');
    const el = document.createElement('pix-recorder');
    document.body.appendChild(el);
    assert.ok(el.querySelector('[data-part="toolbar"]'), 'should render toolbar');
    assert.ok(el.querySelector('[data-action="record"]'), 'should have record button');
    el.remove();
  });

  it('state starts as idle', async () => {
    await import('../components/PixRecorder/PixRecorder.js');
    const el = document.createElement('pix-recorder');
    assert.equal(el.state, 'idle');
  });
});
