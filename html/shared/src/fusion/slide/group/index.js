import { html, css } from 'lit-element';
import { FusionBase } from '../../base';
import {
  applyMixins,
  SlideComponentBase,
} from '../../mixins';
import {
  Alignment,
  Border,
  Background,
  Container,
  Dimensions,
  Display,
  FieldDefinition,
  DisplayFlex,
} from '../../mixins/props';
import { intersectMap } from '../../utils';
import { BorderUpdateHandler } from '../../services/border-update-handler';

class FusionGroup extends applyMixins(FusionBase, [
  SlideComponentBase,
  Alignment,
  Container,
  Dimensions,
  Display,
  DisplayFlex,
  Background,
  Border,
  FieldDefinition,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-group',
      componentUIName: 'Group Container',
      componentDescription: 'Group components and other elements in order to move and copy/paste together',
    };
  }

  checkSizes(changedProps) {
    const properties = intersectMap(changedProps, this.constructor.sizeTriggers);
    Array.from(properties.keys()).forEach((prop) => this.setSize(prop));
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          border: none;
        }
        .fusion-group {
          display: flex;
          flex-direction: var(--flex-direction);
          width: 100%;
          height: 100%;
          background-color: var(--background-color);
          border: var(--border-width) var(--border-style) var(--border-color);
          border-radius: var(--border-radius);
        }
      `,
    ];
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host {
        overflow: var(--overflow);
      }
      :host .fusion-group {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='fusion-group'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionGroup };
