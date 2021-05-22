import {
  ADD_CART,
  REMOVE_CART_ITEM,
  REMOVE_ALL_CART_ITEM,
  GET_CART,
  INCREASE_CART_ITEM,
  DECREASE_CART_ITEM,
  CART_ERROR,
  SELECT_CART_ITEM,
  DONT_SELECT_CART_ITEM,
  LOADING,
} from "./types";
import axios from "axios";

export const getCart =
  (isAuth, Products = []) =>
  (dispatch) => {
    dispatch({ type: LOADING });
    if (!isAuth) {
      axios
        .post("/api/cart/check_unauthorized", { Products })
        .then((res) => res.data)
        .then((data) => {
          dispatch({ type: GET_CART, payload: data });
        })
        .catch((err) => {
          dispatch({
            type: CART_ERROR,
            payload: {
              message: err.response.data.errorMessage,
              status: err.response.status,
            },
          });
        });
    } else {
      axios
        .get("/api/cart/", tokenConfig())
        .then((res) => res.data)
        .then((data) => {
          dispatch({ type: GET_CART, payload: data });
        })
        .catch((err) => {
          dispatch({
            type: CART_ERROR,
            payload: {
              message: err.response.data.errorMessage,
              status: err.response.status,
            },
          });
        });
    }
  };

export const removeCartItem = (id, clr) => {
  return { type: REMOVE_CART_ITEM, payload: { id, clr } };
};

export const removeAllCart = () => {
  return { type: REMOVE_ALL_CART_ITEM };
};

export const addItem = (product) => {
  return { type: ADD_CART, payload: product };
};

export const increaseCartItem = (id, clr) => {
  return { type: INCREASE_CART_ITEM, payload: { id, clr } };
};

export const decreaseCartItem = (id, clr) => {
  return { type: DECREASE_CART_ITEM, payload: { id, clr } };
};

export const selectCartItem = (id, clr) => {
  return { type: SELECT_CART_ITEM, payload: { id, clr } };
};
export const dontSelectCartItem = (id, clr) => {
  return { type: DONT_SELECT_CART_ITEM, payload: { id, clr } };
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
