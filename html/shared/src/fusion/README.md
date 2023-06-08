# Activator Fusion Components

This folder contain the standard components developed for Activator.

Code should not be edited in this folder as all content can be replaced during
upgrades.

To report bugs, email description to sli@anthillagency.com 

# Lifecycle
All components inherit the [lifecycle hooks of the LitElement](https://lit-element.polymer-project.org/guide/lifecycle).
Additionally there are added the following hooks:

# Events
* ```rendered``` - fired after the component has been rendered (in the ```firstUpdated``` hook);
* ```published``` - fired after FusionAPI has send the `addElement` request to the backend;

# Options
There are several options available needed for interaction with Activator and using in the DOM:
- `componentName`: used as the tag name
- `componentUIName`: used as the name of component in the Activator UI
- `componentScope`: whether the component is standard / custom / brand
- `componentType`: static / dynamic
- `componentCategory`: elements / container / text / media / interaction / menu / data / overlay / custom
- `componentDescription`: description of the component
- `componentDomain`: slide / email
- `isTextEdit`: whether the component has an editable text
- `isRootNested`: whether the component can be inserted to the root
- `nestedComponents`: list of components, which can be used as children of this component
- `excludedComponents`: list of components, which will be excluded from nestedComponents
- `defaultTemplate`: HTML string, representing the contents of the component, which will be added upon component creation by Activator
- `resizable`: jQuery resizable setting, e.g. 'all' / 'e,w'
- `draggable`: jQuery draggable setting, e.g. 'x', false
- `rotatable`: jQuery rotatable setting, boolean
- `sortable`: jQuery sortable setting, boolean
- `droppable`: list of components, which can be used as children droppable list of this component
- `multiSelect`: if possible to use multi-select functionality in the component