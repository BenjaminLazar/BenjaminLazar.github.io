import { getValueObject } from '../utils';
import { FusionLogger } from './fusion-logger';

/**
 * Service for manipulating with width in nested components
 */

class EmailImageWidthAligner {
  /**
   * @description Get correct width for the element
   * @param {String} elWidth
   * @param {String} parentElementWidth
   * @return {Object.<number, number, string>}
   */
  static widthConfig(elWidth, parentElementWidth) {
    const { num: elementWidth, unit } = getValueObject(elWidth);
    const { num: parentWidth } = getValueObject(parentElementWidth);
    return {
      parentWidth,
      elementWidth,
      unit,
    };
  }

  /**
   * @description Get suitable width for the element by parent
   * @param {String} elWidth
   * @param {String} parentElementWidth
   * @return {string} - suitable width
   */
  static getSuitableWidth(elWidth, parentElementWidth) {
    const { parentWidth, elementWidth, unit } = EmailImageWidthAligner.widthConfig(elWidth, parentElementWidth);
    return `${Math.min(elementWidth, parentWidth)}${unit}`;
  }

  /**
   * @description Get observable elements from parent HTMLElement. In our case, it's a ['MJMLImage', 'MJMLGroup', 'MJMLColumn']
   * @param {HTMLElement} element
   * @return {HTMLElement}
   */
  static getObservableElements(element) {
    return [...element.children].filter((child) => child.constructor.options?.dependsOnParent);
  }

  /**
   * @description Update/set CSS variable to the element according to the parent width
   * @param {HTMLElement} element
   * @param {String} elWidth
   */
  alignElementWidthByParent(element, elWidth) {
    const parentElementWidth = getComputedStyle(element.parentNode).width;
    const elementWidth = elWidth || getComputedStyle(element).width;
    const suitableElementWidth = this.constructor.getSuitableWidth(elementWidth, parentElementWidth);
    element.style.setProperty('--width', suitableElementWidth);
  }

  /**
   * @description Send request update to the element that should be updated
   * @param element
   */
  static sendRequestUpdate(element) {
    element.requestUpdate('--width', element.width);
  }

  /**
   * @description Update element width handler
   * @param {HTMLElement} element
   */
  handleUpdateWidth(element) {
    const elements = EmailImageWidthAligner.getObservableElements(element);
    if (elements) {
      elements.forEach((child) => this.handleUpdateWidth(child));
      EmailImageWidthAligner.sendRequestUpdate(element);
    } else {
      FusionLogger.log('Nothing to update, EmailAlignImageWidth');
    }
  }
}

const emailImageWidthAligner = new EmailImageWidthAligner();

export { emailImageWidthAligner };
