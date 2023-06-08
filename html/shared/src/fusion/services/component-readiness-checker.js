// componentsToCheck - determines the component names on which the slide will be ready to screening
// service compares the total number of components by the instance with the number of components received
// when this condition occurs for all entities defined in the componentsToCheck, the
// service will inform about readiness
class ComponentReadinessChecker {
  /**
   * @param {string} componentName - component name
   */
  static expandStructure(componentName) {
    this.componentsToCheck.set(componentName, {
      commonAmount: 0,
      fetchedAmount: 0,
      ready: false,
    });
  }

  /**
   * @param {array} components - names of components in the kebab case for which the
   * service will create objects for monitoring readiness, and count quantity of parent
   * components
   */
  static init(components) {
    components.forEach((component) => {
      this.expandStructure(component);
      this.countParentInstances(component);
    });
    if ([...this.componentsToCheck.values()].every(this.shouldSkipSlideCheck)) {
      document.dispatchEvent(new CustomEvent('ReadyToScreening'));
    }
  }

  /**
   * @param commonAmount
   * @returns {boolean}
   */
  static shouldSkipSlideCheck({ commonAmount }) {
    return commonAmount === 0;
  }

  /**
   * @param {string} componentName
   * @returns {number}
   */
  static countParentInstances(componentName) {
    const components = Array.from(document.querySelectorAll(componentName)).filter((component) => (
      component.tagName.toLowerCase() === 'fusion-slide-fragment' ? (component.hasAttribute('fragment-name') && !!component['fragment-name']) : true
    ));
    const componentAmount = components.length;
    this.componentsToCheck.set(componentName, { ...this.componentsToCheck.get(componentName), commonAmount: componentAmount });
    return this.componentsToCheck.get(componentName).commonAmount;
  }

  /**
   * @param {string} componentName
   * @param {string} field - commonAmount or fetchedAmount key
   * @param {number} value - the value by which the existing value will increase
   * @returns {Promise<void>}
   */
  static async updateQuantity(componentName, field, value) {
    const newValue = this.componentsToCheck.get(componentName)[field] + value;
    this.componentsToCheck.set(componentName, { ...this.componentsToCheck.get(componentName), [field]: newValue });
    await this.checkReadiness(componentName);
  }

  /**
   * @param {string} entityName
   * @returns {Promise<void>}
   */
  static async checkReadiness(entityName) {
    const { commonAmount, fetchedAmount } = this.componentsToCheck.get(entityName);
    if (commonAmount === fetchedAmount) {
      this.componentsToCheck.set(entityName, { ...this.componentsToCheck.get(entityName), ready: true });
    }
    await this.checkAllComponents();
  }

  static async checkAllComponents() {
    if ([...this.componentsToCheck.keys()].every((componentName) => this.componentsToCheck.get(componentName).ready)) {
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('ReadyToScreening'));
      }, 0);
    }
  }

  /**
   *
   * @param {string} template - HTML template
   * @param {string} componentName - name of the search tag in the template
   * @returns {number}
   */
  static countNestedEntities(template, componentName) {
    const entry = `<${componentName}`;
    return template.split(entry).length - 1;
  }
}

ComponentReadinessChecker.componentsToCheck = new Map();

export { ComponentReadinessChecker };
