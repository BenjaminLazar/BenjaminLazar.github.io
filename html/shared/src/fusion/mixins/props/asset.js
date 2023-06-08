import { AspectRatioLocker } from '../../services/aspect-ratio-locker';
import { FusionApi } from '../../api';
import { isReflectiveBoolean } from '../../utils';

/**
 @mixin [<Asset>] provides a list of standard properties (src, lock-aspect-ratio) that is intended to be added
 to slide components as a part of base functionalities. Mixin can't be used as it is,
 additional definition of the place of application of properties is needed.
 @example
 render() {
    return html` ... <audio src=${this.src}></audio> ...`
 */

export function Asset(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        src: {
          type: String,
          fieldType: 'Modal',
          propertyGroup: 'asset',
          value: '../shared/assets/images/image-placeholder.jpg',
          prop: true,
          assetType: 'Image',
        },
        'lock-aspect-ratio': {
          type: Boolean,
          fieldType: 'Boolean',
          propertyGroup: 'size',
          value: isReflectiveBoolean(),
          prop: true,
        },
      };
    }

    static get options() {
      return {
        ...super.options,
        lockAspectRatio: true,
      };
    }

    updateDependentProp(changedProps) {
      const attrList = AspectRatioLocker.getAspectRatioAttrList(this, changedProps);
      if (attrList.length) {
        FusionApi.updateAttributeList(this.getAttrListOption(attrList));
        this.updateSizeStyles(attrList);
      }
    }

    /**
     * @param {AttrConfig[]} attrList - dependent aspect ratio attributes of element
     * @returns {UpdateAttrOptions} - options
     */
    getAttrListOption(attrList) {
      return {
        attrList,
        isComponent: true,
        selectorId: this.id,
      };
    }

    updateSizeStyles(attrList) {
      const sizeAttr = attrList
        .find(({ attrKey }) => this.constructor.sizeTriggers.includes(attrKey));
      const { attrKey, attrValue } = sizeAttr;
      this.setElementProp(attrKey, attrValue);
    }

    isAspectRatio() {
      return this.hasAttribute('lock-aspect-ratio') && this.hasAttribute('ratio');
    }

    static isProportionalSizeChange(changedProps) {
      return changedProps.has('width') && changedProps.has('height');
    }

    shouldUpdateDependentRatioProp(changedProps) {
      return this.isAspectRatio() && !this.constructor.isProportionalSizeChange(changedProps);
    }

    update(changedProps) {
      super.update(changedProps);
      if (this.shouldUpdateDependentRatioProp(changedProps)) {
        this.updateDependentProp(changedProps);
      }
    }
  };
}
