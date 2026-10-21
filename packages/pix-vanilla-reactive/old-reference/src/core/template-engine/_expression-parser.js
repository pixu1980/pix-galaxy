/**
 * Evaluator for `{{ expression }}` data expressions.
 *
 * Supported grammar (intentionally small and safe — no `eval`):
 *   expr      := unary (op unary)?  ('|' filter)*
 *   unary     := '!' unary | operand
 *   operand   := literal | path
 *   op        := === !== == != >= <= > <
 *   filter    := name (':' literal)*
 *
 * @module core/template-engine/expression-parser
 */

import { applyFilter } from "./_filters.js";

/**
 * Parse an expression string into a reusable descriptor.
 *
 * The evaluator is string-driven, so this simply trims and returns the raw
 * expression alongside its split filter pipeline.
 *
 * @param {string} source - Raw expression text.
 * @returns {{ base: string, filters: Array<{ name: string, args: string[] }> }} Parsed descriptor.
 */
export function parseExpression(source) {
  const segments = splitTop(source, "|");
  const base = segments[0].trim();
  const filters = segments.slice(1).map((segment) => {
    const parts = splitTop(segment, ":").map((part) => part.trim());

    return { name: parts[0], args: parts.slice(1) };
  });

  return { base, filters };
}

/**
 * Evaluate an expression string against a data context.
 *
 * @param {string} source - Raw expression text.
 * @param {object} context - Data context.
 * @returns {unknown} The evaluated (and filtered) value.
 */
export function evaluateExpression(source, context) {
  const { base, filters } = parseExpression(source);
  let value = evaluateBase(base, context);

  for (const filter of filters) {
    const args = filter.args.map((arg) => evaluateOperand(arg, context));

    value = applyFilter(filter.name, value, args);
  }

  return value;
}

const COMPARATORS = ["===", "!==", "==", "!=", ">=", "<=", ">", "<"];

/**
 * Evaluate the pre-filter portion of an expression (unary + comparison).
 *
 * @param {string} source - Base expression text.
 * @param {object} context - Data context.
 * @returns {unknown} Evaluated value.
 */
function evaluateBase(source, context) {
  const trimmed = source.trim();

  if (trimmed.startsWith("!")) {
    return !evaluateBase(trimmed.slice(1), context);
  }

  for (const op of COMPARATORS) {
    const parts = splitTop(trimmed, op);

    if (parts.length === 2) {
      const left = evaluateOperand(parts[0].trim(), context);
      const right = evaluateOperand(parts[1].trim(), context);

      return compare(op, left, right);
    }
  }

  return evaluateOperand(trimmed, context);
}

/**
 * Apply a comparison operator.
 *
 * @param {string} op - Operator token.
 * @param {unknown} left - Left operand.
 * @param {unknown} right - Right operand.
 * @returns {boolean} Comparison result.
 */
function compare(op, left, right) {
  switch (op) {
    case "===":
      return left === right;
    case "!==":
      return left !== right;
    case "==":
      /* eslint-disable-next-line eqeqeq */
      return left == right;
    case "!=":
      /* eslint-disable-next-line eqeqeq */
      return left != right;
    case ">=":
      return left >= right;
    case "<=":
      return left <= right;
    case ">":
      return left > right;
    case "<":
      return left < right;
    default:
      return false;
  }
}

/**
 * Evaluate a single operand: literal or context path.
 *
 * @param {string} source - Operand text.
 * @param {object} context - Data context.
 * @returns {unknown} Evaluated value.
 */
function evaluateOperand(source, context) {
  const token = source.trim();

  if (token.length === 0) {
    return undefined;
  }

  if (token === "true") {
    return true;
  }

  if (token === "false") {
    return false;
  }

  if (token === "null") {
    return null;
  }

  if (token === "undefined") {
    return undefined;
  }

  if (/^-?\d+(\.\d+)?$/.test(token)) {
    return Number(token);
  }

  if ((token.startsWith("'") && token.endsWith("'")) || (token.startsWith('"') && token.endsWith('"'))) {
    return token.slice(1, -1);
  }

  return resolvePath(token, context);
}

/**
 * Resolve a dotted / bracketed path against the context.
 *
 * @param {string} path - Path expression such as `a.b[0].c`.
 * @param {object} context - Data context.
 * @returns {unknown} Value at the path, or `undefined`.
 */
function resolvePath(path, context) {
  const segments = path
    .replace(/\[(\w+)\]/g, ".$1")
    .split(".")
    .filter((segment) => segment.length > 0);
  let cursor = context;

  for (const segment of segments) {
    if (cursor == null) {
      return undefined;
    }

    cursor = cursor[segment];
  }

  return cursor;
}

/**
 * Split a string on a top-level separator, ignoring separators inside quotes.
 *
 * @param {string} source - Source string.
 * @param {string} separator - Separator token.
 * @returns {string[]} Split segments.
 */
function splitTop(source, separator) {
  const out = [];
  let depth = 0;
  let quote = null;
  let current = "";
  let i = 0;

  while (i < source.length) {
    const ch = source[i];

    if (quote) {
      current += ch;

      if (ch === quote) {
        quote = null;
      }

      i += 1;
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      i += 1;
      continue;
    }

    if (ch === "(" || ch === "[") {
      depth += 1;
    } else if (ch === ")" || ch === "]") {
      depth -= 1;
    }

    if (depth === 0 && source.startsWith(separator, i)) {
      out.push(current);
      current = "";
      i += separator.length;
      continue;
    }

    current += ch;
    i += 1;
  }

  out.push(current);

  return out;
}
