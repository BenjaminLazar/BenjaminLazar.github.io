import { html } from 'lit-element';
import { FusionBase } from '../../base';
import { applyMixins, SlideComponentBase } from '../../mixins';
import {
  Container,
  Dimensions,
  Display,
  FieldDefinition,
} from '../../mixins/props';

class FusionForm extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Display,
  Dimensions,
  FieldDefinition,
]) {
  static get properties() {
    const {
      width,
      height,
      overflow,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      ...rest
    } = super.properties;
    return {
      ...rest,
      width: {
        ...width,
        value: '200px',
      },
      height: {
        ...height,
        value: '200px',
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-form',
      componentUIName: 'Form',
      componentCategory: 'data',
      componentDescription: 'Container for form elements',
      baseLevel: 100,
      nestedComponents: ['fusion-submit-email', 'fusion-text-input', 'fusion-button'],
    };
  }

  render() {
    super.render();
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class="fusion-input-container">
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionForm };
