import { css, html, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import { FusionApi } from '../../api';
import config from '../../../config.json';
import {
  applyMixins, ModeTrackable, SlideComponentBase, Stateful,
} from '../../mixins';
import { getValueObject } from '../../utils';
import {
  Container,
  Dimensions,
  Display,
  Background,
  FieldDefinition,
} from '../../mixins/props';

const state = 'PaintTool';

class FusionPaint extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  Display,
  Background,
  Stateful,
  ModeTrackable,
  FieldDefinition,
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
    } = super.properties;
    return {
      position,
      top,
      left,
      width: {
        ...width,
        min: 400,
      },
      height: {
        ...height,
        value: '70px',
        min: 70,
      },
      'background-color': {
        ...backgroundColor,
        value: 'rgba(230, 230, 230, 1)',
      },
      opacity,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-paint',
      componentUIName: 'Paint',
      componentType: 'dynamic',
      componentCategory: 'interaction',
      componentDescription: 'Basic paint component',
      nestedComponents: [],
      baseLevel: 1000,
    };
  }

  static get state() {
    return state;
  }

  constructor() {
    super();
    this.state = state;
    this.newStyle = [];
    this.preparingToDrawBound = this.preparingToDraw.bind(this);
    this.drawingBound = this.drawing.bind(this);
    this.endDrawBound = this.endDraw.bind(this);
    this.clearDrawBound = this.clearDraw.bind(this);
    this.setActiveBound = this.setActive.bind(this);
    this.listenerMap = new Map();
  }

  editorModeChanged(isEditMode) {
    // right after connected callback is fired, there is no canvas
    if (this.canvas) {
      this.disableInEditMode(isEditMode);
      this.clearDraw();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.setListenerType('removeEventListener');
    this.listenerMap.forEach((listener, el) => el.removeEventListener('click', listener));
    this.canvas.remove();
  }

  enter() {
    this.addLevel();
    this.setCanvasStyle('active');
  }

  exit() {
    this.removeLevel();
    this.setCanvasStyle('inactive');
  }

  setCanvasStyle(value) {
    const presets = this.getCanvasInlineStyle(value);
    Object.keys(presets).forEach((item) => this.canvas.style.setProperty(item, presets[item]));
  }

  getCanvasLevel() {
    return window.getComputedStyle(this).getPropertyValue('--level');
  }

  getCanvasInlineStyle(status) {
    const styles = {
      active: {
        'z-index': this.getCanvasLevel(),
        'pointer-events': 'all',
      },
      inactive: {
        'z-index': this.getCanvasLevel(),
        'pointer-events': 'none',
      },
    };
    return styles[status];
  }

  createCanvas() {
    // @todo Team should check if paint should work with fragments
    this.parent = document.querySelector(config.rootSelector.slide);
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', this.parent.offsetWidth || 1024);
    this.canvas.setAttribute('height', this.parent.offsetHeight || 768);
    this.canvas.setAttribute('id', `canvas-${this.id}`);
    this.canvas.style.setProperty('position', 'absolute');
    this.canvas.style.setProperty('top', 0);
    this.canvas.style.setProperty('left', 0);
    this.parent.appendChild(this.canvas);
  }

  initPen() {
    this.context = this.canvas.getContext('2d');
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.strokeStyle = this.constructor.getColor()[this.color];
    this.context.lineWidth = this.constructor.getSize()[this.size];
  }

  static getTarget(e) {
    return FusionApi.isTouchSupported ? e.targetTouches[0] : e;
  }

  preparingToDraw(e) {
    e.preventDefault();
    this.target = this.constructor.getTarget(e);
    this.initPen();
    this.isDrawing = true;
    this.lastPoint = { x: this.target.pageX, y: this.target.pageY };
  }

  disableInEditMode(isEditMode) {
    isEditMode ? this.setCanvasStyle('inactive') : this.setCanvasStyle('active');
  }

  drawing(e) {
    this.target = this.constructor.getTarget(e);
    if (this.active && this.isDrawing) {
      this.context.beginPath();
      this.context.moveTo(this.lastPoint.x, this.lastPoint.y);
      this.context.lineTo(this.target.pageX, this.target.pageY);
      this.context.stroke();
      this.lastPoint = { x: this.target.pageX, y: this.target.pageY };
    }
  }

  endDraw() {
    this.isDrawing = false;
    this.lastPoint = null;
  }

  clearDraw() {
    if (this.context) {
      this.context.clearRect(0, 0, this.parent.offsetWidth, this.parent.offsetHeight);
    }
  }

  setListenerType(eventType) {
    this.shadowRoot.querySelector('[name=eraser]')[eventType](this.events.startEvent, this.clearDrawBound);
    this.canvas[eventType](this.events.upEvent, this.endDrawBound);
    this[eventType](this.events.upEvent, this.endDrawBound);
    this.canvas[eventType](this.events.startEvent, this.preparingToDrawBound);
    this.canvas[eventType](this.events.moveEvent, this.drawingBound);
  }

  createPaintTools() {
    this.size = 'normal';
    this.color = 'green';
    this.createElementsByName('size', this.constructor.getSize());
    this.createElementsByName('color', this.constructor.getColor());
  }

  static getSize() {
    return {
      huge: 21,
      large: 15,
      normal: 9,
      small: 3,
    };
  }

  static getColor() {
    return {
      green: 'rgba(0, 190, 50, 1)',
      red: 'rgba(255, 0, 0, 1)',
      yellow: 'rgba(255, 205, 0, 1)',
      purple: 'rgba(215, 0, 250, 1)',
    };
  }

  createElementsByName(map, name) {
    Object.keys(name).forEach((el) => this.createElementForDraw(map, el));
  }

  createElementForDraw(parent, name) {
    const newElement = document.createElement('div');
    newElement.setAttribute('id', name);
    const container = this.shadowRoot.querySelector(`[name=${parent}]`);
    container.appendChild(newElement);
    this.listenerMap.set(newElement, this.setActiveBound.bind(null, parent, name));
    this.shadowRoot.getElementById(name).addEventListener('click', this.listenerMap.get(newElement));
  }

  setActive(name, value) {
    name === 'color' ? this.constructor.setActiveColor.bind(this)(value) : this.constructor.setActiveSize.bind(this)(name, value);
    this[name] = value;
  }

  static setActiveColor(value) {
    this.shadowRoot.getElementById(this.size).style.setProperty('border-color', this.constructor.getColor()[value]);
  }

  static setActiveSize(size, name) {
    this.shadowRoot.getElementById(this[size]).style.setProperty('border-color', '');
    this.shadowRoot.getElementById(name).style.setProperty('border-color', this.constructor.getColor()[this.color]);
  }

  setPropOfElement(value, prop, min) {
    const { num, unit } = getValueObject(value);
    const maxVal = Math.max(num, min);
    this.setElementProp(prop, `${maxVal}${unit}`);
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.events = FusionApi.getEventsPreset();
    this.createCanvas();
    this.createPaintTools();
    this.setListenerType('addEventListener');
    // this.shadowRoot.querySelector('style').innerText += this.newStyle.join(' ');
    this.shadowRoot.getElementById(this.size).style.setProperty('border-color', this.constructor.getColor()[this.color]);
  }

  static get styles() {
    // eslint-disable-next-line arrow-body-style
    const colors = Object.keys(this.getColor()).map((key) => {
      return css`#${unsafeCSS(key)}:before {
        background: ${unsafeCSS(this.getColor()[key])};
      }`;
    });
    // eslint-disable-next-line arrow-body-style
    const sizes = Object.keys(this.getSize()).map((key) => {
      return css`#${unsafeCSS(key)}:before {
       width: ${unsafeCSS(this.getSize()[key])}px; 
       height: ${unsafeCSS(this.getSize()[key])}px; 
      }`;
    });
    return [
      super.styles,
      css`
        :host {
          z-index: calc(var(--level) + 10);
          display: none;
        }
        :host([active]) {
            display: block;
        }
        :host [name='paint-container'],
        :host [name='tools-set'] {
          width: 100%;
          height: 100%;
        }
        :host [name='tools-set'] {
          background-color: var(--background-color);
        }
        :host [name='tools-set'] {
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
        }
        :host [name='color'],
        :host [name='size'],
        :host [name='eraser']{
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        :host [name='color'],
        :host [name='size'] {
          width: 42%;
        }
        :host [name='color'],
        :host [name='size'],
        :host [name='eraser'] {
          height: 90%;
        }
        :host [name='eraser'] {
          width: 14%;
        }
        :host [name='color']:before,
        :host [name='size']:before,
        :host [name='eraser']:before {
          content: '';
          position: absolute;
          width: 96%;
          height: 96%;
          background-color: #fff;
          border-radius: 10px;
        }
        :host [name='color'] > div,
        :host [name='size'] > div {
          position: relative;
          width: 37px;
          height: 37px;
          border-color: #b3b3b3;
        }
        :host [name='color'] > div:before,
        :host [name='size'] > div:before {
          content: '';
          position: absolute;
          width: 60%;
          height: 60%;
          border-radius: 50%;
          border: 1px solid;
          border-color: inherit;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
        }
        :host [name='eraser']:before {
          width: 90%;
          background: #fff url(../shared/src/fusion/slide/paint/assets/images/fusion-eraser.png) center / 28px no-repeat;
        }
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) [name='paint-container'] {
          pointer-events: none;
        }
      `,
      ...colors,
      ...sizes,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div name='paint-container'>
        <div name='tools-set'>
          <div name='color'></div>
          <div name='size'></div>
          <div name='eraser'></div>
        </div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionPaint };
