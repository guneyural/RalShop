import {
  ADD_REVIEW,
  UPDATE_REVIEW,
  GET_REVIEWS,
  DELETE_REVIEW,
  LOADING,
  PRODUCT_REVIEW_ERROR,
} from "./types";
import axios from "axios";

export const getReviews = (productId) => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .get(`/api/review/product/${productId}`)
    .then((res) => res.data)
    .then((data) => {
      dispatch({
        type: GET_REVIEWS,
        payload: data,
      });
    })
    .catch((err) => {
      dispatch({
        type: PRODUCT_REVIEW_ERROR,
        payload: {
          message: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const addReview = (rating, text, productId) => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .post(
      `/api/review/product/${productId}/review`,
      { rating, text },
      tokenConfig()
    )
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: ADD_REVIEW, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: PRODUCT_REVIEW_ERROR,
        payload: {
          message: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const updateReview = (id, rating, text) => (dispatch) => {};
export const deleteReview = (id) => (dispatch) => {};

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
