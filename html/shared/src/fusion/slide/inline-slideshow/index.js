import { css, html, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  ChildrenStylist,
  ModeTrackable,
  SlideshowElement,
  SlideComponentBase,
} from '../../mixins';
import { FusionApi } from '../../api';
import { InlineSlideshowStateContainer } from './inline-slideshow-state';
import { createObjectItem } from '../../utils';
import { FusionStore } from '../../services/fusion-store';
import {
  Container,
  Dimensions,
  Effect,
  FieldDefinition,
  Display,
} from '../../mixins/props';
import config from '../../../config.json';

class FusionTestSlideShow extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  Effect,
  ChildrenStylist,
  SlideshowElement,
  ModeTrackable,
  FieldDefinition,
  Display,
]) {
  static get properties() {
    const {
      position,
      top,
      left,
      width,
      height,
      effect,
      initialState,
      overflow,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      ...rest
    } = super.properties;
    return {
      top,
      left,
      position: {
        ...position,
        value: config.responsive ? 'relative' : 'absolute',
        selectOptions: [
          { value: 'absolute', icon: 'positionabsolute' },
          { value: 'relative', icon: 'positionrelative' },
          { value: 'fixed', icon: 'positionfixed' },
        ],
      },
      overflow: {
        ...overflow,
        selectOptions: [
          { value: 'hidden', icon: 'preview-closed' },
          { value: 'visible', icon: 'preview' },
        ],
      },
      width: {
        ...width,
        value: '800px',
      },
      height,
      direction: {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'animation',
        value: 'horizontal',
        prop: true,
        selectOptions: [
          { value: 'horizontal', icon: 'right' },
          { value: 'vertical', icon: 'down' },
          { value: 'fading', icon: 'share' },
        ],
      },
      ...rest,
      'background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'background',
        value: 'rgba(225, 225, 225, 1)',
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-inline-slideshow',
      componentUIName: 'Inline Slideshow',
      componentCategory: 'interaction',
      componentDescription: 'Inline slideshow component',
      nestedComponents: ['fusion-inline-slideshow-state-container', 'fusion-inline-slideshow-indicators', 'fusion-inline-slideshow-navigation'],
      defaultTemplate: this.slideShowStateTemplate(),
    };
  }

  static get eventsConfig() {
    return {
      horizontal: ['swipeleft', 'swiperight'],
      vertical: ['swipeup', 'swipedown'],
      fading: ['swipeleft', 'swiperight'],
    };
  }

  static getEventDirection() {
    return {
      toForward: ['swipeleft', 'swipeup'],
      toBackward: ['swiperight', 'swipedown'],
    };
  }

  static get synchronizableProperties() {
    const {
      top, left, width, height, fieldName, hidden, 'show-in-editor': showInEditor, 'data-flag-on': dataFlagOn, required,
      ...filteredProp
    } = this.properties;
    return filteredProp;
  }

  static get synchronizablePropertiesSpecificForChildren() {
    const inlineSlideshowStateContainerName = InlineSlideshowStateContainer.options.componentName;

    return {
      duration: [inlineSlideshowStateContainerName],
      delay: [inlineSlideshowStateContainerName],
      'background-color': [inlineSlideshowStateContainerName],
    };
  }

  static slideShowStateTemplate() {
    return `
        <fusion-inline-slideshow-state-container
          id="${FusionApi.generateId()}"
          duration="${this.properties.duration.value}"
          delay="${this.properties.delay.value}"
          background-color="${this.properties['background-color'].value}"
          initialState="active"
          order-index="0"
          ></fusion-inline-slideshow-state-container>
    `;
  }

  constructor() {
    super();
    this.eventsHandlerBound = this.eventsHandler.bind(this);
    this.item = createObjectItem(InlineSlideshowStateContainer, { update: `${InlineSlideshowStateContainer.options.componentName}:updated` });
    this.updateOrderIndexesBound = this.updateOrderIndexes.bind(this);
    this.addEventListener(this.item.events.update, this.updateOrderIndexesBound);
  }

  parentStateChanged(parentState) {
    super.parentStateChanged(parentState);
    this.toggleActiveState(parentState.active);
  }

  toggleActiveState(isActive) {
    const elements = this.constructor.getChildElements(this);
    elements.forEach((element) => {
      if (this.constructor.isElementActive(element) && !isActive) {
        this.removeState(element.state, element.id);
      }
      if (this.constructor.isElementActive(element) && isActive) {
        this.pushState(element.state, element.id);
      }
    });
  }

  static isElementActive(element) {
    return element.active || element.initialState === 'active';
  }

  getRegisteredChildrenStatesIds(states) {
    const ids = states.map((id) => id.split('-').pop());
    return ids.filter((id) => this.querySelector(`#${id}`));
  }

  updateOrderIndexes(event) {
    const element = event.target;
    const { oldIndex, newIndex } = event.detail;
    const elements = this.constructor.getChildElements(this);
    elements.forEach((el) => {
      if (Number(el['order-index']) === newIndex && el.id !== element.id) {
        el.setAttribute('order-index', oldIndex);
        FusionApi.saveAttributes(`#${el.id}`, { ['order-index']: oldIndex });
      }
    });
  }

  getCurrentElements() {
    this.elements = this.constructor.getOrderedElements(this);
  }

  get exportEventListeners() {
    return this.constructor.eventsConfig[this.direction];
  }

  handleEvents(method, event) {
    this[method](event, this.eventsHandlerBound);
  }

  updateSlideshow(currStateIndex, newStateIndex, directionName) {
    this.updateAnimationEffect(currStateIndex, directionName);
    this.updateStates(this.elements, currStateIndex, newStateIndex);
  }

  updateStates(collection, currentStateIndex, nextStateIndex) {
    this.removeState(collection[currentStateIndex].state, collection[currentStateIndex].id);
    this.pushState(collection[nextStateIndex].state, collection[nextStateIndex].id);
  }

  eventsHandler(event) {
    const eventType = event.type;
    this.elements = this.constructor.getOrderedElements(this);
    const currentStateIDs = this.constructor.getStateIDs(this.elements);
    const activeState = this.constructor.getActiveStateId(this);
    const index = this.constructor.getActiveStateIndex(currentStateIDs, activeState);
    const { goToNext, goToPrevious } = this.constructor.isPossibleToMove(currentStateIDs, index);
    if (this.constructor.getEventDirection().toForward.includes(eventType) && goToNext && activeState) {
      this.updateSlideshow(index, index + 1, 'forward');
    }
    if (this.constructor.getEventDirection().toBackward.includes(eventType) && goToPrevious && activeState) {
      this.updateSlideshow(index, index - 1, 'backward');
    }
    event.stopPropagation();
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.isRendered) {
      this.getCurrentElements();
      this.updateStatesEvents();
      if (changedProps.has('direction')) {
        this.updateStatesEffect();
      }
    }
  }

  updateStatesEffect() {
    const forwardEffect = this.constructor.animationConfig[this.direction].forward;
    const backwardEffect = this.constructor.animationConfig[this.direction].backward;
    this.elements.forEach((element, index) => {
      !index ? element.setAttribute('effect', forwardEffect) : element.setAttribute('effect', backwardEffect);
    });
  }

  updateStatesEvents() {
    this.eventsList.forEach((event) => this.handleEvents('removeEventListener', event));
    this.eventsList = this.exportEventListeners;
    this.eventsList.forEach((event) => this.handleEvents('addEventListener', event));
  }

  connectedCallback() {
    super.connectedCallback();
    this.eventsList = this.exportEventListeners;
    this.eventsList.forEach((event) => this.handleEvents('addEventListener', event));
    this.unsubscribe = FusionStore.subscribe('app.registeredStates', (state) => {
      this.registeredStatesIds = this.getRegisteredChildrenStatesIds(state.app.registeredStates);
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(this.item.events.update, this.updateOrderIndexesBound);
    this.eventsList.forEach((event) => this.handleEvents('removeEventListener', event));
    this.unsubscribe();
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.getCurrentElements();
  }

  static get styles() {
    return [
      super.styles,
      css`
      :host {
        overflow: var(--overflow);
      }
      .slideshow-wrapper {
        width: 100%;
        height: 100%;
      }
      .indicators-wrapper {
        position: absolute;
        width: 100%;
        display: flex;
        justify-content: center;
      }
      :host([indicators-position='bottom']) .indicators-wrapper {
        left: 0;
        bottom: 0;
      }
      .indicator {
        margin: 0 var(--indicators-distance);
        width: var(--indicators-width);
        height: var(--indicators-height);
        background-color: var(--indicators-color);
        border: var(--indicators-border-width) var(--indicators-border-style) var(--indicators-border-color);
        border-radius: var(--indicators-border-radius);
        box-sizing: border-box;
      }
      :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) {
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
      <div class='slideshow-wrapper'><slot></slot></div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export {
  FusionTestSlideShow,
};
