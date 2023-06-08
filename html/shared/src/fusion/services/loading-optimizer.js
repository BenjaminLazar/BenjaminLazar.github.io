import { FusionStore } from './fusion-store';
import { registerState } from '../_actions/app';
import { FusionPopup } from '../slide/popup';
import { FusionStateContainer } from '../slide/state-container';
import { FusionLogger } from './fusion-logger';
import { triggerPublishedEventRecursively, triggerEvent } from '../utils';
import { FusionBase } from '../base';
import { commentingStrategies, commentingStrategySymbol } from '../constants';

/**
 * @typedef {object} CommentsRegistryEntry
 * @property {Comment} comment
 * @property {DocumentFragment} fragment
 */

class LoadingOptimizer {
  static get hiddenComponentsBaseConstructors() {
    return [FusionPopup, FusionStateContainer];
  }

  static get commentingStrategiesMap() {
    return {
      [commentingStrategies.inner]: LoadingOptimizer.applyInnerCommentingStrategy,
      [commentingStrategies.outer]: LoadingOptimizer.applyOuterCommentingStrategy,
    };
  }

  constructor() {
    // to store commented out components, their parents and state names
    this.commentsRegistry = new Map();
    this.unsubscribeCurrentState = this.subscribeToCurrentState();
    /* activatorOnly:start */
    this.unsubscribeEditorMode = this.subscribeToEditorMode();
    /* activatorOnly:end */
  }

  /**
   * @param {Function<FusionBase>} constr
   * @return {boolean}
   */
  static isHiddenComponentConstructor(constr) {
    return LoadingOptimizer.hiddenComponentsBaseConstructors
      .some((baseConstructor) => constr[commentingStrategySymbol] !== commentingStrategies.skip
        && (constr === baseConstructor
        || Object.prototype.isPrototypeOf.call(baseConstructor, constr)));
  }

  /**
   * @param {Object.<string, Function<FusionBase>>} constructors
   */
  static getHiddenComponentsConstructors(constructors) {
    return Object.entries(constructors).reduce((registry, [name, next]) => {
      if (LoadingOptimizer.isHiddenComponentConstructor(next)) {
        registry[name] = next;
      }
      return registry;
    }, {});
  }

  /**
   * @param {Object.<string, Function<FusionBase>>} constructors
   */
  static getComponentsByConstructors(constructors) {
    const query = Object.keys(constructors).join(',');
    return document.querySelectorAll(query);
  }

  /**
   * @param {FusionBase} component
   * @param {string} stateName
   * @return {CommentsRegistryEntry}
   */
  static applyOuterCommentingStrategy(component, stateName) {
    FusionStore.dispatch(registerState(stateName));
    const parent = component.parentElement;
    const fragment = document.createDocumentFragment();
    const { comment } = LoadingOptimizer.insertComment([component], parent);
    fragment.appendChild(component);
    return { comment, fragment };
  }

  /**
   * @param {HTMLElement} parent
   * @return {CommentsRegistryEntry}
   */
  static applyInnerCommentingStrategy(parent) {
    const fragment = document.createDocumentFragment();
    const children = [...parent.children];
    const { comment } = LoadingOptimizer.insertComment(children, parent);
    children.forEach((el) => fragment.appendChild(el));
    return { comment, fragment };
  }

  /**
   * @param {FusionBase} component
   * @param {Function<FusionBase>} constr
   */
  createRegistryEntry(component, constr) {
    const stateName = `${constr.state}-${component.id}`;
    const strategy = constr[commentingStrategySymbol] || commentingStrategies.outer;
    const commentingStrategyApplier = LoadingOptimizer.commentingStrategiesMap[strategy];
    const { comment, fragment } = commentingStrategyApplier.call(LoadingOptimizer, component, stateName);
    this.commentsRegistry.set(stateName, { comment, fragment, strategy });
  }

  /**
   * @param {HTMLCollection<FusionBase>} components
   * @param {Object.<string, Function<FusionBase>>} constructors
   */
  commentOutHiddenComponents(components, constructors) {
    [...components].forEach((component) => {
      const componentName = component.tagName.toLowerCase();
      const constr = constructors[componentName];
      if (constr) {
        this.createRegistryEntry(component, constr);
      } else {
        FusionLogger.error(`Could not find constructor for ${componentName}`, 'LoadingOptimizer');
      }
    }, {});
  }

  /**
   * @param {Object.<string, Function<FusionBase>>} constructors
   */
  processHiddenComponents(constructors) {
    const hiddenComponentsConstructors = LoadingOptimizer.getHiddenComponentsConstructors(constructors);
    const hiddenComponents = LoadingOptimizer.getComponentsByConstructors(hiddenComponentsConstructors);
    this.commentOutHiddenComponents(hiddenComponents, hiddenComponentsConstructors);
  }

  static composeStringFromComponents(components) {
    return components.reduce((string, el) => string.concat(el.outerHTML), '');
  }

  /**
   * @param {HTMLElement[]} components
   * @param {HTMLElement} parent
   * @return {{comment: Comment}}
   */
  static insertComment(components, parent) {
    const string = LoadingOptimizer.composeStringFromComponents(components);
    const comment = document.createComment(string);
    parent.insertBefore(comment, components[0]);
    return { comment };
  }

  subscribeToCurrentState() {
    return FusionStore.subscribe('app.currentState', (state) => {
      this.currentStateChanged(state);
    });
  }

  /* activatorOnly:start */
  subscribeToEditorMode() {
    return FusionStore.subscribe('app.isEditMode', (state) => {
      this.editorModeChanged(state);
    });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  /**
   * @param {object} state
   */
  editorModeChanged(state) {
    if (state.app.isEditMode) {
      this.unsubscribeEditorMode();
      this.commentsRegistry.forEach((entry, stateName) => {
        this.handleCommentedStateChanged(entry, stateName);
      });
    }
  }
  /* activatorOnly:end */

  /**
   * @param {CommentsRegistryEntry} entry
   * @param {string} stateName
   */
  handleCommentedStateChanged(entry, stateName) {
    // delete to prevent multiple uncomment for the same element
    this.commentsRegistry.delete(stateName);
    // get reference to the first element before inserting the fragment
    entry.comment.parentElement.replaceChild(entry.fragment, entry.comment);
    // emit 'published' event on all restored elements
    /* activatorOnly:start */
    triggerPublishedEventRecursively(entry.fragment, FusionBase);
    /* activatorOnly:end */
    if (this.commentsRegistry.size === 0) {
      this.unsubscribeCurrentState();
    }
    triggerEvent('loadingOptimizer:component-uncommented');
  }

  /**
   * @param {object} state
   */
  currentStateChanged(state) {
    state.app.currentState.forEach((stateName) => {
      const entry = this.commentsRegistry.get(stateName);
      if (entry) {
        this.handleCommentedStateChanged(entry, stateName);
      }
    });
  }
}

const loadingOptimizer = new LoadingOptimizer();

export { loadingOptimizer };
