import { SET_REFERENCES_DATA } from '../_actions/references-data';

const referencesData = (state = {
  references: null,
}, action) => {
  switch (action.type) {
    case SET_REFERENCES_DATA:
      return {
        ...state,
        references: action.data.references,
      };
    default:
      return state;
  }
};

export default referencesData;
