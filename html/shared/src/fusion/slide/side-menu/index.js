// @note: need to solve the problem with unnecessary imports
import { css, html } from 'lit-element';
import { FusionButton } from '../button';
import { FusionGroup } from '../group';
import {
  applyMixins,
  ItemsWrapper,
  ChildrenStylist,
  SlideComponentBase,
} from '../../mixins';
import {
  createObjectItem,
  getValueObject,
  intersectMap,
} from '../../utils';
import { FusionApi } from '../../api';
import { FieldDefinition, Typography } from '../../mixins/props';

class FusionSideMenuButton extends FusionButton {
  static get properties() {
    const {
      position, width, height, top, left,
      ...filteredProp
    } = FusionButton.properties;
    return filteredProp;
  }

  static get options() {
    return {
      ...FusionButton.options,
      componentName: 'fusion-side-menu-button',
      componentUIName: 'Side Menu Button',
      componentDescription: 'Button for side menu',
      isRootNested: false,
      resizable: false,
      draggable: false,
      rotatable: false,
    };
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.emitCustomEvent(`${this.constructor.options.componentName}:removed`);
  }

  connectedCallback() {
    super.connectedCallback();
    this.emitCustomEvent(`${this.constructor.options.componentName}:added`);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: relative;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <button @mousedown="${(event) => this.constructor.propagateFocus(event)}">
        <slot></slot>
      </button>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

class FusionSideMenu extends applyMixins(FusionGroup, [
  SlideComponentBase,
  ItemsWrapper,
  ChildrenStylist,
  Typography,
  FieldDefinition,
]) {
  static get properties() {
    const {
      top, left, width, height, items, color,
      'background-color': bgColor,
      'font-family': fontFamily,
      'font-size': fontSize,
      'font-style': fontStyle,
      'font-weight': fontWeight,
      'letter-spacing': letterSpacing,
      'line-height': lineHeight,
      ...rest
    } = super.properties;
    return {
      top: {
        ...top,
        value: '210px',
      },
      left: {
        ...left,
        value: '0px',
      },
      width: {
        ...width,
        value: '100px',
      },
      height: {
        ...height,
        value: '310px',
      },
      items: {
        ...items,
        value: '3',
        min: 1,
        prop: true,
        propertyGroup: 'other',
      },
      color,
      'font-family': fontFamily,
      'font-size': {
        ...fontSize,
        value: '16px',
      },
      'font-style': fontStyle,
      'font-weight': fontWeight,
      'background-color': {
        ...bgColor,
        value: 'rgba(221, 221, 221, 1)',
      },
      placing: {
        type: String,
        fieldType: 'Select',
        value: 'vertical',
        selectOptions: [
          'vertical',
          'horizontal',
        ],
        prop: true,
      },
      'space-between-buttons': {
        type: String,
        fieldType: 'Number',
        value: '5',
        min: 0,
        prop: true,
      },
      ...rest,
    };
  }

  // @todo elements aligner will be applied after columns aligner implementation, please see https://trello.com/c/c3GTkPEr
  static get options() {
    const {
      alignConfig,
      ...otherOptions
    } = super.options;
    return {
      ...otherOptions,
      componentName: 'fusion-side-menu',
      componentUIName: 'Side Menu',
      componentCategory: 'menu',
      componentDescription: 'Side menu component for navigation',
      nestedComponents: ['fusion-side-menu-button'],
    };
  }

  static get synchronizableProperties() {
    const {
      width, height, items, placing, 'space-between-buttons': space, top, left, fieldName, hidden, 'show-in-editor': showInEditor, 'data-flag-on': dataFlagOn,
      ...filteredProp
    } = this.properties;
    return filteredProp;
  }

  constructor() {
    super();
    this.item = createObjectItem(FusionSideMenuButton);
    this.wrapperClassName = 'menu-items';
  }

  checkSizes(changedProps) {
    super.checkSizes(changedProps);
    const properties = intersectMap(changedProps, [...this.constructor.sizeTriggers, 'space-between-buttons', 'placing']);
    if (properties.size) {
      this.setAttribute('px-height', this.clientHeight);
      this.setAttribute('px-width', this.clientWidth);
      this.applyCorrectSizes();
    }
  }

  applyCorrectSizes() {
    const preset = this.getSizePresets(this.placing);
    this.updateParentSize(preset.parentSizes);
    this.updateChildrenSize(preset.buttonSizes);
  }

  /**
   * @description Update parent sizes
   * @param {object.<string, string>} properties
   */
  updateParentSize(properties) {
    FusionApi.setAttributes({ properties, element: this });
  }

  /**
   * @description Update sizes for each buttons
   * @param {object.<string, string>} properties
   */
  updateChildrenSize(properties) {
    const children = this.constructor.getExistingItems(this.item.component, this);
    children.forEach((element) => FusionApi.setAttributes({ properties, element }));
  }

  /**
   * @description Get sizes by buttons placing
   * @param {string} placing - buttons placing
   * @returns {object<string>} calculated sizes for elements
   */
  getSizePresets(placing) {
    const props = this.isHorizontalPlacing(placing)
      ? this.constructor.sizeTriggers.slice().reverse()
      : this.constructor.sizeTriggers.slice();
    return this.getCalculatedSizes(props);
  }

  isHorizontalPlacing(placing) {
    return placing !== this.constructor.properties.placing.value;
  }

  /**
   * @description Get calculated sizes for main wrapper and buttons by the count of items and space between them
   * @param {string} firstProp - can be width or height, depending on placing
   * @param {string} secondProp - can be height or width, also depends on placing
   * @returns {object<string>} calculated sizes for elements
   */
  getCalculatedSizes([firstProp, secondProp]) {
    const firstPropValue = this.getCommonSize(firstProp);
    const secondPropButtonValue = this.getCalculatedButtonSize(secondProp);
    return {
      parentSizes: {
        [firstProp]: { value: this.getMenuSize(firstProp) },
        [secondProp]: { value: this.getMenuSize(secondProp) },
      },
      buttonSizes: {
        [secondProp]: { value: secondPropButtonValue },
        [firstProp]: { value: firstPropValue },
      },
    };
  }

  getMenuSize(property) {
    const { num, unit } = getValueObject(this[property]);
    return `${num}${unit}`;
  }

  /**
   * @description Get simple size
   * @param {string} property - name of property
   * @returns {string} calculated size by property
   */
  getCommonSize(property) {
    const { num, unit } = getValueObject(this[property]);
    const value = unit === '%' ? 100 : num;
    return `${value}${unit}`;
  }

  getCalculatedValue(size) {
    return (size - this['space-between-buttons'] * (this.items - 1)) / this.items;
  }

  /**
   * @description Get button sizes by items count and space between they
   * @param {string} property - name of property
   * @returns {string} calculated size by property
   */
  getCalculatedButtonSize(property) {
    const { num, unit } = getValueObject(this[property]);
    let size = num;
    let value = this.getCalculatedValue(size);
    if (unit === '%') {
      size = this.getAttribute(`px-${property}`);
      value = (this.getCalculatedValue(size)) * (100 / size);
    }
    return `${value}${unit}`;
  }

  async generateItem() {
    await super.generateItem();
    this.applyCorrectSizes();
  }

  async removeContent(count) {
    await super.removeContent(count);
    this.applyCorrectSizes();
  }

  static get styles() {
    return [
      super.styles,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      .${this.wrapperClassName} {
        display: flex;
        justify-content: space-between !important;
        height: 100%;
        width: 100%;
        background-color: transparent !important;
      }
      :host([placing='vertical']) .${this.wrapperClassName} {
        flex-direction: column;
      }
      :host > div.menu-items {
        border: none;
    `;
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

export { FusionSideMenuButton, FusionSideMenu };
