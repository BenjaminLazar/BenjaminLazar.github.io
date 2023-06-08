import { css } from 'lit-element';
import { CustomList } from '../index';

class CustomNestedList extends CustomList {
  constructor() {
    super();
    this.fieldIcon = '.icon-bulletpoint-outlined';
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'custom-nested-list',
      componentScope: 'custom',
      isRootNested: false,
      resizable: false,
      draggable: false,
    };
  }

  static get properties() {
    return {
      ...super.properties,
      left: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'list',
        value: '15px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'inherit-indication': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'list',
        value: false,
        prop: true,
      },
    };
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.isRendered && changedProps.has('inherit-indication')) {
      this.setItemsIndication();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: relative;
          top: 0;
        }
      `,
    ];
  }
}

export { CustomNestedList };
