export const SET_ENVIRONMENT_DATA = 'SET_ENVIRONMENT_DATA';

export const setEnvironmentData = (data) => (dispatch) => {
  dispatch({
    type: SET_ENVIRONMENT_DATA,
    data,
  });
};
