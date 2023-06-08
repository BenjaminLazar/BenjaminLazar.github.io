import { css, html } from 'lit-element';
import { FusionStateContainer } from '../../state-container';
import {
  applyMixins,
} from '../../../mixins';
import { Effect } from '../../../mixins/props';

class FusionTabGroupContainer extends applyMixins(FusionStateContainer, [
  Effect,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-tab-group-container',
      componentUIName: 'Tab Group Container',
      isRootNested: false,
      draggable: false,
      resizable: false,
    };
  }

  static get properties() {
    const {
      width, height, top, left, position, 'track-visit': trackVisit, ...rest
    } = super.properties;
    return {
      top: {
        ...top,
        value: '0px',
      },
      left: {
        ...left,
        value: '0px',
      },
      position: {
        ...position,
        value: 'absolute',
      },
      'track-visit': {
        ...trackVisit,
        value: 'on',
      },
      ...rest,
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          width: 100%;
          height: 100%;
        }
        [part="overlay"] {
          background-color: var(--background-color);
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <div part="animated-wrapper" class="${this.effect}">
        <div part="overlay"><slot></slot></div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionTabGroupContainer };
