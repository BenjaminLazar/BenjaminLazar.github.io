import { FusionStore } from './services/fusion-store';
import { FusionNavigation } from './navigation';
import {
  freeze,
  unfreeze,
  setActivatorEnv,
  setActivatorMetadata,
  toggleState,
  noteModeStarted,
  noteModeFinished,
  mlrModeStarted,
  mlrModeFinished,
  addWebComponent,
} from './_actions/app.js';
/* activatorOnly:start */
import { editorMessenger } from './editor-messenger';
import { ComponentController } from './services/component-controller';
/* activatorOnly:end */
import { themeApplier } from './theme-applier';
import { VeevaMonitoring } from './services/monitoring';
import { FusionLogger } from './services/fusion-logger';
import config from '../config.json';
import fusion from '../../fusion.json';
import { versionManager } from './services/version-manager';
import { triggerPublishedEventRecursively } from './utils';
import { FusionBase } from './base';

// This is the API accessible from browser via window.Fusion namespace
/* Private methods start */
const { deprecatedComponents, updatedComponentsStructure } = fusion;
const setDefaultTemplate = ({ template = '', element }) => {
  element.innerHTML += template;
};
const getComponentState = (el) => {
  let state = null;
  if (el.state) {
    const name = `${el.state}-${el.id}`;
    const { currentState } = FusionStore.store.getState().app;
    const isActive = currentState.includes(name);
    state = { name, isActive };
  }
  return state;
};
const generateAddedElementData = ({ element, query, options }) => ({
  name: 'fusion/saveAddedComponent',
  data: {
    query,
    options,
    state: getComponentState(element),
    template: element.outerHTML,
    selectorId: element.id,
    tagName: element.tagName,
  },
});
const generateRemovedElementData = ({ query, deselectedElement, state }) => ({
  name: 'fusion/saveRemovedComponent',
  data: {
    query,
    state,
    deselectedElement,
  },
});
const generateUpdateContentData = (data) => ({
  name: 'fusion/updateContent',
  data,
});
const generateSaveAttributesData = (data) => ({
  name: 'actions/saveAttributes',
  data,
});
const generateSaveStylesData = (data) => ({
  name: 'actions/saveStyles',
  data,
});
const generateSaveOuterDataContent = (data) => ({
  name: 'fusion/saveOuterDataContent',
  data,
});

const shouldAdjustState = (state, enforcedState) => {
  const { currentState } = FusionStore.store.getState().app;
  return currentState.includes(state) !== enforcedState;
};

const checkElementPublish = async ({ parent, query }) => {
  const element = parent || document.querySelector(query);
  if (element.untilPublished instanceof Promise) {
    await element.untilPublished;
  }
};

const shouldToggle = (state, enforcedState) => enforcedState === null || shouldAdjustState(state, enforcedState);

/* Private methods end */
class FusionApi {
  // @todo: need remove and update editor
  static get isEditMode() {
    return FusionStore.isEditMode;
  }

  static getRootNode() {
    const { rootSelector } = config;
    return document.querySelector(rootSelector.slide) || document.querySelector(rootSelector.email) || document.querySelector(rootSelector.brief) || document.querySelector(rootSelector.fragment) || FusionLogger.error('Root element wasn\'t found', 'api');
  }

  static isFragment() {
    return this.getRootNode()?.classList.contains('fragment');
  }

  /**
   * Create the base for a new Fusion element.
   * @param name
   * @param properties
   * @param template
   * @returns {any}
   */
  static async createElementBase(name, properties, template) {
    const element = document.createElement(name);
    element.setAttribute('id', this.generateId());
    this.setAttributes({ properties, element });
    setDefaultTemplate({ template, element });
    return element;
  }

  /**
   * Add Fusion element to slide or email.
   * @private
   * @static
   * @param name
   * @param properties
   * @param template
   * @param parent
   * @returns {any}
   */
  static async addElement(name, properties, template, parent) {
    const element = await this.createElementBase(name, properties, template);
    parent.appendChild(element);
    return element;
  }

  /**
   * Add Fusion element to slide or email before another element.
   * @private
   * @static
   * @param name
   * @param position
   * @param properties
   * @param template
   * @param parent
   * @returns {any}
   */
  static async insertElementBefore(name, properties, template, parent, position) {
    const element = await this.createElementBase(name, properties, template);
    if (typeof position === 'number' && parent.children[position]) {
      parent.insertBefore(element, parent.children[position]);
    } else {
      parent.appendChild(element);
    }
    return element;
  }

  /**
  * Private method for save API. Use only in class
  * @private
  * @static
  * */
  static async saveElement(element, query, parent, options) {
    return this.sendSaveRequest('saveAddedComponent', {
      element,
      query: query || parent.id,
      options,
      parent: parent.outerHTML,
    });
  }

  /**
   +   * Private method for update content API. Use only in class
   +   * @static
   +   * @param data.query {string} Query for save element
   +   * @param data.element {HTMLElement} Element that will be saved
   +   * @param data.options {object} Additional params for saving
   +   * */
  static async updateContent(data) {
    await checkElementPublish({ query: data.query });
    return this.sendSaveRequest('updateContent', data);
  }

  /**
    * Private method for saving `outerHTML` content API. Use only in class
    * @static
    * @param {HTMLElement} el that will be saved
    * */
  static async saveOuterDataContent(el) {
    await checkElementPublish({ query: `#${el.id}` });
    return this.sendSaveRequest('saveOuterDataContent', { el });
  }

  /** Private method for send request to Activator from Fusion part
   * @private
   * @static
   * @param name
   * @param options
   */
  static sendSaveRequest(name, options) {
    let requestObj = null;
    const map = {
      saveAddedComponent: generateAddedElementData,
      saveRemovedComponent: generateRemovedElementData,
      saveAttributes: generateSaveAttributesData,
      saveStyles: generateSaveStylesData,
      updateContent: generateUpdateContentData,
      saveOuterDataContent: generateSaveOuterDataContent,
    };

    if (Object.prototype.hasOwnProperty.call(map, name)) {
      requestObj = map[name](options);
      requestObj.data.ignoreUndo = options.ignoreUndo;
      if (options.parent) {
        requestObj.data.parent = options.parent;
      }
      this.request(requestObj);
    } else {
      throw new Error(`Unknown save request name ${name}`);
    }
  }

  /** get actions connected to element
   * @static
   * @param {string} id
   * @returns {boolean}
   * @returns {Array<HTMLElement>}
   */
  static getElementActions(id) {
    const selectorAttrs = ['on', 'to'];
    const relatedActionsSelector = selectorAttrs
      .map((attr) => `fusion-action[${attr}*="#${id}"]`).join(', ');
    const actionElements = [...document.querySelectorAll(relatedActionsSelector)];
    return actionElements;
  }

  /** Private method to delete actions, connected to the removed element
   * @private
   * @static
   * @param {string} id
   * @returns {boolean}
   */
  static checkActionsDeletion(id) {
    const actionElements = this.getElementActions(id);
    actionElements.forEach((el) => this.deleteElement(el.id, false, true));
    return !!actionElements.length;
  }

  // Are we in iRep, Accelerator, Activator, or Fusion Presentation?
  static get env() {
    return false;
  }

  static get isTouchSupported() {
    return 'ontouchstart' in window;
  }

  static get subscribe() {
    return FusionStore.subscribe;
  }

  static getEventsPreset() {
    return this.isTouchSupported ? {
      upEvent: 'touchend',
      startEvent: 'touchstart',
      moveEvent: 'touchmove',
    } : {
      upEvent: 'mouseup',
      startEvent: 'mousedown',
      moveEvent: 'mousemove',
    };
  }

  static goTo(slide, presentation, direction, isDocId) {
    const navigationData = FusionNavigation.goTo(slide, presentation, direction, isDocId);
    if (FusionNavigation.isActivatorGoTo(FusionStore.isActivator, FusionStore.isEditMode)) {
      this.request(navigationData);
    }
  }

  static trackCustomData(data) {
    VeevaMonitoring.trackCustomData(data);
  }

  static async getThemeConfig(configPreviewUrl = '') {
    return themeApplier.getConfig(configPreviewUrl);
  }

  /* activatorOnly:start */
  /**
   * @description receiving array of fragments names from fragment folders
   * @note {array<string>} process.env.FRAGMENT_DEFINE - env variable set in webpack
   * @returns {Array<String>}
   */
  static getFragments() {
    return process.env.DEFINED_FRAGMENTS;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static updateElementTree() {
    FusionApi.request({
      name: 'fusion/updateElementTree',
    });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static setIframeSize(data) {
    FusionApi.request({
      name: 'fusion/setIframeSize',
      data,
    });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static getArticleRootNode(root, rootSelector) {
    const elementTree = {
      children: [],
      componentName: rootSelector,
      fieldIcon: '',
      fieldName: 'Slide 1',
      hidden: false,
      id: root.id,
      required: false,
      'show-in-editor': false,
    };

    elementTree.children = [...root.children].map((child) => child?.getNodeInfo && child.getNodeInfo())
      .filter((el) => !!el)
      .flat();
    return elementTree;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static getElementTree() {
    const { rootSelector } = config;
    let elementTree = {};
    let root = FusionApi.getRootNode();
    if (root && root.matches(rootSelector.email)) {
      root = [...root.children].find((child) => child?.getNodeInfo) || root;
    }
    if (root?.getNodeInfo) {
      elementTree = root.getNodeInfo();
    } else {
      elementTree = this.getArticleRootNode(root, rootSelector);
    }
    return elementTree;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  /**
   * @param {{ name: String, data: Object }} data
   */
  static request(data) {
    return editorMessenger.request(data);
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  /**
   *
   * @param name - Component name
   * @param properties - Component static props
   * @param template - Template Component static template
   * @param parent - Parent element where we will append element
   * @param query - csspath for parent element
   * @param options - pack of params for behaviour
   * @returns {HTMLElement}
   */
  static async createElement(name, properties = {}, template, parent, query, options = {}) {
    const defaultOptions = { setActive: true, setState: true, insertBefore: undefined };
    const opts = { ...defaultOptions, ...options };
    if (!name) throw new Error('[ERR:Components:UI] Unknown name');
    await checkElementPublish({ parent });
    let element = null;
    if (typeof opts.insertBefore === 'number') {
      element = await this.insertElementBefore(name, properties, template, parent, opts.insertBefore);
    } else {
      element = await this.addElement(name, properties, template, parent, opts);
    }
    const { attrs } = await FusionApi.getMoData();
    FusionApi.createActivatorAttrs(element, attrs);
    await this.saveElement(element, query, parent, opts);
    triggerPublishedEventRecursively(element, FusionBase);
    return element;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static createActivatorAttrs(element, attrs) {
    element.setAttribute(attrs.category, attrs.categories.component);
    element.setAttribute(attrs.type, attrs.categories.component);
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static deleteElement(id, deselectedElement, ignoreUndo, deleteRelatedActions = true) {
    if (deleteRelatedActions) {
      this.checkActionsDeletion(id);
    }
    const element = document.getElementById(id);
    let parent = null;
    if (element) {
      const state = getComponentState(element);
      parent = element.parentNode;
      // save the actual parent before the element is deleted in order to know where to insert it by undo
      const clonedNode = parent.cloneNode(true);
      // @todo: would be better to make this method async, but in that case we will break stuff in the editor
      checkElementPublish({ parent }).then(() => {
        parent.removeChild(element);
        this.sendSaveRequest('saveRemovedComponent', {
          state,
          element,
          ignoreUndo,
          deselectedElement,
          query: `#${id}`,
          parent: clonedNode.outerHTML,
        });
      });
    } else {
      throw new Error(`[ERR:deleteElement:Fusion] Could not find element with ID ${id}`);
    }
    return parent;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  /**
   * @description check DOM element by received query selector
   * @param {String} query - query selector of DOM element
   */
  static async checkElement(query) {
    const element = document.querySelector(query);
    if (element) {
      await checkElementPublish({ parent: element.parentNode });
    } else {
      FusionLogger.warn(`Element ${query} doesn't exist in DOM`, 'api');
    }
    return element;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static async saveAttributes(query, attributes, ignoreUndo = true) {
    return await this.checkElement(query) && this.sendSaveRequest('saveAttributes', { query, attributes, ignoreUndo });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static async saveStyles(query, styles, ignoreUndo = true) {
    return await this.checkElement(query) && this.sendSaveRequest('saveStyles', { query, styles, ignoreUndo });
  }
  /* activatorOnly:end */

  static getCurrentState() {
    return FusionStore.store.getState().app.currentState;
  }

  static getRegisteredStates() {
    return FusionStore.store.getState().app.registeredStates;
  }

  static getReadyForScreenShot() {
    return FusionStore.store.getState().app.readyForScreenShot;
  }

  static getRegisteredZoomContainers() {
    return FusionStore.store.getState().app.registeredZoomContainers;
  }

  static isLazy() {
    return process.env.FUSION_LAZY === 'lazy';
  }

  /**
   * As Activator.js is separate script, we load data from localstorage and push to Redux store
   */
  static addWebComponent() {
    if (process.env.FUSION_BUILD_TYPE === 'slide') {
      let componentsList = [];
      try {
        componentsList = JSON.parse(localStorage.getItem('webComponents'));
      } catch (e) {
        componentsList = window.webComponents;
      }
      componentsList.forEach((el) => FusionStore.store.dispatch(addWebComponent(el)));
      return FusionStore.store.getState().app.webComponents;
    }
    return this.getRegisteredComponents();
  }

  static getRegisteredComponents() {
    return FusionStore.store.getState().app.registeredComponents;
  }

  /* activatorOnly:start */
  static runComponentMethod(data) {
    ComponentController.runMethod(data);
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static freeze() {
    return FusionStore.store.dispatch(freeze());
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static unfreeze() {
    return FusionStore.store.dispatch(unfreeze());
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static noteModeStarted() {
    return FusionStore.store.dispatch(noteModeStarted());
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static noteModeFinished() {
    return FusionStore.store.dispatch(noteModeFinished());
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static mlrModeStarted() {
    return FusionStore.store.dispatch(mlrModeStarted());
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static mlrModeFinished() {
    return FusionStore.store.dispatch(mlrModeFinished());
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static setActivatorEnv() {
    editorMessenger.initPublishing();
    return FusionStore.store.dispatch(setActivatorEnv());
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static setActivatorMetadata(metadata) {
    return FusionStore.store.dispatch(setActivatorMetadata(metadata));
  }
  /* activatorOnly:end */

  static generateId() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  }

  static toggleState(state, enforcedState = null) {
    if (shouldToggle(state, enforcedState)) {
      FusionStore.store.dispatch(toggleState(state));
      document.body.classList.toggle(state);
    }
  }

  static updateLevelById(id) {
    const el = document.getElementById(id);
    if (el && el.removeLevel) {
      el.removeLevel();
      el.addLevel();
    }
  }

  /* activatorOnly:start */
  /**
   * Attributes option object.
   * @typedef {Object} UpdateAttrOptions
   * @property {Boolean} isComponent - value of attribute
   * @property {String} selectorId - id of DOM element
   * @property {AttrConfig[]} attrList
   */
  /**
   * @param {UpdateAttrOptions} data
   */
  static updateAttributeList(data) {
    return this.request({
      name: 'actions/updateAttributeList',
      data,
    });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  /**
   * @param {LitElementProperty} data - any LitElementProperty options
   */
  static updateDynamicProperty(data) {
    return this.request({
      name: 'actions/updateDynamicProperty',
      data,
    });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static getMoData() {
    return this.request({
      name: 'actions/getMoData',
    });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static selectElement(data) {
    return this.request({
      name: 'fusion/selectElement',
      data,
    });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static addComponent(data) {
    return this.request({
      name: 'fusion/addComponent',
      data,
    });
  }
  /* activatorOnly:end */

  /**
   *
   * @param {object} properties of component
   * @param {HTMLElement} component
   */
  static setAttributes({ properties = {}, element }) {
    Object
      .keys(properties)
      .forEach((propertyName) => {
        const { value } = properties[propertyName];
        value !== false
          ? element.setAttribute(propertyName, value)
          : element.removeAttribute(propertyName);
      });
  }

  static get deprecatedComponents() {
    return deprecatedComponents;
  }

  static get updatedComponentsStructure() {
    return updatedComponentsStructure;
  }

  static get getCurrentVersion() {
    return versionManager.getVersion();
  }

  static get getResponsive() {
    const { responsive } = config;
    return responsive;
  }

  /* activatorOnly:start */
  static enableSetting() {
    return this.request({
      name: 'actions/enableSetting',
    });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static enableEditMode(data) {
    return this.request({
      name: 'actions/enableEditMode',
      data,
    });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static enableContentMedia() {
    return this.request({
      name: 'actions/enableContentMedia',
    });
  }
  /* activatorOnly:end */

  static isCurrentVersionAbove(version) {
    return versionManager.isCurrentVersionAbove(version);
  }

  static isCurrentVersionBelow(version) {
    return versionManager.isCurrentVersionBelow(version);
  }
}

export { FusionApi };
