import { html, css, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  ModeTrackable,
  Stateful,
  SlideComponentBase,
} from '../../mixins';
import { getValueObject } from '../../utils';
import {
  Dimensions,
  Container,
  Display,
  FieldDefinition,
} from '../../mixins/props';

const state = 'InfoTab';

class FusionInfoTab extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  Stateful,
  Display,
  ModeTrackable,
  FieldDefinition,
]) {
  static get properties() {
    const {
      top,
      left,
      width,
      height,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      overflow,
      'min-width': minWidth,
      'min-height': minHeight,
      ...rest
    } = super.properties;
    return {
      top,
      left,
      width: {
        ...width,
        value: '400px',
        availableUnits: [{ unitType: 'px' }],
      },
      height: {
        ...height,
        value: '400px',
        availableUnits: [{ unitType: 'px' }],
      },
      ...rest,
      'tab-width': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'infotab',
        value: '40px',
        min: 20,
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'tab-height': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'infotab',
        value: '60px',
        min: 40,
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'tab-placement': {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'infotab',
        value: 'Middle',
        prop: true,
        selectOptions: [
          'Top',
          'Middle',
          'Bottom',
        ],
      },
      'tab-position': {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'infotab',
        value: 'Right',
        prop: true,
        selectOptions: [
          'Left',
          'Right',
        ],
      },
      'transition-duration': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'infotab',
        value: '800ms',
        availableUnits: [{ unitType: 'ms' }],
      },
      'background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'infotab',
        value: 'rgba(20, 38, 46, 1)',
      },
      'min-width': {
        ...minWidth,
        value: '400px',
      },
      'min-height': {
        ...minHeight,
        value: '70px',
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-infotab',
      componentUIName: 'Infotab',
      componentType: 'dynamic',
      componentCategory: 'overlay',
      componentDescription: 'Sliding container intended for placement at any edge of the content',
      baseLevel: 100,
      isTextEdit: true,
    };
  }

  enter() {
    this.addLevel();
    this.emitCustomEvent('open');
  }

  exit() {
    const transitionDuration = getValueObject(this['transition-duration']).num;
    this.removeLevel(transitionDuration);
    this.emitCustomEvent('close');
  }

  static get state() {
    return state;
  }

  constructor() {
    super();
    this.state = state;
    this.toggleBinded = this.toggle.bind(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.setListenerType('removeEventListener');
  }

  toggle() {
    this.active ? this.inactivate() : this.activate();
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.container = this.shadowRoot.querySelector('.info-tab');
    this.content = this.shadowRoot.querySelector('.info-tab-content');
    this.tab = this.shadowRoot.querySelector('[name=\'tab\']');
    this.setListenerType('addEventListener');
  }

  setListenerType(eventType) {
    this.tab[eventType]('click', this.toggleBinded);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host .info-tab {
          position: absolute;
          width: var(--width);
          height: var(--height);
        }
        :host(:not(.${unsafeCSS(ModeTrackable.EditModeClassName)})) {
          pointer-events: none;
        }
        :host [name='tab'] {
          position: absolute;
          width: var(--tab-width);
          height: var(--tab-height);
          border: 1px solid transparent;
          background-color: var(--background-color);
          user-select: none;
          cursor: pointer;
          box-sizing: border-box;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          pointer-events: all;
        }
        :host [name='tab']:before,
        :host [name='tab']:after {
          content: '';
          position: absolute;
          width: 3px;
          height: 3px;
          border: 6px solid var(--background-color);
        }
        :host [name='tab']:before {
          top: -4px;
        }
        :host [name='tab']:after {
          bottom: -4px;
        }
        :host [name='tab']:focus {
          outline: 0;
        }
        :host .info-tab-content {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: var(--background-color);
          box-sizing: border-box;
          pointer-events: all;
        }
        :host([tab-placement='Top']) [name='tab'] {
          top: 5px;
        }
        :host([tab-placement='Bottom']) [name='tab'] {
          bottom: 5px;
        }
      `,
    ];
  }

  getTabHandlerPositionStyle() {
    switch (this['tab-placement']) {
      case 'Top': return html`:host [name='tab'] { top: 5px; }`;
      case 'Bottom': return html`:host [name='tab'] { bottom: 5px; }`;
      default: return html`:host [name='tab'] { top: 50%; transform: translateY(-50%); }`;
    }
  }

  getTabHandlerCornersStyle() {
    switch (this['tab-position']) {
      case 'Left': return html`:host [name='tab']:before { border-width: 0 2px 2px 0 !important;} :host [name='tab']:after { border-width: 2px 2px 0 0 !important; }`;
      default: return html`:host [name='tab']:before { border-width: 0 0 2px 2px !important; } :host [name='tab']:after { border-width: 2px 0 0 2px !important; }`;
    }
  }

  get dynamicStyles() {
    const position = this['tab-position'].toLowerCase();
    const reversPosition = position === 'right' ? 'left' : 'right';
    return html`
      ${super.dynamicStyles}
        :host .info-tab {
          ${reversPosition}: calc(var(--width) * -1);
          transition: ${reversPosition} var(--transition-duration), transform var(--transition-duration);
        }
        :host [name='tab'] {
          ${position}: calc(calc(var(--tab-width) - 1px) * -1);
          border-bottom-${position}-radius: 18px;
          border-top-${position}-radius: 18px;
        }
        :host [name='tab']:before,
        :host [name='tab']:after {
          ${reversPosition}: -3px;
        }
        :host [name='tab']:before {
          border-bottom-${reversPosition}-radius: 100%;
        }
        :host [name='tab']:after {
          border-top-${reversPosition}-radius: 100%;
        }
        :host .info-tab-content {
          ${reversPosition}: 0;
        }
        :host([active]) .info-tab {
          ${reversPosition}: 0;
        }
        ${this.getTabHandlerPositionStyle()}
        ${this.getTabHandlerCornersStyle()}
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='info-tab'>
        <button name='tab'></button>
        <div class='info-tab-content'><slot></slot></div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionInfoTab };
