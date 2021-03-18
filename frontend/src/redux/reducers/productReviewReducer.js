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
  average: 0,
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
        productReviews: [action.payload.review, ...state.productReviews],
        error: { message: null, status: null },
        loading: false,
        average: action.payload.average,
      };
    case GET_REVIEWS:
      return {
        ...state,
        loading: false,
        error: { message: null, status: null },
        productReviews: [...action.payload.reviews],
        average: action.payload.average,
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
    case DELETE_REVIEW:
      return {
        ...state,
        loading: false,
        error: { message: null, status: null },
        productReviews: [
          ...state.productReviews.filter(
            (item) => item._id !== action.payload.id
          ),
        ],
        average: action.payload.average,
      };
    case UPDATE_REVIEW:
      return {
        ...state,
        loading: false,
        error: { message: null, status: null },
        productReviews: [
          ...state.productReviews.map((item) =>
            item._id === action.payload.review._id
              ? action.payload.review
              : item
          ),
        ],
        average: action.payload.average,
      };
    case LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
};
