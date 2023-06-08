import { FusionApi } from '../api';
import { FusionLogger } from '../services/fusion-logger';

/**
 *
 * @description Set of methods for works with popup elements (backdrop, overlay, close button)
 */

export function PopupElement(superClass) {
  return class extends superClass {
    /**
     * @description Check if an attribute should be updated
     * @param {string } name - name of child
     * @param {string} attribute - attribute for saving
     * @param {boolean} isElementCreated - is child was created
     */
    shouldChildUpdateAttr(name, attribute, isElementCreated) {
      return this.isElementRemoved(name, attribute, isElementCreated) || this.isElementAdded(attribute, isElementCreated);
    }

    isElementRemoved(name, attribute, isElementCreated) {
      return !this.getChildQuantity(name) && !this.isElementAdded(attribute, isElementCreated);
    }

    isElementAdded(attribute, isElementCreated) {
      return this.hasAttribute(attribute) && isElementCreated;
    }

    /**
     * @description Check if an element should be created
     * @param {string} name - the name of the child  which should be created
     * @param {string} attribute
     * @return {boolean}
     */
    shouldChildBeCreated(name, attribute) {
      return !this.getChildQuantity(name) && !this.hasAttribute(attribute);
    }

    getChildQuantity(name) {
      return this.getElementsByTagName(name).length;
    }

    async generateChildElement(element) {
      const childComponent = element.component;
      const { componentName, defaultTemplate } = childComponent.options;
      const { properties } = childComponent;
      return FusionApi.createElement(
        componentName,
        properties,
        defaultTemplate,
        this,
        `#${this.id}`,
        { setActive: false, setState: false },
      );
    }

    generateChildren() {
      const children = this.getChildrenComponentsData();
      Object.values(children).forEach(async ({ attribute, component }) => {
        if (this.shouldChildBeCreated(component.name, attribute)) {
          await this.generateChildElement(component);
        }
      });
    }

    /**
     * @description Update the necessary attribute when the child has been updated
     * @param {string} name -  name of the child
     * @param {string} attribute - attribute for saving
     * @param {boolean} isElementCreated - is child was created
     */
    updateAttributes(name, attribute, isElementCreated) {
      if (this.shouldChildUpdateAttr(name, attribute, isElementCreated)) {
        FusionApi.saveAttributes(`#${this.id}`, { [attribute]: !isElementCreated });
        isElementCreated ? this.removeAttribute(attribute) : this.setAttribute(attribute, !isElementCreated);
      }
    }

    updateComponentRelations(eventListenerMethod, e) {
      const name = e.target.localName;
      const isElementCreated = e.detail.isCreated;
      const componentsData = this.getChildrenComponentsData()[name];
      // Each event can be emitted by the fragment if it contains the corresponding component
      if (componentsData) {
        const { attribute, component } = componentsData;
        this.updateAttributes(name, attribute, isElementCreated);
        this.updateEventHandler(e.target, eventListenerMethod, component.events.remove);
      } else {
        FusionLogger.warn('Event was emitted by a non-child', 'popup-element');
      }
    }

    updateEventHandler(element, eventListener, eventType) {
      element[eventListener](eventType, this.updateComponentRelations.bind(this, 'removeEventListener'));
    }

    async firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.generateChildren();
    }
  };
}
