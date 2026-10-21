/**
 * Template compiler and instance model.
 *
 * `compile(strings)` turns an `html` template's static parts into a cloneable
 * `<template>` fragment plus an ordered list of part descriptors. Each
 * `TemplateInstance` clones that fragment and binds live parts to it.
 *
 * Syntax handled at compile time:
 *  - `${}` holes → child parts (text position) or attribute/event/property/model
 *    parts (tag position).
 *  - `{{ expr | filter }}` → expression parts (text) or context attribute parts.
 *  - `<for>` / `<if>` / `<switch>` → directive parts.
 *
 * @module core/template-engine/template-instance
 */

import { AttributePart, BooleanAttributePart, ContextAttributePart, ModelPart } from "./_attribute-part.js";
import { ChildNodePart } from "./_child-node-part.js";
import { EventPart } from "./_event-part.js";
import { ExprPart } from "./_expr-part.js";
import { ForPart } from "./_for-part.js";
import { IfPart } from "./_if-part.js";
import { PropertyPart } from "./_property-part.js";
import { SwitchPart } from "./_switch-part.js";

/** @type {WeakMap<TemplateStringsArray, object>} */
const compiledCache = new WeakMap();

/**
 * Walk a root in document order, returning every element/comment/text node.
 *
 * @param {Node} root - Root to walk.
 * @returns {Node[]} Nodes in walker order.
 */
function indexNodes(root) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT,
  );
  const nodes = [];
  let node = walker.nextNode();

  while (node) {
    nodes.push(node);
    node = walker.nextNode();
  }

  return nodes;
}

/**
 * Build the marker-annotated HTML string and record hole positions.
 *
 * @param {ArrayLike<string>} strings - Static string parts.
 * @returns {{ html: string, attrHoles: Array<{ valueIndex: number, elemKey: string, prefix: string, name: string }>, childHoles: Set<number> }} Build result.
 */
function buildHtml(strings) {
  const attrHoles = [];
  const childHoles = new Set();
  let html = "";
  let inTag = false;
  let elemCounter = 0;
  let currentElemKey = null;
  let stripQuote = null;

  for (let i = 0; i < strings.length; i += 1) {
    let chunk = strings[i];

    if (stripQuote && chunk[0] === stripQuote) {
      chunk = chunk.slice(1);
    }

    stripQuote = null;

    for (let k = 0; k < chunk.length; k += 1) {
      const ch = chunk[k];

      if (!inTag && ch === "<") {
        inTag = true;
        currentElemKey = null;
      } else if (inTag && ch === ">") {
        inTag = false;
        currentElemKey = null;
      }

      html += ch;
    }

    if (i >= strings.length - 1) {
      continue;
    }

    if (inTag) {
      const match = html.match(/([.@?]?)([\w:-]+)\s*=\s*(["']?)$/);
      let prefix = "";
      let name = "";

      if (match) {
        prefix = match[1];
        name = match[2];
        html = html.slice(0, match.index);

        if (match[3]) {
          stripQuote = match[3];
        }
      }

      if (currentElemKey === null) {
        currentElemKey = String(elemCounter);
        elemCounter += 1;
        html += ` data-pix-bind="${currentElemKey}"`;
      }

      attrHoles.push({ valueIndex: i, elemKey: currentElemKey, prefix, name });
    } else {
      html += `<!--pix:c:${i}-->`;
      childHoles.add(i);
    }
  }

  return { html, attrHoles, childHoles };
}

/**
 * Extract `<for>` / `<if>` / `<switch>` elements, replacing them with markers.
 *
 * @param {DocumentFragment} content - Template content to transform.
 * @returns {Array<{ kind: string, node: Comment, config: object }>} Directive descriptors.
 */
function extractDirectives(content) {
  const descriptors = [];
  let element = content.querySelector("for, if, switch");

  while (element) {
    const tag = element.tagName.toLowerCase();
    const marker = document.createComment(`pix:${tag}`);
    let config;

    if (tag === "for") {
      config = {
        each: element.getAttribute("each"),
        of: element.getAttribute("of"),
        key: element.getAttribute("key"),
        innerHtml: element.innerHTML,
      };
    } else if (tag === "if") {
      config = { condition: element.getAttribute("condition"), innerHtml: element.innerHTML };
    } else {
      const cases = [];
      let defaultHtml = null;

      for (const child of Array.from(element.children)) {
        const childTag = child.tagName.toLowerCase();

        if (childTag === "case") {
          cases.push({ value: child.getAttribute("value"), innerHtml: child.innerHTML });
        } else if (childTag === "default") {
          defaultHtml = child.innerHTML;
        }
      }

      config = { expr: element.getAttribute("expr"), cases, defaultHtml };
    }

    element.replaceWith(marker);
    descriptors.push({ kind: tag, node: marker, config });
    element = content.querySelector("for, if, switch");
  }

  return descriptors;
}

/**
 * Split `{{ }}` expressions found in text nodes into markers.
 *
 * @param {DocumentFragment} content - Template content to transform.
 * @returns {Array<{ kind: "expr", node: Comment, expr: string }>} Expression descriptors.
 */
function extractTextExpressions(content) {
  const descriptors = [];
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node = walker.nextNode();

  while (node) {
    textNodes.push(node);
    node = walker.nextNode();
  }

  for (const textNode of textNodes) {
    const value = textNode.nodeValue;

    if (!value.includes("{{")) {
      continue;
    }

    const fragment = document.createDocumentFragment();
    const regex = /\{\{([\s\S]+?)\}\}/g;
    let lastIndex = 0;
    let match = regex.exec(value);

    while (match) {
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(value.slice(lastIndex, match.index)));
      }

      const marker = document.createComment("pix:e");

      fragment.appendChild(marker);
      descriptors.push({ kind: "expr", node: marker, expr: match[1].trim() });
      lastIndex = regex.lastIndex;
      match = regex.exec(value);
    }

    if (lastIndex < value.length) {
      fragment.appendChild(document.createTextNode(value.slice(lastIndex)));
    }

    textNode.replaceWith(fragment);
  }

  return descriptors;
}

/**
 * Record attributes whose values contain `{{ }}` context expressions.
 *
 * @param {DocumentFragment} content - Template content to transform.
 * @returns {Array<{ kind: "ctxAttr", node: Element, name: string, template: string }>} Context-attribute descriptors.
 */
function extractContextAttributes(content) {
  const descriptors = [];

  for (const element of Array.from(content.querySelectorAll("*"))) {
    for (const attr of Array.from(element.attributes)) {
      if (attr.value.includes("{{")) {
        descriptors.push({ kind: "ctxAttr", node: element, name: attr.name, template: attr.value });
        element.setAttribute(attr.name, "");
      }
    }
  }

  return descriptors;
}

/**
 * Collect `${}` child-hole markers.
 *
 * @param {DocumentFragment} content - Template content.
 * @returns {Array<{ kind: "child", node: Comment, valueIndex: number }>} Child descriptors.
 */
function collectChildHoles(content) {
  const descriptors = [];
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_COMMENT);
  let node = walker.nextNode();

  while (node) {
    const match = node.nodeValue.match(/^pix:c:(\d+)$/);

    if (match) {
      descriptors.push({ kind: "child", node, valueIndex: Number(match[1]) });
    }

    node = walker.nextNode();
  }

  return descriptors;
}

/**
 * Bind recorded attribute holes to their marked elements.
 *
 * @param {DocumentFragment} content - Template content.
 * @param {Array<{ valueIndex: number, elemKey: string, prefix: string, name: string }>} attrHoles - Attribute holes from `buildHtml`.
 * @returns {Array<{ kind: "attr", node: Element, valueIndex: number, prefix: string, name: string }>} Attribute descriptors.
 */
function bindAttributeHoles(content, attrHoles) {
  const byKey = new Map();

  for (const element of Array.from(content.querySelectorAll("[data-pix-bind]"))) {
    byKey.set(element.getAttribute("data-pix-bind"), element);
  }

  const descriptors = attrHoles.map((hole) => ({
    kind: "attr",
    node: byKey.get(hole.elemKey),
    valueIndex: hole.valueIndex,
    prefix: hole.prefix,
    name: hole.name,
  }));

  for (const element of byKey.values()) {
    element.removeAttribute("data-pix-bind");
  }

  return descriptors;
}

/**
 * Compile an `html` template's static strings into a reusable descriptor.
 *
 * @param {ArrayLike<string>} strings - Static string parts.
 * @returns {{ content: DocumentFragment, descriptors: object[] }} Compiled template.
 */
export function compile(strings) {
  const { html, attrHoles } = buildHtml(strings);
  const template = document.createElement("template");

  template.innerHTML = html;

  const content = template.content;
  const directives = extractDirectives(content);
  const expressions = extractTextExpressions(content);
  const contextAttrs = extractContextAttributes(content);
  const childHoles = collectChildHoles(content);
  const attrs = bindAttributeHoles(content, attrHoles);
  const descriptors = [...childHoles, ...attrs, ...expressions, ...contextAttrs, ...directives];
  const nodes = indexNodes(content);
  const indexOf = new Map();

  nodes.forEach((node, index) => indexOf.set(node, index));

  for (const descriptor of descriptors) {
    descriptor.nodeIndex = indexOf.get(descriptor.node);
    delete descriptor.node;
  }

  return { content, descriptors };
}

/**
 * Compile with caching keyed on the (stable) strings array identity.
 *
 * @param {TemplateStringsArray} strings - Static string parts.
 * @returns {{ content: DocumentFragment, descriptors: object[] }} Compiled template.
 */
export function getCompiled(strings) {
  let compiled = compiledCache.get(strings);

  if (!compiled) {
    compiled = compile(strings);
    compiledCache.set(strings, compiled);
  }

  return compiled;
}

/** Alias matching the documented API name. */
export const getTemplate = getCompiled;

/**
 * Instantiate a concrete part from its descriptor and target node.
 *
 * @param {object} descriptor - Part descriptor from `compile`.
 * @param {Node} node - Bound node in the cloned fragment.
 * @returns {{ update: (values: unknown[], context: object) => void }} A live part.
 */
function createPart(descriptor, node) {
  switch (descriptor.kind) {
    case "child":
      return new ChildNodePart(node, descriptor.valueIndex);
    case "expr":
      return new ExprPart(node, descriptor.expr);
    case "ctxAttr":
      return new ContextAttributePart(node, descriptor.name, descriptor.template);
    case "for":
      return new ForPart(node, descriptor.config);
    case "if":
      return new IfPart(node, descriptor.config);
    case "switch":
      return new SwitchPart(node, descriptor.config);
    case "attr":
    default:
      return createAttributePart(descriptor, node);
  }
}

/**
 * Instantiate the right attribute-family part for a `${}` attribute hole.
 *
 * @param {{ prefix: string, name: string, valueIndex: number }} descriptor - Attribute descriptor.
 * @param {Element} node - Target element.
 * @returns {object} A live attribute part.
 */
function createAttributePart(descriptor, node) {
  const { prefix, name, valueIndex } = descriptor;

  if (prefix === "@") {
    return new EventPart(node, name, valueIndex);
  }

  if (prefix === ".") {
    return new PropertyPart(node, name, valueIndex);
  }

  if (prefix === "?") {
    return new BooleanAttributePart(node, name, valueIndex);
  }

  if (name === "model") {
    return new ModelPart(node, valueIndex);
  }

  return new AttributePart(node, name, valueIndex);
}

/**
 * A live, updatable clone of a compiled template.
 */
export class TemplateInstance {
  /**
   * @param {{ content: DocumentFragment, descriptors: object[] }} compiled - Compiled template.
   */
  constructor(compiled) {
    /** @type {DocumentFragment} */
    this.fragment = compiled.content.cloneNode(true);

    const nodes = indexNodes(this.fragment);

    /** @type {Array<{ update: (values: unknown[], context: object) => void }>} */
    this.parts = compiled.descriptors.map((descriptor) => createPart(descriptor, nodes[descriptor.nodeIndex]));
  }

  /**
   * Push new values and context through every part.
   *
   * @param {unknown[]} values - Interpolated `${}` values.
   * @param {object} context - Data context for `{{ }}` expressions.
   * @returns {void}
   */
  update(values, context) {
    for (const part of this.parts) {
      part.update(values, context);
    }
  }
}
