import { css, html, unsafeCSS } from 'lit-element';
import RangeTouch from 'rangetouch';
import { FusionBase } from '../../base';
import { applyMixins, ModeTrackable, SlideComponentBase } from '../../mixins';
import { getValueObject } from '../../utils';
import {
  Container,
  Dimensions,
  Background,
  Display,
  FieldDefinition,
} from '../../mixins/props';

class FusionSlider extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  Background,
  Display,
  ModeTrackable,
  FieldDefinition,
]) {
  static get properties() {
    const {
      top,
      left,
      width,
      height,
      'background-color': backgroundColor,
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
      width: {
        ...width,
        value: '350px',
      },
      height: {
        ...height,
        value: '30px',
      },
      'slider-height': {
        ...height,
        propertyGroup: 'slider',
        value: '8px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'background-color': {
        ...backgroundColor,
        propertyGroup: 'slider',
        value: 'rgba(235, 235, 235, 1)',
      },
      radius: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'handle',
        value: '30px',
        availableUnits: [{ unitType: 'px' }],
      },
      'handle-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'handle',
        value: 'rgba(0, 0, 0, 1)',
      },
      'use-handle-image': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'handle',
        value: false,
        prop: true,
      },
      'handle-image': {
        type: String,
        fieldType: 'Modal',
        propertyGroup: 'handle',
        assetType: 'Image',
        value: '../shared/src/fusion/slide/slider/assets/images/fusion-slider-handle.png',
      },
      'min-value': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'slider',
        value: '0',
        min: 0,
        prop: true,
      },
      'max-value': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'slider',
        value: '10',
        min: 0,
        prop: true,
      },
      'start-value': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'slider',
        value: '0',
        min: 0,
        prop: true,
      },
      step: {
        type: String,
        fieldType: 'Slider',
        propertyGroup: 'slider',
        value: '1',
        min: 1,
        prop: true,
      },
      'slider-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'activeState',
        value: 'rgba(30, 30, 30, 1)',
      },
      discrete: {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'slider',
        value: false,
        prop: true,
      },
      tooltip: {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'slider',
        value: false,
        prop: true,
      },
      ...rest,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-slider',
      componentUIName: 'Slider',
      componentCategory: 'interaction',
      componentDescription: 'Basic slider input',
      nestedComponents: [],
    };
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.isRendered) {
      if (this.slider && changedProps.get('start-value')) {
        this.slider.value = this.getSliderValue();
      }
      if (changedProps.has('discrete')) {
        this.discrete ? this.showElements() : this.hideElements();
      }
      if (this.discrete && this.constructor.isMarkerShouldRebuild(changedProps)) {
        this.buildMarkers();
      }
    }
  }

  getSliderValue() {
    return Number(this['start-value']) > Number(this['min-value'])
      ? Number(this['start-value'])
      : Number(this['min-value']);
  }

  static isMarkerShouldRebuild(changedProps) {
    const properties = ['step', 'min-value', 'max-value', 'discrete'];
    return properties.indexOf(Array.from(changedProps.keys()).join()) > -1;
  }

  setMinimalStep() {
    if (!this.discrete) {
      this.step = 1;
      this.setAttribute('step', 1);
    }
  }

  setListenerType(eventType) {
    this.slider[eventType]('input', this.setSliderProp.bind(this));
    this.slider[eventType]('mousedown', this.showSliderValue.bind(this));
    this.slider[eventType]('mouseup', this.hideSliderValue.bind(this));
    this.slider[eventType]('touchstart', this.showSliderValue.bind(this));
    this.slider[eventType]('touchend', this.hideSliderValue.bind(this));
  }

  showSliderValue() {
    if (this.tooltip) {
      this.sliderValue.classList.add('show');
    }
  }

  hideSliderValue() {
    if (this.tooltip) {
      this.sliderValue.classList.remove('show');
    }
  }

  setSliderProp() {
    const { num } = getValueObject(this.radius);
    this.sliderOutputValue = this.slider.value;
    this.sliderPosition = ((this.sliderOutputValue - this.controlMin) / this.range) * 100;
    this.positionOffset = Math.round((num * this.sliderPosition) / 100) - (num / 2);
    this.rangeBar.style.setProperty('transform', `translateX(calc(-${(100 - this.sliderPosition)}% - ${this.positionOffset}px))`);
    this.handler.style.setProperty('left', `calc(${this.sliderPosition}% - ${this.positionOffset}px)`);
    this.setAttribute('start-value', this.sliderOutputValue);
    if (this.tooltip) {
      this.setSliderValueOutput();
    }
  }

  disconnectedCallback() {
    this.setListenerType('removeEventListener');
  }

  setSliderValueOutput() {
    this.sliderValue.value = this.sliderOutputValue;
  }

  initSliderData() {
    this.sliderWrapper = this.shadowRoot.querySelector('.slider-wrapper');
    this.slider = this.shadowRoot.querySelector('.slider');
    this.rangeBar = this.shadowRoot.querySelector('.range-value-bar');
    this.rangeBarWrapper = this.shadowRoot.querySelector('.markers-wrapper');
    this.sliderValue = this.shadowRoot.querySelector('.slider-value');
    this.handler = this.shadowRoot.querySelector('.handler');
    this.rangeTouch = new RangeTouch(this.slider);
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    if (!this.slider) this.initSliderData();
    if (this.discrete) this.buildMarkers();
    this.setListenerType('addEventListener');
  }

  updated(changedProps) {
    super.updated(changedProps);
    this.controlMin = this.slider.min;
    this.controlMax = this.slider.max;
    this.range = this.controlMax - this.controlMin;
    this.setMinimalStep();
    this.setSliderProp();
    if (changedProps.has('start-value')) {
      this.emitCustomEvent('slider-change', { detail: this.sliderOutputValue });
    }
  }

  static createNode(item, stepPercent, coefficient) {
    const nodeItem = document.createElement('span');
    nodeItem.classList.add('marker-item');
    nodeItem.style.setProperty('left', `${item * stepPercent * coefficient}%`);
    return nodeItem;
  }

  buildMarkers() {
    const step = this.step || 1;
    const size = Math.abs(this['max-value']) - Math.abs(this['min-value']) || 1;
    const stepsAmouth = Math.floor(size / step);
    const stepPercent = 100 / stepsAmouth;
    const markersWrapper = document.createDocumentFragment();
    const adjustmentCoefficient = (stepsAmouth * step) / size;
    this.rangeBarWrapper.innerHTML = '';
    for (let i = 0; i < stepsAmouth + 1; i += 1) {
      markersWrapper.appendChild(this.constructor.createNode(i, stepPercent, adjustmentCoefficient));
    }
    this.rangeBarWrapper.appendChild(markersWrapper);
  }

  hideElements() {
    this.sliderWrapper.classList.add('not-discrete');
  }

  showElements() {
    this.sliderWrapper.classList.remove('not-discrete');
  }

  static get styles() {
    return [
      super.styles,
      css`
         :host {
          --outputHandleColor: #e2e2e2;
          --outputTextColor: #777777;
          --outputBackgroundColor: #ffffff;
          --markerSize: 3px;
          display: block;
          min-height: 30px;
        }
        :host input[type=range] {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
          width: 100%;
          position: absolute;
          top: 50%;
          height: 100%;
          margin: 0;
          background-color: rgba(255, 255, 255, 0);
          cursor: pointer;
          transform: translate(0, -50%);
          z-index: 1;
        }
        :host .range-bar-wrapper {
          width: 100%;
          position: absolute;
          height: var(--slider-height);
          pointer-events: none;
          overflow: hidden;
          top: 50%;
          transform: translate(0, -50%);
          border-radius: 5px;
          z-index: 1;
        }
        :host .range-value-bar {
          width: 100%;
          height: 100%;
          display: block;
          background-color: var(--slider-color);
          top: 0;
          margin: 0;
          border-radius: 5px;
        }
        :host input[type=range]:focus {
          outline: none;
        }
        :host input[type=range]::-webkit-slider-runnable-track {
          height: var(--slider-height);
          cursor: pointer;
          background-color: var(--background-color);
          border-radius: 5px;
        }
        :host .handler,
        :host input[type=range]::-webkit-slider-thumb {
          position: absolute;
          top: 50%;
          margin: 0;
          height: var(--radius);
          width: var(--radius);
          border-radius: 50%;
          background-color: var(--handle-color);
          transform: translate(-50%,-50%);
          pointer-events: none;
        }
        :host .handler {
          z-index: 2;
        }
        :host input[type=range]::-webkit-slider-thumb {
          opacity: 0;
        }
        :host .slider-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 30px;
          background-color: transparent;
        }
        :host .marker-item {
          position: absolute;
          top: 50%;
          width: var(--markerSize);
          height: var(--markerSize);
          background-color: var(--slider-color);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
        :host .markers-wrapper {
          position: relative;
          display: block;
          top: -50%;
          height: 100%;
          margin: 0 calc(var(--radius)/2);
          transform: translate(0,-50%);
        }
        :host .not-discrete .markers-wrapper {
          display: none;
        }
        :host .slider-value {
          position: absolute;
          left: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 27px;
          height: 27px;
          border-radius: 50%;
          border: 1px solid var(--outputHandleColor);
          background-color: var(--outputBackgroundColor);
          color: var(--outputTextColor);
          font-size: 13px;
          line-height: 1.2;
          text-align: center;
          transform: translate(-50%, -25%);
          bottom: 100%;
          opacity: 0;
          z-index: 1;
        }
        :host .slider-value.show {
          opacity: 1;
        }
        :host .not-discrete .slider-value {
          display: none;
        }
        :host .slider-value:after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 8px solid var(--outputHandleColor);
          transform: translate(-50%, 0);
        }
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) .slider-wrapper,
        :host(.${unsafeCSS(ModeTrackable.NoteModeClassName)}) .slider-wrapper {
          pointer-events: none;
        }
      `,
    ];
  }

  get dynamicStyles() {
    const shouldUseHandleImage = !!this['use-handle-image'];
    return html`
      ${super.dynamicStyles}
      :host {
        --handle-color: ${shouldUseHandleImage ? 'transparent' : this['handle-color']}
      }
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
        :host .handler[handle-image],
        :host input[type=range]::-webkit-slider-thumb {
          background: url('${this['handle-image']}') center center / cover no-repeat, var(--handle-color);
        }
      </style>
      <div class='slider-wrapper'>
        <input type='range' min='${this['min-value']}' max='${this['max-value']}' step='${this.step}' value='${this['start-value']}' class='slider'>
        <div class='range-bar-wrapper'>
          <span class='range-value-bar'></span>
          <div class='markers-wrapper'></div>
        </div>
        <div
            class='handler'
            ?handle-image="${this['use-handle-image']}"
            >
          <output class='slider-value'>0</output>
        </div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionSlider };
