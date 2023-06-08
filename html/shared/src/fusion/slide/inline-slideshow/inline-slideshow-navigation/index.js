import { css, html, unsafeCSS } from 'lit-element';
import {
  applyMixins,
  ModeTrackable,
  SlideshowElement,
  SlideComponentBase,
} from '../../../mixins';
import { FusionBase } from '../../../base';
import { FusionStore } from '../../../services/fusion-store';
import {
  Container,
  Dimensions,
  Display,
  Asset,
  FieldDefinition,
} from '../../../mixins/props';
import config from '../../../../config.json';
import { setLevelCallback } from '../../../utils';

class InlineSlideshowNavigation extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  Display,
  Asset,
  ModeTrackable,
  SlideshowElement,
  FieldDefinition,
]) {
  static get properties() {
    const {
      position,
      top,
      left,
      width,
      height,
      overflow,
      'lock-aspect-ratio': lockAspectRatio,
      src,
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
      width: {
        ...width,
        value: '600px',
      },
      height: {
        ...height,
        value: '100px',
      },
      ...rest,
      'navigation-width': {
        ...width,
        propertyGroup: 'slideshowNavigation',
        value: '50px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'navigation-height': {
        ...height,
        propertyGroup: 'slideshowNavigation',
        value: '50px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      image: {
        ...src,
        propertyGroup: 'slideshowNavigation',
        assetType: 'Icon',
        value: '../shared/src/fusion/slide/inline-slideshow/inline-slideshow-navigation/assets/images/fusion-arrow.png',
      },
      direction: {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'slideshowNavigation',
        value: 'horizontal',
        selectOptions: [
          { value: 'horizontal' },
          { value: 'vertical' },
        ],
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-inline-slideshow-navigation',
      componentUIName: 'Arrow Navigation',
      componentType: 'dynamic',
      componentCategory: 'interaction',
      componentDescription: 'Inline slideshow navigation',
      isRootNested: false,
      nestedComponents: [],
    };
  }

  initNavigationData() {
    const activeStateId = this.constructor.getActiveStateId(this.parentNode);
    this.updateNavigationData(activeStateId);
    this.setLevelCallback();
  }

  updateNavigationData(activeStateId) {
    if (activeStateId) {
      this.elements = this.constructor.getOrderedElements(this.parentNode);
      this.currentStateIDs = this.constructor.getStateIDs(this.elements);
      this.currentPosition = this.constructor.getActiveStateIndex(this.currentStateIDs, activeStateId);
    }
    this.classList[activeStateId ? 'remove' : 'add']('disable');
  }

  getNavigationClass(direction) {
    let navigationClass = 'disable';
    if (this.currentStateIDs) {
      navigationClass = this.constructor.isPossibleToMove(this.currentStateIDs, this.currentPosition)[direction] ? '' : 'disable';
    }
    return navigationClass;
  }

  goToNextState() {
    const removeStateIndex = this.currentStateIDs[this.currentPosition];
    const pushStateIndex = this.currentStateIDs[this.currentPosition + 1];
    this.updateAnimationEffect(this.currentPosition, 'forward');
    this.updateStates(removeStateIndex, pushStateIndex);
  }

  goToPreviousState() {
    const removeStateIndex = this.currentStateIDs[this.currentPosition];
    const pushStateIndex = this.currentStateIDs[this.currentPosition - 1];
    this.updateAnimationEffect(this.currentPosition, 'backward');
    this.updateStates(removeStateIndex, pushStateIndex);
  }

  updateStates(removeStateIndex, pushStateIndex) {
    this.removeState('StateContainer', removeStateIndex);
    this.pushState('StateContainer', pushStateIndex);
  }

  setLevelCallback() {
    const level = this.getLevel().topLevel;
    setLevelCallback(this, level + 1);
  }

  updateDirectionByParent() {
    this.setAttribute('direction', this.parentNode.direction);
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribeCurrentState = FusionStore.subscribe('app.currentState', (state) => {
      this.constructor.applyUpdateByActiveState(state.app.currentState, this.parentNode, this.updateNavigationData.bind(this));
      this.requestUpdate();
    });
    this.unsubscribeCurrentLevel = FusionStore.subscribe('levels.topLevel', () => this.setLevelCallback());
    this.updateDirectionByParent();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribeCurrentState();
    this.unsubscribeCurrentLevel();
  }

  editorModeChanged(isEditMode) {
    if (!isEditMode) {
      this.initNavigationData();
    }
  }

  getNavigationsTemplateResult() {
    return html`
      <img src="${this.image}"
            class="navigation backward ${this.getNavigationClass('goToPrevious')}"
            @click="${() => this.goToPreviousState()}">
        <img src="${this.image}"
            class="navigation forward ${this.getNavigationClass('goToNext')}"
            @click="${() => this.goToNextState()}">
    `;
  }

  generateNavigations() {
    return this.elements ? this.getNavigationsTemplateResult() : null;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          pointer-events: none;
        }
        :host(.disable) {
          display: none;
        }
         .arrow-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        :host([direction="vertical"]) .arrow-wrapper {
          flex-direction: column-reverse;
        }
        .navigation {
          width: var(--navigation-width);
          height: var(--navigation-height);
          pointer-events: all;
        }
        .navigation.forward {
          transform: rotate(180deg);
        }
        .navigation.disable {
          pointer-events: none;
          opacity: 0;
        }
        :host([direction="vertical"]) .navigation.forward {
          transform: rotate(90deg);
        }
        :host([direction="vertical"]) .navigation.backward {
          transform: rotate(-90deg);
        }
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) .navigation {
          pointer-events: all;
          opacity: 1;
        }
       `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='arrow-wrapper'>
        ${this.generateNavigations()}
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { InlineSlideshowNavigation };
