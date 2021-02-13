import {
  SELLER_REGISTER,
  SELLER_LOGIN,
  SELLER_LOADING,
  SELLER_LOGOUT,
  SELLER_ERROR,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("shop-token"),
  shop: null,
  loading: false,
  isAuthenticated: false,
  error: {
    message: null,
    status: null,
  },
};

export const Seller = (state = initialState, action) => {
  switch (action.type) {
    case SELLER_REGISTER:
    case SELLER_LOGIN:
      localStorage.setItem("shop-token", action.payload);
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        token: action.payload,
        error: { message: null, status: null },
      };
    case SELLER_LOADING:
      return { ...state, loading: true };
    case SELLER_LOGOUT:
      localStorage.removeItem("shop-token");
      return {
        token: null,
        shop: null,
        loading: false,
        isAuthenticated: false,
        error: { message: null, status: null },
      };
    case SELLER_ERROR:
      return {
        ...state,
        loading: false,
        error: { message: action.payload.msg, status: action.payload.status },
      };
    default:
      return state;
  }
};
