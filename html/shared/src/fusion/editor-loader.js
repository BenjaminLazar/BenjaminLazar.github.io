import { FusionLogger } from './services/fusion-logger';
import config from '../config.json';
import { versionManager } from './services/version-manager';
import { isActivator } from './utils';

class EditorLoader {
  /**
   * @param {string} version
   * @param {boolean} isDevMode
   */
  static loadCSS(version, isDevMode) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.classList.add('anthill-activator-item');
    if (isDevMode) {
      link.href = `${process.env.PROTOCOL}://localhost:${process.env.EDITOR_PORT}/main.css`;
    } else {
      link.href = `https://cdn.activator.cloud/editor/${version}/main.css`;
    }
    document.head.appendChild(link);
  }

  /**
   * @param {string} version
   * @param {boolean} isDevMode
   */
  static loadScript(version, isDevMode) {
    const script = document.createElement('script');
    script.classList.add('anthill-activator-item');
    if (isDevMode) {
      script.src = `${process.env.PROTOCOL}://localhost:${process.env.EDITOR_PORT}/main.js`;
    } else {
      script.src = `https://cdn.activator.cloud/editor/${version}/main.js`;
    }
    document.body.appendChild(script);
  }

  static load() {
    if (isActivator()) {
      const sharedVersion = versionManager.getVersion();
      const version = config.editor || sharedVersion || 'dist';
      const { isDevMode } = config;
      FusionLogger.log(`Loading Activator Editor - ${version}`, 'EditorLoader');
      EditorLoader.loadActivatorLazyComponentScript();
      EditorLoader.loadCSS(version, isDevMode);
      EditorLoader.loadScript(version, isDevMode);
    }
  }

  static loadActivatorLazyComponentScript() {
    if (process.env.FUSION_BUILD_TYPE !== 'email' && isActivator() && process.env.FUSION_LAZY === 'lazy') {
      const { isLocalLoadComponentMode } = config;
      FusionLogger.log('Loading Activator Components ', 'EditorLoader');
      const script = document.createElement('script');
      script.classList.add('anthill-activator-item-lazy-components');
      if (isLocalLoadComponentMode) {
        script.src = 'http://localhost:5001/dist/activator.js';
      } else {
        script.src = '../shared/dist/activator.js';
      }
      document.body.appendChild(script);
    }
  }
}

export { EditorLoader };
