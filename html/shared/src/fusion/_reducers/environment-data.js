import {
  SET_ENVIRONMENT_DATA,
} from '../_actions/environment-data.js';

const environmentData = (state = {
  binder: null,
  slide: null,
}, action) => {
  switch (action.type) {
    case SET_ENVIRONMENT_DATA:
      return {
        ...state,
        binder: action.data.binder,
        slide: action.data.slide,
      };
    default:
      return state;
  }
};

export default environmentData;
