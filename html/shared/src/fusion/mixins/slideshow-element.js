import { store } from '../../store';

export function SlideshowElement(superClass) {
  return class extends superClass {
    /**
     * @description Get sorted array by `order-index`property
     * @param {HTMLElement[]} elements
     * @return {number[]} - sorted order indexes
     */
    static getOrderIndexes(elements) {
      return elements
        .map((element) => Number(element['order-index']))
        .sort((a, b) => a - b);
    }

    /**
     * @description Custom sorting for getting ordered HTMLElements by property
     * @param {string} property
     * @param {string[]} list
     * @return {function(HTMLElement, HTMLElement): number}
     */
    static orderElementsByProp(property, list) {
      return (a, b) => list.indexOf(Number(a[property])) - list.indexOf(Number(b[property]));
    }

    /**
     * @description Get ordered elements using custom sorting by property
     * @param {HTMLElement[]} elements
     * @return {HTMLElement[]} sorted elements
     */
    static getSortedElements(elements) {
      return elements.sort(this.orderElementsByProp('order-index', this.getOrderIndexes(elements)));
    }

    /**
     * @description Get an array of current state ids and index of the state position in array
     * @param {HTMLElement[]} elements
     * @return {string[]}
     */
    static getStateIDs(elements) {
      return elements.map((element) => element.id);
    }

    /**
     * @description Get active state for current Node element
     * @param {HTMLElement} node
     * @return {string}
     */
    static getActiveStateId(node) {
      const { currentState } = store.getState().app;
      return this.getStateID(currentState, node);
    }

    /**
     * @description Get an array of current state ids and index of the state position in array
     * @param {string[]} currentStateIDs
     * @param {string} stateId
     * @return {number}
     */
    static getActiveStateIndex(currentStateIDs, stateId) {
      return currentStateIDs.indexOf(stateId);
    }

    /**
     * @description Execute cb function on active state change
     * @param {string[]} currentState
     * @param {HTMLElement} node element
     * @param {function} cb Function that will be executed
     */
    static applyUpdateByActiveState(currentState, node, cb) {
      const activeStateId = this.getStateID(currentState, node);
      cb(activeStateId);
    }

    /**
     * @param {string[]} currentState name
     * @param {HTMLElement} node element
     * @return {string}
     */
    static getStateID(currentState, node) {
      return [...node.children].reduce((acc, child) => {
        let state = acc;
        if (currentState.some((item) => item.endsWith(child.id))) {
          state = child.id;
        }
        return state;
      }, '');
    }

    /**
     * @description Get child elements from parent node
     * @param {HTMLElement} node element
     * @return {HTMLElement[]} child elements
     */
    static getChildElements(node) {
      return [...node.children].filter((element) => element.isStateful);
    }

    /**
     * @description Get sorted elements
     * @param {HTMLElement} node element
     * @return {HTMLElement[]} child sorted elements
     */
    static getOrderedElements(node) {
      const elements = this.getChildElements(node);
      return this.getSortedElements(elements);
    }

    /**
     * @param {string[]} currentStateIDs - registered states
     * @param {number} index - state position in registered states array
     * @return {{swipePossibleToLeft: boolean | *, swipePossibleToRight: boolean | *}}
     */
    static isPossibleToMove(currentStateIDs, index) {
      return {
        goToNext: currentStateIDs.includes(currentStateIDs[index + 1]),
        goToPrevious: currentStateIDs.includes(currentStateIDs[index - 1]),
      };
    }

    static get animationConfig() {
      return {
        horizontal: {
          forward: 'slide-left',
          backward: 'slide-right',
        },
        vertical: {
          forward: 'slide-top',
          backward: 'slide-bottom',
        },
        fading: {
          forward: 'fade-in',
          backward: 'fade-in',
        },
      };
    }

    updateAnimationEffect(position, direction) {
      this.elements[position].setAttribute('effect', this.constructor.animationConfig[this.direction][direction]);
    }
  };
}
