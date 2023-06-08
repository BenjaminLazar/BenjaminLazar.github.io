import { FusionApi } from '../api';
import { getValueObject } from '../utils';

/**
 *
 * @description Mixin for work with children which were created from a parent wrapper. It contains a set of methods which help work with children: batch add and remove children, calculation existing items, work with parent wrapper, etc.
 */

/**
 * @typedef {object} ComponentEventData
 * @property {Function<FusionBase>} component - lit-element constructor
 * @property {object<string>} events
 * @property {string} component name
 */

export function ItemsWrapper(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        items: {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'content',
          value: '1',
          min: 1,
          prop: true,
        },
      };
    }

    /**
     * @description Properties which should be synchronized from parent to children
     * @return {Object.<string, LitElementProperty>}
     */
    static get synchronizableProperties() {
      return {};
    }

    update(changedProps) {
      super.update(changedProps);
      const isCreationCase = !this.isRendered;
      const isNotInitialCase = !this.children.length;

      if (isCreationCase) {
        if (isNotInitialCase) {
          this.initItems();
        }
      } else if (this.constructor.isItemsUpdate(changedProps)) {
        this.setupItems(changedProps);
      }
    }

    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.triggerRequestUpdate();
    }

    triggerRequestUpdate() {
      const { propCount, domCount } = this.getItemsCount();
      if (domCount && propCount !== domCount) {
        this.requestUpdate('items', domCount);
      }
    }

    getItemsCount() {
      const { num } = getValueObject(this.items);
      const domCount = this.constructor.getExistingItems(this.item.component, this).length;
      return {
        propCount: num,
        domCount,
      };
    }

    initItems() {
      this.generateContent();
    }

    generateContent(newCount = Number(this.items)) {
      this.generateItems(newCount);
    }

    /**
     * @description Getting children from the wrapper
     * @param {function<FusionBase>} component
     * @param {HTMLElement} node where children will be searched
     * @returns {HTMLElement[]} array of found items
     */
    static getExistingItems(component, node) {
      return [...node.children].filter((item) => item instanceof component);
    }

    generateItems(newCount) {
      for (let index = 0; index < newCount; index += 1) {
        this.generateItem();
      }
    }

    async generateItem(customProps = {}) {
      const { propCount, domCount } = this.getItemsCount();
      propCount > domCount ? await this.addGeneratedItem(customProps) : await this.addCustomItem({ ...customProps, ...{ custom: { value: true } } });
    }

    addCustomItem(customProps) {
      const element = this.getAddedItem();
      const properties = this.getMergedProperties(customProps);
      FusionApi.setAttributes({
        properties,
        element,
      });
      return element;
    }

    /**
     * @description Getting last item from the items array
     * @returns {HTMLElement} last added item
     */
    getAddedItem() {
      return this.constructor.getExistingItems(this.item.component, this).pop();
    }

    /**
     * @description Create child element
     * @param {Object.<string, LitElementProperty>} [customProps = {}] - custom properties
     * @returns {Promise<HTMLElement>}
     */
    async addGeneratedItem(customProps) {
      const children = this.item.component;
      const properties = this.getMergedProperties({ ...customProps, ...children.properties });
      const { componentName, defaultTemplate } = children.options;
      return FusionApi.createElement(
        componentName,
        properties,
        defaultTemplate,
        this,
        `#${this.id}`,
        { setActive: false, setState: false },
      );
    }

    /**
     * @description merging inheritable and custom properties
     * @param {Object.<string, LitElementProperty>} customProps - custom properties
     * @returns {Object.<string, LitElementProperty>} merged properties
     */
    getMergedProperties(customProps) {
      const properties = this.isRendered ? this.getStylePropertiesObject(this.constructor.synchronizableProperties) : {};
      return { ...customProps, ...properties };
    }

    /**
     * @description create properties object for transferring them to created children
     * @param {Object.<string, LitElementProperty>} styleProps - object of synchronizable properties
     * @return {Object.<string, LitElementProperty>} - properties
     */
    getStylePropertiesObject(styleProps = {}) {
      return Object.keys(styleProps)
        .reduce((childProps, property) => {
          childProps[property] = { value: this[property] };
          return childProps;
        }, {});
    }

    static isItemsUpdate(changedProps) {
      return changedProps.has('items');
    }

    setupItems(changedProps) {
      const newVal = Number(this.items);
      const oldValue = changedProps.get('items') || 0;
      this.updateItems(newVal, oldValue);
    }

    updateItems(newVal, oldVal) {
      const difference = Math.abs(newVal - oldVal);
      newVal > oldVal
        ? this.generateContent(difference)
        : this.removeContent(difference);
      this.saveItemsCount(newVal);
    }

    async removeContent(count) {
      if (this.skipItemRemove) {
        this.skipItemRemove = '';
      } else {
        await this.removeItems(count);
      }
    }

    removeItems(count) {
      const items = this.constructor.getExistingItems(this.item.component, this);
      const itemsToRemove = items.slice(-count);
      itemsToRemove.forEach((item) => {
        FusionApi.deleteElement(item.id);
      });
    }

    connectedCallback() {
      super.connectedCallback();
      this.itemAddEventFunc = this.itemAddHandler.bind(this);
      this.itemRemoveEventFunc = this.itemRemoveHandler.bind(this);
      this.addEventListener(this.item.events.add, this.itemAddEventFunc);
      this.addItemsEventListeners();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeItemsEventListeners();
    }

    removeItemsEventListeners() {
      this.constructor.getExistingItems(this.item.component, this)
        .forEach((item) => {
          item.removeEventListener(this.item.events.remove, this.itemRemoveEventFunc);
          item.removeEventListener(this.item.events.add, this.itemAddEventFunc);
        });
    }

    addItemsEventListeners() {
      this.constructor.getExistingItems(this.item.component, this)
        .forEach((item) => {
          item.addEventListener(this.item.events.remove, this.itemRemoveEventFunc);
        });
    }

    itemAddHandler(event) {
      const curItem = event.target;
      if (this.needIncreaseItems()) {
        this.triggerItemsChange(true);
      }
      curItem.addEventListener(this.item.events.remove, this.itemRemoveEventFunc);
    }

    itemRemoveHandler() {
      if (this.needDecreaseItems()) {
        this.triggerItemsChange(false);
        this.skipItemRemove = true;
      }
    }

    triggerItemsChange(isItemAdded) {
      const count = Number(this.items);
      const newItemsCount = isItemAdded ? count + 1 : count - 1;
      this.saveItemsCount(newItemsCount);
    }

    needIncreaseItems() {
      const { propCount, domCount } = this.getItemsCount();
      return domCount > propCount;
    }

    needDecreaseItems() {
      const { propCount, domCount } = this.getItemsCount();
      return domCount < propCount;
    }

    saveItemsCount(count) {
      const key = 'items';
      this.setAttribute(key, count);
      FusionApi.saveAttributes(`#${this.id}`, { [key]: count });
    }
  };
}
