import { GET_PRODUCT_DATA } from '@pages/ProductDetail/constants';
import {
  GET_COUPONS_DATA,
  SEND_ORDERING_DATA,
  SET_COUPONS_DATA,
  SET_PRODUCT_DETAIL,
  SET_USER_INPUTS,
} from './constants';

export const setUserInputs = (data) => ({
  type: SET_USER_INPUTS,
  data,
});

export const getCouponsData = (formData) => ({
  type: GET_COUPONS_DATA,
  formData,
});

export const setCouponsData = (data) => ({
  type: SET_COUPONS_DATA,
  data,
});

export const sendOrderingData = (formData, cb) => ({
  type: SEND_ORDERING_DATA,
  formData,
  cb,
});

export const getProductData = (productId) => ({
  type: GET_PRODUCT_DATA,
  productId,
});

export const setProductData = (data) => ({
  type: SET_PRODUCT_DETAIL,
  data,
});
