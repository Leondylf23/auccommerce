import {
  GET_BID_DETAIL_DATA,
  GET_PAYMENT_METHODS,
  GET_SHIPPING_PROVIDERS,
  GET_SHIPPING_PROVIDER_DATA,
  GET_USER_ADDRESSES,
  SET_BID_DETAIL_DATA,
  SET_PAYMENT_DATA,
  SET_PAYMENT_METHODS,
  SET_SHIPPING_PROVIDERS,
  SET_SHIPPING_PROVIDER_DATA,
  SET_USER_ADDRESSES,
} from './constants';

export const getBidDetailData = (formData) => ({
  type: GET_BID_DETAIL_DATA,
  formData,
});

export const setBidDetailData = (data) => ({
  type: SET_BID_DETAIL_DATA,
  data,
});

export const setPaymentDetail = (data) => ({
  type: SET_PAYMENT_DATA,
  data,
});

export const getUserAddresses = () => ({
  type: GET_USER_ADDRESSES,
});

export const setUserAddresses = (data) => ({
  type: SET_USER_ADDRESSES,
  data,
});

export const getShippingProviders = () => ({
  type: GET_SHIPPING_PROVIDERS,
});

export const setShippingProviders = (data) => ({
  type: SET_SHIPPING_PROVIDERS,
  data,
});

export const getShippingProviderData = (formData) => ({
  type: GET_SHIPPING_PROVIDER_DATA,
  formData,
});

export const setShippingProviderData = (data) => ({
  type: SET_SHIPPING_PROVIDER_DATA,
  data,
});

export const getPaymentMethods = (formData) => ({
  type: GET_PAYMENT_METHODS,
  formData,
});

export const setPaymentMethods = (data) => ({
  type: SET_PAYMENT_METHODS,
  data,
});
