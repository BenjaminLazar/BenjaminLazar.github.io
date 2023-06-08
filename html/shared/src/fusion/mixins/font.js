import { css } from 'lit-element';
import { fonts } from '../../config';
import { FusionApi } from '../api';
import { FusionLogger } from '../services/fusion-logger';

/**
 * @deprecated This mixin is deprecated and will be deleted since version 1.13.0.
 * Typography mixin should be used instead this one.
 */

/**
 * @typedef {Object} FontMap
 * @property {string} propName
 * @property {string} propValue
 * @property {string} [src]
 * @property {FontMap[]} [inner]
 */

/**
 * Get first child in fontMap
 * @param fontMap
 * @return {FontMap}
 */
const getChild = function getChildPropName(fontMap) {
  return fontMap.inner && fontMap.inner.length && fontMap.inner[0];
};

const getFontFamilyObj = (fontFamily) => fonts.find((font) => font.propValue === fontFamily);

const getPossibleFontWeights = (fontFamily) => getFontFamilyObj(fontFamily)?.inner.map((weight) => weight.propValue);

const getPossibleFontStyles = (fontFamily, fontWeight) => getFontFamilyObj(fontFamily)?.inner.find((weight) => weight.propValue === fontWeight)?.inner.map((style) => style.propValue);

const DEFAULT_FONT_WEIGHT = '400';

const DEFAULT_FONT_STYLE = 'normal';

/**
 * Send request to editor for running Logger
 * @param {string} message
 * @return {boolean}
 */
const onFontChangeError = function onFontChangeError(message) {
  FusionLogger.error(message, 'component');
};

export function Font(superClass) {
  return class extends superClass {
    constructor() {
      super();
      this.fontConfig = {
        'font-family': this.onFontPropertiesChanged.bind(this),
        'font-weight': this.onFontPropertiesChanged.bind(this),
        'font-style': this.onFontPropertiesChanged.bind(this),
      };
    }

    static get properties() {
      return {
        'font-size': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'text',
          value: '16px',
        },
        'font-family': {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'text',
          value: '',
          selectOptions: fonts.map((item) => item.propValue),
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
          fieldType: 'Select',
          propertyGroup: 'text',
          value: '',
          selectOptions: ['normal', 'italic', 'oblique'],
        },
        ...super.properties,
      };
    }

    connectedCallback() {
      super.connectedCallback();
      FusionLogger.warn(`Component ${this.constructor.options.componentName} use Font mixin which is deprecated`, 'Typography');
    }

    /**
     * Update element attr and style
     * @param {string} propName
     * @param {string} value
     */
    updateElementProperty(propName, value = '') {
      this.setElementProp(propName, value);
      this.setAttribute(propName, value);
    }

    /**
     * Get font map based on selected font properties
     * @param fontMap
     * @return {FontMap}
     */
    getFontMap(fontMap) {
      const item = fontMap.inner && fontMap.inner.find((i) => i.propValue === this[i.propName]);
      return (item && this[item.propName]) ? this.getFontMap(item) : fontMap;
    }

    /**
     * Detect error message when user set incorrect value.
     * @param {string} newValue
     * @param {string} propName
     * @return {{fontMap: FontMap, hasError: boolean}}
     */
    onFontSetIncorrectProperty({ newValue, propName }) {
      const fontMap = this.getFontMap({ inner: fonts });
      const { propName: childPropName } = getChild(fontMap) || {};
      const firstLevelPropName = fonts.length ? fonts[0].propName : null;
      let hasError = false;
      if (childPropName === propName) {
        const message = `There is no ${propName} ${newValue} for the font: ${this[firstLevelPropName]}`;
        hasError = onFontChangeError(message);
      } else if (childPropName && fontMap.propName !== propName && propName !== firstLevelPropName) {
        const message = `Error. You should set ${childPropName} first`;
        hasError = onFontChangeError(message);
      }
      return { fontMap, hasError };
    }

    /**
     * Undo font Properties or reset old values based on selected
     * @param {FontMap} fontMap
     * @param {boolean} [hasError]
     * @param {string} [propName]
     * @param {string} [oldValue]
     */
    undoFontChildProperties({
      fontMap, hasError, propName, oldValue,
    }) {
      if (hasError) {
        this.updateElementProperty(propName, oldValue);
      } else {
        const child = fontMap.inner && fontMap.inner.length && fontMap.inner[0];
        if (child) {
          this.updateElementProperty(child.propName);
          this.undoFontChildProperties({ fontMap: child });
        }
      }
    }

    /**
     * @param {string} oldValue
     * @param {string} newValue
     * @param {string} propName
     */
    onFontPropertiesChanged(oldValue, newValue, propName) {
      if (this.isRendered && newValue !== '') {
        const { fontMap, hasError } = this.onFontSetIncorrectProperty({ newValue, propName });
        this.undoFontChildProperties({
          fontMap, hasError, propName, oldValue,
        });
        FusionApi.request({ name: 'fusion/refreshPanelConfig' });
      }
    }

    update(changedProperties) {
      super.update(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (this.fontConfig[propName]) {
          this.fontConfig[propName](oldValue, this[propName], propName);
        }
      });
      if (changedProperties.has('font-weight')) {
        const fontWeight = getPossibleFontWeights(this['font-family'])?.includes(this['font-weight']) ? this['font-weight'] : DEFAULT_FONT_WEIGHT;
        this.style.setProperty('--font-weight', fontWeight);
      }
      if (changedProperties.has('font-style')) {
        const fontStyle = getPossibleFontStyles(this['font-family'], this['font-weight'])?.includes(this['font-style']) ? this['font-style'] : DEFAULT_FONT_STYLE;
        this.style.setProperty('--font-style', fontStyle);
      }
    }

    static get styles() {
      return [
        super.styles,
        css`
          ::slotted(div.ql-editor),
          ::slotted(div[slot="content"]) {
            font-size: var(--font-size);
            font-weight: var(--font-weight);
            font-style: var(--font-style);
          }
          :host([font-size]) {
            font-size: var(--font-size);
          }
          :host([font-family]) {
          }
          :host([font-weight]) {
            font-weight: var(--font-weight);
          }
          :host([font-style]) {
            font-style: var(--font-style);
          }
      `,
      ];
    }
  };
}
