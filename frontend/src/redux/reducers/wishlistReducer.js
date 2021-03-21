import {
  ADD_WISHLIST,
  GET_WISHLIST,
  REMOVE_ALL_WISHLIST,
  REMOVE_WISHLIST,
  LOADING,
  WISHLIST_ERROR,
} from "../actions/types";

const initialState = {
  products:
    localStorage.getItem("Wishlist") !== null
      ? JSON.parse(localStorage.getItem("Wishlist"))
      : [],
  error: { message: null, status: null },
  loading: true,
};

export const Wishlist = (state = initialState, action) => {
  let tempList = [];
  let isDuplicate = false;

  switch (action.type) {
    case GET_WISHLIST:
      return { ...state, loading: false, products: action.payload };
    case ADD_WISHLIST:
      state.products.map((item) => {
        if (item._id === action.payload._id) {
          isDuplicate = true;
        }
      });

      if (!isDuplicate) {
        tempList = [action.payload, ...state.products];
      } else {
        tempList = [...state.products];
      }

      return {
        ...state,
        products: tempList,
        error: { message: null, status: null },
        loading: false,
      };
    case REMOVE_WISHLIST:
      return {
        ...state,
        products: [
          ...state.products.filter((item) => item._id != action.payload),
        ],
        error: { message: null, status: null },
        loading: false,
      };
    case REMOVE_ALL_WISHLIST:
      return {
        ...state,
        products: [],
        error: { message: null, status: null },
        loading: false,
      };
    case WISHLIST_ERROR:
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};
