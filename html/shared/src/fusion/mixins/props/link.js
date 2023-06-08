/**
 @mixin [<Link>] provides a list of standard properties (background-color, color, active-background-color,
 active-color) that is intended to be added to slide components as a part of base functionalities.
 Mixin can't be used as it is. Properties with the prefix active will be applied to the element that contains the
 class attribute with the value active
 */

export function Link(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        'background-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'link',
          value: 'rgba(255, 255, 255, 0)',
        },
        color: {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'link',
          value: 'rgba(0, 0, 0, 1)',
        },
        'active-background-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'link',
          value: 'rgba(221, 221, 221, 1)',
        },
        'active-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'link',
          value: 'rgba(255, 255, 255, 1)',
        },
      };
    }

    static get styles() {
      const selector = '.active:not([name="mo-system"])';
      return [
        super.styles,
        this.generateCssProperty('color'),
        this.generateCssProperty('background-color'),
        this.generateCssProperty('active-color', selector, 'color', true),
        this.generateCssProperty('active-background-color', selector, 'background-color', true),
      ];
    }
  };
}
