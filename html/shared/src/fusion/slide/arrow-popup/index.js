import { css, html } from 'lit-element';
import { FusionPopup } from '../popup';
import { createObjectItem } from '../../utils';
import { FusionArrowPopupOverlay } from '../arrow-popup-overlay';

const state = 'ArrowPopup';

class FusionArrowPopup extends FusionPopup {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-arrow-popup',
      componentUIName: 'Arrow Popup',
      componentDescription: 'Popup with selectable placement of pointing arrow',
      nestedComponents: ['fusion-backdrop', 'fusion-arrow-popup-overlay'],
    };
  }

  static get state() {
    return state;
  }

  constructor() {
    super();
    this.state = state;
    this.overlay = createObjectItem(FusionArrowPopupOverlay);
  }

  static get styles() {
    return [
      super.styles,
      css`
        [part='overlay'] {
          padding: 30px 40px;
          background-clip: padding-box; 
        }
        [part="overlay"]:before {
          content: "";
          position: absolute;
          border: solid transparent;
          pointer-events: none;
        }
       `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='popup-content-wrapper'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionArrowPopup };
