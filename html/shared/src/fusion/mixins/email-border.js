import { BorderUpdateHandler } from '../services/border-update-handler';

export function EmailBorder(superClass) {
  return class extends superClass {
    static get properties() {
      const borderStyle = [
        {
          value: 'solid',
          icon: 'divider',
        },
        {
          value: 'dashed',
          icon: 'dashed',
        },
        {
          value: 'dotted',
          icon: 'dotted',
        },
      ];
      return {
        ...super.properties,
        'border-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          availableUnits: [{ unitType: 'px' }],
        },
        'border-style': {
          type: String,
          fieldType: 'Select',
          propertyGroup: 'border',
          value: 'solid',
          selectOptions: borderStyle,
        },
        'border-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'border',
          value: 'rgba(255, 255, 255, 0)',
        },
        'border-left-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          reflect: true,
          availableUnits: [{ unitType: 'px' }],
        },
        'border-left-style': {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'border',
          value: 'solid',
          selectOptions: borderStyle,
          reflect: true,
        },
        'border-left-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'border',
          value: 'rgba(255, 255, 255, 0)',
          reflect: true,
        },
        'border-top-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          reflect: true,
          availableUnits: [{ unitType: 'px' }],
        },
        'border-top-style': {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'border',
          value: 'solid',
          selectOptions: borderStyle,
          reflect: true,
        },
        'border-top-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'border',
          value: 'rgba(255, 255, 255, 0)',
          reflect: true,
        },
        'border-right-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          reflect: true,
          availableUnits: [{ unitType: 'px' }],
        },
        'border-right-style': {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'border',
          value: 'solid',
          selectOptions: borderStyle,
          reflect: true,
        },
        'border-right-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'border',
          value: 'rgba(255, 255, 255, 0)',
          reflect: true,
        },
        'border-bottom-width': {
          type: String,
          fieldType: 'Number',
          propertyGroup: 'border',
          value: '0px',
          reflect: true,
          availableUnits: [{ unitType: 'px' }],
        },
        'border-bottom-style': {
          type: String,
          fieldType: 'RadioGroupPanel',
          propertyGroup: 'border',
          value: 'solid',
          selectOptions: borderStyle,
          reflect: true,
        },
        'border-bottom-color': {
          type: String,
          fieldType: 'ColorPicker',
          propertyGroup: 'border',
          value: 'rgba(255, 255, 255, 0)',
          reflect: true,
        },
      };
    }

    updateBorderAttr(key) {
      const [width, style, color] = BorderUpdateHandler.borderMap[key];
      if (parseInt(this[width], 10)) {
        this.setAttribute(key, `${this[width]} ${this[style]} ${this[color]}`);
      } else {
        this.removeAttribute(key);
      }
    }

    iterateBorderAttr(changedProps) {
      Object.keys(BorderUpdateHandler.borderMap).forEach((key) => {
        if (BorderUpdateHandler.isBorderUpdateRequired(changedProps, key)) {
          this.updateBorderAttr(key);
        }
      });
    }

    updated(changedProps) {
      super.updated(changedProps);
      this.iterateBorderAttr(changedProps);
    }
  };
}
