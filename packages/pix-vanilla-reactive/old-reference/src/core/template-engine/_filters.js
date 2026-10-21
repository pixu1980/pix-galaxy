/**
 * Filter registry used by `{{ expr | filter }}` expressions.
 *
 * @module core/template-engine/filters
 */

import { rawHtml } from "./_template-helpers.js";

/** @type {Record<string, (value: unknown, ...args: unknown[]) => unknown>} */
export const FILTERS = Object.create(null);

/**
 * Register (or override) a named filter.
 *
 * @param {string} name - Filter name.
 * @param {(value: unknown, ...args: unknown[]) => unknown} fn - Filter implementation.
 * @returns {void}
 */
export function registerFilter(name, fn) {
  FILTERS[name] = fn;
}

/**
 * Apply a named filter to a value.
 *
 * @param {string} name - Filter name.
 * @param {unknown} value - Input value.
 * @param {unknown[]} args - Filter arguments.
 * @returns {unknown} Filtered value.
 */
export function applyFilter(name, value, args) {
  const fn = FILTERS[name];

  if (!fn) {
    throw new Error(`Unknown filter: ${name}`);
  }

  return fn(value, ...args);
}

const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

registerFilter("upper", (v) => String(v ?? "").toUpperCase());
registerFilter("lower", (v) => String(v ?? "").toLowerCase());
registerFilter("capitalize", (v) => {
  const s = String(v ?? "");

  return s.charAt(0).toUpperCase() + s.slice(1);
});
registerFilter("trim", (v) => String(v ?? "").trim());
registerFilter("slugify", (v) =>
  String(v ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, ""),
);
registerFilter("slug", (v) => FILTERS.slugify(v));
registerFilter("escapeHtml", (v) => String(v ?? "").replace(/[&<>"']/g, (ch) => escapeMap[ch]));
registerFilter("striptags", (v) => String(v ?? "").replace(/<[^>]*>/g, ""));
registerFilter("raw", (v) => rawHtml(String(v ?? "")));
registerFilter("json", (v) => JSON.stringify(v));
registerFilter("default", (v, fallback) => (v === undefined || v === null || v === "" ? fallback : v));
registerFilter("truncate", (v, length = 50, suffix = "…") => {
  const s = String(v ?? "");

  return s.length > Number(length) ? s.slice(0, Number(length)) + suffix : s;
});
registerFilter("length", (v) => (v == null ? 0 : v.length ?? 0));
registerFilter("first", (v) => (Array.isArray(v) ? v[0] : String(v ?? "")[0]));
registerFilter("last", (v) => (Array.isArray(v) ? v[v.length - 1] : String(v ?? "").slice(-1)));
registerFilter("join", (v, separator = ", ") => (Array.isArray(v) ? v.join(separator) : String(v ?? "")));
registerFilter("tagLabel", (v) => String(v ?? "").replace(/^#/, ""));
registerFilter("tagHref", (v) => `#${FILTERS.slugify(v)}`);
registerFilter("date", (v, locale = "en-US") => {
  const d = v instanceof Date ? v : new Date(v);

  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(locale);
});
registerFilter("timeAgo", (v) => {
  const then = (v instanceof Date ? v : new Date(v)).getTime();

  if (Number.isNaN(then)) {
    return "";
  }

  const seconds = Math.round((Date.now() - then) / 1000);

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m ago`;
  }

  if (seconds < 86400) {
    return `${Math.round(seconds / 3600)}h ago`;
  }

  return `${Math.round(seconds / 86400)}d ago`;
});
registerFilter("urlencode", (v) => encodeURIComponent(String(v ?? "")));
registerFilter("sortBy", (v, key) => {
  if (!Array.isArray(v)) {
    return v;
  }

  return [...v].sort((a, b) => {
    const av = key ? a[key] : a;
    const bv = key ? b[key] : b;

    return av < bv ? -1 : av > bv ? 1 : 0;
  });
});
