import { css } from 'lit-element';
import { createObjectItem } from '../../../fusion/utils';
import { FusionList } from '../../../fusion/slide/list';
import { CustomListItem } from './custom-list-item';
import { applyMixins, ContentModule } from '../../../fusion/mixins';
import { Image, Dimensions } from '../../../fusion/mixins/props';

class CustomList extends applyMixins(FusionList, [
  Image,
  Dimensions,
  ContentModule,
]) {
  static get options() {
    return {
      ...super.options,
      componentName: 'custom-list',
      componentUIName: 'Custom List',
      componentScope: 'custom',
      componentDescription: 'Custom list',
      componentDomain: 'slide',
      nestedComponents: ['custom-list-item'],
    };
  }

  static get properties() {
    const {
      src,
      indication,
      width,
      height,
      'lock-aspect-ratio': lockAspectRatio,
      ...rest
    } = super.properties;
    return {
      width: {
        ...width,
        value: '400px',
      },
      indication: {
        ...indication,
        selectOptions: [...indication.selectOptions, 'image'],
      },
      'indication-src': {
        ...src,
        value: '../shared/assets/images/checkbox-icon.png',
      },
      'indication-width': {
        ...width,
        value: '15px',
      },
      'indication-height': {
        ...height,
        value: '15px',
      },
      ...rest,
    };
  }

  static getIndication(indicatorType, index) {
    const target = indicatorType !== 'image' ? super.getIndication(indicatorType, index) : 'image';
    return target;
  }

  update(changedProps) {
    super.update(changedProps);
  }

  static isIndicationAttrUpdated(changedProps) {
    return changedProps.has('indication') || changedProps.has('indication-src') || changedProps.has('indication-width')
      || changedProps.has('indication-height');
  }

  setItemsIndication() {
    this.constructor.getExistingItems(this.item.component, this).forEach((elem, index) => {
      const indicator = this.getIndicator(index);
      elem.setAttribute('indicator', indicator);
      elem.querySelector('[slot="indicator"]').innerHTML = this.indication !== 'image' ? indicator : this.getImage();
    });
  }

  getImage() {
    return `<img src="${this['indication-src']}" 
        alt="indication image" 
        style="width: ${this['indication-width']}; 
        height:${this['indication-height']};
        object-fit: contain;">`;
  }

  constructor() {
    super();
    this.item = createObjectItem(CustomListItem);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host  {
          width: var(--width); 
        }        
      `,
    ];
  }
}

export { CustomList };
