import { CLEAR_ERROR, GET_ERROR } from "./types";
export function getErrors(msg, status) {
  return {
    type: GET_ERROR,
    payload: { msg, status },
  };
}
export function clearErrors() {
  return {
    type: CLEAR_ERROR,
  };
}
