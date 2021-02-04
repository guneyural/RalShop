import {
  GET_USER,
  USER_LOGIN,
  REGISTER_USER,
  LOGOUT_USER,
  LOADING,
  AUTH_ERROR,
  GET_USER_BY_USERNAME,
} from "./types";
import axios from "axios";

export const getUser = () => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .get("/api/user/current", tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: GET_USER, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const userLogin = (loginData) => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .post("/api/user/login", loginData)
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: USER_LOGIN, payload: data.token });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const registerUser = (registerData) => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .post("/api/user/register", registerData)
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: REGISTER_USER, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const logoutUser = () => (dispatch) => {
  dispatch({ type: LOGOUT_USER });
};

export const getProfile = (username) => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .get(`/api/user/p/${username}`)
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: GET_USER_BY_USERNAME, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const loading = () => (dispatch) => {
  dispatch({ type: LOADING });
};

const tokenConfig = () => {
  const token = localStorage.getItem("user-token");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) config.headers["user-token"] = token;
  return config;
};
