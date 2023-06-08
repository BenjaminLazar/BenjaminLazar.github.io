/**
 * @deprecated This mixin is deprecated and will be deleted since version 1.13.0.
 * * Border mixin should be used instead this one.
 */

import { isTransparentRgba, getValueObject } from '../utils';
import { FusionLogger } from '../services/fusion-logger';

export function BorderedElement(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        'border-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          min: '0',
        },
        'border-style': {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'border',
          value: 'none',
          selectOptions: [
            'none',
            'solid',
            'dotted',
            'dashed',
            'double',
            'groove',
            'ridge',
            'inset',
            'outset',
          ],
        },
        'border-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'border',
          value: 'rgba(255, 255, 255, 0)',
        },
        'border-radius': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          min: '0',
          availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
        },
      };
    }

    connectedCallback() {
      super.connectedCallback();
      FusionLogger.warn(`Component ${this.constructor.options.componentName} use BorderedElement mixin which is deprecated`, 'BorderedElement');
    }

    static isBorderEmpty(width, style, color, amend) {
      return width === 0 || style === 'none' || isTransparentRgba(color, amend);
    }

    getBorderColor(value) {
      return this.constructor.isBorderEmpty(...this.getBorderProps()) ? value : this['border-color'];
    }

    static isBorderChanged(changedProps) {
      return changedProps.has('border-width') || changedProps.has('border-style') || changedProps.has('border-color');
    }

    getBorderProps(amend) {
      return [getValueObject(this['border-width']).num, this['border-style'], this['border-color'], amend];
    }

    /**
     *
     * @description calculation size of the element depending on border params (width, style, and alpha-color).
     * @param {string} value - element size value (width or height).
     * @param {string} prop - property name (width or height).
     * @returns {string} value - recalculated element size, toggle class `border-empty` to element depending on border params.
     */

    // @todo: Update fusion api, add possibility to use /^(-)?(\d+(?:\.\d+)?)?(.*)$/

    getSizeByBorder(value, prop) {
      const bordersCount = 4;
      const isBorderEmpty = this.constructor.isBorderEmpty(...this.getBorderProps());
      const { num } = getValueObject(this['border-width']);
      const unit = prop.match(/^(-)?(\d+(?:\.\d+)?)?(.*)$/)[3];
      return isBorderEmpty ? `${value}${unit}` : `${Math.max(num * bordersCount, Number(value))}${unit}`;
    }
  };
}
