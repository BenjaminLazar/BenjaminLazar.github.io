import { html } from 'lit-element';
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

class FusionBrief extends applyMixins(FusionBase, [
  SlideComponentBase,
  Dimensions,
  Background,
  Typography,
  ModeTrackable,
  FieldDefinition,
]) {
  static get options() {
    const { excludedComponents = [] } = super.options;
    return {
      ...super.options,
      componentDomain: 'slide', // @todo change to brief for separate build
      componentName: 'fusion-brief',
      componentUIName: 'Brief',
      componentDescription: 'Root element for brief',
      isRootNested: false,
      excludedComponents: [...excludedComponents, 'fusion-brief'],
      baseLevel: 100,
      resizable: false,
      draggable: false,
      rotatable: false,
      removable: false,
    };
  }

  static get properties() {
    const {
      color,
      'font-size': fontSize,
      'font-weight': fontWeight,
      'font-style': fontStyle,
      'letter-spacing': letterSpacing,
      'line-height': lineHeight,
      ...filteredProp
    } = super.properties;
    return {
      ...filteredProp,
    };
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div part="brief">
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionBrief };
