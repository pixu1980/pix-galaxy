var e=Object.defineProperty,t=(t,n,r)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[n]=r,n=(e,n,r)=>t(e,typeof n==`symbol`?n:n+``,r),r=`/** PixHighlighter — pix-highlighter component styles. */
@layer pix-galaxy {
  @layer pix-highlighter {
    ::highlight(pix-kw),
    pre[is='pix-highlighter'] [data-token='kw'] {
      color: var(--pix-highlighter--kw);
    }

    ::highlight(pix-str),
    pre[is='pix-highlighter'] [data-token='str'] {
      color: var(--pix-highlighter--str);
    }

    ::highlight(pix-num),
    pre[is='pix-highlighter'] [data-token='num'] {
      color: var(--pix-highlighter--num);
    }

    ::highlight(pix-com),
    pre[is='pix-highlighter'] [data-token='com'] {
      color: var(--pix-highlighter--com);
    }

    ::highlight(pix-id),
    pre[is='pix-highlighter'] [data-token='id'] {
      color: var(--pix-highlighter--id);
    }

    ::highlight(pix-op),
    pre[is='pix-highlighter'] [data-token='op'] {
      color: var(--pix-highlighter--op);
    }

    ::highlight(pix-tag),
    pre[is='pix-highlighter'] [data-token='tag'] {
      color: var(--pix-highlighter--tag);
    }

    ::highlight(pix-attr),
    pre[is='pix-highlighter'] [data-token='attr'] {
      color: var(--pix-highlighter--attr);
    }

    ::highlight(pix-key),
    pre[is='pix-highlighter'] [data-token='key'] {
      color: var(--pix-highlighter--key);
    }

    ::highlight(pix-var),
    pre[is='pix-highlighter'] [data-token='var'] {
      color: var(--pix-highlighter--var);
    }

    ::highlight(pix-mac),
    pre[is='pix-highlighter'] [data-token='mac'] {
      color: var(--pix-highlighter--mac);
    }

    ::highlight(pix-pp),
    pre[is='pix-highlighter'] [data-token='pp'] {
      color: var(--pix-highlighter--pp);
    }

    ::highlight(pix-prop),
    pre[is='pix-highlighter'] [data-token='prop'] {
      color: var(--pix-highlighter--prop);
    }

    ::highlight(pix-type),
    pre[is='pix-highlighter'] [data-token='type'] {
      color: var(--pix-highlighter--type);
    }

    ::highlight(pix-mdh),
    pre[is='pix-highlighter'] [data-token='mdh'] {
      color: var(--pix-highlighter--mdh);
    }

    ::highlight(pix-mde),
    pre[is='pix-highlighter'] [data-token='mde'] {
      color: var(--pix-highlighter--mde);
    }

    ::highlight(pix-mds),
    pre[is='pix-highlighter'] [data-token='mds'] {
      color: var(--pix-highlighter--mds);
    }

    ::highlight(pix-mdc),
    pre[is='pix-highlighter'] [data-token='mdc'] {
      color: var(--pix-highlighter--mdc);
    }

    ::highlight(pix-mdl),
    pre[is='pix-highlighter'] [data-token='mdl'] {
      color: var(--pix-highlighter--mdl);
    }

    ::highlight(pix-mdbq),
    pre[is='pix-highlighter'] [data-token='mdbq'] {
      color: var(--pix-highlighter--mdbq);
    }

    ::highlight(pix-mdli),
    pre[is='pix-highlighter'] [data-token='mdli'] {
      color: var(--pix-highlighter--mdli);
    }

    ::highlight(pix-mdhr),
    pre[is='pix-highlighter'] [data-token='mdhr'] {
      color: var(--pix-highlighter--mdhr);
    }

    ::highlight(pix-mdimg),
    pre[is='pix-highlighter'] [data-token='mdimg'] {
      color: var(--pix-highlighter--mdimg);
    }

  }
}
`,i=`@layer pix-galaxy {
  @layer pix-highlighter {
    @layer themes {
      :root[data-pix-highlighter-theme="cyberpunk"] pre[is="pix-highlighter"] {
        --pix-highlighter--bg: light-dark(#fff4fd, #090412);
        --pix-highlighter--fg: light-dark(#2f1140, #f9f7ff);
        --pix-highlighter--kw: light-dark(#c026d3, #ff4fd8);
        --pix-highlighter--str: light-dark(#ca8a04, #ffe45e);
        --pix-highlighter--num: light-dark(#0891b2, #62f3ff);
        --pix-highlighter--com: light-dark(#8b7aa8, #8b7aa8);
        --pix-highlighter--id: light-dark(#0f9f7f, #7ef7c9);
        --pix-highlighter--fn: light-dark(#00a896, #00f5d4);
        --pix-highlighter--op: light-dark(#ea580c, #ff8b39);
        --pix-highlighter--tag: light-dark(#db2777, #ff4fd8);
        --pix-highlighter--attr: light-dark(#0284c7, #4cc9f0);
        --pix-highlighter--key: light-dark(#0891b2, #62f3ff);
        --pix-highlighter--var: light-dark(#0f9f7f, #7ef7c9);
        --pix-highlighter--mac: light-dark(#db2777, #ff6ad5);
        --pix-highlighter--pp: light-dark(#ea580c, #ff9f1c);
        --pix-highlighter--prop: light-dark(#7c3aed, #9d7dff);
        --pix-highlighter--type: light-dark(#0284c7, #4cc9f0);
        --pix-highlighter--mdh: light-dark(#c026d3, #ff4fd8);
        --pix-highlighter--mde: light-dark(#ea580c, #ff8b39);
        --pix-highlighter--mds: light-dark(#ca8a04, #ffe45e);
        --pix-highlighter--mdc: light-dark(#0891b2, #62f3ff);
        --pix-highlighter--mdl: light-dark(#0f9f7f, #7ef7c9);
        --pix-highlighter--mdbq: light-dark(#8b7aa8, #a59ac7);
        --pix-highlighter--mdli: light-dark(#ea580c, #ff9f1c);
        --pix-highlighter--mdhr: light-dark(#eadcf8, #453363);
        --pix-highlighter--mdimg: light-dark(#0284c7, #4cc9f0);
        --pix-highlighter--tab-size: 2;
        --pix-highlighter--line-height: 1.55;
        --pix-highlighter--text-shadow: light-dark(none, 0 0 1.125rem rgba(255, 79, 216, 0.18));
      }
    }
  }
}
`,a=`@layer pix-galaxy {
  @layer pix-highlighter {
    @layer themes {
      :root[data-pix-highlighter-theme="darcula"] pre[is="pix-highlighter"] {
        --pix-highlighter--bg: light-dark(#f4f5f7, #2b2b2b);
        --pix-highlighter--fg: light-dark(#2f3136, #a9b7c6);
        --pix-highlighter--kw: light-dark(#c05621, #cc7832);
        --pix-highlighter--str: light-dark(#4d7c0f, #6a8759);
        --pix-highlighter--num: light-dark(#2563eb, #6897bb);
        --pix-highlighter--com: light-dark(#808080, #808080);
        --pix-highlighter--id: light-dark(#7c3aed, #9876aa);
        --pix-highlighter--fn: light-dark(#0284c7, #56a8f5);
        --pix-highlighter--op: light-dark(#2f3136, #a9b7c6);
        --pix-highlighter--tag: light-dark(#b45309, #e8bf6a);
        --pix-highlighter--attr: light-dark(#57534e, #bababa);
        --pix-highlighter--key: light-dark(#7c3aed, #9876aa);
        --pix-highlighter--var: light-dark(#7c3aed, #9876aa);
        --pix-highlighter--mac: light-dark(#7c6f00, #bbb529);
        --pix-highlighter--pp: light-dark(#b45309, #ffc66d);
        --pix-highlighter--prop: light-dark(#b45309, #ffc66d);
        --pix-highlighter--type: light-dark(#2563eb, #a9b7c6);
        --pix-highlighter--mdh: light-dark(#b45309, #ffc66d);
        --pix-highlighter--mde: light-dark(#c05621, #cc7832);
        --pix-highlighter--mds: light-dark(#2f3136, #e8bf6a);
        --pix-highlighter--mdc: light-dark(#4d7c0f, #6a8759);
        --pix-highlighter--mdl: light-dark(#2563eb, #6897bb);
        --pix-highlighter--mdbq: light-dark(#808080, #808080);
        --pix-highlighter--mdli: light-dark(#7c3aed, #9876aa);
        --pix-highlighter--mdhr: light-dark(#d4d4d8, #5c6370);
        --pix-highlighter--mdimg: light-dark(#7c6f00, #bbb529);
        --pix-highlighter--tab-size: 2;
        --pix-highlighter--line-height: 1.55;
        --pix-highlighter--text-shadow: none;
      }
    }
  }
}
`,o=`@layer pix-galaxy {
  @layer pix-highlighter {
    @layer themes {
      :root:not([data-pix-highlighter-theme]) pre[is="pix-highlighter"],
      :root[data-pix-highlighter-theme="default"] pre[is="pix-highlighter"] {
        --pix-highlighter--bg: light-dark(#f5f7fb, #0b0d10);
        --pix-highlighter--fg: light-dark(#182131, #e6e6e6);
        --pix-highlighter--kw: light-dark(#6d28d9, #c792ea);
        --pix-highlighter--str: light-dark(#a45a00, #ecc48d);
        --pix-highlighter--num: light-dark(#c05621, #f78c6c);
        --pix-highlighter--com: light-dark(#66758a, #697098);
        --pix-highlighter--id: light-dark(#2563eb, #82aaff);
        --pix-highlighter--fn: light-dark(#0f766e, #80cbc4);
        --pix-highlighter--op: light-dark(#3f7a14, #c3e88d);
        --pix-highlighter--tag: light-dark(#0f766e, #5ad4e6);
        --pix-highlighter--attr: light-dark(#b45309, #f2ae49);
        --pix-highlighter--key: light-dark(#6d28d9, #ffcc66);
        --pix-highlighter--var: light-dark(#2563eb, #82aaff);
        --pix-highlighter--mac: light-dark(#be185d, #ff9dd9);
        --pix-highlighter--pp: light-dark(#66758a, #8bd5ff);
        --pix-highlighter--prop: light-dark(#2563eb, #9cdcfe);
        --pix-highlighter--type: light-dark(#0f766e, #7fd5a3);
        --pix-highlighter--mdh: light-dark(#0f766e, #5ad4e6);
        --pix-highlighter--mde: light-dark(#6d28d9, #f2ae49);
        --pix-highlighter--mds: light-dark(#182131, #ffd166);
        --pix-highlighter--mdc: light-dark(#3f7a14, #c3e88d);
        --pix-highlighter--mdl: light-dark(#2563eb, #80cbc4);
        --pix-highlighter--mdbq: light-dark(#66758a, #a0a7bd);
        --pix-highlighter--mdli: light-dark(#2563eb, #b3e5fc);
        --pix-highlighter--mdhr: light-dark(#cbd5e1, #6c7a89);
        --pix-highlighter--mdimg: light-dark(#be185d, #90caf9);
        --pix-highlighter--tab-size: 2;
        --pix-highlighter--line-height: 1.5;
        --pix-highlighter--text-shadow: none;
      }
    }
  }
}
`,s=`@layer pix-galaxy {
  @layer pix-highlighter {
    @layer themes {
      :root[data-pix-highlighter-theme="prettylights"] pre[is="pix-highlighter"] {
        --pix-highlighter--bg: light-dark(#f6f8fa, #151b23);
        --pix-highlighter--fg: light-dark(#1f2328, #f0f6fc);
        --pix-highlighter--kw: light-dark(#cf222e, #ff7b72);
        --pix-highlighter--str: light-dark(#0a3069, #a5d6ff);
        --pix-highlighter--num: light-dark(#1f2328, #f0f6fc);
        --pix-highlighter--com: light-dark(#59636e, #9198a1);
        --pix-highlighter--id: light-dark(#0969da, #79c0ff);
        --pix-highlighter--fn: light-dark(#8250df, #79c0ff);
        --pix-highlighter--op: light-dark(#0550ae, #79c0ff);
        --pix-highlighter--tag: light-dark(#0550ae, #7ee787);
        --pix-highlighter--attr: light-dark(#0550ae, #79c0ff);
        --pix-highlighter--key: light-dark(#0550ae, #7ee787);
        --pix-highlighter--var: light-dark(#0969da, #79c0ff);
        --pix-highlighter--mac: light-dark(#6639ba, #d2a8ff);
        --pix-highlighter--pp: light-dark(#59636e, #9198a1);
        --pix-highlighter--prop: light-dark(#0550ae, #7ee787);
        --pix-highlighter--type: light-dark(#6639ba, #d2a8ff);
        --pix-highlighter--mdh: light-dark(#0550ae, #1f6feb);
        --pix-highlighter--mde: light-dark(#6639ba, #d2a8ff);
        --pix-highlighter--mds: light-dark(#1f2328, #f0f6fc);
        --pix-highlighter--mdc: light-dark(#116329, #7ee787);
        --pix-highlighter--mdl: light-dark(#0a3069, #a5d6ff);
        --pix-highlighter--mdbq: light-dark(#59636e, #9198a1);
        --pix-highlighter--mdli: light-dark(#953800, #ffa657);
        --pix-highlighter--mdhr: light-dark(#59636e, #9198a1);
        --pix-highlighter--mdimg: light-dark(#953800, #ffa657);
        --pix-highlighter--tab-size: 2;
        --pix-highlighter--line-height: 1.6;
        --pix-highlighter--text-shadow: none;
      }
    }
  }
}
`,c=`@layer pix-galaxy {
  @layer pix-highlighter {
    @layer themes {
      :root[data-pix-highlighter-theme="prism"] pre[is="pix-highlighter"] {
        --pix-highlighter--bg: light-dark(#f5f2f0, #16181d);
        --pix-highlighter--fg: light-dark(#111111, #f3f4f6);
        --pix-highlighter--kw: light-dark(#0077aa, #7dd3fc);
        --pix-highlighter--str: light-dark(#669900, #a3e635);
        --pix-highlighter--num: light-dark(#990055, #f472b6);
        --pix-highlighter--com: light-dark(#708090, #94a3b8);
        --pix-highlighter--id: light-dark(#0f766e, #67e8f9);
        --pix-highlighter--fn: light-dark(#dd4a68, #fb7185);
        --pix-highlighter--op: light-dark(#9a6e3a, #fde68a);
        --pix-highlighter--tag: light-dark(#990055, #f472b6);
        --pix-highlighter--attr: light-dark(#669900, #a3e635);
        --pix-highlighter--key: light-dark(#990055, #c084fc);
        --pix-highlighter--var: light-dark(#0f766e, #67e8f9);
        --pix-highlighter--mac: light-dark(#dd4a68, #fb7185);
        --pix-highlighter--pp: light-dark(#708090, #94a3b8);
        --pix-highlighter--prop: light-dark(#0f766e, #67e8f9);
        --pix-highlighter--type: light-dark(#dd4a68, #fb7185);
        --pix-highlighter--mdh: light-dark(#0077aa, #7dd3fc);
        --pix-highlighter--mde: light-dark(#dd4a68, #fb7185);
        --pix-highlighter--mds: light-dark(#111111, #f3f4f6);
        --pix-highlighter--mdc: light-dark(#669900, #a3e635);
        --pix-highlighter--mdl: light-dark(#0077aa, #7dd3fc);
        --pix-highlighter--mdbq: light-dark(#708090, #94a3b8);
        --pix-highlighter--mdli: light-dark(#990055, #c084fc);
        --pix-highlighter--mdhr: light-dark(#999999, #475569);
        --pix-highlighter--mdimg: light-dark(#ee9900, #fbbf24);
        --pix-highlighter--tab-size: 2;
        --pix-highlighter--font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
        --pix-highlighter--line-height: 1.5;
        --pix-highlighter--text-shadow: light-dark(0 1px white, none);
      }
    }
  }
}
`,l=`@layer pix-galaxy {
  @layer pix-highlighter {
    @layer themes {
      :root[data-pix-highlighter-theme='monokai'] pre[is='pix-highlighter'] {
        --pix-highlighter--bg: light-dark(#f5f4ed, #272822);
        --pix-highlighter--fg: light-dark(#2c2c2c, #f8f8f2);
        --pix-highlighter--kw: light-dark(#c2245b, #f92672);
        --pix-highlighter--str: light-dark(#8a843f, #e6db74);
        --pix-highlighter--num: light-dark(#7d2ed8, #ae81ff);
        --pix-highlighter--com: light-dark(#7a7866, #88846f);
        --pix-highlighter--id: light-dark(#2c2c2c, #f8f8f2);
        --pix-highlighter--op: light-dark(#c2245b, #f92672);
        --pix-highlighter--tag: light-dark(#c2245b, #f92672);
        --pix-highlighter--attr: light-dark(#6b9423, #a6e22e);
        --pix-highlighter--key: light-dark(#349fbf, #66d9ef);
        --pix-highlighter--var: light-dark(#b86e10, #fd971f);
        --pix-highlighter--mac: light-dark(#ba3fad, #fd5ff0);
        --pix-highlighter--pp: light-dark(#349fbf, #66d9ef);
        --pix-highlighter--prop: light-dark(#6b9423, #a6e22e);
        --pix-highlighter--type: light-dark(#349fbf, #66d9ef);
        --pix-highlighter--mdh: light-dark(#6b9423, #a6e22e);
        --pix-highlighter--mde: light-dark(#c2245b, #f92672);
        --pix-highlighter--mds: light-dark(#8a843f, #e6db74);
        --pix-highlighter--mdc: light-dark(#7a7866, #88846f);
        --pix-highlighter--mdl: light-dark(#349fbf, #66d9ef);
        --pix-highlighter--mdbq: light-dark(#7a7a78, #b8b8b2);
        --pix-highlighter--mdli: light-dark(#b86e10, #fd971f);
        --pix-highlighter--mdhr: light-dark(#4a4639, #5f5a4b);
        --pix-highlighter--mdimg: light-dark(#7d2ed8, #ae81ff);

        --pix-highlighter--tab-size: 2;
        --pix-highlighter--line-height: 1.55;
        --pix-highlighter--text-shadow: none;
      }
    }
  }
}
`,u=`@layer pix-galaxy {
  @layer pix-highlighter {
    @layer themes {
      :root[data-pix-highlighter-theme='nord'] pre[is='pix-highlighter'] {
        --pix-highlighter--bg: light-dark(#eef1f5, #2e3440);
        --pix-highlighter--fg: light-dark(#2c3039, #d8dee9);
        --pix-highlighter--kw: light-dark(#4f7aa8, #81a1c1);
        --pix-highlighter--str: light-dark(#608c4a, #a3be8c);
        --pix-highlighter--num: light-dark(#915d90, #b48ead);
        --pix-highlighter--com: light-dark(#6a758c, #616e88);
        --pix-highlighter--id: light-dark(#3b4252, #e5e9f0);
        --pix-highlighter--op: light-dark(#4099ad, #88c0d0);
        --pix-highlighter--tag: light-dark(#4f7aa8, #81a1c1);
        --pix-highlighter--attr: light-dark(#4f8a87, #8fbcbb);
        --pix-highlighter--key: light-dark(#43698b, #5e81ac);
        --pix-highlighter--var: light-dark(#aa6a47, #d08770);
        --pix-highlighter--mac: light-dark(#9b4851, #bf616a);
        --pix-highlighter--pp: light-dark(#b8974d, #ebcb8b);
        --pix-highlighter--prop: light-dark(#4099ad, #88c0d0);
        --pix-highlighter--type: light-dark(#4f8a87, #8fbcbb);
        --pix-highlighter--mdh: light-dark(#4099ad, #88c0d0);
        --pix-highlighter--mde: light-dark(#aa6a47, #d08770);
        --pix-highlighter--mds: light-dark(#b8974d, #ebcb8b);
        --pix-highlighter--mdc: light-dark(#6a758c, #616e88);
        --pix-highlighter--mdl: light-dark(#4f7aa8, #81a1c1);
        --pix-highlighter--mdbq: light-dark(#7a8495, #a7b1c2);
        --pix-highlighter--mdli: light-dark(#915d90, #b48ead);
        --pix-highlighter--mdhr: light-dark(#3b4358, #4c566a);
        --pix-highlighter--mdimg: light-dark(#4f8a87, #8fbcbb);

        --pix-highlighter--tab-size: 2;
        --pix-highlighter--line-height: 1.55;
        --pix-highlighter--text-shadow: none;
      }
    }
  }
}
`,d=`/* ── dout compatibility shim ────────────────────────────────────────
 * Map old --dout--* tokens to new --pix--* foundations tokens.
 * Remove when all components are migrated.                          */
:root {
  --dout--border-width: 1px;
  --dout--radius-sm: var(--pix-ds--r--sm);
  --dout--radius-md: var(--pix-ds--r--md);
  --dout--radius-pill: var(--pix-ds--r--pill);
  --dout--blur-panel: 0.5rem;
  --dout--z-header: 100;
  --dout--motion-fast: 160ms;
  --dout--motion-ease: ease;
  --dout--font-mono: var(--pix-ds--t--font-family-mono);
  --dout--visually-hidden-size: 1px;
  --dout--visually-hidden-offset: -1px;
  --dout--lift-y: -1px;
  --dout--focus-offset: 2px;
}

@layer pix-galaxy {
  @layer pix-highlighter {
    pre[is='pix-highlighter'] {
      --pix-highlighter--toolbar-surface: color-mix(
        in srgb,
        var(--pix-highlighter--bg) 86%,
        transparent
      );
      --pix-highlighter--toolbar-border: color-mix(
        in srgb,
        var(--pix-highlighter--fg) 25%,
        transparent
      );
      --pix-highlighter--toolbar-color: var(--pix-highlighter--fg);
      --pix-highlighter--toolbar-field-bg: color-mix(
        in srgb,
        var(--pix-highlighter--fg) 8%,
        transparent
      );
      --pix-highlighter--toolbar-field-hover-bg: color-mix(
        in srgb,
        var(--pix-highlighter--fg) 14%,
        transparent
      );
      --pix-highlighter--toolbar-shadow: 0 1.125rem 2rem rgba(0, 0, 0, 0.18);
      --pix-highlighter--toolbar-menu-bg: color-mix(
        in srgb,
        var(--pix-highlighter--bg) 92%,
        transparent
      );
      --pix-highlighter--toolbar-menu-accent: color-mix(
        in srgb,
        var(--pix-highlighter--fg) 22%,
        transparent
      );
      --pix-highlighter--anchor-offset: 0.5rem;

      position: relative;
      container-type: inline-size;
      display: block;
      white-space: pre;
      word-spacing: normal;
      word-break: normal;
      word-wrap: normal;
      overflow: auto;
      tab-size: var(--pix-highlighter--tab-size);
      hyphens: none;
      padding: var(--pix-ds-space-3) var(--pix--s--md) var(--pix--s--md);
      border: 1px solid var(--pix-highlighter--toolbar-border);
      border-radius: var(--pix-ds--r--md);
      color: var(--pix-highlighter--fg);
      background-color: var(--pix-highlighter--bg);


      text-shadow: var(--pix-highlighter--text-shadow);

      code {
        display: block;
        color: inherit;
        background: transparent;
      }

      [data-sr-only] {
        position: absolute;
        width: var(--dout--visually-hidden-size);
        height: var(--dout--visually-hidden-size);
        padding: var(--pix--s--0);
        margin: var(--dout--visually-hidden-offset);
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      [data-toolbar] {
        position: sticky;
        left: 0;
        top: 0;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--pix-ds-space-3);
        margin-block-end: 0.75rem;
        white-space: normal;
      }

      [data-theme-picker] {
        position: relative;
        margin: var(--pix--s--0);
      }

      :where([data-theme-trigger], [data-copy]) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--pix--s--sm);
        min-height: 2.5rem;
        padding: var(--pix--s--sm) var(--pix-ds-space-3);
        border: 1px solid var(--pix-highlighter--toolbar-border);
        border-radius: var(--pix-ds--r--md);
        background-color: var(--pix-highlighter--toolbar-surface);
        color: var(--pix-highlighter--toolbar-color);
        backdrop-filter: blur(var(--dout--blur-panel));
        cursor: pointer;
        transition:
          background-color var(--dout--motion-fast) var(--dout--motion-ease),
          border-color var(--dout--motion-fast) var(--dout--motion-ease),
          color var(--dout--motion-fast) var(--dout--motion-ease),
          transform var(--dout--motion-fast) var(--dout--motion-ease);

        svg {
          width: 1rem;
          height: 1rem;
          flex: 0 0 1rem;
        }

        &:hover:not(:disabled) {
          background-color: var(--pix-highlighter--toolbar-field-hover-bg);
          transform: translateY(calc(var(--dout--lift-y) / 2));
        }

      }

      [data-theme-trigger] {
        list-style: none;
        user-select: none;

        &::-webkit-details-marker {
          display: none;
        }

        &::marker {
          content: '';
        }
      }

      [data-theme-value] {
      }

      [data-theme-picker] {
        [data-theme-chevron] {
          display: inline-flex;
          margin-inline-start: 0.1rem;
          transition: transform var(--dout--motion-fast) var(--dout--motion-ease);
        }

        &[open] {
          [data-theme-chevron] {
            transform: rotate(180deg);
          }
        }
      }

      [data-copy] {
        width: 2.5rem;
        min-width: 2.5rem;
        padding-inline: 0;

        &[data-copy-state='copied'] {
          color: color-mix(in srgb, var(--pix-highlighter--fg) 92%, #7dffca 8%);
        }

        &[data-copy-state='error'] {
          color: color-mix(in srgb, var(--pix-highlighter--fg) 84%, #ff7f7f 16%);
        }

        &:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      }
    }

    /* ── Theme list (mounted on document.body, NOT inside <pre>) ── */

    [data-theme-list] {
      position: fixed;
      inset: auto;
      z-index: calc(var(--dout--z-header, 100) + 24);
      display: none;
      flex-direction: column;
      gap: var(--pix--s--xs);
      min-width: 14rem;
      max-width: min(22rem, calc(100vw - 1.5rem));
      min-height: 20rem;
      max-height: min(25rem, calc(100vh - 1.5rem));
      padding: var(--pix--s--sm);
      margin: var(--pix--s--0);
      list-style: none;
      border: 1px solid var(--pix-highlighter--toolbar-border);
      border-radius: var(--pix-ds--r--md);
      background: var(--pix-highlighter--toolbar-menu-bg);
      box-shadow: var(--pix-highlighter--toolbar-shadow);
      backdrop-filter: blur(var(--dout--blur-panel, 1rem));
      overflow-x: hidden;
      overflow-y: auto;

      &:where([data-open='true'], :popover-open) {
        display: flex;
      }

      &::backdrop {
        background: transparent;
      }

      li {
        margin: var(--pix--s--0);
      }

      [data-theme-option] {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: var(--pix-ds-space-3);
        min-height: 2.25rem;
        padding: var(--pix--s--sm) var(--pix-ds-space-3);
        border: 1px solid transparent;
        border-radius: var(--radius-sm);
        background: transparent;
        box-shadow: none;
        color: inherit;
        text-align: left;
        cursor: pointer;
        transition:
          background-color var(--dout--motion-fast) var(--dout--motion-ease),
          border-color var(--dout--motion-fast) var(--dout--motion-ease),
          color var(--dout--motion-fast) var(--dout--motion-ease);

        span:last-child {
          opacity: 0.56;
        }

        &:where(:hover, [data-selected]) {
          border-color: color-mix(
            in srgb,
            var(--pix-highlighter--fg) 40%,
            transparent
          );
          background: var(--pix-highlighter--toolbar-menu-accent);
        }

      }
    }

    @supports (anchor-name: --pix-highlighter--anchor) and
      (position-anchor: --pix-highlighter--anchor) {
      [data-theme-list][data-anchor-positioning='true'] {
        left: anchor(left);
        top: calc(anchor(bottom) + var(--pix-highlighter--anchor-offset));
        min-width: max(14rem, anchor-size(width));
        max-height: min(22rem, calc(100vh - 1.5rem));
        position-try-fallbacks: flip-block, flip-inline;
      }
    }

    @container (max-width: 16.875rem) {
      pre[is='pix-highlighter'] {
        [data-toolbar] {
          flex-direction: column;
          align-items: stretch;
        }

        [data-theme-picker] {
          width: 100%;
        }

        [data-theme-trigger] {
          width: 100%;
        }

        [data-copy] {
          width: 100%;
          min-width: 100%;
          padding-inline: 0.85rem;
        }

        [data-theme-list] {
          max-width: calc(100vw - 1.5rem);
        }
      }
    }
  }
}
`,f=`/* pix-foundations — entry point
 *
 * Import order: reset → helpers → foundations tokens → typography
 *
 * Usage in HTML:
 *   <link rel="stylesheet" href="/path/to/foundations.css">
 *
 * Usage in CSS:
 *   @import '@pix-galaxy/pix-foundations/foundations.css';
 *
 * Usage in JS (Vite):
 *   import '@pix-galaxy/pix-foundations/foundations.css';
 */

@layer pix.reset, pix.foundations, pix.components;

@import "./_reset.css" layer(pix.reset);
@import "./_colors.css" layer(pix.foundations.colors);
@import "./_spacings.css" layer(pix.foundations.spacings);
@import "./_typography.css" layer(pix.foundations.typography);
@import "./_elevations.css" layer(pix.foundations.elevations);
@import "./_radii.css" layer(pix.foundations.radii);
@import "./_controls.css" layer(pix.foundations.controls);

/* Focus ring is intentionally UNLAYERED so it beats all component CSS.
 * WCAG 2.2 SC 2.4.7 requires the focus indicator to always be visible
 * regardless of component-specific styles — unlayered > all layered.    */
@import "./_focus.css";

`,p=Object.freeze([`kw`,`str`,`num`,`com`,`id`,`fn`,`op`,`tag`,`attr`,`key`,`var`,`mac`,`pp`,`prop`,`type`,`mdh`,`mde`,`mds`,`mdc`,`mdl`,`mdbq`,`mdli`,`mdhr`,`mdimg`]);function m(e){let t=(e||``).toLowerCase().trim();return new Map([[`javascript`,`js`],[`mjs`,`js`],[`cjs`,`js`],[`typescript`,`ts`],[`tsx`,`ts`],[`py`,`python`],[`rs`,`rust`],[`c++`,`cpp`],[`hpp`,`cpp`],[`h++`,`cpp`],[`cs`,`csharp`],[`md`,`markdown`],[`yaml`,`yml`],[`shell`,`bash`],[`zsh`,`bash`],[`scss`,`css`],[`sass`,`css`]]).get(t)||t||`js`}var h=m;function g(e){return(t,n,r)=>{r>n&&e.push({type:t,start:n,end:r})}}function _(e,t,n,r={}){let i=e.length,a=t+1;for(r.includePrefix&&t--;a<i;){let t=e[a];if(t===`\\`){a+=2;continue}if(t===n){a++;break}a++}return[t,a]}function v(e,t){let n=t;if(e[n]===`-`&&n++,e.startsWith(`0x`,n)){for(n+=2;/[0-9a-fA-F_]/.test(e[n]);)n++;return[t,n]}if(e.startsWith(`0b`,n)){for(n+=2;/[01_]/.test(e[n]);)n++;return[t,n]}if(e.startsWith(`0o`,n)){for(n+=2;/[0-7_]/.test(e[n]);)n++;return[t,n]}for(;/[0-9_]/.test(e[n]);)n++;if(e[n]===`.`&&/[0-9]/.test(e[n+1]||``))for(n++;/[0-9_]/.test(e[n]);)n++;if((e[n]||``).toLowerCase()===`e`){let t=n+1;if((e[t]===`+`||e[t]===`-`)&&t++,/[0-9]/.test(e[t]||``))for(n=t+1;/[0-9_]/.test(e[n]);)n++}for(;/[a-zA-Z]/.test(e[n]||``);)n++;return[t,n]}function y(e,t){for(;/\s/.test(e[t]||``);)t++;return t}function b(e){return/[A-Za-z_$]/.test(e)}function x(e){return/[\w$-]/.test(e)}function S(e){let t=new Set([`if`,`then`,`elif`,`else`,`fi`,`for`,`in`,`do`,`done`,`case`,`esac`,`while`,`until`,`function`,`select`,`time`,`coproc`]),n=[],r=g(n),i=0,a=e.length;for(;i<a;){let n=e[i];if(i===0&&e.startsWith(`#!`,0)){let t=0;for(;t<a&&e[t]!==`
`;)t++;r(`pp`,0,t),i=t;continue}if(n===`#`){let t=i+1;for(;t<a&&e[t]!==`
`;)t++;r(`com`,i,t),i=t;continue}if(n===`'`||n===`"`||n==="`"){let[t,a]=_(e,i,n);r(`str`,t,a),i=a;continue}if(n===`$`)if(e[i+1]===`{`){let t=i+2;for(;t<a&&e[t]!==`}`;)t++;t=Math.min(a,t+1),r(`var`,i,t),i=t;continue}else{let t=i+1;for(;/[A-Za-z0-9_]/.test(e[t]||``);)t++;if(t>i+1){r(`var`,i,t),i=t;continue}}if(/\d|-/.test(n)){let[t,n]=v(e,i);if(n>i){r(`num`,t,n),i=n;continue}}if(/[A-Za-z_]/.test(n)){let n=i+1;for(;/[A-Za-z0-9_.-]/.test(e[n]||``);)n++;let a=e.slice(i,n);r(t.has(a)?`kw`:`id`,i,n),i=n;continue}let o=e.slice(i,i+3),s=e.slice(i,i+2);if([`<<<`].includes(o)){r(`op`,i,i+3),i+=3;continue}if([`&&`,`||`,`>>`,`<<`,`>|`,`2>`,`>&`].includes(s)){r(`op`,i,i+2),i+=2;continue}if(`(){}[];:.,+-*/%&|^!~?=<>`.includes(n)){r(`op`,i,i+1),i++;continue}i++}return n}function C(e,t){let n=new Set(`auto.break.case.char.const.continue.default.do.double.else.enum.extern.float.for.goto.if.inline.int.long.register.restrict.return.short.signed.sizeof.static.struct.switch.typedef.union.unsigned.void.volatile.while._Bool._Complex._Imaginary`.split(`.`));if(t)for(let e of`alignas.alignof.and.and_eq.asm.bitand.bitor.bool.catch.char8_t.char16_t.char32_t.class.compl.concept.consteval.constexpr.constinit.co_await.co_return.co_yield.decltype.delete.explicit.export.false.friend.mutable.namespace.new.noexcept.not.not_eq.operator.or.or_eq.private.protected.public.reinterpret_cast.requires.static_cast.template.this.thread_local.throw.true.try.typeid.typename.virtual.wchar_t.xor.xor_eq.using`.split(`.`))n.add(e);let r=[],i=g(r),a=0,o=e.length;for(;a<o;){let t=e[a];if(/\s/.test(t)){a++;continue}if(t===`#`){let t=a+1;for(;t<o&&e[t]!==`
`;)t++;i(`pp`,a,t),a=t;continue}if(t===`/`&&e[a+1]===`/`){let t=a+2;for(;t<o&&e[t]!==`
`;)t++;i(`com`,a,t),a=t;continue}if(t===`/`&&e[a+1]===`*`){let t=a+2;for(;t<o&&!(e[t]===`*`&&e[t+1]===`/`);)t++;t=Math.min(o,t+2),i(`com`,a,t),a=t;continue}if(t===`'`){let[t,n]=_(e,a,`'`);i(`str`,t,n),a=n;continue}if(t===`"`){let[t,n]=_(e,a,`"`);i(`str`,t,n),a=n;continue}if(/\d|-/.test(t)){let[t,n]=v(e,a);i(`num`,t,n),a=n;continue}if(b(t)){let t=a+1;for(;/[A-Za-z0-9_]/.test(e[t]||``);)t++;let r=e.slice(a,t);i(n.has(r)?`kw`:`id`,a,t),a=t;continue}if(`(){}[];:.,+-*/%&|^!~?=<>`.includes(t)){i(`op`,a,a+1),a++;continue}a++}return r}function w(e){return C(e,!1)}function T(e){return C(e,!0)}function E(e){let t=new Set(`abstract.as.base.bool.break.byte.case.catch.char.checked.class.const.continue.decimal.default.delegate.do.double.else.enum.event.explicit.extern.false.finally.fixed.float.for.foreach.goto.if.implicit.in.int.interface.internal.is.lock.long.namespace.new.null.object.operator.out.override.params.private.protected.public.readonly.ref.return.sbyte.sealed.short.sizeof.stackalloc.static.string.struct.switch.this.throw.true.try.typeof.uint.ulong.unchecked.unsafe.ushort.using.virtual.void.volatile.while.var.dynamic.async.await.record.nint.nuint`.split(`.`)),n=[],r=g(n),i=0,a=e.length;for(;i<a;){let n=e[i];if(/\s/.test(n)){i++;continue}if(n===`/`&&e[i+1]===`/`){let t=i+2;for(;t<a&&e[t]!==`
`;)t++;r(`com`,i,t),i=t;continue}if(n===`/`&&e[i+1]===`*`){let t=i+2;for(;t<a&&!(e[t]===`*`&&e[t+1]===`/`);)t++;t=Math.min(a,t+2),r(`com`,i,t),i=t;continue}if(n===`"`){let[t,n]=_(e,i,`"`);r(`str`,t,n),i=n;continue}if((n===`@`||n===`$`)&&e[i+1]===`"`){let[t,n]=_(e,i+1,`"`,{includePrefix:!0});r(`str`,t,n),i=n;continue}if(/\d|-/.test(n)){let[t,n]=v(e,i);r(`num`,t,n),i=n;continue}if(b(n)){let n=i+1;for(;/[A-Za-z0-9_]/.test(e[n]||``);)n++;let a=e.slice(i,n);r(t.has(a)?`kw`:`id`,i,n),i=n;continue}if(`(){}[];:.,+-*/%&|^!~?=<>`.includes(n)){r(`op`,i,i+1),i++;continue}i++}return n}function D(e){let t=[],n=g(t),r=0,i=e.length,a=!1;for(;r<i;){let t=e[r];if(t===`/`&&e[r+1]===`*`){let t=r+2;for(;t<i&&!(e[t]===`*`&&e[t+1]===`/`);)t++;t=Math.min(i,t+2),n(`com`,r,t),r=t;continue}if(/\s/.test(t)){r++;continue}if(t===`@`){let t=r+1;for(;x(e[t]||``);)t++;n(`kw`,r,t),r=t;continue}if(t===`{`){n(`op`,r,r+1),a=!0,r++;continue}if(t===`}`){n(`op`,r,r+1),a=!1,r++;continue}if(t===`'`||t===`"`){let[i,a]=_(e,r,t);n(`str`,i,a),r=a;continue}if(/\d|-/.test(t)){let[t,i]=v(e,r);n(`num`,t,i),r=i;continue}if(a){let t=r;if(b(e[t]||``)){let i=t;for(t++;x(e[t]||``);)t++;let a=t;if(t=y(e,t),e[t]===`:`){n(`prop`,i,a),n(`op`,t,t+1),r=t+1;continue}n(`id`,i,a),r=a;continue}}else{if(t===`.`||t===`#`){let t=r+1;for(;x(e[t]||``);)t++;n(`id`,r,t),r=t;continue}if(t===`:`){let t=r+1;for(;x(e[t]||``);)t++;n(`kw`,r,t),r=t;continue}if(b(t)){let t=r+1;for(;x(e[t]||``);)t++;n(`tag`,r,t),r=t;continue}}if(`()[];,:>.+*~^$|=`.includes(t)){n(`op`,r,r+1),r++;continue}r++}return t}function O(e){let t=new Set([`break`,`case`,`chan`,`const`,`continue`,`default`,`defer`,`else`,`fallthrough`,`for`,`func`,`go`,`goto`,`if`,`import`,`interface`,`map`,`package`,`range`,`return`,`select`,`struct`,`switch`,`type`,`var`]),n=[],r=g(n),i=0,a=e.length;for(;i<a;){let n=e[i];if(/\s/.test(n)){i++;continue}if(n===`/`&&e[i+1]===`/`){let t=i+2;for(;t<a&&e[t]!==`
`;)t++;r(`com`,i,t),i=t;continue}if(n===`/`&&e[i+1]===`*`){let t=i+2;for(;t<a&&!(e[t]===`*`&&e[t+1]===`/`);)t++;t=Math.min(a,t+2),r(`com`,i,t),i=t;continue}if(n===`"`){let[t,n]=_(e,i,`"`);r(`str`,t,n),i=n;continue}if(n==="`"){let[t,n]=_(e,i,"`");r(`str`,t,n),i=n;continue}if(/\d|-/.test(n)){let[t,n]=v(e,i);r(`num`,t,n),i=n;continue}if(b(n)){let n=i+1;for(;/[A-Za-z0-9_]/.test(e[n]||``);)n++;let a=e.slice(i,n);r(t.has(a)?`kw`:`id`,i,n),i=n;continue}if(`(){}[];:.,+-*/%&|^!~?=<>`.includes(n)){r(`op`,i,i+1),i++;continue}i++}return n}function k(e){let t=[],n=g(t),r=0,i=e.length;for(;r<i;){if(e[r]===`<`){if(e.startsWith(`<!--`,r)){let t=r+4;for(;t<i&&!e.startsWith(`-->`,t);)t++;t=Math.min(i,t+3),n(`com`,r,t),r=t;continue}let t=r+1;(e[t]===`/`||e[t]===`!`)&&t++;let a=t;for(;x(e[t]||``);)t++;for(t>a&&n(`tag`,a,t);t<i&&e[t]!==`>`;){if(/\s/.test(e[t])){t++;continue}if(e[t]===`/`){t++;continue}let r=t;for(;x(e[t]||``);)t++;if(t>r&&n(`attr`,r,t),t=y(e,t),e[t]===`=`)if(n(`op`,t,t+1),t++,t=y(e,t),e[t]===`"`||e[t]===`'`){let r=e[t],[i,a]=_(e,t,r);n(`str`,i,a),t=a}else{let r=t;for(;t<i&&!/[\s>]/.test(e[t]);)t++;t>r&&n(`str`,r,t)}}e[t]===`>`&&(n(`op`,t,t+1),t++),r=t;continue}r++}return t}function A(e){let t=new Set(`break.case.catch.class.const.continue.debugger.default.delete.do.else.export.extends.finally.for.function.if.import.in.instanceof.let.new.return.super.switch.this.throw.try.typeof.var.void.while.with.yield.await.of.as.from`.split(`.`)),n=new Set([`===`,`!==`,`>>>`]),r=new Set([`++`,`--`,`=>`,`==`,`!=`,`<=`,`>=`,`&&`,`||`,`??`,`**`,`<<`,`>>`,`?.`,`??`]),i=new Set(`(){}[];:.,+-*/%&|^!~?=<>`.split(``)),a=[],o=g(a),s=0,c=e.length;for(;s<c;){let a=e[s];if(/\s/.test(a)){s++;continue}if(a===`/`&&s+1<c){let t=e[s+1];if(t===`/`){let t=s+2;for(;t<c&&e[t]!==`
`;)t++;o(`com`,s,t),s=t;continue}if(t===`*`){let t=s+2;for(;t<c&&!(e[t]===`*`&&e[t+1]===`/`);)t++;t=Math.min(c,t+2),o(`com`,s,t),s=t;continue}}if(a===`'`||a===`"`||a==="`"){let[t,n]=_(e,s,a);o(`str`,t,n),s=n;continue}if(/\d|-/.test(a)){let[t,n]=v(e,s);if(n>s){o(`num`,t,n),s=n;continue}}if(b(a)){let n=s+1;for(;x(e[n]||``);)n++;let r=e.slice(s,n);o(t.has(r)?`kw`:`id`,s,n),s=n;continue}let l=e.slice(s,s+3),u=e.slice(s,s+2);if(n.has(l)){o(`op`,s,s+3),s+=3;continue}if(r.has(u)){o(`op`,s,s+2),s+=2;continue}if(i.has(a)){o(`op`,s,s+1),s+=1;continue}s++}return a}function j(e){let t=[],n=g(t),r=0,i=e.length,a=[];for(;r<i;){r=y(e,r);let t=e[r];if(!t)break;if(t===`{`){n(`op`,r,r+1),a.push(!0),r++;continue}if(t===`[`){n(`op`,r,r+1),a.push(!1),r++;continue}if(t===`}`||t===`]`){n(`op`,r,r+1),a.pop(),r++;continue}if(t===`,`){n(`op`,r,r+1),r++;continue}if(t===`:`){n(`op`,r,r+1),r++;continue}if(t===`"`){let[t,i]=_(e,r,`"`),o=y(e,i);n(a[a.length-1]===!0&&e[o]===`:`?`key`:`str`,t,i),r=i;continue}if(/\d|-/.test(t)){let[t,i]=v(e,r);n(`num`,t,i),r=i;continue}if(e.startsWith(`true`,r)||e.startsWith(`false`,r)||e.startsWith(`null`,r)){let t=e.startsWith(`true`,r)?`true`:e.startsWith(`false`,r)?`false`:`null`;n(`kw`,r,r+t.length),r+=t.length;continue}r++}return t}function M(e){let t=[],n=g(t),r=e.split(`
`),i=0,a=!1,o=null;for(let e of r){let t=e.length,r=e.trim();if(/^(```|~~~)/.test(r)){n(`mdc`,i,i+t);let e=r[0];a?a&&e===o&&(a=!1,o=null):(a=!0,o=e),i+=t+1;continue}if(a){n(`mdc`,i,i+t),i+=t+1;continue}if(/^#{1,6}\s+/.test(e)){n(`mdh`,i,i+t),i+=t+1;continue}if(/^(\s*)([-*_]\s*){3,}$/.test(e)){n(`mdhr`,i,i+t),i+=t+1;continue}if(/^\s*>\s?/.test(e)){n(`mdbq`,i,i+t),i+=t+1;continue}if(/^\s*([-*+])\s+/.test(e)||/^\s*\d+\.\s+/.test(e)){let t=e.match(/^\s*((?:[-*+])|\d+\.)\s+/);t&&n(`mdli`,i+e.indexOf(t[1]),i+e.indexOf(t[1])+t[1].length)}s(e,/`([^`]+)`/g,(e,t)=>n(`mdc`,i+e,i+t)),s(e,/\*\*([^*]+)\*\*/g,(e,t)=>n(`mds`,i+e,i+t)),s(e,/__([^_]+)__/g,(e,t)=>n(`mds`,i+e,i+t)),s(e,/(?:^|[^*])\*([^*\n]+)\*(?!\*)/g,(e,t)=>n(`mde`,i+e,i+t)),s(e,/(?:^|[^_])_([^_\n]+)_(?!_)/g,(e,t)=>n(`mde`,i+e,i+t)),s(e,/!\[[^\]]*\]\([^)]*\)/g,(e,t)=>n(`mdimg`,i+e,i+t)),s(e,/\[[^\]]+\]\([^)]*\)/g,(e,t)=>n(`mdl`,i+e,i+t)),i+=t+1}return t;function s(e,t,n){let r;for(;r=t.exec(e);)n(r.index,r.index+r[0].length)}}function N(e){let t=new Set(`abstract.and.array.as.break.callable.case.catch.class.clone.const.continue.declare.default.do.echo.else.elseif.empty.enddeclare.endfor.endforeach.endif.endswitch.endwhile.eval.exit.extends.final.finally.for.foreach.function.global.goto.if.implements.include.include_once.instanceof.insteadof.interface.isset.list.match.namespace.new.or.print.private.protected.public.readonly.require.require_once.return.static.switch.throw.trait.try.unset.use.var.while.xor.yield.true.false.null`.split(`.`)),n=[],r=g(n),i=0,a=e.length;for(;i<a;){let n=e[i];if(/\s/.test(n)){i++;continue}if(n===`/`&&e[i+1]===`/`){let t=i+2;for(;t<a&&e[t]!==`
`;)t++;r(`com`,i,t),i=t;continue}if(n===`#`){let t=i+1;for(;t<a&&e[t]!==`
`;)t++;r(`com`,i,t),i=t;continue}if(n===`/`&&e[i+1]===`*`){let t=i+2;for(;t<a&&!(e[t]===`*`&&e[t+1]===`/`);)t++;t=Math.min(a,t+2),r(`com`,i,t),i=t;continue}if(n===`'`||n===`"`){let[t,a]=_(e,i,n);r(`str`,t,a),i=a;continue}if(n===`$`&&b(e[i+1]||``)){let t=i+2;for(;/[A-Za-z0-9_]/.test(e[t]||``);)t++;r(`var`,i,t),i=t;continue}if(/\d|-/.test(n)){let[t,n]=v(e,i);r(`num`,t,n),i=n;continue}if(b(n)){let n=i+1;for(;/[A-Za-z0-9_]/.test(e[n]||``);)n++;let a=e.slice(i,n);r(t.has(a)?`kw`:`id`,i,n),i=n;continue}if(`(){}[];:.,+-*/%&|^!~?=<>@`.includes(n)){r(`op`,i,i+1),i++;continue}i++}return n}function P(e){let t=new Set(`False.None.True.and.as.assert.async.await.break.class.continue.def.del.elif.else.except.finally.for.from.global.if.import.in.is.lambda.nonlocal.not.or.pass.raise.return.try.while.with.yield`.split(`.`)),n=[],r=g(n),i=0,a=e.length;for(;i<a;){let n=e[i];if(/\s/.test(n)){i++;continue}if(n===`#`){let t=i+1;for(;t<a&&e[t]!==`
`;)t++;r(`com`,i,t),i=t;continue}if(e.startsWith(`'''`,i)||e.startsWith(`"""`,i)){let t=e[i],n=i+3;for(;n<a&&!e.startsWith(t+t+t,n);)n++;n=Math.min(a,n+3),r(`str`,i,n),i=n;continue}if(n===`'`||n===`"`){let[t,a]=_(e,i,n);r(`str`,t,a),i=a;continue}if(/\d|-/.test(n)){let[t,n]=v(e,i);r(`num`,t,n),i=n;continue}if(b(n)){let n=i+1;for(;/[A-Za-z0-9_]/.test(e[n]||``);)n++;let a=e.slice(i,n);r(t.has(a)?`kw`:`id`,i,n),i=n;continue}if("(){}[]:.,+-*/%&|^~=<>`".includes(n)){r(`op`,i,i+1),i++;continue}i++}return n}function F(e){let t=new Set(`as.break.const.continue.crate.else.enum.extern.false.fn.for.if.impl.in.let.loop.match.mod.move.mut.pub.ref.return.self.Self.static.struct.super.trait.true.type.unsafe.use.where.while.async.await.dyn`.split(`.`)),n=[],r=g(n),i=0,a=e.length;for(;i<a;){let n=e[i];if(/\s/.test(n)){i++;continue}if(n===`/`&&e[i+1]===`/`){let t=i+2;for(;t<a&&e[t]!==`
`;)t++;r(`com`,i,t),i=t;continue}if(n===`/`&&e[i+1]===`*`){let t=i+2;for(;t<a&&!(e[t]===`*`&&e[t+1]===`/`);)t++;t=Math.min(a,t+2),r(`com`,i,t),i=t;continue}if(n===`"`){let[t,n]=_(e,i,`"`);r(`str`,t,n),i=n;continue}if(n===`r`&&e[i+1]===`"`){let[t,n]=_(e,i+1,`"`,{includePrefix:!0});r(`str`,t,n),i=n;continue}if(/\d|-/.test(n)){let[t,n]=v(e,i);r(`num`,t,n),i=n;continue}if(b(n)){let n=i+1;for(;/[A-Za-z0-9_]/.test(e[n]||``);)n++;if(e[n]===`!`){r(`mac`,i,n+1),i=n+1;continue}let a=e.slice(i,n);r(t.has(a)?`kw`:`id`,i,n),i=n;continue}if(`(){}[]:.,+-*/%&|^!~?=<>`.includes(n)){r(`op`,i,i+1),i++;continue}i++}return n}function I(e){let t=new Set([`interface`,`type`,`enum`,`implements`,`readonly`,`public`,`private`,`protected`,`abstract`,`declare`,`namespace`,`keyof`,`infer`,`satisfies`,`unknown`,`never`,`bigint`,`asserts`]),n=A(e);for(let r of n)if(r.type===`id`){let n=e.slice(r.start,r.end);t.has(n)&&(r.type=`kw`)}return n}function L(e){let t=[],n=g(t),r=/^(true|false|null|yes|no|on|off)$/i,i=0,a=e.length;for(;i<a;){let t=i,o=i;for(;o<a&&e[o]!==`
`;)o++;let s=e.slice(i,o);if(/^\s*(---|\.\.\.)\s*$/.test(s)){n(`op`,t,t+s.length),i=o+1;continue}let c=0;for(;c<s.length;){let e=s[c];if(e===`'`||e===`"`){let[r,i]=_(s,c,e);n(`str`,t+r,t+i),c=i;continue}if(e===`#`){n(`com`,t+c,t+s.length);break}c++}let l=s.match(/^(\s*)([A-Za-z0-9_.-]+)\s*:/);if(l){let e=t+l[1].length;n(`key`,e,e+l[2].length)}let u,d=/[&*][A-Za-z0-9_-]+/g;for(;u=d.exec(s);)n(`var`,t+u.index,t+u.index+u[0].length);let f=/!![^\s]+/g;for(;u=f.exec(s);)n(`type`,t+u.index,t+u.index+u[0].length);let p=/[A-Za-z0-9_.-]+/g;for(;u=p.exec(s);){let e=u[0],i=t+u.index,a=i+e.length;if(/^-?\d/.test(e)){n(`num`,i,a);continue}r.test(e)&&n(`kw`,i,a)}let m=s.match(/^(\s*)-\s+/);if(m){let e=t+m[1].length;n(`op`,e,e+1)}i=o+1}return t}var ee=new Map([[`js`,A],[`ts`,I],[`css`,D],[`json`,j],[`html`,k],[`python`,P],[`rust`,F],[`c`,w],[`cpp`,T],[`php`,N],[`csharp`,E],[`go`,O],[`markdown`,M],[`md`,M],[`yml`,L],[`yaml`,L],[`bash`,S],[`sh`,S]]);function te(e){return ee.get(m(e))??null}var R=[f,d,o,c,s,a,i,l,u,r].join(`
`),ne=2e3,z=8,B=12,V=`pix-highlighter-theme`,H=Symbol(`pixHighlighterEnhanced`),U=`data-styles`,W=null,G=null;function re(){if(typeof globalThis.CSS?.supports!=`function`)return!1;try{return globalThis.CSS.supports(`anchor-name: --pix-highlighter--anchor`)&&globalThis.CSS.supports(`position-anchor: --pix-highlighter--anchor`)&&globalThis.CSS.supports(`top: anchor(bottom)`)}catch{return!1}}function ie(){G?.remove()}function K(){return typeof document>`u`?null:(G||=document.head?.querySelector(`style[${U}]`)||document.querySelector(`style[${U}]`)||document.createElement(`style`),G.setAttribute(U,``),G.textContent!==R&&(G.textContent=R),G.isConnected||(document.head||document.documentElement).appendChild(G),G)}function q(){return typeof document>`u`?null:`adoptedStyleSheets`in document&&typeof globalThis.CSSStyleSheet==`function`&&typeof globalThis.CSSStyleSheet.prototype.replaceSync==`function`?(ie(),W||(W=new CSSStyleSheet,W.replaceSync(R)),document.adoptedStyleSheets.includes(W)||document.adoptedStyleSheets.push(W),W):K()}var J=Object.freeze([{value:`default`,label:`Default`},{value:`prism`,label:`Prism`},{value:`prettylights`,label:`Pretty Lights`},{value:`darcula`,label:`Darcula`},{value:`cyberpunk`,label:`Cyberpunk`},{value:`monokai`,label:`Monokai`},{value:`nord`,label:`Nord`}]),ae=`
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><rect width="10" height="10" x="9" y="9" fill="none" stroke="currentColor" stroke-width="1.8" rx="2" ry="2"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"/></svg>
`,oe=`
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12.5 9.2 17 19 7.5"/></svg>
`,se=`
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" d="M12 7.5V13"/><circle cx="12" cy="16.5" r="1" fill="currentColor"/></svg>
`,ce=`
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.6" d="M12 3c-5 0-9 3.6-9 8.2 0 4.4 3.6 7.8 8 7.8h1.5c.8 0 1.5.6 1.5 1.4 0 .9.7 1.6 1.6 1.6 3 0 5.4-2.7 5.4-6.2C21 8.2 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1.1" fill="currentColor"/><circle cx="10.5" cy="7.5" r="1.1" fill="currentColor"/><circle cx="15" cy="7.8" r="1.1" fill="currentColor"/><circle cx="17" cy="12" r="1.1" fill="currentColor"/></svg>
`,le=`
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m6 9 6 6 6-6"/></svg>
`;function Y(){try{return window.localStorage}catch{return null}}function ue(e){return J.find(t=>t.value===e)?.label||`Default`}function de(e,t,n){e&&(e.innerHTML=`${t}<span data-sr-only>${n}</span>`,e.setAttribute(`aria-label`,n),e.title=n)}var X=class e extends HTMLPreElement{static ensureComponentStyles(){return q()}static registerCustomElement(){let e=globalThis.customElements;if(!e?.define)return!1;if(e.get(`pix-highlighter`))return!0;try{return e.define(`pix-highlighter`,this,{extends:`pre`}),!0}catch{return!1}}static get observedAttributes(){return[`data-lang`,`lang`]}static supportsHighlights(){return!!(typeof window<`u`&&globalThis.CSS?.highlights&&typeof window.Highlight==`function`)}static getHighlightName(e){return`pix-${e}`}static isThemeValue(e){return J.some(t=>t.value===e)}static getSavedTheme(){let e=Y()?.getItem(V);return this.isThemeValue(e)?e:null}static getCurrentTheme(){if(typeof document>`u`)return`default`;let e=document.documentElement.dataset.pixHighlighterTheme;return this.isThemeValue(e)?e:`default`}static getInitialTheme(){if(typeof document>`u`)return`default`;let e=document.documentElement.dataset.pixHighlighterTheme;return this.isThemeValue(e)?e:this.getSavedTheme()||`default`}static ensureThemeState(){this._themeInitialized||(this._themeInitialized=!0,this.applyTheme(this.getInitialTheme(),{persist:!1,syncInstances:!1}))}static applyTheme(e,{persist:t=!0,syncInstances:n=!0}={}){let r=this.isThemeValue(e)?e:`default`;if(typeof document<`u`&&(document.documentElement.dataset.pixHighlighterTheme=r),t&&Y()?.setItem(V,r),n)for(let e of this.instances)e._syncThemeControl(r);return r}static clearManagedHighlights(){if(this.supportsHighlights())for(let e of this.KNOWN_TYPES)globalThis.CSS.highlights.delete(this.getHighlightName(e))}static enhanceElement(t){return t instanceof window.HTMLPreElement?(t instanceof e||Object.setPrototypeOf(t,e.prototype),t._ensureState(),t._connect(),t):null}static enhanceAll(e=document){if(!e?.querySelectorAll)return[];let t=[];return e instanceof window.HTMLPreElement&&e.matches?.(`pre[is='pix-highlighter']`)&&t.push(e),t.push(...e.querySelectorAll(`pre[is='pix-highlighter']`)),t.map(e=>this.enhanceElement(e)).filter(Boolean)}static renderHighlights(){if(!this.supportsHighlights()){this.clearManagedHighlights();return}let e=new Map,t=new Map;for(let n of this.KNOWN_TYPES)e.set(n,new Highlight),t.set(n,0);for(let n of this.instances)if(!(!n.isConnected||!n._textNode))for(let r of n._tokens){let i=e.get(r.type);if(!i)continue;let a=document.createRange();a.setStart(n._textNode,r.start),a.setEnd(n._textNode,r.end),i.add(a),t.set(r.type,t.get(r.type)+1)}for(let n of this.KNOWN_TYPES){let r=this.getHighlightName(n);t.get(n)>0?globalThis.CSS.highlights.set(r,e.get(n)):globalThis.CSS.highlights.delete(r)}}constructor(){super(),this._ensureState()}connectedCallback(){this._connect()}_connect(){this._ensureState(),!this._isActive&&(this._isActive=!0,this.dataset.root=``,this.constructor.ensureComponentStyles(),e.ensureThemeState(),e.instances.add(this),this._ensureToolbar(),this._syncThemeControl(),this._updateHighlightState({force:!0}),this._observe())}disconnectedCallback(){!this._stateReady||!this._isActive||(this._isActive=!1,this._teardownThemePicker(),this._copyButton?.removeEventListener(`click`,this._onCopyClick),this._themeOptionButtons?.forEach(e=>{e.removeEventListener(`click`,this._onThemeOptionClick)}),this._mo?.disconnect(),this._mo=null,this._textNode=null,this._tokens=[],this._themeList?.remove(),window.clearTimeout(this._copyResetTimer),this._copyResetTimer=0,e.instances.delete(this),e.renderHighlights())}attributeChangedCallback(e,t,n){this._ensureState(),(e===`data-lang`||e===`lang`)&&t!==n&&this._updateHighlightState({force:!0})}_getLanguage(){return h(this.getAttribute(`data-lang`)||this.getAttribute(`lang`))}_ensureState(){if(this._stateReady){this._supportsHighlight=e.supportsHighlights();return}this._stateReady=!0,this._id||=(++e._uid).toString(36),this[H]=!0,this._isActive=!1,this._lastText=null,this._lastLang=null,this._tokens=[],this._textNode=null,this._mo=null,this._copyButton=null,this._themePicker=null,this._themeTrigger=null,this._themeTriggerLabel=null,this._themeList=null,this._themeOptionButtons=[],this._copyResetTimer=0,this._themeMenuListenerTimer=0,this._isSyncingCode=!1,this._supportsHighlight=e.supportsHighlights(),this._supportsAnchorPositioning=re(),this._supportsThemeListPopover=!1,this._onCopyClick=this._handleCopyClick.bind(this),this._onThemeOptionClick=this._handleThemeOptionClick.bind(this),this._onThemePickerToggle=this._handleThemePickerToggle.bind(this),this._onThemeListToggle=this._handleThemeListToggle.bind(this),this._onThemeMenuViewportChange=this._positionThemeList.bind(this),this._onThemeMenuClick=this._handleDocumentClick.bind(this),this._onThemeMenuKeyDown=this._handleDocumentKeyDown.bind(this)}_getCodeElement(){return this.querySelector(`code`)}_ensureToolbar(){let e=this.querySelector(`[data-toolbar]`);if(e){this._themePicker=e.querySelector(`[data-theme-picker]`),this._themeTrigger=e.querySelector(`[data-theme-trigger]`),this._themeTriggerLabel=e.querySelector(`[data-theme-value]`),this._themeList=e.querySelector(`[data-theme-list]`),this._themeList||=document.getElementById(this._themeTrigger?.getAttribute(`aria-controls`)||``),this._copyButton=e.querySelector(`[data-copy]`),this._themeOptionButtons=Array.from((this._themeList||e).querySelectorAll(`[data-theme-option]`)),this._teardownThemePicker(),this._copyButton?.removeEventListener(`click`,this._onCopyClick),this._themeOptionButtons.forEach(e=>{e.removeEventListener(`click`,this._onThemeOptionClick)}),this._copyButton?.addEventListener(`click`,this._onCopyClick),this._themeOptionButtons.forEach(e=>{e.addEventListener(`click`,this._onThemeOptionClick)}),this._bindThemePicker();return}let t=document.createElement(`span`);t.dataset.toolbar=``,t.setAttribute(`role`,`group`),t.setAttribute(`aria-label`,`Code block actions`);let n=document.createElement(`details`);n.dataset.themePicker=``;let r=document.createElement(`summary`);r.dataset.themeTrigger=``,r.setAttribute(`aria-label`,`Syntax highlight theme`);let i=document.createElement(`span`);i.dataset.themeValue=``;let a=document.createElement(`span`);a.dataset.themeIcon=``,a.innerHTML=ce;let o=document.createElement(`span`);o.dataset.themeChevron=``,o.innerHTML=le,r.append(a,i,o);let s=document.createElement(`ul`);s.dataset.themeList=``,s.id=`pix-highlighter-theme-list-${this._id}`,s.setAttribute(`role`,`listbox`),s.setAttribute(`aria-label`,`Syntax highlight themes`),r.setAttribute(`aria-haspopup`,`listbox`),r.setAttribute(`aria-controls`,s.id),r.setAttribute(`aria-expanded`,`false`);let c=[];for(let e of J){let t=document.createElement(`li`),n=document.createElement(`button`);n.type=`button`,n.dataset.themeOption=e.value,n.setAttribute(`role`,`option`),n.innerHTML=`<span>${e.label}</span><span aria-hidden="true">${e.value}</span>`,t.appendChild(n),s.appendChild(t),c.push(n)}n.append(r,s);let l=document.createElement(`button`);l.type=`button`,l.dataset.copy=``,this._setCopyButtonState(`idle`,l),t.append(n,l),this.prepend(t),this._themePicker=n,this._themeTrigger=r,this._themeTriggerLabel=i,this._themeList=s,this._themeOptionButtons=c,this._copyButton=l,this._copyButton.addEventListener(`click`,this._onCopyClick),this._themeOptionButtons.forEach(e=>{e.addEventListener(`click`,this._onThemeOptionClick)}),this._bindThemePicker()}_bindThemePicker(){this._themePicker&&(this._mountThemeList(),this._configureThemeAnchor(),this._themePicker.removeEventListener(`toggle`,this._onThemePickerToggle),this._themePicker.addEventListener(`toggle`,this._onThemePickerToggle),this._themeTrigger&&this._themeList&&(this._themeList.id||(this._themeList.id=`pix-highlighter-theme-list-${this._id}`),this._themeTrigger.setAttribute(`aria-haspopup`,`listbox`),this._themeTrigger.setAttribute(`aria-controls`,this._themeList.id),this._themeTrigger.setAttribute(`aria-expanded`,String(!!this._themePicker.open))))}_mountThemeList(){!this._themeList||typeof document>`u`||(this._themeList.parentElement!==document.body&&document.body.append(this._themeList),this._supportsThemeListPopover=typeof this._themeList.showPopover==`function`&&typeof this._themeList.hidePopover==`function`,this._supportsThemeListPopover?(this._themeList.setAttribute(`popover`,`auto`),this._themeList.removeEventListener(`toggle`,this._onThemeListToggle),this._themeList.addEventListener(`toggle`,this._onThemeListToggle)):(this._themeList.removeEventListener(`toggle`,this._onThemeListToggle),this._themeList.removeAttribute(`popover`)))}_syncThemeListSurface(){if(!this._themeList||typeof window>`u`)return;let e=window.getComputedStyle(this);[`--pix-highlighter--bg`,`--pix-highlighter--fg`,`--pix-highlighter--toolbar-border`,`--pix-highlighter--toolbar-color`,`--pix-highlighter--toolbar-menu-accent`,`--pix-highlighter--toolbar-menu-bg`,`--pix-highlighter--toolbar-shadow`].forEach(t=>{let n=e.getPropertyValue(t).trim();n&&this._themeList.style.setProperty(t,n)})}_getThemeAnchorName(){return`--pix-highlighter--highlighter-theme-trigger-${this._id}`}_configureThemeAnchor(){if(!this._themeTrigger||!this._themeList)return;let e=this._getThemeAnchorName();this._themeTrigger.style.setProperty(`anchor-name`,e),this._themeList.style.setProperty(`position-anchor`,e),this._themeList.style.setProperty(`--pix-highlighter--anchor-offset`,`${z}px`),this._themeList.dataset.anchorPositioning=String(this._supportsAnchorPositioning)}_teardownThemePicker(){this._themePicker?.removeEventListener(`toggle`,this._onThemePickerToggle),this._themeList?.removeEventListener(`toggle`,this._onThemeListToggle),window.clearTimeout(this._themeMenuListenerTimer),this._themeMenuListenerTimer=0,this._removeFloatingThemePickerListeners(),this._hideThemeListPopover(),this._resetThemeListPosition(),this._themeTrigger&&this._themeTrigger.setAttribute(`aria-expanded`,`false`)}_addFloatingThemePickerListeners(){typeof window>`u`||typeof document>`u`||(window.addEventListener(`resize`,this._onThemeMenuViewportChange),document.addEventListener(`scroll`,this._onThemeMenuViewportChange,!0),document.addEventListener(`click`,this._onThemeMenuClick,!0),document.addEventListener(`keydown`,this._onThemeMenuKeyDown,!0))}_removeFloatingThemePickerListeners(){typeof window>`u`||typeof document>`u`||(window.removeEventListener(`resize`,this._onThemeMenuViewportChange),document.removeEventListener(`scroll`,this._onThemeMenuViewportChange,!0),document.removeEventListener(`click`,this._onThemeMenuClick,!0),document.removeEventListener(`keydown`,this._onThemeMenuKeyDown,!0))}_resetThemeListPosition(){this._themeList&&(this._themeList.style.removeProperty(`position`),this._themeList.style.removeProperty(`inset`),this._themeList.style.removeProperty(`top`),this._themeList.style.removeProperty(`left`),this._themeList.style.removeProperty(`min-width`),this._themeList.style.removeProperty(`height`),this._themeList.style.removeProperty(`max-height`),this._themeList.style.removeProperty(`display`),this._themeList.style.removeProperty(`visibility`),this._themeList.removeAttribute(`data-open`))}_hideThemeListPopover(){if(!(!this._supportsThemeListPopover||!this._themeList?.matches(`:popover-open`)))try{this._themeList.hidePopover()}catch{}}_scheduleThemeListPosition(){if(typeof window<`u`&&typeof window.requestAnimationFrame==`function`){window.requestAnimationFrame(()=>{this._positionThemeList()});return}this._positionThemeList()}_handleThemePickerToggle(){let e=!!this._themePicker?.open;if(this._themeTrigger&&this._themeTrigger.setAttribute(`aria-expanded`,String(e)),!e){window.clearTimeout(this._themeMenuListenerTimer),this._themeMenuListenerTimer=0,this._removeFloatingThemePickerListeners(),this._hideThemeListPopover(),this._resetThemeListPosition();return}if(window.clearTimeout(this._themeMenuListenerTimer),this._themeList?.setAttribute(`data-open`,`true`),this._syncThemeListSurface(),this._supportsThemeListPopover&&!this._themeList.matches(`:popover-open`))try{this._themeList.showPopover()}catch{}this._scheduleThemeListPosition(),this._themeMenuListenerTimer=window.setTimeout(()=>{this._themeMenuListenerTimer=0,this._themePicker?.open&&this._addFloatingThemePickerListeners()},0)}_handleThemeListToggle(){!this._supportsThemeListPopover||this._themeList?.matches(`:popover-open`)||(this._themePicker?.open&&(this._themePicker.open=!1),this._themeTrigger?.setAttribute(`aria-expanded`,`false`),this._removeFloatingThemePickerListeners(),this._resetThemeListPosition())}_handleDocumentClick(e){if(!this._themePicker?.open)return;let t=e.target;t instanceof Node&&(this._themePicker.contains(t)||this._themeList?.contains(t))||(this._themePicker.open=!1)}_handleDocumentKeyDown(e){e.key!==`Escape`||!this._themePicker?.open||(this._themePicker.open=!1,this._hideThemeListPopover(),this._themeTrigger?.focus())}_positionThemeList(){if(typeof window>`u`||!this._themePicker?.open||!this._themeTrigger||!this._themeList)return;let e=this._themeTrigger.getBoundingClientRect(),t=Math.max(e.width,224);if(this._syncThemeListSurface(),this._supportsAnchorPositioning){this._themeList.style.removeProperty(`position`),this._themeList.style.removeProperty(`inset`),this._themeList.style.removeProperty(`left`),this._themeList.style.removeProperty(`top`),this._themeList.style.minWidth=`${Math.round(t)}px`,this._themeList.style.maxHeight=`${Math.max(120,window.innerHeight-B*2)}px`;return}this._themeList.style.position=`fixed`,this._themeList.style.inset=`auto`,this._themeList.style.display=`flex`,this._themeList.style.visibility=``,this._themeList.style.left=`-9999px`,this._themeList.style.top=`-9999px`,this._themeList.style.minWidth=`${Math.round(t)}px`,this._themeList.style.maxHeight=`${Math.max(120,window.innerHeight-B*2)}px`;let n=this._themeList.getBoundingClientRect(),r=Math.min(Math.max(t,n.width||this._themeList.offsetWidth||t),window.innerWidth-B*2),i=n.height||this._themeList.scrollHeight||0,a=window.innerHeight-e.bottom-B-z,o=e.top-B-z,s=a<Math.min(i,240)&&o>a,c=Math.max(120,s?o:a),l=Math.min(i||c,c),u=e.left;u+r>window.innerWidth-B&&(u=window.innerWidth-B-r),u=Math.max(B,u);let d=s?Math.max(B,e.top-z-l):Math.max(B,Math.min(e.bottom+z,window.innerHeight-B-l));this._themeList.style.left=`${Math.round(u)}px`,this._themeList.style.top=`${Math.round(d)}px`,this._themeList.style.minWidth=`${Math.round(r)}px`,this._themeList.style.maxHeight=`${Math.round(c)}px`}_observe(){this._mo?.disconnect(),this._mo=new MutationObserver(e=>{if(this._isSyncingCode)return;let t=e.some(e=>e.type===`attributes`&&(e.attributeName===`data-lang`||e.attributeName===`lang`));this._updateHighlightState({force:t})}),this._mo.observe(this,{attributes:!0,attributeFilter:[`data-lang`,`lang`],childList:!0,characterData:!0,subtree:!0})}_updateHighlightState({force:t=!1}={}){let n=this._getCodeElement();if(!n){this._tokens=[],this._textNode=null,e.renderHighlights();return}let r=n.textContent??``,i=this._getLanguage();!t&&r===this._lastText&&i===this._lastLang||(this._lastText=r,this._lastLang=i,this._tokens=this._lex(i,r),this._supportsHighlight?(this._isSyncingCode=!0,n.textContent=r,this._textNode=n.firstChild||n.appendChild(document.createTextNode(``)),this._isSyncingCode=!1):(this._textNode=null,this._renderFallbackMarkup(n,r,this._tokens)),e.renderHighlights())}_renderFallbackMarkup(e,t,n){if(this._isSyncingCode=!0,!n.length){e.textContent=t,this._isSyncingCode=!1;return}let r=document.createDocumentFragment(),i=0;for(let e of n){if(e.start<i)continue;e.start>i&&r.append(document.createTextNode(t.slice(i,e.start)));let n=document.createElement(`span`);n.dataset.token=e.type,n.textContent=t.slice(e.start,e.end),r.append(n),i=e.end}i<t.length&&r.append(document.createTextNode(t.slice(i))),e.replaceChildren(r),this._isSyncingCode=!1}_syncThemeControl(t=e.getCurrentTheme()){this._themeTriggerLabel&&(this._themeTriggerLabel.textContent=ue(t)),this._themeOptionButtons.forEach(e=>{let n=e.dataset.themeOption===t;e.toggleAttribute(`data-selected`,n),e.setAttribute(`aria-selected`,String(n))})}_handleThemeOptionClick(t){let n=t.currentTarget.dataset.themeOption;e.applyTheme(n),this._themePicker&&(this._themePicker.open=!1),this._hideThemeListPopover(),this._resetThemeListPosition()}async _handleCopyClick(){let e=this._getCodeElement();if(e?.textContent)try{await this._copyText(e.textContent),this._setCopyButtonState(`copied`)}catch{this._setCopyButtonState(`error`)}}async _copyText(e){if(window.navigator?.clipboard?.writeText){await window.navigator.clipboard.writeText(e);return}let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select();let n=document.execCommand?.(`copy`);if(t.remove(),!n)throw Error(`Copy command failed`)}_setCopyButtonState(e,t=this._copyButton){if(!t)return;let n={idle:{icon:ae,label:`Copy code`},copied:{icon:oe,label:`Code copied`},error:{icon:se,label:`Copy failed`}},r=n[e]||n.idle;t.dataset.copyState=e,de(t,r.icon,r.label),t===this._copyButton&&(window.clearTimeout(this._copyResetTimer),this._copyResetTimer=window.setTimeout(()=>{this._setCopyButtonState(`idle`)},ne))}_lex(e,t){let n=te(e);return n?n(t):[]}};n(X,`_uid`,0),n(X,`instances`,new Set),n(X,`KNOWN_TYPES`,p),n(X,`_themeInitialized`,!1),X.ensureComponentStyles(),X.registerCustomElement(),typeof document<`u`&&(document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,$,{once:!0}):queueMicrotask($));var Z=X;function Q(e=document){return Z.enhanceAll(e)}function $(){typeof document>`u`||Q(document)}export{J as PIX_HIGHLIGHTER_THEME_OPTIONS,Z as PixHighlighter,Q as enhancePixHighlighters,S as lexBash,w as lexC,T as lexCPP,D as lexCSS,E as lexCSharp,O as lexGo,k as lexHTML,A as lexJS,j as lexJSON,M as lexMarkdown,N as lexPHP,P as lexPython,F as lexRust,I as lexTS,L as lexYAML,h as normalizeLang};