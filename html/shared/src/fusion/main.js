import './_vendor/touchy-swipe.js';

import { ComponentsRegistrar } from './services/components-registrar';
import { InitiatorUtils } from './services/initiator-utils';
import { EnvDataReceiver } from './services/env-data-receiver';
import { ScreenshotPreparer } from './services/screenshot-preparer';
import { ComponentReadinessChecker } from './services/component-readiness-checker';
import { ReferencesDataReceiver } from './services/references-data-receiver';
/* activatorOnly:start */
import { EditorLoader } from './editor-loader';
/* activatorOnly:end */
import { FusionErrorHandler } from './services/fusion-error-handler';
import { loadingOptimizer } from './services/loading-optimizer';
import config from '../config.json';

class MainApp {
  constructor() {
    MainApp.initMainApp();
  }

  static initMainApp() {
    const { loadingOptimizer: loadingOptimizerFlag, isDebugMode } = config;
    try {
      const components = MainApp.collectComponents();
      InitiatorUtils.addListeners();
      if (loadingOptimizerFlag && (process.env.BUILD_MODE === 'prod' || isDebugMode)) {
        loadingOptimizer.processHiddenComponents(components);
      }
      MainApp.registerComponents(components);
      InitiatorUtils.setGlobalScopeVariables();
      /* activatorOnly:start */
      EditorLoader.load();
      /* activatorOnly:end */
      EnvDataReceiver.init();
      ScreenshotPreparer.init();
      ReferencesDataReceiver.setReferencesData();
      /* Fusion-fragment load after initialization */
      ComponentReadinessChecker.init(['fusion-slide-fragment']);
    } catch (error) {
      FusionErrorHandler.handleError(error);
    }
  }

  /**
   * @param {Function<FusionBase>} instance
   */
  static register(instance) {
    ComponentsRegistrar.register(instance.options.componentName, instance);
  }

  /**
   * @param {Object.<string, Function<FusionBase>>} components
   */
  static registerComponents(components) {
    Object.values(components).forEach((component) => this.register(component));
    ComponentsRegistrar.emitComponentsRegistration();
  }

  /**
   * @param {Object.<string, Function<FusionBase>>} components
   * @param {Function<FusionBase>} instance
   */
  static collectContextComponents(components, instance) {
    components[instance.options.componentName] = instance;
  }

  static collectComponents() {
    const components = {};
    const cb = this.collectContextComponents.bind(this, components);
    ComponentsRegistrar.importComponents(require.context('./slide', true, /\.js/), cb);
    ComponentsRegistrar.importComponents(require.context('./email', true, /\.js/), cb);
    ComponentsRegistrar.importComponents(require.context('../components/slide', true, /\.js/), cb);
    ComponentsRegistrar.importComponents(require.context('../components/email', true, /\.js/), cb);
    return components;
  }
}

const mainApp = new MainApp();

require('./_vendor/anijs-helper-dom-min.js');

export { mainApp };
