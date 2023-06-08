import { html, css } from 'lit-element';
import { FusionBase } from '../../base';
import config from '../../../config.json';
import {
  applyMixins,
  SlideComponentBase,
} from '../../mixins';
import {
  Dimensions,
  FieldDefinition,
  Grid,
  Container,
} from '../../mixins/props';

class FusionGrid extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  Grid,
  FieldDefinition,
]) {
  static get properties() {
    const {
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      width,
      height,
      ...filteredProps
    } = super.properties;
    return {
      width: {
        ...width,
        value: config.responsive ? '100%' : '400px',
      },
      height: {
        ...height,
        value: config.responsive ? '100%' : '400px',
      },
      ...filteredProps,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-grid',
      componentUIName: 'Grid',
      componentDescription: 'Grid component for responsive designs',
      isTextEdit: false,
      excludedComponents: [],
      nestedComponents: ['fusion-column'],
      defaultTemplate: '',
    };
  }

  constructor() {
    super();
    this.columns = '12';
    this.rows = '1';
  }

  // @todo Dynamically generate column/row styles
  static get styles() {
    return [
      super.styles,
      css`
        /* spacing - legacy */
        :host([spacing='none']) {
          grip-gap: 0;
        }
        :host([spacing='small']) {
          grid-gap: 8px;
        }
        :host([spacing='medium']) {
          grid-gap: 12px;
        }
        :host([spacing='large']) {
          grid-gap: 16px;
        }
        /* end */

        :host {
          display: grid;
          grid-template-columns: repeat(var(--columns), 1fr);
          column-gap: var(--column-gap);
          row-gap: var(--row-gap);
        }
        ::slotted(*) {
          width: auto;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <slot></slot>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionGrid };
