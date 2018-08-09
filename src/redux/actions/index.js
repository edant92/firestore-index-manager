import {
  SET_UPDATE_LINKED_ACCOUNTS, SET_ACCESS_TOKEN, SET_ACTIVE_FIRESTORE_DETAILS
} from "../constants/action-types"

export const setAccessToken = accessToken => ({
  type: SET_ACCESS_TOKEN,
  payload: accessToken
});

export const setActiveFirestoreDetails = activeFirestoreDetails => ({
  type: SET_ACTIVE_FIRESTORE_DETAILS,
  payload: activeFirestoreDetails
});

export const setUpdateLinkedAccounts = updateLinkedAccounts => ({
  type: SET_UPDATE_LINKED_ACCOUNTS,
  payload: updateLinkedAccounts
});