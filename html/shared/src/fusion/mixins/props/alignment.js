// @note: need to solve the problem with unnecessary imports
import { html, css } from 'lit-element';
import config from '../../../config.json';

export class FusionAligner {
  static get flexValuesConfig() {
    return {
      alignment: {
        propertyGroup: 'alignment',
        vertical: {
          top: 'flex-start',
          center: 'center',
          bottom: 'flex-end',
          between: 'space-between',
          evenly: 'space-evenly',
        },
        horizontal: {
          left: 'flex-start',
          center: 'center',
          right: 'flex-end',
          stretch: 'stretch',
        },
      },
      axis: {
        propertyGroup: 'layoutDirection',
        column: true,
        row: false,
      },
    };
  }
}

export function Alignment(superClass) {
  return class extends superClass {
    constructor() {
      super();
      this.isUseDataAxis = false;
    }

    static get options() {
      return {
        ...super.options,
        alignConfig: FusionAligner.flexValuesConfig,
      };
    }

    static get styles() {
      if (!config.responsive) {
        return [super.styles];
      }
      return [
        super.styles,
        css`
          :host > *:not([name="mo-system"], style) {
            align-items: var(--align-items);
            justify-content: var(--justify-content);
          }
        `,
      ];
    }

    get dynamicStyles() {
      return config.responsive ? html`${super.dynamicStyles}${this.flexAlignmentValues}` : html`${super.dynamicStyles}`;
    }

    get flexAlignmentValues() {
      const alignItems = this.isUseDataAxis ? this.getDirectionStyle('vertical') : this.getDirectionStyle('horizontal');
      const justifyContent = this.isUseDataAxis ? this.getDirectionStyle('horizontal') : this.getDirectionStyle('vertical');
      this.isUseDataAxis = false;
      return html`
        :host {
          --align-items: ${alignItems};
          --justify-content: ${justifyContent};
        }
      `;
    }

    supportDataAxis() {
      const dataAxisAttribute = this.getAttribute('data-axis');
      if (dataAxisAttribute === 'row' && !this.getAttribute('flex-direction')) {
        this['flex-direction'] = dataAxisAttribute;
        this.isUseDataAxis = true;
      }
    }

    connectedCallback() {
      super.connectedCallback();
      this.supportDataAxis();
    }

    getDirectionStyle(direction) {
      let style = 'flex-start';
      // Need add this prefix to direction property to get data property from component
      const datasetPrefix = 'data';
      const flexValuesConfig = FusionAligner.flexValuesConfig.alignment[direction];
      if (flexValuesConfig) {
        // Combine data prefix with direction to get current property
        const property = `${datasetPrefix}-${direction}`;
        // Figure out current value from data property in current component
        const currentValue = this[property];
        if (currentValue && flexValuesConfig[currentValue]) {
          style = flexValuesConfig[currentValue];
        }
      }

      return style;
    }
  };
}
