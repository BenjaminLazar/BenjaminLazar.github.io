import { FusionStore } from './fusion-store.js';
import { setReferences } from '../_actions/references-data';
import references from '../../data/references.json';

class ReferencesDataReceiver {
  static setReferencesData() {
    FusionStore.store.dispatch(setReferences({ references }));
  }
}

export { ReferencesDataReceiver };
