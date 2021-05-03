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
      return {
        ...state,
        addresses: [action.payload, ...state.addresses],
        loading: false,
        error: null,
      };
    case GET_ADDRESSES:
      return {
        ...state,
        addresses: action.payload,
        loading: false,
        error: null,
      };
    case UPDATE_ADDRESS:
      return {
        ...state,
        addresses: [
          ...state.addresses.map((address) =>
            address._id === action.payload._id ? action.payload : address
          ),
        ],
        loading: false,
        error: null,
      };
    case DELETE_ADDRESS:
      return {
        ...state,
        addresses: state.addresses.filter(
          (address) => address._id !== action.payload
        ),
        loading: false,
        error: null,
      };
    case ADDRESS_ERROR:
      return {
        ...state,
        loading: false,
        error: { msg: action.payload.msg, status: action.payload.status },
      };
    case LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
};
