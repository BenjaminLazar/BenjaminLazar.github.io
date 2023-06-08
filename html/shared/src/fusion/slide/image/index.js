import { html, css } from 'lit-element';
import config from '../../../config.json';
import { FusionBase } from '../../base';
import {
  applyMixins,
  SlideComponentBase,
  ContentModule,
  LinkExtension,
} from '../../mixins';
import {
  Image,
  Border,
  Container,
  Display,
  Dimensions,
  MediaObjectProperties,
  FieldDefinition,
} from '../../mixins/props';
import { intersectMap } from '../../utils';
import { BorderUpdateHandler } from '../../services/border-update-handler';

class FusionImage extends applyMixins(FusionBase, [
  SlideComponentBase,
  ContentModule,
  Image,
  Border,
  Container,
  Display,
  Dimensions,
  MediaObjectProperties,
  FieldDefinition,
  LinkExtension,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-image',
      componentCategory: 'media',
      componentContentType: 'image',
      componentUIName: 'Image',
      componentDescription: 'Component for showing images',
      nestedComponents: [],
    };
  }

  static get properties() {
    const {
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      top,
      left,
      width,
      height,
      overflow,
      src,
      'should-shown': shouldShown,
      ...rest
    } = super.properties;
    return {
      src: {
        ...src,
        value: '../shared/src/fusion/slide/image/assets/images/fusion-image-placeholder.jpg',
        reflect: true,
      },
      top,
      left,
      width: {
        ...width,
        value: config.responsive ? '100%' : '400px',
      },
      height: {
        ...height,
        value: config.responsive ? 'auto' : '100px',
      },
      'src-duplicate': {
        type: String,
        fieldType: 'hidden',
        propertyGroup: 'component',
        value: '',
      },
      ...rest,
      'should-shown': {
        ...shouldShown,
        value: true,
      },
    };
  }

  imageLoaded(e) {
    // @todo need handle if this is fragment image on monarch side
    const isRootElement = document.contains(this);
    if (isRootElement) {
      const image = e.currentTarget;
      const { naturalWidth, naturalHeight } = image;
      let ratio;
      // fix for Firefox which return naturalWidth and naturalHeight of svg as 0 (https://bugzilla.mozilla.org/show_bug.cgi?id=1607081)
      if (naturalWidth === 0 && naturalHeight === 0) {
        ratio = 1;
      } else {
        ratio = naturalWidth / naturalHeight;
      }
      this.setAttribute('ratio', ratio);
      this.requestUpdate('lock-aspect-ratio');
    }
  }

  checkSizes(changedProps) {
    const properties = intersectMap(changedProps, this.constructor.sizeTriggers);
    Array.from(properties.keys()).forEach((prop) => this.setSize(prop));
  }

  setEmptySource() {
    if (this.src) {
      this.setAttribute('src-duplicate', this.src);
    }
    this.src = '';
  }

  setContentModule(content) {
    this.setAttribute('src', content);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          border: none;
        }
        .image-container {
          width: 100%;
          height: 100%;
          display: flex;
          border: var(--border-width) var(--border-style) var(--border-color);
          border-radius: var(--border-radius);
          overflow: hidden;
        }
        .image-container img {
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host .image-container {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <picture class="image-container" @click=${() => this.openLink()}>
        <source srcset=${this['large-src']} media="(min-width: 1280px)" alt=${this.alt}>
        <source srcset=${this['medium-src']} media="(min-width: 1024px)" alt=${this.alt}>
        <img src=${this.src} alt=${this.alt} @load=${(e) => this.imageLoaded(e)} @error=${() => this.setEmptySource()}>
      </picture>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionImage };
