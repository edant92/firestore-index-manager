import {SET_ACCESS_TOKEN} from "../constants/action-types";

const initialState = {
  accessToken: '',
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCESS_TOKEN:
      return {...state, accessToken: action.payload};
    default:
      return state;
  }
};

export default rootReducer;