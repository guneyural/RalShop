import { SEARCH_PRODUCT, SEARCH_PRODUCT_LOADING } from "../actions/types";

const initialState = {
  products: [],
  searchedBrands: [],
  brandsOfResults: [],
  sellers: [],
  categories: [],
  query: "",
  loading: false,
};

export const Search = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_PRODUCT:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        query: action.payload.query,
        sellers: action.payload.Sellers,
        searchedBrands: action.payload.SearchedBrands,
        categories: action.payload.Categories,
        brandsOfResults: action.payload.BrandsOfResults,
      };
    case SEARCH_PRODUCT_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};
