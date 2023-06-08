import { css, html } from 'lit-element';
import { FusionText } from '../../../../fusion/slide/text';
import { applyMixins, ContentModule } from '../../../../fusion/mixins';
import { FusionApi } from '../../../../fusion/api';

class MenuLink extends applyMixins(FusionText, [
  ContentModule,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'menu-link',
      componentUIName: 'Menu link',
      componentDescription: 'Menu link',
      componentScope: 'custom',
      isRootNested: false,
      resizable: false,
      draggable: false,
      rotatable: false,
    };
  }

  static get properties() {
    const {
      position,
      width,
      height,
      top,
      left,
      color,
      'font-size': fontSize,
      ...rest
    } = super.properties;
    return {
      ...rest,
      'font-size': {
        ...fontSize,
        value: '15px',
      },
      color: {
        ...color,
        value: '#374741',
      },
      link: {
        type: Text,
        fieldType: 'String',
        value: '#',
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  onClick(e) {
    if (FusionApi.isEditMode) {
      e.preventDefault();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.emitCustomEvent(`${this.constructor.options.componentName}:added`);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.emitCustomEvent(`${this.constructor.options.componentName}:removed`);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: relative;
          width: auto;
          height: 100%;
          margin: var(--margin) 0;
        }
        :host a {
          display: flex;
          height: 100%;
          align-items: center;
          text-decoration: none;
        }
        @media only screen and (max-width:480px) {
          :host {
            width: 100%;
            height: 40px;
          }
          :host a {
            padding-left: 12px!important;
          }
        }
      `,
    ];
  }

  render() {
    super.render();
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <a href="${this.link}" target="_blank" @click="${this.onClick}"><slot></slot></a>
      ${this.systemSlotTemplate}
    `;
  }
}

export { MenuLink };
