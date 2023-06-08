export const GET_LEVEL = 'GET_LEVEL';
export const ADD_LEVEL = 'ADD_LEVEL';
export const REMOVE_LEVEL = 'REMOVE_LEVEL';
export const SET_LEVEL = 'SET_LEVEL';

export const getLevel = () => (dispatch, getState) => {
  const state = getState();
  return {
    type: GET_LEVEL,
    levels: state.levels.levels || [0],
    topLevel: state.levels.topLevel || 0,
  };
};

export const addLevel = () => ({
  type: ADD_LEVEL,
});

export const removeLevel = (topLevel) => ({
  type: REMOVE_LEVEL,
  topLevel,
});

export const setLevel = (topLevel) => (dispatch) => {
  dispatch({
    type: SET_LEVEL,
    topLevel,
  });
};
