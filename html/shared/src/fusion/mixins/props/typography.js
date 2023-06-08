import { html } from 'lit-element';
import config from '../../../config.json';
import { FusionApi } from '../../api';
import { applyMixins, SafeFontFamilyCombination } from '../index';

const getDevicesWidthArr = () => config.targetResolutions.map((item) => item.width);
const widthArr = getDevicesWidthArr();
const primaryDevice = config.targetResolutions.find((item) => item.primary);
const MAX_DEV_WIDTH = Math.max.apply(null, widthArr);
const MIN_DEV_WIDTH = Math.min.apply(null, widthArr);
const PRIMARY_DEV_WIDTH = primaryDevice ? primaryDevice.width : '';

/**
 @mixin [<Typography>] provides a list of standard properties (font-family, font-size, font-weight, font-style,
 letter-spacing, line-height, color) that is intended to be added to slide components as a part of
 base functionalities. Mixin can be used as it is, without additional definition of the place of application
 of properties.
 */

export function Typography(superClass) {
  return class extends applyMixins(superClass, [
    SafeFontFamilyCombination,
  ]) {
    static get properties() {
      return {
        ...super.properties,
        'font-family': {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'text',
          value: '',
          selectOptions: config.fonts.map((item) => item.propValue),
        },
        'font-size': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'text',
          value: '16px',
          availableUnits: [{ unitType: 'px' }],
        },
        'font-weight': {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'text',
          value: '',
          selectOptions: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
        },
        'font-style': {
          type: String,
          fieldType: 'RadioGroup',
          propertyGroup: 'text',
          value: '',
          selectOptions: [
            { value: 'normal', icon: 'nonitalic' },
            { value: 'italic', icon: 'italic' },
          ],
        },
        'letter-spacing': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'text',
          value: '0px',
          step: 0.1,
          availableUnits: [{ unitType: 'px' }],
        },
        'line-height': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'text',
          value: '1',
          step: 0.1,
        },
        'font-size-min': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'text',
          value: '',
        },
        'font-size-max': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'text',
          value: '',
        },
        color: {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'text',
          value: 'rgba(0, 0, 0, 1)',
        },
        direction: {
          type: String,
          fieldType: 'RadioGroup',
          propertyGroup: 'text',
          value: '',
          selectOptions: [
            { value: 'ltr', icon: 'textdirectionltr' },
            { value: 'rtl', icon: 'textdirectionrtl' },
          ],
        },
      };
    }

    constructor() {
      super();
      this.rootSelectors = [config.rootSelector.slide, config.rootSelector.brief];
    }

    async updateAttributeList(attrKey, attrValue, options) {
      this.setAttribute(attrKey, attrValue);
      await FusionApi.updateDynamicProperty({ options, value: attrValue, name: attrKey });
    }

    getPropertyData() {
      return {
        'font-family': {
          affectTo: 'font-weight',
          options: this['font-family'] ? this.constructor.properties['font-weight'].selectOptions : [],
        },
        'font-weight': {
          affectTo: 'font-style',
          options: this['font-weight'] ? this.constructor.properties['font-style'].selectOptions : [],
        },
      };
    }

    static isFontPropertyChanged(changedProperties) {
      return changedProperties.has('font-family') || changedProperties.has('font-weight');
    }

    setDirectionOnComponentLevel(direction) {
      if (direction) {
        const directionClassList = ['rtl', 'ltr'];
        this.classList.remove(...directionClassList);
        this.classList.add(direction);
      }
    }

    static setDirectionOnDocumentLevel(direction = 'ltr') {
      document.documentElement.setAttribute('dir', direction);
    }

    setDirectionClass(changedProperties) {
      if (changedProperties.has('direction')) {
        this.rootSelectors.includes(this.constructor.options.componentName)
          ? this.constructor.setDirectionOnDocumentLevel(this.direction)
          : this.setDirectionOnComponentLevel(this.direction);
      }
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      this.setDirectionClass(changedProperties);
      if (this.constructor.isFontPropertyChanged(changedProperties) && this.isRendered) {
        const propName = [...changedProperties.keys()];
        const { affectTo, options } = this.getPropertyData()[propName];
        const value = options.includes(this[affectTo]) ? this[affectTo] : '';
        this.updateAttributeList(affectTo, value, options);
      }
    }

    getFontSize() {
      const minFs = parseFloat(this['font-size-min'] || '0');
      const maxFs = parseFloat(this['font-size-max'] || '0');
      let outputStyle = html`:host { font-size: var(--font-size); }`;
      if (minFs && maxFs) {
        outputStyle = `:host {
          --handled-min-fs: calc(${minFs} * 1px);
          --handled-max-fs: calc(${maxFs} * 1px);
          --fluid-font-size: calc((100vw - ${MIN_DEV_WIDTH}px)/(${MAX_DEV_WIDTH} - ${MIN_DEV_WIDTH}) * (${maxFs} - ${minFs}) + var(--handled-min-fs));
          font-size: clamp(var(--handled-min-fs), var(--fluid-font-size), var(--handled-max-fs));
        }
        ::slotted(div.ql-editor),
        ::slotted(ul),
        ::slotted(div[slot="content"]),
        ::slotted(p) {
          font-size: clamp(var(--handled-min-fs), var(--fluid-font-size), var(--handled-max-fs)) !important;
        }`;
        if (PRIMARY_DEV_WIDTH) {
          outputStyle += `
          @media only screen and (min-width: ${PRIMARY_DEV_WIDTH}px) and (max-width: ${PRIMARY_DEV_WIDTH}px) {
            :host {
              font-size: var(--font-size);
            }
            ::slotted(div.ql-editor),
            ::slotted(ul),
            ::slotted(div[slot="content"]),
            ::slotted(p) {
              font-size: var(--font-size) !important;
            }
          }`;
        }
      }
      return outputStyle;
    }

    get dynamicStyles() {
      return html`
        ${super.dynamicStyles}
        ${this.rootSelectors.map((selector) => html`
          :host(.ltr:not(${selector})) > *:not([name="mo-system"], style) {
          text-align: left;
          direction: ltr;
          }
          :host(.rtl:not(${selector})) > *:not([name="mo-system"], style) {
          text-align: right;
          direction: rtl;
          }`)}
        ${this.getFontSize()}
      `;
    }

    static get styles() {
      return [
        super.styles,
        this.generateCssProperty('font-size'),
        this.generateCssProperty('font-weight'),
        this.generateCssProperty('font-style'),
        this.generateCssProperty('line-height'),
        this.generateCssProperty('letter-spacing'),
      ];
    }
  };
}
