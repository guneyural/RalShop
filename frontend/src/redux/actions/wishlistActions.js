import {
  ADD_WISHLIST,
  REMOVE_WISHLIST,
  REMOVE_ALL_WISHLIST,
  GET_WISHLIST,
} from "./types";
import axios from "axios";

export const getWishlist = () => (dispatch) => {};
export const addToWishlist = (id) => (dispatch) => {};
export const removeAllWishlist = () => (dispatch) => {};
export const removeWishlist = (id) => (dispatch) => {};

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
