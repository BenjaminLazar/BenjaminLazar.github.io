import { css, html } from 'lit-element';
import { FusionListItem } from '../../list/list-item';

class FusionReferenceItem extends FusionListItem {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-reference-item',
      componentUIName: 'Reference Item',
      componentDescription: 'Component for showing reference item',
      defaultTemplate: '<div slot="indicator"></div><div slot="icon"></div><div slot="content">Text</div>',
    };
  }

  static getTemplate() {
    return html`
      <div class='content'>
        <slot name='indicator'></slot>
        <slot name='icon'></slot>
        <slot name='content'></slot>
      </div>
    `;
  }

  static alignIconConfig(prop) {
    const align = {
      top: {
        'background-position-y': 'top',
      },
      middle: {
        'background-position-y': 'center',
      },
      bottom: {
        'background-position-y': 'bottom',
      },
    };
    return align[prop];
  }

  getIconAlign() {
    const verticalAlign = this.constructor.alignIconConfig(this['indication-vertical-align']);
    return `
      :host ::slotted([slot="icon"]) {
        ${this.constructor.getPositions(verticalAlign)}
      }
    `;
  }

  static getPositions(verticalAlign) {
    return Object.keys(verticalAlign).reduce((style, key) => {
      let requiredStyle = style;
      requiredStyle = `${requiredStyle}${key}: ${verticalAlign[key]};`;
      return requiredStyle;
    }, '');
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host ::slotted([slot="icon"]) {
          margin: 3px 0;
          min-width: var(--font-size);
          background-position-x: center;
          background-size: var(--font-size);
          background-repeat: no-repeat;
        }
        :host ::slotted(.document) {
          background-image: url(../shared/src/fusion/slide/references-popup/reference-item/assets/images/fusion-document.png);
        }
        :host ::slotted(.pdf) {
          background-image: url(../shared/src/fusion/slide/references-popup/reference-item/assets/images/fusion-pdf.png);
        }
        :host ::slotted(.hidden) {
          display: none;
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      ${this.getIconAlign()}
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      ${this.constructor.getTemplate()}
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionReferenceItem };
