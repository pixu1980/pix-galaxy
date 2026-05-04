/**
 * PixButton Web Component.
 *
 * An accessible button wrapper that keeps the native `<button>` semantics in
 * light DOM while exposing the legacy `pix-button:click` event.
 *
 * @element pix-button
 * @attr {'primary' | 'secondary' | 'ghost'} [variant='primary'] - Button visual variant.
 * @attr {boolean} [disabled] - Disables the internal button.
 * @fires {CustomEvent} pix-button:click - Fired when the button is activated.
 * @cssprop --pix-button-background - Button background color.
 * @cssprop --pix-button-color - Button foreground color.
 * @cssprop --pix-button-border-color - Button border color.
 * @cssprop --pix-button-radius - Button border radius.
 * @cssprop --pix-button-padding-block - Button block padding.
 * @cssprop --pix-button-padding-inline - Button inline padding.
 * @csspart button - The managed native button element.
 */
export class PixButton extends HTMLElement {
    static attributes: {
        variant(this: HTMLElement, _oldValue: string | null, newValue: string | null): void;
        disabled(this: HTMLElement, _oldValue: string | null, newValue: string | null): void;
    };
    static events: {
        click(this: PixButton, event: MouseEvent): void;
    };
    static styles: string;
    /**
     * @param {string | null | undefined} value
     */
    set variant(value: string | null | undefined);
    /**
     * The active button variant.
     *
     * @returns {import('./pix-button.consts.js').PixButtonVariant}
     */
    get variant(): import("./pix-button.consts.js").PixButtonVariant;
    /**
     * @param {boolean} value
     */
    set disabled(value: boolean);
    /**
     * Whether the button is disabled.
     *
     * @returns {boolean}
     */
    get disabled(): boolean;
    onRender(): void;
    /**
     * @param {string} name
     * @param {string | null} _oldValue
     * @param {string | null} newValue
     */
    onAttributeChanged(name: string, _oldValue: string | null, newValue: string | null): void;
    #private;
}
export { normalizeVariant } from "./pix-button.utils.js";
export default PixButton;
//# sourceMappingURL=pix-button.d.ts.map