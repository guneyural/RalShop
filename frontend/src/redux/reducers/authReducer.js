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
  CANCEL_FORGOT_PASSWORD,
  CONFIRMATION_CODE_ERROR,
  CONFIRMATION_CODE_SUCCESS,
  CHANGE_PASSWORD_ERROR,
  CHANGE_PASSWORD,
  UPDATE_USER_DATA,
  USER_ADD_PROFILE_PHOTO,
  REMOVE_PROFILE_PHOTO,
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
  userDataUpdated: false,
  profile: null,
  forgotPassword: {
    isPasswordReset:
      localStorage.getItem("password_reset") === null
        ? false
        : localStorage.getItem("password_reset") === "true" && true,
    confirmationCode:
      localStorage.getItem("confirmation_code") !== null
        ? localStorage.getItem("confirmation_code")
        : null,
    sendEmailSuccess: null,
    confirmationCodeSuccess:
      localStorage.getItem("confirmation_code") !== null ? true : null,
    emailOrUsername:
      localStorage.getItem("emailOrUsername") === null
        ? null
        : localStorage.getItem("emailOrUsername"),
    confirmationCodeTries: 3,
    changePasswordSuccess: null,
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
    case UPDATE_USER_DATA:
      return {
        ...state,
        userDataUpdated: true,
        loading: false,
        user: action.payload,
      };
    case USER_ADD_PROFILE_PHOTO:
      return {
        ...state,
        loading: false,
        userDataUpdated: true,
        user: action.payload,
      };
    case REMOVE_PROFILE_PHOTO:
      return {
        ...state,
        loading: false,
        userDataUpdated: true,
        user: action.payload,
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
      localStorage.removeItem("shop-token");
      localStorage.removeItem("confirmation_code");
      localStorage.removeItem("password_reset");
      localStorage.removeItem("emailOrUsername");
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
          sendEmailSuccess: null,
          emailOrUsername: null,
          confirmationCodeSuccess: null,
          confirmationCodeTries: 3,
          changePasswordSuccess: null,
        },
      };
    case LOGOUT_USER:
      localStorage.setItem("Wishlist", JSON.stringify([]));
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
          sendEmailSuccess: true,
        },
      };
    case CONFIRMATION_CODE_SUCCESS:
      localStorage.setItem(
        "confirmation_code",
        action.payload.confirmationCode
      );
      return {
        ...state,
        loading: false,
        forgotPassword: {
          ...state.forgotPassword,
          confirmationCodeSuccess: true,
          confirmationCode: action.payload.confirmationCode,
        },
      };
    case SEND_FORGOT_PASSWORD_EMAIL_ERROR:
      return {
        ...state,
        loading: false,
        forgotPassword: {
          isPasswordReset: false,
          confirmationCode: null,
          sendEmailSuccess: false,
          confirmationCodeSuccess: null,
          emailOrUsername: null,
          confirmationCodeTries: 3,
          changePasswordSuccess: null,
        },
      };
    case CONFIRMATION_CODE_ERROR:
      let tries = Number(state.forgotPassword.confirmationCodeTries);
      return {
        ...state,
        loading: false,
        forgotPassword: {
          ...state.forgotPassword,
          isPasswordReset: true,
          confirmationCode: null,
          sendEmailSuccess: null,
          confirmationCodeSuccess: false,
          confirmationCodeTries: tries - 1,
          changePasswordSuccess: null,
          emailOrUsername: null,
        },
      };
    case CHANGE_PASSWORD:
      localStorage.removeItem("confirmation_code");
      localStorage.removeItem("password_reset");
      localStorage.removeItem("emailOrUsername");
      return {
        ...state,
        loading: false,
        forgotPassword: {
          isPasswordReset: false,
          confirmationCode: null,
          changePasswordSuccess: true,
          sendEmailSuccess: null,
          confirmationCodeSuccess: null,
          emailOrUsername: null,
          confirmationCodeTries: 3,
        },
      };
    case CHANGE_PASSWORD_ERROR:
      localStorage.removeItem("emailOrUsername");
      localStorage.removeItem("password_reset");
      localStorage.removeItem("confirmation_code");
      return {
        ...state,
        loading: false,
        forgotPassword: {
          isPasswordReset: false,
          confirmationCode: null,
          changePasswordSuccess: false,
          sendEmailSuccess: null,
          confirmationCodeSuccess: null,
          emailOrUsername: null,
          confirmationCodeTries: 3,
        },
      };
    case CANCEL_FORGOT_PASSWORD:
      localStorage.removeItem("emailOrUsername");
      localStorage.removeItem("password_reset");
      localStorage.removeItem("confirmation_code");
      return {
        ...state,
        loading: false,
        forgotPassword: {
          isPasswordReset: false,
          confirmationCode: null,
          sendEmailSuccess: null,
          confirmationCodeSuccess: null,
          emailOrUsername: null,
          changePasswordSuccess: null,
          confirmationCodeTries: 3,
        },
      };
    case AUTH_ERROR:
      return {
        ...state,
        loading: false,
        userDataUpdated: false,
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
