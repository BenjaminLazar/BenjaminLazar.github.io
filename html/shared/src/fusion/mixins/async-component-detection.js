import { componentDetection } from '../services/components-detection';

/**
 *
 * @description Mixin for add listener and async loading subcomponents
 */

export function AsyncComponentDetection(superClass) {
  return class extends superClass {
    connectedCallback() {
      super.connectedCallback();
      if (process.env.FUSION_LAZY === 'lazy') {
        this.observer = componentDetection.setupListener();
        const observerConfig = componentDetection.constructor.getObserverConfig();
        this.observer.observe(this.shadowRoot, observerConfig);
      }
    }

    /**
     * @param {Collection of Nodes} elements
     */
    loadAsyncComponents(el = this.shadowRoot) {
      if (process.env.FUSION_LAZY === 'lazy') {
        componentDetection.constructor.load(el);
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      if (process.env.FUSION_LAZY === 'lazy') {
        this.observer.disconnect();
      }
    }
  };
}
