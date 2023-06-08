import { html, css } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  SlideComponentBase,
} from '../../mixins';
import {
  FieldDefinition,
  Container,
  Dimensions,
  Border,
  Background,
} from '../../mixins/props';
import { BorderUpdateHandler } from '../../services/border-update-handler';
import { FusionStore } from '../../services/fusion-store';
import {
  registerZoomContainer,
  unregisterZoomContainer,
} from '../../_actions/app.js';

class FusionZoomContainer extends applyMixins(FusionBase, [
  Container,
  SlideComponentBase,
  Dimensions,
  FieldDefinition,
  Border,
  Background,
]) {
  static get properties() {
    return {
      ...super.properties,
      'zoom-value': {
        type: String,
        fieldType: 'Number',
        value: '1.5',
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-zoom-container',
      componentUIName: 'Zoom Container',
      componentDescription: 'Container for display zoomed content',
      nestedComponents: [],
    };
  }

  constructor() {
    super();
    this.fieldIcon = '.icon-group-outlined';
  }

  connectedCallback() {
    super.connectedCallback();
    this.zoomContainerId = this.getAttribute('id');
    if (this.zoomContainerId) {
      FusionStore.store.dispatch(registerZoomContainer(`#${this.zoomContainerId}`));
    }
  }

  disconnectedCallback() {
    FusionStore.store.dispatch(unregisterZoomContainer(`#${this.zoomContainerId}`));
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--background-color);
          border: var(--border-width) var(--border-style) var(--border-color);
          border-radius: var(--border-radius);
        }
        :host .fusion-zoom-container {
          width: 100px;
          height: 100px;
          background-color: transparent;
          transform: scale(var(--zoom-value));
          transform-origin: center center;
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  render() {
    return html`
      <link rel="stylesheet" href="../shared/dist/main.css">
      <style>
        ${super.dynamicStyles}
      </style>
      <div class='fusion-zoom-container'></div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionZoomContainer };
