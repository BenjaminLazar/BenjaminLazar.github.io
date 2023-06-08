/**
 * @description Service for the correct passing events between components
 */

class EventBridge {
  static initEventBridge(node) {
    this.nestedComponents = [...this.nestedComponents || [], ...this.getNestedComponents(node)];
  }

  static getNestedComponents(node) {
    const children = [...node].map((child) => (child.exportEventListeners?.length
      ? child
      : this.getNestedComponents(child.children)));
    return [...new Set(this.flattenDeep(children))];
  }

  /**
   * @description Converting a multidimensional array to flat
   * @param {array.<array.<string>>} array
   * @return {array}
   */
  static flattenDeep(array) {
    return array.reduce((acc, val) => (Array.isArray(val)
      ? acc.concat(this.flattenDeep(val))
      : acc.concat(val)), []);
  }

  /**
   * @description Get map of events for each nested components
   * @return {object.<string, array>} string - name of component, array - component events
   */
  static getEventsMap() {
    return this.nestedComponents.reduce((acc, component) => {
      acc[component.localName] = component.exportEventListeners;
      return acc;
    }, {});
  }

  /**
   * @description Get an array of events from all nested components
   * @return {array}
   */
  static getComponentsEvents() {
    const events = this.nestedComponents.map((component) => component.exportEventListeners);
    return [...new Set(this.flattenDeep(events))];
  }

  static setListenerForComponentsEvents(node, eventType) {
    const events = this.getComponentsEvents();
    events.forEach((event) => node[eventType](event, this.sendEventToComponent.bind(this)));
  }

  /**
   * @description The function of passing the event to the child component
   * The eventsHandlerBound method must be present on the child component
   * @param {object} event
   * @return {object} event
   */
  static sendEventToComponent(event) {
    const eventsMap = this.getEventsMap();
    this.nestedComponents.forEach((component) => {
      if (component.eventsHandlerBound && eventsMap[component.localName]?.includes(event.type)) {
        component.eventsHandlerBound(event);
      }
    });
  }
}

export { EventBridge };
