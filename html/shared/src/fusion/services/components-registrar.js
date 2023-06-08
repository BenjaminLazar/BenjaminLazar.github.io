import { FusionLogger } from './fusion-logger';
import { FusionStore } from './fusion-store';
import { registerComponent } from '../_actions/app';

class ComponentsRegistrar {
  /**
   * @param {String} componentName - name of component HTML tag
   * @param {function<FusionBase>} instance - instance of component class
   */
  static register(componentName, instance, isNotLogged = false) {
    if (!customElements.get(componentName)) {
      customElements.define(componentName, instance);
      FusionStore.store.dispatch(registerComponent(componentName));
    } else if (!isNotLogged) {
      FusionLogger.warn(`Component ${componentName} already registered`, 'components-registrar');
    }
  }

  static emitComponentsRegistration() {
    document.dispatchEvent(new CustomEvent('ComponentsRegistrar:allComponentsRegistered'));
  }

  /**
   *
   * @param requirePath - own context with files that should be imported.
   * @param cb - callback that should be called after import each component
   */
  static importComponents(requirePath, cb) {
    try {
      requirePath.keys().forEach((key) => {
        const importOBj = requirePath(key);
        Object.keys(importOBj).forEach((componentClass) => {
          const instance = importOBj[componentClass];
          cb(instance);
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export { ComponentsRegistrar };
