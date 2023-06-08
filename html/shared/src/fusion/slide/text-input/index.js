import { css, html, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  ModeTrackable,
  SlideComponentBase,
} from '../../mixins';
import { getValueObject } from '../../utils';
import {
  Container,
  Dimensions,
  FieldDefinition,
  Typography,
  Display,
} from '../../mixins/props';

class FusionTextInput extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  Typography,
  ModeTrackable,
  FieldDefinition,
  Display,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-text-input',
      componentUIName: 'Text Input',
      componentCategory: 'data',
      componentDescription: 'Configurable input field to be used in forms',
      nestedComponents: [],
    };
  }

  static get properties() {
    const {
      top,
      left,
      width,
      height,
      color,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      'line-height': lineHeight,
      'letter-spacing': letterSpacing,
      'min-width': minWidth,
      'max-width': maxWidth,
      ...rest
    } = super.properties;
    return {
      top,
      left,
      width: {
        ...width,
        value: '250px',
      },
      height: {
        ...height,
        value: '68px',
      },
      'error-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'error',
        value: 'rgba(255, 0, 0, 1)',
      },
      'error-font-size': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'error',
        value: '10px',
        availableUnits: [{ unitType: 'px' }],
      },
      type: {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'input',
        value: 'text',
        prop: true,
        selectOptions: [
          'text',
          'password',
          'number',
          'email',
        ],
      },
      value: {
        type: String,
        fieldType: 'String',
        propertyGroup: 'input',
        value: 'Text',
        prop: true,
      },
      label: {
        type: String,
        fieldType: 'String',
        propertyGroup: 'input',
        value: 'Text',
        prop: true,
      },
      'label-font-size': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'input',
        value: '16px',
        availableUnits: [{ unitType: 'px' }],
      },
      placeholder: {
        type: String,
        fieldType: 'String',
        propertyGroup: 'input',
        value: 'Text',
        prop: true,
      },
      'is-required': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'input',
        value: false,
        prop: true,
      },
      'min-width': {
        ...minWidth,
        value: '250px',
      },
      'max-width': {
        ...maxWidth,
        value: 'auto',
      },
      ...rest,
    };
  }

  setLabel(label) {
    this.hasLabel = !!label.length;
  }

  setRequired(el) {
    if (this['is-required']) {
      el.setAttribute('is-required', '');
    } else {
      el.removeAttribute('is-required');
    }
  }

  static sizePropChanged(changedProps) {
    const props = [
      'label',
      'font-size',
      'label-font-size',
      'error-font-size',
    ];
    return props.some((prop) => changedProps.get(prop) !== undefined);
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.constructor.sizePropChanged(changedProps)) {
      this.setLabel(this.label);
      this.updateHeightByInnerEl();
    }
    if (changedProps.get('is-required') !== undefined) {
      this.setRequired(this.inputForm);
      this.checkRequired();
    }
    if (changedProps.get('value') !== undefined) {
      this.inputForm.value = this.value;
      this.checkRequired();
    }
  }

  updateHeightByInnerEl() {
    const { num, unit } = getValueObject(this.height);
    const maxValue = Math.max(num, this.getCurrentHeight());
    this.setElementProp('height', `${maxValue}${unit}`);
  }

  getMinSizeValue(prop) {
    return prop === 'width' ? this.constructor.properties[prop].min : this.getCurrentHeight();
  }

  getCurrentHeight() {
    return this.labelEl.clientHeight + this.inputEl.clientHeight + this.errorMessageEl.clientHeight;
  }

  updateValue() {
    this.value = this.inputForm.value.replace(/(^\s*)|(\s*$)/, '').replace(/[ ]{2,}/gi, ' ');
    this.inputForm.value = this.value;
  }

  checkRequired() {
    if (!this.inputForm.checkValidity()) {
      this.setAttribute('invalid', '');
    } else {
      this.removeAttribute('invalid');
    }
  }

  checkFocus() {
    if (!this.hasAttribute('focused')) {
      this.setAttribute('focused', '');
    } else {
      this.removeAttribute('focused');
    }
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    if (!this.labelEl) {
      this.labelEl = this.shadowRoot.querySelector('[part=\'label\']');
      this.inputEl = this.shadowRoot.querySelector('[part=\'input-field\']');
      this.errorMessageEl = this.shadowRoot.querySelector('[part=\'error-message\']');
      this.inputForm = this.shadowRoot.querySelector('[part=\'value\']');
    }
    this.setExistValue();
    this.addListeners();
  }

  setExistValue() {
    this.inputForm.value = this.value;
  }

  setListenerType(eventType) {
    this.events.forEach((item) => {
      item.target[eventType](item.event, item.handler);
    });
  }

  addListeners() {
    this.events = [
      {
        target: this.inputForm,
        event: 'keyup',
        handler: this.updateValue.bind(this),
      },
      {
        target: this.inputForm,
        event: 'focus',
        handler: this.checkFocus.bind(this),
      },
      {
        target: this.inputForm,
        event: 'blur',
        handler: this.checkFocus.bind(this),
      },
    ];
    this.setListenerType('addEventListener');
  }

  constructor() {
    super();
    this.minWidth = 250;
    this.errorMessage = 'Please enter a value';
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.setListenerType('removeEventListener');
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          user-select: none;
          display: flex;
          align-items: center;
        }
        :host [part='fusion-text-field-container'] {
          display: flex;
          flex-direction: column;
          flex: auto;
        }
        :host([label]:not([label=''])) [part='label'] {
          padding-bottom: 6px;
          margin-left: 1px;
          width: 100%;
          align-self: flex-start;
          font-size: var(--label-font-size);
          color: #5c6675;
          overflow: hidden;
          white-space: nowrap;
          box-sizing: border-box;
        }
        :host([label]:not([label=''])) [part='label'] .label-text {
          text-overflow: ellipsis;
          max-width: calc(var(--width) - var(--label-font-size) + 6px);
          overflow: hidden;
          display: inline;
        }
        :host [part='input-field'] {
          position: relative;
          padding: 0 6px;
          background-color: #e8ebf0;
          border-radius: 4px;
          box-sizing: border-box;
          cursor: text;
        }
        :host [part='value'] {
          padding: 0 4px;
          width: 100%;
          min-height: 36px;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          outline: none;
          border: 0;
          font: inherit;
          font-size: var(--font-size);
          background-color: transparent;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) [part='fusion-text-field-container'] {
          pointer-events: none;
        }
        :host .required {
          display: none;
          color: red;
        }
        :host([label][focused]) [part='label'] {
          color: #1676f3;
        }
        :host([label]:not([label=''])[is-required]) .required {
          display: inline;
        }
        :host([invalid][is-required]) [part='input-field'] {
          background-color: #feeeed
        }
        :host([invalid]) [part='error-message'] {
          opacity: 1;
        }
        :host [part='error-message'] {
          font-size: var(--error-font-size);
          color: var(--error-color);
          will-change: opacity;
          transition: 400ms opacity;
          opacity: 0;
        }
      `,
    ];
  }

  getLabelTemplate() {
    return html`
      <label part='label'>
        <span class="label-text">${this.label}</span>
        <span class='required'> *</span>
       </label>
    `;
  }

  getInputTemplate() {
    return html`
     <div part='input-field'>
        <input part='value' type='${this.type}' placeholder='${this.placeholder}'>
     </div>
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div part='fusion-text-field-container'>
        ${this.getLabelTemplate.call(this)}
        ${this.getInputTemplate.call(this)}
        <div part='error-message'>${this.errorMessage}</div>
      </div>
      <slot></slot>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionTextInput };
