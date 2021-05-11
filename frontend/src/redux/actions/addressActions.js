import {
  CREATE_ADDRESS,
  GET_ADDRESSES,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  ADDRESS_ERROR,
  ADDRESS_LOADING,
  SELECT_ADDRESS,
  CREATE_BILLING_ADDRESS,
  SELECT_BILLING_ADDRESS,
  DELETE_BILLING_ADDRESS,
  UPDATE_BILLING_ADDRESS,
} from "./types";
import axios from "axios";

export const createAddress = (data, isBillingAddress) => (dispatch) => {
  dispatch({ type: ADDRESS_LOADING });

  const addressObject = {
    ...data,
    addressType: isBillingAddress ? "billing" : "delivery",
  };
  console.log(isBillingAddress);
  axios
    .post("/api/address", addressObject, tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({
        type: isBillingAddress ? CREATE_BILLING_ADDRESS : CREATE_ADDRESS,
        payload: data,
      });
    })
    .catch((err) => {
      dispatch({
        type: ADDRESS_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const getAddresses = () => (dispatch) => {
  dispatch({ type: ADDRESS_LOADING });

  axios
    .get("/api/address", tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({
        type: GET_ADDRESSES,
        payload: data,
      });
    })
    .catch((err) => {
      dispatch({
        type: ADDRESS_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const updateAddress = (id, data, isBillingAddress) => (dispatch) => {
  dispatch({ type: ADDRESS_LOADING });

  axios
    .put(`/api/address/${id}`, data, tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({
        type: isBillingAddress ? UPDATE_BILLING_ADDRESS : UPDATE_ADDRESS,
        payload: data,
      });
    })
    .catch((err) => {
      dispatch({
        type: ADDRESS_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const deleteAddress = (id, isBillingAddress) => (dispatch) => {
  dispatch({ type: ADDRESS_LOADING });

  axios
    .delete(`/api/address/${id}`, tokenConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({
        type: isBillingAddress ? DELETE_BILLING_ADDRESS : DELETE_ADDRESS,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch({
        type: ADDRESS_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};

export const selectAddress = (address) => {
  return { type: SELECT_ADDRESS, payload: address };
};

export const selectBillingAddress = (address) => {
  return { type: SELECT_BILLING_ADDRESS, payload: address };
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
