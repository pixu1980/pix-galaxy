// src/components/PixButton/styles/pix-button.css
var pix_button_default = '@import "./_core.css" layer(components.pix-button);\n@import "./states/_states.css" layer(components.pix-button);\n';

// ../shared/decorator/_utils.js
var strings = {
  /**
   * Convert any name to PascalCase.
   * Example: "click" -> "Click", "data-id" -> "DataId".
   *
   * @param {string} str
   * @returns {string}
   */
  toPascalCase(str) {
    return str.split(/[-_\s]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
  },
  /**
   * Convert PascalCase or camelCase to kebab-case.
   * Example: "PixDetails" -> "pix-details", "TreeView" -> "tree-view".
   *
   * @param {string} str
   * @returns {string}
   */
  toKebabCase(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
  },
  /**
   * Generate a short unique id, suitable for ARIA `id` attributes.
   *
   * @returns {string}
   */
  guid() {
    return `pix-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : Math.random().toString(36).slice(2, 10)}`;
  }
};

// ../shared/decorator/_buildHandlers.js
function buildHandlers(input, methodSuffix = "") {
  return Object.entries(input).reduce(
    (acc, [key, fn]) => {
      acc[`handle${strings.toPascalCase(key)}${methodSuffix}`] = fn;
      return acc;
    },
    /** @type {Record<string, T>} */
    {}
  );
}
function buildEventHandlers(events) {
  return buildHandlers(events, "Event");
}
function buildAttributeHandlers(attributes) {
  return buildHandlers(attributes, "AttributeChanged");
}

// ../shared/decorator/_buildLifecycleMethods.js
function buildLifecycleMethods(component) {
  const eventTypes = component.events ? Object.keys(component.events) : [];
  return {
    /**
     * @this {DecoratedInstance}
     * @param {Event} e
     */
    handleEvent(e) {
      const handler = this[`handle${strings.toPascalCase(e.type)}Event`];
      if (typeof handler === "function") {
        handler.call(this, e);
      }
    },
    /**
     * @this {DecoratedInstance}
     * @param {string} name
     * @param {string | null} oldValue
     * @param {string | null} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
      const handler = this[`handle${strings.toPascalCase(name)}AttributeChanged`];
      if (typeof handler === "function") {
        handler.call(this, oldValue, newValue);
      }
      this.onAttributeChanged?.(name, oldValue, newValue);
    },
    /**
     * @this {DecoratedInstance}
     */
    connectedCallback() {
      for (const eventType of eventTypes) {
        this.addEventListener(
          eventType,
          /** @type {EventListenerObject} */
          this
        );
      }
      this.onRender?.();
      this.onConnected?.();
    },
    /**
     * @this {DecoratedInstance}
     */
    disconnectedCallback() {
      for (const eventType of eventTypes) {
        this.removeEventListener(
          eventType,
          /** @type {EventListenerObject} */
          this
        );
      }
      this.onDisconnected?.();
    }
  };
}

// ../shared/decorator/_applyMixins.js
function applyMixins(component, isAttribute) {
  Object.assign(
    component.prototype,
    { componentName: isAttribute },
    component.attributes && buildAttributeHandlers(component.attributes),
    component.events && buildEventHandlers(component.events),
    buildLifecycleMethods(component)
  );
  if (component.attributes) {
    component.observedAttributes = Object.keys(component.attributes);
  }
}

// ../shared/decorator/_buildExtendOptions.js
function buildExtendOptions(component) {
  return component.extendsElement ? { extends: component.extendsElement } : void 0;
}

// ../shared/decorator/_defineCustomElement.js
function defineCustomElement(component, isAttribute) {
  if (typeof customElements === "undefined") return;
  if (customElements.get(isAttribute)) return;
  customElements.define(isAttribute, component, buildExtendOptions(component));
}

// ../shared/decorator/_generateIsAttribute.js
function generateIsAttribute(name) {
  return strings.toKebabCase(name);
}

// ../shared/decorator/_registerStylesheet.js
var registered = /* @__PURE__ */ new WeakSet();
function registerStylesheet(ElementClass, input) {
  if (registered.has(ElementClass)) return;
  const items = Array.isArray(input) ? input : [input];
  const sheets = items.map((item) => {
    if (item instanceof CSSStyleSheet) return item;
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(item);
    return sheet;
  });
  document.adoptedStyleSheets.push(...sheets);
  registered.add(ElementClass);
}

// ../shared/decorator/index.js
function componentDecorator(component) {
  if (component.styles) {
    registerStylesheet(component, component.styles);
  }
  const isAttribute = component.isAttribute ?? generateIsAttribute(component.name);
  defineCustomElement(component, isAttribute);
  applyMixins(component, isAttribute);
}

// src/components/PixButton/pix-button.consts.js
var DEFAULT_VARIANT = "primary";
var SUPPORTED_VARIANTS = ["primary", "secondary", "ghost"];
var BUTTON_PART = "button";

// src/components/PixButton/pix-button.utils.js
function normalizeVariant(value) {
  return SUPPORTED_VARIANTS.includes(String(value)) ? (
    /** @type {import('./pix-button.consts.js').PixButtonVariant} */
    value
  ) : DEFAULT_VARIANT;
}
function filterButtonContentNodes(nodes) {
  return nodes.filter((node) => {
    return !(node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement && node.getAttribute("data-part") === BUTTON_PART);
  });
}

// src/components/PixButton/pix-button.attributes.js
var pix_button_attributes_default = {
  /**
   * @this {HTMLElement}
   * @param {string | null} _oldValue
   * @param {string | null} newValue
   */
  variant(_oldValue, newValue) {
    this.setAttribute("data-variant", normalizeVariant(newValue));
  },
  /**
   * @this {HTMLElement}
   * @param {string | null} _oldValue
   * @param {string | null} newValue
   */
  disabled(_oldValue, newValue) {
    this.setAttribute("aria-disabled", String(newValue !== null));
  }
};

// ../shared/events/_cancelEvent.js
var cancelEvent = (e, preventDefault = true, stopPropagation = true, stopImmediatePropagation = true) => {
  if (!e) return;
  preventDefault && e.preventDefault();
  stopPropagation && e.stopPropagation();
  stopImmediatePropagation && e.stopImmediatePropagation();
  return false;
};

// src/components/PixButton/pix-button.events.js
var pix_button_events_default = {
  /**
   * @this {import('./pix-button.js').PixButton}
   * @param {MouseEvent} event
   */
  click(event) {
    if (!(event.target instanceof Element) || !event.target.closest(`[data-part="${BUTTON_PART}"]`)) {
      return;
    }
    if (this.disabled) {
      cancelEvent(event);
      return;
    }
    this.dispatchEvent(new CustomEvent("pix-button:click", {
      bubbles: true,
      composed: true,
      detail: { variant: this.variant }
    }));
  }
};

// ../shared/template-engine/index.js
var TemplateEngine = class {
  /**
   * The full file-based renderer is not available in the browser-safe runtime.
   *
   * @throws {Error}
   */
  render() {
    throw new Error(
      "TemplateEngine.render is not available in the browser-safe tagged runtime. Use the full pix-template-engine install for SSG/SSR workflows."
    );
  }
  /**
   * @param {TemplateStringsArray} strings
   * @param {...unknown} values
   * @returns {(data?: object) => string}
   */
  template(strings2, ...values) {
    if (!Array.isArray(strings2) || !Object.prototype.hasOwnProperty.call(strings2, "raw")) {
      throw new TypeError("TemplateEngine.template must be used as a tagged template literal");
    }
    return (data = {}) => this.createTemplateLiteralSource(strings2, values, data);
  }
  /**
   * @param {TemplateStringsArray} strings
   * @param {...unknown} values
   * @returns {(data?: object) => string}
   */
  html(strings2, ...values) {
    return this.template(strings2, ...values);
  }
  /**
   * @param {TemplateStringsArray} strings
   * @param {unknown[]} values
   * @param {object} data
   * @returns {string}
   */
  createTemplateLiteralSource(strings2, values, data) {
    let source = "";
    for (let index = 0; index < strings2.length; index++) {
      source += strings2[index];
      if (index < values.length) {
        const value = values[index];
        const resolvedValue = typeof value === "function" ? value(data) : value;
        source += resolvedValue == null ? "" : String(resolvedValue);
      }
    }
    return source;
  }
};
var template_engine_default = TemplateEngine;

// src/components/PixButton/pix-button.template.js
var engine = new template_engine_default();
var renderRoot = engine.html`
  <button data-part="${BUTTON_PART}" part="${BUTTON_PART}" type="button"></button>
`;

// src/components/PixButton/pix-button.js
var PixButton = class extends HTMLElement {
  static attributes = pix_button_attributes_default;
  static events = pix_button_events_default;
  static styles = pix_button_default;
  static {
    componentDecorator(this);
  }
  constructor() {
    super();
  }
  /**
   * The active button variant.
   *
   * @returns {import('./pix-button.consts.js').PixButtonVariant}
   */
  get variant() {
    return normalizeVariant(this.getAttribute("variant"));
  }
  /**
   * @param {string | null | undefined} value
   */
  set variant(value) {
    this.setAttribute("variant", normalizeVariant(value));
  }
  /**
   * Whether the button is disabled.
   *
   * @returns {boolean}
   */
  get disabled() {
    return this.hasAttribute("disabled");
  }
  /**
   * @param {boolean} value
   */
  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
      return;
    }
    this.removeAttribute("disabled");
  }
  onRender() {
    const existingButton = this.#button();
    if (!existingButton) {
      const nodes = filterButtonContentNodes(Array.from(this.childNodes));
      this.innerHTML = renderRoot({});
      this.#button()?.append(...nodes);
    }
    this.#syncState();
  }
  /**
   * @param {string} name
   * @param {string | null} _oldValue
   * @param {string | null} newValue
   */
  onAttributeChanged(name, _oldValue, newValue) {
    if (name === "variant" || name === "disabled") {
      if (name === "variant") {
        this.setAttribute("data-variant", normalizeVariant(newValue));
      }
      this.#syncState();
    }
  }
  /**
   * @returns {HTMLButtonElement | null}
   */
  #button() {
    return (
      /** @type {HTMLButtonElement | null} */
      this.querySelector(`:scope > [data-part="${BUTTON_PART}"]`)
    );
  }
  #syncState() {
    const variant = this.variant;
    if (this.getAttribute("variant") !== variant) {
      this.setAttribute("variant", variant);
    }
    this.setAttribute("data-variant", variant);
    const button = this.#button();
    if (!button) {
      return;
    }
    button.disabled = this.disabled;
    button.setAttribute("aria-disabled", String(this.disabled));
    button.setAttribute("data-variant", variant);
  }
};
export {
  PixButton,
  normalizeVariant
};
//# sourceMappingURL=index.js.map
