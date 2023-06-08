import { FusionApi } from '../api';
import { store } from '../store';
import { intersectMap } from '../utils';

/**
 *
 * @description Mixin for properties synchronizing from parent to children.
 * The parent should contain an object of properties which will be synchronizing with children.
 * The default `synchronizableProperties` object is empty.
 */

export function ChildrenStylist(superClass) {
  return class extends superClass {
    update(changedProps) {
      super.update(changedProps);
      if (this.isRendered) {
        this.setupItemsStyleAttributes(changedProps);
      }
    }

    /**
     * @description Properties which should be synchronized from parent to children
     * @return {Object.<string, LitElementProperty>}
     */
    static get synchronizableProperties() {
      return {};
    }

    /**
     * @description Synchronizable properties which should be synchronized from parent only to a specific children
     * @return {Object<string, Array<string>>} - Key is the property and the value is an array of children elements name
     */
    static get synchronizablePropertiesSpecificForChildren() {
      return {};
    }

    /**
     * @description Parent properties which should be renamed according to the child properties
     * @return {Object.<string, string>}
     */
    static get propertiesForRenaming() {
      return {};
    }

    /**
     * @description Set attribute from parent to children
     * @param {Object.<string, LitElementProperty>} changedProps - changed properties
     */
    setupItemsStyleAttributes(changedProps) {
      const properties = this.getChangedProperties(changedProps);
      const { registeredComponents } = store.getState().app;
      const elements = [...this.querySelectorAll(`${registeredComponents.join()}`)];
      elements.forEach((element) => {
        const filteredProperties = this.filterPropertiesByChild(properties, element.tagName.toLowerCase());
        FusionApi.setAttributes({ properties: filteredProperties, element });
      });
    }

    /**
     *
     * @param {Map<string>} changedProps name
     * @returns {Object.<string, LitElementProperty>} properties
     */
    getChangedProperties(changedProps) {
      const filteredProps = intersectMap(changedProps, Object.keys(this.constructor.synchronizableProperties));
      return Array.from(filteredProps.keys()).reduce((changedChildProps, property) => {
        const name = this.constructor.propertiesForRenaming[property] || property;
        changedChildProps[name] = { value: this[property] };
        return changedChildProps;
      }, {});
    }

    /**
     * Filter synchronizable properties which applies only for specific children
     * @param properties{Array<LitElementProperty>} - Array of properties
     * @param child{String} - Child name
     * @returns {Object.<string, LitElementProperty>} - Filtered properties
     */
    filterPropertiesByChild(properties, child) {
      return Object
        .keys(properties)
        .filter((key) => {
          const specificChildrenForProperty = this.constructor.synchronizablePropertiesSpecificForChildren[key];

          return (
            !specificChildrenForProperty
            || specificChildrenForProperty.length === 0
            || specificChildrenForProperty.includes(child.toLowerCase())
          );
        })
        .reduce((acc, key) => {
          acc[key] = properties[key];
          return acc;
        }, {});
    }
  };
}
