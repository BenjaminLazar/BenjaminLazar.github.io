import { html, css } from 'lit-element';
import { FusionGroup } from '../group';
import { Display, DisplayFlex } from '../../mixins/props';
import { applyMixins } from '../../mixins';
import { BorderUpdateHandler } from '../../services/border-update-handler';

class ContentArea extends applyMixins(FusionGroup, [
  Display,
  DisplayFlex,
]) {
  static get properties() {
    const {
      overflow,
      ...rest
    } = super.properties;
    return {
      ...rest,
      overflow: {
        ...overflow,
        selectOptions: [
          { value: 'hidden', icon: 'preview-closed' },
          { value: 'visible', icon: 'preview' },
          { value: 'scroll', icon: 'scroll' },
        ],
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-content-area',
      componentUIName: 'Content Area',
      componentDescription: 'A static area for grouping content together. Used in layouts.',
      resizable: false,
      draggable: false,
      rotatable: false,
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        .fusion-content-area {
          display: flex;
          flex-direction: var(--flex-direction);
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 30px;
          background-color: var(--background-color);
          border: var(--border-width) var(--border-style) var(--border-color);
          border-radius: var(--border-radius);
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host .fusion-content-area {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='fusion-content-area'>
        <slot></slot>
        ${this.constructor.systemSlotTemplate}
      </div>
    `;
  }
}

export { ContentArea };
