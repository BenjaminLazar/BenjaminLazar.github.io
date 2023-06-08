export function DisplayFlex(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        'flex-direction': {
          type: String,
          fieldType: 'RadioGroup',
          propertyGroup: 'layout',
          value: 'column',
          prop: true,
          selectOptions: [
            { value: 'row' },
            { value: 'row-reverse' },
            { value: 'column' },
            { value: 'column-reverse' },
          ],
        },
        'data-horizontal': {
          type: String,
          fieldType: 'RadioGroup',
          propertyGroup: 'layout',
          value: 'center',
          prop: true,
          selectOptions: [
            {
              value: 'left',
              icon: {
                row: 'start-horizontal',
                column: 'start-vertical',
                'row-reverse': 'start-horizontal',
                'column-reverse': 'start-vertical',
              },
            },
            {
              value: 'center',
              icon: {
                row: 'center-horizontal',
                column: 'center-vertical',
                'row-reverse': 'center-horizontal',
                'column-reverse': 'center-vertical',
              },
            },
            {
              value: 'right',
              icon: {
                row: 'end-horizontal',
                column: 'end-vertical',
                'row-reverse': 'end-horizontal',
                'column-reverse': 'end-vertical',
              },
            },
            {
              value: 'stretch',
              icon: {
                row: 'stretch-horizontal',
                column: 'stretch-vertical',
                'row-reverse': 'stretch-horizontal',
                'column-reverse': 'stretch-vertical',
              },
            },
          ],
        },
        'data-vertical': {
          type: String,
          fieldType: 'RadioGroup',
          propertyGroup: 'layout',
          value: 'center',
          prop: true,
          selectOptions: [
            {
              value: 'top',
              icon: {
                row: 'justify-start-horizontal',
                column: 'justify-start-vertical',
                'row-reverse': 'justify-end-horizontal',
                'column-reverse': 'justify-end-vertical',
              },
            },
            {
              value: 'center',
              icon: {
                row: 'justify-center-horizontal',
                column: 'justify-center-vertical',
                'row-reverse': 'justify-center-horizontal',
                'column-reverse': 'justify-center-vertical',
              },
            },
            {
              value: 'bottom',
              icon: {
                row: 'justify-end-horizontal',
                column: 'justify-end-vertical',
                'row-reverse': 'justify-start-horizontal',
                'column-reverse': 'justify-start-vertical',
              },
            },
            {
              value: 'between',
              icon: {
                row: 'justify-spacebetween-horizontal',
                column: 'justify-spacebetween-vertical',
                'row-reverse': 'justify-spacebetween-horizontal',
                'column-reverse': 'justify-spacebetween-vertical',
              },
            },
            {
              value: 'evenly',
              icon: {
                row: 'justify-spacearound-horizontal',
                column: 'justify-spacearound-vertical',
                'row-reverse': 'justify-spacearound-horizontal',
                'column-reverse': 'justify-spacearound-vertical',
              },
            },
          ],
        },
      };
    }
  };
}
