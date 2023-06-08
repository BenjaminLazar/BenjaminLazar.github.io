import { css, html } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  ModeTrackable,
  EmailComponent,
  EmailComponentBaseClasses,
} from '../../mixins';
import { emailImageWidthAligner } from '../../services/email-image-width-aligner';
import { FieldDefinition, AllowLayout } from '../../mixins/props';

class MJMLColumn extends applyMixins(FusionBase, [
  ModeTrackable,
  EmailComponent,
  EmailComponentBaseClasses,
  FieldDefinition,
  AllowLayout,
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
      'vertical-align': {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'layout',
        value: 'middle',
        selectOptions: [
          { value: 'top', icon: 'start-horizontal' },
          { value: 'middle', icon: 'center-horizontal' },
          { value: 'bottom', icon: 'end-horizontal' },
          { value: 'stretch', icon: 'stretch-horizontal' },
        ],
      },
      'padding-top': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'padding',
        value: '10px',
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
        value: '10px',
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

  static getVerticalPosition() {
    return {
      top: 'flex-start',
      middle: 'center',
      bottom: 'flex-end',
      stretch: 'stretch',
    };
  }

  static get options() {
    /**
      * @todo Can't migrate to * as we have filter isRootNested. Should improve in 1.11 or next minor version
      * nestedComponents: ['*'],
      * excludedComponents: ['mj-section', 'mj-column'],
    */
    return {
      ...super.options,
      componentName: 'mj-column',
      componentUIName: 'Column container',
      componentCategory: 'container',
      componentDescription: 'Group column container for editor',
      nestedComponents: ['mj-button', 'mj-divider', 'mj-image', 'mj-spacer', 'mj-text', 'mj-raw'],
      dependsOnParent: true,
    };
  }

  applyPosition() {
    this.style.setProperty('align-self', this.constructor.getVerticalPosition()[this['vertical-align']]);
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has('width') && this.isRendered) {
      this.setElementProp('width', this.width);
      emailImageWidthAligner.handleUpdateWidth(this);
    }
    if (changedProperties.has('vertical-align')) {
      this.applyPosition();
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
          display: block;
          width: var(--width);
          max-width: 100%;
          border-radius: var(--border-radius);
          background-color: var(--background-color);
          vertical-align: var(--vertical-align);
        }
        :host .mj-column {
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='mj-column'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { MJMLColumn };
