import { FusionStore } from '../services/fusion-store';
/**
 * Listens to editor mode changes and adds 'edit-mode' className to the root element
 */

export function ModeTrackable(superClass) {
  return class extends superClass {
    handleEditorMode(isEditMode) {
      const method = isEditMode ? 'add' : 'remove';
      this.classList[method](ModeTrackable.EditModeClassName);
      return this.editorModeChanged && this.editorModeChanged(isEditMode);
    }

    handleNoteMode(isNoteMode) {
      const method = isNoteMode ? 'add' : 'remove';
      this.classList[method](ModeTrackable.NoteModeClassName);
    }

    handleMlrMode(isMlrMode) {
      const method = isMlrMode ? 'add' : 'remove';
      this.classList[method](ModeTrackable.MlrModeClassName);
    }

    storeStateHandler(stateApp) {
      this.handleEditorMode(stateApp.isEditMode);
      this.handleNoteMode(stateApp.isNoteMode);
      this.handleMlrMode(stateApp.isMlrMode);
    }

    connectedCallback() {
      super.connectedCallback();
      this.storeStateHandler(FusionStore.store.getState().app);
      this.unsubscribe = FusionStore.subscribe('app', (state) => {
        this.storeStateHandler(state.app);
      });
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.unsubscribe();
    }
  };
}

ModeTrackable.EditModeClassName = 'edit-mode';
ModeTrackable.NoteModeClassName = 'note-mode';
ModeTrackable.MlrModeClassName = 'mlr-mode';
