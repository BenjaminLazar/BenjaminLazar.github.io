import { FusionLogger } from './fusion-logger';

/**
 * Fusion service for receiving JS-errors on Fusion Shared side and passing them to the Monarch side
 */

class FusionErrorHandler {
  /**
   * @typedef {object.<string|string|string>} Error
   * @property {string} name
   * @property {string} message
   * @property {string} stack
   */

  /**
   * @description Handling a Fusion error and pass it to the Editor side
   * @param {Error} error
   * @return {Promise<void>}
   */
  static async handleError(error) {
    const { name, message, stack } = error;
    const errorData = { name: 'FUSION:CURRENT_ERROR', error: { name, message, stack } };
    await window.parent.postMessage(errorData, '*');
    FusionLogger.error(error);
  }
}

export { FusionErrorHandler };
