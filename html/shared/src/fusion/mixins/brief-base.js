import { css, html } from 'lit-element';

export function BriefComponentBase(superClass) {
  return class extends superClass {
    static get options() {
      return {
        ...super.options,
        componentDomain: 'brief',
        isRootNested: true,
        resizable: false,
        draggable: 'y',
        rotatable: false,
        sortable: false,
      };
    }

    static get properties() {
      return {
        ...super.properties,
      };
    }

    static get styles() {
      return [
        super.styles,
        css`
          :host {
            position: var(--position);
            display: block;
          }
          :host > *:not([name="mo-system"], style) {
            box-sizing: border-box;
          }
        `,
      ];
    }

    get dynamicStyles() {
      return html`
        ${super.dynamicStyles}
        :host {
          z-index: ${this.constructor.zIndex};
        }
      `;
    }
  };
}
