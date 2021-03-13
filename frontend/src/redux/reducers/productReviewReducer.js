import {
  ADD_REVIEW,
  UPDATE_REVIEW,
  GET_REVIEWS,
  DELETE_REVIEW,
  LOADING,
  PRODUCT_REVIEW_ERROR,
} from "../actions/types";

const initialState = {
  productReviews: [],
  loading: false,
  error: {
    message: null,
    status: null,
  },
};

export const ProductReview = (state = initialState, action) => {
  switch (action.type) {
    case ADD_REVIEW:
      return {
        ...state,
        productReviews: [action.payload, ...state.productReviews],
        error: { message: null, status: null },
        loading: false,
      };
    case GET_REVIEWS:
      return {
        ...state,
        loading: false,
        error: { message: null, status: null },
        productReviews: [...action.payload],
      };
    case PRODUCT_REVIEW_ERROR:
      return {
        ...state,
        loading: false,
        error: {
          message: action.payload.message,
          status: action.payload.status,
        },
      };
    case LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
};
