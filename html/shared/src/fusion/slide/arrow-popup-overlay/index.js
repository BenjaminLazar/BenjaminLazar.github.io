import { html, css } from 'lit-element';
import { FusionCustomPopupOverlay } from '../custom-popup-overlay';

class FusionArrowPopupOverlay extends FusionCustomPopupOverlay {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-arrow-popup-overlay',
      componentUIName: 'Arrow Overlay',
      componentDescription: 'Popup with selectable placement of pointing arrow',
    };
  }

  static get properties() {
    const {
      position,
      color,
      'font-weight': fontWeight,
      'font-style': fontStyle,
      ...rest
    } = super.properties;
    return {
      ...rest,
      'arrow-width': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'arrowPopup',
        value: '40px',
        availableUnits: [{ unitType: 'px' }],
      },
      'arrow-height': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'arrowPopup',
        value: '40px',
        availableUnits: [{ unitType: 'px' }],
      },
      'arrow-position': {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'arrowPopup',
        value: 'left-top',
        selectOptions: [
          'top-left',
          'top-center',
          'top-right',
          'left-top',
          'left-center',
          'left-bottom',
          'right-top',
          'right-center',
          'right-bottom',
          'bottom-left',
          'bottom-center',
          'bottom-right',
        ],
      },
    };
  }

  /**
   *
   * @description if we set `left-top` arrow position, we're getting next:
   * originOne - left
   * originTwo - top
   * oppositeOne - right (opposite from left)
   * oppositeTwo -bottom (opposite from top)
   * @returns {{oppositeTwo: string, originTwo: string, oppositeOne: string, originOne: string}}
   */

  getArrowPosition() {
    const [originOne, originTwo] = this['arrow-position'].split('-');
    const positions = this.constructor.getOppositePosition;
    const oppositeOne = positions(originOne);
    const oppositeTwo = positions(originTwo);
    return {
      originOne: originOne.toLowerCase(), originTwo: originTwo.toLowerCase(), oppositeOne, oppositeTwo,
    };
  }

  static getOppositePosition(position) {
    const positions = {
      left: 'right',
      right: 'left',
      top: 'bottom',
      bottom: 'top',
    };
    return positions[position];
  }

  getCorneredArrowStyle() {
    const { originTwo, oppositeOne, oppositeTwo } = this.getArrowPosition();
    const borderStyle = this.constructor.getBorderSideStyle();
    return `
      :host [part='overlay']:before {
        ${oppositeOne}: calc(100% - var(--border-width));
        ${originTwo}: var(--border-radius);
        border-${originTwo}: ${borderStyle};
        border-${oppositeTwo}: ${borderStyle};
        border-${oppositeOne}: var(--arrow-width) solid var(--border-color);
      }
    `;
  }

  getCenteredArrowStyle() {
    const { oppositeOne } = this.getArrowPosition();
    const borderStyle = this.constructor.getBorderSideStyle();
    return `
      :host [part='overlay']:before {
        ${oppositeOne}: calc(100% - var(--border-width));
        border-${oppositeOne}: var(--arrow-width) solid var(--border-color);
      }
      :host .top-center:before,
      :host .bottom-center:before {
        left: 50%;
        transform: translateX(-50%);
        border-left: ${borderStyle};
        border-right: ${borderStyle};
      }
      :host .left-center:before,
      :host .right-center:before {
        top: 50%;
        transform: translateY(-50%);
        border-top: ${borderStyle};
        border-bottom: ${borderStyle};
      }
    `;
  }

  static getBorderSideStyle() {
    return 'calc(var(--arrow-height) / 2) solid rgba(255, 255, 255, 0)';
  }

  getArrowStyle() {
    return this['arrow-position'].includes('center') ? this.getCenteredArrowStyle() : this.getCorneredArrowStyle();
  }

  updateArrowStyleByBorderWidth() {
    const startVisibleBorderFrom = 0.02;
    if (this.constructor.isBorderEmpty(...this.getBorderProps(startVisibleBorderFrom))) {
      const { oppositeOne } = this.getArrowPosition();
      return `
        :host [part='overlay']:before {
          ${oppositeOne}: 100%;
          border-${oppositeOne}-color: var(--background-color);
        }`;
    }
    return '';
  }

  static get styles() {
    return [
      super.styles,
      css`
        [part="overlay"]:before {
          content: "";
          position: absolute;
          border: solid transparent;
          pointer-events: none;
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      ${this.getArrowStyle()}
      ${this.updateArrowStyleByBorderWidth()}
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div part='overlay' class=${this['arrow-position']}><slot></slot></div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionArrowPopupOverlay };
