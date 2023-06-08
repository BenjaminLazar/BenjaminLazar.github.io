import { css, html, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  EmailComponent,
  ContentModule,
  EmailComponentBaseClasses,
  FontEmail,
  SafeFontFamilyCombination,
  ModeTrackable,
} from '../../mixins';
import { FieldDefinition } from '../../mixins/props';
import { FusionApi } from '../../api';

class MJMLText extends applyMixins(FusionBase, [
  EmailComponent,
  ContentModule,
  EmailComponentBaseClasses,
  FontEmail,
  SafeFontFamilyCombination,
  ModeTrackable,
  FieldDefinition,
]) {
  static get properties() {
    const {
      'should-shown': shouldShown,
      ...rest
    } = super.properties;
    return {
      color: {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'text',
        value: 'rgba(0, 0, 0, 1)',
      },
      ...rest,
      'should-shown': {
        ...shouldShown,
        value: true,
      },
      'line-height': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'text',
        value: '22px',
        availableUnits: [{ unitType: 'px' }],
      },
      'letter-spacing': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'text',
        value: '0px',
        availableUnits: [{ unitType: 'px' }],
      },
      'text-decoration': {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'text',
        value: 'none',
        selectOptions: [
          { value: 'none', icon: 'x-small' },
          { value: 'underline', icon: 'underline' },
          { value: 'line-through', icon: 'strikethrough' },
          { value: 'overline', icon: 'overline' },
        ],
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
      align: {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'text',
        value: 'left',
        selectOptions: [
          { value: 'left', icon: 'textalign' },
          { value: 'center', icon: 'textalignmid' },
          { value: 'right', icon: 'textalignright' },
          { value: 'justify', icon: 'burger' },
        ],
      },
      'container-background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'background',
        value: 'rgba(255, 255, 255, 0)',
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
        value: '10px',
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
        value: '10px',
        availableUnits: [{ unitType: 'px' }],
      },
      direction: {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'text',
        value: '',
        selectOptions: [
          { value: 'ltr', icon: 'textdirectionltr' },
          { value: 'rtl', icon: 'textdirectionrtl' },
        ],
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'mj-text',
      componentContentType: 'text',
      componentUIName: 'Text for email',
      componentDescription: 'Email text element',
      isTextEdit: true,
      nestedComponents: [],
      defaultTemplate: '<p>Enter your text here</p>',
    };
  }

  static getTextDirection(direction) {
    return direction === 'rtl' ? 'right' : 'left';
  }

  updateTextDirection(changedProperties) {
    if (this.isRendered && changedProperties.has('direction')) {
      const previousClasses = this['css-class'];
      const direction = MJMLText.getTextDirection(this.direction);
      const previousDirection = MJMLText.getTextDirection(changedProperties.get('direction'));
      const value = `act-text-direction-${direction}`;
      const previousValue = `act-text-direction-${previousDirection}`;
      const attrValue = [...previousClasses.split(' ').filter((name) => name !== previousValue), value].join(' ');
      FusionApi.updateAttributeList({
        attrList: [
          { attrKey: 'css-class', attrValue },
          { attrKey: 'align', attrValue: direction },
        ],
        isComponent: true,
        selectorId: this.id,
      });
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this.updateTextDirection(changedProperties);
  }

  static get styles() {
    return [
      super.styles,
      css`
         :host {
          display: block;
          width: 100%;
          min-height: 1em;
          color: var(--color);
          letter-spacing: var(--letter-spacing);
          word-break: break-word;
          line-height: var(--line-height);
          text-decoration: var(--text-decoration);
          text-transform: var(--text-transform);
          text-align: var(--align);
          font-size: var(--font-size);
          background-color: var(--container-background-color);
          direction: var(--direction);
        }
        :host .mj-text-wrapper {
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
        }
        ::slotted(*) {
          text-transform: var(--text-transform);
          text-decoration: var(--text-decoration);
          line-height: var(--line-height);
        }
        :host(.${unsafeCSS(ModeTrackable.NoteModeClassName)}) ::slotted(p) {
          pointer-events: none;
        }
      `,
    ];
  }

  setContentModule(content) {
    // Append the new content into the component
    this.innerHTML = content;
  }

  render() {
    return html`
      <style>
        ${super.dynamicStyles}
      </style>
      <div class='mj-text-wrapper'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { MJMLText };
