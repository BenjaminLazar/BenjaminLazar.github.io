import { css, html } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  SlideComponentBase,
} from '../../mixins';
import {
  Container,
  Dimensions,
  Display,
  Background,
  FieldDefinition,
} from '../../mixins/props';

class FusionLine extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  Display,
  Background,
  FieldDefinition,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-line',
      componentUIName: 'Line',
      componentDescription: 'Component for showing lines',
      nestedComponents: [],
      resizable: 'e,w',
    };
  }

  static get properties() {
    const {
      top,
      left,
      width,
      overflow,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      'background-color': backgroundColor,
      'background-size': backgroundSize,
      'background-position-x': backgroundX,
      'background-position-y': backgroundY,
      'background-image': backgroundImage,
      'background-repeat': backgroundRepeat,
      'background-attachment': backgroundAttachment,
      ...rest
    } = super.properties;
    return {
      top,
      left,
      width,
      ...rest,
      'line-height': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'line',
        value: '1px',
        min: 1,
        availableUnits: [{ unitType: 'px' }],
      },
      'line-type': {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'line',
        value: 'solid',
        selectOptions: [
          { value: 'solid', icon: 'zoomminus' },
          { value: 'dotted', icon: 'dotted' },
          { value: 'dashed', icon: 'dashed' },
        ],
      },
      'background-color': {
        ...backgroundColor,
        propertyGroup: 'line',
        value: 'rgba(177, 192, 201, 1)',
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          --margin: 10px;
          height: calc(var(--line-height) + var(--margin) * 2);
        }
        .line {
          margin: var(--margin) 0;
          width: 100%;
          border-top: var(--line-height) var(--line-type) var(--background-color);
        }
        :host > :not([name="mo-system"]) {
          background-color: transparent;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='line'></div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionLine };
