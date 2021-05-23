import {
  SELLER_REGISTER,
  SELLER_LOGIN,
  SELLER_LOADING,
  SELLER_LOGOUT,
  SELLER_ERROR,
  GET_CURRENT_SELLER,
  SELLER_CHANGE_PASSWORD,
  SELLER_RESET_PASSWORD_ERROR,
  SELLER_CHECK_PASSWORD_TOKEN,
  SELLER_SEND_FORGOT_PASSWORD_EMAIL,
  SELLER_RESET_PASSWORD_TOKEN_ERROR,
  SELLER_ROUTE,
  NOT_SELLER_ROUTE,
  UPDATE_SELLER,
  GET_ALL_SELLER_PRODUCTS,
  SELLER_DELETE_PRODUCT,
  SELLER_UPDATE_PRODUCT,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("shop-token"),
  shop: null,
  loading: false,
  isAuthenticated: false,
  error: {
    message: null,
    status: null,
  },
  inSellerRoute: false,
  forgotPassword: {
    isPasswordReset:
      localStorage.getItem("seller_password_reset") === null
        ? false
        : localStorage.getItem("seller_password_reset") === "true" && true,
    email: localStorage.getItem("seller_email"),
    sendEmailSuccess: null,
    checkToken: null,
    resetPasswordError: null,
    successText: null,
  },
  products: [],
};

export const Seller = (state = initialState, action) => {
  switch (action.type) {
    case SELLER_UPDATE_PRODUCT:
      return {
        ...state,
        loading: false,
        error: { message: null, status: null },
        products: [
          ...state.products.map((product) =>
            product._id === action.payload.id
              ? action.payload.updatedProduct
              : product
          ),
        ],
      };
    case SELLER_DELETE_PRODUCT:
      return {
        ...state,
        error: { message: null, status: null },
        loading: false,
        products: state.products.filter((item) => item._id !== action.payload),
      };
    case GET_ALL_SELLER_PRODUCTS:
      return {
        ...state,
        error: { message: null, status: null },
        loading: false,
        products: action.payload.map((product) => {
          return {
            ...product.item,
            ordersCount: product.ordersCount,
            wishlistCount: product.wishlistCount,
          };
        }),
      };
    case GET_CURRENT_SELLER:
      return {
        ...state,
        isAuthenticated: true,
        shop: action.payload.shop,
        error: { message: null, status: null },
      };
    case SELLER_REGISTER:
    case SELLER_LOGIN:
      localStorage.removeItem("seller_password_reset");
      localStorage.removeItem("seller_email");
      localStorage.setItem("shop-token", action.payload);
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        token: action.payload,
        error: { message: null, status: null },
      };
    case SELLER_LOADING:
      return { ...state, loading: true };
    case SELLER_LOGOUT:
      localStorage.removeItem("shop-token");
      return {
        ...state,
        token: null,
        shop: null,
        loading: false,
        isAuthenticated: false,
        error: { message: null, status: null },
      };
    case UPDATE_SELLER:
      return {
        ...state,
        loading: false,
        shop: action.payload,
        error: { message: null, status: null },
      };
    case SELLER_ERROR:
      return {
        ...state,
        loading: false,
        error: { message: action.payload.msg, status: action.payload.status },
      };
    case SELLER_SEND_FORGOT_PASSWORD_EMAIL:
      return {
        ...state,
        loading: false,
        error: { message: null, status: null },
        forgotPassword: {
          ...state.forgotPassword,
          sendEmailSuccess: true,
          isPasswordReset: true,
        },
      };
    case SELLER_CHECK_PASSWORD_TOKEN:
      return {
        ...state,
        loading: false,
        error: { message: null, status: null, checkToken: true },
      };
    case SELLER_CHANGE_PASSWORD:
      return {
        ...state,
        loading: false,
        error: { message: null, status: null },
        forgotPassword: {
          ...state.forgotPassword,
          resetPasswordError: false,
          successText: "Your password has changed. Now you can login.",
        },
      };
    case SELLER_RESET_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        error: { message: null, status: null },
        forgotPassword: {
          ...state.forgotPassword,
          email: null,
          isPasswordReset: false,
          sendEmailSuccess: false,
          checkToken: false,
          resetPasswordError: true,
        },
      };
    case SELLER_RESET_PASSWORD_TOKEN_ERROR:
      return {
        ...state,
        loading: false,
        error: { message: null, status: null },
        forgotPassword: {
          ...state.forgotPassword,
          email: null,
          isPasswordReset: false,
          sendEmailSuccess: false,
          checkToken: false,
          resetPasswordError: null,
        },
      };
    case SELLER_ROUTE:
      return {
        ...state,
        inSellerRoute: true,
      };
    case NOT_SELLER_ROUTE:
      return {
        ...state,
        inSellerRoute: false,
      };
    default:
      return state;
  }
};
