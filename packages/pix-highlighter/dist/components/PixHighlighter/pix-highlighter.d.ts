/**
 * PixHighlighter Web Component.
 *
 * Placeholder highlighter scaffold aligned with the shared custom-element
 * runtime architecture used across pix-galaxy.
 *
 * @element pix-highlighter
 * @attr {'default' | 'outlined'} [variant='default'] - Visual variant.
 */
export class PixHighlighter extends HTMLElement {
    static attributes: {
        variant(this: HTMLElement, _oldValue: string | null, newValue: string | null): void;
    };
    static events: {};
    static styles: string;
    /**
     * @param {string | null | undefined} value
     */
    set variant(value: string | null | undefined);
    /**
     * @returns {import('./pix-highlighter.consts.js').PixHighlighterVariant}
     */
    get variant(): import("./pix-highlighter.consts.js").PixHighlighterVariant;
    onRender(): void;
    /**
     * @param {string} name
     * @param {string | null} _oldValue
     * @param {string | null} newValue
     */
    onAttributeChanged(name: string, _oldValue: string | null, newValue: string | null): void;
    #private;
}
export { normalizeVariant } from "./pix-highlighter.utils.js";
export default PixHighlighter;
//# sourceMappingURL=pix-highlighter.d.ts.map