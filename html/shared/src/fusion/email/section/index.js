import { css, html } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  ModeTrackable,
  EmailComponent,
  EmailComponentBaseClasses,
} from '../../mixins';
import { FieldDefinition } from '../../mixins/props';

class MJMLSection extends applyMixins(FusionBase, [
  ModeTrackable,
  EmailComponent,
  EmailComponentBaseClasses,
  FieldDefinition,
]) {
  static get properties() {
    return {
      ...super.properties,
      'border-radius': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'border',
        value: '0px',
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
        value: '20px',
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
        value: '20px',
        availableUnits: [{ unitType: 'px' }],
      },
      'padding-left': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'padding',
        value: '0px',
        availableUnits: [{ unitType: 'px' }],
      },
      'background-url': {
        type: String,
        fieldType: 'Modal',
        propertyGroup: 'background',
        value: '',
        assetType: 'Image',
      },
      'background-position-x': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'background',
        value: '0%',
        availableUnits: [
          { unitType: '%' },
          { unitType: 'left', noInputNumber: true },
          { unitType: 'center', noInputNumber: true },
          { unitType: 'right', noInputNumber: true },
        ],
      },
      'background-position-y': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'background',
        value: '0%',
        availableUnits: [
          { unitType: '%' },
          { unitType: 'top', noInputNumber: true },
          { unitType: 'center', noInputNumber: true },
          { unitType: 'bottom', noInputNumber: true },
        ],
      },
      'background-repeat': {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'background',
        value: 'repeat',
        selectOptions: [
          'no-repeat',
          'repeat ',
          'repeat-x',
          'repeat-y',
        ],
      },
      'background-size': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'background',
        value: 'auto',
        availableUnits: [
          { unitType: 'px' },
          { unitType: '%' },
          { unitType: 'auto', noInputNumber: true },
          { unitType: 'cover', noInputNumber: true },
          { unitType: 'contain', noInputNumber: true },
        ],
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'mj-section',
      componentUIName: 'Row container',
      componentCategory: 'container',
      componentDescription: 'Group row container for editor',
      nestedComponents: ['mj-column', 'mj-group'],
    };
  }

  update(changedProps) {
    super.update(changedProps);
  }

  static get styles() {
    return [
      super.styles,
      css`
         mj-section {
           padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
        }
        :host {
          display: block;
          margin: 0 auto;
          width: var(--mj-body-width);
          min-height: 40px;
          border-radius: var(--border-radius);
          background-color: var(--background-color);
          direction: var(--direction);
          text-align: var(--text-align);
          vertical-align: var(--vertical-align);
        }
        .mj-section {
          margin: 0 auto;
          width: var(--mj-body-width);
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
          box-sizing: border-box;
          background-position-x: var(--background-position-x);
          background-position-y: var(--background-position-y);
          background-repeat: var(--background-repeat);
          background-size: var(--background-size);
        }
        slot:not([name="mo-system"]) {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: center;
        }
      `,
    ];
  }

  get dynamicStyles() {
    const url = `url(${this['background-url']})`;
    return html`
      ${super.dynamicStyles}
      :host .mj-section {
        background-image: ${url};
      }
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='mj-section'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { MJMLSection };
