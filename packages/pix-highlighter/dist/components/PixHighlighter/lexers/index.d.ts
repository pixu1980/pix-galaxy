/**
 * @param {string} language
 * @returns {PixHighlighterLexer | null}
 */
export function getLexer(language: string): PixHighlighterLexer | null;
/**
 * @param {string} language
 * @param {string} source
 * @returns {PixHighlighterToken[]}
 */
export function tokenizeSource(language: string, source: string): PixHighlighterToken[];
export type PixHighlighterLexer = import("./_Utils.js").PixHighlighterLexer;
export type PixHighlighterToken = import("./_Utils.js").PixHighlighterToken;
import { TOKEN_TYPES } from './_Utils.js';
import { lexBash } from './_Bash.js';
import { lexC } from './_C.js';
import { lexCPP } from './_C.js';
import { lexCSharp } from './_Csharp.js';
import { lexCSS } from './_CSS.js';
import { lexGo } from './_Go.js';
import { lexHTML } from './_HTML.js';
import { lexJS } from './_JavaScript.js';
import { lexJSON } from './_JSON.js';
import { lexMarkdown } from './_Markdown.js';
import { lexPHP } from './_Php.js';
import { lexPython } from './_Python.js';
import { lexRust } from './_Rust.js';
import { lexTS } from './_TypeScript.js';
import { lexYAML } from './_YAML.js';
import { normalizeLanguage } from './_Utils.js';
import { normalizeLang } from './_Utils.js';
export { TOKEN_TYPES, lexBash, lexC, lexCPP, lexCSharp, lexCSS, lexGo, lexHTML, lexJS, lexJSON, lexMarkdown, lexPHP, lexPython, lexRust, lexTS, lexYAML, normalizeLanguage, normalizeLang };
//# sourceMappingURL=index.d.ts.map