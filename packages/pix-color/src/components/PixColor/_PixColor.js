/**
 * <pix-color></pix-color>
 *
 * Accessible OKLCH/HSL/RGB/HEX color picker Web Component.
 * Under the hood uses <input type="color"> for native fallback.
 * Shows all format values simultaneously with format-specific slider controls.
 * Form-associated via ElementInternals.
 *
 * @fires color-change - when the color changes
 */
import { Color, formatValue } from './_color.js';
import componentCSS from './_PixColor.css?raw';

const ELEMENT_NAME = 'pix-color';
const FORMATS = ['HEX', 'RGB', 'HSL', 'OKLCH'];
const SVG_ARROW = '<svg aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SVG_COPY = '<svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5.5" y="5.5" width="8" height="8" rx="1"/><path d="M10.5 3.5h-5a2 2 0 00-2 2v5"/></svg>';
const SVG_CHECK = '<svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3.5 8.5L6 11l6.5-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let componentStyleSheet = null;

function adoptComponentStyles() {
  if (typeof document === 'undefined' ||
    !('adoptedStyleSheets' in document) ||
    typeof CSSStyleSheet !== 'function' ||
    typeof CSSStyleSheet.prototype.replaceSync !== 'function') return null;

  if (!componentStyleSheet) {
    componentStyleSheet = new CSSStyleSheet();
    componentStyleSheet.replaceSync(componentCSS);
  }
  if (!document.adoptedStyleSheets.includes(componentStyleSheet)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, componentStyleSheet];
  }
  return componentStyleSheet;
}

class PixColor extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = ['value', 'name'];

  static ensureComponentStyles() { return adoptComponentStyles(); }

  static {
    this.ensureComponentStyles();
    if (!globalThis.customElements?.get(ELEMENT_NAME)) {
      globalThis.customElements.define(ELEMENT_NAME, this);
    }
  }

  /* ── State ────────────────────────────────────────────────────── */

  #color = new Color('#6366F1');
  #expanded = false;
  #activeFormat = 'HEX';
  #colorInput = null;

  /* ── DOM refs ─────────────────────────────────────────────────── */

  #bar = null;
  #panel = null;
  #swatch = null;
  #hexVal = null;
  #previewLarge = null;
  #valuesEl = null;
  #tabs = null;
  #slidersEl = null;
  #contrastEl = null;
  #copyBtn = null;

  /* ── Bound handlers (stabili, mai inline) ─────────────────────── */

  #onColorInput = (e) => { const hex = e.target.value; this.#color = new Color(hex); this.#updateDisplay(); };
  #onBarClick = (e) => {
    if (e.target.closest('[data-part="native-input"]')) return;
    this.expanded = !this.#expanded;
    this.#bar?.setAttribute('aria-expanded', String(this.#expanded));
  };
  #onBarKeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.expanded = !this.#expanded;
      this.#bar?.setAttribute('aria-expanded', String(this.#expanded));
    }
  };
  #onCopyClick = () => this.#copyValue();
  #onKeyDown = this.#handleKeyDown.bind(this);

  // Per-tab handlers (creati al volo ma puliti in teardownPanel)
  #tabCleanup = [];

  #internals = null;

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
  }

  connectedCallback() {
    this.constructor.ensureComponentStyles();
    const initial = this.getAttribute('value') || '#6366F1';
    this.#color = new Color(initial);
    this.#renderBar();
  }

  disconnectedCallback() {
    this.#teardownPanel();
    document.removeEventListener('keydown', this.#onKeyDown);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'value' && newVal && newVal !== this.#color.toHEXString()) {
      this.#color = new Color(newVal);
      this.#updateDisplay();
    }
  }

  /* ── Public API ────────────────────────────────────────────────── */

  get value() { return this.#color.toHEXString(); }
  set value(v) { this.setAttribute('value', v); }

  get expanded() { return this.#expanded; }
  set expanded(v) {
    this.#expanded = Boolean(v);
    if (this.#expanded) {
      this.#renderPanel();
      this.#bar?.setAttribute('data-expanded', '');
    } else {
      this.#teardownPanel();
      this.#bar?.removeAttribute('data-expanded');
    }
  }

  /* ── Render bar ───────────────────────────────────────────────── */

  #renderBar() {
    if (this.#bar) return;

    this.innerHTML = '';

    // Hidden native input
    this.#colorInput = document.createElement('input');
    this.#colorInput.setAttribute('data-part', 'native-input');
    this.#colorInput.type = 'color';
    this.#colorInput.value = this.#color.toHEXString();
    this.#colorInput.setAttribute('tabindex', '-1');
    this.#colorInput.addEventListener('input', this.#onColorInput);

    this.#bar = document.createElement('div');
    this.#bar.setAttribute('data-part', 'bar');
    this.#bar.setAttribute('role', 'button');
    this.#bar.setAttribute('tabindex', '0');
    this.#bar.setAttribute('aria-haspopup', 'dialog');
    this.#bar.setAttribute('aria-expanded', 'false');
    this.#bar.setAttribute('aria-label', 'Color picker. Current value: ' + this.#color.toHEXString());

    this.#swatch = document.createElement('span');
    this.#swatch.setAttribute('data-part', 'swatch');
    this.#swatch.style.background = this.#color.toHEXString();

    this.#hexVal = document.createElement('span');
    this.#hexVal.setAttribute('data-part', 'hex-value');
    this.#hexVal.textContent = this.#color.toHEXString();

    const arrow = document.createElement('span');
    arrow.setAttribute('data-part', 'arrow');
    arrow.innerHTML = SVG_ARROW;

    this.#bar.append(this.#colorInput, this.#swatch, this.#hexVal, arrow);
    this.append(this.#bar);

    // Events (usando handler stabili - niente inline arrow)
    this.#bar.addEventListener('click', this.#onBarClick);
    this.#bar.addEventListener('keydown', this.#onBarKeydown);
  }

  /* ── Render panel ─────────────────────────────────────────────── */

  #renderPanel() {
    if (this.#panel) return;

    this.#panel = document.createElement('div');
    this.#panel.setAttribute('data-part', 'panel');
    this.#panel.setAttribute('role', 'dialog');
    this.#panel.setAttribute('aria-label', 'Color picker');

    // Large preview
    this.#previewLarge = document.createElement('div');
    this.#previewLarge.setAttribute('data-part', 'preview-large');
    this.#previewLarge.style.background = this.#color.toHEXString();
    this.#panel.append(this.#previewLarge);

    // All-format values
    this.#valuesEl = document.createElement('div');
    this.#valuesEl.setAttribute('data-part', 'values-grid');
    this.#valuesEl.setAttribute('aria-label', 'Color values');
    this.#renderValues();
    this.#panel.append(this.#valuesEl);

    // Tabs - cleanup qualsiasi handler precedente
    for (const fn of this.#tabCleanup) fn();
    this.#tabCleanup = [];

    this.#tabs = document.createElement('div');
    this.#tabs.setAttribute('data-part', 'tabs');
    this.#tabs.setAttribute('role', 'tablist');
    this.#tabs.setAttribute('aria-label', 'Color format');
    for (const fmt of FORMATS) {
      const tab = document.createElement('button');
      tab.setAttribute('data-part', 'tab');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('data-format', fmt);
      tab.setAttribute('aria-selected', fmt === this.#activeFormat ? 'true' : 'false');
      tab.setAttribute('tabindex', fmt === this.#activeFormat ? '0' : '-1');
      tab.textContent = fmt;
      const onClick = () => this.#switchFormat(fmt);
      const onKeydown = (e) => this.#handleTabKeydown(e, fmt);
      tab.addEventListener('click', onClick);
      tab.addEventListener('keydown', onKeydown);
      this.#tabCleanup.push(() => { tab.removeEventListener('click', onClick); tab.removeEventListener('keydown', onKeydown); });
      if (fmt === this.#activeFormat) tab.setAttribute('data-active', '');
      this.#tabs.append(tab);
    }
    this.#panel.append(this.#tabs);

    // Sliders
    this.#slidersEl = document.createElement('div');
    this.#slidersEl.setAttribute('data-part', 'sliders');
    this.#renderSliders();
    this.#panel.append(this.#slidersEl);

    // Actions bar
    const actions = document.createElement('div');
    actions.setAttribute('data-part', 'actions');

    this.#contrastEl = document.createElement('div');
    this.#contrastEl.setAttribute('data-part', 'contrast');
    this.#renderContrast();
    actions.append(this.#contrastEl);

    this.#copyBtn = document.createElement('button');
    this.#copyBtn.setAttribute('data-part', 'copy-btn');
    this.#copyBtn.innerHTML = SVG_COPY + ' Copy';
    this.#copyBtn.addEventListener('click', this.#onCopyClick);
    actions.append(this.#copyBtn);

    this.#panel.append(actions);
    this.append(this.#panel);

    // Outside click via overlay backdrop (nessun setTimeout, nessun document listener)
    this.#panel.addEventListener('click', this.#onPanelClick);
    document.addEventListener('keydown', this.#onKeyDown);
  }

  #onPanelClick = (e) => {
    // Click sul backdrop (panel stesso) chiude
    if (e.target === this.#panel || e.target === this.#previewLarge) {
      this.expanded = false;
    }
  };

  #teardownPanel() {
    for (const fn of this.#tabCleanup) fn();
    this.#tabCleanup = [];
    document.removeEventListener('keydown', this.#onKeyDown);
    this.#panel?.removeEventListener('click', this.#onPanelClick);
    this.#panel?.remove();
    this.#panel = null;
    this.#previewLarge = null;
    this.#valuesEl = null;
    this.#tabs = null;
    this.#slidersEl = null;
    this.#contrastEl = null;
    this.#copyBtn = null;
  }

  /* ── Display update ───────────────────────────────────────────── */

  #updateDisplay() {
    const hex = this.#color.toHEXString();
    if (this.#swatch) this.#swatch.style.background = hex;
    if (this.#hexVal) this.#hexVal.textContent = hex;
    if (this.#previewLarge) this.#previewLarge.style.background = hex;
    if (this.#colorInput) this.#colorInput.value = hex;
    if (this.#bar) this.#bar.setAttribute('aria-label', 'Color picker. Current value: ' + hex);
    if (this.#internals?.setFormValue) this.#internals.setFormValue(hex);
    this.#renderValues();
    this.#renderSliders();
    this.#renderContrast();
    this.dispatchEvent(new CustomEvent('color-change', {
      detail: { hex: this.#color.toHEXString(), rgb: this.#color.rgb },
      bubbles: true,
    }));
  }

  #renderValues() {
    if (!this.#valuesEl) return;
    const c = this.#color;
    const rows = [
      ['HEX', c.toHEXString()],
      ['RGB', `${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}`],
      ['HSL', `${Math.round(c.hsl.h)}° ${Math.round(c.hsl.s)}% ${Math.round(c.hsl.l)}%`],
      ['OKLCH', `${c.oklch.L.toFixed(1)}% ${c.oklch.C.toFixed(2)} ${c.oklch.h.toFixed(0)}°`],
    ];
    this.#valuesEl.innerHTML = rows.map(([label, val]) =>
      `<span data-part="value-label">${label}</span><span data-part="value-text">${val}</span>`
    ).join('');
  }

  /* ── Format switching ─────────────────────────────────────────── */

  #switchFormat(format) {
    this.#activeFormat = format;
    for (const tab of this.#tabs?.querySelectorAll('[data-part="tab"]') || []) {
      const isActive = tab.dataset.format === format;
      tab.toggleAttribute('data-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    }
    this.#renderSliders();
  }

  #handleTabKeydown(event, fmt) {
    const tabs = FORMATS;
    const idx = tabs.indexOf(this.#activeFormat);
    let next = idx;
    switch (event.key) {
      case 'ArrowLeft': next = (idx - 1 + tabs.length) % tabs.length; break;
      case 'ArrowRight': next = (idx + 1) % tabs.length; break;
      case 'Home': next = 0; break;
      case 'End': next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    this.#switchFormat(tabs[next]);
    const newTab = this.#tabs?.querySelector(`[data-format="${tabs[next]}"]`);
    newTab?.focus();
  }

  /* ── Sliders ──────────────────────────────────────────────────── */

  #renderSliders() {
    if (!this.#slidersEl) return;
    const fmt = this.#activeFormat;
    const c = this.#color;
    let html = '';

    switch (fmt) {
      case 'HEX': {
        html = `<input data-part="hex-input" type="text" value="${c.toHEXString()}" spellcheck="false" aria-label="HEX color value" maxlength="7">`;
        break;
      }
      case 'RGB': {
        const channels = [
          { id: 'r', label: 'R', min: 0, max: 255, val: c.rgb.r, grad: null },
          { id: 'g', label: 'G', min: 0, max: 255, val: c.rgb.g, grad: null },
          { id: 'b', label: 'B', min: 0, max: 255, val: c.rgb.b, grad: null },
        ];
        for (const ch of channels) {
          html += this.#sliderHTML(ch.label, ch.id, ch.min, ch.max, ch.val, null, fmt);
        }
        break;
      }
      case 'HSL': {
        const hsl = c.hsl;
        const channels = [
          { id: 'h', label: 'H', min: 0, max: 360, val: hsl.h, grad: `linear-gradient(to right, hsl(0,${hsl.s}%,${hsl.l}%),hsl(60,${hsl.s}%,${hsl.l}%),hsl(120,${hsl.s}%,${hsl.l}%),hsl(180,${hsl.s}%,${hsl.l}%),hsl(240,${hsl.s}%,${hsl.l}%),hsl(300,${hsl.s}%,${hsl.l}%),hsl(360,${hsl.s}%,${hsl.l}%))` },
          { id: 's', label: 'S', min: 0, max: 100, val: hsl.s, grad: `linear-gradient(to right, hsl(${hsl.h},0%,${hsl.l}%),hsl(${hsl.h},100%,${hsl.l}%))` },
          { id: 'l', label: 'L', min: 0, max: 100, val: hsl.l, grad: `linear-gradient(to right, hsl(${hsl.h},${hsl.s}%,0%),hsl(${hsl.h},${hsl.s}%,50%),hsl(${hsl.h},${hsl.s}%,100%))` },
        ];
        for (const ch of channels) {
          html += this.#sliderHTML(ch.label, ch.id, ch.min, ch.max, Math.round(ch.val), ch.grad, fmt);
        }
        break;
      }
      case 'OKLCH': {
        const oklch = c.oklch;
        const hex = c.toHEXString();
        const channels = [
          { id: 'L', label: 'L', min: 0, max: 100, val: oklch.L, step: 0.1, grad: `linear-gradient(to right, #000, ${hex}, #fff)` },
          { id: 'C', label: 'C', min: 0, max: 40, val: oklch.C, step: 0.01, grad: `linear-gradient(to right, #888, ${hex})` },
          { id: 'h', label: 'H', min: 0, max: 360, val: oklch.h, step: 1, grad: `linear-gradient(to right, hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))` },
        ];
        for (const ch of channels) {
          html += this.#sliderHTML(ch.label, ch.id, ch.min, ch.max, ch.val, ch.grad, fmt, ch.step || 1);
        }
        break;
      }
    }

    this.#slidersEl.innerHTML = html;

    // Bind events
    const hexInput = this.#slidersEl.querySelector('[data-part="hex-input"]');
    if (hexInput) {
      hexInput.addEventListener('input', () => {
        let v = hexInput.value.trim();
        if (/^#?[0-9a-fA-F]{6}$/.test(v)) {
          if (!v.startsWith('#')) v = '#' + v;
          this.#color = new Color(v);
          this.#updateDisplay();
        }
      });
      hexInput.addEventListener('focus', () => hexInput.select());
    }

    const sliders = this.#slidersEl.querySelectorAll('input[type="range"]');
    for (const slider of sliders) {
      slider.addEventListener('input', () => this.#onSliderChange(slider));
      // Set gradient background
      if (slider.dataset.grad) {
        slider.style.background = slider.dataset.grad;
      }
    }
  }

  #sliderHTML(label, id, min, max, val, grad, fmt, step) {
    const displayVal = typeof val === 'number' ? (step && step < 1 ? val.toFixed(2) : Math.round(val)) : val;
    const stepAttr = step ? `step="${step}"` : 'step="1"';
    const gradAttr = grad ? `data-grad="${this.#escapeAttr(grad)}"` : '';
    return `
      <div data-part="slider-row">
        <span data-part="slider-label">${label}</span>
        <input type="range" min="${min}" max="${max}" ${stepAttr} value="${val}"
          data-format="${fmt}" data-channel="${id}" ${gradAttr}
          aria-label="${fmt} ${label}" aria-valuenow="${val}" aria-valuemin="${min}" aria-valuemax="${max}">
        <span data-part="slider-value">${displayVal}</span>
      </div>
    `;
  }

  #escapeAttr(val) {
    return String(val).replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }

  #onSliderChange(slider) {
    const fmt = slider.dataset.format;
    const ch = slider.dataset.channel;
    const val = parseFloat(slider.value);
    // Update the displayed value
    const valueSpan = slider.parentElement.querySelector('[data-part="slider-value"]');
    if (valueSpan) valueSpan.textContent = typeof val === 'number' ? (val % 1 !== 0 ? val.toFixed(2) : Math.round(val)) : val;

    switch (fmt) {
      case 'RGB': {
        const r = parseFloat(this.#slidersEl.querySelector('[data-channel="r"]')?.value || 0);
        const g = parseFloat(this.#slidersEl.querySelector('[data-channel="g"]')?.value || 0);
        const b = parseFloat(this.#slidersEl.querySelector('[data-channel="b"]')?.value || 0);
        this.#color = new Color(`rgb(${r},${g},${b})`);
        break;
      }
      case 'HSL': {
        const h = parseFloat(this.#slidersEl.querySelector('[data-channel="h"]')?.value || 0);
        const s = parseFloat(this.#slidersEl.querySelector('[data-channel="s"]')?.value || 0);
        const l = parseFloat(this.#slidersEl.querySelector('[data-channel="l"]')?.value || 0);
        this.#color = new Color(`hsl(${h},${s}%,${l}%)`);
        break;
      }
      case 'OKLCH': {
        const L = parseFloat(this.#slidersEl.querySelector('[data-channel="L"]')?.value || 0);
        const C = parseFloat(this.#slidersEl.querySelector('[data-channel="C"]')?.value || 0);
        const h = parseFloat(this.#slidersEl.querySelector('[data-channel="h"]')?.value || 0);
        this.#color = new Color(`oklch(${L}% ${C}% ${h})`);
        break;
      }
    }
    this.#updateDisplay();
  }

  /* ── Contrast check ───────────────────────────────────────────── */

  #renderContrast() {
    if (!this.#contrastEl) return;
    const hex = this.#color.toHEXString();
    const ratioWhite = Color.WCAGContrast(hex, '#FFFFFF');
    const ratioBlack = Color.WCAGContrast(hex, '#000000');
    const bestRatio = Math.max(ratioWhite, ratioBlack);
    const aa = bestRatio >= 4.5;
    const aaa = bestRatio >= 7;
    const bg = ratioWhite > ratioBlack ? 'white' : 'black';
    this.#contrastEl.innerHTML = `
      <span>Contrast:</span>
      <span data-part="contrast-pass" data-pass="${aa}">AA${aa ? ' ✓' : ' ✗'}</span>
      <span>/</span>
      <span data-part="contrast-pass" data-pass="${aaa}">AAA${aaa ? ' ✓' : ' ✗'}</span>
      <span style="opacity:0.5">${bestRatio.toFixed(1)}:1</span>
    `;
  }

  /* ── Copy to clipboard ────────────────────────────────────────── */

  #copyValue() {
    if (!this.#copyBtn) return;
    const text = this.#color.toHEXString();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    this.#copyBtn.innerHTML = SVG_CHECK + ' Copied';
    this.#copyBtn.setAttribute('data-copied', '');
    setTimeout(() => {
      this.#copyBtn.innerHTML = SVG_COPY + ' Copy';
      this.#copyBtn.removeAttribute('data-copied');
    }, 1500);
  }

  /* ── Escape ───────────────────────────────────────────────────── */

  #handleKeyDown(event) {
    if (event.key === 'Escape' && this.#expanded) {
      this.expanded = false;
      this.#bar?.setAttribute('aria-expanded', 'false');
      this.#bar?.focus();
    }
  }
}

export { PixColor, Color };
