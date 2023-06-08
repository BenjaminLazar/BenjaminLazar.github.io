import { FusionErrorHandler } from './services/fusion-error-handler';

class MainAppAct {
  constructor() {
    this.webComponents = [];
    try {
      localStorage.setItem('webComponents', JSON.stringify(this.webComponents));
    } catch (e) {
      window.webComponents = this.webComponents;
    }
    this.initMainApp();
  }

  initMainApp() {
    try {
      this.startPrepareWebActivatorComponents();
    } catch (error) {
      FusionErrorHandler.handleError(error);
    }
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

  register(instance) {
    const { options, properties } = instance;
    this.webComponents.push({ options, properties });
    window.webComponents = this.webComponents;
    try {
      localStorage.setItem('webComponents', JSON.stringify(this.webComponents));
    } catch (e) {
      window.webComponents = this.webComponents;
    }
  }

  startPrepareWebActivatorComponents() {
    this.constructor.importComponents(require.context('./slide', true, /\.js/), this.register.bind(this));
    this.constructor.importComponents(require.context('../components/slide', true, /\.js/), this.register.bind(this));
  }
}

const mainApp = new MainAppAct();

export { mainApp };
