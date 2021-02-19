import {
  PRODUCT_ERROR,
  PRODUCT_LOADING,
  CREATE_PRODUCT,
} from "../actions/types";

const initialState = {
  products: [],
  product: {},
  createdProduct: {},
  error: { msg: null, status: null },
  loading: false,
};

export const Product = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_ERROR:
      return {
        ...state,
        loading: false,
        error: {
          msg: action.payload.msg,
          status: action.payload.status,
        },
      };
    case PRODUCT_LOADING:
      return {
        ...state,
        error: { msg: null, status: null },
        loading: true,
      };
    case CREATE_PRODUCT:
      return {
        ...state,
        loading: false,
        error: { msg: null, status: null },
        products: [action.payload, ...state.products],
        createdProduct: action.payload,
      };
    default:
      return state;
  }
};
