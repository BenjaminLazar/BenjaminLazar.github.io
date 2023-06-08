import { html, css } from 'lit-element';
import { FusionGroup } from '../../../fusion/slide/group';
import { applyMixins } from '../../../fusion/mixins';
import { Dimensions } from '../../../fusion/mixins/props';
import { createObjectItem } from '../../../fusion/utils';
import { CustomMediaText } from './custom-media-text';

class CustomMediaContainer extends applyMixins(FusionGroup, [Dimensions]) {
  // Public property API that triggers re-render (synced with attributes)
  static get properties() {
    const {
      top, left, width, height, position, ...rest
    } = super.properties;
    return {
      top: {
        ...top,
        value: '50%',
      },
      left: {
        ...left,
        value: '50%',
      },
      width: {
        ...width,
        value: '50%',
      },
      height: {
        ...height,
        value: '300px',
      },
      ...rest,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'custom-media-container',
      componentUIName: 'Custom Media Container',
      componentScope: 'custom',
      componentDescription: 'Simple container with product logo',
      componentDomain: 'slide',
    };
  }

  constructor() {
    super();
    this.text = createObjectItem(CustomMediaText);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: absolute;
        }
        @media only screen and (max-width:990px) {
          :host {
            position: relative;
            width: 100%;
            height: auto;
            top: 0 !important;
            left: 0;
          }
        }
      `,
    ];
  }

  render() {
    super.render();
    return html`
     <style>
        ${this.dynamicStyles}
      </style>
     <div>
       <slot></slot>
     </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { CustomMediaContainer };
