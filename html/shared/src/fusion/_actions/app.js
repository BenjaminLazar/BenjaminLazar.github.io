export const GET_STATE = 'GET_STATE';
export const PUSH_STATE = 'PUSH_STATE';
export const REMOVE_STATE = 'REMOVE_STATE';
export const TOGGLE_STATE = 'TOGGLE_STATE';
export const FORWARD_STATE = 'FORWARD_STATE';
export const BACKWARD_STATE = 'BACKWARD_STATE';
export const REGISTER_STATE = 'REGISTER_STATE';
export const UNREGISTER_STATE = 'UNREGISTER_STATE';
export const REREGISTER_STATE = 'REREGISTER_STATE';
export const UNREGISTER_INITIAL_ACTIVE_STATE = 'UNREGISTER_INITIAL_ACTIVE_STATE';
export const REGISTER_INITIAL_ACTIVE_STATE = 'REGISTER_INITIAL_ACTIVE_STATE';
export const SET_STATES = 'SET_STATES';
export const FREEZE = 'FREEZE';
export const UNFREEZE = 'UNFREEZE';
export const REGISTER_COMPONENT = 'REGISTER_COMPONENT';
export const ADD_WEB_COMPONENT = 'ADD_WEB_COMPONENT';
export const SET_ACTIVATOR_ENV = 'SET_ACTIVATOR_ENV';
export const SET_VEEVA_ENV = 'SET_VEEVA_ENV';
export const SET_LOCAL_ENV = 'SET_LOCAL_ENV';
export const SET_SCREEN_SHOT_SERVICE_ENV = 'SET_SCREEN_SHOT_SERVICE_ENV';
export const SET_OCE_ENV = 'SET_OCE_ENV';
export const SET_SLIDE_READY = 'SET_SLIDE_READY';
export const NOTE_MODE_STARTED = 'NOTE_MODE_STARTED';
export const NOTE_MODE_FINISHED = 'NOTE_MODE_FINISHED';
export const MLR_MODE_STARTED = 'MLR_MODE_STARTED';
export const MLR_MODE_FINISHED = 'MLR_MODE_FINISHED';
export const SET_ACTIVATOR_METADATA = 'SET_ACTIVATOR_METADATA';
export const REGISTER_ZOOM_CONTAINER = 'REGISTER_ZOOM_CONTAINER';
export const UNREGISTER_ZOOM_CONTAINER = 'UNREGISTER_ZOOM_CONTAINER';

export const getState = () => ({
  type: GET_STATE,
});

export const pushState = (state) => (dispatch) => {
  dispatch({
    type: PUSH_STATE,
    state,
  });
};

export const removeState = (state) => (dispatch) => {
  dispatch({
    type: REMOVE_STATE,
    state,
  });
};

export const toggleState = (state) => (dispatch) => {
  dispatch({
    type: TOGGLE_STATE,
    state,
  });
};

export const forwardState = (state) => (dispatch) => {
  dispatch({
    type: FORWARD_STATE,
    state,
  });
};

export const backwardState = (state) => (dispatch) => {
  dispatch({
    type: BACKWARD_STATE,
    state,
  });
};

export const registerState = (state) => (dispatch) => {
  dispatch({
    type: REGISTER_STATE,
    state,
  });
};

export const unregisterState = (state) => (dispatch) => {
  dispatch({
    type: UNREGISTER_STATE,
    state,
  });
};

export const registerInitialActiveState = (state) => (dispatch) => {
  dispatch({
    type: REGISTER_INITIAL_ACTIVE_STATE,
    state,
  });
};

export const unregisterInitialActiveState = (state) => (dispatch) => {
  dispatch({
    type: UNREGISTER_INITIAL_ACTIVE_STATE,
    state,
  });
};

export const reRegisterState = (state) => (dispatch) => {
  dispatch({
    type: REREGISTER_STATE,
    state,
  });
};

export const registerComponent = (component) => (dispatch) => {
  dispatch({
    type: REGISTER_COMPONENT,
    component,
  });
};

export const addWebComponent = (component) => (dispatch) => {
  dispatch({
    type: ADD_WEB_COMPONENT,
    component,
  });
};

// Replace current list of states
export const setStates = (stateList) => (dispatch) => {
  dispatch({
    type: SET_STATES,
    stateList,
  });
};

export const freeze = (state) => (dispatch) => {
  dispatch({
    type: FREEZE,
    state,
  });
};

export const unfreeze = (state) => (dispatch) => {
  dispatch({
    type: UNFREEZE,
    state,
  });
};

export const noteModeStarted = (state) => (dispatch) => {
  dispatch({
    type: NOTE_MODE_STARTED,
    state,
  });
};

export const noteModeFinished = (state) => (dispatch) => {
  dispatch({
    type: NOTE_MODE_FINISHED,
    state,
  });
};

export const mlrModeStarted = (state) => (dispatch) => {
  dispatch({
    type: MLR_MODE_STARTED,
    state,
  });
};

export const mlrModeFinished = (state) => (dispatch) => {
  dispatch({
    type: MLR_MODE_FINISHED,
    state,
  });
};

export const applyStates = (stateList) => (dispatch) => {
  stateList.forEach((state) => {
    dispatch({
      type: PUSH_STATE,
      state,
    });
  });
};

export const setActivatorEnv = (state) => (dispatch) => {
  dispatch({
    type: SET_ACTIVATOR_ENV,
    state,
  });
};

export const setVeevaEnv = (state) => (dispatch) => {
  dispatch({
    type: SET_VEEVA_ENV,
    state,
  });
};

export const setLocalEnv = (state) => (dispatch) => {
  dispatch({
    type: SET_LOCAL_ENV,
    state,
  });
};

export const setScreenShotServiceEnv = (state) => (dispatch) => {
  dispatch({
    type: SET_SCREEN_SHOT_SERVICE_ENV,
    state,
  });
};

export const setOceEnv = (state) => (dispatch) => {
  dispatch({
    type: SET_OCE_ENV,
    state,
  });
};

export const setSlideReady = (state) => (dispatch) => {
  dispatch({
    type: SET_SLIDE_READY,
    state,
  });
};

export const setActivatorMetadata = (metadata) => (dispatch) => {
  dispatch({
    type: SET_ACTIVATOR_METADATA,
    metadata,
  });
};

export const registerZoomContainer = (zoomContainer) => (dispatch) => {
  dispatch({
    type: REGISTER_ZOOM_CONTAINER,
    zoomContainer,
  });
};

export const unregisterZoomContainer = (zoomContainer) => (dispatch) => {
  dispatch({
    type: UNREGISTER_ZOOM_CONTAINER,
    zoomContainer,
  });
};
