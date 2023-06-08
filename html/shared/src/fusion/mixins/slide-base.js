import { css, html, unsafeCSS } from 'lit-element';
import { FusionApi } from '../api';
/* activatorOnly:start */
import { generalIconsStyles } from '../styles';
/* activatorOnly:end */
import config from '../../config.json';

const defaultPosition = config.responsive ? 'static' : 'absolute';
const isResizable = config.responsive ? false : 'all';
const isDraggable = config.responsive ? false : 'xy';

const viewportVisibilityAttrPrefix = 'data-width-visibility-';

/**
 * @description Mixin for slide component base setup. Includes default slide component options
 * and basic component levels in layout functionality. Since 1.13.0 should be used instead of
 * SlideComponent mixin.
 */

export function SlideComponentBase(superClass) {
  return class extends superClass {
    static get options() {
      return {
        ...super.options,
        componentDomain: 'slide',
        isRootNested: true,
        resizable: isResizable,
        draggable: isDraggable,
        rotatable: !config.responsive,
        sortable: false,
      };
    }

    static getValidViewPorts() {
      return config.targetResolutions?.filter((item) => !!item.width)?.sort((a, b) => a.width - b.width) || [];
    }

    static generatePropsList() {
      const validViewPorts = this.getValidViewPorts();
      const generatedPropsList = {};
      validViewPorts.forEach((item) => {
        generatedPropsList[`${viewportVisibilityAttrPrefix}${item.width}`] = {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'deviceVisibility',
          value: 'show',
          selectOptions: [
            { value: 'hide' },
            { value: 'show' },
          ],
        };
      });
      return generatedPropsList;
    }

    static generateMediaQuery(minEdge, maxEdge, width) {
      const minWidth = `${minEdge}px`;
      const maxWidth = maxEdge ? `${maxEdge}px` : '';
      const attributeSelector = `[${viewportVisibilityAttrPrefix}${width}='hide']`;
      const maxWidthStyles = maxWidth ? `and (max-width: ${maxWidth})` : '';
      return css`
        @media only screen and (min-width: ${unsafeCSS(minWidth)}) ${unsafeCSS(maxWidthStyles)} {
          :host(${unsafeCSS(attributeSelector)}) {
            display: none;
          }
        }
      `;
    }

    static get properties() {
      return {
        ...super.properties,
        ...this.generatePropsList(),
        position: {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'position',
          value: defaultPosition,
          selectOptions: [
            { value: 'absolute', icon: 'positionabsolute' },
            { value: 'relative', icon: 'positionrelative' },
            { value: 'fixed', icon: 'positionfixed' },
            { value: 'static', icon: 'x-small' },
          ],
          dependencyProps: [
            {
              value: 'static',
              props: ['top', 'left'],
              action: 'hide',
            },
          ],
        },
      };
    }

    /**
     * Update direction value
     * @param {string} directionName top, left, right, bottom - possible options
     * @param {string} [directionValue] direction value
     */

    async updateDirection(directionName, directionValue = '0px') {
      this.setAttribute(directionName, directionValue);
      await FusionApi.updateAttributeList({
        attrList: [{ attrKey: directionName, attrValue: directionValue }],
        isComponent: true,
        selectorId: this.id,
      });
    }

    /**
     * Check if element direction exists and if so change it value
     * @param {array.<string>} directions top, left, right, bottom options
     */
    async directionHandler(directions) {
      directions.forEach((item) => {
        if (this.hasAttribute(item) && !this.constructor.properties[item].calculated) {
          this.updateDirection(item);
        }
      });
    }

    validateUpdateProcess(changedProps) {
      return this.isRendered && changedProps.has('position') && this.id;
    }

    async updated(changedProps) {
      super.updated(changedProps);
      if (this.validateUpdateProcess(changedProps)) {
        await this.directionHandler(['top', 'left']);
      }
    }

    static get zIndex() {
      return this.options.componentType === 'dynamic' ? 'var(--level)' : '1';
    }

    /**
     * Handles if style should exist depends on component property presence
     * @param {string} property style value variable, and if key wasn't specified, will be used as a key
     * @param {string} [selector=:host > *:not([name="mo-system"], style)] css selector
     * @param {string} [cssProperty] style key
     * @param {boolean} [isImportant=false] add priority !important
     * @returns {CSSResult} css stylesheet
     */
    static generateCssProperty(property, selector = ':host > *:not([name="mo-system"], style)', cssProperty, isImportant = false) {
      const cssRule = cssProperty ?? property;
      const state = `--${property}`;
      const importance = isImportant ? ' !important' : '';
      return this.properties[property]
        ? css`
        ${unsafeCSS(selector)} {
        ${unsafeCSS(cssRule)}: var(${unsafeCSS(state)})${unsafeCSS(importance)};}` : css``;
    }

    static generateQueryRanges(viewPorts) {
      return viewPorts.map((item, index, arr) => {
        const minWidth = index === 0 ? 0 : item.width;
        const maxWidth = (index === arr.length - 1) ? '' : arr[index + 1].width - 1;
        return { minWidth, maxWidth, width: item.width };
      });
    }

    static get styles() {
      const viewPorts = this.getValidViewPorts();
      const queryRanges = this.generateQueryRanges(viewPorts);
      const queries = queryRanges.map((item) => this.generateMediaQuery(item.minWidth, item.maxWidth, item.width));
      return [
        super.styles,
        ...queries,
        /* activatorOnly:start */
        generalIconsStyles,
        /* activatorOnly:end */
        css`
          :host {
            position: var(--position);
            display: block;
          }
          :host > *:not([name="mo-system"], style) {
            box-sizing: border-box;
          }
        `,
      ];
    }

    get dynamicStyles() {
      return html`
        ${super.dynamicStyles}
        :host {
          z-index: ${this.constructor.zIndex};
        }
      `;
    }
  };
}
