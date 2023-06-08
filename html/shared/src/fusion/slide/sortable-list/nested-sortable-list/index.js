import { css } from 'lit-element';
import { FusionSortableList } from '../index';

class FusionNestedSortableList extends FusionSortableList {
  static get properties() {
    return {
      ...super.properties,
      left: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'sortableList',
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

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-nested-sortable-list',
      isRootNested: false,
      resizable: false,
      draggable: false,
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

export { FusionNestedSortableList };
