import { html, css } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  SlideComponentBase,
} from '../../mixins';
import {
  Container,
  Dimensions,
  Display,
  DisplayFlex,
  Alignment,
  Background,
  Border,
  FieldDefinition,
} from '../../mixins/props';
import { BorderUpdateHandler } from '../../services/border-update-handler';

class FusionSection extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  Display,
  DisplayFlex,
  Alignment,
  Background,
  Border,
  FieldDefinition,
]) {
  static get options() {
    const { alignConfig, ...options } = super.options;
    return {
      ...options,
      alignConfig: {
        ...alignConfig,
        axis: {
          ...alignConfig.axis,
          value: false,
          hide: true,
        },
      },
      componentName: 'fusion-section',
      componentUIName: 'Row',
      componentDescription: 'Row container for editor',
      nestedComponents: ['fusion-box', 'fusion-column', 'fusion-grid', 'fusion-adaptive-grid'],
      isRootNested: true,
    };
  }

  static get properties() {
    const {
      top,
      left,
      'flex-direction': flexDirection,
      ...filteredProps
    } = super.properties;
    return {
      top: {
        ...top,
        value: 0,
      },
      left: {
        ...left,
        value: 0,
      },
      'flex-direction': {
        ...flexDirection,
        value: 'row',
        selectOptions: [
          { value: 'row' },
          { value: 'row-reverse' },
        ],
      },
      ...filteredProps,
    };
  }

  setListenerType(listenerType) {
    this[listenerType]('enter', this.toggleActiveLayoutAttribute.bind(this));
    this[listenerType]('exit', this.toggleActiveLayoutAttribute.bind(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.setListenerType('addEventListener');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.setListenerType('removeEventListener');
  }

  toggleActiveLayoutAttribute(e) {
    const { active, id } = e.target;
    if (this.querySelector(`#${id}`)) {
      this[active ? 'setAttribute' : 'removeAttribute']('is-stateful-container-activated', '');
    }
  }

  static get styles() {
    return [
      super.styles,
      this.generateCssProperty('flex-direction'),
      css`
        :host {
          display: block;
          width: 100%;
          border: none;
          z-index: auto;
          isolation: isolate;
        }
        :host .fusion-section {
          display: flex;
          width: 100%;
          height: 100%;
          min-height: inherit;
        }
        :host([is-stateful-container-activated]) {
          isolation: auto !important;
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host .fusion-section {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class="fusion-section">
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionSection };
