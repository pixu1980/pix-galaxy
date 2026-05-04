// src/components/PixHighlighter/icons/check.svg
var check_default = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12.5 9.2 17 19 7.5"/></svg>\n';

// src/components/PixHighlighter/icons/chevron-down.svg
var chevron_down_default = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m6 9 6 6 6-6"/></svg>\n';

// src/components/PixHighlighter/icons/copy.svg
var copy_default = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><rect width="10" height="10" x="9" y="9" fill="none" stroke="currentColor" stroke-width="1.8" rx="2" ry="2"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"/></svg>\n';

// src/components/PixHighlighter/styles/_ds-tokens.css
var ds_tokens_default = "@layer pix-galaxy {\n  @layer design-system {\n    :root {\n      color-scheme: light dark;\n\n      --pix-ds-color-ink-950: oklch(0.21 0.015 60);\n      --pix-ds-color-ink-800: oklch(0.32 0.017 60);\n      --pix-ds-color-ink-600: oklch(0.5 0.014 62);\n      --pix-ds-color-ink-100: oklch(0.89 0.012 70);\n      --pix-ds-color-ink-050: oklch(0.96 0.01 75);\n      --pix-ds-color-night-950: oklch(0.2 0.02 255);\n      --pix-ds-color-night-900: oklch(0.24 0.024 252);\n      --pix-ds-color-night-800: oklch(0.31 0.028 250);\n      --pix-ds-color-night-600: oklch(0.56 0.022 248);\n      --pix-ds-color-sand-50: oklch(0.985 0.01 85);\n      --pix-ds-color-sand-100: oklch(0.965 0.012 85);\n      --pix-ds-color-sand-200: oklch(0.925 0.016 85);\n      --pix-ds-color-sky-400: oklch(0.78 0.11 228);\n      --pix-ds-color-sky-500: oklch(0.71 0.13 228);\n      --pix-ds-color-sky-300: oklch(0.85 0.08 228);\n      --pix-ds-color-mint-400: oklch(0.84 0.1 170);\n      --pix-ds-color-mint-500: oklch(0.76 0.11 170);\n      --pix-ds-color-coral-400: oklch(0.72 0.13 34);\n      --pix-ds-color-coral-300: oklch(0.81 0.09 34);\n      --pix-ds-color-violet-400: oklch(0.7 0.12 312);\n      --pix-ds-color-violet-300: oklch(0.79 0.085 306);\n      --pix-ds-color-gold-300: oklch(0.88 0.085 95);\n\n      --pix-ds-surface-page: light-dark(var(--pix-ds-color-sand-100), var(--pix-ds-color-night-950));\n      --pix-ds-surface-panel: light-dark(\n        color-mix(in srgb, var(--pix-ds-color-sand-50) 82%, white 18%),\n        color-mix(in srgb, var(--pix-ds-color-night-900) 88%, black 12%)\n      );\n      --pix-ds-surface-elevated: light-dark(\n        color-mix(in srgb, var(--pix-ds-color-sand-50) 92%, white 8%),\n        color-mix(in srgb, var(--pix-ds-color-night-800) 90%, black 10%)\n      );\n      --pix-ds-line-soft: light-dark(\n        color-mix(in srgb, var(--pix-ds-color-ink-950) 12%, white 88%),\n        color-mix(in srgb, var(--pix-ds-color-ink-050) 14%, transparent)\n      );\n      --pix-ds-line-strong: light-dark(\n        color-mix(in srgb, var(--pix-ds-color-ink-950) 24%, white 76%),\n        color-mix(in srgb, var(--pix-ds-color-ink-050) 28%, transparent)\n      );\n      --pix-ds-text-strong: light-dark(var(--pix-ds-color-ink-950), var(--pix-ds-color-ink-050));\n      --pix-ds-text-muted: light-dark(var(--pix-ds-color-ink-600), var(--pix-ds-color-ink-100));\n      --pix-ds-focus: light-dark(\n        color-mix(in srgb, var(--pix-ds-color-sky-500) 54%, white 46%),\n        color-mix(in srgb, var(--pix-ds-color-sky-300) 72%, white 28%)\n      );\n      --pix-ds-accent-primary: light-dark(var(--pix-ds-color-sky-500), var(--pix-ds-color-sky-300));\n      --pix-ds-accent-secondary: light-dark(\n        var(--pix-ds-color-coral-400),\n        var(--pix-ds-color-coral-300)\n      );\n      --pix-ds-accent-tertiary: light-dark(var(--pix-ds-color-mint-500), var(--pix-ds-color-mint-400));\n\n      --pix-ds-font-sans: 'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif;\n      --pix-ds-font-display: 'Fraunces', 'Iowan Old Style', Georgia, serif;\n      --pix-ds-font-mono: 'IBM Plex Mono', 'SFMono-Regular', Menlo, Consolas, monospace;\n\n      --pix-ds-text-xs: 0.75rem;\n      --pix-ds-text-sm: 0.875rem;\n      --pix-ds-text-md: 1rem;\n      --pix-ds-text-lg: 1.125rem;\n      --pix-ds-text-xl: 1.25rem;\n      --pix-ds-leading-tight: 1.1;\n      --pix-ds-leading-normal: 1.6;\n      --pix-ds-leading-relaxed: 1.72;\n      --pix-ds-tracking-wide: 0.14em;\n\n      --pix-ds-space-1: 0.25rem;\n      --pix-ds-space-2: 0.5rem;\n      --pix-ds-space-3: 0.75rem;\n      --pix-ds-space-4: 1rem;\n      --pix-ds-space-5: 1.5rem;\n      --pix-ds-space-6: 2rem;\n      --pix-ds-space-7: 2.5rem;\n      --pix-ds-space-8: 3rem;\n      --pix-ds-space-9: 4rem;\n\n      --pix-ds-radius-sm: 0.5rem;\n      --pix-ds-radius-md: 0.85rem;\n      --pix-ds-radius-lg: 1.25rem;\n      --pix-ds-radius-xl: 1.6rem;\n      --pix-ds-radius-pill: 999px;\n\n      --pix-ds-elevation-1: light-dark(\n        0 12px 28px rgba(54, 39, 22, 0.08),\n        0 16px 34px rgba(0, 0, 0, 0.34)\n      );\n      --pix-ds-elevation-2: light-dark(\n        0 18px 42px rgba(54, 39, 22, 0.12),\n        0 22px 48px rgba(0, 0, 0, 0.42)\n      );\n      --pix-ds-elevation-3: light-dark(\n        0 24px 56px rgba(54, 39, 22, 0.16),\n        0 26px 64px rgba(0, 0, 0, 0.5)\n      );\n\n      --pix-ds-duration-fast: 140ms;\n      --pix-ds-duration-base: 180ms;\n      --pix-ds-duration-slow: 280ms;\n      --pix-ds-ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);\n      --pix-ds-ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);\n      --pix-ds-lift-hover: -1px;\n      --pix-ds-scale-press: 0.985;\n      --pix-ds-focus-ring: 0 0 0 3px var(--pix-ds-focus);\n    }\n  }\n}\n";

// src/components/PixHighlighter/icons/error.svg
var error_default = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" d="M12 7.5V13"/><circle cx="12" cy="16.5" r="1" fill="currentColor"/></svg>\n';

// src/components/PixHighlighter/icons/palette.svg
var palette_default = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.6" d="M12 3c-5 0-9 3.6-9 8.2 0 4.4 3.6 7.8 8 7.8h1.5c.8 0 1.5.6 1.5 1.4 0 .9.7 1.6 1.6 1.6 3 0 5.4-2.7 5.4-6.2C21 8.2 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1.1" fill="currentColor"/><circle cx="10.5" cy="7.5" r="1.1" fill="currentColor"/><circle cx="15" cy="7.8" r="1.1" fill="currentColor"/><circle cx="17" cy="12" r="1.1" fill="currentColor"/></svg>\n';

// src/components/PixHighlighter/PixHighlighter.css
var PixHighlighter_default = '@layer pix-galaxy {\n  @layer pix-highlighter {\n    :root {\n      --pix-highlighter--toolbar-surface: color-mix(in srgb, var(--pix-highlighter--bg) 58%, var(--pix-ds-surface-elevated) 42%);\n      --pix-highlighter--toolbar-border: color-mix(in srgb, var(--pix-highlighter--fg) 40%, transparent);\n      --pix-highlighter--toolbar-color: var(--pix-highlighter--fg);\n      --pix-highlighter--toolbar-field-bg: color-mix(in srgb, var(--pix-highlighter--fg) 18%, var(--pix-highlighter--bg) 82%);\n      --pix-highlighter--toolbar-field-hover-bg: color-mix(in srgb, var(--pix-highlighter--fg) 28%, var(--pix-highlighter--bg) 72%);\n      --pix-highlighter--toolbar-shadow: var(--pix-ds-elevation-2);\n      --pix-highlighter--toolbar-menu-bg: color-mix(\n        in srgb,\n        var(--pix-highlighter--bg) 52%,\n        var(--pix-ds-surface-elevated) 48%\n      );\n      --pix-highlighter--toolbar-menu-accent: color-mix(in srgb, var(--pix-highlighter--fg) 32%, var(--pix-highlighter--bg) 68%);\n      --pix-highlighter--anchor-offset: var(--pix-ds-space-2);\n    }\n\n    ::highlight(pix-kw),\n    pre[is="pix-highlighter"] .pix-token--kw {\n      color: var(--pix-highlighter--kw);\n    }\n\n    ::highlight(pix-str),\n    pre[is="pix-highlighter"] .pix-token--str {\n      color: var(--pix-highlighter--str);\n    }\n\n    ::highlight(pix-num),\n    pre[is="pix-highlighter"] .pix-token--num {\n      color: var(--pix-highlighter--num);\n    }\n\n    ::highlight(pix-com),\n    pre[is="pix-highlighter"] .pix-token--com {\n      color: var(--pix-highlighter--com);\n    }\n\n    ::highlight(pix-id),\n    pre[is="pix-highlighter"] .pix-token--id {\n      color: var(--pix-highlighter--id);\n    }\n\n    ::highlight(pix-fn),\n    pre[is="pix-highlighter"] .pix-token--fn {\n      color: var(--pix-highlighter--fn);\n    }\n\n    ::highlight(pix-op),\n    pre[is="pix-highlighter"] .pix-token--op {\n      color: var(--pix-highlighter--op);\n    }\n\n    ::highlight(pix-tag),\n    pre[is="pix-highlighter"] .pix-token--tag {\n      color: var(--pix-highlighter--tag);\n    }\n\n    ::highlight(pix-attr),\n    pre[is="pix-highlighter"] .pix-token--attr {\n      color: var(--pix-highlighter--attr);\n    }\n\n    ::highlight(pix-key),\n    pre[is="pix-highlighter"] .pix-token--key {\n      color: var(--pix-highlighter--key);\n    }\n\n    ::highlight(pix-var),\n    pre[is="pix-highlighter"] .pix-token--var {\n      color: var(--pix-highlighter--var);\n    }\n\n    ::highlight(pix-mac),\n    pre[is="pix-highlighter"] .pix-token--mac {\n      color: var(--pix-highlighter--mac);\n    }\n\n    ::highlight(pix-pp),\n    pre[is="pix-highlighter"] .pix-token--pp {\n      color: var(--pix-highlighter--pp);\n    }\n\n    ::highlight(pix-prop),\n    pre[is="pix-highlighter"] .pix-token--prop {\n      color: var(--pix-highlighter--prop);\n    }\n\n    ::highlight(pix-type),\n    pre[is="pix-highlighter"] .pix-token--type {\n      color: var(--pix-highlighter--type);\n    }\n\n    ::highlight(pix-mdh),\n    pre[is="pix-highlighter"] .pix-token--mdh {\n      color: var(--pix-highlighter--mdh);\n    }\n\n    ::highlight(pix-mde),\n    pre[is="pix-highlighter"] .pix-token--mde {\n      color: var(--pix-highlighter--mde);\n    }\n\n    ::highlight(pix-mds),\n    pre[is="pix-highlighter"] .pix-token--mds {\n      color: var(--pix-highlighter--mds);\n    }\n\n    ::highlight(pix-mdc),\n    pre[is="pix-highlighter"] .pix-token--mdc {\n      color: var(--pix-highlighter--mdc);\n    }\n\n    ::highlight(pix-mdl),\n    pre[is="pix-highlighter"] .pix-token--mdl {\n      color: var(--pix-highlighter--mdl);\n    }\n\n    ::highlight(pix-mdbq),\n    pre[is="pix-highlighter"] .pix-token--mdbq {\n      color: var(--pix-highlighter--mdbq);\n    }\n\n    ::highlight(pix-mdli),\n    pre[is="pix-highlighter"] .pix-token--mdli {\n      color: var(--pix-highlighter--mdli);\n    }\n\n    ::highlight(pix-mdhr),\n    pre[is="pix-highlighter"] .pix-token--mdhr {\n      color: var(--pix-highlighter--mdhr);\n    }\n\n    ::highlight(pix-mdimg),\n    pre[is="pix-highlighter"] .pix-token--mdimg {\n      color: var(--pix-highlighter--mdimg);\n    }\n\n    pre[is="pix-highlighter"] {\n      position: relative;\n      display: block;\n      overflow: auto;\n      white-space: pre;\n      word-spacing: normal;\n      word-break: normal;\n      word-wrap: normal;\n      hyphens: none;\n      padding: calc(var(--pix-ds-space-8) + var(--pix-ds-space-1)) var(--pix-ds-space-4) var(--pix-ds-space-4);\n      border: 1px solid color-mix(in srgb, var(--pix-highlighter--fg) 10%, transparent);\n      border-radius: var(--pix-ds-radius-lg);\n      background-color: var(--pix-highlighter--bg);\n      color: var(--pix-highlighter--fg);\n      font-family: var(--pix-highlighter--font-family, var(--pix-ds-font-mono));\n      font-size: var(--pix-ds-text-md);\n      line-height: var(--pix-highlighter--line-height, var(--pix-ds-leading-normal));\n      tab-size: var(--pix-highlighter--tab-size, 2);\n      text-shadow: var(--pix-highlighter--text-shadow, none);\n      box-shadow: var(--pix-ds-elevation-1);\n      scrollbar-color: color-mix(in srgb, var(--pix-highlighter--fg) 26%, transparent) transparent;\n      color-scheme: inherit;\n    }\n\n    pre[is="pix-highlighter"] code {\n      display: block;\n      color: inherit;\n      background: transparent;\n    }\n\n    pre[is="pix-highlighter"] .pix-highlighter__sr-only {\n      position: absolute;\n      width: 1px;\n      height: 1px;\n      padding: 0;\n      margin: -1px;\n      overflow: hidden;\n      clip: rect(0, 0, 0, 0);\n      white-space: nowrap;\n      border: 0;\n    }\n\n    pre[is="pix-highlighter"] [data-pix-highlighter-toolbar] {\n      position: absolute;\n      inset-block-start: var(--pix-ds-space-3);\n      inset-inline: var(--pix-ds-space-3);\n      z-index: 2;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: var(--pix-ds-space-3);\n      white-space: normal;\n      font-family: var(--pix-ds-font-sans);\n    }\n\n    pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker] {\n      position: relative;\n      margin: 0;\n      z-index: 3;\n    }\n\n    pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker] > summary::-webkit-details-marker {\n      display: none;\n    }\n\n    pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker] > summary,\n    pre[is="pix-highlighter"] button[data-pix-highlighter-copy] {\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      gap: var(--pix-ds-space-2);\n      min-height: 2.75rem;\n      min-width: 2.75rem;\n      padding: 0.55rem 0.95rem;\n      border: 1px solid var(--pix-highlighter--toolbar-border);\n      border-radius: var(--pix-ds-radius-pill);\n      background:\n        linear-gradient(\n          180deg,\n          color-mix(in srgb, var(--pix-highlighter--toolbar-surface) 64%, white 36%),\n          var(--pix-highlighter--toolbar-surface)\n        );\n      box-shadow:\n        inset 0 1px 0 color-mix(in srgb, var(--pix-highlighter--fg) 14%, white 86%),\n        var(--pix-highlighter--toolbar-shadow);\n      color: var(--pix-highlighter--toolbar-color);\n      font: inherit;\n      font-weight: 600;\n      outline: 2px solid transparent;\n      outline-offset: 2px;\n      cursor: pointer;\n      touch-action: manipulation;\n      transition:\n        background-color var(--pix-ds-duration-base) var(--pix-ds-ease-standard),\n        border-color var(--pix-ds-duration-base) var(--pix-ds-ease-standard),\n        color var(--pix-ds-duration-base) var(--pix-ds-ease-standard),\n        transform var(--pix-ds-duration-fast) var(--pix-ds-ease-emphasized),\n        box-shadow var(--pix-ds-duration-fast) var(--pix-ds-ease-standard);\n    }\n\n    pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker] > summary {\n      appearance: none;\n      list-style: none;\n      user-select: none;\n      position: relative;\n    }\n\n    pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker][open] {\n      z-index: 4;\n    }\n\n    pre[is="pix-highlighter"] [data-pix-highlighter-theme-value] {\n      font-size: var(--pix-ds-text-sm);\n      font-weight: 600;\n      line-height: 1;\n    }\n\n    pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker] > summary svg,\n    pre[is="pix-highlighter"] button[data-pix-highlighter-copy] svg {\n      width: 1rem;\n      height: 1rem;\n      flex: 0 0 1rem;\n    }\n\n    pre[is="pix-highlighter"] [data-pix-highlighter-theme-chevron] {\n      display: inline-flex;\n      margin-inline-start: 0.1rem;\n      transition: transform var(--pix-ds-duration-fast) var(--pix-ds-ease-emphasized);\n    }\n\n    pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker][open] [data-pix-highlighter-theme-chevron] {\n      transform: rotate(180deg);\n    }\n\n    pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker] > summary:hover,\n    pre[is="pix-highlighter"] button[data-pix-highlighter-copy]:hover:not(:disabled) {\n      border-color: color-mix(in srgb, var(--pix-highlighter--toolbar-color) 46%, transparent);\n      background:\n        linear-gradient(\n          180deg,\n          color-mix(in srgb, var(--pix-highlighter--toolbar-field-hover-bg) 72%, white 28%),\n          var(--pix-highlighter--toolbar-field-hover-bg)\n        );\n      transform: translateY(var(--pix-ds-lift-hover));\n    }\n\n    pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker][open] > summary {\n      border-color: color-mix(in srgb, var(--pix-highlighter--toolbar-color) 52%, transparent);\n      background:\n        linear-gradient(\n          180deg,\n          color-mix(in srgb, var(--pix-highlighter--toolbar-field-hover-bg) 68%, white 32%),\n          var(--pix-highlighter--toolbar-field-bg)\n        );\n    }\n\n    pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker] > summary:active,\n    pre[is="pix-highlighter"] button[data-pix-highlighter-copy]:active:not(:disabled) {\n      transform: scale(var(--pix-ds-scale-press));\n    }\n\n    pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker] > summary:focus-visible,\n    pre[is="pix-highlighter"] button[data-pix-highlighter-copy]:focus-visible,\n    button[data-pix-highlighter-theme-option]:focus-visible {\n      outline-color: var(--pix-ds-focus);\n      border-color: color-mix(in srgb, var(--pix-ds-focus) 70%, var(--pix-highlighter--toolbar-color) 30%);\n      box-shadow: var(--pix-ds-focus-ring), var(--pix-highlighter--toolbar-shadow);\n    }\n\n    [data-pix-highlighter-floating-layer] {\n      position: fixed;\n      inset: 0;\n      pointer-events: none;\n      z-index: 2147483600;\n      isolation: isolate;\n    }\n\n    [data-pix-highlighter-theme-list] {\n      position: fixed;\n      inset: auto;\n      z-index: 1;\n      pointer-events: auto;\n      display: block;\n      min-width: 14rem;\n      max-width: min(22rem, calc(100vw - 1.5rem));\n      overflow: auto;\n      scrollbar-gutter: stable;\n      padding: var(--pix-ds-space-2);\n      margin: 0;\n      border: 1px solid var(--pix-highlighter--toolbar-border);\n      border-radius: var(--pix-ds-radius-lg);\n      background:\n        linear-gradient(\n          180deg,\n          color-mix(in srgb, var(--pix-highlighter--toolbar-menu-bg) 66%, white 34%),\n          var(--pix-highlighter--toolbar-menu-bg)\n        );\n      box-shadow:\n        inset 0 1px 0 color-mix(in srgb, var(--pix-highlighter--fg) 12%, white 88%),\n        var(--pix-highlighter--toolbar-shadow);\n      color: var(--pix-highlighter--toolbar-color, var(--pix-ds-text-strong));\n      font-family: var(--pix-ds-font-sans);\n    }\n\n    [data-pix-highlighter-theme-list]:focus-within {\n      box-shadow: var(--pix-ds-focus-ring), var(--pix-highlighter--toolbar-shadow);\n    }\n\n    [data-pix-highlighter-theme-list] menu {\n      display: grid;\n      gap: var(--pix-ds-space-1);\n      padding: 0;\n      margin: 0;\n      background: transparent;\n      border: 0;\n      list-style: none;\n    }\n\n    [data-pix-highlighter-theme-list][hidden] {\n      display: none;\n    }\n\n    @supports (anchor-name: --pix-highlighter--anchor) and (position-anchor: --pix-highlighter--anchor) {\n      [data-pix-highlighter-theme-list] {\n        left: anchor(left);\n        top: calc(anchor(bottom) + var(--pix-highlighter--anchor-offset));\n        min-width: max(14rem, anchor-size(width));\n        max-height: min(22rem, calc(100vh - 1.5rem));\n        position-try-fallbacks: flip-block, flip-inline;\n      }\n    }\n\n    button[data-pix-highlighter-theme-option] {\n      display: grid;\n      grid-template-columns: 1fr auto;\n      align-items: center;\n      width: 100%;\n      gap: var(--pix-ds-space-3);\n      min-height: 2.75rem;\n      padding: 0.55rem 0.75rem;\n      border: 1px solid transparent;\n      border-radius: var(--pix-ds-radius-md);\n      background:\n        linear-gradient(\n          180deg,\n          color-mix(in srgb, var(--pix-highlighter--toolbar-menu-bg) 76%, white 24%),\n          color-mix(in srgb, var(--pix-highlighter--toolbar-menu-bg) 90%, black 10%)\n        );\n      color: var(--pix-highlighter--toolbar-color);\n      font: inherit;\n      font-size: var(--pix-ds-text-sm);\n      font-weight: 600;\n      text-align: left;\n      outline: 2px solid transparent;\n      outline-offset: 2px;\n      cursor: pointer;\n      touch-action: manipulation;\n      transition:\n        background-color var(--pix-ds-duration-fast) var(--pix-ds-ease-standard),\n        border-color var(--pix-ds-duration-fast) var(--pix-ds-ease-standard),\n        color var(--pix-ds-duration-fast) var(--pix-ds-ease-standard),\n        transform var(--pix-ds-duration-fast) var(--pix-ds-ease-emphasized);\n    }\n\n    button[data-pix-highlighter-theme-option] span:last-child {\n      opacity: 0.56;\n      font-size: 0.72rem;\n      letter-spacing: var(--pix-ds-tracking-wide);\n      text-transform: uppercase;\n    }\n\n    button[data-pix-highlighter-theme-option]:hover,\n    button[data-pix-highlighter-theme-option][data-selected] {\n      border-color: var(--pix-highlighter--toolbar-border);\n      background:\n        linear-gradient(\n          180deg,\n          color-mix(in srgb, var(--pix-highlighter--toolbar-menu-accent) 72%, white 28%),\n          var(--pix-highlighter--toolbar-menu-accent)\n        );\n      box-shadow: inset 0 1px 0 color-mix(in srgb, var(--pix-highlighter--fg) 10%, white 90%);\n      transform: translateY(var(--pix-ds-lift-hover));\n    }\n\n    pre[is="pix-highlighter"] button[data-pix-highlighter-copy] {\n      width: 2.75rem;\n      min-width: 2.75rem;\n      padding-inline: 0;\n    }\n\n    pre[is="pix-highlighter"] button[data-pix-highlighter-copy][data-copy-state="copied"] {\n      color: color-mix(in srgb, var(--pix-highlighter--fg) 92%, #7dffca 8%);\n    }\n\n    pre[is="pix-highlighter"] button[data-pix-highlighter-copy][data-copy-state="error"] {\n      color: color-mix(in srgb, var(--pix-highlighter--fg) 84%, #ff7f7f 16%);\n    }\n\n    pre[is="pix-highlighter"] button[data-pix-highlighter-copy]:disabled {\n      cursor: not-allowed;\n      opacity: 0.6;\n    }\n\n    @media (max-width: 40rem) {\n      pre[is="pix-highlighter"] {\n        padding-top: calc(var(--pix-ds-space-8) + var(--pix-ds-space-7));\n      }\n\n      pre[is="pix-highlighter"] [data-pix-highlighter-toolbar] {\n        flex-direction: column;\n        align-items: stretch;\n      }\n\n      pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker] > summary,\n      pre[is="pix-highlighter"] button[data-pix-highlighter-copy] {\n        width: 100%;\n      }\n\n      pre[is="pix-highlighter"] button[data-pix-highlighter-copy] {\n        min-width: 100%;\n      }\n\n      [data-pix-highlighter-theme-list] {\n        max-width: calc(100vw - 1.5rem);\n      }\n    }\n\n    @media (prefers-reduced-motion: reduce) {\n      pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker] > summary,\n      pre[is="pix-highlighter"] button[data-pix-highlighter-copy],\n      button[data-pix-highlighter-theme-option] {\n        transition: none;\n      }\n\n      pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker] > summary:hover,\n      pre[is="pix-highlighter"] button[data-pix-highlighter-copy]:hover:not(:disabled),\n      button[data-pix-highlighter-theme-option]:hover,\n      button[data-pix-highlighter-theme-option][data-selected],\n      pre[is="pix-highlighter"] details[data-pix-highlighter-theme-picker] > summary:active,\n      pre[is="pix-highlighter"] button[data-pix-highlighter-copy]:active:not(:disabled) {\n        transform: none;\n      }\n    }\n  }\n}\n';

// src/components/PixHighlighter/styles/themes/_aurora.css
var aurora_default = '@layer pix-galaxy {\n  @layer pix-highlighter {\n    @layer themes {\n      :root[data-pix-highlighter-theme="aurora"] pre[is="pix-highlighter"] {\n        --pix-highlighter--bg: light-dark(#f5fbff, #09161d);\n        --pix-highlighter--fg: light-dark(#183042, #e8f7ff);\n        --pix-highlighter--kw: light-dark(#0284c7, #80d4ff);\n        --pix-highlighter--str: light-dark(#b45309, #ffd166);\n        --pix-highlighter--num: light-dark(#dc2626, #ff7b72);\n        --pix-highlighter--com: light-dark(#6f8ea0, #6f8ea0);\n        --pix-highlighter--id: light-dark(#0f766e, #9bf6ff);\n        --pix-highlighter--fn: light-dark(#0f766e, #5eead4);\n        --pix-highlighter--op: light-dark(#0f766e, #9ae6b4);\n        --pix-highlighter--tag: light-dark(#0ea5b7, #64dfdf);\n        --pix-highlighter--attr: light-dark(#c2410c, #ffb86c);\n        --pix-highlighter--key: light-dark(#7c3aed, #b8f2e6);\n        --pix-highlighter--var: light-dark(#0f766e, #9bf6ff);\n        --pix-highlighter--mac: light-dark(#8b5cf6, #d0bfff);\n        --pix-highlighter--pp: light-dark(#6f8ea0, #bde0fe);\n        --pix-highlighter--prop: light-dark(#0ea5b7, #9bf6ff);\n        --pix-highlighter--type: light-dark(#059669, #7ef7c9);\n        --pix-highlighter--mdh: light-dark(#0284c7, #80d4ff);\n        --pix-highlighter--mde: light-dark(#c2410c, #ffb86c);\n        --pix-highlighter--mds: light-dark(#183042, #ffd166);\n        --pix-highlighter--mdc: light-dark(#0f766e, #5eead4);\n        --pix-highlighter--mdl: light-dark(#0ea5b7, #64dfdf);\n        --pix-highlighter--mdbq: light-dark(#6f8ea0, #9fb3c8);\n        --pix-highlighter--mdli: light-dark(#0f766e, #9bf6ff);\n        --pix-highlighter--mdhr: light-dark(#c7ddea, #35506a);\n        --pix-highlighter--mdimg: light-dark(#8b5cf6, #bde0fe);\n        --pix-highlighter--tab-size: 2;\n        --pix-highlighter--line-height: 1.55;\n        --pix-highlighter--text-shadow: none;\n        color-scheme: light dark;\n      }\n    }\n  }\n}\n';

// src/components/PixHighlighter/styles/themes/_atlas.css
var atlas_default = '@layer pix-galaxy {\n  @layer pix-highlighter {\n    @layer themes {\n      :root[data-pix-highlighter-theme="atlas"] pre[is="pix-highlighter"] {\n        --pix-highlighter--bg: light-dark(#f5f1e8, #18130f);\n        --pix-highlighter--fg: light-dark(#2d251d, #f8ede2);\n        --pix-highlighter--kw: light-dark(#9a3412, #f3a66c);\n        --pix-highlighter--str: light-dark(#0f766e, #6ee7d4);\n        --pix-highlighter--num: light-dark(#c2410c, #fb923c);\n        --pix-highlighter--com: light-dark(#7c6f64, #b6a999);\n        --pix-highlighter--id: light-dark(#2563eb, #93c5fd);\n        --pix-highlighter--fn: light-dark(#1d4ed8, #60a5fa);\n        --pix-highlighter--op: light-dark(#6b7280, #d1d5db);\n        --pix-highlighter--tag: light-dark(#be123c, #fb7185);\n        --pix-highlighter--attr: light-dark(#0369a1, #7dd3fc);\n        --pix-highlighter--key: light-dark(#7c3aed, #c4b5fd);\n        --pix-highlighter--var: light-dark(#2563eb, #93c5fd);\n        --pix-highlighter--mac: light-dark(#c026d3, #f0abfc);\n        --pix-highlighter--pp: light-dark(#64748b, #cbd5e1);\n        --pix-highlighter--prop: light-dark(#2563eb, #93c5fd);\n        --pix-highlighter--type: light-dark(#047857, #86efac);\n        --pix-highlighter--mdh: light-dark(#9a3412, #f3a66c);\n        --pix-highlighter--mde: light-dark(#7c3aed, #c4b5fd);\n        --pix-highlighter--mds: light-dark(#2d251d, #f8ede2);\n        --pix-highlighter--mdc: light-dark(#0f766e, #6ee7d4);\n        --pix-highlighter--mdl: light-dark(#1d4ed8, #60a5fa);\n        --pix-highlighter--mdbq: light-dark(#7c6f64, #b6a999);\n        --pix-highlighter--mdli: light-dark(#2563eb, #93c5fd);\n        --pix-highlighter--mdhr: light-dark(#cbd5e1, #4b3b2d);\n        --pix-highlighter--mdimg: light-dark(#0369a1, #7dd3fc);\n        --pix-highlighter--tab-size: 2;\n        --pix-highlighter--line-height: 1.55;\n        --pix-highlighter--text-shadow: none;\n        color-scheme: light dark;\n      }\n    }\n  }\n}\n';

// src/components/PixHighlighter/styles/themes/_cyberpunk.css
var cyberpunk_default = '@layer pix-galaxy {\n  @layer pix-highlighter {\n    @layer themes {\n      :root[data-pix-highlighter-theme="cyberpunk"] pre[is="pix-highlighter"] {\n        --pix-highlighter--bg: light-dark(#fff4fd, #090412);\n        --pix-highlighter--fg: light-dark(#2f1140, #f9f7ff);\n        --pix-highlighter--kw: light-dark(#c026d3, #ff4fd8);\n        --pix-highlighter--str: light-dark(#ca8a04, #ffe45e);\n        --pix-highlighter--num: light-dark(#0891b2, #62f3ff);\n        --pix-highlighter--com: light-dark(#8b7aa8, #8b7aa8);\n        --pix-highlighter--id: light-dark(#0f9f7f, #7ef7c9);\n        --pix-highlighter--fn: light-dark(#00a896, #00f5d4);\n        --pix-highlighter--op: light-dark(#ea580c, #ff8b39);\n        --pix-highlighter--tag: light-dark(#db2777, #ff4fd8);\n        --pix-highlighter--attr: light-dark(#0284c7, #4cc9f0);\n        --pix-highlighter--key: light-dark(#0891b2, #62f3ff);\n        --pix-highlighter--var: light-dark(#0f9f7f, #7ef7c9);\n        --pix-highlighter--mac: light-dark(#db2777, #ff6ad5);\n        --pix-highlighter--pp: light-dark(#ea580c, #ff9f1c);\n        --pix-highlighter--prop: light-dark(#7c3aed, #9d7dff);\n        --pix-highlighter--type: light-dark(#0284c7, #4cc9f0);\n        --pix-highlighter--mdh: light-dark(#c026d3, #ff4fd8);\n        --pix-highlighter--mde: light-dark(#ea580c, #ff8b39);\n        --pix-highlighter--mds: light-dark(#ca8a04, #ffe45e);\n        --pix-highlighter--mdc: light-dark(#0891b2, #62f3ff);\n        --pix-highlighter--mdl: light-dark(#0f9f7f, #7ef7c9);\n        --pix-highlighter--mdbq: light-dark(#8b7aa8, #a59ac7);\n        --pix-highlighter--mdli: light-dark(#ea580c, #ff9f1c);\n        --pix-highlighter--mdhr: light-dark(#eadcf8, #453363);\n        --pix-highlighter--mdimg: light-dark(#0284c7, #4cc9f0);\n        --pix-highlighter--tab-size: 2;\n        --pix-highlighter--line-height: 1.55;\n        --pix-highlighter--text-shadow: light-dark(none, 0 0 18px rgba(255, 79, 216, 0.18));\n        color-scheme: light dark;\n      }\n    }\n  }\n}\n';

// src/components/PixHighlighter/styles/themes/_darcula.css
var darcula_default = '@layer pix-galaxy {\n  @layer pix-highlighter {\n    @layer themes {\n      :root[data-pix-highlighter-theme="darcula"] pre[is="pix-highlighter"] {\n        --pix-highlighter--bg: light-dark(#f4f5f7, #2b2b2b);\n        --pix-highlighter--fg: light-dark(#2f3136, #a9b7c6);\n        --pix-highlighter--kw: light-dark(#c05621, #cc7832);\n        --pix-highlighter--str: light-dark(#4d7c0f, #6a8759);\n        --pix-highlighter--num: light-dark(#2563eb, #6897bb);\n        --pix-highlighter--com: light-dark(#808080, #808080);\n        --pix-highlighter--id: light-dark(#7c3aed, #9876aa);\n        --pix-highlighter--fn: light-dark(#0284c7, #56a8f5);\n        --pix-highlighter--op: light-dark(#2f3136, #a9b7c6);\n        --pix-highlighter--tag: light-dark(#b45309, #e8bf6a);\n        --pix-highlighter--attr: light-dark(#57534e, #bababa);\n        --pix-highlighter--key: light-dark(#7c3aed, #9876aa);\n        --pix-highlighter--var: light-dark(#7c3aed, #9876aa);\n        --pix-highlighter--mac: light-dark(#7c6f00, #bbb529);\n        --pix-highlighter--pp: light-dark(#b45309, #ffc66d);\n        --pix-highlighter--prop: light-dark(#b45309, #ffc66d);\n        --pix-highlighter--type: light-dark(#2563eb, #a9b7c6);\n        --pix-highlighter--mdh: light-dark(#b45309, #ffc66d);\n        --pix-highlighter--mde: light-dark(#c05621, #cc7832);\n        --pix-highlighter--mds: light-dark(#2f3136, #e8bf6a);\n        --pix-highlighter--mdc: light-dark(#4d7c0f, #6a8759);\n        --pix-highlighter--mdl: light-dark(#2563eb, #6897bb);\n        --pix-highlighter--mdbq: light-dark(#808080, #808080);\n        --pix-highlighter--mdli: light-dark(#7c3aed, #9876aa);\n        --pix-highlighter--mdhr: light-dark(#d4d4d8, #5c6370);\n        --pix-highlighter--mdimg: light-dark(#7c6f00, #bbb529);\n        --pix-highlighter--tab-size: 2;\n        --pix-highlighter--line-height: 1.55;\n        --pix-highlighter--text-shadow: none;\n        color-scheme: light dark;\n      }\n    }\n  }\n}\n';

// src/components/PixHighlighter/styles/themes/_default.css
var default_default = '@layer pix-galaxy {\n  @layer pix-highlighter {\n    @layer themes {\n      :root:not([data-pix-highlighter-theme]) pre[is="pix-highlighter"],\n      :root[data-pix-highlighter-theme="default"] pre[is="pix-highlighter"] {\n        --pix-highlighter--bg: light-dark(#f5f7fb, #0b0d10);\n        --pix-highlighter--fg: light-dark(#182131, #e6e6e6);\n        --pix-highlighter--kw: light-dark(#6d28d9, #c792ea);\n        --pix-highlighter--str: light-dark(#a45a00, #ecc48d);\n        --pix-highlighter--num: light-dark(#c05621, #f78c6c);\n        --pix-highlighter--com: light-dark(#66758a, #697098);\n        --pix-highlighter--id: light-dark(#2563eb, #82aaff);\n        --pix-highlighter--fn: light-dark(#0f766e, #80cbc4);\n        --pix-highlighter--op: light-dark(#3f7a14, #c3e88d);\n        --pix-highlighter--tag: light-dark(#0f766e, #5ad4e6);\n        --pix-highlighter--attr: light-dark(#b45309, #f2ae49);\n        --pix-highlighter--key: light-dark(#6d28d9, #ffcc66);\n        --pix-highlighter--var: light-dark(#2563eb, #82aaff);\n        --pix-highlighter--mac: light-dark(#be185d, #ff9dd9);\n        --pix-highlighter--pp: light-dark(#66758a, #8bd5ff);\n        --pix-highlighter--prop: light-dark(#2563eb, #9cdcfe);\n        --pix-highlighter--type: light-dark(#0f766e, #7fd5a3);\n        --pix-highlighter--mdh: light-dark(#0f766e, #5ad4e6);\n        --pix-highlighter--mde: light-dark(#6d28d9, #f2ae49);\n        --pix-highlighter--mds: light-dark(#182131, #ffd166);\n        --pix-highlighter--mdc: light-dark(#3f7a14, #c3e88d);\n        --pix-highlighter--mdl: light-dark(#2563eb, #80cbc4);\n        --pix-highlighter--mdbq: light-dark(#66758a, #a0a7bd);\n        --pix-highlighter--mdli: light-dark(#2563eb, #b3e5fc);\n        --pix-highlighter--mdhr: light-dark(#cbd5e1, #6c7a89);\n        --pix-highlighter--mdimg: light-dark(#be185d, #90caf9);\n        --pix-highlighter--tab-size: 2;\n        --pix-highlighter--line-height: 1.5;\n        --pix-highlighter--text-shadow: none;\n        color-scheme: light dark;\n      }\n    }\n  }\n}\n';

// src/components/PixHighlighter/styles/themes/_ember.css
var ember_default = '@layer pix-galaxy {\n  @layer pix-highlighter {\n    @layer themes {\n      :root[data-pix-highlighter-theme="ember"] pre[is="pix-highlighter"] {\n        --pix-highlighter--bg: light-dark(#fff7f1, #1b1410);\n        --pix-highlighter--fg: light-dark(#3b2217, #f7ede2);\n        --pix-highlighter--kw: light-dark(#dc2626, #ff7b72);\n        --pix-highlighter--str: light-dark(#b45309, #ffd166);\n        --pix-highlighter--num: light-dark(#ea580c, #ff9f1c);\n        --pix-highlighter--com: light-dark(#8d7462, #8d7462);\n        --pix-highlighter--id: light-dark(#0284c7, #67e8f9);\n        --pix-highlighter--fn: light-dark(#0284c7, #67e8f9);\n        --pix-highlighter--op: light-dark(#ca8a04, #fbbf24);\n        --pix-highlighter--tag: light-dark(#ea580c, #f97316);\n        --pix-highlighter--attr: light-dark(#0891b2, #22d3ee);\n        --pix-highlighter--key: light-dark(#e11d48, #fb7185);\n        --pix-highlighter--var: light-dark(#0284c7, #67e8f9);\n        --pix-highlighter--mac: light-dark(#db2777, #f472b6);\n        --pix-highlighter--pp: light-dark(#ca8a04, #fde68a);\n        --pix-highlighter--prop: light-dark(#e11d48, #fca5a5);\n        --pix-highlighter--type: light-dark(#0f766e, #5eead4);\n        --pix-highlighter--mdh: light-dark(#dc2626, #ff7b72);\n        --pix-highlighter--mde: light-dark(#ea580c, #f97316);\n        --pix-highlighter--mds: light-dark(#b45309, #ffd166);\n        --pix-highlighter--mdc: light-dark(#0284c7, #67e8f9);\n        --pix-highlighter--mdl: light-dark(#0891b2, #22d3ee);\n        --pix-highlighter--mdbq: light-dark(#8d7462, #baa08f);\n        --pix-highlighter--mdli: light-dark(#0284c7, #67e8f9);\n        --pix-highlighter--mdhr: light-dark(#edd4c0, #5f4538);\n        --pix-highlighter--mdimg: light-dark(#e11d48, #fb7185);\n        --pix-highlighter--tab-size: 2;\n        --pix-highlighter--line-height: 1.55;\n        --pix-highlighter--text-shadow: light-dark(none, 0 0 20px rgba(255, 123, 114, 0.08));\n        color-scheme: light dark;\n      }\n    }\n  }\n}\n';

// src/components/PixHighlighter/styles/themes/_paper.css
var paper_default = '@layer pix-galaxy {\n  @layer pix-highlighter {\n    @layer themes {\n      :root[data-pix-highlighter-theme="paper"] pre[is="pix-highlighter"] {\n        --pix-highlighter--bg: light-dark(#fcfbf7, #1f1d1b);\n        --pix-highlighter--fg: light-dark(#2b2a28, #f6f0e8);\n        --pix-highlighter--kw: light-dark(#8f2d56, #f2a7c4);\n        --pix-highlighter--str: light-dark(#166534, #8de0b4);\n        --pix-highlighter--num: light-dark(#c2410c, #f6a97a);\n        --pix-highlighter--com: light-dark(#7a7a73, #b2aba0);\n        --pix-highlighter--id: light-dark(#2563eb, #93c5fd);\n        --pix-highlighter--fn: light-dark(#0f766e, #7dd3c7);\n        --pix-highlighter--op: light-dark(#5b21b6, #c4b5fd);\n        --pix-highlighter--tag: light-dark(#9a3412, #fdba74);\n        --pix-highlighter--attr: light-dark(#0369a1, #7dd3fc);\n        --pix-highlighter--key: light-dark(#7c3aed, #c4b5fd);\n        --pix-highlighter--var: light-dark(#2563eb, #93c5fd);\n        --pix-highlighter--mac: light-dark(#be185d, #f9a8d4);\n        --pix-highlighter--pp: light-dark(#6b7280, #b2aba0);\n        --pix-highlighter--prop: light-dark(#2563eb, #93c5fd);\n        --pix-highlighter--type: light-dark(#047857, #86efac);\n        --pix-highlighter--mdh: light-dark(#8f2d56, #f2a7c4);\n        --pix-highlighter--mde: light-dark(#5b21b6, #c4b5fd);\n        --pix-highlighter--mds: light-dark(#2b2a28, #f6f0e8);\n        --pix-highlighter--mdc: light-dark(#166534, #8de0b4);\n        --pix-highlighter--mdl: light-dark(#0369a1, #7dd3fc);\n        --pix-highlighter--mdbq: light-dark(#7a7a73, #b2aba0);\n        --pix-highlighter--mdli: light-dark(#2563eb, #93c5fd);\n        --pix-highlighter--mdhr: light-dark(#d6d3d1, #4b4741);\n        --pix-highlighter--mdimg: light-dark(#be185d, #f9a8d4);\n        --pix-highlighter--tab-size: 2;\n        --pix-highlighter--font-family: "IBM Plex Mono", "SFMono-Regular", Menlo, Consolas, monospace;\n        --pix-highlighter--line-height: 1.6;\n        --pix-highlighter--text-shadow: none;\n        color-scheme: light dark;\n      }\n    }\n  }\n}\n';

// src/components/PixHighlighter/styles/themes/_prettylights.css
var prettylights_default = '@layer pix-galaxy {\n  @layer pix-highlighter {\n    @layer themes {\n      :root[data-pix-highlighter-theme="prettylights"] pre[is="pix-highlighter"] {\n        --pix-highlighter--bg: light-dark(#f6f8fa, #151b23);\n        --pix-highlighter--fg: light-dark(#1f2328, #f0f6fc);\n        --pix-highlighter--kw: light-dark(#cf222e, #ff7b72);\n        --pix-highlighter--str: light-dark(#0a3069, #a5d6ff);\n        --pix-highlighter--num: light-dark(#1f2328, #f0f6fc);\n        --pix-highlighter--com: light-dark(#59636e, #9198a1);\n        --pix-highlighter--id: light-dark(#0969da, #79c0ff);\n        --pix-highlighter--fn: light-dark(#8250df, #79c0ff);\n        --pix-highlighter--op: light-dark(#0550ae, #79c0ff);\n        --pix-highlighter--tag: light-dark(#0550ae, #7ee787);\n        --pix-highlighter--attr: light-dark(#0550ae, #79c0ff);\n        --pix-highlighter--key: light-dark(#0550ae, #7ee787);\n        --pix-highlighter--var: light-dark(#0969da, #79c0ff);\n        --pix-highlighter--mac: light-dark(#6639ba, #d2a8ff);\n        --pix-highlighter--pp: light-dark(#59636e, #9198a1);\n        --pix-highlighter--prop: light-dark(#0550ae, #7ee787);\n        --pix-highlighter--type: light-dark(#6639ba, #d2a8ff);\n        --pix-highlighter--mdh: light-dark(#0550ae, #1f6feb);\n        --pix-highlighter--mde: light-dark(#6639ba, #d2a8ff);\n        --pix-highlighter--mds: light-dark(#1f2328, #f0f6fc);\n        --pix-highlighter--mdc: light-dark(#116329, #7ee787);\n        --pix-highlighter--mdl: light-dark(#0a3069, #a5d6ff);\n        --pix-highlighter--mdbq: light-dark(#59636e, #9198a1);\n        --pix-highlighter--mdli: light-dark(#953800, #ffa657);\n        --pix-highlighter--mdhr: light-dark(#59636e, #9198a1);\n        --pix-highlighter--mdimg: light-dark(#953800, #ffa657);\n        --pix-highlighter--tab-size: 2;\n        --pix-highlighter--line-height: 1.6;\n        --pix-highlighter--text-shadow: none;\n        color-scheme: light dark;\n      }\n    }\n  }\n}\n';

// src/components/PixHighlighter/styles/themes/_prism.css
var prism_default = '@layer pix-galaxy {\n  @layer pix-highlighter {\n    @layer themes {\n      :root[data-pix-highlighter-theme="prism"] pre[is="pix-highlighter"] {\n        --pix-highlighter--bg: light-dark(#f5f2f0, #16181d);\n        --pix-highlighter--fg: light-dark(#111111, #f3f4f6);\n        --pix-highlighter--kw: light-dark(#0077aa, #7dd3fc);\n        --pix-highlighter--str: light-dark(#669900, #a3e635);\n        --pix-highlighter--num: light-dark(#990055, #f472b6);\n        --pix-highlighter--com: light-dark(#708090, #94a3b8);\n        --pix-highlighter--id: light-dark(#0f766e, #67e8f9);\n        --pix-highlighter--fn: light-dark(#dd4a68, #fb7185);\n        --pix-highlighter--op: light-dark(#9a6e3a, #fde68a);\n        --pix-highlighter--tag: light-dark(#990055, #f472b6);\n        --pix-highlighter--attr: light-dark(#669900, #a3e635);\n        --pix-highlighter--key: light-dark(#990055, #c084fc);\n        --pix-highlighter--var: light-dark(#0f766e, #67e8f9);\n        --pix-highlighter--mac: light-dark(#dd4a68, #fb7185);\n        --pix-highlighter--pp: light-dark(#708090, #94a3b8);\n        --pix-highlighter--prop: light-dark(#0f766e, #67e8f9);\n        --pix-highlighter--type: light-dark(#dd4a68, #fb7185);\n        --pix-highlighter--mdh: light-dark(#0077aa, #7dd3fc);\n        --pix-highlighter--mde: light-dark(#dd4a68, #fb7185);\n        --pix-highlighter--mds: light-dark(#111111, #f3f4f6);\n        --pix-highlighter--mdc: light-dark(#669900, #a3e635);\n        --pix-highlighter--mdl: light-dark(#0077aa, #7dd3fc);\n        --pix-highlighter--mdbq: light-dark(#708090, #94a3b8);\n        --pix-highlighter--mdli: light-dark(#990055, #c084fc);\n        --pix-highlighter--mdhr: light-dark(#999999, #475569);\n        --pix-highlighter--mdimg: light-dark(#ee9900, #fbbf24);\n        --pix-highlighter--tab-size: 2;\n        --pix-highlighter--font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;\n        --pix-highlighter--line-height: 1.5;\n        --pix-highlighter--text-shadow: light-dark(0 1px white, none);\n        color-scheme: light dark;\n      }\n    }\n  }\n}\n';

// src/components/PixHighlighter/styles/themes/_tide.css
var tide_default = '@layer pix-galaxy {\n  @layer pix-highlighter {\n    @layer themes {\n      :root[data-pix-highlighter-theme="tide"] pre[is="pix-highlighter"] {\n        --pix-highlighter--bg: light-dark(#f2f8ff, #081523);\n        --pix-highlighter--fg: light-dark(#102235, #e0f2fe);\n        --pix-highlighter--kw: light-dark(#0369a1, #7dd3fc);\n        --pix-highlighter--str: light-dark(#b45309, #fde68a);\n        --pix-highlighter--num: light-dark(#be123c, #fca5a5);\n        --pix-highlighter--com: light-dark(#5b7c99, #5b7c99);\n        --pix-highlighter--id: light-dark(#0f766e, #86efac);\n        --pix-highlighter--fn: light-dark(#0f766e, #2dd4bf);\n        --pix-highlighter--op: light-dark(#2563eb, #93c5fd);\n        --pix-highlighter--tag: light-dark(#0284c7, #38bdf8);\n        --pix-highlighter--attr: light-dark(#b45309, #fbbf24);\n        --pix-highlighter--key: light-dark(#7c3aed, #c4b5fd);\n        --pix-highlighter--var: light-dark(#0f766e, #86efac);\n        --pix-highlighter--mac: light-dark(#be185d, #f9a8d4);\n        --pix-highlighter--pp: light-dark(#5b7c99, #e0e7ff);\n        --pix-highlighter--prop: light-dark(#0284c7, #67e8f9);\n        --pix-highlighter--type: light-dark(#0f766e, #22c55e);\n        --pix-highlighter--mdh: light-dark(#0369a1, #7dd3fc);\n        --pix-highlighter--mde: light-dark(#b45309, #fbbf24);\n        --pix-highlighter--mds: light-dark(#102235, #fde68a);\n        --pix-highlighter--mdc: light-dark(#0f766e, #2dd4bf);\n        --pix-highlighter--mdl: light-dark(#0284c7, #67e8f9);\n        --pix-highlighter--mdbq: light-dark(#5b7c99, #92a9bf);\n        --pix-highlighter--mdli: light-dark(#0f766e, #86efac);\n        --pix-highlighter--mdhr: light-dark(#bfd7ea, #234160);\n        --pix-highlighter--mdimg: light-dark(#7c3aed, #c4b5fd);\n        --pix-highlighter--tab-size: 2;\n        --pix-highlighter--line-height: 1.55;\n        --pix-highlighter--text-shadow: none;\n        color-scheme: light dark;\n      }\n    }\n  }\n}\n';

// src/components/PixHighlighter/PixHighlighter.const.js
var COPY_RESET_DELAY = 2e3;
var THEME_MENU_OFFSET = 8;
var THEME_MENU_VIEWPORT_MARGIN = 12;
var THEME_STORAGE_KEY = "pix-highlighter-theme";
var ENHANCED_MARKER = /* @__PURE__ */ Symbol("pixHighlighterEnhanced");
var COMPONENT_STYLE_ATTRIBUTE = "data-pix-highlighter-styles";
var PIX_HIGHLIGHTER_THEME_OPTIONS = Object.freeze([
  { value: "default", label: "Default" },
  { value: "prism", label: "Prism" },
  { value: "prettylights", label: "Pretty Lights" },
  { value: "darcula", label: "Darcula" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "aurora", label: "Aurora" },
  { value: "atlas", label: "Atlas" },
  { value: "ember", label: "Ember" },
  { value: "paper", label: "Paper" },
  { value: "tide", label: "Tide" }
]);
var COMPONENT_STYLE_TEXT = [
  ds_tokens_default,
  default_default,
  prism_default,
  prettylights_default,
  darcula_default,
  cyberpunk_default,
  aurora_default,
  atlas_default,
  ember_default,
  paper_default,
  tide_default,
  PixHighlighter_default
].join("\n");
var COPY_ICON = copy_default.trim();
var CHECK_ICON = check_default.trim();
var ERROR_ICON = error_default.trim();
var PALETTE_ICON = palette_default.trim();
var CHEVRON_ICON = chevron_down_default.trim();
var ICON_BUTTON_STATES = Object.freeze({
  idle: Object.freeze({ icon: COPY_ICON, label: "Copy code" }),
  copied: Object.freeze({ icon: CHECK_ICON, label: "Code copied" }),
  error: Object.freeze({ icon: ERROR_ICON, label: "Copy failed" })
});

// src/components/PixHighlighter/PixHighlighter.utils.js
var componentStyleSheet = null;
var componentStyleElement = null;
var floatingLayerElement = null;
var FLOATING_LAYER_ATTRIBUTE = "data-pix-highlighter-floating-layer";
function supportsAnchorPositioning() {
  if (typeof globalThis.CSS?.supports !== "function") {
    return false;
  }
  try {
    return globalThis.CSS.supports("anchor-name: --pix-highlighter--anchor") && globalThis.CSS.supports("position-anchor: --pix-highlighter--anchor") && globalThis.CSS.supports("top: anchor(bottom)");
  } catch {
    return false;
  }
}
function removeFallbackStyleElement() {
  componentStyleElement?.remove();
}
function ensureFallbackStyleElement() {
  if (typeof document === "undefined") {
    return null;
  }
  componentStyleElement ||= document.head?.querySelector(`style[${COMPONENT_STYLE_ATTRIBUTE}]`) || document.querySelector(`style[${COMPONENT_STYLE_ATTRIBUTE}]`) || document.createElement("style");
  componentStyleElement.setAttribute(COMPONENT_STYLE_ATTRIBUTE, "");
  if (componentStyleElement.textContent !== COMPONENT_STYLE_TEXT) {
    componentStyleElement.textContent = COMPONENT_STYLE_TEXT;
  }
  if (!componentStyleElement.isConnected) {
    (document.head || document.documentElement).appendChild(componentStyleElement);
  }
  return componentStyleElement;
}
function adoptComponentStyles() {
  if (typeof document === "undefined") {
    return null;
  }
  const supportsAdoptedStyleSheets = "adoptedStyleSheets" in document && typeof globalThis.CSSStyleSheet === "function" && typeof globalThis.CSSStyleSheet.prototype.replaceSync === "function";
  if (!supportsAdoptedStyleSheets) {
    return ensureFallbackStyleElement();
  }
  removeFallbackStyleElement();
  if (!componentStyleSheet) {
    componentStyleSheet = new CSSStyleSheet();
    componentStyleSheet.replaceSync(COMPONENT_STYLE_TEXT);
  }
  if (!document.adoptedStyleSheets.includes(componentStyleSheet)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, componentStyleSheet];
  }
  return componentStyleSheet;
}
function ensureFloatingLayer() {
  if (typeof document === "undefined") {
    return null;
  }
  floatingLayerElement ||= document.body?.querySelector(`[${FLOATING_LAYER_ATTRIBUTE}]`) || document.querySelector(`[${FLOATING_LAYER_ATTRIBUTE}]`) || document.createElement("div");
  floatingLayerElement.setAttribute(FLOATING_LAYER_ATTRIBUTE, "");
  if (!floatingLayerElement.isConnected) {
    (document.body || document.documentElement).appendChild(floatingLayerElement);
  }
  return floatingLayerElement;
}
function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
function getThemeLabel(theme) {
  return PIX_HIGHLIGHTER_THEME_OPTIONS.find((option) => option.value === theme)?.label || "Default";
}
function setIconButtonContent(button, iconMarkup, label) {
  if (!button) {
    return;
  }
  button.innerHTML = `${iconMarkup}<span class="pix-highlighter__sr-only">${label}</span>`;
  button.setAttribute("aria-label", label);
  button.title = label;
}

// src/components/PixHighlighter/lexers/_Utils.js
var TOKEN_TYPES = Object.freeze([
  "kw",
  "str",
  "num",
  "com",
  "id",
  "fn",
  "op",
  "tag",
  "attr",
  "key",
  "var",
  "mac",
  "pp",
  "prop",
  "type",
  "mdh",
  "mde",
  "mds",
  "mdc",
  "mdl",
  "mdbq",
  "mdli",
  "mdhr",
  "mdimg"
]);
function normalizeLanguage(value) {
  const normalizedValue = (value || "").toLowerCase().trim();
  const aliasMap = /* @__PURE__ */ new Map([
    ["javascript", "js"],
    ["mjs", "js"],
    ["cjs", "js"],
    ["typescript", "ts"],
    ["tsx", "ts"],
    ["py", "python"],
    ["rs", "rust"],
    ["c++", "cpp"],
    ["hpp", "cpp"],
    ["h++", "cpp"],
    ["cs", "csharp"],
    ["md", "markdown"],
    ["yaml", "yml"],
    ["shell", "bash"],
    ["zsh", "bash"],
    ["scss", "css"],
    ["sass", "css"]
  ]);
  return aliasMap.get(normalizedValue) || normalizedValue || "js";
}
var normalizeLang = normalizeLanguage;
function makePusher(tokens) {
  return (type, start, end) => {
    if (end > start) tokens.push({ type, start, end });
  };
}
function readString(text, i, quote, opts = {}) {
  const L = text.length;
  let j = i + 1;
  if (opts.includePrefix) i--;
  while (j < L) {
    const ch = text[j];
    if (ch === "\\") {
      j += 2;
      continue;
    }
    if (ch === quote) {
      j++;
      break;
    }
    j++;
  }
  return [i, j];
}
function readNumber(text, i) {
  let j = i;
  if (text[j] === "-") j++;
  if (text.startsWith("0x", j)) {
    j += 2;
    while (/[0-9a-fA-F_]/.test(text[j])) j++;
    return [i, j];
  }
  if (text.startsWith("0b", j)) {
    j += 2;
    while (/[01_]/.test(text[j])) j++;
    return [i, j];
  }
  if (text.startsWith("0o", j)) {
    j += 2;
    while (/[0-7_]/.test(text[j])) j++;
    return [i, j];
  }
  while (/[0-9_]/.test(text[j])) j++;
  if (text[j] === "." && /[0-9]/.test(text[j + 1] || "")) {
    j++;
    while (/[0-9_]/.test(text[j])) j++;
  }
  if ((text[j] || "").toLowerCase() === "e") {
    let k = j + 1;
    if (text[k] === "+" || text[k] === "-") k++;
    if (/[0-9]/.test(text[k] || "")) {
      j = k + 1;
      while (/[0-9_]/.test(text[j])) j++;
    }
  }
  while (/[a-zA-Z]/.test(text[j] || "")) j++;
  return [i, j];
}
function skipSpace(text, i) {
  while (/\s/.test(text[i] || "")) i++;
  return i;
}
function isIdentStart(ch) {
  return /[A-Za-z_$]/.test(ch);
}
function isIdent(ch) {
  return /[\w$-]/.test(ch);
}
var FUNCTION_DECLARATION_KEYWORDS = /* @__PURE__ */ new Set(["def", "fn", "func", "function"]);
var VARIABLE_DECLARATION_KEYWORDS = /* @__PURE__ */ new Set(["const", "let", "mut", "readonly", "var"]);
var TYPE_DECLARATION_KEYWORDS = /* @__PURE__ */ new Set([
  "class",
  "enum",
  "implements",
  "interface",
  "namespace",
  "record",
  "struct",
  "trait",
  "type"
]);
function getTokenText(text, token) {
  return text.slice(token.start, token.end);
}
function getNextNonSpaceChar(text, offset) {
  let cursor = offset;
  while (cursor < text.length && /\s/.test(text[cursor])) {
    cursor++;
  }
  return text[cursor] || "";
}
function hasPropertyAccess(text, offset) {
  let cursor = offset - 1;
  while (cursor >= 0 && /\s/.test(text[cursor])) {
    cursor--;
  }
  if (cursor < 0) {
    return false;
  }
  if (text[cursor] === ".") {
    return true;
  }
  return text[cursor] === ":" && text[cursor - 1] === ":";
}
function enrichSemanticTokens(text, tokens) {
  return tokens.map((token, index) => {
    if (token.type !== "id") {
      return token;
    }
    const prevToken = tokens[index - 1] ?? null;
    const prevText = prevToken ? getTokenText(text, prevToken) : "";
    const nextChar = getNextNonSpaceChar(text, token.end);
    if (TYPE_DECLARATION_KEYWORDS.has(prevText)) {
      return { ...token, type: "type" };
    }
    if (VARIABLE_DECLARATION_KEYWORDS.has(prevText)) {
      return { ...token, type: nextChar === "(" ? "fn" : "var" };
    }
    if (FUNCTION_DECLARATION_KEYWORDS.has(prevText)) {
      return { ...token, type: "fn" };
    }
    if (prevText === "new" && nextChar === "(") {
      return { ...token, type: "type" };
    }
    if (hasPropertyAccess(text, token.start)) {
      return { ...token, type: nextChar === "(" ? "fn" : "prop" };
    }
    if (nextChar === "(") {
      return { ...token, type: "fn" };
    }
    return token;
  });
}

// src/components/PixHighlighter/lexers/_Bash.js
function lexBash(text) {
  const KW = /* @__PURE__ */ new Set([
    "if",
    "then",
    "elif",
    "else",
    "fi",
    "for",
    "in",
    "do",
    "done",
    "case",
    "esac",
    "while",
    "until",
    "function",
    "select",
    "time",
    "coproc"
  ]);
  const tokens = [];
  const push = makePusher(tokens);
  let i = 0, L = text.length;
  while (i < L) {
    const ch = text[i];
    if (i === 0 && text.startsWith("#!", 0)) {
      let j = 0;
      while (j < L && text[j] !== "\n") j++;
      push("pp", 0, j);
      i = j;
      continue;
    }
    if (ch === "#") {
      let j = i + 1;
      while (j < L && text[j] !== "\n") j++;
      push("com", i, j);
      i = j;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === "`") {
      const [s, e] = readString(text, i, ch);
      push("str", s, e);
      i = e;
      continue;
    }
    if (ch === "$") {
      if (text[i + 1] === "{") {
        let j = i + 2;
        while (j < L && text[j] !== "}") j++;
        j = Math.min(L, j + 1);
        push("var", i, j);
        i = j;
        continue;
      } else {
        let j = i + 1;
        while (/[A-Za-z0-9_]/.test(text[j] || "")) j++;
        if (j > i + 1) {
          push("var", i, j);
          i = j;
          continue;
        }
      }
    }
    if (/\d|-/.test(ch)) {
      const [s, e] = readNumber(text, i);
      if (e > i) {
        push("num", s, e);
        i = e;
        continue;
      }
    }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i + 1;
      while (/[A-Za-z0-9_.-]/.test(text[j] || "")) j++;
      const w = text.slice(i, j);
      push(KW.has(w) ? "kw" : "id", i, j);
      i = j;
      continue;
    }
    const three = text.slice(i, i + 3);
    const two = text.slice(i, i + 2);
    if (["<<<"].includes(three)) {
      push("op", i, i + 3);
      i += 3;
      continue;
    }
    if (["&&", "||", ">>", "<<", ">|", "2>", ">&"].includes(two)) {
      push("op", i, i + 2);
      i += 2;
      continue;
    }
    if ("(){}[];:.,+-*/%&|^!~?=<>".includes(ch)) {
      push("op", i, i + 1);
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}

// src/components/PixHighlighter/lexers/_C.js
function lexCBase(text, isCPP) {
  const KW = /* @__PURE__ */ new Set([
    "auto",
    "break",
    "case",
    "char",
    "const",
    "continue",
    "default",
    "do",
    "double",
    "else",
    "enum",
    "extern",
    "float",
    "for",
    "goto",
    "if",
    "inline",
    "int",
    "long",
    "register",
    "restrict",
    "return",
    "short",
    "signed",
    "sizeof",
    "static",
    "struct",
    "switch",
    "typedef",
    "union",
    "unsigned",
    "void",
    "volatile",
    "while",
    "_Bool",
    "_Complex",
    "_Imaginary"
  ]);
  if (isCPP) {
    for (const k of [
      "alignas",
      "alignof",
      "and",
      "and_eq",
      "asm",
      "bitand",
      "bitor",
      "bool",
      "catch",
      "char8_t",
      "char16_t",
      "char32_t",
      "class",
      "compl",
      "concept",
      "consteval",
      "constexpr",
      "constinit",
      "co_await",
      "co_return",
      "co_yield",
      "decltype",
      "delete",
      "explicit",
      "export",
      "false",
      "friend",
      "mutable",
      "namespace",
      "new",
      "noexcept",
      "not",
      "not_eq",
      "operator",
      "or",
      "or_eq",
      "private",
      "protected",
      "public",
      "reinterpret_cast",
      "requires",
      "static_cast",
      "template",
      "this",
      "thread_local",
      "throw",
      "true",
      "try",
      "typeid",
      "typename",
      "virtual",
      "wchar_t",
      "xor",
      "xor_eq",
      "using"
    ])
      KW.add(k);
  }
  const tokens = [];
  const push = makePusher(tokens);
  let i = 0, L = text.length;
  while (i < L) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "#") {
      let j = i + 1;
      while (j < L && text[j] !== "\n") j++;
      push("pp", i, j);
      i = j;
      continue;
    }
    if (ch === "/" && text[i + 1] === "/") {
      let j = i + 2;
      while (j < L && text[j] !== "\n") j++;
      push("com", i, j);
      i = j;
      continue;
    }
    if (ch === "/" && text[i + 1] === "*") {
      let j = i + 2;
      while (j < L && !(text[j] === "*" && text[j + 1] === "/")) j++;
      j = Math.min(L, j + 2);
      push("com", i, j);
      i = j;
      continue;
    }
    if (ch === "'") {
      const [s, e] = readString(text, i, "'");
      push("str", s, e);
      i = e;
      continue;
    }
    if (ch === '"') {
      const [s, e] = readString(text, i, '"');
      push("str", s, e);
      i = e;
      continue;
    }
    if (/\d|-/.test(ch)) {
      const [s, e] = readNumber(text, i);
      push("num", s, e);
      i = e;
      continue;
    }
    if (isIdentStart(ch)) {
      let j = i + 1;
      while (/[A-Za-z0-9_]/.test(text[j] || "")) j++;
      const w = text.slice(i, j);
      push(KW.has(w) ? "kw" : "id", i, j);
      i = j;
      continue;
    }
    if ("(){}[];:.,+-*/%&|^!~?=<>".includes(ch)) {
      push("op", i, i + 1);
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}
function lexC(text) {
  return lexCBase(text, false);
}
function lexCPP(text) {
  return lexCBase(text, true);
}

// src/components/PixHighlighter/lexers/_Csharp.js
function lexCSharp(text) {
  const KW = /* @__PURE__ */ new Set([
    "abstract",
    "as",
    "base",
    "bool",
    "break",
    "byte",
    "case",
    "catch",
    "char",
    "checked",
    "class",
    "const",
    "continue",
    "decimal",
    "default",
    "delegate",
    "do",
    "double",
    "else",
    "enum",
    "event",
    "explicit",
    "extern",
    "false",
    "finally",
    "fixed",
    "float",
    "for",
    "foreach",
    "goto",
    "if",
    "implicit",
    "in",
    "int",
    "interface",
    "internal",
    "is",
    "lock",
    "long",
    "namespace",
    "new",
    "null",
    "object",
    "operator",
    "out",
    "override",
    "params",
    "private",
    "protected",
    "public",
    "readonly",
    "ref",
    "return",
    "sbyte",
    "sealed",
    "short",
    "sizeof",
    "stackalloc",
    "static",
    "string",
    "struct",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "uint",
    "ulong",
    "unchecked",
    "unsafe",
    "ushort",
    "using",
    "virtual",
    "void",
    "volatile",
    "while",
    "var",
    "dynamic",
    "async",
    "await",
    "record",
    "nint",
    "nuint"
  ]);
  const tokens = [];
  const push = makePusher(tokens);
  let i = 0, L = text.length;
  while (i < L) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "/" && text[i + 1] === "/") {
      let j = i + 2;
      while (j < L && text[j] !== "\n") j++;
      push("com", i, j);
      i = j;
      continue;
    }
    if (ch === "/" && text[i + 1] === "*") {
      let j = i + 2;
      while (j < L && !(text[j] === "*" && text[j + 1] === "/")) j++;
      j = Math.min(L, j + 2);
      push("com", i, j);
      i = j;
      continue;
    }
    if (ch === '"') {
      const [s, e] = readString(text, i, '"');
      push("str", s, e);
      i = e;
      continue;
    }
    if ((ch === "@" || ch === "$") && text[i + 1] === '"') {
      const [s, e] = readString(text, i + 1, '"', { includePrefix: true });
      push("str", s, e);
      i = e;
      continue;
    }
    if (/\d|-/.test(ch)) {
      const [s, e] = readNumber(text, i);
      push("num", s, e);
      i = e;
      continue;
    }
    if (isIdentStart(ch)) {
      let j = i + 1;
      while (/[A-Za-z0-9_]/.test(text[j] || "")) j++;
      const w = text.slice(i, j);
      push(KW.has(w) ? "kw" : "id", i, j);
      i = j;
      continue;
    }
    if ("(){}[];:.,+-*/%&|^!~?=<>".includes(ch)) {
      push("op", i, i + 1);
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}

// src/components/PixHighlighter/lexers/_CSS.js
function lexCSS(text) {
  const tokens = [];
  const push = makePusher(tokens);
  let i = 0, L = text.length;
  let inBlock = false;
  while (i < L) {
    const ch = text[i];
    if (ch === "/" && text[i + 1] === "*") {
      let j = i + 2;
      while (j < L && !(text[j] === "*" && text[j + 1] === "/")) j++;
      j = Math.min(L, j + 2);
      push("com", i, j);
      i = j;
      continue;
    }
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "@") {
      let j = i + 1;
      while (isIdent(text[j] || "")) j++;
      push("kw", i, j);
      i = j;
      continue;
    }
    if (ch === "{") {
      push("op", i, i + 1);
      inBlock = true;
      i++;
      continue;
    }
    if (ch === "}") {
      push("op", i, i + 1);
      inBlock = false;
      i++;
      continue;
    }
    if (ch === "'" || ch === '"') {
      const [s, e] = readString(text, i, ch);
      push("str", s, e);
      i = e;
      continue;
    }
    if (/\d|-/.test(ch)) {
      const [s, e] = readNumber(text, i);
      push("num", s, e);
      i = e;
      continue;
    }
    if (inBlock) {
      let j = i;
      if (isIdentStart(text[j] || "")) {
        const pStart = j;
        j++;
        while (isIdent(text[j] || "")) j++;
        const saveJ = j;
        j = skipSpace(text, j);
        if (text[j] === ":") {
          push("prop", pStart, saveJ);
          push("op", j, j + 1);
          i = j + 1;
          continue;
        }
        push("id", pStart, saveJ);
        i = saveJ;
        continue;
      }
    } else {
      if (ch === "." || ch === "#") {
        let j = i + 1;
        while (isIdent(text[j] || "")) j++;
        push("id", i, j);
        i = j;
        continue;
      }
      if (ch === ":") {
        let j = i + 1;
        while (isIdent(text[j] || "")) j++;
        push("kw", i, j);
        i = j;
        continue;
      }
      if (isIdentStart(ch)) {
        let j = i + 1;
        while (isIdent(text[j] || "")) j++;
        push("tag", i, j);
        i = j;
        continue;
      }
    }
    if ("()[];,:>.+*~^$|=".includes(ch)) {
      push("op", i, i + 1);
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}

// src/components/PixHighlighter/lexers/_Go.js
function lexGo(text) {
  const KW = /* @__PURE__ */ new Set([
    "break",
    "case",
    "chan",
    "const",
    "continue",
    "default",
    "defer",
    "else",
    "fallthrough",
    "for",
    "func",
    "go",
    "goto",
    "if",
    "import",
    "interface",
    "map",
    "package",
    "range",
    "return",
    "select",
    "struct",
    "switch",
    "type",
    "var"
  ]);
  const tokens = [];
  const push = makePusher(tokens);
  let i = 0, L = text.length;
  while (i < L) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "/" && text[i + 1] === "/") {
      let j = i + 2;
      while (j < L && text[j] !== "\n") j++;
      push("com", i, j);
      i = j;
      continue;
    }
    if (ch === "/" && text[i + 1] === "*") {
      let j = i + 2;
      while (j < L && !(text[j] === "*" && text[j + 1] === "/")) j++;
      j = Math.min(L, j + 2);
      push("com", i, j);
      i = j;
      continue;
    }
    if (ch === '"') {
      const [s, e] = readString(text, i, '"');
      push("str", s, e);
      i = e;
      continue;
    }
    if (ch === "`") {
      const [s, e] = readString(text, i, "`");
      push("str", s, e);
      i = e;
      continue;
    }
    if (/\d|-/.test(ch)) {
      const [s, e] = readNumber(text, i);
      push("num", s, e);
      i = e;
      continue;
    }
    if (isIdentStart(ch)) {
      let j = i + 1;
      while (/[A-Za-z0-9_]/.test(text[j] || "")) j++;
      const w = text.slice(i, j);
      push(KW.has(w) ? "kw" : "id", i, j);
      i = j;
      continue;
    }
    if ("(){}[];:.,+-*/%&|^!~?=<>".includes(ch)) {
      push("op", i, i + 1);
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}

// src/components/PixHighlighter/lexers/_HTML.js
function lexHTML(text) {
  const tokens = [];
  const push = makePusher(tokens);
  let i = 0, L = text.length;
  while (i < L) {
    const ch = text[i];
    if (ch === "<") {
      if (text.startsWith("<!--", i)) {
        let j2 = i + 4;
        while (j2 < L && !text.startsWith("-->", j2)) j2++;
        j2 = Math.min(L, j2 + 3);
        push("com", i, j2);
        i = j2;
        continue;
      }
      let j = i + 1;
      if (text[j] === "/" || text[j] === "!") j++;
      const tnStart = j;
      while (isIdent(text[j] || "")) j++;
      if (j > tnStart) push("tag", tnStart, j);
      while (j < L && text[j] !== ">") {
        if (/\s/.test(text[j])) {
          j++;
          continue;
        }
        if (text[j] === "/") {
          j++;
          continue;
        }
        const aStart = j;
        while (isIdent(text[j] || "")) j++;
        if (j > aStart) push("attr", aStart, j);
        j = skipSpace(text, j);
        if (text[j] === "=") {
          push("op", j, j + 1);
          j++;
          j = skipSpace(text, j);
          if (text[j] === '"' || text[j] === "'") {
            const quote = text[j];
            const [s, e] = readString(text, j, quote);
            push("str", s, e);
            j = e;
          } else {
            const vStart = j;
            while (j < L && !/[\s>]/.test(text[j])) j++;
            if (j > vStart) push("str", vStart, j);
          }
        }
      }
      if (text[j] === ">") {
        push("op", j, j + 1);
        j++;
      }
      i = j;
      continue;
    }
    i++;
  }
  return tokens;
}

// src/components/PixHighlighter/lexers/_JavaScript.js
function lexJS(text) {
  const KW = /* @__PURE__ */ new Set([
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "await",
    "of",
    "as",
    "from"
  ]);
  const three = /* @__PURE__ */ new Set(["===", "!==", ">>>"]);
  const two = /* @__PURE__ */ new Set([
    "++",
    "--",
    "=>",
    "==",
    "!=",
    "<=",
    ">=",
    "&&",
    "||",
    "??",
    "**",
    "<<",
    ">>",
    "?.",
    "??"
  ]);
  const one = new Set("(){}[];:.,+-*/%&|^!~?=<>".split(""));
  const tokens = [];
  const push = makePusher(tokens);
  let i = 0, L = text.length;
  while (i < L) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "/" && i + 1 < L) {
      const n = text[i + 1];
      if (n === "/") {
        let j = i + 2;
        while (j < L && text[j] !== "\n") j++;
        push("com", i, j);
        i = j;
        continue;
      }
      if (n === "*") {
        let j = i + 2;
        while (j < L && !(text[j] === "*" && text[j + 1] === "/")) j++;
        j = Math.min(L, j + 2);
        push("com", i, j);
        i = j;
        continue;
      }
    }
    if (ch === "'" || ch === '"' || ch === "`") {
      const [s, e] = readString(text, i, ch);
      push("str", s, e);
      i = e;
      continue;
    }
    if (/\d|-/.test(ch)) {
      const [s, e] = readNumber(text, i);
      if (e > i) {
        push("num", s, e);
        i = e;
        continue;
      }
    }
    if (isIdentStart(ch)) {
      let j = i + 1;
      while (isIdent(text[j] || "")) j++;
      const word = text.slice(i, j);
      push(KW.has(word) ? "kw" : "id", i, j);
      i = j;
      continue;
    }
    const t3 = text.slice(i, i + 3), t2 = text.slice(i, i + 2);
    if (three.has(t3)) {
      push("op", i, i + 3);
      i += 3;
      continue;
    }
    if (two.has(t2)) {
      push("op", i, i + 2);
      i += 2;
      continue;
    }
    if (one.has(ch)) {
      push("op", i, i + 1);
      i += 1;
      continue;
    }
    i++;
  }
  return tokens;
}

// src/components/PixHighlighter/lexers/_JSON.js
function lexJSON(text) {
  const tokens = [];
  const push = makePusher(tokens);
  let i = 0, L = text.length;
  const stack = [];
  while (i < L) {
    i = skipSpace(text, i);
    const ch = text[i];
    if (!ch) break;
    if (ch === "{") {
      push("op", i, i + 1);
      stack.push(true);
      i++;
      continue;
    }
    if (ch === "[") {
      push("op", i, i + 1);
      stack.push(false);
      i++;
      continue;
    }
    if (ch === "}" || ch === "]") {
      push("op", i, i + 1);
      stack.pop();
      i++;
      continue;
    }
    if (ch === ",") {
      push("op", i, i + 1);
      i++;
      continue;
    }
    if (ch === ":") {
      push("op", i, i + 1);
      i++;
      continue;
    }
    if (ch === '"') {
      const [s, e] = readString(text, i, '"');
      const j = skipSpace(text, e);
      const isKey = stack[stack.length - 1] === true && text[j] === ":";
      push(isKey ? "key" : "str", s, e);
      i = e;
      continue;
    }
    if (/\d|-/.test(ch)) {
      const [s, e] = readNumber(text, i);
      push("num", s, e);
      i = e;
      continue;
    }
    if (text.startsWith("true", i) || text.startsWith("false", i) || text.startsWith("null", i)) {
      const m = text.startsWith("true", i) ? "true" : text.startsWith("false", i) ? "false" : "null";
      push("kw", i, i + m.length);
      i += m.length;
      continue;
    }
    i++;
  }
  return tokens;
}

// src/components/PixHighlighter/lexers/_Markdown.js
function lexMarkdown(text) {
  const tokens = [];
  const push = makePusher(tokens);
  const lines = text.split("\n");
  let offset = 0;
  let inFence = false;
  let fenceChar = null;
  for (const line of lines) {
    const L = line.length;
    const trimmed = line.trim();
    if (/^(```|~~~)/.test(trimmed)) {
      push("mdc", offset, offset + L);
      const ch = trimmed[0];
      if (!inFence) {
        inFence = true;
        fenceChar = ch;
      } else if (inFence && ch === fenceChar) {
        inFence = false;
        fenceChar = null;
      }
      offset += L + 1;
      continue;
    }
    if (inFence) {
      push("mdc", offset, offset + L);
      offset += L + 1;
      continue;
    }
    if (/^#{1,6}\s+/.test(line)) {
      push("mdh", offset, offset + L);
      offset += L + 1;
      continue;
    }
    if (/^(\s*)([-*_]\s*){3,}$/.test(line)) {
      push("mdhr", offset, offset + L);
      offset += L + 1;
      continue;
    }
    if (/^\s*>\s?/.test(line)) {
      push("mdbq", offset, offset + L);
      offset += L + 1;
      continue;
    }
    if (/^\s*([-*+])\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const m = line.match(/^\s*((?:[-*+])|\d+\.)\s+/);
      if (m) push("mdli", offset + line.indexOf(m[1]), offset + line.indexOf(m[1]) + m[1].length);
    }
    scanInline(line, /`([^`]+)`/g, (s, e) => push("mdc", offset + s, offset + e));
    scanInline(line, /\*\*([^*]+)\*\*/g, (s, e) => push("mds", offset + s, offset + e));
    scanInline(line, /__([^_]+)__/g, (s, e) => push("mds", offset + s, offset + e));
    scanInline(
      line,
      /(?:^|[^*])\*([^*\n]+)\*(?!\*)/g,
      (s, e) => push("mde", offset + s, offset + e)
    );
    scanInline(line, /(?:^|[^_])_([^_\n]+)_(?!_)/g, (s, e) => push("mde", offset + s, offset + e));
    scanInline(line, /!\[[^\]]*\]\([^)]*\)/g, (s, e) => push("mdimg", offset + s, offset + e));
    scanInline(line, /\[[^\]]+\]\([^)]*\)/g, (s, e) => push("mdl", offset + s, offset + e));
    offset += L + 1;
  }
  return tokens;
  function scanInline(line, re, cb) {
    let m;
    while (m = re.exec(line)) {
      cb(m.index, m.index + m[0].length);
    }
  }
}

// src/components/PixHighlighter/lexers/_Php.js
function lexPHP(text) {
  const KW = /* @__PURE__ */ new Set([
    "abstract",
    "and",
    "array",
    "as",
    "break",
    "callable",
    "case",
    "catch",
    "class",
    "clone",
    "const",
    "continue",
    "declare",
    "default",
    "do",
    "echo",
    "else",
    "elseif",
    "empty",
    "enddeclare",
    "endfor",
    "endforeach",
    "endif",
    "endswitch",
    "endwhile",
    "eval",
    "exit",
    "extends",
    "final",
    "finally",
    "for",
    "foreach",
    "function",
    "global",
    "goto",
    "if",
    "implements",
    "include",
    "include_once",
    "instanceof",
    "insteadof",
    "interface",
    "isset",
    "list",
    "match",
    "namespace",
    "new",
    "or",
    "print",
    "private",
    "protected",
    "public",
    "readonly",
    "require",
    "require_once",
    "return",
    "static",
    "switch",
    "throw",
    "trait",
    "try",
    "unset",
    "use",
    "var",
    "while",
    "xor",
    "yield",
    "true",
    "false",
    "null"
  ]);
  const tokens = [];
  const push = makePusher(tokens);
  let i = 0, L = text.length;
  while (i < L) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "/" && text[i + 1] === "/") {
      let j = i + 2;
      while (j < L && text[j] !== "\n") j++;
      push("com", i, j);
      i = j;
      continue;
    }
    if (ch === "#") {
      let j = i + 1;
      while (j < L && text[j] !== "\n") j++;
      push("com", i, j);
      i = j;
      continue;
    }
    if (ch === "/" && text[i + 1] === "*") {
      let j = i + 2;
      while (j < L && !(text[j] === "*" && text[j + 1] === "/")) j++;
      j = Math.min(L, j + 2);
      push("com", i, j);
      i = j;
      continue;
    }
    if (ch === "'" || ch === '"') {
      const [s, e] = readString(text, i, ch);
      push("str", s, e);
      i = e;
      continue;
    }
    if (ch === "$" && isIdentStart(text[i + 1] || "")) {
      let j = i + 2;
      while (/[A-Za-z0-9_]/.test(text[j] || "")) j++;
      push("var", i, j);
      i = j;
      continue;
    }
    if (/\d|-/.test(ch)) {
      const [s, e] = readNumber(text, i);
      push("num", s, e);
      i = e;
      continue;
    }
    if (isIdentStart(ch)) {
      let j = i + 1;
      while (/[A-Za-z0-9_]/.test(text[j] || "")) j++;
      const w = text.slice(i, j);
      push(KW.has(w) ? "kw" : "id", i, j);
      i = j;
      continue;
    }
    if ("(){}[];:.,+-*/%&|^!~?=<>@".includes(ch)) {
      push("op", i, i + 1);
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}

// src/components/PixHighlighter/lexers/_Python.js
function lexPython(text) {
  const KW = /* @__PURE__ */ new Set([
    "False",
    "None",
    "True",
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "nonlocal",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield"
  ]);
  const tokens = [];
  const push = makePusher(tokens);
  let i = 0, L = text.length;
  while (i < L) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "#") {
      let j = i + 1;
      while (j < L && text[j] !== "\n") j++;
      push("com", i, j);
      i = j;
      continue;
    }
    if (text.startsWith("'''", i) || text.startsWith('"""', i)) {
      const q = text[i];
      let j = i + 3;
      while (j < L && !text.startsWith(q + q + q, j)) j++;
      j = Math.min(L, j + 3);
      push("str", i, j);
      i = j;
      continue;
    }
    if (ch === "'" || ch === '"') {
      const [s, e] = readString(text, i, ch);
      push("str", s, e);
      i = e;
      continue;
    }
    if (/\d|-/.test(ch)) {
      const [s, e] = readNumber(text, i);
      push("num", s, e);
      i = e;
      continue;
    }
    if (isIdentStart(ch)) {
      let j = i + 1;
      while (/[A-Za-z0-9_]/.test(text[j] || "")) j++;
      const w = text.slice(i, j);
      push(KW.has(w) ? "kw" : "id", i, j);
      i = j;
      continue;
    }
    if ("(){}[]:.,+-*/%&|^~=<>`".includes(ch)) {
      push("op", i, i + 1);
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}

// src/components/PixHighlighter/lexers/_Rust.js
function lexRust(text) {
  const KW = /* @__PURE__ */ new Set([
    "as",
    "break",
    "const",
    "continue",
    "crate",
    "else",
    "enum",
    "extern",
    "false",
    "fn",
    "for",
    "if",
    "impl",
    "in",
    "let",
    "loop",
    "match",
    "mod",
    "move",
    "mut",
    "pub",
    "ref",
    "return",
    "self",
    "Self",
    "static",
    "struct",
    "super",
    "trait",
    "true",
    "type",
    "unsafe",
    "use",
    "where",
    "while",
    "async",
    "await",
    "dyn"
  ]);
  const tokens = [];
  const push = makePusher(tokens);
  let i = 0, L = text.length;
  while (i < L) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "/" && text[i + 1] === "/") {
      let j = i + 2;
      while (j < L && text[j] !== "\n") j++;
      push("com", i, j);
      i = j;
      continue;
    }
    if (ch === "/" && text[i + 1] === "*") {
      let j = i + 2;
      while (j < L && !(text[j] === "*" && text[j + 1] === "/")) j++;
      j = Math.min(L, j + 2);
      push("com", i, j);
      i = j;
      continue;
    }
    if (ch === '"') {
      const [s, e] = readString(text, i, '"');
      push("str", s, e);
      i = e;
      continue;
    }
    if (ch === "r" && text[i + 1] === '"') {
      const [s, e] = readString(text, i + 1, '"', { includePrefix: true });
      push("str", s, e);
      i = e;
      continue;
    }
    if (/\d|-/.test(ch)) {
      const [s, e] = readNumber(text, i);
      push("num", s, e);
      i = e;
      continue;
    }
    if (isIdentStart(ch)) {
      let j = i + 1;
      while (/[A-Za-z0-9_]/.test(text[j] || "")) j++;
      if (text[j] === "!") {
        push("mac", i, j + 1);
        i = j + 1;
        continue;
      }
      const w = text.slice(i, j);
      push(KW.has(w) ? "kw" : "id", i, j);
      i = j;
      continue;
    }
    if ("(){}[]:.,+-*/%&|^!~?=<>".includes(ch)) {
      push("op", i, i + 1);
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}

// src/components/PixHighlighter/lexers/_TypeScript.js
function lexTS(text) {
  const extraKW = /* @__PURE__ */ new Set([
    "interface",
    "type",
    "enum",
    "implements",
    "readonly",
    "public",
    "private",
    "protected",
    "abstract",
    "declare",
    "namespace",
    "keyof",
    "infer",
    "satisfies",
    "unknown",
    "never",
    "bigint",
    "asserts"
  ]);
  const base = lexJS(text);
  for (const t of base) {
    if (t.type === "id") {
      const w = text.slice(t.start, t.end);
      if (extraKW.has(w)) t.type = "kw";
    }
  }
  return base;
}

// src/components/PixHighlighter/lexers/_YAML.js
function lexYAML(text) {
  const tokens = [];
  const push = makePusher(tokens);
  const bools = /^(true|false|null|yes|no|on|off)$/i;
  let i = 0, L = text.length;
  while (i < L) {
    const lineStart = i;
    let j = i;
    while (j < L && text[j] !== "\n") j++;
    const line = text.slice(i, j);
    if (/^\s*(---|\.\.\.)\s*$/.test(line)) {
      push("op", lineStart, lineStart + line.length);
      i = j + 1;
      continue;
    }
    let k = 0;
    while (k < line.length) {
      const ch = line[k];
      if (ch === "'" || ch === '"') {
        const [s, e] = readString(line, k, ch);
        push("str", lineStart + s, lineStart + e);
        k = e;
        continue;
      }
      if (ch === "#") {
        push("com", lineStart + k, lineStart + line.length);
        break;
      }
      k++;
    }
    const keyMatch = line.match(/^(\s*)([A-Za-z0-9_.-]+)\s*:/);
    if (keyMatch) {
      const keyStart = lineStart + keyMatch[1].length;
      const keyEnd = keyStart + keyMatch[2].length;
      push("key", keyStart, keyEnd);
    }
    let m;
    const anchorRe = /[&*][A-Za-z0-9_-]+/g;
    while (m = anchorRe.exec(line)) {
      push("var", lineStart + m.index, lineStart + m.index + m[0].length);
    }
    const tagRe = /!![^\s]+/g;
    while (m = tagRe.exec(line)) {
      push("type", lineStart + m.index, lineStart + m.index + m[0].length);
    }
    const wordRe = /[A-Za-z0-9_.-]+/g;
    while (m = wordRe.exec(line)) {
      const w = m[0];
      const s = lineStart + m.index;
      const e = s + w.length;
      if (/^-?\d/.test(w)) {
        push("num", s, e);
        continue;
      }
      if (bools.test(w)) {
        push("kw", s, e);
      }
    }
    const listM = line.match(/^(\s*)-\s+/);
    if (listM) {
      const p = lineStart + listM[1].length;
      push("op", p, p + 1);
    }
    i = j + 1;
  }
  return tokens;
}

// src/components/PixHighlighter/lexers/index.js
var LEXERS = /* @__PURE__ */ new Map([
  ["js", lexJS],
  ["ts", lexTS],
  ["css", lexCSS],
  ["json", lexJSON],
  ["html", lexHTML],
  ["python", lexPython],
  ["rust", lexRust],
  ["c", lexC],
  ["cpp", lexCPP],
  ["php", lexPHP],
  ["csharp", lexCSharp],
  ["go", lexGo],
  ["markdown", lexMarkdown],
  ["md", lexMarkdown],
  ["yml", lexYAML],
  ["yaml", lexYAML],
  ["bash", lexBash],
  ["sh", lexBash]
]);
function getLexer(language) {
  return LEXERS.get(normalizeLanguage(language)) ?? null;
}
function tokenizeSource(language, source) {
  const lexer = getLexer(language);
  const tokens = lexer ? lexer(source) : [];
  return enrichSemanticTokens(source, tokens);
}

// src/components/PixHighlighter/PixHighlighter.js
var PixHighlighter = class _PixHighlighter extends HTMLPreElement {
  /**
   * @internal
   * @type {number}
   */
  static _uid = 0;
  /** @type {Set<PixHighlighter>} */
  static instances = /* @__PURE__ */ new Set();
  /** @type {readonly PixHighlighterTokenType[]} */
  static KNOWN_TYPES = TOKEN_TYPES;
  /**
   * @internal
   * @type {boolean}
   */
  static _themeInitialized = false;
  /** @returns {CSSStyleSheet | HTMLStyleElement | null} */
  static ensureComponentStyles() {
    return adoptComponentStyles();
  }
  /** @returns {boolean} */
  static registerCustomElement() {
    const registry = globalThis.customElements;
    if (!registry?.define) {
      return false;
    }
    if (registry.get("pix-highlighter")) {
      return true;
    }
    try {
      registry.define("pix-highlighter", this, { extends: "pre" });
      return true;
    } catch {
      return false;
    }
  }
  static {
    this.ensureComponentStyles();
    this.registerCustomElement();
    if (typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootPixHighlighters, { once: true });
      } else {
        queueMicrotask(bootPixHighlighters);
      }
    }
  }
  /** @returns {string[]} */
  static get observedAttributes() {
    return ["data-lang", "lang", "data-trim"];
  }
  /** @returns {boolean} */
  static supportsHighlights() {
    return !!(typeof window !== "undefined" && globalThis.CSS?.highlights && typeof window.Highlight === "function");
  }
  /**
   * @internal
   * @param {PixHighlighterTokenType} type
   * @returns {string}
   */
  static getHighlightName(type) {
    return `pix-${type}`;
  }
  /**
   * @internal
   * @param {PixHighlighterTheme | null | undefined} theme
   * @returns {boolean}
   */
  static isThemeValue(theme) {
    return PIX_HIGHLIGHTER_THEME_OPTIONS.some((option) => option.value === theme);
  }
  /** @returns {PixHighlighterTheme | null} */
  static getSavedTheme() {
    const savedTheme = getStorage()?.getItem(THEME_STORAGE_KEY);
    return this.isThemeValue(savedTheme) ? savedTheme : null;
  }
  /** @returns {PixHighlighterTheme} */
  static getCurrentTheme() {
    if (typeof document === "undefined") return "default";
    const currentTheme = document.documentElement.dataset.pixHighlighterTheme;
    return this.isThemeValue(currentTheme) ? currentTheme : "default";
  }
  /** @returns {PixHighlighterTheme} */
  static getInitialTheme() {
    if (typeof document === "undefined") return "default";
    const attributeTheme = document.documentElement.dataset.pixHighlighterTheme;
    if (this.isThemeValue(attributeTheme)) return attributeTheme;
    return this.getSavedTheme() || "default";
  }
  /**
   * @internal
   * @returns {void}
   */
  static ensureThemeState() {
    if (this._themeInitialized) return;
    this._themeInitialized = true;
    this.applyTheme(this.getInitialTheme(), { persist: false, syncInstances: false });
  }
  /**
   * @param {PixHighlighterTheme} theme
   * @param {{ persist?: boolean; syncInstances?: boolean }} [options]
   * @returns {PixHighlighterTheme}
   */
  static applyTheme(theme, { persist = true, syncInstances = true } = {}) {
    const normalizedTheme = this.isThemeValue(theme) ? theme : "default";
    if (typeof document !== "undefined") {
      document.documentElement.dataset.pixHighlighterTheme = normalizedTheme;
    }
    if (persist) {
      getStorage()?.setItem(THEME_STORAGE_KEY, normalizedTheme);
    }
    if (syncInstances) {
      for (const instance of this.instances) {
        instance._syncThemeControl(normalizedTheme);
      }
    }
    return normalizedTheme;
  }
  /** @returns {void} */
  static clearManagedHighlights() {
    if (!this.supportsHighlights()) return;
    for (const type of this.KNOWN_TYPES) {
      globalThis.CSS.highlights.delete(this.getHighlightName(type));
    }
  }
  /**
   * @param {HTMLPreElement} element
   * @returns {PixHighlighter | null}
   */
  static enhanceElement(element) {
    if (!(element instanceof window.HTMLPreElement)) return null;
    !(element instanceof _PixHighlighter) && Object.setPrototypeOf(element, _PixHighlighter.prototype);
    element._ensureState();
    element._connect();
    return element;
  }
  /**
   * @param {Document | Element} [root=document]
   * @returns {PixHighlighter[]}
   */
  static enhanceAll(root = document) {
    if (!root?.querySelectorAll) return [];
    const elements = [];
    root instanceof window.HTMLPreElement && root.matches?.("pre[is='pix-highlighter']") && elements.push(root);
    elements.push(...root.querySelectorAll("pre[is='pix-highlighter']"));
    return elements.map((element) => this.enhanceElement(element)).filter(Boolean);
  }
  /**
   * @internal
   * @returns {void}
   */
  static renderHighlights() {
    if (!this.supportsHighlights()) {
      this.clearManagedHighlights();
      return;
    }
    const groups = /* @__PURE__ */ new Map();
    const counts = /* @__PURE__ */ new Map();
    for (const type of this.KNOWN_TYPES) {
      groups.set(type, new Highlight());
      counts.set(type, 0);
    }
    for (const instance of this.instances) {
      if (!instance.isConnected || !instance._textNode) continue;
      for (const token of instance._tokens) {
        const highlight = groups.get(token.type);
        if (!highlight) continue;
        const range = document.createRange();
        range.setStart(instance._textNode, token.start);
        range.setEnd(instance._textNode, token.end);
        highlight.add(range);
        counts.set(token.type, counts.get(token.type) + 1);
      }
    }
    for (const type of this.KNOWN_TYPES) {
      const highlightName = this.getHighlightName(type);
      if (counts.get(type) > 0) {
        globalThis.CSS.highlights.set(highlightName, groups.get(type));
      } else {
        globalThis.CSS.highlights.delete(highlightName);
      }
    }
  }
  constructor() {
    super();
    this._ensureState();
  }
  /** @returns {void} */
  connectedCallback() {
    this._connect();
  }
  /**
   * @internal
   * @returns {void}
   */
  _connect() {
    this._ensureState();
    if (this._isActive) return;
    this._isActive = true;
    this.dataset.pixHighlighterRoot = "";
    this.constructor.ensureComponentStyles();
    _PixHighlighter.ensureThemeState();
    _PixHighlighter.instances.add(this);
    this._ensureToolbar();
    this._syncThemeControl();
    this._updateHighlightState({ force: true, syncSourceText: true });
    this._observe();
  }
  /** @returns {void} */
  disconnectedCallback() {
    if (!this._stateReady || !this._isActive) return;
    this._isActive = false;
    this._teardownThemePicker();
    this._copyButton?.removeEventListener("click", this._onCopyClick);
    this._themeOptionButtons?.forEach((button) => {
      button.removeEventListener("click", this._onThemeOptionClick);
    });
    this._mo?.disconnect();
    this._mo = null;
    this._sourceText = null;
    this._textNode = null;
    this._tokens = [];
    window.clearTimeout(this._copyResetTimer);
    this._copyResetTimer = 0;
    _PixHighlighter.instances.delete(this);
    _PixHighlighter.renderHighlights();
  }
  /**
   * @param {string} name
   * @param {string | null} previousValue
   * @param {string | null} nextValue
   * @returns {void}
   */
  attributeChangedCallback(name, previousValue, nextValue) {
    this._ensureState();
    (name === "data-lang" || name === "lang" || name === "data-trim") && previousValue !== nextValue && this._updateHighlightState({ force: true });
  }
  /**
   * @internal
   * @returns {string}
   */
  _getLanguage() {
    return normalizeLang(this.getAttribute("data-lang") || this.getAttribute("lang"));
  }
  /**
   * @internal
   * @returns {void}
   */
  _ensureState() {
    if (this._stateReady) {
      this._supportsHighlight = _PixHighlighter.supportsHighlights();
      return;
    }
    this._stateReady = true;
    this._id ||= (++_PixHighlighter._uid).toString(36);
    this[ENHANCED_MARKER] = true;
    this._isActive = false;
    this._lastText = null;
    this._lastLang = null;
    this._lastTrimEnabled = null;
    this._sourceText = null;
    this._tokens = [];
    this._textNode = null;
    this._mo = null;
    this._copyButton = null;
    this._themePicker = null;
    this._themeTrigger = null;
    this._themeTriggerLabel = null;
    this._themeList = null;
    this._themeMenu = null;
    this._themeListHome = null;
    this._themeOptionButtons = [];
    this._themeMenuOpen = false;
    this._activeThemeOptionIndex = 0;
    this._copyResetTimer = 0;
    this._themeMenuListenerTimer = 0;
    this._isSyncingCode = false;
    this._supportsHighlight = _PixHighlighter.supportsHighlights();
    this._supportsAnchorPositioning = supportsAnchorPositioning();
    this._onCopyClick = this._handleCopyClick.bind(this);
    this._onThemePickerClick = this._handleThemePickerClick.bind(this);
    this._onThemePickerKeyDown = this._handleThemePickerKeyDown.bind(this);
    this._onThemeOptionClick = this._handleThemeOptionClick.bind(this);
    this._onThemeListKeyDown = this._handleThemeListKeyDown.bind(this);
    this._onThemeMenuViewportChange = this._positionThemeList.bind(this);
    this._onThemeMenuClick = this._handleDocumentClick.bind(this);
    this._onThemeMenuKeyDown = this._handleDocumentKeyDown.bind(this);
  }
  /**
   * @internal
   * @returns {HTMLElement | null}
   */
  _getCodeElement() {
    return this.querySelector("code");
  }
  /**
   * @internal
   * @param {HTMLElement | null} [code=this._getCodeElement()]
   * @returns {boolean}
   */
  _shouldTrimCode(code = this._getCodeElement()) {
    const trimValue = code?.getAttribute("data-trim") ?? this.getAttribute("data-trim");
    return trimValue == null ? true : !/^(false|0|off|no)$/iu.test(trimValue.trim());
  }
  /**
   * @internal
   * @param {string} sourceText
   * @returns {string}
   */
  _trimCode(sourceText) {
    const normalizedText = sourceText.replace(/\r\n?/gu, "\n");
    const lines = normalizedText.split("\n");
    while (lines.length && !lines[0].trim()) {
      lines.shift();
    }
    while (lines.length && !lines.at(-1).trim()) {
      lines.pop();
    }
    if (!lines.length) {
      return "";
    }
    const indentWidth = lines.reduce((minimumIndent, line) => {
      if (!line.trim()) {
        return minimumIndent;
      }
      const indentMatch = line.match(/^[\t ]*/u);
      const currentIndent = indentMatch?.[0]?.length ?? 0;
      return Math.min(minimumIndent, currentIndent);
    }, Number.POSITIVE_INFINITY);
    if (!Number.isFinite(indentWidth) || indentWidth <= 0) {
      return lines.join("\n");
    }
    return lines.map((line) => line.trim() ? line.slice(indentWidth) : "").join("\n");
  }
  /**
   * @internal
   * @returns {void}
   */
  _ensureToolbar() {
    const existingToolbar = this.querySelector("[data-pix-highlighter-toolbar]");
    if (existingToolbar) {
      this._themePicker = existingToolbar.querySelector("details[data-pix-highlighter-theme-picker]");
      this._themeTrigger = this._themePicker?.querySelector("summary[data-pix-highlighter-theme-trigger]") || null;
      this._themeTriggerLabel = existingToolbar.querySelector("[data-pix-highlighter-theme-value]");
      this._themeList = existingToolbar.querySelector("section[data-pix-highlighter-theme-list]");
      this._themeMenu = this._themeList?.querySelector("menu") || null;
      this._themeListHome = existingToolbar;
      this._copyButton = existingToolbar.querySelector("button[data-pix-highlighter-copy]");
      this._themeOptionButtons = Array.from(
        existingToolbar.querySelectorAll("button[data-pix-highlighter-theme-option]")
      );
      this._teardownThemePicker();
      this._copyButton?.removeEventListener("click", this._onCopyClick);
      this._themeOptionButtons.forEach((button) => {
        button.removeEventListener("click", this._onThemeOptionClick);
      });
      this._copyButton?.addEventListener("click", this._onCopyClick);
      this._themeOptionButtons.forEach((button) => {
        button.addEventListener("click", this._onThemeOptionClick);
      });
      this._bindThemePicker();
      if (this._themeList) {
        this._themeList.hidden = !this._themeMenuOpen;
      }
      return;
    }
    const toolbar = document.createElement("span");
    toolbar.dataset.pixHighlighterToolbar = "";
    toolbar.setAttribute("role", "group");
    toolbar.setAttribute("aria-label", "Code block actions");
    const themePicker = document.createElement("details");
    themePicker.dataset.pixHighlighterThemePicker = "";
    themePicker.name = `pix-highlighter-theme-picker-${this._id}`;
    const themeTrigger = document.createElement("summary");
    themeTrigger.dataset.pixHighlighterThemeTrigger = "";
    themeTrigger.setAttribute("aria-label", "Syntax highlight theme");
    themeTrigger.setAttribute("role", "button");
    const triggerLabel = document.createElement("span");
    triggerLabel.dataset.pixHighlighterThemeValue = "";
    const triggerLeadingIcon = document.createElement("span");
    triggerLeadingIcon.dataset.pixHighlighterThemeIcon = "";
    triggerLeadingIcon.innerHTML = PALETTE_ICON;
    const triggerChevron = document.createElement("span");
    triggerChevron.dataset.pixHighlighterThemeChevron = "";
    triggerChevron.innerHTML = CHEVRON_ICON;
    themeTrigger.append(triggerLeadingIcon, triggerLabel, triggerChevron);
    themePicker.append(themeTrigger);
    const themeList = document.createElement("section");
    themeList.dataset.pixHighlighterThemeList = "";
    themeList.hidden = true;
    themeList.id = `pix-highlighter-theme-list-${this._id}`;
    themeList.setAttribute("aria-label", "Syntax highlight themes");
    const themeMenu = document.createElement("menu");
    themeMenu.type = "toolbar";
    themeMenu.setAttribute("role", "menu");
    themeMenu.setAttribute("aria-orientation", "vertical");
    themeTrigger.setAttribute("aria-haspopup", "menu");
    themeTrigger.setAttribute("aria-controls", themeList.id);
    themeTrigger.setAttribute("aria-expanded", "false");
    const optionButtons = [];
    for (const option of PIX_HIGHLIGHTER_THEME_OPTIONS) {
      const optionButton = document.createElement("button");
      optionButton.type = "button";
      optionButton.dataset.pixHighlighterThemeOption = option.value;
      optionButton.setAttribute("role", "menuitemradio");
      optionButton.innerHTML = `<span>${option.label}</span><span aria-hidden="true">${option.value}</span>`;
      optionButton.tabIndex = -1;
      themeMenu.appendChild(optionButton);
      optionButtons.push(optionButton);
    }
    themeList.append(themeMenu);
    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.dataset.pixHighlighterCopy = "";
    this._setCopyButtonState("idle", copyButton);
    toolbar.append(themePicker, themeList, copyButton);
    this.prepend(toolbar);
    this._themePicker = themePicker;
    this._themeTrigger = themeTrigger;
    this._themeTriggerLabel = triggerLabel;
    this._themeList = themeList;
    this._themeMenu = themeMenu;
    this._themeListHome = toolbar;
    this._themeOptionButtons = optionButtons;
    this._copyButton = copyButton;
    this._copyButton.addEventListener("click", this._onCopyClick);
    this._themeOptionButtons.forEach((button) => {
      button.addEventListener("click", this._onThemeOptionClick);
    });
    this._bindThemePicker();
  }
  /**
   * @internal
   * @returns {void}
   */
  _bindThemePicker() {
    if (!this._themePicker) {
      return;
    }
    this._configureThemeAnchor();
    this._themeTrigger?.removeEventListener("click", this._onThemePickerClick);
    this._themeTrigger?.removeEventListener("keydown", this._onThemePickerKeyDown);
    this._themeList?.removeEventListener("keydown", this._onThemeListKeyDown);
    this._themeTrigger?.addEventListener("click", this._onThemePickerClick);
    this._themeTrigger?.addEventListener("keydown", this._onThemePickerKeyDown);
    this._themeList?.addEventListener("keydown", this._onThemeListKeyDown);
    if (this._themeTrigger && this._themeList) {
      !this._themeList.id && (this._themeList.id = `pix-highlighter-theme-list-${this._id}`);
      this._themeTrigger.setAttribute("aria-haspopup", "menu");
      this._themeTrigger.setAttribute("aria-controls", this._themeList.id);
      this._themeTrigger.setAttribute("aria-expanded", String(this._themeMenuOpen));
    }
    this._syncThemeControl();
  }
  /**
   * @internal
   * @returns {string}
   */
  _getThemeAnchorName() {
    return `--pix-highlighter--highlighter-theme-trigger-${this._id}`;
  }
  /**
   * @internal
   * @returns {void}
   */
  _configureThemeAnchor() {
    if (!this._themeTrigger || !this._themeList) {
      return;
    }
    const anchorName = this._getThemeAnchorName();
    this._themeTrigger.style.setProperty("anchor-name", anchorName);
    this._themeList.style.setProperty("position-anchor", anchorName);
    this._themeList.style.setProperty("--pix-highlighter--anchor-offset", `${THEME_MENU_OFFSET}px`);
  }
  /**
   * @internal
   * @returns {void}
   */
  _syncThemeListSurface() {
    if (!this._themeList || typeof window === "undefined") {
      return;
    }
    const computed = window.getComputedStyle(this);
    const triggerComputed = this._themeTrigger ? window.getComputedStyle(this._themeTrigger) : null;
    for (const property of [
      "--pix-highlighter--toolbar-border",
      "--pix-highlighter--toolbar-color",
      "--pix-highlighter--toolbar-menu-bg",
      "--pix-highlighter--toolbar-menu-accent",
      "--pix-highlighter--toolbar-shadow"
    ]) {
      const value = computed.getPropertyValue(property).trim();
      value && this._themeList.style.setProperty(property, value);
    }
    if (triggerComputed) {
      this._themeList.style.fontFamily = triggerComputed.fontFamily;
      this._themeList.style.fontSize = triggerComputed.fontSize;
    }
  }
  /**
   * @internal
   * @returns {void}
   */
  _mountThemeList() {
    if (!this._themeList) {
      return;
    }
    this._themeListHome ||= this.querySelector("[data-pix-highlighter-toolbar]");
    this._themeList.hidden = false;
    this._syncThemeListSurface();
    if (this._supportsAnchorPositioning) {
      this._themeListHome?.appendChild(this._themeList);
      return;
    }
    const floatingLayer = ensureFloatingLayer();
    if (floatingLayer && this._themeList.parentElement !== floatingLayer) {
      floatingLayer.appendChild(this._themeList);
    }
  }
  /**
   * @internal
   * @returns {void}
   */
  _restoreThemeList() {
    if (!this._themeList) {
      return;
    }
    this._themeList.hidden = true;
    if (this._themeListHome && this._themeList.parentElement !== this._themeListHome) {
      this._themeListHome.appendChild(this._themeList);
    }
  }
  /**
   * @internal
   * @returns {void}
   */
  _teardownThemePicker() {
    this._themeTrigger?.removeEventListener("click", this._onThemePickerClick);
    this._themeTrigger?.removeEventListener("keydown", this._onThemePickerKeyDown);
    this._themeList?.removeEventListener("keydown", this._onThemeListKeyDown);
    window.clearTimeout(this._themeMenuListenerTimer);
    this._themeMenuListenerTimer = 0;
    this._removeFloatingThemePickerListeners();
    this._resetThemeListPosition();
    this._restoreThemeList();
    this._themeMenuOpen = false;
    this._themePicker && (this._themePicker.open = false);
    this._themeTrigger && this._themeTrigger.setAttribute("aria-expanded", "false");
  }
  /**
   * @internal
   * @returns {void}
   */
  _addFloatingThemePickerListeners() {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    if (!this._supportsAnchorPositioning) {
      window.addEventListener("resize", this._onThemeMenuViewportChange);
      document.addEventListener("scroll", this._onThemeMenuViewportChange, true);
    }
    document.addEventListener("click", this._onThemeMenuClick, true);
    document.addEventListener("keydown", this._onThemeMenuKeyDown, true);
  }
  /**
   * @internal
   * @returns {void}
   */
  _removeFloatingThemePickerListeners() {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    window.removeEventListener("resize", this._onThemeMenuViewportChange);
    document.removeEventListener("scroll", this._onThemeMenuViewportChange, true);
    document.removeEventListener("click", this._onThemeMenuClick, true);
    document.removeEventListener("keydown", this._onThemeMenuKeyDown, true);
  }
  /**
   * @internal
   * @returns {void}
   */
  _resetThemeListPosition() {
    if (!this._themeList) {
      return;
    }
    this._themeList.style.removeProperty("top");
    this._themeList.style.removeProperty("left");
    this._themeList.style.removeProperty("min-width");
    this._themeList.style.removeProperty("max-height");
    this._themeList.style.removeProperty("visibility");
  }
  /**
   * @internal
   * @returns {void}
   */
  _handleThemePickerClick(event) {
    event.preventDefault();
    this._themeMenuOpen ? this._closeThemeMenu() : this._openThemeMenu();
  }
  /**
   * @internal
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  _handleThemePickerKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this._openThemeMenu({ focusStrategy: "selected" });
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      this._openThemeMenu({ focusStrategy: "last" });
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._openThemeMenu({ focusStrategy: "selected" });
    }
  }
  /**
   * @internal
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  _handleThemeListKeyDown(event) {
    const target = event.target;
    if (!(target instanceof window.HTMLButtonElement)) {
      return;
    }
    const currentIndex = this._themeOptionButtons.indexOf(target);
    if (currentIndex < 0) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this._focusThemeOptionByIndex(currentIndex + 1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      this._focusThemeOptionByIndex(currentIndex - 1);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      this._focusThemeOptionByIndex(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      this._focusThemeOptionByIndex(this._themeOptionButtons.length - 1);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      target.click();
    }
  }
  /**
   * @internal
   * @param {MouseEvent} event
   * @returns {void}
   */
  _handleDocumentClick(event) {
    if (!this._themeMenuOpen) {
      return;
    }
    const target = event.target;
    if (target instanceof Node && (this._themePicker.contains(target) || this._themeList?.contains(target))) {
      return;
    }
    this._closeThemeMenu();
  }
  /**
   * @internal
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  _handleDocumentKeyDown(event) {
    if (!this._themeMenuOpen) {
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      this._closeThemeMenu({ returnFocus: true });
      return;
    }
    if (event.key === "Tab") {
      this._closeThemeMenu();
    }
  }
  /**
   * @internal
   * @returns {void}
   */
  _positionThemeList() {
    if (typeof window === "undefined" || !this._themeMenuOpen || !this._themeTrigger || !this._themeList) {
      return;
    }
    this._syncThemeListSurface();
    if (this._supportsAnchorPositioning) {
      this._resetThemeListPosition();
      return;
    }
    const triggerRect = this._themeTrigger.getBoundingClientRect();
    const minWidth = Math.max(triggerRect.width, 224);
    this._themeList.style.visibility = "hidden";
    this._themeList.style.left = "0px";
    this._themeList.style.top = "0px";
    this._themeList.style.minWidth = `${Math.round(minWidth)}px`;
    this._themeList.style.maxHeight = `${Math.max(
      120,
      window.innerHeight - THEME_MENU_VIEWPORT_MARGIN * 2
    )}px`;
    const listRect = this._themeList.getBoundingClientRect();
    const listWidth = Math.min(
      Math.max(minWidth, listRect.width || minWidth),
      window.innerWidth - THEME_MENU_VIEWPORT_MARGIN * 2
    );
    const listHeight = listRect.height || 0;
    const availableBelow = window.innerHeight - triggerRect.bottom - THEME_MENU_VIEWPORT_MARGIN - THEME_MENU_OFFSET;
    const availableAbove = triggerRect.top - THEME_MENU_VIEWPORT_MARGIN - THEME_MENU_OFFSET;
    const openUpward = availableBelow < Math.min(listHeight, 240) && availableAbove > availableBelow;
    const maxHeight = Math.max(120, openUpward ? availableAbove : availableBelow);
    const renderedHeight = Math.min(listHeight || maxHeight, maxHeight);
    let left = triggerRect.left;
    left + listWidth > window.innerWidth - THEME_MENU_VIEWPORT_MARGIN && (left = window.innerWidth - THEME_MENU_VIEWPORT_MARGIN - listWidth);
    left = Math.max(THEME_MENU_VIEWPORT_MARGIN, left);
    const top = openUpward ? Math.max(THEME_MENU_VIEWPORT_MARGIN, triggerRect.top - THEME_MENU_OFFSET - renderedHeight) : Math.max(
      THEME_MENU_VIEWPORT_MARGIN,
      Math.min(
        triggerRect.bottom + THEME_MENU_OFFSET,
        window.innerHeight - THEME_MENU_VIEWPORT_MARGIN - renderedHeight
      )
    );
    this._themeList.style.left = `${Math.round(left)}px`;
    this._themeList.style.top = `${Math.round(top)}px`;
    this._themeList.style.minWidth = `${Math.round(listWidth)}px`;
    this._themeList.style.maxHeight = `${Math.round(maxHeight)}px`;
    this._themeList.style.visibility = "";
  }
  /**
   * @internal
   * @returns {void}
   */
  _observe() {
    this._mo?.disconnect();
    this._mo = new MutationObserver((mutations) => {
      if (this._isSyncingCode) return;
      const languageChanged = mutations.some(
        (mutation) => mutation.type === "attributes" && (mutation.attributeName === "data-lang" || mutation.attributeName === "lang")
      );
      const trimChanged = mutations.some(
        (mutation) => mutation.type === "attributes" && mutation.attributeName === "data-trim"
      );
      const sourceChanged = mutations.some(
        (mutation) => mutation.type === "childList" || mutation.type === "characterData"
      );
      this._updateHighlightState({
        force: languageChanged || trimChanged,
        syncSourceText: sourceChanged
      });
    });
    this._mo.observe(this, {
      attributes: true,
      attributeFilter: ["data-lang", "lang", "data-trim"],
      childList: true,
      characterData: true,
      subtree: true
    });
  }
  /**
   * @internal
   * @param {{ force?: boolean; syncSourceText?: boolean }} [options]
   * @returns {void}
   */
  _updateHighlightState({ force = false, syncSourceText = false } = {}) {
    const code = this._getCodeElement();
    if (!code) {
      this._lastText = null;
      this._lastLang = null;
      this._lastTrimEnabled = null;
      this._sourceText = null;
      this._tokens = [];
      this._textNode = null;
      _PixHighlighter.renderHighlights();
      return;
    }
    const sourceText = syncSourceText || this._sourceText == null ? code.textContent ?? "" : this._sourceText;
    const language = this._getLanguage();
    const trimEnabled = this._shouldTrimCode(code);
    const text = trimEnabled ? this._trimCode(sourceText) : sourceText;
    if (!force && sourceText === this._lastText && language === this._lastLang && trimEnabled === this._lastTrimEnabled) {
      return;
    }
    this._sourceText = sourceText;
    this._lastText = sourceText;
    this._lastLang = language;
    this._lastTrimEnabled = trimEnabled;
    this._tokens = this._lex(language, text);
    if (this._supportsHighlight) {
      this._isSyncingCode = true;
      code.textContent = text;
      this._textNode = code.firstChild || code.appendChild(document.createTextNode(""));
      this._isSyncingCode = false;
    } else {
      this._textNode = null;
      this._renderFallbackMarkup(code, text, this._tokens);
    }
    _PixHighlighter.renderHighlights();
  }
  /**
   * @internal
   * @param {HTMLElement} code
   * @param {string} text
   * @param {import('./lexers/_Utils.js').PixHighlighterToken[]} tokens
   * @returns {void}
   */
  _renderFallbackMarkup(code, text, tokens) {
    this._isSyncingCode = true;
    if (!tokens.length) {
      code.textContent = text;
      this._isSyncingCode = false;
      return;
    }
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    for (const token of tokens) {
      if (token.start < cursor) continue;
      if (token.start > cursor) {
        fragment.append(document.createTextNode(text.slice(cursor, token.start)));
      }
      const tokenElement = document.createElement("span");
      tokenElement.className = `pix-token pix-token--${token.type}`;
      tokenElement.textContent = text.slice(token.start, token.end);
      fragment.append(tokenElement);
      cursor = token.end;
    }
    if (cursor < text.length) {
      fragment.append(document.createTextNode(text.slice(cursor)));
    }
    code.replaceChildren(fragment);
    this._isSyncingCode = false;
  }
  /**
   * @internal
   * @param {PixHighlighterTheme} [theme=PixHighlighter.getCurrentTheme()]
   * @returns {void}
   */
  _syncThemeControl(theme = _PixHighlighter.getCurrentTheme()) {
    if (this._themeTriggerLabel) {
      this._themeTriggerLabel.textContent = getThemeLabel(theme);
    }
    this._syncThemeListSurface();
    const selectedIndex = Math.max(
      0,
      this._themeOptionButtons.findIndex(
        (button) => button.dataset.pixHighlighterThemeOption === theme
      )
    );
    this._activeThemeOptionIndex = selectedIndex;
    this._themeOptionButtons.forEach((button, index) => {
      const selected = index === selectedIndex;
      button.toggleAttribute("data-selected", selected);
      button.setAttribute("aria-checked", String(selected));
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
  }
  /**
   * @internal
   * @returns {number}
   */
  _getSelectedThemeOptionIndex() {
    return Math.max(
      0,
      this._themeOptionButtons.findIndex((button) => button.hasAttribute("data-selected"))
    );
  }
  /**
   * @internal
   * @param {number} index
   * @returns {void}
   */
  _focusThemeOptionByIndex(index) {
    if (!this._themeOptionButtons.length) {
      return;
    }
    const normalizedIndex = (index % this._themeOptionButtons.length + this._themeOptionButtons.length) % this._themeOptionButtons.length;
    this._activeThemeOptionIndex = normalizedIndex;
    this._themeOptionButtons.forEach((button, buttonIndex) => {
      button.tabIndex = buttonIndex === normalizedIndex ? 0 : -1;
    });
    this._themeOptionButtons[normalizedIndex]?.focus();
  }
  /**
   * @internal
   * @param {{ focusStrategy?: 'selected' | 'first' | 'last' }} [options]
   * @returns {void}
   */
  _openThemeMenu({ focusStrategy } = {}) {
    if (this._themeMenuOpen) {
      if (focusStrategy) {
        this._focusThemeMenu(focusStrategy);
      }
      return;
    }
    this._themeMenuOpen = true;
    this._themePicker && (this._themePicker.open = true);
    this._themeTrigger?.setAttribute("aria-expanded", "true");
    this._mountThemeList();
    this._positionThemeList();
    this._addFloatingThemePickerListeners();
    focusStrategy && this._focusThemeMenu(focusStrategy);
  }
  /**
   * @internal
   * @param {{ returnFocus?: boolean }} [options]
   * @returns {void}
   */
  _closeThemeMenu({ returnFocus = false } = {}) {
    if (!this._themeMenuOpen) {
      return;
    }
    this._themeMenuOpen = false;
    this._themePicker && (this._themePicker.open = false);
    this._themeTrigger?.setAttribute("aria-expanded", "false");
    this._removeFloatingThemePickerListeners();
    this._resetThemeListPosition();
    this._restoreThemeList();
    returnFocus && this._themeTrigger?.focus();
  }
  /**
   * @internal
   * @param {'selected' | 'first' | 'last'} focusStrategy
   * @returns {void}
   */
  _focusThemeMenu(focusStrategy) {
    if (focusStrategy === "first") {
      this._focusThemeOptionByIndex(0);
      return;
    }
    if (focusStrategy === "last") {
      this._focusThemeOptionByIndex(this._themeOptionButtons.length - 1);
      return;
    }
    this._focusThemeOptionByIndex(this._getSelectedThemeOptionIndex());
  }
  /**
   * @internal
   * @param {MouseEvent & { currentTarget: HTMLButtonElement }} event
   * @returns {void}
   */
  _handleThemeOptionClick(event) {
    const theme = event.currentTarget.dataset.pixHighlighterThemeOption;
    _PixHighlighter.applyTheme(theme);
    this._closeThemeMenu({ returnFocus: true });
  }
  /**
   * @internal
   * @returns {Promise<void>}
   */
  async _handleCopyClick() {
    const code = this._getCodeElement();
    if (!code?.textContent) return;
    try {
      await this._copyText(code.textContent);
      this._setCopyButtonState("copied");
    } catch {
      this._setCopyButtonState("error");
    }
  }
  /**
   * @internal
   * @param {string} value
   * @returns {Promise<void>}
   */
  async _copyText(value) {
    if (window.navigator?.clipboard?.writeText) {
      await window.navigator.clipboard.writeText(value);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand?.("copy");
    textarea.remove();
    if (!copied) {
      throw new Error("Copy command failed");
    }
  }
  /**
   * @internal
   * @param {'idle' | 'copied' | 'error'} state
   * @param {HTMLButtonElement | null} [button=this._copyButton]
   * @returns {void}
   */
  _setCopyButtonState(state, button = this._copyButton) {
    if (!button) return;
    const config = ICON_BUTTON_STATES[state] || ICON_BUTTON_STATES.idle;
    button.dataset.copyState = state;
    setIconButtonContent(button, config.icon, config.label);
    if (button !== this._copyButton) return;
    window.clearTimeout(this._copyResetTimer);
    this._copyResetTimer = window.setTimeout(() => {
      this._setCopyButtonState("idle");
    }, COPY_RESET_DELAY);
  }
  /**
   * @internal
   * @param {string} lang
   * @param {string} text
   * @returns {import('./lexers/_Utils.js').PixHighlighterToken[]}
   */
  _lex(lang, text) {
    return tokenizeSource(lang, text);
  }
};
function enhancePixHighlighters(root = document) {
  return PixHighlighter.enhanceAll(root);
}
function bootPixHighlighters() {
  if (typeof document === "undefined") return;
  enhancePixHighlighters(document);
}
export {
  PIX_HIGHLIGHTER_THEME_OPTIONS,
  PixHighlighter,
  enhancePixHighlighters,
  lexBash,
  lexC,
  lexCPP,
  lexCSS,
  lexCSharp,
  lexGo,
  lexHTML,
  lexJS,
  lexJSON,
  lexMarkdown,
  lexPHP,
  lexPython,
  lexRust,
  lexTS,
  lexYAML,
  normalizeLang,
  tokenizeSource
};
//# sourceMappingURL=index.js.map
