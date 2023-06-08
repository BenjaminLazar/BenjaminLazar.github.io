import { FusionStore } from '../services/fusion-store';

export function LinkExtension(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        href: {
          type: String,
          fieldType: 'Link',
          propertyArea: 'settings',
          propertyGroup: 'link',
          value: '',
        },
        target: {
          type: String,
          fieldType: 'Select',
          propertyArea: 'settings',
          propertyGroup: 'link',
          value: '_blank',
          selectOptions: [
            '_blank',
            '_self',
            '_parent',
            '_top',
          ],
        },
      };
    }

    openLink() {
      if (this.href && !FusionStore.isEditMode) {
        const target = FusionStore.isActivator ? '_blank' : this.target;
        window.open(this.href, target || '_self');
      }
    }

    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.setAttribute('data-mo-prevent-link', true);
    }
  };
}
