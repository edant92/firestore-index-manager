import {
  SET_ACCESS_TOKEN,
} from "../constants/action-types"

export const setAccessToken = accessToken => ({
  type: SET_ACCESS_TOKEN,
  payload: accessToken
});

export const setActiveFirestoreDetails = activeFirestoreDetails => ({
  type: SET_ACCESS_TOKEN,
  payload: activeFirestoreDetails
});