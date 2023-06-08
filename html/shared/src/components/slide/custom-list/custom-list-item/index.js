import { css } from 'lit-element';
import { FusionListItem } from '../../../../fusion/slide/list/list-item';

class CustomListItem extends FusionListItem {
  static get options() {
    return {
      ...super.options,
      componentName: 'custom-list-item',
      componentUIName: 'Custom List Item',
      componentScope: 'custom',
      nestedComponents: ['custom-nested-list'],
    };
  }

  static get properties() {
    const {
      margin,
      ...rest
    } = super.properties;
    return {
      ...rest,
      margin,
      'indication-margin-top': {
        ...margin,
        value: '0px',
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host ::slotted([slot='indicator'] img) {
          width: var(--indication-width);           
          margin-top: var(--indication-margin-top) !important;    
        }
      `,
    ];
  }
}

export { CustomListItem };
