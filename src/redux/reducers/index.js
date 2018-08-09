import {
  DELETE_LINKED_ACCOUNT, EDIT_LINKED_ACCOUNT, SET_UPDATE_LINKED_ACCOUNTS,
  SET_ACCESS_TOKEN,
  SET_ACTIVE_FIRESTORE_DETAILS
} from "../constants/action-types";

const initialState = {
  accessToken: '',
  activeFirestoreDetails: {},
  updateLinkedAccounts: false
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCESS_TOKEN:
      return {...state, accessToken: action.payload};
    case SET_ACTIVE_FIRESTORE_DETAILS:
      return {...state, activeFirestoreDetails: action.payload};
    case SET_UPDATE_LINKED_ACCOUNTS:
      return {...state, updateLinkedAccounts: action.payload};
    default:
      return state;
  }
};

export default rootReducer;