import { css } from 'lit-element';
import { FusionText } from '../../../../fusion/slide/text';

class CustomMediaText extends FusionText {
  // Public property API that triggers re-render (synced with attributes)
  static get properties() {
    const {
      color, 'font-size': fontSize, top, left, ...rest
    } = super.properties;
    return {
      color: {
        ...color,
        value: 'rgba(0, 0, 0, 1)',
      },
      mobileColor: {
        ...color,
        value: 'rgba(0, 0, 0, 1)',
      },
      fontSize: {
        ...fontSize,
        value: '16px',
      },
      mobileFontSize: {
        ...fontSize,
        value: '16px',
      },
      top: {
        ...top,
        value: '90px',
      },
      mobileTop: {
        ...top,
        value: '87px',
      },
      left: {
        ...left,
        value: '315px',
      },
      mobileLeft: {
        ...left,
        value: '255px',
      },
      ...rest,
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'custom-media-text',
      componentUIName: 'Custom Media Text',
      componentScope: 'custom',
      componentDescription: 'Custom Media Text',
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          width: var(--width);
          font-size: var(--fontSize);
        }
        @media only screen and (max-width:990px) {
          :host {
            top: var(--mobileTop)!important;
            left: var(--mobileLeft)!important;
          }
          ::slotted(p) {
            color: var(--mobileColor);
            font-size: var(--mobileFontSize);
          }
        }
      `,
    ];
  }
}

export { CustomMediaText };
