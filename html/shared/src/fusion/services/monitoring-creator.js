import { VeevaMonitoring } from './monitoring';
import { EnvironmentDetector } from './environment-detector';

class MonitoringCreator {
  // @todo simple factory for different monitorinng instances (veeva, oce etc)
  static createInstance() {
    // @todo: check if env value is exist in store and use it instead
    if (!EnvironmentDetector.isOce()) {
      VeevaMonitoring.createInstance();
    }
  }
}

export { MonitoringCreator };
