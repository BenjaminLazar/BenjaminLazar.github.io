import { css } from 'lit-element';
import { FusionStateContainer } from '../../state-container';
import { store } from '../../../store';
import { getPartial } from '../../../utils';
import { FusionLogger } from '../../../services/fusion-logger';
import { applyMixins, SlideshowElement } from '../../../mixins';

class InlineSlideshowStateContainer extends applyMixins(FusionStateContainer, [SlideshowElement]) {
  static get properties() {
    const properties = ['duration', 'delay', 'background-color', 'initialState', 'fieldName', 'hidden', 'show-in-editor', 'data-flag-on', 'required', 'opacity'];
    const filteredProp = getPartial(super.properties, properties);
    const { 'track-visit': trackVisit, 'track-duration': trackDuration, effect } = super.properties;
    return {
      ...filteredProp,
      'order-index': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'slideshowState',
        value: '0',
        min: 1,
        step: 1,
        prop: true,
      },
      'track-visit': {
        ...trackVisit,
        value: 'on',
      },
      'track-duration': trackDuration,
      effect: {
        ...effect,
        fieldType: 'hidden',
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-inline-slideshow-state-container',
      componentUIName: 'Inline Slideshow State',
      componentDescription: 'inline-slideshow-state-container',
      componentType: 'dynamic',
      componentCategory: 'interaction',
      resizable: false,
      draggable: false,
      rotatable: false,
      isRootNested: false,
    };
  }

  setOrderIndex() {
    const registeredStatesIds = this.getRegisteredStatesIds();
    const index = registeredStatesIds.indexOf(this.id) + 1;
    if (!Number(this['order-index']) || !this.isPossibleToChangeIndex()) {
      this.setAttribute('order-index', index);
    }
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.isRendered && changedProps.has('order-index')) {
      this.updateOrderIndex(changedProps);
    }
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('order-index')) {
      this.setOrderIndex();
      this.updateStatesEffect();
    }
  }

  parentStateChanged(parentState) {
    super.parentStateChanged(parentState);
    this.iterateNonStatefulChildren(this, (component) => component.parentStateChanged(parentState));
  }

  updateStatesEffect() {
    const { direction } = this.parentNode;
    const stateIndex = this.getRegisteredStatesIds().indexOf(this.id);
    const isActiveDefaultState = this.isActiveState();
    const effect = isActiveDefaultState ? this.constructor.getNonAnimationEffect() : this.constructor.getAnimationEffect(stateIndex, direction);
    this.setAttribute('effect', effect);
  }

  static getNonAnimationEffect() {
    return 'none-animation';
  }

  static getAnimationEffect(stateIndex, direction) {
    return !stateIndex ? this.animationConfig[direction].forward : this.animationConfig[direction].backward;
  }

  isPossibleToChangeIndex() {
    const registeredStatesIds = this.getRegisteredStatesIds();
    return registeredStatesIds.length > Number(this['order-index']) - 1;
  }

  updateOrderIndex(changedProps) {
    if (this.isPossibleToChangeIndex()) {
      this.emitCustomEvent(
        `${this.constructor.options.componentName}:updated`,
        {
          detail: {
            oldIndex: Number(changedProps.get('order-index')),
            newIndex: Number(this['order-index']),
          },
        },
      );
    } else {
      FusionLogger.warn('The order-index can not be increased!', 'InlineSlideshowStateContainer');
    }
  }

  getRegisteredStatesIds() {
    const { registeredStates } = store.getState().app;
    const states = registeredStates.map((st) => st.split('-').pop());
    return states.filter((state) => this.parentNode.querySelector(`#${state}`));
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          position: absolute;
        }
        :host [part="animated-wrapper"] {
          background-color: transparent;
        }
        :host([effect="none-animation"]) [part="animated-wrapper"],
        :host([effect="none-animation"]) [part="overlay"] {
          transition-property: none;
        }
      `,
    ];
  }
}

export { InlineSlideshowStateContainer };
