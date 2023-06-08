import { css, html } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  ItemsWrapper,
  ChildrenStylist,
  SlideComponentBase,
} from '../../mixins';
import { createObjectItem, getPartial } from '../../utils';
import { FusionListItem } from './list-item';
import {
  Container,
  Dimensions,
  Display,
  Typography,
  List,
  Background,
  FieldDefinition,
} from '../../mixins/props';

class FusionList extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  Typography,
  Background,
  Display,
  List,
  ItemsWrapper,
  ChildrenStylist,
  FieldDefinition,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-list',
      componentUIName: 'List',
      componentCategory: 'text',
      componentDescription: 'Component for showing lists',
      nestedComponents: ['fusion-list-item'],
      resizable: 'e,w',
    };
  }

  static get properties() {
    const {
      height,
      top,
      left,
      width,
      'background-size': backgroundSize,
      'background-position-x': backgroundX,
      'background-position-y': backgroundY,
      'background-image': backgroundImage,
      'background-repeat': backgroundRepeat,
      'background-attachment': backgroundAttachment,
      overflow,
      'should-shown': shouldShown,
      ...rest
    } = super.properties;
    return {
      height: {
        ...height,
        value: 'auto',
      },
      top,
      left,
      width: {
        ...width,
        value: '300px',
      },
      'should-shown': {
        ...shouldShown,
        value: true,
      },
      ...rest,
      margin: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'content',
        value: '5px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
    };
  }

  static getRomanChart() {
    return [
      ['M', 1000],
      ['CM', 900],
      ['D', 500],
      ['CD', 400],
      ['C', 100],
      ['XC', 90],
      ['L', 50],
      ['XL', 40],
      ['X', 10],
      ['IX', 9],
      ['V', 5],
      ['IV', 4],
      ['I', 1],
    ];
  }

  // @todo Roman S CAREFULLY. LOW PERFORMANCE. Should be small pack
  static get synchronizableProperties() {
    const properties = [
      'indication-horizontal-align', 'indication-vertical-align', 'margin', 'text-padding-left', 'font-size', 'font-size-max', 'font-size-min',
    ];
    const filteredProp = getPartial(this.properties, properties);
    return { ...filteredProp };
  }

  constructor() {
    super();
    this.item = createObjectItem(FusionListItem);
    this.wrapperClassName = 'list-wrapper';
  }

  static getIndication(indicatorType, index) {
    const typesMap = {
      empty: () => '',
      dash: () => '\u2013',
      'bullet-point': () => '\u2022',
      'arabic-numerals': () => {
        const startValue = 1;
        return this.getIndicationNumeration(startValue, index);
      },
      'roman-numerals': () => {
        const startValue = 1;
        return this.getIndicationRomanNumeration(startValue, index);
      },
      'uppercase-letters': () => {
        const charCodeStartPosition = 65;
        return this.getIndicationLetter(charCodeStartPosition, index);
      },
      'lowercase-letters': () => {
        const charCodeStartPosition = 97;
        return this.getIndicationLetter(charCodeStartPosition, index);
      },
    };
    const target = typesMap[indicatorType] || typesMap.empty;
    return target(index);
  }

  setItemsIndication() {
    this.constructor.getExistingItems(this.item.component, this).forEach((elem, index) => {
      const indicator = this.getIndicator(index);
      elem.setAttribute('indicator', indicator);
      elem.querySelector('[slot="indicator"]').innerHTML = indicator;
    });
  }

  getIndicator(index) {
    return this.getParentIndicator() + this.constructor.getIndication(this.indication, index);
  }

  getParentIndicator() {
    return this['inherit-indication'] ? this.parentNode.getAttribute('indicator') : '';
  }

  updateIndicationWidth() {
    if (this.isRendered) {
      if (this['indication-horizontal-align'] !== 'default') {
        const items = this.constructor.getExistingItems(this.item.component, this);
        items.forEach((item) => item.querySelector('[slot="indicator"]').style.removeProperty('min-width'));
        const width = items.reduce((value, element) => Math.max(value, this.constructor.getElementWidth(element)), 0);
        if (width) {
          items.forEach((item) => item.querySelector('[slot="indicator"]').style.setProperty('min-width', `${width}px`));
        }
      }
    }
  }

  static getElementWidth(element) {
    return element.querySelector('[slot="indicator"]').getBoundingClientRect().width;
  }

  static getIndicationNumeration(value, index) {
    return `${value + index}.`;
  }

  static getIndicationLetter(value, index) {
    return `${String.fromCharCode(value + index)}.`;
  }

  /**
   *
   * @param {number} value - start position for indicator
   * @param {number} index - index of list item
   * @returns {ArabicToRomanConverter} converted roman number
   */
  static getIndicationRomanNumeration(value, index) {
    return `${this.arabicToRomanConverter(value + index, this.getRomanChart())}.`;
  }

  /**
   * @typedef {string} ArabicToRomanConverter
   * @property  {number} start position
   * @property  {Array.<getRomanChart>} roman symbols chart
   * @return {string} return roman symbol
   */
  static arabicToRomanConverter(index, chart) {
    return index === 0 ? '' : this.converterRepeat(index, chart);
  }

  static converterRepeat(index, chart) {
    const [[numeral, value], ...tail] = chart;
    return numeral.repeat(index / value) + this.arabicToRomanConverter(index % value, tail);
  }

  static isIndicationAttrUpdated(changedProps) {
    return changedProps.has('indication');
  }

  update(changedProps) {
    super.update(changedProps);
    this.updateItemsIndication(changedProps);
  }

  updateItemsIndication(changedProps) {
    if (this.constructor.isIndicationAttrUpdated(changedProps)) {
      this.setItemsIndication();
      this.updateIndicationWidth();
    }
    if (this.constructor.shouldUpdateIndicationWidth(changedProps)) {
      this.updateIndicationWidth();
    }
  }

  static shouldUpdateIndicationWidth(changedProps) {
    return changedProps.has('indication-horizontal-align') || changedProps.has('font-size') || changedProps.has('width');
  }

  async generateItem() {
    await super.generateItem();
    this.setItemsIndication();
    this.updateIndicationWidth();
  }

  async removeContent(count) {
    await super.removeContent(count);
    this.setItemsIndication();
    this.updateIndicationWidth();
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          min-height: 30px;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
         ${this.dynamicStyles}
      </style>
      <div class=${this.wrapperClassName}><slot></slot></div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionList };
