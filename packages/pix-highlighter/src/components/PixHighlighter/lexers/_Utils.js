// @ts-nocheck



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
export const TOKEN_TYPES = Object.freeze([
  'kw',
  'str',
  'num',
  'com',
  'id',
  'fn',
  'op',
  'tag',
  'attr',
  'key',
  'var',
  'mac',
  'pp',
  'prop',
  'type',
  'mdh',
  'mde',
  'mds',
  'mdc',
  'mdl',
  'mdbq',
  'mdli',
  'mdhr',
  'mdimg',
]);

/**
 * Normalize common aliases to the canonical lexer id used internally.
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function normalizeLanguage(value) {
  const normalizedValue = (value || '').toLowerCase().trim();
  const aliasMap = new Map([
    ['javascript', 'js'],
    ['mjs', 'js'],
    ['cjs', 'js'],
    ['typescript', 'ts'],
    ['tsx', 'ts'],
    ['py', 'python'],
    ['rs', 'rust'],
    ['c++', 'cpp'],
    ['hpp', 'cpp'],
    ['h++', 'cpp'],
    ['cs', 'csharp'],
    ['md', 'markdown'],
    ['yaml', 'yml'],
    ['shell', 'bash'],
    ['zsh', 'bash'],
    ['scss', 'css'],
    ['sass', 'css'],
  ]);
  return aliasMap.get(normalizedValue) || normalizedValue || 'js';
}

export const normalizeLang = normalizeLanguage;

/**
 * Create a token writer that ignores empty ranges.
 * @param {PixHighlighterToken[]} tokens
 * @returns {TokenPusher}
 */
export function makePusher(tokens) {
  return (type, start, end) => {
    if (end > start) tokens.push({ type, start, end });
  };
}

/**
 * Read a quoted string literal starting at the provided offset.
 * @param {string} text
 * @param {number} i
 * @param {string} quote
 * @param {ReadStringOptions} [opts]
 * @returns {[number, number]}
 */
export function readString(text, i, quote, opts = {}) {
  const L = text.length;
  let j = i + 1;
  if (opts.includePrefix) i--; // include 1-char prefix (e.g., @, $)
  while (j < L) {
    const ch = text[j];
    if (ch === '\\') {
      j += 2;
      continue;
    }
    if (ch === quote) {
      j++;
      break;
    }
    j++;
  }
  return [i, j];
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: numeric lexing needs explicit branch handling.
export function readNumber(text, i) {
  let j = i;
  if (text[j] === '-') j++;
  if (text.startsWith('0x', j)) {
    j += 2;
    while (/[0-9a-fA-F_]/.test(text[j])) j++;
    return [i, j];
  }
  if (text.startsWith('0b', j)) {
    j += 2;
    while (/[01_]/.test(text[j])) j++;
    return [i, j];
  }
  if (text.startsWith('0o', j)) {
    j += 2;
    while (/[0-7_]/.test(text[j])) j++;
    return [i, j];
  }
  while (/[0-9_]/.test(text[j])) j++;
  if (text[j] === '.' && /[0-9]/.test(text[j + 1] || '')) {
    j++;
    while (/[0-9_]/.test(text[j])) j++;
  }
  if ((text[j] || '').toLowerCase() === 'e') {
    let k = j + 1;
    if (text[k] === '+' || text[k] === '-') k++;
    if (/[0-9]/.test(text[k] || '')) {
      j = k + 1;
      while (/[0-9_]/.test(text[j])) j++;
    }
  }
  while (/[a-zA-Z]/.test(text[j] || '')) j++; // suffixes
  return [i, j];
}

/**
 * @param {string} text
 * @param {number} i
 * @returns {number}
 */
export function skipSpace(text, i) {
  while (/\s/.test(text[i] || '')) i++;
  return i;
}

/**
 * @param {string} ch
 * @returns {boolean}
 */
export function isIdentStart(ch) {
  return /[A-Za-z_$]/.test(ch);
}

/**
 * @param {string} ch
 * @returns {boolean}
 */
export function isIdent(ch) {
  return /[\w$-]/.test(ch);
}

const FUNCTION_DECLARATION_KEYWORDS = new Set(['def', 'fn', 'func', 'function']);
const VARIABLE_DECLARATION_KEYWORDS = new Set(['const', 'let', 'mut', 'readonly', 'var']);
const TYPE_DECLARATION_KEYWORDS = new Set([
  'class',
  'enum',
  'implements',
  'interface',
  'namespace',
  'record',
  'struct',
  'trait',
  'type',
]);

function getTokenText(text, token) {
  return text.slice(token.start, token.end);
}

function getNextNonSpaceChar(text, offset) {
  let cursor = offset;
  while (cursor < text.length && /\s/.test(text[cursor])) {
    cursor++;
  }

  return text[cursor] || '';
}

function hasPropertyAccess(text, offset) {
  let cursor = offset - 1;
  while (cursor >= 0 && /\s/.test(text[cursor])) {
    cursor--;
  }

  if (cursor < 0) {
    return false;
  }

  if (text[cursor] === '.') {
    return true;
  }

  return text[cursor] === ':' && text[cursor - 1] === ':';
}

/**
 * Apply lightweight semantic enrichment to identifier tokens.
 * @param {string} text
 * @param {PixHighlighterToken[]} tokens
 * @returns {PixHighlighterToken[]}
 */
export function enrichSemanticTokens(text, tokens) {
  return tokens.map((token, index) => {
    if (token.type !== 'id') {
      return token;
    }

    const prevToken = tokens[index - 1] ?? null;
    const prevText = prevToken ? getTokenText(text, prevToken) : '';
    const nextChar = getNextNonSpaceChar(text, token.end);

    if (TYPE_DECLARATION_KEYWORDS.has(prevText)) {
      return { ...token, type: 'type' };
    }

    if (VARIABLE_DECLARATION_KEYWORDS.has(prevText)) {
      return { ...token, type: nextChar === '(' ? 'fn' : 'var' };
    }

    if (FUNCTION_DECLARATION_KEYWORDS.has(prevText)) {
      return { ...token, type: 'fn' };
    }

    if (prevText === 'new' && nextChar === '(') {
      return { ...token, type: 'type' };
    }

    if (hasPropertyAccess(text, token.start)) {
      return { ...token, type: nextChar === '(' ? 'fn' : 'prop' };
    }

    if (nextChar === '(') {
      return { ...token, type: 'fn' };
    }

    return token;
  });
}
