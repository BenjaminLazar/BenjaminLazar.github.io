class StackRunner {
  /**
   * @typedef {Object} VeevaResponse
   */
  constructor(params = { handler: null }) {
    const { handler } = params;
    this.config = {
      handler,
    };
    this.stack = [];
    this.isStackRunningProceed = false;
  }

  /**
   * @param {StackRunnerData} data
   */
  push(data) {
    if (data) {
      this.stack.push(data);
    }
    if (!this.isStackRunningProceed) {
      this.run();
    }
  }

  checkStack() {
    const lastIndexItem = this.stack.length - 1;
    const FIRST_ITEM_INDEX = 0;
    // if we have stack of the same data, we get only last value
    if (!!this.stack.length && this.stack[FIRST_ITEM_INDEX].id === this.stack[lastIndexItem].id) {
      this.stack.splice(0, lastIndexItem);
    }
  }

  /**
   * @param {VeevaResponse} result
   */
  resultHandler(result) {
    if (this.config.handler) {
      this.config.handler(result, this.stack[0]);
    }
    this.stack.shift();
    this.run();
  }

  run() {
    this.isStackRunningProceed = true;
    this.checkStack();
    const method = this.stack.length > 0 ? this.stack[0].method : null;
    if (method) {
      method(this.resultHandler.bind(this));
    } else {
      this.isStackRunningProceed = false;
    }
  }
}

export { StackRunner };
