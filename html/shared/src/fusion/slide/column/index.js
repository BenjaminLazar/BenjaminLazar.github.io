import { html, css, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import { breakpoints } from '../../../config';
import {
  applyMixins,
  SlideComponentBase,
  ModeTrackable,
} from '../../mixins';
import {
  AllowLayout,
  Container,
  Dimensions,
  Display,
  DisplayFlex,
  Alignment,
  Background,
  Border,
  GridItem,
  FieldDefinition,
} from '../../mixins/props';
import { BorderUpdateHandler } from '../../services/border-update-handler';

const tabletBreakpoint = `${breakpoints.tablet || 1279}px`;
const mobileBreakpoint = `${breakpoints.mobile || 767}px`;

class FusionColumn extends applyMixins(FusionBase, [
  SlideComponentBase,
  AllowLayout,
  Container,
  GridItem,
  Dimensions,
  Display,
  DisplayFlex,
  Alignment,
  Background,
  Border,
  ModeTrackable,
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
          value: true,
          hide: true,
        },
      },
      componentName: 'fusion-column',
      componentUIName: 'Column',
      componentDescription: 'Column container for rows or grids',
    };
  }

  static get properties() {
    const {
      width,
      'flex-direction': flexDirection,
      ...filteredProps
    } = super.properties;
    return {
      display: {
        type: String,
        fieldType: 'RadioGroup',
        propertyGroup: 'layout',
        value: 'block',
        selectOptions: [
          { value: 'block' },
          { value: 'flex' },
          { value: 'grid' },
        ],
        dependencyProps: [
          {
            value: 'block',
            props: [
              'flex-direction',
              'data-horizontal',
              'data-vertical',
            ],
            action: 'hide',
          },
          {
            value: 'grid',
            props: [
              'flex-direction',
              'data-horizontal',
              'data-vertical',
            ],
            action: 'hide',
          },
        ],
      },
      'flex-direction': {
        ...flexDirection,
        selectOptions: [
          { value: 'column' },
          { value: 'column-reverse' },
        ],
      },
      ...filteredProps,
      width: {
        ...width,
        value: '100%',
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      this.generateCssProperty('flex-direction'),
      css`
        :host .fusion-column {
          display: var(--display);
          width: 100%;
          height: 100%;
          min-height: inherit;
        }
        :host {
          display: block;
          border: none;
        }
        :host([grid-columns='0']) {
          display: none;
        }
        /* tablet */
        @media only screen and (max-width: ${unsafeCSS(tabletBreakpoint)}) {
          :host([grid-columns-tablet='0']) {
            display: none;
          }
        }
        /* mobile */
        @media only screen and (max-width: ${unsafeCSS(mobileBreakpoint)}) {
          :host([grid-columns-mobile='0']) {
            display: none;
          }
        }
        :host(.${unsafeCSS(ModeTrackable.NoteModeClassName)}) {
          z-index: auto;
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host .fusion-column {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
      :host {
        grid-column: ${this['grid-column-start']} / span ${this['grid-columns']};
        grid-row: ${this['grid-row-start']} / span ${this['grid-rows']};
      }
      /* tablet */
      @media only screen and (max-width: ${unsafeCSS(tabletBreakpoint)}) {
        :host {
          grid-column: ${this['grid-column-start-tablet']} / span ${this['grid-columns-tablet']};
          grid-row: ${this['grid-row-start-tablet']} / span ${this['grid-rows-tablet']}
        }
      }
      /* mobile */
      @media only screen and (max-width: ${unsafeCSS(mobileBreakpoint)}) {
        :host {
          grid-column: ${this['grid-column-start-mobile']} / span ${this['grid-columns-mobile']};
          grid-row: ${this['grid-row-start-mobile']} / span ${this['grid-rows-mobile']}
        }
      }
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class="fusion-column">
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionColumn };
