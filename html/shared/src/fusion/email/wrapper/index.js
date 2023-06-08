import { css, html } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  EmailComponent,
  EmailComponentBaseClasses,
  ModeTrackable,
} from '../../mixins';
import { FieldDefinition } from '../../mixins/props';
import { FusionApi } from '../../api';
import { MJMLSection } from '../section';
import { isReflectiveBoolean } from '../../utils';

class MJWrapper extends applyMixins(FusionBase, [
  EmailComponent,
  EmailComponentBaseClasses,
  ModeTrackable,
  FieldDefinition,
]) {
  constructor() {
    super();
    this.nodeInfoProps = [
      ...this.nodeInfoProps,
      'is-layout',
    ];
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'mj-wrapper',
      componentUIName: 'Layout container',
      componentCategory: 'container',
      componentDescription: 'Layout container to group rows for editor',
      nestedComponents: ['mj-section'],
      isRootNested: true,
    };
  }

  static get properties() {
    return {
      ...super.properties,
      'full-section-width': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'layout',
        value: isReflectiveBoolean(),
        prop: true,
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
      'padding-bottom': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'padding',
        value: '0px',
        availableUnits: [{ unitType: 'px' }],
      },
    };
  }

  updateFullSectionWidth(changedProps) {
    if (changedProps.has('full-section-width')) {
      this['full-section-width'] ? this.setAttribute('full-width', 'full-width') : this.removeAttribute('full-width');
    }
  }

  update(changedProps) {
    super.update(changedProps);
    this.updateFullSectionWidth(changedProps);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: 0 auto;
          width: var(--mj-body-width);
          min-height: 40px;
          background-color: var(--background-color);
        }
        .mj-wrapper {
          margin: 0 auto;
          padding: var(--padding-top) 0 var(--padding-bottom) 0;
          width: var(--mj-body-width);
          box-sizing: border-box;
        }
        slot:not([name="mo-system"]) {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: center;
        }
        :host([full-width]) {
          width: 100%;
        }
      `,
    ];
  }

  isElementsExist(name) {
    return !![...this.querySelectorAll(name)].length;
  }

  async elementCreationIfNeeded(component, options = {}) {
    const { options: { componentName, defaultTemplate } } = component;
    if (!this.isElementsExist(componentName)) {
      await FusionApi.createElement(componentName, {}, defaultTemplate, this, `#${this.id}`, options);
    }
  }

  async firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    await this.elementCreationIfNeeded(MJMLSection);
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
    `;
  }

  render() {
    return html`
       <style>
        ${this.dynamicStyles}
       </style>
       <div class='mj-wrapper'>
         <slot></slot>
       </div>
       ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { MJWrapper };
