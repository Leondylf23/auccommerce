import {
  APPEND_PAYMENT_FORM,
  COMPLETE_PAYMENT_FORM,
  GET_BID_DETAIL_DATA,
  GET_CHECK_FROM_PAYMENT,
  GET_FORM_DATA,
  GET_FORM_SUMMARY,
  GET_PAYMENT_METHODS,
  GET_SHIPPING_PROVIDERS,
  GET_SHIPPING_PROVIDER_DATA,
  GET_USER_ADDRESSES,
  SET_BID_DETAIL_DATA,
  SET_IS_ANY_CHANGES,
  SET_PAYMENT_DATA,
  SET_PAYMENT_METHODS,
  SET_SHIPPING_PROVIDERS,
  SET_SHIPPING_PROVIDER_DATA,
  SET_STEP_DATA,
  SET_TOKEN_DATA,
  SET_USER_ADDRESSES,
} from './constants';

export const getBidDetailData = (formData, cb) => ({
  type: GET_BID_DETAIL_DATA,
  formData,
  cb,
});

export const setBidDetailData = (data) => ({
  type: SET_BID_DETAIL_DATA,
  data,
});

export const setPaymentData = (data) => ({
  type: SET_PAYMENT_DATA,
  data,
});

export const getUserAddresses = (cb) => ({
  type: GET_USER_ADDRESSES,
  cb,
});

export const setIsAnyChanges = (data) => ({
  type: SET_IS_ANY_CHANGES,
  data,
});

export const setUserAddresses = (data) => ({
  type: SET_USER_ADDRESSES,
  data,
});

export const getShippingProviders = (formData, cb) => ({
  type: GET_SHIPPING_PROVIDERS,
  formData,
  cb,
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

export const checkPaymentForm = (formData, cb) => ({
  type: GET_CHECK_FROM_PAYMENT,
  formData,
  cb,
});

export const getFormData = (formData, cb) => ({
  type: GET_FORM_DATA,
  formData,
  cb,
});

export const getFormSummary = (formData, cb) => ({
  type: GET_FORM_SUMMARY,
  formData,
  cb,
});

export const setStepData = (data) => ({
  type: SET_STEP_DATA,
  data,
});

export const setTokenData = (data) => ({
  type: SET_TOKEN_DATA,
  data,
});

export const appendFormData = (formData, cb) => ({
  type: APPEND_PAYMENT_FORM,
  formData,
  cb,
});

export const completeFormData = (formData, cb) => ({
  type: COMPLETE_PAYMENT_FORM,
  formData,
  cb,
});
