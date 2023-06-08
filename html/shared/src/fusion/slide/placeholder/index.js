import { css, html } from 'lit-element';
import { FusionBase } from '../../base';
import { FusionApi } from '../../api';
import { store } from '../../store';
import { applyToObject } from '../../utils';
import {
  applyMixins,
  SlideComponentBase,
} from '../../mixins';
import config from '../../../config.json';
import {
  Dimensions,
  Container,
  FieldDefinition,
} from '../../mixins/props';

const placeholdersTypes = {
  text: {
    props: {
      width: '980px',
      height: '100px',
    },
    styles: {
      top: '300px',
      left: '20px',
    },
    template: 'Click to add text',
  },
  list: {
    props: {
      width: '400px',
      height: '400px',
    },
    styles: {
      top: '150px',
      left: '20px',
    },
    template: 'Click to add list',
  },
  table: {
    props: {
      width: '560px',
      height: '400px',
    },
    styles: {
      top: '150px',
      left: '440px',
    },
    template: 'Click to add table',
  },
  audio: {
    props: {
      width: '400px',
      height: '50px',
    },
    styles: {
      top: '570px',
      left: '20px',
    },
    template: 'Click to add audio',
  },
};

const types = [];

const typesConfig = {
  list: 'fusion-list',
  table: 'fusion-table',
  text: 'fusion-text',
  audio: 'fusion-audio-player',
};

const getComponentByTag = (tagName) => customElements.get(tagName);
const getComponentTagByType = (type) => typesConfig[type];
const setPlaceholderTypes = (components) => Object.keys(typesConfig)
  .filter((item) => components.includes(typesConfig[item]))
  .forEach((item) => types.push(item));

document.addEventListener('ComponentsRegistrar:allComponentsRegistered', () => {
  const components = store.getState().app.registeredComponents;
  setPlaceholderTypes(components);
});

class FusionPlaceholder extends applyMixins(FusionBase, [
  SlideComponentBase,
  Dimensions,
  Container,
  FieldDefinition,
]) {
  static get properties() {
    const {
      position,
      top,
      left,
      width,
      height,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      ...rest
    } = super.properties;
    return {
      width: {
        ...width,
        value: '980px',
      },
      height: {
        ...height,
        value: '100px',
      },
      placeholderType: {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'placeholder',
        value: 'text',
        prop: true,
        selectOptions: types,
      },
      ...rest,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-placeholder',
      componentUIName: 'Placeholder',
      componentDescription: 'Component for placing other components',
      nestedComponents: [],
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.componentDisconnectedhandler = this.componentDisconnected.bind(this);
    this.placeholderDbClickHandler = this.initPlaceholderComponent.bind(this);
  }

  initComponentListeners() {
    this.component = this.getPlaceholderComponent();
    if (this.component) {
      const disconnectedHandler = `${this.component.constructor.options.componentName}:disconnected`;
      this.component.addEventListener(disconnectedHandler, this.componentDisconnectedhandler);
    }
  }

  initPlaceholder() {
    this.initAttr();
    this.initTemplate();
  }

  initComponentStyle(style) {
    this.component.style[style] = this.style[style];
  }

  initPlaceholderStyle(style) {
    this.style[style] = placeholdersTypes[this.placeholderType].styles[style];
  }

  initPlaceholderProp(prop) {
    const value = placeholdersTypes[this.placeholderType].props[prop];
    this.setElementProp(prop, value);
    this.setAttribute(prop, value);
  }

  async initPlaceholderComponent() {
    await this.initComponent();
    this.initComponentStyles();
    this.initComponentListeners();
    this.hide();
  }

  getPlaceholderComponent() {
    return this.component || document.querySelector(`[data-placeholder=${this.id}`);
  }

  initComponentStyles() {
    const { styles } = placeholdersTypes[this.placeholderType];
    applyToObject(styles, this.initComponentStyle.bind(this));
    this.saveComponentStyles(styles);
  }

  saveComponentStyles(styles) {
    const componentStyles = {};
    Object.keys(styles).map((style) => {
      componentStyles[style] = this.style[style];
      return componentStyles;
    });
    FusionApi.saveStyles(`#${this.component.id}`, componentStyles);
  }

  initAttr() {
    const { props, styles } = placeholdersTypes[this.placeholderType];
    applyToObject(props, this.initPlaceholderProp.bind(this));
    applyToObject(styles, this.initPlaceholderStyle.bind(this));
  }

  initTemplate() {
    this.innerHTML = placeholdersTypes[this.placeholderType].template;
  }

  setupPlaceholderProps(componentProps) {
    const { props } = placeholdersTypes[this.placeholderType];
    Object.keys(props)
      .filter((prop) => componentProps[prop])
      .map((prop) => {
        componentProps[prop].value = this[prop];
        return componentProps;
      });
    return componentProps;
  }

  async initComponent() {
    const { slide } = config.rootSelector;
    const parent = document.querySelector(slide);
    const componentTagName = getComponentTagByType(this.placeholderType);
    const component = getComponentByTag(componentTagName);
    const { componentName, defaultTemplate } = component.options;
    const ownProps = { 'data-placeholder': { value: this.id } };
    const componentProps = { ...component.properties, ...ownProps };
    const props = this.setupPlaceholderProps(componentProps);
    this.component = await FusionApi.createElement(
      componentName,
      props,
      defaultTemplate,
      parent,
      slide,
      { setActive: false, setState: false },
    );
  }

  hide() {
    this.setAttribute('placeholder-visibility', 'hidden');
    FusionApi.saveAttributes(`#${this.id}`, { 'placeholder-visibility': 'hidden' });
  }

  show() {
    this.setAttribute('placeholder-visibility', 'visible');
    FusionApi.saveAttributes(`#${this.id}`, { 'placeholder-visibility': 'visible' });
  }

  componentDisconnected() {
    this.component = null;
    this.show();
  }

  initListeners() {
    this.addEventListener('dblclick', this.placeholderDbClickHandler);
  }

  isFirstRender() {
    const { styles } = placeholdersTypes[this.placeholderType];
    return Object.keys(styles).every((style) => !this.style[style]);
  }

  needReInit(changedProps) {
    return this.isTypeChanged(changedProps) || this.isFirstRender();
  }

  isTypeChanged(changedProps) {
    const prevType = changedProps.get('placeholderType');
    return prevType && this.placeholderType !== prevType;
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.needReInit(changedProps)) {
      this.initPlaceholder();
    }
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.initListeners();
    this.initComponentListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('dblclick', this.placeholderDbClickHandler);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: absolute;
          display: block;
          border: 1px solid #bbbbbb;
        }
        :host([placeholder-visibility='hidden']){
          display: none;
        }
        :host .placeholder{
           width: 100%;
           height: 100%;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='placeholder'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionPlaceholder };
