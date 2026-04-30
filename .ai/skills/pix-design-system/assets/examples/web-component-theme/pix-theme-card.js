// @ts-check

const template = document.createElement('template');

template.innerHTML = `
  <link rel="stylesheet" href="./pix-theme-card.css">
  <article>
    <h2></h2>
    <slot></slot>
  </article>
`;

export class PixThemeCard extends HTMLElement {
  static observedAttributes = ['heading'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.append(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    const heading = this.getAttribute('heading') || 'Theme card';
    const title = this.shadowRoot?.querySelector('h2');

    if (title) {
      title.textContent = heading;
    }
  }
}

customElements.define('pix-theme-card', PixThemeCard);
