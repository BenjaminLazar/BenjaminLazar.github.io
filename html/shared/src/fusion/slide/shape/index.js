import { html, css } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { FusionBase } from '../../base';
import { applyMixins, SlideComponentBase } from '../../mixins';
import {
  Asset,
  Container,
  Dimensions,
  Background,
  Display,
  FieldDefinition,
} from '../../mixins/props';
import config from '../../../config.json';

const defaultShape = 'circle';

const getShapes = Object.keys(config.shapes).reduce((acc, name) => {
  const shape = { ...config.shapes[name], name };
  acc.push(shape);
  return acc;
}, []);

class FusionShape extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Asset,
  Dimensions,
  Display,
  Background,
  FieldDefinition,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-shape',
      componentUIName: 'Shape',
      componentDescription: 'Component for showing shapes',
      nestedComponents: [],
    };
  }

  static get properties() {
    const {
      top,
      left,
      width,
      height,
      src,
      'background-color': backgroundColor,
      'lock-aspect-ratio': lockAspectRatio,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      'background-size': backgroundSize,
      'background-position-x': backgroundX,
      'background-position-y': backgroundY,
      'background-image': backgroundImage,
      'background-repeat': backgroundRepeat,
      'background-attachment': backgroundAttachment,
      overflow,
      ...rest
    } = super.properties;
    return {
      shape: {
        type: String,
        fieldType: 'Modal',
        propertyGroup: 'shape',
        assetType: 'Shape',
        value: defaultShape,
        prop: true,
        selectOptions: getShapes,
      },
      top,
      left,
      width: {
        ...width,
        value: '100px',
        min: 1,
      },
      height: {
        ...height,
        value: '100px',
        min: 1,
      },
      'background-color': {
        ...backgroundColor,
        propertyGroup: 'shape',
        value: 'rgba(177, 192, 201, 1)',
      },
      'lock-aspect-ratio': {
        ...lockAspectRatio,
        value: false,
      },
      ...rest,
    };
  }

  isShapeChanged(changedProps) {
    return this.shape && changedProps.has('shape');
  }

  shapeChangeHandler(changedProps) {
    if (this.isShapeChanged(changedProps) && config.shapes[this.shape].isFit) {
      const viewBoxParams = config.shapes[this.shape].viewBox.split(' ');
      const [, , boxWidth, boxHeight] = viewBoxParams;
      const ratio = boxWidth / boxHeight;
      this.setAttribute('ratio', ratio);
    }
  }

  update(changedProps) {
    this.shapeChangeHandler(changedProps);
    super.update(changedProps);
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (this.isShapeChanged(changedProps)) {
      this.requestUpdate('width');
    }
  }

  static getPathTransform(type) {
    const htmlEl = this.getPathElem(type);
    const transform = htmlEl.querySelector('path').getAttribute('transform');
    return transform || '';
  }

  static getPathElem(type) {
    const { template } = config.shapes[type];
    const htmlEl = document.createElement('div');
    htmlEl.innerHTML = template;
    return htmlEl;
  }

  static getPathData(type) {
    const htmlEl = this.getPathElem(type);
    return htmlEl.querySelector('path').getAttribute('d');
  }

  static getViewBox(type) {
    const { viewBox } = config.shapes[type];
    return viewBox;
  }

  getTemplate() {
    const shape = this.shape || defaultShape;
    return html`
        <svg
            preserveAspectRatio="${ifDefined(config.shapes[shape].isFit ? undefined : 'none')}"
            xmlns='http://www.w3.org/2000/svg'
            width='100%'
            height='100%'
            viewBox=${this.constructor.getViewBox(shape)}>
            <path
                fill=${this['background-color']}
                fill-rule='evenodd'
                d=${this.constructor.getPathData(shape)}
                transform=${this.constructor.getPathTransform(shape)}>
        </svg>`;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host svg {
          position: relative;
          top: 0;
          left: 0;
        }
        :host > :not([name="mo-system"]) {
          background-color: unset;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      ${this.getTemplate()}
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionShape };
