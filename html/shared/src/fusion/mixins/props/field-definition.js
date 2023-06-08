/**
 @mixin [<FieldDefinition>] provides a list of standard system properties for the field definition.
 */

export function FieldDefinition(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        required: {
          type: Boolean,
          fieldType: 'Checkbox',
          propertyArea: 'settings',
          propertyGroup: 'field',
          reflect: true,
          attribute: true,
          value: false,
        },
        fieldName: {
          type: String,
          fieldType: 'String',
          propertyGroup: 'field',
          reflect: true,
          attribute: true,
        },
        hidden: {
          type: Boolean,
          reflect: true,
          attribute: true,
          fieldType: 'hidden',
          value: false,
        },
        'show-in-editor': {
          type: Boolean,
          fieldType: 'Boolean',
          propertyArea: 'settings',
          propertyGroup: 'field',
          value: false,
          prop: true,
        },
        'data-flag-on': {
          type: Boolean,
          reflect: true,
          attribute: true,
          fieldType: 'hidden',
          value: false,
        },
        'should-shown': {
          type: Boolean,
          fieldType: 'hidden',
          value: false,
        },
      };
    }

    get isFieldNameEmpty() {
      return !this.fieldName || this.fieldName === '' || this.fieldName === 'undefined';
    }

    get isSystemFlagPropertyExists() {
      return this['data-flag-on'];
    }

    get isShowInEditor() {
      return this['should-shown'];
    }

    updateFieldName() {
      let name = '';
      if (this.isFieldNameEmpty) {
        name = this.getUniqFieldName();
        this.updateShowInEditorAttribute(this.isShowInEditor);
      } else {
        name = this.fieldName;
        this.updateShowInEditorAttribute(true);
      }
      this.fieldName = name;
    }

    getUniqFieldName() {
      const components = document.querySelectorAll(this.constructor.options.componentName);
      const nextBiggestNumber = Math.max(...[...components].reduce((acc, key) => {
        const count = key.fieldName ? key.fieldName?.replace(/[^0-9]/g, '') : 0;
        acc.push(count);
        return acc;
      }, [])) + 1;
      return `${this.constructor.options.componentUIName} ${nextBiggestNumber}`;
    }

    updateShowInEditorAttribute(shouldBeShown) {
      if (!this.isSystemFlagPropertyExists && shouldBeShown) {
        this.setAttribute('show-in-editor', shouldBeShown);
      }
      this['data-flag-on'] = true;
    }

    handleFieldName() {
      if (!this.isSystemFlagPropertyExists || this.isFieldNameEmpty) {
        this.updateFieldName();
      }
    }

    emailFieldVisibilityHandler() {
      if (this.hidden) {
        this['css-class'] = this['css-class'].length ? `${this['css-class']} act-hidden` : 'act-hidden';
        this.classList.add('act-hidden');
      } else {
        const cssClasses = this['css-class']?.length ? this['css-class'].split(' ') : [];
        const indexOfHidden = cssClasses.indexOf('act-hidden');
        if (indexOfHidden > -1) cssClasses.splice(indexOfHidden, 1);
        this['css-class'] = cssClasses.join(' ');
        this.classList.remove('act-hidden');
      }
    }

    updated(changedProps) {
      super.updated(changedProps);
      this.handleFieldName();
      if (changedProps.has('hidden')
        && (changedProps.get('hidden') !== undefined)
        && this.constructor.options?.componentDomain === 'email') {
        this.emailFieldVisibilityHandler();
      }
    }
  };
}
