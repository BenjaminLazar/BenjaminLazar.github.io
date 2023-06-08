import { css, html, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  ModeTrackable,
  SlideComponentBase,
} from '../../mixins';
import {
  Container,
  Dimensions,
  FieldDefinition,
} from '../../mixins/props';

class FusionViewer extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Dimensions,
  ModeTrackable,
  FieldDefinition,
]) {
  static get properties() {
    const {
      width,
      height,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      ...rest
    } = super.properties;
    return {
      ...rest,
      width: {
        ...width,
        value: '600px',
        min: 50,
      },
      height: {
        ...height,
        value: '400px',
        min: 50,
      },
      link: {
        type: String,
        fieldType: 'Link',
        propertyGroup: 'link',
        propertyArea: 'settings',
        value: '',
        prop: true,
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-viewer',
      componentUIName: 'IFrame Viewer',
      componentCategory: 'media',
      componentDescription: 'Component for showing documents and external URLs',
      nestedComponents: [],
    };
  }

  isLinkUpdated(oldLink) {
    return this.link !== oldLink;
  }

  shouldLoad(oldLink, newLink) {
    return this.frame && this.isLinkUpdated(oldLink) && this.constructor.isValidUrl(newLink);
  }

  update(changedProps) {
    super.update(changedProps);
    const oldLink = changedProps.get('link');
    if (this.shouldLoad(oldLink, this.link)) {
      this.loadData();
    }
  }

  static isValidUrl(url) {
    const regex = /^(http|https):\/\//;
    return regex.test(url);
  }

  static getLink(url) {
    return this.isValidUrl(url) ? url : '';
  }

  loadData() {
    this.frame.src = this.link;
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.frame = this.shadowRoot.querySelector('.inner-frame');
  }

  updated(changedProps) {
    super.updated(changedProps);
  }

  generateContent() {
    if (this.constructor.isValidUrl(this.link)) {
      return html`<iframe class='inner-frame' src="${this.constructor.getLink(this.link)}"></iframe>`;
    }
    return html`<span>Invalid or missing link</span>`;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host .iframe-wrapper {
          width: 100%;
          height: 100%;
          background: rgb(230, 230, 230);
        }
        :host iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) .inner-frame {
          pointer-events: none;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class="iframe-wrapper">
        ${this.generateContent()}
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionViewer };
