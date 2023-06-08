import { html } from 'lit-element';
import { intersectMap } from '../../utils';

/**
 @mixin [<Container>] provides a list of standard properties (top, left) that is intended to be added
 to slide components as a part of base functionalities. Mixin can be used as it is, without additional
 definition of the place of application of properties.
 */

export function Container(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        top: {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'position',
          value: '10px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'vh' },
          ],
        },
        left: {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'position',
          value: '10px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'vw' },
          ],
        },
      };
    }

    /**
     * @description The array of property names for triggering sizes update
     * @return {string[]}
     */
    static get sizeTriggers() {
      return ['width', 'height'];
    }

    /**
     * @description The array of property names for triggering position update
     * @return {string[]}
     */
    static get positionTriggers() {
      return ['top', 'left'];
    }

    update(changedProps) {
      super.update(changedProps);
      if (this.isRendered) {
        this.checkSizes(changedProps);
        this.checkPositions(changedProps);
      }
    }

    checkSizes(changedProps) {
      const properties = intersectMap(changedProps, this.constructor.sizeTriggers);
      this.applyProps(properties);
    }

    checkPositions(changedProps) {
      const properties = intersectMap(changedProps, this.constructor.positionTriggers);
      this.applyProps(properties);
    }

    applyProps(changedProps) {
      const properties = Array.from(changedProps.keys());
      properties.forEach((property) => {
        this.setStyle(property, this[property], false);
        if (this.hasAttribute(property)) {
          this.setAttribute(property, this[property]);
        }
      });
    }

    static setRequiredStyle() {
      const requiredProperties = [...this.sizeTriggers, ...this.positionTriggers];
      return requiredProperties.reduce((style, property) => {
        let requiredStyle = style;
        if (this.properties[property]) {
          requiredStyle = `${requiredStyle}${property}: var(--${property});`;
        }
        return requiredStyle;
      }, '');
    }

    get dynamicStyles() {
      return html`
        ${super.dynamicStyles}
        :host {
          ${this.constructor.setRequiredStyle()}
        }
      `;
    }
  };
}

export function ContainerType(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        display: {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'size',
          value: 'block',
          selectOptions: [
            'block',
            'flex',
            'grid',
          ],
        },
      };
    }
  };
}
