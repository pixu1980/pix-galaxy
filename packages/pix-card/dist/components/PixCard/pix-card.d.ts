/**
 * PixCard Web Component.
 *
 * A light-DOM card container that preserves the previous `header`, default,
 * and `footer` content channels while switching to the shared custom-element
 * runtime architecture.
 *
 * @element pix-card
 * @attr {'default' | 'outlined' | 'elevated'} [variant='default'] - Card visual variant.
 * @attr {string} [href] - Optional URL. When set, the card renders as a link.
 * @slot - Default content channel for the card body.
 * @slot header - Content promoted into the card header.
 * @slot footer - Content promoted into the card footer.
 * @cssprop --pix-card-background - Card background color.
 * @cssprop --pix-card-color - Card text color.
 * @cssprop --pix-card-border-color - Card border color.
 * @cssprop --pix-card-radius - Card border radius.
 * @cssprop --pix-card-shadow - Card box shadow.
 * @cssprop --pix-card-padding - Card internal spacing.
 * @csspart card - The outer wrapper element.
 * @csspart header - The header section.
 * @csspart body - The body section.
 * @csspart footer - The footer section.
 */
export class PixCard extends HTMLElement {
    static attributes: {
        variant(this: HTMLElement, _oldValue: string | null, newValue: string | null): void;
        href(this: HTMLElement, _oldValue: string | null, _newValue: string | null): void;
    };
    static events: {};
    static styles: string;
    /**
     * @param {string | null | undefined} value
     */
    set variant(value: string | null | undefined);
    /**
     * The active card variant.
     *
     * @returns {import('./pix-card.consts.js').PixCardVariant}
     */
    get variant(): import("./pix-card.consts.js").PixCardVariant;
    /**
     * @param {string | null | undefined} value
     */
    set href(value: string | null | undefined);
    /**
     * The optional destination URL for link-style cards.
     *
     * @returns {string | null}
     */
    get href(): string | null;
    onRender(): void;
    /**
     * @param {string} name
     * @param {string | null} _oldValue
     * @param {string | null} newValue
     */
    onAttributeChanged(name: string, _oldValue: string | null, newValue: string | null): void;
    #private;
}
export { normalizeVariant } from "./pix-card.utils.js";
export default PixCard;
//# sourceMappingURL=pix-card.d.ts.map