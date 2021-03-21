import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import axios from "axios";
import { GET_WISHLIST, ADD_WISHLIST, REMOVE_WISHLIST } from "./actions/types";

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
  } = Store.getState();
  if (Auth.isAuthenticated) {
    localStorage.setItem("Wishlist", JSON.stringify(products));
    if (
      lastAction === ADD_WISHLIST ||
      lastAction === REMOVE_WISHLIST ||
      lastAction === GET_WISHLIST
    ) {
      axios.post("/api/wishlist/update", { products }, tokenConfig());
    }
  }
});

export default Store;
