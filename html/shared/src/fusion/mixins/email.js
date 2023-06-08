import { css } from 'lit-element';

/* activatorOnly:start */
import { generalIconsStyles } from '../styles';
/* activatorOnly:end */

export function EmailComponent(superClass) {
  return class extends superClass {
    static get styles() {
      return [
        super.styles,
        /* activatorOnly:start */
        generalIconsStyles,
        /* activatorOnly:end */
        css`
          :host {
            position: relative;
            box-sizing: border-box;
          }

          :host(.ui-sortable-placeholder) div {
            opacity: 0;
          }
        `,
      ];
    }

    static get options() {
      return {
        ...super.options,
        componentDomain: 'email',
        isRootNested: false,
        resizable: false,
        draggable: false,
        rotatable: false,
        sortable: true,
      };
    }
  };
}
