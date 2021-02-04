import { GET_ERROR, CLEAR_ERROR } from "../actions/types";

const initialState = {
  message: null,
  status: null,
};

export const Error = (state = initialState, action) => {
  switch (action.type) {
    case GET_ERROR:
      return {
        message: action.payload.msg,
        status: action.payload.status,
      };
    case CLEAR_ERROR:
      return {
        message: null,
        status: null,
      };
    default:
      return state;
  }
};
