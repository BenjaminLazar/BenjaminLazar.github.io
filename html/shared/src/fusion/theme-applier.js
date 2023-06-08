import { httpRequest } from './utils';
import { versionManager } from './services/version-manager';

class ThemeApplier {
  static get defaultConfig() {
    return {
      fonts: [],
      colors: {},
      rootSelector: {},
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
    this.init();
  }

  async getConfig(configPreviewUrl = '') {
    let fetchConfig;
    let clientSpecific;
    try {
      fetchConfig = ThemeApplier.getFetchConfigHandler(configPreviewUrl || this.configURL);
      clientSpecific = await fetchConfig();
    } catch (err) {
      fetchConfig = ThemeApplier.getDefaultConfigHandler();
      clientSpecific = await fetchConfig();
    }
    const version = versionManager.getVersion();
    return { ...clientSpecific, version };
  }

  async init() {
    const { colors } = await this.getConfig();
    ThemeApplier.applyColors(document.documentElement, colors);
  }

  static applyColors(root, colors) {
    Object.keys(colors)
      .forEach((colorName) => root.style.setProperty(colorName, colors[colorName]));
  }
}

const themeApplier = new ThemeApplier(`../shared/src/config.json?ts=${Date.now()}`);

export { themeApplier };
