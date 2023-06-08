import { css, html, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import config from '../../../config';
import {
  applyMixins,
  SlideComponentBase,
  ContentModule,
  ModeTrackable,
} from '../../mixins';
import {
  Container,
  Dimensions,
  Border,
  Typography,
  Display,
  Background,
  FieldDefinition,
} from '../../mixins/props';
import { BorderUpdateHandler } from '../../services/border-update-handler';

const { responsive } = config;
const defaultTemplate = '<p>Text</p>';

class FusionText extends applyMixins(FusionBase, [
  SlideComponentBase,
  ContentModule,
  Container,
  Dimensions,
  Typography,
  Border,
  Display,
  Background,
  ModeTrackable,
  FieldDefinition,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-text',
      componentContentType: 'text',
      componentUIName: 'Text',
      componentCategory: 'text',
      componentDescription: 'Component for showing text data',
      isTextEdit: true,
      nestedComponents: [],
      defaultTemplate,
      resizable: 'e,w',
    };
  }

  static get properties() {
    const {
      top,
      left,
      'line-height': lineHeight,
      'background-color': backgroundColor,
      'background-size': backgroundSize,
      'background-position-x': backgroundX,
      'background-position-y': backgroundY,
      'background-image': backgroundImage,
      'background-repeat': backgroundRepeat,
      'background-attachment': backgroundAttachment,
      width,
      overflow,
      'should-shown': shouldShown,
      ...rest
    } = super.properties;
    return {
      top,
      left,
      width: {
        ...width,
      },
      'line-height': {
        ...lineHeight,
        value: '1.2',
      },
      'background-color': {
        ...backgroundColor,
        value: 'rgba(0, 0, 0, 0)',
      },
      ...rest,
      'should-shown': {
        ...shouldShown,
        value: true,
      },
    };
  }

  static setMinResponsiveValues() {
    if (responsive) {
      return css`
        :host .content{
          min-height: var(--min-height);
        }
      `;
    }
    return css``;
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host .content {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          height: auto;
          border: none;
        }
        .content {
          width: 100%;
          height: 100%;
          background: var(--background-color);
          border: var(--border-width) var(--border-style) var(--border-color);
          border-radius: var(--border-radius);
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
        }
        ::slotted(div.ql-editor),
        ::slotted(ul),
        ::slotted(div[slot="content"]),
        ::slotted(p) {
          font-size: var(--fluid-font-size, var(--font-size));
          font-weight: var(--font-weight);
          font-style: var(--font-style);
          line-height: var(--line-height);
          letter-spacing: var(--letter-spacing);
          word-break: break-word;
          color: var(--color);
        }
        :host(.${unsafeCSS(ModeTrackable.NoteModeClassName)}) {
          z-index: auto;
        }
        :host(.${unsafeCSS(ModeTrackable.NoteModeClassName)}) ::slotted(p) {
          pointer-events: none;
        }
      `,
      this.setMinResponsiveValues(),
    ];
  }

  setContentModule(content) {
    // Append the new content into the component
    this.innerHTML = content;
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

export { FusionText };
