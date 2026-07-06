# Examples

## TypeScript

```ts
type ThemeName = 'default' | 'ember' | 'paper';

export function pickTheme(name: ThemeName) {
  return name === 'paper' ? 'paper' : 'default';
}
```

## HTML

```html
<section class="hero">
  <h1>pix-galaxy</h1>
  <button type="button">Launch</button>
</section>
```

## CSS

```css
.hero {
  display: grid;
  gap: 1rem;
  padding: 2rem;
  background: linear-gradient(135deg, #081523, #12344d);
}
```

## JSON

```json
{
  "suite": "pix-galaxy",
  "component": "pix-highlighter",
  "release": true
}
```
