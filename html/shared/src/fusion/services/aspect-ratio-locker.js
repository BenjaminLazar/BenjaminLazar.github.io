import { getValueObject } from '../utils';

class AspectRatioLocker {
  static get config() {
    return {
      'lock-aspect-ratio': {
        dependentAttr: 'height',
        dependentAttrValue: 'calcHeight',
        handler: 'lockAspectRatioChangeHandler',
      },
      width: {
        dependentAttr: 'height',
        dependentAttrValue: 'calcHeight',
        handler: 'sizeChangeHandler',
      },
      height: {
        dependentAttr: 'width',
        dependentAttrValue: 'calcWidth',
        handler: 'sizeChangeHandler',
      },
    };
  }

  static get observedAttr() {
    return Object.keys(this.config);
  }

  static lockAspectRatioChangeHandler(changedAttr, ratio, el) {
    const width = el.getAttribute('width');
    const inputObj = { attrKey: 'width', attrValue: width };
    return [changedAttr, this.getDependentAttr(inputObj, ratio)];
  }

  static sizeChangeHandler(changedAttr, ratio) {
    return [this.getDependentAttr(changedAttr, ratio)];
  }

  static getChangedAttr(el, changedProps) {
    let obj = null;
    changedProps.forEach((value, key) => {
      if (this.observedAttr.includes(key) && el[key]) {
        obj = {
          attrKey: key,
          attrValue: el[key],
        };
      }
    });
    return obj;
  }

  static getDependentAttr({ attrKey, attrValue }, ratio) {
    const { dependentAttr, dependentAttrValue } = this.config[attrKey];
    return {
      attrKey: dependentAttr,
      attrValue: this[dependentAttrValue](attrValue, ratio),
    };
  }

  static calcHeight(widthValue, ratio) {
    const { num, unit } = getValueObject(widthValue);
    const prefix = num !== '' ? parseInt(num / ratio, 10) : '';
    return `${prefix}${unit}`;
  }

  static calcWidth(heightValue, ratio) {
    const { num, unit } = getValueObject(heightValue);
    const prefix = num !== '' ? parseInt(num * ratio, 10) : '';
    return `${prefix}${unit}`;
  }

  /**
   * Attribute config object.
   * @typedef {Object} AttrConfig
   * @property {String} attrValue - value of attribute
   * @property {String} attrKey - name of attribute
   */
  /**
   * @param {HTMLElement} el - selected dom element
   * @param {Map<String, String>} changedProps - map of changed props
   * @returns {AttrConfig[]} attrList - dependent aspect ratio attributes of element
   */
  static getAspectRatioAttrList(el, changedProps) {
    const ratio = el.getAttribute('ratio');
    const changedAttr = this.getChangedAttr(el, changedProps);
    let attrList = [];
    if (changedAttr) {
      const { handler } = this.config[changedAttr.attrKey];
      attrList = this[handler](changedAttr, ratio, el);
    }
    return attrList;
  }
}

export { AspectRatioLocker };
