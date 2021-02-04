import {
  GET_USER,
  USER_LOGIN,
  REGISTER_USER,
  LOGOUT_USER,
  LOADING,
  AUTH_ERROR,
  GET_USER_BY_USERNAME,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  user: null,
  loading: false,
  error: {
    msg: null,
    status: null,
  },
  profile: null,
};

export const Auth = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: {
          msg: null,
          status: null,
        },
      };
    case GET_USER_BY_USERNAME:
      return {
        ...state,
        loading: false,
        error: {
          msg: null,
          status: null,
        },
        profile: action.payload,
      };
    case USER_LOGIN:
    case REGISTER_USER:
      localStorage.setItem("user-token", action.payload);
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
        loading: false,
        error: {
          msg: null,
          status: null,
        },
      };
    case LOGOUT_USER:
      localStorage.removeItem("user-token");
      return {
        token: null,
        user: {},
        loading: false,
        error: {
          msg: null,
          status: null,
        },
      };
    case AUTH_ERROR:
      return {
        ...state,
        error: {
          msg: action.payload.msg,
          status: action.payload.status,
        },
      };
    case LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
};
