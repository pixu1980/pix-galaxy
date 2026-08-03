// @ts-check
/**
 * @module core/index
 * Core unified exports: signals, store, template engine and the store↔signal
 * bridge.
 */

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
} from './signals/index.js';

export {
  Store,
  STORE_CHANGE_EVENT,
  deepClone,
  clonePlainValue,
  isObject,
  toPathArray,
  pathToString,
} from './store/index.js';

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
} from './template-engine/index.js';

export { createTickState } from './bridge.js';

export {
  DISPOSE,
  ASYNC_DISPOSE,
  HAS_DISPOSE,
  HAS_ASYNC_DISPOSE,
  makeDisposable,
  DisposableStack,
  AsyncDisposableStack,
} from './disposable/index.js';
