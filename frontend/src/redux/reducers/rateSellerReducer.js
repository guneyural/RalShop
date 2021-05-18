import {
  GET_RATED_SELLERS_FOR_SELLER,
  GET_RATED_SELLERS_FOR_USER,
  DELETE_SELLER_RATING,
  RATE_SELLER,
  RATE_SELLER_LOADING,
  RATE_SELLER_ERROR,
} from "../actions/types";

const initialState = {
  ratedSellers: [],
  loading: false,
  error: null,
};

export function RateSeller(state = initialState, action) {
  switch (action.type) {
    case GET_RATED_SELLERS_FOR_SELLER:
      return {
        ...state,
        ratedSellers: [...action.payload],
        error: null,
        loading: false,
      };
    case GET_RATED_SELLERS_FOR_USER:
      return {
        ...state,
        error: null,
        ratedSellers: [...action.payload],
        loading: false,
      };
    case DELETE_SELLER_RATING:
      return {
        ...state,
        ratedSellers: state.ratedSellers.filter(
          (item) => item._id !== action.payload
        ),
        error: null,
        loading: false,
      };
    case RATE_SELLER:
      return {
        ...state,
        ratedSellers:
          state.ratedSellers.length > 0
            ? state.ratedSellers.map((item) =>
                item._id === action.payload._id ? action.payload : item
              )
            : [action.payload],
        error: null,
        loading: false,
      };
    case RATE_SELLER_LOADING:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case RATE_SELLER_ERROR:
      return {
        ...state,
        error: { msg: action.payload.msg, status: action.payload.status },
        loading: false,
      };
    default:
      return state;
  }
}
