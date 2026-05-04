export type PixHighlighterTokenType = import("./lexers/_Utils.js").PixHighlighterTokenType;
export type PixHighlighterTheme = import("./PixHighlighter.const.js").PixHighlighterTheme;
/**
 * Enhance all matching `pre[is="pix-highlighter"]` blocks under the provided root.
 * @param {Document | Element} [root=document]
 * @returns {PixHighlighter[]}
 */
export function enhancePixHighlighters(root?: Document | Element): PixHighlighter[];
import { lexBash } from "./lexers/index.js";
import { lexC } from "./lexers/index.js";
import { lexCPP } from "./lexers/index.js";
import { lexCSharp } from "./lexers/index.js";
import { lexCSS } from "./lexers/index.js";
import { lexGo } from "./lexers/index.js";
import { lexHTML } from "./lexers/index.js";
import { lexJS } from "./lexers/index.js";
import { lexJSON } from "./lexers/index.js";
import { lexMarkdown } from "./lexers/index.js";
import { lexPHP } from "./lexers/index.js";
import { lexPython } from "./lexers/index.js";
import { lexRust } from "./lexers/index.js";
import { lexTS } from "./lexers/index.js";
import { lexYAML } from "./lexers/index.js";
import { normalizeLang } from "./lexers/index.js";
import { PIX_HIGHLIGHTER_THEME_OPTIONS } from "./PixHighlighter.const.js";
/** @typedef {import('./lexers/_Utils.js').PixHighlighterTokenType} PixHighlighterTokenType */
/** @typedef {import('./PixHighlighter.const.js').PixHighlighterTheme} PixHighlighterTheme */
export class PixHighlighter extends HTMLPreElement {
    /**
     * @internal
     * @type {number}
     */
    static _uid: number;
    /** @type {Set<PixHighlighter>} */
    static instances: Set<PixHighlighter>;
    /** @type {readonly PixHighlighterTokenType[]} */
    static KNOWN_TYPES: readonly PixHighlighterTokenType[];
    /**
     * @internal
     * @type {boolean}
     */
    static _themeInitialized: boolean;
    /** @returns {CSSStyleSheet | HTMLStyleElement | null} */
    static ensureComponentStyles(): CSSStyleSheet | HTMLStyleElement | null;
    /** @returns {boolean} */
    static registerCustomElement(): boolean;
    /** @returns {string[]} */
    static get observedAttributes(): string[];
    /** @returns {boolean} */
    static supportsHighlights(): boolean;
    /**
     * @internal
     * @param {PixHighlighterTokenType} type
     * @returns {string}
     */
    static getHighlightName(type: PixHighlighterTokenType): string;
    /**
     * @internal
     * @param {PixHighlighterTheme | null | undefined} theme
     * @returns {boolean}
     */
    static isThemeValue(theme: PixHighlighterTheme | null | undefined): boolean;
    /** @returns {PixHighlighterTheme | null} */
    static getSavedTheme(): PixHighlighterTheme | null;
    /** @returns {PixHighlighterTheme} */
    static getCurrentTheme(): PixHighlighterTheme;
    /** @returns {PixHighlighterTheme} */
    static getInitialTheme(): PixHighlighterTheme;
    /**
     * @internal
     * @returns {void}
     */
    static ensureThemeState(): void;
    /**
     * @param {PixHighlighterTheme} theme
     * @param {{ persist?: boolean; syncInstances?: boolean }} [options]
     * @returns {PixHighlighterTheme}
     */
    static applyTheme(theme: PixHighlighterTheme, { persist, syncInstances }?: {
        persist?: boolean;
        syncInstances?: boolean;
    }): PixHighlighterTheme;
    /** @returns {void} */
    static clearManagedHighlights(): void;
    /**
     * @param {HTMLPreElement} element
     * @returns {PixHighlighter | null}
     */
    static enhanceElement(element: HTMLPreElement): PixHighlighter | null;
    /**
     * @param {Document | Element} [root=document]
     * @returns {PixHighlighter[]}
     */
    static enhanceAll(root?: Document | Element): PixHighlighter[];
    /**
     * @internal
     * @returns {void}
     */
    static renderHighlights(): void;
    /** @returns {void} */
    connectedCallback(): void;
    /**
     * @internal
     * @returns {void}
     */
    _connect(): void;
    _isActive: boolean | undefined;
    /** @returns {void} */
    disconnectedCallback(): void;
    _mo: MutationObserver | null | undefined;
    _sourceText: any;
    _textNode: ChildNode | null | undefined;
    _tokens: any[] | import("./lexers/_Utils.js").PixHighlighterToken[] | undefined;
    _copyResetTimer: number | undefined;
    /**
     * @param {string} name
     * @param {string | null} previousValue
     * @param {string | null} nextValue
     * @returns {void}
     */
    attributeChangedCallback(name: string, previousValue: string | null, nextValue: string | null): void;
    /**
     * @internal
     * @returns {string}
     */
    _getLanguage(): string;
    /**
     * @internal
     * @returns {void}
     */
    _ensureState(): void;
    _supportsHighlight: boolean | undefined;
    _stateReady: boolean | undefined;
    _lastText: any;
    _lastLang: any;
    _lastTrimEnabled: any;
    _copyButton: Element | HTMLButtonElement | null | undefined;
    _themePicker: Element | HTMLDetailsElement | null | undefined;
    _themeTrigger: HTMLElement | Element | null | undefined;
    _themeTriggerLabel: Element | HTMLSpanElement | null | undefined;
    _themeList: HTMLElement | Element | null | undefined;
    _themeMenu: HTMLMenuElement | null | undefined;
    _themeListHome: Element | HTMLSpanElement | null | undefined;
    _themeOptionButtons: any[] | Element[] | HTMLButtonElement[] | undefined;
    _themeMenuOpen: boolean | undefined;
    _activeThemeOptionIndex: number | undefined;
    _themeMenuListenerTimer: number | undefined;
    _isSyncingCode: boolean | undefined;
    _supportsAnchorPositioning: boolean | undefined;
    _onCopyClick: (() => Promise<void>) | undefined;
    _onThemePickerClick: ((event: any) => void) | undefined;
    _onThemePickerKeyDown: ((event: KeyboardEvent) => void) | undefined;
    _onThemeOptionClick: ((event: MouseEvent & {
        currentTarget: HTMLButtonElement;
    }) => void) | undefined;
    _onThemeListKeyDown: ((event: KeyboardEvent) => void) | undefined;
    _onThemeMenuViewportChange: (() => void) | undefined;
    _onThemeMenuClick: ((event: MouseEvent) => void) | undefined;
    _onThemeMenuKeyDown: ((event: KeyboardEvent) => void) | undefined;
    /**
     * @internal
     * @returns {HTMLElement | null}
     */
    _getCodeElement(): HTMLElement | null;
    /**
     * @internal
     * @param {HTMLElement | null} [code=this._getCodeElement()]
     * @returns {boolean}
     */
    _shouldTrimCode(code?: HTMLElement | null): boolean;
    /**
     * @internal
     * @param {string} sourceText
     * @returns {string}
     */
    _trimCode(sourceText: string): string;
    /**
     * @internal
     * @returns {void}
     */
    _ensureToolbar(): void;
    /**
     * @internal
     * @returns {void}
     */
    _bindThemePicker(): void;
    /**
     * @internal
     * @returns {string}
     */
    _getThemeAnchorName(): string;
    /**
     * @internal
     * @returns {void}
     */
    _configureThemeAnchor(): void;
    /**
     * @internal
     * @returns {void}
     */
    _syncThemeListSurface(): void;
    /**
     * @internal
     * @returns {void}
     */
    _mountThemeList(): void;
    /**
     * @internal
     * @returns {void}
     */
    _restoreThemeList(): void;
    /**
     * @internal
     * @returns {void}
     */
    _teardownThemePicker(): void;
    /**
     * @internal
     * @returns {void}
     */
    _addFloatingThemePickerListeners(): void;
    /**
     * @internal
     * @returns {void}
     */
    _removeFloatingThemePickerListeners(): void;
    /**
     * @internal
     * @returns {void}
     */
    _resetThemeListPosition(): void;
    /**
     * @internal
     * @returns {void}
     */
    _handleThemePickerClick(event: any): void;
    /**
     * @internal
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    _handleThemePickerKeyDown(event: KeyboardEvent): void;
    /**
     * @internal
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    _handleThemeListKeyDown(event: KeyboardEvent): void;
    /**
     * @internal
     * @param {MouseEvent} event
     * @returns {void}
     */
    _handleDocumentClick(event: MouseEvent): void;
    /**
     * @internal
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    _handleDocumentKeyDown(event: KeyboardEvent): void;
    /**
     * @internal
     * @returns {void}
     */
    _positionThemeList(): void;
    /**
     * @internal
     * @returns {void}
     */
    _observe(): void;
    /**
     * @internal
     * @param {{ force?: boolean; syncSourceText?: boolean }} [options]
     * @returns {void}
     */
    _updateHighlightState({ force, syncSourceText }?: {
        force?: boolean;
        syncSourceText?: boolean;
    }): void;
    /**
     * @internal
     * @param {HTMLElement} code
     * @param {string} text
     * @param {import('./lexers/_Utils.js').PixHighlighterToken[]} tokens
     * @returns {void}
     */
    _renderFallbackMarkup(code: HTMLElement, text: string, tokens: import("./lexers/_Utils.js").PixHighlighterToken[]): void;
    /**
     * @internal
     * @param {PixHighlighterTheme} [theme=PixHighlighter.getCurrentTheme()]
     * @returns {void}
     */
    _syncThemeControl(theme?: PixHighlighterTheme): void;
    /**
     * @internal
     * @returns {number}
     */
    _getSelectedThemeOptionIndex(): number;
    /**
     * @internal
     * @param {number} index
     * @returns {void}
     */
    _focusThemeOptionByIndex(index: number): void;
    /**
     * @internal
     * @param {{ focusStrategy?: 'selected' | 'first' | 'last' }} [options]
     * @returns {void}
     */
    _openThemeMenu({ focusStrategy }?: {
        focusStrategy?: "selected" | "first" | "last";
    }): void;
    /**
     * @internal
     * @param {{ returnFocus?: boolean }} [options]
     * @returns {void}
     */
    _closeThemeMenu({ returnFocus }?: {
        returnFocus?: boolean;
    }): void;
    /**
     * @internal
     * @param {'selected' | 'first' | 'last'} focusStrategy
     * @returns {void}
     */
    _focusThemeMenu(focusStrategy: "selected" | "first" | "last"): void;
    /**
     * @internal
     * @param {MouseEvent & { currentTarget: HTMLButtonElement }} event
     * @returns {void}
     */
    _handleThemeOptionClick(event: MouseEvent & {
        currentTarget: HTMLButtonElement;
    }): void;
    /**
     * @internal
     * @returns {Promise<void>}
     */
    _handleCopyClick(): Promise<void>;
    /**
     * @internal
     * @param {string} value
     * @returns {Promise<void>}
     */
    _copyText(value: string): Promise<void>;
    /**
     * @internal
     * @param {'idle' | 'copied' | 'error'} state
     * @param {HTMLButtonElement | null} [button=this._copyButton]
     * @returns {void}
     */
    _setCopyButtonState(state: "idle" | "copied" | "error", button?: HTMLButtonElement | null): void;
    /**
     * @internal
     * @param {string} lang
     * @param {string} text
     * @returns {import('./lexers/_Utils.js').PixHighlighterToken[]}
     */
    _lex(lang: string, text: string): import("./lexers/_Utils.js").PixHighlighterToken[];
    [ENHANCED_MARKER]: boolean | undefined;
}
import { tokenizeSource } from "./lexers/index.js";
import { ENHANCED_MARKER } from "./PixHighlighter.const.js";
export { lexBash, lexC, lexCPP, lexCSharp, lexCSS, lexGo, lexHTML, lexJS, lexJSON, lexMarkdown, lexPHP, lexPython, lexRust, lexTS, lexYAML, normalizeLang, PIX_HIGHLIGHTER_THEME_OPTIONS, tokenizeSource };
//# sourceMappingURL=PixHighlighter.d.ts.map