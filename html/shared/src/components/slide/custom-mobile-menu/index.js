import { html, css } from 'lit-element';
import { FusionApi } from '../../../fusion/api';
import { FusionBase } from '../../../fusion/base';
import {
  applyMixins,
  SlideComponentBase,
} from '../../../fusion/mixins';
import {
  Container,
  Display,
  Background,
  Dimensions,
} from '../../../fusion/mixins/props';
import { FusionImage } from '../../../fusion/slide/image';

class CustomMobileMenu extends applyMixins(FusionBase, [SlideComponentBase, Container, Display, Dimensions, Background]) {
  static get properties() {
    const {
      width,
      height,
      position,
      top,
      left,
      'background-color': backgroundColor,
    } = super.properties;
    return {
      position: {
        ...position,
        value: 'relative',
      },
      top: {
        ...top,
        value: '0',
      },
      left: {
        ...left,
        value: '0',
      },
      width: {
        ...width,
        value: '100%',
      },
      height: {
        ...height,
        value: '80px',
      },
      'background-color': {
        ...backgroundColor,
        value: '#FFFEF6',
      },
      'link-container-width': {
        type: Text,
        fieldType: 'Number',
        value: '300px',
      },
      'link-container-margin-right': {
        type: Text,
        fieldType: 'Number',
        value: '30px',
      },
      'open-menu-top': {
        type: String,
        fieldType: 'Number',
        value: '51px',
      },
      'open-menu-right': {
        type: String,
        fieldType: 'Number',
        value: '16px',
      },
      'open-menu-width': {
        type: String,
        fieldType: 'Number',
        value: '186px',
      },
      'open-menu-bg-color': {
        type: String,
        fieldType: 'ColorPicker',
        value: '#ffffff',
      },
      'burger-lines-color': {
        type: String,
        fieldType: 'ColorPicker',
        value: '#1C1C1D',
      },
      'burger-active-lines-color': {
        type: String,
        fieldType: 'ColorPicker',
        value: '#ffffff',
      },
      'burger-active-bg': {
        type: String,
        fieldType: 'ColorPicker',
        value: '#3D5547',
      },
      isOpened: {
        type: Boolean,
        fieldType: 'hidden',
      },
      isMenuItem: {
        type: Boolean,
        fieldType: 'hidden',
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.isOpened = false;
    this.isMenuItem = false;
    this.image = this.querySelector(FusionImage.options.componentName);
    this.addEventListener('toggle-burger', this.toggleBurger);
  }

  async firstUpdated() {
    if (!this.image) {
      this.image = await this.createImageComponent();
    }
  }

  updated() {
    const isMenuItem = !!this.querySelector('menu-link');
    this.isMenuItem = isMenuItem;
  }

  toggleBurger({ detail = {} }) {
    const { opened } = detail;
    this.isOpened = !opened;
  }

  clickHandler() {
    this.dispatchEvent(new CustomEvent('toggle-burger', { detail: { opened: this.isOpened } }));
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'custom-mobile-menu',
      componentUIName: 'Custom mobile menu',
      componentScope: 'custom',
      componentDescription: 'Custom mobile menu',
      componentDomain: 'slide',
      nestedComponents: ['menu-link'],
      isTextEdit: true,
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: var(--width);
          height: var(--height);
          margin:0;
          padding:0;
          background-color: var(--background-color);
        }
        :host .links-wrapper{
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: var(--height);
          width: var(--link-container-width);
          margin-right: var(--link-container-margin-right);
          z-index: 10;
        }
        :host .burger {
          display: none;
          position: absolute;
          right: var(--link-container-margin-right);
          flex-direction: column;
          justify-content: space-around;
          width: 24px;
          height: 24px;
          padding: 3px;
          border-radius: 4px;
          background-color: transparent;
        }
        :host .burger-line {
          width: 100%;
          height: 2px;
          background-color: var(--burger-lines-color);
        }
        @media only screen and (max-width:480px) {
          :host .burger[show='true'] {
            display: flex;
          }
          :host .links-wrapper {
            display: none;
          }
          :host .burger[opened='true'] {
            background-color: var(--burger-active-bg);
          }
          :host .burger[opened='true'] .burger-line {
            background-color: var(--burger-active-lines-color);
          }
          :host .links-wrapper[opened='true'] {
            position: absolute;
            top: var(--open-menu-top);
            right: var(--open-menu-right);
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            width: var(--open-menu-width);
            height: auto;
            margin: 0;
            background: var(--open-menu-bg-color);
            border-radius: 4px;
            border: 1px solid #F8F7F5;
            box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.1);
          }
          :host .links-wrapper ::slotted(menu-link:not(:last-of-type)) {
            border-bottom: 1px solid #E8E7E5!important;
          }
        }
       `,
    ];
  }

  createImageComponent() {
    const properties = {
      ...FusionImage.properties,
      position: { value: 'absolute' },
      top: { value: '0px' },
      left: { value: '0px' },
      width: { value: '100px' },
      height: { value: 'auto' },
      slot: { value: 'image' },
    };
    const { componentName, defaultTemplate } = FusionImage.options;
    return FusionApi.createElement(
      componentName,
      properties,
      defaultTemplate,
      this,
      `#${this.id}`,
      {},
    );
  }

  render() {
    super.render();
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div>
        <slot name="image"></slot>
      </div>
      <div class='links-wrapper' opened='${this.isOpened}'>
        <slot></slot>
      </div>
      <div class="burger" show='${this.isMenuItem}' opened='${this.isOpened}' @click='${this.clickHandler}'>
        <div class="burger-line"></div>
        <div class="burger-line"></div>
        <div class="burger-line"></div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { CustomMobileMenu };
