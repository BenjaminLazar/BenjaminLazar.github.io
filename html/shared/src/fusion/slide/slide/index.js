import { html, css } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  ModeTrackable,
  SlideComponentBase,
} from '../../mixins';

import {
  Dimensions,
  Background,
  Typography,
  FieldDefinition,
} from '../../mixins/props';

class FusionSlide extends applyMixins(FusionBase, [
  SlideComponentBase,
  ModeTrackable,
  Dimensions,
  Background,
  Typography,
  FieldDefinition,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-slide',
      componentUIName: 'Body',
      componentDescription: 'Root element for slide',
      isRootNested: false,
      excludedComponents: ['fusion-slide'],
      baseLevel: 100,
      resizable: false,
      draggable: false,
      rotatable: false,
      removable: false,
    };
  }

  static get properties() {
    const {
      width,
      height,
      color,
      'font-size': fontSize,
      'font-weight': fontWeight,
      'font-style': fontStyle,
      'letter-spacing': letterSpacing,
      'line-height': lineHeight,
      'min-width': minWidth,
      'min-height': minHeight,
      'max-width': maxWidth,
      'max-height': maxHeight,
      ...filteredProp
    } = super.properties;
    return {
      width: {
        ...width,
        fieldType: 'hidden',
        min: [
          { unitType: 'px', value: 0 },
          { unitType: '%', value: 0 },
          { unitType: 'vw', value: 0 },
          { unitType: 'vmin', value: 0 },
          { unitType: 'vmax', value: 0 },
        ],
        max: [
          { unitType: '%', value: 100 },
        ],
        value: '100%',
      },
      height: {
        ...height,
        fieldType: 'hidden',
        value: '100%',
      },
      ...filteredProp,
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host [part='slide'] {
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div part="slide">
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionSlide };
