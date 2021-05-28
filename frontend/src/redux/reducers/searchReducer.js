import {
  SEARCH_PRODUCT,
  SEARCH_PRODUCT_LOADING,
  GET_PRODUCTS_BY_CATEGORY,
} from "../actions/types";

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
    case GET_PRODUCTS_BY_CATEGORY:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        query: "",
        sellers: action.payload.Sellers,
        searchedBrands: [],
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
