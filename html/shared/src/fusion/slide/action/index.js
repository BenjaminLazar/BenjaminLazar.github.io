import { html } from 'lit-element';
import { FusionBase } from '../../base';
import { FusionApi } from '../../api';
import { FusionLogger } from '../../services/fusion-logger';
import { applyMixins, SlideComponentBase } from '../../mixins';
import { SlideFragment } from '../slide-fragment';
import config from '../../../config.json';

class FusionAction extends applyMixins(FusionBase, [SlideComponentBase]) {
  static get animationAttr() {
    return 'data-anijs';
  }

  static isDocIdNavigation() {
    const { navigation } = config;
    let value = false;
    if (navigation && Object.prototype.hasOwnProperty.call(navigation, 'gotoSlideV2')) {
      value = navigation.gotoSlideV2;
    } else {
      FusionLogger.error('Missed "navigation" object in config.json, by default actions use slide package name navigation', 'FusionAction');
    }
    return value;
  }

  static get properties() {
    return {
      if: {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'action',
        value: 'click',
        selectOptions: [
          'click',
          'dblclick',
          'enter',
          'exit',
          'focus',
          'blur',
          'scroll',
          'animationstart',
          'animationend',
          'transitionstart',
          'transitionend',
          'dragstart',
          'drag',
          'dragend',
          'loadNotification',
          '$custom',
        ],
      },
      on: {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'action',
        value: 'document',
        selectOptions: [
          'document',
          'notifier',
        ],
      },
      to: {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'action',
        value: '',
        selectOptions: [
          'target',
          '$parent',
          '$closest',
          '$find',
          '$children',
          '$slide',
          '$binder',
        ],
      },
      do: {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'action',
        value: '',
        selectOptions: [
          'Navigate',
          'Next slide',
          'Previous slide',
          // 'toggleActivation',
          // 'activate',
          // 'inactivate',
          'Apply state',
          'Remove state',
          'Toggle state',
          'Set states',
          'Activate next state',
          'Inactivate current state',
          // '$clone',
          // '$remove',
          'Zoom content',
          'Toggle animated class',
          'Add animated class',
          'Remove animated class',
          'Bounce animation',
          'Fade-in animation',
          'Fade-out animation',
          'Pulse animation',
          'Slide-in from left',
          'Slide-in from right',
          'Slide-in from top',
          'Slide-in from bottom',
        ],
      },
      docIdNavigation: {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'action',
        value: this.isDocIdNavigation(),
        prop: true,
      },
      binder: {
        type: String,
        fieldType: 'String',
        propertyGroup: 'action',
        value: '',
      },
      slide: {
        type: String,
        fieldType: 'String',
        propertyGroup: 'action',
        value: '',
      },
      state: {
        type: String,
        fieldType: 'String',
        propertyGroup: 'action',
        value: '',
      },
      'zoom-container': {
        type: String,
        fieldType: 'String',
        propertyGroup: 'action',
        value: '',
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-action',
      componentUIName: 'Action',
      componentType: 'system',
      componentCategory: 'other',
      componentDescription: 'Adds interactions and animations to components and other elements',
      isRootNested: false,
      nestedComponents: [],
      isAction: true,
      goToProps: {
        docIdNavigation: this.isDocIdNavigation(),
        binder: '',
        slide: '',
      },
      stateProps: {
        state: '',
      },
      zoomProps: {
        'zoom-container': '',
      },
    };
  }

  // For backward compatibility
  // @deprecated
  static get OLD_METHODS() {
    return {
      toggleActivation: 'toggleActivation',
      nextState: 'nextStateHandler',
      $applyState: 'applyStateHandler',
      previousState: 'previousStateHandler',
      $removeState: 'removeStateHandler',
      $toggleState: 'toggleStateHandler',
      $setStates: 'setStatesHandler',
      $navigate: 'navigate',
      $next: 'next',
      $previous: 'previous',
    };
  }

  static get SUPPORTED_METHODS() {
    return {
      enter: 'open',
      exit: 'close',
      'Toggle activation': 'toggleActivation',
      'Activate next state': 'nextStateHandler',
      'Inactivate current state': 'previousStateHandler',
      'Apply state': 'applyStateHandler',
      'Remove state': 'removeStateHandler',
      'Toggle state': 'toggleStateHandler',
      'Set states': 'setStatesHandler',
      Navigate: 'navigate',
      'Next slide': 'next',
      'Previous slide': 'previous',
      'Zoom content': 'zoomContent',
      ...this.OLD_METHODS,
    };
  }

  // For backward compatibility
  // @deprecated
  static get OLD_ANIMATIONS() {
    return {
      bounce: 'bounce',
      fadeIn: 'fadeIn',
      fadeOut: 'fadeOut',
      pulse: 'pulse',
      slideInLeft: 'slideInLeft',
      slideInRight: 'slideInRight',
    };
  }

  static get SUPPORTED_ANIMATIONS() {
    return {
      'Toggle animated class': '$toggleClass',
      'Add animated class': '$addClass',
      'Remove animated class': '$removeClass',
      'Bounce animation': 'bounce',
      'Fade-in animation': 'fadeIn',
      'Fade-out animation': 'fadeOut',
      'Pulse animation': 'pulse',
      'Slide-in from left': 'fadeInLeftBig',
      'Slide-in from right': 'fadeInRightBig',
      'Slide-in from top': 'fadeInDownBig',
      'Slide-in from bottom': 'fadeInUpBig',
      ...this.OLD_ANIMATIONS,
    };
  }

  async createBehavior() {
    const todo = this.constructor.getAction(this.do);
    const actionHandler = this.constructor.getActionHandler(todo);
    let target = this.getTarget();
    // Translate into AniJS strings
    // @todo simplify this logic
    if (this.if === 'loadNotification') {
      this.if = 'onRunFinished';
    }
    if (this.on === 'notifier') {
      this.on = '$AniJSNotifier';
    }
    if (this.on === '$AniJSNotifier') {
      target = true;
    }
    if (target && actionHandler) {
      this.listenerHandler = this[actionHandler].bind(this);
      if (this.if === 'onRunFinished') {
        await this.untilPublished;
        this.listenerHandler();
      } else {
        target.addEventListener(this.if, this.listenerHandler);
        this.removeAnimation();
      }
    } else if (target) {
      this.setAnimation();
    } else {
      document.addEventListener('loadingOptimizer:component-uncommented', this.createBehavior.bind(this), { once: true });
      FusionLogger.error(`Target not found: ${this.on}`, 'fusion-action');
    }
  }

  getTargetFromRoot(root) {
    const rootElement = (this.isInnerShadowRootAction() && !FusionApi.isFragment()) ? this.getRootNode() : root;
    return rootElement.querySelector(this.on);
  }

  isRootTarget() {
    return this.on === 'document';
  }

  isInnerShadowRootAction() {
    const actionTarget = document.querySelector(this.on);
    // NOTE: should be `getElementById` because `.contains` doesn't work on iPad
    return !document.contains(actionTarget) && !document.getElementById(this.id);
  }

  getTarget() {
    const root = FusionApi.getRootNode();
    return this.isRootTarget() ? root : this.getTargetFromRoot(root);
  }

  static getAction(todo) {
    return todo;
  }

  static getActionHandler(todo) {
    return this.SUPPORTED_METHODS[todo];
  }

  static getAnimationHandler(todo) {
    return this.SUPPORTED_ANIMATIONS[todo];
  }

  isAnimation() {
    return this.getAttribute(this.constructor.animationAttr);
  }

  removeTargetAnimationClass() {
    const target = this.getTarget();
    target.classList.remove(this.constructor.getAnimationHandler(this.do), 'animated');
    FusionApi.saveAttributes(`#${target.id}`, { ['class']: target.className });
  }

  async setAnimation() {
    const animation = this.constructor.getAnimationHandler(this.do);
    const attrValue = `if: ${this.if}, on: ${this.on}, do: ${animation} animated, to: ${this.to}`;
    if (attrValue !== this.getAttribute(this.constructor.animationAttr)) {
      this.setAttribute(this.constructor.animationAttr, attrValue);
      await this.untilPublished;
      FusionApi.saveAttributes(`#${this.id}`, { [this.constructor.animationAttr]: attrValue });
    }
  }

  static hasTargetAction(target) {
    const actionElements = FusionApi.getElementActions(target.id);
    return actionElements.length;
  }

  targetActionClassHandler() {
    const target = this.getTarget();
    if (target && !target.classList.contains('has-actions') && this.constructor.hasTargetAction(target)) {
      target.classList.add('has-actions');
    } else if (target && target.classList.contains('has-actions') && !this.constructor.hasTargetAction(target)) {
      target.classList.remove('has-actions');
    }
  }

  removeAnimation() {
    if (window.AniJS && this.isAnimation()) {
      this.removeAttribute(this.constructor.animationAttr);
      FusionApi.saveAttributes(`#${this.id}`, { [this.constructor.animationAttr]: '' });
      this.removeTargetAnimationClass();
    }
  }

  removeListener() {
    if (this.listenerHandler) {
      const target = this.getTarget();
      this.targetActionClassHandler();
      target.removeEventListener(this.if, this.listenerHandler);
    }
  }

  isActionChanged(changedProps) {
    return this.do && changedProps.get('do');
  }

  isStateChanged(changedProps) {
    return this.state && changedProps.get('state');
  }

  isZoomContainerChanged(changedProps) {
    return this['zoom-container'] && changedProps.get('zoom-container');
  }

  changeHandler(changedProps) {
    const doValue = changedProps.get('do') || this.do;
    const oldAction = this.constructor.getAction(doValue);
    if (this.constructor.getActionHandler(oldAction)) {
      this.removeListener();
    }
  }

  shouldChange(changedProps) {
    return this.isActionChanged(changedProps) || this.isStateChanged(changedProps) || this.isZoomContainerChanged(changedProps);
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.shouldChange(changedProps)) {
      this.changeHandler(changedProps);
    }
    this.createBehavior();
    this.targetActionClassHandler();
  }

  connectedCallback() {
    super.connectedCallback();
    // prevent animation on slide load after saving animation class on deselect
    if (this.isAnimation()) {
      const target = this.getTarget();
      target.classList.remove(this.constructor.getAnimationHandler(this.do));
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener();
    if (this.isAnimation()) {
      this.removeTargetAnimationClass();
    }
  }

  applyStateHandler() {
    this.pushState(this.state, '', false);
  }

  removeStateHandler() {
    this.removeState(this.state, '', false);
  }

  toggleStateHandler() {
    FusionApi.toggleState(this.state, '');
  }

  setStatesHandler() {
    this.setStates(this.state, '', false);
  }

  nextStateHandler() {
    this.nextState();
  }

  previousStateHandler() {
    this.previousState();
  }

  navigate() {
    FusionApi.goTo(this.slide, this.binder, 'target', this.hasAttribute('docIdNavigation'));
  }

  next() {
    FusionApi.goTo(this.slide, this.binder, 'next');
  }

  previous() {
    FusionApi.goTo(this.slide, this.binder, 'previous');
  }

  // Activate a stateful element
  open(event) {
    const el = this.getElementForAction(event);
    el && el.activate ? el.activate() : this.getErrorLog();
  }

  // Inactivate a stateful element
  close(event) {
    const el = this.getElementForAction(event);
    el && el.inactivate ? el.inactivate() : this.getErrorLog();
  }

  // Toggle activation in stateful element
  toggleActivation(event) {
    const el = this.getElementForAction(event);
    if (el && el.inactivate && el.activate) {
      el.active ? el.inactivate() : el.activate();
    } else {
      this.getErrorLog();
    }
  }

  getErrorLog() {
    return FusionLogger.log(`Element with id ${this.to} does not found in the document`, 'FusionAction');
  }

  getElementForAction(event) {
    const { currentTarget: { parentNode: element } } = event;
    return this.isInnerShadowRootAction() ? this.getElementFromFragment(element) : document.querySelector(this.to);
  }

  getElementFromFragment(element) {
    return element.host instanceof SlideFragment ? element.querySelector(this.to) : this.getElementFromFragment(element.parentNode);
  }

  createRoot() {
    return this;
  }

  zoomContent(event) {
    const group = document.querySelector(this['zoom-container']);
    if (group) {
      const wrap = group.shadowRoot.querySelector('.fusion-zoom-container');
      const target = this.getElementForAction(event);
      const clone = target.cloneNode(true);
      clone.style.width = '100%';
      clone.style.top = 0;
      clone.style.left = 0;
      const htmlToInsert = clone.outerHTML;
      wrap.innerHTML = htmlToInsert;
      wrap.style.width = `${target.offsetWidth}px`;
      wrap.style.height = `${target.offsetHeight}px`;
    } else {
      FusionLogger.warn(`Missed 'fusion-zoom-container' component for '${this.do}' interaction`, 'FusionAction');
    }
  }

  // eslint-disable-next-line
  render() {
    return html``;
  }
}

export { FusionAction };
