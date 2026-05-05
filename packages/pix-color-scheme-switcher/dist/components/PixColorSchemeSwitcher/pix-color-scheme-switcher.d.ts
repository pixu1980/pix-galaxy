/**
 * PixColorSchemeSwitcher Web Component.
 *
 * @element pix-color-scheme-switcher
 * @fires pix-color-scheme-switcher:change - Fired after applying a new scheme.
 */
export class PixColorSchemeSwitcher extends HTMLElement {
    static attributes: {};
    static events: {
        change(this: PixColorSchemeSwitcher, event: Event): void;
    };
    static styles: string;
    /**
     * The selected scheme mode.
     *
     * @returns {import('./pix-color-scheme-switcher.consts.js').PixColorScheme}
     */
    get currentScheme(): import("./pix-color-scheme-switcher.consts.js").PixColorScheme;
    /**
     * The resolved document scheme.
     *
     * @returns {'light' | 'dark'}
     */
    get resolvedScheme(): "light" | "dark";
    onRender(): void;
    onConnected(): void;
    onDisconnected(): void;
    /**
     * Apply a new color scheme.
     *
     * @param {string | null | undefined} scheme
     */
    applyColorScheme(scheme: string | null | undefined): void;
    #private;
}
export { normalizeScheme } from "./pix-color-scheme-switcher.utils.js";
export default PixColorSchemeSwitcher;
//# sourceMappingURL=pix-color-scheme-switcher.d.ts.map