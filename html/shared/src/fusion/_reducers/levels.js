import {
  ADD_LEVEL, REMOVE_LEVEL,
  GET_LEVEL, SET_LEVEL,
} from '../_actions/levels.js';

const checkLevels = (levels) => (levels.length === 0 ? [0] : levels);

const levels = (state = { levels: [0], topLevel: 0 }, action) => {
  switch (action.type) {
    case ADD_LEVEL: {
      const newLevel = state.levels[state.levels.length - 1] + 1;
      return {
        levels: [...state.levels, newLevel],
        topLevel: newLevel,
      };
    }
    case REMOVE_LEVEL: {
      const index = state.levels.indexOf(action.topLevel);
      const newArr = state.levels.slice();
      newArr.splice(index, 1);
      return {
        levels: checkLevels(newArr),
        topLevel: newArr[newArr.length - 1],
      };
    }
    case GET_LEVEL: {
      const arr = checkLevels([...state.levels]);
      return {
        levels: arr,
        topLevel: arr[arr.length - 1],
      };
    }
    case SET_LEVEL: {
      let updatedLevels = [...state.levels, action.levels];
      updatedLevels = updatedLevels.sort();
      return {
        levels: updatedLevels,
        topLevel: updatedLevels[updatedLevels.length - 1],
      };
    }
    default:
      return state;
  }
};

export default levels;
