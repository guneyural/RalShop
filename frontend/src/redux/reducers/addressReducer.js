import {
  CREATE_ADDRESS,
  GET_ADDRESSES,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  ADDRESS_ERROR,
  LOADING,
} from "../actions/types";

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

export const Address = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ADDRESS:
      return { ...state, loading: false, error: null };
    case GET_ADDRESSES:
      return { ...state, loading: false, error: null };
    case UPDATE_ADDRESS:
      return { ...state, loading: false, error: null };
    case DELETE_ADDRESS:
      return { ...state, loading: false, error: null };
    case ADDRESS_ERROR:
      return { ...state, loading: false };
    case LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
};
