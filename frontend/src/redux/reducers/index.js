import { combineReducers } from "redux";
import { Auth } from "./authReducer";
import { Error } from "./errorReducer";

const reducers = combineReducers({ Auth, Error });

export default reducers;
