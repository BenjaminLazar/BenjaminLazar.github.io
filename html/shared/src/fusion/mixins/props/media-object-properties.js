import { css } from 'lit-element';
import config from '../../../config.json';

/**
 @mixin [<MediaObjectProperties>] provides a list of standard properties (object-position-top, object-position-left, object-fit)
 that is intended to be added to slide components as a part of base functionalities.
 Mixin can be used as it is, without additional definition of the place of application of properties.
 */

/**
 *
 * @description Mixin for adding advanced image object properties such as object-position, object-fit.
 */

export function MediaObjectProperties(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        'object-position-top': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'size',
          value: config.responsive ? 'center' : '0px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'center', noInputNumber: true },
          ],
        },
        'object-position-left': {
          type: String,
          fieldType: 'Number',
          value: config.responsive ? 'center' : '0px',
          propertyGroup: 'size',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'center', noInputNumber: true },
          ],
        },
        'object-fit': {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'size',
          value: 'fill',
          selectOptions: [
            'fill',
            'contain',
            'cover',
            'none',
            'scale-down',
          ],
        },
      };
    }

    static get styles() {
      return [
        super.styles,
        css`
        :host img,
        :host video {
          object-position: var(--object-position-left) var(--object-position-top);
          object-fit: var(--object-fit);
        }
      `,
      ];
    }
  };
}
