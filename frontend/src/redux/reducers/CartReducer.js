import {
  ADD_CART,
  REMOVE_CART_ITEM,
  REMOVE_ALL_CART_ITEM,
  GET_CART,
  INCREASE_CART_ITEM,
  DECREASE_CART_ITEM,
  CART_ERROR,
  LOADING,
} from "../actions/types";

const initialState = {
  products:
    localStorage.getItem("Cart") !== null
      ? JSON.parse(localStorage.getItem("Cart"))
      : [],
  cartTotal: 0,
  loading: false,
  error: { message: null, status: null },
};

export const Cart = (state = initialState, action) => {
  let tempList = 0,
    cartTotal = 0,
    isDuplicate = false;

  switch (action.type) {
    case ADD_CART:
    case REMOVE_CART_ITEM:
    case REMOVE_ALL_CART_ITEM:
    case GET_CART:
    case INCREASE_CART_ITEM:
    case DECREASE_CART_ITEM:
    case CART_ERROR:
    case LOADING:
    default:
      return state;
  }
};
