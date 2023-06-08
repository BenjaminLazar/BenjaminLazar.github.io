/**
 @mixin [<Grid>] provides a list of standard properties (rows, columns) that is intended
 to be added to slide components as a part of base functionalities.  Mixin can't be used as it is,
 Additional definition of the place of application of properties is needed.
 */

export function Grid(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        rows: {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: '1',
        },
        columns: {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: '12',
        },
        'column-gap': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: '10px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
          ],
        },
        'row-gap': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: '10px',
          availableUnits: [
            { unitType: 'px' },
            { unitType: '%' },
          ],
        },
      };
    }
  };
}

export function GridItem(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        'grid-columns': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: '4',
        },
        'grid-column-start': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: 'auto',
          availableUnits: [
            { unitType: 'auto', noInputNumber: true },
            { unitType: '' },
          ],
        },
        'grid-columns-tablet': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: 'inherit',
          availableUnits: [
            { unitType: 'inherit', noInputNumber: true },
            { unitType: '' },
          ],
        },
        'grid-column-start-tablet': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: 'auto',
          availableUnits: [
            { unitType: 'auto', noInputNumber: true },
            { unitType: '' },
          ],
        },
        'grid-columns-mobile': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: 'inherit',
          availableUnits: [
            { unitType: 'inherit', noInputNumber: true },
            { unitType: '' },
          ],
        },
        'grid-column-start-mobile': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: 'auto',
          availableUnits: [
            { unitType: 'auto', noInputNumber: true },
            { unitType: '' },
          ],
        },
        'grid-rows': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: '1',
        },
        'grid-row-start': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: 'auto',
          availableUnits: [
            { unitType: 'auto', noInputNumber: true },
            { unitType: '' },
          ],
        },
        'grid-rows-tablet': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: 'inherit',
          availableUnits: [
            { unitType: 'inherit', noInputNumber: true },
            { unitType: '' },
          ],
        },
        'grid-row-start-tablet': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: 'auto',
          availableUnits: [
            { unitType: 'auto', noInputNumber: true },
            { unitType: '' },
          ],
        },
        'grid-rows-mobile': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: 'inherit',
          availableUnits: [
            { unitType: 'inherit', noInputNumber: true },
            { unitType: '' },
          ],
        },
        'grid-row-start-mobile': {
          fieldType: 'Number',
          propertyGroup: 'layout',
          value: 'auto',
          availableUnits: [
            { unitType: 'auto', noInputNumber: true },
            { unitType: '' },
          ],
        },
      };
    }
  };
}
