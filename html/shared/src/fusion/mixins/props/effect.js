/**
 @mixin [<Effect>] provides a list of standard properties (effect, duration, delay, initialState) that is intended
 to be added to slide components as a part of base functionalities.  Mixin can't be used as it is,
 Additional definition of the place of application of properties is needed.
 */

export function Effect(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        initialState: {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'animation',
          value: 'inactive',
          prop: true,
          selectOptions: [
            'active',
            'inactive',
          ],
        },
        effect: {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'animation',
          value: 'fade-in',
          prop: true,
          selectOptions: [
            'fade-in',
            'slide-left',
            'slide-right',
            'slide-bottom',
            'slide-top',
          ],
        },
        duration: {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'animation',
          value: '500ms',
          step: 50,
          prop: true,
          availableUnits: [{ unitType: 'ms' }],
        },
        delay: {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'animation',
          value: '0ms',
          step: 50,
          prop: true,
          availableUnits: [{ unitType: 'ms' }],
        },
      };
    }
  };
}
