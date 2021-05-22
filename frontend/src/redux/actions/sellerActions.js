import {
  SELLER_REGISTER,
  SELLER_LOGIN,
  SELLER_LOADING,
  SELLER_LOGOUT,
  SELLER_ERROR,
  GET_CURRENT_SELLER,
  SELLER_RESET_PASSWORD_ERROR,
  SELLER_CHANGE_PASSWORD,
  SELLER_CHECK_PASSWORD_TOKEN,
  SELLER_SEND_FORGOT_PASSWORD_EMAIL,
  SELLER_RESET_PASSWORD_TOKEN_ERROR,
  NOT_SELLER_ROUTE,
  SELLER_ROUTE,
  LOADING,
  UPDATE_SELLER,
  GET_ALL_SELLER_PRODUCTS,
  SELLER_DELETE_PRODUCT,
} from "./types";
import { logoutUser } from "./authActions";
import axios from "axios";

export const getAllSellerProducts = () => (dispatch) => {
  dispatch({ type: SELLER_LOADING });

  axios
    .get("/api/product/products/all", tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: GET_ALL_SELLER_PRODUCTS, payload: data });
    })
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

export const deleteProduct = (id) => (dispatch) => {
  dispatch({ type: SELLER_LOADING });

  axios
    .delete(`/api/product/${id}`, tokenConfig())
    .then(() => {
      dispatch({ type: SELLER_DELETE_PRODUCT, payload: id });
    })
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

export const getCurrentSeller = () => (dispatch) => {
  axios
    .get("/api/shop/current", tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: GET_CURRENT_SELLER, payload: { shop: data } });
    })
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

export const sellerRegister = (data) => (dispatch) => {
  dispatch({ type: SELLER_LOADING });

  axios
    .post("/api/shop/create", data)
    .then((res) => res.data)
    .then((data) => {
      dispatch(logoutUser());
      dispatch({ type: SELLER_REGISTER, payload: data });
    })
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

export const sellerUpdateProfile = (data, sellerId) => (dispatch) => {
  dispatch({ type: SELLER_LOADING });

  axios
    .put(`/api/shop/update/${sellerId}`, data, tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: UPDATE_SELLER, payload: data });
    })
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

  axios
    .post("/api/shop/login", { email, password })
    .then((res) => res.data)
    .then((data) => {
      dispatch(logoutUser());
      dispatch({ type: SELLER_LOGIN, payload: data });
    })
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

export const sendForgotPasswordEmail = (email, origin) => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .post("/api/shop/sendEmail", { email, origin })
    .then(() => {
      dispatch({ type: SELLER_SEND_FORGOT_PASSWORD_EMAIL });
    })
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

export const confirmPasswordResetToken = (email, shopToken) => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .post("/api/shop/checkToken", { email, shopToken })
    .then(() => {
      dispatch({ type: SELLER_CHECK_PASSWORD_TOKEN });
    })
    .catch((err) => {
      dispatch({ type: SELLER_RESET_PASSWORD_TOKEN_ERROR });
    });
};

export const resetPassword =
  (newPassword, confirmPassword, email, token) => (dispatch) => {
    dispatch({ type: LOADING });

    axios
      .post(
        "/api/shop/changePassword",
        { newPassword, confirmPassword, email },
        { headers: { "password-token": token } }
      )
      .then(() => {
        dispatch({ type: SELLER_CHANGE_PASSWORD });
      })
      .catch((err) => {
        dispatch({ type: SELLER_RESET_PASSWORD_ERROR });
      });
  };

export const sellerRoute = () => {
  return { type: SELLER_ROUTE };
};

export const notSellerRoute = () => {
  return { type: NOT_SELLER_ROUTE };
};

export const sellerLogout = () => {
  return { type: SELLER_LOGOUT };
};

export const loading = () => {
  return { type: SELLER_LOADING };
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
