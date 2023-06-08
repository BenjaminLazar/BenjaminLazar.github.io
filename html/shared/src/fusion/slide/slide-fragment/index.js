import { css, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { FusionBase } from '../../base';
import {
  applyMixins,
  LazyComponent,
  ModeTrackable,
  SlideComponentBase,
  AsyncComponentDetection,
} from '../../mixins';
import { hasInactiveStatefulParent, httpRequest } from '../../utils';
import { FusionLogger } from '../../services/fusion-logger';
import { ComponentReadinessChecker } from '../../services/component-readiness-checker';
import { iterateNonStatefulChildren } from '../../services/dom-utils';
import {
  Container,
  Display,
  Dimensions,
  FieldDefinition,
} from '../../mixins/props';
import { EventBridge } from '../../services/event-bridge';
import config from '../../../config.json';

const FRAGMENTS_ROOT = '../shared/fragments/';
const DEFAULT_NAME = 'Fragment name';

/** class for instantiating <fusion-slide-fragment>, a component, that will fetch a HTML template stored separately. This will enable  */
class SlideFragment extends applyMixins(FusionBase, [
  SlideComponentBase,
  ModeTrackable,
  AsyncComponentDetection,
  LazyComponent,
  Container,
  Display,
  Dimensions,
  FieldDefinition,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-slide-fragment',
      componentUIName: 'Slide Fragment',
      componentDescription: 'Component for inserting fragments',
      nestedComponents: [],
      resizable: false,
      rotatable: false,
    };
  }

  static get properties() {
    const {
      overflow,
      width,
      height,
      'min-height': minHeight,
      'min-width': minWidth,
      'max-height': maxHeight,
      'max-width': maxWidth,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      ...rest
    } = super.properties;
    return {
      width: {
        ...width,
        value: config.responsive ? '100%' : '200px',
        availableUnits: [
          { unitType: 'px' },
          { unitType: '%' },
        ],
      },
      height: {
        ...height,
        value: '25px',
        availableUnits: [
          { unitType: 'px' },
          { unitType: '%' },
        ],
      },
      'fragment-name': {
        type: String,
        fieldType: 'Modal',
        propertyGroup: 'fragment',
        assetType: 'Fragment',
        value: '',
        prop: true,
      },
      ...rest,
    };
  }

  constructor() {
    super();
    this.setEmptyFragment();
    this.shadowRootStateHandler = this.shadowRootStateChange.bind(this);
  }

  setEmptyFragment() {
    this.fragment = {
      name: '',
      template: '',
    };
  }

  updated(changedProps) {
    super.updated(changedProps);
    this.handleFragmentNameChange(changedProps);
    this.handleFragmentNameRemove(changedProps);
    EventBridge.initEventBridge(this.shadowRoot.querySelector('.fragment-wrapper').children);
    EventBridge.setListenerForComponentsEvents(this, 'addEventListener');
  }

  async performUpdate() {
    this.handleFieldName();
    super.performUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    EventBridge.setListenerForComponentsEvents(this, 'removeEventListener');
    document.removeEventListener('shadowRootStateChanged', this.shadowRootStateHandler);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('shadowRootStateChanged', this.shadowRootStateHandler);
  }

  shadowRootStateChange(e) {
    const { id, level } = e.detail;
    if (!this.shadowRoot.getElementById(id).assignedSlot) {
      this.style.setProperty('--level', level || '');
    }
  }

  get fragmentTemplateResult() {
    return unsafeHTML(this.fragment.template);
  }

  static async getFragment(fragmentName) {
    const path = `${FRAGMENTS_ROOT}${fragmentName}/index.html?ts=${Date.now()}`;
    let template = '';
    try {
      template = await httpRequest(path, { responseType: 'text' });
    } catch (e) {
      FusionLogger.log(`Could not fetch template from "${path}"`, 'SlideFragment');
      template = '';
    }
    return template;
  }

  shouldFetchFragment() {
    return this.fragment.name !== this['fragment-name'];
  }

  async fetchFragment() {
    let fetched = false;
    // prevent multiple fetches of the same doc
    if (this.shouldFetchFragment()) {
      this.fragment.name = this['fragment-name'];
      this.fragment.template = await this.constructor.getFragment(this['fragment-name']);
      const nestedFragmentAmount = await ComponentReadinessChecker.countNestedEntities(this.fragment.template, SlideFragment.options.componentName);
      if (nestedFragmentAmount) {
        await ComponentReadinessChecker.updateQuantity(SlideFragment.options.componentName, 'commonAmount', nestedFragmentAmount);
      }
      await ComponentReadinessChecker.updateQuantity(SlideFragment.options.componentName, 'fetchedAmount', 1);
      fetched = true;
    }
    return fetched;
  }

  // ignore eslint to support older versions, prior to 1.10.2
  // eslint-disable-next-line class-methods-use-this
  iterateNonStatefulChildren(parent, cb) {
    iterateNonStatefulChildren(parent, cb, FusionBase);
  }

  childCbTrigger(isEnter = false) {
    this.iterateNonStatefulChildren(
      this,
      (component) => component.parentStateChanged({
        name: this.getStateName(),
        active: isEnter,
      }),
    );
  }

  async parentStateChanged(parentState) {
    super.parentStateChanged(parentState);
    if (parentState.active) {
      await this.fetchFragment();
      await this.requestUpdate();
    }
    const fragmentWrapper = this.shadowRoot.querySelector('.fragment-wrapper');
    this.iterateNonStatefulChildren(fragmentWrapper, (component) => component.parentStateChanged(parentState));
  }

  isFragmentNameRemoved(changedProps) {
    return changedProps.get('fragment-name') && !this['fragment-name'];
  }

  isFragmentNameChanged(changedProps) {
    return changedProps.has('fragment-name') && this['fragment-name'];
  }

  async handleFragmentNameChange(changedProps) {
    if (this.isFragmentNameChanged(changedProps)) {
      await this.fetchFragment();
      if (!hasInactiveStatefulParent(this)) {
        await this.requestUpdate();
      }
      const tmp = document.createElement('div');
      tmp.innerHTML = this.fragment.template;
      this.loadAsyncComponents(tmp);
    }
  }

  handleFragmentNameRemove(changedProps) {
    if (this.isFragmentNameRemoved(changedProps)) {
      this.setEmptyFragment();
      this.requestUpdate();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: var(--position);
          z-index: var(--level);
        }
        :host .slide-fragment,
        :host .fragment-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }
        :host .fragment-wrapper {
          z-index: 0;
        }
        :host .fragment-placeholder {
          position: absolute;
          width: 100%;
          height: 25px;
          top: 0;
          left: 0;
          background-color: var(--theme-color-placeholder);
          font-family: sans-serif;
          z-index: 1;
        }
        :host(.edit-mode) .fragment-placeholder {
          display: flex !important;
          justify-content: center;
          align-items: center;
        }
      `,
    ];
  }

  render() {
    // fragment placeholder should be style="display: none;" directly in the render() function,
    // otherwise the fragment name can appear before the fragment is loaded
    return html`
      <link rel="stylesheet" href="../shared/dist/main.css">
      <style>
        ${this.dynamicStyles}
      </style>
      <div class="slide-fragment">
        <div class="fragment-placeholder" style="display: none;">
          <p>${this['fragment-name'] || DEFAULT_NAME}</p>
        </div>
        <div class="fragment-wrapper">
          ${this.fragmentTemplateResult}
        </div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { SlideFragment };
