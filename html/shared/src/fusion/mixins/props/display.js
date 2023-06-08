import { html } from 'lit-element';

/**
 @mixin [<Display>] provides a list of standard properties (opacity, overflow) that is intended to be added
 to slide components as a part of base functionalities. Mixin can be used as it is, without
 additional definition of the place of application of properties.
 */

export function Display(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        opacity: {
          type: String,
          fieldType: 'Slider',
          propertyGroup: 'adjust',
          value: '100%',
          min: 0,
          max: 100,
        },
        overflow: {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'size',
          value: 'visible',
          selectOptions: [
            { value: 'visible', icon: 'preview' },
            { value: 'hidden', icon: 'preview-closed' },
            { value: 'scroll', icon: 'scroll' },
            { value: 'auto', icon: 'backgroundcover' },
          ],
        },
      };
    }

    getOpacity() {
      return parseInt(this.opacity, 10);
    }

    get dynamicStyles() {
      const opacity = this.getOpacity();
      return html`
      ${super.dynamicStyles}
      :host > *:not([name="mo-system"], style) {
        opacity: calc(${opacity} / 100);
      }
    `;
    }

    static get styles() {
      return [
        super.styles,
        this.generateCssProperty('overflow'),
      ];
    }
  };
}
