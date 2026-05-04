/**
 * Normalize common aliases to the canonical lexer id used internally.
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function normalizeLanguage(value: string | null | undefined): string;
/**
 * Create a token writer that ignores empty ranges.
 * @param {PixHighlighterToken[]} tokens
 * @returns {TokenPusher}
 */
export function makePusher(tokens: PixHighlighterToken[]): TokenPusher;
/**
 * Read a quoted string literal starting at the provided offset.
 * @param {string} text
 * @param {number} i
 * @param {string} quote
 * @param {ReadStringOptions} [opts]
 * @returns {[number, number]}
 */
export function readString(text: string, i: number, quote: string, opts?: ReadStringOptions): [number, number];
export function readNumber(text: any, i: any): any[];
/**
 * @param {string} text
 * @param {number} i
 * @returns {number}
 */
export function skipSpace(text: string, i: number): number;
/**
 * @param {string} ch
 * @returns {boolean}
 */
export function isIdentStart(ch: string): boolean;
/**
 * @param {string} ch
 * @returns {boolean}
 */
export function isIdent(ch: string): boolean;
/**
 * Apply lightweight semantic enrichment to identifier tokens.
 * @param {string} text
 * @param {PixHighlighterToken[]} tokens
 * @returns {PixHighlighterToken[]}
 */
export function enrichSemanticTokens(text: string, tokens: PixHighlighterToken[]): PixHighlighterToken[];
/**
 * @typedef {'kw' | 'str' | 'num' | 'com' | 'id' | 'fn' | 'op' | 'tag' | 'attr' | 'key' | 'var' | 'mac' | 'pp' | 'prop' | 'type' | 'mdh' | 'mde' | 'mds' | 'mdc' | 'mdl' | 'mdbq' | 'mdli' | 'mdhr' | 'mdimg'} PixHighlighterTokenType
 */
/**
 * @typedef {object} PixHighlighterToken
 * @property {PixHighlighterTokenType} type
 * @property {number} start
 * @property {number} end
 */
/**
 * @callback PixHighlighterLexer
 * @param {string} source
 * @returns {PixHighlighterToken[]}
 */
/**
 * @typedef {(type: PixHighlighterTokenType, start: number, end: number) => void} TokenPusher
 */
/**
 * @typedef {object} ReadStringOptions
 * @property {boolean} [includePrefix]
 */
/** @type {readonly PixHighlighterTokenType[]} */
export const TOKEN_TYPES: readonly PixHighlighterTokenType[];
/**
 * Normalize common aliases to the canonical lexer id used internally.
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function normalizeLang(value: string | null | undefined): string;
export type PixHighlighterTokenType = "kw" | "str" | "num" | "com" | "id" | "fn" | "op" | "tag" | "attr" | "key" | "var" | "mac" | "pp" | "prop" | "type" | "mdh" | "mde" | "mds" | "mdc" | "mdl" | "mdbq" | "mdli" | "mdhr" | "mdimg";
export type PixHighlighterToken = {
    type: PixHighlighterTokenType;
    start: number;
    end: number;
};
export type PixHighlighterLexer = (source: string) => PixHighlighterToken[];
export type TokenPusher = (type: PixHighlighterTokenType, start: number, end: number) => void;
export type ReadStringOptions = {
    includePrefix?: boolean | undefined;
};
//# sourceMappingURL=_Utils.d.ts.map