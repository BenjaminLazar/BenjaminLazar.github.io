import { FusionLogger } from '../services/fusion-logger';

import {
  ADD_WEB_COMPONENT,
  BACKWARD_STATE,
  FORWARD_STATE,
  FREEZE,
  NOTE_MODE_FINISHED,
  NOTE_MODE_STARTED,
  MLR_MODE_STARTED,
  MLR_MODE_FINISHED,
  PUSH_STATE,
  REGISTER_COMPONENT,
  REGISTER_STATE,
  REMOVE_STATE,
  REREGISTER_STATE,
  SET_ACTIVATOR_ENV,
  SET_LOCAL_ENV,
  SET_OCE_ENV,
  SET_SCREEN_SHOT_SERVICE_ENV,
  SET_SLIDE_READY,
  SET_STATES,
  SET_VEEVA_ENV,
  TOGGLE_STATE,
  UNFREEZE,
  UNREGISTER_STATE,
  REGISTER_INITIAL_ACTIVE_STATE,
  UNREGISTER_INITIAL_ACTIVE_STATE,
  SET_ACTIVATOR_METADATA,
  REGISTER_ZOOM_CONTAINER,
  UNREGISTER_ZOOM_CONTAINER,
} from '../_actions/app.js';

import { REGISTER_SLIDES } from '../_actions/slides.js';

const isSlideState = (state, action) => state.registeredSlides && state.registeredSlides.includes(action.state);

const setCurrentSlide = (state, action) => {
  if (isSlideState(state, action)) {
    return action.state;
  }
  return state.currentSlide;
};

const setPreviousSlide = (state, action) => {
  if (isSlideState(state, action)) {
    return state.currentSlide;
  }
  return state.previousSlide;
};

const removeState = (state, action) => {
  const index = state.currentState.indexOf(action.state);
  if (!state.isEditMode && index > -1) {
    const updatedCurrentState = state.currentState.slice();
    updatedCurrentState.splice(index, 1);
    return updatedCurrentState;
  }
  return state.currentState.slice();
};

const updateSlide = (state, action) => {
  if (state.currentState && state.currentState !== action.state) {
    return removeState(state, { state: state.currentState.find((state2) => state.registeredSlides.includes(state2)) });
  }
  return true;
};

const setStates = (state, action) => {
  if (!state.isEditMode) {
    return action.stateList;
  }
  FusionLogger.log(`Ignoring pushing state ${action.stateList}`, '_reducers');
  return state.currentState.slice();
};

const isModeAllowed = (state) => !state.isEditMode;

const isStateRegistered = (state, action) => state.registeredStates.includes(action.state);

const isStateApplied = (state, action) => state.currentState.includes(action.state);

const isStateInitialActive = (state, action) => state.initialActiveStates.includes(action.state);

const shouldPushState = (state, action) => {
  const isValidState = isStateRegistered(state, action) && !isStateApplied(state, action);
  return isValidState && (isModeAllowed(state) || isStateInitialActive(state, action));
};

const pushState = (state, action) => {
  if (shouldPushState(state, action)) {
    const currentState = isSlideState(state, action) ? updateSlide(state, action) : state.currentState.slice();
    return [
      ...currentState,
      action.state,
    ];
  }
  FusionLogger.log(`Ignoring pushing state ${action.state}`, '_reducers');
  return state.currentState.slice();
};

const toggleState = (state, action) => {
  const index = state.currentState.indexOf(action.state);
  if (isStateRegistered(state, action) && index > -1) {
    return removeState(state, action);
  }
  return pushState(state, action);
};

// Step to next state. Only if current state is 0 or 1
const forwardState = (state) => {
  // if (state.currentState.length < 2) {
  if (state.currentState[0]) {
    const currentIndex = state.registeredStates.indexOf(state.currentState[state.currentState.length - 1]);
    if (currentIndex > -1 && currentIndex < (state.registeredStates.length - 1)) {
      const updatedCurrentState = { state: state.registeredStates[currentIndex + 1] };
      return pushState(state, updatedCurrentState);
    }
    // Loop
    if (currentIndex === (state.registeredStates.length - 1)) {
      return [];
    }

    return state.currentState.slice();
  }
  // Go to first registered state

  const updatedCurrentState = { state: state.registeredStates[0] };
  return pushState(state, updatedCurrentState);

  // }
  // else {
  //   return state.currentState.slice();
  // }
};

const backwardState = (state) => {
  if (state.currentState.length < 2) {
    if (state.currentState[0]) {
      const currentIndex = state.registeredStates.indexOf(state.currentState[0]);
      if (currentIndex > 0 && currentIndex < state.registeredStates.length) {
        const updatedCurrentState = [state.registeredStates[currentIndex - 1]];
        return updatedCurrentState;
      }
      // Loop
      if (currentIndex === 0) {
        const updatedCurrentState = [state.registeredStates[state.registeredStates.length - 1]];
        return updatedCurrentState;
      }

      return state.currentState.slice();
    }

    return state.currentState.slice();
  }

  return state.currentState.slice();
};

// state is registerStates
const registerState = (state, action) => (!state.includes(action.state) ? [...state, action.state] : state);

const reRegisterState = (state, action) => {
  const index = state.indexOf(action.state.stateNameOld);
  if (index !== -1 && action.state) {
    const updatedCurrentState = state.slice();
    updatedCurrentState[index] = action.state.stateName;
    return updatedCurrentState;
  }
  return state;
};
// state is registerStates
const unregisterState = (state, action) => {
  const index = state.indexOf(action.state);
  if (index !== -1) {
    const newArr = state.slice();
    newArr.splice(index, 1);
    return newArr;
  }
  return state;
};

// components is registerComponents
const registerComponent = (state, action) => {
  if (!state.includes(action.component)) {
    state.push(action.component);
  }
  return state;
};

const addWebComponent = (state, action) => {
  if (!state.includes(action.component)) {
    state.push(action.component);
  }
  return state;
};

const setIsEditMode = (isEditMode) => isEditMode;

const setIsNoteMode = (isNoteMode) => isNoteMode;

const setIsMLRMode = (isMlrMode) => isMlrMode;

const registerZoomContainer = (state, action) => (!state.includes(action.zoomContainer) ? [...state, action.zoomContainer] : state);

const unRegisterZoomContainer = (state, action) => {
  let result = state;
  if (state.includes(action.zoomContainer)) {
    result = state.filter((item) => item !== action.zoomContainer);
  }
  return result;
};

const app = (state = {
  registeredStates: [],
  registeredZoomContainers: [],
  initialActiveStates: [],
  registeredComponents: [],
  webComponents: [],
  currentState: [],
  isEditMode: false,
  isNoteMode: false,
  isMlrMode: false,
  environment: '',
  readyForScreenShot: false,
}, action) => {
  switch (action.type) {
    case PUSH_STATE:
      return {
        ...state,
        currentState: pushState(state, action),
        currentSlide: setCurrentSlide(state, action),
        previousSlide: setPreviousSlide(state, action),
      };
    case REMOVE_STATE:
      return {
        ...state,
        currentState: removeState(state, action),
      };
    case TOGGLE_STATE:
      return {
        ...state,
        currentState: toggleState(state, action),
        currentSlide: setCurrentSlide(state, action),
        previousSlide: setPreviousSlide(state, action),
      };
    case FORWARD_STATE:
      return {
        ...state,
        currentState: forwardState(state),
      };
    case BACKWARD_STATE:
      return {
        ...state,
        currentState: backwardState(state),
      };
    case REGISTER_STATE:
      return {
        ...state,
        registeredStates: registerState(state.registeredStates, action),
      };
    case REGISTER_INITIAL_ACTIVE_STATE:
      return {
        ...state,
        initialActiveStates: registerState(state.initialActiveStates, action),
      };
    case UNREGISTER_STATE:
      return {
        ...state,
        registeredStates: unregisterState(state.registeredStates, action),
      };
    case UNREGISTER_INITIAL_ACTIVE_STATE:
      return {
        ...state,
        initialActiveStates: unregisterState(state.initialActiveStates, action),
      };
    case REREGISTER_STATE:
      return {
        ...state,
        registeredStates: reRegisterState(state.registeredStates, action),
      };
    case SET_STATES:
      return {
        ...state,
        currentState: setStates(state, action),
      };
    case FREEZE:
      return {
        ...state,
        isEditMode: setIsEditMode(true),
      };
    case UNFREEZE:
      return {
        ...state,
        isEditMode: setIsEditMode(false),
      };
    case REGISTER_COMPONENT:
      return {
        ...state,
        registeredComponents: registerComponent(state.registeredComponents, action),
      };

    case ADD_WEB_COMPONENT:
      return {
        ...state,
        webComponents: addWebComponent(state.webComponents, action),
      };
    case SET_ACTIVATOR_ENV:
      return {
        ...state,
        environment: 'Activator',
      };
    case REGISTER_SLIDES:
      return {
        ...state,
        registeredSlides: action.slides,
        currentSlide: action.firstSlide,
        currentState: [action.firstSlide],
      };
    case SET_VEEVA_ENV:
      return {
        ...state,
        environment: 'Veeva',
      };
    case SET_LOCAL_ENV:
      return {
        ...state,
        environment: 'local',
      };
    case SET_SCREEN_SHOT_SERVICE_ENV:
      return {
        ...state,
        environment: 'ScreenShotService',
      };
    case SET_OCE_ENV:
      return {
        ...state,
        environment: 'Oce',
      };
    case SET_SLIDE_READY:
      return {
        ...state,
        readyForScreenShot: true,
      };
    case NOTE_MODE_STARTED:
      return {
        ...state,
        isNoteMode: setIsNoteMode(true),
      };
    case NOTE_MODE_FINISHED:
      return {
        ...state,
        isNoteMode: setIsNoteMode(false),
      };
    case MLR_MODE_STARTED:
      return {
        ...state,
        isMlrMode: setIsMLRMode(true),
      };
    case MLR_MODE_FINISHED:
      return {
        ...state,
        isMlrMode: setIsMLRMode(false),
      };
    case SET_ACTIVATOR_METADATA:
      return {
        ...state,
        activatorMetadata: action.metadata,
      };
    case REGISTER_ZOOM_CONTAINER:
      return {
        ...state,
        registeredZoomContainers: registerZoomContainer(state.registeredZoomContainers, action),
      };
    case UNREGISTER_ZOOM_CONTAINER:
      return {
        ...state,
        registeredZoomContainers: unRegisterZoomContainer(state.registeredZoomContainers, action),
      };
    default:
      return state;
  }
};

export default app;
