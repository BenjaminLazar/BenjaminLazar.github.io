import { html, css, unsafeCSS } from 'lit-element';
import { FusionList } from '../list';
import { createObjectItem } from '../../utils';
import { FusionSortableListItem } from './sortable-list-item';
import Sortable from '../../_vendor/sortable.min';
import { applyMixins, ModeTrackable } from '../../mixins';

class FusionSortableList extends applyMixins(FusionList, [ModeTrackable]) {
  static get properties() {
    return {
      ...super.properties,
      animation: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'sortableList',
        value: '150',
        step: 10,
        availableUnits: [{ unitType: 'ms' }],
      },
      'disable-sorting': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'sortableList',
        value: false,
        prop: true,
      },
      'draggable-background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'sortableList',
        value: 'rgba(230, 230, 230, 1)',
      },
      'locked-background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'sortableList',
        value: 'rgba(230, 230, 230, 1)',
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-sortable-list',
      componentUIName: 'Sortable list',
      componentDescription: 'Content item to be used in sortable list',
      nestedComponents: ['fusion-sortable-list-item'],
    };
  }

  constructor() {
    super();
    this.item = createObjectItem(FusionSortableListItem);
    this.sortableOptions = {};
  }

  createSortable() {
    this.sortable = Sortable.create(this, this.getSortableConfig());
  }

  /**
   * @description Get triggers which will fire Sortable update
   * @param {array.<string>} triggers - options which should update Sortable
   * @return {array.<string>}
   */
  static getSortableOptionsTrigger(triggers = []) {
    return ['disable-sorting', 'animation', ...triggers];
  }

  static shouldUpdateSortable(changedProps) {
    return this.getSortableOptionsTrigger()
      .some((property) => changedProps.has(property));
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.isRendered) {
      this.updateSortableByOptions(changedProps);
    }
  }

  updateSortableByOptions(changedProps) {
    if (this.constructor.shouldUpdateSortable(changedProps)) {
      const options = [...changedProps.keys()];
      options.forEach((option) => {
        const name = this.constructor.getSortableOptionName()[option];
        this.sortableOptions = options.reduce((acc, value) => {
          acc[name] = this[value];
          return { ...this.sortableOptions, ...acc };
        }, {});
      });
    }
  }

  static getSortableOptionName() {
    return {
      'disable-sorting': 'disabled',
      animation: 'animation',
    };
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.createSortable();
  }

  /**
   * @description Get base options for the Sortable. More options you can find there => https://github.com/SortableJS/Sortable#options
   * @param {object.<string, string>} customOptions
   * @return {object.<string, string>}
   */
  getSortableConfig(customOptions = {}) {
    return {
      animation: this.animation,
      handle: 'fusion-sortable-list-item',
      filter: '[lock-sort]',
      forceFallback: true,
      fallbackOnBody: true,
      disabled: this['disable-sorting'],
      swapThreshold: 1,
      invertSwap: true,
      ...customOptions,
    };
  }

  editorModeChanged(isEditMode) {
    if (isEditMode) {
      this.sortable.option('disabled', isEditMode);
    }
    if (!isEditMode && this.sortableOptions) {
      Object.keys(this.sortableOptions)
        .forEach((key) => this.sortable.option(key, this.sortableOptions[key]));
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host([disable-sorting]),
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) {
          cursor: auto;
        }
        :host(:not([disable-sorting]):not(.${unsafeCSS(ModeTrackable.EditModeClassName)}))  {
          cursor: pointer;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
         ${this.dynamicStyles}
      </style>
      <div class=${this.wrapperClassName}><slot></slot></div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionSortableList };
