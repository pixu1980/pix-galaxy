// src/components/PixBaseline/styles/pix-baseline.css
var pix_baseline_default = '@import "./_core.css" layer(components.pix-baseline);\n@import "./states/_states.css" layer(components.pix-baseline);\n';

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

// src/components/PixBaseline/pix-baseline.consts.js
var DEFAULT_VARIANT = "default";
var SUPPORTED_VARIANTS = ["default", "outlined"];
var ROOT_PART = "root";
var CONTENT_PART = "content";

// src/components/PixBaseline/pix-baseline.utils.js
function normalizeVariant(value) {
  return SUPPORTED_VARIANTS.includes(String(value)) ? (
    /** @type {import('./pix-baseline.consts.js').PixBaselineVariant} */
    value
  ) : DEFAULT_VARIANT;
}
function filterRenderableNodes(nodes) {
  return nodes.filter((node) => {
    return !(node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement && node.getAttribute("data-part") === ROOT_PART);
  });
}

// src/components/PixBaseline/pix-baseline.attributes.js
var pix_baseline_attributes_default = {
  /**
   * @this {HTMLElement}
   * @param {string | null} _oldValue
   * @param {string | null} newValue
   */
  variant(_oldValue, newValue) {
    this.setAttribute("data-variant", normalizeVariant(newValue));
  }
};

// src/components/PixBaseline/pix-baseline.events.js
var pix_baseline_events_default = {};

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

// src/components/PixBaseline/pix-baseline.template.js
var engine = new template_engine_default();
var renderRoot = engine.html`
  <div data-part="${ROOT_PART}">
    <div data-part="${CONTENT_PART}"></div>
  </div>
`;

// src/components/PixBaseline/pix-baseline.js
var PixBaseline = class extends HTMLElement {
  static attributes = pix_baseline_attributes_default;
  static events = pix_baseline_events_default;
  static styles = pix_baseline_default;
  static {
    componentDecorator(this);
  }
  constructor() {
    super();
  }
  /**
   * @returns {import('./pix-baseline.consts.js').PixBaselineVariant}
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
  onRender() {
    const existingRoot = this.querySelector(':scope > [data-part="root"]');
    if (!existingRoot) {
      const nodes = filterRenderableNodes(Array.from(this.childNodes));
      this.innerHTML = renderRoot({});
      this.querySelector(':scope > [data-part="content"]')?.append(...nodes);
    }
    this.#syncState();
  }
  /**
   * @param {string} name
   * @param {string | null} _oldValue
   * @param {string | null} newValue
   */
  onAttributeChanged(name, _oldValue, newValue) {
    if (name === "variant") {
      this.setAttribute("data-variant", normalizeVariant(newValue));
    }
  }
  #syncState() {
    const variant = this.variant;
    if (this.getAttribute("variant") !== variant) {
      this.setAttribute("variant", variant);
    }
    this.setAttribute("data-variant", variant);
    this.querySelector(':scope > [data-part="' + CONTENT_PART + '"]')?.setAttribute("data-variant", variant);
  }
};
export {
  PixBaseline,
  normalizeVariant
};
//# sourceMappingURL=index.js.map
