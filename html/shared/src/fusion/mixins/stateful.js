import { css, unsafeCSS } from 'lit-element';
import { FusionStore } from '../services/fusion-store';
import { toggleState as toggleStateAction } from '../_actions/app';
import { FusionBase } from '../base';
import { ModeTrackable } from './mode-trackable';
import { iterateNonStatefulChildren } from '../services/dom-utils';
import { VeevaMonitoring } from '../services/monitoring';

const shouldAdjustState = (state, enforcedState) => {
  const { currentState } = FusionStore.store.getState().app;
  return currentState.includes(state) !== enforcedState;
};

const shouldToggle = (state, enforcedState) => enforcedState === null || shouldAdjustState(state, enforcedState);

export function Stateful(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        ...super.properties,
        'track-visit': {
          type: String,
          fieldType: 'Select',
          propertyArea: 'settings',
          propertyGroup: 'veevaMonitoring',
          value: 'on',
          selectOptions: [
            'on',
            'off',
          ],
        },
        'track-duration': {
          type: String,
          fieldType: 'Select',
          propertyArea: 'settings',
          propertyGroup: 'veevaMonitoring',
          value: 'on',
          selectOptions: [
            'on',
            'off',
          ],
        },
      };
    }

    trackStateEnter() {
      if (this['track-visit'] === 'on') {
        if (this['track-duration'] === 'on') {
          VeevaMonitoring.trackSlideEnter({ id: this.id });
        } else {
          VeevaMonitoring.trackCustomData({ id: this.id });
        }
      }
    }

    trackStateExit() {
      if (this['track-visit'] === 'on' && this['track-duration'] === 'on') {
        VeevaMonitoring.trackSlideExit({ id: this.id });
      }
    }

    stateChanged(state) {
      const stateName = this.getStateName();
      if (state.app.currentState.includes(stateName)) {
        if (!this.active) {
          this.enterCallback();
        }
      } else if (this.active) {
        this.exitCallback();
      }
    }

    get isStateful() {
      return this.getStateName && this.activate;
    }

    getStateName() {
      return `${this.state}-${this.id}`;
    }

    constructor() {
      super();
      if (!this.state) this.state = 'UI';
      this.active = false;
    }

    handleInitialActiveStates() {
      if (this.isActiveState && this.isActiveState()) {
        this.registerInitialActiveState(this.state);
      }
    }

    connectedCallback() {
      super.connectedCallback();
      this.stateId = this.getAttribute('id');
      if (this.stateId) {
        this.registerState(this.state);
        this.handleInitialActiveStates();
      }
    }

    disconnectedCallback() {
      this.inactivate();
      this.unregisterState(this.state);
      this.unregisterInitialActiveState(this.state);
    }

    // ignore eslint to support older versions, prior to 1.10.2
    // eslint-disable-next-line class-methods-use-this
    iterateNonStatefulChildren(parent, cb) {
      iterateNonStatefulChildren(parent, cb, FusionBase);
    }

    childCbTrigger(isEnter = false) {
      this.iterateNonStatefulChildren(this,
        (component) => component.parentStateChanged({ name: this.getStateName(), active: isEnter }));
    }

    enterCallback() {
      this.active = true;
      if (this.enter) this.enter();
      this.emitCustomEvent('enter');
      this.trackStateEnter();
      this.childCbTrigger(true);
    }

    exitCallback() {
      this.active = false;
      if (this.exit) this.exit();
      this.emitCustomEvent('exit');
      this.trackStateExit();
      this.childCbTrigger();
    }

    /**
     * Function for change state in app
     * @todo toggleState duplicated in API. Should unify it in future
     * @param state
     * @param id
     * @param includeId
     * @param enforcedState
     */
    toggleState(state, id = this.id, includeId = true, enforcedState = null) {
      const stateName = includeId ? `${state}-${id}` : state;
      if (shouldToggle(stateName, enforcedState)) {
        FusionStore.store.dispatch(toggleStateAction(stateName));
        document.body.classList.toggle(stateName);
      }
    }

    set active(value) {
      if (value) {
        this.setAttribute('active', value);
      } else {
        this.removeAttribute('active');
      }
      return value;
    }

    get active() {
      return this.getAttribute('active');
    }

    activate() {
      this.pushState(this.state);
    }

    inactivate() {
      this.removeState(this.state);
    }

    static get styles() {
      return [
        super.styles,
        css`
          :host(:not(.${unsafeCSS(ModeTrackable.EditModeClassName)}):not([active])) {
            pointer-events: none;
          }
      `,
      ];
    }
  };
}
