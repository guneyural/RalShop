import {
  SEARCH_PRODUCT,
  SEARCH_PRODUCT_LOADING,
  GET_PRODUCTS_BY_CATEGORY,
  GET_PRODUCTS_BY_SUBCATEGORY,
} from "./types";
import axios from "axios";
import { categories, subCategories } from "../../data/category";

const prefix = "https://ural-shop.herokuapp.com/api/product/search/";

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

export const getProductsByCategory = (category) => (dispatch) => {
  dispatch({ type: SEARCH_PRODUCT_LOADING });

  axios
    .get("https://ural-shop.herokuapp.com/api/product/category/" + category)
    .then((res) => res.data)
    .then((data) => {
      let brandsOfResults = new Set();
      let sellerSet = new Set();
      let categoriesSet = new Set();
      let products = data;

      data.forEach((item) => {
        categoriesSet.add(item.category);
        categoriesSet.add(item.subCategory);
        brandsOfResults.add(item.brand);
        sellerSet.add(item.shop.companyName);
      });

      dispatch({
        type: GET_PRODUCTS_BY_CATEGORY,
        payload: {
          Categories: subCategories[categories.indexOf(category)],
          BrandsOfResults: [...brandsOfResults],
          Sellers: [...sellerSet],
          products,
        },
      });
    });
};

export const getProductsBySubCategory =
  (category, subCategory) => (dispatch) => {
    dispatch({ type: SEARCH_PRODUCT_LOADING });
  };
