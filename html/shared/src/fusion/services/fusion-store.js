import initSubscriber from 'redux-subscriber';
import { store } from '../../store.js';

/**
 * Fusion store is service for keep solid Redux store and subscribers.
 * Should be singetone
 */

let subscribeData;

export class FusionStore {
  static get store() {
    return store;
  }

  static get isEditMode() {
    return FusionStore.store.getState().app.isEditMode;
  }

  static get isMlrMode() {
    return FusionStore.store.getState().app.isMlrMode;
  }

  /**
   * Data getters (environmentData, slide, binder)  should be called after firing 'EnvironmentDataReceived' event
   */
  static get environmentData() {
    return FusionStore.store.getState().environmentData;
  }

  static get slide() {
    return this.environmentData.slide;
  }

  static get binder() {
    return this.environmentData.binder;
  }

  static get environment() {
    return store.getState().app.environment;
  }

  static get isVeeva() {
    return store.getState().app.environment === 'Veeva';
  }

  static get isActivator() {
    return store.getState().app.environment === 'Activator';
  }

  static get isScreenShot() {
    return store.getState().app.environment === 'ScreenShotService';
  }

  static get isLocal() {
    return store.getState().app.environment === 'local';
  }

  static get isOce() {
    return store.getState().app.environment === 'Oce';
  }

  static get subscribe() {
    if (!subscribeData) {
      subscribeData = initSubscriber(store);
    }
    return subscribeData;
  }

  static dispatch(action) {
    return store.dispatch(action);
  }

  static get referencesData() {
    return FusionStore.store.getState().referencesData;
  }

  static get references() {
    return this.referencesData.references;
  }
}
