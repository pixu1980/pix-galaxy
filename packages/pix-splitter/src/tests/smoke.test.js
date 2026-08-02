/**
 * pix-splitter smoke test
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
});

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

describe('pix-splitter', () => {
  it('defines custom element', async () => {
    await import('../components/PixSplitter/_PixSplitter.js');
    const el = customElements.get('pix-splitter');
    assert.ok(el, 'pix-splitter should be defined');
  });

  it('renders handles between children', async () => {
    await import('../components/PixSplitter/_PixSplitter.js');
    const el = document.createElement('pix-splitter');
    el.innerHTML = '<div>Left</div><div>Right</div>';
    document.body.appendChild(el);
    const handles = el.querySelectorAll('[data-splitter-handle]');
    assert.equal(handles.length, 1, 'should have 1 handle for 2 panels');
    el.remove();
  });

  it('orientation attribute reflects property', async () => {
    await import('../components/PixSplitter/_PixSplitter.js');
    const el = document.createElement('pix-splitter');
    el.setAttribute('orientation', 'vertical');
    assert.equal(el.orientation, 'vertical');
  });
});
