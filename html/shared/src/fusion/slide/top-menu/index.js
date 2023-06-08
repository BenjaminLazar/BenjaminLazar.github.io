import { css, html, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import { FusionButton } from '../button';
import { FusionApi } from '../../api';
import {
  getValueObject,
  intersectMap,
} from '../../utils';
import {
  applyMixins,
  Stateful,
  EnvDependComponent,
  SlideComponentBase,
  ModeTrackable,
} from '../../mixins';
import {
  Container,
  Dimensions,
  Background,
  FieldDefinition,
} from '../../mixins/props';

const defaultTemplate = '<p>Menu item</p>';

class FusionTopMenuButton extends FusionButton {
  static get properties() {
    const { top, left, ...others } = super.properties;
    return {
      ...others,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-top-menu-button',
      defaultTemplate,
      isRootNested: false,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.init();
  }

  init() {
    this.initListeners();
    this.emitCustomEvent(`${this.constructor.options.componentName}:added`);
  }

  static goToSlide(event) {
    const targetSlide = event.currentTarget.dataset.slide;
    FusionApi.goTo(targetSlide);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.constructor.goToSlide.bind(this));
  }

  initListeners() {
    this.addEventListener('click', this.constructor.goToSlide.bind(this));
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          left: var(--left);
        }
      `,
    ];
  }
}

class FusionTopMenu extends applyMixins(FusionBase, [
  SlideComponentBase,
  Stateful,
  EnvDependComponent,
  Container,
  Dimensions,
  Background,
  FieldDefinition,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-top-menu',
      componentUIName: 'Top Menu',
      componentCategory: 'menu',
      componentDescription: 'Top menu component to enable navigation in binder',
      nestedComponents: ['fusion-top-menu-button'],
      baseLevel: 100,
    };
  }

  static get properties() {
    const {
      position,
      top,
      left,
      width,
      height,
      'background-color': backgroundColor,
      ...rest
    } = super.properties;
    return {
      top: {
        ...top,
        value: '0px',
      },
      left: {
        ...left,
        value: '0px',
      },
      width: {
        ...width,
        value: '1024px',
      },
      height: {
        ...height,
        value: '30px',
      },
      'background-color': {
        ...backgroundColor,
        value: 'rgba(235, 235, 235, 1)',
      },
      ...rest,
    };
  }

  toogleMenu() {
    if (this.active) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.pushState(this.state);
    this.addLevel();
  }

  closeMenu() {
    this.removeState(this.state);
    this.removeLevel();
  }

  constructor() {
    super();
    this.state = 'Menu';
    this.defaultButtonPosition = { top: 0, left: 0 };
    this.activeColor = 'rgba(164,163,163,1)';
    this.btnAddEvent = `${FusionTopMenuButton.options.componentName}:added`;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(this.btnAddEvent, this.buttonAddHandler.bind(this));
  }

  updateWidth() {
    const { unit } = getValueObject(this.width);
    const { offsetWidth } = this.parentNode;
    if (offsetWidth) {
      this.width = `${offsetWidth}${unit}`;
    }
  }

  environmentDataReceived(e) {
    const { slide, binder } = e.detail;
    // @todo check if closeMenu needed and remove
    this.closeMenu();
    this.updateWidth();
    this.addEventListener(this.btnAddEvent, this.buttonAddHandler.bind(this));
    const menuItems = !binder ? [slide] : binder.slides;
    this.generateMenuItems(this.constructor.setActiveItem(menuItems, slide));
  }

  static setActiveItem(slides, currentSlide) {
    return slides.map((slide) => {
      slide.active = slide.name === currentSlide.name;
      return slide;
    });
  }

  async generateMenuButton({ name, active }, index) {
    const defaultProperties = FusionTopMenuButton.properties;
    const buttonWidth = 200;
    const buttonHeight = 30;
    const unit = 'px';
    const backgroundColor = active ? { 'background-color': { value: this.activeColor } } : { };
    const buttonTemplate = `<p>${name}</p>`;
    const item = await FusionApi.createElement(
      FusionTopMenuButton.options.componentName,
      {
        ...defaultProperties,
        width: {
          value: `${buttonWidth}${unit}`,
        },
        height: {
          value: `${buttonHeight}${unit}`,
        },
        'data-slide': {
          value: name,
        },
        'data-active': {
          value: active,
        },
        ...backgroundColor,
      },
      buttonTemplate,
      this,
      `#${this.id}`,
      { setActive: false, setState: false },
    );
    item.style.setProperty('--left', `${index * buttonWidth}px`);
  }

  removeButtons() {
    while (this.lastChild) {
      this.removeChild(this.lastChild);
    }
  }

  generateButtons(slides) {
    slides.forEach((slide, index) => {
      this.generateMenuButton(slide, index);
    });
  }

  getMenuButtons() {
    const tagName = FusionTopMenuButton.options.componentName;
    return this.getElementsByTagName(tagName);
  }

  static isEmpty(menuButtons) {
    return menuButtons.length === 0;
  }

  static isDiff(slides, buttons) {
    return slides.length > buttons.length;
  }

  static needRegenerate(slides, buttons) {
    return this.isEmpty(buttons) || this.isDiff(slides, buttons);
  }

  generateMenuItems(slides) {
    const buttons = this.getMenuButtons();
    if (slides && this.constructor.needRegenerate(slides, buttons)) {
      this.generateButtons(slides);
    }
  }

  checkSizes(changedProps) {
    const sizeProps = intersectMap(changedProps, this.constructor.sizeTriggers);
    if (sizeProps.size) {
      this.updateButtonsHeight();
    }
  }

  updateButtonsHeight() {
    const buttons = Array.from(this.getMenuButtons());
    if (buttons && buttons.length) {
      const { unit } = getValueObject(this.height);
      const handledValue = (unit === '%') ? '100%' : this.height;
      this.constructor.changeButtonsHeight(buttons, handledValue);
    }
  }

  initButtonPosition(prevBtn, curBtn) {
    const position = this.getButtonPosition(prevBtn);
    Object.keys(position).forEach((key) => {
      this.constructor.setStyle(curBtn, key, `${position[key]}px`);
    });
    curBtn.height = this.height;
  }

  static setStyle(target, key, value) {
    target.style.setProperty(`--${key}`, value);
  }

  static getLastButton(buttons) {
    return (buttons && buttons.length > 1) ? buttons[buttons.length - 2] : null;
  }

  getButtonPosition(prevBtn) {
    if (prevBtn) {
      const { offsetLeft, offsetWidth, offsetTop } = prevBtn;
      return {
        left: offsetLeft + offsetWidth,
        top: offsetTop,
      };
    }
    return this.defaultButtonPosition;
  }

  buttonAddHandler(e) {
    const curBtn = e.target;
    const allBtns = this.getMenuButtons();
    const prevBtn = this.constructor.getLastButton(allBtns);
    this.initButtonPosition(prevBtn, curBtn);
  }

  static changeButtonsHeight(buttons, value) {
    buttons.forEach((button) => {
      button.height = value;
    });
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: absolute;
          display: block;
          transform: translate3d(0, 0, 0);
          transition: transform 0.3s 0s;
          background: var(--background-color);
        }
        :host * {
          margin: 0;
          padding: 0;
        }
        :host(:not([active])){
          transform: translate3d(0, calc(var(--height) * -1), 0) !important;
        }
        [part="handler"] {
          width: 50px;
          height: 15px;
          background: var(--background-color);
          position: absolute;
          top: 100%;
          left: 50%;
          border: 0;
          outline: none;
          border-bottom-left-radius: 50%;
          border-bottom-right-radius: 50%;
          transform:translate3d(-50%, 0 ,0)
        }
        [part="nav"] {
          position: relative;
          height: 100%;
          width: var(--width);
          overflow-x: auto;
          overflow-y: hidden;
        }
        :host(:not(.${unsafeCSS(ModeTrackable.EditModeClassName)}):not([active])) {
            pointer-events: all;
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
      <div part="nav">
        <slot></slot>
      </div>
      <button part="handler" @click="${() => this.toogleMenu()}"></button>
       ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionTopMenuButton, FusionTopMenu };
