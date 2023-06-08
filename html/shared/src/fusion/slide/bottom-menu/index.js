import { html, css, unsafeCSS } from 'lit-element';
import {
  applyMixins,
  SlideComponentBase,
  EnvDependComponent,
  ModeTrackable,
} from '../../mixins';
import { FusionBase } from '../../base';
import { FusionApi } from '../../api';
import {
  Background,
  Border,
  Container,
  Display,
  Dimensions,
  Menu,
  Typography,
  FieldDefinition,
} from '../../mixins/props';

import { FusionStore } from '../../services/fusion-store';
import { BorderUpdateHandler } from '../../services/border-update-handler';

class BottomMenu extends applyMixins(FusionBase, [
  SlideComponentBase,
  Border,
  Background,
  Container,
  Display,
  Dimensions,
  EnvDependComponent,
  Menu,
  Typography,
  ModeTrackable,
  FieldDefinition,
]) {
  static get properties() {
    const {
      'background-image': backgroundImage,
      'background-size': backgroundSize,
      'background-position-x': backgroundX,
      'background-position-y': backgroundY,
      'background-repeat': backgroundRepeat,
      'background-attachment': backgroundAttachment,
      'letter-spacing': letterSpacing,
      overflow,
      direction,
      'line-height': lineHeight,
      color,
      width,
      height,
      'background-color': backgroundColor,
      'active-color': activeColor,
      'active-background-color': activeBackgroundColor,
      'min-width': minWidth,
      'max-width': maxWidth,
      ...rest
    } = super.properties;
    return {
      height: {
        ...height,
        value: '68px',
      },
      width: {
        ...width,
        value: '1024px',
      },
      color: {
        ...color,
        value: 'rgba(255, 255, 255, 1)',
      },
      'background-color': {
        ...backgroundColor,
        propertyGroup: 'background',
        value: 'rgba(147, 140, 214, 1)',
      },
      'active-color': {
        ...activeColor,
        propertyGroup: 'activeState',
      },
      'active-background-color': {
        ...activeBackgroundColor,
        propertyGroup: 'activeState',
        value: 'rgba(147, 140, 214, 1)',
      },
      'min-width': {
        ...minWidth,
        value: '300px',
      },
      'max-width': {
        ...maxWidth,
        value: '100%',
      },
      ...rest,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-bottom-menu',
      componentUIName: 'Bottom Menu',
      componentCategory: 'menu',
      componentDescription: 'Bottom menu component, configured via the shared resource',
      nestedComponents: [],
      rotatable: false,
    };
  }

  constructor() {
    super();
    this.menu = [];
    this.navigation = {};
    this.keyMessageName = '';
    // this.presentationName = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.environmentSetEvent = 'EnvironmentDetector:environmentDetected';
    this.environmentSethandler = this.environmentSetHandler.bind(this);
    const env = FusionStore.store.getState().app.environment;
    // for local env sometimes event fiers faster than we setup listeners
    if (env !== '') {
      this.environmentSetHandler();
    }
    document.addEventListener(this.environmentSetEvent, this.environmentSethandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(this.environmentSetEvent, this.environmentSethandler);
  }

  environmentSetHandler() {
    if (FusionStore.isLocal) {
      FusionApi.getThemeConfig()
        .then((config) => {
          const { menu = [] } = config;
          this.menu = menu;
          this.requestUpdate();
        });
    }
  }

  // we haven't environmentDataReceived event for 'local' environment
  async environmentDataReceived(e) {
    const { slide } = e.detail;
    // need to fetch names first
    // this.presentationName isn't needed right now, but maybe for the future
    this.keyMessageName = slide.name;
    ({ menu: this.menu = [], navigation: this.navigation = { gotoSlideV2: true } } = await FusionApi.getThemeConfig());
    await this.requestUpdate();
  }

  onBtnClick(menuItem) {
    const {
      binder, binderDocId, slide, possibleDocuments,
    } = menuItem;
    if (this.navigation.gotoSlideV2) {
      const navSlide = possibleDocuments.find(({ properties }) => properties.name__v === slide);
      FusionApi.goTo(navSlide.properties.document_id__v, binderDocId, 'target', true);
    } else {
      FusionApi.goTo(slide, binder);
    }
  }

  isCurrentSlideInPossibleDocuments(menuItem) {
    return menuItem.possibleDocuments
      .find(({ properties }) => properties.name__v === this.keyMessageName);
  }

  isCurrentSlide(menuItem) {
    return menuItem.slide === this.keyMessageName;
  }

  isMonoBinderStructure() {
    return this.menu.every((item, i, arr) => !arr[i - 1] || item.binder === arr[i - 1].binder);
  }

  // @todo: Should always check `this.isCurrentSlideInPossibleDocuments` but for this to work we need to update shared config
  // - `possibleDocuments` should contain actual info about slides from corresponding chapter https://trello.com/c/wLEbRL2j

  isActiveMenuItem(menuItem) {
    return this.isMonoBinderStructure()
      ? this.isCurrentSlide(menuItem)
      : this.isCurrentSlideInPossibleDocuments(menuItem);
  }

  getButtonTemplateResult(item, isLast) {
    return html`
      <fusion-button
        height="${this.height}"
        width="auto"
        font-size="${this['font-size']}"
        font-family="${this['font-family']}"
        font-weight="${this['font-weight']}"
        font-style="${this['font-style']}"
        color="${this.isActiveMenuItem(item) ? this['active-color'] : this.color}"
        background-color="${this.isActiveMenuItem(item) ? this['active-background-color'] : this['background-color']}"
        @click="${this.onBtnClick.bind(this, item)}"
      >${item.label}</fusion-button>
      ${isLast ? html`` : html`<div class="separator"></div>`}
    `;
  }

  addSideSeparators(menu) {
    if (this['end-separators']) {
      menu.unshift(html`<div class="separator"></div>`);
      menu.push(html`<div class="separator"></div>`);
    }
    return menu;
  }

  generateButtons() {
    const generatedMenu = this.menu.map((item, i, arr) => {
      const isLast = i === arr.length - 1;
      return this.getButtonTemplateResult(item, isLast);
    });
    return this.addSideSeparators(generatedMenu);
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host .button-wrapper {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  static get styles() {
    return [
      super.styles,
      css`
        .button-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        fusion-button {
          position: static;
          height: 100%;
          flex-grow: 1;
          text-align: center;
        }
        :host(.${unsafeCSS(ModeTrackable.NoteModeClassName)}) fusion-button,
        :host(.${unsafeCSS(ModeTrackable.MlrModeClassName)}) fusion-button {
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
      <div class="button-wrapper">
        ${this.generateButtons()}
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { BottomMenu };
