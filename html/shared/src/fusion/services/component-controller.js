import { FusionLogger } from './fusion-logger';

class ComponentController {
  static isValidInput(component, method) {
    return component && component[method];
  }

  /**
   * @param {String} query - query selector of target component
   * @param {String} method - target component method
   */
  static runMethod({ query, method }) {
    const component = document.querySelector(query);
    if (component) {
      const { componentName } = component.constructor.options;
      component.emitCustomEvent(`${componentName}:run-method`, { detail: method });
    } else {
      FusionLogger.error(`Can't find component with id: ${query}`, 'ComponentController');
    }
  }
}

export { ComponentController };
