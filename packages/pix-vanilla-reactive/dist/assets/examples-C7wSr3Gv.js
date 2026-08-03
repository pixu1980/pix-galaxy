var e=`# Examples

Runnable HTML examples live in \`examples/\` — open them with any static
server (e.g. \`npx serve examples/\`) — no build step needed:

- \`examples/counter.html\` — Store + tick bridge + computed view
- \`examples/todo.html\` — \`model\` bindings, \`repeat()\` with interactive items
- \`examples/form.html\` — Store-driven form with validation and \`aria-live\`

## Reactive list with filtering

\`\`\`js
import {
  Store,
  Signal,
  effect,
  html,
  render,
  createTickState,
} from '@pix-galaxy/pix-vanilla-reactive';

const store = new Store({
  query: '',
  todos: [
    { id: 1, title: 'Learn signals', done: true },
    { id: 2, title: 'Write tests', done: false },
  ],
});
const tick = createTickState(store);

const view = new Signal.Computed(() => {
  tick.get();
  const q = store.state.query.toLowerCase();
  const visible = store.state.todos.filter((t) => t.title.toLowerCase().includes(q));
  const result = html\`
    <input
      model=\${{
        get: () => store.state.query,
        set: (v) => {
          store.state.query = v;
        },
      }}
      placeholder="filter…"
    />
    <ul>
      <for each="todo in todos">
        <li>
          <input
            type="checkbox"
            @click=\${(e) => {
              todo.done = e.currentTarget.checked;
            }}
          />
          {{ todo.title }}
        </li>
      </for>
    </ul>
  \`;
  result._context = { todos: visible };
  return result;
});

effect(() => render(view.get(), document.querySelector('#app')));
\`\`\`

## Custom element + adoptedStyleSheets

\`\`\`js
import { html, render, Signal } from '@pix-galaxy/pix-vanilla-reactive';

const name = new Signal.State('pix');
const sheet = new CSSStyleSheet();
sheet.replaceSync('p { color: oklch(65% 0.25 250); }');

export class HelloCard extends HTMLElement {
  static {
    customElements.define('hello-card', this);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }
  connectedCallback() {
    const dispose = effect(() => render(html\`<p>Hello \${name.get()}</p>\`, this));
    this._dispose = dispose;
  }
  disconnectedCallback() {
    this._dispose?.();
  }
}
\`\`\`
`;export{e as default};