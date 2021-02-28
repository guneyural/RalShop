import {
  CREATE_PRODUCT,
  PRODUCT_ERROR,
  PRODUCT_LOADING,
  GET_PRODUCT_BY_ID,
} from "./types";
import axios from "axios";

export const createProduct = (data) => (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });

  axios
    .post("/api/product/new", data, {
      headers: {
        "shop-token": localStorage.getItem("shop-token"),
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: CREATE_PRODUCT, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: PRODUCT_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const productLoading = () => {
  return { type: PRODUCT_LOADING };
};

export const getProductById = (id) => (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });

  axios
    .get(`/api/product/${id}`)
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: GET_PRODUCT_BY_ID, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: PRODUCT_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
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
