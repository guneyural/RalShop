import { combineReducers } from "redux";
import { Auth } from "./authReducer";
import { Error } from "./errorReducer";
import { Seller } from "./sellerReducer";
import { Product } from "./productReducer";
import { ProductReview } from "./productReviewReducer";

const reducers = combineReducers({
  Auth,
  Error,
  Seller,
  Product,
  ProductReview,
});

export default reducers;
