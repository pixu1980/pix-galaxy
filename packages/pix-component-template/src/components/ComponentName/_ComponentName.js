/**
 * <{%ELEMENT_NAME%}></{%ELEMENT_NAME%}>
 *
 * {%COMPONENT_DESCRIPTION%}
 * (TODO: describe what this component does, its keyboard navigation, persistence, events, etc.)
 */
import componentCSS from './_ComponentName.css?raw';

const STORAGE_KEY = '{%STORAGE_KEY%}';
const ELEMENT_NAME = '{%ELEMENT_NAME%}';

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

let componentStyleSheet = null;

function adoptComponentStyles() {
  if (
    typeof document === 'undefined' ||
    !('adoptedStyleSheets' in document) ||
    typeof globalThis.CSSStyleSheet !== 'function' ||
    typeof globalThis.CSSStyleSheet.prototype.replaceSync !== 'function'
  ) {
    return null;
  }

  if (!componentStyleSheet) {
    componentStyleSheet = new CSSStyleSheet();
    componentStyleSheet.replaceSync(componentCSS);
  }

  if (!document.adoptedStyleSheets.includes(componentStyleSheet)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, componentStyleSheet];
  }

  return componentStyleSheet;
}

class {%COMPONENT_CLASS%} extends HTMLElement {
  static ensureComponentStyles() {
    return adoptComponentStyles();
  }

  static {
    this.ensureComponentStyles();
    if (!globalThis.customElements?.get(ELEMENT_NAME)) {
      globalThis.customElements.define(ELEMENT_NAME, this);
    }
  }

  constructor() {
    super();
    // Bind event handlers here
    // this._onClick = this._onClick.bind(this);
    this.currentValue = '';
  }

  connectedCallback() {
    this.constructor.ensureComponentStyles();
    this.render();
    this.attachEventListeners();
  }

  render() {
    const template = document.createElement('template');
    this.textContent = '';

    // TODO: build the component's inner HTML
    template.innerHTML = `
      <div data-${ELEMENT_NAME.replace('pix-', '').replace('-', '-')}>
        <p>{%COMPONENT_NAME%} component</p>
      </div>
    `;

    this.appendChild(template.content.cloneNode(true));
  }

  attachEventListeners() {
    // TODO: attach event listeners
  }

  disconnectedCallback() {
    // TODO: remove event listeners
  }
}

export { {%COMPONENT_CLASS%}, STORAGE_KEY };

export default {%COMPONENT_CLASS%};
