import { html, css, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  ModeTrackable,
  SlideComponentBase,
} from '../../mixins';
import IScroll from '../../_vendor/iscroll.min.js';
import {
  isReflectiveBoolean,
  promisifyEvent,
} from '../../utils';
import { FusionLogger } from '../../services/fusion-logger';
import {
  Container,
  Dimensions,
  Background,
  Display,
  FieldDefinition,
  DisplayFlex,
  Alignment,
} from '../../mixins/props';

class FusionScroll extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  Background,
  Display,
  ModeTrackable,
  FieldDefinition,
  DisplayFlex,
  Alignment,
]) {
  static get properties() {
    const {
      position,
      top,
      left,
      width,
      height,
      opacity,
      'background-color': backgroundColor,
      overflow,
      ...filteredProps
    } = super.properties;
    return {
      ...filteredProps,
      position: {
        ...position,
        selectOptions: [
          { value: 'absolute', icon: 'positionabsolute' },
          { value: 'relative', icon: 'positionrelative' },
          { value: 'fixed', icon: 'positionfixed' },
          { value: 'static', icon: 'x-small' },
        ],
      },
      top,
      left,
      width: {
        ...width,
        value: '500px',
        availableUnits: [
          { unitType: 'px' },
          { unitType: '%' },
          { unitType: 'vw' },
          { unitType: 'vmin' },
          { unitType: 'vmax' },
        ],
      },
      height: {
        ...height,
        value: '500px',
        availableUnits: [
          { unitType: 'px' },
          { unitType: '%' },
          { unitType: 'vh' },
          { unitType: 'vmin' },
          { unitType: 'vmax' },
        ],
      },
      'scroll-group-width': {
        ...width,
        propertyGroup: 'scroll',
        value: '490px',
      },
      'scroll-group-height': {
        ...height,
        propertyGroup: 'scroll',
        value: '490px',
      },
      'vertical-scroll': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'scroll',
        value: isReflectiveBoolean(),
        prop: true,
      },
      'horizontal-scroll': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'scroll',
        value: isReflectiveBoolean(),
        prop: true,
      },
      momentum: {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'scroll',
        value: isReflectiveBoolean(),
        prop: true,
      },
      'fade-scrollbars': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'scroll',
        value: false,
        prop: true,
      },
      'scroll-width': {
        ...width,
        propertyGroup: 'scroll',
        value: '10px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'scroll-background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'scroll',
        value: 'rgba(255, 255, 255, 0)',
      },
      'handle-border-width': {
        ...width,
        propertyGroup: 'scroll',
        value: '0px',
        availableUnits: [{ unitType: 'px' }],
      },
      'handle-border-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'scroll',
        value: 'rgba(255, 255, 255, 0)',
      },
      'handle-border-radius': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'scroll',
        value: '0px',
        min: 0,
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'handle-background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'scroll',
        value: 'rgba(163, 163, 163, 1)',
      },
      'background-color': backgroundColor,
      opacity,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-scroll',
      componentUIName: 'Scroll',
      componentCategory: 'interaction',
      componentDescription: 'Scroll component for creating scrollable area',
      rotatable: false,
    };
  }

  parentStateChanged(parentState) {
    super.parentStateChanged(parentState);
    this.refreshScroll();
  }

  initObserver() {
    this.observedElements = [this, this.scroller];
    this.resizeObserver = new ResizeObserver(this.refreshScroll.bind(this));
    this.observedElements.forEach((element) => this.resizeObserver.observe(element));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.setListenerType('removeEventListener');
    this.destroyScroll();
    this.observedElements.forEach((element) => this.resizeObserver.unobserve(element));
  }

  setListenerType(listenerType) {
    this[listenerType]('pointerdown', this.constructor.stopPropagation);
    this[listenerType]('touchstart', this.constructor.stopPropagation);
  }

  static stopPropagation(event) {
    event.stopPropagation();
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.isRendered) {
      this.reInitIScrollByOptions(changedProps);
    }
  }

  async initIScroll() {
    await promisifyEvent(this, 'rendered');
    this.createIScroll();
  }

  /**
   * @description Get base options for the iScroll. More options you can find there => https://github.com/cubiq/iscroll#understanding-the-core
   * @param {object.<string, string>} customOptions
   * @return {object.<string, string>}
   */
  // @todo iscroll have an issue with transition conflict between momentum and bouncing animation, that's why in options we used 'useTransition: false'
  getScrollOptions(customOptions = {}) {
    return {
      scrollX: this['horizontal-scroll'],
      scrollY: this['vertical-scroll'],
      scrollbars: 'custom',
      preventDefault: false,
      fadeScrollbars: this['fade-scrollbars'],
      momentum: this.momentum,
      mouseWheel: true,
      useTransition: false,
      interactiveScrollbars: true,
      ...customOptions,
    };
  }

  /**
   * @description Get triggers which will fire iScroll reinitialize
   * @param {array.<string>} triggers - options which should reinitialize iScroll
   * @return {array.<string>}
   */
  static getIScrollOptionsTrigger(triggers = []) {
    return ['horizontal-scroll', 'vertical-scroll', 'fade-scrollbars', 'momentum', ...triggers];
  }

  static shouldReInitIScroll(changedProps) {
    return this.getIScrollOptionsTrigger()
      .some((property) => changedProps.has(property));
  }

  reInitIScrollByOptions(changedProps) {
    if (this.constructor.shouldReInitIScroll(changedProps)) {
      this.destroyScroll();
      this.createIScroll();
    }
  }

  createIScroll() {
    if (this.wrapper instanceof HTMLElement) {
      this.iScroll = new IScroll(this.wrapper, this.getScrollOptions());
    } else {
      FusionLogger.error('The wrapper didn\'t init yet', 'FusionScroll');
    }
  }

  refreshScroll() {
    if (this.iScroll) {
      this.iScroll.refresh();
    }
  }

  destroyScroll() {
    if (this.iScroll) {
      this.iScroll.destroy();
    }
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.wrapper = this.shadowRoot.querySelector('.scroll-wrapper');
    this.scroller = this.shadowRoot.querySelector('fusion-group');
    this.initIScroll();
    this.initObserver();
  }

  static get styles() {
    return [
      super.styles,
      css`
      .scroll-wrapper {
        position: relative;
        height: 100%;
        width: 100%;
        overflow: hidden;
        background-color: var(--background-color);
      }
      .iScrollHorizontalScrollbar,
      .iScrollVerticalScrollbar {
        position: absolute;
        border-radius: var(--handle-border-radius);
        background-color: var(--scroll-background-color);
       }
      .iScrollHorizontalScrollbar {
        height: var(--scroll-width);
        left: 0;
      }
      .iScrollHorizontalScrollbar .iScrollIndicator {
        height: var(--scroll-width);
      }
      .iScrollVerticalScrollbar {
        width: var(--scroll-width);
        top: 0;
      }
      .iScrollVerticalScrollbar {
        height: 100%;
        left: calc(100% - var(--scroll-width));
      }
      .iScrollVerticalScrollbar.iScrollBothScrollbars {
        height: calc(100% - var(--scroll-width));
      }
      .iScrollHorizontalScrollbar {
        width: 100%;
        top: calc(100% - var(--scroll-width));
      }
      .iScrollHorizontalScrollbar.iScrollBothScrollbars {
        width: calc(100% - var(--scroll-width));
      }
      .iScrollIndicator {
        background-color: var(--handle-background-color);
        box-shadow: inset 0 0 0 var(--handle-border-width) var(--handle-border-color);
        border-radius: var(--handle-border-radius);
        box-sizing: border-box;
      }
      :host(:not(.${unsafeCSS(ModeTrackable.EditModeClassName)})) {
        overflow: hidden;
      }
      :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) #scroller {
        border: 1px dashed rgba(0, 0, 0, .5);
      }
      `,
    ];
  }

  render() {
    return html`
      <style>
         ${this.dynamicStyles}
      </style>
      <div class="scroll-wrapper">
        <fusion-group
          id="scroller"
          top="0"
          left="0"
          width="${this['scroll-group-width']}"
          height="${this['scroll-group-height']}"
          flex-direction="${this['flex-direction']}"
          data-horizontal="${this['data-horizontal']}"
          data-vertical="${this['data-vertical']}"
          ><slot></slot></fusion-group>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionScroll };
