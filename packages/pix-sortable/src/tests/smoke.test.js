/**
 * pix-sortable smoke test
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

describe('pix-sortable', () => {
  it('defines custom element', async () => {
    await import('../components/PixSortable/PixSortable.js');
    const el = customElements.get('pix-sortable');
    assert.ok(el, 'pix-sortable should be defined');
  });

  it('renders children as sortable items', async () => {
    await import('../components/PixSortable/PixSortable.js');
    const el = document.createElement('pix-sortable');
    el.innerHTML = '<div data-sortable-value="1">One</div><div data-sortable-value="2">Two</div>';
    document.body.appendChild(el);
    const items = el.querySelectorAll('[data-sortable-item]');
    assert.equal(items.length, 2, 'should have 2 sortable items');
    el.remove();
  });

  it('adds drag handles to items', async () => {
    await import('../components/PixSortable/PixSortable.js');
    const el = document.createElement('pix-sortable');
    el.innerHTML = '<div>Item</div>';
    document.body.appendChild(el);
    assert.ok(el.querySelector('[data-sortable-handle]'), 'should have drag handle');
    el.remove();
  });
});
