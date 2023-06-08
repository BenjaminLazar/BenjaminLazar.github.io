import { FusionApi } from '../api';
import AniJS from '../_vendor/anijs-min.js';

import { contentScaler } from './content-scaler';
import { MonitoringCreator } from './monitoring-creator';
import { EnvironmentDetector } from './environment-detector';
import { contentPreloader } from '../content-preloader';
import { initSwipeListeners } from './swipe-utils';
/* activatorOnly:start */
import { contentSizeObserver } from './content-size-observer';
/* activatorOnly:end */
const com = require('../_vendor/veeva-library.js');

const globalVariables = {
  Fusion: FusionApi,
  AniJS,
  com,
};

class InitiatorUtils {
  static setGlobalScopeVariables(globalScope = window) {
    Object.keys(globalVariables).forEach((key) => {
      globalScope[key] = globalVariables[key];
    });
  }

  static addListeners() {
    EnvironmentDetector.setLoadingListener();
    document.addEventListener('DOMContentLoaded', () => {
      EnvironmentDetector.setEnv();
      MonitoringCreator.createInstance();
      contentScaler.setupScaleContent({ root: FusionApi.getRootNode() });
      contentPreloader.showNodeContent(FusionApi.getRootNode());
      /* activatorOnly:start */
      contentSizeObserver.init();
      /* activatorOnly:end */
      initSwipeListeners();
    });
  }
}

export { InitiatorUtils };
