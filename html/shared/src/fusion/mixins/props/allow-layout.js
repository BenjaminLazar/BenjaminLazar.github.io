/**
 @mixin [<AllowLayout>] provides a list of standard system properties which defines suitable placement for layout.
 */

export function AllowLayout(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        'allow-layout': {
          type: Boolean,
          fieldType: 'Boolean',
          propertyArea: 'settings',
          propertyGroup: 'allowLayouts',
          value: false,
        },
      };
    }
  };
}
