/**
 * pix-color smoke test
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
globalThis.requestAnimationFrame = (cb) => cb();
globalThis.cancelAnimationFrame = () => {};
globalThis.performance = dom.window.performance;
globalThis.Node = dom.window.Node;

describe('pix-color', () => {
  it('defines custom element', async () => {
    await import('../components/PixColor/PixColor.js');
    const el = customElements.get('pix-color');
    assert.ok(el, 'pix-color should be defined');
  });

  it('renders bar with initial HEX', async () => {
    await import('../components/PixColor/PixColor.js');
    const el = document.createElement('pix-color');
    el.setAttribute('value', '#FF0000');
    document.body.appendChild(el);
    const hex = el.querySelector('[data-part="hex-value"]');
    assert.ok(hex, 'should show hex value');
    assert.equal(hex.textContent, '#FF0000');
    el.remove();
  });

  it('color-change event fires', async () => {
    await import('../components/PixColor/PixColor.js');
    const el = document.createElement('pix-color');
    document.body.appendChild(el);
    let fired = false;
    el.addEventListener('color-change', () => {
      fired = true;
    });
    el.value = '#00FF00';
    assert.ok(fired, 'color-change should fire on value change');
    el.remove();
  });
});
