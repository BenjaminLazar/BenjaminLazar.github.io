import { html } from 'lit-element';

export function SafeFontFamilyCombination(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
      };
    }

    getSafeFontCombination(font = this['font-family']) {
      const safeFonts = {
        Arial: 'Helvetica, sans-serif',
        'Arial Black': 'Gadget, sans-serif',
        'Comic Sans MS': 'cursive, sans-serif',
        'Courier New': 'Courier, monospace',
        Georgia: 'serif',
        Helvetica: 'Arial, sans-serif',
        Impact: 'Charcoal, sans-serif',
        'Times New Roman': 'Times, serif',
        'Trebuchet MS': 'Helvetica, sans-serif',
        Verdana: 'Geneva, sans-serif',
      };
      return safeFonts[font] || 'Arial, sans-serif';
    }

    get dynamicStyles() {
      const safeFontCombination = this.getSafeFontCombination();
      return html`
      ${super.dynamicStyles}
      :host([font-family]) {
        font-family: var(--font-family), ${safeFontCombination};
      }
      ::slotted(div.ql-editor),
      ::slotted(div[slot="content"]) {
        font-family: var(--font-family), ${safeFontCombination};
      }`;
    }
  };
}
