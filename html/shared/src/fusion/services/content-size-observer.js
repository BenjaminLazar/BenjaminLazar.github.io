import { FusionApi } from '../api';
import { DOMObservable } from './dom-observable';
import { FusionStore } from './fusion-store';

class ContentSizeObserver {
  constructor({ root }) {
    this.root = root;
    this.mutationObserver = null;
    this.resizeObserver = null;
    this.environmentSetEvent = 'EnvironmentDetector:environmentDetected';
    this.environmentSetHandler = this.initObserver.bind(this);
  }

  initObserver() {
    if (FusionStore.isActivator) {
      this.initMutationObserver();
      this.initResizeObserver();
    }
    document.removeEventListener(this.environmentSetEvent, this.environmentSetHandler);
  }

  init() {
    document.addEventListener(this.environmentSetEvent, this.environmentSetHandler);
  }

  initMutationObserver() {
    this.mutationObserver = new DOMObservable();
    this.mutationObserver.init(this.rootContentChangeHandler.bind(this), true);
    this.mutationObserver.observe(this.root);
  }

  initResizeObserver() {
    this.resizeObserver = new ResizeObserver(this.rootResizeHandler.bind(this));
    this.resizeObserver.observe(this.root);
  }

  rootResizeHandler() {
    FusionApi.setIframeSize({ height: this.root.scrollHeight });
    this.resizeObserver.unobserve(this.root);
  }

  rootContentChangeHandler() {
    FusionApi.setIframeSize({ height: this.root.scrollHeight });
  }
}

const contentSizeObserver = new ContentSizeObserver({ root: document.querySelector('body') });
export { contentSizeObserver };
