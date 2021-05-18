import {
  GET_RATED_SELLERS_FOR_SELLER,
  GET_RATED_SELLERS_FOR_USER,
  DELETE_SELLER_RATING,
  RATE_SELLER,
  RATE_SELLER_LOADING,
  RATE_SELLER_ERROR,
} from "./types";
import axios from "axios";

const prefix = "/api/seller_rating";

export const getRatedSellersForSeller = () => (dispatch) => {
  dispatch({ type: RATE_SELLER_LOADING });

  axios
    .get(prefix + "/seller_ratings", sellerTokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: GET_RATED_SELLERS_FOR_SELLER, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: RATE_SELLER_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const getRatedSellersForUser = () => (dispatch) => {
  dispatch({ type: RATE_SELLER_LOADING });
  axios
    .get(prefix + "/user_ratings", tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: GET_RATED_SELLERS_FOR_USER, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: RATE_SELLER_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const deleteSellerRating = (id) => (dispatch) => {
  dispatch({ type: RATE_SELLER_LOADING });

  axios
    .delete(`${prefix}/${id}`, tokenConfig())
    .then(() => dispatch({ type: DELETE_SELLER_RATING, payload: id }))
    .catch((err) => {
      dispatch({
        type: RATE_SELLER_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const rateSeller = (data) => (dispatch) => {
  dispatch({ type: RATE_SELLER_LOADING });

  axios
    .post(prefix, data, tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: RATE_SELLER, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: RATE_SELLER_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

const sellerTokenConfig = () => {
  const token = localStorage.getItem("shop-token");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) config.headers["shop-token"] = token;
  return config;
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
