import { combineReducers } from "redux";
import { Auth } from "./authReducer";
import { Error } from "./errorReducer";
import { Seller } from "./sellerReducer";
import { Product } from "./productReducer";

const reducers = combineReducers({ Auth, Error, Seller, Product });

export default reducers;
