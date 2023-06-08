import { ComponentsRegistrar } from './components-registrar';
import { FusionLogger } from './fusion-logger';
import { FusionApi } from '../api';

const componentPaths = process.env.COMPONENTS_PATH;

const config = {
  fusion: {
    path: '',
    prefix: 'fusion-',
  },
  custom: {
    prefix: '',
    path: '../components/',
  },
};
class ComponentsDetection {
  static isFusionCheck(tag) {
    return tag.includes(config.fusion.prefix);
  }

  static getConfig(isFusion) {
    return isFusion ? config.fusion : config.custom;
  }

  static findComponent(tag) {
    const component = componentPaths.find((componentPath) => componentPath.component === tag || componentPath.backwardCompatibilityComponent === tag);
    if (!component) {
      FusionLogger.warn('You tried to register component', tag);
    }
    return component ?? {};
  }

  static isRegistered(tag) {
    return FusionApi.getRegisteredComponents().includes(tag);
  }

  static importComponent(path) {
    import(`./../../../${path}/index.js`)
      .then((el) => {
        Object.getOwnPropertyNames(el)
          .filter((propName) => !propName.startsWith('__'))
          .map((propName) => {
            const name = el[propName].options.componentName;
            ComponentsRegistrar.register(name, el[propName], true);
            return el;
          });
      })
      .catch((err) => FusionLogger.log(err));
  }

  static registerComponent(tag) {
    const isExist = this.isRegistered(tag);
    if (!isExist) {
      const componentObj = this.findComponent(tag);
      this.importComponent(componentObj.path);
    }
  }

  setRootObserver() {
    const configMutation = this.constructor.getObserverConfig();
    const observerRoot = this.setupListener();
    const target = document.querySelector('body');
    observerRoot.observe(target, configMutation);
  }

  init() {
    this.setRootObserver();
    this.constructor.load(document);
  }

  static load(root) {
    const tags = [...root.querySelectorAll('*')]
      .map((el) => el.tagName.toLowerCase())
      .filter((tag) => tag.match('-'));
    const uniqueTags = [...new Set(tags)];

    uniqueTags.forEach((tag) => {
      this.registerComponent(tag);
    });
  }

  static getObserverConfig() {
    return {
      attributes: false,
      childList: true,
      subtree: true,
    };
  }

  setupListener() {
    const callback = (mutationsList) => {
      // eslint-disable-next-line
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          [...mutation.addedNodes]
            .filter((addedNode) => addedNode.tagName?.toLowerCase().includes('-'))
            .map((addedNode) => addedNode.tagName.toLowerCase())
            .forEach((tag) => {
              this.constructor.registerComponent(tag);
            });
        }
      }
    };

    this.observer = this.observer || new MutationObserver(callback.bind(this));
    return this.observer;
  }
}

const componentDetection = new ComponentsDetection();

export { componentDetection };
