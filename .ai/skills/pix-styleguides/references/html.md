# HTML Style Guide and Standards

## Purpose and non negotiables

* HTML is the backbone of the product. Start from markup when engineering UI and when analyzing use cases.
* A solid HTML structure should reduce CSS and JS complexity.
* Every change must preserve accessibility and responsiveness. If either is broken, the change is not shippable.

## Semantics first

* Use semantic elements before generic containers, for example `header`, `main`, `section`, `article`, `nav`, `footer`, `button`, `label`.
* Prefer native semantics over ARIA. Add ARIA only when native elements cannot express the required meaning or behavior.
* Semantic markup improves readability and maintainability, and improves compatibility with screen readers and crawlers.
* Use MDN as reference for semantic elements.

### Example: semantic structure

Do not replace structural meaning with classed divs.

```html
<div class="header">
  <h1>Logo</h1>
  <div class="nav">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>
</div>
<div class="main">
  <p>
    Curabitur blandit tempus porttitor.
    <br />Aenean lacinia bibendum nulla sed consectetur.
  </p>
</div>
<div class="footer">
  <a href="#">Home</a>
  <a href="#">About</a>
  <a href="#">Contact</a>
</div>
```

Prefer semantic landmarks and meaningful containers.

```html
<header>
  <h1>Logo</h1>
  <nav>
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </nav>
</header>
<main>
  <article>
    <section>
      <p>
        Curabitur blandit tempus porttitor.
        <br />Aenean lacinia bibendum nulla sed consectetur.
      </p>
    </section>
  </article>
  <section>
    <p>
      Curabitur blandit tempus porttitor.
      <br />Aenean lacinia bibendum nulla sed consectetur.
    </p>
  </section>
</main>
<footer>
  <a href="#">Home</a>
  <a href="#">About</a>
  <a href="#">Contact</a>
</footer>
```

## Accessibility essentials

* Associate `label` with its input via `for` and matching `id`.
* Use ARIA only when native semantics are insufficient.
* Keep markup valid and semantic to help assistive tech and validation tooling.

## Typography and document structure

* Use a single `<h1>` per document.
* Maintain heading order without skipping levels. If visual order needs to differ, use CSS to position elements, not incorrect heading levels.
* Use the right inline semantics for emphasis:

  * prefer `<strong>`, `<em>`, `<mark>`
  * treat `<b>` and `<i>` as last resort when no semantic alternative fits

### Headings

Avoid multiple `<h1>`.

```html
<main>
  <h1>Can Coding be fun?</h1>
  <p>The more you code the better you become</p>
  <h1>Coding is fun</h1>
  <p>It is always better when you have fun coding</p>
</main>
```

Prefer one `<h1>` and step headings correctly.

```html
<main>
  <h1>Can coding be fun?</h1>
  <p>The more you code the better you become</p>
  <h2>Coding is fun</h2>
  <p>It is always better when you have fun coding</p>
</main>
```

Avoid skipping levels.

```html
<h1>Coding is fun</h1>
<h3>It is always better when you have fun coding</h3>
<h5>Consistency is Key</h5>
```

Use ordered levels.

```html
<h1>Can coding be fun?</h1>
<h2>The more you code the better you become</h2>
<h3>Coding is fun</h3>
```

### Emphasis and highlights

Avoid presentational tags and inline style hacks for meaning.

```html
<p><i>This is italic text</i></p>
<p><b>This is bold text</b></p>
<p><span style="background-color: lightyellow">this is highlighted text</span></p>
```

Prefer semantic tags, then style them with CSS.

```html
<p><strong>This is italic text</strong></p>
<p><em>This is bold text</em></p>
<p><mark>This is highlighted text</mark></p>
```

## Media and figures

* Use `<figure>` plus `<figcaption>` when an image needs a caption.
* Provide meaningful `alt` text for images.

Avoid non semantic caption wrappers.

```html
<div>
  <img src="a-man-coding.jpg" alt="A man working on his computer" />
  <p>This is a picture of a man working on his computer</p>
</div>
```

Prefer figure semantics.

```html
<figure>
  <img src="a-man-coding.jpg" alt="A man working on his computer" />
  <figcaption>This is a picture of a man working on his computer</figcaption>
</figure>
```

## Structure and minimalism

* Keep markup minimal and readable.
* Prefer descriptive class names when classes are needed.
* Do not add wrappers that exist only to compensate for unclear structure, start by fixing the structure.

## Valid nesting and layout rules

* Do not place block level elements inside inline level elements.
* Do not wrap `<p>` inside `<a>`.

```html
<a href="https://domain.com" target="_blank">
  <p>Company Software</p>
</a>
```

Prefer an inline link inside a block container.

```html
<p>
  <a href="https://domain.com" target="_blank">Company Software</a>
</p>
```

* A block element cannot be nested inside an inline element.
* An inline element can be nested inside a block element or another inline element.
* Any element can be nested inside a block element.

## Template engine syntax rules

* This project uses a custom template engine. Never use Liquid or Jekyll `{% %}` syntax.
* Use only the engine tags for control flow, loops, includes, and inheritance.
* CI rejects any template containing `{%` or `%}`.

### Conditionals

```html
<if condition="expression">
  <!-- content -->
  <elseif condition="other_expression"></elseif>
  <!-- content -->
  <else></else>
  <!-- content -->
</if>
```

### Loops

```html
<for each="item in array">
  <!-- Use {{ item.property }} -->
</for>
```

### Template inheritance

```html
<extends src="layouts/base.html"></extends>
<block name="title">Page Title</block>
<block name="content">
  <!-- content -->
</block>
```

### Includes with data

```html
<include src="../components/header.html" data='{ "current": "home" }'></include>
```

## Formatting rules

* Use 2-space indentation.
* Keep attributes on one line unless they become long, then wrap for readability.

## Validation

* W3C markup validation is mandatory for markup validity across HTML and related formats.
* Working markup is not enough, it must also follow best practices and remain valid.

## Choosing section vs article

* Use `section` for thematic grouping inside a page or component region.
* Use `article` for standalone content that can be reused, syndicated, or consumed independently.
* If content has its own heading and can live outside current page context, `article` is usually correct.

Example:

```html
<main>
  <section aria-labelledby="dashboard-title">
    <h1 id="dashboard-title">Dashboard</h1>

    <article aria-labelledby="release-title">
      <h2 id="release-title">Release 2.1</h2>
      <p>Standalone release note content.</p>
    </article>
  </section>
</main>
```

## Landmark and navigation examples

Preferred:

```html
<header>
  <nav aria-label="Primary">
    <a href="/">Home</a>
    <a href="/docs">Docs</a>
  </nav>
</header>

<main>
  <section>
    <h1>Docs</h1>
  </section>
</main>
```

Avoid duplicate unlabeled navigation landmarks when multiple nav blocks exist.

## Form labeling examples

Preferred explicit label:

```html
<label for="username">Username</label>
<input id="username" name="username" autocomplete="username" required />
```

Preferred grouped options:

```html
<fieldset>
  <legend>Notification preferences</legend>
  <label><input type="checkbox" name="email" /> Email</label>
  <label><input type="checkbox" name="sms" /> SMS</label>
</fieldset>
```

## Validation checklist example

1. Run HTML validation.
2. Verify heading order and single `h1`.
3. Verify semantic containers (`header`, `main`, `section`, `article`, `footer`).
4. Verify links/buttons use correct native elements.
5. Verify forms have labels and meaningful help/error content.
