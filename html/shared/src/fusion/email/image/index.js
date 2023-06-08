import { css, html } from 'lit-element';
import { FusionBase } from '../../base';
import { getValueObject } from '../../utils';
import {
  applyMixins,
  ModeTrackable,
  LinkExtension,
  EmailComponent,
  EmailComponentBaseClasses,
  ContentModule,
} from '../../mixins';
import { emailImageWidthAligner } from '../../services/email-image-width-aligner';
import { FieldDefinition } from '../../mixins/props';

class MJMLImage extends applyMixins(FusionBase, [
  ModeTrackable,
  LinkExtension,
  EmailComponent,
  EmailComponentBaseClasses,
  ContentModule,
  FieldDefinition,
]) {
  static get properties() {
    const {
      'should-shown': shouldShown,
      ...rest
    } = super.properties;
    return {
      ...rest,
      'should-shown': {
        ...shouldShown,
        value: true,
      },
      width: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'size',
        value: '400px',
        prop: true,
        availableUnits: [{ unitType: 'px' }],
      },
      src: {
        type: String,
        fieldType: 'Modal',
        propertyGroup: 'image',
        value: 'https://cdn.activator.cloud/assets/placeholder.jpg',
        prop: true,
        assetType: 'Image',
      },
      'container-background-color': {
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
      align: {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'layout',
        value: 'center',
        selectOptions: [
          { value: 'left', icon: 'start-vertical' },
          { value: 'center', icon: 'center-vertical' },
          { value: 'right', icon: 'end-vertical' },
        ],
      },
      'border-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'border',
        value: 'rgba(255, 255, 255, 0)',
      },
      'border-width': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'border',
        value: '0px',
        availableUnits: [{ unitType: 'px' }],
      },
      'border-radius': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'border',
        value: '0px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'hidden-on-mobile': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyArea: 'settings',
        propertyGroup: 'image',
        value: false,
        prop: true,
      },
      'fluid-on-mobile': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'image',
        value: false,
      },
      alt: {
        type: String,
        fieldType: 'String',
        propertyArea: 'settings',
        propertyGroup: 'image',
        value: 'Image',
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'mj-image',
      componentContentType: 'image',
      componentUIName: 'image container',
      componentDescription: 'Image container for editor',
      nestedComponents: [],
      dependsOnParent: true,
    };
  }

  getBorder() {
    return `${this['border-width']} solid ${this['border-color']}`;
  }

  setBorder() {
    this.border = this.getBorder();
    this.setAttribute('border', this.border);
  }

  updateMobileVisibility() {
    if (this['hidden-on-mobile'] && !this['css-class'].includes('act-mob-hidden')) {
      this['css-class'] = this['css-class'].length ? `${this['css-class']} act-mob-hidden` : 'act-mob-hidden';
    }
    if (!this['hidden-on-mobile'] && this['css-class'].includes('act-mob-hidden')) {
      const cssClasses = this['css-class'].split(' ');
      const indexOfHidden = cssClasses.indexOf('act-mob-hidden');
      cssClasses.splice(indexOfHidden, 1);
      this['css-class'] = cssClasses.join(' ');
    }
  }

  mobileVisibilityHandler(changedProperties) {
    if (changedProperties.has('hidden-on-mobile') || changedProperties.has('css-class')) {
      this.updateMobileVisibility();
    }
  }

  setContentModule(content) {
    this.setAttribute('src', content);
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    if (!this.style.getPropertyValue('--width') && this.parentNode) {
      const parentElementWidth = getComputedStyle(this.parentNode).width;
      const { num: parentWidth, unit } = getValueObject(parentElementWidth);
      this.setAttribute('width', `${parentWidth}${unit}`);
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this.mobileVisibilityHandler(changedProperties);
    if (changedProperties.has('width') && this.isRendered) {
      emailImageWidthAligner.handleUpdateWidth(this);
    }
    if (changedProperties.has('--width') && this.isRendered) {
      emailImageWidthAligner.alignElementWidthByParent(this, this.width);
    }
  }

  getHorAlign() {
    const alignConfig = {
      center: 'center',
      left: 'flex-start',
      right: 'flex-end',
    };
    return alignConfig[this.align];
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          width: 100%;
          display: block;
          background-color: var(--container-background-color);
        }
         :host .image-container img {
           width: var(--width);
          height: auto;
          border: var(--border-width) solid var(--border-color);
          border-radius: var(--border-radius);
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
        }
        :host .image-container {
          display: flex;
          align-items: center;
          box-sizing: border-box;
        }
        :host slot[name="mo-system"] .main {
          position: absolute;
          top: 0;
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host .image-container {
        justify-content: ${this.getHorAlign()};
      }
    `;
  }

  render() {
    this.setBorder();
    return html`
      <style>
        ${this.dynamicStyles}
        :host .image-container {
          justify-content: ${this.getHorAlign()};
        }
      </style>
      <div class="image-container">
         <img src=${this.src || ''} alt=${this.alt} @click='${() => this.openLink()}'>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { MJMLImage };
