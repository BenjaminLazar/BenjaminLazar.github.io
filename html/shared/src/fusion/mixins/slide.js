/**
 * @deprecated This mixin is deprecated and will be deleted since version 1.13.0.
 * SlideComponentBase mixin should be used instead this one.
 * */

import { css, html } from 'lit-element';
import { intersectMap } from '../utils';
import { FusionLogger } from '../services/fusion-logger';

export function SlideComponent(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        top: {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'box',
          value: '10px',
          availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
        },
        left: {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'box',
          value: '10px',
          availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
        },
        opacity: {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'display',
          value: '100',
          min: '0',
          max: '100',
        },
        ...super.properties,
      };
    }

    static get options() {
      return {
        ...super.options,
        componentDomain: 'slide',
        isRootNested: true,
        resizable: 'all',
        draggable: 'xy',
        rotatable: true,
        sortable: false,
      };
    }

    /**
     * @description Method for getting events that are used in the component
     * @return {array}
     */
    // eslint-disable-next-line class-methods-use-this
    get exportEventListeners() {
      return [];
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

    connectedCallback() {
      super.connectedCallback();
      FusionLogger.warn(`Component ${this.constructor.options.componentName} use SlideComponent mixin which is deprecated`, 'SlideComponent');
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

    static get zIndex() {
      return this.options.componentType === 'dynamic' ? 'var(--level)' : '1';
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

    static get styles() {
      return [
        super.styles,
        css`
          :host {
            position: absolute;
          }
          :host > *:not([name="mo-system"], style) {
            opacity: calc(var(--opacity) / 100);
          }
        `,
      ];
    }

    get dynamicStyles() {
      return html`
        ${super.dynamicStyles}
        :host {
          ${this.constructor.setRequiredStyle()}
          z-index: ${this.constructor.zIndex};
        }
      `;
    }
  };
}
