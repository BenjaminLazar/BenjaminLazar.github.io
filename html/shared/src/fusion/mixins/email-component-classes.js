import config from '../../config.json';

const viewportVisibilityAttrPrefix = 'data-mo-hidden-on-';

export function EmailComponentBaseClasses(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        ...this.generatePropsList(),
        'css-class': {
          type: String,
          fieldType: 'hidden',
          propertyGroup: 'component',
          value: `${this.options.componentName}-base`,
          reflect: true,
        },
        class: {
          type: String,
          fieldType: 'hidden',
          propertyGroup: 'component',
          value: `${this.options.componentName}-base`,
        },
      };
    }

    static getValidViewPorts() {
      const emailClients = ['desktop', 'mobile'];
      return config.targetResolutions.filter((entity) => emailClients.includes(entity.device)) || [];
    }

    static generatePropsList() {
      const validViewPorts = this.getValidViewPorts();
      const generatedPropsList = {};
      validViewPorts.forEach((item) => {
        generatedPropsList[`${viewportVisibilityAttrPrefix}${item.width}`] = {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'deviceVisibility',
          value: 'show',
          selectOptions: [
            { value: 'hide' },
            { value: 'show' },
          ],
        };
      });
      return generatedPropsList;
    }

    deviceVisibilityHandler(changedProps) {
      const [[name]] = changedProps;
      if (this[name] === 'hide' && !this['css-class'].includes(name)) {
        this['css-class'] = this['css-class'].length ? `${this['css-class']} ${name}` : name;
      }
      if (this[name] === 'show' && this['css-class'].includes(name)) {
        const cssClasses = this['css-class'].split(' ');
        const indexOfHidden = cssClasses.indexOf(name);
        cssClasses.splice(indexOfHidden, 1);
        this['css-class'] = cssClasses.join(' ');
      }
    }

    updated(changedProps) {
      super.updated(changedProps);
      if (this.isRendered) {
        this.deviceVisibilityHandler(changedProps);
      }
      if (!this.getAttribute('css-class') && changedProps.has('css-class')) {
        const { componentName } = this.constructor.options;
        this.setAttribute('css-class', `${componentName}-base`);
        this.setAttribute('class', `${componentName}-base`);
      }
    }

    /*
    * In order for the instances of components that were created earlier
    * not to receive the value of the attributes during the initialization
    * of the component, but could be updated by the domparser with the consent
    * of the user, it is necessary to maintain such logic
    * */
    constructor() {
      super();
      this['css-class'] = '';
      this.class = '';
    }
  };
}
