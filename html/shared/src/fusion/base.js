import {
  LitElement, html, css,
} from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../store';
import { FusionLogger } from './services/fusion-logger';
import { designSystemConfig } from './services/design-system';

// These are the actions needed by this element.
import {
  registerState, pushState, setStates, removeState, forwardState, backwardState, unregisterState, reRegisterState, registerInitialActiveState, unregisterInitialActiveState,
} from './_actions/app.js';
import {
  getLevel, addLevel, removeLevel, setLevel,
} from './_actions/levels.js';
import { promisifyEvent, setLevelCallback } from './utils';

/**
 * @typedef {Object} LimitationProperty
 * @property {String} unitType
 * @property {Number} value
 */

/**
 * @typedef {Object} LitElementProperty
 * @property {Function} type - constructor of built-in objects, e.g. String, Boolean etc.
 * @property {String} fieldType - 'Select', 'Number', 'String', 'Boolean', 'ColorPicker', 'File', 'Link', 'Slider', 'RadioGroupPanel', 'RadioGroup', 'Checkbox'
 * @property {String} value
 * @property {String[]} [selectOptions] - if .fieldType === 'Select'
 * @property {Array.<selectOptions>} [selectOptions] - if .fieldType === 'RadioGroupPanel'
 * @property {Array.<selectOptions>} [selectOptions] - if .fieldType === 'RadioGroup'
 * @property {String} [assetType] - if .fieldType === 'File'
 * @property {String} [propertyGroup] - possible values:
 * 'action','activeState','adjust','alignment','allowLayouts','animation','asset','audio','background','border',
 * 'closeButton','component','controls','deviceVisibility','error','field','fragment','handle','image','innerPadding',
 * 'input','layout','layoutDirection','line','link','content','listItem','margin','media','other','padding','placeholder',
 * 'position','references','scroll','separator','shape','size','slider','slideshowIndicators','slideshowNavigation',
 * 'slideshowState','sortableList','tab','tab-border','tabs','table','tabGroup','text','veevaMonitoring'.
 * Defines in which UI prop section, component property will be shown.
 * @property {String} [propertyArea] - possible values: style, settings. Defines in which UI prop area, component property will be shown
 * @property {String | LimitationProperty} [min]
 * @property {String | LimitationProperty} [max]
 * @property {String} [step]
 * @property {Boolean} [prop] - if .prop === true this property wouldn't be reflected in the style property.
 * @property {Array.<availableUnits>} [availableUnits] - array of units that can be used with prop 'value' (fieldType 'Number' only)
 * @property {String[]} [attributes] - attribute names, value of which should be set together with the current property
 * @property {Array} [browserNotSupported] - browserNotSupported can be 'ie, edge, chrome, firefox, opera, safari' as single value or several in array
 * @property {Boolean} [calculated] - property defined to prevent position properties values reset on positioning type change
 */

/**
 * @typedef {Object} availableUnits
 * @property {String} unitType
 * @property {Boolean} [noInputNumber] optional field, if true the input number field will be hidden, only select will be available
 */
//  units prop example availableUnits: [{ unitType: 'px' }],

/**
 * @typedef {Object} selectOptions
 * @property {String} value
 * @property {String} [icon]
 */

class FusionBase extends connect(store)(LitElement) {
  set id(value) {
    if (!this.oldId) this.oldId = this.getAttribute('id');
    if (value !== this.oldId) {
      if (this.state) {
        this.reRegisterState(this.state, value);
        if (store.getState().app.currentState && store.getState().app.currentState.indexOf(`${this.state}-${this.oldId}`) > -1) {
          this.pushState(this.state, value);
        }
        this.removeState(this.state, this.oldId);
      }
      this.setAttribute('id', value);
      this.oldId = value;
    }
  }

  get id() {
    return this.getAttribute('id');
  }

  constructor() {
    super();
    // TODO: Remove logic on the componentes. It should be moved to Activator/Editor
    this.nodeInfoProps = [
      'id',
      'fieldIcon',
      'fieldName',
      'required',
      'hidden',
      'content-module-id',
      'content-module-asset-id',
      'show-in-editor',
      'items',
    ];
    this.handleIsLayoutInfo();
    // set all properties values to inner properties
    this.initInnerProps();
    this.slotChangeHandlerBind = this.slotChangeHandler.bind(this);

    /**
     * @description use this flag to detect initial update of attributes (former isStartInit)
     */
    this.isRendered = false;
    /**
     * @description promise that resolves when the 'publish' event fires
     */
    this.untilPublished = promisifyEvent(this, 'published');
    this.checkPublish();
    this.areOptionsValid();

    this.setupDesignSystem();
  }

  static get options() {
    return {
      ...super.options,
      componentScope: 'standard',
      componentType: 'static',
      componentCategory: 'elements',
      isTextEdit: false,
      nestedComponents: ['*'],
      excludedComponents: [],
      defaultTemplate: '',
      removable: true,
    };
  }

  async setupDesignSystem() {
    const properties = await designSystemConfig.getComponentStyles(this.constructor.options.componentName);

    Object.keys(this.constructor.properties).forEach((property) => {
      if (properties[property] && !this.hasAttribute(property)) {
        this[property] = properties[property];
      }
    });
  }

  /**
   * Defines if component can be treated as a layout container
   */
  handleIsLayoutInfo() {
    if (this.constructor.options.isRootNested && this.constructor.options.nestedComponents.length) this.nodeInfoProps.push('is-layout');
  }

  /**
   * @private
   * @returns {Promise<void>}
   */
  async checkPublish() {
    /* @todo Roman S. It will not work with async components. As event triggers faster */
    if (document.readyState === 'loading') {
      await promisifyEvent(document, 'DOMContentLoaded');
    }
    this.emitCustomEvent('published', { bubbles: false });
  }

  /**
   * areOptionsValid - is all options without default value were setup
   * @return {Boolean}
   */
  areOptionsValid() {
    const { componentName, componentUIName, componentDescription } = this.constructor.options;
    const isNotCorrectName = componentUIName === undefined;
    const isNotCorrectDescription = componentDescription === undefined;
    if (isNotCorrectName) {
      FusionLogger.error(`ComponentUIName doesn't exist in component ${componentName}`, 'base');
    }
    if (isNotCorrectDescription) {
      FusionLogger.error(`ComponentDescription doesn't exist in component ${componentDescription}`, 'base');
    }
    return !isNotCorrectName && !isNotCorrectDescription;
  }

  /**
   * Should be called in the firstUpdated callback. Waits until update is complete and emits 'rendered' event
   * @private
   * @returns {Promise<void>}
   */
  async checkRender() {
    await this.updateComplete;
    this.emitCustomEvent('rendered');
    this.isRendered = true;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.setSlotTextEditorDetection();
    this.checkRender();
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  parentStateChanged(parentState) {}

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.slotEl) this.slotEl.removeEventListener('slotchange', this.slotChangeHandlerBind);
    this.emitCustomEvent(`${this.constructor.options.componentName}:disconnected`);
  }

  slotChangeHandler() {
    this.isEditProp = this.slotEl.assignedNodes().some((node) => node.textContent.trim().length || (node.tagName && ['VIDEO', 'AUDIO', 'SVG', 'CANVAS', 'IMG'].indexOf(node.tagName) === -1 && node.tagName.indexOf('-') === -1));
  }

  setSlotTextEditorDetection() {
    this.isEditProp = false;
    this.slotEl = this.shadowRoot && (this.shadowRoot.querySelector('slot[name="content"]') || this.shadowRoot.querySelector('slot:not([name="mo-system"])'));
    if (this.slotEl && this.constructor.options.isTextEdit) {
      /* @todo Roman S We should add it ONLY for Activator */
      this.slotEl.addEventListener('slotchange', this.slotChangeHandlerBind);
    }
  }

  initInnerProps() {
    this.propsChange((key, item) => {
      const {
        value, propertyArea, propertyGroup,
      } = item;
      // Set default propertyArea and propertyGroup on each property
      if (!propertyArea) item.propertyArea = 'style';
      if (!propertyGroup) item.propertyGroup = 'other';
      this[key] = value;
    });
  }

  propsChange(cb) {
    if (this.constructor.properties) {
      Object.keys(this.constructor.properties).forEach((key) => {
        const item = this.constructor.properties[key];
        cb.call(this, key, item);
      });
    }
  }

  validateNodeInfoUpdateProcess(changedProps) {
    return this.isRendered && !!this.nodeInfoProps.find((prop) => changedProps.has(prop));
  }

  async updated(changedProps) {
    super.updated(changedProps);
    if (this.validateNodeInfoUpdateProcess(changedProps)) {
      // Not importing FusionApi due to dependency cycle
      /* activatorOnly:start */
      global.Fusion.updateElementTree();
      /* activatorOnly:end */
    }
  }

  handledInfoPropData(infoProp) {
    let data;
    if (infoProp === 'show-in-editor') {
      data = !!this.getAttribute(infoProp);
    } else {
      data = this[infoProp] === undefined ? this.getAttribute(infoProp) : this[infoProp];
    }
    return data;
  }

  getNodeInfo() {
    const nodeInfo = {};
    const { componentName } = this.constructor.options;
    nodeInfo.componentName = componentName.toLowerCase();
    this.nodeInfoProps.forEach((infoProp) => {
      // Exclude content module props if they aren't enabled in the node
      if (!infoProp.includes('content-module-') || infoProp in this) {
        nodeInfo[infoProp] = this.handledInfoPropData(infoProp);
      }
    });

    const children = this.getChildNodeInfo();
    if (children) {
      return {
        ...nodeInfo,
        children,
      };
    }

    return nodeInfo;
  }

  getChildNodeInfo() {
    const slots = this.shadowRoot?.querySelectorAll('slot');
    let childInfo = null;
    if (slots) {
      childInfo = [...slots].reduce((nodeInfo, slot) => {
        const childNodes = slot.assignedNodes().filter((node) => node.getNodeInfo);
        return [...nodeInfo, ...childNodes.map((node) => node.getNodeInfo())];
      }, []);
    }
    return childInfo;
  }

  getStyleValue(key, item) {
    return (this[key] === undefined) ? item.value : this[key];
  }

  /**
   * @deprecated
   * @param {*} key propertyName value
   * @param {*} item property item from class
   */
  setDefaultStyles(key, item) {
    if (!item.prop) {
      this.style.removeProperty(`--${key}`);
      this.setAttribute(key, this.getStyleValue(key, item));
    }
  }

  setStyle(attr, value) {
    this.style.setProperty(attr, value);
  }

  setElementProp(attr, value) {
    this.style.setProperty(`--${attr}`, value);
    this.style.setProperty(attr, value);
  }

  set isEditProp(value) {
    this.setAttribute('isedit', value);
  }

  renderProp(key, item) {
    const value = this.getStyleValue(key, item);
    return value ? `--${key}: ${value};` : '';
  }

  /**
   * @get Function for implement STATIC styles for component
   * @returns {CSSResult}
   */
  static get styles() {
    return css`
      :host button, :host textarea, :host input {
        font: inherit;
      }
    `;
  }

  /**
   * @get Function for implement DYNAMIC styles for component
   * @returns {TemplateResult}
   */
  get dynamicStyles() {
    const stylesString = Object.keys(this.constructor.properties)
      .reduce((styles, key) => {
        const renderedProp = this.renderProp(key, this.constructor.properties[key]);
        if (renderedProp) {
          styles.push(renderedProp);
        }
        return styles;
      }, [])
      .join('\n');
    return html`
      :host {
       ${stylesString}
      }
    `;
  }

  // eslint-disable-next-line
  render() {
    return html``;
  }

  static get systemSlotTemplate() {
    return html`<slot name="mo-system"></slot>`;
  }

  registerState(state, id = this.id) {
    const stateName = `${state}-${id}`;
    store.dispatch(registerState(stateName));
  }

  unregisterState(state, id = this.id) {
    const stateName = `${state}-${id}`;
    store.dispatch(unregisterState(stateName));
  }

  registerInitialActiveState(state, id = this.id) {
    const stateName = `${state}-${id}`;
    store.dispatch(registerInitialActiveState(stateName));
  }

  unregisterInitialActiveState(state, id = this.id) {
    const stateName = `${state}-${id}`;
    store.dispatch(unregisterInitialActiveState(stateName));
  }

  reRegisterState(state, id = this.id) {
    const stateName = `${state}-${id}`;
    const stateNameOld = `${state}-${this.oldId}`;
    store.dispatch(reRegisterState({ stateName, stateNameOld }));
  }

  // param states is provided as a string with spaces by default
  // Set separator in param to update, e.g. ','
  setStates(states, id = this.id, includeId = true, separator = ' ') {
    const stateList = states.split(separator).map((state) => {
      const stateName = includeId ? `${state}-${id}` : state;
      return stateName;
    });
    const actualStates = stateList.filter((item) => store.getState().app.registeredStates.includes(item));
    store.dispatch(setStates(actualStates));
    document.body.classList.add(...actualStates);
  }

  pushState(state, id = this.id, includeId = true) {
    const stateName = includeId ? `${state}-${id}` : state;
    store.dispatch(pushState(stateName));
    document.body.classList.add(stateName);
  }

  removeState(state, id = this.id, includeId = true) {
    const stateName = includeId ? `${state}-${id}` : state;
    store.dispatch(removeState(stateName));
    document.body.classList.remove(stateName);
  }

  // eslint-disable-next-line class-methods-use-this
  nextState() {
    store.dispatch(forwardState());
  }

  // eslint-disable-next-line class-methods-use-this
  previousState() {
    store.dispatch(backwardState());
  }

  handleShadowRootStateChange(level = 0) {
    if (!document.getElementById(this.id)) {
      const eventData = { id: this.id, level: level * 100 };
      this.emitCustomEvent('shadowRootStateChanged', { detail: eventData });
    }
  }

  addLevel() {
    const level = this.getLevel().topLevel + 1;
    setLevelCallback(this, level);
    this.handleShadowRootStateChange(level);
    return store.dispatch(addLevel());
  }

  removeLevel(transitionTime = 0) {
    if (transitionTime > 0) {
      setTimeout(() => {
        this.removeLevelDispatch();
      }, transitionTime);
    } else {
      this.removeLevelDispatch();
    }
  }

  removeLevelDispatch() {
    store.dispatch(removeLevel(this.level));
    this.style.setProperty('--level', 0);
    this.handleShadowRootStateChange();
    this.level = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  getLevel() {
    return store.dispatch(getLevel());
  }

  setLevel(level) {
    setLevelCallback(this, level);
    return store.dispatch(setLevel(level));
  }

  /**
   * @typedef {Object} EventData
   * @property {Object} detail - event custom data
   * @property {Boolean} [bubbles] - event behavior option
   * @property {Boolean} [composed] - event behavior option
   */
  /**
   * @param {string} eventName name of created event
   * @param {EventData} props event properties
   */
  emitCustomEvent(eventName, props = {}) {
    if (eventName) {
      const eventProps = { bubbles: true, composed: true, ...props };
      const event = new CustomEvent(eventName, eventProps);
      this.dispatchEvent(event);
      return event;
    }
    throw new Error(`[ERR:Base:fusion] missed eventName: ${eventName}`);
  }

  /**
   * Get all children.
   * Limitation for now: should filter children via possible nestedComponents
   * @return Array List of components
   * */
  /* @todo should filter children via possible nestedComponents */
  getChildComponents() {
    return Array.from(this.children);
  }
}

export { FusionBase };
