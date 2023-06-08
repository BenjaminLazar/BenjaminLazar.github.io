export const SET_REFERENCES_DATA = 'SET_REFERENCES_DATA';

export const setReferences = (data) => (dispatch) => {
  dispatch({
    type: SET_REFERENCES_DATA,
    data,
  });
};
