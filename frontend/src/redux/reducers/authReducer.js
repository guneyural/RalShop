import {
  GET_USER,
  USER_LOGIN,
  REGISTER_USER,
  LOGOUT_USER,
  LOADING,
  AUTH_ERROR,
  GET_USER_BY_USERNAME,
  SEND_FORGOT_PASSWORD_EMAIL,
  SEND_FORGOT_PASSWORD_EMAIL_ERROR,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("user-token"),
  isAuthenticated: false,
  user: null,
  loading: false,
  error: {
    msg: null,
    status: null,
  },
  profile: null,
  forgotPassword: {
    isPasswordReset:
      localStorage.getItem("password_reset") === null
        ? false
        : localStorage.getItem("password_reset") === "true" && true,
    confirmationCode: null,
    success:
      localStorage.getItem("password_reset") === null
        ? null
        : localStorage.getItem("password_reset") === "true" && true,
    emailOrUsername: null,
  },
};

export const Auth = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
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
        forgotPassword: {
          isPasswordReset: false,
          confirmationCode: null,
          success: null,
        },
      };
    case LOGOUT_USER:
      localStorage.removeItem("user-token");
      return {
        ...state,
        token: null,
        user: {},
        loading: false,
        isAuthenticated: false,
        error: {
          msg: null,
          status: null,
        },
      };
    case SEND_FORGOT_PASSWORD_EMAIL:
      return {
        ...state,
        loading: false,
        forgotPassword: {
          ...state.forgotPassword,
          isPasswordReset: true,
          success: true,
        },
      };
    case SEND_FORGOT_PASSWORD_EMAIL_ERROR:
      localStorage.removeItem("emailOrUsername");
      localStorage.removeItem("password_reset");
      return {
        ...state,
        loading: false,
        forgotPassword: {
          isPasswordReset: false,
          confirmationCode: null,
          success: false,
          emailOrUsername: null,
        },
      };
    case AUTH_ERROR:
      return {
        ...state,
        loading: false,
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
