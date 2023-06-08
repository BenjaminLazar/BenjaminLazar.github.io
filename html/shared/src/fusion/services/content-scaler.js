import { EnvironmentDetector } from './environment-detector';
import { FusionLogger } from './fusion-logger';
import { FusionStore } from './fusion-store';
import config from '../../config.json';

/**
 * class ContentScaler Scale content from origin size to device size. Original size setup in data-mo-device-width/heigth.
 * root {HTMLElement} DOM element. For now it is body. After implementation slide component, it should start to be a root node
 * */

class ContentScaler {
  constructor(root) {
    this.defaultFallbackWidth = 1024;
    this.defaultFallbackHeight = 768;
    this.targetDeviceHeight = 'data-mo-device-height';
    this.targetDeviceWidth = 'data-mo-device-width';
    this.htmlEl = document.querySelector('html');
    this.setRoot();
    if (!root) {
      FusionLogger.warn('Incorrect root variable.', 'Content-scaler');
    }
  }

  setRoot(root) {
    this.root = root || this.htmlEl;
  }

  static getTargetProp(attr) {
    const el = document.querySelector(`[${attr}]`);
    return el && el.getAttribute(attr);
  }

  static getDeviceSizes() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  /**
   * getPresentationSizes - get correct width from parameters
   * getTargetProp {number} - active solution
   * this.root.offsetWidth {number} - support for 1.10.0
   * @deprecated defaultFallbackWidth {number} - legacy setup. */

  getPresentationSizes() {
    if (!ContentScaler.getTargetProp(this.targetDeviceWidth) || !ContentScaler.getTargetProp(this.targetDeviceHeight)) {
      FusionLogger.warn('Target device resolution wasn\'t setup in config.', 'Content-scaler');
    }
    return {
      width: ContentScaler.getTargetProp(this.targetDeviceWidth) || this.root.offsetWidth || this.defaultFallbackWidth,
      height: ContentScaler.getTargetProp(this.targetDeviceHeight) || this.root.offsetHeight || this.defaultFallbackHeight,
    };
  }

  scaleContent() {
    this.device = ContentScaler.getDeviceSizes();
    this.presentation = this.getPresentationSizes();
    if (this.device.width && this.device.height) {
      const scaleValue = this.calcScale();
      ContentScaler.alignByCenter(this.root);
      ContentScaler.setScale(this.root, scaleValue);
      ContentScaler.setVeevaDesctopAttr(this.root);
    }
  }

  calcScale() {
    const scale = 1;
    return scale / Math.max(this.presentation.width / this.device.width, this.presentation.height / this.device.height);
  }

  /**
   * @todo fallbackSetup {function} tmp solution for fallback 1.10.0 without setup offsetWidth and css setup
   * */
  setupScaleContent({ root = this.root }) {
    this.setRoot(root);
    if (process.env.FUSION_BUILD_TYPE !== 'email') {
      // Roman S explanation: Env load faster than subscribtion works. e carefully
      const env = FusionStore.store.getState().app.environment;
      if (env !== '') {
        this.fallbackSetup();
      }
      document.addEventListener('EnvironmentDetector:environmentDetected', () => this.fallbackSetup());
      if (!EnvironmentDetector.isActivator() && !config.responsive) {
        this.scaleContent();
      }
    }
  }

  fallbackSetup() {
    if (this.isSlideSizeLessThanMinimal()) {
      this.root.style.width = `${this.defaultFallbackWidth}px`;
      this.root.style.height = `${this.defaultFallbackHeight}px`;
    }
  }

  isSlideSizeLessThanMinimal() {
    return this.root.offsetWidth < this.defaultFallbackWidth || this.root.offsetHeight < this.defaultFallbackHeight;
  }

  static alignByCenter(node) {
    node.style.position = 'absolute';
    node.style.top = '50%';
    node.style.left = '50%';
    node.style.transform = 'translate3d(-50%, -50%, 0)';
  }

  static setScale(node, scaleValue) {
    const { transform } = node.style;
    node.style.transform = `${transform} scale(${scaleValue})`;
  }

  static setVeevaDesctopAttr(node) {
    node.setAttribute('data-mo-veeva-desktop-app', true);
  }
}

const contentScaler = new ContentScaler(document.querySelector('body'));

export { contentScaler };
