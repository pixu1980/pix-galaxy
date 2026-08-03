// @ts-check
/**
 * @module pix-vanilla-reactive/types
 * Public type surface for @pix-galaxy/pix-vanilla-reactive.
 *
 * Re-exports the runtime API so the generated `.d.ts` references the core
 * module declarations.
 */

export { Store, STORE_CHANGE_EVENT } from './core/store/index.js';
export {
  deepClone,
  clonePlainValue,
  isObject,
  toPathArray,
  pathToString,
} from './core/store/index.js';
export {
  Signal,
  effect,
  isSignalLike,
  BaseSignal,
  StateSignal,
  ComputedSignal,
  EffectCollector,
  schedule,
  withCollector,
  withoutCollector,
  getCurrentCollector,
  pushCollector,
  popCollector,
} from './core/signals/index.js';
export {
  html,
  render,
  model,
  repeat,
  directive,
  isDirective,
  registerFilter,
  FILTERS,
  utilSlug,
  escapeHtmlText,
  renderInnerTemplate,
  parseExpression,
  evaluateExpression,
  getFromPath,
  parseArg,
  getTemplate,
  TemplateInstance,
  Part,
  AttributePart,
  PropertyPart,
  EventPart,
  ExprPart,
  ForPart,
  IfPart,
  ChildNodePart,
  clearRange,
  moveRangeBefore,
  isRangeBeforeReference,
  normalizeExprValue,
  inferModelProperty,
} from './core/template-engine/index.js';
export { createTickState } from './core/bridge.js';

export {
  DISPOSE,
  ASYNC_DISPOSE,
  HAS_DISPOSE,
  HAS_ASYNC_DISPOSE,
  makeDisposable,
  DisposableStack,
  AsyncDisposableStack,
} from './core/disposable/index.js';

/**
 * @typedef {import('./core/store/_store.js').StoreChangeDetail} StoreChangeDetail
 */

/**
 * @typedef {import('./core/template-engine/_expression-parser.js').ParsedExpression} ParsedExpression
 */

/**
 * @typedef {import('./core/template-engine/_template-helpers.js').Directive} Directive
 */
