import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import axios from "axios";
import {
  GET_WISHLIST,
  ADD_WISHLIST,
  REMOVE_WISHLIST,
  ADD_CART,
  REMOVE_ALL_CART_ITEM,
  REMOVE_CART_ITEM,
  GET_CART,
  INCREASE_CART_ITEM,
  DECREASE_CART_ITEM,
  SELECT_CART_ITEM,
  DONT_SELECT_CART_ITEM,
} from "./actions/types";

const initialState = {};
const middleware = [thunk];

const Store = createStore(
  reducers,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

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

Store.subscribe(() => {
  const {
    Wishlist: { products },
    lastAction,
    Auth,
    Cart,
  } = Store.getState();
  localStorage.setItem("Cart", JSON.stringify(Cart.products));
  if (Auth.isAuthenticated) {
    localStorage.setItem("Wishlist", JSON.stringify(products));
    if (
      lastAction === ADD_WISHLIST ||
      lastAction === REMOVE_WISHLIST ||
      lastAction === GET_WISHLIST
    ) {
      axios.post("/api/wishlist/update", { products }, tokenConfig());
    }
    if (
      lastAction === ADD_CART ||
      lastAction === REMOVE_ALL_CART_ITEM ||
      lastAction === REMOVE_CART_ITEM ||
      lastAction === GET_CART ||
      lastAction === INCREASE_CART_ITEM ||
      lastAction === DECREASE_CART_ITEM ||
      lastAction === SELECT_CART_ITEM ||
      lastAction === DONT_SELECT_CART_ITEM
    ) {
      axios.post(
        "/api/cart/update",
        { products: Cart.products },
        tokenConfig()
      );
    }
  }
});

export default Store;
