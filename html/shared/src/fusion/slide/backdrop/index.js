import { css, html } from 'lit-element';
import { FusionBase } from '../../base';
import { emitInitEvents } from '../../utils';
import {
  applyMixins,
  SlideComponentBase,
} from '../../mixins';
import { Container, Background, FieldDefinition } from '../../mixins/props';

class FusionBackdrop extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Background,
  FieldDefinition,
]) {
  static get properties() {
    const {
      'background-color': backgroundColor,
      fieldName,
      hidden,
      required,
      'show-in-editor': showInEditor,
      'data-flag-on': dataFlagOn,
    } = super.properties;
    return {
      'background-color': {
        ...backgroundColor,
        value: 'rgba(230, 230, 230, 0.5)',
      },
      fieldName,
      hidden,
      required,
      'show-in-editor': showInEditor,
      'data-flag-on': dataFlagOn,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-backdrop',
      componentUIName: 'Backdrop',
      componentCategory: 'overlay',
      componentDescription: 'Basic backdrop module',
      isRootNested: false,
      nestedComponents: [],
      defaultTemplate: '',
      resizable: false,
      draggable: false,
      rotatable: false,
    };
  }

  constructor() {
    super();
    emitInitEvents(this, { name: `${this.constructor.options.componentName}:added`, props: { detail: { isCreated: true } } });
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.emitCustomEvent.bind(this, 'backdrop-click'));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.emitCustomEvent.bind(this, 'backdrop-click'));
    this.emitCustomEvent(`${this.constructor.options.componentName}:removed`, { detail: { isCreated: false } });
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--background-color);
          pointer-events: auto;
          z-index: 0;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionBackdrop };
