import { combineReducers } from "redux";
import { Auth } from "./authReducer";
import { Error } from "./errorReducer";
import { Seller } from "./sellerReducer";

const reducers = combineReducers({ Auth, Error, Seller });

export default reducers;
