/**
 @mixin [<Background>] provides a list of standard properties (background-color, background-image, background-size
 background-position-x, background-position-y, background-repeat, background-attachment) that is intended to be added
 to slide components as a part of base functionalities. Mixin can be used as it is, without additional
 definition of the place of application of properties.
 */

export function Background(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        'background-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'background',
          value: 'rgba(255, 255, 255, 0)',
        },
        'background-image': {
          type: String,
          fieldType: 'Modal',
          propertyGroup: 'background',
          value: '',
          assetType: 'Image',
          prop: true,
        },
        'background-size': {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'background',
          value: 'cover',
          selectOptions: [
            { value: 'auto', icon: 'backgrounddefault' },
            { value: 'contain', icon: 'backgroundcontain' },
            { value: 'cover', icon: 'backgroundcover' },
            { value: '100% auto', icon: 'backgroundautowidth' },
            { value: 'auto 100%', icon: 'backgroundautoheight' },
          ],
        },
        'background-position-x': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'background',
          value: '0px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'left', noInputNumber: true },
            { unitType: 'center', noInputNumber: true },
            { unitType: 'right', noInputNumber: true },
          ],
        },
        'background-position-y': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'background',
          value: '0px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
            { unitType: 'top', noInputNumber: true },
            { unitType: 'center', noInputNumber: true },
            { unitType: 'bottom', noInputNumber: true },
          ],
        },
        'background-repeat': {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'background',
          value: 'no-repeat',
          selectOptions: [
            'no-repeat',
            'repeat ',
            'repeat-x',
            'repeat-y',
          ],
        },
        'background-attachment': {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'background',
          value: 'scroll',
          selectOptions: [
            'fixed',
            'local ',
            'scroll',
          ],
        },
      };
    }

    update(changedProps) {
      super.update(changedProps);
      if (changedProps.has('background-image')) {
        const handledValue = changedProps.get('background-image') ? 'none' : `url('${this['background-image']}')`;
        this.style.setProperty('--background-image', handledValue);
      }
    }

    static get styles() {
      return [
        super.styles,
        this.generateCssProperty('background-image'),
        this.generateCssProperty('background-position-x'),
        this.generateCssProperty('background-position-y'),
        this.generateCssProperty('background-repeat'),
        this.generateCssProperty('background-size'),
        this.generateCssProperty('background-attachment'),
        this.generateCssProperty('background-color'),
      ];
    }
  };
}
