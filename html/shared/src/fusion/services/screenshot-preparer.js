import { FusionStore } from './fusion-store.js';
import { FusionApi } from '../api';

/**
 * Entry point for initiating services dependent of environment
 */

const ANIMATION_ATTR = 'data-mo-immediate-animation';
const TARGET_DEVICE_HEIGHT = 'data-mo-device-height';

class ScreenshotPreparer {
  static init() {
    document.addEventListener('EnvironmentDetector:environmentDetected', () => this.handleEnvDetect());
  }

  static setupAnimationAttr(rootNode) {
    rootNode.setAttribute(ANIMATION_ATTR, true);
  }

  /**
   * @description Setup fixed html size for briefs/slides for screenshot service
   */
  static setupHtmlSize(rootNode) {
    const deviceHeight = rootNode.getAttribute(TARGET_DEVICE_HEIGHT);
    if (deviceHeight) {
      const html = document.documentElement;
      html.style.height = `${deviceHeight}px`;
    }
  }

  /**
   * @description Puppeteer doesn't render last document element in case it have display:'inline-block' style.
   * In our case fusion-button have display:'inline-block' style.
   */
  static handleInlineBlockComponent(rootNode) {
    const divEl = document.createElement('div');
    divEl.style.width = '100%';
    divEl.style.border = '1px solid transparent';
    rootNode.appendChild(divEl);
  }

  static handleEnvDetect() {
    if (FusionStore.isScreenShot) {
      const rootNode = FusionApi.getRootNode();
      this.handleInlineBlockComponent(rootNode);
      this.setupAnimationAttr(rootNode);
      this.setupHtmlSize(rootNode);
    }
  }
}

export { ScreenshotPreparer };
