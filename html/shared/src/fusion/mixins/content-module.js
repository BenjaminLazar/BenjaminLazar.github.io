export function ContentModule(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        'content-module-id': {
          type: String,
          fieldType: 'hidden',
          value: '',
        },
        'content-module-asset-id': {
          type: String,
          fieldType: 'hidden',
          value: '',
        },
      };
    }

    /**
     * @description Method for inserting content module in the component
     * @param {String} content html string that needs to be added as new content
     */
    setContentModule() { // eslint-disable-line class-methods-use-this
      // overwrite this method to insert the content module
    }
  };
}
