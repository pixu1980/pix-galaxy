# CSS Style Guide and Standards

## Core mindset

- Mastering CSS is a continuous process, it requires practice and repetition.
- Treat CSS as a creative tool for building identity, appeal, and consistency, without sacrificing pragmatism, semantics, or accessibility.
- Make learning a habit, think in HTML plus CSS.

## Architecture and organization

- Write styles in pure native vanilla CSS.
- Use `@layer` to structure the cascade and keep conflicts predictable. Organize at least: base, components, utilities.
- Use CSS custom properties for colors, spacing, typography, and other reusable decisions.
- Keep selectors shallow and scoped to components.
- Avoid `!important` unless absolutely necessary, needing it usually indicates a cascade, specificity, or third party override problem.
- Keep CSS modular: each CSS file should stay roughly between 50 and 100 lines. If it grows beyond that, split into sub files and `@import` them from an entry file.
- Separate global vs local styles. Keep global rules together, then component and section styles.

```css
@layer base, components, utilities;

@layer base {
  :root {
    --color-text: #111;
    --space-2: 0.8rem;
  }
}

@layer components {
  button {
    color: var(--color-text);
    padding: var(--space-2);
  }
}
```

## Naming and conventions

- Prefer low specificity selectors, use elements or attributes when reasonable.
- Strongly prefer element selectors or attribute selectors over class selectors.
- Avoid class selectors by default. Use class selectors only when element or attribute selectors cannot express the target safely.
- Avoid styling by id by default. Use ids only for truly unique elements, linking targets, or when required by the use case. Avoid ids inside reusable components.

### CSS custom property naming

- Custom properties must start with `--`.
- Use a structured naming model:
  - target name is the base concept
  - optional declination or variant
  - optional state
  - final segment is the specific property meaning

```css
.selector {
  --action-button--border: 1px solid #fff;
  --action-button--background-color: rgba(50, 50, 50, 0.8);

  --action-button--hover--border: 1px solid #eee;
  --action-button--hover--background-color: rgba(50, 50, 50, 0.5);

  --action-button--secondary--border: 1px solid #eee;
  --action-button--secondary--background-color: rgba(40, 40, 40, 0.5);

  --action-button--secondary--hover--border: 1px solid #fff;
  --action-button--secondary--hover--background-color: rgba(40, 40, 40, 0.8);
}
```

### Selector strategy

- Default selector order: element selector first, attribute selector second, class selector last resort.

```css
button {
  [variant='secondary'] {
  }

  [size='lg'] {
  }
}
```

## Units and sizing strategy

- Use relative units by default, prefer rem and em for typography and spacing when possible.

- Use viewport units for viewport related sizing: `vh`, `vw`, `vmin`, `vmax`.

- Use `ch` for typographic line length and horizontal sizing tied to text.

- Use `lh` when line height driven sizing is desired.

- Use `deg`, `rad`, `turn` for rotation.

- Use `ms` for animation and transition durations and delays.

- Use `px` as a last resort, mainly for borders where you do not want zoom to scale thickness.

- Set the root to 0.625em to make rem math base-10, keep body at 16px for accessibility by using `1.6rem`.

```css
html {
  font-size: 0.625em;
}

body {
  font-size: 1.6rem;
}

button {
  width: 15rem;
  height: 2rem;
  border: 1px solid black;
}

h1,
h2,
h3,
h4,
h5 {
  margin: 3rem 0 1.4rem;
  font-family: sans-serif;
  font-weight: 400;
  line-height: 1.3;
}

h1 {
  font-size: 3em;
}
h2 {
  font-size: 2.5em;
}
h3 {
  font-size: 2em;
}
h4 {
  font-size: 1.5em;
}
h5 {
  font-size: 1.25em;
}

small {
  font-size: 0.8em;
}

p {
  max-inline-size: 45ch;
}

.diamond {
  transform: rotate(45deg);
}

.motion-item {
  transition: all 350ms ease-in-out;
}
```

## Property ordering inside selectors

- Keep declarations ordered to improve readability and consistency, use this hierarchy (NOTE: THIS IS FUNDAMENTAL FOR EVERY SINGLE CSS FILE):

1. custom properties
2. positioning
3. layout and display, including flex and grid
4. visibility
5. box model
6. colors and backgrounds
7. typography
8. transforms and motion
9. behavior and helpers

```css
.class-selector-example,
element-selector-example {
  --example: 1;
  --border-color: #fff;

  position: absolute;
  inset: 0 0 0 0;

  display: flex;
  justify-self: unset;
  grid-template-areas:
    'header header'
    'aside main'
    'footer footer';
  grid-template-columns: 30rem 1fr;
  gap: 1rem;

  visibility: visible;
  opacity: 1;

  box-sizing: border-box;
  width: 10rem;
  aspect-ratio: 16 / 9;
  padding: 1rem;
  border: 0.1rem solid black;
  border-radius: 0.4rem;
  margin: 1rem;
  outline: 0;

  color: white;
  background-color: black;
  background-image: url();
  box-shadow: rgba(50, 50, 50, 1);
  filter: drop-shadow();

  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  font-weight: 700;
  line-height: normal;
  white-space: nowrap;
  text-align: center;
  text-shadow: none;
  vertical-align: middle;

  transform: translate();
  transition:
    opacity 300ms ease-in,
    width 500ms linear;
  will-change: opacity, width;
  animation: test 300ms forwards alternate-reverse;

  cursor: pointer;
  appearance: none;
}
```

## Selector structure and nesting order

When authoring nested rules, keep a consistent inner ordering:

1. base declarations using the property hierarchy
2. pseudo elements
3. variants driven by attributes (class only as last resort)
4. pseudo classes
5. media queries
6. children and combinators

### CSS nesting best practices

- Use native CSS nesting to reduce repetition and improve scoping.
- Omit the `&` parent selector where possible for cleaner syntax:

```css
/* Preferred: no & needed when nesting descendants */
article {
  color: var(--color--neutral--text);

  p {
    padding: var(--space--sm);
  }

  h2 {
    font-size: var(--font-size--lg);
  }
}

/* Use & only when required: pseudo-classes, pseudo-elements, attribute selectors, combining selectors */
button {
  background: var(--color--primary--500);

  &:hover {
    background: var(--color--primary--hover--500);
  }

  &::before {
    content: '';
  }

  &[aria-disabled='true'] {
    opacity: 0.5;
  }
}
```

### Custom Element selectors

- Prefer element selectors (the custom element tag name) over class selectors for the root of custom elements:

```css
/* Preferred: element selector for custom element root */
@layer components {
  my-component {
    display: block;
    padding: var(--space--gutter);

    h2 {
      font-size: var(--font-size--lg);
    }

    [data-role='subtitle'] {
      color: var(--color--neutral--text-muted);
    }
  }
}

/* Avoid: class selector when element selector is clearer */
@layer components {
  .my-component {
    display: block;
  }
}
```

### Tokenize all values

- Convert all literal values to CSS custom properties:

```css
/* Preferred: all values are tokens */
.card {
  padding: var(--space--gutter);
  gap: var(--gap--sm);
  font-size: var(--font-size--base);
  font-weight: var(--font-weight--semibold);
  border: var(--border--width) var(--border--style) var(--color--neutral--border);
  border-radius: var(--radius--card);
}

/* Avoid: hard-coded values */
.card {
  padding: 1.5rem;
  gap: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid #dee2e6;
  border-radius: 6px;
}
```

```css
:root {
  --border-radius: 5px;
}

[data-component='example'],
element-selector--example {
  --var--example: 1;

  position: absolute;
  inset: 0;
  z-index: 1;

  display: flex;
  place-content: center;
  place-items: center;
  gap: 1rem;

  opacity: 1;
  visibility: visible;

  box-sizing: border-box;
  width: 10rem;
  aspect-ratio: 16 / 9;
  padding: 1rem;
  border: 0.1rem solid black;
  border-radius: 0.4rem;
  margin: 1rem;
  outline: 0.3rem solid black;
  outline-offset: 0.3rem;

  color: white;
  background-color: black;

  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  font-weight: 700;

  transition:
    opacity 300ms ease-in,
    width 500ms linear;

  appearance: none;
  cursor: pointer;
  pointer-event: none;

  &::after {
  }

  &.error {
    color: red;
  }

  &[aria-hidden='true'] {
    display: none;
  }

  &:hover {
  }

  @media screen and (width >= 1024px) {
  }

  span {
  }

  > element {
  }
}
```

## Cascade and specificity rules

- The cascade is a core tool, understand it instead of fighting it.
- Keep selectors shallow, avoid deep chains like `nav ul li a` unless the markup truly guarantees uniqueness.
- Remember browsers match selectors from right to left, deeply nested selectors cost more and are harder to override.
- Avoid inline styles, they are hard to override and often force `!important`.
- Do not rely on color keywords like `red` when consistency matters, prefer hex and color functions.

## Formatting rules

- Use 2-space indentation.
- If multiple selectors share the same block, put one selector per line.
- Combine selectors with identical declarations using comma separated selector lists.
- Prefer shorthand properties when it improves maintenance.

## Dependency strategy

- Prefer pure HTML and CSS first. Reach for JS mainly for triggers and side effects, not for styling.
- Avoid third party CSS dependencies by default. Dependencies can add weight, security risk, compatibility issues, accessibility issues, and rigid DOM constraints.
- If you must override third party styles, keep overrides in a separate file so removal is easy later.

## HTML choices that improve CSS

- Keep HTML semantic, use CSS for styling.
- Author HTML with content in mind, not styling, only adjust structure for styling when necessary and without breaking semantics or accessibility.
- Keep CSS ordering aligned with markup order to improve readability and reduce specificity mistakes.
- Avoid ids inside reusable components. Prefer `name` over id in forms when possible.

## Methodologies and internal structure

- Do not use CSS naming standards/frameworks such as BEM, OOCSS, ITCSS, SMACSS, or CUBE CSS.
- Keep structure native and explicit via semantic HTML, `@layer`, custom properties, and low-specificity selectors.

## Quality gates and maintenance

- Comment non-obvious rules, hacks, and architectural intent. Comment why, not what.
- Lint for consistency, use Stylelint or equivalent.
- Validate CSS when needed, use a CSS validator.
- Minify before shipping.
- Avoid hard to maintain hacks, if unavoidable, isolate them in a dedicated file.
- Remove unused CSS when possible, ship only what is used.

## Box model and layout fundamentals

- Use border-box globally.

```css
*,
*::after,
*::before {
  box-sizing: border-box;
}
```

- Let the parent handle layout concerns like spacing and positioning for flow components. Components should avoid embedding margin and positional layout rules unless the component is meant to be layout aware.
- Master selectors, combinators, pseudo classes, and pseudo elements, they are essential for clean component styling.
- Master display and positioning, they remain common sources of complexity.

## Responsive and fluid design

- Design for fluidity or responsiveness by default. Browsers run on many screens and sizes.
- Let content drive sizing. Prefer padding plus max sizes over hard coded width and height unless the design requires strict sizing.
- Avoid constant self-overrides in your own code. Repeatedly undoing your own rules indicates missing planning for variants.
- Place media queries as selector variations, and ensure they appear after base rules in the built output.

## Color rules

- Define variables for every palette color.
- Use numeric weights for palette steps, lower is brighter and higher is darker, for example `--color--primary--400` vs `--color--primary--800`.

## Typography rules

- Treat typography as a first class system, most of the UI is text.
- Use a font loading strategy that avoids unnecessary blocking, place `@font-face` rules at the top if used.
- Avoid too many font files, it increases load and visual instability.
- Use CSS to transform casing and formatting rather than hardcoding text casing in HTML, this also helps internationalization.

## Media rules

- Use `<figure>` for composed images and shapes when appropriate.
- Prefer responsive media handled by HTML when possible instead of media query hacks.
- Customize native media players or embeds when possible instead of pulling a library.

## Motion and performance

- Prefer animating properties that avoid layout recalculation when possible.
- Minimize layout modifying animations like width, height, top, left, margin, order when performance matters.
- Use `will-change` only as a last resort when you have measured a real issue.
- Keep `@keyframes` definitions and motion declarations late in the cascade if it helps avoid load-time surprises.
- When using transitions, list the properties you actually transition. Avoid `transition: all` when possible.

## Accessibility rules

- Do not remove focus outlines. Style them instead, focus visibility is critical for keyboard and assistive navigation.
- Disable `pointer-events` only when necessary, do not default to blocking interaction.

## Tooling and scaling options

- A preprocessor can help modularity and reuse, but it is optional, the output remains CSS.
- A design system helps define tokens, components, and global rules so large changes are easier later.
- A postprocessor can help with prefixing, minification, future CSS syntax, and policy enforcement.

## Baseline API policy

- Default to CSS APIs that are baseline widely available.
- If user asks for newer APIs, document fallback strategy in code comments or implementation notes.

Example fallback pattern:

```css
button {
  border-radius: var(--radius-md);
}

@supports (color: oklch(50% 0.1 200)) {
  button {
    color: oklch(45% 0.08 260);
  }
}
```

## Animated custom properties with @property

Use typed custom properties for animatable tokenized values.

```css
@property --button-progress {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

button {
  --button-progress: 0%;
  background: linear-gradient(
    90deg,
    var(--color-accent) var(--button-progress),
    var(--color-surface) var(--button-progress)
  );
  transition: --button-progress 240ms ease;
}

button[aria-busy='true'] {
  --button-progress: 100%;
}
```

## Selector decision matrix

- First choice: semantic element selector.
- Second choice: stable attribute selector (`[data-*]`, ARIA state, semantic attributes).
- Last resort: class selector.

Preferred:

```css
button[variant='primary'] {
}

input[type='email'] {
}

dialog[open] {
}
```

Avoid (unless necessary):

```css
.btn-primary {
}
```

## Anti-patterns to avoid

- Deep selector chains that depend on fragile DOM nesting.
- Styling by utility-heavy class composition in component internals.
- Naming standards/frameworks like BEM/SMACSS/OOCSS/ITCSS/CUBE CSS.
- Repeated hard-coded literals when a token should exist.
