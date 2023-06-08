import { html } from 'lit-html';
import { css } from 'lit-element';
import { FusionBase } from '../../base';
import { applyMixins, EmailComponent, ModeTrackable } from '../../mixins';
import { FieldDefinition } from '../../mixins/props';

class MJBody extends applyMixins(FusionBase, [
  EmailComponent,
  ModeTrackable,
  FieldDefinition,
]) {
  static get options() {
    return {
      ...super.options,
      sortable: false,
      componentName: 'mj-body',
      componentUIName: 'Body',
      componentDescription: 'Email body element',
      removable: false,
      nestedComponents: ['mj-wrapper'],
    };
  }

  static get properties() {
    return { ...super.properties };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: static;
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='mj-body'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { MJBody };
