/**
 @mixin [<List>] provides a list of standard properties (text-padding-left, indication,
 indication-horizontal-align, indication-vertical-align, floating-text) that is intended to be added to slide
 components as a part of base functionalities. Mixin can't be used as it is.  Additional definition of the
 place of application of properties is needed.
 */

export function List(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        'text-padding-left': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'content',
          value: '0px',
          availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
        },
        indication: {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'content',
          value: 'empty',
          prop: true,
          selectOptions: [
            'empty',
            'dash',
            'bullet-point',
            'arabic-numerals',
            'roman-numerals',
            'uppercase-letters',
            'lowercase-letters',
          ],
        },
        'indication-horizontal-align': {
          type: String,
          fieldType: 'RadioGroup',
          propertyGroup: 'content',
          value: 'default',
          selectOptions: [
            { value: 'left', icon: 'textalign' },
            { value: 'center', icon: 'textalignmid' },
            { value: 'right', icon: 'textalignright' },
          ],
        },
        'indication-vertical-align': {
          type: String,
          fieldType: 'RadioGroup',
          propertyGroup: 'content',
          value: 'top',
          selectOptions: [
            { value: 'top', icon: 'textaligntop' },
            { value: 'middle', icon: 'textaligncenter' },
            { value: 'bottom', icon: 'textalignbottom' },
          ],
        },
        'floating-text': {
          type: Boolean,
          fieldType: 'hidden',
          propertyGroup: 'content',
          value: false,
          prop: true,
        },
      };
    }
  };
}
