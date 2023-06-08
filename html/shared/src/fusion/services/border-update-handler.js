import { html } from 'lit-element';

/**
 * Fusion service for handling border changes and applying correct styles
 */

class BorderUpdateHandler {
  static get borderMap() {
    return {
      border: [
        'border-width',
        'border-style',
        'border-color',
      ],
      'border-top': [
        'border-top-width',
        'border-top-style',
        'border-top-color',
      ],
      'border-left': [
        'border-left-width',
        'border-left-style',
        'border-left-color',
      ],
      'border-bottom': [
        'border-bottom-width',
        'border-bottom-style',
        'border-bottom-color',
      ],
      'border-right': [
        'border-right-width',
        'border-right-style',
        'border-right-color',
      ],
    };
  }

  static isBorderUpdateRequired(changedProps, key) {
    const [width, style, color] = this.borderMap[key];
    return [width, style, color].some((value) => changedProps.has(value));
  }

  static shouldPropertyChange(name, changedProps) {
    const propName = [...changedProps.keys()].join().split('-');
    return propName.includes(name);
  }

  static mainBorderStylesApplier(changedProps, component) {
    if (this.isBorderUpdateRequired(changedProps, 'border')) {
      Object.keys(this.borderMap)
        .forEach((key) => {
          const [width, style, color] = this.borderMap[key];
          if (this.shouldPropertyChange('width', changedProps)) component[width] = component['border-width'];
          if (this.shouldPropertyChange('style', changedProps)) component[style] = component['border-style'];
          if (this.shouldPropertyChange('color', changedProps)) component[color] = component['border-color'];
        });
    }
  }

  static getBorderStyles(component) {
    let borderStyles = '';
    if (parseInt(component['border-width'], 10)) {
      borderStyles += 'border: var(--border-width) var(--border-style) var(--border-color);';
    }
    if (parseInt(component['border-top-width'], 10)) {
      borderStyles += 'border-top: var(--border-top-width) var(--border-top-style) var(--border-top-color);';
    }
    if (parseInt(component['border-left-width'], 10)) {
      borderStyles += 'border-left: var(--border-left-width) var(--border-left-style) var(--border-left-color);';
    }
    if (parseInt(component['border-bottom-width'], 10)) {
      borderStyles += 'border-bottom: var(--border-bottom-width) var(--border-bottom-style) var(--border-bottom-color);';
    }
    if (parseInt(component['border-right-width'], 10)) {
      borderStyles += 'border-right: var(--border-right-width) var(--border-right-style) var(--border-right-color);';
    }
    return html`${borderStyles}`;
  }
}

export { BorderUpdateHandler };
