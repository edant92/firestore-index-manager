import {
  SET_ACCESS_TOKEN,
} from "../constants/action-types"

export const setAccessToken = accessToken => ({
  type: SET_ACCESS_TOKEN,
  payload: accessToken
});