import {
  GET_BEST_SELLER,
  GET_MY_PRODUCTS_DATA,
  GET_PRODUCTS_DATA,
  SET_BEST_SELLER,
  SET_PRODUCTS_DATA,
} from './constants';

export const getProductsData = (formData) => ({
  type: GET_PRODUCTS_DATA,
  formData,
});

export const getMyProductsData = (formData) => ({
  type: GET_MY_PRODUCTS_DATA,
  formData,
});

export const setProductsData = (data) => ({
  type: SET_PRODUCTS_DATA,
  data,
});

export const getBestSeller = () => ({
  type: GET_BEST_SELLER,
});

export const setBestSeller = (best) => ({
  type: SET_BEST_SELLER,
  best,
});
