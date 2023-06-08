import { css, html } from 'lit-element';
import { FusionTabGroupContainer } from './tab-group-container';
import { FusionApi } from '../../api';
import { FusionTabGroupButton } from './tab-group-button';
import { FusionGroup } from '../group';
import {
  applyMixins,
  ModeTrackable,
  ItemsWrapper,
  ChildrenStylist,
} from '../../mixins';
import { createObjectItem, getPartial } from '../../utils';
import { Border, Typography } from '../../mixins/props';
import config from '../../../config.json';
import { BorderUpdateHandler } from '../../services/border-update-handler';

class FusionTabGroup extends applyMixins(FusionGroup, [
  ItemsWrapper,
  ModeTrackable,
  Typography,
  Border,
  ChildrenStylist,
]) {
  static get options() {
    const {
      alignConfig,
      ...rest
    } = super.options;
    return {
      ...rest,
      componentName: 'fusion-tab-group',
      componentUIName: 'Tab Group',
      componentCategory: 'interaction',
      componentDescription: 'Tab group',
      nestedComponents: ['fusion-tab-group-button'],
    };
  }

  static get properties() {
    const {
      'background-image': backgroundImage,
      'background-size': backgroundSize,
      'background-position-x': backgroundX,
      'background-position-y': backgroundY,
      'background-repeat': backgroundRepeat,
      'background-attachment': backgroundAttachment,
      'letter-spacing': letterSpacing,
      'line-height': lineHeight,
      direction,
      position,
      'font-weight': fontWeight,
      'font-size': fontSize,
      'font-family': fontFamily,
      'border-width': borderWidth,
      'border-style': borderStyle,
      'border-color': borderColor,
      'border-left-width': borderLeftWidth,
      'border-left-style': borderLeftStyle,
      'border-left-color': borderLeftColor,
      'border-top-width': borderTopWidth,
      'border-top-style': borderTopStyle,
      'border-top-color': borderTopColor,
      'border-right-width': borderRightWidth,
      'border-right-style': borderRightStyle,
      'border-right-color': borderRightColor,
      'border-bottom-width': borderBottomWidth,
      'border-bottom-style': borderBottomStyle,
      'border-bottom-color': borderBottomColor,
      'border-radius': borderRadius,
      top,
      left,
      'font-style': fontStyle,
      items,
      color,
      'should-shown': shouldShown,
      ...rest
    } = super.properties;

    return {
      'should-shown': {
        ...shouldShown,
        value: true,
      },
      position: {
        ...position,
        value: config.responsive ? 'relative' : 'absolute',
        selectOptions: [
          { value: 'absolute', icon: 'positionabsolute' },
          { value: 'relative', icon: 'positionrelative' },
          { value: 'fixed', icon: 'positionfixed' },
        ],
      },
      top: {
        ...top,
        value: '50px',
        calculated: true,
      },
      left: {
        ...left,
        calculated: true,
      },
      items: {
        ...items,
        min: 0,
        max: 20,
        fieldType: 'Slider',
        propertyGroup: 'tabs',
      },
      'border-color': borderColor,
      'border-width': borderWidth,
      'border-style': borderStyle,
      'border-radius': borderRadius,
      'background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'tabGroup',
        value: 'rgba(0, 0, 0, 0)',
      },
      'border-left-width': borderLeftWidth,
      'border-left-style': borderLeftStyle,
      'border-left-color': borderLeftColor,
      'border-top-width': borderTopWidth,
      'border-top-style': borderTopStyle,
      'border-top-color': borderTopColor,
      'border-right-width': borderRightWidth,
      'border-right-style': borderRightStyle,
      'border-right-color': borderRightColor,
      'border-bottom-width': borderBottomWidth,
      'border-bottom-style': borderBottomStyle,
      'border-bottom-color': borderBottomColor,
      'tab-font-family': fontFamily,
      'tab-font-weight': fontWeight,
      'tab-font-size': fontSize,
      'tab-font-style': fontStyle,
      'tab-color': color,
      'tab-padding-left': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'padding',
        value: '10px',
        availableUnits: [{ unitType: 'px' }, { unitType: '%' }],
      },
      'tab-width': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'tabs',
        value: '150px',
        availableUnits: [{ unitType: 'px' }],
      },
      'tab-height': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'tabs',
        value: '30px',
        availableUnits: [{ unitType: 'px' }],
      },
      'tab-border-color': {
        ...borderColor,
        propertyGroup: 'tab-border',
        value: 'rgba(0, 0, 0, 1)',
      },
      'tab-border-width': {
        ...borderWidth,
        propertyGroup: 'tab-border',
        value: '1px',
      },
      'tab-border-style': {
        ...borderStyle,
        propertyGroup: 'tab-border',
        value: 'solid',
      },
      'tab-border-left-width': {
        ...borderLeftWidth,
        propertyGroup: 'tab-border',
      },
      'tab-border-left-style': {
        ...borderLeftStyle,
        propertyGroup: 'tab-border',
      },
      'tab-border-left-color': {
        ...borderLeftColor,
        propertyGroup: 'tab-border',
      },
      'tab-border-top-width': {
        ...borderTopWidth,
        propertyGroup: 'tab-border',
      },
      'tab-border-top-style': {
        ...borderTopStyle,
        propertyGroup: 'tab-border',
      },
      'tab-border-top-color': {
        ...borderTopColor,
        propertyGroup: 'tab-border',
      },
      'tab-border-right-width': {
        ...borderRightWidth,
        propertyGroup: 'tab-border',
      },
      'tab-border-right-style': {
        ...borderRightStyle,
        propertyGroup: 'tab-border',
      },
      'tab-border-right-color': {
        ...borderRightColor,
        propertyGroup: 'tab-border',
      },
      'tab-border-bottom-width': {
        ...borderBottomWidth,
        propertyGroup: 'tab-border',
      },
      'tab-border-bottom-style': {
        ...borderBottomStyle,
        propertyGroup: 'tab-border',
      },
      'tab-border-bottom-color': {
        ...borderBottomColor,
        propertyGroup: 'tab-border',
      },
      'tab-border-radius': {
        ...borderRadius,
        propertyGroup: 'tab-border',
      },
      'tab-background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'tabs',
        value: 'rgba(255, 255, 255, 1)',
      },
      'active-background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'activeState',
        value: 'rgba(221, 221, 221, 1)',
      },
      'active-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'activeState',
        value: 'rgba(255, 255, 255, 1)',
      },
      'activate-first-tab': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'tabs',
        value: false,
        prop: true,
      },
      ...rest,
    };
  }

  constructor() {
    super();
    this.item = createObjectItem(FusionTabGroupButton);
    this.addTabHandler = this.createTab.bind(this);
    this.removeTabHandler = this.removeTab.bind(this);
    this.addEventListener(this.item.events.add, this.addTabHandler);
    this.addEventListener('tab-select', this.toggleActiveTab);
    this.addEventListener('enter', this.activateTabHandler);
    this.addEventListener('exit', this.constructor.onCloseTabContainerHandler);
  }

  static onCloseTabContainerHandler(e) {
    const tabGroupChildren = e.target.querySelectorAll(FusionTabGroup.options.componentName);
    [...tabGroupChildren].forEach((tabGroup) => {
      tabGroup.deactivateTab();
      if (tabGroup['activate-first-tab'] && tabGroup.tabs.length && tabGroup.activeTab?.id !== tabGroup.tabs[0].id) {
        tabGroup.activateTab(tabGroup.tabs[0]);
      }
    });
  }

  parentStateChanged(parentState) {
    super.parentStateChanged(parentState);
    // the tab gets activated, but the container doesn't
    if (this.activeTab) {
      this.switchStateContainer(this.activeTab, true);
    }
  }

  getActiveStateContainer() {
    const { componentName } = FusionTabGroupContainer.options;
    return this.querySelector(`${componentName}[active="true"]`) || null;
  }

  disconnectedCallback() {
    this.removeEventListener('tab-select', this.toggleActiveTab);
    this.removeEventListener('enter', this.activateTabHandler);
    this.removeEventListener('exit', this.constructor.onCloseTabContainerHandler);
    this.removeEventListener(this.item.events.add, this.addTabHandler);
    [...this.tabs].forEach((tab) => tab.removeEventListener(this.item.events.remove, this.removeTabHandler));
    super.disconnectedCallback();
  }

  get tabs() {
    return [...this.children].filter((item) => item instanceof FusionTabGroupButton);
  }

  get activeTab() {
    return [...this.tabs].find((el) => el.classList.contains('active'));
  }

  setActiveTab(tab) {
    this.activateTab(tab);
    this.switchStateContainer(tab, true);
  }

  activateTabHandler(e) {
    if (!FusionApi.isEditMode) {
      e.stopPropagation();
      const selector = e.target.getAttribute('data-tab-id');
      if (selector && this.activeTab.id !== selector) {
        const tab = this.querySelector(`#${selector}`);
        this.activateTab(tab);
      }
    }
  }

  activateTab(tab) {
    this.deactivateTab();
    tab.classList.add('active');
  }

  deactivateTab() {
    const { activeTab } = this;
    if (activeTab) {
      activeTab.classList.remove('active');
      this.switchStateContainer(activeTab, false);
    }
  }

  toggleActiveTab(e) {
    if (!FusionApi.isEditMode) {
      e.stopPropagation();
      this.setActiveTab(e.target);
    }
  }

  shouldCreateStateContainer() {
    const tabStateContainers = this.querySelectorAll('[data-tab-id]');
    return this.tabs.length > tabStateContainers.length;
  }

  syncInnerContent() {
    const buttons = this.tabs;
    const stateContainers = [...this.querySelectorAll('[data-tab-id]')];
    buttons.forEach((item, index) => {
      const tabId = item.id;
      const targetStateContainer = this.getStateContainerByTabId(tabId) || stateContainers[index];
      targetStateContainer.setAttribute('data-tab-id', tabId);
    });
  }

  createTab(e) {
    e.stopPropagation();
    const tab = e.target;
    tab.addEventListener(this.item.events.remove, this.removeTabHandler);
    // create container if it didn't exist on DOM, because when page is reloaded this function creates containers depending on quantity of existing buttons
    if (!this.getStateContainerByTabId(tab.id) && this.shouldCreateStateContainer()) {
      this.createStateContainer(tab.id);
    }
  }

  removeTab(e) {
    const tab = e.target;
    this.removeStateContainer(tab.id);
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.isRendered && changedProps.has('activate-first-tab')) {
      this.deactivateTab();
      if (this['activate-first-tab']) {
        this.setActiveTab(this.tabs.shift());
      }
    }
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    // in case we add tab group as layout, ids of inner elements are changed and need to be synchronized
    this.syncInnerContent();
    const firstTabIndex = 0;
    if (this['activate-first-tab'] && this.tabs.length && this.activeTab?.id !== this.tabs[firstTabIndex].id) {
      this.activateTab(this.tabs[firstTabIndex]);
    }
  }

  createStateContainer(tabId) {
    const properties = {
      ...FusionTabGroupContainer.properties,
      'data-tab-id': { value: tabId },
      slot: { value: 'state-containers' },
      'background-color': { value: this['background-color'] },
    };
    const { componentName, defaultTemplate } = FusionTabGroupContainer.options;
    return FusionApi.createElement(
      componentName,
      properties,
      defaultTemplate,
      this,
      `#${this.id}`,
      { setActive: false, setState: false },
    );
  }

  getStateContainerByTabId(tabId) {
    return this.querySelector(`[data-tab-id="${tabId}"]`) || null;
  }

  removeStateContainer(tabId) {
    const stateContainer = this.getStateContainerByTabId(tabId);
    if (stateContainer) {
      FusionApi.deleteElement(stateContainer.id, false, true);
    }
  }

  switchStateContainer({ id }, shouldActivate) {
    const stateContainer = this.getStateContainerByTabId(id);
    if (shouldActivate) {
      stateContainer.activate();
    } else {
      stateContainer.inactivate();
    }
  }

  async generateItem() {
    const { propCount, domCount } = this.getItemsCount();
    const slot = { value: 'buttons' };
    if (propCount > domCount) {
      await this.addGeneratedItem({ slot });
    } else if (propCount <= domCount) {
      await this.addCustomItem({
        custom: { value: true },
        slot,
      });
    }
  }

  static get synchronizableProperties() {
    const properties = [
      'tab-background-color', 'background-color', 'tab-border-color',
      'tab-border-width', 'tab-border-left-width', 'tab-border-left-style',
      'tab-border-left-color', 'tab-border-top-width', 'tab-border-top-style',
      'tab-border-top-color', 'tab-border-right-width', 'tab-border-right-style',
      'tab-border-right-color', 'tab-border-bottom-width', 'tab-border-bottom-style',
      'tab-border-bottom-color', 'tab-border-style', 'tab-border-radius', 'tab-font-family',
      'tab-font-weight', 'tab-font-size', 'tab-font-style', 'tab-color', 'active-background-color',
      'active-color', 'tab-width', 'tab-height', 'hidden', 'show-in-editor', 'data-flag-on', 'required',
    ];
    const filteredProp = getPartial(this.properties, properties);
    return { ...filteredProp };
  }

  static get propertiesForRenaming() {
    return {
      'tab-border-width': 'border-width',
      'tab-border-top-width': 'border-top-width',
      'tab-border-left-width': 'border-left-width',
      'tab-border-bottom-width': 'border-bottom-width',
      'tab-border-right-width': 'border-right-width',
      'tab-border-style': 'border-style',
      'tab-border-top-style': 'border-top-style',
      'tab-border-left-style': 'border-left-style',
      'tab-border-bottom-style': 'border-bottom-style',
      'tab-border-right-style': 'border-right-style',
      'tab-border-color': 'border-color',
      'tab-border-top-color': 'border-top-color',
      'tab-border-left-color': 'border-left-color',
      'tab-border-bottom-color': 'border-bottom-color',
      'tab-border-right-color': 'border-right-color',
      'tab-border-radius': 'border-radius',
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host,
        :host * {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
           user-select: none;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          transform: translate3d(0, 0, 0);
        }
        :host(:not(.edit-mode)) {
          pointer-events: none;
        }
        :host > * {
          pointer-events: all;
        }
        .buttons-wrapper {
          --top: auto;
          position: absolute;
          bottom: 100%;
          left: 0;
          display: flex;
          background-color: transparent !important;
        }
        .state-containers-wrapper {
          height: 100%;
          min-height: var(--min-height);
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host .state-containers-wrapper {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  render() {
    // @todo need to remove wrapper slot. This slot using for fix bug after adding a component in slide
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class="buttons-wrapper items-wrapper">
        <slot name="buttons"></slot>
      </div>
      <div class="state-containers-wrapper items-wrapper">
        <slot name="state-containers"></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionTabGroup };
