/**
 * PixBaseline Web Component.
 *
 * Placeholder baseline scaffold aligned with the shared custom-element runtime
 * architecture used across pix-galaxy.
 *
 * @element pix-baseline
 * @attr {'default' | 'outlined'} [variant='default'] - Visual variant.
 */
export class PixBaseline extends HTMLElement {
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
     * @returns {import('./pix-baseline.consts.js').PixBaselineVariant}
     */
    get variant(): import("./pix-baseline.consts.js").PixBaselineVariant;
    onRender(): void;
    /**
     * @param {string} name
     * @param {string | null} _oldValue
     * @param {string | null} newValue
     */
    onAttributeChanged(name: string, _oldValue: string | null, newValue: string | null): void;
    #private;
}
export { normalizeVariant } from "./pix-baseline.utils.js";
export default PixBaseline;
//# sourceMappingURL=pix-baseline.d.ts.map