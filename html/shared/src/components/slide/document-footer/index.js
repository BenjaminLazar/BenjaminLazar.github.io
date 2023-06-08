import { html, css } from 'lit-element';
import { FusionBase } from '../../../fusion/base';
import {
  applyMixins,
  SlideComponentBase,
} from '../../../fusion/mixins';
import {
  Container,
  Display,
  Dimensions,
} from '../../../fusion/mixins/props';

const defaultTemplate = '<p>Please! Add text for your footer here!</p>';

class DocumentFooter extends applyMixins(FusionBase, [SlideComponentBase, Container, Display, Dimensions]) {
  static get properties() {
    const {
      top,
      left,
      width,
      height,
      opacity,
    } = super.properties;
    return {
      top: {
        ...top,
        value: '675px',
      },
      left: {
        ...left,
        value: '96px',
      },
      width: {
        ...width,
        value: '655px',
      },
      height: {
        ...height,
        value: '75px',
      },
      opacity,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'document-footer',
      componentUIName: 'Document Footer',
      componentCategory: 'custom',
      componentScope: 'custom',
      componentDescription: 'Custom footer for slide',
      componentDomain: 'slide',
      defaultTemplate,
      isTextEdit: true,
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: absolute;
          width: var(--width);
          height: var(--height);
          font-size: 9px;
          font-weight: 500;
        }
        :host * {
          margin:0;
          padding:0;
        }
       `,
    ];
  }

  render() {
    super.render();
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

export { DocumentFooter };
