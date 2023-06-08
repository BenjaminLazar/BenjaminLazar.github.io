import { css, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { FusionCustomPopupOverlay } from '../../custom-popup-overlay';
import { FusionStore } from '../../../services/fusion-store';
import { applyMixins } from '../../../mixins';
import {
  Dimensions,
} from '../../../mixins/props';
import { BorderUpdateHandler } from '../../../services/border-update-handler';
import { isReflectiveBoolean } from '../../../utils';

class FusionReferencesPopupOverlay extends applyMixins(FusionCustomPopupOverlay, [
  Dimensions,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-references-popup-overlay',
      componentUIName: 'References Overlay',
      componentDescription: 'Component for showing references',
    };
  }

  static get properties() {
    const {
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      color,
      width,
    } = super.properties;
    return {
      ...super.properties,
      width: {
        ...width,
        value: '800px',
      },
      'content-width': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'references',
        value: '750px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'padding-top': {
        ...paddingTop,
        value: '10px',
      },
      'padding-right': {
        ...paddingRight,
        value: '10px',
      },
      'padding-bottom': {
        ...paddingBottom,
        value: '10px',
      },
      'padding-left': {
        ...paddingLeft,
        value: '10px',
      },
      'text-indentation': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'text',
        value: '10px',
      },
      color: {
        ...color,
        fieldType: 'ColorPicker',
        value: 'rgba(0, 0, 0, 1)',
      },
      'reference-margin-top': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'margin',
        value: '10px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'reference-margin-bottom': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'margin',
        value: '10px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'show-reference-icon': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'references',
        value: isReflectiveBoolean(),
        prop: true,
      },
      'show-list-numeration': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'references',
        value: isReflectiveBoolean(),
        prop: true,
      },
      'indication-vertical-align': {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'references',
        value: 'top',
        selectOptions: [
          { value: 'top', icon: 'textaligntop' },
          { value: 'middle', icon: 'textaligncenter' },
          { value: 'bottom', icon: 'textalignbottom' },
        ],
      },
    };
  }

  generateContent() {
    const references = Object.values(FusionStore.references);
    return references.length ? this.generateReferences(references) : this.constructor.generateDummyText();
  }

  generateReferences(references) {
    return html`
      <div class="references-list">
        ${references.map((item, index) => this.getReferencesTemplateResult(item, index))}
      </div>
    `;
  }

  static generateDummyText() {
    return html`
      <fusion-text
        top="50%"
        left="50%"
        width="auto">
          <p>References aren't defined</p>
      </fusion-text>
    `;
  }

  getReferencesTemplateResult(item, index) {
    return html`
      <fusion-reference-item
        color="${this.color}"
        text-padding-left="${this['text-indentation']}"
        margin="${this['reference-margin-top']} 0 ${this['reference-margin-bottom']}"
        font-size="${this['font-size']}"
        font-weight="${this['font-weight']}"
        font-family="${this['font-family']}"
        font-style="${this['font-style']}"
        data-referenceId="${item.referenceId}"
        indication-vertical-align="${this['indication-vertical-align']}">
          <div slot='indicator' class="${this['show-list-numeration'] ? '' : 'hidden'}">${index + 1}.</div>
          <div slot='icon' class="${item.link ? 'pdf' : 'document'} ${this['show-reference-icon'] ? '' : 'hidden'}"></div>
          <div slot='content'>${unsafeHTML(item.title)}</div>
      </fusion-reference-item>
    `;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          border: none;
          border-radius: unset;
          padding: unset;
        }
        .references {
          position: relative;
          overflow: auto;
          height: 100%;
          border: var(--border-width) var(--border-style) var(--border-color);
          border-radius: var(--border-radius);
        }
        .references-list {
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
          width: var(--content-width);
          display: flex;
          flex-direction: column;
        }
        .hidden {
          display: none;
        }
        fusion-text {
          transform: translate3d(-50%, -50%, 0);
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host .references {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <slot></slot>
      <div class="references">
        ${this.generateContent()}
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionReferencesPopupOverlay };
