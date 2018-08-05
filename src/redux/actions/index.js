import {
  SET_ACCESS_TOKEN, SET_ACTIVE_FIRESTORE_DETAILS,
} from "../constants/action-types"

export const setAccessToken = accessToken => ({
  type: SET_ACCESS_TOKEN,
  payload: accessToken
});

export const setActiveFirestoreDetails = activeFirestoreDetails => ({
  type: SET_ACTIVE_FIRESTORE_DETAILS,
  payload: activeFirestoreDetails
});