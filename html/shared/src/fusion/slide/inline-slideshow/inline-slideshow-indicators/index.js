import { html, css } from 'lit-element';
import {
  applyMixins,
  SlideComponentBase,
  SlideshowElement,
} from '../../../mixins';
import { FusionBase } from '../../../base';
import { FusionStore } from '../../../services/fusion-store';
import {
  Container,
  Dimensions,
  Border,
  FieldDefinition,
} from '../../../mixins/props';
import config from '../../../../config.json';
import { BorderUpdateHandler } from '../../../services/border-update-handler';
import { setLevelCallback } from '../../../utils';

class InlineSlideshowIndicators extends applyMixins(FusionBase, [
  SlideComponentBase,
  SlideshowElement,
  Container,
  Dimensions,
  Border,
  FieldDefinition,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-inline-slideshow-indicators',
      componentUIName: 'Indicators',
      componentType: 'dynamic',
      componentCategory: 'interaction',
      componentDescription: 'Inline slideshow indicators',
      isRootNested: false,
      nestedComponents: [],
    };
  }

  static get properties() {
    const {
      position,
      top,
      left,
      width,
      height,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      ...rest
    } = super.properties;
    return {
      position: {
        ...position,
        value: config.responsive ? 'relative' : 'absolute',
        selectOptions: [
          { value: 'absolute', icon: 'positionabsolute' },
          { value: 'relative', icon: 'positionrelative' },
          { value: 'fixed', icon: 'positionfixed' },
        ],
      },
      top,
      left,
      width,
      height: {
        ...height,
        value: '30px',
      },
      ...rest,
      size: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'slideshowIndicators',
        value: '11px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      color: {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'slideshowIndicators',
        value: 'rgba(151, 179, 217, 1)',
      },
      'active-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'activeState',
        value: 'rgba(0, 109, 178, 1)',
      },
      'active-border-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'activeState',
        value: 'rgba(0, 0, 0, 1)',
      },
      direction: {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'slideshowIndicators',
        value: 'horizontal',
        selectOptions: [
          { value: 'horizontal' },
          { value: 'vertical' },
        ],
      },
      'active-position': {
        type: String,
        fieldType: 'hidden',
        propertyGroup: 'slideshowIndicators',
        value: '0',
      },
    };
  }

  constructor() {
    super();
    this.currentPosition = 0;
  }

  initIndicators() {
    const activeStateId = this.constructor.getActiveStateId(this.parentNode);
    this.indicators = this.shadowRoot.querySelectorAll('.indicator');
    this.updateIndicators(activeStateId);
    this.setLevelCallback();
  }

  update(changedProps) {
    super.update(changedProps);
    if (!this.isRendered || !changedProps.size) {
      this.initIndicators();
    }
  }

  updateIndicators(activeStateId) {
    if (activeStateId && this.indicators.length) {
      this.elements = this.constructor.getOrderedElements(this.parentNode);
      const currentStateIDs = this.constructor.getStateIDs(this.elements);
      const index = this.constructor.getActiveStateIndex(currentStateIDs, activeStateId);
      this.indicators[this.currentPosition].classList.remove('active');
      this.indicators[index].classList.add('active');
      this.currentPosition = index;
    }
    this.classList[activeStateId ? 'remove' : 'add']('disable');
  }

  setLevelCallback() {
    const level = this.getLevel().topLevel;
    setLevelCallback(this, level + 1);
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribeRegisteredStates = FusionStore.subscribe('app.registeredStates', () => {
      this.requestUpdate();
    });
    this.unsubscribeCurrentState = FusionStore.subscribe('app.currentState', (state) => {
      this.constructor.applyUpdateByActiveState(state.app.currentState, this.parentNode, this.updateIndicators.bind(this));
    });
    this.unsubscribeCurrentLevel = FusionStore.subscribe('levels.topLevel', () => this.setLevelCallback());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribeRegisteredStates();
    this.unsubscribeCurrentState();
    this.unsubscribeCurrentLevel();
  }

  static getIndicatorsTemplateResult() {
    return html`
      <div class="indicator"></div>
    `;
  }

  generateIndicators() {
    this.elements = this.constructor.getOrderedElements(this.parentNode);
    return this.elements ? Object.keys(this.elements).map(() => this.constructor.getIndicatorsTemplateResult()) : null;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          border: none;
          pointer-events: none;
        }
        :host(.disable) {
          display: none;
        }
        :host([direction="vertical"]) .indicators-wrapper {
          flex-direction: column;
        }
        .indicators-wrapper {
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        .indicator {
          width: var(--size);
          height: var(--size);
          background-color: var(--color);
          border-radius: var(--border-radius);
          box-sizing: border-box;
          pointer-events: all;
        }
        .indicator.active {
          background-color: var(--active-color);
          border-color: var(--active-border-color);
        }
       `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host .indicator {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  render() {
    return html`
     <style>
        ${this.dynamicStyles}
      </style>
      <div class="indicators-wrapper">
        ${this.generateIndicators()}
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { InlineSlideshowIndicators };
