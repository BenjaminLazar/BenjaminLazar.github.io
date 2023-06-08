import { css, html, unsafeCSS } from 'lit-element';
import { FusionText } from '../../text';
import { applyMixins, ContentModule, ModeTrackable } from '../../../mixins';
import { List } from '../../../mixins/props';

class FusionListItem extends applyMixins(FusionText, [
  List,
  ContentModule,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-list-item',
      componentContentType: 'text',
      componentUIName: 'List Item',
      componentDescription: 'Component for showing list item',
      isRootNested: false,
      nestedComponents: ['fusion-nested-list'],
      defaultTemplate:
        '<div slot="indicator"></div><div slot="content">Text</div>',
      resizable: false,
      draggable: false,
      rotatable: false,
      quillContent: '[slot="content"]',
    };
  }

  static get properties() {
    const {
      position,
      top,
      left,
      indication,
      'floating-text': floatingText,
      'text-padding-left': textPaddingLeft,
      'indication-horizontal-align': indicationHorizontalAlign,
      'indication-vertical-align': indicationVerticalAlign,
      ...rest
    } = super.properties;
    return {
      ...rest,
      margin: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'listItem',
        value: '5px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'text-padding-left': {
        ...textPaddingLeft,
        propertyGroup: 'listItem',
      },
      'indication-horizontal-align': {
        ...indicationHorizontalAlign,
        propertyGroup: 'listItem',
      },
      'indication-vertical-align': {
        ...indicationVerticalAlign,
        propertyGroup: 'listItem',
      },
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

  static alignConfig(prop) {
    const align = {
      top: 'flex-start',
      left: 'flex-start',
      center: 'center',
      middle: 'center',
      right: 'flex-end',
      bottom: 'flex-end',
      default: 'normal',
    };
    return align[prop];
  }

  setContentModule(content) {
    // Append the new content into the component
    const contentSlot = this.querySelector('div[slot="content"]');
    if (contentSlot) contentSlot.innerHTML = content;
  }

  getIndicationAlign() {
    const horizontalAlign = this.constructor.alignConfig(
      this['indication-horizontal-align'],
    );
    const verticalAlign = this.constructor.alignConfig(
      this['indication-vertical-align'],
    );
    return `
    :host ::slotted([slot="indicator"]) {
      align-items: ${verticalAlign};
      justify-content: ${horizontalAlign};
    }`;
  }

  static getTemplate() {
    return html`
      <div class="content">
        <slot name="indicator"></slot>
        <slot name="content"></slot>
      </div>
    `;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: relative;
          width: auto;
          height: auto;
          margin: var(--margin) 0;
        }
        :host .content {
          display: flex;
        }
        :host ::slotted([slot='indicator']) {
          display: flex;
          line-height: var(--line-height);
          color: var(--color);
        }
        :host ::slotted([slot='content']) {
          padding-left: var(--text-padding-left) !important;
        }
        :host([floating-text='true']) ::slotted([slot='content']) {
          text-indent: var(--text-padding-left);
          padding-left: 0 !important;
        }
        :host([floating-text='true']) .content {
          display: block;
        }
        :host([floating-text='true']) ::slotted([slot='indicator']) {
          float: left;
        }
        :host(.${unsafeCSS(ModeTrackable.NoteModeClassName)}) ::slotted(p),
        :host(.${unsafeCSS(ModeTrackable.NoteModeClassName)}) ::slotted(div[slot="content"]),
        :host(.${unsafeCSS(ModeTrackable.NoteModeClassName)}) ::slotted(div[slot="indicator"]) {
          pointer-events: none;
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles} ${this.getIndicationAlign()}
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      ${this.constructor.getTemplate()}
      <slot></slot>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionListItem };
