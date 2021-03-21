import { combineReducers } from "redux";
import { Auth } from "./authReducer";
import { Error } from "./errorReducer";
import { Seller } from "./sellerReducer";
import { Product } from "./productReducer";
import { ProductReview } from "./productReviewReducer";
import { Wishlist } from "./wishlistReducer";

function lastAction(state = null, action) {
  return action.type;
}

const reducers = combineReducers({
  Auth,
  Error,
  Seller,
  Product,
  ProductReview,
  Wishlist,
  lastAction,
});

export default reducers;
