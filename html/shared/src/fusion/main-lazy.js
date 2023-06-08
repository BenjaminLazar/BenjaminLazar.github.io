import './_vendor/touchy-swipe.js';

import { componentDetection } from './services/components-detection';

// Fusion Lib
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
import { FusionText } from './slide/text';
import { FusionButton } from './slide/button';
import { FusionGroup } from './slide/group';
import { SlideFragment } from './slide/slide-fragment';
import { FusionImage } from './slide/image';

class MainApp {
  constructor() {
    MainApp.initMainApp();
  }

  static initMainApp() {
    try {
      /* Preregister and preload important components START */
      ComponentsRegistrar.register('fusion-text', FusionText);
      ComponentsRegistrar.register('fusion-button', FusionButton);
      ComponentsRegistrar.register('fusion-group', FusionGroup);
      ComponentsRegistrar.register('fusion-image', FusionImage);
      ComponentsRegistrar.register('fusion-slide-fragment', SlideFragment);
      /* Preregister and preload important components END */
      InitiatorUtils.addListeners();
      ComponentReadinessChecker.init(['fusion-slide-fragment']);
      componentDetection.init();
      MainApp.initAllComponents();
      InitiatorUtils.setGlobalScopeVariables();
      /* activatorOnly:start */
      EditorLoader.load();
      /* activatorOnly:end */
      EnvDataReceiver.init();
      ScreenshotPreparer.init();
      ReferencesDataReceiver.setReferencesData();
    } catch (error) {
      FusionErrorHandler.handleError(error);
    }
  }

  static register(instance) {
    ComponentsRegistrar.register(instance.options.componentName, instance);
  }

  static initAllComponents() {
    if (process.env.FUSION_BUILD_TYPE !== 'slide') {
      ComponentsRegistrar.importComponents(require.context('./email', true, /\.js/), this.register);
      ComponentsRegistrar.importComponents(require.context('../components/email', true, /\.js/), this.register);
    }
    ComponentsRegistrar.emitComponentsRegistration();
  }
}

const mainApp = new MainApp();

require('./_vendor/anijs-helper-dom-min.js');

export { mainApp };
