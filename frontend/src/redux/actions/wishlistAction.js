import {
  ADD_WISHLIST,
  GET_WISHLIST,
  REMOVE_ALL_WISHLIST,
  REMOVE_WISHLIST,
  LOADING,
  WISHLIST_ERROR,
} from "./types";
import axios from "axios";

export const getWishlist = () => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .get("/api/wishlist", tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: GET_WISHLIST, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: WISHLIST_ERROR,
        payload: {
          message: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const addItem = (product) => {
  return { type: ADD_WISHLIST, payload: product };
};

export const removeItem = (id) => {
  return { type: REMOVE_WISHLIST, payload: id };
};

export const removeAllItems = () => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .delete("api/wishlist/remove_all", tokenConfig())
    .then(() => dispatch({ type: REMOVE_ALL_WISHLIST }))
    .catch((err) => {
      dispatch({
        type: WISHLIST_ERROR,
        payload: {
          message: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
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
