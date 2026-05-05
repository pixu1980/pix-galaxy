// src/components/PixColorSchemeSwitcher/styles/pix-color-scheme-switcher.css
var pix_color_scheme_switcher_default = "@import './_core.css' layer(components.pix-color-scheme-switcher);\n@import './states/_states.css' layer(components.pix-color-scheme-switcher);\n";

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

// src/components/PixColorSchemeSwitcher/pix-color-scheme-switcher.attributes.js
var pix_color_scheme_switcher_attributes_default = {};

// src/components/PixColorSchemeSwitcher/pix-color-scheme-switcher.events.js
var pix_color_scheme_switcher_events_default = {
  /**
   * @this {import('./pix-color-scheme-switcher.js').PixColorSchemeSwitcher}
   * @param {Event} event
   */
  change(event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    if (input.name !== "color-scheme") {
      return;
    }
    this.applyColorScheme(input.value);
  }
};

// src/components/PixColorSchemeSwitcher/pix-color-scheme-switcher.consts.js
var CHANGE_EVENT = "pix-color-scheme-switcher:change";
var DEFAULT_SCHEME = "system";
var SCHEMES = (
  /** @type {const} */
  ["light", "dark", "system"]
);
var STORAGE_KEY = "color-scheme";
var CONTROL_PART = "control";
var OPTION_PART = "option";
var META_CONTENT = {
  light: "light",
  dark: "dark",
  system: "light dark"
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
   * Compile an inline template into a reusable render function.
   *
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
   * Alias for `template()`.
   *
   * @param {TemplateStringsArray} strings
   * @param {...unknown} values
   * @returns {(data?: object) => string}
   */
  html(strings2, ...values) {
    return this.template(strings2, ...values);
  }
  /**
   * Resolve JavaScript interpolations for a tagged template literal.
   *
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

// src/components/PixColorSchemeSwitcher/icons/dark.svg
var dark_default = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79"/></svg>';

// src/components/PixColorSchemeSwitcher/icons/light.svg
var light_default = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.2" d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M17.7 6.3l2.1-2.1M6.3 17.7l-2.1 2.1"/></svg>';

// src/components/PixColorSchemeSwitcher/icons/system.svg
var system_default = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><rect width="18" height="12" x="3" y="4" fill="none" stroke="currentColor" stroke-width="1.2" rx="2"/><circle cx="8" cy="10" r="2" fill="currentColor"/><path stroke="currentColor" stroke-width="1.2" d="M9 20h6"/></svg>';

// src/components/PixColorSchemeSwitcher/pix-color-scheme-switcher.template.js
var engine = new template_engine_default();
var renderSwitcher = engine.html`
  <section data-part="${CONTROL_PART}" aria-label="Color scheme" role="radiogroup">
    <label data-part="${OPTION_PART}" data-scheme="light">
      <input type="radio" name="color-scheme" value="light" />
      ${light_default}
      <span sr-only>Light</span>
    </label>

    <label data-part="${OPTION_PART}" data-scheme="dark">
      <input type="radio" name="color-scheme" value="dark" />
      ${dark_default}
      <span sr-only>Dark</span>
    </label>

    <label data-part="${OPTION_PART}" data-scheme="system">
      <input type="radio" name="color-scheme" value="system" />
      ${system_default}
      <span sr-only>System</span>
    </label>
  </section>
`;

// src/components/PixColorSchemeSwitcher/pix-color-scheme-switcher.utils.js
function isSupportedScheme(value) {
  return SCHEMES.includes(
    /** @type {any} */
    String(value)
  );
}
function normalizeScheme(value) {
  return isSupportedScheme(value) ? (
    /** @type {import('./pix-color-scheme-switcher.consts.js').PixColorScheme} */
    value
  ) : DEFAULT_SCHEME;
}
function getStorage() {
  try {
    return globalThis.window?.localStorage ?? globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function getSystemMedia() {
  if (typeof globalThis.matchMedia !== "function") {
    return null;
  }
  return globalThis.matchMedia("(prefers-color-scheme: dark)");
}
function resolveScheme(scheme, systemMedia = getSystemMedia()) {
  const normalizedScheme = normalizeScheme(scheme);
  if (normalizedScheme !== "system") {
    return normalizedScheme;
  }
  return systemMedia?.matches ? "dark" : "light";
}
function getColorSchemeMeta(targetDocument = globalThis.document) {
  if (!targetDocument) {
    return null;
  }
  const existingMeta = targetDocument.querySelector('meta[name="color-scheme"]');
  const HTMLMetaElementCtor = targetDocument.defaultView?.HTMLMetaElement;
  if (!HTMLMetaElementCtor || !(existingMeta instanceof HTMLMetaElementCtor)) {
    return null;
  }
  return existingMeta;
}
function ensureColorSchemeMeta(targetDocument = globalThis.document) {
  if (!targetDocument) {
    return null;
  }
  const existingMeta = getColorSchemeMeta(targetDocument);
  if (existingMeta) {
    return existingMeta;
  }
  const meta = targetDocument.createElement("meta");
  meta.setAttribute("name", "color-scheme");
  targetDocument.head.append(meta);
  return meta;
}
function inferInitialScheme(targetDocument = globalThis.document) {
  const storedValue = getStorage()?.getItem(STORAGE_KEY);
  if (isSupportedScheme(storedValue)) {
    return storedValue;
  }
  const metaContent = getColorSchemeMeta(targetDocument)?.getAttribute("content") ?? "";
  if (metaContent === "light") {
    return "light";
  }
  if (metaContent === "dark") {
    return "dark";
  }
  return DEFAULT_SCHEME;
}

// src/components/PixColorSchemeSwitcher/pix-color-scheme-switcher.js
var PixColorSchemeSwitcher = class extends HTMLElement {
  static attributes = pix_color_scheme_switcher_attributes_default;
  static events = pix_color_scheme_switcher_events_default;
  static styles = pix_color_scheme_switcher_default;
  static {
    componentDecorator(this);
  }
  /** @type {import('./pix-color-scheme-switcher.consts.js').PixColorScheme} */
  #currentScheme = inferInitialScheme();
  /** @type {MediaQueryList | null} */
  #systemMedia = null;
  #handleSystemChange = () => {
    if (this.#currentScheme !== "system") {
      return;
    }
    this.#syncDocumentScheme({ persist: false, notify: true });
  };
  /**
   * The selected scheme mode.
   *
   * @returns {import('./pix-color-scheme-switcher.consts.js').PixColorScheme}
   */
  get currentScheme() {
    return this.#currentScheme;
  }
  /**
   * The resolved document scheme.
   *
   * @returns {'light' | 'dark'}
   */
  get resolvedScheme() {
    return resolveScheme(this.#currentScheme, this.#systemMedia ?? getSystemMedia());
  }
  onRender() {
    this.innerHTML = renderSwitcher({});
    this.#syncDocumentScheme({ persist: true, notify: false });
  }
  onConnected() {
    this.#systemMedia = getSystemMedia();
    this.#systemMedia?.addEventListener("change", this.#handleSystemChange);
    this.#syncOptionState();
  }
  onDisconnected() {
    this.#systemMedia?.removeEventListener("change", this.#handleSystemChange);
    this.#systemMedia = null;
  }
  /**
   * Apply a new color scheme.
   *
   * @param {string | null | undefined} scheme
   */
  applyColorScheme(scheme) {
    this.#currentScheme = normalizeScheme(scheme);
    this.#syncDocumentScheme({ persist: true, notify: true });
  }
  /**
   * @param {{ persist: boolean; notify: boolean }} options
   */
  #syncDocumentScheme(options) {
    const root = document.documentElement;
    const meta = ensureColorSchemeMeta(document);
    const resolvedScheme = this.resolvedScheme;
    root.setAttribute("data-color-scheme", resolvedScheme);
    root.setAttribute("data-color-scheme-mode", this.#currentScheme);
    root.style.colorScheme = this.#currentScheme === "system" ? META_CONTENT.system : resolvedScheme;
    meta?.setAttribute("content", META_CONTENT[this.#currentScheme]);
    if (options.persist) {
      try {
        getStorage()?.setItem(STORAGE_KEY, this.#currentScheme);
      } catch {
      }
    }
    this.#syncOptionState();
    if (options.notify) {
      this.dispatchEvent(new CustomEvent(CHANGE_EVENT, {
        bubbles: true,
        detail: {
          scheme: this.#currentScheme,
          resolvedScheme
        }
      }));
    }
  }
  #syncOptionState() {
    const inputs = this.querySelectorAll('input[name="color-scheme"]');
    for (const input of inputs) {
      if (!(input instanceof HTMLInputElement)) {
        continue;
      }
      const isActive = input.value === this.#currentScheme;
      input.checked = isActive;
      input.closest('[data-part="option"]')?.toggleAttribute("data-active", isActive);
    }
  }
};
export {
  PixColorSchemeSwitcher,
  normalizeScheme
};
//# sourceMappingURL=index.js.map
