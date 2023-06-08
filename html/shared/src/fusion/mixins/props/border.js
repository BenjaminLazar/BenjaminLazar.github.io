import { getValueObject, isTransparentRgba } from '../../utils';

/**
  @mixin [<Border>] provides a list of standard properties (border-width, border-style, border-color, border-radius)
  that is intended to be added to slide components as a part of base functionalities. Mixin can't be used as it is,
  Additional definition of the place of application of properties is needed.
*/

export function Border(superClass) {
  return class extends superClass {
    static get properties() {
      const borderStyle = [
        {
          value: 'solid',
          icon: 'divider',
        },
        {
          value: 'dashed',
          icon: 'dashed',
        },
        {
          value: 'dotted',
          icon: 'dotted',
        },
      ];
      return {
        ...super.properties,
        'border-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          min: 0,
          availableUnits: [{ unitType: 'px' }],
        },
        'border-style': {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'border',
          value: 'solid',
          selectOptions: borderStyle,
        },
        'border-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'border',
          value: 'rgba(0, 0, 0, 1)',
        },
        'border-left-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          min: 0,
          availableUnits: [{ unitType: 'px' }],
        },
        'border-left-style': {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'border',
          value: 'solid',
          selectOptions: borderStyle,
        },
        'border-left-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'border',
          value: 'rgba(0, 0, 0, 1)',
        },
        'border-top-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          min: 0,
          availableUnits: [{ unitType: 'px' }],
        },
        'border-top-style': {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'border',
          value: 'solid',
          selectOptions: borderStyle,
        },
        'border-top-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'border',
          value: 'rgba(0, 0, 0, 1)',
        },
        'border-right-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          min: 0,
          availableUnits: [{ unitType: 'px' }],
        },
        'border-right-style': {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'border',
          value: 'solid',
          selectOptions: borderStyle,
        },
        'border-right-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'border',
          value: 'rgba(0, 0, 0, 1)',
        },
        'border-bottom-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          min: 0,
          availableUnits: [{ unitType: 'px' }],
        },
        'border-bottom-style': {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'border',
          value: 'solid',
          selectOptions: borderStyle,
        },
        'border-bottom-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'border',
          value: 'rgba(0, 0, 0, 1)',
        },
        'border-radius': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          min: 0,
          availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
        },
      };
    }

    update(changedProps) {
      super.update(changedProps);
      if (this.isRendered) {
        this.borderChanges(changedProps);
      }
    }

    borderChanges(props) {
      if (this.constructor.isBorderChanged(props)) {
        this.constructor.sizeTriggers.forEach((prop) => {
          if (prop in this.constructor.properties) {
            this.setSize(prop);
          }
        });
      }
    }

    /**
     * cssKeywords - List with specific values auto/inherit. This value will works as unit in calculations
     * Else for solution value = auto
     */
    setSize(prop) {
      const { num, unit } = getValueObject(this[prop]);
      const cssKeywords = ['auto', 'inherit', 'initial', 'unset'];
      let size = null;
      if (!cssKeywords.includes(unit)) {
        size = this.getSizeByBorder(num, prop);
      } else {
        size = unit;
      }
      this.setElementProp(prop, size);
      this.setAttribute(prop, size);
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
     * @description Handles prop value depend on border size and type of units
     * @param {DataObject} DataObject
     * @return {string} handled prop value
     */

    /**
     * @typedef {object} DataObject
     * @property {string} propName
     * @property {number} value
     * @property {string} unit
     * @property {number} borderWidth
     */

    compareInPxUnitSystem({
      propName, value, unit, borderWidth,
    }) {
      let handledValue;
      const bordersCount = 2;
      const percentCoefficient = 100;
      if (unit === '%') {
        const parentSize = this.parentElement.getBoundingClientRect()[propName];
        const absolutePropValue = (parentSize / percentCoefficient) * value;
        const maxValue = Math.max(borderWidth * bordersCount, absolutePropValue);
        handledValue = `${(maxValue / parentSize) * percentCoefficient}${unit}`;
      } else {
        handledValue = `${Math.max(borderWidth * bordersCount, Number(value))}${unit}`;
      }
      return handledValue;
    }

    /**
     *
     * @description calculation size of the element depending on border params (width, style, and alpha-color).
     * @param {string} value - element size value (width or height).
     * @param {string} propName - property name (width or height).
     * @returns {string} value - recalculated element size, toggle class `border-empty` to element depending on border params.
     */

    // @todo: Update fusion api, add possibility to use /^(-)?(\d+(?:\.\d+)?)?(.*)$/

    getSizeByBorder(value, propName) {
      const isBorderEmpty = this.constructor.isBorderEmpty(...this.getBorderProps());
      const { num: borderWidth } = getValueObject(this['border-width']);
      const unit = this[propName].match(/^(-)?(\d+(?:\.\d+)?)?(.*)$/)[3];
      return isBorderEmpty
        ? `${value}${unit}`
        : this.compareInPxUnitSystem({
          propName, value, unit, borderWidth,
        });
    }

    static get styles() {
      return [
        super.styles,
        this.generateCssProperty('border-radius'),
      ];
    }
  };
}
