import { css, unsafeCSS } from 'lit-element';
import { applyMixins, ModeTrackable } from '../index';
import { Asset } from './asset';
import { isReflectiveBoolean } from '../../utils';

/**
  @mixin [<Video>] provides a list of standard properties (src, controls, autoplay, muted, lock-aspect-ratio)
  that is intended to be added to slide components as a part of base functionalities. The mixin uses a predefined
  template for the video tag attributes which should be added to video player template.
*/

export function Video(superClass) {
  return class extends applyMixins(superClass, [
    Asset,
  ]) {
    static get properties() {
      const { src } = super.properties;
      return {
        ...super.properties,
        src: {
          ...src,
          value: ' ',
          assetType: 'Video',
          propertyGroup: 'media',
        },
        controls: {
          type: Boolean,
          fieldType: 'Boolean',
          propertyArea: 'settings',
          propertyGroup: 'controls',
          value: isReflectiveBoolean(),
          prop: true,
        },
        autoplay: {
          type: Boolean,
          fieldType: 'Boolean',
          propertyArea: 'settings',
          propertyGroup: 'controls',
          value: false,
          prop: true,
          dependencyProps: [
            {
              value: true,
              props: ['muted'],
              action: 'disable',
            },
            {
              value: false,
              props: ['muted'],
              action: ' ',
            },
          ],
        },
        muted: {
          type: Boolean,
          fieldType: 'Boolean',
          propertyArea: 'settings',
          propertyGroup: 'controls',
          value: false,
          prop: true,
        },
      };
    }

    static get styles() {
      return [
        super.styles,
        css`
        :host video {
          height: 100%;
          width: 100%;
        }
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) video {
          pointer-events: none;
        }
        :host video:focus {
          outline: none;
        }
      `,
      ];
    }
  };
}
