import {
  CREATE_ADDRESS,
  GET_ADDRESSES,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  ADDRESS_ERROR,
  LOADING,
} from "./types";
import axios from "axios";

export const createAddress = (data) => (dispatch) => {
  dispatch({ type: LOADING });
};

export const getAddresses = () => (dispatch) => {
  dispatch({ type: LOADING });
};

export const updateAddress = (id) => (dispatch) => {
  dispatch({ type: LOADING });
};

export const deleteAddress = (id) => (dispatch) => {
  dispatch({ type: LOADING });
};

export const loading = () => {
  return { type: LOADING };
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
