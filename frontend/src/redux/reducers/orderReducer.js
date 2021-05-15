import {
  CREATE_ORDER,
  GET_ORDERS,
  ORDER_ERROR,
  ORDER_LOADING,
  ORDER_CANCEL_REQUEST,
} from "../actions/types";
import _ from "lodash";

const initialState = {
  orders: {},
  error: null,
  loading: false,
};

export function Order(state = initialState, action) {
  let grouppedOrders = {};
  switch (action.type) {
    case CREATE_ORDER:
      grouppedOrders = _.groupBy(
        [action.payload, Object.keys(state.orders)],
        (order) => order.groupId
      );

      return {
        ...state,
        orders: grouppedOrders,
        loading: false,
        error: null,
      };
    case GET_ORDERS:
      grouppedOrders = _.groupBy(action.payload, (order) => order.groupId);
      return {
        ...state,
        orders: grouppedOrders,
        loading: false,
        error: null,
      };
    case ORDER_ERROR:
      return {
        ...state,
        loading: false,
        error: { msg: action.payload.msg, status: action.payload.status },
      };
    case ORDER_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ORDER_CANCEL_REQUEST:
      return {
        ...state,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}
