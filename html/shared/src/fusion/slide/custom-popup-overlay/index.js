// @note: need to solve the problem with unnecessary imports
import { html, css } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  SlideComponentBase,
  PopupElement,
} from '../../mixins';
import {
  createObjectItem, getValueObject, emitInitEvents,
} from '../../utils';
import { FusionButton } from '../button';
import {
  Container,
  Dimensions,
  Display,
  Border,
  Typography,
  Background,
  FieldDefinition,
} from '../../mixins/props';
import { BorderUpdateHandler } from '../../services/border-update-handler';

class FusionCloseButton extends FusionButton {
  static get properties() {
    const {
      top,
      left,
      width,
      height,
      'font-family': fontFamily,
      'font-weight': fontWeight,
      'font-style': fontStyle,
      'font-size': fontSize,
      ['background-color']: backgroundColor,
      ['style-type']: styleType,
      position,
      'should-shown': shouldShown,
      'content-module-id': contentModuleId,
      'content-module-asset-id': contentModuleAssetId,
      color,
      ...rest
    } = super.properties;
    return {
      top: {
        ...top,
        value: '0px',
      },
      left: {
        ...left,
        value: '770px',
      },
      width: {
        ...width,
        value: '30px',
      },
      height: {
        ...height,
        value: '30px',
      },
      'background-color': {
        ...backgroundColor,
        value: 'rgba(255, 255, 255, 0)',
      },
      color: {
        ...color,
        propertyGroup: 'closeButton',
      },
      'cross-width': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'closeButton',
        value: '2px',
        availableUnits: [{ unitType: 'px' }],
      },
      ...rest,
      'should-shown': {
        ...shouldShown,
        value: true,
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-close-button',
      componentUIName: 'Close button',
      componentDescription: 'Close button for popup interactions',
      isTextEdit: false,
      isRootNested: false,
      defaultTemplate: '',
    };
  }

  constructor() {
    super();
    emitInitEvents(this, { name: `${this.constructor.options.componentName}:added`, props: { detail: { isCreated: true } } });
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.emitCustomEvent.bind(this, 'button-click'));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.emitCustomEvent.bind(this, 'button-click'));
    this.emitCustomEvent(`${this.constructor.options.componentName}:removed`, { detail: { isCreated: false } });
  }

  getButtonMinPart() {
    return Math.min(this.getValue('height'), this.getValue('width'));
  }

  getValue(prop) {
    return getValueObject(this[prop]).num;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: absolute;
        }
        :host button {
          padding: 0;
        }
        :host button:before,
        :host button:after {
          content: '';
          position: absolute;
          min-width: 15px;
          height: var(--cross-width);
          min-height: 1px;
          top: 50%;
          left: 50%;
          background-color: var(--color);
        }
        :host button:before {
          transform: translate3d(-50%, -50%, 0) rotate(45deg);
        }
        :host button:after {
          transform: translate3d(-50%, -50%, 0) rotate(-45deg);
        }
      `,
    ];
  }

  get dynamicStyles() {
    const crossSize = this.getButtonMinPart();
    return html`
      ${super.dynamicStyles}
      :host button:before,
      :host button:after {
        width: ${crossSize / 2}px;
      }
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <button></button>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

class FusionCustomPopupOverlay extends applyMixins(FusionBase, [
  SlideComponentBase,
  Border,
  PopupElement,
  Container,
  Dimensions,
  Display,
  Typography,
  Background,
  FieldDefinition,
]) {
  static get properties() {
    const {
      position,
      top,
      left,
      width,
      height,
      opacity,
      overflow,
      'background-color': backgroundColor,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      'line-height': lineHeight,
      'letter-spacing': letterSpacing,
      ...rest
    } = super.properties;
    return {
      top: {
        ...top,
        value: '200px',
      },
      left: {
        ...left,
        value: '110px',
      },
      width: {
        ...width,
        value: '800px',
      },
      height,
      'background-color': {
        ...backgroundColor,
        value: 'rgb(230, 230, 230)',
      },
      opacity,
      ...rest,
    };
  }

  static get options() {
    const { excludedComponents = [] } = super.options;
    return {
      ...super.options,
      componentName: 'fusion-custom-popup-overlay',
      componentUIName: 'Custom Overlay',
      componentCategory: 'overlay',
      componentDescription: 'Basic overlay module',
      isRootNested: false,
      nestedComponents: ['*'],
      excludedComponents: [...excludedComponents, 'fusion-backdrop', 'fusion-custom-popup-overlay', 'fusion-popup-overlay'],
      rotatable: false,
    };
  }

  constructor() {
    super();
    this.button = createObjectItem(FusionCloseButton);
    emitInitEvents(this, { name: `${this.constructor.options.componentName}:added`, props: { detail: { isCreated: true } } });
    this.addEventListener(this.button.events.add, this.updateComponentRelations.bind(this, 'addEventListener'));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.emitCustomEvent(`${this.constructor.options.componentName}:removed`, { detail: { isCreated: false } });
  }

  getChildrenComponentsData() {
    return {
      [this.button.name]: {
        attribute: `${this.button.name}-removed`,
        component: this.button,
      },
    };
  }

  setOldClientSize({ width = this.clientWidth }) {
    this.oldClientSize = {
      width,
    };
  }

  pinInnerElementsToRightSide(elements) {
    [...elements].forEach((e) => {
      const offsetLeft = this.clientWidth - this.oldClientSize.width + e.offsetLeft;
      e.setAttribute('left', `${offsetLeft}px`);
    });
  }

  getComputedWidth(value) {
    const { num, unit } = getValueObject(value);
    return (unit === '%') ? (this.parentNode.clientWidth * num) / 100 : num;
  }

  checkSizes(changedProps) {
    super.checkSizes(changedProps);
    if (changedProps.has('width')) {
      if (!this.oldClientSize) {
        this.setOldClientSize({ width: this.getComputedWidth(changedProps.get('width')) });
      }
      this.pinInnerElementsToRightSide(this.closeButtons);
      this.setOldClientSize({});
    }
  }

  async firstUpdated(changedProperties) {
    this.closeButtons = this.getElementsByTagName(this.button.name);
    super.firstUpdated(changedProperties);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: absolute;
          box-sizing: border-box;
          font-family: var(--font-family);
          pointer-events: auto;
        }
        :host [part="overlay"] {
          width: 100%;
          height: 100%;
          min-height: 30px;
        }
       `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host [part="overlay"] {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div part="overlay"><slot></slot></div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionCloseButton, FusionCustomPopupOverlay };
