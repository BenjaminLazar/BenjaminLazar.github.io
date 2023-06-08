import { FusionStore } from './fusion-store';
import {
  setVeevaEnv,
  setLocalEnv,
  setSlideReady,
  setScreenShotServiceEnv,
  setOceEnv,
} from '../_actions/app';
import { FusionLogger } from './fusion-logger';
import { veevaData } from '../veeva-data';

const loadedTypes = [];

class EnvironmentDetector {
  static setupEnvironmentListener(cb) {
    const unsubscribe = FusionStore.subscribe('app.environment', (data) => {
      const { environment } = data.app;
      if (environment) {
        unsubscribe();
        cb(environment);
      }
    });
  }

  static setVeevaEnv() {
    FusionStore.store.dispatch(setVeevaEnv());
  }

  static setScreenShotServiceEnv() {
    FusionStore.store.dispatch(setScreenShotServiceEnv());
  }

  static setLocalEnv() {
    FusionStore.store.dispatch(setLocalEnv());
  }

  static setOceEnv() {
    FusionStore.store.dispatch(setOceEnv());
  }

  static initVeevaLib() {
    window.com.veeva.clm.initialize();
  }

  // should be called only after veeva detection
  static isLaunchedLocally() {
    return window.location.protocol === 'file:' || this.isLaunchedByLink();
  }

  static isInIframe() {
    return window.location !== window.parent.location;
  }

  static isAwsHosted() {
    return window.location.host.includes('amazonaws.com');
  }

  static isLaunchedOnSSServer() {
    return !!window.SShotEnvironmentData;
  }

  static isLaunchedByLink() {
    return this.isAwsHosted() && !this.isInIframe();
  }

  static isActivator() {
    return this.isAwsHosted() && this.isInIframe();
  }

  static isOce() {
    return process.env.BUILD_MODE === 'prod' && !!window.CLMPlayer;
  }

  static emitEnvironmentSetup(env) {
    FusionLogger.log(`Environment detected: ${env}`, 'EnvironmentDetector');
    document.dispatchEvent(new CustomEvent('EnvironmentDetector:environmentDetected', { detail: env }));
  }

  static checkVeeva() {
    veevaData.getCurrentPresentationId()
      .then(() => {
        this.initVeevaLib();
        this.setVeevaEnv();
      })
      .catch((err) => {
        FusionLogger.warn(`Veeva detection request failed: ${err}, checking local....`, 'EnvironmentDetector');
        this.checkLocal();
      });
  }

  static checkLocal() {
    if (this.isLaunchedLocally()) {
      this.setLocalEnv();
    } else {
      FusionLogger.error('Environment was not detected', 'EnvironmentDetector');
    }
  }

  /** @function setLoadingListener - subscribes to an event from the screen shot readiness service
    * @event ReadyToScreening
    * @fires loadingHandler */
  static setLoadingListener() {
    document.addEventListener('ReadyToScreening', EnvironmentDetector.loadingHandler);
    document.addEventListener('DesignSystemReady', EnvironmentDetector.loadingHandler);
  }

  static async loadingHandler(event) {
    const checkTypes = ['ReadyToScreening', 'DesignSystemReady'];
    loadedTypes.push(event.type);
    if (checkTypes.every((type) => loadedTypes.includes(type))) {
      await FusionStore.store.dispatch(setSlideReady());
    }
  }

  static async setEnv() {
    this.setupEnvironmentListener(this.emitEnvironmentSetup);
    if (this.isActivator()) {
      FusionLogger.log('Waiting detection of environment....', 'EnvironmentDetector');
    } else if (this.isOce()) {
      this.setOceEnv();
    } else if (this.isLaunchedOnSSServer()) {
      this.setScreenShotServiceEnv();
    } else {
      // @todo: veeva should be always checked in the end
      this.checkVeeva();
    }
  }
}

export { EnvironmentDetector };
