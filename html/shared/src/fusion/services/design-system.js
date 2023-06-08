import { httpRequest, isActivator } from '../utils';
import { FusionStore } from './fusion-store';
import designStyles from '../../design-styles.json';

// @todo Reuse theme-applier. Refactor to unique it
class DesignSystemConfigurator {
  static get defaultConfig() {
    return {
      components: [],
    };
  }

  static getFetchConfigHandler(url) {
    let configPromise = null;
    return function getConfigHandler() {
      if (!configPromise) {
        configPromise = httpRequest(url);
      }
      return configPromise;
    };
  }

  static getDefaultConfigHandler(config = this.defaultConfig) {
    return function defaultConfig() {
      return new Promise((resolve) => resolve(config));
    };
  }

  constructor(configURL) {
    this.configURL = configURL;
    this.componentsLoading = false;
    this.componentsPromises = [];
    this.componentsPromise = new Promise((res) => {
      this.componentsResolver = res;
    });
    // Getting shared resource preview url
    this.metadataPromise = new Promise((res) => {
      this.metadataResolver = res;
    });
    const unsubscribe = FusionStore.subscribe('app.activatorMetadata', (data) => {
      const { activatorMetadata } = data.app;
      unsubscribe();
      this.metadataResolver(activatorMetadata);
    });
  }

  async getConfig() {
    let { configURL } = this;
    if (isActivator()) {
      const metadata = await this.metadataPromise;
      if (metadata?.sharedResourcePreviewUrl) {
        configURL = `${metadata.sharedResourcePreviewUrl}${configURL.replace('../shared', '')}`;
      }
    }
    let fetchConfig;
    let clientSpecific;
    try {
      fetchConfig = this.constructor.getFetchConfigHandler(configURL);
      clientSpecific = await fetchConfig();
    } catch (err) {
      fetchConfig = this.constructor.getDefaultConfigHandler();
      clientSpecific = await fetchConfig();
    }
    return { ...clientSpecific };
  }

  async init() {
    this.componentsLoading = true;
    const { components = [] } = isActivator() ? await this.getConfig() : designStyles;
    this.components = this.constructor.setupStructure(components);
    this.componentsLoading = false;
    this.componentsResolver();
    document.dispatchEvent(new CustomEvent('DesignSystemReady'));
  }

  static setupStructure(components) {
    return components.reduce((total, current) => {
      const { component, properties } = current;
      if (!total[component]) total[component] = {};
      properties.forEach((property) => {
        total[component][property.name] = property.value;
      });
      return total;
    }, {});
  }

  async getComponentStyles(componentName) {
    // Only loading design system config once
    if (!this.components) {
      if (!this.componentsLoading) {
        await this.init();
      } else {
        await this.componentsPromise;
      }
    }
    return (this.components && this.components[componentName]) || [];
  }
}

const designSystemConfig = new DesignSystemConfigurator(`../shared/src/design-styles.json?ts=${Date.now()}`);

export { designSystemConfig };
