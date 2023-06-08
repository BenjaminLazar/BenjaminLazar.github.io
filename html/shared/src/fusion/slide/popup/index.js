import { css, html, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  ModeTrackable,
  PopupElement,
  SlideComponentBase,
  Stateful,
} from '../../mixins';
import { FusionCustomPopupOverlay } from '../custom-popup-overlay';
import { FusionBackdrop } from '../backdrop';
import { createObjectItem } from '../../utils';
import { FusionStore } from '../../services/fusion-store';
import {
  Display,
  FieldDefinition,
} from '../../mixins/props';
import { commentingStrategies, commentingStrategySymbol } from '../../constants';

const state = 'Popup';

class FusionPopup extends applyMixins(FusionBase, [
  SlideComponentBase,
  Display,
  Stateful,
  PopupElement,
  ModeTrackable,
  FieldDefinition,
]) {
  static get properties() {
    const {
      opacity,
      required,
      fieldName,
      hidden,
      'show-in-editor': showInEditor,
      'data-flag-on': dataFlagOn,
      'track-duration': trackDuration,
      'track-visit': trackVisit,
    } = super.properties;
    return {
      opacity,
      required,
      fieldName,
      hidden,
      'show-in-editor': showInEditor,
      'data-flag-on': dataFlagOn,
      'track-visit': trackVisit,
      'track-duration': trackDuration,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-popup',
      componentUIName: 'Popup',
      componentType: 'dynamic',
      componentCategory: 'overlay',
      componentDescription: 'Basic popup module with option backdrop',
      isTextEdit: true,
      nestedComponents: ['fusion-backdrop', 'fusion-custom-popup-overlay'],
      baseLevel: 100,
      resizable: false,
      draggable: false,
      rotatable: false,
    };
  }

  static get state() {
    return state;
  }

  static get [commentingStrategySymbol]() {
    return commentingStrategies.outer;
  }

  constructor() {
    super();
    this.state = state;
    this.backdrop = createObjectItem(FusionBackdrop);
    this.overlay = createObjectItem(FusionCustomPopupOverlay);
    this.closePopupHandlerBound = this.closePopupHandler.bind(this);
  }

  enter() {
    this.addLevel();
  }

  exit() {
    this.removeLevel();
  }

  getChildrenComponentsData() {
    return {
      [this.overlay.name]: {
        attribute: `${this.overlay.name}-removed`,
        component: this.overlay,
      },
      [this.backdrop.name]: {
        attribute: `${this.backdrop.name}-removed`,
        component: this.backdrop,
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.setListenerType('addEventListener');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.setListenerType('removeEventListener');
  }

  setListenerType(listenerType) {
    this[listenerType]('button-click', this.closePopupHandlerBound);
    this[listenerType]('backdrop-click', this.closePopupHandlerBound);
    this[listenerType](this.backdrop.events.add, this.updateComponentRelations.bind(this, 'addEventListener'));
    this[listenerType](this.overlay.events.add, this.updateComponentRelations.bind(this, 'addEventListener'));
  }

  closePopupHandler(e) {
    const stateName = this.getStateName();
    this.removeState(stateName, '', false);
    e.stopPropagation();
  }

  parentStateChanged(parentState) {
    super.parentStateChanged(parentState);
    const registeredState = FusionStore.store.getState().app.currentState;
    registeredState.forEach((stateName) => {
      if (stateName !== parentState.name) {
        this.removeState(stateName, '', false);
      }
    });
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }
        .popup-content-wrapper {
          width: 100%;
          height: 100%;
        }
        :host(:not([active])) {
          display: none;
        }
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) .popup-content-wrapper {
          background-image: repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1) 15px, rgba(0, 0, 0, 0.3) 5px, rgba(0, 0, 0, 0.3) 20px);
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='popup-content-wrapper'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionPopup };
