import { Link } from './link';
import { applyMixins } from '../index';
import { isReflectiveBoolean } from '../../utils';

/**
 @mixin [<Menu>] provides a list of standard properties (background-color, color, active-background-color,
 active-color, separator-height, separator-width, separator-color, end-separators) that is intended to be added
 to slide components as a part of base functionalities. Mixin can't be used as it is.
 Additional to use it, add a `separator` class to an element that will be used as a separator.
 */

export function Menu(superClass) {
  return class extends applyMixins(superClass, [
    Link,
  ]) {
    static get properties() {
      return {
        ...super.properties,
        'separator-height': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'separator',
          value: '100%',
          min: 0,
          availableUnits: [{ unitType: '%' }],
        },
        'separator-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'separator',
          value: '2px',
          min: 0,
          availableUnits: [{ unitType: 'px' }],
        },
        'separator-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'separator',
          value: 'rgba(0, 0, 0, 1)',
        },
        'end-separators': {
          type: Boolean,
          fieldType: 'Boolean',
          propertyGroup: 'separator',
          value: isReflectiveBoolean(),
          prop: true,
        },
      };
    }

    static get styles() {
      return [
        super.styles,
        this.generateCssProperty('separator-height', '.separator', 'height'),
        this.generateCssProperty('separator-width', '.separator', 'width'),
        this.generateCssProperty('separator-color', '.separator', 'background-color'),
      ];
    }
  };
}
