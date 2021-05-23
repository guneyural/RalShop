import {
  ADD_CART,
  REMOVE_CART_ITEM,
  REMOVE_ALL_CART_ITEM,
  GET_CART,
  INCREASE_CART_ITEM,
  DECREASE_CART_ITEM,
  SELECT_CART_ITEM,
  DONT_SELECT_CART_ITEM,
  CART_ERROR,
  LOADING,
} from "../actions/types";

const initialState = {
  products:
    localStorage.getItem("Cart") !== null
      ? JSON.parse(localStorage.getItem("Cart"))
      : [],
  loading: false,
  error: { message: null, status: null },
};

export const Cart = (state = initialState, action) => {
  let tempList = [],
    isDuplicate = false,
    temp = "";

  switch (action.type) {
    case ADD_CART:
      temp = `${action.payload.product}${action.payload.color}`;

      if (state.products.length < 1) {
        isDuplicate = false;
      } else {
        state.products.forEach((item) => {
          let itemTemp = `${item.product}${item.color}`;
          if (itemTemp === temp) {
            isDuplicate = true;
            item.qty = action.payload.qty;
          }
        });
      }

      if (!isDuplicate) {
        tempList = [action.payload, ...state.products];
      } else {
        tempList = [...state.products];
      }

      return { ...state, loading: false, products: tempList };
    case REMOVE_CART_ITEM:
      temp = `${action.payload.id}${action.payload.clr}`;
      state.products.forEach((item) => {
        let itemTemp = `${item.product}${item.color}`;
        if (itemTemp !== temp) {
          tempList.push(item);
        }
      });

      return {
        ...state,
        loading: false,
        products: [...tempList],
      };
    case REMOVE_ALL_CART_ITEM:
      return {
        ...state,
        loading: false,
        products: [],
      };
    case GET_CART:
      action.payload.items.forEach((item) => {
        tempList.push({
          product: item.product._id,
          seller: item.seller,
          price: item.product.price,
          stock: item.product.stock,
          title: item.product.title,
          image: item.product.images[0].url,
          stripeProductId: item.product.stripeProductId,
          stripePriceId: item.product.stripePriceId,
          color: item.color,
          qty: item.quantity,
          selected: item.selected,
        });
      });

      return {
        ...state,
        loading: false,
        products: [...tempList],
      };
    case INCREASE_CART_ITEM:
      temp = `${action.payload.id}${action.payload.clr}`;
      state.products.forEach((item) => {
        let itemTemp = `${item.product}${item.color}`;
        if (itemTemp === temp) {
          if (item.qty < item.stock) {
            item.qty = item.qty + 1;
          } else {
            item.qty = item.stock;
          }
        }
        tempList.push(item);
      });

      return { ...state, loading: false, products: [...tempList] };
    case DECREASE_CART_ITEM:
      temp = `${action.payload.id}${action.payload.clr}`;
      state.products.forEach((item) => {
        let itemTemp = `${item.product}${item.color}`;
        if (itemTemp === temp) {
          if (item.qty > 1) {
            item.qty = item.qty - 1;
          } else {
            item.qty = 1;
          }
        }
        tempList.push(item);
      });

      return { ...state, loading: false, products: [...tempList] };
    case SELECT_CART_ITEM:
      temp = `${action.payload.id}${action.payload.clr}`;
      state.products.forEach((item) => {
        let itemTemp = `${item.product}${item.color}`;
        if (itemTemp === temp) {
          item.selected = true;
        }
        tempList.push(item);
      });
      return { ...state, loading: false, products: [...tempList] };
    case DONT_SELECT_CART_ITEM:
      temp = `${action.payload.id}${action.payload.clr}`;
      state.products.forEach((item) => {
        let itemTemp = `${item.product}${item.color}`;
        if (itemTemp === temp) {
          item.selected = false;
        }
        tempList.push(item);
      });
      return { ...state, loading: false, products: [...tempList] };
    case CART_ERROR:
      return {
        ...state,
        loading: false,
        error: {
          message: action.payload.message,
          status: action.payload.status,
        },
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};
