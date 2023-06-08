import { html, css, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import {
  SlideComponentBase,
  applyMixins,
  ModeTrackable,
  ContentModule,
  LinkExtension,
} from '../../mixins';
import { FusionStore } from '../../services/fusion-store';
import {
  Border,
  Container,
  Dimensions,
  Display,
  Typography,
  Background,
  FieldDefinition,
} from '../../mixins/props';
import { BorderUpdateHandler } from '../../services/border-update-handler';
import { isReflectiveBoolean } from '../../utils';

const parseColor = (pattern, str) => {
  const crop = pattern.exec(str)[1];
  return crop.split(',');
};
const lightenDarkenColor = (hslaStr, lighten) => {
  const [h, s, l, a] = parseColor(/hsla\(([\d,.\s%]+)\)/g, hslaStr);
  let lightness = parseInt(l.replace(/%/g, '').trim(), 10);
  let alpha = a.trim();

  if (lighten) {
    alpha *= lighten;
  }
  const step = lightness <= 50 ? 10 : -10;
  lightness = `${step + lightness}%`;
  return `hsla(${h}, ${s}, ${lightness}, ${alpha})`;
};
const rgba2hsla = (rgbaStr, alpha) => {
  let [r, g, b, a] = parseColor(/rgba\(([\d,.\s]+)\)/g, rgbaStr);
  let h; let s; let
    d;
  r /= 255;
  g /= 255;
  b /= 255;
  a *= 100;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let l = (max + min) / 2;

  alpha ? a *= alpha / 100 : (a /= 100);

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  h = Math.floor(h * 360);
  s = Math.floor(s * 100);
  l = Math.floor(l * 100);
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
};
const defaultTemplate = '<p>Button name</p>';

class FusionButton extends applyMixins(FusionBase, [
  SlideComponentBase,
  ModeTrackable,
  ContentModule,
  Container,
  Dimensions,
  Display,
  Typography,
  Border,
  Background,
  LinkExtension,
  FieldDefinition,
]) {
  static get properties() {
    const {
      top,
      left,
      overflow,
      'letter-spacing': letterSpacing,
      'line-height': lineHeight,
      width,
      height,
      'background-color': backgroundColor,
      'background-attachment': backgroundAttachment,
      'should-shown': shouldShown,
      ...rest
    } = super.properties;
    return {
      top,
      left,
      width: {
        ...width,
        value: '100px',
      },
      height: {
        ...height,
        value: '30px',
      },
      'background-color': {
        ...backgroundColor,
        value: 'rgba(221, 221, 221, 1)',
      },
      'enable-styling-effects': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'adjust',
        value: isReflectiveBoolean(),
        prop: true,
      },
      ...rest,
      title: {
        type: String,
        fieldType: 'String',
        propertyArea: 'settings',
        propertyGroup: 'link',
        value: '',
      },
      'should-shown': {
        ...shouldShown,
        value: true,
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-button',
      componentContentType: 'text',
      componentUIName: 'Button',
      componentCategory: 'interaction',
      componentDescription: 'Basic button for adding interactions',
      nestedComponents: [],
      isTextEdit: true,
      defaultTemplate,
    };
  }

  constructor() {
    super();
    this.alpha = 0.5;
    this.colorProps = ['background-color', 'color'];
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.isRendered) {
      this.borderChanges(changedProps);
    }
  }

  borderChanges(props) {
    if (this.constructor.isColorChanged(props)) {
      this.colorProps.forEach((prop) => this.setColorEffects(prop, this[prop]));
    }
  }

  /**
   * @description Set color effects depend on border-color or background-color
   * @param {string} prop - property which changes
   * @param {string} value - rgba color value
   */
  setColorEffects(prop, value) {
    const effects = this.constructor.getAdditionalColorEffects(value, prop);
    Object.keys(effects).forEach((item) => this.style.setProperty(`--${item}`, effects[item]));
  }

  static getAdditionalColorEffects(value, attr) {
    const effects = {
      'background-color': {
        'button-color-darken': lightenDarkenColor(rgba2hsla(value)),
      },
      color: {
        'text-color-hover': lightenDarkenColor(rgba2hsla(value)),
      },
    };
    return effects[attr];
  }

  static isColorChanged(changedProps) {
    return changedProps.has('background-color') || changedProps.has('color');
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.borderChanges(changedProperties);
  }

  static propagateFocus(event) {
    if (!FusionStore.isEditMode) {
      event.preventDefault();
      event.currentTarget.focus();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
          border-radius: var(--border-radius);
          border: none;
        }
        button {
          width: 100%;
          height: 100%;
          text-align: center;
          vertical-align: middle;
          user-select: none;
          cursor: pointer;
          outline: 0;
          border: var(--border-width) var(--border-style) var(--border-color);
          border-radius: var(--border-radius);
          transition: color .15s ease-in-out,background-color .15s ease-in-out,box-shadow .15s ease-in-out;
          background-color: var(--background-color);
          color: var(--color);
        }
        :host([enable-styling-effects]) button:focus {
          box-shadow: 0 0 0 3px var(--button-shadow);
        }
        :host([enable-styling-effects]) button:hover,
        :host([enable-styling-effects]) button:active {
          background-color: var(--button-color-darken);
          color: var(--text-color-hover);
        }
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) button {
          cursor: auto;
        }
        :host(.${unsafeCSS(ModeTrackable.NoteModeClassName)}) button {
          pointer-events: none;
        }
        ::slotted(.ql-editor),
        ::slotted(p) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: normal;
        }
        :host([data-mo-editable]) ::slotted(p) {
          white-space: normal;
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host button {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  setContentModule(content) {
    // Append the new content into the component
    this.innerHTML = content;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <button @mousedown="${(event) => this.constructor.propagateFocus(event)}" @click='${() => this.openLink()}'><slot></slot></button>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionButton };
