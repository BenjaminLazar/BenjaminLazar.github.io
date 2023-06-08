import { css, html } from 'lit-element';
import { FusionButton } from '../../button';
import { getPartial } from '../../../utils';
import { BorderUpdateHandler } from '../../../services/border-update-handler';

class FusionTabGroupButton extends FusionButton {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-tab-group-button',
      componentUIName: 'Tab Group Button',
      componentDescription: 'Component for tab group button',
      isRootNested: false,
      defaultTemplate: '<p>Click me</p>',
      resizable: false,
      draggable: false,
    };
  }

  static get properties() {
    const properties = [
      'top',
      'left',
      'opacity',
      'enable-styling-effects',
      'background-color',
      'border-radius',
      'border-width',
      'border-color',
      'border-style',
    ];
    const {
      'border-radius': borderRadius,
      'border-width': borderWidth,
      'border-color': borderColor,
      'border-style': borderStyle,
      'background-color': backgroundColor,
      'enable-styling-effects': enableStylingEffects,
    } = getPartial(FusionButton.properties, properties);
    const {
      top,
      left,
      opacity,
      fieldName,
      hidden,
      required,
      'content-module-id': contentModuleId,
      'content-module-asset-id': contentModuleAssetId,
      'should-shown': shouldShown,
      'data-flag-on': dataFlagOn,
      'border-top-width': borderTopWidth,
      'border-right-width': borderRightWidth,
      'border-bottom-width': borderBottomWidth,
      'border-left-width': borderLeftWidth,
      'border-top-color': borderTopColor,
      'border-right-color': borderRightColor,
      'border-bottom-color': borderBottomColor,
      'border-left-color': borderLeftColor,
      'border-top-style': borderTopStyle,
      'border-right-style': borderRightStyle,
      'border-bottom-style': borderBottomStyle,
      'border-left-style': borderLeftStyle,
    } = super.properties;
    return {
      fieldName,
      hidden,
      required,
      'content-module-id': contentModuleId,
      'content-module-asset-id': contentModuleAssetId,
      'should-shown': {
        ...shouldShown,
        value: true,
      },
      'data-flag-on': dataFlagOn,
      top: {
        ...top,
        value: '0px',
        availableUnits: [],
      },
      left: {
        ...left,
        value: '0px',
        availableUnits: [],
      },
      'tab-width': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'tab',
        value: '150px',
        availableUnits: [{ unitType: 'px' }],
      },
      'tab-background-color': {
        ...backgroundColor,
        propertyGroup: 'tab',
        value: 'rgba(255, 255, 255, 1)',
      },
      'active-background-color': {
        ...backgroundColor,
        propertyGroup: 'activeState',
      },
      'border-width': {
        ...borderWidth,
        value: '1px',
      },
      'border-top-width': borderTopWidth,
      'border-right-width': borderRightWidth,
      'border-bottom-width': borderBottomWidth,
      'border-left-width': borderLeftWidth,
      'border-color': {
        ...borderColor,
        value: 'rgba(0, 0, 0, 1)',
      },
      'border-top-color': borderTopColor,
      'border-right-color': borderRightColor,
      'border-bottom-color': borderBottomColor,
      'border-left-color': borderLeftColor,
      'border-style': {
        ...borderStyle,
        value: 'solid',
      },
      'border-top-style': borderTopStyle,
      'border-right-style': borderRightStyle,
      'border-bottom-style': borderBottomStyle,
      'border-left-style': borderLeftStyle,
      'border-radius': borderRadius,
      'enable-styling-effects': {
        ...enableStylingEffects,
        value: false,
      },
      opacity,
    };
  }

  constructor() {
    super();
    this.clickHandlerBound = this.clickHandler.bind(this);
    this.colorProps = [];
  }

  clickHandler() {
    this.emitCustomEvent('tab-select');
  }

  async updated(changedProps) {
    super.updated(changedProps);
    BorderUpdateHandler.mainBorderStylesApplier(changedProps, this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.emitCustomEvent(`${this.constructor.options.componentName}:added`);
    this.addEventListener('click', this.clickHandlerBound);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.emitCustomEvent(`${this.constructor.options.componentName}:removed`);
    this.removeEventListener('click', this.clickHandlerBound);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host,
        :host * {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
           user-select: none;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
        }
        :host {
          position: relative;
          width: var(--tab-width);
          height: auto;
          display: block;
        }
        button {
          width: var(--tab-width);
          height: var(--tab-height);
          background-color: var(--tab-background-color);
          border-color: var(--tab-border-color);
          border-width: var(--tab-border-width);
          border-radius: var(--tab-border-radius);
          border-style: var(--tab-border-style);
        }
        :host(.active) button {
          background-color: var(--active-background-color);
        }
        ::slotted(p) {
          padding-left: var(--tab-padding-left) !important;
          font-size: var(--tab-font-size);
          font-family: var(--tab-font-family);
          font-weight: var(--tab-font-weight);
          font-style: var(--tab-font-style);
          text-align: left;
          white-space: normal;
          color: var(--tab-color);
        }
        :host(.active) ::slotted(p) {
          color: var(--active-color);
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <button><slot></slot></button>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionTabGroupButton };
