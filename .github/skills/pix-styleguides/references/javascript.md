# JavaScript Style Guide and Standards

## General

* Prefer `const` and `let` over `var`.
* Use `const` and immutability as much as possible. Use `const` until your code really requires a `let`, and forget the `var` instruction.
* Favor pure functions for core logic.
* Prefer pure functions, ensure functions do not change data they are called with or data in the scope where they are created.
* Keep functions small and focused.
* Functions and methods should do one thing only.

## Naming and conventions

* Use `camelCase` for variables, functions, properties, everything except class names.
* Use PascalCase for class names.
* Avoid numbers in names, let numbers do the numbers.
* Don't be lazy when naming things, put effort into naming. If it is hard to name you probably gave it extra responsibility or do not understand what it is. Give it at least a 3 letter name with meaning.

```js
class ClassName extends BaseClassName {
  propertyWithStringValue: '';

  constructor() {

  }

  methodName(argOne = false, argTwo = '') {
    const localScopeVariable = 0;

    ...
  }

  // please: don't use numbers in names, let numbers do the numbers
  // the code below is: NO BUENO!
  // methodName2(arg1 = false, arg2 = '') {
  //   const localScopeVariable = 0;
  //
  //  ...
  // }
}
```

## Strict mode

* Always keep "use strict" on.
* Add it as first line of every JS or TS file in the codebase, or to functions if needed, to surface errors that would otherwise happen silently.

```js
// add this as first line of every js or ts file in the codebase.
'use strict';
```

## Dangerous features

* Never use `eval`. It's not necessary, it's dangerous, and it sucks ;-)

```js
// this is NO BUENO!
eval(anythingYouWant);
```

* Don't take advantage of weird JavaScript "features", such as:

  * updating array length property
  * using the "with" keyword
  * using the void keyword
  * updating native Object prototypes like Date, Array, Object, etc. (well there are ways to "safely extend" native Object prototypes which are well accepted)
  * passing a string to setTimeout and setInterval

## Functions and declarations

* Use function expressions instead of function declarations unless you want to take advantage of function behavior and properties.
* Function declarations are hoisted and can introduce weird, non-obvious behavior. Make it clear where functions come from, and place them before use.

```js
// prefer this
export const traditionalFunction = function (arg1, arg2) {
  return arg1 + arg2;
};

// instead of this
export function traditionalFn(arg1, arg2) {
  return arg1 + arg2;
}

const traditionalFunction = traditionalFn;
```

* Prefer arrow functions, they avoid needing to bind/apply/pass `this` to access it inside the function.
* Prefer the "rest" operator over "arguments". The "rest" operator works with arrow functions where "arguments" are not available.

```js
// prefer this
const arrowFunction = (arg1, arg2) => arg1 + arg2;

// instead of this
const traditionalFunction = function (arg1, arg2) {
  return arg1 + arg2;
};
```

## Classes and instantiation

* Prefer `class` over constructor (prototype) functions. Reaching for prototypes is a sign you should use `class`.
* Avoid the "new" keyword, except for class and constructor functions instancing. Using "new" elsewhere can slow compilers down.

## Data handling

* Use destructuring.
* Only work with the data you need. Extract and clean up only the data you need from APIs before storing or operating on it.
* Always use `===`. Triple equals checks value and type and avoids undesirable effects.
* Avoid global variables, unless you are creating a library/framework. Globals can collide and are hard to debug.
* Wrap loose declarations in blocks to avoid name clashes and unintended access.
* Organize your declarations consistently. Put declarations on top starting with constants down to variables. Make constants all uppercase to signal they are constants and discourage mutation.
* Avoid unnecessary declarations. Declare only when strictly necessary, too many declarations may hint at weak design.
* Use default values when possible. Defaults are more elegant than throwing errors because something wasn't provided. If you want to catch missing values, make them required and throw an error when no value is provided.
* Never initialize things with "undefined". Since JS already makes things undefined, assigning it makes debugging harder. Prefer setting to "null" instead.
* Always initialize your declarations, do not leave them without a value just because they are undefined by default.

## Control flow

* Prefer short-circuit expressions over trivial `if` blocks when possible:

  * ✅ `condition && doThing()`
  * ✅ `condition || fallback()`
  * ❌ `if (condition) { doThing(); }`
* Use early returns to reduce nesting.
* Keep ternaries simple. Worst case scenario is two nested ternaries. Anything longer should be an if statement or switch for readability and debugging.
* Always have a default case for switch statements. Don't leave switches without a default, something can go wrong and you want to catch it.

### Blank lines around control structures

* Add a blank line before `if`, `for`, `while`, `switch`, `try` blocks when preceded by other statements, but NOT if the structures are at the beginning of the scope.
* Add a blank line after the closing brace of control structures when followed by other statements, but NOT if they are at the end of the scope.

```js
// Preferred: blank lines around control structures
const items = getItems();

if (items.length === 0) {
  return;
}

items.forEach(item => process(item));

// Avoid: no separation
const items = getItems();
if (items.length === 0) {
  return;
}
items.forEach(item => process(item));
```

### Short-circuit for registration and guards

* Use `&&` short-circuit for conditional registration and guards:

```js
// Preferred: short-circuit for custom element registration
!customElements.get('my-component') && customElements.define('my-component', MyComponent);

// Preferred: short-circuit for optional chaining guards
element && element.remove();
callback?.();
```

## Optional chaining and nullish coalescing

* Simplify with optional chaining, use the `?` operator to remove nested checks.
* Watch out for "undefined" and "null" with the `??` operator. The null-coalescing operator ensures null and undefined values are not picked, and is useful for fallbacks.

```js
const fallbackFnExample = (arg) => {
  // this ensures an empty string fallback value to the unknown value param
  const fallbackArg = arg ?? '';

  return fallbackArg;
};

const fallbackFnExampleShorthand = (arg) => arg ?? '';
```

## Async

* Prefer promises over callbacks. Promises are easy to use, anything with a callback can be promisified. With promises and async/await, async code becomes easier to read, and can speed things up since JS is single-threaded.
* Always `try...catch` JSON methods. Don't trust data passed to `JSON.stringify` and `JSON.parse`, catch errors so they do not break your code.

## Loops and iteration

* For loops > `.forEach` sometimes. Don't change things into an array just to `.forEach` it. For loops are faster and allow `continue` and `break`.
* Use `for...in` and `for...of` appropriately:

  * `for...of` iterates values of arrays, strings, Map, Set, etc.
  * Avoid `for...in` for looping, it is slow and iterates over prototype keys.
* No need to optimize for loops, compilers already optimize them.
* Avoid nesting or chaining loops when possible. Chaining iteration methods or nesting loops increases complexity and can slow things down as data grows. Assess looping strategy to avoid unnecessary loops or loops that can be combined.

## Strings

* Prefer template strings. They make value injection easy and preserve formatting.

## Readability, style, and tooling

* Lint your code and have a consistent style. Linting ensures consistent look and prevents weird patterns.
* Use 2-space indentation.
* Use trailing commas where allowed by the project style.
* Add semicolons, ALWAYS. Compilers add them, but tools like Babel may misread code and create bugs. Always add semicolons.
* Readable > performance unless you need performance. Only sacrifice readability for performance when you are truly desperate at the code level.
* Avoid weird unreadable hacks. They are often non-conventional and non-obvious. Follow tool guidelines for performance, hacking is the last alternative.

## Truthy, falsy, and conditionals

* Be careful with "truthy" and "falsy" checks. Don't rely on them, be specific in checks to avoid unexpected bugs.
* Prefer ternary over logical `||` and `&&` checks. The operators evaluate truthiness which may lead to undesired results. Don't rely on them for weird logical condition checks, they are not readable and hard to understand.

## Types and safety

* Use TypeScript. It can help deliver better code. It takes time to learn but pays off in the long run.
* Be careful with automatic type conversions. JS converts types on the fly and may not match expectations. Truthy becomes true and falsy becomes false, math between number and string may work or concatenate, numbers often turn falsy into zero and truthy into one.
* Never trust data you don't create. For user or API data, verify type and format before operating. Be careful and strict when integrating external code, implement basic anti XSS attacks workarounds.

## DOM and Custom Elements

* Attach listeners in `connectedCallback()` and clean up in `disconnectedCallback()`.
* Keep rendering logic in `render()` and make it idempotent.

### Import order

* Organize imports in a consistent order with blank lines separating groups:

1. Services and utilities (local modules)
2. Bundle-text imports (CSS and HTML templates)
3. Side-effect imports (component registrations)
4. Data imports (JSON, translations)

```js
// 1. Services and utilities
import registerStylesheet from '../../services/stylesheetService.js';
import pixTemplateEngine from '../../services/templateEngine.js';
import { i18n } from '../../services/i18nService.js';

// 2. Bundle-text imports (blank line before)
import * as styles from 'bundle-text:./MyComponent.css';
import * as template from 'bundle-text:./MyComponent.template.html';

// 3. Side-effect imports (blank line before)
import '../OtherComponent/OtherComponent.js';

// 4. Data imports (blank line before)
import enTranslations from 'bundle-text:../../../assets/i18n/en.json';
```

### Static initialization block pattern

* Use static initialization blocks for stylesheet registration and custom element definition:

```js
class MyComponent extends HTMLElement {
  static hasRegisteredStyle = false;

  static {
    if (!MyComponent.hasRegisteredStyle) {
      registerStylesheet(styles);
      MyComponent.hasRegisteredStyle = true;
    }

    !customElements.get('my-component') && customElements.define('my-component', MyComponent);
  }
}
```

## Global access

* Prefer `globalThis` for global access, so code works in Web Workers and backend Node.

## Regex

* Learn regex and use it to manipulate strings instead of weird index-based manipulation. Regex allows complex patterns in one line.

  1. the regex engine is quite faster than any iterative pattern you could implement
  2. the regex includes also logics and allows to avoid lots of conditional and iterative code
  3. by using regex the original string will ever stay as it is

## IIFE and utilities

* IIFE is a good way to execute things early to set up before the rest of the code runs. It can also initialize small libraries with a simple API that encapsulates complexity and exposes an object to interact with.
* Avoid repeating yourself with utilities. Turn repeated logic into small generic functions that can be reused, tested, and reused later on.

## Comments

* Add meaningful comments for non obvious things only. Comment when something is uncommon, weird, or requires context.
* Add comments for hacks or areas that may need improvements later so the next person knows why.
* Add comments in third party modules and modules in your codebase to explain architecture and intention.

## Libraries and frameworks

* Understand JavaScript but build with libraries and frameworks. Invest time in understanding JS, but build with tools like React, Angular or Vue to avoid common mistakes. Follow their guidelines as they guard against mistakes and best practices.

## Testing

* Add unit tests. Tests help keep code as error-free as possible. Node's native test module is a good simple option, and there are other simple options too.

## Project scaffolding reminders

* Keep the zero-runtime-dependencies promise. Do not pull in libraries just for convenience when the built-in APIs can handle the task. Prefers native modules, HTML Imports, and Custom Elements without shadow DOM.
* Keep each custom element self-contained: render markup in `render()`, set up listeners in `connectedCallback()`, and clean them up in `disconnectedCallback()` to prevent leaks during hot reloads.
* Align any new files with the `src/components`, `src/scripts`, and entry `src/index.js` layout so Parcel can bundle everything without special config. Export pure logic from `src/scripts` and wire it from the components.
* Document the purpose of each helper/service inside `src/scripts/` using short JSDoc comments, since the project enforces manual inspection over runtime typings.

## Data validation examples

Prefer explicit guards for untrusted inputs:

```js
export const normalizeItems = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item) => typeof item === 'string' && item.length > 0);
};
```

## Error handling examples

```js
export const parseJsonSafe = (raw, fallback = null) => {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};
```

## Custom element lifecycle example

```js
// @ts-check
'use strict';

export class ExampleCard extends HTMLElement {
  #handleClick = () => {
    this.toggleAttribute('active');
  };

  connectedCallback() {
    this.render();
    this.querySelector('button')?.addEventListener('click', this.#handleClick);
  }

  disconnectedCallback() {
    this.querySelector('button')?.removeEventListener('click', this.#handleClick);
  }

  render() {
    this.innerHTML = '<button type="button">Toggle</button>';
  }
}
```

## Review checklist example

1. No `var`, `eval`, or implicit globals.
2. Functions are small and single-purpose.
3. Input data is validated before use.
4. `try...catch` guards unsafe parsing or external boundaries.
5. Custom elements clean up listeners in `disconnectedCallback()`.
