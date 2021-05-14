import {
  CREATE_ADDRESS,
  GET_ADDRESSES,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  ADDRESS_ERROR,
  ADDRESS_LOADING,
  SELECT_ADDRESS,
  CREATE_BILLING_ADDRESS,
  SELECT_BILLING_ADDRESS,
  DELETE_BILLING_ADDRESS,
  UPDATE_BILLING_ADDRESS,
} from "../actions/types";

const initialState = {
  deliveryAddresses: [],
  billingAddresses: [],
  selectedDeliveryAddress: {},
  selectedBillingAddress: {},
  loading: false,
  error: null,
};

export const Address = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_BILLING_ADDRESS:
      return {
        ...state,
        billingAddresses: [action.payload, ...state.billingAddresses],
        loading: false,
        error: null,
      };
    case CREATE_ADDRESS:
      return {
        ...state,
        deliveryAddresses: [action.payload, ...state.deliveryAddresses],
        loading: false,
        error: null,
      };
    case GET_ADDRESSES:
      return {
        ...state,
        deliveryAddresses: action.payload
          .filter((item) => item.addressType === "delivery")
          .reverse(),
        billingAddresses: action.payload
          .filter((item) => item.addressType === "billing")
          .reverse(),
        loading: false,
        error: null,
      };
    case UPDATE_ADDRESS:
      return {
        ...state,
        deliveryAddresses: [
          ...state.deliveryAddresses.map((address) =>
            address._id === action.payload._id ? action.payload : address
          ),
        ],
        loading: false,
        error: null,
      };
    case UPDATE_BILLING_ADDRESS:
      return {
        ...state,
        billingAddresses: [
          ...state.billingAddresses.map((address) =>
            address._id === action.payload._id ? action.payload : address
          ),
        ],
        loading: false,
        error: null,
      };
    case DELETE_ADDRESS:
      return {
        ...state,
        deliveryAddresses: state.deliveryAddresses.filter(
          (address) => address._id !== action.payload
        ),
        loading: false,
        error: null,
      };
    case DELETE_BILLING_ADDRESS:
      return {
        ...state,
        selectedBillingAddress:
          state.selectedBillingAddress._id === action.payload
            ? null
            : state.selectedBillingAddress,
        billingAddresses: state.billingAddresses.filter(
          (address) => address._id !== action.payload
        ),
        loading: false,
        error: null,
      };

    case SELECT_BILLING_ADDRESS:
      return {
        ...state,
        error: null,
        loading: false,
        selectedBillingAddress: action.payload,
      };
    case SELECT_ADDRESS:
      return {
        ...state,
        error: null,
        loading: false,
        selectedDeliveryAddress: action.payload,
      };
    case ADDRESS_LOADING:
      return { ...state, loading: true };
    case ADDRESS_ERROR:
      return {
        ...state,
        loading: false,
        error: { msg: action.payload.msg, status: action.payload.status },
      };
    default:
      return state;
  }
};
