import { AspectRatioLocker } from '../services/aspect-ratio-locker';
import { FusionApi } from '../api';
import { isReflectiveBoolean } from '../utils';

export function AspectRatioSwitcher(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
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
