// @ts-check

import TemplateEngine from '../../template-engine/index.js';

import svgDark from 'bundle-text:./icons/dark.svg';
import svgLight from 'bundle-text:./icons/light.svg';
import svgSystem from 'bundle-text:./icons/system.svg';

const engine = new TemplateEngine({ rootDir: '/' });

export const renderSwitcher = engine.html`
  <section data-part="control" aria-label="Color scheme" role="radiogroup">
    <label data-part="option" data-scheme="light">
      <input type="radio" name="color-scheme" value="light" />
      ${svgLight}
      <span sr-only>Light</span>
    </label>

    <label data-part="option" data-scheme="dark">
      <input type="radio" name="color-scheme" value="dark" />
      ${svgDark}
      <span sr-only>Dark</span>
    </label>

    <label data-part="option" data-scheme="system">
      <input type="radio" name="color-scheme" value="system" />
      ${svgSystem}
      <span sr-only>System</span>
    </label>
  </section>
`;
