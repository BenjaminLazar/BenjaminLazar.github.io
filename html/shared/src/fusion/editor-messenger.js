import { FusionLogger } from './services/fusion-logger';

import { isEqual } from './utils';

class EditorMessenger {
  static get MAX_QUEUE_SIZE() {
    return 100;
  }

  constructor() {
    this.pendingRequests = new Map(); // { messageID: resolver }
    this.currentId = 0;
    this.isPublishingInited = false;
    this.createListener();
    this.queue = [];
  }

  static createEvent(data) {
    return new CustomEvent('fusionMessage', {
      detail: data,
    });
  }

  static send(data) {
    const event = EditorMessenger.createEvent(data);
    document.dispatchEvent(event);
  }

  initPublishing() {
    this.isPublishingInited = true;
    this.digest();
  }

  digest() {
    this.queue.forEach((data) => EditorMessenger.send(data));
    this.queue = [];
  }

  addToQueue(data) {
    this.queue.push(data);
    if (this.queue.length > EditorMessenger.MAX_QUEUE_SIZE) {
      FusionLogger.warn('Max queue size exceeded!', 'EditorMessenger');
      this.queue.shift();
    }
  }

  shouldAddToQueue(newEl) {
    const foundAction = this.queue.find((queueEl) => newEl.name === queueEl.name && isEqual(newEl.data, queueEl.data));

    return !foundAction;
  }

  request(data = {}) {
    return new Promise((res) => {
      if (!this.shouldAddToQueue(data)) {
        return;
      }

      this.currentId += 1;
      const id = this.currentId;
      data.meta = {
        id,
        isRequest: true,
      };
      this.pendingRequests.set(id, res);
      this.addToQueue(data);
      if (this.isPublishingInited) {
        this.digest();
      }
    });
  }

  createListener() {
    document.addEventListener('fusionResponse', ({ detail }) => {
      const resolver = this.pendingRequests.get(detail.name);
      if (resolver) {
        resolver(detail.data);
        this.pendingRequests.delete(detail.name);
      } else {
        FusionLogger.warn('No resolver found', 'EventEmitter');
      }
    });
  }
}

const editorMessenger = new EditorMessenger();

export { editorMessenger };
