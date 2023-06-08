import { css } from 'lit-element';
import { FusionList } from '../index';

class FusionNestedList extends FusionList {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-nested-list',
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
        propertyGroup: 'size',
        value: '15px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'inherit-indication': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'content',
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

export { FusionNestedList };
