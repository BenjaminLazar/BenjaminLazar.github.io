import { css, html } from 'lit-element';
import { applyMixins, SlideComponentBase } from '../../../mixins';
import { FusionText } from '../../text';
import {
  Typography,
  Dimensions,
} from '../../../mixins/props';

class FusionTableCell extends applyMixins(FusionText, [
  SlideComponentBase,
  Typography,
  Dimensions,
]) {
  static get properties() {
    const {
      top,
      left,
      width,
      height,
      position,
      'max-height': maxHeight,
      'min-height': minHeight,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      'line-height': lineHeight,
      ...rest
    } = super.properties;
    return {
      ...rest,
      'padding-top': {
        ...paddingTop,
        value: '10px',
      },
      'padding-bottom': {
        ...paddingBottom,
        value: '10px',
      },
      'padding-left': {
        ...paddingLeft,
        value: '10px',
      },
      'padding-right': {
        ...paddingRight,
        value: '10px',
      },
      width: {
        ...width,
        value: '100px',
        availableUnits: [{ unitType: 'px' }],
      },
      'line-height': {
        ...lineHeight,
        value: '1.2',
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-table-cell',
      componentCategory: 'data',
      componentUIName: 'Table Cell',
      componentDescription: 'Basic table cell component',
      isTextEdit: true,
      isRootNested: false,
      defaultTemplate: '<p>Cell text</p>',
      resizable: 'e',
      draggable: false,
      rotatable: false,
      multipleSelect: true,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.emitCustomEvent(`${this.constructor.options.componentName}:added`);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.emitCustomEvent(`${this.constructor.options.componentName}:removed`);
  }

  checkSizes(changedProps) {
    super.checkSizes(changedProps);
    const { componentName } = this.constructor.options;
    if (changedProps.has('background-color')) {
      this.emitCustomEvent(`${componentName}:bg-changed`);
    } else if (changedProps.has('width')) {
      const params = { oldWidth: changedProps.get('width') };
      this.emitCustomEvent(`${componentName}:resized`, { detail: params });
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: relative;
          height: 100%;
          padding: 0;
        }
        :host(.selected) .content {
          background: #00c800;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='content'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}
export { FusionTableCell };
