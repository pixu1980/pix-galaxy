# Examples

## TypeScript

Highlight TypeScript helpers in-place with the customized built-in `pre[is="pix-highlighter"]` element.

```ts
type ThemeName = 'default' | 'ember' | 'paper';

export function pickTheme(name: ThemeName) {
  return name === 'paper' ? 'paper' : 'default';
}
```

## HTML

Use the highlighter directly in docs pages or component demos to enhance raw code samples.

```html
<pre is="pix-highlighter" data-lang="html">
  <code><section class="hero">\n  <h1>pix-galaxy</h1>\n</section></code>
</pre>
```

## CSS

Theme-aware token colors also apply to stylesheets rendered inside the component.

```css
.hero {
  display: grid;
  gap: 1rem;
  padding: 2rem;
  background: linear-gradient(135deg, #081523, #12344d);
}
```

## Programmatic Theme

Apply one of the exported built-in themes when you want every enhanced block on the page to switch together.

```js
import { PixHighlighter } from '@pix-galaxy/pix-highlighter';

PixHighlighter.applyTheme('atlas');
```
