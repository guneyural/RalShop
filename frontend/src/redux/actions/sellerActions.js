import {
  SELLER_REGISTER,
  SELLER_LOGIN,
  SELLER_LOADING,
  SELLER_LOGOUT,
  SELLER_ERROR,
} from "./types";
import axios from "axios";

export const sellerRegister = (data) => (dispatch) => {
  dispatch({ type: SELLER_LOADING });

  axios
    .post("/api/shop/create", data)
    .then((res) => res.data)
    .then((data) => dispatch({ type: SELLER_REGISTER, payload: data }))
    .catch((err) => {
      dispatch({
        type: SELLER_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const sellerLogin = (email, password) => (dispatch) => {
  dispatch({ type: SELLER_LOADING });
};

export const sellerLogout = (dispatch) => {
  dispatch({ type: SELLER_LOGOUT });
};

export const loading = (dispatch) => {
  dispatch({ type: SELLER_LOADING });
};

const tokenConfig = () => {
  const token = localStorage.getItem("shop-token");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) config.headers["shop-token"] = token;
  return config;
};
