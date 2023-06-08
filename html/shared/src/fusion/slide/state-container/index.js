import { css, html, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import { FusionStore } from '../../services/fusion-store';
import {
  applyMixins,
  ModeTrackable,
  Stateful,
  SlideComponentBase,
} from '../../mixins';
import { delay, getValueObject } from '../../utils';
import {
  Container,
  Dimensions,
  Effect,
  Display,
  Background,
  FieldDefinition,
} from '../../mixins/props';
import { commentingStrategies, commentingStrategySymbol } from '../../constants';

const state = 'StateContainer';

class FusionStateContainer extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  Effect,
  Display,
  Background,
  Stateful,
  ModeTrackable,
  FieldDefinition,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-state-container',
      componentUIName: 'State Container',
      componentType: 'dynamic',
      componentCategory: 'interaction',
      componentDescription: 'Basic container for adding custom UI state (active/inactive)',
      baseLevel: 100,
    };
  }

  static get properties() {
    const {
      top,
      left,
      width,
      height,
      overflow,
      'background-color': backgroundColor,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      'track-duration': trackDuration,
      'track-visit': trackVisit,
      ...rest
    } = super.properties;
    return {
      top,
      left,
      width: {
        ...width,
        value: '600px',
      },
      height,
      'background-color': {
        ...backgroundColor,
        value: 'rgba(225, 225, 225, 1)',
      },
      'track-visit': {
        ...trackVisit,
        value: 'off',
      },
      'track-duration': {
        ...trackDuration,
        value: 'off',
      },
      ...rest,
    };
  }

  static get state() {
    return state;
  }

  static get [commentingStrategySymbol]() {
    return commentingStrategies.inner;
  }

  constructor() {
    super();
    this.state = state;
    this.environmentSetEvent = 'EnvironmentDetector:environmentDetected';
  }

  enter() {
    this.addLevel();
  }

  exit() {
    const transitionDuration = getValueObject(this.duration).num;
    this.removeLevel(transitionDuration);
  }

  isActiveState() {
    return this.initialState === 'active';
  }

  async setActiveState() {
    if (this.isActiveState()) {
      await delay();
      this.activate();
    }
  }

  async setInactiveState(parentState) {
    if (parentState) {
      await delay();
      this.inactivate();
    }
  }

  async enterCallback() {
    // need delay for loadingOptimizer to uncomment state before it becomes active (issue with animation)
    await delay();
    super.enterCallback();
  }

  parentStateChanged(parentState) {
    const { active } = parentState;
    super.parentStateChanged(parentState);
    if (active) {
      this.setActiveState();
    } else {
      this.setInactiveState(!active);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.environmentSetHandler = this.setActiveState.bind(this);
    // Roman S explanation: Env load faster than subscribtion works. e carefully
    const env = FusionStore.store.getState().app.environment;
    if (env !== '') {
      this.environmentSetHandler();
    }

    document.addEventListener(this.environmentSetEvent, this.environmentSetHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(this.environmentSetEvent, this.environmentSetHandler);
  }

  static get styles() {
    return [
      super.styles,
      css`
        [part="animated-wrapper"],
        [part="overlay"] {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: inherit;
        }
        :host(:not([active])) .slide-left {
          transform: translate3d(-100%, 0, 0);
        }
        :host(:not([active])) .slide-right {
          transform: translate3d(100%, 0, 0);
        }
        :host(:not([active])) .slide-bottom {
          transform: translate3d(0, 100%, 0);
        }
        :host(:not([active])) .slide-top {
          transform: translate3d(0, -100%, 0);
        }
        :host(:not([active])) .fade-in {
          opacity: 0;
        }
        :host([active]) [part="overlay"] {
          opacity: 1;
        }
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}:not([active])) {
          visibility: hidden;
        }
        [part="overlay"] {
          transition-property: opacity;
          transition-timing-function: ease-in-out;
          background-image: var(--background-image);
          background-position-x: var(--background-position-x);
          background-position-y: var(--background-position-y);
          background-repeat: var(--background-repeat);
          background-size: var(--background-size);
          background-attachment: var(--background-attachment);
          background-color: var(--background-color);
          box-sizing: border-box;
          opacity: 0;
        }
        :host [part="animated-wrapper"] {
          transition-property: all;
          transition-timing-function: ease-in-out;
          transform: translate3d(0, 0, 0);
          background-image: none;
          background-color: unset;
          background-position-x: initial;
          background-position-y: initial;
          background-repeat: initial;
          background-size: initial;
          background-attachment: initial;
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      [part="overlay"],
      [part="animated-wrapper"] {
        transition-delay: ${this.delay};
        transition-duration: ${this.duration};
      }
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div part="animated-wrapper" class="${this.effect}">
        <div part="overlay"><slot></slot></div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionStateContainer };
