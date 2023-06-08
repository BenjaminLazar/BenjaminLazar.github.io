import { FusionStore } from '../services/fusion-store';

export function EnvDependComponent(superClass) {
  return class extends superClass {
    connectedCallback() {
      super.connectedCallback();
      this.environmentDataSetHandler = this.environmentDataReceived.bind(this);
      this.environmentDataEvent = 'EnvironmentDataReceived';
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener(this.environmentDataEvent, this.environmentDataSetHandler);
    }

    firstUpdated(changedProps) {
      super.firstUpdated(changedProps);
      if (FusionStore.slide) {
        this.environmentDataReceived({ detail: FusionStore.environmentData });
      } else {
        document.addEventListener(this.environmentDataEvent, this.environmentDataSetHandler);
      }
    }
  };
}
