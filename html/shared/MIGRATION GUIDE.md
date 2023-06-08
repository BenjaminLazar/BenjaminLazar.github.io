#Migration from 1.9.5 to 1.10.0

## Project structure
- if there were any changes in the `webpack.config.js` place only the differences / extends into this file
- if there were any changes in the `src/store.js` place only new reducers here
- if there were any custom mixins added, please move them to `src/components/mixins`
- check the `src/fusion/static/analytics.json` and `src/fusion/static/references.json` imports, the path was changed to `src/data/...`

#Migration from 1.8.0/1.8.1 to 1.9.0

## Project structure
- move custom components/layouts to the `slide` folder. So it should be
`components/slide/custom-component` etc.
## Custom components
You should check structure of standard components as example and do next changes:
- change `import { html } from '@polymer/lit-element'` to `import { html, css } from 'lit-element'`;
- change `getSystemSlotTemplate` to `systemSlotTemplate` for custom components;
- change `static getStyle()` to `static get styles()` and use unsafeCSS for variables;
- check for usage of veevaData requests in custom components (menu etc). If present - change logic (use data from store to avoid request duplication);
- check references (use data from store).

## Items Wrapper
The ItemsWrapper mixin creates nested components in the one slot.
If custom component in previous version used ItemsWrapper mixin (or was extended from list, sortable list, side menu components), you should check next points in yours component for correct migration:
- change `this.constructor.createObjectItem(component)` to `createObjectItem(component)`. This method is removed from ItemsWrapper. You can use it from [utils.js](./src/fusion/utils.js);
- change passing param from `this.item.name` to `this.item.component` in the this.constructor.getExistingItems();
- delete slots in fragments for lists.
