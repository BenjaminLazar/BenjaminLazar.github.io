import { Asset } from './asset.js';
import { applyMixins } from '../index';

/**
 @mixin [<Image>] provides a list of standard properties (src, lock-aspect-ratio, alt) that is intended
 to be added to slide components as a part of base functionalities.  Mixin can't be used as it is,
 Additional definition of the place of application of properties is needed (alt).
 */

export function Image(superClass) {
  return class extends applyMixins(superClass, [
    Asset,
  ]) {
    static get properties() {
      const { src } = super.properties;
      return {
        ...super.properties,
        src: {
          ...src,
          propertyGroup: 'image',
        },
        'medium-src': {
          fieldType: 'Modal',
          propertyGroup: 'image',
          assetType: 'Image',
          value: '',
          prop: true,
          reflect: true,
        },
        'large-src': {
          fieldType: 'Modal',
          propertyGroup: 'image',
          assetType: 'Image',
          value: '',
          prop: true,
          reflect: true,
        },
        alt: {
          type: String,
          fieldType: 'String',
          propertyGroup: 'image',
          propertyArea: 'settings',
          value: 'Image',
        },
      };
    }
  };
}
