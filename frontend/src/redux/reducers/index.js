import { combineReducers } from "redux";
import { Auth } from "./authReducer";
import { Error } from "./errorReducer";
import { Seller } from "./sellerReducer";
import { Product } from "./productReducer";
import { ProductReview } from "./productReviewReducer";
import { Wishlist } from "./wishlistReducer";
import { Cart } from "./CartReducer";
import { Chat } from "./chatReducer";
import { Address } from "./addressReducer";
import { Order } from "./orderReducer";

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
  Cart,
  Chat,
  Address,
  Order,
  lastAction,
});

export default reducers;
