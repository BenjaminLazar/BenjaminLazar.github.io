import { css, html } from 'lit-element';
import { FusionBase } from '../../base';
import { applyMixins, EmailComponent } from '../../mixins';
import { FieldDefinition } from '../../mixins/props';

class MJMLSpacer extends applyMixins(FusionBase, [
  EmailComponent,
  FieldDefinition,
]) {
  static get properties() {
    return {
      height: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'size',
        value: '20px',
        availableUnits: [{ unitType: 'px' }],
      },
      'container-background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'background',
        value: 'rgba(255, 255, 255, 0)',
      },
      ...super.properties,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'mj-spacer',
      componentUIName: 'Spacer',
      componentDescription: 'Displays a blank space',
      isTextEdit: true,
      nestedComponents: [],
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
          background-color: var(--container-background-color);
          height: var(--height);
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div>
        <div></div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { MJMLSpacer };
