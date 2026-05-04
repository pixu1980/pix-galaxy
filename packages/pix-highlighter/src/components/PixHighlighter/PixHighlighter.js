// @ts-nocheck

/**
 * <pre is="pix-highlighter" data-lang="js|ts|css|json|html|python|rust|c|cpp|php|csharp|go|markdown|md|yml|yaml|bash|sh"><code>...</code></pre>
 * - Uses the CSS Custom Highlight API with CSS-defined themes.
 * - Falls back to token spans when the API is not supported.
 * - Exposes a copy action and a page-wide theme selector on every instance.
 */
import {
  CHEVRON_ICON,
  COPY_RESET_DELAY,
  ENHANCED_MARKER,
  ICON_BUTTON_STATES,
  PALETTE_ICON,
  PIX_HIGHLIGHTER_THEME_OPTIONS,
  THEME_MENU_OFFSET,
  THEME_MENU_VIEWPORT_MARGIN,
  THEME_STORAGE_KEY,
} from "./PixHighlighter.const.js";

import {
  adoptComponentStyles,
  ensureFloatingLayer,
  getStorage,
  getThemeLabel,
  setIconButtonContent,
  supportsAnchorPositioning,
} from "./PixHighlighter.utils.js";

import {
  lexBash,
  lexC,
  lexCPP,
  lexCSharp,
  lexCSS,
  lexGo,
  lexHTML,
  lexJS,
  lexJSON,
  lexMarkdown,
  lexPHP,
  lexPython,
  lexRust,
  lexTS,
  lexYAML,
  normalizeLang,
  TOKEN_TYPES,
  tokenizeSource,
} from "./lexers/index.js";

/** @typedef {import('./lexers/_Utils.js').PixHighlighterTokenType} PixHighlighterTokenType */
/** @typedef {import('./PixHighlighter.const.js').PixHighlighterTheme} PixHighlighterTheme */

class PixHighlighter extends HTMLPreElement {
  /**
   * @internal
   * @type {number}
   */
  static _uid = 0;

  /** @type {Set<PixHighlighter>} */
  static instances = new Set();

  /** @type {readonly PixHighlighterTokenType[]} */
  static KNOWN_TYPES = TOKEN_TYPES;

  /**
   * @internal
   * @type {boolean}
   */
  static _themeInitialized = false;

  /** @returns {CSSStyleSheet | HTMLStyleElement | null} */
  static ensureComponentStyles() {
    return adoptComponentStyles();
  }

  /** @returns {boolean} */
  static registerCustomElement() {
    const registry = globalThis.customElements;

    if (!registry?.define) {
      return false;
    }

    if (registry.get("pix-highlighter")) {
      return true;
    }

    try {
      registry.define("pix-highlighter", this, { extends: "pre" });
      return true;
    } catch {
      return false;
    }
  }

  static {
    this.ensureComponentStyles();
    this.registerCustomElement();

    if (typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootPixHighlighters, { once: true });
      } else {
        queueMicrotask(bootPixHighlighters);
      }
    }
  }

  /** @returns {string[]} */
  static get observedAttributes() {
    return ["data-lang", "lang", "data-trim"];
  }

  /** @returns {boolean} */
  static supportsHighlights() {
    return !!(
      typeof window !== "undefined" &&
      globalThis.CSS?.highlights &&
      typeof window.Highlight === "function"
    );
  }

  /**
   * @internal
   * @param {PixHighlighterTokenType} type
   * @returns {string}
   */
  static getHighlightName(type) {
    return `pix-${type}`;
  }

  /**
   * @internal
   * @param {PixHighlighterTheme | null | undefined} theme
   * @returns {boolean}
   */
  static isThemeValue(theme) {
    return PIX_HIGHLIGHTER_THEME_OPTIONS.some((option) => option.value === theme);
  }

  /** @returns {PixHighlighterTheme | null} */
  static getSavedTheme() {
    const savedTheme = getStorage()?.getItem(THEME_STORAGE_KEY);

    return this.isThemeValue(savedTheme) ? savedTheme : null;
  }

  /** @returns {PixHighlighterTheme} */
  static getCurrentTheme() {
    if (typeof document === "undefined") return "default";

    const currentTheme = document.documentElement.dataset.pixHighlighterTheme;

    return this.isThemeValue(currentTheme) ? currentTheme : "default";
  }

  /** @returns {PixHighlighterTheme} */
  static getInitialTheme() {
    if (typeof document === "undefined") return "default";

    const attributeTheme = document.documentElement.dataset.pixHighlighterTheme;

    if (this.isThemeValue(attributeTheme)) return attributeTheme;

    return this.getSavedTheme() || "default";
  }

  /**
   * @internal
   * @returns {void}
   */
  static ensureThemeState() {
    if (this._themeInitialized) return;

    this._themeInitialized = true;
    this.applyTheme(this.getInitialTheme(), { persist: false, syncInstances: false });
  }

  /**
   * @param {PixHighlighterTheme} theme
   * @param {{ persist?: boolean; syncInstances?: boolean }} [options]
   * @returns {PixHighlighterTheme}
   */
  static applyTheme(theme, { persist = true, syncInstances = true } = {}) {
    const normalizedTheme = this.isThemeValue(theme) ? theme : "default";

    if (typeof document !== "undefined") {
      document.documentElement.dataset.pixHighlighterTheme = normalizedTheme;
    }

    if (persist) {
      getStorage()?.setItem(THEME_STORAGE_KEY, normalizedTheme);
    }

    if (syncInstances) {
      for (const instance of this.instances) {
        instance._syncThemeControl(normalizedTheme);
      }
    }

    return normalizedTheme;
  }

  /** @returns {void} */
  static clearManagedHighlights() {
    if (!this.supportsHighlights()) return;

    for (const type of this.KNOWN_TYPES) {
      globalThis.CSS.highlights.delete(this.getHighlightName(type));
    }
  }

  /**
   * @param {HTMLPreElement} element
   * @returns {PixHighlighter | null}
   */
  static enhanceElement(element) {
    if (!(element instanceof window.HTMLPreElement)) return null;

    !(element instanceof PixHighlighter) &&
      Object.setPrototypeOf(element, PixHighlighter.prototype);

    element._ensureState();
    element._connect();
    return element;
  }

  /**
   * @param {Document | Element} [root=document]
   * @returns {PixHighlighter[]}
   */
  static enhanceAll(root = document) {
    if (!root?.querySelectorAll) return [];

    const elements = [];

    root instanceof window.HTMLPreElement &&
      root.matches?.("pre[is='pix-highlighter']") &&
      elements.push(root);

    elements.push(...root.querySelectorAll("pre[is='pix-highlighter']"));

    return elements.map((element) => this.enhanceElement(element)).filter(Boolean);
  }

  /**
   * @internal
   * @returns {void}
   */
  static renderHighlights() {
    if (!this.supportsHighlights()) {
      this.clearManagedHighlights();

      return;
    }

    const groups = new Map();
    const counts = new Map();

    for (const type of this.KNOWN_TYPES) {
      groups.set(type, new Highlight());
      counts.set(type, 0);
    }

    for (const instance of this.instances) {
      if (!instance.isConnected || !instance._textNode) continue;

      for (const token of instance._tokens) {
        const highlight = groups.get(token.type);

        if (!highlight) continue;

        const range = document.createRange();
        range.setStart(instance._textNode, token.start);
        range.setEnd(instance._textNode, token.end);
        highlight.add(range);
        counts.set(token.type, counts.get(token.type) + 1);
      }
    }

    for (const type of this.KNOWN_TYPES) {
      const highlightName = this.getHighlightName(type);

      if (counts.get(type) > 0) {
        globalThis.CSS.highlights.set(highlightName, groups.get(type));
      } else {
        globalThis.CSS.highlights.delete(highlightName);
      }
    }
  }

  constructor() {
    super();
    this._ensureState();
  }

  /** @returns {void} */
  connectedCallback() {
    this._connect();
  }

  /**
   * @internal
   * @returns {void}
   */
  _connect() {
    this._ensureState();

    if (this._isActive) return;

    this._isActive = true;
    this.dataset.pixHighlighterRoot = "";
    this.constructor.ensureComponentStyles();
    PixHighlighter.ensureThemeState();
    PixHighlighter.instances.add(this);
    this._ensureToolbar();
    this._syncThemeControl();
    this._updateHighlightState({ force: true, syncSourceText: true });
    this._observe();
  }

  /** @returns {void} */
  disconnectedCallback() {
    if (!this._stateReady || !this._isActive) return;

    this._isActive = false;
    this._teardownThemePicker();
    this._copyButton?.removeEventListener("click", this._onCopyClick);

    this._themeOptionButtons?.forEach((button) => {
      button.removeEventListener("click", this._onThemeOptionClick);
    });

    this._mo?.disconnect();
    this._mo = null;
    this._sourceText = null;
    this._textNode = null;
    this._tokens = [];
    window.clearTimeout(this._copyResetTimer);
    this._copyResetTimer = 0;
    PixHighlighter.instances.delete(this);
    PixHighlighter.renderHighlights();
  }

  /**
   * @param {string} name
   * @param {string | null} previousValue
   * @param {string | null} nextValue
   * @returns {void}
   */
  attributeChangedCallback(name, previousValue, nextValue) {
    this._ensureState();

    (name === "data-lang" || name === "lang" || name === "data-trim") &&
      previousValue !== nextValue &&
      this._updateHighlightState({ force: true });
  }

  /**
   * @internal
   * @returns {string}
   */
  _getLanguage() {
    return normalizeLang(this.getAttribute("data-lang") || this.getAttribute("lang"));
  }

  /**
   * @internal
   * @returns {void}
   */
  _ensureState() {
    if (this._stateReady) {
      this._supportsHighlight = PixHighlighter.supportsHighlights();

      return;
    }

    this._stateReady = true;
    this._id ||= (++PixHighlighter._uid).toString(36);
    this[ENHANCED_MARKER] = true;
    this._isActive = false;
    this._lastText = null;
    this._lastLang = null;
    this._lastTrimEnabled = null;
    this._sourceText = null;
    this._tokens = [];
    this._textNode = null;
    this._mo = null;
    this._copyButton = null;
    this._themePicker = null;
    this._themeTrigger = null;
    this._themeTriggerLabel = null;
    this._themeList = null;
    this._themeMenu = null;
    this._themeListHome = null;
    this._themeOptionButtons = [];
    this._themeMenuOpen = false;
    this._activeThemeOptionIndex = 0;
    this._copyResetTimer = 0;
    this._themeMenuListenerTimer = 0;
    this._isSyncingCode = false;
    this._supportsHighlight = PixHighlighter.supportsHighlights();
    this._supportsAnchorPositioning = supportsAnchorPositioning();
    this._onCopyClick = this._handleCopyClick.bind(this);
    this._onThemePickerClick = this._handleThemePickerClick.bind(this);
    this._onThemePickerKeyDown = this._handleThemePickerKeyDown.bind(this);
    this._onThemeOptionClick = this._handleThemeOptionClick.bind(this);
    this._onThemeListKeyDown = this._handleThemeListKeyDown.bind(this);
    this._onThemeMenuViewportChange = this._positionThemeList.bind(this);
    this._onThemeMenuClick = this._handleDocumentClick.bind(this);
    this._onThemeMenuKeyDown = this._handleDocumentKeyDown.bind(this);
  }

  /**
   * @internal
   * @returns {HTMLElement | null}
   */
  _getCodeElement() {
    return this.querySelector("code");
  }

  /**
   * @internal
   * @param {HTMLElement | null} [code=this._getCodeElement()]
   * @returns {boolean}
   */
  _shouldTrimCode(code = this._getCodeElement()) {
    const trimValue = code?.getAttribute("data-trim") ?? this.getAttribute("data-trim");

    return trimValue == null ? true : !/^(false|0|off|no)$/iu.test(trimValue.trim());
  }

  /**
   * @internal
   * @param {string} sourceText
   * @returns {string}
   */
  _trimCode(sourceText) {
    const normalizedText = sourceText.replace(/\r\n?/gu, "\n");
    const lines = normalizedText.split("\n");

    while (lines.length && !lines[0].trim()) {
      lines.shift();
    }

    while (lines.length && !lines.at(-1).trim()) {
      lines.pop();
    }

    if (!lines.length) {
      return "";
    }

    const indentWidth = lines.reduce((minimumIndent, line) => {
      if (!line.trim()) {
        return minimumIndent;
      }

      const indentMatch = line.match(/^[\t ]*/u);
      const currentIndent = indentMatch?.[0]?.length ?? 0;

      return Math.min(minimumIndent, currentIndent);
    }, Number.POSITIVE_INFINITY);

    if (!Number.isFinite(indentWidth) || indentWidth <= 0) {
      return lines.join("\n");
    }

    return lines.map((line) => (line.trim() ? line.slice(indentWidth) : "")).join("\n");
  }

  /**
   * @internal
   * @returns {void}
   */
  _ensureToolbar() {
    const existingToolbar = this.querySelector("[data-pix-highlighter-toolbar]");

    if (existingToolbar) {
      this._themePicker = existingToolbar.querySelector("details[data-pix-highlighter-theme-picker]");
      this._themeTrigger =
        this._themePicker?.querySelector("summary[data-pix-highlighter-theme-trigger]") || null;
      this._themeTriggerLabel = existingToolbar.querySelector("[data-pix-highlighter-theme-value]");
      this._themeList = existingToolbar.querySelector("section[data-pix-highlighter-theme-list]");
      this._themeMenu = this._themeList?.querySelector("menu") || null;
      this._themeListHome = existingToolbar;
      this._copyButton = existingToolbar.querySelector("button[data-pix-highlighter-copy]");

      this._themeOptionButtons = Array.from(
        existingToolbar.querySelectorAll("button[data-pix-highlighter-theme-option]")
      );

      this._teardownThemePicker();
      this._copyButton?.removeEventListener("click", this._onCopyClick);

      this._themeOptionButtons.forEach((button) => {
        button.removeEventListener("click", this._onThemeOptionClick);
      });

      this._copyButton?.addEventListener("click", this._onCopyClick);

      this._themeOptionButtons.forEach((button) => {
        button.addEventListener("click", this._onThemeOptionClick);
      });

      this._bindThemePicker();

      if (this._themeList) {
        this._themeList.hidden = !this._themeMenuOpen;
      }

      return;
    }

    const toolbar = document.createElement("span");
    toolbar.dataset.pixHighlighterToolbar = "";
    toolbar.setAttribute("role", "group");
    toolbar.setAttribute("aria-label", "Code block actions");

    const themePicker = document.createElement("details");
    themePicker.dataset.pixHighlighterThemePicker = "";
    themePicker.name = `pix-highlighter-theme-picker-${this._id}`;

    const themeTrigger = document.createElement("summary");
    themeTrigger.dataset.pixHighlighterThemeTrigger = "";
    themeTrigger.setAttribute("aria-label", "Syntax highlight theme");
    themeTrigger.setAttribute("role", "button");

    const triggerLabel = document.createElement("span");
    triggerLabel.dataset.pixHighlighterThemeValue = "";

    const triggerLeadingIcon = document.createElement("span");
    triggerLeadingIcon.dataset.pixHighlighterThemeIcon = "";
    triggerLeadingIcon.innerHTML = PALETTE_ICON;

    const triggerChevron = document.createElement("span");
    triggerChevron.dataset.pixHighlighterThemeChevron = "";
    triggerChevron.innerHTML = CHEVRON_ICON;

    themeTrigger.append(triggerLeadingIcon, triggerLabel, triggerChevron);
    themePicker.append(themeTrigger);

    const themeList = document.createElement("section");
    themeList.dataset.pixHighlighterThemeList = "";
    themeList.hidden = true;
    themeList.id = `pix-highlighter-theme-list-${this._id}`;
    themeList.setAttribute("aria-label", "Syntax highlight themes");

    const themeMenu = document.createElement("menu");
    themeMenu.type = "toolbar";
    themeMenu.setAttribute("role", "menu");
    themeMenu.setAttribute("aria-orientation", "vertical");

    themeTrigger.setAttribute("aria-haspopup", "menu");
    themeTrigger.setAttribute("aria-controls", themeList.id);
    themeTrigger.setAttribute("aria-expanded", "false");

    const optionButtons = [];

    for (const option of PIX_HIGHLIGHTER_THEME_OPTIONS) {
      const optionButton = document.createElement("button");

      optionButton.type = "button";
      optionButton.dataset.pixHighlighterThemeOption = option.value;
      optionButton.setAttribute("role", "menuitemradio");
      optionButton.innerHTML = `<span>${option.label}</span><span aria-hidden="true">${option.value}</span>`;
      optionButton.tabIndex = -1;
      themeMenu.appendChild(optionButton);
      optionButtons.push(optionButton);
    }

    themeList.append(themeMenu);

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.dataset.pixHighlighterCopy = "";
    this._setCopyButtonState("idle", copyButton);

    toolbar.append(themePicker, themeList, copyButton);
    this.prepend(toolbar);

    this._themePicker = themePicker;
    this._themeTrigger = themeTrigger;
    this._themeTriggerLabel = triggerLabel;
    this._themeList = themeList;
    this._themeMenu = themeMenu;
    this._themeListHome = toolbar;
    this._themeOptionButtons = optionButtons;
    this._copyButton = copyButton;
    this._copyButton.addEventListener("click", this._onCopyClick);

    this._themeOptionButtons.forEach((button) => {
      button.addEventListener("click", this._onThemeOptionClick);
    });

    this._bindThemePicker();
  }

  /**
   * @internal
   * @returns {void}
   */
  _bindThemePicker() {
    if (!this._themePicker) {
      return;
    }

    this._configureThemeAnchor();

    this._themeTrigger?.removeEventListener("click", this._onThemePickerClick);
    this._themeTrigger?.removeEventListener("keydown", this._onThemePickerKeyDown);
    this._themeList?.removeEventListener("keydown", this._onThemeListKeyDown);
    this._themeTrigger?.addEventListener("click", this._onThemePickerClick);
    this._themeTrigger?.addEventListener("keydown", this._onThemePickerKeyDown);
    this._themeList?.addEventListener("keydown", this._onThemeListKeyDown);

    if (this._themeTrigger && this._themeList) {
      !this._themeList.id && (this._themeList.id = `pix-highlighter-theme-list-${this._id}`);

      this._themeTrigger.setAttribute("aria-haspopup", "menu");
      this._themeTrigger.setAttribute("aria-controls", this._themeList.id);
      this._themeTrigger.setAttribute("aria-expanded", String(this._themeMenuOpen));
    }

    this._syncThemeControl();
  }

  /**
   * @internal
   * @returns {string}
   */
  _getThemeAnchorName() {
    return `--pix-highlighter--highlighter-theme-trigger-${this._id}`;
  }

  /**
   * @internal
   * @returns {void}
   */
  _configureThemeAnchor() {
    if (!this._themeTrigger || !this._themeList) {
      return;
    }

    const anchorName = this._getThemeAnchorName();

    this._themeTrigger.style.setProperty("anchor-name", anchorName);
    this._themeList.style.setProperty("position-anchor", anchorName);
    this._themeList.style.setProperty("--pix-highlighter--anchor-offset", `${THEME_MENU_OFFSET}px`);
  }

  /**
   * @internal
   * @returns {void}
   */
  _syncThemeListSurface() {
    if (!this._themeList || typeof window === "undefined") {
      return;
    }

    const computed = window.getComputedStyle(this);
    const triggerComputed = this._themeTrigger ? window.getComputedStyle(this._themeTrigger) : null;

    for (const property of [
      "--pix-highlighter--toolbar-border",
      "--pix-highlighter--toolbar-color",
      "--pix-highlighter--toolbar-menu-bg",
      "--pix-highlighter--toolbar-menu-accent",
      "--pix-highlighter--toolbar-shadow",
    ]) {
      const value = computed.getPropertyValue(property).trim();

      value && this._themeList.style.setProperty(property, value);
    }

    if (triggerComputed) {
      this._themeList.style.fontFamily = triggerComputed.fontFamily;
      this._themeList.style.fontSize = triggerComputed.fontSize;
    }
  }

  /**
   * @internal
   * @returns {void}
   */
  _mountThemeList() {
    if (!this._themeList) {
      return;
    }

    this._themeListHome ||= this.querySelector("[data-pix-highlighter-toolbar]");
    this._themeList.hidden = false;
    this._syncThemeListSurface();

    if (this._supportsAnchorPositioning) {
      this._themeListHome?.appendChild(this._themeList);
      return;
    }

    const floatingLayer = ensureFloatingLayer();

    if (floatingLayer && this._themeList.parentElement !== floatingLayer) {
      floatingLayer.appendChild(this._themeList);
    }
  }

  /**
   * @internal
   * @returns {void}
   */
  _restoreThemeList() {
    if (!this._themeList) {
      return;
    }

    this._themeList.hidden = true;

    if (this._themeListHome && this._themeList.parentElement !== this._themeListHome) {
      this._themeListHome.appendChild(this._themeList);
    }
  }

  /**
   * @internal
   * @returns {void}
   */
  _teardownThemePicker() {
    this._themeTrigger?.removeEventListener("click", this._onThemePickerClick);
    this._themeTrigger?.removeEventListener("keydown", this._onThemePickerKeyDown);
    this._themeList?.removeEventListener("keydown", this._onThemeListKeyDown);
    window.clearTimeout(this._themeMenuListenerTimer);
    this._themeMenuListenerTimer = 0;
    this._removeFloatingThemePickerListeners();
    this._resetThemeListPosition();
    this._restoreThemeList();
    this._themeMenuOpen = false;
    this._themePicker && (this._themePicker.open = false);

    this._themeTrigger && this._themeTrigger.setAttribute("aria-expanded", "false");
  }

  /**
   * @internal
   * @returns {void}
   */
  _addFloatingThemePickerListeners() {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (!this._supportsAnchorPositioning) {
      window.addEventListener("resize", this._onThemeMenuViewportChange);
      document.addEventListener("scroll", this._onThemeMenuViewportChange, true);
    }

    document.addEventListener("click", this._onThemeMenuClick, true);
    document.addEventListener("keydown", this._onThemeMenuKeyDown, true);
  }

  /**
   * @internal
   * @returns {void}
   */
  _removeFloatingThemePickerListeners() {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    window.removeEventListener("resize", this._onThemeMenuViewportChange);
    document.removeEventListener("scroll", this._onThemeMenuViewportChange, true);
    document.removeEventListener("click", this._onThemeMenuClick, true);
    document.removeEventListener("keydown", this._onThemeMenuKeyDown, true);
  }

  /**
   * @internal
   * @returns {void}
   */
  _resetThemeListPosition() {
    if (!this._themeList) {
      return;
    }

    this._themeList.style.removeProperty("top");
    this._themeList.style.removeProperty("left");
    this._themeList.style.removeProperty("min-width");
    this._themeList.style.removeProperty("max-height");
    this._themeList.style.removeProperty("visibility");
  }

  /**
   * @internal
   * @returns {void}
   */
  _handleThemePickerClick(event) {
    event.preventDefault();
    this._themeMenuOpen ? this._closeThemeMenu() : this._openThemeMenu();
  }

  /**
   * @internal
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  _handleThemePickerKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this._openThemeMenu({ focusStrategy: "selected" });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      this._openThemeMenu({ focusStrategy: "last" });
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._openThemeMenu({ focusStrategy: "selected" });
    }
  }

  /**
   * @internal
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  _handleThemeListKeyDown(event) {
    const target = event.target;

    if (!(target instanceof window.HTMLButtonElement)) {
      return;
    }

    const currentIndex = this._themeOptionButtons.indexOf(target);

    if (currentIndex < 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      this._focusThemeOptionByIndex(currentIndex + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      this._focusThemeOptionByIndex(currentIndex - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      this._focusThemeOptionByIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      this._focusThemeOptionByIndex(this._themeOptionButtons.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      target.click();
    }
  }

  /**
   * @internal
   * @param {MouseEvent} event
   * @returns {void}
   */
  _handleDocumentClick(event) {
    if (!this._themeMenuOpen) {
      return;
    }

    const target = event.target;

    if (target instanceof Node && (this._themePicker.contains(target) || this._themeList?.contains(target))) {
      return;
    }

    this._closeThemeMenu();
  }

  /**
   * @internal
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  _handleDocumentKeyDown(event) {
    if (!this._themeMenuOpen) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      this._closeThemeMenu({ returnFocus: true });
      return;
    }

    if (event.key === "Tab") {
      this._closeThemeMenu();
    }
  }

  /**
   * @internal
   * @returns {void}
   */
  _positionThemeList() {
    if (
      typeof window === "undefined" ||
      !this._themeMenuOpen ||
      !this._themeTrigger ||
      !this._themeList
    ) {
      return;
    }

    this._syncThemeListSurface();

    if (this._supportsAnchorPositioning) {
      this._resetThemeListPosition();

      return;
    }

    const triggerRect = this._themeTrigger.getBoundingClientRect();
    const minWidth = Math.max(triggerRect.width, 224);

    this._themeList.style.visibility = "hidden";
    this._themeList.style.left = "0px";
    this._themeList.style.top = "0px";
    this._themeList.style.minWidth = `${Math.round(minWidth)}px`;

    this._themeList.style.maxHeight = `${Math.max(
      120,
      window.innerHeight - THEME_MENU_VIEWPORT_MARGIN * 2
    )}px`;

    const listRect = this._themeList.getBoundingClientRect();

    const listWidth = Math.min(
      Math.max(minWidth, listRect.width || minWidth),
      window.innerWidth - THEME_MENU_VIEWPORT_MARGIN * 2
    );

    const listHeight = listRect.height || 0;

    const availableBelow =
      window.innerHeight - triggerRect.bottom - THEME_MENU_VIEWPORT_MARGIN - THEME_MENU_OFFSET;

    const availableAbove = triggerRect.top - THEME_MENU_VIEWPORT_MARGIN - THEME_MENU_OFFSET;

    const openUpward =
      availableBelow < Math.min(listHeight, 240) && availableAbove > availableBelow;

    const maxHeight = Math.max(120, openUpward ? availableAbove : availableBelow);
    const renderedHeight = Math.min(listHeight || maxHeight, maxHeight);

    let left = triggerRect.left;

    left + listWidth > window.innerWidth - THEME_MENU_VIEWPORT_MARGIN &&
      (left = window.innerWidth - THEME_MENU_VIEWPORT_MARGIN - listWidth);

    left = Math.max(THEME_MENU_VIEWPORT_MARGIN, left);

    const top = openUpward
      ? Math.max(THEME_MENU_VIEWPORT_MARGIN, triggerRect.top - THEME_MENU_OFFSET - renderedHeight)
      : Math.max(
          THEME_MENU_VIEWPORT_MARGIN,
          Math.min(
            triggerRect.bottom + THEME_MENU_OFFSET,
            window.innerHeight - THEME_MENU_VIEWPORT_MARGIN - renderedHeight
          )
        );

    this._themeList.style.left = `${Math.round(left)}px`;
    this._themeList.style.top = `${Math.round(top)}px`;
    this._themeList.style.minWidth = `${Math.round(listWidth)}px`;
    this._themeList.style.maxHeight = `${Math.round(maxHeight)}px`;
    this._themeList.style.visibility = "";
  }

  /**
   * @internal
   * @returns {void}
   */
  _observe() {
    this._mo?.disconnect();

    this._mo = new MutationObserver((mutations) => {
      if (this._isSyncingCode) return;

      const languageChanged = mutations.some(
        (mutation) =>
          mutation.type === "attributes" &&
          (mutation.attributeName === "data-lang" || mutation.attributeName === "lang")
      );

      const trimChanged = mutations.some(
        (mutation) => mutation.type === "attributes" && mutation.attributeName === "data-trim"
      );

      const sourceChanged = mutations.some(
        (mutation) => mutation.type === "childList" || mutation.type === "characterData"
      );

      this._updateHighlightState({
        force: languageChanged || trimChanged,
        syncSourceText: sourceChanged,
      });
    });

    this._mo.observe(this, {
      attributes: true,
      attributeFilter: ["data-lang", "lang", "data-trim"],
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  /**
   * @internal
   * @param {{ force?: boolean; syncSourceText?: boolean }} [options]
   * @returns {void}
   */
  _updateHighlightState({ force = false, syncSourceText = false } = {}) {
    const code = this._getCodeElement();

    if (!code) {
      this._lastText = null;
      this._lastLang = null;
      this._lastTrimEnabled = null;
      this._sourceText = null;
      this._tokens = [];
      this._textNode = null;
      PixHighlighter.renderHighlights();

      return;
    }

    const sourceText =
      syncSourceText || this._sourceText == null ? code.textContent ?? "" : this._sourceText;
    const language = this._getLanguage();
    const trimEnabled = this._shouldTrimCode(code);
    const text = trimEnabled ? this._trimCode(sourceText) : sourceText;

    if (
      !force &&
      sourceText === this._lastText &&
      language === this._lastLang &&
      trimEnabled === this._lastTrimEnabled
    ) {
      return;
    }

    this._sourceText = sourceText;
    this._lastText = sourceText;
    this._lastLang = language;
    this._lastTrimEnabled = trimEnabled;
    this._tokens = this._lex(language, text);

    if (this._supportsHighlight) {
      this._isSyncingCode = true;
      code.textContent = text;
      this._textNode = code.firstChild || code.appendChild(document.createTextNode(""));
      this._isSyncingCode = false;
    } else {
      this._textNode = null;
      this._renderFallbackMarkup(code, text, this._tokens);
    }

    PixHighlighter.renderHighlights();
  }

  /**
   * @internal
   * @param {HTMLElement} code
   * @param {string} text
   * @param {import('./lexers/_Utils.js').PixHighlighterToken[]} tokens
   * @returns {void}
   */
  _renderFallbackMarkup(code, text, tokens) {
    this._isSyncingCode = true;

    if (!tokens.length) {
      code.textContent = text;
      this._isSyncingCode = false;

      return;
    }

    const fragment = document.createDocumentFragment();
    let cursor = 0;

    for (const token of tokens) {
      if (token.start < cursor) continue;

      if (token.start > cursor) {
        fragment.append(document.createTextNode(text.slice(cursor, token.start)));
      }

      const tokenElement = document.createElement("span");
      tokenElement.className = `pix-token pix-token--${token.type}`;
      tokenElement.textContent = text.slice(token.start, token.end);
      fragment.append(tokenElement);
      cursor = token.end;
    }

    if (cursor < text.length) {
      fragment.append(document.createTextNode(text.slice(cursor)));
    }

    code.replaceChildren(fragment);
    this._isSyncingCode = false;
  }

  /**
   * @internal
   * @param {PixHighlighterTheme} [theme=PixHighlighter.getCurrentTheme()]
   * @returns {void}
   */
  _syncThemeControl(theme = PixHighlighter.getCurrentTheme()) {
    if (this._themeTriggerLabel) {
      this._themeTriggerLabel.textContent = getThemeLabel(theme);
    }

    this._syncThemeListSurface();

    const selectedIndex = Math.max(
      0,
      this._themeOptionButtons.findIndex(
        (button) => button.dataset.pixHighlighterThemeOption === theme
      )
    );

    this._activeThemeOptionIndex = selectedIndex;

    this._themeOptionButtons.forEach((button, index) => {
      const selected = index === selectedIndex;
      button.toggleAttribute("data-selected", selected);
      button.setAttribute("aria-checked", String(selected));
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
  }

  /**
   * @internal
   * @returns {number}
   */
  _getSelectedThemeOptionIndex() {
    return Math.max(
      0,
      this._themeOptionButtons.findIndex((button) => button.hasAttribute("data-selected"))
    );
  }

  /**
   * @internal
   * @param {number} index
   * @returns {void}
   */
  _focusThemeOptionByIndex(index) {
    if (!this._themeOptionButtons.length) {
      return;
    }

    const normalizedIndex = ((index % this._themeOptionButtons.length) + this._themeOptionButtons.length) % this._themeOptionButtons.length;

    this._activeThemeOptionIndex = normalizedIndex;
    this._themeOptionButtons.forEach((button, buttonIndex) => {
      button.tabIndex = buttonIndex === normalizedIndex ? 0 : -1;
    });

    this._themeOptionButtons[normalizedIndex]?.focus();
  }

  /**
   * @internal
   * @param {{ focusStrategy?: 'selected' | 'first' | 'last' }} [options]
   * @returns {void}
   */
  _openThemeMenu({ focusStrategy } = {}) {
    if (this._themeMenuOpen) {
      if (focusStrategy) {
        this._focusThemeMenu(focusStrategy);
      }

      return;
    }

    this._themeMenuOpen = true;
    this._themePicker && (this._themePicker.open = true);
    this._themeTrigger?.setAttribute("aria-expanded", "true");
    this._mountThemeList();
    this._positionThemeList();
    this._addFloatingThemePickerListeners();

    focusStrategy && this._focusThemeMenu(focusStrategy);
  }

  /**
   * @internal
   * @param {{ returnFocus?: boolean }} [options]
   * @returns {void}
   */
  _closeThemeMenu({ returnFocus = false } = {}) {
    if (!this._themeMenuOpen) {
      return;
    }

    this._themeMenuOpen = false;
    this._themePicker && (this._themePicker.open = false);
    this._themeTrigger?.setAttribute("aria-expanded", "false");
    this._removeFloatingThemePickerListeners();
    this._resetThemeListPosition();
    this._restoreThemeList();

    returnFocus && this._themeTrigger?.focus();
  }

  /**
   * @internal
   * @param {'selected' | 'first' | 'last'} focusStrategy
   * @returns {void}
   */
  _focusThemeMenu(focusStrategy) {
    if (focusStrategy === "first") {
      this._focusThemeOptionByIndex(0);
      return;
    }

    if (focusStrategy === "last") {
      this._focusThemeOptionByIndex(this._themeOptionButtons.length - 1);
      return;
    }

    this._focusThemeOptionByIndex(this._getSelectedThemeOptionIndex());
  }

  /**
   * @internal
   * @param {MouseEvent & { currentTarget: HTMLButtonElement }} event
   * @returns {void}
   */
  _handleThemeOptionClick(event) {
    const theme = event.currentTarget.dataset.pixHighlighterThemeOption;
    PixHighlighter.applyTheme(theme);
    this._closeThemeMenu({ returnFocus: true });
  }

  /**
   * @internal
   * @returns {Promise<void>}
   */
  async _handleCopyClick() {
    const code = this._getCodeElement();

    if (!code?.textContent) return;

    try {
      await this._copyText(code.textContent);
      this._setCopyButtonState("copied");
    } catch {
      this._setCopyButtonState("error");
    }
  }

  /**
   * @internal
   * @param {string} value
   * @returns {Promise<void>}
   */
  async _copyText(value) {
    if (window.navigator?.clipboard?.writeText) {
      await window.navigator.clipboard.writeText(value);

      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand?.("copy");
    textarea.remove();

    if (!copied) {
      throw new Error("Copy command failed");
    }
  }

  /**
   * @internal
   * @param {'idle' | 'copied' | 'error'} state
   * @param {HTMLButtonElement | null} [button=this._copyButton]
   * @returns {void}
   */
  _setCopyButtonState(state, button = this._copyButton) {
    if (!button) return;

    const config = ICON_BUTTON_STATES[state] || ICON_BUTTON_STATES.idle;
    button.dataset.copyState = state;
    setIconButtonContent(button, config.icon, config.label);

    if (button !== this._copyButton) return;

    window.clearTimeout(this._copyResetTimer);

    this._copyResetTimer = window.setTimeout(() => {
      this._setCopyButtonState("idle");
    }, COPY_RESET_DELAY);
  }

  /**
   * @internal
   * @param {string} lang
   * @param {string} text
   * @returns {import('./lexers/_Utils.js').PixHighlighterToken[]}
   */
  _lex(lang, text) {
    return tokenizeSource(lang, text);
  }
}

/**
 * Enhance all matching `pre[is="pix-highlighter"]` blocks under the provided root.
 * @param {Document | Element} [root=document]
 * @returns {PixHighlighter[]}
 */
function enhancePixHighlighters(root = document) {
  return PixHighlighter.enhanceAll(root);
}

/**
 * @internal
 * @returns {void}
 */
function bootPixHighlighters() {
  if (typeof document === "undefined") return;

  enhancePixHighlighters(document);
}

export {
  enhancePixHighlighters,
  lexBash,
  lexC,
  lexCPP,
  lexCSharp,
  lexCSS,
  lexGo,
  lexHTML,
  lexJS,
  lexJSON,
  lexMarkdown,
  lexPHP,
  lexPython,
  lexRust,
  lexTS,
  lexYAML,
  normalizeLang,
  PIX_HIGHLIGHTER_THEME_OPTIONS,
  PixHighlighter,
  tokenizeSource,
};
