import { html } from 'lit-element';
import { createObjectItem } from '../../utils';
import { FusionReferencesPopupOverlay } from './references-popup-overlay';
import { FusionPopup } from '../popup';

const state = 'ReferencePopup';

class FusionReferencesPopup extends FusionPopup {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-references-popup',
      componentUIName: 'Reference Popup',
      componentCategory: 'overlay',
      componentDescription: 'Component for showing references',
      nestedComponents: ['fusion-backdrop', 'fusion-references-popup-overlay'],
    };
  }

  static get state() {
    return state;
  }

  constructor() {
    super();
    this.state = state;
    this.overlay = createObjectItem(FusionReferencesPopupOverlay);
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

export { FusionReferencesPopup };
