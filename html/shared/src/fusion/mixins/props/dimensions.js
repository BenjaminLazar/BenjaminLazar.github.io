import config from '../../../config.json';

/**
 @mixin [<Dimensions>] provides a list of standard properties (width, height, padding-top, padding-right,
 padding-bottom, padding-left) that is intended to be added to slide components as a part of base functionalities.
 Mixin can be used as it is, without additional definition of the place of application of properties.
 */

export function Dimensions(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        width: {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'size',
          value: config.responsive ? 'auto' : '400px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'vw' },
            { unitType: 'vmin' },
            { unitType: 'vmax' },
            { unitType: 'auto', noInputNumber: true },
          ],
          min: 0,
        },
        height: {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'size',
          value: config.responsive ? 'auto' : '400px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'vh' },
            { unitType: 'vmin' },
            { unitType: 'vmax' },
            { unitType: 'auto', noInputNumber: true },
          ],
          min: 0,
        },
        'min-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'size',
          value: config.responsive ? '30px' : 'auto',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'vw' },
            { unitType: 'vmin' },
            { unitType: 'vmax' },
            { unitType: 'auto', noInputNumber: true },
          ],
          min: 0,
        },
        'min-height': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'size',
          value: config.responsive ? '30px' : 'auto',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'vh' },
            { unitType: 'vmin' },
            { unitType: 'vmax' },
            { unitType: 'auto', noInputNumber: true },
          ],
          min: 0,
        },
        'max-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'size',
          value: 'auto',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'vw' },
            { unitType: 'vmin' },
            { unitType: 'vmax' },
            { unitType: 'auto', noInputNumber: true },
          ],
          min: 0,
        },
        'max-height': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'size',
          value: 'auto',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'vh' },
            { unitType: 'vmin' },
            { unitType: 'vmax' },
            { unitType: 'auto', noInputNumber: true },
          ],
          min: 0,
        },
        'padding-top': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'padding',
          value: '0px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'vmin' },
          ],
          min: 0,
        },
        'padding-right': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'padding',
          value: '0px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'vmin' },
          ],
          min: 0,
        },
        'padding-bottom': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'padding',
          value: '0px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'vmin' },
          ],
          min: 0,
        },
        'padding-left': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'padding',
          value: '0px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'vmin' },
          ],
          min: 0,
        },
      };
    }

    static get styles() {
      return [
        super.styles,
        this.generateCssProperty('width', ':host'),
        this.generateCssProperty('height', ':host'),
        this.generateCssProperty('min-width', ':host'),
        this.generateCssProperty('min-height', ':host'),
        this.generateCssProperty('max-width', ':host'),
        this.generateCssProperty('max-height', ':host'),
        this.generateCssProperty('padding-top'),
        this.generateCssProperty('padding-right'),
        this.generateCssProperty('padding-bottom'),
        this.generateCssProperty('padding-left'),
      ];
    }
  };
}
