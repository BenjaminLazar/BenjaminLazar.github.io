import { css, html, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  LinkExtension,
  ModeTrackable,
  EmailComponent,
  ContentModule,
  EmailComponentBaseClasses,
  FontEmail,
  SafeFontFamilyCombination,
  EmailBorder,
} from '../../mixins';
import { FieldDefinition } from '../../mixins/props';
import { BorderUpdateHandler } from '../../services/border-update-handler';

class MJMLButton extends applyMixins(FusionBase, [
  ModeTrackable,
  LinkExtension,
  EmailComponent,
  ContentModule,
  EmailComponentBaseClasses,
  FontEmail,
  SafeFontFamilyCombination,
  EmailBorder,
  FieldDefinition,
]) {
  static get properties() {
    const xAlignOptions = [
      { value: 'left', icon: 'start-vertical' },
      { value: 'center', icon: 'center-vertical' },
      { value: 'right', icon: 'end-vertical' },
    ];
    const yAlignOptions = [
      { value: 'top', icon: 'textaligntop' },
      { value: 'middle', icon: 'textaligncenter' },
      { value: 'bottom', icon: 'textalignbottom' },
    ];
    const textAlignOptions = [
      { value: 'left', icon: 'textalign' },
      { value: 'center', icon: 'textalignmid' },
      { value: 'right', icon: 'textalignright' },
    ];
    const {
      'should-shown': shouldShown,
      ...rest
    } = super.properties;
    return {
      width: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'size',
        value: '100%',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      height: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'size',
        value: '35px',
        availableUnits: [{ unitType: 'px' }],
      },
      'padding-top': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'padding',
        value: '10px',
        availableUnits: [{ unitType: 'px' }],
      },
      'padding-right': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'padding',
        value: '25px',
        availableUnits: [{ unitType: 'px' }],
      },
      'padding-bottom': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'padding',
        value: '10px',
        availableUnits: [{ unitType: 'px' }],
      },
      'padding-left': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'padding',
        value: '25px',
        availableUnits: [{ unitType: 'px' }],
      },
      'inner-padding-top': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'innerPadding',
        value: '5px',
        availableUnits: [{ unitType: 'px' }],
      },
      'inner-padding-right': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'innerPadding',
        value: '25px',
        availableUnits: [{ unitType: 'px' }],
      },
      'inner-padding-bottom': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'innerPadding',
        value: '5px',
        availableUnits: [{ unitType: 'px' }],
      },
      'inner-padding-left': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'innerPadding',
        value: '25px',
        availableUnits: [{ unitType: 'px' }],
      },
      'border-radius': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'border',
        value: '3px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'background',
        value: 'rgba(65, 65, 65, 1)',
      },
      color: {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'text',
        value: 'rgba(255, 255, 255, 1)',
      },
      align: {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'layout',
        value: 'center',
        selectOptions: xAlignOptions,
      },
      'text-align': {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'text',
        value: 'center',
        selectOptions: textAlignOptions,
      },
      'vertical-align': {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'text',
        value: 'middle',
        selectOptions: yAlignOptions,
      },
      'line-height': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'text',
        value: '120%',
      },
      ...rest,
      'should-shown': {
        ...shouldShown,
        value: true,
      },
      'text-transform': {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'text',
        value: 'none',
        selectOptions: [
          { value: 'none', icon: 'x-small' },
          { value: 'uppercase', icon: 'uppercase' },
          { value: 'capitalize', icon: 'titlecase' },
          { value: 'lowercase', icon: 'lowercase' },
        ],
      },
      'text-decoration': {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'text',
        value: 'none',
        selectOptions: [
          { value: 'none', icon: 'x-small' },
          { value: 'underline', icon: 'underline' },
          { value: 'overline', icon: 'overline' },
        ],
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'mj-button',
      componentContentType: 'text',
      componentUIName: 'Button',
      componentDescription: 'Basic button for adding interactions',
      isTextEdit: true,
      nestedComponents: [],
      defaultTemplate: 'Button',
      alignConfig: {
        top: 'flex-start',
        left: 'flex-start',
        center: 'center',
        middle: 'center',
        right: 'flex-end',
        bottom: 'flex-end',
      },
      quillBlockAttrList: {
        'ql-content': '',
      },
    };
  }

  getInnerPadding() {
    return `${this['inner-padding-top']} ${this['inner-padding-right']} ${this['inner-padding-bottom']} ${this['inner-padding-left']}`;
  }

  setInnerPadding() {
    const padding = this.getInnerPadding();
    this.setAttribute('inner-padding', padding);
  }

  setContentModule(content) {
    // Append the new content into the component
    this.innerHTML = content;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          width: 100%;
          height: auto;
          display: block;
        }
        :host .mj-button-wrapper{
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
        }
        :host .mj-button {
          display: flex;
          box-sizing: border-box;
        }
        :host .mj-button-container {
          display: flex;
          width: var(--width);
          min-height: var(--height);
          padding: var(--inner-padding-top) var(--inner-padding-right) var(--inner-padding-bottom) var(--inner-padding-left);
          font-size: var(--font-size);
          font-style: var(--font-style);
          font-weight: var(--font-weight);
          line-height: var(--line-height);
          text-decoration: var(--text-decoration);
          text-transform: var(--text-transform);
          border-radius: var(--border-radius);
          color: var(--color);
          background-color: var(--background-color);
          box-sizing: border-box;
          word-break: break-word;
          cursor: pointer;
        }
        :host slot[name="mo-system"] .main {
          position: absolute;
          top: 0;
        }
      `,
    ];
  }

  get dynamicStyles() {
    const { alignConfig } = this.constructor.options;
    return html`
      ${super.dynamicStyles}
      :host .mj-button {
        justify-content: ${alignConfig[this.align]};
      }
      :host .mj-button-container {
        justify-content: ${alignConfig[this['text-align']]};
        align-items: ${alignConfig[this['vertical-align']]};
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
      :host .mj-button-text {
        text-align: ${this['text-align']};
      }
      :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) .mj-button-container {
          cursor: inherit;
      }
      :host(.${unsafeCSS(ModeTrackable.NoteModeClassName)}) .mj-button-container {
        pointer-events: none;
      }
    `;
  }

  render() {
    this.setInnerPadding();
    return html`
      <style>
      ${this.dynamicStyles}
      </style>
      <div class='mj-button-wrapper'>
        <div class='mj-button'>
          <div class='mj-button-container' @click='${() => this.openLink()}'>
            <div class='mj-button-text'><slot></slot></div>
          </div>
        </div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { MJMLButton };
