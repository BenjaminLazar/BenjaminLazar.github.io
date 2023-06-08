import { css, html, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import { FusionApi } from '../../api';
/* activatorOnly:start */
import { generalIconsStyles, getIconsStyles } from '../../styles/icons';
/* activatorOnly:end */

import {
  applyMixins,
  ModeTrackable,
  EmailComponent,
  EmailComponentBaseClasses,
} from '../../mixins';

import { FieldDefinition } from '../../mixins/props';

class MJMLHtml extends applyMixins(FusionBase, [
  ModeTrackable,
  EmailComponent,
  EmailComponentBaseClasses,
  FieldDefinition,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'mj-raw',
      componentCategory: 'custom',
      componentUIName: 'HTML',
      componentDescription: 'Custom HTML element',
      nestedComponents: [],
      defaultTemplate: '<div class="code-container"></div>',
    };
  }

  static get properties() {
    return {
      ...super.properties,
    };
  }

  constructor() {
    super();
    this.keyCodes = {
      esc: 'Escape',
    };
  }

  updateValue() {
    this.querySelector('.code-container').innerHTML = this.inputFieldEl.value;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
  }

  swapVisibility() {
    if (FusionApi.isEditMode) {
      this.checkHidden(this.inputFieldEl, true);
      this.checkHidden(this.componentViewEl);
    }
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.inputFieldEl = this.shadowRoot.querySelector('.input-field');
    this.componentViewEl = this.shadowRoot.querySelector('.component-view');
    this.inputFieldEl.value = this.querySelector('.code-container') ? this.querySelector('.code-container')?.innerHTML : '';
  }

  inputKeydownHandler(event) {
    if (event.key === this.keyCodes.esc) {
      this.inputFieldEl.value = this.oldValue;
      this.inputFieldEl.blur();
    }
  }

  setInputFocus() {
    this.inputFieldEl.focus();
  }

  checkHidden(el, autofocus) {
    if (el.classList.contains('hidden')) {
      el.classList.remove('hidden');
      if (autofocus) {
        el.focus();
        this.oldValue = this.inputFieldEl.value;
      }
    } else {
      el.classList.add('hidden');
      if (autofocus) {
        el.blur();
      }
    }
  }

  static get styles() {
    return [
      super.styles,
      /* activatorOnly:start */
      generalIconsStyles,
      getIconsStyles('iframe'),
      /* activatorOnly:end */
      css`
        :host {
          display: block;
          width: 100%
        }

        :host .input-field {
          width: 100%;
          height: 96px;
          border-radius: 4px;
          box-sizing: border-box;
          border: 0;
          padding: 0;
          outline: none;
          font-family: "DM Sans", Arial !important;
          resize: none;
          display: block;
          pointer-events: auto;
          font-size: 11px;
          line-height: 16px;
          font-weight: 400;
          padding: 4px;
          box-sizing: border-box;
        }

        :host .input-field.designer {
          background-color: #000000;
          color: #FFFFFF;
        }

        :host .component-view {
          font-family: "DM Sans", Arial !important;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #E8E7E5;
          padding: 12px;
          box-sizing: border-box;
        }

        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) .click-text {
          cursor: pointer;
        }

        :host .component-view p {
          font-size: 11px;
          line-height: 16px;
          font-weight: 400;
          color: #1C1C1D;
          margin: 0;
        }

        :host .component-view p.click-text {
          visibility: hidden;
        }

        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) .component-view p.click-text {
          visibility: visible;
        }

        :host .title-wrapper {
          display: flex;
          align-items: center;
        }

        :host .title-wrapper i {
          font-size: 16px;
          margin-right: 8px;
        }

        :host .input-field.hidden,
        :host .component-view.hidden {
          display: none;
        }
      `,
    ];
  }

  render() {
    return html`
      <textarea
        spellcheck="false"
        class="input-field designer hidden"
        @blur='${() => this.swapVisibility()}'
        @change='${() => this.updateValue()}'
        @click='${() => this.setInputFocus()}'
        @keydown='${(event) => this.inputKeydownHandler(event)}'
      ></textarea>
      <div class="component-view">
        <div class="title-wrapper">
          <i class="icon-iframe-outlined"></i>
          <p>Custom HTML</p>
        </div>
        <p class="click-text" @click='${() => this.swapVisibility()}'>Click to edit</p>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { MJMLHtml };
