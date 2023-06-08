/* eslint-disable class-methods-use-this */
/**
 * class OceStorage - service for working with OCE state (window.oce.config.state).
 * window.oceStore exists for access to the currently stored data.
 * OCE state itself (window.oce.config.state) will be updated only after slide leave.
 */
class OceStorage {
  init() {
    window.oceStore = JSON.parse(window.oce.config.state || '{}');
  }

  updateState(key, data) {
    window.oceStore[key] = data;
    this.saveOCEState();
  }

  saveOCEState() {
    return window.CLMPlayer.saveState(JSON.stringify(window.oceStore));
  }

  getOCEStateData() {
    return window.oceStore;
  }

  getOCEStateByKey(key) {
    return window.oceStore[key];
  }

  clearKey(key) {
    delete window.oceStore[key];
    this.saveOCEState();
  }
}

const oceStorage = new OceStorage();

export { oceStorage };
