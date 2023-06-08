import { css, html } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  EmailComponent,
  EmailComponentBaseClasses,
} from '../../mixins';
import { emailImageWidthAligner } from '../../services/email-image-width-aligner';
import { FieldDefinition } from '../../mixins/props';

class MJMLGroup extends applyMixins(FusionBase, [
  EmailComponent,
  EmailComponentBaseClasses,
  FieldDefinition,
]) {
  static get properties() {
    return {
      ...super.properties,
      width: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'size',
        value: '100%',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'background',
        value: 'rgba(255, 255, 255, 0)',
      },
      'padding-top': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'padding',
        value: '0px',
        availableUnits: [{ unitType: 'px' }],
      },
      'padding-right': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'padding',
        value: '0px',
        availableUnits: [{ unitType: 'px' }],
      },
      'padding-bottom': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'padding',
        value: '0px',
        availableUnits: [{ unitType: 'px' }],
      },
      'padding-left': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'padding',
        value: '0px',
        availableUnits: [{ unitType: 'px' }],
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'mj-group',
      componentUIName: 'Group container',
      componentCategory: 'container',
      componentDescription: 'Email group component',
      nestedComponents: ['mj-column'],
      dependsOnParent: true,
    };
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has('width') && this.isRendered) {
      this.setElementProp('width', this.width);
      emailImageWidthAligner.handleUpdateWidth(this);
    }
    if (changedProperties.has('--width') && this.isRendered) {
      emailImageWidthAligner.alignElementWidthByParent(this);
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          width: var(--width);
          display: block;
          min-height: 20px;
          background-color: var(--background-color);
        }
        slot {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: flex-start;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='mj-group'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { MJMLGroup };
