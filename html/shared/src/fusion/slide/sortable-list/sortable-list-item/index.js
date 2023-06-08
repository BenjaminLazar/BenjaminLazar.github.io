import { css } from 'lit-element';
import { FusionListItem } from '../../list/list-item';

class FusionSortableListItem extends FusionListItem {
  static get properties() {
    return {
      ...super.properties,
      'lock-sort': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'sortableListItem',
        value: false,
        prop: true,
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-sortable-list-item',
      componentUIName: 'Sortable list item',
      componentDescription: 'Content item to be used in sortable list',
      nestedComponents: ['fusion-nested-sortable-list'],
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
         :host(.sortable-ghost) .content {
          background-color: var(--draggable-background-color);
        }
         :host(.sortable-drag) .content {
          height: auto;
        }
        :host([lock-sort]) .content {
          cursor: auto;
          background-color: var(--locked-background-color);
        }
        :host ::slotted([slot='content']) {
          width: 100%;
        }
      `,
    ];
  }
}

export { FusionSortableListItem };
