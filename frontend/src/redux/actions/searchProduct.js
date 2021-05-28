import { SEARCH_PRODUCT, SEARCH_PRODUCT_LOADING } from "./types";
import axios from "axios";

const prefix = "/api/product/search/";

export const searchProduct = (query) => (dispatch) => {
  dispatch({ type: SEARCH_PRODUCT_LOADING });

  axios
    .get(prefix + query)
    .then((res) => res.data)
    .then((data) => {
      let searchedBrands = new Set();
      let brandsOfResults = new Set();
      let sellerSet = new Set();
      let categoriesSet = new Set();
      let products = [];

      products = data.products;

      data.brands.forEach((item) => {
        searchedBrands.add(item.brand);
      });

      data.products.forEach((item) => {
        categoriesSet.add(item.category);
        categoriesSet.add(item.subCategory);
        brandsOfResults.add(item.brand);
        sellerSet.add(item.shop.companyName);
      });

      if (data.products.length < 1) {
        products = data.brands;
      }

      dispatch({
        type: SEARCH_PRODUCT,
        payload: {
          Categories: [...categoriesSet],
          SearchedBrands: [...searchedBrands],
          BrandsOfResults: [...brandsOfResults],
          Sellers: [...sellerSet],
          products,
          query,
        },
      });
    });
};
