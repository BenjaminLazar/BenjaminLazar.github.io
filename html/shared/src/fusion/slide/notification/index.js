import { css, html } from 'lit-element';
import '@vaadin/vaadin-notification/vaadin-notification.js';
import { FusionBase } from '../../base';
import { getValueObject } from '../../utils';
import { applyMixins, SlideComponentBase, Stateful } from '../../mixins';

class FusionNotification extends applyMixins(FusionBase, [SlideComponentBase, Stateful]) {
  // Public property API that triggers re-render (synced with attributes)
  static get properties() {
    return {
      'state-id': {
        type: String,
        fieldType: 'String',
        propertyGroup: 'notification',
      },
      opened: {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'notification',
        value: false,
      },
      position: {
        type: String,
        fieldType: 'String',
        propertyGroup: 'notification',
        value: 'bottom-start',
      },
      duration: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'notification',
        value: '4000',
      },
      level: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'notification',
        value: '0',
        unit: '',
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-notification',
      componentUIName: 'Notification',
      componentType: 'system',
      componentDescription: 'Temporary notification sliding in from edge of content',
      isRootNested: false,
      nestedComponents: [],
      baseLevel: 1000,
    };
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    const templ = document.createElement('template');
    templ.innerHTML = `${this.innerHTML}`;
    this.notification = this.shadowRoot.querySelector('vaadin-notification');
    this.notification.appendChild(templ);
    this.notification.addEventListener('opened-changed', this.changeNotification.bind(this));
    this.notification.setAttribute('duration', this.duration);
    this.notification.setAttribute('position', this.position);
  }

  changeNotification(e) {
    const wasClosed = !e.detail.value;
    if (wasClosed) {
      this.inactivate();
    }
  }

  enter() {
    this.notification.open();
    this.addLevel();
  }

  exit() {
    const transitionDuration = getValueObject(this.duration).num;
    this.notification.close();
    this.removeLevel(transitionDuration);
  }

  static get styles() {
    return [
      super.styles,
      css`
       :host([hidden]),
        :host(:not([opened]):not([closing])) {
          display: none !important;
        }
        [part="notification"] {
          z-index: var(--level);
        }
      `,
    ];
  }

  render() {
    super.render();
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      <vaadin-notification part="notification"></vaadin-notification>
      <slot></slot>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionNotification };
