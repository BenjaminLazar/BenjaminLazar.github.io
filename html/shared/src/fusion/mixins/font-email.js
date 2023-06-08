import { css } from 'lit-element';

export function FontEmail(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        'font-size': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'text',
          value: '16px',
          availableUnits: [{ unitType: 'px' }],
        },
        'font-family': {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'text',
          value: '',
          selectOptions: this.setupWebFont(),
        },
        'font-weight': {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'text',
          value: '',
          selectOptions: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
        },
        'font-style': {
          type: String,
          fieldType: 'RadioGroup',
          propertyGroup: 'text',
          value: '',
          selectOptions: [
            { value: 'normal', icon: 'nonitalic' },
            { value: 'italic', icon: 'italic' },
          ],
        },
        ...super.properties,
      };
    }

    static get styles() {
      return [
        super.styles,
        css`
          ::slotted(div.ql-editor),
          ::slotted(div[slot="content"]) {
            font-size: var(--font-size);
            font-weight: var(--font-weight);
            font-style: var(--font-style);
          }
          :host([font-size]) {
            font-size: var(--font-size);
          }
          :host([font-weight]) {
            font-weight: var(--font-weight);
          }
          :host([font-style]) {
            font-style: var(--font-style);
          }
      `,
      ];
    }

    static setupWebFont() {
      const safeFonts = [
        'Arial',
        'Arial Black',
        'Comic Sans MS',
        'Courier New',
        'Georgia',
        'Helvetica',
        'Impact',
        'Monaco',
        'Tahoma',
        'Times New Roman',
        'Trebuchet MS',
        'Verdana',
      ];

      const webFonts = [...document.querySelectorAll('mj-font')].map((el) => this.insertLink(el));
      return [...webFonts, ...safeFonts];
    }

    /**
     * Dynamic inserting custom Web Font to head part into Activator.
     * Note: It will be in generated html. ONLY Activator edit view
     * @param {DOMElement} el
     * @returns {text} name of web font
     */
    static insertLink(el) {
      const name = el.getAttribute('name');
      const link = document.querySelector(`link[name="${name}"]`);
      if (!link) {
        const linkEl = document.createElement('link');
        linkEl.setAttribute('rel', 'stylesheet');
        linkEl.setAttribute('href', el.getAttribute('href'));
        linkEl.setAttribute('name', name);
        document.querySelector('head').appendChild(linkEl);
      }
      return name;
    }
  };
}
