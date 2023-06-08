import { debounce } from '../utils';

/**
 * Dom observable for add subscription for changes DOM. Class works with default configuration.
 */

export class DOMObservable {
  constructor() {
    this.config = {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
      attributeOldValue: false,
      characterDataOldValue: false,
    };
  }

  /**
   * Setup observer in instance
   * @param {function} callback Function that will be triggered
   * @param {boolean} isDebounce If you want to setup debounce functionality
   * @return {MutationObserver} Observer
   */
  init(callback, isDebounce = false) {
    const debouncedFunc = debounce(callback);

    this.observer = new MutationObserver((mutations) => {
      if (isDebounce) {
        debouncedFunc(mutations);
      } else {
        callback(mutations);
      }
    });
    return this.observer;
  }

  /**
   * Setup config for observer instance
   * @param config Params that we want to update
   * @return {Object} return the configuration object
   */
  setConfig(config = {}) {
    this.config = { ...this.config, ...config };
    return this.config;
  }

  observe(element) {
    this.observer.observe(element, this.config);
  }

  disconnect() {
    this.observer.disconnect();
  }
}
