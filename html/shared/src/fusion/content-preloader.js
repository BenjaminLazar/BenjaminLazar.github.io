class ContentPreloader {
  constructor() {
    this.attributeName = 'data-show-content';
  }

  showNodeContent(rootNode) {
    if (rootNode && !rootNode.hasAttribute(this.attributeName)) {
      rootNode.setAttribute(this.attributeName, true);
    }
  }

  hideNodeContent(rootNode) {
    rootNode.removeAttribute(this.attributeName);
  }
}

const contentPreloader = new ContentPreloader();

export { contentPreloader };
