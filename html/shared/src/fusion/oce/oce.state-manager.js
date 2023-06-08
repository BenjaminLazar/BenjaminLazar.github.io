import { FusionStore } from '../services/fusion-store';
import { removeState, pushState } from '../_actions/app.js';
/**
 * class OceStateManager - service for working with Activator states.
 * OCE cashes pages and page states, this service allows to reset cashed slide states
 */
class OceStateManager {
  static setInitialActiveStates() {
    const { registeredStates } = FusionStore.store.getState().app;
    const initialActiveStates = registeredStates.filter((state) => {
      const [name, elId] = state.split('-');
      return (name === 'StateContainer' && document.getElementById(elId).isActiveState());
    });
    initialActiveStates.forEach((state) => {
      FusionStore.store.dispatch(pushState(state));
      document.body.classList.add(state);
    });
  }

  static resetActiveStates() {
    const { currentState } = FusionStore.store.getState().app;
    currentState.forEach((state) => {
      FusionStore.store.dispatch(removeState(state));
      document.body.classList.remove(state);
    });
  }
}

export { OceStateManager };
